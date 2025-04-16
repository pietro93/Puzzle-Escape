"use client"

import { useState } from "react"
import BinarySwitchPuzzle from "./binary-switch-puzzle"

interface BinarySwitchesPuzzleProps {
  onSolve?: () => void
  onCorrectCombinationsChange?: (count: number) => void
}

export default function BinarySwitchesPuzzle({ onSolve, onCorrectCombinationsChange }: BinarySwitchesPuzzleProps) {
  const [isSolved, setIsSolved] = useState(false)

  const handleSolve = () => {
    setIsSolved(true)
    if (onSolve) {
      onSolve()
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <BinarySwitchPuzzle onSolve={handleSolve} onCorrectCombinationsChange={onCorrectCombinationsChange} />
    </div>
  )
}
