import { Router } from "express";
import { login, profile, register } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();


router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, profile);

export default router;
