"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

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
  next?: string
}

interface GoldenScarabPuzzleProps {
  onSolve: () => void
}

const GoldenScarabPuzzle = ({ onSolve }: GoldenScarabPuzzleProps) => {
  const [scarabPosition, setScarabPosition] = useState<string>("mali")
  const [visited, setVisited] = useState<string[]>([])
  const [isSolved, setIsSolved] = useState(false)
  const [selectedPedestal, setSelectedPedestal] = useState<Pedestal | null>(null)
  const [showPopup, setShowPopup] = useState(false)

  const containerRef = useRef<HTMLDivElement | null>(null)

  const pedestals: Pedestal[] = [
    {
      id: "mali",
      name: "Mali",
      image: "/images/golden-scarab/mali-pedestal.webp",
      position: { x: 50, y: 80 },
      description: "This pedestal is adorned with a majestic golden lion, symbolizing strength and royalty.",
      next: "sahara",
    },
    {
      id: "sahara",
      name: "Sahara",
      image: "/images/golden-scarab/sahara-pedestal.webp",
      position: { x: 15, y: 50 },
      description: "This pedestal features sand dunes and camels, representing the vast Sahara Desert.",
      next: "egypt",
    },
    {
      id: "egypt",
      name: "Egypt",
      image: "/images/golden-scarab/egypt-pedestal.webp",
      position: { x: 85, y: 50 },
      description: "This pedestal features a lotus flower, a symbol of rebirth and creation in ancient Egypt.",
      next: "hejaz",
    },
    {
      id: "hejaz",
      name: "Hejaz",
      image: "/images/golden-scarab/hejaz-pedestal.webp",
      position: { x: 85, y: 15 },
      description: "This pedestal resembles the Kaaba, a sacred cube-shaped building in Mecca.",
      next: "songhai",
    },
    {
      id: "songhai",
      name: "Songhai",
      image: "/images/golden-scarab/songhai-pedestal.webp",
      position: { x: 15, y: 15 },
      description: "This pedestal depicts a trading boat, symbolizing commerce and prosperity.",
      next: "mali",
    },
  ]

  const centerPosition: Position = { x: 50, y: 50 }

  const handlePedestalClick = (pedestal: Pedestal) => {
    setSelectedPedestal(pedestal)
    setShowPopup(true)
  }

  const handleMoveScarab = (pedestal: Pedestal) => {
    if (isSolved) return

    if (scarabPosition === pedestal.id) return

    if (
      (scarabPosition === "mali" && pedestal.id === "sahara") ||
      (scarabPosition === "sahara" && pedestal.id === "egypt") ||
      (scarabPosition === "egypt" && pedestal.id === "hejaz") ||
      (scarabPosition === "hejaz" && pedestal.id === "songhai") ||
      (scarabPosition === "songhai" && pedestal.id === "mali")
    ) {
      setScarabPosition(pedestal.id)
      setVisited((prev) => [...prev, pedestal.id])
    }
  }

  useEffect(() => {
    if (visited.length === 5 && scarabPosition === "mali") {
      setIsSolved(true)
      onSolve()
    }
  }, [scarabPosition, visited, onSolve])

  const getPedestalPosition = (id: string): Position => {
    return pedestals.find((p) => p.id === id)?.position || { x: 0, y: 0 }
  }

  return (
    <div className="relative w-full h-[600px] bg-stone-900 rounded-lg overflow-hidden flex items-center justify-center">
      <Image
        src="/images/map-background.png"
        alt="Map Background"
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 z-0"
      />

      {/* Pedestals */}
      <div className="relative w-full h-full flex items-center justify-center">
        {pedestals.map((pedestal) => (
          <motion.div
            key={pedestal.id}
            className="absolute cursor-pointer"
            style={{
              left: `${pedestal.position.x}%`,
              top: `${pedestal.position.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            onClick={() => handlePedestalClick(pedestal)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Image
              src={pedestal.image || "/placeholder.svg"}
              alt={pedestal.name}
              width={100}
              height={120}
              className="object-contain"
            />
          </motion.div>
        ))}

        {/* Scarab */}
        <motion.div
          className="absolute cursor-pointer"
          style={{
            left: `${getPedestalPosition(scarabPosition).x}%`,
            top: `${getPedestalPosition(scarabPosition).y}%`,
            transform: "translate(-50%, -50%)",
          }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.8 }}
        >
          <Image
            src="/images/golden-scarab/golden-scarab.webp"
            alt="Golden Scarab"
            width={80}
            height={80}
            className="object-contain"
            onClick={() => {
              const pedestal = pedestals.find((p) => p.id === scarabPosition)
              if (pedestal) {
                handleMoveScarab(pedestal)
              }
            }}
          />
        </motion.div>
      </div>

      {/* Pedestal popup */}
      <AnimatePresence>
        {showPopup && selectedPedestal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
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
                  width={150}
                  height={180}
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
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Solution popup */}
      {isSolved && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-stone-800 rounded-lg p-6 max-w-md w-full border border-yellow-700 animate-fadeIn">
            <h3 className="text-2xl font-pixel text-yellow-500 text-center mb-4">SUBLIME SPLENDOR</h3>
            <p className="text-gray-300 text-center mb-6">
              You have traced the sacred pilgrimage path! The golden scarab has revealed the words of power.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default GoldenScarabPuzzle
