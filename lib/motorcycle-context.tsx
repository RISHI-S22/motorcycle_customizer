"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface AttachedPart {
  id: number
  name: string
  category: string
  price: number
  weight: number
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: [number, number, number]
  // Performance modifiers
  powerBoost?: number
  weightReduction?: number
  mileageImpact?: number
  speedBoost?: number
  torqueBoost?: number
}

interface MotorcycleContextType {
  attachedParts: AttachedPart[]
  selectedPartId: number | null
  attachPart: (part: AttachedPart) => void
  removePart: (partId: number) => void
  selectPart: (partId: number | null) => void
  getTotalWeight: () => number
  getTotalPrice: () => number
  getCalculatedMileage: (baseMileage: number) => number
  getCalculatedTopSpeed: (baseSpeed: number) => number
  getCalculatedTorque: (baseTorque: number) => number
  getCalculatedPower: (basePower: number) => number
}

const MotorcycleContext = createContext<MotorcycleContextType | undefined>(undefined)

export const getPartPosition = (category: string): [number, number, number] => {
  switch (category) {
    case "Exhaust":
      return [-0.8, 0.2, -0.7]
    case "Lights":
      return [1.3, 0.8, 0]
    case "Mirrors":
      return [0.8, 1.3, 0.4]
    case "Air Filter":
      return [0.2, 0.7, 0]
    case "Brakes":
      return [1.2, 0, 0.3]
    default:
      return [0, 1.2, 0]
  }
}

export function MotorcycleProvider({ children }: { children: ReactNode }) {
  const [attachedParts, setAttachedParts] = useState<AttachedPart[]>([])
  const [selectedPartId, setSelectedPartId] = useState<number | null>(null)

  const attachPart = (part: AttachedPart) => {
    setAttachedParts((prev) => {
      const existingIndex = prev.findIndex((p) => p.id === part.id)
      if (existingIndex >= 0) {
        const newParts = [...prev]
        newParts[existingIndex] = part
        return newParts
      } else {
        return [...prev, part]
      }
    })
  }

  const removePart = (partId: number) => {
    setAttachedParts((prev) => prev.filter((p) => p.id !== partId))
    if (selectedPartId === partId) {
      setSelectedPartId(null)
    }
  }

  const selectPart = (partId: number | null) => {
    setSelectedPartId(partId)
  }

  const getTotalWeight = () => {
    const baseWeight = 185
    const addedWeight = attachedParts.reduce((total, part) => total + part.weight, 0)
    const weightReduction = attachedParts.reduce((total, part) => total + (part.weightReduction || 0), 0)
    return Math.max(baseWeight + addedWeight - weightReduction, 100)
  }

  const getTotalPrice = () => {
    return attachedParts.reduce((total, part) => total + part.price, 250000)
  }

  const getCalculatedMileage = (baseMileage: number) => {
    const mileageImpact = attachedParts.reduce((total, part) => total + (part.mileageImpact || 0), 0)
    return Math.max(baseMileage + mileageImpact, 10)
  }

  const getCalculatedTopSpeed = (baseSpeed: number) => {
    const speedBoost = attachedParts.reduce((total, part) => total + (part.speedBoost || 0), 0)
    return Math.max(baseSpeed + speedBoost, 50)
  }

  const getCalculatedTorque = (baseTorque: number) => {
    const torqueBoost = attachedParts.reduce((total, part) => total + (part.torqueBoost || 0), 0)
    return Math.max(baseTorque + torqueBoost, 10)
  }

  const getCalculatedPower = (basePower: number) => {
    const powerBoost = attachedParts.reduce((total, part) => total + (part.powerBoost || 0), 0)
    return Math.max(basePower + powerBoost, 10)
  }

  return (
    <MotorcycleContext.Provider
      value={{
        attachedParts,
        selectedPartId,
        attachPart,
        removePart,
        selectPart,
        getTotalWeight,
        getTotalPrice,
        getCalculatedMileage,
        getCalculatedTopSpeed,
        getCalculatedTorque,
        getCalculatedPower,
      }}
    >
      {children}
    </MotorcycleContext.Provider>
  )
}

export function useMotorcycle() {
  const context = useContext(MotorcycleContext)
  if (context === undefined) {
    throw new Error("useMotorcycle must be used within a MotorcycleProvider")
  }
  return context
}
