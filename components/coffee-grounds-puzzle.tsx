"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CoffeeGroundsPuzzleProps {
  onSolve: () => void
}

export default function CoffeeGroundsPuzzle({ onSolve }: CoffeeGroundsPuzzleProps) {
  // State for current cup index
  const [currentCup, setCurrentCup] = useState<number>(0)
  // State for rotation angles of each cup
  const [rotations, setRotations] = useState<number[]>([0, 0, 0])
  // State for tracking if user is currently dragging
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [startAngle, setStartAngle] = useState<number>(0)
  const [startPosition, setStartPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  // Cups the player has actually rotated — used to unlock the answer input
  // once every cup has been examined, since there's no single "correct" angle.
  const [rotatedCups, setRotatedCups] = useState<Set<number>>(new Set())

  // Coffee cup images
  const coffeeImages = [
    "/images/coffeegrounds1.webp", // Storm image with S and Y
    "/images/coffeegrounds2.webp", // Hourglass/time image with T and S
    "/images/coffeegrounds3.webp", // Face/head image with A and D
  ]

  // Initialize with random rotations
  useEffect(() => {
    setRotations([Math.floor(Math.random() * 360), Math.floor(Math.random() * 360), Math.floor(Math.random() * 360)])
  }, [])

  // Handle navigation
  const goToPrevious = () => {
    setCurrentCup((prev) => (prev === 0 ? coffeeImages.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentCup((prev) => (prev === coffeeImages.length - 1 ? 0 : prev + 1))
  }

  // Spin inertia: a flicked cup keeps turning briefly after release and slows down.
  const spinRef = useRef<{ vel: number; lastRot: number; lastT: number; raf: number }>({
    vel: 0,
    lastRot: 0,
    lastT: 0,
    raf: 0,
  })
  const stopSpin = () => cancelAnimationFrame(spinRef.current.raf)
  useEffect(() => stopSpin, [])
  useEffect(() => stopSpin(), [currentCup])

  // Handle mouse/touch down
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    stopSpin()
    spinRef.current.vel = 0
    spinRef.current.lastRot = rotations[currentCup]
    spinRef.current.lastT = performance.now()
    setIsDragging(true)

    const container = e.currentTarget as HTMLDivElement
    const rect = container.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    // Get client coordinates
    let clientX, clientY
    if ("touches" in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    setStartPosition({ x: clientX, y: clientY })

    // Calculate angle
    const angle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI)
    setStartAngle(angle - rotations[currentCup])
  }

  // Handle mouse/touch move
  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return

    const container = e.currentTarget as HTMLDivElement
    const rect = container.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    // Get client coordinates
    let clientX, clientY
    if ("touches" in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    // Calculate angle
    const angle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI)
    const newRotation = angle - startAngle

    // Track angular velocity (deg per 16ms frame) for the release spin
    const spin = spinRef.current
    const now = performance.now()
    let delta = newRotation - spin.lastRot
    delta = ((((delta + 180) % 360) + 360) % 360) - 180
    spin.vel = (delta / Math.max(1, now - spin.lastT)) * 16
    spin.lastRot = newRotation
    spin.lastT = now

    // Update rotation for the current cup
    const newRotations = [...rotations]
    newRotations[currentCup] = newRotation
    setRotations(newRotations)
  }

  // Handle mouse/touch up
  const handleDragEnd = () => {
    setIsDragging(false)
    if (isDragging) {
      const spin = spinRef.current
      // Ignore a release after the pointer has been held still
      if (performance.now() - spin.lastT > 80) spin.vel = 0
      if (Math.abs(spin.vel) > 0.5 && !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
        const cup = currentCup
        const step = () => {
          spin.vel *= 0.94
          setRotations((prev) => {
            const next = [...prev]
            next[cup] += spin.vel
            return next
          })
          if (Math.abs(spin.vel) > 0.05) spin.raf = requestAnimationFrame(step)
        }
        spin.raf = requestAnimationFrame(step)
      }
      setRotatedCups((prev) => {
        if (prev.has(currentCup)) return prev
        const next = new Set(prev).add(currentCup)
        if (next.size === coffeeImages.length) {
          onSolve()
        }
        return next
      })
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex flex-col items-center">
        {/* Cup carousel */}
        <div className="relative w-full mb-6">
          <div className="flex justify-center">
            <div
              className="relative w-60 h-60 cursor-grab"
              onMouseDown={handleDragStart}
              onMouseMove={handleDragMove}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              onTouchStart={handleDragStart}
              onTouchMove={handleDragMove}
              onTouchEnd={handleDragEnd}
            >
              <div
                className="w-full h-full transition-transform duration-100"
                style={{ transform: `rotate(${rotations[currentCup]}deg)` }}
              >
                <Image
                  src={coffeeImages[currentCup] || "/placeholder.svg"}
                  alt="Coffee cup"
                  width={240}
                  height={240}
                  className="rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Navigation buttons */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-900/70 hover:bg-gray-800/80 p-2 rounded-full"
            aria-label="Previous cup"
          >
            <ChevronLeft className="w-6 h-6 text-purple-300" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-900/70 hover:bg-gray-800/80 p-2 rounded-full"
            aria-label="Next cup"
          >
            <ChevronRight className="w-6 h-6 text-purple-300" />
          </button>
        </div>

        <p className="text-gray-400 text-xs mt-2 text-center">Drag to rotate the cup and examine the coffee grounds.</p>
      </div>
    </div>
  )
}
