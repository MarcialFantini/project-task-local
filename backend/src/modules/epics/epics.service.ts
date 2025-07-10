import { Prisma } from "@prisma/client";
import { prisma } from "../../core/database";
import { Server } from "socket.io";

export class EpicService {
  async findAll() {
    return prisma.epic.findMany({ orderBy: { createdAt: "desc" } });
  }

  async findOne(id: string) {
    return prisma.epic.findUniqueOrThrow({ where: { id } });
  }

  // Nuevo y útil: obtener tareas de una épica específica
  async findTasksForEpic(epicId: string) {
    return prisma.task.findMany({
      where: { epicId },
      orderBy: { order: "asc" },
    });
  }

  async create(data: Prisma.EpicCreateInput, io: Server) {
    const newEpic = await prisma.epic.create({ data });
    io.emit("epics_updated");
    return newEpic;
  }

  async update(id: string, data: Prisma.EpicUpdateInput, io: Server) {
    const updatedEpic = await prisma.epic.update({ where: { id }, data });
    io.emit("epics_updated");
    return updatedEpic;
  }

  async remove(id: string, io: Server) {
    await prisma.epic.delete({ where: { id } });
    io.emit("epics_updated");
  }
}
