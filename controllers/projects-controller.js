import NotFoundError from "../errors/not-found.js";
import Project from "../models/Project.js";

export const createProject = async (req, res) => {
  const project = await Project.create(req.body);
  res.status(201).json({ message: "Project created", project });
};

export const getAllProjects = async (req, res) => {
  const projects = await Project.find().populate("manager");
  if (projects.length) {
    return res.status(200).json({ projects });
  }
  throw new NotFoundError("No Projects found!");
};
