"use client"

import { useEffect, useState } from "react"

interface MansionClockPuzzleProps {
  onStepChange?: (step: number) => void
}

// 12-hour and 0-59 minute pairs the hands move through on each green-button press.
// The literal Roman-numeral clue text the player needs is read from the butler, not the dial.
const SEQUENCE = [
  { hour: 3, minute: 0 },
  { hour: 12, minute: 9 },
  { hour: 9, minute: 18 },
  { hour: 6, minute: 27 },
]

// Shared rotation pivot (clock-face center) as a % of the equal-size canvas, used by both hand layers.
const PIVOT = { x: 50.7, y: 38.9 }

// Native pixel coordinates of the two button dots baked into clock.webp (696 x 1034 canvas).
const IMAGE_SIZE = { width: 696, height: 1034 }
const BUTTON_SIZE_PERCENT_OF_WIDTH = 11

// The hotspot divs were rendering with their center a half-diameter north and west of the actual
// dots. Nudge down and right by half a button-diameter to true-center them.
const BUTTON_DIAMETER_PX = (BUTTON_SIZE_PERCENT_OF_WIDTH / 100) * IMAGE_SIZE.width
const VERTICAL_CORRECTION_PERCENT = (BUTTON_DIAMETER_PX / 2 / IMAGE_SIZE.height) * 100
const HORIZONTAL_CORRECTION_PERCENT = BUTTON_SIZE_PERCENT_OF_WIDTH / 2

const GREEN_BUTTON = {
  x: (320 / IMAGE_SIZE.width) * 100 + HORIZONTAL_CORRECTION_PERCENT,
  y: (624 / IMAGE_SIZE.height) * 100 + VERTICAL_CORRECTION_PERCENT,
}
const RED_BUTTON = {
  x: (320 / IMAGE_SIZE.width) * 100 + HORIZONTAL_CORRECTION_PERCENT,
  y: (732 / IMAGE_SIZE.height) * 100 + VERTICAL_CORRECTION_PERCENT,
}

// Baseline rest angles: short hand needs +180 to read XII (its art points to VI unrotated), long hand rests at XII already.
const HOUR_BASELINE_DEG = 180
const MINUTE_BASELINE_DEG = 0

// Must match the hands' own transition-duration so the face only swaps once they've stopped moving.
const HAND_TRANSITION_MS = 3000
const FACE_CROSSFADE_MS = 900

const mod360 = (deg: number) => ((deg % 360) + 360) % 360

// Real clock hands only ever wind forward — never animate the "short way" backwards through a position.
const advanceClockwise = (current: number, targetMod360: number) => current + mod360(targetMod360 - mod360(current))

const targetsForStep = (step: number) => {
  const entry = step > 0 ? SEQUENCE[step - 1] : null
  const hourTarget = mod360(HOUR_BASELINE_DEG + (entry ? (entry.hour % 12) * 30 + entry.minute * 0.5 : 0))
  const minuteTarget = mod360(MINUTE_BASELINE_DEG + (entry ? entry.minute * 6 : 0))
  return { hourTarget, minuteTarget }
}

