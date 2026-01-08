import {
  Float,
  MeshReflectorMaterial,
  OrbitControls,
  useTexture,
} from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { useControls } from "leva";
import { Perf } from "r3f-perf";
import { useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default function Experience() {
  const model = useLoader(GLTFLoader, "./booster.glb");
  const textureRecto = useTexture("./boosterS1Recto.webp");
  const textureVerso = useTexture("./boosterS1Verso.webp");

  const {
    textureRectoRepeat,
    textureRectoOffset,
    textureVersoRepeat,
    textureVersoOffset,
  } = useControls("texture", {
    textureRectoRepeat: { value: [0.77, 0.85] },
    textureRectoOffset: { value: [0.14, 0.08] },
    textureVersoRepeat: { value: [0.82, 0.9] },
    textureVersoOffset: { value: [0.11, 0.04] },
  });

  const { metalness, roughness } = useControls("material", {
    metalness: { value: 0.91, min: 0, max: 1, step: 0.01 },
    roughness: { value: 0.56, min: 0, max: 1, step: 0.01 },
  });

  // 🔧 fixes textures
  textureRecto.flipY = false;
  textureVerso.flipY = false;

  textureRecto.colorSpace = THREE.SRGBColorSpace;
  textureVerso.colorSpace = THREE.SRGBColorSpace;

  textureRecto.wrapS = textureRecto.wrapT = THREE.ClampToEdgeWrapping;
  textureVerso.wrapS = textureVerso.wrapT = THREE.ClampToEdgeWrapping;

  // Ajuster la taille et le centrage des textures
  textureRecto.repeat.set(...textureRectoRepeat);
  textureRecto.offset.set(...textureRectoOffset);

  textureVerso.repeat.set(...textureVersoRepeat);
  textureVerso.offset.set(...textureVersoOffset);
  console.log(model);

  useEffect(() => {
    model.scene.traverse((child) => {
      if (child.isMesh) {
        if (child.material.name === "booster_front") {
          child.material.map = textureRecto;
          child.material.color.set("#ffffff");
        }

        if (child.material.name === "booster_back") {
          child.material.map = textureVerso;
          child.material.color.set("#ffffff");
        }

        child.material.metalness = metalness;
        child.material.roughness = roughness;
        child.material.side = THREE.FrontSide;
        child.material.needsUpdate = true;
      }
    });
  }, [model, textureRecto, textureVerso, metalness, roughness]);

  return (
    <>
      <Perf position="top-left" />
      <OrbitControls makeDefault />

      <directionalLight position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={55} />

      <Float
        speed={2} // vitesse d'animation (défaut: 1)
        rotationIntensity={0.5} // rotation sur les 3 axes (défaut: 1)
        floatIntensity={0.5} // intensité du mouvement vertical (défaut: 1)
        floatingRange={[-0.1, 0.1]} // amplitude min/max (défaut: [-0.1, 0.1])
      >
        <primitive object={model.scene} />
      </Float>
      <mesh
        receiveShadow
        position-y={-0.9}
        rotation-x={-Math.PI * 0.5}
        scale={10}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <planeGeometry />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={1024}
          mixBlur={0.5}
          mixStrength={1}
          roughness={0.4}
          depthScale={1}
          minDepthThreshold={0.85}
          maxDepthThreshold={1}
          color="#0b356c"
          metalness={0.5}
          mirror={0.5}
          transparent={true}
          opacity={0.07}
        />
      </mesh>
    </>
  );
}
