"use client";
import { useState, useRef, useEffect } from "react";

import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import Module from "./components/mesh";
import { Box3, Vector3 } from "three";
import { GlobalUnitMultiplier, unCamelCase } from "./utils";

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
    stats: Record<string, number>;
  };
  const [modules, setModules] = useState<moduleType[]>([]);
  const [selectedModule, setSelectedModule] = useState<moduleType>();
  const [crewLimit, setCrewLimit] = useState(10);

  const addModule = (
    type: string,
    color: string,
    stats?: Record<string, number>
  ) => {
    const moduleStats = stats || defaultModuleStats[type] || {};

    setModules((prev) => [
      ...prev,
      {
        type,
        id: modules[modules.length - 1]?.id + 1 || 0,
        color,
        stats: moduleStats,
      },
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
    crewCapacity: modules.reduce((acc, m) => {
      if (m.stats.crewCapacity) {
        acc += m.stats.crewCapacity;
      }
      return acc;
    }, 0),
    foodNeeded: modules.reduce((acc, m) => {
      if (m.stats.foodNeeded) {
        acc += m.stats.foodNeeded;
      }
      return acc;
    }, 0),
    foodGenerated: modules.reduce((acc, m) => {
      if (m.stats.foodGenerated) {
        acc += m.stats.foodGenerated;
      }
      return acc;
    }, 0),
    wasteCapacity: modules.reduce((acc, m) => {
      if (m.stats.wasteCapacity) {
        acc += m.stats.wasteCapacity;
      }
      return acc;
    }, 0),
    wasteGenerated: modules.reduce((acc, m) => {
      if (m.stats.wasteGenerated) {
        acc += m.stats.wasteGenerated;
      }
      return acc;
    }, 0),
    storageSpace: modules.reduce((acc, m) => {
      if (m.stats.storageSpace) {
        acc += m.stats.storageSpace;
      }
      return acc;
    }, 0),
    waterNeeded: modules.reduce((acc, m) => {
      if (m.stats.waterNeeded) {
        acc += m.stats.waterNeeded;
      }
      return acc;
    }, 0),
    waterGenerated: modules.reduce((acc, m) => {
      if (m.stats.waterGenerated) {
        acc += m.stats.waterGenerated;
      }
      return acc;
    }, 0),
    bandwidth: modules.reduce((acc, m) => {
      if (m.stats.bandwidth) {
        acc += m.stats.bandwidth;
      }
      return acc;
    }, 0),
    corecontrol: modules.filter((m) => m.type === "corecontrol").length,
    medicalCapacity: modules.reduce((acc, m) => {
      if (m.stats.medicalCapacity) {
        acc += m.stats.medicalCapacity;
      }
      return acc;
    }, 0),
    exerciseCapacity: modules.reduce((acc, m) => {
      if (m.stats.exerciseCapacity) {
        acc += m.stats.exerciseCapacity;
      }
      return acc;
    }, 0),
    workstationCapacity: modules.reduce((acc, m) => {
      if (m.stats.workstationCapacity) {
        acc += m.stats.workstationCapacity;
      }
      return acc;
    }, 0),
    recreationCapacity: modules.reduce((acc, m) => {
      if (m.stats.recreationCapacity) {
        acc += m.stats.recreationCapacity;
      }
      return acc;
    }, 0),
    powerNeeded: modules.reduce((acc, m) => {
      if (m.stats.powerNeeded) {
        acc += m.stats.powerNeeded;
      }
      return acc;
    }, 0),
    powerGenerated: modules.reduce((acc, m) => {
      if (m.stats.powerGenerated) {
        acc += m.stats.powerGenerated;
      }
      return acc;
    }, 0),
  };

  const defaultModuleStats: Record<string, Record<string, number>> = {
    sleep: {
      crewCapacity: 2, // 2 crew per sleep module
      powerNeeded: 5, // kW
      foodNeeded: 3, // food units needed
      waterNeeded: 5, // water units needed
      wasteGenerated: 5,
    },
    storage: {
      storageSpace: 10, // m^3
    },
    food: {
      powerNeeded: 3, // kW
      foodGenerated: 20, // food units produced
    },
    water: {
      powerNeeded: 2, // kW
      waterGenerated: 20, // water units produced
    },
    comms: {
      powerNeeded: 2,
      bandwidth: 10, // arbitrary bandwidth units
    },
    corecontrol: {
      powerNeeded: 5,
    },
    waste: {
      powerNeeded: 2, // kW
      wasteCapacity: 10, // units of waste processed
    },
    power: {
      powerGenerated: 20,
    },
    medical: {
      powerNeeded: 3,
      medicalCapacity: 5, // crew that can be treated
    },
    exercise: {
      powerNeeded: 3,
      exerciseCapacity: 5, // number of crew that can use at once
    },
    recreation: {
      powerNeeded: 2,
      recreationCapacity: 5, // number of crew using
    },
    labs: {
      powerNeeded: 4,
      workstationCapacity: 5, // number of crew supported
    },
  };

  return (
    <div className="flex h-screen">
      <div className="h-full overflow-y-scroll pb-20 pr-4 min-w-100 bg-neutral-900 text-white ">
        {selectedModule === undefined ? (
          <div className="w-100 py-10 px-5 bg-neutral-900 flex flex-col gap-16">
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
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-lg text-green-400 font-semibold">
                Module Adder
              </h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <button
                  className="bg-blue-500 px-2 py-1 rounded"
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
                  onClick={() => addModule("power", "#8B5CF6")}
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

            <div className="flex flex-col gap-4 p-4 bg-neutral-800 rounded-md shadow-md">
              <h2 className="text-lg text-green-400 font-semibold">
                Resources
              </h2>
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex justify-between items-center">
                  <span>Crew Capacity:</span>
                  <span
                    className={
                      stats.crewCapacity > crewLimit
                        ? "text-red-500 font-bold"
                        : ""
                    }
                  >
                    {stats.crewCapacity} / {crewLimit}{" "}
                    {stats.crewCapacity > crewLimit && "⚠️"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Food Needed / Generated:</span>
                  <span
                    className={
                      stats.foodGenerated < stats.foodNeeded
                        ? "text-red-500 font-bold"
                        : ""
                    }
                  >
                    {stats.foodNeeded} / {stats.foodGenerated}{" "}
                    {stats.foodGenerated < stats.foodNeeded && "⚠️"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Water Needed / Generated:</span>
                  <span
                    className={
                      stats.waterGenerated < stats.waterNeeded
                        ? "text-red-500 font-bold"
                        : ""
                    }
                  >
                    {stats.waterNeeded} / {stats.waterGenerated}{" "}
                    {stats.waterGenerated < stats.waterNeeded && "⚠️"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Waste Generated / Capacity:</span>
                  <span
                    className={
                      stats.wasteGenerated > stats.wasteCapacity
                        ? "text-red-500 font-bold"
                        : ""
                    }
                  >
                    {stats.wasteGenerated} / {stats.wasteCapacity}{" "}
                    {stats.wasteGenerated > stats.wasteCapacity && "⚠️"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Storage Space:</span>
                  <span>{stats.storageSpace}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Bandwidth:</span>
                  <span>{stats.bandwidth}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Medical Capacity:</span>
                  <span
                    className={
                      stats.medicalCapacity < stats.crewCapacity
                        ? "text-red-500 font-bold"
                        : ""
                    }
                  >
                    {stats.medicalCapacity}{" "}
                    {stats.medicalCapacity < stats.crewCapacity && "⚠️"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Exercise Capacity:</span>
                  <span
                    className={
                      stats.exerciseCapacity < stats.crewCapacity
                        ? "text-red-500 font-bold"
                        : ""
                    }
                  >
                    {stats.exerciseCapacity}{" "}
                    {stats.exerciseCapacity < stats.crewCapacity && "⚠️"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Workstation Capacity:</span>
                  <span
                    className={
                      stats.workstationCapacity < stats.crewCapacity
                        ? "text-red-500 font-bold"
                        : ""
                    }
                  >
                    {stats.workstationCapacity}{" "}
                    {stats.workstationCapacity < stats.crewCapacity && "⚠️"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Recreation Capacity:</span>
                  <span
                    className={
                      stats.recreationCapacity < stats.crewCapacity
                        ? "text-red-500 font-bold"
                        : ""
                    }
                  >
                    {stats.recreationCapacity}{" "}
                    {stats.recreationCapacity < stats.crewCapacity && "⚠️"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Power Needed / Generated:</span>
                  <span
                    className={
                      stats.powerGenerated < stats.powerNeeded
                        ? "text-red-500 font-bold"
                        : ""
                    }
                  >
                    {stats.powerNeeded} / {stats.powerGenerated} kW{" "}
                    {stats.powerGenerated < stats.powerNeeded && "⚠️"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Central Command Modules:</span>
                  <span>{stats.corecontrol}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-100 py-10 px-5 bg-neutral-900 flex flex-col gap-4">
            <h1 className="text-xl font-semibold">
              Selected:{" "}
              <span className="text-green-400">
                Module #{selectedModule.id + 1}
              </span>
            </h1>
            <p className="font-semibold capitalize">
              Module-Type: {selectedModule.type}
            </p>

            <p className="border border-neutral-400 rounded-sm text-center p-2 mb-4">
              {(selectedSize.x * GlobalUnitMultiplier).toFixed(2)}m X{" "}
              {(selectedSize.y * GlobalUnitMultiplier).toFixed(2)}m X{" "}
              {(selectedSize.z * GlobalUnitMultiplier).toFixed(2)}m
            </p>

            {Object.keys(selectedModule.stats).map((key, i) => (
              <div className="flex gap-2 items-center">
                <label className="flex-1">
                  {key == "power" && "⚡ "}
                  {unCamelCase(key)}:
                </label>
                <input
                  key={i}
                  value={selectedModule.stats[key]}
                  onChange={(e) => {
                    const newValue = parseInt(e.target.value) || 0;

                    setModules((prevModules) => {
                      const updatedModules = prevModules.map((module) =>
                        module.id === selectedModule.id
                          ? {
                              ...module,
                              stats: {
                                ...module.stats,
                                [key]: newValue,
                              },
                            }
                          : module
                      );

                      const updatedSelected = updatedModules.find(
                        (m) => m.id === selectedModule.id
                      );
                      setSelectedModule(updatedSelected);

                      return updatedModules;
                    });
                  }}
                  className="p-2 bg-neutral-700 w-20"
                />
              </div>
            ))}

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
              <meshStandardMaterial
                color="#00d4ff"
                wireframe
                emissive="#0088ff"
                emissiveIntensity={0.3}
                opacity={0.3}
                transparent={true}
              />
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
              <meshStandardMaterial
                color="#00d4ff"
                wireframe
                emissive="#0088ff"
                emissiveIntensity={0.3}
                opacity={0.3}
                transparent={true}
              />
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
            </mesh>
          ))}
        </Canvas>
      </div>
    </div>
  );
}
