import { Router } from "express";
import storage from "../utils/multer-storage.js";
import {
  deleteTask,
  getAllTasks,
  updateTask,
  createTask
} from "../controllers/tasks-controller.js";

const tasksRouter = Router();

tasksRouter.route("/").get(getAllTasks).post(createTask);

tasksRouter.route("/:userId").delete(deleteTask).patch(updateTask);

export default tasksRouter;
