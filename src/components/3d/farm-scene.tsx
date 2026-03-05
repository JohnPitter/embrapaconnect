"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, OrthographicCamera } from "@react-three/drei";
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
      <meshLambertMaterial color="#C8E8B4" />
    </mesh>
  );
}

export function FarmScene({ crops, currentDay = 0 }: FarmSceneProps) {
  const cropPositions: [number, number, number][] = crops.map((_, index) => {
    const col = index % 3;
    const row = Math.floor(index / 3);
    return [col * 4 - 10, 0, row * 4 - 6];
  });

  return (
    <div className="h-full w-full overflow-hidden rounded-xl">
      <Canvas
        shadows
        frameloop="demand"
        gl={{ antialias: true, powerPreference: "default", failIfMajorPerformanceCaveat: false }}
        dpr={[1, 2]}
        style={{ background: "#F0EDE8" }}
      >
        <OrthographicCamera makeDefault position={[22, 18, 22]} zoom={24} />
        <Suspense fallback={<LoadingBox />}>
          {/* Soft studio ambient */}
          <ambientLight intensity={1.4} color="#FFF8F2" />
          {/* Key light — warm, gentle */}
          <directionalLight
            position={[12, 20, 12]}
            intensity={0.9}
            castShadow
            color="#FFF4E0"
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-near={0.1}
            shadow-camera-far={80}
            shadow-camera-left={-30}
            shadow-camera-right={30}
            shadow-camera-top={30}
            shadow-camera-bottom={-30}
          />
          {/* Fill light — cool, soft */}
          <directionalLight position={[-10, 12, -10]} intensity={0.4} color="#E0F0FF" />
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
            enablePan={false}
            minDistance={10}
            maxDistance={50}
            maxPolarAngle={Math.PI / 2.5}
            minPolarAngle={Math.PI / 6}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
