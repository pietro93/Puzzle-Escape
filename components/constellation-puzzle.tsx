"use client"

import { useState } from "react"

interface Star {
  id: string
  x: number
  y: number
}

interface ConstellationPuzzleProps {
  onSolve: () => void
}

// Main stars forming the Capricornus outline (percentage coordinates in a 100x100 viewBox),
// derived from the real RA/Dec of alpha2, beta, psi, omega, zeta, epsilon, delta and gamma Cap.
const stars: Star[] = [
  { id: "a", x: 10, y: 20 },   // Algedi (alpha2 Cap)
  { id: "b", x: 12.7, y: 29.6 }, // Dabih (beta Cap)
  { id: "c", x: 35.2, y: 73.3 }, // psi Cap
  { id: "d", x: 40.6, y: 80 },   // omega Cap
  { id: "e", x: 71.1, y: 61.25 }, // zeta Cap
  { id: "f", x: 81, y: 49.2 },   // epsilon Cap
  { id: "g", x: 90, y: 35 },     // Deneb Algedi (delta Cap)
  { id: "h", x: 83.7, y: 37.5 }, // Nashira (gamma Cap)
]

// Decoy stars that are part of the night sky but not the constellation
const decoyStars: Star[] = [
  { id: "d1", x: 25, y: 12 },
  { id: "d2", x: 60, y: 15 },
  { id: "d3", x: 20, y: 55 },
  { id: "d4", x: 95, y: 80 },
  { id: "d5", x: 55, y: 45 },
  { id: "d6", x: 65, y: 25 },
  { id: "d7", x: 30, y: 40 },
]

// The correct outline of Capricornus, as a closed loop:
// Algedi - Dabih - psi - omega - zeta - epsilon - Deneb Algedi - Nashira - Algedi
const correctEdges: [string, string][] = [
  ["a", "b"],
  ["b", "c"],
  ["c", "d"],
  ["d", "e"],
  ["e", "f"],
  ["f", "g"],
  ["g", "h"],
  ["h", "a"],
]

function edgeKey(a: string, b: string) {
  return [a, b].sort().join("-")
}

const correctEdgeKeys = new Set(correctEdges.map(([a, b]) => edgeKey(a, b)))

// Deterministic pseudo-random generator (fixed seed) so ambient star
// positions/timings are stable between server render and client hydration.
function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

interface AmbientStar {
  x: number
  y: number
  r: number
  opacity: number
  delay: number
  duration: number
}

const ambientStars: AmbientStar[] = (() => {
  const rand = mulberry32(1337)
  const count = 45
  const list: AmbientStar[] = []
  for (let i = 0; i < count; i++) {
    list.push({
      x: rand() * 100,
      y: rand() * 100,
      r: 0.25 + rand() * 0.35,
      opacity: 0.15 + rand() * 0.35,
      delay: rand() * 4,
      duration: 2.5 + rand() * 3,
    })
  }
  return list
})()

export default function ConstellationPuzzle({ onSolve }: ConstellationPuzzleProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [connectedEdges, setConnectedEdges] = useState<Set<string>>(new Set())
  const [rejectedFlash, setRejectedFlash] = useState<string | null>(null)
  const [isComplete, setIsComplete] = useState(false)

  const allStars = [...stars, ...decoyStars]
  const starById = (id: string) => allStars.find((s) => s.id === id)!

  const handleStarClick = (id: string) => {
    if (isComplete) return

    if (!selected) {
      setSelected(id)
      return
    }

    if (selected === id) {
      setSelected(null)
      return
    }

    const key = edgeKey(selected, id)

    if (correctEdgeKeys.has(key) && !connectedEdges.has(key)) {
      const newEdges = new Set(connectedEdges)
      newEdges.add(key)
      setConnectedEdges(newEdges)

      if (newEdges.size === correctEdgeKeys.size) {
        setIsComplete(true)
        onSolve()
      }
    } else if (!correctEdgeKeys.has(key)) {
      setRejectedFlash(key)
      setTimeout(() => setRejectedFlash(null), 400)
    }

    setSelected(null)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative w-full aspect-square bg-gradient-to-b from-indigo-950 via-gray-950 to-black rounded-lg border border-indigo-900/50 overflow-hidden">
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
          {/* Ambient background stars, purely decorative */}
          {ambientStars.map((s, i) => (
            <circle
              key={`ambient-${i}`}
              cx={s.x}
              cy={s.y}
              r={s.r}
              fill="#e5e7eb"
              opacity={s.opacity}
              className="constellation-twinkle"
              style={{
                pointerEvents: "none",
                animationDelay: `${s.delay}s`,
                animationDuration: `${s.duration}s`,
              }}
            />
          ))}

          {/* Confirmed constellation lines */}
          {Array.from(connectedEdges).map((key) => {
            const [aId, bId] = key.split("-")
            const a = starById(aId)
            const b = starById(bId)
            return (
              <line
                key={key}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                pathLength={1}
                stroke="#c4b5fd"
                strokeWidth={0.5}
                opacity={0.8}
                className="constellation-line"
              />
            )
          })}

          {/* Line preview from the currently selected star */}
          {selected &&
            rejectedFlash === null &&
            (() => {
              const s = starById(selected)
              return <circle cx={s.x} cy={s.y} r={3.2} fill="none" stroke="#fde68a" strokeWidth={0.4} opacity={0.9} />
            })()}

          {/* Decoy stars */}
          {decoyStars.map((s) => (
            <circle
              key={s.id}
              cx={s.x}
              cy={s.y}
              r={0.8}
              fill="#e5e7eb"
              opacity={0.6}
              className="constellation-twinkle constellation-star-hover cursor-pointer"
              onClick={() => handleStarClick(s.id)}
            />
          ))}

          {/* Main constellation stars */}
          {stars.map((s) => (
            <circle
              key={s.id}
              cx={s.x}
              cy={s.y}
              r={selected === s.id ? 1.6 : 1.3}
              fill={selected === s.id ? "#fde68a" : "#fff7ed"}
              className="constellation-star-hover cursor-pointer"
              onClick={() => handleStarClick(s.id)}
              style={{ filter: "drop-shadow(0 0 1.5px rgba(255,255,255,0.8))" }}
            />
          ))}
        </svg>

        {rejectedFlash && (
          <div className="absolute inset-0 bg-red-900/20 pointer-events-none animate-pulse" />
        )}
      </div>

      <div className="text-center text-xs text-gray-400 mt-4">
        {isComplete
          ? "The shape is complete. What have you traced in the sky?"
          : "Click two stars to draw a line between them. Trace the shape hidden among the stars."}
      </div>

      <style jsx global>{`
        @keyframes constellation-twinkle {
          0%,
          100% {
            opacity: var(--twinkle-min, 0.2);
          }
          50% {
            opacity: 1;
          }
        }

        .constellation-twinkle {
          animation-name: constellation-twinkle;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        .constellation-star-hover {
          transform-box: fill-box;
          transform-origin: center;
          transition: transform 0.15s ease, filter 0.15s ease;
        }

        .constellation-star-hover:hover {
          transform: scale(1.6);
          filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.9));
        }

        .constellation-line {
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          animation: constellation-draw-line 0.5s ease-out forwards;
        }

        @keyframes constellation-draw-line {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  )
}
