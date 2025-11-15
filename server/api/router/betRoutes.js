import { prisma } from "../../index.js";
import { authenticateUser } from "./authMiddleware.js";

const betRoutes = (router) => {
  // GET all bets
  router.get("/bets", authenticateUser, async (req, res) => {
    try {
      const episodeParam = req.query.episodeId;
      let episodeNumber;

      if (episodeParam && episodeParam !== "undefined") {
        episodeNumber = parseInt(episodeParam);
      } else {
        const latestEpisode = await prisma.episode.findFirst({
          orderBy: { number: "desc" },
        });
        episodeNumber = latestEpisode?.number;
      }

      const bets = await prisma.bet.findMany({
        where: { episode: episodeNumber },
        include: {
          better: true,
          eligibleUsers: true,
          acceptedUsers: true,
        },
      });

      res.json({ bets });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create a bet
  router.post("/bets", authenticateUser, async (req, res) => {
    const { description, odds, maxLose, eligibleUsers } = req.body;

    try {
      const latestEpisode = await prisma.episode.findFirst({
        orderBy: { number: "desc" },
      });

      const newBet = await prisma.bet.create({
        data: {
          description,
          odds,
          maxLose,
          betterId: req.sessionUser.id,
          episode: latestEpisode.number,
          eligibleUsers: {
            connect: eligibleUsers.filter(Boolean).map((userId) => ({ id: userId })),
          },
        },
        include: {
          better: true,
          eligibleUsers: true,
          acceptedUsers: true,
        },
      });

      res.status(201).json({ bet: newBet });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Accept a bet
  router.post("/bets/:betId/accept", authenticateUser, async (req, res) => {
    const betId = parseInt(req.params.betId);
    const userId = req.sessionUser.id;

    try {
      // Check if user is eligible for this bet
      const bet = await prisma.bet.findUnique({
        where: { id: betId },
        include: {
          eligibleUsers: true,
          acceptedUsers: true,
        },
      });

      if (!bet) {
        return res.status(404).json({ message: "Bet not found" });
      }

      const isEligible = bet.eligibleUsers.some(user => user.id === userId);
      if (!isEligible) {
        return res.status(403).json({ message: "You are not eligible for this bet" });
      }

      const alreadyAccepted = bet.acceptedUsers.some(user => user.id === userId);
      if (alreadyAccepted) {
        return res.status(400).json({ message: "You have already accepted this bet" });
      }

      // Add user to acceptedUsers
      const updatedBet = await prisma.bet.update({
        where: { id: betId },
        data: {
          acceptedUsers: {
            connect: { id: userId },
          },
        },
        include: {
          better: true,
          eligibleUsers: true,
          acceptedUsers: true,
        },
      });

      res.json({ bet: updatedBet });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  router.put("/bets/:betId", authenticateUser, async (req, res) => {
    const betId = parseInt(req.params.betId);
    const { won } = req.body;

    try {
      const updatedBet = await prisma.bet.update({
        where: { id: betId },
        data: { won },
        include: {
          better: true,
          eligibleUsers: true,
          acceptedUsers: true,
        },
      });

      res.json({ bet: updatedBet });
    } catch (error) {
      if (error.code === "P2025") {
        return res.status(404).json({ message: "Bet not found" });
      }
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  router.delete("/bets/:betId", authenticateUser, async (req, res) => {
    const betId = parseInt(req.params.betId);

    try {
      await prisma.bet.delete({
        where: { id: betId },
      });

      res.json({ message: "Bet deleted successfully" });
    } catch (error) {
      if (error.code === "P2025") {
        return res.status(404).json({ message: "Bet not found" });
      }
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return router;
};

export default betRoutes;
