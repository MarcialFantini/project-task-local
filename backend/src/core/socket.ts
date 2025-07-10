import { Server as HttpServer } from "http";
import { Server, ServerOptions } from "socket.io";

const options: Partial<ServerOptions> = {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
};

// Esta función desacopla la creación del servidor de Socket.IO.
export const initializeSocketIO = (httpServer: HttpServer) => {
  const io = new Server(httpServer, options);
  return io;
};
