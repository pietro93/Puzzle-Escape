"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

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
  // Create a 3x3 grid with null values
  const [grid, setGrid] = useState<GridCell[][]>(
    Array(3)
      .fill(null)
      .map(() =>
        Array(3)
          .fill(null)
          .map(() => ({ value: null, id: null })),
      ),
  )

  // Available numbers to drag
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

  // Track if the puzzle is solved
  const [isSolved, setIsSolved] = useState(false)

  // Track row, column, and diagonal sums
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

  // Calculate all sums
  const calculateSums = () => {
    // Calculate row sums
    const newRowSums = grid.map((row) => row.reduce((sum, cell) => sum + (cell.value || 0), 0))

    // Calculate column sums
    const newColSums = [0, 1, 2].map((colIndex) => grid.reduce((sum, row) => sum + (row[colIndex].value || 0), 0))

    // Calculate diagonal sums
    const mainDiag = grid.reduce((sum, row, i) => sum + (grid[i][i].value || 0), 0)
    const antiDiag = grid.reduce((sum, row, i) => sum + (grid[i][2 - i].value || 0), 0)

    setRowSums(newRowSums)
    setColSums(newColSums)
    setDiagSums([mainDiag, antiDiag])
  }

  // Check if the puzzle is solved
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
      if (onSolve) onSolve()
    }
  }

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, id: string, value: number) => {
    e.dataTransfer.setData("id", id)
    e.dataTransfer.setData("value", value.toString())
  }

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  // Handle drop on a cell
  const handleDrop = (e: React.DragEvent, rowIndex: number, colIndex: number) => {
    e.preventDefault()
    if (isSolved) return // Prevent drops if puzzle is solved

    const id = e.dataTransfer.getData("id")
    const value = Number.parseInt(e.dataTransfer.getData("value"))

    // Create a copy of the grid
    const newGrid = [...grid.map((row) => [...row])]

    // If there's already a number in this cell, return it to available numbers
    if (newGrid[rowIndex][colIndex].id) {
      const existingId = newGrid[rowIndex][colIndex].id
      setNumbers((prev) => prev.map((num) => (num.id === existingId ? { ...num, isPlaced: false } : num)))
    }

    // Place the new number in the cell
    newGrid[rowIndex][colIndex] = { value, id }

    // Update the grid
    setGrid(newGrid)

    // Update the number's placed status
    setNumbers((prev) => prev.map((num) => (num.id === id ? { ...num, isPlaced: true } : num)))
  }

  // Handle removing a number from the grid
  const handleRemoveFromGrid = (e: React.DragEvent, rowIndex: number, colIndex: number) => {
    e.preventDefault()
    if (isSolved) return // Prevent changes if puzzle is solved

    const id = grid[rowIndex][colIndex].id
    if (!id) return

    // Create a copy of the grid
    const newGrid = [...grid.map((row) => [...row])]

    // Remove the number from the cell
    newGrid[rowIndex][colIndex] = { value: null, id: null }

    // Update the grid
    setGrid(newGrid)

    // Update the number's placed status
    setNumbers((prev) => prev.map((num) => (num.id === id ? { ...num, isPlaced: false } : num)))
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto">
      <h2 className="text-xl font-pixel text-purple-300 mb-2 text-center">
        Arrange the numbers to create a magic square.
      </h2>

      <p className="text-sm font-pixel text-gray-400 mb-6 text-center">
        Drag and drop the numbers into the grid. Make all rows, columns, and diagonals sum to the same value.
      </p>

      {/* Available numbers */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {numbers.map(
          (num) =>
            !num.isPlaced && (
              <motion.div
                key={num.id}
                className="text-2xl font-pixel text-white cursor-grab"
                draggable
                onDragStart={(e) => handleDragStart(e, num.id, num.value)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {num.value}
              </motion.div>
            ),
        )}
      </div>

      {/* Grid */}
      <div className="relative">
        <div className="grid grid-cols-3 gap-1">
          {grid.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className="flex flex-col">
              {row.map((cell, colIndex) => (
                <div
                  key={`cell-${rowIndex}-${colIndex}`}
                  className={`w-24 h-24 flex items-center justify-center border border-gray-400 ${
                    isSolved ? "border-green-500" : ""
                  }`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
                >
                  {cell.value !== null && (
                    <motion.div
                      className="text-2xl font-pixel text-white cursor-grab"
                      draggable={!isSolved}
                      onDragStart={(e) => {
                        if (isSolved) return
                        handleDragStart(e, cell.id!, cell.value!)
                        handleRemoveFromGrid(e, rowIndex, colIndex)
                      }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      {cell.value}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Row sums */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-around">
          {rowSums.map((sum, index) => (
            <div key={`row-sum-${index}`} className="h-24 flex items-center -ml-8">
              <span className="text-lg font-pixel text-gray-400">{sum}</span>
              <span className="text-lg font-pixel text-gray-600 ml-1">—</span>
            </div>
          ))}
        </div>

        {/* Column sums */}
        <div className="absolute bottom-0 left-0 w-full flex justify-around">
          {colSums.map((sum, index) => (
            <div key={`col-sum-${index}`} className="flex flex-col items-center -mb-8">
              <span className="text-lg font-pixel text-gray-600">|</span>
              <span className="text-lg font-pixel text-gray-400">{sum}</span>
            </div>
          ))}
        </div>

        {/* Diagonal sums */}
        <div className="absolute -bottom-8 -left-8">
          <span className="text-lg font-pixel text-gray-400">{diagSums[0]}</span>
        </div>
        <div className="absolute -bottom-8 -right-8">
          <span className="text-lg font-pixel text-gray-400">{diagSums[1]}</span>
        </div>
      </div>

      <div className="mt-12 text-sm font-pixel text-gray-400 text-center max-w-xs">
        Drag and drop the numbers into the grid. Make all rows, columns, and diagonals sum to the same value.
      </div>
    </div>
  )
}
