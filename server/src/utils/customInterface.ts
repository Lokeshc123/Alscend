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
