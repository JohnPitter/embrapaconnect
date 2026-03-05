"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type * as THREE from "three";
import type { AvatarConfig } from "@/types/avatar";

interface AvatarModelProps {
  config: AvatarConfig;
}

const BODY_SIZES = {
  slim: { width: 0.65, depth: 0.4 },
  medium: { width: 0.85, depth: 0.5 },
  robust: { width: 1.05, depth: 0.6 },
};

export function AvatarModel({ config }: AvatarModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.getElapsedTime();
      groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.3;
      groupRef.current.position.y = Math.sin(t * 1.2) * 0.04;
    }
  });

  const body = BODY_SIZES[config.bodyType];
  const eyeRadius =
    config.eyeShape === "large" ? 0.07 : config.eyeShape === "small" ? 0.04 : 0.055;

  return (
    <group ref={groupRef} position={[0, -1.2, 0]}>
      {/* Legs */}
      <mesh position={[-0.22, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.13, 1, 8]} />
        <meshLambertMaterial color="#3E5C2E" />
      </mesh>
      <mesh position={[0.22, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.13, 1, 8]} />
        <meshLambertMaterial color="#3E5C2E" />
      </mesh>
      {/* Boots */}
      <mesh position={[-0.22, 0.05, 0.05]} castShadow>
        <boxGeometry args={[0.28, 0.22, 0.38]} />
        <meshLambertMaterial color="#3E2723" />
      </mesh>
      <mesh position={[0.22, 0.05, 0.05]} castShadow>
        <boxGeometry args={[0.28, 0.22, 0.38]} />
        <meshLambertMaterial color="#3E2723" />
      </mesh>
      {/* Body */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <boxGeometry args={[body.width, 1.1, body.depth]} />
        <meshLambertMaterial color="#5C8A3C" />
      </mesh>
      {/* Belt */}
      <mesh position={[0, 1.0, 0]}>
        <boxGeometry args={[body.width + 0.02, 0.1, body.depth + 0.02]} />
        <meshLambertMaterial color="#2C1810" />
      </mesh>
      {/* Belt buckle */}
      <mesh position={[0, 1.0, body.depth / 2 + 0.02]}>
        <boxGeometry args={[0.15, 0.1, 0.04]} />
        <meshLambertMaterial color="#D4AC0D" />
      </mesh>
      {/* Arms */}
      <mesh position={[-(body.width / 2 + 0.15), 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.1, 0.9, 7]} />
        <meshLambertMaterial color="#5C8A3C" />
      </mesh>
      <mesh position={[body.width / 2 + 0.15, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.1, 0.9, 7]} />
        <meshLambertMaterial color="#5C8A3C" />
      </mesh>
      {/* Hands */}
      <mesh position={[-(body.width / 2 + 0.15), 1.05, 0]}>
        <sphereGeometry args={[0.13, 8, 8]} />
        <meshLambertMaterial color={config.skinTone} />
      </mesh>
      <mesh position={[body.width / 2 + 0.15, 1.05, 0]}>
        <sphereGeometry args={[0.13, 8, 8]} />
        <meshLambertMaterial color={config.skinTone} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 2.1, 0]}>
        <cylinderGeometry args={[0.15, 0.18, 0.25, 8]} />
        <meshLambertMaterial color={config.skinTone} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 2.6, 0]} castShadow>
        <sphereGeometry args={[0.42, 12, 12]} />
        <meshLambertMaterial color={config.skinTone} />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.15, 2.65, 0.38]}>
        <sphereGeometry args={[eyeRadius, 8, 8]} />
        <meshLambertMaterial color={config.eyeColor} />
      </mesh>
      <mesh position={[0.15, 2.65, 0.38]}>
        <sphereGeometry args={[eyeRadius, 8, 8]} />
        <meshLambertMaterial color={config.eyeColor} />
      </mesh>
      {/* Eyebrows */}
      <mesh position={[-0.15, 2.76, 0.36]} rotation={[0.3, 0.1, 0.1]}>
        <boxGeometry args={[0.14, 0.03, 0.04]} />
        <meshLambertMaterial color="#3E2723" />
      </mesh>
      <mesh position={[0.15, 2.76, 0.36]} rotation={[0.3, -0.1, -0.1]}>
        <boxGeometry args={[0.14, 0.03, 0.04]} />
        <meshLambertMaterial color="#3E2723" />
      </mesh>
      {/* Mouth */}
      <mesh position={[0, 2.42, 0.39]}>
        <boxGeometry args={[0.18, 0.04, 0.02]} />
        <meshLambertMaterial color="#5C2A20" />
      </mesh>
      {/* Nose */}
      <mesh position={[0, 2.55, 0.41]}>
        <sphereGeometry args={[0.06, 6, 6]} />
        <meshLambertMaterial color={config.skinTone} />
      </mesh>

      {/* Glasses */}
      {config.glasses !== "none" && (
        <group position={[0, 2.65, 0.41]}>
          {/* Left lens */}
          <mesh position={[-0.15, 0, 0]}>
            <torusGeometry args={[0.1, 0.02, 6, 12]} />
            <meshLambertMaterial color="#1A1F0F" />
          </mesh>
          {/* Right lens */}
          <mesh position={[0.15, 0, 0]}>
            <torusGeometry args={[0.1, 0.02, 6, 12]} />
            <meshLambertMaterial color="#1A1F0F" />
          </mesh>
          {/* Bridge */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.1, 0.025, 0.025]} />
            <meshLambertMaterial color="#1A1F0F" />
          </mesh>
        </group>
      )}

      {/* Hat: Straw */}
      {config.hat === "straw" && (
        <group position={[0, 3.06, 0]}>
          <mesh>
            <cylinderGeometry args={[0.28, 0.32, 0.35, 12]} />
            <meshLambertMaterial color="#D4AC0D" />
          </mesh>
          <mesh position={[0, -0.18, 0]}>
            <cylinderGeometry args={[0.6, 0.62, 0.08, 16]} />
            <meshLambertMaterial color="#C8A000" />
          </mesh>
        </group>
      )}

      {/* Hat: Cap */}
      {config.hat === "cap" && (
        <group position={[0, 3.0, 0]}>
          <mesh>
            <sphereGeometry args={[0.38, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshLambertMaterial color="#1A1F0F" />
          </mesh>
          {/* Brim */}
          <mesh position={[0, -0.08, 0.28]} rotation={[-0.2, 0, 0]}>
            <boxGeometry args={[0.55, 0.06, 0.3]} />
            <meshLambertMaterial color="#111111" />
          </mesh>
        </group>
      )}

      {/* Hat: Cowboy */}
      {config.hat === "cowboy" && (
        <group position={[0, 3.06, 0]}>
          <mesh>
            <cylinderGeometry args={[0.22, 0.28, 0.45, 10]} />
            <meshLambertMaterial color="#4A2C0A" />
          </mesh>
          <mesh position={[0, -0.22, 0]}>
            <cylinderGeometry args={[0.65, 0.55, 0.1, 16]} />
            <meshLambertMaterial color="#3E2108" />
          </mesh>
        </group>
      )}

      {/* Hat: Cangaceiro */}
      {config.hat === "cangaceiro" && (
        <group position={[0, 3.06, 0]}>
          <mesh>
            <cylinderGeometry args={[0.28, 0.3, 0.3, 8]} />
            <meshLambertMaterial color="#8B6914" />
          </mesh>
          <mesh position={[0, -0.15, 0]}>
            <cylinderGeometry args={[0.58, 0.55, 0.08, 8]} />
            <meshLambertMaterial color="#7A5C12" />
          </mesh>
          {/* Decorative stars */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <mesh
              key={i}
              position={[
                Math.cos((i / 8) * Math.PI * 2) * 0.4,
                -0.12,
                Math.sin((i / 8) * Math.PI * 2) * 0.4,
              ]}
            >
              <sphereGeometry args={[0.03, 4, 4]} />
              <meshLambertMaterial color="#C6E832" />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}
