"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { RotateCw, RotateCcw } from "lucide-react"

interface PuzzlePiece {
  id: number
  imageUrl: string
  correctPosition: number
  currentPosition: number
  rotation: number // 0, 90, 180, 270 degrees
}

interface HellJigsawPuzzleProps {
  onComplete: () => void
}

export default function HellJigsawPuzzle({ onComplete }: HellJigsawPuzzleProps) {
  const [pieces, setPieces] = useState<PuzzlePiece[]>([])
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null)
  const [isPuzzleComplete, setIsPuzzleComplete] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Define the puzzle pieces with their correct positions and image URLs
  const puzzlePieceData = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    position: i,
    imageUrl: `/images/hell-jigsaw-${i + 1}.webp`,
  }))

  // Initialize puzzle pieces in random positions and rotations
  useEffect(() => {
    // Create a shuffled array of positions (0-24)
    const shuffledPositions = [...Array(25).keys()].sort(() => Math.random() - 0.5)

    // Create the initial pieces with shuffled positions and random rotations
    const initialPieces = puzzlePieceData.map((piece, index) => ({
      id: piece.id,
      imageUrl: piece.imageUrl,
      correctPosition: piece.position,
      currentPosition: shuffledPositions[index],
      rotation: [0, 90, 180, 270][Math.floor(Math.random() * 4)], // Random rotation
    }))

    setPieces(initialPieces)
  }, [])

  // Check if the puzzle is complete
  useEffect(() => {
    if (pieces.length === 0) return

    const isComplete = pieces.every((piece) => piece.currentPosition === piece.correctPosition && piece.rotation === 0)

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
    } else if (selectedPiece === id) {
      // Clicking the same piece again deselects it
      setSelectedPiece(null)
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

  // Handle piece rotation - always rotate in the specified direction
  const handleRotate = (id: number, direction: "clockwise" | "counterclockwise") => {
    const piece = pieces.find((p) => p.id === id)
    if (!piece) return

    // Calculate new rotation - always rotate by 90 degrees in the specified direction
    let newRotation = piece.rotation
    if (direction === "clockwise") {
      // Always add 90 degrees clockwise
      newRotation = (newRotation + 90) % 360
    } else {
      // Always subtract 90 degrees counterclockwise
      newRotation = (newRotation - 90 + 360) % 360
    }

    // Update the piece's rotation
    const updatedPieces = pieces.map((p) => (p.id === id ? { ...p, rotation: newRotation } : p))

    setPieces(updatedPieces)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {isPuzzleComplete ? (
        // Show the complete image and initials when puzzle is complete
        <div className="relative">
          <div className="w-full max-w-md relative">
            <Image
              src="/images/hell-jigsaw-full.webp"
              alt="Completed puzzle"
              width={500}
              height={500}
              className="w-full h-auto rounded-lg border-2 border-gray-700"
            />
            <div className="absolute bottom-4 right-4 bg-black/70 px-3 py-1 rounded-md font-serif text-xl text-white">
              H.B.
            </div>
          </div>
        </div>
      ) : (
        // Show the puzzle grid when not complete
        <div
          ref={containerRef}
          className="grid grid-cols-5 gap-1 bg-gray-900 p-2 rounded-lg border-2 border-gray-700 relative"
          style={{ width: "380px", height: "380px" }} // Increased size
        >
          {/* Create 25 grid positions */}
          {[...Array(25)].map((_, position) => {
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
                  <div
                    className="w-full h-full relative"
                    style={{
                      transform: `rotate(${piece.rotation}deg)`,
                      transition: "transform 0.3s ease",
                    }}
                  >
                    <Image
                      src={piece.imageUrl || "/placeholder.svg"}
                      alt={`Puzzle piece ${piece.id}`}
                      width={72}
                      height={72}
                      className={`w-full h-full object-cover pixelated ${
                        selectedPiece !== null && piece.id === selectedPiece ? "opacity-80" : "opacity-100"
                      }`}
                    />
                  </div>
                )}

                {/* Rotation controls - only show for selected piece */}
                {piece && selectedPiece === piece.id && (
                  <>
                    {/* Counterclockwise button - bottom left corner of the grid cell */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRotate(piece.id, "counterclockwise")
                      }}
                      className="absolute -bottom-1 -left-1 w-7 h-7 flex items-center justify-center bg-black/70 rounded-full hover:bg-gray-700 border border-gray-600 z-10"
                    >
                      <RotateCcw className="w-4 h-4 text-gray-300" />
                    </button>

                    {/* Clockwise button - bottom right corner of the grid cell */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRotate(piece.id, "clockwise")
                      }}
                      className="absolute -bottom-1 -right-1 w-7 h-7 flex items-center justify-center bg-black/70 rounded-full hover:bg-gray-700 border border-gray-600 z-10"
                    >
                      <RotateCw className="w-4 h-4 text-gray-300" />
                    </button>
                  </>
                )}
              </div>
            )
          })}
        </div>
      )}

      {!isPuzzleComplete && (
        <div className="text-gray-400 font-pixel text-center text-sm animate-pulse">
          {selectedPiece === null
            ? "Click on a piece to select it"
            : "Click another piece to swap positions or use the rotation buttons"}
        </div>
      )}
    </div>
  )
}
