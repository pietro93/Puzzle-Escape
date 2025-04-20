"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const KNOWN_LOCATIONS = ["crime scene", "police station", "morgue", "library"]

interface MurderMysteryPuzzleProps {
  onSolve?: () => void
}

export default function MurderMysteryPuzzle({ onSolve }: MurderMysteryPuzzleProps) {
  const [currentLocation, setCurrentLocation] = useState<string>("crime scene")

  const navigateTo = (location: string) => {
    if (KNOWN_LOCATIONS.includes(location)) {
      setCurrentLocation(location)
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <h2 className="text-xl font-bold text-red-500">Murder Mystery</h2>
      <p className="text-gray-300">Explore the locations to gather clues.</p>

      {/* Location Content */}
      {currentLocation === "crime scene" && (
        <Card className="w-[400px] bg-gray-800">
          <CardHeader>
            <CardTitle>Crime Scene</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">You are at the crime scene. It's a bloody mess.</p>
          </CardContent>
        </Card>
      )}

      {currentLocation === "police station" && (
        <Card className="w-[400px] bg-gray-800">
          <CardHeader>
            <CardTitle>Police Station</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">You are at the police station. The officers are not very helpful.</p>
          </CardContent>
        </Card>
      )}

      {currentLocation === "morgue" && (
        <Card className="w-[400px] bg-gray-800">
          <CardHeader>
            <CardTitle>Morgue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">You are in the morgue. It smells like formaldehyde.</p>
          </CardContent>
        </Card>
      )}

      {currentLocation === "library" && (
        <Card className="w-[400px] bg-gray-800">
          <CardHeader>
            <CardTitle>Library</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">You are in the mansion's library. There are books everywhere.</p>
            {/* Add the demonology and botany books here */}
            <p className="text-gray-400">Demonology Book</p>
            <p className="text-gray-400">Botany Book</p>
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between w-full max-w-md">
        <Button onClick={() => navigateTo("crime scene")}>Crime Scene</Button>
        <Button onClick={() => navigateTo("police station")}>Police Station</Button>
        <Button onClick={() => navigateTo("morgue")}>Morgue</Button>
        <Button onClick={() => navigateTo("library")}>Library</Button>
      </div>
    </div>
  )
}
