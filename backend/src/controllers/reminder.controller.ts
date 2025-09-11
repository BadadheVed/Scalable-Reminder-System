import { db } from "@/db/route";
import { tryCatch } from "bullmq";
import { Request, Response } from "express";
import { addReminder } from "@/queues/queue";
export const CreateReminder = async (req: Request, res: Response) => {
  try {
    console.log("CreateReminder called with body:", req.body);
    const { title, time, description } = req.body;
    const user = (req as any).user; // from authMiddleware

    console.log("User from auth:", user);

    if (!title || !time) {
      console.log("Missing required fields: title or time");
      return res.status(400).json({
        success: false,
        message: "Title and time are required",
      });
    }

    const createData: any = {
      title,
      description,
      time: new Date(time),
      userId: user.id,
    };

    console.log("Creating reminder with data:", createData);

    const reminder = await db.reminder.create({
      data: createData,
    });

    console.log("Reminder created in database:", reminder);

    const sendTime = new Date(time).getTime() - 10 * 60 * 1000;
    const delayMs = sendTime - Date.now();

    console.log("Send time calculation:", {
      reminderTime: new Date(time),
      sendTime: new Date(sendTime),
      delayMs: delayMs,
      currentTime: new Date()
    });

    if (delayMs > 0) {
      console.log("Adding reminder to queue with delay:", delayMs);
      try {
        await addReminder(reminder.id, delayMs);
        console.log("Reminder added to queue successfully");
      } catch (queueError) {
        console.error("Failed to add reminder to queue:", queueError);
        // Update reminder status to indicate queue failure
        await db.reminder.update({
          where: { id: reminder.id },
          data: { status: "FAILED" },
        });
        console.log("Reminder created but queue scheduling failed - will need manual processing");
      }
    } else {
      console.warn(`Reminder ${reminder.id} time already passed`);
      return res.status(400).json({
        message: "Time already passed",
        success: false,
      });
    }

    console.log("Sending success response");
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
      return res.status(401).json({
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
