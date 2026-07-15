"use client"

import React, { useState } from "react"

interface MorseRatsPuzzleProps {
  onSolve: () => void
}

type CellType = "skull" | "blank" | "brown" | "grey" | "black"

// Layout: 5 rows x 4 columns. "skull" = fixed dot. "brown"/"grey"/"black" = a slot
// that rat color may occupy. "blank" = empty space, ignored.
const grid: CellType[][] = [
  ["brown", "skull", "skull", "blank"],
  ["blank", "blank", "blank", "skull"],
  ["brown", "skull", "grey", "skull"],
  ["blank", "blank", "skull", "black"],
  ["brown", "skull", "grey", "black"],
]

const ratEligiblePositions: Record<"brown" | "grey" | "black", [number, number][]> = {
  brown: [[0, 0], [2, 0], [4, 0]],
  grey: [[2, 2], [4, 2]],
  black: [[3, 3], [4, 3]],
}

const ratImage: Record<"brown" | "grey" | "black", string> = {
  brown: "/images/rat_brown.webp",
  grey: "/images/rat_grey.webp",
  black: "/images/rat_black.webp",
}

const MorseRatsPuzzle: React.FC<MorseRatsPuzzleProps> = ({ onSolve }) => {
  const [ratIndex, setRatIndex] = useState<Record<"brown" | "grey" | "black", number>>({
    brown: 0,
    grey: 0,
    black: 0,
  })
  const [hoppingRat, setHoppingRat] = useState<"brown" | "grey" | "black" | null>(null)
  // Rats the player has actually moved — unlocks the answer input once every
  // rat has been hopped at least once.
  const [movedRats, setMovedRats] = useState<Set<"brown" | "grey" | "black">>(new Set())

  const handleRatClick = (color: "brown" | "grey" | "black") => {
    setHoppingRat(color)
    setTimeout(() => setHoppingRat(null), 300)
    setRatIndex((prev) => {
      const positions = ratEligiblePositions[color]
      return { ...prev, [color]: (prev[color] + 1) % positions.length }
    })
    setMovedRats((prev) => {
      if (prev.has(color)) return prev
      const next = new Set(prev).add(color)
      if (next.size === 3) {
        onSolve()
      }
      return next
    })
  }

  const getRatAt = (row: number, col: number): "brown" | "grey" | "black" | null => {
    for (const color of ["brown", "grey", "black"] as const) {
      const [r, c] = ratEligiblePositions[color][ratIndex[color]]
      if (r === row && c === col) return color
    }
    return null
  }

  return (
    <div className="flex justify-center">
    <div className="bg-black/60 p-2 rounded-lg border border-gray-800 inline-block">
      <div style={{ display: "inline-grid", gridTemplateRows: "repeat(5, 56px)" }}>
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: "grid", gridTemplateColumns: "repeat(4, 56px)" }}>
            {row.map((cell, colIndex) => {
              const ratHere = cell !== "skull" && cell !== "blank" ? getRatAt(rowIndex, colIndex) : null

              return (
                <div key={colIndex} className="flex items-center justify-center" style={{ width: 56, height: 56 }}>
                  {cell === "skull" ? (
                    <img src="/images/skull.webp" alt="Skull" className="w-14 h-14 object-contain pixelated" />
                  ) : ratHere ? (
                    <img
                      src={ratImage[ratHere]}
                      alt={`${ratHere} rat`}
                      onClick={() => handleRatClick(ratHere)}
                      className={`w-14 h-14 object-contain pixelated cursor-pointer transition-transform duration-300 ${
                        hoppingRat === ratHere ? "scale-125 -translate-y-2" : "scale-100"
                      }`}
                    />
                  ) : null}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
    </div>
  )
}

export default MorseRatsPuzzle
