"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

const letters = ["S", "H", "A", "C", "K", "L", "E", "S"]
const gridSize = 3 // 3x3 grid
const totalTiles = gridSize * gridSize

export default function BoneTileMazePuzzle({ onSolve }: { onSolve: () => void }) {
  const [grid, setGrid] = useState<string[]>([])
  const [selected, setSelected] = useState<number[]>([])
  const [isSolved, setIsSolved] = useState(false)

  // Initialize grid with shuffled letters
  useEffect(() => {
    const shuffled = [...letters].sort(() => Math.random() - 0.5)
    // Add empty tile to make 9
    shuffled.push("")
    setGrid(shuffled)
  }, [])

  const isAdjacent = (i1: number, i2: number) => {
    const row1 = Math.floor(i1 / gridSize)
    const col1 = i1 % gridSize
    const row2 = Math.floor(i2 / gridSize)
    const col2 = i2 % gridSize
    return (Math.abs(row1 - row2) === 1 && col1 === col2) ||
           (Math.abs(col1 - col2) === 1 && row1 === row2)
  }

  const handleTileClick = (index: number) => {
    if (isSolved) return
    if (selected.includes(index)) {
      setSelected(selected.filter(i => i !== index))
    } else if (selected.length === 0) {
      setSelected([index])
    } else if (selected.length === 1 && isAdjacent(selected[0], index)) {
      // Swap the two adjacent tiles
      const [i1, i2] = [selected[0], index]
      const newGrid = [...grid]
      ;[newGrid[i1], newGrid[i2]] = [newGrid[i2], newGrid[i1]]
      setGrid(newGrid)
      setSelected([])
    } else {
      // Replace selection
      setSelected([index])
    }
  }

  // Check for solution: if the first 8 tiles match "SHACKLES" and last is empty
  useEffect(() => {
    if (grid.length < totalTiles) return

    const firstEight = grid.slice(0, 8).join("")
    const last = grid[8]
    if (firstEight === "SHACKLES" && last === "") {
      setIsSolved(true)
      onSolve()
    }
  }, [grid, onSolve])

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="text-center">
        <p className="text-lg font-pixel text-purple-300 mb-4">Arrange the bone tiles in the correct order</p>
      </div>
      <div className={`grid grid-cols-${gridSize} gap-2`}>
        {grid.map((letter, index) => (
          <div
            key={index}
            className={`w-16 h-16 border-2 flex items-center justify-center cursor-pointer transition-all ${
              selected.includes(index)
                ? "border-blue-500 bg-blue-100"
                : isSolved
                ? "border-green-500 bg-green-100"
                : "border-gray-700 bg-amber-50 hover:border-gray-500"
            }`}
            onClick={() => handleTileClick(index)}
          >
            {letter && (
              <div className="text-2xl font-bold text-gray-800">
                {letter}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="text-sm text-gray-400">
        Click tiles to select, then click an adjacent tile to swap them.
      </div>
    </div>
  )
}
