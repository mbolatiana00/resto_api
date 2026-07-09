import { Router } from "express";
import { login, profile, register, verifyEmail, forgotPassword, resetPassword } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

    
router.post("/register", register)
router.post("/verify-email", verifyEmail);
router.post("/login", login);
router.get("/me", authMiddleware, profile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
