-- Add seasons. Existing data becomes season 16 (2025).
-- Episode PK changes from "number" to a new "id". Old rows get id = number,
-- so existing foreign key values stay valid.

-- 1. Seasons table
CREATE TABLE "seasons" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "year" INTEGER,
    "current" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "seasons_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "seasons_number_key" ON "seasons"("number");
INSERT INTO "seasons" ("number", "year", "current") VALUES (16, 2025, true);

-- 2. Drop foreign keys that point at episodes(number)
ALTER TABLE "bets" DROP CONSTRAINT "bets_episode_fkey";
ALTER TABLE "episode_stars" DROP CONSTRAINT "episode_stars_episodeId_fkey";
ALTER TABLE "events" DROP CONSTRAINT "events_episodeId_fkey";
ALTER TABLE "rankings" DROP CONSTRAINT "rankings_episode_fkey";
ALTER TABLE "user_deltas" DROP CONSTRAINT "user_deltas_episodeId_fkey";

-- 3. New episode primary key and season link
ALTER TABLE "episodes" ADD COLUMN "id" INTEGER;
UPDATE "episodes" SET "id" = "number";
ALTER TABLE "episodes" ALTER COLUMN "id" SET NOT NULL;
ALTER TABLE "episodes" DROP CONSTRAINT "episodes_pkey";
ALTER TABLE "episodes" ADD CONSTRAINT "episodes_pkey" PRIMARY KEY ("id");
CREATE SEQUENCE "episodes_id_seq" OWNED BY "episodes"."id";
ALTER TABLE "episodes" ALTER COLUMN "id" SET DEFAULT nextval('"episodes_id_seq"');
SELECT setval('"episodes_id_seq"', COALESCE((SELECT MAX("id") FROM "episodes"), 0) + 1, false);

ALTER TABLE "episodes" ADD COLUMN "seasonId" INTEGER;
UPDATE "episodes" SET "seasonId" = (SELECT "id" FROM "seasons" WHERE "number" = 16);
ALTER TABLE "episodes" ALTER COLUMN "seasonId" SET NOT NULL;
CREATE UNIQUE INDEX "episodes_seasonId_number_key" ON "episodes"("seasonId", "number");
ALTER TABLE "episodes" ADD CONSTRAINT "episodes_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "seasons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 4. Stars belong to a season
ALTER TABLE "stars" ADD COLUMN "seasonId" INTEGER;
UPDATE "stars" SET "seasonId" = (SELECT "id" FROM "seasons" WHERE "number" = 16);
ALTER TABLE "stars" ALTER COLUMN "seasonId" SET NOT NULL;
CREATE INDEX "stars_seasonId_idx" ON "stars"("seasonId");
ALTER TABLE "stars" ADD CONSTRAINT "stars_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "seasons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 5. Re-add foreign keys, now pointing at episodes(id)
ALTER TABLE "bets" ADD CONSTRAINT "bets_episode_fkey" FOREIGN KEY ("episode") REFERENCES "episodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "episode_stars" ADD CONSTRAINT "episode_stars_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "episodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "events" ADD CONSTRAINT "events_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "episodes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "rankings" ADD CONSTRAINT "rankings_episode_fkey" FOREIGN KEY ("episode") REFERENCES "episodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_deltas" ADD CONSTRAINT "user_deltas_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "episodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
