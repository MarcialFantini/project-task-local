import { Server } from "socket.io";

// Extiende el objeto Request de Express para incluir nuestra propiedad 'io'.
declare global {
  namespace Express {
    export interface Request {
      io: Server;
    }
  }
}
