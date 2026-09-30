"use client"

import { useEffect, useState } from "react"

// Cut-out "puppet mouth" talking effect for character portraits, made from the
// single existing portrait image: a copy of the image clipped to the jaw slides
// down a few pixels over a dark mouth-gap. Jaw values are fractions of the
// portrait image itself: jaw box x0/y0/x1/y1, plus how far the jaw drops.
// `aspect` is the image's width / height (portraits that aren't square).
type Jaw = { x0: number; y0: number; x1: number; y1: number; drop: number; aspect?: number }

const JAWS: Record<string, Jaw> = {
  // Zone mentors
  skeleton: { x0: 0.36, y0: 0.635, x1: 0.67, y1: 0.73, drop: 0.03 },
  butler: { x0: 0.43, y0: 0.6, x1: 0.57, y1: 0.655, drop: 0.02 },
  gypsy: { x0: 0.455, y0: 0.466, x1: 0.55, y1: 0.51, drop: 0.015 },
  sphinx: { x0: 0.44, y0: 0.51, x1: 0.565, y1: 0.555, drop: 0.015 },
  devil: { x0: 0.43, y0: 0.408, x1: 0.61, y1: 0.52, drop: 0.025 },
  // Level 10 inmates
  caine: { x0: 0.4, y0: 0.638, x1: 0.6, y1: 0.72, drop: 0.022, aspect: 350 / 472 },
  ronan: { x0: 0.41, y0: 0.628, x1: 0.59, y1: 0.69, drop: 0.02, aspect: 376 / 452 },
  lyra: { x0: 0.42, y0: 0.608, x1: 0.58, y1: 0.675, drop: 0.02, aspect: 320 / 458 },
  silas: { x0: 0.39, y0: 0.645, x1: 0.6, y1: 0.68, drop: 0.015, aspect: 317 / 454 },
  // Level 49 murder mystery
  policewoman: { x0: 0.43, y0: 0.368, x1: 0.56, y1: 0.41, drop: 0.013 },
  mortician: { x0: 0.4, y0: 0.468, x1: 0.58, y1: 0.53, drop: 0.02 },
  librarian: { x0: 0.445, y0: 0.487, x1: 0.555, y1: 0.525, drop: 0.013 },
}
// Level 45 refers to the skeleton guard as "guard"
JAWS.guard = JAWS.skeleton

const MS_PER_CHAR = 45
const MAX_TALK_MS = 4000

const prefersReducedMotion = () =>
  typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

// Stable per-character offset so neighbouring portraits don't breathe in sync.
const breathDelay = (key: string) => {
  let h = 0
  for (const ch of key) h = (h * 31 + ch.charCodeAt(0)) % 997
  return `-${(h % 34) / 10}s`
}

interface TalkingPortraitProps {
  character: string
  src: string
  alt: string
  // The line being spoken. Each new non-empty value restarts the mouth for a
  // duration based on its length; null/empty keeps the mouth closed.
  speech?: string | null
  // Explicit control instead of `speech`: the mouth moves for as long as this is true
  // (e.g. while dialogue text is typing out).
  talking?: boolean
  // Idle breathing (a slow, slight swell from the bottom edge)
  breathe?: boolean
  // Classes for the base image, exactly as the portrait was styled before
  className?: string
}

export default function TalkingPortrait({
  character,
  src,
  alt,
  speech,
  talking,
  breathe = true,
  className = "",
}: TalkingPortraitProps) {
  const jaw = JAWS[character?.toLowerCase()]
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
    if (!jaw || prefersReducedMotion()) return
    const explicit = talking !== undefined
    if (explicit ? !talking : !speech) return

    const endAt = explicit ? Infinity : Date.now() + Math.min(speech!.length * MS_PER_CHAR, MAX_TALK_MS)
    let timer: ReturnType<typeof setTimeout>
    const flap = (nextOpen: boolean) => {
      if (Date.now() >= endAt) {
        setOpen(false)
        return
      }
      setOpen(nextOpen)
      timer = setTimeout(() => flap(!nextOpen), 80 + Math.random() * 90)
    }
    flap(true)
    return () => clearTimeout(timer)
  }, [speech, talking, jaw])

  const pct = (n: number) => `${n * 100}%`

  return (
    <div
      className={`relative w-full h-full ${breathe ? "animate-breathe motion-reduce:animate-none" : ""}`}
      style={breathe ? { animationDelay: breathDelay(character || src), transformOrigin: "50% 100%" } : undefined}
    >
      <img src={src} alt={alt} className={className} draggable={false} />
      {jaw && (
        // Overlay sized to the image itself (full width, natural aspect), so it
        // lines up whether the portrait is square-fitted or cropped at the bottom.
        <div
          aria-hidden
          className="absolute left-0 top-0 w-full pointer-events-none"
          style={{ aspectRatio: String(jaw.aspect ?? 1), zIndex: 11 }}
        >
          <div
            className="absolute rounded-[50%]"
            style={{
              left: pct(jaw.x0 + (jaw.x1 - jaw.x0) * 0.12),
              width: pct((jaw.x1 - jaw.x0) * 0.76),
              top: pct(jaw.y0 - jaw.drop * 0.3),
              height: pct(jaw.drop * 1.6),
              background: "rgb(10, 8, 12)",
              visibility: open ? "visible" : "hidden",
            }}
          />
          <img
            src={src}
            alt=""
            draggable={false}
            className="absolute inset-0 w-full h-full max-w-none pixelated"
            style={{
              clipPath: `inset(${pct(jaw.y0)} ${pct(1 - jaw.x1)} ${pct(1 - jaw.y1)} ${pct(jaw.x0)} round ${pct((jaw.y1 - jaw.y0) * 0.4)})`,
              transform: `translateY(${open ? pct(jaw.drop) : "0%"})`,
            }}
          />
        </div>
      )}
    </div>
  )
}
