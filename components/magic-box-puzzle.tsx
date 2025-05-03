"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface MagicBoxPuzzleProps {
  onSolve: () => void
}

export default function MagicBoxPuzzle({ onSolve }: MagicBoxPuzzleProps) {
  // Available numbers to place on the grid
  const availableNumbers = [1, 2, 2, 3, 3, 3, 4, 4, 5]

  // State for tracking which numbers are placed on the grid
  const [grid, setGrid] = useState<Array<number | null>>([null, null, null, null, null, null, null, null, null])

  // State for tracking which numbers are still available (not placed on grid)
  const [remainingNumbers, setRemainingNumbers] = useState<Array<{ id: number; value: number }>>([])

  // State for tracking if the puzzle is solved
  const [isSolved, setIsSolved] = useState(false)

  // Ref for the grid element
  const gridRef = useRef<HTMLDivElement>(null)

  // Initialize the remaining numbers with unique IDs
  useEffect(() => {
    const shuffled = [...availableNumbers].sort(() => Math.random() - 0.5).map((value, index) => ({ id: index, value }))
    setRemainingNumbers(shuffled)
  }, [])

  // Calculate sums for rows, columns, and diagonals
  const calculateSums = () => {
    const sums = {
      rows: [
        [0, 1, 2], // First row
        [3, 4, 5], // Second row
        [6, 7, 8], // Third row
      ].map((indices) => indices.reduce((sum, index) => sum + (grid[index] || 0), 0)),

      columns: [
        [0, 3, 6], // First column
        [1, 4, 7], // Second column
        [2, 5, 8], // Third column
      ].map((indices) => indices.reduce((sum, index) => sum + (grid[index] || 0), 0)),

      diagonals: [
        [0, 4, 8], // Top-left to bottom-right
        [2, 4, 6], // Top-right to bottom-left
      ].map((indices) => indices.reduce((sum, index) => sum + (grid[index] || 0), 0)),
    }

    return sums
  }

  // Check if the puzzle is solved (all sums are equal and not zero)
  const checkSolution = () => {
    const { rows, columns, diagonals } = calculateSums()
    const allSums = [...rows, ...columns, ...diagonals]
    const firstNonZeroSum = allSums.find((sum) => sum !== 0)

    if (!firstNonZeroSum) return false

    const isSolved = allSums.every((sum) => sum === firstNonZeroSum || sum === 0)
    const isGridFull = grid.every((cell) => cell !== null)

    return isSolved && isGridFull
  }

  // Handle drag start for a number
  const handleDragStart = (e: React.DragEvent, id: number, value: number, fromGrid: boolean, gridIndex?: number) => {
    e.dataTransfer.setData("id", id.toString())
    e.dataTransfer.setData("value", value.toString())
    e.dataTransfer.setData("fromGrid", fromGrid.toString())
    if (gridIndex !== undefined) {
      e.dataTransfer.setData("gridIndex", gridIndex.toString())
    }
  }

  // Handle drag over for a grid cell
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  // Handle drop for a grid cell
  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault()

    if (isSolved) return

    const id = Number.parseInt(e.dataTransfer.getData("id"))
    const value = Number.parseInt(e.dataTransfer.getData("value"))
    const fromGrid = e.dataTransfer.getData("fromGrid") === "true"
    const oldGridIndex = fromGrid ? Number.parseInt(e.dataTransfer.getData("gridIndex")) : -1

    // If the cell already has a number, don't allow the drop
    if (grid[index] !== null) return

    // Update the grid
    const newGrid = [...grid]

    // If the number is coming from another grid cell, clear that cell
    if (fromGrid) {
      newGrid[oldGridIndex] = null
    }

    // Place the number in the new cell
    newGrid[index] = value

    // Update the remaining numbers
    let newRemainingNumbers = [...remainingNumbers]

    if (fromGrid) {
      // If moving within the grid, no need to update remaining numbers
    } else {
      // Remove the number from remaining numbers
      newRemainingNumbers = newRemainingNumbers.filter((num) => num.id !== id)
    }

    setGrid(newGrid)
    setRemainingNumbers(newRemainingNumbers)

    // Check if the puzzle is solved
    setTimeout(() => {
      const solved = checkSolution()
      if (solved) {
        setIsSolved(true)
        onSolve()
      }
    }, 100)
  }

  // Handle drop outside the grid (return to available numbers)
  const handleDropOutside = (e: React.DragEvent) => {
    e.preventDefault()

    if (isSolved) return

    const fromGrid = e.dataTransfer.getData("fromGrid") === "true"

    if (fromGrid) {
      const value = Number.parseInt(e.dataTransfer.getData("value"))
      const gridIndex = Number.parseInt(e.dataTransfer.getData("gridIndex"))

      // Remove the number from the grid
      const newGrid = [...grid]
      newGrid[gridIndex] = null
      setGrid(newGrid)

      // Add the number back to remaining numbers
      setRemainingNumbers([...remainingNumbers, { id: Date.now(), value }])
    }
  }

  // Calculate the sums
  const sums = calculateSums()

  return (
    <div className="flex flex-col items-center justify-center p-4 relative">
      <h2 className="text-2xl font-pixel text-purple-300 mb-6">Balance the Magic Box</h2>

      {/* Numbers storage area */}
      <div
        className="flex flex-wrap justify-center gap-4 mb-10 p-4 bg-gray-800 bg-opacity-40 rounded-lg min-h-[80px] w-[350px]"
        onDragOver={handleDragOver}
        onDrop={handleDropOutside}
      >
        {remainingNumbers.map(({ id, value }) => (
          <motion.div
            key={id}
            className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-black font-bold text-2xl cursor-grab"
            draggable={!isSolved}
            onDragStart={(e) => handleDragStart(e, id, value, false)}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {value}
          </motion.div>
        ))}
      </div>

      {/* Grid container with sums */}
      <div className="relative mt-4">
        {/* Row sums - left side */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-around -translate-x-10">
          {sums.rows.map((sum, index) => (
            <div key={`row-left-${index}`} className="flex items-center">
              <div className="font-pixel text-gray-400 text-xl">{sum}</div>
            </div>
          ))}
        </div>

        {/* Row sums - right side */}
        <div className="absolute right-0 top-0 h-full flex flex-col justify-around translate-x-10">
          {sums.rows.map((sum, index) => (
            <div key={`row-right-${index}`} className="flex items-center">
              <div className="font-pixel text-gray-400 text-xl">{sum}</div>
            </div>
          ))}
        </div>

        {/* Column sums - top */}
        <div className="absolute top-0 left-0 w-full flex justify-around -translate-y-10">
          {sums.columns.map((sum, index) => (
            <div key={`col-top-${index}`} className="flex flex-col items-center">
              <div className="font-pixel text-gray-400 text-xl">{sum}</div>
            </div>
          ))}
        </div>

        {/* Column sums - bottom */}
        <div className="absolute bottom-0 left-0 w-full flex justify-around translate-y-10">
          {sums.columns.map((sum, index) => (
            <div key={`col-bottom-${index}`} className="flex flex-col items-center">
              <div className="font-pixel text-gray-400 text-xl">{sum}</div>
            </div>
          ))}
        </div>

        {/* Diagonal sums - top left and bottom right */}
        <div className="absolute top-0 left-0 -translate-x-10 -translate-y-10">
          <div className="font-pixel text-gray-400 text-xl">{sums.diagonals[0]}</div>
        </div>
        <div className="absolute bottom-0 right-0 translate-x-10 translate-y-10">
          <div className="font-pixel text-gray-400 text-xl">{sums.diagonals[0]}</div>
        </div>

        {/* Diagonal sums - top right and bottom left */}
        <div className="absolute top-0 right-0 translate-x-10 -translate-y-10">
          <div className="font-pixel text-gray-400 text-xl">{sums.diagonals[1]}</div>
        </div>
        <div className="absolute bottom-0 left-0 -translate-x-10 translate-y-10">
          <div className="font-pixel text-gray-400 text-xl">{sums.diagonals[1]}</div>
        </div>

        {/* Grid */}
        <div ref={gridRef} className="grid grid-cols-3 gap-2">
          {grid.map((value, index) => (
            <div
              key={index}
              className={`w-24 h-24 bg-amber-50 border-2 ${isSolved ? "border-green-500" : "border-gray-700"} flex items-center justify-center`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
            >
              {value !== null && (
                <motion.div
                  className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-black font-bold text-2xl cursor-grab"
                  draggable={!isSolved}
                  onDragStart={(e) => handleDragStart(e, Date.now(), value, true, index)}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {value}
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Success message */}
      {isSolved && (
        <div className="mt-16 text-green-400 font-pixel text-center text-xl">Perfect! The magic box is balanced.</div>
      )}
    </div>
  )
}
