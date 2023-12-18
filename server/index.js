import express from "express";
import listEndpoints from "express-list-endpoints";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import sockets from "./socket/index.js";
import mongoose from "mongoose";
import router from "./api/router/index.js";
import cors from "cors";

await mongoose.connect(
  "mongodb+srv://kiggen:bens12@cluster0.wpsgkxa.mongodb.net/?retryWrites=true&w=majority"
);

const app = express();
const PORT = 4000;

app.use(express.json());
app.use(cors());

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.use("/", router);

io.on("connection", sockets);

httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// const routes = listEndpoints(app);
