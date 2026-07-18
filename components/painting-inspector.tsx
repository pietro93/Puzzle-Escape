"use client"

import { ZoomIn, ZoomOut } from "lucide-react"
import { useZoomPan } from "@/hooks/use-zoom-pan"

interface ItemPickup {
  /** Full-canvas overlay, pixel-aligned to `src`, transparent except the item. */
  overlaySrc: string
  /** Clickable area, percent of `src`'s own natural size. */
  hotspot: { left: number; top: number; width: number; height: number }
  label: string
  onCollect: () => void
}

interface SecondaryHotspot {
  /** Clickable/drop-target area, percent of `src`'s own natural size. No overlay image — for detail already baked into `src` (e.g. a stain painted into one of several state variants of the same asset). */
  rect: { left: number; top: number; width: number; height: number }
  ariaLabel: string
  onClick: () => void
  /** Exposed so callers can hit-test drops (e.g. dragged inventory items) against this hotspot's real on-screen position, which tracks pan/zoom since it's rendered inside the same transformed box as the image. */
  hotspotRef?: React.RefObject<HTMLButtonElement>
}

interface PaintingInspectorProps {
  src: string
  alt: string
  className?: string
  /** Whether the player has unlocked zoom (by dropping the Loupe onto a painting). Without it, the image is view-only at 1x. */
  zoomEnabled?: boolean
  /** An item sitting on this painting/statue the player can still collect — hotspot stays aligned through pan/zoom since it's rendered inside the same transformed box as the image. */
  itemPickup?: ItemPickup
  /** A non-pickup hotspot over a detail of the painting — click for an observation line, and/or a drop target for other inventory items. */
  secondaryHotspot?: SecondaryHotspot
  /** Renders more zoomed-in than the advertised 100%-400% range (see useZoomPan) — for paintings with detail too fine to read at the normal ceiling. */
  extraScale?: number
}

/**
 * A viewport onto a painting: shows the full image uncropped (contain-fit)
 * at zoom 1, then +/- buttons zoom in around center and dragging pans,
 * clamped so the player can't drag past the image edges. Generic across any
 * painting/statue asset — it has no idea what's hidden in the image.
 * Zoom is gated behind `zoomEnabled` (the Loupe) — once unlocked, it
 * stays unlocked for the rest of the game, so this is a one-time gate rather
 * than something the player re-earns per painting.
 */
export default function PaintingInspector({
  src,
  alt,
  className = "",
  zoomEnabled = true,
  itemPickup,
  secondaryHotspot,
  extraScale = 1,
}: PaintingInspectorProps) {
  const {
    viewportRef,
    baseSize,
    setBaseSizeFromNatural,
    zoom,
    effectiveZoom,
    offset,
    isDragging,
    handlePointerDown,
    applyZoom,
    MIN_ZOOM,
    MAX_ZOOM,
    ZOOM_STEP,
  } = useZoomPan(zoomEnabled, extraScale)

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    setBaseSizeFromNatural(img.naturalWidth, img.naturalHeight)
  }

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
            transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) scale(${effectiveZoom})`,
          }}
        >
          <img
            src={src}
            alt={alt}
            draggable={false}
            onLoad={handleImageLoad}
            className="absolute inset-0 w-full h-full pointer-events-none"
          />
          {itemPickup && (
            <>
              <img
                src={itemPickup.overlaySrc}
                alt=""
                aria-hidden
                draggable={false}
                className="absolute inset-0 w-full h-full pointer-events-none"
              />
              <button
                onClick={itemPickup.onCollect}
                aria-label={`Pick up ${itemPickup.label}`}
                className="absolute rounded hover:bg-white/10 hover:ring-1 hover:ring-white/30 transition-colors"
                style={{
                  left: `${itemPickup.hotspot.left}%`,
                  top: `${itemPickup.hotspot.top}%`,
                  width: `${itemPickup.hotspot.width}%`,
                  height: `${itemPickup.hotspot.height}%`,
                }}
              />
            </>
          )}
          {secondaryHotspot && (
            <button
              ref={secondaryHotspot.hotspotRef}
              onClick={secondaryHotspot.onClick}
              aria-label={secondaryHotspot.ariaLabel}
              className="absolute rounded hover:bg-white/10 hover:ring-1 hover:ring-white/30 transition-colors"
              style={{
                left: `${secondaryHotspot.rect.left}%`,
                top: `${secondaryHotspot.rect.top}%`,
                width: `${secondaryHotspot.rect.width}%`,
                height: `${secondaryHotspot.rect.height}%`,
              }}
            />
          )}
        </div>

        {/* Loupe frame: a decorative ring reminding the player they're viewing
            through the Loupe, shown for as long as zoom stays unlocked. */}
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
}
