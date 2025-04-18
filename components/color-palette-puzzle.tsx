"use client"

import { useState } from "react"

interface ColorPalettePuzzleProps {
  onSolve: () => void
}

export default function ColorPalettePuzzle({ onSolve }: ColorPalettePuzzleProps) {
  const [green, setGreen] = useState("")
  const [blue, setBlue] = useState("")
  const [yellow, setYellow] = useState("")
  const [pink, setPink] = useState("")

  const checkAnswers = () => {
    const correctGreen = -20.6872
    const correctBlue = -20
    const correctYellow = -0.6872
    const correctPink = 117.1857

    const isGreenCorrect = Math.abs(correctGreen - Number(green)) < 0.001
    const isBlueCorrect = Math.abs(correctBlue - Number(blue)) < 0.001
    const isYellowCorrect = Math.abs(correctYellow - Number(yellow)) < 0.001
    const isPinkCorrect = Math.abs(correctPink - Number(pink)) < 0.001

    if (isGreenCorrect && isBlueCorrect && isYellowCorrect && isPinkCorrect) {
      onSolve()
    } else {
      alert("Incorrect answers. Please try again.")
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">Vert:</label>
          <input
            type="number"
            value={green}
            onChange={(e) => setGreen(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-gray-900 text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Rose:</label>
          <input
            type="number"
            value={pink}
            onChange={(e) => setPink(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-gray-900 text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Bleu:</label>
          <input
            type="number"
            value={blue}
            onChange={(e) => setBlue(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-gray-900 text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Jaune:</label>
          <input
            type="number"
            value={yellow}
            onChange={(e) => setYellow(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-gray-900 text-white"
          />
        </div>
      </div>
      <button
        onClick={checkAnswers}
        className="px-4 py-2 bg-purple-900 hover:bg-purple-800 rounded-xl font-pixel transition-colors border-2 border-purple-700 text-purple-300 flex items-center justify-center gap-2 shadow-[0_4px_0_rgba(0,0,0,0.3)] hover:shadow-[0_2px_0_rgba(0,0,0,0.3)] hover:translate-y-[2px] active:translate-y-[4px] active:shadow-none"
      >
        Check Answers
      </button>
    </div>
  )
}
