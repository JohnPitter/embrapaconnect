"use client";

import type { CropStage } from "@prisma/client";

interface SojaPlantProps {
  stage: CropStage;
}

const STAGE_SCALE: Record<string, number> = {
  PREPARO: 0.1,
  PLANTIO: 0.2,
  GERMINACAO: 0.4,
  CRESCIMENTO: 0.7,
  FLORACAO: 0.85,
  FRUTIFICACAO: 1.0,
  MATURACAO: 1.0,
  COLHEITA: 0.9,
};

export function SojaPlant({ stage }: SojaPlantProps) {
  const scale = STAGE_SCALE[stage] ?? 1;
  const hasFlowers = ["FLORACAO", "FRUTIFICACAO"].includes(stage);
  const isPodStage = ["FRUTIFICACAO", "MATURACAO", "COLHEITA"].includes(stage);
  const flowerColor = isPodStage ? "#8BC34A" : "#FFFFFF";

  if (scale < 0.3) {
    return (
      <mesh position={[0, 0.05 * scale, 0]}>
        <sphereGeometry args={[0.08 * scale, 6, 6]} />
        <meshLambertMaterial color="#8BC34A" />
      </mesh>
    );
  }

  return (
    <group scale={[scale, scale, scale]}>
      {/* Main stem */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.05, 0.08, 0.8, 5]} />
        <meshLambertMaterial color="#558B2F" />
      </mesh>
      {/* Trifoliate leaves */}
      {[0, Math.PI * 0.66, Math.PI * 1.33].map((angle, i) => (
        <group
          key={i}
          position={[Math.cos(angle) * 0.25, 0.5 + i * 0.15, Math.sin(angle) * 0.25]}
        >
          <mesh>
            <sphereGeometry args={[0.18, 6, 6]} />
            <meshLambertMaterial color="#66BB6A" />
          </mesh>
        </group>
      ))}
      {/* Top */}
      <mesh position={[0, 0.9, 0]}>
        <sphereGeometry args={[0.22, 7, 7]} />
        <meshLambertMaterial color="#81C784" />
      </mesh>
      {/* Flowers/pods */}
      {hasFlowers &&
        [0.2, -0.2, 0, 0.15, -0.1].map((x, i) => (
          <mesh
            key={i}
            position={[x, 0.6 + i * 0.06, 0.1 * (i % 2 === 0 ? 1 : -1)]}
          >
            <sphereGeometry args={[0.06, 5, 5]} />
            <meshLambertMaterial color={flowerColor} />
          </mesh>
        ))}
    </group>
  );
}
