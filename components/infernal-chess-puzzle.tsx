"use client"

import { useState, useEffect } from "react"
import { useAudio } from "@/hooks/use-audio"

// Knight type definition
type Knight = {
  id: string
  row: number
  col: number
  color: string
  target: { row: number; col: number }
  emoji: string
  name: string
}

// Tile type definition
type Tile = {
  row: number
  col: number
}

export default function InfernalChessPuzzle({
  onSolve,
}: {
  onSolve?: () => void
}) {
  const { playSound } = useAudio()

  // Initialize knights
  const [knights, setKnights] = useState<Record<string, Knight>>({
    death: {
      id: "death",
      row: 0,
      col: 0,
      color: "black",
      target: { row: 4, col: 4 },
      emoji: "♞",
      name: "Death",
    },
    pestilence: {
      id: "pestilence",
      row: 4,
      col: 0,
      color: "green",
      target: { row: 0, col: 4 },
      emoji: "♞",
      name: "Pestilence",
    },
    war: {
      id: "war",
      row: 0,
      col: 4,
      color: "red",
      target: { row: 4, col: 0 },
      emoji: "♞",
      name: "War",
    },
    famine: {
      id: "famine",
      row: 4,
      col: 4,
      color: "purple",
      target: { row: 0, col: 0 },
      emoji: "♞",
      name: "Famine",
    },
  })

  // Track the last moved knight to enforce alternating moves
  const [lastMovedKnight, setLastMovedKnight] = useState<string | null>(null)

  // Currently selected knight
  const [selectedKnight, setSelectedKnight] = useState<string | null>(null)

  // Legal moves for the selected knight
  const [legalMoves, setLegalMoves] = useState<Tile[]>([])

  // Puzzle completion state
  const [isPuzzleSolved, setIsPuzzleSolved] = useState(false)

  // Error animation state
  const [errorTile, setErrorTile] = useState<Tile | null>(null)

  // Messages when horsemen reach their targets
  const [completionMessages, setCompletionMessages] = useState<Record<string, boolean>>({
    death: false,
    pestilence: false,
    war: false,
    famine: false,
  })

  // Determine if a tile is invisible
  const isInvisibleTile = (row: number, col: number): boolean => {
    // All tiles with X in the layout are invisible
    if (row === 0 && (col === 1 || col === 2 || col === 3)) return true
    if (row === 4 && (col === 1 || col === 2 || col === 3)) return true
    if (col === 0 && (row === 1 || row === 2 || row === 3)) return true
    if (col === 4 && (row === 1 || row === 2 || row === 3)) return true

    return false
  }

  // Check if a tile is occupied by a knight
  const getKnightAtTile = (row: number, col: number): Knight | null => {
    for (const knight of Object.values(knights)) {
      if (knight.row === row && knight.col === col) {
        return knight
      }
    }
    return null
  }

  // Calculate legal knight moves
  const calculateLegalMoves = (knightId: string): Tile[] => {
    const knight = knights[knightId]
    if (!knight) return []

    const { row, col } = knight
    const possibleMoves = [
      { row: row + 2, col: col + 1 },
      { row: row + 2, col: col - 1 },
      { row: row - 2, col: col + 1 },
      { row: row - 2, col: col - 1 },
      { row: row + 1, col: col + 2 },
      { row: row + 1, col: col - 2 },
      { row: row - 1, col: col + 2 },
      { row: row - 1, col: col - 2 },
    ]

    // Filter out moves that are off the board, on invisible tiles, or occupied
    return possibleMoves.filter((move) => {
      // Check if move is within board boundaries
      if (move.row < 0 || move.row > 4 || move.col < 0 || move.col > 4) return false

      // Check if move is to an invisible tile
      if (isInvisibleTile(move.row, move.col)) return false

      // Check if move is to an occupied tile
      if (getKnightAtTile(move.row, move.col)) return false

      return true
    })
  }

  // Handle knight selection
  const handleKnightSelect = (knightId: string) => {
    // Cannot select the same knight twice in a row
    if (knightId === lastMovedKnight) {
      const knight = knights[knightId]
      setErrorTile({ row: knight.row, col: knight.col })
      playSound("/audio/wrong.mp3")
      setTimeout(() => setErrorTile(null), 500)
      return
    }

    // Play selection sound
    playSound("/audio/button-click.mp3")

    setSelectedKnight(knightId)
    setLegalMoves(calculateLegalMoves(knightId))
  }

  // Handle tile click for movement
  const handleTileClick = (row: number, col: number) => {
    // If no knight is selected, check if there's a knight at this tile
    if (!selectedKnight) {
      const knight = getKnightAtTile(row, col)
      if (knight) {
        handleKnightSelect(knight.id)
      }
      return
    }

    // Check if the clicked tile is a legal move
    const isLegalMove = legalMoves.some((move) => move.row === row && move.col === col)

    if (isLegalMove) {
      // Move the knight
      setKnights((prev) => ({
        ...prev,
        [selectedKnight]: {
          ...prev[selectedKnight],
          row,
          col,
        },
      }))

      // Play move sound
      playSound("/audio/button-click.mp3")

      // Update last moved knight
      setLastMovedKnight(selectedKnight)

      // Clear selection
      setSelectedKnight(null)
      setLegalMoves([])

      // Check if knight reached its target
      setTimeout(() => {
        checkKnightAtTarget(selectedKnight, row, col)
        checkPuzzleSolution()
      }, 300)
    } else {
      // Illegal move - show error animation
      setErrorTile({ row, col })
      playSound("/audio/wrong.mp3")
      setTimeout(() => setErrorTile(null), 500)
    }
  }

  // Check if a knight has reached its target
  const checkKnightAtTarget = (knightId: string, row: number, col: number) => {
    if (!knightId) return

    const knight = knights[knightId]
    if (knight && knight.target.row === row && knight.target.col === col) {
      setCompletionMessages((prev) => ({
        ...prev,
        [knightId]: true,
      }))
    }
  }

  // Check if all knights have reached their targets
  const checkPuzzleSolution = () => {
    const allKnightsAtTargets = Object.values(knights).every((knight) => {
      return knight.row === knight.target.row && knight.col === knight.target.col
    })

    if (allKnightsAtTargets) {
      setIsPuzzleSolved(true)
      playSound("/audio/correct.mp3")
      if (onSolve) {
        onSolve()
      }
    }
  }

  // Get knight background color class
  const getKnightBackgroundClass = (knightId: string): string => {
    switch (knightId) {
      case "death":
        return "bg-black"
      case "pestilence":
        return "bg-green-600"
      case "war":
        return "bg-red-600"
      case "famine":
        return "bg-purple-600"
      default:
        return "bg-gray-900"
    }
  }

  // Determine tile background color
  const getTileBackgroundColor = (row: number, col: number): string => {
    // Corner tiles have special colors based on target knight
    if (row === 0 && col === 0) return "bg-purple-800" // D - Famine's color
    if (row === 4 && col === 0) return "bg-red-800" // P - War's color
    if (row === 0 && col === 4) return "bg-green-800" // W - Pestilence's color
    if (row === 4 && col === 4) return "bg-black" // F - Death's color

    // Other visible tiles alternate between light and dark gray
    return (row + col) % 2 === 0 ? "bg-gray-300" : "bg-gray-500"
  }

  // Get completion message for a knight
  const getCompletionMessage = (knightId: string): string => {
    switch (knightId) {
      case "death":
        return "Death has arrived. The reaper's scythe gleams in the infernal light."
      case "pestilence":
        return "Pestilence spreads. The air fills with the stench of decay and disease."
      case "war":
        return "War has come. Blood and steel shall reign in this damned realm."
      case "famine":
        return "Famine consumes all. The land withers as hunger devours hope."
      default:
        return ""
    }
  }

  // Render the chess board
  const renderBoard = () => {
    const board = []

    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        // Skip invisible tiles
        if (isInvisibleTile(row, col)) continue

        const knight = getKnightAtTile(row, col)
        const isLegalMove = legalMoves.some((move) => move.row === row && move.col === col)
        const isSelected = selectedKnight && knights[selectedKnight].row === row && knights[selectedKnight].col === col
        const isError = errorTile && errorTile.row === row && errorTile.col === col

        board.push(
          <div
            key={`${row}-${col}`}
            className={`
              w-16 h-16 md:w-20 md:h-20 flex items-center justify-center
              ${getTileBackgroundColor(row, col)}
              ${isLegalMove ? "border-4 border-yellow-400 cursor-pointer" : "border border-gray-700"}
              ${isSelected ? "border-4 border-blue-500" : ""}
              ${isError ? "animate-pulse border-4 border-red-500" : ""}
              transition-all duration-200 relative
            `}
            onClick={() => handleTileClick(row, col)}
          >
            {knight && (
              <div className="flex flex-col items-center">
                <div
                  className={`rounded-full ${getKnightBackgroundClass(knight.id)} w-10 h-10 flex items-center justify-center`}
                >
                  <span className="text-white text-2xl">{knight.emoji}</span>
                </div>
                <span className="text-xs text-white mt-1">{knight.name}</span>
              </div>
            )}

            {/* Corner labels */}
            {row === 0 && col === 0 && <div className="absolute top-0 left-0 text-xs text-white font-bold p-1">D</div>}
            {row === 4 && col === 0 && <div className="absolute top-0 left-0 text-xs text-white font-bold p-1">P</div>}
            {row === 0 && col === 4 && <div className="absolute top-0 left-0 text-xs text-white font-bold p-1">W</div>}
            {row === 4 && col === 4 && <div className="absolute top-0 left-0 text-xs text-white font-bold p-1">F</div>}
          </div>,
        )
      }
    }

    return board
  }

  // Check for knights at their targets on initial render
  useEffect(() => {
    Object.entries(knights).forEach(([id, knight]) => {
      if (knight.row === knight.target.row && knight.col === knight.target.col) {
        setCompletionMessages((prev) => ({
          ...prev,
          [id]: true,
        }))
      }
    })
  }, [])

  return (
    <div className="flex flex-col items-center p-4 bg-gray-800 rounded-lg shadow-lg">
      {/* Instructions */}
      <div className="mb-4 text-center text-white">
        <h3 className="text-lg font-bold mb-2">The Four Horsemen Chess</h3>
        <p className="text-sm mb-4">Move each knight to its opposite corner. Alternate knights each move.</p>
      </div>

      {/* Chess board */}
      <div className="grid grid-cols-3 gap-1 mb-4">{renderBoard()}</div>

      {/* Completion messages */}
      <div className="mt-4 w-full space-y-2">
        {Object.entries(completionMessages).map(
          ([knightId, isComplete]) =>
            isComplete && (
              <div key={knightId} className="p-2 bg-gray-900 text-white rounded text-sm animate-fadeIn">
                {getCompletionMessage(knightId)}
              </div>
            ),
        )}
      </div>

      {/* Completion message */}
      {isPuzzleSolved && (
        <div className="mt-4 p-4 bg-green-800 text-white rounded-lg text-center animate-fadeIn">
          <p className="font-bold text-lg">The Four Horsemen have completed their eternal cycle.</p>
          <p className="text-yellow-300 font-bold mt-2">APOCALYPSE NAUGHT</p>
          <p className="text-sm mt-2">Type this phrase to proceed.</p>
        </div>
      )}
    </div>
  )
}
