import express from "express";
import {
  createJournalEntryForTask,
  createTask,
  deleteAllTasksForUser,
  deleteTask,
  getDetailsOfTask,
  getUserTasks,
  updateTask,
} from "../controllers/TaskController";
import { protect } from "../middlewares/verifyUser";

const router = express.Router();

router.post("/new", createTask); // Create a new task
router.get("/get-tasks", protect as express.RequestHandler, getUserTasks); // Get all tasks for a user
router.get(
  "/get-task/:id",
  protect as express.RequestHandler,
  getDetailsOfTask
); // Get a single task
router.delete(
  "/delete-task/:id",
  protect as express.RequestHandler,
  deleteTask
); // Delete a task
router.put("/update-task/:id", protect as express.RequestHandler, updateTask); // Update a task
router.delete(
  "/delete-all-tasks",
  protect as express.RequestHandler,
  deleteAllTasksForUser
); // Delete all tasks
router.post(
  "/add-journal-entry",
  protect as express.RequestHandler,
  createJournalEntryForTask
); // Create a new journal entry
export default router;
