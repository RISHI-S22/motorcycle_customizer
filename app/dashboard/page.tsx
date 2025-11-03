"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Plus, Minus, Zap, TrendingUp, TrendingDown, Sparkles, Settings } from "lucide-react"
import MotorcycleViewer from "@/components/motorcycle-viewer"
import AnimatedCounter from "@/components/animated-counter"
import FloatingParticles from "@/components/floating-particles"
import { SpecsSkeleton, PartsSkeleton } from "@/components/loading-skeleton"
import { useMotorcycle, type AttachedPart, getPartPosition } from "@/lib/motorcycle-context"
import { SAMPLE_PARTS, MODELS, ENGINES, BASE_SPECS, BRANDS, PART_CATEGORIES } from "@/lib/data"

export default function MotorcycleCustomizer() {
  const [selectedBrand, setSelectedBrand] = useState<string>("")
  const [selectedModel, setSelectedModel] = useState<string>("")
  const [selectedEngine, setSelectedEngine] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [filteredParts, setFilteredParts] = useState(SAMPLE_PARTS)
  const [isLoading, setIsLoading] = useState(false)
  const [showParticles, setShowParticles] = useState(true)
  const [selectedColor, setSelectedColor] = useState<string>("")

  const {
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
  } = useMotorcycle()

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [selectedModel, selectedEngine])

  // Filter parts based on selections
  useEffect(() => {
    let filtered = SAMPLE_PARTS

    if (selectedModel) {
      filtered = filtered.filter((part) => part.compatible.includes(selectedModel))
    }

    if (selectedCategory && selectedCategory !== "all") {
      if (selectedCategory === "Engine") {
        // When Engine category is selected, show all OTHER parts except Engine
        filtered = filtered.filter((part) => part.category !== "Engine")
      } else {
        // For other categories, show only that category
        filtered = filtered.filter((part) => part.category === selectedCategory)
      }
    }

    if (searchQuery) {
      filtered = filtered.filter((part) => part.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    setFilteredParts(filtered)
  }, [selectedModel, selectedCategory, searchQuery])

  // Handle part attachment
  const handleAttachPart = (part: (typeof SAMPLE_PARTS)[0]) => {
    const attachedPart: AttachedPart = {
      ...part,
      position: getPartPosition(part.category),
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
    }
    attachPart(attachedPart)
    selectPart(part.id)
  }

  // Handle part removal
  const handleRemovePart = (partId: number) => {
    removePart(partId)
  }

  // Check if part is attached
  const isPartAttached = (partId: number) => {
    return attachedParts.some((p) => p.id === partId)
  }

  const availableModels = selectedBrand ? MODELS[selectedBrand as keyof typeof MODELS] || [] : []
  const availableEngines = selectedModel ? ENGINES[selectedModel as keyof typeof ENGINES] || [] : []

  // Get current bike specs
  const currentSpecs = selectedModel ? BASE_SPECS[selectedModel as keyof typeof BASE_SPECS] : null

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Added floating particles background */}
      {showParticles && <FloatingParticles />}

      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
                <Sparkles className="inline w-8 h-8 mr-2 text-cyan-400" />
                Hologram Motorcycle Customizer
              </h1>
              <p className="text-gray-400 mt-2">Design your dream bike in 3D</p>
            </div>
            {/* Added settings toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowParticles(!showParticles)}
              className="text-gray-400 hover:text-cyan-400 transition-colors"
            >
              <Settings className="w-4 h-4 mr-2" />
              {showParticles ? "Hide" : "Show"} Effects
            </Button>
          </div>
        </div>
      </header>

      {/* Search Controls */}
      <div className="container mx-auto px-4 py-6 relative z-10">
        <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm hover:bg-gray-900/60 transition-all duration-300 hover:border-cyan-400/30">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Brand Selector */}
              <div className="space-y-2 group">
                <label className="text-sm font-medium text-gray-300 group-hover:text-cyan-400 transition-colors">
                  Brand
                </label>
                <Select
                  value={selectedBrand}
                  onValueChange={(value) => {
                    setSelectedBrand(value)
                    setSelectedModel("")
                    setSelectedEngine("")
                  }}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white hover:border-cyan-400/50 transition-all duration-200 hover:bg-gray-700">
                    <SelectValue placeholder="Select Brand" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {BRANDS.map((brand) => (
                      <SelectItem
                        key={brand}
                        value={brand}
                        className="text-white hover:bg-gray-700 focus:bg-cyan-900/30"
                      >
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Model Selector */}
              <div className="space-y-2 group">
                <label className="text-sm font-medium text-gray-300 group-hover:text-cyan-400 transition-colors">
                  Model
                </label>
                <Select
                  value={selectedModel}
                  onValueChange={(value) => {
                    setSelectedModel(value)
                    setSelectedEngine("")
                  }}
                  disabled={!selectedBrand}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white disabled:opacity-50 hover:border-cyan-400/50 transition-all duration-200 hover:bg-gray-700">
                    <SelectValue placeholder="Select Model" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {availableModels.map((model) => (
                      <SelectItem
                        key={model}
                        value={model}
                        className="text-white hover:bg-gray-700 focus:bg-cyan-900/30"
                      >
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Engine Selector */}
              <div className="space-y-2 group">
                <label className="text-sm font-medium text-gray-300 group-hover:text-cyan-400 transition-colors">
                  Engine
                </label>
                <Select value={selectedEngine} onValueChange={setSelectedEngine} disabled={!selectedModel}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white disabled:opacity-50 hover:border-cyan-400/50 transition-all duration-200 hover:bg-gray-700">
                    <SelectValue placeholder="Select Engine" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {availableEngines.map((engine) => (
                      <SelectItem
                        key={engine}
                        value={engine}
                        className="text-white hover:bg-gray-700 focus:bg-cyan-900/30"
                      >
                        {engine}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Part Category Selector */}
              <div className="space-y-2 group">
                <label className="text-sm font-medium text-gray-300 group-hover:text-cyan-400 transition-colors">
                  Part Category
                </label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white hover:border-cyan-400/50 transition-all duration-200 hover:bg-gray-700">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600 max-h-60">
                    <SelectItem value="all" className="text-white hover:bg-gray-700 focus:bg-cyan-900/30">
                      All Categories
                    </SelectItem>
                    {PART_CATEGORIES.map((category) => (
                      <SelectItem
                        key={category}
                        value={category}
                        className="text-white hover:bg-gray-700 focus:bg-cyan-900/30"
                      >
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Part Search */}
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 group-hover:text-cyan-400 transition-colors" />
              <Input
                placeholder="Search specific parts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 hover:border-cyan-400/50 focus:border-cyan-400 transition-all duration-200"
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 pb-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 3D Viewer */}
          <div className="lg:col-span-2 space-y-4">
            {/* Color Control Panel */}
            {selectedModel && (
              <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm hover:bg-gray-900/60 transition-all duration-300">
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
                    Bike Customization
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {/* Color Options */}
                    {[
                      { name: "Classic Red", color: "#CC0000", gradient: "from-red-500 to-red-700" },
                      { name: "Royal Blue", color: "#0066CC", gradient: "from-blue-500 to-blue-700" },
                      { name: "Forest Green", color: "#00AA00", gradient: "from-green-500 to-green-700" },
                      { name: "Sunset Orange", color: "#FF6600", gradient: "from-orange-500 to-orange-700" },
                      { name: "Royal Purple", color: "#6600CC", gradient: "from-purple-500 to-purple-700" },
                      { name: "Golden Yellow", color: "#FFD700", gradient: "from-yellow-400 to-yellow-600" },
                      { name: "Silver Chrome", color: "#C0C0C0", gradient: "from-gray-300 to-gray-500" },
                      { name: "Matte Black", color: "#1a1a1a", gradient: "from-gray-800 to-black" },
                    ].map((colorOption) => (
                      <Button
                        key={colorOption.name}
                        variant="outline"
                        size="sm"
                        className={`h-12 border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg bg-gradient-to-br ${colorOption.gradient} text-white border-gray-600 hover:border-cyan-400 ${
                          selectedColor === colorOption.color
                            ? "ring-2 ring-cyan-400 ring-offset-2 ring-offset-black scale-105"
                            : ""
                        }`}
                        onClick={() => {
                          setSelectedColor(colorOption.color)
                        }}
                      >
                        <div className="text-center">
                          <div className="text-xs font-medium">{colorOption.name}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                  {selectedColor && (
                    <div className="mt-3 text-center">
                      <Badge className="bg-cyan-600 text-white animate-pulse">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Color Applied:{" "}
                        {[
                          { name: "Classic Red", color: "#CC0000" },
                          { name: "Royal Blue", color: "#0066CC" },
                          { name: "Forest Green", color: "#00AA00" },
                          { name: "Sunset Orange", color: "#FF6600" },
                          { name: "Royal Purple", color: "#6600CC" },
                          { name: "Golden Yellow", color: "#FFD700" },
                          { name: "Silver Chrome", color: "#C0C0C0" },
                          { name: "Matte Black", color: "#1a1a1a" },
                        ].find((c) => c.color === selectedColor)?.name || "Custom"}
                      </Badge>
                    </div>
                  )}
                </div>
              </Card>
            )}

            <MotorcycleViewer
              brand={selectedBrand}
              model={selectedModel}
              engine={selectedEngine}
              selectedColor={selectedColor}
              className="h-96 lg:h-[600px]"
            />
          </div>

          {/* Parts List & Specs */}
          <div className="space-y-6">
            {/* Enhanced Specs Panel */}
            <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm hover:bg-gray-900/60 transition-all duration-300 hover:border-cyan-400/30 hover:shadow-lg hover:shadow-cyan-400/10">
              <div className="p-4">
                <h3 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center">
                  <Zap className="w-5 h-5 mr-2 animate-pulse" />
                  Live Performance Specs
                </h3>
                {isLoading ? (
                  <SpecsSkeleton />
                ) : (
                  <div className="space-y-4">
                    {!selectedModel && (
                      <div className="text-center py-4 text-gray-500">
                        <Zap className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        Select a motorcycle model to view performance specs
                      </div>
                    )}

                    {/* Weight - always show */}
                    <div className="flex justify-between items-center group hover:bg-gray-800/30 p-2 rounded transition-colors">
                      <span className="text-gray-400 group-hover:text-gray-300">Weight:</span>
                      <div className="flex items-center space-x-2">
                        <AnimatedCounter
                          value={getTotalWeight()}
                          decimals={1}
                          suffix=" kg"
                          className="text-white font-medium"
                        />
                        {getTotalWeight() < 185 && <TrendingDown className="w-4 h-4 text-green-400 animate-bounce" />}
                        {getTotalWeight() > 185 && <TrendingUp className="w-4 h-4 text-red-400 animate-bounce" />}
                      </div>
                    </div>

                    {/* Engine */}
                    <div className="flex justify-between group hover:bg-gray-800/30 p-2 rounded transition-colors">
                      <span className="text-gray-400 group-hover:text-gray-300">Engine:</span>
                      <span className="text-white font-medium">{selectedEngine || "N/A"}</span>
                    </div>

                    {/* Power */}
                    {currentSpecs && (
                      <div className="flex justify-between items-center group hover:bg-gray-800/30 p-2 rounded transition-colors">
                        <span className="text-gray-400 group-hover:text-gray-300">Power:</span>
                        <div className="flex items-center space-x-2">
                          <AnimatedCounter
                            value={getCalculatedPower(currentSpecs.power)}
                            decimals={1}
                            suffix=" HP"
                            className="text-white font-medium"
                          />
                          {getCalculatedPower(currentSpecs.power) > currentSpecs.power && (
                            <TrendingUp className="w-4 h-4 text-green-400 animate-bounce" />
                          )}
                        </div>
                      </div>
                    )}

                    {/* Torque */}
                    {currentSpecs && (
                      <div className="flex justify-between items-center group hover:bg-gray-800/30 p-2 rounded transition-colors">
                        <span className="text-gray-400 group-hover:text-gray-300">Torque:</span>
                        <div className="flex items-center space-x-2">
                          <AnimatedCounter
                            value={getCalculatedTorque(currentSpecs.torque)}
                            decimals={1}
                            suffix=" Nm"
                            className="text-white font-medium"
                          />
                          {getCalculatedTorque(currentSpecs.torque) > currentSpecs.torque && (
                            <TrendingUp className="w-4 h-4 text-green-400 animate-bounce" />
                          )}
                        </div>
                      </div>
                    )}

                    {/* Mileage */}
                    {currentSpecs && (
                      <div className="flex justify-between items-center group hover:bg-gray-800/30 p-2 rounded transition-colors">
                        <span className="text-gray-400 group-hover:text-gray-300">Mileage:</span>
                        <div className="flex items-center space-x-2">
                          <AnimatedCounter
                            value={getCalculatedMileage(currentSpecs.mileage)}
                            decimals={1}
                            suffix=" km/l"
                            className="text-white font-medium"
                          />
                          {getCalculatedMileage(currentSpecs.mileage) > currentSpecs.mileage && (
                            <TrendingUp className="w-4 h-4 text-green-400 animate-bounce" />
                          )}
                          {getCalculatedMileage(currentSpecs.mileage) < currentSpecs.mileage && (
                            <TrendingDown className="w-4 h-4 text-red-400 animate-bounce" />
                          )}
                        </div>
                      </div>
                    )}

                    {/* Top Speed */}
                    {currentSpecs && (
                      <div className="flex justify-between items-center group hover:bg-gray-800/30 p-2 rounded transition-colors">
                        <span className="text-gray-400 group-hover:text-gray-300">Top Speed:</span>
                        <div className="flex items-center space-x-2">
                          <AnimatedCounter
                            value={getCalculatedTopSpeed(currentSpecs.topSpeed)}
                            decimals={0}
                            suffix=" km/h"
                            className="text-white font-medium"
                          />
                          {getCalculatedTopSpeed(currentSpecs.topSpeed) > currentSpecs.topSpeed && (
                            <TrendingUp className="w-4 h-4 text-green-400 animate-bounce" />
                          )}
                        </div>
                      </div>
                    )}

                    {/* Price - always show */}
                    <div className="flex justify-between items-center pt-2 border-t border-gray-700 group hover:bg-gray-800/30 p-2 rounded transition-colors">
                      <span className="text-gray-400 group-hover:text-gray-300">Total Price:</span>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">₹</div>
                        <AnimatedCounter
                          value={getTotalPrice()}
                          decimals={0}
                          suffix=""
                          className="text-green-400 font-bold text-lg"
                        />
                      </div>
                    </div>

                    {/* Performance Summary */}
                    {attachedParts.length > 0 && (
                      <div className="mt-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-cyan-400/30 transition-all duration-300">
                        <h4 className="text-sm font-medium text-cyan-400 mb-2 flex items-center">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Modifications Applied:
                        </h4>
                        <div className="text-xs text-gray-300 space-y-1">
                          {attachedParts.map((part) => (
                            <div
                              key={part.id}
                              className="flex justify-between hover:bg-gray-700/30 p-1 rounded transition-colors"
                            >
                              <span className="truncate">{part.name}</span>
                              <span className="text-cyan-400 ml-2">
                                {part.powerBoost && `+${part.powerBoost}HP `}
                                {part.speedBoost && `+${part.speedBoost}km/h `}
                                {part.mileageImpact &&
                                  (part.mileageImpact > 0 ? `+${part.mileageImpact}` : `${part.mileageImpact}`)}
                                {part.mileageImpact && "km/l"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>

            {/* Parts List */}
            <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm hover:bg-gray-900/60 transition-all duration-300 hover:border-cyan-400/30 hover:shadow-lg hover:shadow-cyan-400/10">
              <div className="p-4">
                <h3 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center justify-between">
                  <span>Compatible Parts ({filteredParts.length})</span>
                  {selectedCategory === "Engine" && (
                    <Badge className="bg-purple-600 text-white animate-pulse">
                      <Zap className="w-3 h-3 mr-1" />
                      Showing Remaining Parts
                    </Badge>
                  )}
                </h3>
                {isLoading ? (
                  <PartsSkeleton />
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {selectedCategory === "Engine" && filteredParts.length > 0 && (
                      <div className="mb-4 p-3 bg-purple-900/20 border border-purple-400/30 rounded-lg">
                        <div className="flex items-center text-purple-400 text-sm">
                          <Sparkles className="w-4 h-4 mr-2" />
                          Showing all compatible parts except Engine components for your {selectedModel}
                        </div>
                      </div>
                    )}

                    {filteredParts.map((part) => {
                      const isAttached = isPartAttached(part.id)
                      const isSelected = selectedPartId === part.id

                      return (
                        <div
                          key={part.id}
                          className={`p-3 rounded-lg border transition-all duration-300 cursor-pointer transform hover:scale-[1.02] ${
                            isSelected
                              ? "bg-cyan-900/30 border-cyan-400 shadow-lg shadow-cyan-400/20 animate-pulse"
                              : isAttached
                                ? "bg-green-900/20 border-green-400/50 hover:bg-green-900/30"
                                : "bg-gray-800/50 border-gray-700 hover:border-cyan-400/50 hover:bg-gray-800/70"
                          }`}
                          onClick={() => selectPart(isSelected ? null : part.id)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-white group-hover:text-cyan-400 transition-colors">
                              {part.name}
                            </h4>
                            <div className="flex items-center space-x-2">
                              <Badge
                                variant="secondary"
                                className="bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
                              >
                                {part.category}
                              </Badge>
                              {isAttached && (
                                <Badge className="bg-green-600 text-white animate-pulse">
                                  <Zap className="w-3 h-3 mr-1" />
                                  Attached
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="flex justify-between items-center mb-2">
                            <div className="flex space-x-4 text-sm">
                              <span className="text-gray-400">₹{part.price.toLocaleString()}</span>
                              <span className="text-gray-400">{part.weight}kg</span>
                            </div>
                            <div className="flex space-x-1 text-xs">
                              {part.powerBoost && (
                                <Badge className="bg-green-600/20 text-green-400 border border-green-400/30">
                                  +{part.powerBoost}HP
                                </Badge>
                              )}
                              {part.speedBoost && (
                                <Badge className="bg-blue-600/20 text-blue-400 border border-blue-400/30">
                                  +{part.speedBoost}km/h
                                </Badge>
                              )}
                              {part.mileageImpact && (
                                <Badge
                                  className={`${part.mileageImpact > 0 ? "bg-green-600/20 text-green-400 border-green-400/30" : "bg-red-600/20 text-red-400 border-red-400/30"}`}
                                >
                                  {part.mileageImpact > 0 ? "+" : ""}
                                  {part.mileageImpact}km/l
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <div className="text-xs text-gray-500">Compatible with {part.compatible.length} models</div>
                            <div className="flex space-x-2">
                              {!isAttached ? (
                                <Button
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleAttachPart(part)
                                  }}
                                  className="bg-cyan-600 hover:bg-cyan-700 text-white transform hover:scale-105 transition-all duration-200 hover:shadow-lg hover:shadow-cyan-400/30"
                                >
                                  <Plus className="w-3 h-3 mr-1" />
                                  Attach
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleRemovePart(part.id)
                                  }}
                                  className="bg-red-600 hover:bg-red-700 transform hover:scale-105 transition-all duration-200 hover:shadow-lg hover:shadow-red-400/30"
                                >
                                  <Minus className="w-3 h-3 mr-1" />
                                  Remove
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                    {filteredParts.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <div className="text-lg font-medium mb-2">No compatible parts found</div>
                        {selectedModel ? (
                          <div className="space-y-2">
                            <p className="text-sm">Try selecting a different category or search term</p>
                            {selectedCategory !== "all" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedCategory("all")}
                                className="text-cyan-400 border-cyan-400/50 hover:bg-cyan-400/10"
                              >
                                Show All Categories
                              </Button>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm">Select a motorcycle model first</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

