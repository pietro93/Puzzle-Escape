"use client"

import { useEffect, useMemo, useRef } from "react"
import { X } from "lucide-react"

interface LevelMapScreenProps {
  currentLevel: number
  onClose: () => void
}

interface ZoneConfig {
  key: string
  accent: string
  start: number
  variant: "scratch" | "double" | "stars" | "carved" | "crack"
}

const ZONES: ZoneConfig[] = [
  { key: "prison", accent: "#b9ae90", start: 1, variant: "scratch" },
  { key: "mansion", accent: "#c9a227", start: 11, variant: "double" },
  { key: "forest", accent: "#8f7fe0", start: 21, variant: "stars" },
  { key: "desert", accent: "#c97b3e", start: 31, variant: "carved" },
  { key: "hell", accent: "#d6432a", start: 41, variant: "crack" },
]

const LEVELS_PER_ZONE = 10
const VIEW_W = 320
const ROW_H = 88
const TOP_PAD = 56
const AMPLITUDE = 90

// Deterministic RNG so the trail shape is stable across renders
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

interface Point {
  x: number
  y: number
}

function catmullRomToBezier(points: Point[]) {
  let d = `M ${points[0].x} ${points[0].y} `
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] || p2
    const c1x = p1.x + (p2.x - p0.x) / 6
    const c1y = p1.y + (p2.y - p0.y) / 6
    const c2x = p2.x - (p3.x - p1.x) / 6
    const c2y = p2.y - (p3.y - p1.y) / 6
    d += `C ${c1x} ${c1y} ${c2x} ${c2y} ${p2.x} ${p2.y} `
  }
  return d
}

function ZoneGlyph({ zone, className }: { zone: string; className?: string }) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
  }
  switch (zone) {
    case "prison":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="7" strokeWidth="1.6" />
          <path d="M12 5 L13.3 8.6" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      )
    case "mansion":
      return (
        <svg {...common}>
          <rect x="8" y="8" width="8" height="8" transform="rotate(45 12 12)" strokeWidth="1.4" />
        </svg>
      )
    case "forest":
      return (
        <svg {...common}>
          <path
            d="M12 4 L13.4 10.6 L20 12 L13.4 13.4 L12 20 L10.6 13.4 L4 12 L10.6 10.6 Z"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      )
    case "desert":
      return (
        <svg {...common}>
          <path d="M4 12 Q12 6 20 12 Q12 18 4 12 Z" strokeWidth="1.4" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="2" strokeWidth="1.4" />
        </svg>
      )
    case "hell":
      return (
        <svg {...common}>
          <path
            d="M12 4 C15 8 16 11 13.5 13.5 C15 13.8 15.6 15.2 14.6 16.8 C13.6 18.4 10.4 18.4 9.4 16.8 C8.4 15.2 9 13.8 10.5 13.5 C8 11 9 8 12 4 Z"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
        </svg>
      )
    default:
      return null
  }
}

function LockGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <rect x="7" y="11" width="10" height="8" rx="1.2" strokeWidth="1.4" />
      <path d="M9 11 V8.5 a3 3 0 0 1 6 0 V11" strokeWidth="1.4" />
    </svg>
  )
}

interface ZoneGeometry {
  points: Point[]
  height: number
  trails: React.ReactNode
  stars: { cx: number; cy: number; r: number }[]
}

