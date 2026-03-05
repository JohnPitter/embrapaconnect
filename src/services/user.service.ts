import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type { RegisterInput } from "@/lib/validators";

export async function createUser(data: Omit<RegisterInput, "confirmPassword">) {
  const passwordHash = await bcrypt.hash(data.password, 12);
  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      passwordHash,
      role: "FARMER",
    },
    select: { id: true, email: true, name: true, role: true },
  });
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      avatarConfig: true,
      phone: true,
    },
  });
}
