import { prisma } from "@/lib/prisma";
import type { AvatarConfig } from "@/types/avatar";
import { Prisma } from "@prisma/client";

export async function getAvatarConfig(userId: string): Promise<AvatarConfig | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { avatarConfig: true },
  });
  return (user?.avatarConfig as unknown as AvatarConfig) ?? null;
}

export async function saveAvatarConfig(
  userId: string,
  config: AvatarConfig
): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { avatarConfig: config as unknown as Prisma.InputJsonValue },
  });
}
