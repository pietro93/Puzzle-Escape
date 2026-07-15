"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"

interface BoneCountingPuzzleProps {
  onSolve?: () => void
}

const BONE_SIZE = 48
const PILE_AREA_HEIGHT = 280

interface Bone {
  id: string
  color: string
  number: number
  flipH: boolean
  flipV: boolean
  rotation: number
  zIndex: number
  left: number
  top: number
}

export default function BoneCountingPuzzle({ onSolve }: BoneCountingPuzzleProps) {
  const [bones, setBones] = useState<Bone[]>([])
  const [draggedBone, setDraggedBone] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Initialize bones
  useEffect(() => {
    const configs: { color: string; numbers: number[] }[] = [
      {
        color: "white",
        numbers: [1, 2, 5, 6, 5, 6, 7, 3, 3, 4, 4, 4, 4], // 12 bones
      },
      {
        color: "orange",
        numbers: [1, 2, 5, 6, 4], // 5 bones
      },
      {
        color: "purple",
        numbers: [1, 2, 5, 6, 3, 3, 4, 4, 5, 6], // 10 bones
      },
      {
        color: "black",
        numbers: [1, 2, 5, 6, 4, 5, 3], // 7 bones
      },
      {
        color: "rust",
        numbers: [6, 1, 1, 3, 3, 4, 4, 5, 5], // Additional random bones
      },
    ]

    const initialBones: Bone[] = []
    let id = 0

    // Flatten all bones first so we can scatter them into a "mountain" pile
    // spanning the full width near the bottom of the area, instead of a tall
    // narrow stack down the middle.
    const allEntries: { color: string; number: number }[] = []
    configs.forEach((config) => {
      config.numbers.forEach((number) => {
        allEntries.push({ color: config.color, number })
      })
    })

    const PILE_HEIGHT = PILE_AREA_HEIGHT - BONE_SIZE
    const BASE_TOP = PILE_AREA_HEIGHT - BONE_SIZE

    allEntries.forEach(({ color, number }) => {
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
      })
      id++
    })

    setBones(initialBones)
  }, [])

  const handleDragStart = (e: React.DragEvent, boneId: string) => {
    setDraggedBone(boneId)
    e.dataTransfer.setData("text/plain", boneId)
    e.dataTransfer.effectAllowed = "move"

    // Remove the default drag ghost image
    const img = new Image()
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
    e.dataTransfer.setDragImage(img, 0, 0)
  }

  const handleDragEnd = () => {
    setDraggedBone(null)
    onSolve?.()
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()

    if (!draggedBone || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Ensure bones stay within container bounds
    const minY = 0 // Top of container (right below skulls)
    const maxY = rect.height - BONE_SIZE // Bottom of container minus bone height
    const minX = 0
    const maxX = rect.width - BONE_SIZE // Right edge minus bone width

    const clampedX = Math.max(minX, Math.min(maxX, x))
    const clampedY = Math.max(minY, Math.min(maxY, y))

    // Convert to percentage for left, px for top
    const leftPercent = (clampedX / rect.width) * 100

    setBones(prevBones =>
      prevBones.map(bone =>
        bone.id === draggedBone
          ? { ...bone, left: leftPercent, top: clampedY }
          : bone
      )
    )
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        {/* Skulls at the top */}
        <div className="flex justify-center gap-4 mb-4">
          <img
            src="/images/bones/purple-skull.webp"
            alt="Purple skull"
            className="w-16 h-16 object-contain"
          />
          <img
            src="/images/bones/orange-skull.webp"
            alt="Orange skull"
            className="w-16 h-16 object-contain"
          />
          <img
            src="/images/bones/white-skull.webp"
            alt="White skull"
            className="w-16 h-16 object-contain"
          />
          <img
            src="/images/bones/black-skull.webp"
            alt="Black skull"
            className="w-16 h-16 object-contain"
          />
        </div>

        {/* Bones pile - now draggable. Height is explicit so the draggable
            area matches the visible card exactly (no reaching past the
            bottom edge, and bones can be dropped right up against the skulls). */}
        <div
          ref={containerRef}
          className="relative w-full"
          style={{ height: PILE_AREA_HEIGHT }}
          onDragOver={handleDragOver}
        >
          {bones.map((bone) => (
            <img
              key={bone.id}
              src={`/images/bones/${bone.color}-${bone.number}.webp`}
              alt={`${bone.color} bone ${bone.number}`}
              className="absolute w-12 h-12 object-contain cursor-move"
              style={{
                left: `${bone.left}%`,
                top: `${bone.top}px`,
                zIndex: bone.zIndex,
                transform: `translateX(-50%) scaleX(${bone.flipH ? -1 : 1}) scaleY(${bone.flipV ? -1 : 1}) rotate(${bone.rotation}deg)`,
              }}
              draggable
              onDragStart={(e) => handleDragStart(e, bone.id)}
              onDragEnd={handleDragEnd}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
