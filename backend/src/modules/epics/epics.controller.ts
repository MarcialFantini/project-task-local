import { Request, Response } from "express";
import { handleServerError } from "../../core/errorHandler";
import { EpicService } from "./epics.service";

export class EpicController {
  private epicService = new EpicService();

  getAll = async (req: Request, res: Response) => {
    try {
      const epics = await this.epicService.findAll();
      res.status(200).json(epics);
    } catch (error) {
      handleServerError(res, error);
    }
  };

  getOne = async (req: Request, res: Response) => {
    try {
      const epic = await this.epicService.findOne(req.params.id);
      res.status(200).json(epic);
    } catch (error) {
      handleServerError(res, error);
    }
  };

  getTasksOfEpic = async (req: Request, res: Response) => {
    try {
      const tasks = await this.epicService.findTasksForEpic(req.params.epicId);
      res.status(200).json(tasks);
    } catch (error) {
      handleServerError(res, error);
    }
  };

  create = async (req: Request, res: Response) => {
    const { title, projectId } = req.body;
    if (!title || !projectId) {
      return res
        .status(400)
        .json({ message: "El título y el projectId son obligatorios." });
    }
    try {
      const newEpic = await this.epicService.create(req.body, req.io);
      res.status(201).json(newEpic);
    } catch (error) {
      handleServerError(res, error);
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const updatedEpic = await this.epicService.update(
        req.params.id,
        req.body,
        req.io
      );
      res.status(200).json(updatedEpic);
    } catch (error) {
      handleServerError(res, error);
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      await this.epicService.remove(req.params.id, req.io);
      res.status(204).send();
    } catch (error) {
      handleServerError(res, error);
    }
  };
}
