"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

interface MagicBoxPuzzleProps {
  onSolve: () => void
}

// Define a type for bone items with image path and value
interface BoneItem {
  id: number
  value: number
  imagePath: string
}

export default function MagicBoxPuzzle({ onSolve }: MagicBoxPuzzleProps) {
  // Available bone images with their corresponding values
  const availableBones: BoneItem[] = [
    {
      id: 1,
      value: 1,
      imagePath:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/magicbox-1-FFNSjxKUKDdcwSV9i481pzaWusPRmz.webp",
    },
    {
      id: 2,
      value: 2,
      imagePath:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/magicbox-2-37qA48eH6bFEG8CM5yU8DGALHftwLZ.webp",
    },
    {
      id: 3,
      value: 2,
      imagePath:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/magicbox-2-2-SeuBeYE5RuSXxpigsJxFBjvPMx50Mj.webp",
    },
    {
      id: 4,
      value: 3,
      imagePath:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/magicbox-3-CTY5ahQWqrVfO9IHmkrr2E374YWCiG.webp",
    },
    {
      id: 5,
      value: 3,
      imagePath:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/magicbox-3-CTY5ahQWqrVfO9IHmkrr2E374YWCiG.webp",
    },
    {
      id: 6,
      value: 3,
      imagePath:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/magicbox-3-CTY5ahQWqrVfO9IHmkrr2E374YWCiG.webp",
    },
    {
      id: 7,
      value: 4,
      imagePath:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/magicbox-4-cwOUlxNvomZPV4Of21uutUd7SpfjDE.webp",
    },
    {
      id: 8,
      value: 4,
      imagePath:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/magicbox-4-2-cUnYt0IN8klOreHWDRcHFqAoVgRpjl.webp",
    },
    {
      id: 9,
      value: 5,
      imagePath:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/magicbox-5-2WND6ruWesJglRuseszC8kyI33RnAU.webp",
    },
  ]

  // State for tracking which bones are placed on the grid
  const [grid, setGrid] = useState<Array<BoneItem | null>>([null, null, null, null, null, null, null, null, null])

  // State for tracking which bones are still available (not placed on grid)
  const [remainingBones, setRemainingBones] = useState<BoneItem[]>([])

  // State for tracking if the puzzle is solved
  const [isSolved, setIsSolved] = useState(false)

  // State for tracking which cells have been flipped
  const [flippedCells, setFlippedCells] = useState<number[]>([])

  // Ref for the grid element
  const gridRef = useRef<HTMLDivElement>(null)

  // Initialize the remaining bones with unique IDs
  useEffect(() => {
    const shuffled = [...availableBones].sort(() => Math.random() - 0.5)
    setRemainingBones(shuffled)
  }, [])

  // Calculate sums for rows, columns, and diagonals
  const calculateSums = () => {
    const sums = {
      rows: [
        [0, 1, 2], // First row
        [3, 4, 5], // Second row
        [6, 7, 8], // Third row
      ].map((indices) => indices.reduce((sum, index) => sum + (grid[index]?.value || 0), 0)),

      columns: [
        [0, 3, 6], // First column
        [1, 4, 7], // Second column
        [2, 5, 8], // Third column
      ].map((indices) => indices.reduce((sum, index) => sum + (grid[index]?.value || 0), 0)),

      diagonals: [
        [0, 4, 8], // Top-left to bottom-right
        [2, 4, 6], // Top-right to bottom-left
      ].map((indices) => indices.reduce((sum, index) => sum + (grid[index]?.value || 0), 0)),
    }

    return sums
  }

  // Handle drag start for a bone
  const handleDragStart = (e: React.DragEvent, bone: BoneItem, fromGrid: boolean, gridIndex?: number) => {
    e.dataTransfer.setData("id", bone.id.toString())
    e.dataTransfer.setData("value", bone.value.toString())
    e.dataTransfer.setData("imagePath", bone.imagePath)
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
    const imagePath = e.dataTransfer.getData("imagePath")
    const fromGrid = e.dataTransfer.getData("fromGrid") === "true"
    const oldGridIndex = fromGrid ? Number.parseInt(e.dataTransfer.getData("gridIndex")) : -1

    // If the cell already has a bone, don't allow the drop
    if (grid[index] !== null) return

    // Update the grid
    const newGrid = [...grid]

    // If the bone is coming from another grid cell, clear that cell
    if (fromGrid) {
      newGrid[oldGridIndex] = null
    }

    // Place the bone in the new cell
    newGrid[index] = { id, value, imagePath }

    // Update the remaining bones
    let newRemainingBones = [...remainingBones]

    if (fromGrid) {
      // If moving within the grid, no need to update remaining bones
    } else {
      // Remove the bone from remaining bones
      newRemainingBones = newRemainingBones.filter((bone) => bone.id !== id)
    }

    setGrid(newGrid)
    setRemainingBones(newRemainingBones)
  }

  // Handle drop outside the grid (return to available bones)
  const handleDropOutside = (e: React.DragEvent) => {
    e.preventDefault()

    if (isSolved) return

    const fromGrid = e.dataTransfer.getData("fromGrid") === "true"

    if (fromGrid) {
      const id = Number.parseInt(e.dataTransfer.getData("id"))
      const value = Number.parseInt(e.dataTransfer.getData("value"))
      const imagePath = e.dataTransfer.getData("imagePath")
      const gridIndex = Number.parseInt(e.dataTransfer.getData("gridIndex"))

      // Remove the bone from the grid
      const newGrid = [...grid]
      newGrid[gridIndex] = null
      setGrid(newGrid)

      // Add the bone back to remaining bones
      setRemainingBones([...remainingBones, { id, value, imagePath }])
    }
  }

  // Get the image for a flipped cell
  const getImageForPosition = (index: number) => {
    const position = flippedCells.indexOf(index)
    if (position === 0)
      return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/magicbox-1-FFNSjxKUKDdcwSV9i481pzaWusPRmz.webp" // Using magicbox-1.webp as blood for now
    if (position === 1)
      return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/magicbox-2-37qA48eH6bFEG8CM5yU8DGALHftwLZ.webp" // Using magicbox-2.webp as shot for now
    if (position === 2)
      return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/magicbox-3-CTY5ahQWqrVfO9IHmkrr2E374YWCiG.webp" // Using magicbox-3.webp as ice for now
    return ""
  }

  // Calculate the sums
  const sums = calculateSums()

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
      if (line.every((index) => grid[index]?.value === 3)) {
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
    if (grid[3]?.value === 3 && grid[4]?.value === 3 && grid[5]?.value === 3) {
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

      {/* Bones storage area */}
      <div
        className="flex flex-wrap justify-center gap-4 mb-10 p-4 bg-gray-800 bg-opacity-40 rounded-lg min-h-[80px] w-[350px]"
        onDragOver={handleDragOver}
        onDrop={handleDropOutside}
      >
        {remainingBones.map((bone) => (
          <motion.div
            key={bone.id}
            className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center cursor-grab overflow-hidden"
            draggable={!isSolved}
            onDragStart={(e) => handleDragStart(e, bone, false)}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Image
              src={bone.imagePath || "/placeholder.svg"}
              alt={`Bone value ${bone.value}`}
              width={56}
              height={56}
              className="object-contain"
              unoptimized
              onError={(e) => {
                console.error("Failed to load image:", bone.imagePath)
                ;(e.target as HTMLImageElement).src = "/placeholder.svg"
              }}
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
          {grid.map((bone, index) => (
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
                    unoptimized
                  />
                </div>
              ) : (
                bone !== null && (
                  <div
                    className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center cursor-grab overflow-hidden"
                    draggable={!isSolved && bone !== null}
                    onDragStart={(e) => bone !== null && handleDragStart(e, bone, true, index)}
                  >
                    <Image
                      src={bone.imagePath || "/placeholder.svg"}
                      alt={`Bone value ${bone.value}`}
                      width={56}
                      height={56}
                      className="object-contain"
                      unoptimized
                      onError={(e) => {
                        console.error("Failed to load image:", bone.imagePath)
                        ;(e.target as HTMLImageElement).src = "/placeholder.svg"
                      }}
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
