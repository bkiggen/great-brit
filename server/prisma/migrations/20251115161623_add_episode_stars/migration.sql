-- CreateTable
CREATE TABLE "episode_stars" (
    "id" SERIAL NOT NULL,
    "episodeId" INTEGER NOT NULL,
    "starId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "episode_stars_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "episode_stars_episodeId_idx" ON "episode_stars"("episodeId");

-- CreateIndex
CREATE INDEX "episode_stars_starId_idx" ON "episode_stars"("starId");

-- CreateIndex
CREATE UNIQUE INDEX "episode_stars_episodeId_starId_key" ON "episode_stars"("episodeId", "starId");

-- AddForeignKey
ALTER TABLE "episode_stars" ADD CONSTRAINT "episode_stars_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "episodes"("number") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "episode_stars" ADD CONSTRAINT "episode_stars_starId_fkey" FOREIGN KEY ("starId") REFERENCES "stars"("id") ON DELETE CASCADE ON UPDATE CASCADE;
