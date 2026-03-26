import { NextRequest, NextResponse } from "next/server";
import { type UIMessage, type TextUIPart, createTextStreamResponse } from "ai";

import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { HttpResponseOutputParser } from "langchain/output_parsers";

export const runtime = "edge";

const getMessageText = (message: UIMessage) =>
  message.parts
    .filter((p): p is TextUIPart => p.type === "text")
    .map((p) => p.text)
    .join("");

const formatMessage = (message: UIMessage) => {
  return `${message.role}: ${getMessageText(message)}`;
};

const TEMPLATE = `You are a friendly customer service assistant for Crockett's Public House (Puyallup, WA).

Help with questions about the restaurant: location, hours, happy hour, menu highlights, ordering/waitlist, and fun facts.

Use these facts (and only these facts unless the user asks you to check the website or call):
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
  - Sunday: all day
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

Guidelines:
- Be friendly, helpful, and knowledgeable.
- Keep answers practical and easy to scan.
- If the user asks for something you don't have exact details for here (pricing, dietary details, substitutions, specific availability), tell them you recommend checking the full menu on the website or calling (253) 466-3075.

Current conversation:
{chat_history}

User: {input}
AI:`;

/**
 * This handler initializes and calls a simple chain with a prompt,
 * chat model, and output parser. See the docs for more information:
 *
 * https://js.langchain.com/docs/guides/expression_language/cookbook#prompttemplate--llm--outputparser
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body.messages ?? [];
    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = getMessageText(messages[messages.length - 1]);
    const prompt = PromptTemplate.fromTemplate(TEMPLATE);

    /**
     * You can also try e.g.:
     *
     * import { ChatAnthropic } from "@langchain/anthropic";
     * const model = new ChatAnthropic({});
     *
     * See a full list of supported models at:
     * https://js.langchain.com/docs/modules/model_io/models/
     */
    const model = new ChatOpenAI({
      temperature: 0.8,
      model: "gpt-4o-mini",
    });

    /**
     * Chat models stream message chunks rather than bytes, so this
     * output parser handles serialization and byte-encoding.
     */
    const outputParser = new HttpResponseOutputParser();

    /**
     * Can also initialize as:
     *
     * import { RunnableSequence } from "@langchain/core/runnables";
     * const chain = RunnableSequence.from([prompt, model, outputParser]);
     */
    const chain = prompt.pipe(model).pipe(outputParser);

    const stream = await chain.stream({
      chat_history: formattedPreviousMessages.join("\n"),
      input: currentMessageContent,
    });

    return createTextStreamResponse({
      textStream: stream.pipeThrough(new TextDecoderStream()),
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
