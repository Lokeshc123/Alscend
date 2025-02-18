import TaskProgress from "../models/TaskProgress";
import { Request, Response, NextFunction } from "express";
import { aiResponse } from "../utils/aiResponse";
import Task from "../models/Task";
import { AuthRequest } from "../utils/customInterface";

export const generateAiReport = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;
    const { taskId } = req.body;
    const task = await Task.findOne({ _id: taskId, user: userId });
    if (!task) {
      throw { status: 404, message: "Task not found" };
    }
    res.status(200).json({ status: "success", data: task });
  } catch (error) {
    next(error);
  }
};
