"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type * as THREE from "three";

function Tree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const trunkH = 1.2 * scale;
  const c1r = 0.9 * scale;
  const c2r = 0.7 * scale;
  const c1y = 1.9 * scale;
  const c2y = 2.8 * scale;
  return (
    <group position={position}>
      {/* Low-poly trunk — 5 sides */}
      <mesh position={[0, trunkH / 2, 0]} castShadow>
        <cylinderGeometry args={[0.15 * scale, 0.22 * scale, trunkH, 5]} />
        <meshLambertMaterial color="#C8AA84" />
      </mesh>
      {/* Low-poly foliage — 6 sides */}
      <mesh position={[0, c1y, 0]} castShadow>
        <coneGeometry args={[c1r, 2 * scale, 6]} />
        <meshLambertMaterial color="#7EC4A0" />
      </mesh>
      <mesh position={[0, c2y, 0]} castShadow>
        <coneGeometry args={[c2r, 1.6 * scale, 6]} />
        <meshLambertMaterial color="#9AD0B0" />
      </mesh>
    </group>
  );
}

function PalmTree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.8, 0]} rotation={[0.1, 0, 0.15]} castShadow>
        <cylinderGeometry args={[0.12, 0.18, 3.6, 5]} />
        <meshLambertMaterial color="#D4B88C" />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i / 5) * Math.PI * 2) * 0.8,
            3.7,
            Math.sin((i / 5) * Math.PI * 2) * 0.8,
          ]}
          rotation={[0.6, (i / 5) * Math.PI * 2, 0]}
          castShadow
        >
          <boxGeometry args={[0.08, 0.06, 1.6]} />
          <meshLambertMaterial color="#90C880" />
        </mesh>
      ))}
    </group>
  );
}

function Bush({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.35, 0]} castShadow>
        <sphereGeometry args={[0.55, 6, 5]} />
        <meshLambertMaterial color="#7CC490" />
      </mesh>
      <mesh position={[0.4, 0.28, 0.1]} castShadow>
        <sphereGeometry args={[0.4, 5, 4]} />
        <meshLambertMaterial color="#90D0A0" />
      </mesh>
      <mesh position={[-0.3, 0.25, 0.2]} castShadow>
        <sphereGeometry args={[0.35, 5, 4]} />
        <meshLambertMaterial color="#A8D8B0" />
      </mesh>
    </group>
  );
}

function Sunflower({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.05, 1.2, 4]} />
        <meshLambertMaterial color="#90C880" />
      </mesh>
      <mesh position={[0, 1.25, 0]}>
        <circleGeometry args={[0.18, 6]} />
        <meshLambertMaterial color="#C4A070" />
      </mesh>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i / 8) * Math.PI * 2) * 0.24,
            1.25,
            Math.sin((i / 8) * Math.PI * 2) * 0.24,
          ]}
          rotation={[Math.PI / 2, 0, (i / 8) * Math.PI * 2]}
        >
          <planeGeometry args={[0.08, 0.22]} />
          <meshLambertMaterial color="#F4D86C" />
        </mesh>
      ))}
    </group>
  );
}

function Cloud({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.x = position[0] + Math.sin(clock.getElapsedTime() * 0.06) * 2.5;
    }
  });
  return (
    <group ref={ref} position={position}>
      {/* Low-poly blocky clouds */}
      <mesh>
        <boxGeometry args={[2.8, 1.0, 1.6]} />
        <meshLambertMaterial color="#F4F0F8" />
      </mesh>
      <mesh position={[1.2, 0.3, 0]}>
        <boxGeometry args={[1.6, 0.8, 1.4]} />
        <meshLambertMaterial color="#F0ECF4" />
      </mesh>
      <mesh position={[-1.2, 0.25, 0]}>
        <boxGeometry args={[1.4, 0.7, 1.2]} />
        <meshLambertMaterial color="#F0ECF4" />
      </mesh>
      <mesh position={[0.3, 0.6, 0]}>
        <boxGeometry args={[1.8, 0.9, 1.2]} />
        <meshLambertMaterial color="#FAFAFA" />
      </mesh>
    </group>
  );
}

export function Decorations() {
  return (
    <group>
      {/* ── Tree rows along perimeter ─────────────────── */}
      <Tree position={[-20, 0, -20]} />
      <Tree position={[-14, 0, -20]} scale={0.9} />
      <Tree position={[-8, 0, -20]} />
      <Tree position={[-2, 0, -20]} scale={1.1} />
      <Tree position={[4, 0, -20]} />
      <Tree position={[10, 0, -20]} scale={0.85} />
      <Tree position={[16, 0, -20]} />
      <Tree position={[20, 0, -20]} scale={1.05} />

      {/* Left column */}
      <Tree position={[-22, 0, -12]} />
      <Tree position={[-22, 0, -4]} scale={0.9} />
      <Tree position={[-22, 0, 4]} />
      <Tree position={[-22, 0, 12]} scale={1.05} />

      {/* Right column */}
      <Tree position={[22, 0, -12]} scale={0.9} />
      <Tree position={[22, 0, -2]} />
      <Tree position={[22, 0, 8]} scale={1.1} />
      <Tree position={[22, 0, 16]} />

      {/* Trees near barn road */}
      <Tree position={[4, 0, -12]} scale={0.8} />
      <Tree position={[4, 0, -8]} scale={0.85} />

      {/* ── Palm trees ─────────────────────────────────── */}
      <PalmTree position={[-1, 0, 14]} />
      <PalmTree position={[3, 0, 16]} />
      <PalmTree position={[18, 0, 10]} />

      {/* ── Bushes along path edges ─────────────────────── */}
      <Bush position={[-2.5, 0, -6]} />
      <Bush position={[-2.5, 0, 2]} />
      <Bush position={[-2.5, 0, 8]} />
      <Bush position={[2.5, 0, -6]} />
      <Bush position={[2.5, 0, 4]} />
      <Bush position={[2.5, 0, 10]} />

      {/* ── Sunflower patches ────────────────────────────── */}
      {([
        [6, 0, 4], [6.7, 0, 5], [5.5, 0, 5.5],
        [7.2, 0, 3.5], [6, 0, 2.5],
      ] as [number, number, number][]).map((pos, i) => (
        <Sunflower key={i} position={pos} />
      ))}
      {([
        [-0.8, 0, 14], [0.5, 0, 15.2], [-0.3, 0, 16],
      ] as [number, number, number][]).map((pos, i) => (
        <Sunflower key={`sf2-${i}`} position={pos} />
      ))}

      {/* ── Floating low-poly clouds ─────────────────────── */}
      <Cloud position={[-8, 14, -16]} />
      <Cloud position={[4, 16, -20]} />
      <Cloud position={[14, 13, -10]} />
      <Cloud position={[-18, 15, -4]} />
    </group>
  );
}
