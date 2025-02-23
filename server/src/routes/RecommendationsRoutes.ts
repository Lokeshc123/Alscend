import express from "express";
import { protect } from "../middlewares/verifyUser";
import { generateTaskRecommendations } from "../controllers/RecommendationController";
// import { getRecommendation } from "../controllers/RecommendationController";

const router = express.Router();

router.get(
  "/recommendations",
  protect as express.RequestHandler,
  generateTaskRecommendations
);

export default router;
