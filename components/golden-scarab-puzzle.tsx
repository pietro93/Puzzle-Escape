"use client"

import { useState, useRef } from "react"
import Image from "next/image"

interface Position {
  x: number
  y: number
}

interface Pedestal {
  id: string
  name: string
  image: string
  position: Position
  description: string
}

interface Path {
  from: Position
  to: Position
}

interface GoldenScarabPuzzleProps {
  onSolve: () => void
}

export default function GoldenScarabPuzzle({ onSolve }: GoldenScarabPuzzleProps) {
  const [scarabPosition, setScarabPosition] = useState<string>("center")
  const [paths, setPaths] = useState<Path[]>([])
  const [selectedPedestal, setSelectedPedestal] = useState<Pedestal | null>(null)
  const [showPopup, setShowPopup] = useState(false)
  const [visitedSequence, setVisitedSequence] = useState<string[]>([])
  const [isSolved, setIsSolved] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Define the correct path sequence
  const correctSequence = ["mali", "sahara", "egypt", "hejaz", "songhai", "mali", "center"]

  // Define pedestals with their positions and descriptions
  const pedestals: Pedestal[] = [
    {
      id: "mali",
      name: "Land of Gold",
      image: "/images/golden-scarab/mali-pedestal.webp",
      position: { x: 20, y: 40 },
      description:
        "A majestic kingdom where golden lions guard the royal courts. The air is thick with the scent of wealth and prosperity. Rivers flow with gold dust, and the markets bustle with traders from distant lands. The royal palace gleams with precious metals, a testament to the kingdom's vast resources.",
    },
    {
      id: "sahara",
      name: "Great Desert",
      image: "/images/golden-scarab/sahara-pedestal.webp",
      position: { x: 30, y: 70 },
      description:
        "An endless sea of sand where caravans traverse ancient trade routes. The scorching sun beats down on travelers as they navigate the shifting dunes. Oases provide rare respite, their palm trees offering shade to weary merchants. The desert's vastness humbles all who dare to cross it.",
    },
    {
      id: "egypt",
      name: "Land of Pharaohs",
      image: "/images/golden-scarab/egypt-pedestal.webp",
      position: { x: 70, y: 30 },
      description:
        "A civilization built along a life-giving river, where ancient wisdom and artistry flourish. Towering monuments reach toward the heavens, their walls adorned with hieroglyphs telling stories of gods and kings. Scholars gather in great libraries, preserving knowledge that spans millennia. The markets overflow with exotic goods from across the known world.",
    },
    {
      id: "hejaz",
      name: "Holy Land",
      image: "/images/golden-scarab/hejaz-pedestal.webp",
      position: { x: 80, y: 60 },
      description:
        "A sacred place where pilgrims from across the world gather to worship. The black cube stands as the center of faith, draped in gold-embroidered cloth. Devotees circle in prayer, united in their spiritual journey. The air is filled with reverence and the soft murmur of ancient prayers.",
    },
    {
      id: "songhai",
      name: "River Kingdom",
      image: "/images/golden-scarab/songhai-pedestal.webp",
      position: { x: 50, y: 80 },
      description:
        "A realm where mighty vessels sail upon winding waterways, connecting distant markets. The kingdom thrives on trade, its ports bustling with merchants exchanging goods from far-off lands. Skilled craftsmen create intricate works that are sought after throughout the continent. The royal court is a center of learning and culture.",
    },
  ]

  // Center position for the scarab
  const centerPosition: Position = { x: 50, y: 50 }

  // Handle pedestal click
  const handlePedestalClick = (pedestal: Pedestal) => {
    setSelectedPedestal(pedestal)
    setShowPopup(true)
  }

  // Handle scarab movement to a pedestal
  const handleMoveScarab = (pedestal: Pedestal) => {
    // Get the current position (either center or a pedestal)
    const currentPosition =
      scarabPosition === "center"
        ? centerPosition
        : pedestals.find((p) => p.id === scarabPosition)?.position || centerPosition

    // Get the target position
    const targetPosition = pedestal.position

    // Add the path
    setPaths((prev) => [
      ...prev,
      {
        from: currentPosition,
        to: targetPosition,
      },
    ])

    // Update scarab position
    setScarabPosition(pedestal.id)

    // Add to visited sequence
    setVisitedSequence((prev) => [...prev, pedestal.id])

    // Close the popup
    setShowPopup(false)

    // Check if the sequence is correct so far
    checkSequence([...visitedSequence, pedestal.id])
  }

  // Handle returning to center
  const handleReturnToCenter = () => {
    if (scarabPosition === "center") return

    // Get the current position
    const currentPosition = pedestals.find((p) => p.id === scarabPosition)?.position || centerPosition

    // Add the path back to center
    setPaths((prev) => [
      ...prev,
      {
        from: currentPosition,
        to: centerPosition,
      },
    ])

    // Update scarab position
    setScarabPosition("center")

    // Add center to visited sequence
    setVisitedSequence((prev) => [...prev, "center"])

    // Check if the sequence is complete and correct
    checkSequence([...visitedSequence, "center"])
  }

  // Reset the puzzle
  const handleReset = () => {
    setPaths([])
    setScarabPosition("center")
    setVisitedSequence([])
    setIsSolved(false)
    setShowSolution(false)
  }

  // Check if the sequence is correct
  const checkSequence = (sequence: string[]) => {
    // If the sequence is too short, it can't be correct yet
    if (sequence.length < correctSequence.length) return

    // Check if the last 7 items match the correct sequence
    const lastItems = sequence.slice(-correctSequence.length)

    const isCorrect = lastItems.every((item, index) => item === correctSequence[index])

    if (isCorrect) {
      setIsSolved(true)
      setShowSolution(true)
      setTimeout(() => {
        onSolve()
      }, 2000)
    }
  }

  // Draw the paths using SVG
  const renderPaths = () => {
    if (!containerRef.current) return null

    const containerRect = containerRef.current.getBoundingClientRect()
    const containerWidth = containerRect.width
    const containerHeight = containerRect.height

    return (
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
        {paths.map((path, index) => {
          const fromX = (path.from.x / 100) * containerWidth
          const fromY = (path.from.y / 100) * containerHeight
          const toX = (path.to.x / 100) * containerWidth
          const toY = (path.to.y / 100) * containerHeight

          return (
            <line
              key={index}
              x1={fromX}
              y1={fromY}
              x2={toX}
              y2={toY}
              stroke="gold"
              strokeWidth="3"
              strokeDasharray="5,5"
              strokeLinecap="round"
            />
          )
        })}
      </svg>
    )
  }

  return (
    <div className="relative w-full h-[500px] bg-stone-900 rounded-lg overflow-hidden" ref={containerRef}>
      {/* Render paths */}
      {renderPaths()}

      {/* Center scarab position */}
      <div
        className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 z-20"
        style={{
          left: `${centerPosition.x}%`,
          top: `${centerPosition.y}%`,
          width: "80px",
          height: "80px",
        }}
        onClick={handleReturnToCenter}
      >
        {scarabPosition === "center" && (
          <Image
            src="/images/golden-scarab/golden-scarab.webp"
            alt="Golden Scarab"
            width={80}
            height={80}
            className="object-contain"
          />
        )}
        {scarabPosition !== "center" && (
          <div className="w-16 h-16 rounded-full border-2 border-dashed border-yellow-500 flex items-center justify-center text-yellow-500 font-pixel">
            Return
          </div>
        )}
      </div>

      {/* Render pedestals */}
      {pedestals.map((pedestal) => (
        <div
          key={pedestal.id}
          className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${pedestal.position.x}%`,
            top: `${pedestal.position.y}%`,
            width: "60px",
            height: "80px",
          }}
          onClick={() => handlePedestalClick(pedestal)}
        >
          <Image
            src={pedestal.image || "/placeholder.svg"}
            alt={pedestal.name}
            width={60}
            height={80}
            className="object-contain"
          />
          {scarabPosition === pedestal.id && (
            <div className="absolute top-[-30px] left-1/2 transform -translate-x-1/2">
              <Image
                src="/images/golden-scarab/golden-scarab.webp"
                alt="Golden Scarab"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
          )}
        </div>
      ))}

      {/* Pedestal popup */}
      {showPopup && selectedPedestal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-stone-800 rounded-lg p-6 max-w-md w-full border border-yellow-700">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-pixel text-yellow-500">{selectedPedestal.name}</h3>
              <button onClick={() => setShowPopup(false)} className="text-gray-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="flex flex-col items-center mb-4">
              <Image
                src={selectedPedestal.image || "/placeholder.svg"}
                alt={selectedPedestal.name}
                width={100}
                height={140}
                className="object-contain mb-4"
              />
              <p className="text-gray-300 text-sm mb-6">{selectedPedestal.description}</p>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 font-pixel"
              >
                Close
              </button>
              <button
                onClick={() => handleMoveScarab(selectedPedestal)}
                className="px-4 py-2 bg-yellow-700 text-white rounded hover:bg-yellow-600 font-pixel"
              >
                Place Scarab Here
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Solution popup */}
      {showSolution && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-stone-800 rounded-lg p-6 max-w-md w-full border border-yellow-700 animate-fadeIn">
            <h3 className="text-2xl font-pixel text-yellow-500 text-center mb-4">SUBLIME SPLENDOR</h3>
            <p className="text-gray-300 text-center mb-6">
              You have traced the sacred pilgrimage path! The golden scarab has revealed the words of power.
            </p>
            <div className="flex justify-center">
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-yellow-700 text-white rounded hover:bg-yellow-600 font-pixel"
              >
                Reset Puzzle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-70 p-2 rounded text-xs text-gray-300">
        <p>
          Guide the golden scarab along the path of the legendary pilgrimage that changed the course of history. Return
          to the center when you've completed the journey.
        </p>
      </div>
    </div>
  )
}
