import { prisma } from "../../index.js";
import { authenticateUser } from "./authMiddleware.js";

const eventRoutes = (router) => {
  // Get all event types
  router.get("/event-types", authenticateUser, async (req, res) => {
    try {
      const eventTypes = await prisma.eventType.findMany({
        orderBy: { description: "asc" },
      });

      res.json({ eventTypes });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  router.get("/events", authenticateUser, async (req, res) => {
    try {
      const events = await prisma.event.findMany({
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
  });

  router.post("/events", authenticateUser, async (req, res) => {
    const { eventTypeId, time, starId, episodeId } = req.body;

    try {
      if (!starId) {
        return res.status(400).json({ message: "Star ID required" });
      }

      if (!eventTypeId) {
        return res.status(400).json({ message: "Event type ID required" });
      }

      const parsedStarId = parseInt(starId);
      const parsedEpisodeId = episodeId ? parseInt(episodeId) : null;
      const parsedEventTypeId = parseInt(eventTypeId);

      // Check if star exists
      const star = await prisma.star.findUnique({
        where: { id: parsedStarId },
      });

      if (!star) {
        return res.status(404).json({ message: "Star not found" });
      }

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
          starId: parsedStarId,
          episodeId: parsedEpisodeId,
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
  });

  return router;
};

export default eventRoutes;
