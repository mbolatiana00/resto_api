import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import {
  createUser,
  findUserByEmail,
  getUserById,
  updateUserPassword,
  updateUserVerified,
} from "../services/user.service";
import { generateToken } from "../utils/jwt";
import { sendOtpEmail } from "../services/emailopt/email.service";
import {
  generateOtpCode,
  saveOtp,
  verifyOtp,
} from "../services/emailopt/otp.service";

// ─── REGISTER ────────────────────────────────────────────────────────────────
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone } = req.body;

    const exists = await findUserByEmail(email);
    if (exists) {
      return res.status(400).json({ message: "Email already used" });
    }

    const user = await createUser(name, email, password, phone);

    const code = generateOtpCode();
    await saveOtp(user.id, code);

    try {
      await sendOtpEmail(email, code);
      console.log(`📧 OTP envoyé à ${email}`);
    } catch (mailError) {
      console.error("❌ Erreur SMTP :", mailError);
      console.log(`🔑 OTP pour test (console) : ${code}`);
    }

    res.status(201).json({
      message: "User created. Check your email to verify your account.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone ?? "",
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Register error" });
  }
};

// ─── VERIFY OTP ──────────────────────────────────────────────────────────────
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;

    // ✅ FIX: récupérer l'utilisateur pour obtenir son id
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isValid = await verifyOtp(user.id, code); // ✅ FIX: email → user.id
    if (!isValid) {
      return res.status(400).json({ message: "Invalid or expired OTP code" });
    }

    await updateUserVerified(email);

    res.json({ message: "Email verified successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Verification error" });
  }
};

// ─── LOGIN ───────────────────────────────────────────────────────────────────
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "Please verify your email first" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = generateToken({ id: user.id, role: user.role });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone ?? "",
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (e) {
    res.status(500).json({ message: "Login error" });
  }
};

// ─── PROFILE ─────────────────────────────────────────────────────────────────
export const profile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (e) {
    res.status(500).json({ message: "Profile error" });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "user introuvable" });
    }
    const code = generateOtpCode();
    await saveOtp(user.id, code);

    try {
      await sendOtpEmail(email, code);
      console.log(`📧 OTP de réinitialisation envoyé à ${email}`);
    } catch (error) {
      console.error("❌ Erreur SMTP :", error);
      console.log(`🔑 OTP pour test (console) : ${code}`);
    }
    res.json({ message: "Reset code sent to your email" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Forgot password error" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, code, newPassword } = req.body;
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isValid = await verifyOtp(user.id, code);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid or expired OTP code" });
    }
    await updateUserPassword(user.id, newPassword);
    res.json({ message: "Password reset successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Reset password error" });
  }
};
