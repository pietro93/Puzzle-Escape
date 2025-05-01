"use client"

import { useState, useRef } from "react"
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

export default function GoldenScarabPuzzle() {
  const [pedestals, setPedestals] = useState<Pedestal[]>([
    {
      id: "mali",
      name: "Land of Gold",
      image: "/images/golden-scarab/mansa-musa-mali-pedistal.webp",
      description:
        "A majestic pedestal adorned with a golden lion, symbolizing wealth and power. The base is decorated with intricate patterns reminiscent of West African art.",
      position: { x: 20, y: 40 },
    },
    {
      id: "sahara",
      name: "Great Desert",
      image: "/images/golden-scarab/mansa-musa-sahara-pedistal.webp",
      description:
        "A pedestal depicting a caravan of camels crossing vast sand dunes. The hieroglyphs tell stories of treacherous journeys across the scorching sands.",
      position: { x: 70, y: 20 },
    },
    {
      id: "egypt",
      name: "Land of Pharaohs",
      image: "/images/golden-scarab/mansa-musa-egypt-pedistal.webp",
      description:
        "An ornate pedestal with lotus motifs and ancient symbols. The carvings speak of a civilization that revered the sacred beetle as a symbol of rebirth.",
      position: { x: 80, y: 60 },
    },
    {
      id: "hejaz",
      name: "Holy Land",
      image: "/images/golden-scarab/mansa-musa-hejaz-pedistal.webp",
      description:
        "A sacred black cube rests atop this pedestal. Golden inscriptions in an ancient script encircle its base, speaking of pilgrimages and devotion.",
      position: { x: 60, y: 80 },
    },
    {
      id: "songhai",
      name: "River Kingdom",
      image: "/images/golden-scarab/mansa-musa-songhai-pedistal.webp",
      description:
        "A pedestal featuring a trading vessel, symbolizing commerce along great waterways. The intricate patterns suggest a realm of merchants and scholars.",
      position: { x: 30, y: 70 },
    },
  ])

  const [scarabPosition, setScarabPosition] = useState<string>("center")
  const [selectedPedestal, setSelectedPedestal] = useState<Pedestal | null>(null)
  const [paths, setPaths] = useState<Path[]>([])
  const [showSuccess, setShowSuccess] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

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

  const getPositionStyle = (id: string) => {
    if (id === "center") {
      return { left: "50%", top: "50%", transform: "translate(-50%, -50%)" }
    }

    const pedestal = pedestals.find((p) => p.id === id)
    if (!pedestal) return {}

    return {
      left: `${pedestal.position.x}%`,
      top: `${pedestal.position.y}%`,
      transform: "translate(-50%, -50%)",
    }
  }

  const renderPaths = () => {
    return paths.map((path, index) => {
      const fromPos = getPositionStyle(path.from)
      const toPos = getPositionStyle(path.to)

      // Calculate angle and length for the line
      const fromX = Number.parseFloat(fromPos.left as string) || 50
      const fromY = Number.parseFloat(fromPos.top as string) || 50
      const toX = Number.parseFloat(toPos.left as string) || 50
      const toY = Number.parseFloat(toPos.top as string) || 50

      const angle = (Math.atan2(toY - fromY, toX - fromX) * 180) / Math.PI
      const length = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2))

      return (
        <div
          key={`path-${index}`}
          className="absolute h-0.5 bg-yellow-500 origin-left z-10"
          style={{
            left: `${fromX}%`,
            top: `${fromY}%`,
            width: `${length}%`,
            transform: `rotate(${angle}deg)`,
            borderTop: "2px dashed gold",
          }}
        />
      )
    })
  }

  return (
    <div
      className="relative w-full h-[500px] bg-amber-950/30 rounded-lg border border-amber-900/50 overflow-hidden"
      ref={containerRef}
    >
      {/* Render paths */}
      {renderPaths()}

      {/* Center position for scarab */}
      <div
        className={`absolute cursor-pointer z-20 ${scarabPosition !== "center" ? "border-2 border-dashed border-yellow-500 rounded-full w-16 h-16" : ""}`}
        style={getPositionStyle("center")}
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
          key={pedestal.id}
          className="absolute cursor-pointer z-20"
          style={getPositionStyle(pedestal.id)}
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
