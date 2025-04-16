"use client"

import React from "react"

// components/mouth-of-truth-puzzle.tsx

type MarbleType = "red" | "blue" | "green" | "golden"
type Position = "top_left" | "top_right" | "bottom_left" | "bottom_right"

interface MouthOfTruthPuzzleProps {
  initialPositions?: { [key in Position]?: MarbleType }
  onSolved?: () => void
}

const MouthOfTruthPuzzle = ({ initialPositions, onSolved }: MouthOfTruthPuzzleProps) => {
  const [positions, setPositions] = React.useState<{ [key in Position]?: MarbleType }>(initialPositions || {})

  const handlePositionClick = (position: Position) => {
    // Logic to cycle through marble types or remove them
    setPositions((prevPositions) => {
      const currentMarble = prevPositions[position]
      let newMarble: MarbleType | undefined

      if (!currentMarble) {
        newMarble = "red"
      } else if (currentMarble === "red") {
        newMarble = "blue"
      } else if (currentMarble === "blue") {
        newMarble = "green"
      } else if (currentMarble === "green") {
        newMarble = "golden"
      } else {
        newMarble = undefined
      }

      const newPositions = { ...prevPositions }
      if (newMarble) {
        newPositions[position] = newMarble
      } else {
        delete newPositions[position]
      }

      return newPositions
    })
  }

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

  // Check if the puzzle is solved (example condition)
  React.useEffect(() => {
    const isSolved =
      positions.top_left === "red" &&
      positions.top_right === "blue" &&
      positions.bottom_left === "green" &&
      positions.bottom_right === "golden"

    if (isSolved && onSolved) {
      onSolved()
    }
  }, [positions, onSolved])

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
      <button onClick={() => handlePositionClick("top_left")}>
        <img src={getPositionImageSrc("top_left") || "/placeholder.svg"} alt="Top Left" />
      </button>
      <button onClick={() => handlePositionClick("top_right")}>
        <img src={getPositionImageSrc("top_right") || "/placeholder.svg"} alt="Top Right" />
      </button>
      <button onClick={() => handlePositionClick("bottom_left")}>
        <img src={getPositionImageSrc("bottom_left") || "/placeholder.svg"} alt="Bottom Left" />
      </button>
      <button onClick={() => handlePositionClick("bottom_right")}>
        <img src={getPositionImageSrc("bottom_right") || "/placeholder.svg"} alt="Bottom Right" />
      </button>
    </div>
  )
}

export default MouthOfTruthPuzzle
