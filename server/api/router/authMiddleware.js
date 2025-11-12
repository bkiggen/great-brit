import { prisma } from "../../index.js";

export const authenticateUser = async (req, res, next) => {
  const sessionToken = req.headers.authorization?.split(" ")[1];

  if (!sessionToken) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const session = await prisma.session.findUnique({
      where: { token: sessionToken },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
    }

    req.sessionUser = session.user; // Attach the authenticated user to the request object
    next(); // Move to the next middleware or route handler
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
