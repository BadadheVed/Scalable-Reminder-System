import { Queue } from "bullmq";

console.log("Redis URL:", process.env.REDIS_URL);

// Add connection error handling
const reminderQueue = new Queue("reminders", {
  connection: {
    url: process.env.REDIS_URL as string,
  },
});

// Add queue event listeners for debugging
reminderQueue.on("error", (error) => {
  console.error("Queue error:", error);
});

export async function addReminder(reminderId: string, delayMs: number) {
  try {
    console.log(
      `Adding reminder ${reminderId} to queue with delay ${delayMs}ms`
    );

    // Test Redis connection first
    await reminderQueue.isPaused();
    console.log("Queue is accessible, proceeding with job addition");

    const job = await reminderQueue.add(
      "send-email",
      { reminderId },
      { delay: delayMs } // delay until reminder time
    );

    console.log(
      `⏳ Reminder ${reminderId} scheduled in ${delayMs}ms with job ID: ${job.id}`
    );
    return job;
  } catch (error: any) {
    console.error(`❌ Error adding reminder ${reminderId} to queue:`, error);
    console.error("Error details:", {
      message: error?.message || "Unknown error",
      stack: error?.stack || "No stack trace",
      name: error?.name || "Unknown error type",
    });
    throw error;
  }
}
