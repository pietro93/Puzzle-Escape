"use client"

import { forwardRef, useImperativeHandle, useRef } from "react"
import { ZoomIn, ZoomOut } from "lucide-react"
import { useZoomPan } from "@/hooks/use-zoom-pan"

export interface LampRevealHandle {
  /** Show the reveal at this client-space point, or hide it (null) — recomputed fresh each call, not accumulated. */
  revealAt: (point: { x: number; y: number } | null) => void
}

interface LampRevealProps {
  /** Dark, undisturbed image — painted onto the top layer, opaque except a moving hole around the lamp. */
  cleanSrc: string
  /** What's underneath, pixel-aligned to cleanSrc — only visible through the hole. */
  revealedSrc: string
  alt: string
  className?: string
  /** Glow hole radius in canvas pixels (i.e. the image's own natural resolution). */
  glowRadius?: number
  /** Whether the player has unlocked zoom (the Loupe) — same gate as PaintingInspector. */
  zoomEnabled?: boolean
}

/**
 * Lamp-light reveal: cleanSrc is drawn opaque onto a canvas layered over
 * revealedSrc, with a soft radial hole punched at the current lamp position
 * so only a small spot of revealedSrc shows through — like holding a lamp up
 * to a dark wall. Unlike CharcoalRubbing's scratch (which accumulates
 * permanently), the hole is redrawn from scratch on every revealAt call, so
 * it moves with the lamp and disappears once the lamp leaves.
 */
const LampReveal = forwardRef<LampRevealHandle, LampRevealProps>(function LampReveal(
  { cleanSrc, revealedSrc, alt, className = "", glowRadius = 90, zoomEnabled = true },
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cleanImgRef = useRef<HTMLImageElement | null>(null)
  const {
    viewportRef,
    baseSize,
    setBaseSizeFromNatural,
    zoom,
    offset,
    isDragging,
    handlePointerDown,
    applyZoom,
    MIN_ZOOM,
    MAX_ZOOM,
    ZOOM_STEP,
  } = useZoomPan(zoomEnabled)

  const paintClean = () => {
    const canvas = canvasRef.current
    const img = cleanImgRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !img || !ctx) return
    ctx.globalCompositeOperation = "source-over"
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  }

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const canvas = canvasRef.current
    const img = e.currentTarget
    if (!canvas) return
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    setBaseSizeFromNatural(img.naturalWidth, img.naturalHeight)
    cleanImgRef.current = img
    paintClean()
  }

  useImperativeHandle(ref, () => ({
    revealAt(clientPoint) {
      const canvas = canvasRef.current
      const ctx = canvas?.getContext("2d")
      if (!canvas || !ctx) return
      paintClean()
      if (!clientPoint) return
      const rect = canvas.getBoundingClientRect()
      if (
        clientPoint.x < rect.left ||
        clientPoint.x > rect.right ||
        clientPoint.y < rect.top ||
        clientPoint.y > rect.bottom
      ) {
        return
      }
      const point = {
        x: ((clientPoint.x - rect.left) / rect.width) * canvas.width,
        y: ((clientPoint.y - rect.top) / rect.height) * canvas.height,
      }
      ctx.globalCompositeOperation = "destination-out"
      const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, glowRadius)
      gradient.addColorStop(0, "rgba(0,0,0,1)")
      gradient.addColorStop(0.7, "rgba(0,0,0,0.9)")
      gradient.addColorStop(1, "rgba(0,0,0,0)")
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(point.x, point.y, glowRadius, 0, Math.PI * 2)
      ctx.fill()
    },
  }))

  return (
    <div className={`${className} flex flex-col`}>
      <div
        ref={viewportRef}
        onPointerDown={handlePointerDown}
        className={`relative w-full flex-1 min-h-0 overflow-hidden rounded-lg border border-gray-800 bg-black touch-none select-none ${
          zoom > MIN_ZOOM ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-default"
        }`}
      >
        <div
          className="absolute top-1/2 left-1/2 max-w-none"
          style={{
            width: baseSize.width,
            height: baseSize.height,
            transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
          }}
        >
          <img src={revealedSrc} alt={alt} className="absolute inset-0 w-full h-full select-none" draggable={false} />
          <img src={cleanSrc} alt="" className="hidden" onLoad={handleImageLoad} aria-hidden />
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
        </div>

        {zoomEnabled && (
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none rounded-lg"
            style={{
              boxShadow: "inset 0 0 0 3px rgba(217, 180, 100, 0.35), inset 0 0 40px 10px rgba(0, 0, 0, 0.6)",
            }}
          />
        )}
      </div>

      {zoomEnabled ? (
        <div className="flex items-center justify-center gap-3 mt-3">
          <img
            src="/images/paintings/loupe.webp"
            alt=""
            aria-hidden
            className="w-6 h-6 object-contain -rotate-12"
          />
          <button
            onClick={() => applyZoom(zoom - ZOOM_STEP)}
            disabled={zoom <= MIN_ZOOM}
            aria-label="Zoom out"
            className="w-9 h-9 flex items-center justify-center bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:hover:bg-gray-800 rounded-lg border border-gray-700"
          >
            <ZoomOut className="w-4 h-4 text-gray-300" />
          </button>
          <span className="text-xs text-gray-400 font-mono w-12 text-center">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => applyZoom(zoom + ZOOM_STEP)}
            disabled={zoom >= MAX_ZOOM}
            aria-label="Zoom in"
            className="w-9 h-9 flex items-center justify-center bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:hover:bg-gray-800 rounded-lg border border-gray-700"
          >
            <ZoomIn className="w-4 h-4 text-gray-300" />
          </button>
        </div>
      ) : null}
    </div>
  )
})

export default LampReveal
