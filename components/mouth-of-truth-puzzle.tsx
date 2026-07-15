"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { useAudio } from "@/hooks/use-audio"

interface MouthOfTruthPuzzleProps {
  onSolve: () => void
  level?: number
}

type MarbleType = "black" | "white" | "golden" | "red" | "green" | "blue" | null
type Position = "tl" | "tr" | "bl" | "br" | null
type FeedbackType = "00" | "01" | "11"

export default function MouthOfTruthPuzzle({ onSolve, level = 48 }: MouthOfTruthPuzzleProps) {
  const { playSound } = useAudio()

  // State for tracking which marble is in which position
  const [positions, setPositions] = useState<Record<string, MarbleType>>({
    tl: null, // top left
    tr: null, // top right
    bl: null, // bottom left
    br: null,
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

  // State for tracking if the puzzle is solved
  const [puzzleSolved, setPuzzleSolved] = useState(false)

  // State for the revealed marbles after solving
  const [revealedMarbles, setRevealedMarbles] = useState<Array<{ color: MarbleType; letter: string }>>([])

  // State for the revealed cherubs after solving
  const [revealedCherubs, setRevealedCherubs] = useState<Array<{ color: string; letter: string; position: string }>>([])

  // Generate a random correct combination on mount
  useEffect(() => {
    // Always generate a random combination regardless of level
    generateCorrectCombination()
  }, [level])

  // Make sure the generateCorrectCombination function follows the constraints
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
    if (puzzleSolved) return // Prevent interaction if puzzle is solved

    setDraggedMarble(marbleType)
    // Set the drag image (optional)
    if (e.dataTransfer) {
      e.dataTransfer.setData("text/plain", marbleType)
      e.dataTransfer.effectAllowed = "move"
    }
  }

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    if (puzzleSolved) return // Prevent interaction if puzzle is solved

    e.preventDefault()
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "move"
    }
  }

  // Handle drop
  const handleDrop = (e: React.DragEvent, position: Position) => {
    if (puzzleSolved) return // Prevent interaction if puzzle is solved

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
    if (puzzleSolved) return // Prevent interaction if puzzle is solved

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

  // Generate the revealed marbles and cherubs for the second part of the puzzle
  const generateRevealedItems = useCallback(() => {
    // Get the colors from the correct combination
    const colors = Object.values(correctCombination).filter(Boolean) as MarbleType[]

    // Letter pairs
    const letterPairs = [
      ["C", "H"],
      ["A", "P"],
      ["L", "A"],
      ["I", "N"],
    ]

    // Randomly select one letter from each pair for the marbles
    const marbleLetters = letterPairs.map((pair) => pair[Math.floor(Math.random() * 2)])

    // The cherub letters are the complementary letters
    const cherubLetters = letterPairs.map((pair, index) => (pair[0] === marbleLetters[index] ? pair[1] : pair[0]))

    // Create the revealed marbles
    const newRevealedMarbles = colors.map((color, index) => ({
      color,
      letter: marbleLetters[index],
    }))

    // Create the revealed cherubs
    const newRevealedCherubs = colors.map((color, index) => {
      // Determine the correct position based on the letter rules
      let position = "left" // default

      // Apply the letter position rules
      if (["H", "P", "N"].includes(cherubLetters[index])) {
        position = "right"
      } else if (["C", "L", "I"].includes(cherubLetters[index])) {
        position = "left"
      } else if (cherubLetters[index] === "A") {
        // Special handling for A letters
        // If A is paired with P, it's always on the left
        if (marbleLetters[index] === "P") position = "left"
        // If A is paired with L, it's always on the right
        else if (marbleLetters[index] === "L") position = "right"
      }

      return {
        color: color === "golden" ? "gold" : color, // Normalize color name
        letter: cherubLetters[index],
        position,
      }
    })

    setRevealedMarbles(newRevealedMarbles)
    setRevealedCherubs(newRevealedCherubs)
  }, [correctCombination])

  // Handle mouth click
  const handleMouthClick = () => {
    if (puzzleSolved) return // Prevent interaction if puzzle is solved

    if (allFilled) {
      // Calculate feedback
      const newFeedback = calculateFeedback()
      setFeedback(newFeedback)
      setHandInserted(true)

      // Check if all positions are correct
      const allCorrect = isCorrectCombination()
      if (allCorrect) {
        // Play success sound
        if (playSound) playSound("/audio/correct.mp3")

        // Set puzzle as solved
        setPuzzleSolved(true)
        onSolve()

        // Generate the revealed marbles and cherubs
        generateRevealedItems()

        // Clear all marbles from positions
        setPositions({
          tl: null,
          tr: null,
          bl: null,
          br: null,
        })
      } else {
        // Play wrong sound
        if (playSound) playSound("/audio/wrong.mp3")
      }
    }
  }

  // Check if the current positions match the correct combination
  const isCorrectCombination = () => {
    return Object.entries(positions).every(([pos, color]) => color === correctCombination[pos as Position])
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

  // Get the image source for a feedback cherub
  const getFeedbackImageSrc = (feedbackType: FeedbackType) => {
    return `/images/mouth-of-truth/putto_${feedbackType}.webp`
  }

  // Get the image source for a revealed cherub
  const getRevealedCherubImageSrc = (cherub: { color: string; letter: string; position: string }) => {
    // Apply the letter position rules:
    // Always on the left: C, L, I
    // Always on the right: H, P, N
    // A can be either right or left (handled by existing logic)
    let position = cherub.position

    // Force certain letters to their correct positions regardless of what's passed in
    if (["C", "L", "I"].includes(cherub.letter)) {
      position = "left"
    } else if (["H", "P", "N"].includes(cherub.letter)) {
      position = "right"
    }

    return `/images/mouth-of-truth/putto_${cherub.color}_${cherub.letter}_${position}.webp`
  }

  // Get the image source for a revealed marble
  const getRevealedMarbleImageSrc = (marble: { color: MarbleType; letter: string }) => {
    // Map the marble type to the correct image name
    let colorName = marble.color
    if (marble.color === "golden") {
      colorName = "gold"
    }

    return `/images/mouth-of-truth/${colorName}_marble_${marble.letter.toLowerCase()}.webp`
  }

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Marbles selection area - hide if puzzle is solved */}
      {!puzzleSolved && (
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
      )}

      {/* Mouth of Truth image - arranged in a grid with no spacing */}
      <div className="relative w-[300px] h-[300px] grid grid-cols-3 grid-rows-2 gap-0">
        {/* Top Left */}
        <div
          className={`w-full h-full ${!puzzleSolved ? "cursor-pointer" : ""}`}
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
          className={`w-full h-full ${!puzzleSolved ? "cursor-pointer" : ""}`}
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
          className={`w-full h-full ${!puzzleSolved ? "cursor-pointer" : ""}`}
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
          className={`w-full h-full ${allFilled && !puzzleSolved ? "cursor-pointer" : "pointer-events-none"}`}
          onClick={allFilled && !puzzleSolved ? handleMouthClick : undefined}
        >
          <Image
            src={
              puzzleSolved
                ? "/images/mouth-of-truth/bocca_mb_greenlight.webp"
                : allFilled
                  ? "/images/mouth-of-truth/bocca_mb_light.webp"
                  : "/images/mouth-of-truth/bocca_mb_cropped.webp"
            }
            alt="Bottom Middle"
            width={100}
            height={100}
            className="pixelated w-full h-full"
          />
        </div>

        {/* Bottom Right */}
        <div
          className={`w-full h-full ${!puzzleSolved ? "cursor-pointer" : ""}`}
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

      {/* Revealed marbles after solving */}
      {puzzleSolved && revealedMarbles.length > 0 && (
        <div className="mt-4 flex justify-center gap-4">
          {revealedMarbles.map((marble, index) => (
            <div key={index} className="w-12 h-12 relative">
              <Image
                src={getRevealedMarbleImageSrc(marble) || "/placeholder.svg"}
                alt={`${marble.color} marble with letter ${marble.letter}`}
                width={48}
                height={48}
                className="pixelated"
              />
            </div>
          ))}
        </div>
      )}

      {/* Feedback cherubs or revealed cherubs - now full width with no padding */}
      <div className="mt-6 w-full">
        <div className="grid grid-cols-2 gap-0 bg-black">
          {puzzleSolved && revealedCherubs.length > 0
            ? revealedCherubs.map((cherub, index) => (
                <div key={index} className="w-full relative">
                  <Image
                    src={getRevealedCherubImageSrc(cherub) || "/placeholder.svg"}
                    alt={`${cherub.color} cherub with letter ${cherub.letter}`}
                    width={200}
                    height={200}
                    className="pixelated w-full h-auto"
                  />
                </div>
              ))
            : feedback.map((feedbackType, index) => (
                <div key={index} className="w-full relative">
                  <Image
                    src={getFeedbackImageSrc(feedbackType) || "/placeholder.svg"}
                    alt={`Feedback ${index + 1}`}
                    width={200}
                    height={200}
                    className="pixelated w-full h-auto"
                  />
                </div>
              ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-4 text-sm text-gray-300 font-pixel">
        {puzzleSolved ? (
          <p>The Mouth of Truth has revealed its secret...</p>
        ) : allFilled && !handInserted ? (
          <p>Insert your hand into the Mouth of Truth</p>
        ) : allFilled && handInserted ? (
          <p>Try another combination or proceed if correct</p>
        ) : (
          <p>Place marbles in all four corners</p>
        )}
      </div>
    </div>
  )
}
