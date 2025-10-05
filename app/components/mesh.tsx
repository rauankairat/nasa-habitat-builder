"use client";

import { createRef, useEffect, useState } from "react";
import { TransformControls } from "@react-three/drei";

const Module = ({
  module,
  orbitRef,
  isSelected,
  selectThis,
  unSelectThis,
}: any) => {
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

  return (
    <TransformControls
      position={[0, 2.4, 0]}
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
      showX={isSelected}
      showY={isSelected}
      showZ={isSelected}
    >
      <mesh ref={meshRef.current} onClick={selectThis}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial
          color={module.type === "sleep" ? "cyan" : "orange"}
        />
      </mesh>
    </TransformControls>
  );
};

export default Module;
