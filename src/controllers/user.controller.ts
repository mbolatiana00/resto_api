import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import {
  createUser,
  findUserByEmail,
  getUserById,
} from "../services/user.service";
import { generateToken } from "../utils/jwt";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone } = req.body;

    const exists = await findUserByEmail(email);
    if (exists) {
      return res.status(400).json({ message: "Email already used" });
    }

    const user = await createUser(name, email, password, phone);
    res.status(201).json({
      message: "User created",
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (e) {
    res.status(500).json({ message: "Register error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = generateToken({
      id: user.id,
      role: user.role,
    });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    res.status(500).json({ message: "Login error" });
  }
};

export const profile = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const user = await getUserById(userId);
  res.json(user);
};
