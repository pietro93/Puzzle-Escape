"use client"

import { useState } from "react"

interface Rune {
  id: string
  symbol: string
  color: "red" | "blue"
  label: string
  equation: string
  value: number
}

interface MysticsGeometryPuzzleProps {
  onSolve: () => void
}

// Each rune's value is only revealed once its equation (built from
// already-solved runes) can be worked out by the player.
const runes: Rune[] = [
  { id: "rc", symbol: "●", color: "red", label: "Red Circle", equation: "● + ● = 32", value: 16 },
  { id: "rt", symbol: "▲", color: "red", label: "Red Triangle", equation: "● + ▲ = 22", value: 6 },
  { id: "bc", symbol: "●", color: "blue", label: "Blue Circle", equation: "Blue ● = (3 × ▲) + ●", value: 34 },
  { id: "bt", symbol: "▲", color: "blue", label: "Blue Triangle", equation: "Blue ▲ + Blue ▲ = 28", value: 14 },
  { id: "bs", symbol: "■", color: "blue", label: "Blue Square", equation: "■ + ■ = 20", value: 10 },
  { id: "rs", symbol: "★", color: "red", label: "Red Star", equation: "★ = Blue ● + Blue ▲ + ■", value: 58 },
  { id: "bst", symbol: "★", color: "blue", label: "Blue Star", equation: "Blue ★ = ★ + ●", value: 74 },
]

export default function MysticsGeometryPuzzle({ onSolve }: MysticsGeometryPuzzleProps) {
  const [inputs, setInputs] = useState<Record<string, string>>({})
  const [locked, setLocked] = useState<Record<string, boolean>>({})
  const [isComplete, setIsComplete] = useState(false)

  const handleChange = (id: string, raw: string) => {
    if (locked[id]) return
    setInputs((prev) => ({ ...prev, [id]: raw }))
  }

  const handleSubmit = (id: string) => {
    const rune = runes.find((r) => r.id === id)
    if (!rune || locked[id]) return

    if (Number(inputs[id]) === rune.value) {
      const newLocked = { ...locked, [id]: true }
      setLocked(newLocked)

      if (runes.every((r) => newLocked[r.id])) {
        setIsComplete(true)
        onSolve()
      }
    }
  }

  const colorClasses = (color: "red" | "blue", isLit: boolean) => {
    if (color === "red") {
      return isLit ? "text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.9)]" : "text-red-900/60"
    }
    return isLit ? "text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.9)]" : "text-blue-900/60"
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-800 mb-4">
        <h3 className="text-purple-300 font-pixel mb-2 text-center text-sm">Ancient Geometry</h3>
        <p className="text-purple-200 text-xs text-center">
          Solve each rune's equation and lock in its value. Once every rune glows, a final expression will appear.
        </p>
      </div>

      <div className="space-y-2 mb-4">
        {runes.map((rune) => {
          const isLit = !!locked[rune.id]
          return (
            <div
              key={rune.id}
              className={`flex items-center gap-3 p-2 rounded-lg border ${
                isLit ? "border-amber-600/50 bg-gray-900/60" : "border-gray-800 bg-gray-900/30"
              }`}
            >
              <span className={`text-2xl font-bold w-8 text-center transition-all ${colorClasses(rune.color, isLit)}`}>
                {rune.symbol}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-gray-400 text-[10px]">{rune.label}</p>
                <p className="text-gray-200 font-mono text-xs truncate">{rune.equation}</p>
              </div>
              {isLit ? (
                <span className="text-amber-300 font-pixel text-sm w-14 text-center">{rune.value}</span>
              ) : (
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={inputs[rune.id] ?? ""}
                    onChange={(e) => handleChange(rune.id, e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit(rune.id)}
                    className="w-14 bg-gray-800 border border-gray-700 rounded text-center text-gray-100 text-xs py-1"
                  />
                  <button
                    onClick={() => handleSubmit(rune.id)}
                    className="text-[10px] px-2 py-1 bg-purple-800 hover:bg-purple-700 rounded text-purple-100"
                  >
                    Lock
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {isComplete && (
        <div className="p-3 bg-amber-950/40 rounded-lg border border-amber-700/50 text-center animate-fadeIn">
          <p className="text-amber-300 font-pixel text-xs mb-1">All runes are glowing.</p>
          <p className="text-gray-200 font-mono text-sm">Blue ▲ × Blue ★ + ● = ?</p>
        </div>
      )}
    </div>
  )
}
