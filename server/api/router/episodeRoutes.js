import { prisma } from "../../index.js";
import { authenticateUser } from "./authMiddleware.js";
import { getSplit } from "../../helpers/splits.js";
import { getCurrentSeason, getCurrentEpisode } from "../../helpers/season.js";

const episodeRoutes = (router) => {
  // Get all episodes for a season (default: current season)
  router.get("/episodes", authenticateUser, async (req, res) => {
    try {
      const seasonId = req.query.seasonId
        ? parseInt(req.query.seasonId)
        : (await getCurrentSeason())?.id;
      if (!seasonId) return res.json({ episodes: [] });
      const episodes = await prisma.episode.findMany({
        where: { seasonId },
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
      const season = await getCurrentSeason();
      if (!season) {
        return res.status(400).json({ message: "No current season" });
      }

      const newEpisode = await prisma.episode.create({
        data: { number, hasAired, seasonId: season.id },
      });

      // Determine which stars to include in this episode
      let starsForEpisode = [];
      if (number > 1) {
        // For subsequent episodes, copy stars from previous episode
        const previousEpisode = await prisma.episode.findUnique({
          where: { seasonId_number: { seasonId: season.id, number: number - 1 } },
        });
        if (previousEpisode) {
          const previousEpisodeStars = await prisma.episodeStar.findMany({
            where: { episodeId: previousEpisode.id },
            include: { star: true },
          });
          starsForEpisode = previousEpisodeStars.map((es) => es.star);
        }
      }
      // Episode 1, or no previous episode stars: use all active season stars
      if (starsForEpisode.length === 0) {
        starsForEpisode = await prisma.star.findMany({
          where: { active: true, seasonId: season.id },
          orderBy: { id: "asc" },
        });
      }

      // Create episode-star relationships
      const episodeStarsData = starsForEpisode.map((star) => ({
        episodeId: newEpisode.id,
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
            episode: newEpisode.id,
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
      const episodeKey = parseInt(episodeId);

      try {
        const events = await prisma.event.findMany({
          where: { episodeId: episodeKey },
          include: {
            star: true,
            eventType: true,
          },
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
      const episodeKey = parseInt(episodeId);
      const { eventTypeId, time, starId } = req.body;

      try {
        // Check if the episode exists
        const episode = await prisma.episode.findUnique({
          where: { id: episodeKey },
        });

        if (!episode) {
          return res.status(404).json({ message: "Episode not found" });
        }

        if (!eventTypeId) {
          return res.status(400).json({ message: "Event type ID required" });
        }

        const parsedEventTypeId = parseInt(eventTypeId);

        // Check if event type exists
        const eventType = await prisma.eventType.findUnique({
          where: { id: parsedEventTypeId },
        });

        if (!eventType) {
          return res.status(404).json({ message: "Event type not found" });
        }

        const newEvent = await prisma.event.create({
          data: {
            eventTypeId: parsedEventTypeId,
            time,
            starId: starId ? parseInt(starId) : null,
            episodeId: episodeKey,
          },
          include: {
            star: true,
            eventType: true,
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
      const episode = await getCurrentEpisode();
      res.json({ episode });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Assign current episode
  router.post("/episodes/current", authenticateUser, async (req, res) => {
    const { episodeId } = req.body;
    const episodeKey = parseInt(episodeId);

    try {
      const episode = await prisma.episode.findUnique({
        where: { id: episodeKey },
      });

      if (!episode) {
        return res.status(404).json({ message: "Episode not found" });
      }

      // Set all episodes to not current
      await prisma.episode.updateMany({
        where: { id: { not: episodeKey } },
        data: { current: false },
      });

      // Set this episode to current
      const updatedEpisode = await prisma.episode.update({
        where: { id: episodeKey },
        data: { current: true },
      });

      res.json({ episode: updatedEpisode });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get stars for a specific episode
  router.get(
    "/episodes/:episodeId/stars",
    authenticateUser,
    async (req, res) => {
      const { episodeId } = req.params;
      const episodeKey = parseInt(episodeId);

      try {
        const episodeStars = await prisma.episodeStar.findMany({
          where: { episodeId: episodeKey },
          include: { star: true },
        });

        const stars = episodeStars.map((es) => es.star);
        res.json({ stars });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  // Update stars for a specific episode
  router.put(
    "/episodes/:episodeId/stars",
    authenticateUser,
    async (req, res) => {
      const { episodeId } = req.params;
      const episodeKey = parseInt(episodeId);
      const { starIds } = req.body; // Array of star IDs

      try {
        // Delete all existing episode-star relationships for this episode
        await prisma.episodeStar.deleteMany({
          where: { episodeId: episodeKey },
        });

        // Create new episode-star relationships
        const episodeStarsData = starIds.map((starId) => ({
          episodeId: episodeKey,
          starId: parseInt(starId),
        }));

        await prisma.episodeStar.createMany({
          data: episodeStarsData,
        });

        // Fetch and return the updated stars
        const episodeStars = await prisma.episodeStar.findMany({
          where: { episodeId: episodeKey },
          include: { star: true },
        });

        const stars = episodeStars.map((es) => es.star);
        res.json({ stars });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  router.post(
    "/episodes/:episodeId/calculateDeltas",
    authenticateUser,
    async (req, res) => {
      const { episodeId } = req.params;
      const { force } = req.body; // Allow forcing calculation even if users haven't ranked
      const episodeKey = parseInt(episodeId);

      const episode = await prisma.episode.findUnique({
        where: { id: episodeKey },
      });

      if (!episode) {
        return res.status(404).json({ message: "Episode not found" });
      }

      // get all rankings and calculate deltas
      const allUsers = await prisma.user.findMany({
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      });

      // Check if all users have rankings for this episode
      if (!force) {
        const usersWithoutRankings = [];
        for (const user of allUsers) {
          const userRankings = await prisma.ranking.findMany({
            where: {
              userId: user.id,
              episode: episodeKey,
            },
          });

          if (userRankings.length === 0) {
            usersWithoutRankings.push({
              id: user.id,
              name: `${user.firstName} ${user.lastName}`,
            });
          }
        }

        if (usersWithoutRankings.length > 0) {
          return res.status(400).json({
            error: "USERS_WITHOUT_RANKINGS",
            message: "Some users have not set their rankings for this episode",
            usersWithoutRankings,
          });
        }
      }
      const eventsForEpisode = await prisma.event.findMany({
        where: { episodeId: episodeKey },
        include: {
          star: true,
          eventType: true,
        },
      });
      const episodeStarCount = await prisma.episodeStar.count({
        where: { episodeId: episodeKey },
      });

      const userDeltaPromises = allUsers.map(async (user) => {
        let totalDelta = 0;

        const rankings = await prisma.ranking.findMany({
          where: {
            userId: user.id,
            episode: episode.id,
          },
          include: { star: true },
        });

        const userBets = await prisma.bet.findMany({
          where: {
            OR: [
              { betterId: user.id },
              { acceptedUsers: { some: { id: user.id } } },
            ],
            episode: episode.id,
          },
          include: {
            better: true,
            acceptedUsers: true,
          },
        });

        for (const userBet of userBets) {
          const { better, won, maxLose, odds, acceptedUsers } = userBet;

          // Skip if bet hasn't been resolved yet
          if (won === null) continue;

          const isUserBetter = better.id === user.id;

          let deltaChange = 0;
          if (isUserBetter) {
            // Better wins: gets maxLose from each accepted user, multiplied by inverse odds
            // Better loses: loses maxLose to each accepted user
            deltaChange = won
              ? maxLose * acceptedUsers.length * (1 / odds)
              : -maxLose * acceptedUsers.length;
          } else {
            // Acceptor wins (bet lost): gets maxLose from better
            // Acceptor loses (bet won): loses maxLose * (1/odds) to better
            deltaChange = won ? -maxLose * (1 / odds) : maxLose;
          }

          totalDelta += deltaChange;
        }

        const split = getSplit(rankings.length) || getSplit(episodeStarCount);
        for (const ranking of rankings) {
          const { rank } = ranking;
          const multiplier = split?.[split.length - rank] ?? 0;

          const eventsForStar = eventsForEpisode.filter((event) => {
            return event.star && event.star.id === ranking.star.id;
          });
          const total = eventsForStar.reduce((acc, event) => {
            return acc + (event.eventType?.value || 0);
          }, 0);
          const delta = multiplier * total;
          totalDelta += delta;
        }

        await prisma.userDelta.upsert({
          where: {
            userId_episodeId: {
              userId: user.id,
              episodeId: episodeKey,
            },
          },
          update: {
            delta: totalDelta,
          },
          create: {
            userId: user.id,
            episodeId: episodeKey,
            delta: totalDelta,
          },
        });

        return totalDelta;
      });

      await Promise.all(userDeltaPromises);

      res.json({});
    }
  );

  // Clear deltas for a specific episode
  router.delete(
    "/episodes/:episodeId/deltas",
    authenticateUser,
    async (req, res) => {
      const { episodeId } = req.params;
      const episodeKey = parseInt(episodeId);

      try {
        const episode = await prisma.episode.findUnique({
          where: { id: episodeKey },
        });

        if (!episode) {
          return res.status(404).json({ message: "Episode not found" });
        }

        // Delete all user deltas for this episode
        await prisma.userDelta.deleteMany({
          where: { episodeId: episodeKey },
        });

        res.json({ message: "Deltas cleared successfully" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  return router;
};

export default episodeRoutes;
