import NotFoundError from "../errors/not-found.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";

export const createTask = async (req, res) => {
  const { projectId } = req.query;
  const task = await Task.create({ ...req.body, project:projectId });
  res.status(201).json({ message: "Task added successfully", task });
};

// Get all tasks data
export const getAllTasks = async (req, res) => {
  const { projectId } = req.query;

  let searchQuery = {};
  if (projectId) {
    searchQuery = { project: projectId };
  }

  const tasks = await Task.find(searchQuery).populate("assignee");
  return res.status(200).json({ tasks });
};

// Update task
export const updateTask = async (req, res) => {
  const { title } = req.body;
  const task = await Task.findById(req.task._id);

  if (!task) {
    throw new NotFoundError("No task found!");
  }

  await task.save();
  return res.status(202).json({ message: "task updated successfully" });
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
