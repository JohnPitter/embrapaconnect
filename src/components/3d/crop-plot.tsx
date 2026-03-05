"use client";

import type { CropStage } from "@prisma/client";
import { SojaPlant } from "./crop-models/soja-plant";
import { MilhoPlant } from "./crop-models/milho-plant";
import { GenericPlant } from "./crop-models/generic-plant";

interface GrowthPoint {
  day: number;
  percentage: number;
  stage: string;
}

interface CropData {
  id: string;
  type: string;
  growthData: GrowthPoint[];
}

interface CropPlotProps {
  crop: CropData;
  position: [number, number, number];
  currentDay: number;
}

const PLANT_POSITIONS: [number, number][] = [
  [-0.7, -0.7], [0, -0.7], [0.7, -0.7],
  [-0.7, 0],    [0, 0],    [0.7, 0],
  [-0.7, 0.7],  [0, 0.7],  [0.7, 0.7],
];

export function CropPlot({ crop, position, currentDay }: CropPlotProps) {
  const growthData = crop.growthData;
  const point =
    growthData[Math.min(currentDay, growthData.length - 1)] ??
    growthData[0] ?? { day: 0, percentage: 0, stage: "PREPARO" };
  const scale = Math.max(0.05, point.percentage / 100);
  const stage = point.stage as CropStage;

  const PlantComponent =
    crop.type === "SOJA"
      ? SojaPlant
      : crop.type === "MILHO"
        ? MilhoPlant
        : GenericPlant;

  const soilColor =
    point.percentage > 80
      ? "#8B6914"
      : point.percentage > 30
        ? "#6B4F2A"
        : "#5C4033";

  return (
    <group position={position}>
      {/* Plot soil */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[3.2, 3.2]} />
        <meshLambertMaterial color={soilColor} />
      </mesh>
      {/* Soil border */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.55, 1.65, 20]} />
        <meshLambertMaterial color="#3E2723" />
      </mesh>
      {/* Plants in a grid pattern */}
      {PLANT_POSITIONS.map(([x, z], i) => (
        <group
          key={i}
          position={[x, 0, z]}
          scale={[scale * 0.6, scale * 0.6, scale * 0.6]}
        >
          <PlantComponent stage={stage} />
        </group>
      ))}
    </group>
  );
}
