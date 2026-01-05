import { OrbitControls, useTexture } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import { useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default function Experience() {
  const model = useLoader(GLTFLoader, "./booster.glb");
  const textureRecto = useTexture("./boosterS1Recto.webp");
  const textureVerso = useTexture("./boosterS1Verso.webp");

  // 🔧 fixes textures
  textureRecto.flipY = false;
  textureVerso.flipY = false;

  textureRecto.colorSpace = THREE.SRGBColorSpace;
  textureVerso.colorSpace = THREE.SRGBColorSpace;

  textureRecto.wrapS = textureRecto.wrapT = THREE.ClampToEdgeWrapping;
  textureVerso.wrapS = textureVerso.wrapT = THREE.ClampToEdgeWrapping;

  // Ajuster la taille et le centrage des textures
  textureRecto.repeat.set(1.5, 1.5);
  textureRecto.offset.set(0.25, -0.5);

  textureVerso.repeat.set(0.5, 0.5);
  textureVerso.offset.set(0.25, 0.25);

  useEffect(() => {
    model.scene.traverse((child) => {
      if (child.isMesh) {
        if (child.material.name === "Booster_front") {
          child.material.map = textureRecto;
        }
        if (child.material.name === "Booster_back") {
          child.material.map = textureVerso;
        }

        child.material.metalness = 0;
        child.material.roughness = 1;
        child.material.side = THREE.FrontSide;
        child.material.needsUpdate = true;
      }
    });
  }, [model, textureRecto, textureVerso]);

  return (
    <>
      <Perf position="top-left" />
      <OrbitControls makeDefault />

      <directionalLight position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1.5} />

      <primitive object={model.scene} />
    </>
  );
}
