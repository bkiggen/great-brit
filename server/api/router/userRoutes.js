import { prisma } from "../../index.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { authenticateUser } from "./authMiddleware.js";

const userRoutes = (router) => {
  // GET USERS
  router.get("/users", authenticateUser, async (req, res) => {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({ users });
  });

  // GET USERS LEADERBOARD
  router.get("/users/leaderboard", authenticateUser, async (req, res) => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          userDeltas: {
            select: {
              delta: true,
            },
          },
        },
      });

      // Calculate balance for each user (starting balance is 100)
      const leaderboard = users.map((user) => {
        const totalDelta = user.userDeltas.reduce(
          (sum, delta) => sum + delta.delta,
          0
        );
        return {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          balance: 100 + totalDelta,
        };
      });

      // Sort by balance in descending order
      leaderboard.sort((a, b) => b.balance - a.balance);

      res.json({ leaderboard });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // GET USERS BALANCE DATA
  router.get("/users/balanceHistory", authenticateUser, async (req, res) => {
    const { id } = req.query;

    // Only allow users to access their own balance history
    if (id && id !== req.sessionUser.id) {
      return res
        .status(403)
        .json({ message: "Forbidden: Cannot access other users' data" });
    }

    const userBalanceHistory = await prisma.userDelta.findMany({
      where: { userId: id || req.sessionUser.id },
      include: { episode: true },
      orderBy: { episodeId: "asc" },
    });

    res.json({ userBalanceHistory });
  });

  // CREATE USER
  router.post("/users", async (req, res) => {
    const { firstName, lastName, email, password, secret } = req.body;

    // Validate the secret code
    const requiredSecret = process.env.NEW_USER_SECRET;
    if (!secret || secret !== requiredSecret) {
      return res
        .status(403)
        .json({ message: "Invalid or missing secret code" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          password: hashedPassword,
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      // Create default rankings for all episodes
      const episodes = await prisma.episode.findMany({
        orderBy: { number: "asc" },
      });

      for (const episode of episodes) {
        // Get stars assigned to this episode
        const episodeStars = await prisma.episodeStar.findMany({
          where: { episodeId: episode.number },
          select: { starId: true },
        });

        if (episodeStars.length > 0) {
          // Create rankings for this episode
          const rankings = episodeStars.map((es, index) => ({
            userId: user.id,
            starId: es.starId,
            rank: index + 1,
            episode: episode.number,
          }));

          await prisma.ranking.createMany({
            data: rankings,
          });
        }
      }

      res.json({ user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get all users with rankings for a specific episode
  router.get(
    "/users/usersWithRankings/:episodeId",
    authenticateUser,
    async (req, res) => {
      const { episodeId } = req.params;
      const episodeNumber = parseInt(episodeId, 10);

      // Validate episode number
      if (isNaN(episodeNumber)) {
        return res.status(400).json({ message: "Invalid episode ID" });
      }

      try {
        const users = await prisma.user.findMany({
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            rankings: {
              where: { episode: episodeNumber },
              include: { star: true },
              orderBy: { rank: "asc" },
            },
            userDeltas: {
              where: { episodeId: episodeNumber },
            },
          },
        });

        const usersWithRankings = users.map((user) => ({
          ...user,
          delta: user.userDeltas[0]?.delta || null,
        }));

        res.json({ users: usersWithRankings });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  // Update User
  router.patch("/users", authenticateUser, async (req, res) => {
    const { id, firstName, lastName, email } = req.query;

    // Only allow users to update their own profile
    if (id !== req.sessionUser.id) {
      return res
        .status(403)
        .json({ message: "Forbidden: Cannot update other users' profiles" });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { firstName, lastName, email },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({ user });
  });

  // Update User Profile
  router.put("/user/profile", authenticateUser, async (req, res) => {
    const { firstName, lastName, email } = req.body;

    try {
      const user = await prisma.user.update({
        where: { id: req.sessionUser.id },
        data: { firstName, lastName, email },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      res.json({ user });
    } catch (error) {
      console.error(error);
      if (error.code === "P2002") {
        return res.status(400).json({ message: "Email already in use" });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Change Password
  router.put("/user/password", authenticateUser, async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
      const user = await prisma.user.findUnique({
        where: { id: req.sessionUser.id },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const passwordMatch = await bcrypt.compare(currentPassword, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await prisma.user.update({
        where: { id: req.sessionUser.id },
        data: { password: hashedPassword },
      });

      res.json({ message: "Password updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid password" });
      }

      const session = await prisma.session.create({
        data: {
          userId: user.id,
          token: uuidv4(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });

      // Respond with user data and session token
      res.json({
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
        sessionToken: session.token,
        expiresAt: session.expiresAt,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // LOG OUT
  router.post("/logout", async (req, res) => {
    const { sessionToken } = req.body;

    try {
      // Find and remove the session entry based on the provided token
      const deletedSession = await prisma.session.delete({
        where: { token: sessionToken },
      });

      if (!deletedSession) {
        return res.status(404).json({ message: "Session not found" });
      }

      res.json({ message: "Logged out successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Backfill rankings for users who don't have any
  router.post("/admin/backfill-rankings", authenticateUser, async (req, res) => {
    try {
      const results = {
        usersProcessed: 0,
        rankingsCreated: 0,
        details: [],
      };

      // Get all users
      const users = await prisma.user.findMany({
        select: { id: true, firstName: true, lastName: true },
      });

      results.usersProcessed = users.length;

      // Get all episodes
      const episodes = await prisma.episode.findMany({
        orderBy: { number: "asc" },
      });

      for (const user of users) {
        const userDetails = {
          user: `${user.firstName} ${user.lastName}`,
          episodes: [],
        };

        for (const episode of episodes) {
          // Check if user already has rankings for this episode
          const existingRankings = await prisma.ranking.findMany({
            where: {
              userId: user.id,
              episode: episode.number,
            },
          });

          if (existingRankings.length > 0) {
            userDetails.episodes.push({
              episode: episode.number,
              action: `Already has ${existingRankings.length} rankings`,
            });
            continue;
          }

          // Get stars assigned to this episode
          const episodeStars = await prisma.episodeStar.findMany({
            where: { episodeId: episode.number },
            select: { starId: true },
            orderBy: { starId: "asc" },
          });

          if (episodeStars.length === 0) {
            userDetails.episodes.push({
              episode: episode.number,
              action: "No stars assigned",
            });
            continue;
          }

          // Create rankings for this episode
          const rankings = episodeStars.map((es, index) => ({
            userId: user.id,
            starId: es.starId,
            rank: index + 1,
            episode: episode.number,
          }));

          await prisma.ranking.createMany({
            data: rankings,
          });

          results.rankingsCreated += rankings.length;
          userDetails.episodes.push({
            episode: episode.number,
            action: `Created ${rankings.length} rankings`,
          });
        }

        results.details.push(userDetails);
      }

      res.json({
        message: "Backfill complete",
        results,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return router;
};

export default userRoutes;
