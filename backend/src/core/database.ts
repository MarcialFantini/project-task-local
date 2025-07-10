import { PrismaClient } from "@prisma/client";

// Se exporta una única instancia para ser usada en toda la aplicación (patrón Singleton).
export const prisma = new PrismaClient();
