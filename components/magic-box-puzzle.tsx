"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAudio } from "@/hooks/use-audio"

interface MagicBoxPuzzleProps {
  onSolve?: () => void
}

interface GridCell {
  value: number | null
  id: string | null
}

interface DraggableNumber {
  id: string
  value: number
  isPlaced: boolean
}

export default function MagicBoxPuzzle({ onSolve }: MagicBoxPuzzleProps) {
  const { playSound } = useAudio()
  const [grid, setGrid] = useState<GridCell[][]>(
    Array(3)
      .fill(null)
      .map(() =>
        Array(3)
          .fill(null)
          .map(() => ({ value: null, id: null })),
      ),
  )

  const [numbers, setNumbers] = useState<DraggableNumber[]>([
    { id: "num-1", value: 1, isPlaced: false },
    { id: "num-2", value: 2, isPlaced: false },
    { id: "num-3", value: 2, isPlaced: false },
    { id: "num-4", value: 3, isPlaced: false },
    { id: "num-5", value: 3, isPlaced: false },
    { id: "num-6", value: 3, isPlaced: false },
    { id: "num-7", value: 4, isPlaced: false },
    { id: "num-8", value: 4, isPlaced: false },
    { id: "num-9", value: 5, isPlaced: false },
  ])

  const [isSolved, setIsSolved] = useState(false)
  const [rowSums, setRowSums] = useState<number[]>([0, 0, 0])
  const [colSums, setColSums] = useState<number[]>([0, 0, 0])
  const [diagSums, setDiagSums] = useState<number[]>([0, 0])

  // Shuffle the numbers initially
  useEffect(() => {
    const shuffled = [...numbers].sort(() => Math.random() - 0.5)
    setNumbers(shuffled)
  }, [])

  // Calculate sums whenever the grid changes
  useEffect(() => {
    calculateSums()
    checkSolution()
  }, [grid])

  const calculateSums = () => {
    // Calculate row sums
    const newRowSums = grid.map((row) => row.reduce((sum, cell) => sum + (cell.value || 0), 0))

    // Calculate column sums
    const newColSums = [0, 1, 2].map((colIndex) => grid.reduce((sum, row) => sum + (row[colIndex].value || 0), 0))

    // Calculate diagonal sums - FIXED CALCULATION
    // Main diagonal (top-left to bottom-right): A + E + I
    const mainDiag = (grid[0][0].value || 0) + (grid[1][1].value || 0) + (grid[2][2].value || 0)

    // Anti-diagonal (top-right to bottom-left): C + E + G
    const antiDiag = (grid[0][2].value || 0) + (grid[1][1].value || 0) + (grid[2][0].value || 0)

    setRowSums(newRowSums)
    setColSums(newColSums)
    setDiagSums([mainDiag, antiDiag])
  }

  const checkSolution = () => {
    // Check if all cells are filled
    const allFilled = grid.every((row) => row.every((cell) => cell.value !== null))
    if (!allFilled) return

    // Get all sums (rows, columns, diagonals)
    const allSums = [...rowSums, ...colSums, ...diagSums]

    // Check if all sums are equal and not zero
    const firstSum = allSums[0]
    const allEqual = allSums.every((sum) => sum === firstSum && sum !== 0)

    if (allEqual) {
      setIsSolved(true)
      playSound("correct")
      if (onSolve) onSolve()
    }
  }

  const handleDragStart = (e: React.DragEvent, id: string, value: number) => {
    if (isSolved) return
    e.dataTransfer.setData("id", id)
    e.dataTransfer.setData("value", value.toString())
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, rowIndex: number, colIndex: number) => {
    e.preventDefault()
    if (isSolved) return

    const id = e.dataTransfer.getData("id")
    const value = Number.parseInt(e.dataTransfer.getData("value"))

    // Create a copy of the grid
    const newGrid = [...grid.map((row) => [...row])]

    // If there's already a number in this cell, return it to available numbers
    if (newGrid[rowIndex][colIndex].id) {
      const existingId = newGrid[rowIndex][colIndex].id
      setNumbers((prev) => prev.map((num) => (num.id === existingId ? { ...num, isPlaced: false } : num)))
    }

    // Check if the number is already in the grid and remove it
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (newGrid[r][c].id === id) {
          newGrid[r][c] = { value: null, id: null }
        }
      }
    }

    // Place the new number in the cell
    newGrid[rowIndex][colIndex] = { value, id }

    // Update the grid
    setGrid(newGrid)

    // Update the number's placed status
    setNumbers((prev) => prev.map((num) => (num.id === id ? { ...num, isPlaced: true } : num)))

    playSound("button-click")
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Available numbers */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {numbers.map(
          (num) =>
            !num.isPlaced && (
              <div
                key={num.id}
                className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-black text-xl font-bold cursor-grab shadow-md"
                draggable={!isSolved}
                onDragStart={(e) => handleDragStart(e, num.id, num.value)}
              >
                {num.value}
              </div>
            ),
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`cell-${rowIndex}-${colIndex}`}
              className="w-16 h-16 flex items-center justify-center bg-amber-50 border border-gray-400"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
            >
              {cell.value !== null && (
                <div
                  className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-black text-xl font-bold cursor-grab shadow-md"
                  draggable={!isSolved}
                  onDragStart={(e) => handleDragStart(e, cell.id!, cell.value!)}
                >
                  {cell.value}
                </div>
              )}
            </div>
          )),
        )}
      </div>

      {/* Sums display */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="text-lg font-pixel text-amber-200">{rowSums[0]}</div>
        <div className="text-lg font-pixel text-amber-200">{rowSums[1]}</div>
        <div className="text-lg font-pixel text-amber-200">{rowSums[2]}</div>
        <div className="text-lg font-pixel text-amber-200">{colSums[0]}</div>
        <div className="text-lg font-pixel text-amber-200">{colSums[1]}</div>
        <div className="text-lg font-pixel text-amber-200">{colSums[2]}</div>
        <div className="text-lg font-pixel text-amber-200">{diagSums[0]}</div>
        <div className="col-start-3 text-lg font-pixel text-amber-200">{diagSums[1]}</div>
      </div>
    </div>
  )
}
