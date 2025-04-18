"use client"

import { useState } from "react"
import { motion } from "framer-motion"

// Define the pedestal data structure
interface Pedestal {
  id: string
  name: string
  image: string
  description: string
  position: { x: number; y: number }
}

// Define the path segment data structure
interface PathSegment {
  from: string
  to: string
  points: { x: number; y: number }[]
}

interface GoldenScarabPuzzleProps {
  onSolve: () => void
}

export default function GoldenScarabPuzzle({ onSolve }: GoldenScarabPuzzleProps) {
  // Center position for the scarab
  const centerPosition = { x: 50, y: 50 }

  // Define the pedestals
  const pedestals: Pedestal[] = [
    {
      id: "mali",
      name: "Mali",
      image: "/images/golden-scarab/mansa-musa-mali-pedistal.webp",
      description:
        "A majestic pedestal adorned with a golden lion, symbol of royalty and power. The intricate patterns suggest a wealthy kingdom where gold flows abundantly.",
      position: { x: 20, y: 75 },
    },
    {
      id: "sahara",
      name: "Sahara",
      image: "/images/golden-scarab/mansa-musa-sahara-pedistal.webp",
      description:
        "A pedestal depicting the vast desert with caravans of camels traversing the golden sands. The ancient trade routes that connected civilizations are carved into its base.",
      position: { x: 15, y: 25 },
    },
    {
      id: "egypt",
      name: "Egypt",
      image: "/images/golden-scarab/mansa-musa-egypt-pedistal.webp",
      description:
        "A pedestal crowned with a lotus flower, the ancient symbol of rebirth. Hieroglyphic patterns adorn its surface, telling tales of a civilization that revered the scarab.",
      position: { x: 80, y: 20 },
    },
    {
      id: "hejaz",
      name: "Hejaz",
      image: "/images/golden-scarab/mansa-musa-hejaz-pedistal.webp",
      description:
        "A sacred pedestal featuring a black cube with golden inscriptions. It represents the holiest site of pilgrimage, where countless faithful have journeyed for centuries.",
      position: { x: 85, y: 60 },
    },
    {
      id: "songhai",
      name: "Songhai",
      image: "/images/golden-scarab/mansa-musa-songhai-pedistal.webp",
      description:
        "A pedestal topped with a boat, symbolizing the great river civilization. The intricate carvings suggest a realm of trade and cultural exchange.",
      position: { x: 50, y: 85 },
    },
  ]

  // State for the current position of the scarab
  const [scarabPosition, setScarabPosition] = useState<string>("center")

  // State for the path segments
  const [pathSegments, setPathSegments] = useState<PathSegment[]>([])

  // State for the selected pedestal (for the popup)
  const [selectedPedestal, setSelectedPedestal] = useState<Pedestal | null>(null)

  // State to track the journey
  const [journey, setJourney] = useState<string[]>(["center"])

  // State to track if the puzzle is solved
  const [isSolved, setIsSolved] = useState(false)

  // The correct path
  const correctPath = ["center", "mali", "sahara", "egypt", "hejaz", "songhai", "mali", "center"]

  // Function to check if the current journey matches the correct path
  const checkPath = (newJourney: string[]) => {
    // Only check if we've returned to center and have at least made some moves
    if (newJourney[newJourney.length - 1] === "center" && newJourney.length > 2) {
      // Check if the journey matches the correct path
      if (newJourney.length === correctPath.length) {
        let isCorrect = true
        for (let i = 0; i < correctPath.length; i++) {
          if (newJourney[i] !== correctPath[i]) {
            isCorrect = false
            break
          }
        }

        if (isCorrect && !isSolved) {
          setIsSolved(true)
          onSolve()
        }
      }
    }
  }

  // Function to handle clicking on a pedestal
  const handlePedestalClick = (pedestal: Pedestal) => {
    // Show the pedestal details
    setSelectedPedestal(pedestal)
  }

  // Function to handle moving the scarab to a pedestal
  const handleMoveScarab = (pedestalId: string) => {
    // Close the popup if open
    setSelectedPedestal(null)

    // If already at this position, do nothing
    if (scarabPosition === pedestalId) return

    // Get the current position coordinates
    let fromCoords
    if (scarabPosition === "center") {
      fromCoords = centerPosition
    } else {
      const fromPedestal = pedestals.find((p) => p.id === scarabPosition)
      fromCoords = fromPedestal ? fromPedestal.position : centerPosition
    }

    // Get the target position coordinates
    let toCoords
    if (pedestalId === "center") {
      toCoords = centerPosition
    } else {
      const toPedestal = pedestals.find((p) => p.id === pedestalId)
      toCoords = toPedestal ? toPedestal.position : centerPosition
    }

    // Create a new path segment
    const newSegment: PathSegment = {
      from: scarabPosition,
      to: pedestalId,
      points: [fromCoords, toCoords],
    }

    // Update the path segments
    setPathSegments([...pathSegments, newSegment])

    // Update the scarab position
    setScarabPosition(pedestalId)

    // Update the journey
    const newJourney = [...journey, pedestalId]
    setJourney(newJourney)

    // Check if the puzzle is solved
    checkPath(newJourney)
  }

  // Function to reset the puzzle
  const handleReset = () => {
    if (scarabPosition !== "center") {
      handleMoveScarab("center")
    } else {
      // If already at center, clear the path
      setPathSegments([])
      setJourney(["center"])
    }
  }

  // Function to close the pedestal details popup
  const closePopup = () => {
    setSelectedPedestal(null)
  }

  // Draw the path using SVG
  const renderPath = () => {
    return (
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
        {pathSegments.map((segment, index) => {
          const start = segment.points[0]
          const end = segment.points[1]

          return (
            <line
              key={index}
              x1={`${start.x}%`}
              y1={`${start.y}%`}
              x2={`${end.x}%`}
              y2={`${end.y}%`}
              stroke="gold"
              strokeWidth="3"
              strokeDasharray="5,5"
              className="animate-dash"
            />
          )
        })}
      </svg>
    )
  }

  // Render the scarab at its current position
  const renderScarab = () => {
    let position

    if (scarabPosition === "center") {
      position = centerPosition
    } else {
      const pedestal = pedestals.find((p) => p.id === scarabPosition)
      position = pedestal ? pedestal.position : centerPosition
    }

    return (
      <motion.div
        className="absolute z-20 w-16 h-16 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
        }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <img
          src="/images/golden-scarab/golden_scarab.webp"
          alt="Golden Scarab"
          className="w-full h-full object-contain"
          onClick={handleReset}
        />
      </motion.div>
    )
  }

  return (
    <div className="relative w-full h-[500px] bg-purple-900/30 rounded-lg overflow-hidden border border-amber-600/50">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-900/20 to-purple-900/30"></div>

      {/* Center position marker */}
      <div
        className={`absolute z-10 w-12 h-12 rounded-full ${scarabPosition === "center" ? "bg-transparent" : "bg-amber-600/30 border-2 border-dashed border-amber-400 animate-pulse cursor-pointer"}`}
        style={{
          left: `${centerPosition.x}%`,
          top: `${centerPosition.y}%`,
          transform: "translate(-50%, -50%)",
        }}
        onClick={() => handleMoveScarab("center")}
      ></div>

      {/* Render the pedestals */}
      {pedestals.map((pedestal) => (
        <div
          key={pedestal.id}
          className="absolute w-16 h-16 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform"
          style={{
            left: `${pedestal.position.x}%`,
            top: `${pedestal.position.y}%`,
          }}
          onClick={() => handlePedestalClick(pedestal)}
        >
          <img
            src={pedestal.image || "/placeholder.svg"}
            alt={pedestal.name}
            className="w-full h-full object-contain"
          />
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-xs text-amber-200 font-pixel whitespace-nowrap">
            {pedestal.name}
          </div>
        </div>
      ))}

      {/* Render the path */}
      {renderPath()}

      {/* Render the scarab */}
      {renderScarab()}

      {/* Pedestal details popup */}
      {selectedPedestal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={closePopup}>
          <motion.div
            className="relative bg-amber-900/90 p-4 rounded-lg max-w-md border-2 border-amber-600"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-pixel text-amber-200 mb-2">{selectedPedestal.name}</h3>
            <div className="flex items-center mb-4">
              <img
                src={selectedPedestal.image || "/placeholder.svg"}
                alt={selectedPedestal.name}
                className="w-24 h-24 object-contain mr-4"
              />
              <p className="text-amber-100 font-pixel text-sm">{selectedPedestal.description}</p>
            </div>
            <div className="flex justify-between">
              <button
                className="px-4 py-2 bg-amber-700 text-amber-200 rounded font-pixel hover:bg-amber-600 transition-colors"
                onClick={closePopup}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-amber-700 text-amber-200 rounded font-pixel hover:bg-amber-600 transition-colors"
                onClick={() => handleMoveScarab(selectedPedestal.id)}
              >
                Move Scarab Here
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-2 left-2 right-2 bg-black/50 p-2 rounded text-xs text-amber-200 font-pixel">
        <p>
          Click on a pedestal to learn about it. Move the scarab to trace the path of the pilgrimage. Click the scarab
          to return to the center and reset.
        </p>
      </div>

      {/* Journey tracker (hidden, for debugging) */}
      {/* <div className="absolute top-2 left-2 bg-black/50 p-2 rounded text-xs text-white">
        {journey.join(" → ")}
      </div> */}

      {/* Success message */}
      {isSolved && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-30">
          <motion.div
            className="bg-amber-900/90 p-4 rounded-lg max-w-md border-2 border-amber-600 text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl font-pixel text-amber-200 mb-2">Path Discovered!</h3>
            <p className="text-amber-100 font-pixel text-sm mb-4">
              You have traced the legendary pilgrimage route of the wealthiest ruler in history. His journey of sublime
              splendor changed the economies of every land he visited.
            </p>
            <div className="flex justify-center">
              <button
                className="px-4 py-2 bg-amber-700 text-amber-200 rounded font-pixel hover:bg-amber-600 transition-colors"
                onClick={() => {
                  // This is handled by the parent component
                }}
              >
                Continue
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
