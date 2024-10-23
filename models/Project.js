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
    tasks: {
      type: [Types.ObjectId],
    },
  },
  { timestamps: true }
);

export default model("Project", ProjectSchema);
