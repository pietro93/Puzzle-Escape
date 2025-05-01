"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"

interface Pedestal {
  id: string
  name: string
  image: string
  description: string
  position: { x: number; y: number }
}

interface Path {
  from: string
  to: string
}

const CORRECT_PATH = [
  { from: "center", to: "mali" },
  { from: "mali", to: "sahara" },
  { from: "sahara", to: "egypt" },
  { from: "egypt", to: "hejaz" },
  { from: "hejaz", to: "songhai" },
  { from: "songhai", to: "mali" },
  { from: "mali", to: "center" },
]

// Map pedestal IDs to their positions in the layout
const PEDESTAL_POSITIONS = {
  egypt: { x: 50, y: 10 }, // Top center
  sahara: { x: 10, y: 40 }, // Middle left
  hejaz: { x: 90, y: 40 }, // Middle right
  mali: { x: 20, y: 80 }, // Bottom left
  songhai: { x: 80, y: 80 }, // Bottom right
  center: { x: 50, y: 50 }, // Center
}

export default function GoldenScarabPuzzle() {
  const [pedestals, setPedestals] = useState<Pedestal[]>([
    {
      id: "mali",
      name: "Land of Gold",
      image: "/images/golden-scarab/mansa-musa-mali-pedistal.webp",
      description:
        "A majestic pedestal adorned with a golden lion, symbolizing wealth and power. The base is decorated with intricate patterns reminiscent of West African art.",
      position: PEDESTAL_POSITIONS.mali,
    },
    {
      id: "sahara",
      name: "Great Desert",
      image: "/images/golden-scarab/mansa-musa-sahara-pedistal.webp",
      description:
        "A pedestal depicting a caravan of camels crossing vast sand dunes. The hieroglyphs tell stories of treacherous journeys across the scorching sands.",
      position: PEDESTAL_POSITIONS.sahara,
    },
    {
      id: "egypt",
      name: "Land of Pharaohs",
      image: "/images/golden-scarab/mansa-musa-egypt-pedistal.webp",
      description:
        "An ornate pedestal with lotus motifs and ancient symbols. The carvings speak of a civilization that revered the sacred beetle as a symbol of rebirth.",
      position: PEDESTAL_POSITIONS.egypt,
    },
    {
      id: "hejaz",
      name: "Holy Land",
      image: "/images/golden-scarab/mansa-musa-hejaz-pedistal.webp",
      description:
        "A sacred black cube rests atop this pedestal. Golden inscriptions in an ancient script encircle its base, speaking of pilgrimages and devotion.",
      position: PEDESTAL_POSITIONS.hejaz,
    },
    {
      id: "songhai",
      name: "River Kingdom",
      image: "/images/golden-scarab/mansa-musa-songhai-pedistal.webp",
      description:
        "A pedestal featuring a trading vessel, symbolizing commerce along great waterways. The intricate patterns suggest a realm of merchants and scholars.",
      position: PEDESTAL_POSITIONS.songhai,
    },
  ])

  const [scarabPosition, setScarabPosition] = useState<string>("center")
  const [selectedPedestal, setSelectedPedestal] = useState<Pedestal | null>(null)
  const [paths, setPaths] = useState<Path[]>([])
  const [showSuccess, setShowSuccess] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [pedestalElements, setPedestalElements] = useState<Record<string, HTMLElement | null>>({})

  // Store references to pedestal DOM elements
  useEffect(() => {
    const elements: Record<string, HTMLElement | null> = {}
    pedestals.forEach((pedestal) => {
      elements[pedestal.id] = document.getElementById(`pedestal-${pedestal.id}`)
    })
    elements["center"] = document.getElementById("scarab-center")
    setPedestalElements(elements)
  }, [pedestals])

  const handlePedestalClick = (pedestal: Pedestal) => {
    setSelectedPedestal(pedestal)
  }

  const handleScarabMove = (destinationId: string) => {
    // Add path
    setPaths((prev) => [...prev, { from: scarabPosition, to: destinationId }])

    // Move scarab
    setScarabPosition(destinationId)

    // Close pedestal info
    setSelectedPedestal(null)

    // Check if path is complete and correct
    if (destinationId === "center") {
      checkPath()
    }
  }

  const checkPath = () => {
    // Check if the path matches the correct sequence
    if (paths.length !== CORRECT_PATH.length) {
      resetJourney()
      return
    }

    for (let i = 0; i < CORRECT_PATH.length; i++) {
      if (paths[i].from !== CORRECT_PATH[i].from || paths[i].to !== CORRECT_PATH[i].to) {
        resetJourney()
        return
      }
    }

    // Path is correct!
    setShowSuccess(true)
  }

  const resetJourney = () => {
    setScarabPosition("center")
    setPaths([])
    setShowHint(true)

    // Hide hint after 3 seconds
    setTimeout(() => {
      setShowHint(false)
    }, 3000)
  }

  const renderPaths = () => {
    return paths.map((path, index) => {
      const fromElement = pedestalElements[path.from]
      const toElement = pedestalElements[path.to]

      if (!fromElement || !toElement || !containerRef.current) return null

      // Get positions relative to the container
      const containerRect = containerRef.current.getBoundingClientRect()
      const fromRect = fromElement.getBoundingClientRect()
      const toRect = toElement.getBoundingClientRect()

      // Calculate center points
      const fromX = fromRect.left + fromRect.width / 2 - containerRect.left
      const fromY = fromRect.top + fromRect.height / 2 - containerRect.top
      const toX = toRect.left + toRect.width / 2 - containerRect.left
      const toY = toRect.top + toRect.height / 2 - containerRect.top

      // Calculate angle and length
      const angle = (Math.atan2(toY - fromY, toX - fromX) * 180) / Math.PI
      const length = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2))

      return (
        <div
          key={`path-${index}`}
          className="absolute z-10"
          style={{
            left: `${fromX}px`,
            top: `${fromY}px`,
            width: `${length}px`,
            height: "2px",
            transformOrigin: "0 0",
            transform: `rotate(${angle}deg)`,
          }}
        >
          {/* Dashed line */}
          <div className="w-full h-full border-t-2 border-dashed border-yellow-500"></div>

          {/* Arrow */}
          <div className="absolute right-0 top-1/2 transform translate-y-[-50%] -translate-x-2">
            <div className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[8px] border-l-yellow-500 transform rotate-0"></div>
          </div>
        </div>
      )
    })
  }

  return (
    <div
      className="relative w-full h-[500px] bg-amber-950/30 rounded-lg border border-amber-900/50 overflow-hidden"
      ref={containerRef}
    >
      {/* Center position for scarab */}
      <div
        id="scarab-center"
        className={`absolute cursor-pointer z-20 ${
          scarabPosition !== "center" ? "border-2 border-dashed border-yellow-500 rounded-full w-16 h-16" : ""
        }`}
        style={{
          left: `${PEDESTAL_POSITIONS.center.x}%`,
          top: `${PEDESTAL_POSITIONS.center.y}%`,
          transform: "translate(-50%, -50%)",
        }}
        onClick={() => scarabPosition !== "center" && handleScarabMove("center")}
      >
        {scarabPosition === "center" && (
          <Image
            src="/images/golden-scarab/golden_scarab.webp"
            alt="Golden Scarab"
            width={80}
            height={80}
            className="transform -translate-x-1/2 -translate-y-1/2"
          />
        )}
      </div>

      {/* Render pedestals */}
      {pedestals.map((pedestal) => (
        <div
          id={`pedestal-${pedestal.id}`}
          key={pedestal.id}
          className="absolute cursor-pointer z-20"
          style={{
            left: `${pedestal.position.x}%`,
            top: `${pedestal.position.y}%`,
            transform: "translate(-50%, -50%)",
          }}
          onClick={() => handlePedestalClick(pedestal)}
        >
          <div className="relative">
            <Image
              src={pedestal.image || "/placeholder.svg"}
              alt={pedestal.name}
              width={60}
              height={100}
              className="transform -translate-x-1/2 -translate-y-1/2"
            />
            {scarabPosition === pedestal.id && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full">
                <Image src="/images/golden-scarab/golden_scarab.webp" alt="Golden Scarab" width={40} height={40} />
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Render paths after pedestals are rendered */}
      {renderPaths()}

      {/* Pedestal info popup */}
      {selectedPedestal && (
        <div className="absolute inset-0 bg-black/80 z-30 flex items-center justify-center p-4">
          <div className="bg-amber-950 border-2 border-yellow-600 rounded-lg p-4 max-w-md">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-yellow-400 text-xl font-pixel">{selectedPedestal.name}</h3>
              <button onClick={() => setSelectedPedestal(null)} className="text-yellow-400 hover:text-yellow-200">
                ✕
              </button>
            </div>

            <div className="flex flex-col items-center mb-4">
              <Image
                src={selectedPedestal.image || "/placeholder.svg"}
                alt={selectedPedestal.name}
                width={120}
                height={200}
                className="mb-4"
              />
              <p className="text-amber-200 text-sm mb-4">{selectedPedestal.description}</p>
            </div>

            {scarabPosition !== selectedPedestal.id && (
              <button
                onClick={() => handleScarabMove(selectedPedestal.id)}
                className="w-full bg-yellow-700 hover:bg-yellow-600 text-yellow-100 font-pixel py-2 rounded"
              >
                Move Scarab Here
              </button>
            )}
          </div>
        </div>
      )}

      {/* Success message */}
      {showSuccess && (
        <div className="absolute inset-0 bg-black/80 z-40 flex items-center justify-center">
          <div className="bg-amber-950 border-2 border-yellow-600 rounded-lg p-6 max-w-md text-center">
            <h3 className="text-yellow-400 text-2xl font-pixel mb-4">Path Completed!</h3>
            <p className="text-amber-200 mb-6">
              You have successfully traced the journey of the golden pilgrim. The words "SUBLIME SPLENDOR" appear in
              glowing hieroglyphs.
            </p>
            <button
              onClick={() => setShowSuccess(false)}
              className="bg-yellow-700 hover:bg-yellow-600 text-yellow-100 font-pixel py-2 px-4 rounded"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Hint message */}
      {showHint && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-amber-950/90 border border-yellow-600 rounded-lg p-3 max-w-md text-center">
          <p className="text-amber-200 text-sm">That is not the correct path. Try again following the hints.</p>
        </div>
      )}
    </div>
  )
}
