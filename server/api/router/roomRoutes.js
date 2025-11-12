import { prisma } from "../../index.js";
import { authenticateUser } from "./authMiddleware.js";

const roomRoutes = (router) => {
  router.get("/rooms", authenticateUser, async (req, res) => {
    const rooms = await prisma.room.findMany();
    res.json({ rooms });
  });

  return router;
};

export default roomRoutes;
