import mongoose from "mongoose";
import Episode from "../../models/Episode.js";
import Event from "../../models/Event.js";
import User from "../../models/User.js";
import Star from "../../models/Star.js";
import Ranking from "../../models/Ranking.js";
import { authenticateUser } from "./authMiddleware.js";

const episodeRoutes = (router) => {
  // Get all episodes
  router.get("/episodes", authenticateUser, async (req, res) => {
    try {
      const episodes = await Episode.find();
      res.json({ episodes });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create a new episode
  router.post("/episodes", authenticateUser, async (req, res) => {
    const { number, hasAired } = req.body;

    try {
      const newEpisode = new Episode({
        number,
        hasAired,
      });

      await Ranking.deleteMany({ episode: 3 });

      // Create and save default rankings for each star
      const activeStars = await Star.find({ active: true });
      const allUsers = await User.find();
      allUsers.forEach(async (user) => {
        activeStars.map(async (star, index) => {
          const newRanking = new Ranking({
            userId: user._id,
            starId: star._id,
            rank: index + 1,
            episode: newEpisode.number,
          });
          return newRanking.save();
        });
      });

      const savedEpisode = await newEpisode.save();
      res.status(201).json({ episode: savedEpisode });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get all events for a specific episode
  router.get(
    "/episodes/:episodeId/events",
    authenticateUser,
    async (req, res) => {
      const { episodeId } = req.params;

      try {
        const events = await Event.find({ episode: episodeId }).populate(
          "star"
        );

        res.json({ events });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  // Create a new event for a specific episode
  router.post(
    "/episodes/:episodeId/events",
    authenticateUser,
    async (req, res) => {
      const { episodeId } = req.params;
      const { description, time, baseAmount, starId } = req.body;

      try {
        // Check if the episode exists
        const episode = await Episode.findById(episodeId);

        if (!episode) {
          return res.status(404).json({ message: "Episode not found" });
        }

        const newEvent = new Event({
          description,
          time,
          baseAmount,
          star: starId,
          episode: episodeId,
        });

        const savedEvent = await newEvent.save();
        res.status(201).json({ event: savedEvent });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  // GET current episode
  router.get("/episodes/current", authenticateUser, async (req, res) => {
    try {
      const episode = await Episode.findOne({ current: true });
      res.json({ episode });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Assign current episode
  router.post("/episodes/current", authenticateUser, async (req, res) => {
    const { episodeId } = req.body;

    try {
      const episode = await Episode.findById(episodeId);

      if (!episode) {
        return res.status(404).json({ message: "Episode not found" });
      }

      episode.current = true;

      await episode.save();

      await Episode.updateMany(
        { _id: { $ne: episode._id } },
        { $set: { current: false } }
      );

      res.json({ episode });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return router;
};

export default episodeRoutes;
