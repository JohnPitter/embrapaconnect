"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import { AvatarModel } from "./avatar-model";
import type { AvatarConfig } from "@/types/avatar";

interface AvatarSceneProps {
  config: AvatarConfig;
  height?: string;
}

export function AvatarScene({ config, height = "400px" }: AvatarSceneProps) {
  return (
    <div style={{ height }} className="w-full rounded-xl overflow-hidden bg-dark-green">
      <Canvas
        camera={{ position: [0, 1, 5], fov: 40 }}
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
          <directionalLight position={[-5, 5, -5]} intensity={0.4} />
          <AvatarModel config={config} />
          <OrbitControls
            enablePan={false}
            minDistance={3}
            maxDistance={8}
            target={[0, 0.5, 0]}
          />
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.25, 0]} receiveShadow>
            <circleGeometry args={[2, 24]} />
            <meshLambertMaterial color="#2E3B1E" />
          </mesh>
        </Suspense>
      </Canvas>
    </div>
  );
}
