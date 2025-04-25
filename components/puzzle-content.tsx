"use client"

interface PuzzleContentProps {
  level: number
  puzzle: any
}

export default function PuzzleContent({ level, puzzle }: PuzzleContentProps) {
  return (
    <div className="bg-gray-900/80 p-5 rounded-lg mb-4 border border-gray-800 shadow-inner flex-1 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-3">
        <p className="font-pixel text-lg text-purple-300 leading-relaxed">{puzzle.question}</p>
      </div>
    </div>
  )
}
