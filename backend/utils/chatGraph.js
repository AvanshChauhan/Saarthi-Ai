import dotenv from "dotenv";
import { ChatGroq } from "@langchain/groq";
import { SystemMessage } from "@langchain/core/messages";
import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { MongoDBSaver } from "@langchain/langgraph-checkpoint-mongodb";
import { MongoClient } from "mongodb";
import { MAX_RESPONSE_TOKENS } from "./tokenUsage.js";

dotenv.config();

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error("MONGO_URI is not defined in environment variables");
}

const client = new MongoClient(mongoUri);
const checkpointer = new MongoDBSaver({ client, dbName: "langgraph" });

const llm = new ChatGroq({
  model: "openai/gpt-oss-120b",
  temperature: 0,
  maxTokens: MAX_RESPONSE_TOKENS,
  maxRetries: 2,
});

const chatNode = async (state, config) => {
  const systemPrompt = config.configurable?.systemPrompt;
  const messages = systemPrompt
    ? [new SystemMessage(systemPrompt), ...state.messages]
    : state.messages;
  const maxTokens = config.configurable?.maxOutputTokens;
  const response = await llm.invoke(messages, {
    maxTokens: Math.min(
      MAX_RESPONSE_TOKENS,
      Number.isInteger(maxTokens) && maxTokens > 0
        ? maxTokens
        : MAX_RESPONSE_TOKENS,
    ),
  });

  return {
    messages: [response],
  };
};

const workflow = new StateGraph(MessagesAnnotation)
  .addNode("chatNode", chatNode)
  .addEdge("__start__", "chatNode")
  .addEdge("chatNode", "__end__");

const chatGraph = workflow.compile({checkpointer});
export default chatGraph