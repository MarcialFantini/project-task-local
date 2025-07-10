// src/index.ts
import express from "express";
import http from "http";
import cors from "cors";
import { initializeSocketIO } from "./core/socket";
import { apiRouter } from "./api.router";

const app = express();
const server = http.createServer(app);
const io = initializeSocketIO(server);

// Middleware global
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());

// Pasar 'io' a los routers para que los servicios puedan emitir eventos
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Rutas de la API
app.use("/api", apiRouter);

// Lógica de conexión de Socket.IO
io.on("connection", (socket) => {
  console.log(`✅ Cliente conectado: ${socket.id}`);
  socket.on("disconnect", () => {
    console.log(`❌ Cliente desconectado: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(
    `🚀 Servidor refactorizado corriendo en http://localhost:${PORT}`
  );
});
