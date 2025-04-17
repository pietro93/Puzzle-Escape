"use client"
import { useState } from "react"
import Image from "next/image"

interface Pedestal {
  id: string
  name: string
  imageUrl: string
  description: string
  x: number
  y: number
}

export default function GoldenScarabPuzzle() {
  const [pedestals, setPedestals] = useState<Pedestal[]>([
    {
      id: "egypt",
      name: "Egypt",
      imageUrl: "/images/golden-scarab/mansa-musa-egypt-pedistal.webp",
      description: "A pedestal representing ancient Egypt, land of pharaohs and pyramids.",
      x: 20,
      y: 20,
    },
    {
      id: "mali",
      name: "Mali",
      imageUrl: "/images/golden-scarab/mansa-musa-mali-pedistal.webp",
      description: "A pedestal representing the Mali empire, known for its wealth and culture.",
      x: 80,
      y: 20,
    },
    {
      id: "songhai",
      name: "Songhai",
      imageUrl: "/images/golden-scarab/mansa-musa-songhai-pedistal.webp",
      description: "A pedestal representing the Songhai empire, a major power in West Africa.",
      x: 80,
      y: 80,
    },
    {
      id: "hejaz",
      name: "Hejaz",
      imageUrl: "/images/golden-scarab/mansa-musa-hejaz-pedistal.webp",
      description: "A pedestal representing Hejaz, the region in Arabia containing Mecca and Medina.",
      x: 20,
      y: 80,
    },
    {
      id: "sahara",
      name: "Sahara",
      imageUrl: "/images/golden-scarab/mansa-musa-sahara-pedistal.webp",
      description: "A pedestal representing the Sahara desert, a vast and formidable landscape.",
      x: 50,
      y: 50,
    },
  ])

  const [scarabPosition, setScarabPosition] = useState<{ x: number; y: number }>({ x: 50, y: 50 })
  const [currentPedestal, setCurrentPedestal] = useState<string | null>(null)
  const [lines, setLines] = useState<[{ x1: number; y1: number; x2: number; y2: number }]>([])
  const [showPopup, setShowPopup] = useState(false)

  const [activePedestal, setActivePedestal] = useState<Pedestal | null>(null)

  // Function to handle pedestal click
  const handlePedestalClick = (pedestal: Pedestal) => {
    setActivePedestal(pedestal)
    setShowPopup(true)
  }

  // Function to handle popup close
  const handleClosePopup = () => {
    setShowPopup(false)
    setActivePedestal(null)
  }

  // Function to handle scarab click
  const handleScarabClick = () => {
    if (currentPedestal) {
      // Move scarab to the selected pedestal
      const pedestal = pedestals.find((p) => p.id === currentPedestal)
      if (pedestal) {
        setScarabPosition({ x: pedestal.x, y: pedestal.y })
        setLines((prevLines) => [
          ...prevLines,
          {
            x1: scarabPosition.x,
            y1: scarabPosition.y,
            x2: pedestal.x,
            y2: pedestal.y,
          },
        ])
      }
      setCurrentPedestal(null)
    } else {
      // Reset scarab position
      setScarabPosition({ x: 50, y: 50 })
      setLines([])
    }
  }

  return (
    <div className="relative w-full h-[600px] bg-gray-800 rounded-lg overflow-hidden">
      {/* Map Background */}
      <Image
        src="/images/map-background.png"
        alt="Map Background"
        layout="fill"
        objectFit="cover"
        className="opacity-50"
      />

      {/* Golden Scarab */}
      <div
        className="absolute w-20 h-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
        style={{ left: `${scarabPosition.x}%`, top: `${scarabPosition.y}%`, zIndex: 2 }}
        onClick={handleScarabClick}
      >
        <Image
          src="/images/golden-scarab/golden_scarab.webp"
          alt="Golden Scarab"
          layout="fill"
          objectFit="contain"
          className="pixelated"
        />
      </div>

      {/* Pedestals */}
      {pedestals.map((pedestal) => (
        <div
          key={pedestal.id}
          className="absolute w-24 h-24 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
          style={{ left: `${pedestal.x}%`, top: `${pedestal.y}%`, zIndex: 1 }}
          onClick={() => handlePedestalClick(pedestal)}
        >
          <Image
            src={pedestal.imageUrl || "/placeholder.svg"}
            alt={pedestal.name}
            layout="fill"
            objectFit="contain"
            className="pixelated"
          />
        </div>
      ))}

      {/* Lines */}
      {lines.map((line, index) => (
        <svg key={index} className="absolute inset-0 h-full w-full pointer-events-none">
          <line
            x1={`${line.x1}%`}
            y1={`${line.y1}%`}
            x2={`${line.x2}%`}
            y2={`${line.y2}%`}
            stroke="gold"
            strokeWidth="4"
          />
        </svg>
      ))}

      {/* Pedestal Popup */}
      {showPopup && activePedestal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
          <div className="bg-gray-700 rounded-lg p-4 max-w-md">
            <h2 className="text-xl font-bold text-white mb-2">{activePedestal.name}</h2>
            <Image
              src={activePedestal.imageUrl || "/placeholder.svg"}
              alt={activePedestal.name}
              width={200}
              height={200}
              className="mx-auto mb-4"
            />
            <p className="text-gray-300">{activePedestal.description}</p>
            <button onClick={handleClosePopup} className="mt-4 px-4 py-2 bg-gray-600 text-white rounded">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
