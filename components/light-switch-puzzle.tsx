"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface LightSwitchPuzzleProps {
  onSolve: () => void
  onUpdate?: (isLightOn: boolean, isSolved: boolean) => void
}

export default function LightSwitchPuzzle({ onSolve, onUpdate }: LightSwitchPuzzleProps) {
  // Switch states: true = up, false = down
  const [switches, setSwitches] = useState<boolean[]>([false, false, false, false, false])
  const [solved, setSolved] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [lightSwitchIndex, setLightSwitchIndex] = useState(0) // Index of the light switch
  const [correctCombination, setCorrectCombination] = useState<boolean[]>([]) // Correct combination for other switches

  // Initialize with random light switch position and correct combination
  useEffect(() => {
    // Randomly select which switch controls the light (0-4)
    const randomLightSwitch = Math.floor(Math.random() * 5)
    setLightSwitchIndex(randomLightSwitch)

    // Generate random correct combination for the other switches
    const randomCombination = Array(5)
      .fill(false)
      .map(() => Math.random() > 0.5)
    setCorrectCombination(randomCombination)

    // Initialize switches with random positions
    setSwitches(
      Array(5)
        .fill(false)
        .map(() => Math.random() > 0.5),
    )
  }, [])

  // Check if the puzzle is solved whenever switches change
  useEffect(() => {
    // The light is on if the light switch is up
    const isLightOn = switches[lightSwitchIndex]

    // The puzzle is solved if the light is on and all other switches match the correct combination
    const isSolved =
      isLightOn &&
      switches.every((isUp, index) => {
        // Skip checking the light switch
        if (index === lightSwitchIndex) return true
        // Check if other switches match the correct combination
        return isUp === correctCombination[index]
      })

    if (isSolved && !solved) {
      setSolved(true)
      setShowSolution(true)
      onSolve()
    }

    // Call the onUpdate callback if provided
    if (onUpdate) {
      onUpdate(isLightOn, isSolved)
    }
  }, [switches, solved, onSolve, onUpdate, lightSwitchIndex, correctCombination])

  const toggleSwitch = (index: number) => {
    if (solved) return // Prevent further changes if solved

    const newSwitches = [...switches]
    newSwitches[index] = !newSwitches[index]
    setSwitches(newSwitches)
  }

  // Determine if the lights are on (light switch is up)
  const lightsOn = switches[lightSwitchIndex]

  return (
    <div className="w-full max-w-md h-64 relative rounded-lg overflow-hidden border-2 border-gray-800 bg-black">
      {/* Switches row */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full flex flex-wrap justify-between px-4 sm:px-8">
          {switches.map((isUp, index) => (
            <div
              key={index}
              onClick={() => toggleSwitch(index)}
              className="w-1/2 sm:w-1/5 flex justify-center mb-4 sm:mb-0"
            >
              <div
                style={{
                  opacity: lightsOn ? (solved ? 1 : 0.7) : 0,
                  transition: "opacity 0.3s ease",
                }}
              >
                <Image
                  src={
                    isUp
                      ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/switch-up-xaZkf3yg0nZsdpg5L3Yt5Vj61SXeeG.webp"
                      : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/switch-down-XeZ81y0Fr8Q9vsgWwWEXHinAB1fbdK.webp"
                  }
                  alt={isUp ? "Switch Up" : "Switch Down"}
                  width={60}
                  height={90}
                  className="pixelated"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Solution message */}
      {showSolution && (
        <div className="absolute inset-0 flex items-end justify-center pb-4">
          <div className="bg-black/70 px-4 py-2 rounded-lg text-green-400 font-mono">YOU MAY PROCEED</div>
        </div>
      )}
    </div>
  )
}
