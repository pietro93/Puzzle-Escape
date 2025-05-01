"use client"

import { useState, useRef } from "react"

interface Pedestal {
  id: string
  name: string
  image: string
  description: string
  position: { x: number; y: number }
}

// Map pedestal IDs to their positions in the layout
const PEDESTAL_POSITIONS = {
  egypt: { x: 50, y: 10 }, // Top center
  sahara: { x: 10, y: 40 }, // Middle left
  hejaz: { x: 90, y: 40 }, // Middle right
  mali: { x: 20, y: 80 }, // Bottom left
  songhai: { x: 80, y: 80 }, // Bottom right
  center: { x: 50, y: 50 }, // Center
}

// Assign a code to each location for path tracking
const LOCATION_CODES = {
  center: "0",
  mali: "1",
  sahara: "2",
  egypt: "3",
  hejaz: "4",
  songhai: "5",
}

// The correct path as a string of location codes
const CORRECT_PATH_CODE = "0123451"

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
  const [pathCode, setPathCode] = useState<string>(LOCATION_CODES.center) // Start with center
  const [showSuccess, setShowSuccess] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [pathSegments, setPathSegments] = useState<{ from: string; to: string }[]>([])

  const handlePedestalClick = (pedestal: Pedestal) => {
    setSelectedPedestal(pedestal)
  }

  const handleScarabMove = (destinationId: string) => {
    // Add to path code
    const newPathCode = pathCode + LOCATION_CODES[destinationId as keyof typeof LOCATION_CODES]
    setPathCode(newPathCode)

    // Add path segment for visualization
    setPathSegments((prev) => [...prev, { from: scarabPosition, to: destinationId }])

    // Move scarab
    setScarabPosition(destinationId)

    // Close pedestal info
    setSelectedPedestal(null)

    // Check if path is complete and correct
    if (destinationId === "center" && newPathCode.length > 1) {
      checkPath(newPathCode)
    }
  }

  const checkPath = (currentPath: string) => {
    console.log("Checking path:", currentPath)
    console.log("Correct path:", CORRECT_PATH_CODE)

    // Check if the path matches the correct sequence
    if (currentPath === CORRECT_PATH_CODE) {
      setShowSuccess(true)
    } else {
      resetJourney()
    }
  }

  const resetJourney = () => {
    setScarabPosition("center")
    setPathCode(LOCATION_CODES.center)
    setPathSegments([])
    setShowHint(true)

    // Hide hint after 3 seconds
    setTimeout(() => {
      setShowHint(false)
    }, 3000)
  }

  return (
    <div
      className="relative w-full h-[500px] bg-amber-950/30 rounded-lg border border-amber-900/50 overflow-hidden flex items-center justify-center"
      ref={containerRef}
    >
      <div className="relative w-[90%] h-[90%]">
        {/* Center position for scarab */}
        <div
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
            <div className="relative w-16 h-16 flex items-center justify-center">
              <img
                src="/images/golden-scarab/golden_scarab.webp"
                alt="Golden Scarab"
                className="w-16 h-16 object-contain"
              />
            </div>
          )}
        </div>

        {/* Render pedestals */}
        {pedestals.map((pedestal) => (
          <div
            key={pedestal.id}
            className="absolute cursor-pointer z-20"
            style={{
              left: `${pedestal.position.x}%`,
              top: `${pedestal.position.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            onClick={() => handlePedestalClick(pedestal)}
          >
            <div className="relative w-16 h-24 flex items-center justify-center">
              <img
                src={pedestal.image || "/placeholder.svg"}
                alt={pedestal.name}
                className="w-16 h-24 object-contain"
              />
              {scarabPosition === pedestal.id && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full">
                  <img
                    src="/images/golden-scarab/golden_scarab.webp"
                    alt="Golden Scarab"
                    className="w-10 h-10 object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Render path lines */}
        {pathSegments.map((segment, index) => {
          const fromPos = PEDESTAL_POSITIONS[segment.from as keyof typeof PEDESTAL_POSITIONS]
          const toPos = PEDESTAL_POSITIONS[segment.to as keyof typeof PEDESTAL_POSITIONS]

          // Calculate angle and length
          const dx = toPos.x - fromPos.x
          const dy = toPos.y - fromPos.y
          const angle = Math.atan2(dy, dx) * (180 / Math.PI)
          const length = Math.sqrt(dx * dx + dy * dy)

          return (
            <div
              key={`path-${index}`}
              className="absolute z-10"
              style={{
                left: `${fromPos.x}%`,
                top: `${fromPos.y}%`,
                width: `${length}%`,
                height: "2px",
                transformOrigin: "left center",
                transform: `rotate(${angle}deg)`,
              }}
            >
              <div className="w-full h-full border-t-2 border-dashed border-yellow-500"></div>

              {/* Arrow */}
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2" style={{ right: "5px" }}>
                <div
                  className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[8px] border-l-yellow-500"
                  style={{ transform: `rotate(0deg)` }}
                ></div>
              </div>
            </div>
          )
        })}

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
                <img
                  src={selectedPedestal.image || "/placeholder.svg"}
                  alt={selectedPedestal.name}
                  className="w-24 h-36 object-contain mb-4"
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
    </div>
  )
}
