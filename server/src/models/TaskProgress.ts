import mongoose, { Schema, Document } from "mongoose";

export interface ITaskProgress extends Document {
  task: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  date: Date;
  progress: number;
  isCompleted: boolean;
  aiScore: number;
  aiFeedback: string;
}
const TaskProgressSchema: Schema = new Schema({
  task: { type: Schema.Types.ObjectId, ref: "Task" },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  date: { type: Date, default: Date.now },
  isAnalysed: { type: Boolean, default: false },
  isCompleted: { type: Boolean, default: false },
  aiScore: { type: Number, required: true },
  aiFeedback: { type: String, required: true },
});

export default mongoose.model<ITaskProgress>(
  "TaskProgress",
  TaskProgressSchema
);
