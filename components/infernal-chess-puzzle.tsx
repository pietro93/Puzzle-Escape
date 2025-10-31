"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

// Types
type HorsemanType = "death" | "pestilence" | "war" | "famine"
type Position = { row: number; col: number }
type Tile = {
  visible: boolean
  targetFor?: HorsemanType
  startFor?: HorsemanType
  background: string
  imageNum: number
}
type Horseman = {
  type: HorsemanType
  position: Position
  targetPosition: Position
  color: string
  image: string
  mayhemText: string
}
type TrailParticle = {
  id: string
  horseman: HorsemanType
  x: number
  y: number
  createdAt: number
}
type TouchedTile = {
  key: string
  horseman: HorsemanType
  touchedAt: number
}

// BOARD SIZE
const BOARD_SIZE = 5

// Helper: convert "A1" coords -> zero-indexed {row, col}
// Columns: A..E -> col 0..4, Rows: 1..5 -> row 0..4
const coordToPos = (coord: string): Position | null => {
  if (!coord || coord.length < 2) return null
  const colChar = coord[0].toUpperCase()
  const col = colChar.charCodeAt(0) - "A".charCodeAt(0)
  const row = parseInt(coord.slice(1), 10) - 1
  if (
    Number.isNaN(row) ||
    col < 0 ||
    col >= BOARD_SIZE ||
    row < 0 ||
    row >= BOARD_SIZE
  )
    return null
  return { row, col }
}

// Color mapping for horsemen
const HORSEMAN_COLORS: Record<HorsemanType, string> = {
  death: "#000000",
  pestilence: "#22c55e",
  war: "#ef4444",
  famine: "#a855f7",
}

const HORSEMAN_GLOW_COLORS: Record<HorsemanType, string> = {
  death: "rgba(0, 0, 0, 0.9)",
  pestilence: "rgba(34, 197, 94, 0.9)",
  war: "rgba(239, 68, 68, 0.9)",
  famine: "rgba(168, 85, 247, 0.9)",
}

// Corner colors
const CORNER_COLORS: Record<string, string> = {
  "0,0": "#a855f7", // purple - top left
  "0,4": "#22c55e", // green - top right
  "4,0": "#ef4444", // red - bottom left
  "4,4": "#000000", // black - bottom right
}

// ------------------ TILE LETTERS (post-completion) ------------------
const TILE_LETTERS: Record<string, string> = {
  "3,2": "A", // C4
  "2,0": "R", // A3
  "0,1": "E", // B1
  "0,3": "N", // D1
  "1,3": "N", // D2
  "2,4": "I", // E3
  "1,1": "T", // B2
  "1,2": "O", // C2
  "3,1": "F", // B4
  "0,2": "U", // C1
  "1,0": "B", // A2
  "2,2": "C", // C3
  "3,3": "H", // D4
  "1,4": "S", // E2
  "3,4": "L", // E4
  "4,1": "R", // B5
  "4,3": "L", // D5
  "4,2": "D", // C5
  "3,0": "E", // A4
}

// ------------------ HORSEMEN PATHS (post-completion) ------------------
const HORSEMEN_PATHS: Record<HorsemanType, Position[]> = {
  death: ["E5", "C4", "A3", "B1", "D2", "C4", "E5"]
    .map(c => coordToPos(c)!)
    .filter(Boolean),
  pestilence: ["E1", "C2", "B4", "D3", "E1"]
    .map(c => coordToPos(c)!)
    .filter(Boolean),
  war: ["A5", "C4", "D2", "B3", "A5"]
    .map(c => coordToPos(c)!)
    .filter(Boolean),
  famine: [
    "A1",
    "C2",
    "E3",
    "D1",
    "B2",
    "A4",
    "C5",
    "B3",
    "A1",
  ]
    .map(c => coordToPos(c)!)
    .filter(Boolean),
}

// Order and stagger config
const HORSEMAN_ORDER: HorsemanType[] = ["death", "pestilence", "war", "famine"]
const STAGGER_DELAY_MS = 1500 // 2s between starts

// Speeds (ms per move)
const HORSEMAN_SPEED_MS: Record<HorsemanType, number> = {
  death: 2000,
  pestilence: 2000,
  war: 2000,
  famine: 2000,
}

