"use client";

import type { CropStage } from "@prisma/client";

const STAGE_COLORS: Record<string, string> = {
  PREPARO: "#8B6914",
  PLANTIO: "#C8A96E",
  GERMINACAO: "#8BC34A",
  CRESCIMENTO: "#4CAF50",
  FLORACAO: "#FFEB3B",
  FRUTIFICACAO: "#FF9800",
  MATURACAO: "#FFC107",
  COLHEITA: "#FF5722",
};

interface GenericPlantProps {
  stage: CropStage;
}

export function GenericPlant({ stage }: GenericPlantProps) {
  const color = STAGE_COLORS[stage] ?? "#4CAF50";
  const isEarlyStage = ["PREPARO", "PLANTIO"].includes(stage);

  if (isEarlyStage) {
    return (
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.05, 0.08, 0.1, 6]} />
        <meshLambertMaterial color={color} />
      </mesh>
    );
  }

  return (
    <group>
      {/* Stem */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.06, 0.1, 1, 6]} />
        <meshLambertMaterial color="#33691E" />
      </mesh>
      {/* Main foliage */}
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.5, 8, 8]} />
        <meshLambertMaterial color={color} />
      </mesh>
      {/* Side branches */}
      <mesh position={[0.3, 0.8, 0]} rotation={[0, 0, Math.PI / 4]}>
        <cylinderGeometry args={[0.04, 0.04, 0.5, 5]} />
        <meshLambertMaterial color="#33691E" />
      </mesh>
      <mesh position={[-0.3, 0.8, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <cylinderGeometry args={[0.04, 0.04, 0.5, 5]} />
        <meshLambertMaterial color="#33691E" />
      </mesh>
    </group>
  );
}
