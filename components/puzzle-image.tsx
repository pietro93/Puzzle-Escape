import type { Puzzle } from "@/types/puzzle"

interface PuzzleImageProps {
  puzzle: Puzzle
}

export default function PuzzleImage({ puzzle }: PuzzleImageProps) {
  const imageUrl = puzzle.imageUrl
  const isPixelated = true // Assuming pixelated is always true based on the original code

  return (
    <div className="w-40 h-40 relative pixelated-container">
      <div className="absolute inset-0 bg-black/30 rounded-lg z-0"></div>
      <img
        src={imageUrl || "/placeholder.svg"}
        alt="Puzzle"
        className={`${isPixelated ? "pixelated" : ""} max-w-full h-auto object-contain`}
        onError={(e) => {
          console.error("Failed to load image:", imageUrl)
          ;(e.target as HTMLImageElement).src = "/placeholder.svg"
        }}
      />
      <div className="absolute -inset-1 border-2 border-gray-800 rounded-lg z-20 pointer-events-none"></div>
      <div className="absolute -bottom-1 left-0 right-0 h-1 bg-black/50 blur-sm z-30"></div>
    </div>
  )
}
