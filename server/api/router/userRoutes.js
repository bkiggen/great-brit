import User from "../../models/User.js";
import Session from "../../models/Session.js";
import Ranking from "../../models/Ranking.js";
import Episode from "../../models/Episode.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

const userRoutes = (router) => {
  // GET USERS
  router.get("/users", async (req, res) => {
    const users = await User.find();

    res.json({ users });
  });

  // CREATE USER
  router.post("/users", async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });

      await user.save();

      res.json({ user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get all users with rankings for a specific episode
  router.get("/users/usersWithRankings/:episodeId", async (req, res) => {
    const { episodeId } = req.params;
    const users = await User.find();
    const episode = await Episode.findOne({ _id: episodeId });

    const usersWithRankings = [];

    for (let user of users) {
      const rankings = await Ranking.find({
        episode: episode.number,
        userId: user._id,
      })
        .populate("starId")
        .sort({ rank: 1 });

      const userObject = user.toObject(); // Convert to plain object
      userObject.rankings = rankings; // Add rankings to the plain object
      usersWithRankings.push(userObject);
    }

    res.json({ users: usersWithRankings });
  });

  // Update User
  router.patch("/users", async (req, res) => {
    const { _id, firstName, lastName, email } = req.query;
    const user = await User.findOneAndUpdate(
      { _id },
      { firstName, lastName, email }
    );

    res.json({ user });
  });

  router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid password" });
      }

      const session = new Session({
        userId: user._id,
        token: uuidv4(),
      });
      await session.save();

      // Respond with user data and session token
      res.json({
        user: {
          id: user._id,
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
      const deletedSession = await Session.findOneAndDelete({
        token: sessionToken,
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
