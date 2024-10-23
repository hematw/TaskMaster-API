import { Router } from "express";
import {
  createProject,
  getAllProjects,
} from "../controllers/projects-controller.js";

const projectRouter = Router();

projectRouter.route("/").post(createProject).get(getAllProjects);

export default projectRouter;
