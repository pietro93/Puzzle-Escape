"use client"

import React, { useState, useMemo } from "react"

interface AnagramSpicePuzzleProps {
  onSolve: () => void
}

// Where a dragged jar came from, so dropping it onto an occupied slot can swap
// the two jars instead of just bouncing off, and dropping a pantry jar onto an
// occupied slot sends the displaced jar back to the pantry.
type SlotRef = { type: "pantry" } | { type: "left" | "right" | "plate"; index: number }

function sameSlot(a: SlotRef, b: SlotRef): boolean {
  if (a.type !== b.type) return false
  if (a.type === "pantry" || b.type === "pantry") return true
  return (a as { index: number }).index === (b as { index: number }).index
}

// Pantry tiles spelling "A SPICE IN THE MANSION", plus a few decoy spices (F, U, D, extra O)
// that don't belong to either solution word and only ever produce a "miss" on the plate.
const PANTRY_ITEMS: { id: string; letter: string; src: string }[] = [
  { id: "a", letter: "A", src: "/images/spices/a.webp" },
  { id: "s", letter: "S", src: "/images/spices/s.webp" },
  { id: "p", letter: "P", src: "/images/spices/p.webp" },
  { id: "i", letter: "I", src: "/images/spices/i.webp" },
  { id: "c", letter: "C", src: "/images/spices/c.webp" },
  { id: "e", letter: "E", src: "/images/spices/e.webp" },
  { id: "n", letter: "N", src: "/images/spices/n.webp" },
  { id: "t", letter: "T", src: "/images/spices/t.webp" },
  { id: "h", letter: "H", src: "/images/spices/h.webp" },
  { id: "m", letter: "M", src: "/images/spices/m.webp" },
  { id: "o", letter: "O", src: "/images/spices/o.webp" },
  { id: "f", letter: "F", src: "/images/spices/f.webp" },
  { id: "u", letter: "U", src: "/images/spices/u.webp" },
  { id: "d", letter: "D", src: "/images/spices/d.webp" },
  { id: "o2", letter: "O", src: "/images/spices/o2.webp" },
  { id: "r", letter: "R", src: "/images/spices/r.webp" },
]

// The fixed anchor letters (A for STAR, S for ANISE) are no longer ambiguous
// "found in both words" cases — each one maps to exactly one hand.
const LEFT_TRIGGER = ["T", "R", "A"] // letters that rotate the left hand
const RIGHT_TRIGGER = ["N", "I", "E", "S"] // letters that rotate the right hand

