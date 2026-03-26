import { NextRequest, NextResponse } from "next/server";
import { type UIMessage, type TextUIPart, createTextStreamResponse } from "ai";

import { createClient } from "@supabase/supabase-js";

import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import {
  AIMessage,
  BaseMessage,
  ChatMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { createRetrieverTool } from "langchain/tools/retriever";
import { createReactAgent } from "@langchain/langgraph/prebuilt";

export const runtime = "edge";

const getMessageText = (message: UIMessage) =>
  message.parts
    .filter((p): p is TextUIPart => p.type === "text")
    .map((p) => p.text)
    .join("");

const convertVercelMessageToLangChainMessage = (message: UIMessage) => {
  if (message.role === "user") {
    return new HumanMessage(getMessageText(message));
  } else if (message.role === "assistant") {
    return new AIMessage(getMessageText(message));
  } else {
    return new ChatMessage(getMessageText(message), message.role);
  }
};

const convertLangChainMessageToVercelMessage = (message: BaseMessage) => {
  if (message._getType() === "human") {
    return { content: message.content, role: "user" };
  } else if (message._getType() === "ai") {
    return {
      content: message.content,
      role: "assistant",
      tool_calls: (message as AIMessage).tool_calls,
    };
  } else {
    return { content: message.content, role: message._getType() };
  }
};

const AGENT_SYSTEM_TEMPLATE = `You are a friendly customer service assistant for Crockett's Public House (Puyallup, WA).

Use the following facts (and only these facts unless you use the available tools or are prompted to check the website/phone):
- LOCATION: 118 E Stewart Ave, Puyallup, WA 98372. Phone: (253) 466-3075
- HOURS:
  - Breakfast (Sat & Sun): 8:00am–12:00pm
  - Lunch/Dinner:
    - Mon-Thu: 11:00am–10:00pm
    - Fri: 11:00am–11:00pm
    - Sat: 8:00am–11:00pm
    - Sun: 8:00am–10:00pm
- HAPPY HOUR (bar only):
  - Mon-Thu 3:00pm–5:00pm
  - Sunday: all day (bar only)
- MENU HIGHLIGHTS:
  - Grilled Artichoke
  - Public House Meatballs
  - Mom's Sloppy Joe
  - Gooey Grilled Cheese Melt
  - They also serve breakfast on weekends.
- ORDERING / WAITLIST:
  - Online ordering and a dine-in waitlist are available through their website: https://crockettspublichouse.com/
- FULL MENU: https://crockettspublichouse.com/
- FUN FACTS:
  - Featured on Food Network's Diners, Drive-Ins and Dives.
  - Won Best Of Showcase Magazine awards every year from 2016-2024.
  - Over 35 years in the restaurant business.

Guidelines:
- If the user asks about something you don't have exact details for here (pricing, dietary/allergen specifics for a specific dish, current promotions, exact availability), say you don't have that detail and recommend checking the website or calling (253) 466-3075.
- Keep responses friendly, practical, and not overly long.`;

/**
 * This handler initializes and calls an tool caling ReAct agent.
 * See the docs for more information:
 *
 * https://langchain-ai.github.io/langgraphjs/tutorials/quickstart/
 * https://js.langchain.com/docs/use_cases/question_answering/conversational_retrieval_agents
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    /**
     * We represent intermediate steps as system messages for display purposes,
     * but don't want them in the chat history.
     */
    const messages = (body.messages ?? [])
      .filter(
        (message: UIMessage) =>
          message.role === "user" || message.role === "assistant",
      )
      .map(convertVercelMessageToLangChainMessage);
    const returnIntermediateSteps = body.show_intermediate_steps;

    const chatModel = new ChatOpenAI({
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

    const retriever = vectorstore.asRetriever();

    /**
     * Wrap the retriever in a tool to present it to the agent in a
     * usable form.
     */
    const tool = createRetrieverTool(retriever, {
      name: "search_latest_knowledge",
      description: "Searches and returns up-to-date general information.",
    });

    /**
     * Use a prebuilt LangGraph agent.
     */
    const agent = await createReactAgent({
      llm: chatModel,
      tools: [tool],
      /**
       * Modify the stock prompt in the prebuilt agent. See docs
       * for how to customize your agent:
       *
       * https://langchain-ai.github.io/langgraphjs/tutorials/quickstart/
       */
      messageModifier: new SystemMessage(AGENT_SYSTEM_TEMPLATE),
    });

    if (!returnIntermediateSteps) {
      /**
       * Stream back all generated tokens and steps from their runs.
       *
       * We do some filtering of the generated events and only stream back
       * the final response as a string.
       *
       * For this specific type of tool calling ReAct agents with OpenAI, we can tell when
       * the agent is ready to stream back final output when it no longer calls
       * a tool and instead streams back content.
       *
       * See: https://langchain-ai.github.io/langgraphjs/how-tos/stream-tokens/
       */
      const eventStream = await agent.streamEvents(
        {
          messages,
        },
        { version: "v2" },
      );

      const textEncoder = new TextEncoder();
      const transformStream = new ReadableStream({
        async start(controller) {
          for await (const { event, data } of eventStream) {
            if (event === "on_chat_model_stream") {
              // Intermediate chat model generations will contain tool calls and no content
              if (!!data.chunk.content) {
                controller.enqueue(textEncoder.encode(data.chunk.content));
              }
            }
          }
          controller.close();
        },
      });

      return createTextStreamResponse({ textStream: transformStream });
    } else {
      /**
       * We could also pick intermediate steps out from `streamEvents` chunks, but
       * they are generated as JSON objects, so streaming and displaying them with
       * the AI SDK is more complicated.
       */
      const result = await agent.invoke({ messages });
      return NextResponse.json(
        {
          messages: result.messages.map(convertLangChainMessageToVercelMessage),
        },
        { status: 200 },
      );
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
