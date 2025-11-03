"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, PerspectiveCamera } from "@react-three/drei"
import { useEffect, useRef, useState } from "react"
import { useMotorcycle } from "@/lib/motorcycle-context"
import type * as THREE from "three"

// 3D Motorcycle Component
function Motorcycle3D({ brand, model, selectedColor }: { brand: string; model: string; selectedColor?: string }) {
  const { attachedParts, selectedPartId } = useMotorcycle()
  const groupRef = useRef<THREE.Group>(null)

  useEffect(() => {
    if (groupRef.current) {
      // Auto-rotation when idle
      const interval = setInterval(() => {
        if (groupRef.current) {
          groupRef.current.rotation.y += 0.005
        }
      }, 16)
      return () => clearInterval(interval)
    }
  }, [])

  // Get motorcycle type for different geometries
  const getMotorcycleType = (brand: string, model: string) => {
    if (model.includes("R1") || model.includes("CBR") || model.includes("Ninja") || model.includes("Panigale")) {
      return "sport"
    }
    if (model.includes("Himalayan") || model.includes("Tiger") || model.includes("GS") || model.includes("Adventure")) {
      return "adventure"
    }
    if (model.includes("Fat Boy") || model.includes("Road King") || model.includes("Iron")) {
      return "cruiser"
    }
    if (model.includes("Classic") || model.includes("Bullet") || model.includes("Bonneville")) {
      return "classic"
    }
    return "standard"
  }

  const bikeType = getMotorcycleType(brand, model)

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {/* Main Frame */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[3, 0.2, 0.3]} />
        <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Fuel Tank - varies by bike type and uses selected color */}
      <mesh position={[0, 0.8, 0]}>
        {bikeType === "sport" ? (
          <boxGeometry args={[1.2, 0.6, 0.8]} />
        ) : bikeType === "cruiser" ? (
          <boxGeometry args={[1.8, 0.4, 0.6]} />
        ) : bikeType === "adventure" ? (
          <boxGeometry args={[1.4, 0.8, 0.7]} />
        ) : (
          <boxGeometry args={[1.5, 0.5, 0.7]} />
        )}
        <meshStandardMaterial
          color={
            selectedColor ||
            (brand === "Royal Enfield"
              ? "#8B4513"
              : brand === "Yamaha"
                ? "#0066CC"
                : brand === "Kawasaki"
                  ? "#00AA00"
                  : "#CC0000")
          }
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Front Wheel */}
      <group position={[-1.2, 0, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.2]} />
          <meshStandardMaterial color="#222222" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Rim */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.25]} />
          <meshStandardMaterial color="#888888" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* Rear Wheel */}
      <group position={[1.2, 0, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.2]} />
          <meshStandardMaterial color="#222222" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Rim */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.25]} />
          <meshStandardMaterial color="#888888" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* Handlebars - varies by bike type */}
      <mesh position={[-0.8, 1.2, 0]}>
        {bikeType === "sport" ? (
          <boxGeometry args={[0.8, 0.05, 0.6]} />
        ) : bikeType === "cruiser" ? (
          <boxGeometry args={[1.2, 0.05, 0.4]} />
        ) : (
          <boxGeometry args={[1.0, 0.05, 0.5]} />
        )}
        <meshStandardMaterial color="#444444" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Seat */}
      <mesh position={[0.3, 0.9, 0]}>
        {bikeType === "sport" ? (
          <boxGeometry args={[0.8, 0.2, 0.4]} />
        ) : bikeType === "cruiser" ? (
          <boxGeometry args={[1.2, 0.3, 0.5]} />
        ) : (
          <boxGeometry args={[1.0, 0.25, 0.45]} />
        )}
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
      </mesh>

      {/* Engine */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[0.8, 0.6, 0.6]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Exhaust */}
      <mesh position={[0.8, 0.1, -0.4]} rotation={[0, 0, -0.2]}>
        <cylinderGeometry args={[0.08, 0.12, 1.5]} />
        <meshStandardMaterial color="#444444" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Headlight */}
      <mesh position={[-1.5, 0.8, 0]}>
        <sphereGeometry args={[0.15]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} transparent opacity={0.9} />
      </mesh>

      {/* Attached Parts as 3D Objects */}
      {attachedParts.map((part, index) => {
        const isSelected = selectedPartId === part.id
        const position = getPartPosition3D(part.category, index)

        return (
          <group key={part.id} position={position}>
            <mesh>
              {getPartGeometry(part.category)}
              <meshStandardMaterial
                color={isSelected ? "#00CCFF" : getPartColor(part.category)}
                metalness={0.8}
                roughness={0.2}
                emissive={isSelected ? "#00CCFF" : "#000000"}
                emissiveIntensity={isSelected ? 0.3 : 0}
              />
            </mesh>
            {/* Floating animation for selected parts */}
            {isSelected && (
              <mesh position={[0, Math.sin(Date.now() * 0.005) * 0.1, 0]}>
                <sphereGeometry args={[0.05]} />
                <meshStandardMaterial
                  color="#00CCFF"
                  emissive="#00CCFF"
                  emissiveIntensity={0.5}
                  transparent
                  opacity={0.7}
                />
              </mesh>
            )}
          </group>
        )
      })}
    </group>
  )
}

