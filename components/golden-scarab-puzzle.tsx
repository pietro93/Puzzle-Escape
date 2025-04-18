"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface GoldenScarabPuzzleProps {
  onSolve: () => void
}

export default function GoldenScarabPuzzle({ onSolve }: GoldenScarabPuzzleProps) {
  const [isSolved, setIsSolved] = useState(false)

  useEffect(() => {
    // Simulate solving the puzzle after a delay
    const timer = setTimeout(() => {
      setIsSolved(true)
      onSolve()
    }, 2000)

    return () => clearTimeout(timer)
  }, [onSolve])

  return (
    <div className="flex flex-col items-center justify-center">
      {isSolved ? (
        <>
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/scarab-symbol-1-4TbpOZK2u7M4sX8tZofSOQiEuZsmlz.webp"
            alt="Golden Scarab"
            width={128}
            height={128}
            className="pixelated animate-pulse"
          />
          <p className="text-green-400 font-pixel text-center mt-4 animate-fadeIn">The scarab glows with power!</p>
        </>
      ) : (
        <>
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/scarab-symbol-1-4TbpOZK2u7M4sX8tZofSOQiEuZsmlz.webp"
            alt="Golden Scarab"
            width={128}
            height={128}
            className="pixelated animate-spin"
          />
          <p className="text-gray-400 font-pixel text-center mt-4 animate-pulse">Contemplate the scarab...</p>
        </>
      )}
    </div>
  )
}
