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
  isMoving?: boolean
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
  const [animatingBlock, setAnimatingBlock] = useState<string | null>(null)

  // Get block image based on shape, size, and color
  const getBlockImage = (block: Block) => {
    // Base size calculation - reduced to fit better
    const baseSize = block.size * 12

    // Colors based on block state
    const isGold = block.color === "gold"

    // Base colors
    const baseColor = isGold ? "#F59E0B" : "#78716C"
    const highlightColor = isGold ? "#FCD34D" : "#A8A29E"
    const shadowColor = isGold ? "#B45309" : "#44403C"

    // Animation class for transformations
    const animationClass = animatingBlock === block.id ? "animate-pulse" : ""

    // 3D effect styles
    const commonStyles = {
      transition: "all 0.3s ease-in-out",
      boxShadow: `0 4px 6px rgba(0, 0, 0, 0.3), inset 0 -2px 5px ${shadowColor}, inset 0 2px 5px ${highlightColor}`,
      transform: "perspective(500px) rotateX(10deg)",
    }

    // Shape based on block state
    if (block.shape === "triangle") {
      // 3D Triangle shape (for the top block after carving)
      return (
        <div className={`flex justify-center ${animationClass}`}>
          <div
            style={{
              position: "relative",
              width: `${baseSize * 2}px`,
              height: `${baseSize * 1.2}px`,
              transformStyle: "preserve-3d",
              transform: "perspective(500px) rotateX(10deg)",
            }}
          >
            {/* Front face (triangle) */}
            <div
              style={{
                position: "absolute",
                width: 0,
                height: 0,
                borderLeft: `${baseSize}px solid transparent`,
                borderRight: `${baseSize}px solid transparent`,
                borderBottom: `${baseSize * 1.2}px solid ${baseColor}`,
                filter: `drop-shadow(0 4px 3px rgba(0, 0, 0, 0.3))`,
              }}
            />

            {/* Light reflection */}
            <div
              style={{
                position: "absolute",
                width: 0,
                height: 0,
                borderLeft: `${baseSize * 0.8}px solid transparent`,
                borderRight: `${baseSize * 0.8}px solid transparent`,
                borderBottom: `${baseSize}px solid ${highlightColor}`,
                opacity: 0.3,
                transform: "translateX(10%) translateY(10%)",
                filter: "blur(2px)",
              }}
            />
          </div>
        </div>
      )
    } else if (block.shape === "trapezoid") {
      // 3D Trapezoid shape (for blocks after carving)
      // Calculate the top width as a percentage of the bottom width
      const topWidthPercent = 70 - block.size * 5
      const bottomWidth = baseSize * 2
      const topWidth = bottomWidth * (topWidthPercent / 100)
      const height = baseSize * 0.8

      return (
        <div className={`flex justify-center ${animationClass}`}>
          <div
            style={{
              position: "relative",
              width: `${bottomWidth}px`,
              height: `${height}px`,
              transformStyle: "preserve-3d",
              ...commonStyles,
            }}
          >
            {/* Main trapezoid */}
            <div
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                backgroundColor: baseColor,
                clipPath: `polygon(${(bottomWidth - topWidth) / 2}px 0, ${
                  bottomWidth - (bottomWidth - topWidth) / 2
                }px 0, ${bottomWidth}px ${height}px, 0 ${height}px)`,
              }}
            />

            {/* Top highlight */}
            <div
              style={{
                position: "absolute",
                width: "100%",
                height: "30%",
                background: `linear-gradient(to bottom, ${highlightColor}, transparent)`,
                opacity: 0.3,
                clipPath: `polygon(${(bottomWidth - topWidth) / 2}px 0, ${
                  bottomWidth - (bottomWidth - topWidth) / 2
                }px 0, ${bottomWidth - (bottomWidth - topWidth) / 4}px ${height * 0.3}px, ${
                  (bottomWidth - topWidth) / 4
                }px ${height * 0.3}px)`,
              }}
            />

            {/* Bottom shadow */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                width: "100%",
                height: "40%",
                background: `linear-gradient(to top, ${shadowColor}, transparent)`,
                opacity: 0.3,
                clipPath: `polygon(${(bottomWidth - topWidth) / 4}px ${height * 0.6}px, ${
                  bottomWidth - (bottomWidth - topWidth) / 4
                }px ${height * 0.6}px, ${bottomWidth}px ${height}px, 0 ${height}px)`,
              }}
            />

            {/* Left side shadow */}
            <div
              style={{
                position: "absolute",
                width: "20%",
                height: "100%",
                background: `linear-gradient(to right, ${shadowColor}, transparent)`,
                opacity: 0.3,
                clipPath: `polygon(0 ${height}px, ${(bottomWidth - topWidth) / 2}px 0, ${
                  (bottomWidth - topWidth) / 2 + bottomWidth * 0.2
                }px 0, ${bottomWidth * 0.2}px ${height}px)`,
              }}
            />
          </div>
        </div>
      )
    } else {
      // 3D Square shape (for initial blocks)
      return (
        <div className={`flex justify-center ${animationClass}`}>
          <div
            style={{
              position: "relative",
              width: `${baseSize * 1.5}px`,
              height: `${baseSize * 1.5}px`,
              backgroundColor: baseColor,
              ...commonStyles,
            }}
          >
            {/* Top highlight */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "30%",
                background: `linear-gradient(to bottom, ${highlightColor}, transparent)`,
                opacity: 0.3,
              }}
            />

            {/* Bottom shadow */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                height: "30%",
                background: `linear-gradient(to top, ${shadowColor}, transparent)`,
                opacity: 0.3,
              }}
            />

            {/* Left side shadow */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "30%",
                height: "100%",
                background: `linear-gradient(to right, ${shadowColor}, transparent)`,
                opacity: 0.2,
              }}
            />

            {/* Right side highlight */}
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "30%",
                height: "100%",
                background: `linear-gradient(to left, ${highlightColor}, transparent)`,
                opacity: 0.1,
              }}
            />
          </div>
        </div>
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

      // Trigger animation for shape change
      setAnimatingBlock(blockToMove.id)
      setTimeout(() => setAnimatingBlock(null), 500)
    } else if (toPegId === "p3") {
      // Painting workshop - change color
      blockToMove.color = "gold"
      blockToMove.hasVisitedP3 = true

      // Trigger animation for color change
      setAnimatingBlock(blockToMove.id)
      setTimeout(() => setAnimatingBlock(null), 500)
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

  // Render the completed pyramid with a special effect when solved
  const renderCompletedPyramid = () => {
    if (!isPuzzleSolved) return null

    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="relative w-64 h-64 animate-pulse"
          style={{
            animation: "glow 2s infinite alternate",
          }}
        >
          <style jsx>{`
            @keyframes glow {
              from {
                filter: drop-shadow(0 0 5px rgba(245, 158, 11, 0.5));
              }
              to {
                filter: drop-shadow(0 0 20px rgba(245, 158, 11, 0.8));
              }
            }
          `}</style>
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
          <div
            className={`flex flex-col items-center p-4 rounded-lg transition-all ${
              selectedPegId === "p1"
                ? "bg-blue-900/50 border border-blue-500"
                : "bg-gray-800/50 hover:bg-gray-700/50 cursor-pointer"
            }`}
            onClick={() => handlePegClick("p1")}
          >
            <h3 className="text-lg font-bold text-center mb-4">Quarry</h3>
            <div className="relative w-full h-64">
              {/* Peg rod */}
              <div
                className="absolute left-1/2 transform -translate-x-1/2 w-2 h-48 rounded-full"
                style={{
                  background: "linear-gradient(to bottom, #9CA3AF, #4B5563)",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
              ></div>

              {/* Peg base */}
              <div
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-4 rounded-lg"
                style={{
                  background: "linear-gradient(to right, #374151, #6B7280, #374151)",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.3), inset 0 2px 2px rgba(255,255,255,0.1)",
                }}
              ></div>

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
            <div className="relative w-full h-64">
              {/* Peg rod */}
              <div
                className="absolute left-1/2 transform -translate-x-1/2 w-2 h-48 rounded-full"
                style={{
                  background: "linear-gradient(to bottom, #9CA3AF, #4B5563)",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
              ></div>

              {/* Peg base */}
              <div
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-4 rounded-lg"
                style={{
                  background: "linear-gradient(to right, #374151, #6B7280, #374151)",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.3), inset 0 2px 2px rgba(255,255,255,0.1)",
                }}
              ></div>

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
            <div className="relative w-full h-64">
              {/* Peg rod */}
              <div
                className="absolute left-1/2 transform -translate-x-1/2 w-2 h-48 rounded-full"
                style={{
                  background: "linear-gradient(to bottom, #9CA3AF, #4B5563)",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
              ></div>

              {/* Peg base */}
              <div
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-4 rounded-lg"
                style={{
                  background: "linear-gradient(to right, #374151, #6B7280, #374151)",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.3), inset 0 2px 2px rgba(255,255,255,0.1)",
                }}
              ></div>

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
            <div className="relative w-full h-64">
              {/* Peg rod */}
              <div
                className="absolute left-1/2 transform -translate-x-1/2 w-2 h-48 rounded-full"
                style={{
                  background: "linear-gradient(to bottom, #9CA3AF, #4B5563)",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
              ></div>

              {/* Peg base */}
              <div
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-4 rounded-lg"
                style={{
                  background: "linear-gradient(to right, #374151, #6B7280, #374151)",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.3), inset 0 2px 2px rgba(255,255,255,0.1)",
                }}
              ></div>

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
            <h3
              className="text-2xl font-bold animate-pulse"
              style={{
                color: "#F59E0B",
                textShadow: "0 0 10px rgba(245, 158, 11, 0.7), 0 0 20px rgba(245, 158, 11, 0.5)",
              }}
            >
              ARCHITECT
            </h3>
          </div>
        )}
      </div>

      {/* Render the completed pyramid effect when solved */}
      {renderCompletedPyramid()}
    </div>
  )
}
