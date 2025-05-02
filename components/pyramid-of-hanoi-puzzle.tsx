"use client"

import { useState } from "react"

// Types for our blocks and pegs
type BlockShape = "square" | "triangle" | "rectangle"
type BlockColor = "stone" | "gold"
type BlockId = "b1" | "b2" | "b3" | "b4" | "b5"
type PegId = "p1" | "p2" | "p3" | "p4"

interface Block {
  id: BlockId
  size: number
  shape: BlockShape
  color: BlockColor
  hasVisitedP2: boolean
  hasVisitedP3: boolean
}

interface Peg {
  id: PegId
  name: string
  description: string
  blocks: Block[]
}

interface PyramidOfHanoiPuzzleProps {
  onSolve?: () => void
}

export default function PyramidOfHanoiPuzzle({ onSolve }: PyramidOfHanoiPuzzleProps) {
  // Initialize blocks
  const initialBlocks: Block[] = [
    { id: "b1", size: 1, shape: "square", color: "stone", hasVisitedP2: false, hasVisitedP3: false },
    { id: "b2", size: 2, shape: "square", color: "stone", hasVisitedP2: false, hasVisitedP3: false },
    { id: "b3", size: 3, shape: "square", color: "stone", hasVisitedP2: false, hasVisitedP3: false },
    { id: "b4", size: 4, shape: "square", color: "stone", hasVisitedP2: false, hasVisitedP3: false },
    { id: "b5", size: 5, shape: "square", color: "stone", hasVisitedP2: false, hasVisitedP3: false },
  ]

  // Initialize pegs
  const [pegs, setPegs] = useState<Peg[]>([
    {
      id: "p1",
      name: "Quarry",
      description: "Source of stone blocks",
      blocks: [...initialBlocks].reverse(), // Largest at bottom
    },
    {
      id: "p2",
      name: "Carving Workshop",
      description: "Shapes the blocks",
      blocks: [],
    },
    {
      id: "p3",
      name: "Painting Workshop",
      description: "Gilds the blocks",
      blocks: [],
    },
    {
      id: "p4",
      name: "Construction Site",
      description: "Final pyramid location",
      blocks: [],
    },
  ])

  // Track selected block for moving
  const [selectedPegId, setSelectedPegId] = useState<PegId | null>(null)
  const [isPuzzleSolved, setIsPuzzleSolved] = useState(false)
  const [moveCount, setMoveCount] = useState(0)

  // Placeholder images for now
  const getBlockImage = (block: Block) => {
    const baseSize = block.size * 20
    const width = baseSize + 20
    const height = block.shape === "triangle" ? baseSize / 2 : baseSize / 3

    // Color based on block state
    const bgColor = block.color === "gold" ? "bg-yellow-500" : "bg-stone-500"

    // Shape based on block state
    if (block.shape === "triangle") {
      return (
        <div
          className={`relative ${bgColor} mx-auto`}
          style={{
            width: 0,
            height: 0,
            borderLeft: `${width / 2}px solid transparent`,
            borderRight: `${width / 2}px solid transparent`,
            borderBottom: `${height}px solid ${block.color === "gold" ? "#EAB308" : "#78716C"}`,
          }}
        />
      )
    } else if (block.shape === "rectangle") {
      return <div className={`${bgColor} mx-auto rounded-sm`} style={{ width: width, height: height }} />
    } else {
      // Square shape
      return <div className={`${bgColor} mx-auto`} style={{ width: width, height: height }} />
    }
  }

  // Handle selecting a peg
  const handlePegClick = (pegId: PegId) => {
    const peg = pegs.find((p) => p.id === pegId)

    if (!peg) return

    // If no peg is selected, select this one if it has blocks
    if (selectedPegId === null) {
      if (peg.blocks.length > 0) {
        setSelectedPegId(pegId)
      }
      return
    }

    // If this peg is already selected, deselect it
    if (selectedPegId === pegId) {
      setSelectedPegId(null)
      return
    }

    // Try to move block from selected peg to this peg
    moveBlock(selectedPegId, pegId)
    setSelectedPegId(null)
  }

  // Move a block from one peg to another
  const moveBlock = (fromPegId: PegId, toPegId: PegId) => {
    const newPegs = [...pegs]
    const fromPegIndex = newPegs.findIndex((p) => p.id === fromPegId)
    const toPegIndex = newPegs.findIndex((p) => p.id === toPegId)

    if (fromPegIndex === -1 || toPegIndex === -1) return

    const fromPeg = newPegs[fromPegIndex]
    const toPeg = newPegs[toPegIndex]

    // Can't move if from peg is empty
    if (fromPeg.blocks.length === 0) return

    const blockToMove = { ...fromPeg.blocks[0] }

    // Check if move is valid according to Tower of Hanoi rules
    if (toPeg.blocks.length > 0 && blockToMove.size > toPeg.blocks[0].size) {
      alert("You can only place smaller blocks on top of larger ones!")
      return
    }

    // Process the block based on which peg it's moving to
    if (toPegId === "p2") {
      // Carving workshop - change shape
      blockToMove.shape = blockToMove.id === "b1" ? "triangle" : "rectangle"
      blockToMove.hasVisitedP2 = true
    } else if (toPegId === "p3") {
      // Painting workshop - change color
      blockToMove.color = "gold"
      blockToMove.hasVisitedP3 = true
    }

    // Remove block from source peg
    fromPeg.blocks.shift()

    // Add block to destination peg
    toPeg.blocks.unshift(blockToMove)

    // Update pegs state
    setPegs(newPegs)
    setMoveCount(moveCount + 1)

    // Check if puzzle is solved
    checkIfSolved()
  }

  // Check if the puzzle is solved
  const checkIfSolved = () => {
    const constructionSite = pegs.find((p) => p.id === "p4")

    if (!constructionSite) return

    // Check if all blocks are at the construction site
    if (constructionSite.blocks.length !== 5) return

    // Check if all blocks have been processed (visited P2 and P3)
    const allProcessed = constructionSite.blocks.every((block) => block.hasVisitedP2 && block.hasVisitedP3)

    if (!allProcessed) return

    // Check if blocks are in the correct order (largest at bottom)
    const correctOrder = constructionSite.blocks.every((block, index, array) => {
      if (index === array.length - 1) return true
      return block.size < array[index + 1].size
    })

    if (correctOrder) {
      setIsPuzzleSolved(true)
      if (onSolve) onSolve()
    }
  }

  // Reset the puzzle
  const resetPuzzle = () => {
    setPegs([
      {
        id: "p1",
        name: "Quarry",
        description: "Source of stone blocks",
        blocks: [...initialBlocks].reverse(),
      },
      {
        id: "p2",
        name: "Carving Workshop",
        description: "Shapes the blocks",
        blocks: [],
      },
      {
        id: "p3",
        name: "Painting Workshop",
        description: "Gilds the blocks",
        blocks: [],
      },
      {
        id: "p4",
        name: "Construction Site",
        description: "Final pyramid location",
        blocks: [],
      },
    ])
    setSelectedPegId(null)
    setIsPuzzleSolved(false)
    setMoveCount(0)
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-900 p-4 rounded-lg">
      {/* Game board */}
      <div className="flex flex-col space-y-8">
        {/* Pegs */}
        <div className="flex justify-between items-end">
          {pegs.map((peg) => (
            <div
              key={peg.id}
              className={`flex flex-col items-center w-1/4 px-2 pb-2 pt-4 rounded-lg transition-all ${
                selectedPegId === peg.id
                  ? "bg-blue-900/50 border-2 border-blue-500"
                  : "bg-gray-800/50 hover:bg-gray-700/50 cursor-pointer"
              }`}
              onClick={() => handlePegClick(peg.id)}
            >
              {/* Peg name */}
              <h3 className="text-lg font-bold text-center mb-1">{peg.name}</h3>
              <p className="text-xs text-gray-400 text-center mb-4">{peg.description}</p>

              {/* Peg rod */}
              <div className="w-2 h-40 bg-gray-600 rounded-full mb-2"></div>

              {/* Peg base */}
              <div className="w-32 h-4 bg-gray-700 rounded-lg"></div>

              {/* Blocks on this peg */}
              <div className="absolute mt-12">
                {peg.blocks.map((block, index) => (
                  <div key={block.id} className="mb-1" style={{ marginTop: `-${index * 10}px` }}>
                    {getBlockImage(block)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center mt-8">
          <div>
            <button onClick={resetPuzzle} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">
              Reset Puzzle
            </button>
          </div>
          <div className="text-gray-300">Moves: {moveCount}</div>
        </div>

        {/* Instructions */}
        <div className="mt-4 p-4 bg-gray-800 rounded-lg">
          <h3 className="font-bold mb-2">Rules:</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Move blocks between pegs by clicking on a peg with blocks, then clicking on a destination peg.</li>
            <li>You can only place smaller blocks on top of larger ones.</li>
            <li>
              Each block must visit the Carving Workshop (P2) and Painting Workshop (P3) before reaching the
              Construction Site (P4).
            </li>
            <li>
              Your goal is to build a complete pyramid at the Construction Site with all blocks properly processed.
            </li>
          </ul>
        </div>

        {/* Success message */}
        {isPuzzleSolved && (
          <div className="mt-4 p-4 bg-green-900/50 border border-green-500 rounded-lg text-center">
            <h3 className="text-xl font-bold text-green-400">Pyramid Complete!</h3>
            <p>You've successfully built the golden pyramid.</p>
          </div>
        )}
      </div>
    </div>
  )
}
