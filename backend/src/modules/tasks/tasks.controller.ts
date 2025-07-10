// src/modules/tasks/tasks.controller.ts
import { Request, Response } from "express";
import { handleServerError } from "../../core/errorHandler";
import { TaskService } from "./tasks.service";

export class TaskController {
  private taskService = new TaskService();

  // Obtener todas las tareas
  getAll = async (req: Request, res: Response) => {
    try {
      const tasks = await this.taskService.findAll();
      res.status(200).json(tasks);
    } catch (error) {
      handleServerError(res, error);
    }
  };

  // Crear una tarea
  create = async (req: Request, res: Response) => {
    const { title, description, epicId, priority } = req.body;
    if (!title || !epicId) {
      return res
        .status(400)
        .json({ message: "El título y el epicId son obligatorios." });
    }
    try {
      const newTask = await this.taskService.create(req.body, req.io);
      res.status(201).json(newTask);
    } catch (error) {
      handleServerError(res, error);
    }
  };

  // Actualizar una tarea
  update = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const updatedTask = await this.taskService.update(id, req.body, req.io);
      res.status(200).json(updatedTask);
    } catch (error) {
      handleServerError(res, error);
    }
  };

  // Borrar una tarea
  delete = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      await this.taskService.remove(id, req.io);
      res.status(204).send();
    } catch (error) {
      handleServerError(res, error);
    }
  };

  // Creación en bloque
  createBulk = async (req: Request, res: Response) => {
    const { epicId } = req.params;
    const { bulkText } = req.body;
    if (!bulkText || typeof bulkText !== "string") {
      return res
        .status(400)
        .json({ message: "El texto para la creación en bloque es inválido." });
    }
    try {
      const result = await this.taskService.createManyFromText(
        epicId,
        bulkText,
        req.io
      );
      res
        .status(201)
        .json({ message: `${result.count} tareas creadas exitosamente.` });
    } catch (error) {
      handleServerError(res, error);
    }
  };
}
