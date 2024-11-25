import { Router } from "express";
import {
  createProject,
  getAllProjects,
  getProject,
  getProjectsSummary,
  updateProject,
  deleteProject
} from "../controllers/projects-controller.js";

const projectRouter = Router();

projectRouter.route("/").post(createProject).get(getAllProjects);
projectRouter.route("/summary").get(getProjectsSummary);
projectRouter.route("/:id").get(getProject).patch(updateProject).delete(deleteProject);

export default projectRouter;
