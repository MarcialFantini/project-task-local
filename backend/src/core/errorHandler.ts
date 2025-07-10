import { Response } from "express";
import { Prisma } from "@prisma/client";

// Tu manejador de errores, ahora aislado y reutilizable.
export const handleServerError = (res: Response, error: unknown) => {
  console.error("Ha ocurrido un error:", error);

  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025"
  ) {
    return res.status(404).json({
      success: false,
      message: "El registro solicitado no fue encontrado.",
    });
  }

  return res.status(500).json({
    success: false,
    message: "Ha ocurrido un error interno en el servidor.",
  });
};
