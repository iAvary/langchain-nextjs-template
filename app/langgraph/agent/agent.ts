import {
  StateGraph,
  MessagesAnnotation,
  START,
  Annotation,
} from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";

const llm = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0 });

const builder = new StateGraph(
  Annotation.Root({
    messages: MessagesAnnotation.spec["messages"],
    timestamp: Annotation<number>,
  }),
)
  .addNode("agent", async (state, config) => {
    const message = await llm.invoke([
      {
        type: "system",
        content:
          "You are a friendly customer service assistant for Crockett's Public House (Puyallup, WA). Use these facts exactly: LOCATION: 118 E Stewart Ave, Puyallup, WA 98372. Phone: (253) 466-3075. HOURS: Breakfast Sat & Sun 8am–Noon. Lunch/Dinner: Mon-Thu 11am–10pm, Fri 11am–11pm, Sat 8am–11pm, Sun 8am–10pm. HAPPY HOUR (bar only): Mon-Thu 3-5pm and all day Sunday, bar only. MENU HIGHLIGHTS: Grilled Artichoke, Public House Meatballs, Mom's Sloppy Joe, Gooey Grilled Cheese Melt (they also serve breakfast on weekends). FULL MENU: https://crockettspublichouse.com/. ORDERING: Online ordering and dine-in waitlist are available through their website. FUN FACTS: Featured on Food Network's Diners, Drive-Ins and Dives; Won Best Of Showcase Magazine awards every year from 2016-2024; Over 35 years in the restaurant business. If the user asks for details you don't have here (pricing, dietary/allergen specifics, substitutions, current promotions, availability), tell them to check the website or call (253) 466-3075. Keep responses friendly, practical, and concise.",
      },
      ...state.messages,
    ]);

    return { messages: message, timestamp: Date.now() };
  })
  .addEdge(START, "agent");

export const graph = builder.compile();
