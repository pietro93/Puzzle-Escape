"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"

export type BoneColor = "white" | "orange" | "purple" | "black" | "rust"
type SkullColor = Exclude<BoneColor, "rust">

interface BoneCountingPuzzleProps {
  onSolve?: () => void
  // Called when a bone is dropped on the guard's portrait. rustReturned/rustTotal
  // count only rust bones, which are the only ones he keeps.
  onBoneOfferedToGuard?: (color: BoneColor, rustReturned: number, rustTotal: number) => void
  // Latest wrong submission from the answer box; skulls whose count is wrong shake.
  lastWrongAnswer?: { text: string; nonce: number } | null
}

const BONE_SIZE = 48
const PILE_AREA_HEIGHT = 280

// Skull order matches the solution order ("10 5 13 7").
const SKULL_ORDER: SkullColor[] = ["purple", "orange", "white", "black"]

interface Bone {
  id: string
  color: BoneColor
  number: number
  flipH: boolean
  flipV: boolean
  rotation: number
  zIndex: number
  left: number
  top: number
  placed: boolean
}

interface DragState {
  id: string
  x: number
  y: number
  offsetX: number
  offsetY: number
}

const BONE_CONFIGS: { color: BoneColor; numbers: number[] }[] = [
  { color: "white", numbers: [1, 2, 5, 6, 5, 6, 7, 3, 3, 4, 4, 4, 4] }, // 13 bones
  { color: "orange", numbers: [1, 2, 5, 6, 4] }, // 5 bones
  { color: "purple", numbers: [1, 2, 5, 6, 3, 3, 4, 4, 5, 6] }, // 10 bones
  { color: "black", numbers: [1, 2, 5, 6, 4, 5, 3] }, // 7 bones
  { color: "rust", numbers: [6, 1, 1, 3, 3, 4, 4, 5, 5] }, // no skull; the guard's own bones
]

const EXPECTED_COUNTS = Object.fromEntries(
  BONE_CONFIGS.map((c) => [c.color, c.numbers.length]),
) as Record<BoneColor, number>

const boneTransform = (bone: Bone) =>
  `scaleX(${bone.flipH ? -1 : 1}) scaleY(${bone.flipV ? -1 : 1}) rotate(${bone.rotation}deg)`

function TallyMarks({ count }: { count: number }) {
  const groups: number[] = []
  for (let i = 0; i < count; i += 5) groups.push(Math.min(5, count - i))

  return (
    <div className="flex flex-wrap justify-center gap-1.5 min-h-[20px] w-16">
      {groups.map((size, i) => (
        <span key={i} className="relative inline-flex gap-[3px] h-4 px-px">
          {Array.from({ length: Math.min(4, size) }).map((_, j) => (
            <i key={j} className="block w-[2px] h-4 bg-gray-200/90" />
          ))}
          {size === 5 && (
            <s className="absolute -left-[3px] -right-[3px] top-[7px] h-[2px] bg-gray-200/90 -rotate-[28deg]" />
          )}
        </span>
      ))}
    </div>
  )
}

