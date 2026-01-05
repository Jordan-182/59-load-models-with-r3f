import { OrbitControls, useTexture } from "@react-three/drei";
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
    textureRectoRepeat: { value: [1.81, 1.25] },
    textureRectoOffset: { value: [0.06, -0.19] },
    textureVersoRepeat: { value: [1.9, 1.5] },
    textureVersoOffset: { value: [-0.89, -0.13] },
  });

  const { metalness, roughness } = useControls("material", {
    metalness: { value: 0.3, min: 0, max: 1, step: 0.01 },
    roughness: { value: 0.3, min: 0, max: 1, step: 0.01 },
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

  useEffect(() => {
    model.scene.traverse((child) => {
      if (child.isMesh) {
        console.log("Material name:", child.material.name);

        if (child.material.name === "Booster_front") {
          child.material.map = textureRecto;
          child.material.metalness = metalness;
          child.material.roughness = roughness;
        }
        if (child.material.name === "Booster_back") {
          child.material.map = textureVerso;
          child.material.metalness = metalness;
          child.material.roughness = roughness;
        }

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
      <ambientLight intensity={5.5} />

      <primitive object={model.scene}>
        <meshPhongMaterial color={"white"} />
      </primitive>
    </>
  );
}
