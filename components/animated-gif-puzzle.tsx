"use client"

import { useState, useRef } from "react"
import { RefreshCw } from "lucide-react"

interface AnimatedGifPuzzleProps {
  videoUrl: string
  altText: string
  showReplayButton?: boolean
}

export default function AnimatedGifPuzzle({ videoUrl, altText, showReplayButton = true }: AnimatedGifPuzzleProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [key, setKey] = useState(0)

  const handleReplay = () => {
    // Increment key to force re-render of video element
    setKey((prev) => prev + 1)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: "100px", height: "100px" }}>
        <video
          key={key}
          ref={videoRef}
          src={videoUrl}
          autoPlay
          muted
          playsInline
          width={100}
          height={100}
          className="pixelated"
          style={{ width: "100px", height: "100px" }}
        />
      </div>

      {showReplayButton && (
        <button
          onClick={handleReplay}
          className="flex items-center justify-center w-8 h-8 bg-purple-900/50 hover:bg-purple-800/60 rounded-full border border-purple-700 text-purple-300 transition-colors"
          aria-label="Replay animation"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
