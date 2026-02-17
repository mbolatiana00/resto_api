import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const createUser = async (
  name: string,
  email: string,
  password: string,
  phone?: string
) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      name,
      email,
      phone,
      password: hashedPassword,
    },
  });
};

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const getUserById = async (id: number) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
    },
  });
};
