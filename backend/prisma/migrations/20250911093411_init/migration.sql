/*
  Warnings:

  - Made the column `status` on table `Reminder` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Reminder" DROP CONSTRAINT "Reminder_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Reminder" ALTER COLUMN "status" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Reminder_userId_idx" ON "public"."Reminder"("userId");

-- AddForeignKey
ALTER TABLE "public"."Reminder" ADD CONSTRAINT "Reminder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
