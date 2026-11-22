import { prisma } from "../index.js";

// The season marked current. Falls back to the highest season number.
export const getCurrentSeason = async () => {
  const current = await prisma.season.findFirst({ where: { current: true } });
  if (current) return current;
  return prisma.season.findFirst({ orderBy: { number: "desc" } });
};

// The current episode of the current season (or null).
export const getCurrentEpisode = async () => {
  const season = await getCurrentSeason();
  if (!season) return null;
  return prisma.episode.findFirst({
    where: { seasonId: season.id, current: true },
  });
};
