"use client";
import { useState, useRef, useEffect } from "react";

import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import Module from "./components/mesh";
import { Box3, Vector3 } from "three";
import { GlobalUnitMultiplier } from "./utils";

export default function Home() {
  const orbitRef = useRef<any>(null);
  const habitatRef = useRef<any>(null);

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

  const [habitatSize, setHabitatSize] = useState({ x: 0, y: 0, z: 0 });
  const [selectedSize, setSelectedSize] = useState({ x: 0, y: 0, z: 0 });

  type moduleType = {
    type: string;
    id: number;
    color: string;
  };
  const [modules, setModules] = useState<moduleType[]>([]);
  const [selectedModule, setSelectedModule] = useState<moduleType>();
  const [crewLimit, setCrewLimit] = useState(10);

  const addModule = (type: string, color: string) => {
    const currentCrew = modules.filter((m) => m.type === "sleep").length * 2;

    if (type === "sleep" && currentCrew + 2 > crewLimit) {
      alert(
        `Crew capacity limit reached (${currentCrew}/${crewLimit}). Remove a sleep pod to add more crew.`
      );
      return;
    }
    setModules((prev) => [
      ...prev,
      { type, id: modules[modules.length - 1]?.id + 1 || 0, color },
    ]);
  };

  const checkSize = () => {
    if (!habitatRef.current) return;
    const box = new Box3().setFromObject(habitatRef.current);
    const size = new Vector3();
    box.getSize(size);

    setHabitatSize({
      x: size.x * GlobalUnitMultiplier,
      y: size.y * GlobalUnitMultiplier,
      z: size.z * GlobalUnitMultiplier,
    });
  };

  useEffect(() => {
    const timeout = setTimeout(checkSize, 1000);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(checkSize, 100);

    return () => clearTimeout(timeout);
  }, [sizes, shape]);

  const stats = {
    crew: modules.filter((m) => m.type === "sleep").length * 2,
    food_needed: modules.filter((m) => m.type === "sleep").length * 3,
    food_have: modules.filter((m) => m.type === "food").length * 30,
    waste_have: modules.filter((m) => m.type === "waste").length * 5, //edit
    waste_needed: modules.filter((m) => m.type === "sleep").length * 5 , //edit
    storage: modules.filter((m) => m.type === "storage").length * 5, //edit
    water_needed : modules.filter((m) => m.type === "sleep").length * 5+ modules.filter((m) => m.type === "food").length * 5, //edit, //edit
    water_have: modules.filter((m) => m.type === "water").length * 5, //edit
    comms: modules.filter((m) => m.type === "comms").length * 5, //edit
    corecontrol: modules.filter((m) => m.type === "corecontrol").length * 5, //edit
    medical: modules.filter((m) => m.type === "medical").length * 5, //edit
    exercise: modules.filter((m) => m.type === "exercise").length * 5, //edit
    labs: modules.filter((m) => m.type === "labs").length * 5, //edit
    recreation: modules.filter((m) => m.type === "recreation").length * 5, //edit
    power_needed: modules.filter((m) => m.type === "sleep").length * 5 + modules.filter((m) => m.type === "food").length * 5 + modules.filter((m) => m.type === "water").length * 5 + modules.filter((m) => m.type === "waste").length * 5 + modules.filter((m) => m.type === "comms").length * 5 + modules.filter((m) => m.type === "medical").length * 5 + modules.filter((m) => m.type === "exercise").length * 5 + modules.filter((m) => m.type === "labs").length * 5 + modules.filter((m) => m.type === "recreation").length * 5 + modules.filter((m) => m.type === "corecontrol").length * 5,
    power_have: modules.filter((m) => m.type === "power").length * 5,
  };

  return (
    <div className="flex h-screen">
      <div className="h-full w-80 bg-neutral-900 text-white">
        {selectedModule === undefined ? (
          <div className="w-80 py-10 px-5 bg-neutral-900 flex flex-col gap-16">
            <div className="flex flex-col gap-3">
              <h2 className="text-lg text-green-400 font-semibold">
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
                  <option value="torus">Torus</option>
                </select>
              </div>

              <div className="text-sm">
                <label className="block text-neutral-200 font-light mb-1">
                  Change Habitat Scale
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
                {habitatRef.current &&
                  (() => {
                    const box = new Box3().setFromObject(habitatRef.current);
                    const size = new Vector3();
                    box.getSize(size);

                    return (
                      <div className="flex justify-evenly gap-2 mt-2">
                        <p>{habitatSize.x.toFixed(2)}m</p>
                        <p>{habitatSize.y.toFixed(2)}m</p>
                        <p>{habitatSize.z.toFixed(2)}m</p>
                      </div>
                    );
                  })()}
              </div>
            </div>
            <div>
              <h2 className="text-lg text-green-400 font-semibold">
                Set Preferences
              </h2>

              <div className="mt-3 text-sm flex flex-col gap-2">
                <h3>Crew capacity limit</h3>
                <input
                  type="number"
                  placeholder="1"
                  className="bg-white w-full p-1 text-black text-center rounded-sm"
                  value={crewLimit === 0 ? "" : crewLimit}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCrewLimit(val === "" ? 0 : parseInt(val));
                  }}
                />
                <h3>Habitat Name</h3>
                <input
                  type="text"
                  placeholder=""
                  className="bg-white w-full p-1 text-black text-center rounded-sm"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-lg text-green-400 font-semibold">
                Module Adder
              </h2>
              <div className="flex flex-wrap gap-2">
                <button
                  className="bg-blue-500 px-2 py-1 rounded mr-2"
                  onClick={() => addModule("sleep", "#3B82F6")}
                >
                  Sleep Pod
                </button>
                <button
                  className="bg-green-500 px-2 py-1 rounded"
                  onClick={() => addModule("food", "#22C55E")}
                >
                  Food Storage
                </button>
                <button
                  className="bg-gray-500 px-2 py-1 rounded"
                  onClick={() => addModule("waste", "#6B7280")}
                >
                  Waste
                </button>
                <button
                  className="bg-red-500 px-2 py-1 rounded"
                  onClick={() => addModule("storage", "#EF4444")}
                >
                  Storage/Logistics
                </button>
                 <button 
                 className="bg-violet-500 px-2 py-1 rounded" 
                 onClick={()=> addModule("power","#8B5CF6")}
                >
                  Power
                </button>
                <button
                  className="bg-purple-500 px-2 py-1 rounded"
                  onClick={() => addModule("water", "#A855F7")}
                >
                  Water
                </button>
                <button
                  className="bg-amber-500 px-2 py-1 rounded"
                  onClick={() => addModule("comms", "#F59E0B")}
                >
                  Communication
                </button>
                <button
                  className="bg-pink-500 px-2 py-1 rounded"
                  onClick={() => addModule("corecontrol", "#EC4899")}
                >
                  Central Command
                </button>
                <button
                  className="bg-yellow-500 px-2 py-1 rounded"
                  onClick={() => addModule("medical", "#EAB308")}
                >
                  Medical
                </button>
                <button
                  className="bg-cyan-500 px-2 py-1 rounded"
                  onClick={() => addModule("exercise", "#06B6D4")}
                >
                  Exercise
                </button>
                <button
                  className="bg-fuchsia-500 px-2 py-1 rounded"
                  onClick={() => addModule("labs", "#D946EF")}
                >
                  Laboratory/Research
                </button>
                <button
                  className="bg-stone-500 px-2 py-1 rounded"
                  onClick={() => addModule("recreation", "#78716C")}
                >
                  Crew Common Quarters
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-lg text-green-400 font-semibold">
                Resources
              </h2>
              <ul className="text-sm">
                <li>Crew Capacity: {stats.crew} / {crewLimit}</li>
                <li>Food: {stats.food_needed}/{stats.food_have}</li>
                <li>Water Needed: {stats.water_needed}/{stats.water_have}</li>
                <li>Waste: {stats.waste_needed}/{stats.waste_have}</li>
                <li>Storage Space: {stats.storage}</li>
                <li>Bandwidth: {stats.comms}</li>
                <li>Medical Capacity: {stats.medical}</li>
                <li>Work Station Capacity: {stats.labs}</li>
                <li>Power: {stats.power_needed}/{stats.power_have} kW</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="w-80 py-10 px-5 bg-neutral-900 flex flex-col gap-4">
            <h1 className="text-xl font-semibold">
              Selected:{" "}
              <span className="text-green-400">
                Module #{selectedModule.id + 1}
              </span>
            </h1>
            <p className="font-semibold capitalize">
              Module-Type: {selectedModule.type}
            </p>

            <p>
              {(selectedSize.x * GlobalUnitMultiplier).toFixed(2)}m X{" "}
              {(selectedSize.y * GlobalUnitMultiplier).toFixed(2)}m X{" "}
              {(selectedSize.z * GlobalUnitMultiplier).toFixed(2)}m
            </p>

            <button
              className="mt-10 bg-red-600 py-2 rounded-md"
              onClick={() => {
                setModules(
                  modules.filter((module) => module.id != selectedModule.id)
                );
                setSelectedModule(undefined);
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 bg-black">
        <Canvas
          camera={{ position: [5, 5, 5] }}
          onPointerMissed={() => setSelectedModule(undefined)}
        >
          <Environment files="/earth.hdr" background />
          <ambientLight intensity={1} />
          <OrbitControls enablePan={true} ref={orbitRef} />

          {shape === "capsule" && (
            <mesh
              ref={habitatRef}
              scale={[
                2 * (parseFloat(sizes[0].value) || 1),
                1.2 * (parseFloat(sizes[1].value) || 1),
                2 * (parseFloat(sizes[2].value) || 1),
              ]}
            >
              <capsuleGeometry args={[1.2, 2, 10, 16]} />
              <meshStandardMaterial color="royalblue" wireframe />
            </mesh>
          )}

          {shape === "torus" && (
            <mesh
              scale={[
                1 * (parseFloat(sizes[0].value) || 1),
                1 * (parseFloat(sizes[1].value) || 1),
                1 * (parseFloat(sizes[2].value) || 1),
              ]}
              rotation={[Math.PI / 2, 0, 0]}
              ref={habitatRef}
            >
              <torusGeometry args={[3, 0.8, 16, 100]} />
              <meshStandardMaterial color="royalblue" wireframe />
            </mesh>
          )}

          {modules.map((module) => (
            <mesh key={module.id}>
              <Module
                isSelected={selectedModule == module}
                selectThis={() => {
                  setSelectedModule(module);
                }}
                orbitRef={orbitRef}
                module={module}
                setSelectedSize={setSelectedSize}
              />
              <meshStandardMaterial color="royalblue" wireframe />
            </mesh>
          ))}
        </Canvas>
      </div>
    </div>
  );
}
