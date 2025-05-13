"use client"

import { useState, useEffect } from "react"
import { useAudio } from "@/hooks/use-audio"

export default function InfernalChessPuzzle({ onSolve }: { onSolve?: () => void }) {
  const { playSound } = useAudio()

  // Define the board structure - 5x5 grid
  const [board, setBoard] = useState<Array<Array<string | null>>>(
    Array(5)
      .fill(null)
      .map(() => Array(5).fill(null)),
  )

  // Initialize knights
  const [knights, setKnights] = useState([
    { id: "death", position: [0, 0], target: [4, 4], color: "black", name: "Death" },
    { id: "war", position: [0, 4], target: [4, 0], color: "red", name: "War" },
    { id: "pestilence", position: [4, 0], target: [0, 4], color: "green", name: "Pestilence" },
    { id: "famine", position: [4, 4], target: [0, 0], color: "purple", name: "Famine" },
  ])

  // Track selected knight and last moved knight
  const [selectedKnight, setSelectedKnight] = useState<string | null>(null)
  const [lastMovedKnight, setLastMovedKnight] = useState<string | null>(null)

  // Track completion messages
  const [completionMessages, setCompletionMessages] = useState({
    death: false,
    war: false,
    pestilence: false,
    famine: false,
  })

  // Track if puzzle is solved
  const [isSolved, setIsSolved] = useState(false)

  // Initialize the board with knights
  useEffect(() => {
    const newBoard = Array(5)
      .fill(null)
      .map(() => Array(5).fill(null))
    knights.forEach((knight) => {
      const [row, col] = knight.position
      newBoard[row][col] = knight.id
    })
    setBoard(newBoard)
  }, [])

  // Check if a tile is visible/legal
  const isVisibleTile = (row: number, col: number): boolean => {
    // Center tiles in first/last row/column are visible
    if (row === 0 && col === 2) return true
    if (row === 2 && col === 0) return true
    if (row === 2 && col === 4) return true
    if (row === 4 && col === 2) return true

    // Middle 3x3 grid is visible
    if (row >= 1 && row <= 3 && col >= 1 && col <= 3) return true

    // Corner tiles are visible (for the knights)
    if (row === 0 && col === 0) return true
    if (row === 0 && col === 4) return true
    if (row === 4 && col === 0) return true
    if (row === 4 && col === 4) return true

    return false
  }

  // Calculate legal moves for a knight
  const calculateLegalMoves = (knightId: string) => {
    const knight = knights.find((k) => k.id === knightId)
    if (!knight) return []

    const [row, col] = knight.position
    const possibleMoves = [
      [row + 2, col + 1],
      [row + 2, col - 1],
      [row - 2, col + 1],
      [row - 2, col - 1],
      [row + 1, col + 2],
      [row + 1, col - 2],
      [row - 1, col + 2],
      [row - 1, col - 2],
    ]

    // Filter to only visible tiles that aren't occupied
    return possibleMoves.filter(([r, c]) => {
      // Check if move is within board boundaries
      if (r < 0 || r > 4 || c < 0 || c > 4) return false

      // Check if move is to a visible tile
      if (!isVisibleTile(r, c)) return false

      // Check if move is to an unoccupied tile
      if (board[r][c] !== null) return false

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
    playSound("/audio/button-click.mp3")
  }

  // Handle tile click
  const handleTileClick = (row: number, col: number) => {
    // If a knight is at this position, select it
    if (board[row][col] !== null) {
      handleKnightSelect(board[row][col] as string)
      return
    }

    // If no knight is selected, do nothing
    if (!selectedKnight) return

    // Check if this is a legal move
    const legalMoves = calculateLegalMoves(selectedKnight)
    const isLegalMove = legalMoves.some(([r, c]) => r === row && c === col)

    if (!isLegalMove) {
      playSound("/audio/wrong.mp3")
      return
    }

    // Move the knight
    const newBoard = [...board.map((row) => [...row])]
    const knight = knights.find((k) => k.id === selectedKnight)
    if (!knight) return

    const [oldRow, oldCol] = knight.position
    newBoard[oldRow][oldCol] = null
    newBoard[row][col] = selectedKnight

    // Update knight position
    const newKnights = knights.map((k) => (k.id === selectedKnight ? { ...k, position: [row, col] } : k))

    setBoard(newBoard)
    setKnights(newKnights)
    setLastMovedKnight(selectedKnight)
    setSelectedKnight(null)

    playSound("/audio/button-click.mp3")

    // Check if knight reached target
    const targetKnight = newKnights.find((k) => k.id === selectedKnight)
    if (
      targetKnight &&
      targetKnight.position[0] === targetKnight.target[0] &&
      targetKnight.position[1] === targetKnight.target[1]
    ) {
      setCompletionMessages((prev) => ({
        ...prev,
        [selectedKnight]: true,
      }))
    }

    // Check if puzzle is solved
    setTimeout(checkIfSolved, 100)
  }

  // Check if puzzle is solved
  const checkIfSolved = () => {
    const allKnightsAtTarget = knights.every(
      (knight) => knight.position[0] === knight.target[0] && knight.position[1] === knight.target[1],
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

  // Get knight name at position
  const getKnightAtPosition = (row: number, col: number) => {
    const knightId = board[row][col]
    return knights.find((k) => k.id === knightId)
  }

  // Render the board
  const renderBoard = () => {
    const rows = []

    for (let row = 0; row < 5; row++) {
      const cells = []
      for (let col = 0; col < 5; col++) {
        const isVisible = isVisibleTile(row, col)
        const knightId = board[row][col]
        const knight = knights.find((k) => k.id === knightId)
        const isSelected = selectedKnight === knightId
        const legalMoves = selectedKnight ? calculateLegalMoves(selectedKnight) : []
        const isLegalMove = legalMoves.some(([r, c]) => r === row && c === col)

        cells.push(
          <div
            key={`${row}-${col}`}
            className={`
              w-16 h-16 flex items-center justify-center
              ${isVisible ? ((row + col) % 2 === 0 ? "bg-gray-300" : "bg-gray-500") : "opacity-0"}
              ${isLegalMove ? "border-2 border-yellow-400 cursor-pointer" : ""}
              ${isSelected ? "border-2 border-blue-500" : ""}
              transition-all duration-200
            `}
            onClick={() => isVisible && handleTileClick(row, col)}
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
      rows.push(
        <div key={`row-${row}`} className="flex">
          {cells}
        </div>,
      )
    }

    return rows
  }

  return (
    <div className="flex flex-col items-center p-4 bg-gray-800 rounded-lg shadow-lg">
      {/* Title and instructions */}
      <div className="mb-4 text-center text-white">
        <h3 className="text-lg font-bold mb-2">The Four Horsemen Chess</h3>
        <p className="text-sm mb-4">Move each knight to its opposite corner. Alternate knights each move.</p>
      </div>

      {/* Chess board */}
      <div className="mb-4">{renderBoard()}</div>

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