// Trail config
const TRAIL_DURATION_MS = 800 // How long trail particles last
const TRAIL_SPAWN_INTERVAL_MS = 50 // How often to spawn trail particles

// Touched tile glow duration
const TOUCHED_TILE_GLOW_DURATION_MS = 2000

// ------------------ COMPONENT ------------------
export default function InfernalChessPuzzle() {
  // Board initialization
  const initializeBoard = (): Tile[][] => {
    const board: Tile[][] = Array(BOARD_SIZE)
      .fill(null)
      .map((_, row) =>
        Array(BOARD_SIZE)
          .fill(null)
          .map((_, col) => ({
            visible: true,
            background:
              (row + col) % 2 === 0 ? "bg-gray-700" : "bg-gray-400",
            imageNum: Math.floor(Math.random() * 6) + 1,
          })),
      )

    const CORNERS = {
      TL: { row: 0, col: 0 },
      TR: { row: 0, col: 4 },
      BL: { row: 4, col: 0 },
      BR: { row: 4, col: 4 },
    }

    board[CORNERS.TL.row][CORNERS.TL.col] = {
      ...board[CORNERS.TL.row][CORNERS.TL.col],
      startFor: "death",
      targetFor: "famine",
      background: "bg-purple-900",
    }

    board[CORNERS.BL.row][CORNERS.BL.col] = {
      ...board[CORNERS.BL.row][CORNERS.BL.col],
      startFor: "pestilence",
      targetFor: "war",
      background: "bg-red-900",
    }

    board[CORNERS.TR.row][CORNERS.TR.col] = {
      ...board[CORNERS.TR.row][CORNERS.TR.col],
      startFor: "war",
      targetFor: "pestilence",
      background: "bg-green-900",
    }

    board[CORNERS.BR.row][CORNERS.BR.col] = {
      ...board[CORNERS.BR.row][CORNERS.BR.col],
      startFor: "famine",
      targetFor: "death",
      background: "bg-black",
    }

    return board
  }

  const initializeHorsemen = (): Horseman[] => [
    {
      type: "death",
      position: { row: 0, col: 0 },
      targetPosition: { row: 4, col: 4 },
      color: "black",
      image: "/images/horseman_death.webp",
      mayhemText: "Death brings eternal silence to all living souls.",
    },
    {
      type: "pestilence",
      position: { row: 4, col: 0 },
      targetPosition: { row: 0, col: 4 },
      color: "green",
      image: "/images/horseman_pestilence.webp",
      mayhemText:
        "Pestilence spreads disease through every corner of the world.",
    },
    {
      type: "war",
      position: { row: 0, col: 4 },
      targetPosition: { row: 4, col: 0 },
      color: "red",
      image: "/images/horseman_war.webp",
      mayhemText: "War ignites conflict and bloodshed across all nations.",
    },
    {
      type: "famine",
      position: { row: 4, col: 4 },
      targetPosition: { row: 0, col: 0 },
      color: "purple",
      image: "/images/horseman_famine.webp",
      mayhemText:
        "Famine withers crops and starves the masses into desperation.",
    },
  ]

  // States
  const [board] = useState<Tile[][]>(initializeBoard())
  const [horsemen, setHorsemen] = useState<Horseman[]>(initializeHorsemen())
  const [selectedHorseman, setSelectedHorseman] =
    useState<HorsemanType | null>(null)
  const [lastMovedHorseman, setLastMovedHorseman] =
    useState<HorsemanType | null>(null)
  const [validMoves, setValidMoves] = useState<Position[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const [showError, setShowError] = useState<Position | null>(null)
  const [moveCount, setMoveCount] = useState(0)
  const [imageLoadErrors, setImageLoadErrors] = useState<
    Record<string, boolean>
  >({})
  const [started, setStarted] = useState<Record<HorsemanType, boolean>>({
    death: false,
    pestilence: false,
    war: false,
    famine: false,
  })
  const [trailParticles, setTrailParticles] = useState<TrailParticle[]>([])
  const [touchedTiles, setTouchedTiles] = useState<TouchedTile[]>([])

  // Refs for intervals and indices
  const intervalIdsRef = useRef<Record<string, number | null>>({
    death: null,
    pestilence: null,
    war: null,
    famine: null,
  })
  const trailIntervalIdsRef = useRef<Record<string, number | null>>({
    death: null,
    pestilence: null,
    war: null,
    famine: null,
  })
  const pathIndexRef = useRef<Record<HorsemanType, number>>({
    death: 0,
    pestilence: 0,
    war: 0,
    famine: 0,
  })
  const previousPositionsRef = useRef<Record<HorsemanType, Position>>({
    death: { row: 0, col: 0 },
    pestilence: { row: 4, col: 0 },
    war: { row: 0, col: 4 },
    famine: { row: 4, col: 4 },
  })

  // Board DOM ref to compute tile pixel size
  const boardRef = useRef<HTMLDivElement | null>(null)
  const [tileSize, setTileSize] = useState(0)

  useEffect(() => {
    const updateTileSize = () => {
      if (!boardRef.current) return
      const width = boardRef.current.clientWidth
      const size = Math.floor(width / BOARD_SIZE)
      setTileSize(size)
    }
    updateTileSize()
    window.addEventListener("resize", updateTileSize)
    return () => window.removeEventListener("resize", updateTileSize)
  }, [])

  // Helper: find horseman at tile
  const getHorsemanAt = (row: number, col: number) =>
    horsemen.find(h => h.position.row === row && h.position.col === col)

  // Knight moves calculation
  const calculateValidMoves = (horseman: Horseman): Position[] => {
    if (isComplete) return []
    const { row, col } = horseman.position
    const possibleMoves: Position[] = [
      { row: row - 2, col: col - 1 },
      { row: row - 2, col: col + 1 },
      { row: row - 1, col: col - 2 },
      { row: row - 1, col: col + 2 },
      { row: row + 1, col: col - 2 },
      { row: row + 1, col: col + 2 },
      { row: row + 2, col: col - 1 },
      { row: row + 2, col: col + 1 },
    ]
    return possibleMoves.filter(
      m =>
        m.row >= 0 &&
        m.row < BOARD_SIZE &&
        m.col >= 0 &&
        m.col < BOARD_SIZE &&
        !getHorsemanAt(m.row, m.col),
    )
  }

  // Selection handlers
  const handleHorsemanSelect = (type: HorsemanType) => {
    if (isComplete) return
    if (selectedHorseman === type) {
      setSelectedHorseman(null)
      setValidMoves([])
      return
    }
    if (type === lastMovedHorseman) {
      const horseman = horsemen.find(h => h.type === type)
      if (horseman) {
        setShowError(horseman.position)
        setTimeout(() => setShowError(null), 500)
      }
      return
    }
    setSelectedHorseman(type)
    const horseman = horsemen.find(h => h.type === type)
    if (horseman) setValidMoves(calculateValidMoves(horseman))
  }

  const handleTileClick = (row: number, col: number) => {
    if (isComplete) return
    const horseman = getHorsemanAt(row, col)
    if (horseman) {
      handleHorsemanSelect(horseman.type)
      return
    }
    if (selectedHorseman) {
      const isValidMove = validMoves.some(
        m => m.row === row && m.col === col,
      )
      if (isValidMove) {
        setHorsemen(prev =>
          prev.map(h =>
            h.type === selectedHorseman ? { ...h, position: { row, col } } : h,
          ),
        )
        setLastMovedHorseman(selectedHorseman)
        setMoveCount(v => v + 1)
        setSelectedHorseman(null)
        setValidMoves([])
        
        // Mark tile as touched
        markTileTouched(row, col, selectedHorseman)
      } else {
        setShowError({ row, col })
        setTimeout(() => setShowError(null), 500)
      }
    }
  }

  const markTileTouched = (row: number, col: number, horseman: HorsemanType) => {
    const tileKey = `${row},${col}`
    setTouchedTiles(prev => [...prev, {
      key: tileKey,
      horseman,
      touchedAt: Date.now(),
    }])
  }

  const handleImageError = (type: HorsemanType) => {
    setImageLoadErrors(prev => ({ ...prev, [type]: true }))
  }

  const getFallbackContent = (type: HorsemanType) => {
    const colorClass =
      type === "death"
        ? "bg-black"
        : type === "pestilence"
        ? "bg-green-800"
        : type === "war"
        ? "bg-red-800"
        : "bg-purple-800"
    return (
      <div
        className={`w-[80px] h-[100px] flex items-center justify-center text-white font-bold ${colorClass} rounded-md`}
      >
        <span className="text-2xl uppercase">{type.charAt(0)}</span>
      </div>
    )
  }

  // SHORTCUT: Skip to Phase 2
  const skipToPhase2 = () => {
    setHorsemen(prev => prev.map(h => ({ ...h, position: h.targetPosition })))
    setMoveCount(1) // Ensure moveCount > 0
    setIsComplete(true)
  }

  // Check initial-phase completion
  useEffect(() => {
    if (isComplete) return
    const allAtTarget = horsemen.every(
      h =>
        h.position.row === h.targetPosition.row &&
        h.position.col === h.targetPosition.col,
    )
    if (allAtTarget && moveCount > 0) {
      setIsComplete(true)
    }
  }, [horsemen, moveCount, isComplete])

  // Create trail particles during phase 1 (player controlled)
  useEffect(() => {
    if (isComplete) return

    const createTrailParticles = () => {
      horsemen.forEach(h => {
        // Random chance to spawn trail
        if (Math.random() > 0.3) return

        const centerX = h.position.col * tileSize + tileSize / 2
        const centerY = h.position.row * tileSize + tileSize / 2

        const particleId = `${h.type}-${Date.now()}-${Math.random()}`
        setTrailParticles(prev => [...prev, {
          id: particleId,
          horseman: h.type,
          x: centerX + (Math.random() - 0.5) * tileSize * 0.4,
          y: centerY + (Math.random() - 0.5) * tileSize * 0.4,
          createdAt: Date.now(),
        }])
      })
    }

    const trailInterval = setInterval(createTrailParticles, TRAIL_SPAWN_INTERVAL_MS)
    return () => clearInterval(trailInterval)
  }, [horsemen, tileSize, isComplete])

  // When completion occurs: start staggered movement loops
  useEffect(() => {
    if (!isComplete) return

    // Initialize path indexes
    HORSEMAN_ORDER.forEach(type => {
      const path = HORSEMEN_PATHS[type]
      const h = horsemen.find(h => h.type === type)
      let startIndex = 0
      if (h) {
        const match = path.findIndex(
          p => p.row === h.position.row && p.col === h.position.col,
        )
        if (match >= 0) startIndex = match
      }
      pathIndexRef.current[type] = startIndex
      previousPositionsRef.current[type] = horsemen.find(h => h.type === type)?.position || { row: 0, col: 0 }
    })

    const starts: number[] = []
    const intervals: number[] = []

    HORSEMAN_ORDER.forEach((type, orderIdx) => {
      const startDelay = STAGGER_DELAY_MS * orderIdx
      const speed = HORSEMAN_SPEED_MS[type]

      const startTimeout = window.setTimeout(() => {
        setStarted(prev => ({ ...prev, [type]: true }))

        const startIdx = pathIndexRef.current[type] % HORSEMEN_PATHS[type].length
        setHorsemen(prev =>
          prev.map(h =>
            h.type === type
              ? { ...h, position: HORSEMEN_PATHS[type][startIdx] }
              : h,
          ),
        )

        const id = window.setInterval(() => {
          pathIndexRef.current[type] =
            (pathIndexRef.current[type] + 1) % HORSEMEN_PATHS[type].length
          const nextPos = HORSEMEN_PATHS[type][pathIndexRef.current[type]]
          
          // Mark tile as touched
          markTileTouched(nextPos.row, nextPos.col, type)
          
          previousPositionsRef.current[type] = nextPos
          setHorsemen(prev =>
            prev.map(h => (h.type === type ? { ...h, position: nextPos } : h)),
          )
        }, speed)

        intervalIdsRef.current[type] = id
        intervals.push(id)
      }, startDelay)

      starts.push(startTimeout)
    })

    return () => {
      starts.forEach(id => clearTimeout(id))
      HORSEMAN_ORDER.forEach(t => {
        const id = intervalIdsRef.current[t]
        if (id != null) {
          clearInterval(id)
          intervalIdsRef.current[t] = null
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComplete])

  // Clean up old trail particles
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = Date.now()
      setTrailParticles(prev => prev.filter(p => now - p.createdAt < TRAIL_DURATION_MS))
      setTouchedTiles(prev => prev.filter(t => now - t.touchedAt < TOUCHED_TILE_GLOW_DURATION_MS))
    }, 100)
    return () => clearInterval(cleanupInterval)
  }, [])

  // Inline CSS
  const inlineStyles = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(6px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .mayhem-fade {
      animation: fadeInUp 600ms ease both;
    }
    @keyframes cornerGlow {
      0%, 100% {
        box-shadow: 0 0 10px 2px currentColor, inset 0 0 10px 1px currentColor;
      }
      50% {
        box-shadow: 0 0 20px 4px currentColor, inset 0 0 15px 2px currentColor;
      }
    }
    .corner-glow {
      animation: cornerGlow 2s ease-in-out infinite;
    }
    @keyframes trailFade {
      0% {
        opacity: 1;
        transform: scale(1);
      }
      100% {
        opacity: 0;
        transform: scale(0.3);
      }
    }
    .trail-particle {
      animation: trailFade 0.8s ease-out forwards;
    }
  `

  return (
    <div className="flex flex-col items-center justify-center w-full mx-auto p-2">
      <style>{inlineStyles}</style>

      <div className="mb-4 text-center">
        <h3 className="text-xl font-pixel text-purple-300 mb-2">
          Infernal Chess
        </h3>
        {!isComplete && (
          <>
            <p className="text-sm font-pixel text-gray-300 mb-4">
              Move each horseman to its opposite corner. Knights move in L-shapes.
              You cannot move the same horseman twice in a row.
            </p>
            <p className="text-sm font-pixel text-yellow-300 mb-2">
              Move Count: {moveCount}
            </p>
            {/* TESTING SHORTCUT BUTTON */}
            <button
              onClick={skipToPhase2}
              className="mt-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-pixel text-xs rounded transition-colors"
            >
              [TEST] Skip to Phase 2
            </button>
          </>
        )}
      </div>

      {/* Board container */}
      <div ref={boardRef} className="relative w-full max-w-lg">
        <div className="grid grid-cols-5 gap-0.5 bg-gray-900 p-2 rounded-lg shadow-lg">
          {board.map((row, rIdx) =>
            row.map((tile, cIdx) => {
              const horseman = getHorsemanAt(rIdx, cIdx)
              const isSelected =
                selectedHorseman && horseman?.type === selectedHorseman
              const isValid = validMoves.some(
                m => m.row === rIdx && m.col === cIdx,
              )
              const isErr = showError?.row === rIdx && showError?.col === cIdx
              const isCorner = (rIdx === 0 && cIdx === 0) || (rIdx === 0 && cIdx === 4) || (rIdx === 4 && cIdx === 0) || (rIdx === 4 && cIdx === 4)

              // Determine corner glow color
              let cornerColor = ""
              if (isCorner) {
                if (rIdx === 0 && cIdx === 0) cornerColor = "text-purple-500"
                else if (rIdx === 0 && cIdx === 4) cornerColor = "text-green-500"
                else if (rIdx === 4 && cIdx === 0) cornerColor = "text-red-500"
                else if (rIdx === 4 && cIdx === 4) cornerColor = "text-black"
              }

              // Get touched tile data
              const tileKey = `${rIdx},${cIdx}`
              const touchedTileData = touchedTiles.find(t => t.key === tileKey)
              const touchOpacity = touchedTileData
                ? Math.max(0, 1 - (Date.now() - touchedTileData.touchedAt) / TOUCHED_TILE_GLOW_DURATION_MS)
                : 0

              return (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className={`
                    relative aspect-square flex items-center justify-center
                    ${tile.background}
                    ${isCorner ? `corner-glow ${cornerColor}` : ""}
                    ${!isComplete && isSelected ? "ring-2 ring-white-400 z-2" : ""}
                    ${!isComplete && isValid ? "ring-2 ring-white-300 cursor-pointer hover:bg-yellow-800/50" : ""}
                    ${!isComplete && isErr ? "ring-2 ring-red-500 animate-pulse" : ""}
                    transition-all duration-200
                  `}
                  onClick={() => handleTileClick(rIdx, cIdx)}
                  style={touchOpacity > 0 && touchedTileData ? {
                    boxShadow: `inset 0 0 ${12 * touchOpacity}px ${6 * touchOpacity}px ${HORSEMAN_GLOW_COLORS[touchedTileData.horseman]}`,
                  } : undefined}
                >
                  <div
                    className="absolute inset-0 opacity-55 pointer-events-none"
                    style={{ backgroundImage: `url("/images/chess-tile-${tile.imageNum}.webp")`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}
                  ></div>
                  {isComplete && TILE_LETTERS[`${rIdx},${cIdx}`] && (
                    <span className="opacity-70 absolute text-4xl md:text-5xl font-pixel text-white-300/90 select-none pointer-events-none">
                      {TILE_LETTERS[`${rIdx},${cIdx}`]}
                    </span>
                  )}
                </div>
              )
            }),
          )}
        </div>

        {/* Trail particles */}
        {trailParticles.map(particle => {
          const age = Date.now() - particle.createdAt
          const progress = Math.min(age / TRAIL_DURATION_MS, 1)

          return (
            <div
              key={particle.id}
              className="absolute rounded-full pointer-events-none trail-particle"
              style={{
                width: tileSize * 0.25,
                height: tileSize * 0.25,
                left: particle.x - (tileSize * 0.125),
                top: particle.y - (tileSize * 0.125),
                backgroundColor: HORSEMAN_GLOW_COLORS[particle.horseman],
                opacity: 1 - progress * 0.7,
                boxShadow: `0 0 ${8 * (1 - progress)}px ${4 * (1 - progress)}px ${HORSEMAN_GLOW_COLORS[particle.horseman]}`,
                transform: `scale(${1 - progress * 0.7})`,
                animation: `trailFade ${TRAIL_DURATION_MS}ms ease-out forwards`,
                animationDelay: `0ms`,
              }}
            />
          )
        })}

        {/* Absolute-positioned horsemen */}
        {horsemen.map(h => {
          const left = h.position.col * tileSize
          const top = h.position.row * tileSize
          const wrapperStyle: React.CSSProperties = {
            width: tileSize,
            height: tileSize,
            position: "absolute",
            left,
            top,
            pointerEvents: "none",
          }

          return (
            <motion.div
              key={h.type}
              style={wrapperStyle}
              animate={{ left, top }}
              transition={{
                type: "tween",
                duration: HORSEMAN_SPEED_MS[h.type] / 1000,
                ease: "easeInOut",
              }}
            >
              <div className="flex items-center justify-center w-full h-full pointer-events-none">
                <div className="relative w-[72px] h-[90px] flex flex-col items-center justify-center">
                  {imageLoadErrors[h.type] ? (
                    getFallbackContent(h.type)
                  ) : (
                    <img
                      src={h.image || "/placeholder.svg"}
                      alt={h.type}
                      width={80}
                      height={100}
                      className="object-contain drop-shadow-xl"
                      onError={() => handleImageError(h.type)}
                    />
                  )}
                  <span className="absolute bottom-[-5px] left-0 right-0 text-center text-xs text-white font-pixel capitalize bg-black/50 px-1 rounded w-full">
                    {h.type}
                  </span>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Mayhem texts (ordered Death, Pestilence, War, Famine) */}
      {isComplete && (
        <div className="mt-4 w-full max-w-lg">
          <div className="bg-red-900/50 border border-red-800 rounded-lg p-3 text-sm font-pixel text-red-200">
            {HORSEMAN_ORDER.map(type => {
              const h = horsemen.find(h => h.type === type)!
              const visible = started[type] || false
              return (
                <p
                  key={type}
                  className={`${visible ? "mayhem-fade" : "opacity-0"} mb-1`}
                  style={{ transition: "opacity 950ms ease" }}
                >
                  {h?.mayhemText}
                </p>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}