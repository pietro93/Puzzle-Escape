"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"

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
  index: number
}

interface GoldenScarabPuzzleProps {
  onSolve: () => void
}

const GoldenScarabPuzzle = ({ onSolve }: GoldenScarabPuzzleProps) => {
  const [scarabPosition, setScarabPosition] = useState<string>("center")
  const [visited, setVisited] = useState<number[]>([])
  const [isSolved, setIsSolved] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [path, setPath] = useState<number[]>([0]) // Track the path
  const [isResetting, setIsResetting] = useState(false)

  const containerRef = useRef<HTMLDivElement | null>(null)

  const pedestals: Pedestal[] = [
    {
      id: "mali",
      name: "Mali",
      image: "/images/golden-scarab/mali-pedistal.webp",
      position: { x: 70, y: 70 },
      description: "This pedestal is adorned with a majestic golden lion, symbolizing strength and royalty.",
      next: "sahara",
      index: 1,
    },
    {
      id: "sahara",
      name: "Sahara",
      image: "/images/golden-scarab/sahara-pedistal.webp",
      position: { x: 30, y: 70 },
      description: "This pedestal features sand dunes and camels, representing the vast Sahara Desert.",
      next: "egypt",
      index: 2,
    },
    {
      id: "egypt",
      name: "Egypt",
      image: "/images/golden-scarab/egypt-pedistal.webp",
      position: { x: 80, y: 30 },
      description: "This pedestal features a lotus flower, a symbol of rebirth and creation in ancient Egypt.",
      next: "hejaz",
      index: 3,
    },
    {
      id: "hejaz",
      name: "Hejaz",
      image: "/images/golden-scarab/hejaz-pedistal.webp",
      position: { x: 20, y: 30 },
      description: "This pedestal resembles the Kaaba, a sacred cube-shaped building in Mecca.",
      next: "songhai",
      index: 4,
    },
    {
      id: "songhai",
      name: "Songhai",
      image: "/images/golden-scarab/songhai-pedistal.webp",
      position: { x: 50, y: 10 },
      description: "This pedestal depicts a trading boat, symbolizing commerce and prosperity.",
      next: "mali",
      index: 5,
    },
  ]

  const centerPosition: Position = { x: 50, y: 50 }

  const correctPath = [0, 1, 2, 3, 4, 0]

  const handleMoveScarab = (pedestal: Pedestal) => {
    if (isSolved || isResetting) return

    setScarabPosition(pedestal.id)
    setPath([...path, pedestal.index])
  }

  const handleCenterClick = () => {
    if (isSolved || isResetting) return

    if (scarabPosition !== "center") {
      setScarabPosition("center")
      setPath([...path, 0])
    }
  }

  useEffect(() => {
    if (scarabPosition === "center" && path.length > 1) {
      if (arraysAreEqual(path, correctPath)) {
        setIsSolved(true)
        setShowSolution(true)
        onSolve()
      } else {
        setIsResetting(true)
        setTimeout(() => {
          setScarabPosition("center")
          setPath([0])
          setIsResetting(false)
        }, 1500)
      }
    }
  }, [scarabPosition, path, onSolve])

  const arraysAreEqual = (a: number[], b: number[]) => {
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false
    }
    return true
  }

  return (
    <div className="relative w-full h-[600px] bg-[#4A295A] rounded-lg overflow-hidden flex items-center justify-center">
      {/* Pedestals */}
      <div className="relative w-full h-full">
        {pedestals.map((pedestal) => (
          <motion.div
            key={pedestal.id}
            className="absolute cursor-pointer"
            style={{
              left: `${pedestal.position.x}%`,
              top: `${pedestal.position.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleMoveScarab(pedestal)}
          >
            <Image
              src={pedestal.image || "/placeholder.svg"}
              alt={pedestal.name}
              width={80}
              height={100}
              className="object-contain"
            />
            <p className="text-white text-center text-xs mt-1">{pedestal.name}</p>
          </motion.div>
        ))}

        {/* Scarab */}
        <motion.div
          className="absolute cursor-pointer"
          style={{
            left: `${centerPosition.x}%`,
            top: `${centerPosition.y}%`,
            transform: "translate(-50%, -50%)",
          }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.8 }}
          onClick={handleCenterClick}
        >
          <Image
            src="/images/golden-scarab/golden_scarab.webp"
            alt="Golden Scarab"
            width={80}
            height={80}
            className="object-contain"
          />
        </motion.div>
      </div>

      {/* Solution popup */}
      {showSolution && (
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
