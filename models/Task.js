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

export default model("Task", TaskSchema);
