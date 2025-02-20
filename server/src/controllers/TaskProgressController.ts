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

    // Fetch task with selected fields and populate only 'content' from journalEntries
    const task = await Task.findOne({ _id: taskId, user: userId })
      .select("title goal progress status")
      .populate({ path: "journalEntries", select: "content -_id" });

    if (!task) {
      throw { status: 404, message: "Task not found" };
    }

    // Extract journal entries content
    const journalContent = task.journalEntries.map((entry: any) => entry.content).join("\n");

    // Construct AI prompt
    const prompt = `
      Based on the following task and journal entries, generate a report.
      Only return an object with two fields: 
      - "score": A number out of 100 based on journal entries, goal, progress, and completion please be very strict for scores
      - "aiFeedback": A brief feedback message on performance also be very strict and passive aggressive for feedback but also encouraging and helpfull at same time

      Task:
      - Title: ${task.title}
      - Goal: ${task.goal}
      - Progress: ${task.progress}
      - Status: ${task.status}

      Journal Entries:
      ${journalContent}

      Return only a JSON object with "score" and "aiFeedback". No extra text.
    `;

    // Get AI response
    const aiReport = await aiResponse(prompt);

    const jsonMatch = aiReport.match(/\{[\s\S]*\}/);
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

    const taskProgress = new TaskProgress({
      task: taskId,
      user: userId,
      progress: task.progress,
      isCompleted: task.status === "completed",
      aiScore: parsedReport.score,
      aiFeedback: parsedReport.aiFeedback,
    });

    await taskProgress.save();

    await Task.updateOne(
      { _id: taskId, user: userId },
      { $push: { progressRecords: taskProgress._id } }
    );


    res.status(201).json({
      status: "success",
      message: "AI report generated successfully",
      data: taskProgress,
    });

    
    
  } catch (error) {
    next(error);
  }
};

