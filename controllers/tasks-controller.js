import BadRequest from "../errors/bad-request.js";
import NotFoundError from "../errors/not-found.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";

export const createTask = async (req, res) => {
  const { projectId } = req.query;
  const task = await Task.create({ ...req.body, project: projectId });
  res.status(201).json({ message: "Task added successfully", task });
};

// Get all tasks data
export const getAllTasks = async (req, res) => {
  const { projectId } = req.query;
  const page = req.query.page || 1;
  const size = req.query.size || 10;

  let searchQuery = {};
  if (projectId) {
    searchQuery = { project: projectId };
  } else {
    throw BadRequest("Provide projectId query to get tasks");
  }

  const tasks = await Task.find(searchQuery)
    .populate("assignee")
    .skip((page - 1) * size)
    .limit(size);

  const count = await Task.countDocuments(searchQuery);
  const totalPages = Math.ceil(count / 10);

  return res.status(200).json({ tasks, totalPages });
};

// Update task
export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, deadline, description, assignee } = req.body;
  const task = await Task.findByIdAndUpdate(id, {
    title,
    deadline,
    description,
    assignee,
  });

  if (!task) {
    throw new NotFoundError("No task found!");
  }

  return res.status(202).json({ message: "Task updated successfully" });
};

// Delete all tasks data
export const deleteTask = async (req, res) => {
  const { taskId } = req.params;
  const task = await Task.findByIdAndDelete(taskId);
  if (task) {
    return res.status(200).json({ message: "Task deleted successfully", task });
  }
  throw NotFoundError("No task found!");
};