export default function MansionClockPuzzle({ onStepChange }: MansionClockPuzzleProps) {
  const [step, setStep] = useState(0) // 0 = idle (XII:XII), 1..4 = SEQUENCE index + 1
  const [pressed, setPressed] = useState<"green" | "red" | null>(null)
  const [hourRotation, setHourRotation] = useState(HOUR_BASELINE_DEG)
  const [minuteRotation, setMinuteRotation] = useState(MINUTE_BASELINE_DEG)
  // Which resting face is showing. Starts "idle" since at first mount the hands are already at
  // XII with no animation to wait for. Kept as a single piece of state (rather than two booleans)
  // so a shutdown -> idle reset crossfades clock2 straight into clock0, never briefly exposing the
  // bare clock.webp base layer in between.
  const [restingFace, setRestingFace] = useState<"idle" | "shutdown" | null>("idle")

  useEffect(() => {
    onStepChange?.(step)
  }, [step, onStepChange])

  // Only swap in a resting face once the hands have actually finished moving. Turning the clock
  // "on" (leaving a resting face) happens immediately instead, since that's the moment of the button press.
  useEffect(() => {
    if (step === 0) {
      const timer = setTimeout(() => setRestingFace("idle"), HAND_TRANSITION_MS)
      return () => clearTimeout(timer)
    }
    if (step >= SEQUENCE.length) {
      const timer = setTimeout(() => setRestingFace("shutdown"), HAND_TRANSITION_MS)
      return () => clearTimeout(timer)
    }
    setRestingFace(null)
  }, [step])

  const isIdle = restingFace === "idle"
  const isShutDown = restingFace === "shutdown"
  const isOff = restingFace !== null

  const press = (which: "green" | "red") => {
    setPressed(which)
    setTimeout(() => setPressed(null), 180)
  }

  const advanceTo = (newStep: number) => {
    const { hourTarget, minuteTarget } = targetsForStep(newStep)
    setHourRotation((prev) => advanceClockwise(prev, hourTarget))
    setMinuteRotation((prev) => advanceClockwise(prev, minuteTarget))
    setStep(newStep)
  }

  const handleGreen = () => {
    if (step >= SEQUENCE.length) return
    press("green")
    advanceTo(step + 1)
  }

  const handleRed = () => {
    if (step === 0) return
    press("red")
    advanceTo(0)
  }

  return (
    <div className="w-full max-w-xs mx-auto select-none">
      <div className="relative w-full" style={{ aspectRatio: `${IMAGE_SIZE.width} / ${IMAGE_SIZE.height}` }}>
        <img
          src="/images/clock.webp"
          alt="An ornate mantel clock"
          draggable={false}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />
        <img
          src="/images/clock0.webp"
          alt=""
          draggable={false}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            opacity: isIdle ? 1 : 0,
            transition: `opacity ${FACE_CROSSFADE_MS}ms ease-in-out`,
          }}
        />
        <img
          src="/images/clock2.webp"
          alt=""
          draggable={false}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            opacity: isShutDown ? 1 : 0,
            transition: `opacity ${FACE_CROSSFADE_MS}ms ease-in-out, filter ${FACE_CROSSFADE_MS}ms ease-in-out`,
            filter: isShutDown ? "brightness(0.85)" : "brightness(1)",
          }}
        />
        <img
          src="/images/clock_hand_short.webp"
          alt=""
          draggable={false}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            transform: `rotate(${hourRotation}deg)`,
            transformOrigin: `${PIVOT.x}% ${PIVOT.y}%`,
            transition: `transform ${HAND_TRANSITION_MS}ms ease-in-out, opacity ${FACE_CROSSFADE_MS}ms ease-in-out`,
            opacity: isOff ? 0.85 : 1,
          }}
        />
        <img
          src="/images/clock_hand_long.webp"
          alt=""
          draggable={false}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            transform: `rotate(${minuteRotation}deg)`,
            transformOrigin: `${PIVOT.x}% ${PIVOT.y}%`,
            transition: `transform ${HAND_TRANSITION_MS}ms ease-in-out, opacity ${FACE_CROSSFADE_MS}ms ease-in-out`,
            opacity: isOff ? 0.85 : 1,
          }}
        />

        <button
          type="button"
          aria-label="Advance the clock"
          onClick={handleGreen}
          disabled={step >= SEQUENCE.length}
          className={`absolute w-[11%] aspect-square rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-150 ${
            pressed === "green" ? "scale-90 brightness-150" : "scale-100"
          } ${step >= SEQUENCE.length ? "cursor-not-allowed" : "cursor-pointer hover:brightness-125"}`}
          style={{ left: `${GREEN_BUTTON.x}%`, top: `${GREEN_BUTTON.y}%` }}
        />

        <button
          type="button"
          aria-label="Reset the clock"
          onClick={handleRed}
          disabled={step === 0}
          className={`absolute w-[11%] aspect-square rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-150 ${
            pressed === "red" ? "scale-90 brightness-150" : "scale-100"
          } ${step === 0 ? "cursor-not-allowed" : "cursor-pointer hover:brightness-125"}`}
          style={{ left: `${RED_BUTTON.x}%`, top: `${RED_BUTTON.y}%` }}
        />
      </div>
    </div>
  )
}
