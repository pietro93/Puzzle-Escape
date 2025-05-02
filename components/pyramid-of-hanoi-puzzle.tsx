"use client"

import { useState } from "react"

// Types for our blocks and pegs
type BlockShape = "square" | "triangle" | "trapezoid"
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
      name: "Quarry\u00A0", // Added non-breaking space to simulate two lines
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

  // Calculate perfect pyramid dimensions with straight diagonal sides
  const getPyramidDimensions = () => {
    // Base width of the largest block (b5)
    const baseWidth = 120

    // Total height of the pyramid (slightly more than base width)
    // Making the total height just slightly more than the base width
    const totalHeight = baseWidth * 1.1

    // Height of each block with specific ratios
    const heightRatios = [0.1, 0.15, 0.2, 0.25, 0.3] // Sum = 1.0

    // For a perfect pyramid with straight diagonal sides:
    // If the base is 100% width, then each layer's width decreases linearly
    // For 5 layers, the widths would be: 100%, 80%, 60%, 40%, 20%
    const blockDimensions = [
      {
        // b1 (top) - 10% of total height
        bottomWidth: baseWidth * 0.2, // 20% of base width
        height: totalHeight * heightRatios[0],
      },
      {
        // b2 - 15% of total height
        topWidth: baseWidth * 0.2, // 20% of base width
        bottomWidth: baseWidth * 0.4, // 40% of base width
        height: totalHeight * heightRatios[1],
      },
      {
        // b3 - 20% of total height
        topWidth: baseWidth * 0.4, // 40% of base width
        bottomWidth: baseWidth * 0.6, // 60% of base width
        height: totalHeight * heightRatios[2],
      },
      {
        // b4 - 25% of total height
        topWidth: baseWidth * 0.6, // 60% of base width
        bottomWidth: baseWidth * 0.8, // 80% of base width
        height: totalHeight * heightRatios[3],
      },
      {
        // b5 (bottom) - 30% of total height
        topWidth: baseWidth * 0.8, // 80% of base width
        bottomWidth: baseWidth, // 100% of base width
        height: totalHeight * heightRatios[4],
      },
    ]

    return blockDimensions
  }

  // Get block dimensions based on ID
  const getBlockDimensions = (blockId: BlockId) => {
    const dimensions = getPyramidDimensions()

    switch (blockId) {
      case "b1":
        return dimensions[0]
      case "b2":
        return dimensions[1]
      case "b3":
        return dimensions[2]
      case "b4":
        return dimensions[3]
      case "b5":
        return dimensions[4]
      default:
        return { bottomWidth: 0, topWidth: 0, height: 0 }
    }
  }

  // Get block image based on shape, size, and color
  const getBlockImage = (block: Block) => {
    // Base size calculation for square blocks - made smaller
    const baseSize = block.size * 10

    // Color based on block state
    const bgColor = block.color === "gold" ? "#EAB308" : "#78716C"
    const borderColor = block.color === "gold" ? "#FDE68A" : "#A8A29E"
    const shadowColor = block.color === "gold" ? "rgba(250, 204, 21, 0.6)" : "rgba(87, 83, 78, 0.6)"

    // For carved blocks, get precise dimensions
    const dimensions = getBlockDimensions(block.id)

    // Shape based on block state
    if (block.shape === "triangle") {
      // Triangle shape (for the top block after carving)
      return (
        <div className="flex justify-center">
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: `${dimensions.bottomWidth / 2}px solid transparent`,
              borderRight: `${dimensions.bottomWidth / 2}px solid transparent`,
              borderBottom: `${dimensions.height}px solid ${bgColor}`,
              filter: `drop-shadow(0 4px 3px ${shadowColor})`, // Shadow only at bottom
            }}
          />
        </div>
      )
    } else if (block.shape === "trapezoid") {
      // Trapezoid shape with precise dimensions for perfect pyramid effect
      return (
        <div className="flex justify-center">
          <div
            style={{
              position: "relative",
              width: `${dimensions.bottomWidth}px`,
              height: `${dimensions.height}px`,
              backgroundColor: bgColor,
              clipPath: dimensions.topWidth
                ? `polygon(${(dimensions.bottomWidth - dimensions.topWidth) / 2}px 0, ${dimensions.bottomWidth - (dimensions.bottomWidth - dimensions.topWidth) / 2}px 0, ${dimensions.bottomWidth}px ${dimensions.height}px, 0 ${dimensions.height}px)`
                : `polygon(${dimensions.bottomWidth / 2}px 0, ${dimensions.bottomWidth / 2}px 0, ${dimensions.bottomWidth}px ${dimensions.height}px, 0 ${dimensions.height}px)`,
              boxShadow: `0 4px 3px ${shadowColor}`, // Shadow only at bottom
            }}
          />
        </div>
      )
    } else {
      // Square shape (for initial blocks) - made smaller
      return (
        <div
          style={{
            width: `${baseSize * 1.3}px`,
            height: `${baseSize * 1.3}px`,
            backgroundColor: bgColor,
            border: `1px solid ${borderColor}`,
            boxShadow: `0 4px 3px ${shadowColor}`, // Shadow only at bottom
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
      // b1 (smallest) becomes triangle, all others become trapezoids
      blockToMove.shape = blockToMove.id === "b1" ? "triangle" : "trapezoid"
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

  // Render a single peg with consistent styling
  const renderPeg = (pegId: PegId) => {
    const peg = pegs.find((p) => p.id === pegId)
    if (!peg) return null

    return (
      <div
        className={`flex flex-col items-center p-4 rounded-lg transition-all ${
          selectedPegId === pegId
            ? "bg-blue-900/50 border border-blue-500"
            : "bg-gray-800/50 hover:bg-gray-700/50 cursor-pointer"
        }`}
        onClick={() => handlePegClick(pegId)}
      >
        <h3 className="text-base font-medium text-center mb-4">
          {peg.id === "p1" ? (
            <>
              Quarry
              <br />
              <span className="opacity-0">_</span>
            </>
          ) : (
            peg.name
          )}
        </h3>
        <div className="relative w-full h-64">
          {/* Peg rod - consistent height and position */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-2 h-48 bg-gray-600 rounded-full bottom-4"></div>

          {/* Peg base - consistent position */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-4 bg-gray-700 rounded-lg"></div>

          {/* Blocks on this peg - stacked from bottom */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col-reverse items-center">
            {peg.blocks.map((block) => (
              <div key={block.id} className="mb-1">
                {getBlockImage(block)}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-900 p-4 rounded-lg">
      {/* Game board */}
      <div className="flex flex-col space-y-8">
        {/* Pegs in 2x2 grid */}
        <div className="grid grid-cols-2 gap-8">
          {/* Top row */}
          {renderPeg("p1")}
          {renderPeg("p2")}

          {/* Bottom row */}
          {renderPeg("p3")}
          {renderPeg("p4")}
        </div>

        {/* Success message */}
        {isPuzzleSolved && (
          <div className="mt-4 text-center">
            <h3 className="text-2xl font-bold text-green-400 animate-pulse">
              The Pharaoh Who Rests in the Smallest of the Three Pyramids Holds The Key
            </h3>
          </div>
        )}
      </div>
    </div>
  )
}
