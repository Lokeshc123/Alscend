import express from "express";
import { protect } from "../middlewares/verifyUser";
import {
  generateTaskRecommendations,
  recommendNewCategories,
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
router.get("/newCategories", protect as express.RequestHandler, recommendNewCategories);


export default router;
