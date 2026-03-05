import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function createPasswordResetToken(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null; // Não revelar se email existe

  // Invalidar tokens anteriores
  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

  await prisma.passwordResetToken.create({
    data: {
      token: hashedToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hora
    },
  });

  return rawToken; // Retorna token não hasheado para enviar no email
}

export async function validateAndUseResetToken(
  rawToken: string,
  newPassword: string
) {
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  const record = await prisma.passwordResetToken.findUnique({
    where: { token: hashedToken },
    include: { user: true },
  });

  if (!record || record.usedAt || record.expiresAt < new Date()) {
    return { success: false, error: "Token inválido ou expirado" };
  }

  const bcrypt = await import("bcryptjs");
  const passwordHash = await bcrypt.hash(newPassword, 12);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    }),
  ]);

  return { success: true };
}
