"use client";
import { useState, useRef, createRef } from "react";
import { Canvas } from "@react-three/fiber";
import { TransformControls, OrbitControls } from "@react-three/drei";
import Module from "./components/mesh";

export default function Home() {
  const orbitRef = useRef<any>(null);

  const [shape, setShape] = useState("sphere");
  const [modules, setModules] = useState<{ type: string }[]>([]);

  const addModule = (type: string) => {
    setModules([...modules, { type: type }]);
  };

  // Simple resource calculator
  const stats = {
    crew: modules.filter((m) => m.type === "sleep").length * 2,
    food: modules.filter((m) => m.type === "food").length * 30,
    power: modules.length * 5,
  };

  return (
    <div className="flex h-screen">
      <div className="w-64 bg-gray-900 text-white p-4 space-y-4">
        <h1 className="text-xl font-bold">Habitat Builder</h1>

        <div>
          <label className="block text-sm">Habitat Shape</label>
          <select
            value={shape}
            onChange={(e) => setShape(e.target.value)}
            className="text-white w-full p-1 rounded"
          >
            <option value="sphere">Sphere</option>
            <option value="cylinder">Cylinder</option>
          </select>
        </div>

        <div>
          <h2 className="font-semibold mb-1">Add Modules</h2>
          <button
            className="bg-blue-500 px-2 py-1 rounded mr-2"
            onClick={() => addModule("sleep")}
          >
            Sleep Pod
          </button>
          <button
            className="bg-green-500 px-2 py-1 rounded"
            onClick={() => addModule("food")}
          >
            Food Storage
          </button>
        </div>

        <div>
          <h2 className="font-semibold">Resources</h2>
          <ul className="text-sm">
            <li>Crew Capacity: {stats.crew}</li>
            <li>Food Days: {stats.food}</li>
            <li>Power: {stats.power} kW</li>
          </ul>
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="flex-1 bg-black">
        <Canvas camera={{ position: [5, 5, 5] }}>
          <ambientLight intensity={1} />
          <OrbitControls ref={orbitRef} />

          {shape === "sphere" && (
            <mesh>
              <sphereGeometry args={[2, 32, 32]} />
              <meshStandardMaterial color="royalblue" wireframe />
            </mesh>
          )}
          {shape === "cylinder" && (
            <mesh>
              <cylinderGeometry args={[2, 2, 4, 32]} />
              <meshStandardMaterial color="royalblue" wireframe />
            </mesh>
          )}

          {modules.map((m, i) => (
            <Module orbitRef={orbitRef} mesh={m} key={i} />
          ))}
        </Canvas>
      </div>
    </div>
  );
}
