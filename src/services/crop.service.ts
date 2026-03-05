import { prisma } from "@/lib/prisma";
import { CropType, Prisma } from "@prisma/client";
import {
  generateGrowthData,
  getCurrentGrowthPoint,
  type GrowthDataPoint,
} from "@/lib/crop-growth";
import type { CreateCropInput, UpdateCropInput, CropWithGrowth } from "@/types/crop";

export async function getCropsByFarm(farmId: string): Promise<CropWithGrowth[]> {
  const crops = await prisma.crop.findMany({
    where: { farmId },
    orderBy: { plantedAt: "desc" },
  });

  return crops.map((crop) => {
    const growthData = crop.growthData as unknown as GrowthDataPoint[];
    const currentGrowthPoint = getCurrentGrowthPoint(growthData, crop.plantedAt);
    return { ...crop, growthData, currentGrowthPoint };
  });
}

export async function getCropById(
  cropId: string,
  farmId: string
): Promise<CropWithGrowth | null> {
  const crop = await prisma.crop.findFirst({
    where: { id: cropId, farmId },
    include: { logs: { orderBy: { loggedAt: "desc" }, take: 10 } },
  });

  if (!crop) return null;

  const growthData = crop.growthData as unknown as GrowthDataPoint[];
  const currentGrowthPoint = getCurrentGrowthPoint(growthData, crop.plantedAt);
  return { ...crop, growthData, currentGrowthPoint };
}

export async function createCrop(
  farmId: string,
  input: CreateCropInput
): Promise<CropWithGrowth> {
  const plantedAt = new Date(input.plantedAt);
  const { growthData, estimatedHarvestAt } = generateGrowthData(
    input.type as CropType,
    plantedAt
  );

  const firstStage = growthData[0]?.stage ?? "PREPARO";
  const firstPercentage = growthData[0]?.percentage ?? 0;

  const crop = await prisma.crop.create({
    data: {
      farmId,
      type: input.type as CropType,
      customTypeName: input.customTypeName,
      areaHectares: input.areaHectares,
      plantedAt,
      estimatedHarvestAt,
      currentStage: firstStage,
      stageUpdatedAt: new Date(),
      growthData: growthData as unknown as Prisma.InputJsonValue,
    },
  });

  await prisma.cropLog.create({
    data: {
      cropId: crop.id,
      stage: firstStage,
      percentage: firstPercentage,
      notes: "Plantação registrada",
    },
  });

  const currentGrowthPoint = getCurrentGrowthPoint(growthData, plantedAt);
  return { ...crop, growthData, currentGrowthPoint };
}

export async function updateCrop(
  cropId: string,
  farmId: string,
  input: UpdateCropInput
): Promise<CropWithGrowth | null> {
  const existing = await prisma.crop.findFirst({ where: { id: cropId, farmId } });
  if (!existing) return null;

  const crop = await prisma.crop.update({
    where: { id: cropId },
    data: {
      ...(input.customTypeName !== undefined && { customTypeName: input.customTypeName }),
      ...(input.areaHectares !== undefined && { areaHectares: input.areaHectares }),
      ...(input.currentStage !== undefined && {
        currentStage: input.currentStage,
        stageUpdatedAt: new Date(),
      }),
    },
  });

  const growthData = crop.growthData as unknown as GrowthDataPoint[];
  const currentGrowthPoint = getCurrentGrowthPoint(growthData, crop.plantedAt);
  return { ...crop, growthData, currentGrowthPoint };
}

export async function deleteCrop(cropId: string, farmId: string): Promise<boolean> {
  const existing = await prisma.crop.findFirst({ where: { id: cropId, farmId } });
  if (!existing) return false;
  await prisma.crop.delete({ where: { id: cropId } });
  return true;
}
