import Journal from "../models/Journal";
import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../utils/customInterface";

export const createJournalEntry = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;
    const { title, content } = req.body;
    const journal = new Journal({ user: userId, title, content });
    await journal.save();
    res.status(201).json({
      status: "success",
      message: "Journal entry created successfully",
      data: journal,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllJournalEntriesForUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;
    const journals = await Journal.find({ user: userId });
    res.status(200).json({
      status: "success",
      message: "All journal entries",
      data: journals,
    });
  } catch (error) {
    next(error);
  }
};

export const getJournalEntry = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;
    const journalId = req.params.id;
    const journal = await Journal.findOne({ _id: journalId, user: userId });
    if (!journal) {
      throw { status: 404, message: "Journal entry not found" };
    }
    res.status(200).json({
      status: "success",
      message: "Journal entry",
      data: journal,
    });
  } catch (error) {
    next(error);
  }
};

export const updateJournalEntry = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;
    const journalId = req.params.id;

    const journal = await Journal.findOneAndUpdate(
      { _id: journalId, user: userId },
      req.body,
      { new: true }
    );
    if (!journal) {
      throw { status: 404, message: "Task not found" };
    }
    res.status(200).json({
      status: "success",
      message: "Journal entry updated successfully",
      data: journal,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteJournalEntry = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;
    const journalId = req.params.id;
    const journal = await Journal.findOneAndDelete({
      _id: journalId,
      user: userId,
    });
    if (!journal) {
      throw { status: 404, message: "Journal entry not found" };
    }
    res.status(200).json({
      status: "success",
      message: "Journal entry deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