// Helper functions for part positioning and geometry
function getPartPosition3D(category: string, index: number): [number, number, number] {
  const basePositions: Record<string, [number, number, number]> = {
    Exhaust: [0.8, 0.1, -0.4],
    Lights: [-1.5, 0.8, 0],
    Headlight: [-1.5, 0.8, 0],
    "Tail Light": [1.5, 0.8, 0],
    "Turn Signals": [-1.3, 0.9, 0.3],
    "Air Filter": [0, 0.6, 0],
    Brakes: [-1.2, 0, 0],
    "Brake Pads": [-1.2, 0, 0],
    "Disc Brakes": [-1.2, 0, 0],
    Mirrors: [-0.8, 1.3, 0.3],
    Engine: [0, 0.2, 0],
    Suspension: [0, -0.2, 0],
    Tyres: [-1.2, 0, 0],
    Wheels: [-1.2, 0, 0],
    Handlebars: [-0.8, 1.2, 0],
    Seat: [0.3, 0.9, 0],
    "Fuel Tank": [0, 0.8, 0],
    "Chain & Sprockets": [1.2, 0, 0],
    Clutch: [0, 0.2, 0.3],
    Gearbox: [0.2, 0.2, 0],
    Radiator: [-0.5, 0.5, 0],
    Battery: [0.5, 0.3, 0],
    "Spark Plugs": [0, 0.4, 0],
    "Oil Filter": [0, 0.1, 0],
    Speedometer: [-0.8, 1.1, 0],
    Footpegs: [0, 0.3, 0.4],
    Grips: [-0.8, 1.2, 0.3],
    Levers: [-0.8, 1.2, 0.2],
    Cables: [-0.5, 1.0, 0],
    Fenders: [0, 0.2, 0],
  }

  const basePos = basePositions[category] || [0, 0.5, 0]
  // Offset multiple parts of same category
  return [basePos[0] + index * 0.1, basePos[1] + index * 0.05, basePos[2] + index * 0.05]
}

function getPartGeometry(category: string) {
  switch (category) {
    case "Exhaust":
      return <cylinderGeometry args={[0.06, 0.1, 1.2]} />
    case "Lights":
    case "Headlight":
    case "Tail Light":
      return <sphereGeometry args={[0.1]} />
    case "Turn Signals":
      return <sphereGeometry args={[0.05]} />
    case "Air Filter":
      return <boxGeometry args={[0.3, 0.1, 0.3]} />
    case "Brakes":
    case "Brake Pads":
    case "Disc Brakes":
      return <cylinderGeometry args={[0.2, 0.2, 0.05]} />
    case "Mirrors":
      return <boxGeometry args={[0.1, 0.1, 0.02]} />
    case "Engine":
      return <boxGeometry args={[0.2, 0.2, 0.2]} />
    case "Suspension":
      return <cylinderGeometry args={[0.05, 0.05, 0.3]} />
    case "Tyres":
      return <cylinderGeometry args={[0.35, 0.35, 0.15]} />
    case "Wheels":
      return <cylinderGeometry args={[0.3, 0.3, 0.1]} />
    case "Handlebars":
      return <boxGeometry args={[0.6, 0.03, 0.4]} />
    case "Seat":
      return <boxGeometry args={[0.6, 0.15, 0.3]} />
    case "Fuel Tank":
      return <boxGeometry args={[0.8, 0.3, 0.4]} />
    default:
      return <boxGeometry args={[0.1, 0.1, 0.1]} />
  }
}

