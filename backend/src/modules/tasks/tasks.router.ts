// src/modules/tasks/tasks.router.ts
import { Router } from "express";
import { TaskController } from "./tasks.controller";

const router = Router();
const taskController = new TaskController();

router.get("/", taskController.getAll);
router.post("/", taskController.create);
router.put("/:id", taskController.update);
router.delete("/:id", taskController.delete);
// Nota: La ruta de creación en bloque ahora vive aquí, ya que crea Tareas.
router.post("/bulk/epic/:epicId", taskController.createBulk);

export const taskRouter = router;
