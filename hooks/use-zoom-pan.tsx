"use client"

import { useCallback, useRef, useState } from "react"

const MIN_ZOOM = 1
const MAX_ZOOM = 4
const ZOOM_STEP = 0.75

/**
 * Shared pan/zoom mechanics for a fixed-aspect image or canvas shown inside a
 * viewport: contain-fit at zoom 1, +/- buttons zoom in around center,
 * dragging pans, clamped so the player can't drag past the content edges.
 * Used by both PaintingInspector (image) and CharcoalRubbing's statue view
 * (canvas) so the Loupe-gated zoom behaves identically across both.
 */
export function useZoomPan(zoomEnabled: boolean) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const dragState = useRef<{ startX: number; startY: number; startOffsetX: number; startOffsetY: number } | null>(
    null,
  )
  const [baseSize, setBaseSize] = useState({ width: 0, height: 0 })
  const [zoom, setZoom] = useState(MIN_ZOOM)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)

  const clampOffset = useCallback(
    (x: number, y: number, atZoom: number) => {
      const viewport = viewportRef.current
      if (!viewport) return { x: 0, y: 0 }
      const maxX = Math.max(0, (baseSize.width * atZoom - viewport.clientWidth) / 2)
      const maxY = Math.max(0, (baseSize.height * atZoom - viewport.clientHeight) / 2)
      return {
        x: Math.min(maxX, Math.max(-maxX, x)),
        y: Math.min(maxY, Math.max(-maxY, y)),
      }
    },
    [baseSize],
  )

  const setBaseSizeFromNatural = useCallback((naturalWidth: number, naturalHeight: number) => {
    const viewport = viewportRef.current
    if (!viewport || !naturalWidth || !naturalHeight) return
    const fitScale = Math.min(viewport.clientWidth / naturalWidth, viewport.clientHeight / naturalHeight)
    setBaseSize({ width: naturalWidth * fitScale, height: naturalHeight * fitScale })
  }, [])

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!dragState.current) return
      const dx = e.clientX - dragState.current.startX
      const dy = e.clientY - dragState.current.startY
      setOffset(clampOffset(dragState.current.startOffsetX + dx, dragState.current.startOffsetY + dy, zoom))
    },
    [clampOffset, zoom],
  )

  const handlePointerUp = useCallback(() => {
    dragState.current = null
    setIsDragging(false)
    window.removeEventListener("pointermove", handlePointerMove)
    window.removeEventListener("pointerup", handlePointerUp)
  }, [handlePointerMove])

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!zoomEnabled || zoom <= MIN_ZOOM) return
      dragState.current = { startX: e.clientX, startY: e.clientY, startOffsetX: offset.x, startOffsetY: offset.y }
      setIsDragging(true)
      window.addEventListener("pointermove", handlePointerMove)
      window.addEventListener("pointerup", handlePointerUp)
    },
    [zoomEnabled, zoom, offset, handlePointerMove, handlePointerUp],
  )

  const applyZoom = useCallback(
    (next: number) => {
      const clamped = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, next))
      setZoom(clamped)
      setOffset((prev) => clampOffset(prev.x, prev.y, clamped))
    },
    [clampOffset],
  )

  return {
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
  }
}
