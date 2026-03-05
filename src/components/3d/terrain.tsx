"use client";

function FenceSection({
  from,
  to,
  y = 0,
}: {
  from: [number, number];
  to: [number, number];
  y?: number;
}) {
  const dx = to[0] - from[0];
  const dz = to[1] - from[1];
  const length = Math.sqrt(dx * dx + dz * dz);
  const angle = Math.atan2(dz, dx);
  const cx = (from[0] + to[0]) / 2;
  const cz = (from[1] + to[1]) / 2;
  const postCount = Math.max(2, Math.round(length / 3));
  const posts: [number, number][] = Array.from({ length: postCount }, (_, i) => {
    const t = postCount === 1 ? 0.5 : i / (postCount - 1);
    return [from[0] + dx * t, from[1] + dz * t];
  });

  return (
    <group>
      {/* Top rail */}
      <mesh position={[cx, y + 0.6, cz]} rotation={[0, -angle, 0]}>
        <boxGeometry args={[length, 0.07, 0.07]} />
        <meshLambertMaterial color="#D4B888" />
      </mesh>
      {/* Bottom rail */}
      <mesh position={[cx, y + 0.25, cz]} rotation={[0, -angle, 0]}>
        <boxGeometry args={[length, 0.07, 0.07]} />
        <meshLambertMaterial color="#D4B888" />
      </mesh>
      {/* Posts */}
      {posts.map(([px, pz], i) => (
        <mesh key={i} position={[px, y + 0.4, pz]} castShadow>
          <boxGeometry args={[0.12, 0.9, 0.12]} />
          <meshLambertMaterial color="#C4A870" />
        </mesh>
      ))}
    </group>
  );
}

export function Terrain() {
  return (
    <group>
      {/* ── Floating island base (visible sides) ─────── */}
      <mesh position={[0, -1.0, 0]} receiveShadow>
        <boxGeometry args={[48, 1.8, 48]} />
        <meshLambertMaterial color="#8DA880" />
      </mesh>

      {/* ── Ground surface ────────────────────────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[48, 48]} />
        <meshLambertMaterial color="#B5D4A0" />
      </mesh>

      {/* ── Grass variation patches ──────────────────── */}
      {(
        [
          [-10, 12, 14, 6],
          [-6, -14, 10, 5],
          [8, 8, 10, 8],
          [-18, -5, 8, 12],
          [18, 5, 10, 10],
          [-2, 16, 14, 6],
        ] as [number, number, number, number][]
      ).map(([x, z, w, d], i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[x, -0.09, z]}>
          <planeGeometry args={[w, d]} />
          <meshLambertMaterial color={i % 2 === 0 ? "#C4DC9C" : "#A8C898"} />
        </mesh>
      ))}

      {/* ── Ploughed soil area ────────────────────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-7, -0.08, 1]}>
        <planeGeometry args={[14, 18]} />
        <meshLambertMaterial color="#C8A87C" />
      </mesh>

      {/* ── Central path (N-S) ────────────────────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.07, 0]}>
        <planeGeometry args={[1.8, 46]} />
        <meshLambertMaterial color="#D4C498" />
      </mesh>

      {/* ── Horizontal dirt track ──────────────────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[7, -0.07, -10]}>
        <planeGeometry args={[12, 1.6]} />
        <meshLambertMaterial color="#D4C498" />
      </mesh>

      {/* ── Irrigation channel ───────────────────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-14, -0.085, 2]}>
        <planeGeometry args={[1.0, 20]} />
        <meshLambertMaterial color="#C4BAA0" />
      </mesh>

      {/* ── Fence around crop field ──────────────────── */}
      <FenceSection from={[-14, -9]} to={[-2, -9]} />
      <FenceSection from={[-14, 11]} to={[-2, 11]} />
      <FenceSection from={[-14, -9]} to={[-14, 11]} />
      <FenceSection from={[-2, -9]} to={[-2, 11]} />

      {/* ── Perimeter fence (back) ───────────────────── */}
      <FenceSection from={[-20, -18]} to={[20, -18]} />

      {/* ── Gate posts at path entrance ──────────────── */}
      <mesh position={[-1, 0.6, -16]} castShadow>
        <boxGeometry args={[0.18, 1.4, 0.18]} />
        <meshLambertMaterial color="#C4A870" />
      </mesh>
      <mesh position={[1, 0.6, -16]} castShadow>
        <boxGeometry args={[0.18, 1.4, 0.18]} />
        <meshLambertMaterial color="#C4A870" />
      </mesh>
    </group>
  );
}
