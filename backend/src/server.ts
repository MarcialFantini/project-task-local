import express, { Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

app.use(cors());
app.use(express.json());

const handleServerError = (res: Response, error: unknown) => {
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

// --- API Endpoints para PROJECTS ---

app.get("/api/projects", async (req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(projects);
  } catch (error) {
    handleServerError(res, error);
  }
});

app.post("/api/projects", async (req: Request, res: Response) => {
  const { title, description } = req.body;
  if (!title)
    return res.status(400).json({ message: "El título es obligatorio." });

  try {
    const newProject = await prisma.project.create({
      data: { title, description },
    });
    io.emit("projects_updated"); // Notificar a los clientes
    res.status(201).json(newProject);
  } catch (error) {
    handleServerError(res, error);
  }
});

// --- API Endpoints para EPICS ---

app.get("/api/epics", async (req: Request, res: Response) => {
  try {
    const epics = await prisma.epic.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(epics);
  } catch (error) {
    handleServerError(res, error);
  }
});

app.post("/api/epics", async (req: Request, res: Response) => {
  // Ahora requiere un projectId
  const { title, priority, description, projectId } = req.body;
  if (!title || !projectId)
    return res
      .status(400)
      .json({ message: "El título y el projectId son obligatorios." });

  try {
    const newEpic = await prisma.epic.create({
      data: { title, priority, description, projectId },
    });
    io.emit("epics_updated");
    res.status(201).json(newEpic);
  } catch (error) {
    handleServerError(res, error);
  }
});

// ... (El resto de los endpoints para TAREAS y BULK TASKS no necesitan cambios) ...
// GET /api/tasks
app.get("/api/tasks", async (req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({ orderBy: { order: "asc" } });
    res.status(200).json(tasks);
  } catch (error) {
    handleServerError(res, error);
  }
});

// POST /api/tasks
app.post("/api/tasks", async (req: Request, res: Response) => {
  const { title, description, epicId } = req.body;
  if (!title || !epicId)
    return res
      .status(400)
      .json({ message: "El título y el epicId son obligatorios." });
  try {
    const lastTask = await prisma.task.findFirst({
      where: { epicId },
      orderBy: { order: "desc" },
    });
    const newOrder = lastTask ? lastTask.order + 1 : 0;
    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        epicId,
        order: newOrder,
        status: "Por Hacer",
      },
    });
    io.emit("tasks_updated");
    res.status(201).json(newTask);
  } catch (error) {
    handleServerError(res, error);
  }
});

// PUT /api/tasks/:id
app.put("/api/tasks/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, status, order } = req.body;
  const dataToUpdate: Prisma.TaskUpdateInput = {};
  if (title !== undefined) dataToUpdate.title = title;
  if (description !== undefined) dataToUpdate.description = description;
  if (status !== undefined) dataToUpdate.status = status;
  if (order !== undefined) dataToUpdate.order = order;
  if (Object.keys(dataToUpdate).length === 0)
    return res
      .status(400)
      .json({ message: "No se proporcionaron datos para actualizar." });
  try {
    const updatedTask = await prisma.task.update({
      where: { id },
      data: dataToUpdate,
    });
    io.emit("tasks_updated");
    res.status(200).json(updatedTask);
  } catch (error) {
    handleServerError(res, error);
  }
});

// DELETE /api/tasks/:id
app.delete("/api/tasks/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.task.delete({ where: { id } });
    io.emit("tasks_updated");
    res.status(204).send();
  } catch (error) {
    handleServerError(res, error);
  }
});

// --- ENDPOINT ESPECIAL PARA CREACIÓN EN BLOQUE (ACTUALIZADO) ---
app.post("/api/epics/:id/bulk-tasks", async (req: Request, res: Response) => {
  const { id: epicId } = req.params;
  const { bulkText } = req.body;

  if (!bulkText || typeof bulkText !== "string") {
    return res
      .status(400)
      .json({ message: "El texto para la creación en bloque es inválido." });
  }

  try {
    const lines = bulkText.split("\n").filter((line) => line.trim() !== "");
    if (lines.length === 0) {
      return res
        .status(400)
        .json({ message: "No se encontraron tareas para crear." });
    }

    const tasksToCreate: Prisma.TaskCreateManyInput[] = [];
    const validPriorities = ["Alta", "Media", "Baja"];

    lines.forEach((line, index) => {
      const parts = line.split("-").map((p) => p.trim());
      const title = parts[0];

      if (title) {
        let description: string | null = null;
        let priority = "Media";

        if (parts.length === 2) {
          // Formato: "titulo - descripcion" O "titulo - prioridad"
          const lastPart = parts[1];
          if (
            validPriorities
              .map((p) => p.toLowerCase())
              .includes(lastPart.toLowerCase())
          ) {
            priority = validPriorities.find(
              (p) => p.toLowerCase() === lastPart.toLowerCase()
            )!;
          } else {
            description = lastPart;
          }
        } else if (parts.length > 2) {
          // Formato: "titulo - descripcion - prioridad"
          const lastPart = parts[parts.length - 1];
          if (
            validPriorities
              .map((p) => p.toLowerCase())
              .includes(lastPart.toLowerCase())
          ) {
            priority = validPriorities.find(
              (p) => p.toLowerCase() === lastPart.toLowerCase()
            )!;
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
          order: index,
          status: "Por Hacer",
        });
      }
    });

    if (tasksToCreate.length > 0) {
      await prisma.task.createMany({
        data: tasksToCreate,
      });
    }

    io.emit("tasks_updated");
    res.status(201).json({
      message: `${tasksToCreate.length} tareas creadas exitosamente.`,
    });
  } catch (error) {
    handleServerError(res, error);
  }
});

// --- Lógica de Socket.IO ---
io.on("connection", (socket) => {
  console.log(`✅ Cliente conectado: ${socket.id}`);
  socket.on("disconnect", () => {
    console.log(`❌ Cliente desconectado: ${socket.id}`);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(
    `🚀 Servidor con Proyectos corriendo en http://localhost:${PORT}`
  );
});
