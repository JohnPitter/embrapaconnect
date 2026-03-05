"use client";

export function Buildings() {
  return (
    <group position={[12, 0, -10]}>
      {/* Barn body */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[5, 3, 6]} />
        <meshLambertMaterial color="#E89080" />
      </mesh>
      {/* Barn roof — low-poly 4-sided pyramid */}
      <mesh position={[0, 3.5, 0]} castShadow>
        <coneGeometry args={[3.6, 2, 4]} />
        <meshLambertMaterial color="#D47870" />
      </mesh>
      {/* Barn door */}
      <mesh position={[0, 0.9, 3.01]}>
        <boxGeometry args={[1.5, 1.8, 0.05]} />
        <meshLambertMaterial color="#C07060" />
      </mesh>
      {/* Barn window */}
      <mesh position={[1.4, 2.2, 3.01]}>
        <boxGeometry args={[0.6, 0.6, 0.05]} />
        <meshLambertMaterial color="#B0CCE0" />
      </mesh>
      {/* Silo */}
      <group position={[4, 0, -1]}>
        <mesh position={[0, 2, 0]} castShadow>
          <cylinderGeometry args={[1, 1, 4, 8]} />
          <meshLambertMaterial color="#E0E4D8" />
        </mesh>
        <mesh position={[0, 4.3, 0]}>
          <coneGeometry args={[1.1, 0.8, 8]} />
          <meshLambertMaterial color="#CCD0C4" />
        </mesh>
      </group>
      {/* Water tank */}
      <group position={[-4, 0, 1]}>
        <mesh position={[0, 1, 0]}>
          <cylinderGeometry args={[0.7, 0.7, 2, 6]} />
          <meshLambertMaterial color="#A0C0E0" />
        </mesh>
        {/* Tank cap */}
        <mesh position={[0, 2.1, 0]}>
          <coneGeometry args={[0.75, 0.4, 6]} />
          <meshLambertMaterial color="#88ACD0" />
        </mesh>
      </group>
    </group>
  );
}
