import Star from "../../models/Star.js";
import Ranking from "../../models/Ranking.js";
import Session from "../../models/Session.js";
import { authenticateUser } from "./authMiddleware.js";
import Episode from "../../models/Episode.js";

const rankingsRoutes = (router) => {
  // GET ALL RANKINGS
  router.get("/rankings", authenticateUser, async (req, res) => {
    try {
      const episodeId = req.query.episodeId;

      const sessionToken = req.headers.authorization.split(" ")[1];
      const session = await Session.findOne({ token: sessionToken });

      if (!session || !episodeId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const episode = await Episode.findOne({ _id: episodeId });

      let userRankings = await Ranking.find({
        userId: session.userId,
        episode: episode.number,
      })
        .populate("starId") // Populate the related Star data
        .sort({ rank: 1 }); // Sort the rankings by rank

      res.json({ rankings: userRankings });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // UPDATE RANKINGS FOR USER
  router.post("/rankings", authenticateUser, async (req, res) => {
    const sessionToken = req.headers.authorization.split(" ")[1];
    const { rankings } = req.body;

    try {
      const session = await Session.findOne({ token: sessionToken });

      if (!session) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const episode = await Episode.findOne().sort({ number: -1 });

      const userId = session.userId;

      // Remove existing rankings for the user
      await Ranking.deleteMany({ userId });

      // Create new rankings for the user
      const rankingPromises = rankings.map(async (rankedStar) => {
        const star = await Star.findOne({ _id: rankedStar.starId });
        if (!star) {
          return null;
        }
        return new Ranking({
          userId,
          starId: star._id,
          rank: rankedStar.rank,
          episode: episode.number,
        }).save();
      });

      const newRankings = await Promise.all(rankingPromises);
      const savedRankings = newRankings.filter((ranking) => ranking !== null);

      // Populate the related Star data for each ranking
      const populatedRankings = await Ranking.find({ userId })
        .populate("starId")
        .sort({ rank: 1 });

      res.status(201).json({ rankings: populatedRankings });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return router;
};

export default rankingsRoutes;
