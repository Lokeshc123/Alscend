import { startOfDay, endOfDay } from "date-fns";
import { aiResponse } from "../utils/aiResponse";
import { Response, NextFunction } from "express";
import Task, { ITask } from "../models/Task"; // Adjust path
import TaskProgress, { ITaskProgress } from "../models/TaskProgress"; // Adjust path
import { AuthRequest } from "../utils/customInterface";

export const generateAiReport = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate inputs
    const userId = req.user?._id;
    if (!userId) throw { status: 401, message: "Unauthorized" };
    const { taskId } = req.body;
    if (!taskId) throw { status: 400, message: "Task ID is required" };

    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    // Fetch task
    const task = await Task.findOne({ _id: taskId, user: userId })
      .select("title goal progress status type journalEntries")
      .populate<{ journalEntries: { content: string }[] }>({
        path: "journalEntries",
        match: { createdAt: { $gte: todayStart, $lte: todayEnd } },
        select: "content -_id",
      });

    if (!task) throw { status: 404, message: "Task not found" };

    // Determine task type and progress
    const isOneTime = task.type === "one-time";
    const goal = task.goal ?? 0;
    const progress = task.progress ?? 0;
    const completionPercentage =
      isOneTime || goal === 0 ? null : Math.min((progress / goal) * 100, 100);

    // Extract journal content
    const journalContent =
      task.journalEntries.map((entry) => entry.content).join("\n") ||
      "No journal entries for today.";

    // Construct AI prompt
    const prompt = `
      Generate a report based on the task and journal below.  
      Return a **STRICTLY structured JSON object** with:  
      - "score": A number (0-100) based on these rules:  
        - For "continuous" tasks (with goal/progress):  
          - 95-100: "completed" AND progress >= 95%.  
          - 85-94: Progress >= 85%, not completed.  
          - 70-84: Progress >= 70%, incomplete or lacks detail.  
          - 50-69: Progress 50-69%, partial effort.  
          - 25-49: Progress 25-49%, minimal effort.  
          - 10-24: Progress 10-24%, almost no effort.  
          - 0-9: Progress < 10%, no effort (min 5 unless 0%).  
          - **DO NOT** exceed 69 if progress < 70%.  
        - For "one-time" tasks (no goal/progress):  
          - 100: "completed" (full success).  
          - 50-75: "pending" with significant effort or partial success (judge from journal).  
          - 25-49: "pending" with minimal effort or delayed action.  
          - 10-24: "pending" with negligible effort.  
          - 0-9: "pending" with no effort (min 5 unless explicitly 0%).  
      - "aiFeedback": A slightly passive-aggressive, helpful message (2-3 sentences).  

      Task:  
      - Title: ${task.title}  
      - Type: ${task.type}  
      - Status: ${task.status}  
      ${
        isOneTime
          ? ""
          : `- Goal: ${goal} (numeric target)  
            - Progress: ${progress} (numeric achieved)  
            - Completion: ${
              completionPercentage?.toFixed(1) ?? "N/A"
            }% (use this if provided)`
      }  

      Journal:  
      ${journalContent}  

      Notes:  
      - For one-time tasks, use the journal to gauge effort or partial success.  
      - If the task involves timing (e.g., "Bath at 6 AM") and the journal mentions a time (e.g., "Bathed at 7 AM"), score higher for closer times.  

      Examples:  
      1. Continuous: "Write 1000 words", Progress: 600, Completion: 60%, Status: "pending"  
         Journal: "Wrote some, got distracted."  
         Output: {"score": 60, "aiFeedback": "60% is a start, but distractions? Get it together."}  
      2. One-time: "Workout", Status: "pending", Journal: "Did 20 minutes of exercise."  
         Output: {"score": 75, "aiFeedback": "20 minutes is decent, but you didn’t finish—step it up."}  
      3. One-time: "Bath at 6 AM", Status: "pending", Journal: "Bathed at 7 AM."  
         Output: {"score": 50, "aiFeedback": "7 AM? An hour late isn’t exactly a win—try harder."}  
      4. One-time: "Wake up at 5 AM", Status: "completed", Journal: "Up at 5 AM!"  
         Output: {"score": 100, "aiFeedback": "5 AM on the dot—shocking, but well done."}  
      5. One-time: "Workout", Status: "pending", Journal: "Didn’t feel like it."  
         Output: {"score": 10, "aiFeedback": "Didn’t feel like it? That’s barely an excuse—do better."}  

      Return ONLY the JSON object. NO extra text.
    `;

    // Get AI response
    const aiReport = await aiResponse(prompt);
    const jsonMatch = aiReport.match(/\{[\s\S]*\}/);
    if (!jsonMatch)
      throw { status: 500, message: "AI returned invalid format" };

    let parsedReport: { score: number; aiFeedback: string };
    try {
      parsedReport = JSON.parse(jsonMatch[0]);
    } catch {
      throw { status: 500, message: "AI response parsing failed" };
    }

    // Validate AI response
    if (typeof parsedReport.score !== "number" || !parsedReport.aiFeedback) {
      throw { status: 500, message: "AI returned incomplete report" };
    }

    // Save progress record
    const taskProgress = new TaskProgress({
      task: taskId,
      user: userId,
      date: new Date(),
      progress: completionPercentage ?? (task.status === "completed" ? 100 : 0),
      isCompleted: task.status === "completed",
      aiScore: parsedReport.score,
      aiFeedback: parsedReport.aiFeedback,
    });

    await Promise.all([
      taskProgress.save(),
      Task.updateOne(
        { _id: taskId, user: userId },
        { $push: { progressRecords: taskProgress._id } }
      ),
    ]);

    res.status(201).json({
      status: "success",
      message: "AI report generated successfully",
      data: taskProgress,
    });
  } catch (error) {
    next(error);
  }
};
