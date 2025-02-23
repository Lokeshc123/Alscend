import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { errorHandler } from "./middlewares/ErrorHandler";
import UserRoutes from "./routes/UserRoutes";
import TaskRoutes from "./routes/TaskRoutes";
import TaskProgressRoutes from "./routes/TaskProgressRoutes";
import JournalRoutes from "./routes/JournalRoutes";
import RecommendationsRoutes from "./routes/RecommendationsRoutes";
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/users", UserRoutes);
app.use("/api/tasks", TaskRoutes);
app.use("/api/task-progress", TaskProgressRoutes);
app.use("/api/journal", JournalRoutes);
app.use("/api/recommendations", RecommendationsRoutes);
app.use(errorHandler);
export default app;
