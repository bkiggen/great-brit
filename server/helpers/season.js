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

export const STARTING_BALANCE = 100;

// A user's balance in the current season: starting balance + all deltas.
export const getUserBalance = async (userId) => {
  const season = await getCurrentSeason();
  const agg = await prisma.userDelta.aggregate({
    where: { userId, episode: { seasonId: season?.id } },
    _sum: { delta: true },
  });
  return STARTING_BALANCE + (agg._sum.delta || 0);
};
