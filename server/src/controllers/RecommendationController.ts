import Task, { ITask } from "../models/Task";
import TaskProgress, { ITaskProgress } from "../models/TaskProgress";
import { aiResponse } from "../utils/aiResponse";
import { Response, NextFunction } from "express";
import {
  AuthRequest,
  Recommendation,
  RecommendedTask,
} from "../utils/customInterface";
import { ca } from "date-fns/locale";

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

export const recommendNewTasks = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;
    const {mode , requestCategory} = req.params;
    
    if (!userId) throw { status: 401, message: "Unauthorized" };

    // Fetch existing tasks for the user
    const tasks = await Task.find({ user: userId }).select("category");

    // List of all possible categories
    const categories = [
      "Productivity",
      "Work",
      "Hobby",
      "Health & Fitness",
      "Personal Development",
      "Finance",
      "Social & Relationships",
      "Self-care",
      "Household & Chores",
      "Entertainment",
    ];

    // Filter out categories the user already has tasks in
    const filteredCategories = categories.filter(
      (c) => !tasks.some((t) => t.category === c)
    );

    // If no new categories are available, return a message
    if (filteredCategories.length === 0) {
      res.status(200).json({
        status: "success",
        message: "All categories are already covered by existing tasks.",
        data: [],
      });
      return;
    }

    // Construct AI prompt
    const prompt = `
  You are an AI assistant for a self-improvement app. Based on the available categories below, recommend 3 new tasks for the user to try.  
  These tasks should help the user explore new areas of self-improvement.  

  **Available Categories:**
  ${filteredCategories.join(", ")}

  **Instructions:**
  1. Suggest exactly 3 unique tasks, each from a different category in the list.
  2. For each task, provide:
     - "title": string (short, descriptive name)
     - "description": string (optional, brief explanation)
     - "type": "one-time" or "continuous"
     - "goal": number (optional, only for "continuous" tasks, e.g., words to write, minutes to spend)
     - "progress": number (optional, only for "continuous" tasks, default to 0 if provided)
     - "category": string (one of the available categories)
     - "reason": string (why this task is recommended)
  3. Ensure the tasks are practical, engaging, and suited to the category.
  4. Return a JSON array of 3 objects with the above fields.

  **Examples:**
  - Category: Productivity
    Output: {"title": "Organize Desk", "description": "Spend time decluttering your workspace.", "type": "one-time", "category": "Productivity", "reason": "A tidy desk boosts focus and efficiency."}
  - Category: Health & Fitness
    Output: {"title": "Run 5km", "type": "continuous", "goal": 5, "progress": 0, "category": "Health & Fitness", "reason": "Running improves stamina and overall fitness."}
  - Category: Self-care
    Output: {"title": "Meditate for 10 minutes", "description": "Practice mindfulness daily.", "type": "continuous", "goal": 10, "progress": 0, "category": "Self-care", "reason": "Meditation reduces stress and enhances mental clarity."}

  Return ONLY the JSON array. NO extra text.
`;

    // Get AI response
    const aiResult = await aiResponse(prompt);
    const jsonMatch = aiResult.match(/\[[\s\S]*\]/);
    if (!jsonMatch)
      throw { status: 500, message: "AI returned invalid format" };

    let recommendations: RecommendedTask[];
    try {
      recommendations = JSON.parse(jsonMatch[0]);
    } catch {
      throw { status: 500, message: "AI response parsing failed" };
    }

    // Validate response
    if (!Array.isArray(recommendations) || recommendations.length !== 3) {
      throw { status: 500, message: "AI did not return exactly 3 tasks" };
    }

    // Ensure each task has required fields and correct structure
    recommendations.forEach((task) => {
      if (!task.title || !["one-time", "continuous"].includes(task.type)) {
        throw { status: 500, message: "AI returned invalid task structure" };
      }
      if (
        task.type === "continuous" &&
        (task.goal === undefined || task.goal <= 0)
      ) {
        throw {
          status: 500,
          message: "Continuous tasks must have a valid goal",
        };
      }
      if (
        task.type === "one-time" &&
        (task.goal !== undefined || task.progress !== undefined)
      ) {
        throw {
          status: 500,
          message: "One-time tasks should not have goal or progress",
        };
      }
      // Default progress to 0 for continuous tasks if not provided
      if (task.type === "continuous" && task.progress === undefined) {
        task.progress = 0;
      }
    });

    res.status(200).json({
      status: "success",
      message: "New task recommendations generated successfully",
      data: recommendations,
    });
  } catch (error) {
    next(error);
  }
};



export const recommendNewCategories = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      throw { status: 401, message: "Unauthorized" };
    }

    // Get user's current task categories
    const tasks = await Task.find({ user: userId }).select("category");
    const existingCategories = tasks.map((t) => t.category);

    // AI prompt
    const prompt = `
You are an AI assistant for a self-improvement app. The user currently has tasks in the following categories: 
${existingCategories.join(", ")}

**Instructions:**
1. Recommend exactly 5 NEW categories that are NOT in the existing list.
2. Categories can be fun, exploratory, unusual, or creative but still helpful for self-improvement.
3. For each category, provide:
   - "category": string
4. Return ONLY a JSON array of 5 objects. No extra text.
`;

  
    // Get AI response
    const aiResult = await aiResponse(prompt);
    const jsonMatch = aiResult.match(/\[[\s\S]*\]/);
    if (!jsonMatch)
      throw { status: 500, message: "AI returned invalid format" };

    let newCategories;
    try {
      newCategories = JSON.parse(jsonMatch[0]);
    } catch {
      throw { status: 500, message: "AI response parsing failed" };
    }

    // Validate response
    if (!Array.isArray(newCategories) || newCategories.length !== 5) {
      throw { status: 500, message: "AI did not return exactly 5 categories" };
    }

    // Ensure each category has required fields
    newCategories.forEach((cat) => {
      if (!cat.category) {
        throw { status: 500, message: "AI returned invalid category structure" };
      }
    });

    res.status(200).json({
      status: "success",
      message: "New category recommendations generated successfully",
      data: newCategories,
    });
  } catch (error) {
    next(error);
  }
};
