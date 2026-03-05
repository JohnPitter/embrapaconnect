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
      groupRef.current.position.y = -1.2 + Math.sin(t * 1.2) * 0.04;
    }
  });

  const body = BODY_SIZES[config.bodyType];
  const eyeRadius =
    config.eyeShape === "large" ? 0.07 : config.eyeShape === "small" ? 0.04 : 0.055;

  // Pastel shirt: derive a soft hue from skin tone to pair nicely
  const shirtColor = "#7FBBA8";   // soft teal-green
  const pantsColor = "#9CB880";   // muted olive
  const bootsColor = "#B09878";   // warm tan
  const beltColor  = "#C8A87C";   // soft caramel

  return (
    <group ref={groupRef} position={[0, -1.2, 0]}>
      {/* Legs — low-poly (6-sided) */}
      <mesh position={[-0.22, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.13, 1, 6]} />
        <meshLambertMaterial color={pantsColor} />
      </mesh>
      <mesh position={[0.22, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.13, 1, 6]} />
        <meshLambertMaterial color={pantsColor} />
      </mesh>
      {/* Boots */}
      <mesh position={[-0.22, 0.05, 0.05]} castShadow>
        <boxGeometry args={[0.28, 0.22, 0.38]} />
        <meshLambertMaterial color={bootsColor} />
      </mesh>
      <mesh position={[0.22, 0.05, 0.05]} castShadow>
        <boxGeometry args={[0.28, 0.22, 0.38]} />
        <meshLambertMaterial color={bootsColor} />
      </mesh>
      {/* Body */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <boxGeometry args={[body.width, 1.1, body.depth]} />
        <meshLambertMaterial color={shirtColor} />
      </mesh>
      {/* Belt */}
      <mesh position={[0, 1.0, 0]}>
        <boxGeometry args={[body.width + 0.02, 0.1, body.depth + 0.02]} />
        <meshLambertMaterial color={beltColor} />
      </mesh>
      {/* Belt buckle */}
      <mesh position={[0, 1.0, body.depth / 2 + 0.02]}>
        <boxGeometry args={[0.15, 0.1, 0.04]} />
        <meshLambertMaterial color="#E8D080" />
      </mesh>
      {/* Arms — low-poly (5-sided) */}
      <mesh position={[-(body.width / 2 + 0.15), 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.1, 0.9, 5]} />
        <meshLambertMaterial color={shirtColor} />
      </mesh>
      <mesh position={[body.width / 2 + 0.15, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.1, 0.9, 5]} />
        <meshLambertMaterial color={shirtColor} />
      </mesh>
      {/* Hands — low-poly (6-sided sphere) */}
      <mesh position={[-(body.width / 2 + 0.15), 1.05, 0]}>
        <sphereGeometry args={[0.13, 6, 6]} />
        <meshLambertMaterial color={config.skinTone} />
      </mesh>
      <mesh position={[body.width / 2 + 0.15, 1.05, 0]}>
        <sphereGeometry args={[0.13, 6, 6]} />
        <meshLambertMaterial color={config.skinTone} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 2.1, 0]}>
        <cylinderGeometry args={[0.15, 0.18, 0.25, 6]} />
        <meshLambertMaterial color={config.skinTone} />
      </mesh>
      {/* Head — low-poly (8-sided sphere) */}
      <mesh position={[0, 2.6, 0]} castShadow>
        <sphereGeometry args={[0.42, 8, 8]} />
        <meshLambertMaterial color={config.skinTone} />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.15, 2.65, 0.38]}>
        <sphereGeometry args={[eyeRadius, 6, 6]} />
        <meshLambertMaterial color={config.eyeColor} />
      </mesh>
      <mesh position={[0.15, 2.65, 0.38]}>
        <sphereGeometry args={[eyeRadius, 6, 6]} />
        <meshLambertMaterial color={config.eyeColor} />
      </mesh>
      {/* Eyebrows */}
      <mesh position={[-0.15, 2.76, 0.36]} rotation={[0.3, 0.1, 0.1]}>
        <boxGeometry args={[0.14, 0.03, 0.04]} />
        <meshLambertMaterial color="#8C6A5A" />
      </mesh>
      <mesh position={[0.15, 2.76, 0.36]} rotation={[0.3, -0.1, -0.1]}>
        <boxGeometry args={[0.14, 0.03, 0.04]} />
        <meshLambertMaterial color="#8C6A5A" />
      </mesh>
      {/* Mouth */}
      <mesh position={[0, 2.42, 0.39]}>
        <boxGeometry args={[0.18, 0.04, 0.02]} />
        <meshLambertMaterial color="#C07870" />
      </mesh>
      {/* Nose */}
      <mesh position={[0, 2.55, 0.41]}>
        <sphereGeometry args={[0.06, 4, 4]} />
        <meshLambertMaterial color={config.skinTone} />
      </mesh>

      {/* Glasses */}
      {config.glasses !== "none" && (
        <group position={[0, 2.65, 0.41]}>
          <mesh position={[-0.15, 0, 0]}>
            <torusGeometry args={[0.1, 0.02, 4, 8]} />
            <meshLambertMaterial color="#6A7A8A" />
          </mesh>
          <mesh position={[0.15, 0, 0]}>
            <torusGeometry args={[0.1, 0.02, 4, 8]} />
            <meshLambertMaterial color="#6A7A8A" />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.1, 0.025, 0.025]} />
            <meshLambertMaterial color="#6A7A8A" />
          </mesh>
        </group>
      )}

      {/* Hat: Straw */}
      {config.hat === "straw" && (
        <group position={[0, 3.06, 0]}>
          <mesh>
            <cylinderGeometry args={[0.28, 0.32, 0.35, 8]} />
            <meshLambertMaterial color="#E8D070" />
          </mesh>
          <mesh position={[0, -0.18, 0]}>
            <cylinderGeometry args={[0.6, 0.62, 0.08, 8]} />
            <meshLambertMaterial color="#D4BC5C" />
          </mesh>
        </group>
      )}

      {/* Hat: Cap */}
      {config.hat === "cap" && (
        <group position={[0, 3.0, 0]}>
          <mesh>
            <sphereGeometry args={[0.38, 8, 5, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshLambertMaterial color="#7090B8" />
          </mesh>
          <mesh position={[0, -0.08, 0.28]} rotation={[-0.2, 0, 0]}>
            <boxGeometry args={[0.55, 0.06, 0.3]} />
            <meshLambertMaterial color="#607898" />
          </mesh>
        </group>
      )}

      {/* Hat: Cowboy */}
      {config.hat === "cowboy" && (
        <group position={[0, 3.06, 0]}>
          <mesh>
            <cylinderGeometry args={[0.22, 0.28, 0.45, 8]} />
            <meshLambertMaterial color="#C4906A" />
          </mesh>
          <mesh position={[0, -0.22, 0]}>
            <cylinderGeometry args={[0.65, 0.55, 0.1, 8]} />
            <meshLambertMaterial color="#B07A58" />
          </mesh>
        </group>
      )}

      {/* Hat: Cangaceiro */}
      {config.hat === "cangaceiro" && (
        <group position={[0, 3.06, 0]}>
          <mesh>
            <cylinderGeometry args={[0.28, 0.3, 0.3, 6]} />
            <meshLambertMaterial color="#C4A060" />
          </mesh>
          <mesh position={[0, -0.15, 0]}>
            <cylinderGeometry args={[0.58, 0.55, 0.08, 6]} />
            <meshLambertMaterial color="#B08C50" />
          </mesh>
          {/* Decorative dots */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <mesh
              key={i}
              position={[
                Math.cos((i / 8) * Math.PI * 2) * 0.4,
                -0.12,
                Math.sin((i / 8) * Math.PI * 2) * 0.4,
              ]}
            >
              <sphereGeometry args={[0.03, 3, 3]} />
              <meshLambertMaterial color="#F4D86C" />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}
