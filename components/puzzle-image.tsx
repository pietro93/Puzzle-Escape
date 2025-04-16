import Image from "next/image"
import type { Puzzle } from "@/types/puzzle"

interface PuzzleImageProps {
  puzzle: Puzzle
}

export default function PuzzleImage({ puzzle }: PuzzleImageProps) {
  return (
    <div className="w-40 h-40 relative pixelated-container">
      <div className="absolute inset-0 bg-black/30 rounded-lg z-0"></div>
      <Image
        src={puzzle.imageUrl || "/placeholder.svg"}
        alt={`Puzzle for level ${puzzle.level}`}
        width={160}
        height={160}
        className="pixelated z-10 relative"
      />
      <div className="absolute -inset-1 border-2 border-gray-800 rounded-lg z-20 pointer-events-none"></div>
      <div className="absolute -bottom-1 left-0 right-0 h-1 bg-black/50 blur-sm z-30"></div>
    </div>
  )
}
