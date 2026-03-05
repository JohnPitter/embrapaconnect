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
    <div style={{ height, background: "linear-gradient(160deg, #EEF4E8 0%, #F4F0E8 100%)" }} className="w-full rounded-xl overflow-hidden">
      <Canvas
        frameloop="demand"
        camera={{ position: [4.5, 5, 4.5], fov: 32 }}
        gl={{ antialias: true, powerPreference: "default", failIfMajorPerformanceCaveat: false }}
        dpr={[1, 2]}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          {/* Soft studio ambient */}
          <ambientLight intensity={1.5} color="#FFF8F2" />
          {/* Key light — warm top-front */}
          <directionalLight position={[5, 10, 5]} intensity={0.8} color="#FFF4E8" castShadow />
          {/* Fill light — cool side */}
          <directionalLight position={[-4, 6, -4]} intensity={0.35} color="#E0EEFF" />
          {/* Rim light — subtle back */}
          <directionalLight position={[0, 4, -6]} intensity={0.2} color="#F0FFE8" />
          <AvatarModel config={config} />
          <OrbitControls
            enablePan={false}
            minDistance={3}
            maxDistance={8}
            target={[0, 0.5, 0]}
            maxPolarAngle={Math.PI / 1.8}
            minPolarAngle={Math.PI / 5}
          />
          {/* Floating island platform */}
          <mesh position={[0, -1.26, 0]} receiveShadow castShadow>
            <cylinderGeometry args={[2.2, 1.8, 0.5, 6]} />
            <meshLambertMaterial color="#8DA880" />
          </mesh>
          {/* Platform top grass */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.01, 0]} receiveShadow>
            <circleGeometry args={[2.2, 6]} />
            <meshLambertMaterial color="#B5D4A0" />
          </mesh>
          {/* Small decorative flowers on platform */}
          {[0, 1, 2, 3, 4].map((i) => (
            <mesh
              key={i}
              position={[
                Math.cos((i / 5) * Math.PI * 2) * 1.7,
                -1.0,
                Math.sin((i / 5) * Math.PI * 2) * 1.7,
              ]}
            >
              <sphereGeometry args={[0.08, 4, 4]} />
              <meshLambertMaterial color={i % 2 === 0 ? "#F4D86C" : "#F4A0A0"} />
            </mesh>
          ))}
        </Suspense>
      </Canvas>
    </div>
  );
}
