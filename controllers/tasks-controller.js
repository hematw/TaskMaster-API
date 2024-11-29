import BadRequest from "../errors/bad-request.js";
import NotFoundError from "../errors/not-found.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";
import Notification from "../models/Notification.js";

export const createTask = async (req, res) => {
  const { projectId } = req.query;
  if (!projectId) {
    throw new BadRequest("Provide projectId query param to create Task");
  }

  const project = await Project.findByIdAndUpdate(projectId, {
    $inc: { allTasks: 1 },
  });
  if (!project) {
    console.error("No project found with ID:", projectId);
    return new NotFoundError("Project not found");
  }
  const task = await Task.create({
    title,
    description,
    deadline,
    assignee,
    project: projectId,
  });

  ++project.allTasks;
  await project.save();

  await Notification.create({
    title: `New task (${projectWithId.title})`,
    message: `${req.user.name} assigned You  ${task.title} task in ${project.title} project.`,
    recipient: task.assignee,
  });

  res.status(201).json({ message: "Task added successfully", task });
};

// Get all tasks data
export const getAllTasks = async (req, res) => {
  const { projectId } = req.query;
  const page = req.query.page || 1;
  const size = req.query.size || 10;
  const search = req.query.search;

  let searchQuery = {};
  if (search) {
    searchQuery.title = { $regex: search, $options: "i" };
  }

  if (projectId) {
    searchQuery.project = projectId;
  } else {
    throw BadRequest("Provide projectId query to get tasks");
  }

  const tasks = await Task.find(searchQuery)
    .populate("assignee")
    .skip((page - 1) * size)
    .limit(size)
    .sort({ createdAt: -1 });

  const count = await Task.countDocuments(searchQuery);
  const totalPages = Math.ceil(count / 10);

  return res.status(200).json({ tasks, totalPages });
};

// Update task
export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, deadline, description, assignee, status } = req.body;
  const task = await Task.findOneAndUpdate(
    { _id: id },
    {
      title,
      deadline,
      description,
      assignee,
      status,
    },
    { new: true }
  );
  if (!task) {
    throw new NotFoundError("No task found!");
  }

  const project = await Project.findById(task.project);
  if (!project) {
    console.error("No project found with ID:", projectId);
    return next(new Error("Project not found"));
  }

  const allTasksOfProject = await Task.find({ project: task.project });

  project.completedTasks = allTasksOfProject.filter(
    (t) => t.status == "completed"
  ).length;
  project.inProgressTasks = allTasksOfProject.filter(
    (t) => t.status == "in-progress"
  ).length;
  project.allTasks = allTasksOfProject.length;

  await project.save();

  await Notification.create({
    title: `${task.title} task has an update`,
    message: `${req.user.name} updated the ${task.title} task in ${project.title} project.`,
    recipient: task.assignee,
  });
  return res.status(202).json({ message: "Task updated successfully" });
};

// Delete all tasks data
export const deleteTask = async (req, res) => {
  const { id: taskId } = req.params;
  const task = await Task.findByIdAndDelete(taskId);
  if (!task) {
    throw new NotFoundError("No task found!");
  }
  await Notification.create({
    title: `${task.title}task removed`,
    message: `${task.title} task was removed by ${req.user.name}`,
    recipient: task.assignee,
  });
  const query = { allTasks: -1 };

  if (task.status === "in-progress") {
    query.inProgressTasks = -1;
  } else if (task.status === "completed") {
    query.completedTasks = -1;
  }
  await Project.findByIdAndUpdate(task.project, {
    $inc: query,
  });
  return res.status(200).json({ message: "Task deleted successfully", task });
};
