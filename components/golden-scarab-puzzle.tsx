"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
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
  const [isDragging, setIsDragging] = useState(false)
  const [dragPosition, setDragPosition] = useState<Position | null>(null)
  const [highlightedPedestal, setHighlightedPedestal] = useState<string | null>(null)
  const [showDropEffect, setShowDropEffect] = useState<string | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const scarabRef = useRef<HTMLDivElement>(null)

  // Define the correct path sequence
  const correctSequence = ["mali", "sahara", "egypt", "hejaz", "songhai", "mali", "center"]

  // Define pedestals with their positions and descriptions
  const pedestals: Pedestal[] = [
    {
      id: "mali",
      name: "Golden Lion Pedestal",
      image: "/images/golden-scarab/mali-pedestal.webp",
      position: { x: 50, y: 15 }, // Top
      description:
        "This pedestal is adorned with a majestic golden lion, symbolizing strength and royalty. Intricate carvings cover its surface, depicting scenes of prosperity and power.",
    },
    {
      id: "sahara",
      name: "Desert Oasis Pedestal",
      image: "/images/golden-scarab/sahara-pedestal.webp",
      position: { x: 15, y: 50 }, // Left
      description:
        "This pedestal features a serene oasis scene, complete with palm trees and a shimmering pool of water. The base is made of rough-hewn stone, contrasting with the delicate oasis above.",
    },
    {
      id: "egypt",
      name: "Nile Serpent Pedestal",
      image: "/images/golden-scarab/egypt-pedestal.webp",
      position: { x: 85, y: 50 }, // Right
      description:
        "This pedestal is carved with a winding serpent, representing the life-giving Nile. Hieroglyphs adorn its sides, hinting at ancient knowledge and forgotten secrets.",
    },
    {
      id: "songhai",
      name: "River Trading Pedestal",
      image: "/images/golden-scarab/songhai-pedestal.webp",
      position: { x: 30, y: 85 }, // Bottom Left
      description:
        "This pedestal depicts a bustling river scene, with boats carrying goods to distant markets. The base is decorated with intricate patterns and symbols of trade.",
    },
    {
      id: "hejaz",
      name: "Mountain Shrine Pedestal",
      image: "/images/golden-scarab/hejaz-pedestal.webp",
      position: { x: 70, y: 85 }, // Bottom Right
      description:
        "This pedestal is carved with towering mountains and a sacred shrine at its peak. The air around it seems to shimmer with devotion and reverence.",
    },
  ]

  // Center position for the scarab
  const centerPosition: Position = { x: 50, y: 50 }

  // Fixed pedestal size
  const pedestalSize = 100

  // Handle pedestal click for information popup
  const handlePedestalClick = (pedestal: Pedestal, e: React.MouseEvent) => {
    // Don't show popup if we're dragging
    if (isDragging) return

    e.stopPropagation()
    setSelectedPedestal(pedestal)
    setShowPopup(true)
  }

  // Handle scarab drag start
  const handleDragStart = (e: React.MouseEvent) => {
    if (isSolved) return

    e.preventDefault()
    setIsDragging(true)

    // Get initial position
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      setDragPosition({ x, y })
    }

    // Add event listeners for drag and drop
    document.addEventListener("mousemove", handleDragMove)
    document.addEventListener("mouseup", handleDragEnd)
  }

  // Handle scarab drag move
  const handleDragMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setDragPosition({ x, y })

    // Check if we're over a pedestal
    const hoveredPedestal = pedestals.find((pedestal) => {
      const distance = Math.sqrt(Math.pow(pedestal.position.x - x, 2) + Math.pow(pedestal.position.y - y, 2))
      return distance < 15 // Highlight if within this radius
    })

    setHighlightedPedestal(hoveredPedestal?.id || null)
  }

  // Handle scarab drag end
  const handleDragEnd = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return

    setIsDragging(false)
    document.removeEventListener("mousemove", handleDragMove)
    document.removeEventListener("mouseup", handleDragEnd)

    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    // Check if we're over a pedestal or the center
    const centerDistance = Math.sqrt(Math.pow(centerPosition.x - x, 2) + Math.pow(centerPosition.y - y, 2))

    if (centerDistance < 15 && scarabPosition !== "center") {
      // Dropped on center
      handleReturnToCenter()
      setShowDropEffect("center")
      setTimeout(() => setShowDropEffect(null), 500)
    } else {
      // Check if dropped on a pedestal
      const targetPedestal = pedestals.find((pedestal) => {
        const distance = Math.sqrt(Math.pow(pedestal.position.x - x, 2) + Math.pow(pedestal.position.y - y, 2))
        return distance < 15
      })

      if (targetPedestal && targetPedestal.id !== scarabPosition) {
        handleMoveScarab(targetPedestal)
        setShowDropEffect(targetPedestal.id)
        setTimeout(() => setShowDropEffect(null), 500)
      }
    }

    setDragPosition(null)
    setHighlightedPedestal(null)
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

    // Close the popup if open
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

  // Clean up event listeners
  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleDragMove)
      document.removeEventListener("mouseup", handleDragEnd)
    }
  }, [])

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

  // Render dragging scarab
  const renderDraggingScarab = () => {
    if (!isDragging || !dragPosition) return null

    return (
      <div
        className="absolute pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${dragPosition.x}%`,
          top: `${dragPosition.y}%`,
          width: "80px",
          height: "80px",
          opacity: 0.8,
        }}
      >
        <Image
          src="/images/golden-scarab/golden-scarab.webp"
          alt="Golden Scarab"
          width={80}
          height={80}
          className="object-contain"
        />
      </div>
    )
  }

  return (
    <div className="relative w-full h-[500px] bg-stone-900 rounded-lg overflow-hidden" ref={containerRef}>
      {/* Render paths */}
      {renderPaths()}

      {/* Center scarab position */}
      <div
        className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 z-20 
           ${showDropEffect === "center" ? "animate-pulse scale-110" : ""} 
           ${highlightedPedestal === "center" ? "ring-4 ring-yellow-400 rounded-full" : ""}
         `}
        style={{
          left: `${centerPosition.x}%`,
          top: `${centerPosition.y}%`,
          width: `${pedestalSize}px`,
          height: `${pedestalSize}px`,
          marginLeft: `-${pedestalSize / 2}px`,
          marginTop: `-${pedestalSize / 2}px`,
        }}
      >
        {scarabPosition === "center" && (
          <div ref={scarabRef} className="cursor-grab active:cursor-grabbing" onMouseDown={handleDragStart}>
            <Image
              src="/images/golden-scarab/golden-scarab.webp"
              alt="Golden Scarab"
              width={pedestalSize}
              height={pedestalSize}
              className="object-contain"
              draggable={false}
            />
          </div>
        )}
        {scarabPosition !== "center" && (
          <div className="w-20 h-20 rounded-full border-2 border-dashed border-yellow-500 flex items-center justify-center text-yellow-500 font-pixel">
            Return
          </div>
        )}
      </div>

      {/* Render pedestals */}
      {pedestals.map((pedestal) => (
        <div
          key={pedestal.id}
          className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2
             ${showDropEffect === pedestal.id ? "animate-pulse scale-110" : ""}
             ${highlightedPedestal === pedestal.id ? "ring-4 ring-yellow-400 rounded-full p-2" : ""}
           `}
          style={{
            left: `${pedestal.position.x}%`,
            top: `${pedestal.position.y}%`,
            width: `${pedestalSize}px`,
            height: `${pedestalSize}px`,
            marginLeft: `-${pedestalSize / 2}px`,
            marginTop: `-${pedestalSize / 2}px`,
          }}
          onClick={(e) => handlePedestalClick(pedestal, e)}
        >
          <Image
            src={pedestal.image || "/placeholder.svg"}
            alt={pedestal.name}
            width={pedestalSize}
            height={pedestalSize}
            className="object-contain"
            draggable={false}
          />
          {scarabPosition === pedestal.id && (
            <div className="absolute top-[-40px] left-1/2 transform -translate-x-1/2">
              <Image
                src="/images/golden-scarab/golden-scarab.webp"
                alt="Golden Scarab"
                width={60}
                height={60}
                className="object-contain"
              />
            </div>
          )}
          <div className="absolute bottom-[-20px] left-0 right-0 text-center text-xs text-yellow-500 font-pixel">
            {pedestal.name}
          </div>
        </div>
      ))}

      {/* Dragging scarab overlay */}
      {renderDraggingScarab()}

      {/* Pedestal popup */}
      {showPopup && selectedPedestal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-stone-800 rounded-lg p-6 max-w-md w-full border border-yellow-700 animate-fadeIn">
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
    </div>
  )
}
