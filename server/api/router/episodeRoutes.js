import { prisma } from "../../index.js";
import { authenticateUser } from "./authMiddleware.js";
import { splitArraysByLength } from "../../helpers/splits.js";

const episodeRoutes = (router) => {
  // Get all episodes
  router.get("/episodes", authenticateUser, async (req, res) => {
    try {
      const episodes = await prisma.episode.findMany({
        orderBy: { number: "asc" },
      });
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
      const newEpisode = await prisma.episode.create({
        data: { number, hasAired },
      });

      // Delete rankings for episode 3 (legacy cleanup)
      await prisma.ranking.deleteMany({ where: { episode: 3 } });

      // Determine which stars to include in this episode
      let starsForEpisode;
      if (number === 1) {
        // For episode 1, include all active stars
        starsForEpisode = await prisma.star.findMany({ where: { active: true } });
      } else {
        // For subsequent episodes, copy stars from previous episode
        const previousEpisodeStars = await prisma.episodeStar.findMany({
          where: { episodeId: number - 1 },
          include: { star: true },
        });
        starsForEpisode = previousEpisodeStars.map(es => es.star);

        // If no previous episode stars found, fall back to all active stars
        if (starsForEpisode.length === 0) {
          starsForEpisode = await prisma.star.findMany({ where: { active: true } });
        }
      }

      // Create episode-star relationships
      const episodeStarsData = starsForEpisode.map(star => ({
        episodeId: newEpisode.number,
        starId: star.id,
      }));
      await prisma.episodeStar.createMany({ data: episodeStarsData });

      // Create default rankings for each user and stars in this episode
      const allUsers = await prisma.user.findMany();

      const rankingsToCreate = [];
      for (const user of allUsers) {
        for (let index = 0; index < starsForEpisode.length; index++) {
          rankingsToCreate.push({
            userId: user.id,
            starId: starsForEpisode[index].id,
            rank: index + 1,
            episode: newEpisode.number,
          });
        }
      }

      await prisma.ranking.createMany({ data: rankingsToCreate });

      res.status(201).json({ episode: newEpisode });
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
      const episodeNumber = parseInt(episodeId);

      try {
        const events = await prisma.event.findMany({
          where: { episodeId: episodeNumber },
          include: { star: true },
        });

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
      const episodeNumber = parseInt(episodeId);
      const { description, time, baseAmount, starId } = req.body;

      try {
        // Check if the episode exists
        const episode = await prisma.episode.findUnique({
          where: { number: episodeNumber },
        });

        if (!episode) {
          return res.status(404).json({ message: "Episode not found" });
        }

        const newEvent = await prisma.event.create({
          data: {
            description,
            time,
            baseAmount,
            starId: starId ? parseInt(starId) : null,
            episodeId: episodeNumber,
          },
        });

        res.status(201).json({ event: newEvent });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  // GET current episode
  router.get("/episodes/current", authenticateUser, async (req, res) => {
    try {
      const episode = await prisma.episode.findFirst({
        where: { current: true },
      });
      res.json({ episode });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Assign current episode
  router.post("/episodes/current", authenticateUser, async (req, res) => {
    const { episodeId } = req.body;
    const episodeNumber = parseInt(episodeId);

    try {
      const episode = await prisma.episode.findUnique({
        where: { number: episodeNumber },
      });

      if (!episode) {
        return res.status(404).json({ message: "Episode not found" });
      }

      // Set all episodes to not current
      await prisma.episode.updateMany({
        where: { number: { not: episodeNumber } },
        data: { current: false },
      });

      // Set this episode to current
      const updatedEpisode = await prisma.episode.update({
        where: { number: episodeNumber },
        data: { current: true },
      });

      res.json({ episode: updatedEpisode });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get stars for a specific episode
  router.get("/episodes/:episodeId/stars", authenticateUser, async (req, res) => {
    const { episodeId } = req.params;
    const episodeNumber = parseInt(episodeId);

    try {
      const episodeStars = await prisma.episodeStar.findMany({
        where: { episodeId: episodeNumber },
        include: { star: true },
      });

      const stars = episodeStars.map(es => es.star);
      res.json({ stars });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update stars for a specific episode
  router.put("/episodes/:episodeId/stars", authenticateUser, async (req, res) => {
    const { episodeId } = req.params;
    const episodeNumber = parseInt(episodeId);
    const { starIds } = req.body; // Array of star IDs

    try {
      // Delete all existing episode-star relationships for this episode
      await prisma.episodeStar.deleteMany({
        where: { episodeId: episodeNumber },
      });

      // Create new episode-star relationships
      const episodeStarsData = starIds.map(starId => ({
        episodeId: episodeNumber,
        starId: parseInt(starId),
      }));

      await prisma.episodeStar.createMany({
        data: episodeStarsData,
      });

      // Fetch and return the updated stars
      const episodeStars = await prisma.episodeStar.findMany({
        where: { episodeId: episodeNumber },
        include: { star: true },
      });

      const stars = episodeStars.map(es => es.star);
      res.json({ stars });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  router.post("/episodes/:episodeId/calculateDeltas", authenticateUser, async (req, res) => {
    const { episodeId } = req.params;
    const episodeNumber = parseInt(episodeId);

    const episode = await prisma.episode.findUnique({
      where: { number: episodeNumber },
    });

    if (!episode) {
      return res.status(404).json({ message: "Episode not found" });
    }

    // get all rankings and calculate deltas
    const allUsers = await prisma.user.findMany();
    const eventsForEpisode = await prisma.event.findMany({
      where: { episodeId: episodeNumber },
      include: { star: true },
    });
    const split = splitArraysByLength[episode.number];

    const userDeltaPromises = allUsers.map(async (user) => {
      let totalDelta = 0;

      const rankings = await prisma.ranking.findMany({
        where: {
          userId: user.id,
          episode: episode.number,
        },
        include: { star: true },
      });

      const userBets = await prisma.bet.findMany({
        where: {
          OR: [
            { betterId: user.id },
            { eligibleUsers: { some: { id: user.id } } },
          ],
          episode: episode.number,
        },
        include: {
          better: true,
          eligibleUsers: true,
        },
      });

      for (const userBet of userBets) {
        const { better, won, maxLose, odds, eligibleUsers } = userBet;
        const isUserBetter = better.id === user.id;

        let deltaChange = 0;
        if (isUserBetter) {
          deltaChange = won
            ? maxLose * eligibleUsers.length * (1 / odds)
            : -maxLose * eligibleUsers.length;
        } else {
          deltaChange = won ? -maxLose * (1 / odds) : maxLose;
        }

        totalDelta += deltaChange;
      }

      for (const ranking of rankings) {
        const { rank } = ranking;
        const multiplier = split[split.length - rank];

        const eventsForStar = eventsForEpisode.filter((event) => {
          return event.star && event.star.id === ranking.star.id;
        });
        const total = eventsForStar.reduce((acc, event) => {
          return acc + event.baseAmount;
        }, 0);
        const delta = multiplier * total;
        totalDelta += delta;
      }

      await prisma.userDelta.upsert({
        where: {
          userId_episodeId: {
            userId: user.id,
            episodeId: episodeNumber,
          },
        },
        update: {
          delta: totalDelta,
        },
        create: {
          userId: user.id,
          episodeId: episodeNumber,
          delta: totalDelta,
        },
      });

      return totalDelta;
    });

    await Promise.all(userDeltaPromises);

    res.json({});
  });

  return router;
};

export default episodeRoutes;
