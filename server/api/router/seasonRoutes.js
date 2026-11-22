import { prisma } from "../../index.js";
import { authenticateUser, requireAdmin } from "./authMiddleware.js";
import { getCurrentSeason } from "../../helpers/season.js";

const seasonRoutes = (router) => {
  // Get all seasons
  router.get("/seasons", authenticateUser, async (req, res) => {
    try {
      const seasons = await prisma.season.findMany({
        orderBy: { number: "desc" },
      });
      res.json({ seasons });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get the current season
  router.get("/seasons/current", authenticateUser, async (req, res) => {
    try {
      const season = await getCurrentSeason();
      res.json({ season });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Start a new season: creates the season, its bakers, and makes it current.
  // Body: { number, year, bakers: [{ firstName, lastName? }] }
  router.post("/seasons", authenticateUser, requireAdmin, async (req, res) => {
    const { number, year, bakers = [] } = req.body;
    const seasonNumber = parseInt(number);

    if (isNaN(seasonNumber)) {
      return res.status(400).json({ message: "Season number required" });
    }

    const cleanBakers = bakers
      .map((b) => ({
        firstName: (b.firstName || "").trim(),
        lastName: (b.lastName || "").trim(),
        imageUrl: b.imageUrl || null,
      }))
      .filter((b) => b.firstName);

    try {
      const existing = await prisma.season.findUnique({
        where: { number: seasonNumber },
      });
      if (existing) {
        return res
          .status(409)
          .json({ message: `Season ${seasonNumber} already exists` });
      }

      const season = await prisma.$transaction(async (tx) => {
        await tx.season.updateMany({ data: { current: false } });
        await tx.episode.updateMany({ data: { current: false } });

        const newSeason = await tx.season.create({
          data: {
            number: seasonNumber,
            year: year ? parseInt(year) : null,
            current: true,
          },
        });

        if (cleanBakers.length > 0) {
          await tx.star.createMany({
            data: cleanBakers.map((b) => ({ ...b, seasonId: newSeason.id })),
          });
        }

        return newSeason;
      });

      res.status(201).json({ season });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return router;
};

export default seasonRoutes;
