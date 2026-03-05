/// <reference types="@react-three/fiber" />
"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sky } from "@react-three/drei";
import { Suspense } from "react";
import { Terrain } from "./terrain";
import { CropPlot } from "./crop-plot";
import { Buildings } from "./buildings";
import { Decorations } from "./decorations";

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

interface FarmSceneProps {
  crops: CropData[];
  currentDay?: number;
}

function LoadingBox() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshLambertMaterial color="#C6E832" />
    </mesh>
  );
}

export function FarmScene({ crops, currentDay = 0 }: FarmSceneProps) {
  const cropPositions: [number, number, number][] = crops.map((_, index) => {
    const col = index % 3;
    const row = Math.floor(index / 3);
    return [col * 4 - 4, 0, row * 4 - 4];
  });

  return (
    <div className="h-full w-full overflow-hidden rounded-xl">
      <Canvas
        shadows
        camera={{ position: [12, 10, 12], fov: 50 }}
        gl={{ antialias: true }}
        style={{ background: "#87CEEB" }}
      >
        <Suspense fallback={<LoadingBox />}>
          <ambientLight intensity={0.6} />
          <directionalLight
            position={[15, 15, 8]}
            intensity={1.5}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <Sky sunPosition={[100, 20, 100]} turbidity={8} rayleigh={0.5} />
          <Terrain />
          <Buildings />
          <Decorations />
          {crops.map((crop, index) => (
            <CropPlot
              key={crop.id}
              crop={crop}
              position={cropPositions[index] ?? [0, 0, 0]}
              currentDay={currentDay}
            />
          ))}
          <OrbitControls
            enablePan={true}
            minDistance={4}
            maxDistance={35}
            maxPolarAngle={Math.PI / 2.1}
          />
          <fog attach="fog" args={["#c8e8c0", 25, 70]} />
        </Suspense>
      </Canvas>
    </div>
  );
}
