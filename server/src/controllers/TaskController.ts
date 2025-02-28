import { NextFunction, Request, Response } from "express";
import Task from "../models/Task";
import { IUser } from "../models/User";
import { AuthRequest } from "../utils/customInterface";
import Journal from "../models/Journal";
import { aiResponse } from "../utils/aiResponse";
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
    const categories = [
      { name: "Personal Development", emoji: "🚀" }, // Growth & ambition
      { name: "Productivity", emoji: "📝" }, // Notepad for planning & tasks
      { name: "Work", emoji: "💼" }, // Briefcase for work-related tasks
      { name: "Hobby", emoji: "🎨" }, // Palette for creative hobbies
      { name: "Health & Fitness", emoji: "🏋️" }, // Weightlifting for workouts
      { name: "Finance", emoji: "💰" }, // Money bag for financial management
      { name: "Social & Relationships", emoji: "👥" }, // People for connections
      { name: "Self-care", emoji: "🌿" }, // Leaf for relaxation & wellness
      { name: "Household & Chores", emoji: "🏠" }, // House for home tasks
      { name: "Entertainment", emoji: "🎮" }, // Game controller for fun & leisure
    ];
    const prompt = `Given the following task details:
    - Title: ${title}
    - Description: ${description}
    - Type: ${type}
    
    Choose the most appropriate category from this predefined list:
${categories.map((cat) => cat.name).join(", ")}
    Also, suggest a color in HEX format that represents this category.

    Return a JSON object in this format:
    {
      "category": "chosen_category",
      "emoji": "Professional looking but modern vibes emoji_representation",
      "color": "color_code"
    }`;

    const response = await aiResponse(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : null;

    let parsedReport;
    if (jsonString) {
      try {
        parsedReport = JSON.parse(jsonString);
      } catch (error) {
        throw { status: 500, message: "AI response format error" };
      }
    } else {
      throw { status: 500, message: "AI did not return a valid JSON object" };
    }

    const task = new Task({
      user,
      title,
      description,
      type,
      goal,
      category: parsedReport.category,
      color: parsedReport.color,
      emoji: parsedReport.emoji,
      originalGoal: goal,
      currentGoal: goal,
    });
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

export const createJournalEntryForTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;
    const { taskId, title, content } = req.body;
    const jounral = new Journal({
      user: userId,
      title,
      content,
      isTaskJournal: true,
    });
    await jounral.save();
    const task = await Task.findOneAndUpdate(
      { _id: taskId, user: userId },
      { $push: { journalEntries: jounral._id } },
      { new: true }
    );
    if (!task) {
      throw { status: 404, message: "Task not found" };
    }
    res.status(201).json({
      status: "success",
      message: "Journal entry created successfully and linked to task",
      data: jounral,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCategories = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = [
      { name: "Personal Development", emoji: "🚀" }, // Growth & ambition
      { name: "Productivity", emoji: "📝" }, // Notepad for planning & tasks
      { name: "Work", emoji: "💼" }, // Briefcase for work-related tasks
      { name: "Hobby", emoji: "🎨" }, // Palette for creative hobbies
      { name: "Health & Fitness", emoji: "🏋️" }, // Weightlifting for workouts
      { name: "Finance", emoji: "💰" }, // Money bag for financial management
      { name: "Social & Relationships", emoji: "👥" }, // People for connections
      { name: "Self-care", emoji: "🌿" }, // Leaf for relaxation & wellness
      { name: "Household & Chores", emoji: "🏠" }, // House for home tasks
      { name: "Entertainment", emoji: "🎮" }, // Game controller for fun & leisure
    ];
    res.status(200).json({ status: "success", data: categories });
  } catch (error) {
    next(error);
  }
};
