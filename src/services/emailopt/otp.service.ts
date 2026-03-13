import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Génère un code à 6 chiffres
export const generateOtpCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Sauvegarde le code OTP en base
export const saveOtp = async (email: string, code: string) => {
  // Supprime les anciens OTP de cet email
  await prisma.otpToken.deleteMany({ where: { email } });

  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // +10 minutes

  return prisma.otpToken.create({
    data: {
      email,
      code,
      expiresAt,
    },
  });
};

// Vérifie le code OTP
export const verifyOtp = async (email: string, code: string) => {
  const otp = await prisma.otpToken.findFirst({
    where: {
      email,
      code,
      used: false,
      expiresAt: { gt: new Date() }, // pas encore expiré
    },
  });

  if (!otp) return false;

  // Marque le code comme utilisé
  await prisma.otpToken.update({
    where: { id: otp.id },
    data: { used: true },
  });

  return true;
};