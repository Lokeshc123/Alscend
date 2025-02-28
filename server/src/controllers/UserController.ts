import User from "../models/User";
import { Request, Response, NextFunction } from "express";
import generateToken from "../utils/generateToken";
import bcrypt from "bcryptjs";
import { AuthRequest } from "../utils/customInterface";
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;
    const isExistingUser = await User.findOne({ email });
    if (isExistingUser) {
      throw { status: 400, message: "User already exists" };
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      authProvider: "email",
    });
    await user.save();
    const token = generateToken(user._id as string);

    res.status(201).json({ success: true, user: user, token: token });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const isExistingUser = await User.findOne({ email });
    if (!isExistingUser) {
      throw { status: 400, message: "Invalid credentials" };
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      isExistingUser.password as string
    );
    if (!isPasswordValid) {
      throw { status: 400, message: "Invalid credentials" };
    }
    const token = generateToken(isExistingUser._id as string);
    res.status(200).json({ success: true, user: isExistingUser, token: token });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.user?._id).select("-password");
    if (!user) {
      throw { status: 404, message: "User not found" };
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};
