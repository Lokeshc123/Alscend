import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  authProvider: "email" | "google";
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  role: "user" | "admin";
  googleId?: string;
  streak: number;
  achievements: string[];
  tasks: mongoose.Types.ObjectId[];
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true },
    password: { type: String },
    authProvider: { type: String, required: true },
    avatar: { type: String },
    role: { type: String, default: "user" },
    googleId: { type: String },
    streak: { type: Number, default: 0 },
    achievements: { type: [String], default: [] },
    tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
