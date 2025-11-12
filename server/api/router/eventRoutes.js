import { prisma } from "../../index.js";
import { authenticateUser } from "./authMiddleware.js";

const eventRoutes = (router) => {
  router.get("/events", authenticateUser, async (req, res) => {
    try {
      const events = await prisma.event.findMany({
        include: { star: true },
      });

      res.json({ events });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  router.post("/events", authenticateUser, async (req, res) => {
    const { description, time, baseAmount, starId, episodeId } = req.body;

    try {
      if (!starId) {
        return res.status(400).json({ message: "Star ID required" });
      }

      const parsedStarId = parseInt(starId);
      const parsedEpisodeId = episodeId ? parseInt(episodeId) : null;

      // Check if star exists
      const star = await prisma.star.findUnique({
        where: { id: parsedStarId },
      });

      if (!star) {
        return res.status(404).json({ message: "Star not found" });
      }

      const newEvent = await prisma.event.create({
        data: {
          description,
          time,
          baseAmount,
          starId: parsedStarId,
          episodeId: parsedEpisodeId,
        },
        include: { star: true },
      });

      res.status(201).json({ event: newEvent });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return router;
};

export default eventRoutes;
