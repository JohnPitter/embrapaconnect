"use client";

import type { CropStage } from "@prisma/client";

interface MilhoPlantProps {
  stage: CropStage;
}

export function MilhoPlant({ stage }: MilhoPlantProps) {
  const hasCob = ["FRUTIFICACAO", "MATURACAO", "COLHEITA"].includes(stage);
  const hasTassel = ["FLORACAO", "FRUTIFICACAO", "MATURACAO", "COLHEITA"].includes(stage);
  const isEarly = ["PREPARO", "PLANTIO", "GERMINACAO"].includes(stage);

  if (isEarly) {
    return (
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 0.2, 5]} />
        <meshLambertMaterial color="#8BC34A" />
      </mesh>
    );
  }

  return (
    <group>
      {/* Stalk */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.07, 0.1, 2, 6]} />
        <meshLambertMaterial color="#558B2F" />
      </mesh>
      {/* Leaves */}
      {[-0.5, 0, 0.5, 1.0].map((y, i) => (
        <group key={i} position={[0, y + 0.2, 0]} rotation={[0, i * Math.PI * 0.5, 0]}>
          <mesh rotation={[0, 0, Math.PI / 6]}>
            <boxGeometry args={[0.7, 0.05, 0.15]} />
            <meshLambertMaterial color="#66BB6A" />
          </mesh>
        </group>
      ))}
      {/* Corn cob */}
      {hasCob && (
        <group position={[0.15, 0.8, 0]}>
          <mesh rotation={[0, 0, Math.PI / 6]}>
            <cylinderGeometry args={[0.12, 0.1, 0.5, 8]} />
            <meshLambertMaterial color="#FFD700" />
          </mesh>
          {/* Husk */}
          <mesh rotation={[0, 0, Math.PI / 6]} position={[0, 0, 0]}>
            <cylinderGeometry args={[0.14, 0.12, 0.55, 8]} />
            <meshLambertMaterial color="#8BC34A" transparent opacity={0.4} />
          </mesh>
        </group>
      )}
      {/* Tassel */}
      {hasTassel && (
        <group position={[0, 2.1, 0]}>
          {[-0.1, 0, 0.1, 0.05, -0.05].map((x, i) => (
            <mesh
              key={i}
              position={[x, i * 0.08, 0]}
              rotation={[0.2 * (i % 2 === 0 ? 1 : -1), 0, 0]}
            >
              <cylinderGeometry args={[0.01, 0.01, 0.3, 3]} />
              <meshLambertMaterial color="#D4AC0D" />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}
