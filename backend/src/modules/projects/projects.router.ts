import { Router } from "express";
import { ProjectController } from "./projects.controller";

const router = Router();
const projectController = new ProjectController();

router.get("/", projectController.getAll);
router.get("/:id", projectController.getOne);
router.post("/", projectController.create);
router.put("/:id", projectController.update);
router.delete("/:id", projectController.delete);

export const projectRouter = router;