export default function BoneCountingPuzzle({ onSolve, onBoneOfferedToGuard, lastWrongAnswer }: BoneCountingPuzzleProps) {
  const [bones, setBones] = useState<Bone[]>([])
  const [drag, setDrag] = useState<DragState | null>(null)
  // Per-skull animation; the nonce remounts the <img> so the same animation can replay.
  const [skullAnims, setSkullAnims] = useState<Partial<Record<SkullColor, { kind: "shake" | "clack"; nonce: number }>>>({})
  const animNonceRef = useRef(0)
  const [correctSkulls, setCorrectSkulls] = useState<SkullColor[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const solvedRef = useRef(false)
  const rustReturnedRef = useRef(0)

  // Initialize bones
  useEffect(() => {
    const initialBones: Bone[] = []
    let id = 0

    // Scatter all bones into a "mountain" pile spanning the full width near
    // the bottom of the area, instead of a tall narrow stack down the middle.
    const PILE_HEIGHT = PILE_AREA_HEIGHT - BONE_SIZE
    const BASE_TOP = PILE_AREA_HEIGHT - BONE_SIZE

    BONE_CONFIGS.forEach(({ color, numbers }) => {
      numbers.forEach((number) => {
        const leftPercent = 6 + Math.random() * 88 // full width, small margin
        const centerDist = Math.abs(leftPercent - 50) / 50 // 0 at center, 1 at edges
        const pileHeightAtX = PILE_HEIGHT * (1 - centerDist * centerDist) // taller in the middle
        const top = BASE_TOP - Math.random() * pileHeightAtX

        initialBones.push({
          id: `${color}-${number}-${id}`,
          color,
          number,
          flipH: Math.random() > 0.5,
          flipV: Math.random() > 0.5,
          rotation: Math.random() * 360,
          zIndex: Math.floor(Math.random() * 100) + 1,
          left: leftPercent,
          top: Math.max(0, top),
          placed: false,
        })
        id++
      })
    })

    setBones(initialBones)
  }, [])

  // The answer input unlocks only once every coloured bone sits with its skull.
  useEffect(() => {
    if (solvedRef.current || bones.length === 0) return
    if (bones.every((b) => b.placed || b.color === "rust")) {
      solvedRef.current = true
      onSolve?.()
    }
  }, [bones, onSolve])

  // Per-skull feedback on a wrong answer: skulls whose number was right glow,
  // the rest shake. Answers that can't be split into four numbers shake them all.
  useEffect(() => {
    if (!lastWrongAnswer) return
    const numbers = lastWrongAnswer.text.match(/\d+/g)
    const right =
      numbers && numbers.length === SKULL_ORDER.length
        ? SKULL_ORDER.filter((c, i) => Number(numbers[i]) === EXPECTED_COUNTS[c])
        : []
    setCorrectSkulls(right)
    animateSkulls(SKULL_ORDER.map((c) => [c, right.includes(c) ? "clack" : "shake"]))
    const timer = setTimeout(() => setCorrectSkulls([]), 1500)
    return () => clearTimeout(timer)
  }, [lastWrongAnswer])

  function animateSkulls(anims: [SkullColor, "shake" | "clack"][]) {
    const nonce = ++animNonceRef.current
    setSkullAnims((prev) => {
      const next = { ...prev }
      for (const [color, kind] of anims) next[color] = { kind, nonce }
      return next
    })
  }

  const handlePointerDown = (e: React.PointerEvent, bone: Bone) => {
    if (e.button !== 0) return
    e.preventDefault()
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setDrag({
      id: bone.id,
      x: e.clientX,
      y: e.clientY,
      offsetX: e.clientX - (rect.left + rect.width / 2),
      offsetY: e.clientY - (rect.top + rect.height / 2),
    })
  }

  // Track the pointer on window so bones can be carried onto the skulls and the
  // guard's portrait, which live outside the pile container.
  const dragId = drag?.id
  useEffect(() => {
    if (!dragId || !drag) return
    const { offsetX, offsetY } = drag

    const handleMove = (e: PointerEvent) => {
      setDrag((d) => (d ? { ...d, x: e.clientX, y: e.clientY } : d))
    }

    const handleUp = (e: PointerEvent) => {
      const bone = bones.find((b) => b.id === dragId)
      setDrag(null)
      if (!bone) return

      const target = document.elementFromPoint(e.clientX, e.clientY)
      const skullEl = target?.closest<HTMLElement>("[data-bone-drop]")
      const guardEl = target?.closest<HTMLElement>("[data-character-drop]")

      if (skullEl) {
        const skullColor = skullEl.dataset.boneDrop as SkullColor
        if (skullColor === bone.color) {
          setBones((prev) => prev.map((b) => (b.id === bone.id ? { ...b, placed: true } : b)))
          animateSkulls([[skullColor, "clack"]])
        } else {
          animateSkulls([[skullColor, "shake"]])
        }
        return
      }

      if (guardEl) {
        if (bone.color === "rust") {
          rustReturnedRef.current += 1
          setBones((prev) => prev.map((b) => (b.id === bone.id ? { ...b, placed: true } : b)))
        }
        onBoneOfferedToGuard?.(bone.color, rustReturnedRef.current, EXPECTED_COUNTS.rust)
        return
      }

      // Dropped back on the pile: let the player rearrange it freely.
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      const cx = e.clientX - offsetX
      const cy = e.clientY - offsetY
      if (cx < rect.left || cx > rect.right || cy < rect.top || cy > rect.bottom) return

      const half = BONE_SIZE / 2
      const clampedX = Math.max(half, Math.min(rect.width - half, cx - rect.left))
      const clampedY = Math.max(0, Math.min(rect.height - BONE_SIZE, cy - rect.top - half))
      const topZ = Math.max(...bones.map((b) => b.zIndex)) + 1
      setBones((prev) =>
        prev.map((b) =>
          b.id === bone.id ? { ...b, left: (clampedX / rect.width) * 100, top: clampedY, zIndex: topZ } : b,
        ),
      )
    }

    window.addEventListener("pointermove", handleMove)
    window.addEventListener("pointerup", handleUp)
    window.addEventListener("pointercancel", handleUp)
    return () => {
      window.removeEventListener("pointermove", handleMove)
      window.removeEventListener("pointerup", handleUp)
      window.removeEventListener("pointercancel", handleUp)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-subscribe per drag, not per pointer move
  }, [dragId, bones, onBoneOfferedToGuard])

  const placedCount = (color: SkullColor) => bones.filter((b) => b.color === color && b.placed).length
  const draggedBone = drag ? bones.find((b) => b.id === drag.id) : undefined

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        {/* Skulls at the top, each with a tally of the bones returned to it */}
        <div className="flex justify-center gap-4 mb-4">
          {SKULL_ORDER.map((color) => {
            const anim = skullAnims[color]
            return (
              <div key={color} data-bone-drop={color} className="flex flex-col items-center gap-1">
                <img
                  key={anim ? `${color}-${anim.nonce}` : color}
                  src={`/images/bones/${color}-skull.webp`}
                  alt={`${color[0].toUpperCase()}${color.slice(1)} skull`}
                  className={`w-16 h-16 object-contain ${
                    anim ? (anim.kind === "shake" ? "animate-shake" : "animate-clack motion-reduce:animate-none") : ""
                  } ${
                    correctSkulls.includes(color) ? "drop-shadow-[0_0_6px_rgba(74,222,128,0.9)]" : ""
                  }`}
                  draggable={false}
                />
                <TallyMarks count={placedCount(color)} />
              </div>
            )
          })}
        </div>

        {/* Bones pile. Height is explicit so the drop area matches the visible
            card exactly. */}
        <div ref={containerRef} className="relative w-full" style={{ height: PILE_AREA_HEIGHT }}>
          {bones
            .filter((bone) => !bone.placed)
            .map((bone) => (
              <img
                key={bone.id}
                src={`/images/bones/${bone.color}-${bone.number}.webp`}
                alt={`${bone.color} bone ${bone.number}`}
                className="absolute w-12 h-12 object-contain cursor-grab touch-none select-none"
                style={{
                  left: `${bone.left}%`,
                  top: `${bone.top}px`,
                  zIndex: bone.zIndex,
                  transform: `translateX(-50%) ${boneTransform(bone)}`,
                  visibility: drag?.id === bone.id ? "hidden" : "visible",
                }}
                draggable={false}
                onPointerDown={(e) => handlePointerDown(e, bone)}
              />
            ))}
        </div>
      </div>

      {/* The carried bone is portalled to <body> so it can move over the rest of the screen */}
      {drag &&
        draggedBone &&
        createPortal(
          <img
            src={`/images/bones/${draggedBone.color}-${draggedBone.number}.webp`}
            alt=""
            className="fixed w-12 h-12 object-contain pointer-events-none cursor-grabbing"
            style={{
              left: drag.x - drag.offsetX - BONE_SIZE / 2,
              top: drag.y - drag.offsetY - BONE_SIZE / 2,
              zIndex: 9999,
              transform: boneTransform(draggedBone),
              filter: "drop-shadow(0 6px 6px rgba(0,0,0,0.6))",
            }}
          />,
          document.body,
        )}
    </div>
  )
}
