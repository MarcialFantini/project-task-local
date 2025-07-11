import { Prisma, Task } from "@prisma/client";
import { Server } from "socket.io";
import { prisma } from "../../core/database";

export class TaskService {
  async findAll() {
    return prisma.task.findMany({ orderBy: { order: "asc" } });
  }

  async create(data: Prisma.TaskCreateInput, io: Server) {
    const lastTask = await prisma.task.findFirst({
      where: { epicId: data.epic.connect?.id },
      orderBy: { order: "desc" },
    });
    const newOrder = lastTask ? lastTask.order + 1 : 0;

    const newTask = await prisma.task.create({
      data: {
        ...data,
        order: newOrder,
        status: data.status || "Por Hacer",
        priority: data.priority || "Media",
      },
    });

    io.emit("task:created", newTask);
    return newTask;
  }

  async update(id: string, data: Prisma.TaskUpdateInput, io: Server) {
    const updatedTask = await prisma.task.update({
      where: { id },
      data,
    });

    io.emit("task:updated", updatedTask);
    return updatedTask;
  }

  async remove(id: string, io: Server) {
    await prisma.task.deleteMany({ where: { id } });

    io.emit("task:deleted", { id });
  }

  async createManyFromText(epicId: string, bulkText: string, io: Server) {
    const lines = bulkText.split("\n").filter((line) => line.trim() !== "");
    if (lines.length === 0) {
      throw new Error("No se encontraron tareas válidas para crear.");
    }

    const lastTask = await prisma.task.findFirst({
      where: { epicId },
      orderBy: { order: "desc" },
    });
    const startingOrder = lastTask ? lastTask.order + 1 : 0;

    const tasksToCreate: Prisma.TaskCreateManyInput[] = [];
    const validPriorities = ["Alta", "Media", "Baja"];

    lines.forEach((line, index) => {
      const parts = line.split("-").map((p) => p.trim());
      const title = parts[0];

      if (title) {
        let description: string | null = null;
        let priority: "Alta" | "Media" | "Baja" = "Media";

        if (parts.length === 2) {
          const lastPart = parts[1];
          const foundPriority = validPriorities.find(
            (p) => p.toLowerCase() === lastPart.toLowerCase()
          );
          if (foundPriority) {
            priority = foundPriority as "Alta" | "Media" | "Baja";
          } else {
            description = lastPart;
          }
        } else if (parts.length > 2) {
          const lastPart = parts[parts.length - 1];
          const foundPriority = validPriorities.find(
            (p) => p.toLowerCase() === lastPart.toLowerCase()
          );
          if (foundPriority) {
            priority = foundPriority as "Alta" | "Media" | "Baja";
            description = parts.slice(1, -1).join(" - ");
          } else {
            description = parts.slice(1).join(" - ");
          }
        }

        tasksToCreate.push({
          title,
          description,
          priority,
          epicId,
          order: startingOrder + index,
          status: "Por Hacer",
        });
      }
    });

    if (tasksToCreate.length === 0) {
      throw new Error("El texto no contenía tareas con un formato válido.");
    }

    await prisma.task.createMany({
      data: tasksToCreate,
    });

    // Para creación en bloque, recargar todo sigue siendo una opción razonable.
    io.emit("tasks_updated");
  }
}
