import { prisma } from "../../index.js";
import { authenticateUser } from "./authMiddleware.js";

const starRoutes = (router) => {
  router.get("/stars", authenticateUser, async (req, res) => {
    try {
      const stars = await prisma.star.findMany();
      res.json({ stars });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  router.post("/stars", authenticateUser, async (req, res) => {
    const { firstName, lastName, bio } = req.body;

    try {
      const newStar = await prisma.star.create({
        data: {
          firstName,
          lastName,
          bio,
        },
      });

      res.status(201).json({ star: newStar });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  router.put("/stars/:starId", authenticateUser, async (req, res) => {
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
