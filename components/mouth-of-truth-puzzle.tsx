"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"

interface MouthOfTruthPuzzleProps {
  onSolve: () => void
}

type MarbleType = "black" | "white" | "golden" | "red" | "green" | "blue" | null
type Position = "tl" | "tr" | "bl" | "br" | null
type FeedbackType = "00" | "01" | "11"

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

  // State for tracking feedback from the cherubs
  const [feedback, setFeedback] = useState<FeedbackType[]>(["00", "00", "00", "00"])

  // State for tracking if the player has inserted their hand
  const [handInserted, setHandInserted] = useState(false)

  // State for the correct combination
  const [correctCombination, setCorrectCombination] = useState<Record<string, MarbleType>>({
    tl: null,
    tr: null,
    bl: null,
    br: null,
  })

  // Generate a random correct combination on mount
  useEffect(() => {
    generateCorrectCombination()
  }, [])

  // Generate a random correct combination
  const generateCorrectCombination = () => {
    const validColors: MarbleType[] = ["red", "golden", "black", "green"]
    const positions: Position[] = ["tl", "tr", "bl", "br"]

    // Ensure at least two different colors
    const combo: Record<string, MarbleType> = {
      tl: null,
      tr: null,
      bl: null,
      br: null,
    }

    // First, randomly select two different colors
    const firstColor = validColors[Math.floor(Math.random() * validColors.length)]
    let secondColor = firstColor
    while (secondColor === firstColor) {
      secondColor = validColors[Math.floor(Math.random() * validColors.length)]
    }

    // Randomly assign these two colors to positions
    const firstPosition = positions[Math.floor(Math.random() * positions.length)]
    let secondPosition = firstPosition
    while (secondPosition === firstPosition) {
      secondPosition = positions[Math.floor(Math.random() * positions.length)]
    }

    combo[firstPosition] = firstColor
    combo[secondPosition] = secondColor

    // Fill the remaining positions with random colors
    positions.forEach((pos) => {
      if (pos !== firstPosition && pos !== secondPosition) {
        combo[pos] = validColors[Math.floor(Math.random() * validColors.length)]
      }
    })

    console.log("Correct combination:", combo)
    setCorrectCombination(combo)
  }

  // Check if all positions are filled
  useEffect(() => {
    const filled = Object.values(positions).every((pos) => pos !== null)
    setAllFilled(filled)

    // Reset feedback if any marble is removed
    if (!filled && handInserted) {
      setFeedback(["00", "00", "00", "00"])
      setHandInserted(false)
    }
  }, [positions, handInserted])

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
      setPositions((prev) => {
        const newPositions = {
          ...prev,
          [position]: draggedMarble,
        }

        // Reset feedback if marbles have been changed after hand insertion
        if (handInserted) {
          setFeedback(["00", "00", "00", "00"])
          setHandInserted(false)
        }

        return newPositions
      })
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

      // Reset feedback if a marble is removed
      if (handInserted) {
        setFeedback(["00", "00", "00", "00"])
        setHandInserted(false)
      }
    }
  }

  // Handle mouth click
  const handleMouthClick = () => {
    if (allFilled) {
      // Calculate feedback
      const newFeedback = calculateFeedback()
      setFeedback(newFeedback)
      setHandInserted(true)

      // Check if all positions are correct
      const allCorrect = newFeedback.every((f) => f === "11")
      if (allCorrect) {
        // This is where we would trigger the next part of the puzzle
        // For now, we'll just log a message
        console.log("All correct! Proceeding to next stage...")
      }
    }
  }

  // Calculate feedback based on current positions and correct combination
  const calculateFeedback = (): FeedbackType[] => {
    const positionKeys: Position[] = ["tl", "tr", "bl", "br"]
    const result: FeedbackType[] = ["00", "00", "00", "00"]

    // Track which positions have been matched
    const matchedPositions: Record<string, boolean> = {
      tl: false,
      tr: false,
      bl: false,
      br: false,
    }

    // Track which correct marbles have been matched
    const matchedCorrect: Record<string, boolean> = {
      tl: false,
      tr: false,
      bl: false,
      br: false,
    }

    // First pass: find exact matches (right color, right position)
    let exactMatches = 0
    positionKeys.forEach((pos, index) => {
      if (positions[pos] === correctCombination[pos]) {
        result[index] = "11"
        matchedPositions[pos] = true
        matchedCorrect[pos] = true
        exactMatches++
      }
    })

    // Second pass: find color matches (right color, wrong position)
    let colorMatches = 0
    positionKeys.forEach((guessPos, index) => {
      if (!matchedPositions[guessPos]) {
        // This position hasn't been matched yet
        for (const correctPos of positionKeys) {
          if (!matchedCorrect[correctPos] && positions[guessPos] === correctCombination[correctPos]) {
            // Found a color match
            result[index] = "01"
            matchedCorrect[correctPos] = true
            colorMatches++
            break
          }
        }
      }
    })

    // Shuffle the feedback to avoid giving away position information
    return result.sort(() => Math.random() - 0.5)
  }

  // Get the image source for a feedback cherub
  const getFeedbackImageSrc = (feedbackType: FeedbackType) => {
    // For now, we'll continue using the basic feedback types
    // Later we can implement the letter-based feedback
    if (feedbackType === "00") {
      // No match - use black cherub with no letter
      return `/images/mouth-of-truth/putto_00.webp`
    } else if (feedbackType === "01") {
      // Color match but wrong position - use gold cherub with C (for Color)
      return `/images/mouth-of-truth/putto_gold_C_left.webp`
    } else if (feedbackType === "11") {
      // Perfect match - use green cherub with P (for Position)
      return `/images/mouth-of-truth/putto_green_P_right.webp`
    }
    return `/images/mouth-of-truth/putto_${feedbackType}.webp`
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

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-[800px] mx-auto">
      <div className="text-center mb-4">
        <h3 className="text-lg font-pixel text-purple-300 mb-2">The Mouth of Truth</h3>
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
              src={`/images/mouth-of-truth/${marble === "golden" ? "gold" : marble}_marble.webp`}
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
          onClick={allFilled ? handleMouthClick : undefined}
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

      {/* Feedback cherubs */}
      <div className="mt-6 grid grid-cols-2 gap-6 bg-black p-6 rounded-lg w-full max-w-[600px]">
        {feedback.map((feedbackType, index) => (
          <div key={index} className="w-full aspect-square relative">
            <Image
              src={getFeedbackImageSrc(feedbackType) || "/placeholder.svg"}
              alt={`Feedback ${index + 1}`}
              width={280}
              height={280}
              className="pixelated w-full h-full"
            />
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="mt-4 text-sm text-gray-300 font-pixel">
        {allFilled && !handInserted && <p>Insert your hand into the Mouth of Truth</p>}
        {allFilled && handInserted && <p>Try another combination or proceed if correct</p>}
        {!allFilled && <p>Place marbles in all four corners</p>}
      </div>
    </div>
  )
}
