import { CropStage, CropType } from "@prisma/client";

interface StageConfig {
  stage: CropStage;
  startDay: number;
  endDay: number;
  percentage: number;
}

interface CropCycleConfig {
  totalDays: number;
  stages: StageConfig[];
}

export const CROP_CYCLES: Record<CropType, CropCycleConfig> = {
  SOJA: {
    totalDays: 120,
    stages: [
      { stage: "PREPARO", startDay: 0, endDay: 5, percentage: 0 },
      { stage: "PLANTIO", startDay: 6, endDay: 10, percentage: 5 },
      { stage: "GERMINACAO", startDay: 11, endDay: 20, percentage: 15 },
      { stage: "CRESCIMENTO", startDay: 21, endDay: 50, percentage: 40 },
      { stage: "FLORACAO", startDay: 51, endDay: 70, percentage: 65 },
      { stage: "FRUTIFICACAO", startDay: 71, endDay: 95, percentage: 80 },
      { stage: "MATURACAO", startDay: 96, endDay: 115, percentage: 95 },
      { stage: "COLHEITA", startDay: 116, endDay: 120, percentage: 100 },
    ],
  },
  MILHO: {
    totalDays: 135,
    stages: [
      { stage: "PREPARO", startDay: 0, endDay: 5, percentage: 0 },
      { stage: "PLANTIO", startDay: 6, endDay: 10, percentage: 5 },
      { stage: "GERMINACAO", startDay: 11, endDay: 18, percentage: 12 },
      { stage: "CRESCIMENTO", startDay: 19, endDay: 60, percentage: 40 },
      { stage: "FLORACAO", startDay: 61, endDay: 80, percentage: 60 },
      { stage: "FRUTIFICACAO", startDay: 81, endDay: 100, percentage: 78 },
      { stage: "MATURACAO", startDay: 101, endDay: 130, percentage: 95 },
      { stage: "COLHEITA", startDay: 131, endDay: 135, percentage: 100 },
    ],
  },
  CAFE: {
    totalDays: 730,
    stages: [
      { stage: "PREPARO", startDay: 0, endDay: 10, percentage: 0 },
      { stage: "PLANTIO", startDay: 11, endDay: 20, percentage: 3 },
      { stage: "GERMINACAO", startDay: 21, endDay: 90, percentage: 10 },
      { stage: "CRESCIMENTO", startDay: 91, endDay: 365, percentage: 40 },
      { stage: "FLORACAO", startDay: 366, endDay: 450, percentage: 60 },
      { stage: "FRUTIFICACAO", startDay: 451, endDay: 600, percentage: 75 },
      { stage: "MATURACAO", startDay: 601, endDay: 700, percentage: 90 },
      { stage: "COLHEITA", startDay: 701, endDay: 730, percentage: 100 },
    ],
  },
  CANA: {
    totalDays: 365,
    stages: [
      { stage: "PREPARO", startDay: 0, endDay: 10, percentage: 0 },
      { stage: "PLANTIO", startDay: 11, endDay: 20, percentage: 5 },
      { stage: "GERMINACAO", startDay: 21, endDay: 40, percentage: 10 },
      { stage: "CRESCIMENTO", startDay: 41, endDay: 200, percentage: 45 },
      { stage: "FLORACAO", startDay: 201, endDay: 260, percentage: 65 },
      { stage: "FRUTIFICACAO", startDay: 261, endDay: 320, percentage: 80 },
      { stage: "MATURACAO", startDay: 321, endDay: 355, percentage: 95 },
      { stage: "COLHEITA", startDay: 356, endDay: 365, percentage: 100 },
    ],
  },
  ALGODAO: {
    totalDays: 160,
    stages: [
      { stage: "PREPARO", startDay: 0, endDay: 5, percentage: 0 },
      { stage: "PLANTIO", startDay: 6, endDay: 10, percentage: 5 },
      { stage: "GERMINACAO", startDay: 11, endDay: 20, percentage: 12 },
      { stage: "CRESCIMENTO", startDay: 21, endDay: 70, percentage: 40 },
      { stage: "FLORACAO", startDay: 71, endDay: 100, percentage: 65 },
      { stage: "FRUTIFICACAO", startDay: 101, endDay: 130, percentage: 80 },
      { stage: "MATURACAO", startDay: 131, endDay: 155, percentage: 95 },
      { stage: "COLHEITA", startDay: 156, endDay: 160, percentage: 100 },
    ],
  },
  TRIGO: {
    totalDays: 115,
    stages: [
      { stage: "PREPARO", startDay: 0, endDay: 5, percentage: 0 },
      { stage: "PLANTIO", startDay: 6, endDay: 10, percentage: 5 },
      { stage: "GERMINACAO", startDay: 11, endDay: 18, percentage: 12 },
      { stage: "CRESCIMENTO", startDay: 19, endDay: 55, percentage: 40 },
      { stage: "FLORACAO", startDay: 56, endDay: 75, percentage: 62 },
      { stage: "FRUTIFICACAO", startDay: 76, endDay: 95, percentage: 80 },
      { stage: "MATURACAO", startDay: 96, endDay: 110, percentage: 95 },
      { stage: "COLHEITA", startDay: 111, endDay: 115, percentage: 100 },
    ],
  },
  ARROZ: {
    totalDays: 120,
    stages: [
      { stage: "PREPARO", startDay: 0, endDay: 5, percentage: 0 },
      { stage: "PLANTIO", startDay: 6, endDay: 10, percentage: 5 },
      { stage: "GERMINACAO", startDay: 11, endDay: 22, percentage: 15 },
      { stage: "CRESCIMENTO", startDay: 23, endDay: 60, percentage: 45 },
      { stage: "FLORACAO", startDay: 61, endDay: 80, percentage: 65 },
      { stage: "FRUTIFICACAO", startDay: 81, endDay: 100, percentage: 82 },
      { stage: "MATURACAO", startDay: 101, endDay: 115, percentage: 95 },
      { stage: "COLHEITA", startDay: 116, endDay: 120, percentage: 100 },
    ],
  },
  FEIJAO: {
    totalDays: 85,
    stages: [
      { stage: "PREPARO", startDay: 0, endDay: 3, percentage: 0 },
      { stage: "PLANTIO", startDay: 4, endDay: 7, percentage: 5 },
      { stage: "GERMINACAO", startDay: 8, endDay: 14, percentage: 12 },
      { stage: "CRESCIMENTO", startDay: 15, endDay: 40, percentage: 40 },
      { stage: "FLORACAO", startDay: 41, endDay: 55, percentage: 65 },
      { stage: "FRUTIFICACAO", startDay: 56, endDay: 70, percentage: 82 },
      { stage: "MATURACAO", startDay: 71, endDay: 82, percentage: 95 },
      { stage: "COLHEITA", startDay: 83, endDay: 85, percentage: 100 },
    ],
  },
  MANDIOCA: {
    totalDays: 360,
    stages: [
      { stage: "PREPARO", startDay: 0, endDay: 10, percentage: 0 },
      { stage: "PLANTIO", startDay: 11, endDay: 20, percentage: 5 },
      { stage: "GERMINACAO", startDay: 21, endDay: 45, percentage: 10 },
      { stage: "CRESCIMENTO", startDay: 46, endDay: 180, percentage: 45 },
      { stage: "FLORACAO", startDay: 181, endDay: 240, percentage: 60 },
      { stage: "FRUTIFICACAO", startDay: 241, endDay: 300, percentage: 75 },
      { stage: "MATURACAO", startDay: 301, endDay: 350, percentage: 92 },
      { stage: "COLHEITA", startDay: 351, endDay: 360, percentage: 100 },
    ],
  },
  OUTRO: {
    totalDays: 120,
    stages: [
      { stage: "PREPARO", startDay: 0, endDay: 5, percentage: 0 },
      { stage: "PLANTIO", startDay: 6, endDay: 10, percentage: 5 },
      { stage: "GERMINACAO", startDay: 11, endDay: 20, percentage: 15 },
      { stage: "CRESCIMENTO", startDay: 21, endDay: 50, percentage: 40 },
      { stage: "FLORACAO", startDay: 51, endDay: 70, percentage: 65 },
      { stage: "FRUTIFICACAO", startDay: 71, endDay: 95, percentage: 80 },
      { stage: "MATURACAO", startDay: 96, endDay: 115, percentage: 95 },
      { stage: "COLHEITA", startDay: 116, endDay: 120, percentage: 100 },
    ],
  },
};

