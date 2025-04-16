"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"

interface MouthOfTruthPuzzleProps {
  onSolve: () => void
}

type MarbleType = "black" | "white" | "golden" | "red" | "green" | "blue" | null
type Position = "tl" | "tr" | "bl" | "br" | null

export default function MouthOfTruthPuzzle({ onSolve }: MouthOfTruthPuzzleProps) {
  // State for tracking which marble is in which position
  const [positions, setPositions] = useState<Record<string, MarbleType>>({
    tl: null, // top left
    tr: null, // top right
    bl: null, // bottom left
    br: null, // bottom right
  })

  // State for tracking which marble is being dragged
  const [draggedMarble, setDraggedMarble] = useState<MarbleType>(null)

  // State for tracking if all positions are filled
  const [allFilled, setAllFilled] = useState(false)

  // State for tracking cherub animation
  const [cherubState, setCherubState] = useState(0) // 0: closed, 1: one eye, 2: both eyes

  // Check if all positions are filled
  useEffect(() => {
    const filled = Object.values(positions).every((pos) => pos !== null)
    setAllFilled(filled)

    // Update cherub state based on how many positions are filled
    const filledCount = Object.values(positions).filter((pos) => pos !== null).length
    if (filledCount === 0) setCherubState(0)
    else if (filledCount < 4) setCherubState(1)
    else setCherubState(2)
  }, [positions])

  // Available marbles
  const marbles: MarbleType[] = ["black", "white", "golden", "red", "green", "blue"]

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, marbleType: MarbleType) => {
    setDraggedMarble(marbleType)
    // Set the drag image (optional)
    if (e.dataTransfer) {
      e.dataTransfer.setData("text/plain", marbleType)
      e.dataTransfer.effectAllowed = "move"
    }
  }

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "move"
    }
  }

  // Handle drop
  const handleDrop = (e: React.DragEvent, position: Position) => {
    e.preventDefault()

    if (draggedMarble && position) {
      // Update the position with the dragged marble
      setPositions((prev) => ({
        ...prev,
        [position]: draggedMarble,
      }))
    }

    setDraggedMarble(null)
  }

  // Handle click on a position to remove marble
  const handlePositionClick = (position: Position) => {
    if (positions[position]) {
      setPositions((prev) => ({
        ...prev,
        [position]: null,
      }))
    }
  }

  // Handle mouth click
  const handleMouthClick = () => {
    if (allFilled) {
      // Check if the correct marbles are in the correct positions
      // For now, just trigger the onSolve callback
      onSolve()
    }
  }

  // Get the image source for a position based on the marble type
  const getPositionImageSrc = (position: Position) => {
    const marbleType = positions[position]

    if (!marbleType) {
      return `/images/mouth-of-truth/bocca_${position}_0_cropped.webp`
    }

    // Map the marble type to the correct image name
    let marbleName = marbleType
    if (marbleType === "golden") {
      marbleName = "gold"
    }

    return `/images/mouth-of-truth/bocca_${position}_${marbleName}_cropped.webp`
  }

  // Get the cherub image based on state
  const getCherubImageSrc = () => {
    if (cherubState === 0) return "/images/mouth-of-truth/putto_00.webp"
    if (cherubState === 1) return "/images/mouth-of-truth/putto_01.webp"
    return "/images/mouth-of-truth/putto_11.webp"
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-center mb-4">
        <h3 className="text-lg font-pixel text-purple-300 mb-2">The Mouth of Truth</h3>
      </div>

      {/* Cherub image */}
      <div className="mb-4">
        <Image
          src={getCherubImageSrc() || "/placeholder.svg"}
          alt="Cherub"
          width={150}
          height={150}
          className="pixelated"
        />
      </div>

      {/* Marbles selection area */}
      <div className="flex justify-center gap-4 mb-6">
        {marbles.map((marble) => (
          <div
            key={marble}
            className="w-12 h-12 cursor-grab relative"
            draggable
            onDragStart={(e) => handleDragStart(e, marble)}
          >
            <Image
              src={`/images/mouth-of-truth/${marble}_marble.webp`}
              alt={`${marble} marble`}
              width={48}
              height={48}
              className="pixelated"
            />
          </div>
        ))}
      </div>

      {/* Mouth of Truth image - arranged in a grid with no spacing */}
      <div className="relative w-[300px] h-[300px] grid grid-cols-3 grid-rows-2 gap-0">
        {/* Top Left */}
        <div
          className="w-full h-full cursor-pointer"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "tl")}
          onClick={() => handlePositionClick("tl")}
        >
          <Image
            src={getPositionImageSrc("tl") || "/placeholder.svg"}
            alt="Top Left"
            width={100}
            height={100}
            className="pixelated w-full h-full"
          />
        </div>

        {/* Top Middle */}
        <div className="w-full h-full pointer-events-none">
          <Image
            src="/images/mouth-of-truth/bocca_mt_cropped.webp"
            alt="Top Middle"
            width={100}
            height={100}
            className="pixelated w-full h-full"
          />
        </div>

        {/* Top Right */}
        <div
          className="w-full h-full cursor-pointer"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "tr")}
          onClick={() => handlePositionClick("tr")}
        >
          <Image
            src={getPositionImageSrc("tr") || "/placeholder.svg"}
            alt="Top Right"
            width={100}
            height={100}
            className="pixelated w-full h-full"
          />
        </div>

        {/* Bottom Left */}
        <div
          className="w-full h-full cursor-pointer"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "bl")}
          onClick={() => handlePositionClick("bl")}
        >
          <Image
            src={getPositionImageSrc("bl") || "/placeholder.svg"}
            alt="Bottom Left"
            width={100}
            height={100}
            className="pixelated w-full h-full"
          />
        </div>

        {/* Bottom Middle - The Mouth */}
        <div
          className={`w-full h-full ${allFilled ? "cursor-pointer" : "pointer-events-none"}`}
          onClick={handleMouthClick}
        >
          <Image
            src={
              allFilled ? "/images/mouth-of-truth/bocca_mb_light.webp" : "/images/mouth-of-truth/bocca_mb_cropped.webp"
            }
            alt="Bottom Middle"
            width={100}
            height={100}
            className="pixelated w-full h-full"
          />
        </div>

        {/* Bottom Right */}
        <div
          className="w-full h-full cursor-pointer"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "br")}
          onClick={() => handlePositionClick("br")}
        >
          <Image
            src={getPositionImageSrc("br") || "/placeholder.svg"}
            alt="Bottom Right"
            width={100}
            height={100}
            className="pixelated w-full h-full"
          />
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-4 text-xs text-gray-400">
        {allFilled && <p className="text-green-400">All positions filled! Click the mouth to proceed.</p>}
      </div>
    </div>
  )
}
