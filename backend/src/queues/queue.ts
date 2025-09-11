import { Queue } from "bullmq";
const reminderQueue = new Queue("reminders", {
  connection: {
    url: process.env.REDIS_URL as string,
  },
});

export async function addReminder(reminderId: string, delayMs: number) {
  await reminderQueue.add(
    "send-email",
    { reminderId },
    { delay: delayMs } // delay until reminder time
  );
  console.log(`⏳ Reminder ${reminderId} scheduled in ${delayMs}ms`);
}
