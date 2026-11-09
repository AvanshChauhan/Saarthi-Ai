import express from "express";
import protect from "../middleware/protect.js";
import {
  createAgent,
  deleteAgent,
  getAgentById,
  getAllAgent,
} from "../controllers/agent.controller.js";
const agentRouter = express.Router();
agentRouter.post("/create-agent", protect, createAgent);
agentRouter.get("/get-agent", protect, getAllAgent);
agentRouter.get("/:id", protect, getAgentById);
agentRouter.delete("/:id", protect, deleteAgent);

export default agentRouter;
