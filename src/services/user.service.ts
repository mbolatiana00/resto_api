import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = "SECRET_KEY";

export const register = async (data: any) => {
  const hashed = await bcrypt.hash(data.password, 10);

  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashed
    }
  });
};

export const login = async (data: any) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email }
  });

  if (!user) throw new Error("User not found");

  const valid = await bcrypt.compare(data.password, user.password);
  if (!valid) throw new Error("Invalid password");

  return jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: "1d" }
  );
};
