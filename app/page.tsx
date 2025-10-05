"use client";
import { useState, useRef } from "react";

import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import Module from "./components/mesh";

export default function Home() {
  const orbitRef = useRef<any>(null);

  const [shape, setShape] = useState("capsule");

  const [sizes, setSizes] = useState([
    {
      coordinate: "X",
      value: "1",
    },
    {
      coordinate: "Y",
      value: "1",
    },
    {
      coordinate: "Z",
      value: "1",
    },
  ]);

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
      <div className="w-80 bg-neutral-900 text-white py-10 px-5 space-y-4 flex flex-col gap-10">
        <h1 className="text-2xl font-extrabold underline text-green-500">
          Habitat Builder
        </h1>

        <div className="flex flex-col gap-3">
          <h2 className="block text-lg text-green-300 font-semibold">
            Habitat Frame
          </h2>

          <div className="text-sm">
            <label className="block text-neutral-200 font-light mb-1">
              Select Habitat Shape
            </label>
            <select
              value={shape}
              onChange={(e) => setShape(e.target.value)}
              className="text-white w-full p-1 rounded"
            >
              <option value="capsule">Capsule</option>
            </select>
          </div>

          <div className="text-sm">
            <label className="block text-neutral-200 font-light mb-1">
              Change Habitat Size
            </label>
            <div className="flex justify-evenly">
              {sizes.map((size, i) => (
                <div className="flex flex-col items-center" key={i}>
                  <span>{size.coordinate}</span>
                  <input
                    className="bg-white w-14 text-black text-center rounded-sm mt-1"
                    placeholder="1"
                    value={size.value}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setSizes((prev) => {
                        const newSizes = [...prev];
                        newSizes[i] = {
                          ...newSizes[i],
                          value: newValue,
                        };
                        return newSizes;
                      });
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="block text-lg text-green-300 font-semibold">
            Module Adder
          </h2>
          <div>
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
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="block text-lg text-green-300 font-semibold">
            Resources
          </h2>
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
          <Environment files="/earth.hdr" background />
          <ambientLight intensity={1} />
          <OrbitControls enablePan={true} ref={orbitRef} />

          {shape === "capsule" && (
            <mesh
              scale={[
                2 * (parseFloat(sizes[0].value) || 1),
                1.2 * (parseFloat(sizes[1].value) || 1),
                2 * (parseFloat(sizes[2].value) || 1),
              ]}
            >
              <capsuleGeometry args={[1.2, 1, 10, 16]} />
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
