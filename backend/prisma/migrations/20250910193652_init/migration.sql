/*
  Warnings:

  - You are about to drop the column `endTime` on the `Reminder` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `Reminder` table. All the data in the column will be lost.
  - Added the required column `time` to the `Reminder` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('SENT', 'PENDING', 'FAILED');

-- AlterTable
ALTER TABLE "public"."Reminder" DROP COLUMN "endTime",
DROP COLUMN "startTime",
ADD COLUMN     "status" "public"."Status" DEFAULT 'PENDING',
ADD COLUMN     "time" TIMESTAMP(3) NOT NULL;
