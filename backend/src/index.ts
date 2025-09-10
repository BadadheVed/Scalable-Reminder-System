import express from "express";
import { emailRouter } from "./router/mailRoute";
import dotenv from "dotenv";
import { authRouter } from "./router/loginRoute";
import { reminderRouter } from "./router/reminderRoute";
import "./queues/worker";

import cookieParser from "cookie-parser";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/mail", emailRouter);
app.use("/auth", authRouter);
app.use("/reminder", reminderRouter);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`listening on the port ${PORT}`);
});
