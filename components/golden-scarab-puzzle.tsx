"use client"
import { useState } from "react"
import Image from "next/image"

// Simple pedestal type
type Pedestal = {
  id: string
  name: string
  imageUrl: string
  description: string
  x: number
  y: number
}

export default function GoldenScarabPuzzle() {
  // State for the selected pedestal info popup
  const [selectedPedestal, setSelectedPedestal] = useState<Pedestal | null>(null)

  // State for the scarab position
  const [scarabPosition, setScarabPosition] = useState({ x: 50, y: 50 })

  // Pedestal data
  const pedestals: Pedestal[] = [
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
  ]

  // Handle clicking on a pedestal
  const handlePedestalClick = (pedestal: Pedestal) => {
    setSelectedPedestal(pedestal)
  }

  // Handle closing the info popup
  const handleClosePopup = () => {
    setSelectedPedestal(null)
  }

  // Handle clicking on the scarab
  const handleScarabClick = () => {
    // Reset scarab position
    setScarabPosition({ x: 50, y: 50 })
  }

  return (
    <div className="relative w-full h-[600px] bg-gray-800 rounded-lg overflow-hidden">
      {/* Map Background */}
      <div className="absolute inset-0">
        <Image src="/images/map-background.png" alt="Map Background" fill className="opacity-50 object-cover" />
      </div>

      {/* Golden Scarab */}
      <div
        className="absolute w-20 h-20 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
        style={{
          left: `${scarabPosition.x}%`,
          top: `${scarabPosition.y}%`,
          zIndex: 2,
        }}
        onClick={handleScarabClick}
      >
        <Image src="/images/golden-scarab/golden_scarab.webp" alt="Golden Scarab" fill className="object-contain" />
      </div>

      {/* Pedestals */}
      {pedestals.map((pedestal) => (
        <div
          key={pedestal.id}
          className="absolute w-24 h-24 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
          style={{
            left: `${pedestal.x}%`,
            top: `${pedestal.y}%`,
            zIndex: 1,
          }}
          onClick={() => handlePedestalClick(pedestal)}
        >
          <Image src={pedestal.imageUrl || "/placeholder.svg"} alt={pedestal.name} fill className="object-contain" />
        </div>
      ))}

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
            <p className="text-gray-300">{selectedPedestal.description}</p>
            <button onClick={handleClosePopup} className="mt-4 px-4 py-2 bg-gray-600 text-white rounded">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
