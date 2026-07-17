"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

interface ItemDragTrayProps {
  items: string[]
  icons: Record<string, string>
  /** Fires on every pointer move while dragging, with the client-space point (or null on drag end). */
  onDragMove?: (item: string, point: { x: number; y: number } | null) => void
  /** Fires once when the drag ends, with the client-space release point. */
  onDrop: (item: string, point: { x: number; y: number }) => void
  className?: string
}

/**
 * Generic drag source for inventory items: pointer-down on a tray tile starts
 * tracking a floating ghost of the icon (or a text pill, for items without an
 * ITEM_ICONS entry) that follows the pointer. Consumers decide what a drop
 * means — hit-test the release point against their own drop-zone ref and
 * either apply a one-shot effect (e.g. draping the statue) or, for
 * continuous tools (e.g. the charcoal), act on every onDragMove point while
 * the drag is in progress.
 */
export default function ItemDragTray({ items, icons, onDragMove, onDrop, className = "" }: ItemDragTrayProps) {
  const [dragItem, setDragItem] = useState<string | null>(null)
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null)
  const draggingRef = useRef<string | null>(null)

  useEffect(() => {
    return () => {
      document.body.style.cursor = ""
    }
  }, [])

  const handlePointerDown = (item: string) => (e: React.PointerEvent) => {
    draggingRef.current = item
    setDragItem(item)
    setDragPos({ x: e.clientX, y: e.clientY })
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    // Hide the native arrow so the dragged item itself reads as the cursor —
    // with the arrow left on, it renders on top of a centered ghost and
    // makes the item look static even while it's tracking the pointer.
    document.body.style.cursor = "none"
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return
    const point = { x: e.clientX, y: e.clientY }
    setDragPos(point)
    onDragMove?.(draggingRef.current, point)
  }

  const endDrag = (e: React.PointerEvent) => {
    const item = draggingRef.current
    if (!item) return
    onDrop(item, { x: e.clientX, y: e.clientY })
    onDragMove?.(item, null)
    draggingRef.current = null
    setDragItem(null)
    setDragPos(null)
    document.body.style.cursor = ""
  }

  return (
    <>
      <div className={`flex flex-wrap gap-2 justify-center ${className}`}>
        {items.map((item) => (
          <button
            key={item}
            onPointerDown={handlePointerDown(item)}
            onPointerMove={handlePointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            className="w-14 h-14 flex items-center justify-center bg-gray-800/80 hover:bg-gray-700 rounded-lg border border-gray-700 touch-none"
            aria-label={`Drag ${item}`}
          >
            {icons[item] ? (
              <img
                src={icons[item]}
                alt={item}
                className="w-10 h-10 object-contain pointer-events-none"
                draggable={false}
              />
            ) : (
              <span className="text-[10px] font-mono text-gray-200 px-1 text-center pointer-events-none">
                {item}
              </span>
            )}
          </button>
        ))}
      </div>
      {dragItem &&
        dragPos &&
        createPortal(
          // Portaled straight to <body>: several puzzle screens wrap this
          // tray in a backdrop-blur-sm ancestor, and per spec a
          // filter/backdrop-filter ancestor becomes the containing block for
          // `position: fixed` descendants. Left un-portaled, the ghost would
          // be positioned relative to that blurred box instead of the
          // viewport — landing far from the actual cursor.
          <div className="fixed z-[60] pointer-events-none" style={{ left: dragPos.x, top: dragPos.y }}>
            {icons[dragItem] ? (
              // Anchored so the item's own working tip (bottom-left corner)
              // sits at the pointer, like it's actually being held there,
              // rather than centering the icon on top of the pointer.
              <img
                src={icons[dragItem]}
                alt=""
                aria-hidden
                className="w-20 h-20 object-contain -translate-x-1/4 -translate-y-3/4 drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
                draggable={false}
              />
            ) : (
              <span className="-translate-x-1/2 -translate-y-1/2 block text-[10px] font-mono text-gray-100 bg-gray-800/90 px-2 py-1 rounded-full border border-gray-600 whitespace-nowrap">
                {dragItem}
              </span>
            )}
          </div>,
          document.body,
        )}
    </>
  )
}
