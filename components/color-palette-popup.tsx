"use client"

import { useState } from "react"
import { X } from "lucide-react"

interface ColorPalettePopupProps {
  onClose: () => void
}

const THICKNESS_LAYERS = 8

export default function ColorPalettePopup({ onClose }: ColorPalettePopupProps) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center p-3 rounded-lg animate-fadeIn">
      <div className="relative bg-gray-900 rounded-lg border-2 border-gray-700 p-2 w-full h-full max-w-[280px] max-h-[280px]">
        <button
          onClick={onClose}
          className="absolute top-1 right-1 z-10 w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700"
          aria-label="Close palette"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>

        <div className="flex justify-center items-center w-full h-full">
          <div
            className="relative w-full h-full cursor-pointer"
            style={{ perspective: "1200px" }}
            onClick={() => setFlipped((f) => !f)}
          >
            <div
              className="relative w-full h-full transition-transform duration-700 ease-in-out"
              style={{
                transformStyle: "preserve-3d",
                transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              {/* Extruded edge layers to fake the palette's thickness.
                  A 180deg rotateY negates the Z axis, so the sign of translateZ
                  (and the X offset direction) must flip with `flipped` to stay
                  behind whichever face is currently forward-facing. */}
              {Array.from({ length: THICKNESS_LAYERS }).map((_, i) => {
                const depth = THICKNESS_LAYERS - i
                const sign = flipped ? 1 : -1
                return (
                  <img
                    key={i}
                    src="/images/color-palette/palette-front.webp"
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-contain pixelated pointer-events-none"
                    style={{
                      transform: `translate(${sign * depth * 0.6}px, ${depth * 0.6}px) translateZ(${sign * depth}px)`,
                      filter: `brightness(${0.3 + i * 0.03})`,
                    }}
                  />
                )
              })}

              {/* Front face */}
              <img
                src="/images/color-palette/palette-front.webp"
                alt="Palette front"
                className="absolute inset-0 w-full h-full object-contain pixelated"
                style={{ backfaceVisibility: "hidden" }}
              />

              {/* Back face */}
              <img
                src="/images/color-palette/palette-back.webp"
                alt="Palette back"
                className="absolute inset-0 w-full h-full object-contain pixelated"
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
