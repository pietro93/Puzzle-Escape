"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
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
  originalPosition: { x: number; y: number } | null
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
    { id: "num-1", value: 1, isPlaced: false, originalPosition: null },
    { id: "num-2", value: 2, isPlaced: false, originalPosition: null },
    { id: "num-3", value: 2, isPlaced: false, originalPosition: null },
    { id: "num-4", value: 3, isPlaced: false, originalPosition: null },
    { id: "num-5", value: 3, isPlaced: false, originalPosition: null },
    { id: "num-6", value: 3, isPlaced: false, originalPosition: null },
    { id: "num-7", value: 4, isPlaced: false, originalPosition: null },
    { id: "num-8", value: 4, isPlaced: false, originalPosition: null },
    { id: "num-9", value: 5, isPlaced: false, originalPosition: null },
  ])

  const [isSolved, setIsSolved] = useState(false)
  const [rowSums, setRowSums] = useState<number[]>([0, 0, 0])
  const [colSums, setColSums] = useState<number[]>([0, 0, 0])
  const [diagSums, setDiagSums] = useState<number[]>([0, 0])
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const numbersContainerRef = useRef<HTMLDivElement>(null)

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

  // Store original positions of number tokens
  useEffect(() => {
    if (numbersContainerRef.current) {
      const container = numbersContainerRef.current
      const updatedNumbers = [...numbers]

      // Wait for the DOM to be fully rendered
      setTimeout(() => {
        const numberElements = container.querySelectorAll(".number-token")
        numberElements.forEach((el, index) => {
          if (index < updatedNumbers.length) {
            const rect = el.getBoundingClientRect()
            const containerRect = container.getBoundingClientRect()
            updatedNumbers[index].originalPosition = {
              x: rect.left - containerRect.left + rect.width / 2,
              y: rect.top - containerRect.top + rect.height / 2,
            }
          }
        })
        setNumbers(updatedNumbers)
      }, 100)
    }
  }, [])

  const calculateSums = () => {
    // Calculate row sums
    const newRowSums = grid.map((row) => row.reduce((sum, cell) => sum + (cell.value || 0), 0))

    // Calculate column sums
    const newColSums = [0, 1, 2].map((colIndex) => grid.reduce((sum, row) => sum + (row[colIndex].value || 0), 0))

    // Calculate diagonal sums - FIXED CALCULATION
    // Main diagonal (top-left to bottom-right)
    const mainDiag = grid[0][0].value || 0 + (grid[1][1].value || 0) + (grid[2][2].value || 0)

    // Anti-diagonal (top-right to bottom-left)
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
    setDraggedItem(id)

    // Create a custom drag image (transparent)
    const dragImage = document.createElement("div")
    dragImage.style.opacity = "0"
    document.body.appendChild(dragImage)
    e.dataTransfer.setDragImage(dragImage, 0, 0)

    // Remove the drag image after a short delay
    setTimeout(() => {
      document.body.removeChild(dragImage)
    }, 0)
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

    // Place the new number in the cell
    newGrid[rowIndex][colIndex] = { value, id }

    // Update the grid
    setGrid(newGrid)

    // Update the number's placed status
    setNumbers((prev) => prev.map((num) => (num.id === id ? { ...num, isPlaced: true } : num)))

    playSound("button-click")
    setDraggedItem(null)
  }

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedItem(null)
    // If the drop wasn't on a valid target, we don't need to do anything
    // The number will stay in its original position
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="relative w-full max-w-md">
        {/* Available numbers */}
        <div ref={numbersContainerRef} className="flex flex-wrap justify-center gap-4 mb-8">
          {numbers.map(
            (num) =>
              !num.isPlaced && (
                <motion.div
                  key={num.id}
                  className={`number-token w-12 h-12 rounded-full bg-[#f5f5dc] flex items-center justify-center text-black text-2xl font-bold cursor-grab ${draggedItem === num.id ? "opacity-50" : "opacity-100"}`}
                  draggable={!isSolved}
                  onDragStart={(e) => handleDragStart(e, num.id, num.value)}
                  onDragEnd={handleDragEnd}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {num.value}
                </motion.div>
              ),
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-2 relative">
          {grid.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className="flex flex-col">
              {row.map((cell, colIndex) => (
                <div
                  key={`cell-${rowIndex}-${colIndex}`}
                  className="w-24 h-24 flex items-center justify-center bg-[#f5f5dc] border-2 border-gray-400"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
                >
                  {cell.value !== null && (
                    <motion.div
                      className="w-12 h-12 rounded-full bg-[#f5f5dc] flex items-center justify-center text-black text-2xl font-bold cursor-grab shadow-md"
                      draggable={!isSolved}
                      onDragStart={(e) => handleDragStart(e, cell.id!, cell.value!)}
                      onDragEnd={handleDragEnd}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      {cell.value}
                    </motion.div>
                  )}
                </div>
              ))}
              {/* Row sum */}
              <div className="flex items-center h-24 pl-2">
                <span className="text-2xl font-pixel text-gray-400">{rowSums[rowIndex]}</span>
                <span className="text-2xl font-pixel text-gray-600 ml-1">—</span>
              </div>
            </div>
          ))}

          {/* Column sums */}
          <div className="absolute -bottom-12 flex w-full">
            {colSums.map((sum, index) => (
              <div key={`col-sum-${index}`} className="w-24 flex justify-center items-center">
                <span className="text-2xl font-pixel text-gray-400">{sum}</span>
              </div>
            ))}
          </div>

          {/* Diagonal sums */}
          <div className="absolute -bottom-12 -left-12">
            <span className="text-2xl font-pixel text-gray-400">{diagSums[0]}</span>
          </div>
          <div className="absolute -bottom-12 -right-12">
            <span className="text-2xl font-pixel text-gray-400">{diagSums[1]}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
