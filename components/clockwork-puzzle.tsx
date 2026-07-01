"use client"

import { useRef, useState } from "react"

interface ClockworkPuzzleProps {
  onSolve: () => void
}

export default function ClockworkPuzzle({ onSolve }: ClockworkPuzzleProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const dragState = useRef<{ startAngle: number; startRotation: number } | null>(null)
  const [rotation, setRotation] = useState(0)

  const angleFromCenter = (clientX: number, clientY: number) => {
    const rect = containerRef.current!.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    return (Math.atan2(clientY - cy, clientX - cx) * 180) / Math.PI
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    dragState.current = { startAngle: angleFromCenter(e.clientX, e.clientY), startRotation: rotation }
    window.addEventListener("pointermove", handlePointerMove)
    window.addEventListener("pointerup", handlePointerUp)
  }

  const handlePointerMove = (e: PointerEvent) => {
    if (!dragState.current) return
    const currentAngle = angleFromCenter(e.clientX, e.clientY)
    setRotation(dragState.current.startRotation + (currentAngle - dragState.current.startAngle))
  }

  const handlePointerUp = () => {
    dragState.current = null
    window.removeEventListener("pointermove", handlePointerMove)
    window.removeEventListener("pointerup", handlePointerUp)
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <p className="text-gray-300 font-mono text-sm mb-3">
        A dust-caked clockwork mechanism sits before you.
      </p>

      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        className="relative w-80 h-80 mx-auto cursor-grab active:cursor-grabbing select-none touch-none"
      >
        <img
          src="/images/clockwork_face.webp"
          alt=""
          draggable={false}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />
        <img
          src="/images/clockwork_letters.webp"
          alt=""
          draggable={false}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />
        <img
          src="/images/clockwork_overlay.webp"
          alt=""
          draggable={false}
          style={{ transform: `rotate(${rotation}deg)` }}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />
      </div>
    </div>
  )
}
