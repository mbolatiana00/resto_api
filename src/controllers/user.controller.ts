import { Request, Response } from "express";
import * as userService from "../services/user.service";

export const register = async (req: Request, res: Response) => {
  const user = await userService.register(req.body);
  res.status(201).json(user);
};

export const login = async (req: Request, res: Response) => {
  const token = await userService.login(req.body);
  res.json({ token });
};

export const getProfile = async (req: any, res: Response) => {
  res.json(req.user);
};
