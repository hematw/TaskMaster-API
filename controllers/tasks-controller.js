import BadRequest from "../errors/bad-request.js";
import NotFoundError from "../errors/not-found.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";

export const createTask = async (req, res) => {
  const { projectId } = req.query;
  if (!projectId) {
    throw new BadRequest("Provide projectId query param to create Task");
  }

  const task = await Task.create({ ...req.body, project: projectId });
  const project = await Project.findByIdAndUpdate(projectId, {
    $set: { allTasks: { $inc: 1 } },
  });
  if (!project) {
    console.error("No project found with ID:", projectId);
    return next(new Error("Project not found"));
  }
  ++project.allTasks;
  await project.save();
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

  // let fieldToInc = "";

  // if (task.status == "not-started" && status == "in-progress") {
  //   fieldToInc = "inProgressTasks";
  // }
  // if (task.status == "in-progress" && status == "completed") {
  //   fieldToInc = "completedTasks";
  // }
  //     break;
  //   case "in-progress":
  //     break;
  //   default:
  //     fieldToInc = "allTasks";
  // }
  // await Project.findByIdAndUpdate(projectId, {
  //   $inc: { [fieldToInc]: 1 },
  // });

  return res.status(202).json({ message: "Task updated successfully" });
};

// Delete all tasks data
export const deleteTask = async (req, res) => {
  const { taskId } = req.params;
  const task = await Task.findByIdAndDelete(taskId);
  if (!task) {
    throw NotFoundError("No task found!");
  }
  await Project.findByIdAndUpdate(task.project, {
    $set: { allTasks: { $inc: -1 } },
  });
  return res.status(200).json({ message: "Task deleted successfully", task });
};
