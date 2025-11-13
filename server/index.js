import express from "express";
// import listEndpoints from "express-list-endpoints";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import sockets from "./socket/index.js";
import { PrismaClient } from "@prisma/client";
import router from "./api/router/index.js";
import cors from "cors";

// Initialize Prisma Client
export const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 8000;

// CORS configuration - allow both local and production domains
const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or Postman)
      if (!origin) return callback(null, true);

      // In production, allow requests from the same origin (Railway deployment)
      // Extract the host from the origin and check if it's a Railway app
      if (origin && (origin.includes('.railway.app') || origin.includes('.up.railway.app'))) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      // Allow requests with no origin
      if (!origin) return callback(null, true);

      // Allow Railway deployments
      if (origin && (origin.includes('.railway.app') || origin.includes('.up.railway.app'))) {
        return callback(null, true);
      }

      // Allow configured origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  },
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the React app build directory
const clientBuildPath = path.join(__dirname, "../client/build");
app.use(express.static(clientBuildPath));

// API routes
app.use("/api", router);

// Catch-all route to serve React app for client-side routing
app.get("*", (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

io.on("connection", sockets);

httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Graceful shutdown - disconnect Prisma when process exits
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

// const routes = listEndpoints(app);
