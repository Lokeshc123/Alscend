import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  _id: string;
  user: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  category: string;
  color: string;
  type: "one-time" | "continuous";
  status: "pending" | "completed";
  recommendations: mongoose.Types.ObjectId[];
  goal?: number;
  progress?: number;
  originalGoal?: number;
  currentGoal?: number;
  streak: number;
  progressRecords: mongoose.Types.ObjectId[];
  journalEntries: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true },
    color: { type: String, required: true },
    recommendations: [
      { type: Schema.Types.ObjectId, ref: "Recommendation", default: [] },
    ],
    type: { type: String, required: true, enum: ["one-time", "continuous"] },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    originalGoal: { type: Number },
    currentGoal: { type: Number },
    streak: {
      type: Number,
      default: 0,
    },

    goal: { type: Number },
    progress: {
      type: Number,
      default: 0,
    },
    journalEntries: [{ type: Schema.Types.ObjectId, ref: "Journal" }],
    progressRecords: [{ type: Schema.Types.ObjectId, ref: "ProgressRecord" }],
  },
  {
    timestamps: true,
  }
);
TaskSchema.pre("save", function (next) {
  if (this.type === "one-time") {
    this.progress = undefined; // Removes progress field for one-time tasks
    this.goal = undefined; // Removes goal field for one-time
  }
  next();
});

export default mongoose.model<ITask>("Task", TaskSchema);
