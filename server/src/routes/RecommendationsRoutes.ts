import express from "express";
import { protect } from "../middlewares/verifyUser";
import {
  generateTaskRecommendations,
  recommendNewTasks,
} from "../controllers/RecommendationController";
// import { getRecommendation } from "../controllers/RecommendationController";

const router = express.Router();

router.get(
  "/recommendations",
  protect as express.RequestHandler,
  generateTaskRecommendations
);

router.get("/newTasks", protect as express.RequestHandler, recommendNewTasks);

export default router;
