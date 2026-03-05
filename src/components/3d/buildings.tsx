"use client";

export function Buildings() {
  return (
    <group position={[14, 0, -10]}>
      {/* Barn body */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[5, 3, 6]} />
        <meshLambertMaterial color="#8B2500" />
      </mesh>
      {/* Barn roof */}
      <mesh position={[0, 3.5, 0]} rotation={[0, 0, 0]} castShadow>
        <coneGeometry args={[3.8, 2, 4]} />
        <meshLambertMaterial color="#5C1A00" />
      </mesh>
      {/* Barn door */}
      <mesh position={[0, 0.9, 3.01]}>
        <boxGeometry args={[1.5, 1.8, 0.05]} />
        <meshLambertMaterial color="#4A2800" />
      </mesh>
      {/* Silo */}
      <group position={[4, 0, -1]}>
        <mesh position={[0, 2, 0]} castShadow>
          <cylinderGeometry args={[1, 1, 4, 12]} />
          <meshLambertMaterial color="#C0C0C0" />
        </mesh>
        <mesh position={[0, 4.3, 0]}>
          <coneGeometry args={[1.1, 0.8, 12]} />
          <meshLambertMaterial color="#A0A0A0" />
        </mesh>
      </group>
      {/* Water tank */}
      <group position={[-4, 0, 1]}>
        <mesh position={[0, 1, 0]}>
          <cylinderGeometry args={[0.7, 0.7, 2, 8]} />
          <meshLambertMaterial color="#4682B4" />
        </mesh>
      </group>
    </group>
  );
}
