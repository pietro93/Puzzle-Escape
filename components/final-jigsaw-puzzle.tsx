"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"

interface PuzzlePiece {
  id: number
  imageUrl: string
  correctPosition: number
  currentPosition: number
  rotation: number // 0, 90, 180, 270 degrees
  isRemoved: boolean
}

interface FinalJigsawPuzzleProps {
  onComplete: () => void
  onPieceRemoved: (piecesRemoved: number) => void
  onAllPiecesRemoved: () => void
}

export default function FinalJigsawPuzzle({ onComplete, onPieceRemoved, onAllPiecesRemoved }: FinalJigsawPuzzleProps) {
  const [pieces, setPieces] = useState<PuzzlePiece[]>([])
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null)
  const [isPuzzleComplete, setIsPuzzleComplete] = useState(false)
  const [removedPieces, setRemovedPieces] = useState<number>(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Define the puzzle pieces with their correct positions and image URLs
  const puzzlePieceData = Array.from({ length: 9 }, (_, i) => ({
    id: i,
    position: i,
    imageUrl: `/images/yama_jigsaw_full-${i + 1}.webp`,
  }))

  // Initialize puzzle pieces in random positions and rotations
  useEffect(() => {
    // Create a shuffled array of positions (0-8)
    const shuffledPositions = [...Array(9).keys()].sort(() => Math.random() - 0.5)

    // Create the initial pieces with shuffled positions and random rotations
    const initialPieces = puzzlePieceData.map((piece, index) => ({
      id: piece.id,
      imageUrl: piece.imageUrl,
      correctPosition: piece.position,
      currentPosition: shuffledPositions[index],
      rotation: [0, 90, 180, 270][Math.floor(Math.random() * 4)], // Random rotation
      isRemoved: false,
    }))

    setPieces(initialPieces)
  }, [])

  // Check if the puzzle is complete
  useEffect(() => {
    if (pieces.length === 0) return

    const isComplete = pieces.every(
      (piece) => piece.currentPosition === piece.correctPosition && piece.rotation === 0 && !piece.isRemoved,
    )

    if (isComplete && !isPuzzleComplete) {
      setIsPuzzleComplete(true)
      onComplete()
    }
  }, [pieces, isPuzzleComplete, onComplete])

  // Track removed pieces
  useEffect(() => {
    if (removedPieces > 0) {
      onPieceRemoved(removedPieces)
    }

    if (removedPieces === 9) {
      onAllPiecesRemoved()
    }
  }, [removedPieces, onPieceRemoved, onAllPiecesRemoved])

  // Handle piece selection
  const handlePieceClick = (id: number) => {
    // If puzzle is complete, clicking a piece removes it
    if (isPuzzleComplete) {
      setPieces((prevPieces) => prevPieces.map((p) => (p.id === id ? { ...p, isRemoved: true } : p)))
      setRemovedPieces((prev) => prev + 1)
      return
    }

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

  // Handle piece rotation
  const handleRotate = (id: number, direction: "clockwise" | "counterclockwise") => {
    const piece = pieces.find((p) => p.id === id)
    if (!piece) return

    // Calculate new rotation
    let newRotation = piece.rotation
    if (direction === "clockwise") {
      newRotation = (newRotation + 90) % 360
    } else {
      newRotation = (newRotation - 90 + 360) % 360
    }

    // Update the piece's rotation
    const updatedPieces = pieces.map((p) => (p.id === id ? { ...p, rotation: newRotation } : p))
    setPieces(updatedPieces)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        ref={containerRef}
        className="grid grid-cols-3 gap-1 bg-gray-900 p-2 rounded-lg border-2 border-gray-700 relative"
        style={{ width: "300px", height: "300px" }}
      >
        {/* Elevator image underneath - hidden until puzzle is complete */}
        <div className="absolute inset-0 z-0">
          <div className={`transition-opacity duration-500 ${isPuzzleComplete ? "opacity-100" : "opacity-0"}`}>
            <Image
              src="/images/elevator.webp"
              alt="Elevator"
              width={300}
              height={300}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Create 9 grid positions */}
        {[...Array(9)].map((_, position) => {
          // Find the piece at this position
          const piece = pieces.find((p) => p.currentPosition === position && !p.isRemoved)

          return (
            <div
              key={position}
              className={`relative w-full h-full ${piece ? "bg-gray-800" : "bg-transparent"} ${
                selectedPiece !== null && piece?.id === selectedPiece
                  ? "border-2 border-yellow-500"
                  : piece
                    ? "border border-gray-700"
                    : ""
              } rounded overflow-hidden`}
              onClick={() => piece && handlePieceClick(piece.id)}
            >
              {piece && (
                <div
                  className="w-full h-full relative"
                  style={{
                    transform: `rotate(${piece.rotation}deg)`,
                    transition: "transform 0.3s ease",
                    cursor: isPuzzleComplete ? "pointer" : "pointer",
                    width: "100%", // Ensure consistent width
                    height: "100%", // Ensure consistent height
                  }}
                >
                  <Image
                    src={piece.imageUrl || "/placeholder.svg"}
                    alt={`Puzzle piece ${piece.id}`}
                    width={100}
                    height={100}
                    className="w-full h-full object-cover pixelated"
                    style={{
                      objectFit: "cover", // Ensure consistent sizing
                      width: "100%", // Ensure consistent width
                      height: "100%", // Ensure consistent height
                    }}
                  />
                </div>
              )}

              {/* Rotation controls - only show for selected piece */}
              {piece && selectedPiece === piece.id && !isPuzzleComplete && (
                <>
                  {/* Counterclockwise button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRotate(piece.id, "counterclockwise")
                    }}
                    className="absolute -bottom-1 -left-1 w-7 h-7 flex items-center justify-center bg-black/70 rounded-full hover:bg-gray-700 border border-gray-600 z-10"
                  >
                    <svg
                      className="w-4 h-4 text-gray-300"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M4 12L2 10M4 12L6 10"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 4V8"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  {/* Clockwise button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRotate(piece.id, "clockwise")
                    }}
                    className="absolute -bottom-1 -right-1 w-7 h-7 flex items-center justify-center bg-black/70 rounded-full hover:bg-gray-700 border border-gray-600 z-10"
                  >
                    <svg
                      className="w-4 h-4 text-gray-300"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M20 12L22 10M20 12L18 10"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 4V8"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </>
              )}
            </div>
          )
        })}
      </div>

      {isPuzzleComplete && (
        <div className="text-gray-400 font-pixel text-center text-sm animate-pulse">
          {/* Removed text as requested */}
        </div>
      )}
    </div>
  )
}
