"use client"
import { useState } from "react"
import Image from "next/image"
import { useAudio } from "@/hooks/use-audio"

// Simple pedestal type
type Pedestal = {
  id: string
  name: string
  imageUrl: string
  description: string
  x: number
  y: number
}

// Path segment type
type PathSegment = {
  from: string
  to: string
  x1: number
  y1: number
  x2: number
  y2: number
}

export default function GoldenScarabPuzzle() {
  // Audio hooks
  const { playSound } = useAudio()

  // State for the selected pedestal info popup
  const [selectedPedestal, setSelectedPedestal] = useState<Pedestal | null>(null)

  // State for the scarab position
  const [scarabPosition, setScarabPosition] = useState({ x: 50, y: 50 })

  // State for the current path
  const [path, setPath] = useState<string[]>([])

  // State for the path segments (for drawing lines)
  const [pathSegments, setPathSegments] = useState<PathSegment[]>([])

  // State for the active pedestal (where the scarab currently is)
  const [activePedestalId, setActivePedestalId] = useState<string | null>("sahara")

  // State for puzzle completion
  const [isPuzzleComplete, setIsPuzzleComplete] = useState(false)

  // State for animation
  const [isAnimating, setIsAnimating] = useState(false)

  // State for hints
  const [showHint, setShowHint] = useState(false)
  const [hintText, setHintText] = useState(
    "Try to create a path that visits all pedestals and returns to the starting point.",
  )

  // Pedestal data
  const pedestals: Pedestal[] = [
    {
      id: "egypt",
      name: "Egypt",
      imageUrl: "/images/golden-scarab/mansa-musa-egypt-pedistal.webp",
      description:
        "The ancient land of pharaohs and pyramids. Mansa Musa visited Egypt during his pilgrimage to Mecca, displaying his immense wealth and generosity.",
      x: 20,
      y: 20,
    },
    {
      id: "mali",
      name: "Mali",
      imageUrl: "/images/golden-scarab/mansa-musa-mali-pedistal.webp",
      description:
        "The Mali Empire, ruled by Mansa Musa, was one of the largest and wealthiest empires in African history, known for its gold and salt trade.",
      x: 80,
      y: 20,
    },
    {
      id: "songhai",
      name: "Songhai",
      imageUrl: "/images/golden-scarab/mansa-musa-songhai-pedistal.webp",
      description:
        "A powerful West African empire that succeeded the Mali Empire. Known for its advanced trading networks along the Niger River.",
      x: 80,
      y: 80,
    },
    {
      id: "hejaz",
      name: "Hejaz",
      imageUrl: "/images/golden-scarab/mansa-musa-hejaz-pedistal.webp",
      description:
        "The region in Arabia containing Mecca and Medina. Mansa Musa's pilgrimage to Mecca in this region became legendary for its extravagance.",
      x: 20,
      y: 80,
    },
    {
      id: "sahara",
      name: "Sahara",
      imageUrl: "/images/golden-scarab/mansa-musa-sahara-pedistal.webp",
      description:
        "The vast desert that Mansa Musa and his caravan crossed during his famous hajj journey, carrying immense amounts of gold that affected economies along the way.",
      x: 50,
      y: 50,
    },
  ]

  // Get a pedestal by ID
  const getPedestalById = (id: string): Pedestal | undefined => {
    return pedestals.find((p) => p.id === id)
  }

  // Handle clicking on a pedestal
  const handlePedestalClick = (pedestal: Pedestal) => {
    // If we're showing the info popup, don't do anything else
    if (selectedPedestal) {
      return
    }

    // If we're animating, don't do anything
    if (isAnimating) {
      return
    }

    // If the puzzle is complete, just show info
    if (isPuzzleComplete) {
      setSelectedPedestal(pedestal)
      return
    }

    // If no active pedestal, set this as active
    if (!activePedestalId) {
      setActivePedestalId(pedestal.id)
      setPath([pedestal.id])
      setScarabPosition({ x: pedestal.x, y: pedestal.y })
      playSound("/audio/button-click.mp3")
      return
    }

    // If clicking the active pedestal, show info
    if (pedestal.id === activePedestalId) {
      setSelectedPedestal(pedestal)
      return
    }

    // Check if this pedestal is already in the path
    if (path.includes(pedestal.id)) {
      // If it's the first pedestal and we've visited all others, complete the circuit
      if (pedestal.id === path[0] && path.length === pedestals.length) {
        moveToNextPedestal(pedestal)
        checkPuzzleCompletion()
      } else {
        // Otherwise, show info about why we can't go there
        setHintText("You've already visited this location. Try to visit all locations before returning to the start.")
        setShowHint(true)
        setTimeout(() => setShowHint(false), 3000)
        playSound("/audio/wrong.mp3")
      }
      return
    }

    // Move to the next pedestal
    moveToNextPedestal(pedestal)
  }

  // Move the scarab to the next pedestal
  const moveToNextPedestal = (pedestal: Pedestal) => {
    const activePedestal = getPedestalById(activePedestalId!)

    if (!activePedestal) return

    // Add to path
    setPath((prev) => [...prev, pedestal.id])

    // Add path segment
    setPathSegments((prev) => [
      ...prev,
      {
        from: activePedestalId!,
        to: pedestal.id,
        x1: activePedestal.x,
        y1: activePedestal.y,
        x2: pedestal.x,
        y2: pedestal.y,
      },
    ])

    // Animate movement
    setIsAnimating(true)

    // Play sound
    playSound("/audio/button-click.mp3")

    // Update active pedestal
    setActivePedestalId(pedestal.id)

    // Animate scarab movement
    animateScarabMovement(activePedestal, pedestal)
  }

  // Animate scarab movement
  const animateScarabMovement = (from: Pedestal, to: Pedestal) => {
    const startTime = Date.now()
    const duration = 1000 // 1 second animation

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Calculate new position using easing
      const easeProgress = easeInOutCubic(progress)
      const newX = from.x + (to.x - from.x) * easeProgress
      const newY = from.y + (to.y - from.y) * easeProgress

      setScarabPosition({ x: newX, y: newY })

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setIsAnimating(false)
      }
    }

    requestAnimationFrame(animate)
  }

  // Easing function for smooth animation
  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  }

  // Check if the puzzle is complete
  const checkPuzzleCompletion = () => {
    // A complete path should:
    // 1. Start and end at the same pedestal
    // 2. Visit all pedestals
    // 3. Form a valid circuit

    if (path.length !== pedestals.length + 1) {
      return
    }

    if (path[0] !== path[path.length - 1]) {
      return
    }

    // Check if all pedestals are visited
    const visitedIds = new Set(path)
    if (visitedIds.size !== pedestals.length) {
      return
    }

    // Puzzle is complete!
    setIsPuzzleComplete(true)
    playSound("/audio/correct.mp3")

    // Show completion message
    setHintText("Congratulations! You've completed Mansa Musa's journey!")
    setShowHint(true)
    setTimeout(() => setShowHint(false), 5000)
  }

  // Handle closing the info popup
  const handleClosePopup = () => {
    setSelectedPedestal(null)
  }

  // Handle resetting the puzzle
  const handleReset = () => {
    // Reset to initial state
    setPath(["sahara"])
    setPathSegments([])
    setActivePedestalId("sahara")
    setScarabPosition({ x: 50, y: 50 })
    setIsPuzzleComplete(false)
    setIsAnimating(false)
    playSound("/audio/button-click.mp3")
  }

  return (
    <div className="relative w-full h-[600px] bg-gray-800 rounded-lg overflow-hidden">
      {/* Map Background */}
      <div className="absolute inset-0">
        <Image src="/images/map-background.png" alt="Map Background" fill className="opacity-50 object-cover" />
      </div>

      {/* Path Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {pathSegments.map((segment, index) => (
          <line
            key={`${segment.from}-${segment.to}-${index}`}
            x1={`${segment.x1}%`}
            y1={`${segment.y1}%`}
            x2={`${segment.x2}%`}
            y2={`${segment.y2}%`}
            stroke="gold"
            strokeWidth="3"
            strokeDasharray={isPuzzleComplete ? "none" : "5,5"}
            className={isPuzzleComplete ? "animate-pulse" : ""}
          />
        ))}
      </svg>

      {/* Golden Scarab */}
      <div
        className={`absolute w-20 h-20 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform ${isAnimating ? "" : "hover:scale-110"}`}
        style={{
          left: `${scarabPosition.x}%`,
          top: `${scarabPosition.y}%`,
          zIndex: 10,
          filter: isPuzzleComplete ? "drop-shadow(0 0 8px gold)" : "none",
        }}
      >
        <Image
          src="/images/golden-scarab/golden_scarab.webp"
          alt="Golden Scarab"
          fill
          className={`object-contain ${isPuzzleComplete ? "animate-pulse" : ""}`}
        />
      </div>

      {/* Pedestals */}
      {pedestals.map((pedestal) => (
        <div
          key={pedestal.id}
          className={`absolute w-24 h-24 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform ${
            activePedestalId === pedestal.id ? "scale-110" : "hover:scale-105"
          }`}
          style={{
            left: `${pedestal.x}%`,
            top: `${pedestal.y}%`,
            zIndex: 5,
            filter: path.includes(pedestal.id) ? "drop-shadow(0 0 5px gold)" : "none",
          }}
          onClick={() => handlePedestalClick(pedestal)}
        >
          <Image src={pedestal.imageUrl || "/placeholder.svg"} alt={pedestal.name} fill className="object-contain" />
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 px-2 py-1 rounded text-xs text-white whitespace-nowrap">
            {pedestal.name}
          </div>
        </div>
      ))}

      {/* Hint Display */}
      {showHint && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white px-4 py-2 rounded-lg max-w-md text-center">
          {hintText}
        </div>
      )}

      {/* Reset Button */}
      <button
        className="absolute top-4 right-4 bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md text-sm"
        onClick={handleReset}
      >
        Reset Puzzle
      </button>

      {/* Hint Button */}
      <button
        className="absolute top-4 left-4 bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md text-sm"
        onClick={() => {
          setHintText(
            "Create a path that visits all locations and returns to where you started. The correct path follows Mansa Musa's historical journey.",
          )
          setShowHint(true)
          setTimeout(() => setShowHint(false), 5000)
        }}
      >
        Hint
      </button>

      {/* Pedestal Info Popup */}
      {selectedPedestal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-gray-700 rounded-lg p-4 max-w-md">
            <h2 className="text-xl font-bold text-white mb-2">{selectedPedestal.name}</h2>
            <div className="relative w-48 h-48 mx-auto mb-4">
              <Image
                src={selectedPedestal.imageUrl || "/placeholder.svg"}
                alt={selectedPedestal.name}
                fill
                className="object-contain"
              />
            </div>
            <p className="text-gray-300 mb-4">{selectedPedestal.description}</p>
            <button
              onClick={handleClosePopup}
              className="mt-2 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
