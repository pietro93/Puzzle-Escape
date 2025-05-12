"use client"

import { useState, useEffect } from "react"
import { useAudio } from "@/hooks/use-audio"

// Define types
type Position = {
  row: number
  col: number
}

type Knight = {
  id: string
  position: Position
  target: Position
  color: string
  name: string
}

export default function InfernalChessPuzzle({ onSolve }: { onSolve?: () => void }) {
  const { playSound } = useAudio()

  // Initialize knights
  const [knights, setKnights] = useState<Knight[]>([
    { id: "death", position: { row: 0, col: 2 }, target: { row: 4, col: 2 }, color: "black", name: "Death" },
    { id: "war", position: { row: 2, col: 0 }, target: { row: 2, col: 4 }, color: "red", name: "War" },
    { id: "pestilence", position: { row: 2, col: 4 }, target: { row: 2, col: 0 }, color: "green", name: "Pestilence" },
    { id: "famine", position: { row: 4, col: 2 }, target: { row: 0, col: 2 }, color: "purple", name: "Famine" },
  ])

  // Track selected knight and last moved knight
  const [selectedKnight, setSelectedKnight] = useState<string | null>(null)
  const [lastMovedKnight, setLastMovedKnight] = useState<string | null>(null)

  // Track legal moves for selected knight
  const [legalMoves, setLegalMoves] = useState<Position[]>([])

  // Track completion messages
  const [completionMessages, setCompletionMessages] = useState<Record<string, boolean>>({
    death: false,
    war: false,
    pestilence: false,
    famine: false,
  })

  // Track if puzzle is solved
  const [isSolved, setIsSolved] = useState(false)

  // Check if a tile is visible/legal
  const isVisibleTile = (row: number, col: number): boolean => {
    // Center tiles in first/last row/column are visible
    if (row === 0 && col === 2) return true
    if (row === 2 && col === 0) return true
    if (row === 2 && col === 4) return true
    if (row === 4 && col === 2) return true

    // Middle 3x3 grid is visible
    if (row >= 1 && row <= 3 && col >= 1 && col <= 3) return true

    return false
  }

  // Get knight at position
  const getKnightAtPosition = (row: number, col: number): Knight | undefined => {
    return knights.find((knight) => knight.position.row === row && knight.position.col === col)
  }

  // Calculate legal moves for a knight
  const calculateLegalMoves = (knightId: string): Position[] => {
    const knight = knights.find((k) => k.id === knightId)
    if (!knight) return []

    const { row, col } = knight.position
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

    // Filter to only visible tiles that aren't occupied
    return possibleMoves.filter((move) => {
      // Check if move is within board boundaries
      if (move.row < 0 || move.row > 4 || move.col < 0 || move.col > 4) return false

      // Check if move is to a visible tile
      if (!isVisibleTile(move.row, move.col)) return false

      // Check if move is to an unoccupied tile
      if (getKnightAtPosition(move.row, move.col)) return false

      return true
    })
  }

  // Handle knight selection
  const handleKnightSelect = (knightId: string) => {
    // Can't select the same knight twice in a row
    if (knightId === lastMovedKnight) {
      playSound("/audio/wrong.mp3")
      return
    }

    setSelectedKnight(knightId)
    setLegalMoves(calculateLegalMoves(knightId))
    playSound("/audio/button-click.mp3")
  }

  // Handle tile click
  const handleTileClick = (row: number, col: number) => {
    // If a knight is at this position, select it
    const knight = getKnightAtPosition(row, col)
    if (knight) {
      handleKnightSelect(knight.id)
      return
    }

    // If no knight is selected, do nothing
    if (!selectedKnight) return

    // Check if this is a legal move
    const isLegalMove = legalMoves.some((move) => move.row === row && move.col === col)
    if (!isLegalMove) {
      playSound("/audio/wrong.mp3")
      return
    }

    // Move the knight
    setKnights(knights.map((knight) => (knight.id === selectedKnight ? { ...knight, position: { row, col } } : knight)))

    // Update last moved knight
    setLastMovedKnight(selectedKnight)

    // Clear selection
    setSelectedKnight(null)
    setLegalMoves([])

    // Play sound
    playSound("/audio/button-click.mp3")

    // Check if knight reached target
    const movedKnight = knights.find((k) => k.id === selectedKnight)
    if (movedKnight && movedKnight.target.row === row && movedKnight.target.col === col) {
      setCompletionMessages((prev) => ({
        ...prev,
        [selectedKnight]: true,
      }))
    }

    // Check if puzzle is solved (after a short delay to allow state updates)
    setTimeout(checkIfSolved, 100)
  }

  // Check if puzzle is solved
  const checkIfSolved = () => {
    const allKnightsAtTarget = knights.every(
      (knight) => knight.position.row === knight.target.row && knight.position.col === knight.target.col,
    )

    if (allKnightsAtTarget && !isSolved) {
      setIsSolved(true)
      playSound("/audio/correct.mp3")
      if (onSolve) onSolve()
    }
  }

  // Get knight color class
  const getKnightColorClass = (knightId: string): string => {
    switch (knightId) {
      case "death":
        return "bg-black"
      case "war":
        return "bg-red-600"
      case "pestilence":
        return "bg-green-600"
      case "famine":
        return "bg-purple-600"
      default:
        return "bg-gray-800"
    }
  }

  // Get completion message
  const getCompletionMessage = (knightId: string): string => {
    switch (knightId) {
      case "death":
        return "Death has arrived. The reaper's scythe gleams in the infernal light."
      case "war":
        return "War has come. Blood and steel shall reign in this damned realm."
      case "pestilence":
        return "Pestilence spreads. The air fills with the stench of decay and disease."
      case "famine":
        return "Famine consumes all. The land withers as hunger devours hope."
      default:
        return ""
    }
  }

  // Check for knights at targets on initial render
  useEffect(() => {
    knights.forEach((knight) => {
      if (knight.position.row === knight.target.row && knight.position.col === knight.target.col) {
        setCompletionMessages((prev) => ({
          ...prev,
          [knight.id]: true,
        }))
      }
    })

    checkIfSolved()
  }, [])

  // Render the board
  const renderBoard = () => {
    const board = []

    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        // Skip invisible tiles
        if (!isVisibleTile(row, col)) continue

        const knight = getKnightAtPosition(row, col)
        const isLegalMove = legalMoves.some((move) => move.row === row && move.col === col)
        const isSelected =
          selectedKnight &&
          knights.find((k) => k.id === selectedKnight)?.position.row === row &&
          knights.find((k) => k.id === selectedKnight)?.position.col === col

        board.push(
          <div
            key={`${row}-${col}`}
            className={`
              w-16 h-16 flex items-center justify-center
              ${(row + col) % 2 === 0 ? "bg-gray-300" : "bg-gray-500"}
              ${isLegalMove ? "border-2 border-yellow-400 cursor-pointer" : ""}
              ${isSelected ? "border-2 border-blue-500" : ""}
              transition-all duration-200
            `}
            onClick={() => handleTileClick(row, col)}
          >
            {knight && (
              <div className="flex flex-col items-center">
                <div
                  className={`rounded-full ${getKnightColorClass(knight.id)} w-10 h-10 flex items-center justify-center`}
                >
                  <span className="text-white text-xl">♞</span>
                </div>
                <span className="text-xs text-white mt-1">{knight.name}</span>
              </div>
            )}
          </div>,
        )
      }
    }

    return board
  }

  return (
    <div className="flex flex-col items-center p-4 bg-gray-800 rounded-lg shadow-lg">
      {/* Title and instructions */}
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
              <div key={knightId} className="p-2 bg-gray-900 text-white rounded text-sm">
                {getCompletionMessage(knightId)}
              </div>
            ),
        )}
      </div>

      {/* Solution message */}
      {isSolved && (
        <div className="mt-4 p-4 bg-green-800 text-white rounded-lg text-center">
          <p className="font-bold text-lg">The Four Horsemen have completed their eternal cycle.</p>
          <p className="text-yellow-300 font-bold mt-2">APOCALYPSE NAUGHT</p>
          <p className="text-sm mt-2">Type this phrase to proceed.</p>
        </div>
      )}
    </div>
  )
}
