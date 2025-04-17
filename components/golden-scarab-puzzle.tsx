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

// The correct path sequence (starting and ending at sahara)
const CORRECT_PATH = ["mali", "sahara", "egypt", "hejaz", "songhai", "mali"]

export default function GoldenScarabPuzzle() {
  // Audio hooks
  const { playSound } = useAudio()

  // State for the selected pedestal info popup
  const [selectedPedestal, setSelectedPedestal] = useState<Pedestal | null>(null)

  // State for the scarab position
  const [scarabPosition, setScarabPosition] = useState({ x: 80, y: 20 })

  // State for the current path
  const [path, setPath] = useState<string[]>(["mali"])

  // State for the path segments (for drawing lines)
  const [pathSegments, setPathSegments] = useState<PathSegment[]>([])

  // State for the active pedestal (where the scarab currently is)
  const [activePedestalId, setActivePedestalId] = useState<string>("mali")

  // State for puzzle completion
  const [isPuzzleComplete, setIsPuzzleComplete] = useState(false)

  // State for animation
  const [isAnimating, setIsAnimating] = useState(false)

  // State for the sphinx's riddle
  const [showRiddle, setShowRiddle] = useState(true)

  // State for solution display
  const [showSolution, setShowSolution] = useState(false)

  // Pedestal data
  const pedestals: Pedestal[] = [
    {
      id: "egypt",
      name: "Egypt",
      imageUrl: "/images/golden-scarab/mansa-musa-egypt-pedistal.webp",
      description:
        "Land of towering pyramids and ancient wisdom. The Nile's life-giving waters nurture a civilization of astronomers and architects. Gold adorns the tombs of pharaohs, while hieroglyphs tell stories of gods walking among mortals. Markets bustle with traders from distant lands, exchanging papyrus and precious stones.",
      x: 20,
      y: 20,
    },
    {
      id: "mali",
      name: "Mali",
      imageUrl: "/images/golden-scarab/mansa-musa-mali-pedistal.webp",
      description:
        "A realm of unimaginable wealth, where rivers run with gold dust and griots sing tales of mighty kings. The libraries of Timbuktu hold knowledge from across the world, while salt caravans stretch to the horizon. Warriors ride proud steeds across savanna plains, and merchants count wealth by the handful of precious metals.",
      x: 80,
      y: 20,
    },
    {
      id: "songhai",
      name: "Songhai",
      imageUrl: "/images/golden-scarab/mansa-musa-songhai-pedistal.webp",
      description:
        "Empire of the mighty Niger, where boats of intricate design carry goods to distant shores. Skilled metalworkers forge tools and weapons of remarkable quality, while farmers cultivate fertile floodplains. Scholars debate philosophy under the shade of ancient trees, and musicians play instruments whose melodies enchant all who hear them.",
      x: 80,
      y: 80,
    },
    {
      id: "hejaz",
      name: "Hejaz",
      imageUrl: "/images/golden-scarab/mansa-musa-hejaz-pedistal.webp",
      description:
        "Sacred land where the black cube stands as a beacon to the faithful. Desert winds carry prayers across dunes that shift like ocean waves. Pilgrims from every corner of the world converge in devotion, while merchants exchange spices, silks, and ideas. The night sky reveals stars that guide travelers on their sacred journey.",
      x: 20,
      y: 80,
    },
    {
      id: "sahara",
      name: "Sahara",
      imageUrl: "/images/golden-scarab/mansa-musa-sahara-pedistal.webp",
      description:
        "The great ocean of sand, where caravans navigate by stars across endless golden dunes. Oases appear like mirages, offering sweet water and date palms to weary travelers. Nomadic tribes follow ancient paths known only to those who respect the desert's harsh wisdom. The sun burns with unforgiving intensity by day, while nights bring a cold that chills to the bone.",
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
    // If we're showing the info popup or riddle, don't do anything else
    if (selectedPedestal || showRiddle) {
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

    // If clicking the active pedestal, show info
    if (pedestal.id === activePedestalId) {
      setSelectedPedestal(pedestal)
      return
    }

    // Check if this would be a valid next move
    const isValidNextMove = isValidMove(activePedestalId, pedestal.id)

    if (!isValidNextMove) {
      // Play error sound
      playSound("/audio/wrong.mp3")
      return
    }

    // Move to the next pedestal
    moveToNextPedestal(pedestal)
  }

  // Check if a move is valid
  const isValidMove = (fromId: string, toId: string): boolean => {
    // If we're at mali, we can go to sahara
    if (fromId === "mali" && path.length === 1) {
      return toId === "sahara"
    }

    // If we're at sahara, we can go to egypt
    if (fromId === "sahara" && path.length === 2) {
      return toId === "egypt"
    }

    // If we're at egypt, we can go to hejaz
    if (fromId === "egypt" && path.length === 3) {
      return toId === "hejaz"
    }

    // If we're at hejaz, we can go to songhai
    if (fromId === "hejaz" && path.length === 4) {
      return toId === "songhai"
    }

    // If we're at songhai, we can go back to mali
    if (fromId === "songhai" && path.length === 5) {
      return toId === "mali"
    }

    return false
  }

  // Move the scarab to the next pedestal
  const moveToNextPedestal = (pedestal: Pedestal) => {
    const activePedestal = getPedestalById(activePedestalId)

    if (!activePedestal) return

    // Add to path
    const newPath = [...path, pedestal.id]
    setPath(newPath)

    // Add path segment
    setPathSegments((prev) => [
      ...prev,
      {
        from: activePedestalId,
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

    // Check if the puzzle is complete after this move
    if (newPath.length === CORRECT_PATH.length) {
      const isCorrect = newPath.every((id, index) => id === CORRECT_PATH[index])
      if (isCorrect) {
        setTimeout(() => {
          setIsPuzzleComplete(true)
          playSound("/audio/correct.mp3")
          setShowSolution(true)
        }, 1500) // Wait for animation to complete
      } else {
        // Wrong path - reset after a delay
        setTimeout(() => {
          handleReset()
          playSound("/audio/wrong.mp3")
        }, 1500) // Wait for animation to complete
      }
    }
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

  // Handle closing the info popup
  const handleClosePopup = () => {
    setSelectedPedestal(null)
  }

  // Handle closing the riddle
  const handleCloseRiddle = () => {
    setShowRiddle(false)
    playSound("/audio/button-click.mp3")
  }

  // Handle resetting the puzzle
  const handleReset = () => {
    // Reset to initial state
    setPath(["mali"])
    setPathSegments([])
    setActivePedestalId("mali")
    setScarabPosition({ x: 80, y: 20 })
    setIsPuzzleComplete(false)
    setIsAnimating(false)
    setShowSolution(false)
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

      {/* Solution Display */}
      {showSolution && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-80 text-gold px-8 py-6 rounded-lg text-center z-20 animate-fadeIn">
          <h2 className="text-3xl font-bold text-yellow-400 mb-2 animate-pulse">SUBLIME SPLENDOR</h2>
          <p className="text-yellow-200">The golden scarab has completed its sacred journey!</p>
        </div>
      )}

      {/* Reset Button */}
      <button
        className="absolute top-4 right-4 bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md text-sm"
        onClick={handleReset}
      >
        Reset Puzzle
      </button>

      {/* Sphinx's Riddle Popup */}
      {showRiddle && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-yellow-700 rounded-lg p-6 max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">The Sphinx's Riddle</h2>
            <div className="mb-6 text-gray-200 space-y-4">
              <p>
                "Behold the golden scarab, sacred to the ancients, bearer of wealth and transformation. Guide it along
                the path of the one whose generosity changed the value of gold itself."
              </p>
              <p>
                "From the heart of the endless sands, seek first the land of pyramids, then journey to the sacred cube
                that draws all faithful. Continue to the empire of gold rivers, then to the realm of boat builders on
                the mighty Niger. Finally, return to where your journey began."
              </p>
              <p>
                "Follow the footsteps of history's wealthiest pilgrim, whose journey altered the economies of nations.
                The path must be precise, for the scarab accepts no deviation from the true historical route."
              </p>
              <p className="text-yellow-300 italic">
                "Complete this sacred circuit, and words of power shall be revealed to you."
              </p>
            </div>
            <button
              onClick={handleCloseRiddle}
              className="px-6 py-2 bg-yellow-700 hover:bg-yellow-600 text-white rounded-md transition-colors"
            >
              Begin the Journey
            </button>
          </div>
        </div>
      )}

      {/* Pedestal Info Popup */}
      {selectedPedestal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-yellow-700 rounded-lg p-4 max-w-md">
            <h2 className="text-xl font-bold text-yellow-400 mb-2">{selectedPedestal.name}</h2>
            <div className="relative w-48 h-48 mx-auto mb-4">
              <Image
                src={selectedPedestal.imageUrl || "/placeholder.svg"}
                alt={selectedPedestal.name}
                fill
                className="object-contain"
              />
            </div>
            <p className="text-gray-200 mb-4">{selectedPedestal.description}</p>
            <button
              onClick={handleClosePopup}
              className="mt-2 px-4 py-2 bg-yellow-700 hover:bg-yellow-600 text-white rounded transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
