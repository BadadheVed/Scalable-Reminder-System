import express from "express";

import dotenv from "dotenv";
import { authRouter } from "./router/loginRoute";
import { reminderRouter } from "./router/reminderRoute";
import "./queues/worker";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
const app = express();
const url = process.env.FRONTEND_URL || "http://localhost:3000";
console.log("Allowed CORS origin:", url);
app.use(
  cors({
    origin: url,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

app.use(express.json());
app.use(cookieParser());

// Routes come AFTER CORS

app.use("/auth", authRouter);
app.use("/reminder", reminderRouter);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`listening on the port ${PORT}`);
});
