"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"

interface PuzzlePiece {
  id: number
  imageUrl: string
  correctPosition: number
  currentPosition: number
}

interface CrystalJigsawPuzzleProps {
  onComplete: () => void
}

export default function CrystalJigsawPuzzle({ onComplete }: CrystalJigsawPuzzleProps) {
  const [pieces, setPieces] = useState<PuzzlePiece[]>([])
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null)
  const [isPuzzleComplete, setIsPuzzleComplete] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Define the puzzle pieces with their correct positions and image URLs
  const puzzlePieceData = [
    {
      id: 0,
      position: 0,
      imageUrl:
        "/images/crystal-jigsaw-1.webp",
    },
    {
      id: 1,
      position: 1,
      imageUrl:
        "/images/crystal-jigsaw-2.webp",
    },
    {
      id: 2,
      position: 2,
      imageUrl:
        "/images/crystal-jigsaw-3.webp",
    },
    {
      id: 3,
      position: 3,
      imageUrl:
        "/images/crystal-jigsaw-4.webp",
    },
    {
      id: 4,
      position: 4,
      imageUrl:
        "/images/crystal-jigsaw-5.webp",
    },
    {
      id: 5,
      position: 5,
      imageUrl:
        "/images/crystal-jigsaw-6.webp",
    },
    {
      id: 6,
      position: 6,
      imageUrl:
        "/images/crystal-jigsaw-7.webp",
    },
    {
      id: 7,
      position: 7,
      imageUrl:
        "/images/crystal-jigsaw-8.webp",
    },
    {
      id: 8,
      position: 8,
      imageUrl:
        "/images/crystal-jigsaw-9.webp",
    },
    {
      id: 9,
      position: 9,
      imageUrl:
        "/images/crystal-jigsaw-10.webp",
    },
    {
      id: 10,
      position: 10,
      imageUrl:
        "/images/crystal-jigsaw-11.webp",
    },
    {
      id: 11,
      position: 11,
      imageUrl:
        "/images/crystal-jigsaw-12.webp",
    },
    {
      id: 12,
      position: 12,
      imageUrl:
        "/images/crystal-jigsaw-13.webp",
    },
    {
      id: 13,
      position: 13,
      imageUrl:
        "/images/crystal-jigsaw-14.webp",
    },
    {
      id: 14,
      position: 14,
      imageUrl:
        "/images/crystal-jigsaw-15.webp",
    },
    {
      id: 15,
      position: 15,
      imageUrl:
        "/images/crystal-jigsaw-16.webp",
    },
  ]

  // Initialize puzzle pieces in random positions
  useEffect(() => {
    // Create a shuffled array of positions (0-15)
    const shuffledPositions = [...Array(16).keys()].sort(() => Math.random() - 0.5)

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
      // Notify parent component that puzzle is complete, but don't automatically advance
      onComplete()
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

  return (
    <div className="flex flex-col items-center gap-4">
      {isPuzzleComplete ? (
        // Render full image when puzzle is complete
        <div className="relative w-[320px] h-[320px] rounded-lg border-2 border-gray-700 overflow-hidden">
          <Image
            src="/images/crystal-jigsaw-full.webp"
            alt="Completed Crystal Jigsaw Puzzle"
            width={320}
            height={320}
            className="w-full h-full object-cover pixelated"
          />
        </div>
      ) : (
        // Render jigsaw grid when puzzle is not complete
        <div
          ref={containerRef}
          className="grid grid-cols-4 gap-1 bg-gray-900 p-2 rounded-lg border-2 border-gray-700"
          style={{ width: "320px", height: "320px" }}
        >
          {/* Create 16 grid positions */}
          {[...Array(16)].map((_, position) => {
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
                    width={80}
                    height={80}
                    className={`w-full h-full object-cover pixelated ${
                      selectedPiece !== null && piece.id === selectedPiece ? "opacity-80" : "opacity-100"
                    }`}
                  />
                )}
              </div>
            )
          })}
        </div>
      )}

      {isPuzzleComplete ? (
        <div className="text-green-400 font-pixel text-center animate-fadeIn">
          Ah, the crystals align... The path forward becomes clearer.
        </div>
      ) : (
        <div className="text-gray-400 font-pixel text-center text-sm animate-pulse">
          {selectedPiece === null ? "Click on a piece to select it" : "Now click another piece to swap positions"}
        </div>
      )}
    </div>
  )
}
