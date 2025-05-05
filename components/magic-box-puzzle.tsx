"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

interface MagicBoxPuzzleProps {
  onSolve: () => void
}

export default function MagicBoxPuzzle({ onSolve }: MagicBoxPuzzleProps) {
  // Available numbers to place on the grid
  const availableNumbers = [1, 2, 2, 3, 3, 3, 4, 4, 5]

  // State for tracking which numbers are placed on the grid
  const [grid, setGrid] = useState<Array<number | null>>([null, null, null, null, null, null, null, null, null])

  // State for tracking which numbers are still available (not placed on grid)
  const [remainingNumbers, setRemainingNumbers] = useState<Array<{ id: number; value: number; imageIndex: number }>>([])

  // State for tracking if the puzzle is solved
  const [isSolved, setIsSolved] = useState(false)

  // State for tracking which cells have been flipped
  const [flippedCells, setFlippedCells] = useState<number[]>([])

  // Ref for the grid element
  const gridRef = useRef<HTMLDivElement>(null)

  // Initialize the remaining numbers with unique IDs and image indices
  useEffect(() => {
    // Create a mapping for the two 2s and two 4s to have different image indices
    let twoCount = 0
    let fourCount = 0

    const shuffled = [...availableNumbers]
      .sort(() => Math.random() - 0.5)
      .map((value, index) => {
        let imageIndex = 0

        if (value === 2) {
          imageIndex = twoCount === 0 ? 0 : 1 // 0 for first 2, 1 for second 2
          twoCount++
        } else if (value === 4) {
          imageIndex = fourCount === 0 ? 0 : 1 // 0 for first 4, 1 for second 4
          fourCount++
        }

        return { id: index, value, imageIndex }
      })

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

  // Get the image path for a number value and image index
  const getImagePath = (value: number, imageIndex = 0) => {
    if (value === 1) return "/images/magicbox-1.webp"
    if (value === 2) return imageIndex === 0 ? "/images/magicbox-2.webp" : "/images/magicbox-2-2.webp"
    if (value === 3) return "/images/magicbox-3.webp"
    if (value === 4) return imageIndex === 0 ? "/images/magicbox-4.webp" : "/images/magicbox-4-2.webp"
    if (value === 5) return "/images/magicbox-5.webp"
    return ""
  }

  // Handle drag start for a number
  const handleDragStart = (
    e: React.DragEvent,
    id: number,
    value: number,
    imageIndex: number,
    fromGrid: boolean,
    gridIndex?: number,
  ) => {
    e.dataTransfer.setData("id", id.toString())
    e.dataTransfer.setData("value", value.toString())
    e.dataTransfer.setData("imageIndex", imageIndex.toString())
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
    const imageIndex = Number.parseInt(e.dataTransfer.getData("imageIndex"))
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
  }

  // Handle drop outside the grid (return to available numbers)
  const handleDropOutside = (e: React.DragEvent) => {
    e.preventDefault()

    if (isSolved) return

    const fromGrid = e.dataTransfer.getData("fromGrid") === "true"

    if (fromGrid) {
      const value = Number.parseInt(e.dataTransfer.getData("value"))
      const imageIndex = Number.parseInt(e.dataTransfer.getData("imageIndex"))
      const gridIndex = Number.parseInt(e.dataTransfer.getData("gridIndex"))

      // Remove the number from the grid
      const newGrid = [...grid]
      newGrid[gridIndex] = null
      setGrid(newGrid)

      // Add the number back to remaining numbers
      setRemainingNumbers([...remainingNumbers, { id: Date.now(), value, imageIndex }])
    }
  }

  // Get the image for a flipped cell
  const getImageForPosition = (index: number) => {
    const position = flippedCells.indexOf(index)
    if (position === 0) return "/images/magicbox-blood.webp"
    if (position === 1) return "/images/magicbox-shot.webp"
    if (position === 2) return "/images/magicbox-ice.webp"
    return ""
  }

  // Calculate the sums
  const sums = calculateSums()

  // Find the image index for a grid position
  const findImageIndexForGridPosition = (index: number) => {
    const value = grid[index]
    if (value === null) return 0

    // For values 1, 3, and 5, there's only one image
    if (value === 1 || value === 3 || value === 5) return 0

    // For values 2 and 4, we need to determine which instance it is
    if (value === 2) {
      // Count how many 2s are before this position
      const twosBefore = grid.slice(0, index).filter((v) => v === 2).length
      return twosBefore === 0 ? 0 : 1
    }

    if (value === 4) {
      // Count how many 4s are before this position
      const foursBefore = grid.slice(0, index).filter((v) => v === 4).length
      return foursBefore === 0 ? 0 : 1
    }

    return 0
  }

  // Check for solution and three 3s whenever the grid changes
  useEffect(() => {
    // Only check if all cells are filled
    if (grid.some((cell) => cell === null)) return

    // Check if all rows, columns, and diagonals sum to 9
    const { rows, columns, diagonals } = calculateSums()
    const allSums = [...rows, ...columns, ...diagonals]
    const isMagicSquare = allSums.every((sum) => sum === 0 || sum === 9)

    if (!isMagicSquare) return

    // Check for three 3s in a row, column, or diagonal
    const lines = [
      [0, 1, 2], // First row
      [3, 4, 5], // Second row
      [6, 7, 8], // Third row
      [0, 3, 6], // First column
      [1, 4, 7], // Second column
      [2, 5, 8], // Third column
      [0, 4, 8], // Top-left to bottom-right diagonal
      [2, 4, 6], // Top-right to bottom-left diagonal
    ]

    for (const line of lines) {
      if (line.every((index) => grid[index] === 3)) {
        // Found three 3s in a line
        setIsSolved(true)
        onSolve()

        // Flip cells one by one
        setTimeout(() => {
          setFlippedCells([line[0]])

          setTimeout(() => {
            setFlippedCells([line[0], line[1]])

            setTimeout(() => {
              setFlippedCells([line[0], line[1], line[2]])
            }, 500)
          }, 500)
        }, 500)

        return
      }
    }

    // Special case: check for middle row specifically (indices 3, 4, 5)
    if (grid[3] === 3 && grid[4] === 3 && grid[5] === 3) {
      setIsSolved(true)
      onSolve()

      // Flip cells one by one
      setTimeout(() => {
        setFlippedCells([3])

        setTimeout(() => {
          setFlippedCells([3, 4])

          setTimeout(() => {
            setFlippedCells([3, 4, 5])
          }, 500)
        }, 500)
      }, 500)
    }
  }, [grid, onSolve])

  return (
    <div className="flex flex-col items-center justify-center p-4 relative">
      <h2 className="text-2xl font-pixel text-purple-300 mb-6">Balance the Magic Box</h2>

      {/* Numbers storage area */}
      <div
        className="flex flex-wrap justify-center gap-4 mb-10 p-4 bg-gray-800 bg-opacity-40 rounded-lg min-h-[80px] w-[350px]"
        onDragOver={handleDragOver}
        onDrop={handleDropOutside}
      >
        {remainingNumbers.map(({ id, value, imageIndex }) => (
          <motion.div
            key={id}
            className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center cursor-grab overflow-hidden"
            draggable={!isSolved}
            onDragStart={(e) => handleDragStart(e, id, value, imageIndex, false)}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Image
              src={getImagePath(value, imageIndex) || "/placeholder.svg"}
              alt={`${value}`}
              width={40}
              height={40}
              className="object-contain"
              priority
            />
          </motion.div>
        ))}
      </div>

      {/* Grid container with sums */}
      <div className="relative mt-4">
        {/* Row sums - left side */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-around -translate-x-6">
          {sums.rows.map((sum, index) => (
            <div key={`row-left-${index}`} className="flex items-center">
              <div className="font-pixel text-gray-400 text-xl">{sum}</div>
            </div>
          ))}
        </div>

        {/* Row sums - right side */}
        <div className="absolute right-0 top-0 h-full flex flex-col justify-around translate-x-6">
          {sums.rows.map((sum, index) => (
            <div key={`row-right-${index}`} className="flex items-center">
              <div className="font-pixel text-gray-400 text-xl">{sum}</div>
            </div>
          ))}
        </div>

        {/* Column sums - top */}
        <div className="absolute top-0 left-0 w-full flex justify-around -translate-y-6">
          {sums.columns.map((sum, index) => (
            <div key={`col-top-${index}`} className="flex flex-col items-center">
              <div className="font-pixel text-gray-400 text-xl">{sum}</div>
            </div>
          ))}
        </div>

        {/* Column sums - bottom */}
        <div className="absolute bottom-0 left-0 w-full flex justify-around translate-y-6">
          {sums.columns.map((sum, index) => (
            <div key={`col-bottom-${index}`} className="flex flex-col items-center">
              <div className="font-pixel text-gray-400 text-xl">{sum}</div>
            </div>
          ))}
        </div>

        {/* Diagonal sums - top left and bottom right */}
        <div className="absolute top-0 left-0 -translate-x-6 -translate-y-6">
          <div className="font-pixel text-gray-400 text-xl">{sums.diagonals[0]}</div>
        </div>
        <div className="absolute bottom-0 right-0 translate-x-6 translate-y-6">
          <div className="font-pixel text-gray-400 text-xl">{sums.diagonals[0]}</div>
        </div>

        {/* Diagonal sums - top right and bottom left */}
        <div className="absolute top-0 right-0 translate-x-6 -translate-y-6">
          <div className="font-pixel text-gray-400 text-xl">{sums.diagonals[1]}</div>
        </div>
        <div className="absolute bottom-0 left-0 -translate-x-6 translate-y-6">
          <div className="font-pixel text-gray-400 text-xl">{sums.diagonals[1]}</div>
        </div>

        {/* Grid */}
        <div ref={gridRef} className="grid grid-cols-3 gap-2">
          {grid.map((value, index) => (
            <div
              key={index}
              className={`w-24 h-24 bg-amber-50 border-2 ${
                isSolved ? "border-green-500" : "border-gray-700"
              } flex items-center justify-center relative overflow-hidden`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
            >
              {flippedCells.includes(index) ? (
                <div className="w-full h-full flex items-center justify-center bg-white">
                  <Image
                    src={getImageForPosition(index) || "/placeholder.svg"}
                    alt=""
                    width={100}
                    height={100}
                    className="object-contain"
                    priority
                  />
                </div>
              ) : (
                value !== null && (
                  <div
                    className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center cursor-grab overflow-hidden"
                    draggable={!isSolved && value !== null}
                    onDragStart={(e) => {
                      const imageIndex = findImageIndexForGridPosition(index)
                      value !== null && handleDragStart(e, Date.now(), value, imageIndex, true, index)
                    }}
                  >
                    <Image
                      src={getImagePath(value, findImageIndexForGridPosition(index)) || "/placeholder.svg"}
                      alt={`${value}`}
                      width={40}
                      height={40}
                      className="object-contain"
                      priority
                    />
                  </div>
                )
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
