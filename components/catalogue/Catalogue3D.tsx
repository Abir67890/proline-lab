"use client";

import {
  Canvas,
  useFrame,
  useThree,
} from "@react-three/fiber";

import {
  Float,
  MeshTransmissionMaterial,
  OrbitControls,
  Sparkles,
} from "@react-three/drei";

import {
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";

import * as THREE from "three";

type Product3DProps = {
  active?: boolean;
};

function ProductCore({ active = true }: Product3DProps) {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);

  const { pointer } = useThree();

  useFrame((state, delta) => {
    if (!group.current) return;

    const targetX = pointer.y * 0.35;
    const targetY = pointer.x * 0.55;

    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      targetX,
      0.045
    );

    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      targetY + state.clock.elapsedTime * 0.18,
      0.045
    );

    if (mesh.current) {
      const targetScale = active ? 1 : 0.96;

      mesh.current.scale.x = THREE.MathUtils.lerp(
        mesh.current.scale.x,
        targetScale,
        delta * 3
      );

      mesh.current.scale.y = THREE.MathUtils.lerp(
        mesh.current.scale.y,
        targetScale,
        delta * 3
      );

      mesh.current.scale.z = THREE.MathUtils.lerp(
        mesh.current.scale.z,
        targetScale,
        delta * 3
      );
    }
  });

  return (
    <group ref={group}>
      <Float
        speed={1.4}
        rotationIntensity={0.45}
        floatIntensity={0.7}
      >
        <mesh ref={mesh}>
          <icosahedronGeometry args={[1.15, 5]} />

          <MeshTransmissionMaterial
            backside
            samples={8}
            thickness={0.7}
            chromaticAberration={0.08}
            anisotropy={0.2}
            distortion={0.18}
            distortionScale={0.25}
            temporalDistortion={0.12}
            transmission={1}
            roughness={0.08}
            ior={1.45}
            color="#8AA8C4"
          />
        </mesh>

        <mesh scale={0.72}>
          <icosahedronGeometry args={[1.15, 3]} />

          <meshStandardMaterial
            color="#4F8ED1"
            metalness={0.75}
            roughness={0.18}
            transparent
            opacity={0.35}
          />
        </mesh>

        <mesh scale={1.32}>
          <icosahedronGeometry args={[1.15, 2]} />

          <meshBasicMaterial
            color="#8AA8C4"
            wireframe
            transparent
            opacity={0.16}
          />
        </mesh>
      </Float>
    </group>
  );
}

function CameraRig() {
  const { camera, pointer } = useThree();

  useFrame(() => {
    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      pointer.x * 0.35,
      0.025
    );

    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      pointer.y * 0.22,
      0.025
    );

    camera.lookAt(0, 0, 0);
  });

  return null;
}

export default function Catalogue3D() {
  const [active, setActive] = useState(true);

  useEffect(() => {
    const onPointerDown = () => setActive(true);

    window.addEventListener("pointerdown", onPointerDown);

    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  return (
    <div
      className="catalogue-3d-shell"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      <div className="catalogue-3d-glow catalogue-3d-glow-one" />
      <div className="catalogue-3d-glow catalogue-3d-glow-two" />

      <Canvas
        camera={{
          position: [0, 0, 5],
          fov: 42,
        }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={1.2} />

          <directionalLight
            position={[4, 4, 5]}
            intensity={3}
          />

          <pointLight
            position={[-3, 1, 2]}
            intensity={12}
            distance={8}
            color="#4F8ED1"
          />

          <pointLight
            position={[3, -2, 1]}
            intensity={10}
            distance={7}
            color="#8AA8C4"
          />

          <spotLight
            position={[0, 5, 3]}
            intensity={8}
            angle={0.45}
            penumbra={1}
          />

          <ProductCore active={active} />

          <Sparkles
            count={70}
            scale={[5, 3, 5]}
            size={1.4}
            speed={0.25}
            opacity={0.45}
            color="#8AA8C4"
          />
<CameraRig />

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
            enableZoom={false}
            enablePan={false}
            enableRotate={false}
          />
        </Suspense>
      </Canvas>

      <div className="catalogue-3d-overlay">
        <span className="catalogue-3d-status">
          <i />
          PROLINE LAB
        </span>

        <strong>HYGIÈNE</strong>

        <span className="catalogue-3d-caption">
          TECHNOLOGIE · PERFORMANCE · PRÉCISION
        </span>
      </div>
    </div>
  );
}