export interface GrowthDataPoint {
  day: number;
  percentage: number;
  stage: CropStage;
}

export function generateGrowthData(
  type: CropType,
  plantedAt: Date
): {
  growthData: GrowthDataPoint[];
  estimatedHarvestAt: Date;
} {
  const cycle = CROP_CYCLES[type];
  const growthData: GrowthDataPoint[] = [];

  for (let day = 0; day <= cycle.totalDays; day++) {
    const stageConfig =
      [...cycle.stages].reverse().find((s) => s.startDay <= day) ??
      cycle.stages[0];
    const nextStage = cycle.stages.find((s) => s.startDay > day);

    let percentage = stageConfig.percentage;
    if (nextStage && stageConfig.endDay > stageConfig.startDay) {
      const dayProgress =
        (day - stageConfig.startDay) /
        (stageConfig.endDay - stageConfig.startDay);
      percentage =
        stageConfig.percentage +
        dayProgress * (nextStage.percentage - stageConfig.percentage);
    }

    growthData.push({
      day,
      percentage: Math.min(100, Math.round(percentage * 10) / 10),
      stage: stageConfig.stage,
    });
  }

  const estimatedHarvestAt = new Date(plantedAt);
  estimatedHarvestAt.setDate(
    estimatedHarvestAt.getDate() + cycle.totalDays
  );

  return { growthData, estimatedHarvestAt };
}

export function getCurrentGrowthPoint(
  growthData: GrowthDataPoint[],
  plantedAt: Date
): GrowthDataPoint {
  const daysSincePlanting = Math.floor(
    (Date.now() - plantedAt.getTime()) / (1000 * 60 * 60 * 24)
  );
  return (
    growthData[Math.min(daysSincePlanting, growthData.length - 1)] ??
    growthData[0]
  );
}
