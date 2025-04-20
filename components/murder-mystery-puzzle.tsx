"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface MurderMysteryPuzzleProps {
  onSolve: () => void
}

export default function MurderMysteryPuzzle({ onSolve }: MurderMysteryPuzzleProps) {
  const [solution, setSolution] = useState("")

  useEffect(() => {
    // Placeholder logic for solving the puzzle
    // Replace this with actual game logic
    if (solution === "the butler") {
      onSolve()
    }
  }, [solution, onSolve])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSolution(e.target.value)
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <p className="text-white font-pixel mb-4">Who is the killer?</p>
      <input
        type="text"
        value={solution}
        onChange={handleChange}
        placeholder="Enter your guess"
        className="bg-gray-800 text-white rounded-md p-2 mb-4"
      />
    </div>
  )
}
