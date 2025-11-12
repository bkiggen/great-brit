import { prisma } from "../../index.js";
import { authenticateUser } from "./authMiddleware.js";

const rankingsRoutes = (router) => {
  // GET ALL RANKINGS
  router.get("/rankings", authenticateUser, async (req, res) => {
    try {
      const episodeId = req.query.episodeId;

      if (!episodeId) {
        return res.status(400).json({ message: "Episode ID required" });
      }

      const episodeNumber = parseInt(episodeId);

      let userRankings = await prisma.ranking.findMany({
        where: {
          userId: req.sessionUser.id,
          episode: episodeNumber,
        },
        include: { star: true },
        orderBy: { rank: "asc" },
      });

      res.json({ rankings: userRankings });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // UPDATE RANKINGS FOR USER
  router.post("/rankings", authenticateUser, async (req, res) => {
    const { rankings } = req.body;

    try {
      const latestEpisode = await prisma.episode.findFirst({
        orderBy: { number: "desc" },
      });

      const userId = req.sessionUser.id;

      // Remove existing rankings for the user in this episode
      await prisma.ranking.deleteMany({
        where: {
          userId,
          episode: latestEpisode.number,
        },
      });

      // Create new rankings for the user
      const rankingsToCreate = rankings.map((rankedStar) => ({
        userId,
        starId: parseInt(rankedStar.starId),
        rank: rankedStar.rank,
        episode: latestEpisode.number,
      }));

      await prisma.ranking.createMany({
        data: rankingsToCreate,
      });

      // Fetch the created rankings with star data
      const populatedRankings = await prisma.ranking.findMany({
        where: {
          userId,
          episode: latestEpisode.number,
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
