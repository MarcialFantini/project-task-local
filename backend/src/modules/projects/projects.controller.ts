import { Request, Response } from "express";
import { handleServerError } from "../../core/errorHandler";
import { ProjectService } from "./projects.service";

export class ProjectController {
  private projectService = new ProjectService();

  getAll = async (req: Request, res: Response) => {
    try {
      const projects = await this.projectService.findAll();
      res.status(200).json(projects);
    } catch (error) {
      handleServerError(res, error);
    }
  };

  getOne = async (req: Request, res: Response) => {
    try {
      const project = await this.projectService.findOne(req.params.id);
      res.status(200).json(project);
    } catch (error) {
      handleServerError(res, error);
    }
  };

  create = async (req: Request, res: Response) => {
    if (!req.body.title) {
      return res.status(400).json({ message: "El título es obligatorio." });
    }
    try {
      const newProject = await this.projectService.create(req.body, req.io);
      res.status(201).json(newProject);
    } catch (error) {
      handleServerError(res, error);
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const updatedProject = await this.projectService.update(
        req.params.id,
        req.body,
        req.io
      );
      res.status(200).json(updatedProject);
    } catch (error) {
      handleServerError(res, error);
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      await this.projectService.remove(req.params.id, req.io);
      res.status(204).send();
    } catch (error) {
      handleServerError(res, error);
    }
  };
}
