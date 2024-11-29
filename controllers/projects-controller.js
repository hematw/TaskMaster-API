import NotFoundError from "../errors/not-found.js";
import Project from "../models/Project.js";
import Notification from "../models/Notification.js";

export const createProject = async (req, res) => {
  const project = await Project.create(req.body);
  await Notification.create({
    title: `New project (${project.title})!`,
    message: `You has been selected as manager for ${project.title} project by ${req.user.name}`,
    recipient: project.manager,
  });
  res.status(201).json({ message: "Project created", project });
};

export const getAllProjects = async (req, res) => {
  const page = req.query.page || 1;
  const size = req.query.size || 10;

  const projects = await Project.find()
    .skip((page - 1) * size)
    .limit(size)
    .populate("manager")
    .sort({ createdAt: -1 });

  const count = await Project.countDocuments();
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
    if (project.allTasks === project.completedTasks && project.allTasks != 0)
      completedProjects++;
    if (project.inProgressTasks > 0) inProgressProjects++;
    else notStartedProjects++;
  });

  return res.status(200).json({
    completedProjects,
    notStartedProjects,
    inProgressProjects,
    allProjects: allProjects.length,
  });
};

export const updateProject = async (req, res) => {
  const { id } = req.params;
  const { manager, deadline, description } = req.body;

  const projectWithId = await Project.findByIdAndUpdate(id, {
    manager,
    deadline,
    description,
  });

  if (!projectWithId)
    throw new NotFoundError(`No projects found with this id ${id}`);

  await Notification.create({
    title: `${projectWithId.title} project has an update`,
    message: `${req.user.name} updated the ${projectWithId.title} project.`,
    recipient: projectWithId.manager,
  });
  return res.status(200).json({ message: "Project updated successfully" });
};

export const deleteProject = async (req, res) => {
  const { id } = req.params;

  const projectWithId = await Project.findByIdAndDelete(id);

  if (!projectWithId)
    throw new NotFoundError(`No projects found with this id ${id}`);

  await Notification.create({
    title: "Project removed",
    message: `${projectWithId.title} project was removed by ${req.user.name}`,
    recipient: projectWithId.manager,
  });
  return res.status(200).json({ message: "Project deleted successfully" });
};
