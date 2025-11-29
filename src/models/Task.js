import mongoose from "mongoose";

// Define Task schema
const TaskSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // link task to specific user
    title: { type: String, required: true },  // task title
    completed: { type: Boolean, default: false }, // status
  },
  { timestamps: true } // createdAt, updatedAt
);

// Use existing model if available (for hot reloads in dev)
const Task = mongoose.models.Task || mongoose.model("Task", TaskSchema);

export default Task;
