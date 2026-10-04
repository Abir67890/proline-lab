"use client";

import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Environment, ContactShadows } from "@react-three/drei";

/**
 * showcase3d.jsx â€” vitrine produit Three.js / React Three Fiber
 * ProductShowcase3D : flacon en rotation 360Â°, bascule vue assemblÃ©e / Ã©clatÃ©e,
 * icÃ´nes/labels en orbite. Placeholder gÃ©omÃ©trique (pas de modÃ¨le GLTF fourni) â€”
 * Ã  remplacer par un vrai .glb via useGLTF si un modÃ¨le produit est ajoutÃ© plus tard.
 */

function Bottle({ exploded }) {
  const group = useRef(null);
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.35;
  });

  const capOffset = exploded ? 1.1 : 0.62;

  return (
    <group ref={group}>
      {/* Corps du flacon */}
      <mesh position={[0, -0.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.42, 0.5, 1.15, 32]} />
        <meshStandardMaterial color="#4F8ED1" roughness={0.25} metalness={0.15} />
      </mesh>
      {/* Col */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.2, 0.28, 24]} />
        <meshStandardMaterial color="#315F91" roughness={0.3} metalness={0.1} />
      </mesh>
      {/* Bouchon (s'Ã©carte en vue Ã©clatÃ©e) */}
      <mesh position={[0, capOffset, 0]} castShadow>
        <cylinderGeometry args={[0.19, 0.19, 0.22, 24]} />
        <meshStandardMaterial color="#0B2745" roughness={0.4} metalness={0.2} />
      </mesh>
      {/* Ã‰tiquette */}
      <mesh position={[0, -0.1, 0.505]}>
        <planeGeometry args={[0.62, 0.5]} />
        <meshStandardMaterial color="#F3F8FC" roughness={0.9} />
      </mesh>

      {[
        { label: "Vitres", angle: 0, radius: 1.5, y: 0.5 },
        { label: "Graisse", angle: (Math.PI * 2) / 4, radius: 1.5, y: -0.2 },
        { label: "Calcaire", angle: (Math.PI * 4) / 4, radius: 1.5, y: 0.5 },
        { label: "Sols", angle: (Math.PI * 6) / 4, radius: 1.5, y: -0.2 },
      ].map((o, i) => (
        <Html
          key={i}
          position={[Math.cos(o.angle) * o.radius, o.y, Math.sin(o.angle) * o.radius]}
          center
          distanceFactor={6}
          occlude={false}
        >
          <div
            style={{
              padding: "5px 11px",
              borderRadius: 999,
              background: "rgba(11,39,69,.72)",
              color: "#fff",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: ".03em",
              whiteSpace: "nowrap",
              backdropFilter: "blur(4px)",
              pointerEvents: "none",
            }}
          >
            {o.label}
          </div>
        </Html>
      ))}
    </group>
  );
}

export function ProductShowcase3D({ height = 420, className = "" }) {
  const [exploded, setExploded] = useState(false);

  return (
    <div
      className={`proline-showcase3d ${className}`}
      style={{ position: "relative", width: "100%", height, borderRadius: 24, overflow: "hidden" }}
    >
      <Canvas shadows camera={{ position: [2.4, 1.4, 2.4], fov: 40 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.55} />
          <directionalLight position={[3, 4, 2]} intensity={1.1} castShadow />
          <Bottle exploded={exploded} />
          <ContactShadows position={[0, -0.72, 0]} opacity={0.35} scale={5} blur={2.4} far={2} />
</Suspense>

          {/* PROLINE_LOCAL_LIGHTING */}
          <ambientLight intensity={1.35} />

          <directionalLight
            position={[6, 8, 5]}
            intensity={2.2}
          />

          <directionalLight
            position={[-5, 3, 2]}
            intensity={1.1}
            color="#5EEAD4"
          />

          <pointLight
            position={[4, -2, 4]}
            intensity={1.2}
            color="#14B8B0"
          />
        <OrbitControls
          enablePan={false}
          minDistance={2}
          maxDistance={5}
          autoRotate={false}
          enableDamping
          dampingFactor={0.08}
        />
      </Canvas>

      <button
        type="button"
        onClick={() => setExploded((e) => !e)}
        style={{
          position: "absolute",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
          padding: "9px 18px",
          borderRadius: 999,
          border: "1px solid rgba(255,255,255,.35)",
          background: "rgba(11,39,69,.55)",
          color: "#fff",
          fontSize: 12.5,
          fontWeight: 600,
          letterSpacing: ".02em",
          cursor: "pointer",
          backdropFilter: "blur(6px)",
        }}
      >
        {exploded ? "Vue assemblÃ©e" : "Vue Ã©clatÃ©e"}
      </button>
    </div>
  );
}

