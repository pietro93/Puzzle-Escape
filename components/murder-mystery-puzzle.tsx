"use client"

import { useState } from "react"

interface MurderMysteryPuzzleProps {
  onSolve?: () => void
}

export default function MurderMysteryPuzzle({ onSolve }: MurderMysteryPuzzleProps) {
  const [solution, setSolution] = useState("")

  const handleSubmit = () => {
    if (solution.toLowerCase() === "the butler") {
      if (onSolve) {
        onSolve()
      }
    } else {
      alert("That is incorrect. Please try again.")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <p className="text-gray-300 font-mono text-sm mb-4">
        The butler did it! (This is a placeholder. Implement the actual murder mystery logic here.)
      </p>
      <input
        type="text"
        placeholder="Who is the killer?"
        value={solution}
        onChange={(e) => setSolution(e.target.value)}
        className="px-4 py-2 bg-gray-900/80 border-2 border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-600 font-mono text-center transition-all duration-300 shadow-lg mb-4"
      />
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-purple-900 hover:bg-purple-800 rounded-xl font-pixel transition-colors border-2 border-purple-700 text-purple-300 flex items-center gap-1 shadow-[0_4px_0_rgba(0,0,0,0.3)] active:shadow-none active:translate-y-1"
      >
        Submit
      </button>
    </div>
  )
}
