"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"

// Define the types for our chess pieces and board
type HorsemanType = "death" | "pestilence" | "war" | "famine"
type Position = { row: number; col: number }
type Tile = {
  visible: boolean
  targetFor?: HorsemanType
  startFor?: HorsemanType
  background: string
}
type Horseman = {
  type: HorsemanType
  position: Position
  targetPosition: Position
  color: string
  image: string
}

// Define the chess puzzle component
export default function InfernalChessPuzzle() {
  // Initialize the board
  const initializeBoard = (): Tile[][] => {
    const board: Tile[][] = Array(5)
      .fill(null)
      .map(() =>
        Array(5)
          .fill(null)
          .map(() => ({ visible: false, background: "transparent" })),
      )

    // Set visible tiles (the playable area)
    for (let row = 1; row <= 3; row++) {
      for (let col = 1; col <= 3; col++) {
        board[row][col] = {
          visible: true,
          background: (row + col) % 2 === 0 ? "bg-gray-700" : "bg-gray-600",
        }
      }
    }

    // Set the corner tiles
    // Death starts at top-left (0,0), targets bottom-right (4,4)
    board[0][0] = {
      visible: true,
      startFor: "death",
      targetFor: "famine",
      background: "bg-purple-900", // Famine's color (target)
    }

    // Pestilence starts at bottom-left (4,0), targets top-right (0,4)
    board[4][0] = {
      visible: true,
      startFor: "pestilence",
      targetFor: "war",
      background: "bg-red-900", // War's color (target)
    }

    // War starts at top-right (0,4), targets bottom-left (4,0)
    board[0][4] = {
      visible: true,
      startFor: "war",
      targetFor: "pestilence",
      background: "bg-green-900", // Pestilence's color (target)
    }

    // Famine starts at bottom-right (4,4), targets top-left (0,0)
    board[4][4] = {
      visible: true,
      startFor: "famine",
      targetFor: "death",
      background: "bg-gray-900", // Death's color (target)
    }

    return board
  }

  // Initialize the horsemen
  const initializeHorsemen = (): Horseman[] => [
    {
      type: "death",
      position: { row: 0, col: 0 },
      targetPosition: { row: 4, col: 4 },
      color: "black",
      image: "/images/horseman_death.webp",
    },
    {
      type: "pestilence",
      position: { row: 4, col: 0 },
      targetPosition: { row: 0, col: 4 },
      color: "green",
      image: "/images/horseman_pestilence.webp",
    },
    {
      type: "war",
      position: { row: 0, col: 4 },
      targetPosition: { row: 4, col: 0 },
      color: "red",
      image: "/images/horseman_war.webp",
    },
    {
      type: "famine",
      position: { row: 4, col: 4 },
      targetPosition: { row: 0, col: 0 },
      color: "purple",
      image: "/images/horseman_famine.webp",
    },
  ]

  // State variables
  const [board, setBoard] = useState<Tile[][]>(initializeBoard())
  const [horsemen, setHorsemen] = useState<Horseman[]>(initializeHorsemen())
  const [selectedHorseman, setSelectedHorseman] = useState<HorsemanType | null>(null)
  const [lastMovedHorseman, setLastMovedHorseman] = useState<HorsemanType | null>(null)
  const [validMoves, setValidMoves] = useState<Position[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const [showError, setShowError] = useState<Position | null>(null)
  const [moveCount, setMoveCount] = useState(0)

  // Check if the puzzle is complete
  useEffect(() => {
    const allAtTarget = horsemen.every(
      (horseman) =>
        horseman.position.row === horseman.targetPosition.row && horseman.position.col === horseman.targetPosition.col,
    )

    if (allAtTarget && moveCount > 0) {
      setIsComplete(true)
    }
  }, [horsemen, moveCount])

  // Get the horseman at a specific position
  const getHorsemanAt = (row: number, col: number): Horseman | undefined => {
    return horsemen.find((horseman) => horseman.position.row === row && horseman.position.col === col)
  }

  // Calculate valid knight moves
  const calculateValidMoves = (horseman: Horseman): Position[] => {
    const { row, col } = horseman.position
    const possibleMoves: Position[] = [
      { row: row - 2, col: col - 1 },
      { row: row - 2, col: col + 1 },
      { row: row - 1, col: col - 2 },
      { row: row - 1, col: col + 2 },
      { row: row + 1, col: col - 2 },
      { row: row + 1, col: col + 2 },
      { row: row + 2, col: col - 1 },
      { row: row + 2, col: col + 1 },
    ]

    // Filter out invalid moves (outside the board or invisible tiles or occupied tiles)
    return possibleMoves.filter((move) => {
      const { row, col } = move
      // Check if the move is within the board
      if (row < 0 || row >= 5 || col < 0 || col >= 5) return false

      // Check if the tile is visible
      if (!board[row][col].visible) return false

      // Check if the tile is not occupied by another horseman
      const occupyingHorseman = getHorsemanAt(row, col)
      if (occupyingHorseman) return false

      return true
    })
  }

  // Handle horseman selection
  const handleHorsemanSelect = (type: HorsemanType) => {
    // Cannot select the same horseman twice in a row
    if (type === lastMovedHorseman) {
      const horseman = horsemen.find((h) => h.type === type)
      if (horseman) {
        setShowError(horseman.position)
        setTimeout(() => setShowError(null), 500)
      }
      return
    }

    setSelectedHorseman(type)
    const horseman = horsemen.find((h) => h.type === type)
    if (horseman) {
      setValidMoves(calculateValidMoves(horseman))
    }
  }

  // Handle tile click
  const handleTileClick = (row: number, col: number) => {
    // If a horseman is selected and the clicked tile is a valid move
    if (selectedHorseman) {
      const isValidMove = validMoves.some((move) => move.row === row && move.col === col)

      if (isValidMove) {
        // Move the horseman
        setHorsemen((prev) =>
          prev.map((horseman) =>
            horseman.type === selectedHorseman ? { ...horseman, position: { row, col } } : horseman,
          ),
        )

        // Update last moved horseman
        setLastMovedHorseman(selectedHorseman)

        // Increment move count
        setMoveCount((prev) => prev + 1)

        // Clear selection and valid moves
        setSelectedHorseman(null)
        setValidMoves([])
      } else {
        // Show error for invalid move
        setShowError({ row, col })
        setTimeout(() => setShowError(null), 500)
      }
    } else {
      // Check if there's a horseman at the clicked position
      const horseman = getHorsemanAt(row, col)
      if (horseman) {
        handleHorsemanSelect(horseman.type)
      }
    }
  }

  // Reset the puzzle
  const resetPuzzle = () => {
    setBoard(initializeBoard())
    setHorsemen(initializeHorsemen())
    setSelectedHorseman(null)
    setLastMovedHorseman(null)
    setValidMoves([])
    setIsComplete(false)
    setShowError(null)
    setMoveCount(0)
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto">
      <div className="mb-4 text-center">
        <h3 className="text-xl font-pixel text-purple-300 mb-2">Infernal Chess</h3>
        <p className="text-sm font-pixel text-gray-300 mb-4">
          Move each horseman to its target corner. Knights move in L-shapes. You cannot move the same horseman twice in
          a row.
        </p>
      </div>

      {/* Chess board */}
      <div className="grid grid-cols-5 gap-1 bg-gray-900 p-2 rounded-lg shadow-lg">
        {board.map((row, rowIndex) =>
          row.map((tile, colIndex) => {
            const horseman = getHorsemanAt(rowIndex, colIndex)
            const isSelected = selectedHorseman && horseman?.type === selectedHorseman
            const isValidMove = validMoves.some((move) => move.row === rowIndex && move.col === colIndex)
            const isError = showError?.row === rowIndex && showError?.col === colIndex

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`
                  relative w-14 h-14 flex items-center justify-center
                  ${tile.visible ? tile.background : "invisible"}
                  ${isSelected ? "ring-2 ring-yellow-400" : ""}
                  ${isValidMove ? "ring-2 ring-yellow-300 cursor-pointer" : ""}
                  ${isError ? "ring-2 ring-red-500 animate-pulse" : ""}
                  transition-all duration-200
                `}
                onClick={() => tile.visible && handleTileClick(rowIndex, colIndex)}
              >
                {horseman && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: isSelected ? 1.1 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Image
                      src={horseman.image || "/placeholder.svg"}
                      alt={horseman.type}
                      width={50}
                      height={50}
                      className="pixelated object-contain"
                    />
                  </motion.div>
                )}
              </div>
            )
          }),
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 gap-4 w-full">
        {horsemen.map((horseman) => (
          <div
            key={horseman.type}
            className={`
              flex items-center p-2 rounded-md
              ${
                horseman.type === "death"
                  ? "bg-gray-800"
                  : horseman.type === "pestilence"
                    ? "bg-green-900"
                    : horseman.type === "war"
                      ? "bg-red-900"
                      : "bg-purple-900"
              }
              ${horseman.type === selectedHorseman ? "ring-2 ring-yellow-400" : ""}
              ${horseman.type === lastMovedHorseman ? "opacity-50" : ""}
            `}
          >
            <div className="w-10 h-10 mr-2">
              <Image
                src={horseman.image || "/placeholder.svg"}
                alt={horseman.type}
                width={40}
                height={40}
                className="pixelated object-contain"
              />
            </div>
            <div>
              <p className="text-xs font-pixel capitalize">{horseman.type}</p>
              <p className="text-xs font-pixel opacity-70">
                {horseman.position.row === horseman.targetPosition.row &&
                horseman.position.col === horseman.targetPosition.col
                  ? "✓ At target"
                  : "Not at target"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Moves counter */}
      <div className="mt-4 text-center">
        <p className="text-sm font-pixel text-gray-300">Moves: {moveCount}</p>
      </div>

      {/* Reset button */}
      <button
        onClick={resetPuzzle}
        className="mt-4 px-4 py-2 bg-purple-900 hover:bg-purple-800 text-white font-pixel rounded-md transition-colors"
      >
        Reset Puzzle
      </button>

      {/* Completion message */}
      {isComplete && (
        <div className="mt-6 p-4 bg-green-900/80 border border-green-700 rounded-lg text-center animate-fadeIn">
          <h3 className="text-xl font-pixel text-green-300 mb-2">Puzzle Complete!</h3>
          <p className="text-sm font-pixel text-green-200">You've successfully arranged the Four Horsemen.</p>
          <p className="text-md font-pixel text-yellow-300 mt-2">The solution is: APOCALYPSE NAUGHT</p>
        </div>
      )}
    </div>
  )
}