function buildZoneGeometry(zone: ZoneConfig, zoneIndex: number): ZoneGeometry {
  const rand = mulberry32(zoneIndex * 97 + 13)
  const height = TOP_PAD * 2 + (LEVELS_PER_ZONE - 1) * ROW_H

  const points: Point[] = []
  for (let i = 0; i < LEVELS_PER_ZONE; i++) {
    const dir = i % 2 === 0 ? -1 : 1
    const jitter = (rand() - 0.5) * 24
    points.push({ x: VIEW_W / 2 + dir * (AMPLITUDE + jitter * 0.3), y: TOP_PAD + i * ROW_H })
  }

  const straight = zone.variant === "crack"
  const d = straight
    ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map((p) => `L ${p.x} ${p.y}`).join(" ")
    : catmullRomToBezier(points)

  const stars: { cx: number; cy: number; r: number }[] = []
  let trails: React.ReactNode = null

  switch (zone.variant) {
    case "scratch": {
      const offset = points.map((p) => ({ x: p.x + (rand() - 0.5) * 10, y: p.y + (rand() - 0.5) * 6 }))
      trails = (
        <>
          <path d={catmullRomToBezier(offset)} fill="none" stroke={zone.accent} strokeWidth="1" strokeOpacity="0.35" />
          <path d={d} fill="none" stroke={zone.accent} strokeWidth="1.4" strokeOpacity="0.8" />
        </>
      )
      break
    }
    case "double": {
      const offset = points.map((p) => ({ x: p.x + 5, y: p.y + 5 }))
      trails = (
        <>
          <path d={d} fill="none" stroke={zone.accent} strokeWidth="1" strokeOpacity="0.9" />
          <path d={catmullRomToBezier(offset)} fill="none" stroke={zone.accent} strokeWidth="1" strokeOpacity="0.4" />
        </>
      )
      break
    }
    case "stars": {
      for (let s = 0; s < 14; s++) {
        stars.push({
          cx: VIEW_W / 2 + (rand() - 0.5) * (VIEW_W - 40),
          cy: TOP_PAD * 0.6 + rand() * (height - TOP_PAD * 1.2),
          r: rand() * 1.1 + 0.4,
        })
      }
      trails = (
        <path
          d={d}
          fill="none"
          stroke={zone.accent}
          strokeWidth="1.4"
          strokeDasharray="1 13"
          strokeLinecap="round"
          strokeOpacity="0.9"
        />
      )
      break
    }
    case "carved":
      trails = (
        <path d={d} fill="none" stroke={zone.accent} strokeWidth="2.4" strokeDasharray="16 9" strokeOpacity="0.85" />
      )
      break
    case "crack":
      trails = (
        <>
          <path d={d} fill="none" stroke={zone.accent} strokeWidth="3" strokeOpacity="0.5" className="lm-crack-glow" />
          <path d={d} fill="none" stroke={zone.accent} strokeWidth="1.4" strokeOpacity="0.95" />
        </>
      )
      break
  }

  return { points, height, trails, stars }
}

