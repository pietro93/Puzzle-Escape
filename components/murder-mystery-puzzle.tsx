"use client"

import { useState } from "react"
import Image from "next/image"

type Location = "crimeScene" | "morgue" | "library"

interface MurderMysteryPuzzleProps {
  onSolve: () => void
}

export default function MurderMysteryPuzzle({ onSolve }: MurderMysteryPuzzleProps) {
  const [currentLocation, setCurrentLocation] = useState<Location>("crimeScene")

  const getLocationImage = () => {
    switch (currentLocation) {
      case "crimeScene":
        return "/images/crime-scene.png"
      case "morgue":
        return "/images/morgue.png"
      case "library":
        return "/images/library.png"
      default:
        return "/images/crime-scene.png"
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-md mb-4">
        <Image
          src={getLocationImage() || "/placeholder.svg"}
          alt={`The ${currentLocation}`}
          width={500}
          height={300}
          className="w-full h-auto rounded-lg border border-gray-800"
        />
      </div>

      <div className="flex justify-between w-full max-w-md">
        <button
          onClick={() => setCurrentLocation("crimeScene")}
          className={`px-4 py-2 rounded-md font-pixel text-sm ${
            currentLocation === "crimeScene" ? "bg-red-800 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          Crime Scene
        </button>
        <button
          onClick={() => setCurrentLocation("morgue")}
          className={`px-4 py-2 rounded-md font-pixel text-sm ${
            currentLocation === "morgue" ? "bg-red-800 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          Morgue
        </button>
        <button
          onClick={() => setCurrentLocation("library")}
          className={`px-4 py-2 rounded-md font-pixel text-sm ${
            currentLocation === "library" ? "bg-red-800 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          Library
        </button>
      </div>
    </div>
  )
}
