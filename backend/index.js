import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import connectDb from "./config/db.js";
import helmet from "helmet";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";
import agentRouter from "./routes/agent.routes.js";
import chatRouter from "./routes/chat.routes.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(
  helmet({
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  }),
);
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use("/api/auth",authRouter)
app.use("/api/agent",agentRouter)
app.use("/api/talk",chatRouter)
await connectDb();
app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
