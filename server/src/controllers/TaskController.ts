import { NextFunction, Request, Response } from "express";
import Task from "../models/Task";
import { IUser } from "../models/User";
interface AuthRequest extends Request {
  user?: IUser; // Extend Request to include user
}

export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user, title, description, type, goal } = req.body;

    if (!user || !title || !type) {
      throw { status: 400, message: "Misssing required fields" };
    }

    if (type === "continuous" && !goal) {
      throw { status: 400, message: "Goal is required for continuous tasks" };
    }

    const task = new Task({ user, title, description, type, goal });
    await task.save();

    res.status(201).json({
      status: "success",
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserTasks = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw { status: 401, message: "Unauthorized" };
    }
    const userId = req.user._id;
    const tasks = await Task.find({ user: userId });
    res.status(200).json({ status: "success", data: tasks });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw { status: 401, message: "Unauthorized" };
    }
    const userId = req.user._id;
    const taskId = req.params.id;
    const task = await Task.findOneAndDelete({ _id: taskId, user: userId });
    if (!task) {
      throw { status: 404, message: "Task not found" };
    }
    res.status(200).json({ status: "success", message: "Task deleted" });
  } catch (error) {
    next(error);
  }
};

export const getDetailsOfTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw { status: 401, message: "Unauthorized" };
    }
    const userId = req.user._id;
    const taskId = req.params.id;
    const task = await Task.findOne({ _id: taskId, user: userId });
    if (!task) {
      throw { status: 404, message: "Task not found" };
    }
    res.status(200).json({ status: "success", data: task });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw { status: 401, message: "Unauthorized" };
    }
    const userId = req.user._id;
    const taskId = req.params.id;
    const task = await Task.findOneAndUpdate(
      { _id: taskId, user: userId },
      req.body,
      { new: true }
    );
    if (!task) {
      throw { status: 404, message: "Task not found" };
    }
    res.status(200).json({ status: "success", data: task });
  } catch (error) {
    next(error);
  }
};

export const deleteAllTasksForUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw { status: 401, message: "Unauthorized" };
    }
    const userId = req.user._id;
    await Task.deleteMany({ user: userId });
    res.status(200).json({ status: "success", message: "All tasks deleted" });
  } catch (error) {
    next(error);
  }
};
