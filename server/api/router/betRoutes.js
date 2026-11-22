import { prisma } from "../../index.js";
import { authenticateUser, requireAdmin } from "./authMiddleware.js";
import { getCurrentEpisode } from "../../helpers/season.js";
import { validateBetTerms } from "../../helpers/bets.js";

const betInclude = {
  better: true,
  eligibleUsers: true,
  acceptedUsers: true,
};

const betRoutes = (router) => {
  // GET all bets for an episode (default: current episode)
  router.get("/bets", authenticateUser, async (req, res) => {
    try {
      const episodeParam = req.query.episodeId;
      let episodeId;

      if (episodeParam && episodeParam !== "undefined") {
        episodeId = parseInt(episodeParam);
      } else {
        episodeId = (await getCurrentEpisode())?.id;
      }

      if (!episodeId) return res.json({ bets: [] });

      const bets = await prisma.bet.findMany({
        where: { episode: episodeId },
        include: betInclude,
      });

      res.json({ bets });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create a bet for the current episode
  router.post("/bets", authenticateUser, async (req, res) => {
    const { description, odds, maxLose, eligibleUsers = [] } = req.body;

    try {
      const currentEpisode = await getCurrentEpisode();
      if (!currentEpisode) {
        return res.status(400).json({ message: "No current episode" });
      }

      if (!description || !description.trim()) {
        return res.status(400).json({ message: "Description required" });
      }

      const termsError = await validateBetTerms({
        odds,
        maxLose,
        userId: req.sessionUser.id,
      });
      if (termsError) return res.status(400).json({ message: termsError });

      const newBet = await prisma.bet.create({
        data: {
          description: description.trim(),
          odds: parseFloat(odds),
          maxLose: parseFloat(maxLose),
          betterId: req.sessionUser.id,
          episode: currentEpisode.id,
          eligibleUsers: {
            connect: eligibleUsers
              .filter((id) => id && id !== req.sessionUser.id)
              .map((userId) => ({ id: userId })),
          },
        },
        include: betInclude,
      });

      res.status(201).json({ bet: newBet });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Accept a bet (only open bets in the current episode)
  router.post("/bets/:betId/accept", authenticateUser, async (req, res) => {
    const betId = parseInt(req.params.betId);
    const userId = req.sessionUser.id;

    try {
      const bet = await prisma.bet.findUnique({
        where: { id: betId },
        include: { eligibleUsers: true, acceptedUsers: true },
      });

      if (!bet) {
        return res.status(404).json({ message: "Bet not found" });
      }

      if (bet.betterId === userId) {
        return res.status(400).json({ message: "You cannot accept your own bet" });
      }

      if (bet.won !== null) {
        return res.status(400).json({ message: "This bet is already settled" });
      }

      const currentEpisode = await getCurrentEpisode();
      if (!currentEpisode || bet.episode !== currentEpisode.id) {
        return res
          .status(400)
          .json({ message: "You can only accept bets for the current episode" });
      }

      const isEligible = bet.eligibleUsers.some((user) => user.id === userId);
      if (!isEligible) {
        return res.status(403).json({ message: "You are not eligible for this bet" });
      }

      const alreadyAccepted = bet.acceptedUsers.some((user) => user.id === userId);
      if (alreadyAccepted) {
        return res.status(400).json({ message: "You have already accepted this bet" });
      }

      const updatedBet = await prisma.bet.update({
        where: { id: betId },
        data: { acceptedUsers: { connect: { id: userId } } },
        include: betInclude,
      });

      res.json({ bet: updatedBet });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Edit bet details (owner only, before anyone accepts and before it is settled)
  router.patch("/bets/:betId", authenticateUser, async (req, res) => {
    const betId = parseInt(req.params.betId);
    const { description, odds, maxLose, eligibleUsers } = req.body;

    try {
      const bet = await prisma.bet.findUnique({
        where: { id: betId },
        include: { acceptedUsers: true },
      });

      if (!bet) {
        return res.status(404).json({ message: "Bet not found" });
      }

      if (bet.betterId !== req.sessionUser.id) {
        return res.status(403).json({ message: "You can only edit your own bets" });
      }

      if (bet.won !== null) {
        return res.status(400).json({ message: "This bet is already settled" });
      }

      const termsChange = odds !== undefined || maxLose !== undefined;
      if (termsChange && bet.acceptedUsers.length > 0) {
        return res.status(400).json({
          message: "You cannot change odds or amount after someone accepts the bet",
        });
      }

      if (termsChange) {
        const termsError = await validateBetTerms({
          odds: odds ?? bet.odds,
          maxLose: maxLose ?? bet.maxLose,
          userId: req.sessionUser.id,
        });
        if (termsError) return res.status(400).json({ message: termsError });
      }

      const updateData = {};
      if (description !== undefined) updateData.description = description;
      if (odds !== undefined) updateData.odds = parseFloat(odds);
      if (maxLose !== undefined) updateData.maxLose = parseFloat(maxLose);

      if (eligibleUsers !== undefined) {
        // Keep users who already accepted
        const ids = new Set(
          eligibleUsers.filter((id) => id && id !== bet.betterId)
        );
        bet.acceptedUsers.forEach((u) => ids.add(u.id));
        updateData.eligibleUsers = {
          set: [...ids].map((userId) => ({ id: userId })),
        };
      }

      const updatedBet = await prisma.bet.update({
        where: { id: betId },
        data: updateData,
        include: betInclude,
      });

      res.json({ bet: updatedBet });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Set bet won/lost status (admin only)
  router.put("/bets/:betId", authenticateUser, requireAdmin, async (req, res) => {
    const betId = parseInt(req.params.betId);
    const { won } = req.body;

    try {
      const updatedBet = await prisma.bet.update({
        where: { id: betId },
        data: { won: won === null ? null : Boolean(won) },
        include: betInclude,
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

  // Delete a bet: admin, or the owner before anyone accepts it
  router.delete("/bets/:betId", authenticateUser, async (req, res) => {
    const betId = parseInt(req.params.betId);

    try {
      const bet = await prisma.bet.findUnique({
        where: { id: betId },
        include: { acceptedUsers: true },
      });

      if (!bet) {
        return res.status(404).json({ message: "Bet not found" });
      }

      const isOwner = bet.betterId === req.sessionUser.id;
      const ownerCanDelete =
        isOwner && bet.acceptedUsers.length === 0 && bet.won === null;

      if (!req.sessionUser.isAdmin && !ownerCanDelete) {
        return res.status(403).json({
          message: isOwner
            ? "You cannot delete a bet after someone accepts it"
            : "You can only delete your own bets",
        });
      }

      await prisma.bet.delete({ where: { id: betId } });

      res.json({ message: "Bet deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return router;
};

export default betRoutes;
