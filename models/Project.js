import { model, Schema, Types } from "mongoose";

const ProjectSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide project's title"],
    },
    description: {
      type: String,
      required: [true, "Please provide project's description"],
    },
    manager: {
      type: Types.ObjectId,
      ref: "User",
    },
    deadline: {
      type: Date,
      required: [true, "Please provide project's deadline"],
    },
    status: {
      type: String,
      enum: ["not-started", "in-progress", "completed"],
      message: "{VALUE} not supported for project status",
      default: "not-started",
    },
    allTasks:{
      type: Number,
      default: 0
    },
    inProgressTasks:{
      type: Number,
      default: 0
    },
    completedTasks:{
      type: Number,
      default: 0
    },
  },
  { timestamps: true }
);

export default model("Project", ProjectSchema);
