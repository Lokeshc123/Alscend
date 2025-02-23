import Task, { ITask } from "../models/Task"; // Adjust path
import TaskProgress, { ITaskProgress } from "../models/TaskProgress"; // Adjust path
import { aiResponse } from "../utils/aiResponse";
import { Response, NextFunction } from "express";
import { AuthRequest } from "../utils/customInterface";

interface Recommendation {
  taskId: string;
  title: string;
  suggestion: string | null;
}

export const generateTaskRecommendations = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) throw { status: 401, message: "Unauthorized" };

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const progressRecords = await TaskProgress.find({
      user: userId,
      date: { $gte: sevenDaysAgo }, // Only fetch past 7 days
    })
      .populate<{ task: ITask }>("task", "title type goal")
      .sort({ date: 1 });

    if (!progressRecords.length) {
      throw { status: 404, message: "No task progress records found" };
    }

    // Step 2: Aggregate data by task
    const taskMap: {
      [taskId: string]: { task: ITask; scores: number[]; journals: string[] };
    } = {};
    progressRecords.forEach((record) => {
      const taskId = record.task._id.toString();
      if (!taskMap[taskId]) {
        taskMap[taskId] = {
          task: record.task,
          scores: [],
          journals: [],
        };
      }
      taskMap[taskId].scores.push(record.aiScore);
      taskMap[taskId].journals.push(record.aiFeedback || "No journal entry");
    });

    // Step 3: Calculate overall average aiScore
    const overallAvgScore =
      progressRecords.reduce((sum, record) => sum + record.aiScore, 0) /
      progressRecords.length;

    // Step 4: Construct AI prompt
    const taskSummaries = Object.keys(taskMap)
      .map((taskId) => {
        const { task, scores, journals } = taskMap[taskId];
        const avgScore = scores.reduce((sum, s) => sum + s, 0) / scores.length;
        return `
          Task ID: ${taskId}
          Title: ${task.title}
          Type: ${task.type}
          Goal: ${task.goal || "N/A"}
          Average aiScore: ${avgScore.toFixed(1)}
          Recent Scores (last 5 or fewer): [${scores.slice(-5).join(", ")}]
          Recent Journals (last 5 or fewer): 
          ${journals
            .slice(-5)
            .map((j, i) => `- Entry ${i + 1}: "${j}"`)
            .join("\n")}
        `;
      })
      .join("\n\n");

    const prompt = `
      You are an AI assistant for a self-improvement app. Based on the user's task performance data below, generate personalized task recommendations.  
      For each task, analyze the average aiScore, recent scores (to detect trends), and journal entries (for context).  
    
      **Instructions:**
      1. Categorize each task as:
         - "Great": Average aiScore is significantly above the overall average (${overallAvgScore.toFixed(
           1
         )} + 10).
         - "Struggling": Average aiScore is significantly below the overall average (${overallAvgScore.toFixed(
           1
         )} - 10).
         - "Normal": Within ±10 of the overall average.
      2. Detect trends from recent scores:
         - "Up": Scores are increasing (newer > older).
         - "Down": Scores are decreasing.
         - "Flat": No clear change.
      3. Suggest modifications:
         - Struggling + Down/Flat: Recommend an easier variation (e.g., reduce goal by 20%, shift time by +1 hour).
         - Great + Up: Recommend a harder variation (e.g., increase goal by 20%, shift time by -1 hour).
         - Otherwise: Suggest null (no change).
      4. Return a JSON array of objects with:  
         - "taskId": string
         - "title": string
         - "suggestion": string or null
         - "reason": string (explain why the suggestion was made or why no change was suggested)
    
      **Task Data:**
      ${taskSummaries}
    
      **Examples:**
      1. Task: "Write 1000 words", Avg aiScore: 60, Recent: [50, 60, 55], Journals: ["Got distracted"]
         Output: {"taskId": "t1", "title": "Write 1000 words", "suggestion": "Try 'Write 800 words' instead.", "reason": "Your average score is below the overall average and your recent performance isn’t improving."}
      2. Task: "Wake up at 5 AM", Avg aiScore: 80, Recent: [75, 85, 90], Journals: ["Up at 5!"]
         Output: {"taskId": "t2", "title": "Wake up at 5 AM", "suggestion": "Push to 'Wake up at 4 AM'.", "reason": "You’re doing great and your scores are trending upward, so let’s challenge you more."}
      3. Task: "Workout", Avg aiScore: 70, Recent: [70, 68, 72], Journals: ["Did 20 min"]
         Output: {"taskId": "t3", "title": "Workout", "suggestion": null, "reason": "Your performance is stable and within normal range, so no change is needed."}
    
      Return ONLY the JSON array. NO extra text.
    `;

    // Step 5: Get AI response
    const aiResult = await aiResponse(prompt);
    const jsonMatch = aiResult.match(/\[[\s\S]*\]/);
    if (!jsonMatch)
      throw { status: 500, message: "AI returned invalid format" };

    let recommendations: Recommendation[];
    try {
      recommendations = JSON.parse(jsonMatch[0]);
    } catch {
      throw { status: 500, message: "AI response parsing failed" };
    }

    // Step 6: Validate and return
    if (!Array.isArray(recommendations)) {
      throw { status: 500, message: "AI did not return an array" };
    }

    res.status(200).json({
      status: "success",
      message: "Recommendations generated successfully",
      data: recommendations,
    });
  } catch (error) {
    next(error);
  }
};
