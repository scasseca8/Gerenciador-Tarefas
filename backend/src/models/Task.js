import mongoose from "mongoose";

const FileSchema = new mongoose.Schema({
  filename: String,
  path: String,
});

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ["Pendente", "Concluído"],
    default: "Pendente",
  },
  files: [FileSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Task", taskSchema);
