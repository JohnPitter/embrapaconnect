"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type * as THREE from "three";

function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, 1.2, 6]} />
        <meshLambertMaterial color="#5C4033" />
      </mesh>
      <mesh position={[0, 2, 0]} castShadow>
        <coneGeometry args={[0.9, 2, 8]} />
        <meshLambertMaterial color="#2E7D32" />
      </mesh>
      <mesh position={[0, 2.8, 0]} castShadow>
        <coneGeometry args={[0.6, 1.5, 8]} />
        <meshLambertMaterial color="#388E3C" />
      </mesh>
    </group>
  );
}

function Cloud({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.x = position[0] + Math.sin(clock.getElapsedTime() * 0.1) * 2;
    }
  });

  return (
    <group ref={ref} position={position}>
      <mesh>
        <sphereGeometry args={[1.2, 8, 8]} />
        <meshLambertMaterial color="white" />
      </mesh>
      <mesh position={[1.2, 0, 0]}>
        <sphereGeometry args={[0.9, 8, 8]} />
        <meshLambertMaterial color="white" />
      </mesh>
      <mesh position={[-1.2, 0, 0]}>
        <sphereGeometry args={[0.9, 8, 8]} />
        <meshLambertMaterial color="white" />
      </mesh>
    </group>
  );
}

export function Decorations() {
  return (
    <group>
      <Tree position={[-16, 0, -14]} />
      <Tree position={[-14, 0, -16]} />
      <Tree position={[18, 0, -8]} />
      <Tree position={[19, 0, -12]} />
      <Tree position={[-18, 0, 6]} />
      <Cloud position={[-8, 12, -15]} />
      <Cloud position={[5, 14, -20]} />
      <Cloud position={[15, 11, -10]} />
    </group>
  );
}
