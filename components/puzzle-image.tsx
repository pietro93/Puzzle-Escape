"use client"

// Let's examine how puzzle images are rendered
// This will help us understand how images are being displayed in puzzles

import { useState } from "react"

interface PuzzleImageProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
}

export default function PuzzleImage({ src, alt, className = "", width = 300, height = 300 }: PuzzleImageProps) {
  const [error, setError] = useState(false)

  const handleError = () => {
    console.error(`Failed to load puzzle image: ${src}`, {
      path: src,
      alt,
      width,
      height,
    })
    setError(true)
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-800 ${className}`} style={{ width, height }}>
        <p className="text-gray-400 text-sm font-pixel">Image not found</p>
      </div>
    )
  }

  return (
    <img
      src={src || "/placeholder.svg"}
      alt={alt}
      width={width}
      height={height}
      className={`object-contain ${className}`}
      onError={handleError}
    />
  )
}
