"use client"

import { useEffect, useRef, useState } from "react"
import type React from "react"

/** Pixels the pointer must travel before a press becomes a drag; below that it stays a tap/click. */
const DRAG_THRESHOLD = 6

interface DragSession<T> {
  payload: T
  pointerId: number
  startX: number
  startY: number
  source: HTMLElement
  /** Where inside the source element the pointer grabbed it, so the ghost doesn't jump. */
  grabX: number
  grabY: number
  ghost: HTMLElement | null
}

/**
 * Touch-friendly replacement for native HTML5 drag-and-drop, which most mobile
 * browsers never fire for finger input. Spread `dragSource(payload)` on each
 * draggable element and tag each drop target with `data-drop-zone="<key>"`.
 * On release, the topmost element under the pointer is walked up to the nearest
 * drop zone (same bubbling a native `drop` would get) and `onDrop` receives its
 * key, or null when released outside every zone.
 *
 * A press that moves less than DRAG_THRESHOLD stays a normal click, so sources
 * can keep their own onClick (e.g. tap-to-add). A completed drag swallows the
 * click the browser fires right after it.
 */
export function usePointerDrag<T>(
  onDrop: (payload: T, zone: string | null, point: { x: number; y: number }) => void,
) {
  const [dragging, setDragging] = useState<T | null>(null)
  const sessionRef = useRef<DragSession<T> | null>(null)
  const onDropRef = useRef(onDrop)
  onDropRef.current = onDrop

  const teardownRef = useRef<() => void>(() => {})

  useEffect(() => () => teardownRef.current(), [])

  const dragSource = (payload: T, disabled = false) => ({
    onPointerDown: (e: React.PointerEvent<HTMLElement>) => {
      if (disabled || sessionRef.current || (e.pointerType === "mouse" && e.button !== 0)) return
      const source = e.currentTarget
      const rect = source.getBoundingClientRect()
      sessionRef.current = {
        payload,
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        source,
        grabX: e.clientX - rect.left,
        grabY: e.clientY - rect.top,
        ghost: null,
      }

      const move = (ev: PointerEvent) => {
        const s = sessionRef.current
        if (!s || ev.pointerId !== s.pointerId) return
        if (!s.ghost) {
          if (Math.hypot(ev.clientX - s.startX, ev.clientY - s.startY) < DRAG_THRESHOLD) return
          s.ghost = makeGhost(s.source)
          document.body.appendChild(s.ghost)
          setDragging(s.payload)
        }
        s.ghost.style.transform = `translate(${ev.clientX - s.grabX}px, ${ev.clientY - s.grabY}px)`
      }

      const finish = (ev: PointerEvent, cancelled: boolean) => {
        const s = sessionRef.current
        if (!s || ev.pointerId !== s.pointerId) return
        const wasDragging = !!s.ghost
        teardown()
        if (!wasDragging) return
        suppressNextClick()
        if (cancelled) return
        const zoneEl = document.elementFromPoint(ev.clientX, ev.clientY)?.closest<HTMLElement>("[data-drop-zone]")
        onDropRef.current(s.payload, zoneEl?.dataset.dropZone ?? null, { x: ev.clientX, y: ev.clientY })
      }
      const up = (ev: PointerEvent) => finish(ev, false)
      const cancel = (ev: PointerEvent) => finish(ev, true)

      const teardown = () => {
        sessionRef.current?.ghost?.remove()
        sessionRef.current = null
        setDragging(null)
        window.removeEventListener("pointermove", move)
        window.removeEventListener("pointerup", up)
        window.removeEventListener("pointercancel", cancel)
        window.removeEventListener("dragstart", blockNativeDrag, true)
        teardownRef.current = () => {}
      }
      teardownRef.current = teardown

      window.addEventListener("pointermove", move)
      window.addEventListener("pointerup", up)
      window.addEventListener("pointercancel", cancel)
      // Stop the browser's own image/link drag from hijacking the gesture on desktop.
      window.addEventListener("dragstart", blockNativeDrag, true)
    },
    style: { touchAction: "none", userSelect: "none", WebkitUserSelect: "none" } as React.CSSProperties,
  })

  return { dragSource, dragging }
}

/** Visual copy of the source that follows the pointer, like a native drag image. */
function makeGhost(source: HTMLElement): HTMLElement {
  const rect = source.getBoundingClientRect()
  const computed = getComputedStyle(source)
  const ghost = source.cloneNode(true) as HTMLElement
  ghost.removeAttribute("id")
  ghost.removeAttribute("data-drop-zone")
  Object.assign(ghost.style, {
    position: "fixed",
    left: "0",
    top: "0",
    margin: "0",
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    // Inherited text styles are lost once the clone leaves its parent.
    color: computed.color,
    fontFamily: computed.fontFamily,
    fontSize: computed.fontSize,
    lineHeight: computed.lineHeight,
    pointerEvents: "none",
    zIndex: "9999",
    opacity: "0.85",
    transform: `translate(${rect.left}px, ${rect.top}px)`,
    transition: "none",
    animation: "none",
  })
  return ghost
}

function blockNativeDrag(e: DragEvent) {
  e.preventDefault()
}

function suppressNextClick() {
  const swallow = (e: MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
  }
  window.addEventListener("click", swallow, { capture: true, once: true })
  // If no click follows (e.g. released over a different element), drop the listener.
  setTimeout(() => window.removeEventListener("click", swallow, { capture: true }), 100)
}
