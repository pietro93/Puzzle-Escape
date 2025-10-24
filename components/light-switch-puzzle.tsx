"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface LightSwitchPuzzleProps {
  onSolve: () => void
  onUpdate?: (isLightOn: boolean, isSolved: boolean) => void
  onGuardClick: () => void 
  onSolutionGenerated: (solution: string) => void
}

export default function LightSwitchPuzzle({ onSolve, onUpdate, onSolutionGenerated, onGuardClick }: LightSwitchPuzzleProps) {
  // Switch states: true = up, false = down
  const [switches, setSwitches] = useState<boolean[][]>([
    [false, false, false, false, false], // Top row (invisible until solved)
    [false, false, false, false, false], // Middle row (interactive)
    [false, false, false, false, false]  // Bottom row (invisible until solved)
  ])
  const [solved, setSolved] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [lightSwitchIndex, setLightSwitchIndex] = useState(0) // Index of the light switch in middle row
  const [isLightSwitchUp, setIsLightSwitchUp] = useState(false) // Track if light switch is up
  const [correctCombination, setCorrectCombination] = useState<boolean[]>([]) // Correct combination for middle row

  // Initialize with random light switch position and correct combination
  useEffect(() => {
    // Randomly select which switch controls the light in the middle row (0-4)
    const randomLightSwitch = Math.floor(Math.random() * 5)
    setLightSwitchIndex(randomLightSwitch)

    // Generate random correct combination for the middle row
    // Must have at least two UP switches (including light switch) and at least two DOWN switches
    // Either 3 UP and 2 DOWN or 2 UP and 3 DOWN
    const generateCombination = () => {
      let combo;
      let upCount;
      let downCount;
      
      do {
        combo = Array(5).fill(false)
        upCount = 0
        downCount = 0

        // Set light switch to UP (required)
        combo[randomLightSwitch] = true
        upCount++

        // Randomly set other switches
        for (let i = 0; i < 5; i++) {
          if (i !== randomLightSwitch) {
            combo[i] = Math.random() > 0.5
            if (combo[i]) upCount++
            else downCount++
          }
        }
      } while (upCount < 2 || downCount < 2) // Ensure at least 2 UP and 2 DOWN
      
      return combo
    }

    const correctCombo = generateCombination()
    setCorrectCombination(correctCombo)

    // Determine the solution based on the number of UP switches in the correct combination
    const upSwitchesInCombo = correctCombo.filter(Boolean).length
    const solution = upSwitchesInCombo === 3 ? "northwest" : "southwest"
    onSolutionGenerated(solution)

    // Generate and shuffle a combined array for top and bottom rows (5 UP, 5 DOWN total)
    const combinedSwitches = [...Array(5).fill(true), ...Array(5).fill(false)]
    for (let i = combinedSwitches.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [combinedSwitches[i], combinedSwitches[j]] = [combinedSwitches[j], combinedSwitches[i]]
    }

    const topRow = combinedSwitches.slice(0, 5)
    const bottomRow = combinedSwitches.slice(5, 10)

    // Initialize switches
    setSwitches([
      topRow,
      Array(5).fill(false), // Middle row (all down initially)
      bottomRow,
    ])
  }, [])

  // Check if the puzzle is solved whenever switches change
  useEffect(() => {
    // The puzzle is solved if the light switch in the middle row is up
    // and the other switches match the correct combination
    const isLightOn = switches[1][lightSwitchIndex]
    setIsLightSwitchUp(isLightOn)

    const isSolved = isLightOn &&
      switches[1].every((isUp, index) => {
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

  const toggleSwitch = (row: number, index: number) => {
    // If puzzle is solved, do not allow toggling
    if (solved) return;
    // Only allow toggling switches in the middle row
    if (row !== 1) return

    // If light switch is down, no other switches can be toggled
    if (!isLightSwitchUp && index !== lightSwitchIndex) return

    const newSwitches = switches.map(row => [...row])
    newSwitches[row][index] = !newSwitches[row][index]
    setSwitches(newSwitches)
  }

  // Determine if the lights are on (light switch in middle row is up)
  const lightsOn = switches[1][lightSwitchIndex]
  // Only show additional rows when puzzle is fully solved
  const showAllRows = solved

  return (
    <div className="w-full max-w-md h-96 relative rounded-lg overflow-hidden border-2 border-gray-800 bg-black">
      {/* Switches rows */}
      <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
        {/* Top row (invisible until puzzle is solved) */}
        <div className="w-full flex flex-wrap justify-between px-4 sm:px-8">
          {switches[0].map((isUp, index) => (
            <div
              key={`top-${index}`}
              className="w-1/2 sm:w-1/5 flex justify-center mb-2 sm:mb-0"
            >
              <div
                style={{
                  opacity: showAllRows ? 1 : 0,
                  transition: "opacity 0.3s ease",
                }}
              >
                <Image
                  src={
                    isUp
                      ? "/images/switch-up.webp"
                      : "/images/switch-down.webp"
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

        {/* Middle row (interactive) */}
        <div className="w-full flex flex-wrap justify-between px-4 sm:px-8">
          {switches[1].map((isUp, index) => (
            <div
              key={`middle-${index}`}
              onClick={() => toggleSwitch(1, index)}
              className="w-1/2 sm:w-1/5 flex justify-center mb-2 sm:mb-0"
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
                      ? "/images/switch-up.webp"
                      : "/images/switch-down.webp"
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

        {/* Bottom row (invisible until puzzle is solved) */}
        <div className="w-full flex flex-wrap justify-between px-4 sm:px-8">
          {switches[2].map((isUp, index) => (
            <div
              key={`bottom-${index}`}
              className="w-1/2 sm:w-1/5 flex justify-center mb-2 sm:mb-0"
            >
              <div
                style={{
                  opacity: showAllRows ? 1 : 0,
                  transition: "opacity 0.3s ease",
                }}
              >
                <Image
                  src={
                    isUp
                      ? "/images/switch-up.webp"
                      : "/images/switch-down.webp"
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


    </div>
  )
}
