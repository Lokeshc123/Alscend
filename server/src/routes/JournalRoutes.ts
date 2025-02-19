import express from "express";
import { protect } from "../middlewares/verifyUser";
import {
  createJournalEntry,
  deleteJournalEntry,
  getAllJournalEntriesForUser,
  getJournalEntry,
  updateJournalEntry,
} from "../controllers/JournalController";

const router = express.Router();

router.post("/new", protect as express.RequestHandler, createJournalEntry); // Create a new journal
router.get(
  "/get-all",
  protect as express.RequestHandler,
  getAllJournalEntriesForUser
);
router.get(
  "/get-details/:id",
  protect as express.RequestHandler,
  getJournalEntry
);
router.put(
  "/update/:id",
  protect as express.RequestHandler,
  updateJournalEntry
);

router.delete(
  "/delete/:id",
  protect as express.RequestHandler,
  deleteJournalEntry
);

export default router;
