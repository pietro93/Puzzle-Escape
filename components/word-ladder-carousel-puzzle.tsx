"use client"

import { useState, useEffect } from "react"

const ladders = [
  ["BONE", "GONE", "GORE"],
  ["BONE", "TONE", "TOME"],
  ["BONE", "CONE", "CODE"],
  ["BONE", "DONE", "DOME"],
  ["BONE", "HONE", "HOLE"],
  ["BONE", "NONE", "NOTE"],
  ["BONE", "PONE", "POLE"]
]

export default function WordLadderCarouselPuzzle({ onSolve }: { onSolve: () => void }) {
  const [shuffledLadders, setShuffledLadders] = useState<string[][]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    // Shuffle the ladders
    const shuffled = [...ladders].sort(() => Math.random() - 0.5)
    setShuffledLadders(shuffled)
  }, [])

  const goLeft = () => {
    setCurrentIndex((prev) => (prev - 1 + shuffledLadders.length) % shuffledLadders.length)
  }

  const goRight = () => {
    setCurrentIndex((prev) => (prev + 1) % shuffledLadders.length)
  }

  if (shuffledLadders.length === 0) return null

  const currentLadder = shuffledLadders[currentIndex]

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <div className="flex items-center space-x-8">
        <button
          onClick={goLeft}
          className="text-4xl p-4 hover:bg-gray-700 rounded"
        >
          ‹
        </button>
        <div className="text-center">
          {currentLadder.map((word, wordIndex) => (
            <div key={wordIndex} className="text-6xl font-mono mb-4">
              {word}
            </div>
          ))}
        </div>
        <button
          onClick={goRight}
          className="text-4xl p-4 hover:bg-gray-700 rounded"
        >
          ›
        </button>
      </div>
    </div>
  )
}
