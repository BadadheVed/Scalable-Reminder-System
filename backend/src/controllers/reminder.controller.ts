import { db } from "@/db/route";
import { tryCatch } from "bullmq";
import { Request, Response } from "express";
import { addReminder } from "@/queues/queue";
export const CreateReminder = async (req: Request, res: Response) => {
  try {
    const { title, time } = req.body;
    const user = (req as any).user; // from authMiddleware

    if (!title || !time) {
      return res.status(400).json({
        success: false,
        message: "Title and time are required",
      });
    }

    const reminder = await db.reminder.create({
      data: {
        title,
        time: new Date(time),
        userId: user.id,
      },
    });

    const sendTime = new Date(time).getTime() - 10 * 60 * 1000;
    const delayMs = sendTime - Date.now();

    if (delayMs > 0) {
      await addReminder(reminder.id, delayMs);
    } else {
      console.warn(`Reminder ${reminder.id} time already passed`);
      return res.status(400).json({
        message: "Time already passed",
        success: false,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Reminder created successfully",
      reminder,
    });
  } catch (error) {
    console.error("Create reminder error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create reminder",
    });
  }
};

export const GetReminder = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) {
      res.status(401).json({
        message: "Unauthorized",
      });
    }
    const reminders = await db.reminder.findMany({
      where: { userId: user.id },
      orderBy: { time: "asc" },
    });

    return res.json({
      success: true,
      reminders,
    });
  } catch (error: any) {
    console.error("Get reminders error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch reminders",
    });
  }
};
