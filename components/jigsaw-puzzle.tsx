"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"

interface PuzzlePiece {
  id: number
  imageUrl: string
  correctPosition: number
  currentPosition: number
}

interface JigsawPuzzleProps {
  onComplete: () => void
}

export default function JigsawPuzzle({ onComplete }: JigsawPuzzleProps) {
  const [pieces, setPieces] = useState<PuzzlePiece[]>([])
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null)
  const [isPuzzleComplete, setIsPuzzleComplete] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Define the puzzle pieces with their correct positions and image URLs
  const puzzlePieceData = [
    {
      id: 0,
      position: 0,
      imageUrl: "/images/jigsaw-1.webp",
    },
    {
      id: 1,
      position: 1,
      imageUrl: "/images/jigsaw-2.webp",
    },
    {
      id: 2,
      position: 2,
      imageUrl: "/images/jigsaw-3.webp",
    },
    {
      id: 3,
      position: 3,
      imageUrl: "/images/jigsaw-4.webp",
    },
    {
      id: 4,
      position: 4,
      imageUrl: "/images/jigsaw-5.webp",
    },
    {
      id: 5,
      position: 5,
      imageUrl: "/images/jigsaw-6.webp",
    },
    {
      id: 6,
      position: 6,
      imageUrl: "/images/jigsaw-7.webp",
    },
    {
      id: 7,
      position: 7,
      imageUrl: "/images/jigsaw-8.webp",
    },
    {
      id: 8,
      position: 8,
      imageUrl: "/images/jigsaw-9.webp",
    },
  ]

  // Initialize puzzle pieces in random positions
  useEffect(() => {
    // Create a shuffled array of positions (0-8)
    const shuffledPositions = [...Array(9).keys()].sort(() => Math.random() - 0.5)

    // Create the initial pieces with shuffled positions
    const initialPieces = puzzlePieceData.map((piece, index) => ({
      id: piece.id,
      imageUrl: piece.imageUrl,
      correctPosition: piece.position,
      currentPosition: shuffledPositions[index],
    }))

    setPieces(initialPieces)
  }, [])

  // Check if the puzzle is complete
  useEffect(() => {
    if (pieces.length === 0) return

    const isComplete = pieces.every((piece) => piece.currentPosition === piece.correctPosition)

    if (isComplete && !isPuzzleComplete) {
      setIsPuzzleComplete(true)
      setTimeout(() => {
        onComplete()
      }, 1000)
    }
  }, [pieces, isPuzzleComplete, onComplete])

  // Handle piece selection
  const handlePieceClick = (id: number) => {
    if (isPuzzleComplete) return

    if (selectedPiece === null) {
      // First piece selection
      setSelectedPiece(id)
    } else {
      // Second piece selection - swap the pieces
      const firstPiece = pieces.find((p) => p.id === selectedPiece)
      const secondPiece = pieces.find((p) => p.id === id)

      if (firstPiece && secondPiece) {
        // Swap positions
        const updatedPieces = pieces.map((piece) => {
          if (piece.id === selectedPiece) {
            return { ...piece, currentPosition: secondPiece.currentPosition }
          }
          if (piece.id === id) {
            return { ...piece, currentPosition: firstPiece.currentPosition }
          }
          return piece
        })

        setPieces(updatedPieces)
      }

      // Reset selection
      setSelectedPiece(null)
    }
  }

  // Get the grid position (row, col) from the position index
  const getGridPosition = (position: number) => {
    const row = Math.floor(position / 3)
    const col = position % 3
    return { row, col }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        ref={containerRef}
        className="grid grid-cols-3 gap-1 bg-gray-900 p-2 rounded-lg border-2 border-gray-700"
        style={{ width: "300px", height: "300px" }}
      >
        {/* Create 9 grid positions */}
        {[...Array(9)].map((_, position) => {
          // Find the piece at this position
          const piece = pieces.find((p) => p.currentPosition === position)

          return (
            <div
              key={position}
              className={`relative w-full h-full bg-gray-800 ${
                selectedPiece !== null && piece?.id === selectedPiece
                  ? "border-2 border-yellow-500"
                  : "border border-gray-700"
              } rounded overflow-hidden`}
              onClick={() => piece && handlePieceClick(piece.id)}
            >
              {piece && (
                <Image
                  src={piece.imageUrl || "/placeholder.svg"}
                  alt={`Puzzle piece ${piece.id}`}
                  width={100}
                  height={100}
                  className={`w-full h-full object-cover pixelated ${
                    selectedPiece !== null && piece.id === selectedPiece ? "opacity-80" : "opacity-100"
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>

      {!isPuzzleComplete && (
        <div className="text-gray-400 font-pixel text-center text-sm animate-pulse">
          {selectedPiece === null ? "Click on a piece to select it" : "Now click another piece to swap positions"}
        </div>
      )}
    </div>
  )
}
