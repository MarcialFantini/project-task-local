import { Prisma } from "@prisma/client";
import { prisma } from "../../core/database";
import { Server } from "socket.io";

export class ProjectService {
  async findAll() {
    return prisma.project.findMany({ orderBy: { createdAt: "desc" } });
  }

  async findOne(id: string) {
    return prisma.project.findUniqueOrThrow({ where: { id } });
  }

  async create(data: Prisma.ProjectCreateInput, io: Server) {
    const newProject = await prisma.project.create({ data });
    io.emit("projects_updated");
    return newProject;
  }

  async update(id: string, data: Prisma.ProjectUpdateInput, io: Server) {
    const updatedProject = await prisma.project.update({ where: { id }, data });
    io.emit("projects_updated");
    return updatedProject;
  }

  async remove(id: string, io: Server) {
    await prisma.project.delete({ where: { id } });
    io.emit("projects_updated");
  }
}
