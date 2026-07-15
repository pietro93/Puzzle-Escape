"use client"

import { useState, useEffect } from "react"

// Fixed alphabetical order (by the changed letter in the second word).
// The slot for "L" (LONE) is deliberately left blank — that's the gap the player must fill.
const sequence: (string | null)[] = [
  "boneconecode",
  "bonedonedope",
  "bonegonegore",
  "bonehonehole",
  null, // missing rung — the player must derive BONE LONE ___
  "bonenonenote",
  "boneponepole",
  "bonetonetome",
]

export default function WordLadderCarouselPuzzle({ onSolve }: { onSolve: () => void }) {
  const [startIndex, setStartIndex] = useState<number | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  // Rungs the player has actually browsed to — unlocks the answer input once
  // every rung of the ladder (including the missing one) has been viewed.
  const [viewedIndices, setViewedIndices] = useState<Set<number>>(new Set())

  useEffect(() => {
    const randomStart = Math.floor(Math.random() * sequence.length)
    setStartIndex(randomStart)
    setCurrentIndex(randomStart)
    setViewedIndices(new Set([randomStart]))
  }, [])

  useEffect(() => {
    if (viewedIndices.size === sequence.length) {
      onSolve()
    }
  }, [viewedIndices])

  const goLeft = () => {
    setCurrentIndex((prev) => {
      const next = (prev - 1 + sequence.length) % sequence.length
      setViewedIndices((v) => new Set(v).add(next))
      return next
    })
  }

  const goRight = () => {
    setCurrentIndex((prev) => {
      const next = (prev + 1) % sequence.length
      setViewedIndices((v) => new Set(v).add(next))
      return next
    })
  }

  if (startIndex === null) return null

  const currentLadder = sequence[currentIndex]

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="flex items-center space-x-6">
        <button
          onClick={goLeft}
          aria-label="Previous scratching"
          className="text-3xl text-stone-400 hover:text-stone-200 transition-colors px-2"
        >
          ‹
        </button>

        <div
          className="relative w-[220px] h-[280px] bg-cover bg-center rounded-sm overflow-hidden"
          style={{ backgroundImage: "url('/images/word-ladder/wall.webp')" }}
        >
          {currentLadder && (
            <img
              src={`/images/word-ladder/${currentLadder}.webp`}
              alt="Scratched word ladder"
              className="absolute inset-0 w-full h-full object-contain p-4"
            />
          )}
        </div>

        <button
          onClick={goRight}
          aria-label="Next scratching"
          className="text-3xl text-stone-400 hover:text-stone-200 transition-colors px-2"
        >
          ›
        </button>
      </div>

      {/* Tally marks scratched into the wall - one per ladder, current one fresher */}
      <div className="flex gap-2">
        {sequence.map((_, index) => (
          <span
            key={index}
            className={index === currentIndex ? "text-stone-200" : "text-stone-600"}
            style={{ fontSize: "1.1rem" }}
          >
            |
          </span>
        ))}
      </div>
    </div>
  )
}
