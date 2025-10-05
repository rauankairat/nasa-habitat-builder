"use client";

import { createRef, useEffect, useState } from "react";
import { TransformControls } from "@react-three/drei";
import { Box3, Vector3 } from "three";

const Module = ({
  module,
  orbitRef,
  isSelected,
  selectThis,
  setSelectedSize,
}: any) => {
  const [snap, setSnap] = useState(0.05);
  const [transformControl, setTransformControlMode] = useState<
    "translate" | "rotate" | "scale"
  >("translate");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key == "Shift") {
        setSnap(0.5);
      }
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key == "Shift") {
        setSnap(0.05);

        setTransformControlMode((prev) => {
          if (prev === "translate") return "rotate";
          if (prev === "rotate") return "scale";
          return "translate";
        });
      }
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

  const [size, setSize] = useState<any>();
  useEffect(() => {
    if (!meshRef.current) return;

    const box = new Box3().setFromObject(meshRef.current);
    const size = new Vector3();
    box.getSize(size);
  }, [meshRef.current]);

  useEffect(() => {
    if (isSelected) {
      setSelectedSize(size);
    }
  }, [size]);

  return (
    <TransformControls
      position={[0, 3, 0]}
      ref={controlRef}
      object={meshRef.current}
      mode={transformControl}
      onMouseDown={() => {
        orbitRef.current.enabled = false;
      }}
      onMouseUp={() => {
        orbitRef.current.enabled = true;

        const timeout = setTimeout(() => {
          const box = new Box3().setFromObject(meshRef.current);
          const size = new Vector3();
          box.getSize(size);
          setSize(size);
        }, 100);

        return () => clearTimeout(timeout);
      }}
      translationSnap={snap}
      showX={isSelected}
      showY={isSelected}
      showZ={isSelected}
    >
      <mesh
        ref={meshRef}
        onClick={() => {
          selectThis();
        }}
      >
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color={module.color} />
      </mesh>
    </TransformControls>
  );
};

export default Module;