export default function LevelMapScreen({ currentLevel, onClose }: LevelMapScreenProps) {
  const currentNodeRef = useRef<HTMLButtonElement | null>(null)

  const geometries = useMemo(() => ZONES.map((zone, i) => buildZoneGeometry(zone, i)), [])

  useEffect(() => {
    currentNodeRef.current?.scrollIntoView({ block: "center" })
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  return (
    <div className="lm-root fixed inset-0 z-50 overflow-y-auto overflow-x-hidden" role="dialog" aria-label="Level map">
      <style>{`
        .lm-root {
          background: #050507;
          scrollbar-width: none;
        }
        .lm-root::-webkit-scrollbar { display: none; }

        .lm-zone { animation: lm-zone-in 0.7s ease both; }
        .lm-zone[data-locked="true"] { opacity: 0.38; }
        @keyframes lm-zone-in {
          from { opacity: 0; transform: translateY(14px); }
          to { transform: translateY(0); }
        }
        .lm-zone[data-locked="true"] { animation-name: lm-zone-in-locked; }
        @keyframes lm-zone-in-locked {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 0.38; transform: translateY(0); }
        }

        .lm-node { animation: lm-node-in 0.5s ease both; }
        @keyframes lm-node-in {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.7); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }

        .lm-ring {
          background: #050507;
          border: 1.5px solid #3d3b36;
          transition: box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .lm-node[data-state="completed"] .lm-ring {
          border-color: var(--lm-accent);
          background: color-mix(in srgb, var(--lm-accent) 13%, #050507);
          box-shadow: inset 0 0 10px color-mix(in srgb, var(--lm-accent) 25%, transparent);
        }
        .lm-node[data-state="current"] .lm-ring {
          border-color: var(--lm-accent);
          box-shadow:
            0 0 0 1px color-mix(in srgb, var(--lm-accent) 40%, transparent),
            0 0 22px color-mix(in srgb, var(--lm-accent) 60%, transparent);
        }
        .lm-node[data-state="locked"] .lm-ring { opacity: 0.6; }

        .lm-pulse {
          position: absolute;
          inset: -8px;
          border-radius: 9999px;
          border: 1px solid var(--lm-accent);
          animation: lm-pulse 2.4s ease-out infinite;
        }
        @keyframes lm-pulse {
          0% { transform: scale(0.85); opacity: 0.6; }
          100% { transform: scale(1.4); opacity: 0; }
        }

        .lm-halo {
          position: absolute;
          width: 220px;
          height: 220px;
          border-radius: 9999px;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, var(--lm-accent) 0%, transparent 65%);
          opacity: 0.12;
          filter: blur(10px);
          animation: lm-breathe 5s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes lm-breathe {
          0%, 100% { opacity: 0.09; transform: translate(-50%, -50%) scale(0.92); }
          50% { opacity: 0.16; transform: translate(-50%, -50%) scale(1.05); }
        }

        .lm-crack-glow { filter: blur(3px); }

        .lm-star { animation: lm-twinkle 4s ease-in-out infinite; }
        @keyframes lm-twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.6; }
        }

        .lm-mote {
          position: absolute;
          border-radius: 9999px;
          background: var(--lm-accent);
          pointer-events: none;
          animation: lm-drift linear infinite;
        }
        @keyframes lm-drift {
          from { transform: translateY(0); opacity: 0; }
          15% { opacity: 0.35; }
          85% { opacity: 0.35; }
          to { transform: translateY(-140px); opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .lm-zone, .lm-node { animation: none; }
          .lm-pulse, .lm-mote { display: none; }
          .lm-halo, .lm-star { animation: none; }
        }
      `}</style>

      <button
        onClick={onClose}
        aria-label="Close map"
        className="fixed top-4 right-4 z-10 p-2 rounded-full bg-gray-900/70 border border-gray-800 text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="mx-auto max-w-md pt-14 pb-24">
        {ZONES.map((zone, zi) => {
          const geo = geometries[zi]
          const zoneLocked = currentLevel < zone.start
          const zoneIsCurrent = currentLevel >= zone.start && currentLevel < zone.start + LEVELS_PER_ZONE

          return (
            <div key={zone.key}>
              {zi > 0 && (
                <div className="h-14 flex items-center px-10">
                  <div
                    className="h-px w-full opacity-40"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${ZONES[zi - 1].accent}, ${zone.accent}, transparent)`,
                    }}
                  />
                </div>
              )}

              <section
                className="lm-zone relative"
                data-locked={zoneLocked}
                style={{ "--lm-accent": zone.accent, animationDelay: `${zi * 90}ms` } as React.CSSProperties}
              >
                <div className="flex justify-center pt-6" style={{ color: zone.accent }}>
                  <ZoneGlyph zone={zone.key} className="w-5 h-5 opacity-70" />
                </div>

                <div className="relative" style={{ height: geo.height }}>
                  <svg
                    viewBox={`0 0 ${VIEW_W} ${geo.height}`}
                    preserveAspectRatio="none"
                    className="absolute inset-0 w-full h-full overflow-visible"
                  >
                    {geo.trails}
                    {geo.stars.map((s, si) => (
                      <circle
                        key={si}
                        cx={s.cx}
                        cy={s.cy}
                        r={s.r}
                        fill={zone.accent}
                        className="lm-star"
                        style={{ animationDelay: `${(si * 0.7) % 4}s` }}
                      />
                    ))}
                  </svg>

                  {geo.points.map((p, i) => {
                    const level = zone.start + i
                    const state = level < currentLevel ? "completed" : level === currentLevel ? "current" : "locked"
                    const isCurrent = state === "current"

                    return (
                      <div key={level}>
                        {isCurrent && (
                          <div className="lm-halo" style={{ left: `${(p.x / VIEW_W) * 100}%`, top: p.y }} />
                        )}
                        <button
                          ref={isCurrent ? currentNodeRef : undefined}
                          onClick={isCurrent ? onClose : undefined}
                          disabled={!isCurrent}
                          aria-label={`Level ${level}${isCurrent ? ", current" : state === "locked" ? ", locked" : ", completed"}`}
                          data-state={state}
                          className={`lm-node absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 w-14 ${
                            isCurrent ? "cursor-pointer" : "cursor-default"
                          }`}
                          style={{
                            left: `${(p.x / VIEW_W) * 100}%`,
                            top: p.y,
                            animationDelay: `${zi * 90 + i * 45}ms`,
                          }}
                        >
                          <span className="lm-ring relative w-14 h-14 rounded-full flex items-center justify-center">
                            {isCurrent && <span className="lm-pulse" />}
                            <span
                              className="w-5 h-5"
                              style={{ color: state === "locked" ? "#3d3b36" : zone.accent }}
                            >
                              {state === "locked" ? (
                                <LockGlyph className="w-5 h-5" />
                              ) : (
                                <ZoneGlyph zone={zone.key} className="w-5 h-5" />
                              )}
                            </span>
                          </span>
                          <span
                            className="font-pixel text-[10px]"
                            style={{ color: state === "locked" ? "#4c4a44" : zone.accent }}
                          >
                            {String(level).padStart(2, "0")}
                          </span>
                        </button>
                      </div>
                    )
                  })}

                  {zoneIsCurrent &&
                    Array.from({ length: 8 }).map((_, mi) => (
                      <span
                        key={mi}
                        className="lm-mote"
                        style={{
                          width: mi % 3 === 0 ? 3 : 2,
                          height: mi % 3 === 0 ? 3 : 2,
                          left: `${12 + ((mi * 37) % 76)}%`,
                          top: `${18 + ((mi * 53) % 64)}%`,
                          animationDuration: `${7 + (mi % 4) * 2.5}s`,
                          animationDelay: `${mi * 1.1}s`,
                        }}
                      />
                    ))}
                </div>
              </section>
            </div>
          )
        })}
      </div>
    </div>
  )
}
