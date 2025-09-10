import { GetReminder, CreateReminder } from "@/controllers/reminder.controller";

import { Router } from "express";
import { authMiddleware } from "@/middleware/auth";
export const reminderRouter = Router();

reminderRouter.use("/get", authMiddleware, GetReminder);
reminderRouter.use("/create", authMiddleware, CreateReminder);
reminderRouter.use("/", authMiddleware, (req, res) => {
  res.json({
    message: "Health checkpoint working succesfully",
  });
});
