-- Delete existing events (test data)
DELETE FROM "events";

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "eventTypeId" INTEGER,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "baseAmount" DROP NOT NULL;

-- CreateTable
CREATE TABLE "event_types" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_types_pkey" PRIMARY KEY ("id")
);

-- Insert predefined event types
INSERT INTO "event_types" ("description", "value") VALUES
('Table Touch', -3),
('Floor Drop', -10),
('Collapse', -5),
('Handshake', 15),
('Star Baker', 10),
('Sent Home', -10),
('T1', 3),
('T2', 2),
('T-1', -3),
('T-2', -2),
('Ungraceful Exit', -20),
('Raw', -5),
('Burnt', -5),
('Small Triumph', 7);

-- CreateIndex
CREATE UNIQUE INDEX "event_types_description_key" ON "event_types"("description");

-- CreateIndex
CREATE INDEX "events_eventTypeId_idx" ON "events"("eventTypeId");

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_eventTypeId_fkey" FOREIGN KEY ("eventTypeId") REFERENCES "event_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;
