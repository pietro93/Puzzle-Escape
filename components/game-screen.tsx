"use client"
import Image from "next/image"

interface CharacterLocationDisplayProps {
  level: number
  setting: string
  character: string
  puzzle: any
}

export default function CharacterLocationDisplay({ level, setting, character, puzzle }: CharacterLocationDisplayProps) {
  return (
    <div className="grid grid-cols-2 gap-3 mb-4 animate-fadeIn">
      <div className="flex justify-center items-center">
        <div className="w-40 h-40 relative pixelated-container">
          <div className="absolute inset-0 bg-black/30 rounded-lg z-0"></div>
          <Image
            src={`/images/murder-mystery/${character}.webp`}
            alt={`${setting} location`}
            width={160}
            height={160}
            className="pixelated z-10 relative"
          />
          <div className="absolute -inset-1 border-2 border-gray-800 rounded-lg z-20 pointer-events-none"></div>
          <div className="absolute -bottom-1 left-0 right-0 h-1 bg-black/50 blur-sm z-30"></div>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <div className="w-40 h-40 relative pixelated-container">
          <div className="absolute inset-0 bg-black/30 rounded-lg z-0"></div>
          <Image
            src="/images/murder-mystery/crime-scene.webp"
            alt={`${setting} location`}
            width={160}
            height={160}
            className="pixelated z-10 relative"
          />
          <div className="absolute -inset-1 border-2 border-gray-800 rounded-lg z-20 pointer-events-none"></div>
          <div className="absolute -bottom-1 left-0 right-0 h-1 bg-black/50 blur-sm z-30"></div>
        </div>
      </div>
    </div>
  )
}
