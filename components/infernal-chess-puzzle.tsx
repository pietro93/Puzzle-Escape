"use client"

import { useState, useEffect } from "react"
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
  mayhemText: string
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
      background: "bg-black", // Death's color (target) - changed to black
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
      mayhemText: "Death brings eternal silence to all living souls.",
    },
    {
      type: "pestilence",
      position: { row: 4, col: 0 },
      targetPosition: { row: 0, col: 4 },
      color: "green",
      image: "/images/horseman_pestilence.webp",
      mayhemText: "Pestilence spreads disease through every corner of the world.",
    },
    {
      type: "war",
      position: { row: 0, col: 4 },
      targetPosition: { row: 4, col: 0 },
      color: "red",
      image: "/images/horseman_war.webp",
      mayhemText: "War ignites conflict and bloodshed across all nations.",
    },
    {
      type: "famine",
      position: { row: 4, col: 4 },
      targetPosition: { row: 0, col: 0 },
      color: "purple",
      image: "/images/horseman_famine.webp",
      mayhemText: "Famine withers crops and starves the masses into desperation.",
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
  const [mayhemTexts, setMayhemTexts] = useState<string[]>([])
  const [imageLoadErrors, setImageLoadErrors] = useState<Record<string, boolean>>({})

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

  // Update mayhem texts when horsemen positions change
  useEffect(() => {
    const texts: string[] = []

    horsemen.forEach((horseman) => {
      const { position, targetPosition, mayhemText } = horseman
      if (position.row === targetPosition.row && position.col === targetPosition.col) {
        texts.push(mayhemText)
      }
    })

    setMayhemTexts(texts)
  }, [horsemen])

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
    // If the horseman is already selected, unselect it
    if (selectedHorseman === type) {
      setSelectedHorseman(null)
      setValidMoves([])
      return
    }

    // Cannot select the same horseman that was just moved
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
    // Check if there's a horseman at the clicked position
    const horseman = getHorsemanAt(row, col)

    if (horseman) {
      // If clicking on a horseman, handle selection/deselection
      handleHorsemanSelect(horseman.type)
      return
    }

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
    }
  }

  // Handle image load error
  const handleImageError = (type: HorsemanType) => {
    console.error(`Failed to load image for ${type}: ${horsemen.find((h) => h.type === type)?.image}`)
    setImageLoadErrors((prev) => ({
      ...prev,
      [type]: true,
    }))
  }

  // Get fallback content for horseman
  const getFallbackContent = (type: HorsemanType) => {
    const colorClass =
      type === "death"
        ? "bg-black"
        : type === "pestilence"
          ? "bg-green-800"
          : type === "war"
            ? "bg-red-800"
            : "bg-purple-800"

    return (
      <div
        className={`w-[80px] h-[100px] flex items-center justify-center text-white font-bold ${colorClass} rounded-md`}
      >
        <span className="text-2xl uppercase">{type.charAt(0)}</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center w-full mx-auto">
      <div className="mb-4 text-center">
        <h3 className="text-xl font-pixel text-purple-300 mb-2">Infernal Chess</h3>
        <p className="text-sm font-pixel text-gray-300 mb-4">
          Move each horseman to its target corner. Knights move in L-shapes. You cannot move the same horseman twice in
          a row.
        </p>
      </div>

      {/* Chess board - made larger to fill the width */}
      <div className="grid grid-cols-5 gap-1 bg-gray-900 p-2 rounded-lg shadow-lg w-full">
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
                  relative aspect-square flex items-center justify-center
                  ${tile.visible ? tile.background : "invisible"}
                  ${isSelected ? "ring-2 ring-yellow-400" : ""}
                  ${isValidMove ? "ring-2 ring-yellow-300 cursor-pointer" : ""}
                  ${isError ? "ring-2 ring-red-500 animate-pulse" : ""}
                  transition-all duration-200
                `}
                onClick={() => tile.visible && handleTileClick(rowIndex, colIndex)}
              >
                {horseman && (
                  <div className="flex flex-col items-center">
                    <motion.div
                      className="absolute bottom-0 flex items-end justify-center"
                      style={{ zIndex: 10 }}
                      initial={{ scale: 0.8 }}
                      animate={{ scale: isSelected ? 1.1 : 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="relative w-full h-full">
                        {imageLoadErrors[horseman.type] ? (
                          getFallbackContent(horseman.type)
                        ) : (
                          <img
                            src={horseman.image || "/placeholder.svg"}
                            alt={horseman.type}
                            width={80}
                            height={100}
                            className="pixelated object-contain transform -translate-y-4"
                            onError={() => handleImageError(horseman.type)}
                          />
                        )}
                        <span className="absolute bottom-0 left-0 right-0 text-center text-xs text-white font-pixel capitalize bg-black/50 px-1 rounded">
                          {horseman.type}
                        </span>
                      </div>
                    </motion.div>
                  </div>
                )}
              </div>
            )
          }),
        )}
      </div>

      {/* Mayhem texts */}
      {mayhemTexts.length > 0 && (
        <div className="mt-4 p-3 bg-red-900/50 border border-red-800 rounded-lg text-sm font-pixel text-red-200 w-full">
          {mayhemTexts.map((text, index) => (
            <p key={index} className="mb-1">
              {text}
            </p>
          ))}
        </div>
      )}

      {/* Completion message */}
      {isComplete && (
        <div className="mt-6 p-4 bg-green-900/80 border border-green-700 rounded-lg text-center animate-fadeIn w-full">
          <h3 className="text-xl font-pixel text-green-300 mb-2">Puzzle Complete!</h3>
          <p className="text-sm font-pixel text-green-200">You've successfully arranged the Four Horsemen.</p>
          <p className="text-md font-pixel text-yellow-300 mt-2">The solution is: APOCALYPSE NAUGHT</p>
        </div>
      )}
    </div>
  )
}
