"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PyramidPuzzleProps {
  onSolve: () => void
  onRoomChange: (room: string) => void
  onTorchAcquired: () => void
  hasTorch: boolean
  currentRoom: string
}

type Room = "entrance" | "isis" | "osiris" | "horus" | "toth" | "ra" | "anubis" | "mural1" | "mural2" | "mural3" | "mural4"

export default function PyramidPuzzle({
  onSolve,
  onRoomChange,
  onTorchAcquired,
  hasTorch,
  currentRoom,
}: PyramidPuzzleProps) {
    // State for sphinx message
    const [sphinxMessage, setSphinxMessage] = useState("The mural in the entrance room depicts some kind of bird.")
    // State for torch position
    const [torchPosition, setTorchPosition] = useState({ x: 50, y: 50 })

    // Map of available directions from each room
    const roomConnections: Record<Room, { left?: Room; right?: Room }> = {
        entrance: { left: "isis", right: "mural1" },
        isis: { left: "osiris", right: "entrance" },
        osiris: { left: "horus", right: "isis" },
        horus: { left: "toth", right: "osiris" },
        toth: { left: "ra", right: "horus" },
        ra: { left: "anubis", right: "toth" },
        anubis: { right: "ra" },
        mural1: { left: "entrance", right: "mural2" },
        mural2: { left: "mural1", right: "mural3" },
        mural3: { left: "mural2", right: "mural4" },
        mural4: { left: "mural3" },
    }

    // Get room image based on current room
    const getRoomImage = () => {
        // If it's a dark room and we don't have a torch, show darkness
        if (["mural1", "mural2", "mural3", "mural4"].includes(currentRoom) && !hasTorch) {
            return "/images/pitch-darkness.webp"
        }

        // Otherwise show the appropriate room image
        switch (currentRoom) {
            case "entrance":
                return "/images/wall-0.webp"
            case "isis":
                return "/images/wall-isis.webp"
            case "osiris":
                return "/images/wall-osiris.webp"
            case "horus":
                return "/images/wall-horus.webp"
            case "toth":
                return "/images/wall-thoth.webp"
            case "ra":
                return "/images/wall-ra.webp"
            case "anubis":
                return "/images/wall-anubis.webp"
            case "mural1":
                return "/images/wall-1.webp"
            case "mural2":
                return "/images/wall-2.webp"
            case "mural3":
                return "/images/wall-3.webp"
            case "mural4":
                return "/images/wall-4.webp"
            default:
                return "/images/wall-entrance.webp"
        }
    }

    // Get sphinx message based on current room
    useEffect(() => {
        const godRooms = ["isis", "osiris", "horus", "toth", "ra", "anubis"]
        if (godRooms.includes(currentRoom)) {
            setSphinxMessage("")
        } else {
            switch (currentRoom) {
                case "entrance":
                    setSphinxMessage("The mural in the entrance room depicts some kind of bird.")
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

    return (
        <div className="w-full max-w-md mx-auto">
            {/* Sphinx message */}
            <div className="bg-gray-900/80 p-4 rounded-lg border border-gray-800 mb-4">
                <p className="text-gray-300 font-mono text-sm">{sphinxMessage}</p>
            </div>

            {/* Room navigation and content */}
            <div className="relative bg-black p-4 rounded-lg border border-gray-800 mb-4">
                {/* Room content */}
                <div className="relative w-full h-72 mb-4 overflow-hidden rounded-lg" onMouseMove={handleMouseMove}>
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
                                src="/images/torch.webp"
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
                                src="/images/torch.webp"
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
