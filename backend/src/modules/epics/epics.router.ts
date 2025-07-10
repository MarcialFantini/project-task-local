import { Router } from "express";
import { EpicController } from "./epics.controller";

const router = Router();
const epicController = new EpicController();

router.get("/", epicController.getAll);
router.get("/:id", epicController.getOne);
router.get("/:epicId/tasks", epicController.getTasksOfEpic);
router.post("/", epicController.create);
router.put("/:id", epicController.update);
router.delete("/:id", epicController.delete);

export const epicRouter = router;
