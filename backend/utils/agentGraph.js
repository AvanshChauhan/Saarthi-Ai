import dotenv from "dotenv";
import { ChatGroq } from "@langchain/groq";
import { SystemMessage } from "@langchain/core/messages";
import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { MongoDBSaver } from "@langchain/langgraph-checkpoint-mongodb";
import { MongoClient } from "mongodb";
import { MAX_RESPONSE_TOKENS } from "./tokenUsage.js";
import {} from "@langchain/langgraph/prebuilt";
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
const chatNode = () => {};
const approvalNode = () => {};
const toolNode = new toolNode();

const routeAfterChat = () => {};

const routeAfterApproval = () => {};
const workflow = new StateGraph(MessagesAnnotation)
  .addNode("chatNode", chatNode)
  .addNode("toolsNode", toolNode)
  .addNode("actionApprovalNode", approvalNode)
  .addEdge("__start__", chatNode)
  .addConditionalEdges("chatNode", routeAfterChat)
  .addEdge("toolsNode", "chatNode")
  .addConditionalEdges("actionApprovalNode",routeAfterApproval)
  .addEdge("chatNode","__end__")

  const chatAgentGraph=workflow.compile({checkpointer})