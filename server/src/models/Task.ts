import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  type: "one-time" | "continuous";
  status: "pending" | "completed";
  goal?: number;
  progress?: number;
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
    type: { type: String, required: true, enum: ["one-time", "continuous"] },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
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
  }
  next();
});

export default mongoose.model<ITask>("Task", TaskSchema);
