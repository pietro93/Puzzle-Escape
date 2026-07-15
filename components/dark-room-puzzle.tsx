"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface DarkRoomPuzzleProps {
  onSolve?: () => void
}

export default function DarkRoomPuzzle({ onSolve }: DarkRoomPuzzleProps) {
  // State for tracking which torches are lit
  const [litTorches, setLitTorches] = useState<number[]>([])
  // State for tracking torch timers
  const [torchTimers, setTorchTimers] = useState<Record<number, NodeJS.Timeout>>({})
  // Torches the player has lit at least once — unlocks the answer input once every torch has been read.
  const [litOnceTorches, setLitOnceTorches] = useState<Set<number>>(new Set())

  // Handle torch click
  const handleTorchClick = (torchIndex: number) => {
    console.log("Torch clicked:", torchIndex)
    setLitOnceTorches((prev) => {
      if (prev.has(torchIndex)) return prev
      const next = new Set(prev).add(torchIndex)
      if (next.size === 4) {
        onSolve?.()
      }
      return next
    })

    // Turn off all torches first
    setLitTorches([])

    // Clear any existing timers
    Object.values(torchTimers).forEach((timer) => clearTimeout(timer))

    // Light only the clicked torch
    setLitTorches([torchIndex])

    // Set a timer to unlight the torch after 1 second
    const timer = setTimeout(() => {
      setLitTorches([])
    }, 1000)

    // Store the timer reference
    setTorchTimers((prev) => ({
      ...prev,
      [torchIndex]: timer,
    }))
  }

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      Object.values(torchTimers).forEach((timer) => clearTimeout(timer))
    }
  }, [torchTimers])

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative bg-black p-8 rounded-lg border border-gray-800 min-h-[400px] flex flex-col items-center justify-center">
        {/* Top row torches */}
        <div className="absolute top-4 left-4 right-4 flex justify-between z-40">
          <button
            className="cursor-pointer transform hover:scale-105 transition-transform focus:outline-none"
            onClick={() => handleTorchClick(0)}
            style={{ zIndex: 50 }}
          >
            <Image
              src={
                litTorches.includes(0)
                  ? "/images/firetorch_lit_animated.webp"
                  : "/images/firetorch_unlit.webp"
              }
              alt="Torch"
              width={60}
              height={120}
              className="pixelated"
            />
          </button>
          <button
            className="cursor-pointer transform hover:scale-105 transition-transform focus:outline-none"
            onClick={() => handleTorchClick(1)}
            style={{ zIndex: 50 }}
          >
            <Image
              src={
                litTorches.includes(1)
                  ? "/images/firetorch_lit_animated.webp"
                  : "/images/firetorch_unlit.webp"
              }
              alt="Torch"
              width={60}
              height={120}
              className="pixelated"
            />
          </button>
        </div>

        {/* Bottom row torches */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between z-40">
          <button
            className="cursor-pointer transform hover:scale-105 transition-transform focus:outline-none"
            onClick={() => handleTorchClick(2)}
            style={{ zIndex: 50 }}
          >
            <Image
              src={
                litTorches.includes(2)
                  ? "/images/firetorch_lit_animated.webp"
                  : "/images/firetorch_unlit.webp"
              }
              alt="Torch"
              width={60}
              height={120}
              className="pixelated"
            />
          </button>
          <button
            className="cursor-pointer transform hover:scale-105 transition-transform focus:outline-none"
            onClick={() => handleTorchClick(3)}
            style={{ zIndex: 50 }}
          >
            <Image
              src={
                litTorches.includes(3)
                  ? "/images/firetorch_lit_animated.webp"
                  : "/images/firetorch_unlit.webp"
              }
              alt="Torch"
              width={60}
              height={120}
              className="pixelated"
            />
          </button>
        </div>

        {/* Arabic text with torch-based visibility */}
        <div className="absolute inset-0 flex items-center justify-center z-30">
          {/* Top left part of text (ب) - only visible with top left torch */}
          {litTorches.includes(0) && (
            <div className="absolute top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
              <span
                className="text-yellow-300 text-6xl font-bold"
                style={{
                  textShadow: "0 0 10px #FFD700, 0 0 20px #FFD700, 0 0 30px #FFD700",
                }}
              >
                ب
              </span>
            </div>
          )}

          {/* Top right part of text (قل) - only visible with top right torch */}
          {litTorches.includes(1) && (
            <div className="absolute top-1/3 right-1/3 transform translate-x-1/2 -translate-y-1/2">
              <span
                className="text-yellow-300 text-6xl font-bold"
                style={{
                  textShadow: "0 0 10px #FFD700, 0 0 20px #FFD700, 0 0 30px #FFD700",
                }}
              >
                قل
              </span>
            </div>
          )}

          {/* Bottom left part of text (سور) - only visible with bottom left torch */}
          {litTorches.includes(2) && (
            <div className="absolute bottom-1/3 left-1/3 transform -translate-x-1/2 translate-y-1/2">
              <span
                className="text-yellow-300 text-6xl font-bold"
                style={{
                  textShadow: "0 0 10px #FFD700, 0 0 20px #FFD700, 0 0 30px #FFD700",
                }}
              >
                سور
              </span>
            </div>
          )}

          {/* Bottom right part of text (مك) - only visible with bottom right torch */}
          {litTorches.includes(3) && (
            <div className="absolute bottom-1/3 right-1/3 transform translate-x-1/2 translate-y-1/2">
              <span
                className="text-yellow-300 text-6xl font-bold"
                style={{
                  textShadow: "0 0 10px #FFD700, 0 0 20px #FFD700, 0 0 30px #FFD700",
                }}
              >
                مك
              </span>
            </div>
          )}
        </div>

        {/* Torch light effects */}
        <div className="absolute inset-0 pointer-events-none">
          {litTorches.includes(0) && (
            <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-radial from-yellow-500/30 to-transparent rounded-full blur-xl"></div>
          )}
          {litTorches.includes(1) && (
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-radial from-yellow-500/30 to-transparent rounded-full blur-xl"></div>
          )}
          {litTorches.includes(2) && (
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-radial from-yellow-500/30 to-transparent rounded-full blur-xl"></div>
          )}
          {litTorches.includes(3) && (
            <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-radial from-yellow-500/30 to-transparent rounded-full blur-xl"></div>
          )}
        </div>

        {/* Black background */}
        <div className="absolute inset-0 z-0 bg-black"></div>
      </div>
    </div>
  )
}
