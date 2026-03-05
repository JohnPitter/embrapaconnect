"use client";

export function Terrain() {
  return (
    <group>
      {/* Main ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshLambertMaterial color="#4a7c59" />
      </mesh>
      {/* Path */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.09, 0]}>
        <planeGeometry args={[1.5, 60]} />
        <meshLambertMaterial color="#8B7355" />
      </mesh>
      {/* Fence posts */}
      {[-18, -12, -6, 0, 6, 12, 18].map((x, i) => (
        <group key={i} position={[x, 0.3, -18]}>
          <mesh castShadow>
            <boxGeometry args={[0.15, 0.8, 0.15]} />
            <meshLambertMaterial color="#8B6914" />
          </mesh>
        </group>
      ))}
      {/* Fence rails */}
      <mesh position={[0, 0.5, -18]}>
        <boxGeometry args={[38, 0.08, 0.08]} />
        <meshLambertMaterial color="#A0522D" />
      </mesh>
      <mesh position={[0, 0.2, -18]}>
        <boxGeometry args={[38, 0.08, 0.08]} />
        <meshLambertMaterial color="#A0522D" />
      </mesh>
    </group>
  );
}
