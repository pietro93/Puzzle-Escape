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
  blocks: Block[]
}

interface PyramidOfHanoiPuzzleProps {
  onSolve?: () => void
}

export default function PyramidOfHanoiPuzzle({ onSolve }: PyramidOfHanoiPuzzleProps) {
  // Initialize blocks - all start as squares
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
      blocks: [...initialBlocks].reverse(), // Reverse to have smallest on top
    },
    {
      id: "p2",
      name: "Carving Workshop",
      blocks: [],
    },
    {
      id: "p3",
      name: "Painting Workshop",
      blocks: [],
    },
    {
      id: "p4",
      name: "Construction Site",
      blocks: [],
    },
  ])

  // Track selected block for moving
  const [selectedPegId, setSelectedPegId] = useState<PegId | null>(null)
  const [isPuzzleSolved, setIsPuzzleSolved] = useState(false)

  // Get block image based on shape, size, and color
  const getBlockImage = (block: Block) => {
    // Base size calculation
    const baseSize = block.size * 20

    // Color based on block state
    const bgColor = block.color === "gold" ? "bg-yellow-500" : "bg-stone-500"
    const borderColor = block.color === "gold" ? "border-yellow-300" : "border-stone-400"

    // Shape based on block state
    if (block.shape === "triangle") {
      // Triangle shape (for the top block after carving)
      return (
        <div className="flex justify-center">
          <div
            className="relative"
            style={{
              width: 0,
              height: 0,
              borderLeft: `${baseSize}px solid transparent`,
              borderRight: `${baseSize}px solid transparent`,
              borderBottom: `${baseSize}px solid ${block.color === "gold" ? "#EAB308" : "#78716C"}`,
            }}
          />
        </div>
      )
    } else if (block.shape === "rectangle") {
      // Rectangle shape (for blocks after carving)
      return (
        <div
          className={`${bgColor} ${borderColor} border mx-auto rounded-sm`}
          style={{
            width: baseSize * 2,
            height: baseSize * 0.8,
          }}
        />
      )
    } else {
      // Square shape (for initial blocks)
      return (
        <div
          className={`${bgColor} ${borderColor} border mx-auto`}
          style={{
            width: baseSize * 1.5,
            height: baseSize * 1.5,
          }}
        />
      )
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

    const blockToMove = { ...fromPeg.blocks[fromPeg.blocks.length - 1] } // Get the top block (last in array)

    // Check if move is valid according to Tower of Hanoi rules
    if (toPeg.blocks.length > 0 && blockToMove.size > toPeg.blocks[toPeg.blocks.length - 1].size) {
      return // Silently fail - no alert
    }

    // Process the block based on which peg it's moving to
    if (toPegId === "p2") {
      // Carving workshop - change shape
      // b1 (smallest) becomes triangle, all others become rectangles
      blockToMove.shape = blockToMove.id === "b1" ? "triangle" : "rectangle"
      blockToMove.hasVisitedP2 = true
    } else if (toPegId === "p3") {
      // Painting workshop - change color
      blockToMove.color = "gold"
      blockToMove.hasVisitedP3 = true
    }

    // Remove block from source peg
    fromPeg.blocks.pop() // Remove the top block

    // Add block to destination peg
    toPeg.blocks.push(blockToMove) // Add to the top

    // Update pegs state
    setPegs(newPegs)

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

    // Check if blocks are in the correct order (smallest at top)
    const correctOrder = constructionSite.blocks.every((block, index) => {
      if (index === 0) return true
      return block.size < constructionSite.blocks[index - 1].size
    })

    if (correctOrder) {
      setIsPuzzleSolved(true)
      if (onSolve) onSolve()
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-900 p-4 rounded-lg">
      {/* Game board */}
      <div className="flex flex-col space-y-8">
        {/* Pegs in 2x2 grid */}
        <div className="grid grid-cols-2 gap-8">
          {/* Top row */}
          <div
            className={`flex flex-col items-center p-4 rounded-lg transition-all ${
              selectedPegId === "p1"
                ? "bg-blue-900/50 border border-blue-500"
                : "bg-gray-800/50 hover:bg-gray-700/50 cursor-pointer"
            }`}
            onClick={() => handlePegClick("p1")}
          >
            <h3 className="text-lg font-bold text-center mb-4">Quarry</h3>
            <div className="relative w-full h-48">
              {/* Peg rod */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-2 h-40 bg-gray-600 rounded-full"></div>

              {/* Peg base */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-4 bg-gray-700 rounded-lg"></div>

              {/* Blocks on this peg - stacked from bottom */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col-reverse items-center">
                {pegs[0].blocks.map((block) => (
                  <div key={block.id} className="mb-1">
                    {getBlockImage(block)}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            className={`flex flex-col items-center p-4 rounded-lg transition-all ${
              selectedPegId === "p2"
                ? "bg-blue-900/50 border border-blue-500"
                : "bg-gray-800/50 hover:bg-gray-700/50 cursor-pointer"
            }`}
            onClick={() => handlePegClick("p2")}
          >
            <h3 className="text-lg font-bold text-center mb-4">Carving Workshop</h3>
            <div className="relative w-full h-48">
              {/* Peg rod */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-2 h-40 bg-gray-600 rounded-full"></div>

              {/* Peg base */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-4 bg-gray-700 rounded-lg"></div>

              {/* Blocks on this peg - stacked from bottom */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col-reverse items-center">
                {pegs[1].blocks.map((block) => (
                  <div key={block.id} className="mb-1">
                    {getBlockImage(block)}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div
            className={`flex flex-col items-center p-4 rounded-lg transition-all ${
              selectedPegId === "p3"
                ? "bg-blue-900/50 border border-blue-500"
                : "bg-gray-800/50 hover:bg-gray-700/50 cursor-pointer"
            }`}
            onClick={() => handlePegClick("p3")}
          >
            <h3 className="text-lg font-bold text-center mb-4">Painting Workshop</h3>
            <div className="relative w-full h-48">
              {/* Peg rod */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-2 h-40 bg-gray-600 rounded-full"></div>

              {/* Peg base */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-4 bg-gray-700 rounded-lg"></div>

              {/* Blocks on this peg - stacked from bottom */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col-reverse items-center">
                {pegs[2].blocks.map((block) => (
                  <div key={block.id} className="mb-1">
                    {getBlockImage(block)}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            className={`flex flex-col items-center p-4 rounded-lg transition-all ${
              selectedPegId === "p4"
                ? "bg-blue-900/50 border border-blue-500"
                : "bg-gray-800/50 hover:bg-gray-700/50 cursor-pointer"
            }`}
            onClick={() => handlePegClick("p4")}
          >
            <h3 className="text-lg font-bold text-center mb-4">Construction Site</h3>
            <div className="relative w-full h-48">
              {/* Peg rod */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-2 h-40 bg-gray-600 rounded-full"></div>

              {/* Peg base */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-4 bg-gray-700 rounded-lg"></div>

              {/* Blocks on this peg - stacked from bottom */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col-reverse items-center">
                {pegs[3].blocks.map((block) => (
                  <div key={block.id} className="mb-1">
                    {getBlockImage(block)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Success message */}
        {isPuzzleSolved && (
          <div className="mt-4 text-center">
            <h3 className="text-2xl font-bold text-green-400 animate-pulse">ARCHITECT</h3>
          </div>
        )}
      </div>
    </div>
  )
}
