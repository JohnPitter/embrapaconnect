import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { CreateFarmInput, UpdateFarmInput } from "@/types/farm";

export async function getFarmsByUser(userId: string) {
  return prisma.farm.findMany({
    where: { userId },
    include: {
      crops: {
        select: { id: true, type: true, currentStage: true, areaHectares: true },
      },
      _count: { select: { crops: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getFarmById(id: string, userId?: string) {
  return prisma.farm.findFirst({
    where: { id, ...(userId ? { userId } : {}) },
    include: {
      crops: true,
      chatRoom: { select: { id: true } },
      user: { select: { id: true, name: true, avatarConfig: true } },
    },
  });
}

export async function getAllFarmsForAdmin() {
  return prisma.farm.findMany({
    include: {
      user: { select: { id: true, name: true, avatarConfig: true } },
      crops: { select: { id: true, type: true, currentStage: true } },
      chatRoom: {
        include: {
          messages: {
            where: { type: "ALERT", readAt: null },
            select: { id: true, alertCategory: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createFarm(userId: string, data: CreateFarmInput) {
  const { boundaryCoords, ...rest } = data;
  return prisma.farm.create({
    data: {
      ...rest,
      userId,
      ...(boundaryCoords !== undefined
        ? { boundaryCoords: boundaryCoords as Prisma.InputJsonValue }
        : {}),
    },
  });
}

export async function updateFarm(id: string, userId: string, data: UpdateFarmInput) {
  const { boundaryCoords, ...rest } = data;
  return prisma.farm.update({
    where: { id, userId },
    data: {
      ...rest,
      ...(boundaryCoords !== undefined
        ? { boundaryCoords: boundaryCoords as Prisma.InputJsonValue }
        : {}),
    },
  });
}

export async function deleteFarm(id: string, userId: string) {
  return prisma.farm.delete({ where: { id, userId } });
}
