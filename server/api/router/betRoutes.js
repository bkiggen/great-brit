import Bet from "../../models/Bet.js";
import { v4 as uuidv4 } from "uuid";
import User from "../../models/User.js";
import Session from "../../models/Session.js";
import { authenticateUser } from "./authMiddleware.js";
import Episode from "../../models/Episode.js";

const betRoutes = (router) => {
  // GET all bets
  router.get("/bets", authenticateUser, async (req, res) => {
    try {
      const episodeParam = req.query.episodeId;
      let episode = {};
      if (episodeParam !== "undefined") {
        episode = await Episode.findOne({ _id: episodeParam });
      }
      const latestEpisode = await Episode.findOne().sort({ number: -1 });

      const bets = await Bet.find({
        episode: episode.number || latestEpisode.number,
      }).populate("better eligibleUsers");
      res.json({ bets });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create a bet
  router.post("/bets", authenticateUser, async (req, res) => {
    const { description, odds, maxLose, eligibleUsers } = req.body;

    const sessionToken = req.headers.authorization.split(" ")[1];

    const episode = await Episode.findOne().sort({ number: -1 });

    try {
      const session = await Session.findOne({ token: sessionToken });
      const sessionUser = await User.findOne({ _id: session.userId });

      if (!session) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const userPromises = eligibleUsers.map(async (userId) => {
        const user = await User.findOne({ _id: userId });
        return user ? user.toObject() : null;
      });

      const users = await Promise.all(userPromises);

      const newBet = new Bet({
        id: uuidv4(),
        description,
        odds,
        better: sessionUser,
        maxLose,
        eligibleUsers: users,
        episode: episode.number,
      });

      const savedBet = await newBet.save();
      const populatedBet = await savedBet.populate("better eligibleUsers");
      res.status(201).json({ bet: populatedBet });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  router.put("/bets/:betId", authenticateUser, async (req, res) => {
    const betId = req.params.betId;
    const { won } = req.body;

    try {
      const bet = await Bet.findOne({ id: betId });

      if (!bet) {
        return res.status(404).json({ message: "Bet not found" });
      }

      bet.won = won;

      const updatedBet = await bet.save();

      const populatedBet = await updatedBet.populate("better eligibleUsers");

      res.json({ bet: populatedBet });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  router.delete("/bets/:betId", authenticateUser, async (req, res) => {
    const betId = req.params.betId;

    try {
      const bet = await Bet.findOne({ id: betId });

      if (!bet) {
        return res.status(404).json({ message: "Bet not found" });
      }

      await Bet.deleteOne({ id: betId });

      res.json({ message: "Bet deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return router;
};

export default betRoutes;
