import express from "express";
import { protect } from "../middlewares/verifyUser";
import { generateAiReport } from "../controllers/TaskProgressController";

const router = express.Router();

router.post(
  "/generate-report",
  protect as express.RequestHandler,
  generateAiReport
);

export default router;
