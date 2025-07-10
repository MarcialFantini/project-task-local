import { Router } from "express";

import { taskRouter } from "./modules/tasks/tasks.router";
import { projectRouter } from "./modules/projects/projects.router";
import { epicRouter } from "./modules/epics/epics.router";

const router = Router();

// Asigna un prefijo a cada conjunto de rutas.
router.use("/projects", projectRouter);
router.use("/epics", epicRouter);
router.use("/tasks", taskRouter);

export const apiRouter = router;
