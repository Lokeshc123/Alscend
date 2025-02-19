import mongoose, { Schema, Document } from "mongoose";

export interface IJournal extends Document {
  user: mongoose.Types.ObjectId;
  title?: string;
  content: string;
  isTaskJournal: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const JournalSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String },
    content: { type: String, required: true },
    isTaskJournal: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IJournal>("Journal", JournalSchema);
