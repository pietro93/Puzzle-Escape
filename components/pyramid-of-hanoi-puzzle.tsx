"use client"

import { useState, useEffect } from "react"

// Types for our blocks and pegs
type BlockShape = "square" | "triangle" | "trapezoid"
type BlockColor = "stone" | "gold"
type BlockId = string // Changed to string to support dynamic block IDs
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
  // State for number of blocks
  const [blockCount, setBlockCount] = useState<number>(5)

  // Generate blocks based on count
  const generateBlocks = (count: number): Block[] => {
    return Array.from({ length: count }, (_, i) => ({
      id: `b${i + 1}`,
      size: i + 1,
      shape: "square",
      color: "stone",
      hasVisitedP2: false,
      hasVisitedP3: false,
    })).reverse() // Reverse to have smallest on top
  }

  // Initialize pegs with dynamic block count
  const [pegs, setPegs] = useState<Peg[]>([
    {
      id: "p1",
      name: "Quarry",
      blocks: generateBlocks(blockCount),
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
  const [shineEffect, setShineEffect] = useState(false)

  // Reset the game when block count changes
  useEffect(() => {
    setPegs([
      {
        id: "p1",
        name: "Quarry",
        blocks: generateBlocks(blockCount),
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
    setSelectedPegId(null)
    setIsPuzzleSolved(false)
    setShineEffect(false)
  }, [blockCount])

  // Add shine effect after puzzle is solved
  useEffect(() => {
    if (isPuzzleSolved) {
      setShineEffect(true)
    }
  }, [isPuzzleSolved])

  // Calculate perfect pyramid dimensions with straight diagonal sides
  const getPyramidDimensions = () => {
    // Base width of the largest block
    const baseWidth = 120 - (blockCount > 5 ? (blockCount - 5) * 10 : 0) // Reduce base width for more blocks

    // Total height of the pyramid (slightly more than base width)
    const totalHeight = baseWidth * 1.1

    // Calculate height ratios based on block count
    const heightRatios = Array.from({ length: blockCount }, (_, i) => {
      // Distribute height proportionally, with larger blocks getting more height
      return (i + 1) / ((blockCount * (blockCount + 1)) / 2)
    }).reverse() // Reverse to have smallest blocks with smallest ratios

    // Calculate block dimensions
    const blockDimensions = Array.from({ length: blockCount }, (_, i) => {
      const index = blockCount - i - 1 // Reverse index (largest block = 0)
      const widthRatio = (index + 1) / blockCount // Linear decrease in width

      if (i === 0) {
        // Top block (smallest)
        return {
          bottomWidth: baseWidth * widthRatio,
          height: totalHeight * heightRatios[i],
        }
      } else {
        return {
          topWidth: baseWidth * ((index + 2) / blockCount), // Width of block above
          bottomWidth: baseWidth * widthRatio,
          height: totalHeight * heightRatios[i],
        }
      }
    })

    return blockDimensions
  }

  // Get block dimensions based on ID
  const getBlockDimensions = (blockId: BlockId, isCarved: boolean) => {
    // Extract the number from the block ID (e.g., "b3" -> 3)
    const blockNumber = Number.parseInt(blockId.substring(1))

    // Get the index in the dimensions array (blockNumber - 1)
    const index = blockNumber - 1

    // Get dimensions
    const dimensions = getPyramidDimensions()

    // Check if index is valid
    if (index < 0 || index >= dimensions.length) {
      return { bottomWidth: 0, topWidth: 0, height: 0 }
    }

    const result = dimensions[index]

    // If the block is carved, halve its height
    if (isCarved) {
      return {
        ...result,
        height: result.height * 0.5,
      }
    }

    return result
  }

  // Get block image based on shape, size, and color
  const getBlockImage = (block: Block, pegId: PegId) => {
    // Extract the block number for sizing
    const blockNumber = Number.parseInt(block.id.substring(1))

    // Base size calculation for square blocks - made smaller
    const baseSize = blockNumber * (10 - (blockCount > 5 ? blockCount - 5 : 0))

    // Color based on block state
    const bgColor = block.color === "gold" ? "#EAB308" : "#78716C"
    const borderColor = block.color === "gold" ? "#FDE68A" : "#A8A29E"
    const shadowColor = block.color === "gold" ? "rgba(250, 204, 21, 0.6)" : "rgba(87, 83, 78, 0.6)"

    // For carved blocks, get precise dimensions
    const isCarved = block.shape === "trapezoid" || block.shape === "triangle"
    const dimensions = getBlockDimensions(block.id, isCarved)

    // Add shine effect animation if puzzle is solved and on construction site
    const shineAnimation =
      shineEffect && pegId === "p4" && block.color === "gold"
        ? {
            position: "relative",
            overflow: "hidden",
            "&::after": {
              content: '""',
              position: "absolute",
              top: "-50%",
              left: "-60%",
              width: "20%",
              height: "200%",
              opacity: "0.7",
              transform: "rotate(30deg)",
              background:
                "linear-gradient(to right, rgba(255,255,255,0) 0%,rgba(255,255,255,0.8) 50%,rgba(255,255,255,0) 100%)",
              animation: "shine 3s infinite",
            },
            "@keyframes shine": {
              "0%": { left: "-60%" },
              "100%": { left: "160%" },
            },
          }
        : {}

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
              position: "relative",
              ...(shineAnimation as any),
            }}
            className={shineAnimation ? "shine-effect" : ""}
          >
            {shineAnimation && (
              <style jsx>{`
                @keyframes shine {
                  0% { left: -60%; }
                  100% { left: 160%; }
                }
                .shine-effect::after {
                  content: "";
                  position: absolute;
                  top: 0;
                  left: -60%;
                  width: 20%;
                  height: 100%;
                  background: linear-gradient(to right, rgba(255,255,255,0) 0%,rgba(255,255,255,0.8) 50%,rgba(255,255,255,0) 100%);
                  transform: skewX(-25deg);
                  animation: shine 3s infinite;
                }
              `}</style>
            )}
          </div>
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
            className={shineAnimation ? "shine-effect" : ""}
          >
            {shineAnimation && (
              <style jsx>{`
                @keyframes shine {
                  0% { left: -60%; }
                  100% { left: 160%; }
                }
                .shine-effect::after {
                  content: "";
                  position: absolute;
                  top: 0;
                  left: -60%;
                  width: 20%;
                  height: 100%;
                  background: linear-gradient(to right, rgba(255,255,255,0) 0%,rgba(255,255,255,0.8) 50%,rgba(255,255,255,0) 100%);
                  transform: skewX(-25deg);
                  animation: shine 3s infinite;
                }
              `}</style>
            )}
          </div>
        </div>
      )
    } else {
      // Square shape (for initial blocks) - made smaller
      const width = baseSize * (1.3 - (blockCount > 5 ? (blockCount - 5) * 0.05 : 0))
      return (
        <div
          style={{
            width: `${width}px`,
            height: `${width * 0.8}px`, // Make height slightly less than width
            backgroundColor: bgColor,
            border: `1px solid ${borderColor}`,
            boxShadow: `0 4px 3px ${shadowColor}`, // Shadow only at bottom
            position: "relative",
          }}
          className={shineAnimation ? "shine-effect" : ""}
        >
          {shineAnimation && (
            <style jsx>{`
              @keyframes shine {
                0% { left: -60%; }
                100% { left: 160%; }
              }
              .shine-effect::after {
                content: "";
                position: absolute;
                top: 0;
                left: -60%;
                width: 20%;
                height: 100%;
                background: linear-gradient(to right, rgba(255,255,255,0) 0%,rgba(255,255,255,0.8) 50%,rgba(255,255,255,0) 100%);
                transform: skewX(-25deg);
                animation: shine 3s infinite;
              }
            `}</style>
          )}
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
    if (constructionSite.blocks.length !== blockCount) return

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

  // Get peg colors based on ID
  const getPegColors = (pegId: PegId) => {
    switch (pegId) {
      case "p1": // Quarry - Grey
        return {
          rod: "#6B7280", // gray-500
          base: "#4B5563", // gray-600
        }
      case "p2": // Carving Workshop - Purple
        return {
          rod: "#8B5CF6", // violet-500
          base: "#7C3AED", // violet-600
        }
      case "p3": // Painting Workshop - Dark Blue
        return {
          rod: "#3B82F6", // blue-500
          base: "#2563EB", // blue-600
        }
      case "p4": // Construction Site - Dark rod with golden base
        return {
          rod: "#1F2937", // Very dark gray (almost black)
          base: "#EAB308", // Golden yellow (same as gold blocks)
        }
      default:
        return {
          rod: "#6B7280",
          base: "#4B5563",
        }
    }
  }

  // Render a single peg with consistent styling
  const renderPeg = (pegId: PegId) => {
    const peg = pegs.find((p) => p.id === pegId)
    if (!peg) return null

    const pegColors = getPegColors(pegId)
    const bgColor =
      pegId === "p4" ? "bg-blue-900" : pegId === "p3" ? "bg-blue-800" : pegId === "p2" ? "bg-violet-900" : "bg-gray-800"

    // Calculate peg height based on block count
    const pegHeight = 16 + blockCount * 2 // Increase height for more blocks

    return (
      <div
        className={`flex flex-col items-center p-4 rounded-lg transition-all ${
          selectedPegId === pegId
            ? `${bgColor}/70 border border-blue-500`
            : `${bgColor}/50 hover:${bgColor}/70 cursor-pointer`
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
        <div className={`relative w-full h-${pegHeight}`} style={{ height: `${pegHeight * 0.25}rem` }}>
          {/* Peg rod - dynamic height based on block count */}
          <div
            className="absolute left-1/2 transform -translate-x-1/2 w-2 rounded-full bottom-4"
            style={{
              backgroundColor: pegColors.rod,
              height: `${(pegHeight - 4) * 0.25}rem`,
            }}
          ></div>

          {/* Peg base - consistent position with custom color */}
          <div
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-4 rounded-lg"
            style={{ backgroundColor: pegColors.base }}
          ></div>

          {/* Blocks on this peg - stacked from bottom */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col-reverse items-center">
            {peg.blocks.map((block) => (
              <div key={block.id} className="mb-1">
                {getBlockImage(block, pegId)}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Block count selector
  const renderBlockCountSelector = () => {
    return (
      <div className="flex justify-center mb-6">
        <div className="bg-gray-800 p-2 rounded-lg flex space-x-2">
          <span className="text-gray-300 mr-2 self-center">Blocks:</span>
          {[5, 6, 7, 8].map((count) => (
            <button
              key={count}
              className={`px-3 py-1 rounded ${
                blockCount === count ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
              onClick={() => setBlockCount(count)}
              disabled={isPuzzleSolved}
            >
              {count}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-900 p-4 rounded-lg">
      {/* Block count selector */}
      {renderBlockCountSelector()}

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
            <h3 className="text-2xl font-bold animate-pulse" style={{ color: "#EAB308" }}>
              The Pharaoh Who Rests in the Smallest of the Three Pyramids Holds The Key
            </h3>
          </div>
        )}
      </div>
    </div>
  )
}
