import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";

import http from "http";
import { Server } from "socket.io";


const app = express();


dotenv.config();

// Connect Database
connectDB();


// Create HTTP Server
const server = http.createServer(app);

// Setup WebSocket Server
const io = new Server(server, {
  cors: {
    origin: "*", // Allow frontend to connect
  },
});

// Middleware to attach Socket.io to requests
app.use((req, res, next) => {
  req.io = io;
  next();
});

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});


// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


