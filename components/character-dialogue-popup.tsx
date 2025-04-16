"use client"
import Image from "next/image"

interface CharacterDialoguePopupProps {
  character: string
  dialogue: string
  onClose: () => void
  isGuardPopup?: boolean
  guardDialogIndex?: number
  level?: number
}

export default function CharacterDialoguePopup({
  character,
  dialogue,
  onClose,
  isGuardPopup = false,
  guardDialogIndex = 0,
  level = 0,
}: CharacterDialoguePopupProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-gray-900 p-4 rounded-lg border-2 border-gray-700 max-w-sm w-full animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <div className="w-16 h-16 relative pixelated-container shrink-0">
            <Image
              src={
                isGuardPopup
                  ? level === 10
                    ? "/images/skeleton.webp"
                    : "/images/sphinx.webp"
                  : `/images/${character}.webp`
              }
              alt={isGuardPopup ? (level === 10 ? "Guard" : "Sphinx") : character}
              width={64}
              height={64}
              className="pixelated"
            />
          </div>
          <div className="flex-1">
            <p className="text-purple-300 font-pixel mb-2">
              {isGuardPopup
                ? level === 10
                  ? "Guard:"
                  : "Sphinx:"
                : character.charAt(0).toUpperCase() + character.slice(1) + ":"}
            </p>
            <p className="text-gray-200 text-sm whitespace-pre-line">
              {isGuardPopup
                ? level === 10
                  ? `"${dialogue}"`
                  : `"I have a bed, where I make my way,
I have a mouth, where I end my day.
I have banks, that hold me near,
I have a body, that is crystal clear."`
                : `"${dialogue}"`}
            </p>
          </div>
        </div>
        <div className="mt-4 text-center">
          <button
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-xs text-gray-300 font-pixel"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
