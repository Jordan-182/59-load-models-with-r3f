import { OrbitControls, useTexture } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import { useEffect } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default function Experience() {
  const model = useLoader(GLTFLoader, "./booster.glb");
  const textureRecto = useTexture("./boosterS1Recto.webp");
  const textureVerso = useTexture("./boosterS1Verso.webp");

  useEffect(() => {
    // Appliquer les textures aux matériaux du modèle
    model.scene.traverse((child) => {
      if (child.isMesh) {
        // Vous pouvez ajuster selon le nom des meshes
        if (child.name.includes("recto") || child.name.includes("front")) {
          child.material.map = textureRecto;
          child.material.needsUpdate = true;
        } else if (
          child.name.includes("verso") ||
          child.name.includes("back")
        ) {
          child.material.map = textureVerso;
          child.material.needsUpdate = true;
        }
        // Ou appliquer la même texture à tous les meshes
        // child.material.map = textureRecto;
        // child.material.needsUpdate = true;
      }
    });
  }, [model, textureRecto, textureVerso]);

  console.log(model);

  return (
    <>
      <Perf position="top-left" />

      <OrbitControls makeDefault />

      <directionalLight castShadow position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1.5} />

      <mesh
        receiveShadow
        position-y={-1}
        rotation-x={-Math.PI * 0.5}
        scale={10}
      >
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh>

      <primitive object={model.scene} scale={0.3} />
    </>
  );
}
