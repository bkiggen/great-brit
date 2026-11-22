import { prisma } from "../../index.js";
import { authenticateUser, requireAdmin } from "./authMiddleware.js";
import { getCurrentSeason } from "../../helpers/season.js";

const starRoutes = (router) => {
  router.get("/stars", authenticateUser, async (req, res) => {
    try {
      const seasonId = req.query.seasonId
        ? parseInt(req.query.seasonId)
        : (await getCurrentSeason())?.id;
      const stars = await prisma.star.findMany({
        where: { seasonId },
        orderBy: { id: "asc" },
      });
      res.json({ stars });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  router.post("/stars", authenticateUser, requireAdmin, async (req, res) => {
    const { firstName, lastName, bio, imageUrl } = req.body;

    try {
      const season = await getCurrentSeason();
      if (!season) {
        return res.status(400).json({ message: "No current season" });
      }
      const newStar = await prisma.star.create({
        data: {
          firstName,
          lastName: lastName || "",
          bio,
          imageUrl: imageUrl || null,
          seasonId: season.id,
        },
      });

      res.status(201).json({ star: newStar });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  router.put("/stars/:starId", authenticateUser, requireAdmin, async (req, res) => {
    const starId = parseInt(req.params.starId);
    const { active } = req.body;

    try {
      const updatedStar = await prisma.star.update({
        where: { id: starId },
        data: { active },
      });

      res.json({ star: updatedStar });
    } catch (error) {
      if (error.code === "P2025") {
        return res.status(404).json({ message: "Star not found" });
      }
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return router;
};

export default starRoutes;
