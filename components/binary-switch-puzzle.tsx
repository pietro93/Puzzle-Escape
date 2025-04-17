"use client"

import { useState, useEffect } from "react"

interface BinarySwitchPuzzleProps {
  onSolve?: () => void
  onCorrectCombinationsChange?: (count: number) => void
}

export default function BinarySwitchPuzzle({ onSolve, onCorrectCombinationsChange }: BinarySwitchPuzzleProps) {
  // Initial state for all rows (first 3 switches are fixed as 0 1 1)
  const initialSwitches = [
    [0, 1, 1, 0, 0, 0, 0, 0], // Row 1
    [0, 1, 1, 0, 0, 0, 0, 0], // Row 2
    [0, 1, 1, 0, 0, 0, 0, 0], // Row 3
    [0, 1, 1, 0, 0, 0, 0, 0], // Row 4
    [0, 1, 1, 0, 0, 0, 0, 0], // Row 5
    [0, 1, 1, 0, 0, 0, 0, 0], // Row 6
  ]

  // Target combinations for each row
  const targetCombinations = [
    [0, 1, 1, 0, 0, 1, 0, 1], // e - 4 ones
    [0, 1, 1, 1, 0, 1, 0, 1], // u - 5 ones
    [0, 1, 1, 1, 0, 0, 1, 0], // r - 4 ones
    [0, 1, 1, 0, 0, 1, 0, 1], // e - 4 ones
    [0, 1, 1, 0, 1, 0, 1, 1], // k - 5 ones
    [0, 1, 1, 0, 0, 0, 0, 1], // a - 3 ones
  ]

  // Row labels - updated to correctly reflect the number of "1"s in each combination
  const rowLabels = [4, 5, 4, 4, 5, 3]

  // State for current switches
  const [switches, setSwitches] = useState(initialSwitches)
  // State to track correct combinations
  const [correctCombinations, setCorrectCombinations] = useState(0)
  // State to track if puzzle is solved
  const [isSolved, setIsSolved] = useState(false)

  // Function to get opacity based on correct combinations
  const getOpacity = (switchIndex: number) => {
    if (isSolved) return 1 // Full opacity when solved

    if (switchIndex < 3) return 1 // Fixed switches always have full opacity

    // Dynamic opacity based on correct combinations
    switch (correctCombinations) {
      case 0:
        return 0.5
      case 1:
        return 0.57
      case 2:
        return 0.65
      case 3:
        return 0.73
      case 4:
        return 0.81
      case 5:
        return 0.9
      case 6:
        return 1
      default:
        return 0.5
    }
  }

  // Function to toggle a switch
  const toggleSwitch = (rowIndex: number, switchIndex: number) => {
    // Don't allow changes if puzzle is solved
    if (isSolved) return

    // Don't allow toggling the first three switches
    if (switchIndex < 3) return

    // Create a copy of the switches array
    const newSwitches = [...switches]
    // Toggle the switch (0 to 1 or 1 to 0)
    newSwitches[rowIndex][switchIndex] = newSwitches[rowIndex][switchIndex] === 0 ? 1 : 0
    // Update the state
    setSwitches(newSwitches)
  }

  // Check for correct combinations whenever switches change
  useEffect(() => {
    let correctCount = 0

    // Check each row against its target combination
    for (let i = 0; i < switches.length; i++) {
      const isRowCorrect = switches[i].every((value, index) => value === targetCombinations[i][index])
      if (isRowCorrect) {
        correctCount++
      }
    }

    // Update the correct combinations count
    setCorrectCombinations(correctCount)

    // Call the callback to update the parent component
    if (onCorrectCombinationsChange) {
      onCorrectCombinationsChange(correctCount)
    }

    // Check if all combinations are correct
    if (correctCount === 6) {
      setIsSolved(true)
      if (onSolve) {
        onSolve()
      }
    }
  }, [switches, onSolve, onCorrectCombinationsChange])

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Success message */}
      {isSolved && (
        <div className="text-center">
          <p className="text-red-400 font-pixel text-sm">The machine hums, and the head screams louder.</p>
        </div>
      )}

      {/* Switch rows */}
      <div className="w-full max-w-md space-y-4 bg-black p-6 rounded-lg">
        {switches.map((row, rowIndex) => (
          <div key={rowIndex} className="flex items-center justify-between">
            <div className="flex space-x-2">
              {row.map((value, switchIndex) => (
                <button
                  key={switchIndex}
                  onClick={() => toggleSwitch(rowIndex, switchIndex)}
                  disabled={switchIndex < 3 || isSolved}
                  className={`w-12 h-16 flex items-center justify-center ${switchIndex < 3 ? "cursor-not-allowed" : "cursor-pointer"} ${isSolved ? "cursor-not-allowed" : ""}`}
                >
                  <img
                    src={
                      value === 1
                        ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/flipswitch_1-OPcpqqeE9fqJpB6LPEYFvNLvQTb5bu.webp"
                        : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/flipswitch_0-xeAaXILvQOEYhaeJo2mWMHCPkbaT3P.webp"
                    }
                    alt={value === 1 ? "Switch On" : "Switch Off"}
                    className="max-w-[75%] max-h-[75%] pixelated"
                    style={{ opacity: getOpacity(switchIndex) }}
                  />
                </button>
              ))}
            </div>
            {/* Make the row number visually distinct */}
            <div className="ml-4 text-white font-mono text-sm">
              <span>{rowLabels[rowIndex]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
