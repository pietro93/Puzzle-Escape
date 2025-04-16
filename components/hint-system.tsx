"use client"

import { useState } from "react"
import { Eye, LockKeyhole, Lightbulb } from "lucide-react"

interface HintSystemProps {
  hints: string[]
}

export default function HintSystem({ hints = [] }: HintSystemProps) {
  const [unlockedHints, setUnlockedHints] = useState<number[]>([])

  const unlockHint = (index: number) => {
    // Only allow unlocking if it's the next hint in sequence
    if (index === 0 || unlockedHints.includes(index - 1)) {
      setUnlockedHints((prev) => [...prev, index])
    }
  }

  return (
    <div className="space-y-2 mt-2 animate-fadeIn">
      <h3 className="text-purple-400 font-pixel text-sm flex items-center gap-1">
        <Lightbulb className="w-4 h-4" /> HINTS
      </h3>

      <div className="grid grid-cols-1 gap-2">
        {hints.map((hint, index) => (
          <div
            key={index}
            className={`border rounded-md p-3 transition-all ${
              unlockedHints.includes(index)
                ? "border-purple-600 bg-purple-950/30 shadow-[0_0_10px_rgba(147,51,234,0.2)]"
                : "border-gray-700 bg-gray-900/50"
            }`}
          >
            {unlockedHints.includes(index) ? (
              <div className="flex items-start gap-2">
                <Eye className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-purple-200">{hint}</p>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LockKeyhole className="w-4 h-4 text-gray-500" />
                  <p className="text-xs text-gray-500">Hint {index + 1}</p>
                </div>
                <button
                  className={`text-xs px-3 py-1 ${
                    index === 0 || unlockedHints.includes(index - 1)
                      ? "bg-purple-950/30 hover:bg-purple-900/50 border border-purple-800 text-purple-400"
                      : "bg-gray-800/30 border border-gray-700 text-gray-500 cursor-not-allowed"
                  } rounded-md transition-colors`}
                  onClick={() => unlockHint(index)}
                  disabled={!(index === 0 || unlockedHints.includes(index - 1))}
                >
                  Reveal
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
