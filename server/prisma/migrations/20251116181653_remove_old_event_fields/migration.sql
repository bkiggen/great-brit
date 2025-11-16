/*
  Warnings:

  - You are about to drop the column `baseAmount` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `events` table. All the data in the column will be lost.
  - Made the column `eventTypeId` on table `events` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "events" DROP COLUMN "baseAmount",
DROP COLUMN "description",
ALTER COLUMN "eventTypeId" SET NOT NULL;
