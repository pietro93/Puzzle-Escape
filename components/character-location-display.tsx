"use client"

import type React from "react"

import Image from "next/image"
import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "react-feather"

interface CharacterLocationDisplayProps {
  level: number
  setting: string
  character: string
  puzzle: any
  lightsOn?: boolean
  solved?: boolean
  binaryCorrectCombinations?: number
  currentPyramidRoom?: string
  hasPyramidTorch?: boolean
  hasUsedElevator?: boolean
  showElevator?: boolean
  jigsawComplete?: boolean
  onGuardClick: () => void
  onLocationClick?: () => void
  onPyramidLocationImageClick?: () => void
}

// Define room types
type Room = "entrance" | "isis" | "ra" | "mural1" | "mural2" | "mural3" | "mural4"

// Define room connections
const roomConnections: { [key in Room]: { left: Room | null; right: Room | null } } = {
  entrance: { left: null, right: "isis" },
  isis: { left: "entrance", right: "ra" },
  ra: { left: "isis", right: "mural1" },
  mural1: { left: "ra", right: "mural2" },
  mural2: { left: "mural1", right: "mural3" },
  mural3: { left: "mural2", right: "mural4" },
  mural4: { left: "mural3", right: null },
}

export default function CharacterLocationDisplay({
  level,
  setting,
  character,
  puzzle,
  lightsOn = false,
  solved = false,
  binaryCorrectCombinations = 0,
  currentPyramidRoom = "entrance",
  hasPyramidTorch = false,
  hasUsedElevator = false,
  showElevator = false,
  jigsawComplete = false,
  onGuardClick,
  onLocationClick,
  onPyramidLocationImageClick,
}: CharacterLocationDisplayProps) {
  const [currentRoom, setCurrentRoom] = useState<Room>("entrance")
  const [sphinxMessage, setSphinxMessage] = useState<string>("")
  const [hasTorch, setHasTorch] = useState<boolean>(false)
  const [torchPosition, setTorchPosition] = useState({ x: 50, y: 50 })

  // Helper function to get the correct brain lamp image based on correct combinations
  const getBrainLampImage = (correctCount: number) => {
    switch (correctCount) {
      case 0:
        return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/brainlamp-WFdoE18rmyknvtBRPsfJ9IhWxiF6UF.webp" // 0 correct
      case 1:
        return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/brainlamp1a-jtarQ6DvWLbkdtCw85rPutJZjTRo7m.webp" // 1 correct
      case 2:
        return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/brainlamp2a.webp-UzQCOHqf2namH8byDVbukpZaSsa4hh.jpeg" // 2 correct
      case 3:
        return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/brainlamp3a.webp-qAtXl3omCCUIuJTEfDrOR67BrSbG1Q.jpeg" // 3 correct
      case 4:
        return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/brainlamp4a-Xrk7CsmuuYZ9jE2TiSiO704I0Hz7GG.webp" // 4 correct
      case 5:
        return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/brainlamp5a.webp-Zlp6vJ310VRTduwCjeLLFI19WZmY3t.jpeg" // 5 correct
      case 6:
        return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/brainlamp6a.webp-tFVEX3bXENwvQR5P0V3jv2zOyTb7u4.jpeg" // 6 correct (all)
      default:
        return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/brainlamp-WFdoE18rmyknvtBRPsfJ9IhWxiF6UF.webp" // Default
    }
  }

  // Helper function to get the correct brain lamp opacity based on correct combinations
  const getBrainLampOpacity = (correctCount: number) => {
    switch (correctCount) {
      case 0:
        return 0.55 // 0 correct
      case 1:
        return 0.6 // 1 correct
      case 2:
        return 0.65 // 2 correct
      case 3:
        return 0.75 // 3 correct
      case 4:
        return 0.85 // 4 correct
      case 5:
        return 0.9 // 5 correct
      case 6:
        return 1 // 6 correct (all)
      default:
        return 0.55 // Default
    }
  }

  // Get location image for pyramid puzzle
  const getPyramidLocationImage = () => {
    if (level !== 40) return null

    // Ra room with no torch
    if (currentPyramidRoom === "ra" && !hasPyramidTorch) {
      return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pyramid-inside-lit-VmsutDcMH6wQp2notj76LQQo7dgKut.webp"
    }

    // Dark mural rooms with no torch
    if (!hasPyramidTorch && ["mural1", "mural2", "mural3", "mural4"].includes(currentPyramidRoom)) {
      return "/images/pitch-darkness.webp"
    }

    // Default for all other rooms or when torch is present
    return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pyramid-inside-DpO8zywmCoFoK1uuVLRL6w0rd7yZTt.webp"
  }

  // Get sphinx message based on current room
  useEffect(() => {
    switch (currentRoom) {
      case "entrance":
        setSphinxMessage("The mural in the entrance room depicts some kind of bird.")
        break
      case "isis":
        setSphinxMessage("The mural in this chamber represents Isis, the goddess of magic and fertility.")
        break
      case "ra":
        setSphinxMessage("The mural in this chamber represents Ra, the god of light.")
        break
      case "mural1":
      case "mural2":
      case "mural3":
      case "mural4":
        if (!hasTorch) {
          setSphinxMessage("It's too dark to see anything in this chamber.")
        } else {
          // No descriptive messages when torch is active - let player discover the content
          setSphinxMessage("")
        }
        break
      default:
        setSphinxMessage("")
    }
  }, [currentRoom, hasTorch])

  // Handle navigation between rooms
  const navigateToRoom = (direction: "left" | "right") => {
    const connections = roomConnections[currentRoom as Room]
    const targetRoom = direction === "left" ? connections.left : connections.right

    if (targetRoom) {
      onRoomChange(targetRoom)
    }
  }

  // Handle mouse move for torch position
  const handleMouseMove = (e: React.MouseEvent) => {
    if (hasTorch && ["mural1", "mural2", "mural3", "mural4"].includes(currentRoom)) {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      setTorchPosition({ x, y })
    }
  }

  const getRoomImage = () => {
    switch (currentRoom) {
      case "entrance":
        return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/entrance-mural.webp"
      case "isis":
        return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/isis-mural.webp"
      case "ra":
        return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ra-mural.webp"
      case "mural1":
        return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mural1.webp"
      case "mural2":
        return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mural2.webp"
      case "mural3":
        return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mural3.webp"
      case "mural4":
        return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mural4.webp"
      default:
        return "/placeholder.svg"
    }
  }

  const onRoomChange = (room: Room) => {
    setCurrentRoom(room)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Sphinx message */}
      <div className="bg-gray-900/80 p-4 rounded-lg border border-gray-800 mb-4">
        <p className="text-gray-300 font-mono text-sm">{sphinxMessage}</p>
      </div>

      {/* Room navigation and content */}
      <div
        className="relative w-full h-72 bg-black p-4 rounded-lg border border-gray-800 mb-4"
        onMouseMove={handleMouseMove}
      >
        {/* Room content */}
        <div className="relative w-full h-full">
          {/* Room image */}
          <Image
            src={getRoomImage() || "/placeholder.svg"}
            alt={`Chamber mural`}
            width={600}
            height={400}
            className="w-full h-full object-contain"
          />

          {/* Torch light effect overlay */}
          {hasTorch && ["mural1", "mural2", "mural3", "mural4"].includes(currentRoom) && (
            <div
              className="absolute inset-0 bg-black/90 pointer-events-none"
              style={{
                background: `radial-gradient(circle at ${torchPosition.x}% ${torchPosition.y}%, transparent 50px, rgba(0,0,0,0.95) 100px)`,
              }}
            />
          )}

          {/* Torch icon when active */}
          {hasTorch && ["mural1", "mural2", "mural3", "mural4"].includes(currentRoom) && (
            <div
              className="absolute pointer-events-none"
              style={{
                left: `calc(${torchPosition.x}% - 20px)`,
                top: `calc(${torchPosition.y}% - 40px)`,
                transform: "rotate(15deg)",
              }}
            >
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/torch-vYBOKJGWZQlwVTPz9rUymfNORDEEca.webp"
                alt="Torch"
                width={40}
                height={80}
                className="w-10 h-20 object-contain"
              />
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between items-center">
          {roomConnections[currentRoom as Room].left ? (
            <button
              onClick={() => navigateToRoom("left")}
              className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center gap-1 text-sm"
            >
              <ChevronLeft className="w-4 h-4" /> Go Left
            </button>
          ) : (
            <div></div>
          )}

          {/* Torch indicator */}
          {hasTorch && (
            <div className="flex items-center justify-center">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/torch-vYBOKJGWZQlwVTPz9rUymfNORDEEca.webp"
                alt="Torch"
                width={24}
                height={48}
                className="w-6 h-12 object-contain"
              />
            </div>
          )}

          {roomConnections[currentRoom as Room].right ? (
            <button
              onClick={() => navigateToRoom("right")}
              className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center gap-1 text-sm"
            >
              Go Right <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <div></div>
          )}
        </div>
      </div>

      {/* Instructions - removed as requested */}
      {hasTorch && ["mural1", "mural2", "mural3", "mural4"].includes(currentRoom) && (
        <div className="text-center text-xs text-gray-400 animate-pulse">
          Move your cursor to shine the torch on different parts of the mural
        </div>
      )}
    </div>
  )
}