const CAROUSEL_WINDOW = 4

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const AnagramSpicePuzzle: React.FC<AnagramSpicePuzzleProps> = ({ onSolve }) => {
  const [orderA, orderB] = useState<[string[], string[]]>(() => {
    const shuffled = shuffle(PANTRY_ITEMS.map((i) => i.id))
    const mid = Math.ceil(shuffled.length / 2)
    return [shuffled.slice(0, mid), shuffled.slice(mid)]
  })[0]
  const [basketLeft, setBasketLeft] = useState<(string | null)[]>([null, null, null])
  const [basketRight, setBasketRight] = useState<(string | null)[]>([null, null, null, null])
  const [plate, setPlate] = useState<(string | null)[]>([null, null])
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [draggedFrom, setDraggedFrom] = useState<SlotRef | null>(null)
  const [carouselStartA, setCarouselStartA] = useState(0)
  const [carouselStartB, setCarouselStartB] = useState(0)

  const letterOf = useMemo(() => {
    const map: Record<string, string> = {}
    PANTRY_ITEMS.forEach((item) => (map[item.id] = item.letter))
    return map
  }, [])

  const srcOf = useMemo(() => {
    const map: Record<string, string> = {}
    PANTRY_ITEMS.forEach((item) => (map[item.id] = item.src))
    return map
  }, [])

  const placedIds = useMemo(
    () => new Set([...basketLeft, ...basketRight, ...plate].filter(Boolean) as string[]),
    [basketLeft, basketRight, plate]
  )

  const availableA = useMemo(() => orderA.filter((id) => !placedIds.has(id)), [orderA, placedIds])
  const availableB = useMemo(() => orderB.filter((id) => !placedIds.has(id)), [orderB, placedIds])

  const visibleA = useMemo(() => {
    if (availableA.length <= CAROUSEL_WINDOW) return availableA
    const out: string[] = []
    for (let k = 0; k < CAROUSEL_WINDOW; k++) out.push(availableA[(carouselStartA + k) % availableA.length])
    return out
  }, [availableA, carouselStartA])

  const visibleB = useMemo(() => {
    if (availableB.length <= CAROUSEL_WINDOW) return availableB
    const out: string[] = []
    for (let k = 0; k < CAROUSEL_WINDOW; k++) out.push(availableB[(carouselStartB + k) % availableB.length])
    return out
  }, [availableB, carouselStartB])

  const { leftRotated, rightRotated } = useMemo(() => {
    const [a, b] = plate
    if (!a || !b) return { leftRotated: false, rightRotated: false }
    const letters = [letterOf[a], letterOf[b]]
    return {
      leftRotated: letters.some((l) => LEFT_TRIGGER.includes(l)),
      rightRotated: letters.some((l) => RIGHT_TRIGGER.includes(l)),
    }
  }, [plate, letterOf])

  const handleDragStart = (id: string, from: SlotRef) => {
    setDraggedId(id)
    setDraggedFrom(from)
  }
  const handleDragEnd = () => {
    setDraggedId(null)
    setDraggedFrom(null)
  }

  const getSlotValue = (ref: SlotRef): string | null => {
    if (ref.type === "left") return basketLeft[ref.index]
    if (ref.type === "right") return basketRight[ref.index]
    if (ref.type === "plate") return plate[ref.index]
    return null
  }

  const setSlotValue = (ref: SlotRef, value: string | null) => {
    if (ref.type === "left") {
      setBasketLeft((prev) => {
        const next = [...prev]
        next[ref.index] = value
        return next
      })
    } else if (ref.type === "right") {
      setBasketRight((prev) => {
        const next = [...prev]
        next[ref.index] = value
        return next
      })
    } else if (ref.type === "plate") {
      setPlate((prev) => {
        const next = [...prev] as (string | null)[]
        next[ref.index] = value
        return next
      })
    }
  }

  // Drop the dragged jar into `to`. If `to` is already occupied, the jar that
  // was there is sent to wherever the dragged jar came from — a real swap when
  // dragging between slots, or simply "returned to the pantry" when the dragged
  // jar came from a carousel (pantry jars have no slot to swap back into).
  const handleDrop = (to: SlotRef) => (e: React.DragEvent) => {
    e.preventDefault()
    if (!draggedId || !draggedFrom) return
    if (sameSlot(to, draggedFrom)) return
    const occupant = getSlotValue(to)
    setSlotValue(to, draggedId)
    if (draggedFrom.type !== "pantry") {
      setSlotValue(draggedFrom, occupant)
    }
    setDraggedId(null)
    setDraggedFrom(null)
  }

  const spiceTile = (id: string, size: number, from: SlotRef, key?: React.Key) => (
    <img
      key={key}
      src={srcOf[id]}
      alt={letterOf[id]}
      draggable
      onDragStart={() => handleDragStart(id, from)}
      onDragEnd={handleDragEnd}
      className="object-contain pixelated cursor-move select-none"
      style={{ width: size, height: size }}
    />
  )

  // Floor slots are absolutely positioned around the foot of the pedestal, each
  // resting on a tiny plate. An empty slot shows just the plate, signaling
  // "droppable here"; a filled one shows the jar standing on top of that same
  // plate, drawn larger so it reads as actually resting on it.
  const FLOOR_SIZE = 52
  const PLATE_SIZE = { width: FLOOR_SIZE * 0.85, height: FLOOR_SIZE * 0.37 }
  const PLACED_JAR_SIZE = 80
  // Closer-to-viewer jars (lower on screen = smaller `bottom`) stack in front of
  // the ones behind them, so both the plate visual and the jar use depthZ. The
  // drop target is decoupled from the visual: empty slots also get an invisible
  // catcher floated above everything (EMPTY_SLOT_Z) so a neighbouring jar
  // overflowing its own box can never block dropping onto a plate behind it —
  // while the plate image itself still renders at its true depth.
  const depthZ = (bottom: number) => Math.round(120 - bottom)
  const EMPTY_SLOT_Z = 200
  const floorPlate = (
    <img
      src="/images/spices/plate.webp"
      alt=""
      className="pixelated object-contain select-none"
      style={PLATE_SIZE}
    />
  )
  const floorSlot = (
    content: string | null,
    ref: SlotRef,
    pos: { left: string; bottom: number },
    key: React.Key
  ) => (
    <div
      key={key}
      onDrop={handleDrop(ref)}
      onDragOver={(e) => e.preventDefault()}
      className="absolute flex items-end justify-center"
      style={{
        left: pos.left,
        bottom: pos.bottom,
        width: FLOOR_SIZE,
        height: FLOOR_SIZE,
        transform: "translateX(-50%)",
        zIndex: depthZ(pos.bottom),
      }}
    >
      {floorPlate}
      {content && (
        <div
          className="absolute bottom-0 left-1/2 flex items-end justify-center"
          style={{ width: PLACED_JAR_SIZE, height: PLACED_JAR_SIZE, transform: "translateX(-50%)" }}
        >
          {spiceTile(content, PLACED_JAR_SIZE, ref)}
        </div>
      )}
    </div>
  )

  // Invisible drop target floated above every jar, so an empty plate tucked behind
  // a taller jar in front of it is still reachable. Rendered only for empty slots.
  const floorCatcher = (ref: SlotRef, pos: { left: string; bottom: number }, key: React.Key) => (
    <div
      key={key}
      onDrop={handleDrop(ref)}
      onDragOver={(e) => e.preventDefault()}
      className="absolute"
      style={{
        left: pos.left,
        bottom: pos.bottom,
        width: FLOOR_SIZE,
        height: FLOOR_SIZE,
        transform: "translateX(-50%)",
        zIndex: EMPTY_SLOT_Z,
      }}
    />
  )

  // Two arches flanking the plate, like ( … ). Each arch is anchored by a fixed,
  // undraggable letter closest to the plate — S for the left (STAR) arch, A for
  // the right (ANISE) arch — so placing A or S on the plate unambiguously rotates
  // one hand. The left arch's three draggable slots (T, A, R) curve up from there;
  // it sits further left and tighter than the right arch (mirroring the right
  // arch's own spacing) so the two arches read as distinct clusters. The right
  // arch's four draggable slots (N, I, S, E) curl up and in, tucking the last one
  // behind the previous slot rather than just running wider than the left.
  const S_FLOOR = { left: "8%", bottom: 68 }
  const LEFT_FLOOR = [
    { left: "35%", bottom: -6 },
    { left: "23%", bottom: 8 },
    { left: "14%", bottom: 32 },
  ]
  const A_FLOOR = { left: "52%", bottom: -25 }
  const RIGHT_FLOOR = [
    { left: "63%", bottom: -16 },
    { left: "73%", bottom: -4 },
    { left: "83%", bottom: 12 },
    { left: "93%", bottom: 24 },
  ]

  return (
    <div className="flex flex-col gap-3 w-full max-w-md mx-auto">
      {/* Pantry: two carousels, each holding roughly half of the spices */}
      <div
        onDrop={handleDrop({ type: "pantry" })}
        onDragOver={(e) => e.preventDefault()}
        className="flex flex-col gap-1"
      >
        <div className="flex items-center justify-center gap-1">
          <button
            type="button"
            onClick={() => setCarouselStartA((s) => (s - 1 + availableA.length) % Math.max(availableA.length, 1))}
            disabled={availableA.length <= CAROUSEL_WINDOW}
            className="text-amber-200/70 hover:text-amber-100 disabled:opacity-20 text-2xl px-1 shrink-0"
            aria-label="Previous spices"
          >
            ‹
          </button>
          <div className="flex items-center justify-center gap-1 flex-1 overflow-hidden">
            {visibleA.map((id) => spiceTile(id, 72, { type: "pantry" }, id))}
          </div>
          <button
            type="button"
            onClick={() => setCarouselStartA((s) => (s + 1) % Math.max(availableA.length, 1))}
            disabled={availableA.length <= CAROUSEL_WINDOW}
            className="text-amber-200/70 hover:text-amber-100 disabled:opacity-20 text-2xl px-1 shrink-0"
            aria-label="Next spices"
          >
            ›
          </button>
        </div>
        <div className="flex items-center justify-center gap-1">
          <button
            type="button"
            onClick={() => setCarouselStartB((s) => (s - 1 + availableB.length) % Math.max(availableB.length, 1))}
            disabled={availableB.length <= CAROUSEL_WINDOW}
            className="text-amber-200/70 hover:text-amber-100 disabled:opacity-20 text-2xl px-1 shrink-0"
            aria-label="Previous spices"
          >
            ‹
          </button>
          <div className="flex items-center justify-center gap-1 flex-1 overflow-hidden">
            {visibleB.map((id) => spiceTile(id, 72, { type: "pantry" }, id))}
          </div>
          <button
            type="button"
            onClick={() => setCarouselStartB((s) => (s + 1) % Math.max(availableB.length, 1))}
            disabled={availableB.length <= CAROUSEL_WINDOW}
            className="text-amber-200/70 hover:text-amber-100 disabled:opacity-20 text-2xl px-1 shrink-0"
            aria-label="Next spices"
          >
            ›
          </button>
        </div>
      </div>

      {/* Hands + plate + floor scatter. The hands/big-plate pedestal sits raised off
          the container floor so there's breathing room between it and the small floor
          plates scattered below. */}
      <div className="relative mx-auto w-full" style={{ maxWidth: 420, height: 252 }}>
        <img
          src={leftRotated ? "/images/spices/hand2.webp" : "/images/spices/hand.webp"}
          alt="Left hand"
          className="pixelated object-contain absolute left-0"
          style={{ width: "62%", height: 220, bottom: 12 }}
        />
        <img
          src={rightRotated ? "/images/spices/hand2.webp" : "/images/spices/hand.webp"}
          alt="Right hand"
          className="pixelated object-contain absolute right-0"
          style={{ width: "62%", height: 220, bottom: 12, transform: "scaleX(-1)" }}
        />
        {/* Plate centered over the seam between the two pedestals */}
        <img
          src="/images/spices/plate.webp"
          alt="Plate"
          className="pixelated object-contain absolute left-1/2 z-10"
          style={{ width: 190, height: 82, bottom: 28, transform: "translateX(-50%)" }}
        />
        {/* Two invisible drop zones nested inside the plate's hollow, overlapping at center */}
        <div
          className="absolute z-20 flex items-center justify-center"
          style={{ left: "50%", bottom: 66, transform: "translateX(-50%)", width: 190, height: 80 }}
        >
          <div
            onDrop={handleDrop({ type: "plate", index: 0 })}
            onDragOver={(e) => e.preventDefault()}
            className="flex items-center justify-center"
            style={{ width: 80, height: 80 }}
          >
            {plate[0] && spiceTile(plate[0], 76, { type: "plate", index: 0 })}
          </div>
          <div
            onDrop={handleDrop({ type: "plate", index: 1 })}
            onDragOver={(e) => e.preventDefault()}
            className="flex items-center justify-center"
            style={{ width: 80, height: 80, marginLeft: -36 }}
          >
            {plate[1] && spiceTile(plate[1], 76, { type: "plate", index: 1 })}
          </div>
        </div>

        {/* Left arch: STAR's three draggable slots, anchored by the fixed S */}
        {basketLeft.map((value, index) =>
          floorSlot(value, { type: "left", index }, LEFT_FLOOR[index], `l${index}`)
        )}
        <div
          className="absolute flex items-end justify-center"
          style={{ width: FLOOR_SIZE, height: FLOOR_SIZE, left: S_FLOOR.left, bottom: S_FLOOR.bottom, transform: "translateX(-50%)", zIndex: depthZ(S_FLOOR.bottom) }}
        >
          {floorPlate}
          <img
            src="/images/spices/s2.webp"
            alt="S"
            className="absolute bottom-0 left-1/2 object-contain pixelated select-none"
            style={{ width: PLACED_JAR_SIZE, height: PLACED_JAR_SIZE, transform: "translateX(-50%)" }}
          />
        </div>
        <div
          className="absolute flex items-end justify-center"
          style={{ width: FLOOR_SIZE, height: FLOOR_SIZE, left: A_FLOOR.left, bottom: A_FLOOR.bottom, transform: "translateX(-50%)", zIndex: depthZ(A_FLOOR.bottom) }}
        >
          {floorPlate}
          <img
            src="/images/spices/a2.webp"
            alt="A"
            className="absolute bottom-0 left-1/2 object-contain pixelated select-none"
            style={{ width: PLACED_JAR_SIZE, height: PLACED_JAR_SIZE, transform: "translateX(-50%)" }}
          />
        </div>
        {/* Right arch: ANISE's four draggable slots, anchored by the fixed A */}
        {basketRight.map((value, index) =>
          floorSlot(value, { type: "right", index }, RIGHT_FLOOR[index], `r${index}`)
        )}
        {/* Invisible drop catchers for empty slots, floated above all jars so a plate
            behind a taller jar in front of it stays droppable. */}
        {basketLeft.map((value, index) =>
          value ? null : floorCatcher({ type: "left", index }, LEFT_FLOOR[index], `lc${index}`)
        )}
        {basketRight.map((value, index) =>
          value ? null : floorCatcher({ type: "right", index }, RIGHT_FLOOR[index], `rc${index}`)
        )}
      </div>
    </div>
  )
}

export default AnagramSpicePuzzle
