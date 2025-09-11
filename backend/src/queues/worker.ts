import { SendMail } from "@/test/mail";
import { Worker } from "bullmq";
import { db } from "@/db/route";

const worker = new Worker(
  "reminders",
  async (job) => {
    const { reminderId } = job.data;
    console.log(`✅ Processing reminder ${reminderId}`);

    try {
      const reminder = await db.reminder.findFirst({
        where: { id: reminderId },
        include: { user: true },
      });

      if (!reminder) {
        throw new Error(`Reminder ${reminderId} not found`);
      }

      await SendMail(reminder.user.email, reminder.title);
      //await SendMail("happysingh112006@gmail.com");
      console.log(
        `Email sent for reminder ${reminderId} and the email is ${reminder.user.email}`
      );

      await db.reminder.update({
        where: { id: reminderId },
        data: { status: "SENT" },
      });
    } catch (err) {
      console.error(`❌ Error processing reminder ${reminderId}:`, err);

      await db.reminder.update({
        where: { id: reminderId },
        data: { status: "FAILED" },
      });

      throw err;
    }
  },
  {
    connection: { url: process.env.REDIS_URL as string },
  }
);

worker.on("completed", (job) => {
  console.log(`🎉 Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Job ${job?.id} failed:`, err);
});
