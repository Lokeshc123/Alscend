import express from "express";
import { getUser, login, register } from "../controllers/UserController";
import { protect } from "../middlewares/verifyUser";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect as express.RequestHandler, getUser);

export default router;
