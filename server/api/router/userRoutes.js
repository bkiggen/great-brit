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

  // GET USERS BALANCE DATA
  router.get("/users/balanceHistory", authenticateUser, async (req, res) => {
    const { id } = req.query;

    // Only allow users to access their own balance history
    if (id && id !== req.sessionUser.id) {
      return res.status(403).json({ message: "Forbidden: Cannot access other users' data" });
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
    const { firstName, lastName, email, password } = req.body;

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

      res.json({ user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get all users with rankings for a specific episode
  router.get("/users/usersWithRankings/:episodeId", authenticateUser, async (req, res) => {
    const { episodeId } = req.params;
    const episodeNumber = parseInt(episodeId);

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
  });

  // Update User
  router.patch("/users", authenticateUser, async (req, res) => {
    const { _id, firstName, lastName, email } = req.query;

    // Only allow users to update their own profile
    if (_id !== req.sessionUser.id) {
      return res.status(403).json({ message: "Forbidden: Cannot update other users' profiles" });
    }

    const user = await prisma.user.update({
      where: { id: _id },
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

  return router;
};

export default userRoutes;
