import { Request } from "express";
import { IUser } from "../models/User";

export interface AuthRequest extends Request {
  user?: IUser; // Extend Request to include user
}

export interface TaskRecommendation {
  taskId: string;
  title: string;
  difficulty: number; // Calculated dynamically
  goal?: number;
  reason: string;
}

export interface RecommendedTask {
  title: string;
  description?: string;
  type: "one-time" | "continuous";
  goal?: number; // Only for continuous tasks
  progress?: number; // Only for continuous tasks, defaults to 0 if provided
}

export interface Recommendation {
  taskId: string;
  title: string;
  suggestion: string | null;
}
