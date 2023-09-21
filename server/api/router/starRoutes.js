import Star from "../../models/Star.js";
import { v4 as uuidv4 } from "uuid";
import User from "../../models/User.js";
import Session from "../../models/Session.js";
import { authenticateUser } from "./authMiddleware.js";

const starRoutes = (router) => {
  router.get("/stars", async (req, res) => {
    try {
      const stars = await Star.find();
      res.json({ stars });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  router.post("/stars", async (req, res) => {
    const { firstName, lastName, bio } = req.body;

    const sessionToken = req.headers.authorization.split(" ")[1];

    try {
      const session = await Session.findOne({ token: sessionToken });

      if (!session) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const newStar = new Star({
        id: uuidv4(),
        firstName,
        lastName,
        bio,
      });

      const savedStar = await newStar.save();
      res.status(201).json({ star: savedStar });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  router.delete("/stars/:id", async (req, res) => {
    const { id } = req.params;

    try {
      const star = await Star.findById(id);

      if (!star) {
        return res.status(404).json({ message: "Star not found" });
      }

      await Star.findByIdAndDelete(id);

      res.json({ message: "Star deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  router.put("/stars/sendHome/:id", async (req, res) => {
    const { id } = req.params;

    try {
      const star = await Star.findById(id);

      if (!star) {
        return res.status(404).json({ message: "Star not found" });
      }

      star.sentHome = !star.sentHome;
      await star.save();
      res.json({ star });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return router;
};

export default starRoutes;
