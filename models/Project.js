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
    status: {
      type: String,
      enum: ["not-started", "in-progress", "completed"],
      message: "{VALUE} not supported for project status",
      default: "not-started",
    },
  },
  { timestamps: true }
);

ProjectSchema.post("save", function () {
  const completed = 0;
  this.tasks.forEach((t) => {
    if (t.status === "completed") completed++;
    else if (t.status === "completed") completed++;
  });
  
  if (this.tasks.length === completed) this.status = "completed";
  else if (this.tasks.length > completed) this.status = "in-progress";
});

export default model("Project", ProjectSchema);
