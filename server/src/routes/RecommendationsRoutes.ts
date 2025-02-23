import express from "express";
import { protect } from "../middlewares/verifyUser";
// import { getRecommendation } from "../controllers/RecommendationController";

const router = express.Router();

// router.get(
//   "/get-recommendations",
//   protect as express.RequestHandler,
//   getRecommendation
// );

export default router;