function getPartColor(category: string): string {
  const colors: Record<string, string> = {
    Exhaust: "#444444",
    Lights: "#FFFF00",
    Headlight: "#FFFFFF",
    "Tail Light": "#FF0000",
    "Turn Signals": "#FFA500",
    "Air Filter": "#00AA00",
    Brakes: "#AA0000",
    "Brake Pads": "#AA0000",
    "Disc Brakes": "#888888",
    Mirrors: "#666666",
    Engine: "#333333",
    Suspension: "#FF6600",
    Tyres: "#000000",
    Wheels: "#CCCCCC",
    Handlebars: "#444444",
    Seat: "#1a1a1a",
    "Fuel Tank": "#CC0000",
    "Chain & Sprockets": "#888888",
    Clutch: "#666666",
    Gearbox: "#444444",
    Radiator: "#AAAAAA",
    Battery: "#000000",
    "Spark Plugs": "#FFFFFF",
    "Oil Filter": "#FFAA00",
    Speedometer: "#000000",
    Footpegs: "#666666",
    Grips: "#000000",
    Levers: "#888888",
    Cables: "#333333",
    Fenders: "#444444",
  }
  return colors[category] || "#666666"
}

interface MotorcycleViewerProps {
  brand: string
  model: string
  engine: string
  selectedColor?: string
  className?: string
}

export default function MotorcycleViewer({ brand, model, engine, selectedColor, className }: MotorcycleViewerProps) {
  const { attachedParts } = useMotorcycle()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time for 3D scene
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [brand, model])

  return (
    <div className={`relative ${className}`}>
      {/* Hologram border effect */}
      <div className="absolute inset-0 rounded-lg border border-cyan-400/30 bg-gradient-to-br from-cyan-400/5 to-purple-400/5 backdrop-blur-sm">
        <div className="absolute inset-0 rounded-lg border border-cyan-400/20 animate-pulse"></div>
      </div>

      {/* 3D Canvas */}
      <div className="w-full h-full rounded-lg relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
        {brand && model ? (
          <>
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 flex items-center justify-center animate-spin">
                    <div className="w-12 h-12 rounded-full bg-black"></div>
                  </div>
                  <p className="text-cyan-400 text-sm">Loading 3D Model...</p>
                </div>
              </div>
            ) : (
              <Canvas>
                <PerspectiveCamera makeDefault position={[5, 2, 5]} />
                <OrbitControls
                  enablePan={true}
                  enableZoom={true}
                  enableRotate={true}
                  minDistance={3}
                  maxDistance={10}
                  autoRotate={false}
                />

                <ambientLight intensity={0.8} />
                <directionalLight position={[10, 10, 5]} intensity={1.2} color="#ffffff" castShadow />
                <spotLight position={[-5, 5, 5]} angle={0.3} penumbra={1} intensity={1.5} color="#00CCFF" castShadow />
                <spotLight position={[5, 5, -5]} angle={0.3} penumbra={1} intensity={1.2} color="#CC00FF" />
                <pointLight position={[0, 10, 0]} intensity={1} color="#FFFFFF" />
                <pointLight position={[-10, 5, 0]} intensity={0.8} color="#00FFFF" />
                <pointLight position={[10, 5, 0]} intensity={0.8} color="#FF00FF" />

                {/* Environment for reflections */}
                <Environment preset="city" />

                {/* 3D Motorcycle */}
                <Motorcycle3D brand={brand} model={model} selectedColor={selectedColor} />

                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
                  <planeGeometry args={[20, 20]} />
                  <meshStandardMaterial
                    color="#003366"
                    transparent
                    opacity={0.6}
                    wireframe={true}
                    emissive="#001122"
                    emissiveIntensity={0.2}
                  />
                </mesh>
              </Canvas>
            )}
            {/* Model info display */}
            <div className="absolute bottom-4 left-4 text-cyan-400 bg-black/50 backdrop-blur-sm rounded-lg p-3">
              <div className="text-lg font-semibold">
                {brand} {model}
              </div>
              {engine && <div className="text-sm opacity-75">{engine}</div>}
              <div className="text-xs opacity-60 mt-1">Interactive 3D Model • Drag to rotate • Scroll to zoom</div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 flex items-center justify-center animate-pulse">
                <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center">
                  <div className="text-2xl">🏍️</div>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">3D Hologram Viewer</h3>
              <p className="text-gray-500 text-sm">Select a motorcycle to view in 3D</p>
              <p className="text-gray-600 text-xs mt-2">Interactive hologram display with Three.js</p>
            </div>
          </div>
        )}

        {/* Parts counter */}
        {attachedParts.length > 0 && (
          <div className="absolute bottom-4 right-4 text-xs text-gray-400 bg-black/50 backdrop-blur-sm px-3 py-2 rounded-lg">
            <div className="text-cyan-400 font-medium">
              {attachedParts.length} part{attachedParts.length !== 1 ? "s" : ""} attached
            </div>
            <div className="text-gray-500 text-xs mt-1">Visible in 3D scene</div>
          </div>
        )}
      </div>
    </div>
  )
}
