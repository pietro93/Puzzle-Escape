"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"

interface BoneCountingPuzzleProps {
  onSolve?: () => void
}

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

    configs.forEach((config) => {
      config.numbers.forEach((number) => {
        initialBones.push({
          id: `${config.color}-${number}-${id}`,
          color: config.color,
          number,
          flipH: Math.random() > 0.5,
          flipV: Math.random() > 0.5,
          rotation: Math.random() * 360,
          zIndex: Math.floor(Math.random() * 100) + 1,
          left: 40 + Math.random() * 20, // Center around 50%
          top: 100 + Math.random() * 200, // Below skulls
        })
        id++
      })
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
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()

    if (!draggedBone || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Ensure bones stay within container bounds
    const minY = 0 // Top of container (below skulls)
    const maxY = rect.height - 48 // Bottom of container minus bone height
    const minX = 0
    const maxX = rect.width - 48 // Right edge minus bone width

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
      <div className="relative w-full max-w-md h-96">
        {/* Skulls at the top */}
        <div className="flex justify-center gap-4 mb-8">
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

        {/* Bones pile - now draggable */}
        <div
          ref={containerRef}
          className="relative w-full h-full"
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
