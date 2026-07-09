import { prisma } from "../lib/prisma"; // chemin relatif depuis lib/prisma.ts
import bcrypt from "bcryptjs";



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
export const updateUserVerified = async (email :string) =>{
  return prisma.user.update({
    where: { email },
    data: { isVerified: true },
  });
}
export const updateUserPassword = async (id: number, newPassword: string) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  return prisma.user.update({
    where: { id },
    data: { password: hashedPassword },
  });
};