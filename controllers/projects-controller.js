import NotFoundError from "../errors/not-found.js";
import Project from "../models/Project.js";

export const createProject = async (req, res) => {
  const project = await Project.create(req.body);
  res.status(201).json({ message: "Project created", project });
};

export const getAllProjects = async (req, res) => {
  const page = req.query.page || 1;
  const size = req.query.size || 10;

  const projects = await Project.find()
    .skip((page - 1) * size)
    .limit(size)
    .populate("manager");

  const count = await Project.countDocuments()
  const totalPages = Math.ceil(count / 10);

  return res.status(200).json({ projects, totalPages });
};

export const getProject = async (req, res) => {
  const { id } = req.params;

  const projectWithId = await Project.findById(id).populate("tasks manager");

  if (!projectWithId)
    throw new NotFoundError(`No projects found with this id ${id}`);

  return res.status(200).json({ project: projectWithId });
};

export const getProjectsSummary = async (req, res) => {
  const allProjects = await Project.find();
  let completedProjects = 0;
  let inProgressProjects = 0;
  let notStartedProjects = 0;

  allProjects.forEach((project) => {
    if (project.status === "not-started") notStartedProjects++;
    if (project.status === "in-progress") inProgressProjects++;
    if (project.status === "completed") completedProjects++;
  });

  return res.status(200).json({
    completedProjects,
    notStartedProjects,
    inProgressProjects,
    allProjects: allProjects.length,
  });
};
