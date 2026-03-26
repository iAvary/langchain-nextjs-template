import { NextRequest, NextResponse } from "next/server";
import { type UIMessage, type TextUIPart, createTextStreamResponse } from "ai";

import { createClient } from "@supabase/supabase-js";

import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { Document } from "@langchain/core/documents";
import { RunnableSequence } from "@langchain/core/runnables";
import {
  BytesOutputParser,
  StringOutputParser,
} from "@langchain/core/output_parsers";

export const runtime = "edge";

const combineDocumentsFn = (docs: Document[]) => {
  const serializedDocs = docs.map((doc) => doc.pageContent);
  return serializedDocs.join("\n\n");
};

const getMessageText = (message: UIMessage) =>
  message.parts
    .filter((p): p is TextUIPart => p.type === "text")
    .map((p) => p.text)
    .join("");

const formatVercelMessages = (chatHistory: UIMessage[]) => {
  const formattedDialogueTurns = chatHistory.map((message) => {
    if (message.role === "user") {
      return `Human: ${getMessageText(message)}`;
    } else if (message.role === "assistant") {
      return `Assistant: ${getMessageText(message)}`;
    } else {
      return `${message.role}: ${getMessageText(message)}`;
    }
  });
  return formattedDialogueTurns.join("\n");
};

const CONDENSE_QUESTION_TEMPLATE = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question, in its original language.

<chat_history>
  {chat_history}
</chat_history>

Follow Up Input: {question}
Standalone question:`;
const condenseQuestionPrompt = PromptTemplate.fromTemplate(
  CONDENSE_QUESTION_TEMPLATE,
);

const ANSWER_TEMPLATE = `You are a friendly customer service assistant for Crockett's Public House (Puyallup, WA).

Use the provided <context> when it helps, and also rely on the Crockett facts below.

If the user asks for information you don't have in the context or the Crockett facts (for example: exact pricing, dietary details for a specific dish, last-minute hours changes, or availability), tell them you don't have that detail here and recommend checking the full menu/ordering page or calling (253) 466-3075.

Keep responses practical, friendly, and easy to scan.

Crockett facts:
- LOCATION: 118 E Stewart Ave, Puyallup, WA 98372. Phone: (253) 466-3075
- HOURS:
  - Breakfast (Sat & Sun): 8:00am–12:00pm
  - Lunch/Dinner:
    - Mon-Thu: 11:00am–10:00pm
    - Fri: 11:00am–11:00pm
    - Sat: 8:00am–11:00pm
    - Sun: 8:00am–10:00pm
- HAPPY HOUR (bar only):
  - Mon-Thu: 3:00pm–5:00pm
  - Sunday: all day (bar only)
- MENU HIGHLIGHTS:
  - Grilled Artichoke
  - Public House Meatballs
  - Mom's Sloppy Joe
  - Gooey Grilled Cheese Melt
  - They also serve breakfast on weekends.
- FULL MENU: https://crockettspublichouse.com/
- ORDERING:
  - Online ordering and a dine-in waitlist are available through their website.
- FUN FACTS:
  - Featured on Food Network's Diners, Drive-Ins and Dives.
  - Won Best Of Showcase Magazine awards every year from 2016-2024.
  - Over 35 years in the restaurant business.

Answer the question using the <context>, the chat history, and the Crockett facts:
<context>
  {context}
</context>

<chat_history>
  {chat_history}
</chat_history>

Question: {question}
`;
const answerPrompt = PromptTemplate.fromTemplate(ANSWER_TEMPLATE);

/**
 * This handler initializes and calls a retrieval chain. It composes the chain using
 * LangChain Expression Language. See the docs for more information:
 *
 * https://js.langchain.com/v0.2/docs/how_to/qa_chat_history_how_to/
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body.messages ?? [];
    const previousMessages = messages.slice(0, -1);
    const currentMessageContent = getMessageText(messages[messages.length - 1]);

    const model = new ChatOpenAI({
      model: "gpt-4o-mini",
      temperature: 0.2,
    });

    const client = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PRIVATE_KEY!,
    );
    const vectorstore = new SupabaseVectorStore(new OpenAIEmbeddings(), {
      client,
      tableName: "documents",
      queryName: "match_documents",
    });

    /**
     * We use LangChain Expression Language to compose two chains.
     * To learn more, see the guide here:
     *
     * https://js.langchain.com/docs/guides/expression_language/cookbook
     *
     * You can also use the "createRetrievalChain" method with a
     * "historyAwareRetriever" to get something prebaked.
     */
    const standaloneQuestionChain = RunnableSequence.from([
      condenseQuestionPrompt,
      model,
      new StringOutputParser(),
    ]);

    let resolveWithDocuments: (value: Document[]) => void;
    const documentPromise = new Promise<Document[]>((resolve) => {
      resolveWithDocuments = resolve;
    });

    const retriever = vectorstore.asRetriever({
      callbacks: [
        {
          handleRetrieverEnd(documents) {
            resolveWithDocuments(documents);
          },
        },
      ],
    });

    const retrievalChain = retriever.pipe(combineDocumentsFn);

    const answerChain = RunnableSequence.from([
      {
        context: RunnableSequence.from([
          (input) => input.question,
          retrievalChain,
        ]),
        chat_history: (input) => input.chat_history,
        question: (input) => input.question,
      },
      answerPrompt,
      model,
    ]);

    const conversationalRetrievalQAChain = RunnableSequence.from([
      {
        question: standaloneQuestionChain,
        chat_history: (input) => input.chat_history,
      },
      answerChain,
      new BytesOutputParser(),
    ]);

    const stream = await conversationalRetrievalQAChain.stream({
      question: currentMessageContent,
      chat_history: formatVercelMessages(previousMessages),
    });

    const documents = await documentPromise;
    const serializedSources = Buffer.from(
      JSON.stringify(
        documents.map((doc) => {
          return {
            pageContent: doc.pageContent.slice(0, 50) + "...",
            metadata: doc.metadata,
          };
        }),
      ),
    ).toString("base64");

    return createTextStreamResponse({
      textStream: stream.pipeThrough(new TextDecoderStream()),
      headers: {
        "x-message-index": (previousMessages.length + 1).toString(),
        "x-sources": serializedSources,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
