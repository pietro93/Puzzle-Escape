"use client"

import { forwardRef, useImperativeHandle, useRef } from "react"
import { ZoomIn, ZoomOut } from "lucide-react"
import { useZoomPan } from "@/hooks/use-zoom-pan"

export interface CharcoalRubbingHandle {
  /** Scratch a stroke toward this client-space point (no-op if outside the canvas). */
  scratchAt: (point: { x: number; y: number }) => void
  /** Call on drag release so the next scratchAt starts a fresh stroke instead of joining the last one. */
  endStroke: () => void
}

interface CharcoalRubbingProps {
  /** Clean, undisturbed image — painted onto the scratchable top layer. */
  cleanSrc: string
  /** What's underneath once scratched away — must be pixel-aligned to cleanSrc. */
  revealedSrc: string
  alt: string
  className?: string
  /** Scratch brush radius in canvas pixels. */
  brushRadius?: number
  /** A data URL snapshot of the canvas from a previous mount, painted in place of cleanSrc so scratch progress survives closing/reopening the inspector. */
  initialSnapshot?: string
  /** Fired at the end of every stroke with a data URL of the current canvas, for the parent to persist across unmounts. */
  onStrokeEnd?: (snapshot: string) => void
  /** Whether the player has unlocked zoom (the Loupe) — same gate as PaintingInspector, so every statue/painting view behaves identically. */
  zoomEnabled?: boolean
}

/**
 * Scratch-off reveal: cleanSrc is drawn onto a canvas layered over revealedSrc.
 * Scratching is driven externally (via the exposed handle) rather than by the
 * canvas's own pointer events — the mansion puzzle's item-drag-tray calls
 * scratchAt while the player drags the Charcoal item across this component,
 * so the reveal only progresses while that specific drag is in flight.
 */
const CharcoalRubbing = forwardRef<CharcoalRubbingHandle, CharcoalRubbingProps>(function CharcoalRubbing(
  { cleanSrc, revealedSrc, alt, className = "", brushRadius = 22, initialSnapshot, onStrokeEnd, zoomEnabled = true },
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const lastPoint = useRef<{ x: number; y: number } | null>(null)
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

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const canvas = canvasRef.current
    const img = e.currentTarget
    if (!canvas) return
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    setBaseSizeFromNatural(img.naturalWidth, img.naturalHeight)
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    if (initialSnapshot) {
      // Restore prior scratch progress instead of the untouched clean layer.
      const snapshot = new Image()
      snapshot.onload = () => ctx.drawImage(snapshot, 0, 0, canvas.width, canvas.height)
      snapshot.src = initialSnapshot
    } else {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    }
  }

  useImperativeHandle(ref, () => ({
    scratchAt(clientPoint) {
      const canvas = canvasRef.current
      const ctx = canvas?.getContext("2d")
      if (!canvas || !ctx) return
      const rect = canvas.getBoundingClientRect()
      if (
        clientPoint.x < rect.left ||
        clientPoint.x > rect.right ||
        clientPoint.y < rect.top ||
        clientPoint.y > rect.bottom
      ) {
        lastPoint.current = null
        return
      }
      const point = {
        x: ((clientPoint.x - rect.left) / rect.width) * canvas.width,
        y: ((clientPoint.y - rect.top) / rect.height) * canvas.height,
      }
      ctx.globalCompositeOperation = "destination-out"
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.lineWidth = brushRadius * 2
      ctx.beginPath()
      const from = lastPoint.current ?? point
      ctx.moveTo(from.x, from.y)
      ctx.lineTo(point.x, point.y)
      ctx.stroke()
      lastPoint.current = point
    },
    endStroke() {
      lastPoint.current = null
      const canvas = canvasRef.current
      if (canvas && onStrokeEnd) onStrokeEnd(canvas.toDataURL())
    },
  }))

  return (
    <div className={className}>
      <div
        ref={viewportRef}
        onPointerDown={handlePointerDown}
        className={`relative w-full h-full overflow-hidden rounded-lg border border-gray-800 bg-black touch-none select-none ${
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
      ) : (
        <p className="text-gray-500 font-mono text-xs text-center mt-3 italic">
          The detail is too fine to make out. You'd need something to magnify it.
        </p>
      )}
    </div>
  )
})

export default CharcoalRubbing
