import { prisma } from "../../index.js";
import { authenticateUser } from "./authMiddleware.js";
import { getCurrentSeason, getCurrentEpisode } from "../../helpers/season.js";

const rankingsRoutes = (router) => {
  // GET ALL RANKINGS
  router.get("/rankings", authenticateUser, async (req, res) => {
    try {
      const episodeId = req.query.episodeId;

      if (!episodeId) {
        return res.status(400).json({ message: "Episode ID required" });
      }

      const episodeNumber = parseInt(episodeId);

      // Get stars assigned to this episode
      const episodeStars = await prisma.episodeStar.findMany({
        where: { episodeId: episodeNumber },
        select: { starId: true },
      });

      const episodeStarIds = episodeStars.map((es) => es.starId);

      // Get user rankings for stars in this episode
      let userRankings = await prisma.ranking.findMany({
        where: {
          userId: req.sessionUser.id,
          episode: episodeNumber,
          starId: { in: episodeStarIds },
        },
        include: { star: true },
        orderBy: { rank: "asc" },
      });

      if (userRankings.length === 0) {
        // If no rankings exist, create default rankings based on episode stars
        userRankings = await Promise.all(
          episodeStarIds.map(async (starId, index) => ({
            star: await prisma.star.findUnique({ where: { id: starId } }),
            rank: index + 1,
          }))
        );
      }

      res.json({ rankings: userRankings });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // UPDATE RANKINGS FOR USER
  router.post("/rankings", authenticateUser, async (req, res) => {
    const { rankings, episodeId } = req.body;

    try {
      const episodeNumber = episodeId
        ? parseInt(episodeId)
        : (
            await prisma.episode.findFirst({
              where: { seasonId: (await getCurrentSeason())?.id },
              orderBy: { number: "desc" },
            })
          ).id;

      const userId = req.sessionUser.id;

      // Only the current episode (or a later one) of the current season can change
      const episode = await prisma.episode.findUnique({
        where: { id: episodeNumber },
      });
      const currentEpisode = await getCurrentEpisode();
      if (
        !episode ||
        !currentEpisode ||
        episode.seasonId !== currentEpisode.seasonId ||
        episode.number < currentEpisode.number
      ) {
        return res
          .status(403)
          .json({ message: "Rankings for this episode are locked" });
      }

      // Only bakers in this episode can be ranked
      const episodeStarIds = new Set(
        (
          await prisma.episodeStar.findMany({
            where: { episodeId: episodeNumber },
            select: { starId: true },
          })
        ).map((es) => es.starId)
      );

      // Remove existing rankings for the user in this episode
      await prisma.ranking.deleteMany({
        where: {
          userId,
          episode: episodeNumber,
        },
      });

      // Create new rankings for the user
      const rankingsToCreate = rankings.map((rankedStar) => {
        // Handle both cases: starId as a direct property or nested in star object
        const starId = rankedStar.starId || rankedStar.star?.id;
        return {
          userId,
          starId: parseInt(starId),
          rank: rankedStar.rank,
          episode: episodeNumber,
        };
      });

      // Remove duplicates and bakers not in this episode, then renumber 1..n
      const seenStarIds = new Set();
      const uniqueRankings = rankingsToCreate
        .filter((ranking) => {
          if (!episodeStarIds.has(ranking.starId)) return false;
          if (seenStarIds.has(ranking.starId)) return false;
          seenStarIds.add(ranking.starId);
          return true;
        })
        .sort((a, b) => a.rank - b.rank)
        .map((ranking, index) => ({ ...ranking, rank: index + 1 }));

      await prisma.ranking.createMany({
        data: uniqueRankings,
      });

      // Fetch the created rankings with star data
      const populatedRankings = await prisma.ranking.findMany({
        where: {
          userId,
          episode: episodeNumber,
        },
        include: { star: true },
        orderBy: { rank: "asc" },
      });

      res.status(201).json({ rankings: populatedRankings });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return router;
};

export default rankingsRoutes;
