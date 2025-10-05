"use client";

import { createRef, useEffect, useState } from "react";
import { TransformControls } from "@react-three/drei";

const Module = ({ mesh, orbitRef }: any) => {
  const [snap, setSnap] = useState(0.05);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key == "Shift") setSnap(0.5);
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key == "Shift") setSnap(0.05);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const meshRef = createRef<any>();
  const controlRef = createRef<any>();

  const [isTransformControlling, setIsTransformControlling] = useState(false);
  const [isObjectChaning, setIsObjectChanging] = useState(false);

  return (
    <TransformControls
      ref={controlRef}
      object={meshRef.current}
      mode="translate"
      onMouseDown={() => {
        orbitRef.current.enabled = false;
      }}
      onMouseUp={() => {
        orbitRef.current.enabled = true;
      }}
      translationSnap={snap}
      showX={isTransformControlling}
      showY={isTransformControlling}
      showZ={isTransformControlling}
      onObjectChange={() => {
        setIsObjectChanging(true);
      }}
    >
      <mesh
        ref={meshRef.current}
        position={[0, 0, 0]}
        onClick={(event) => {
          console.log(event);

          if (isObjectChaning) {
            setIsTransformControlling(true);
            setIsObjectChanging(false);
          } else {
            setIsTransformControlling(!isTransformControlling);
          }
        }}
      >
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial
          color={mesh.type === "sleep" ? "cyan" : "orange"}
        />
      </mesh>
    </TransformControls>
  );
};

export default Module;
