import { model, Schema, Types } from "mongoose";
import Project from "./Project.js";

const TaskSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide task's title"],
    },
    description: {
      type: String,
      required: [true, "Please provide task's description"],
    },
    assignee: {
      type: Types.ObjectId,
      ref: "User",
    },
    deadline: {
      type: Date,
      required: [true, "Please provide task's deadline"],
    },
    status: {
      type: String,
      enum: ["not-started", "in-progress", "paused", "completed", "activated"],
      message: "{VALUE} is not supported",
      default: "not-started",
    },
    project: {
      type: Types.ObjectId,
      ref: "Project",
      required: [true, "Project id is required"],
    },
  },
  { timestamps: true }
);

TaskSchema.post("save", async function () {
  const projectId = this.project;
  let fieldToInc = "";

  switch (this.status) {
    case "completed":
      fieldToInc = "completedTasks";
      break;
    case "in-progress":
      fieldToInc = "inProgressTasks";
      break;
    default:
      fieldToInc = "allTasks";
  }
  try {
    await Project.findByIdAndUpdate(projectId, {
      $inc: { [fieldToInc]: 1 },
    });
  } catch (error) {
    return next(error);
  }
});

// TaskSchema.post("updateOne", async function (next) {
//   const projectId = this.project;

//   try {
//     const project = await Project.findByIdAndUpdate(projectId, {
//       $inc: { allTasks: 1 },
//     });

//     if (!project) {
//       console.error("No project found with ID:", projectId);
//       return next(new Error("Project not found"));
//     }
//   } catch (error) {
//     return next(error);
//   }
//   next();
// });

export default model("Task", TaskSchema);
