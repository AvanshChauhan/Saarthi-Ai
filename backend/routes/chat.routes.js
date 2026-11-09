import express from "express";
import protect from "../middleware/protect.js";
import { chat } from "../controllers/chat.controller.js";

const chatRouter = express.Router();
chatRouter.post("/chat", protect, chat);

export default chatRouter;
