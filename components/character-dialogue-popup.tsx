"use client"
import Image from "next/image"

interface CharacterDialoguePopupProps {
  character: string
  dialogue: string
  onClose: () => void
  onBack: () => void
  hasParentDialogue?: boolean
  isGuardPopup?: boolean
  guardDialogIndex?: number
  level?: number
  brainImage?: string // New prop for the brain image
}

export default function CharacterDialoguePopup({
  character,
  dialogue,
  onClose,
  onBack,
  hasParentDialogue,
  isGuardPopup = false,
  guardDialogIndex = 0,
  level = 0,
  brainImage, // Destructure the new prop
}: CharacterDialoguePopupProps) {
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div
        className="bg-gray-900 p-4 rounded-lg border-2 border-gray-700 max-w-sm w-full animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Character Image */}
        <div className="flex justify-center mb-4">
          <div className="w-32 h-32 relative pixelated-container">
            <Image
              src={
                isGuardPopup
                  ? level === 10
                    ? "/images/skeleton.webp"
                    : "/images/sphinx.webp"
                  : character === "brain"
                    ? brainImage || "/images/brainlamp.webp" // Use the brainImage prop
                    : character === "devil"
                      ? "/images/devil.webp"
                      : `/images/murder-mystery/${character}.webp`
              }
              alt={
                isGuardPopup
                  ? level === 10
                    ? "Guard"
                    : "Sphinx"
                  : character === "brain"
                    ? "Suffering Head"
                    : character === "devil"
                      ? "Devil"
                      : character
              }
              width={128}
              height={128}
              className="pixelated"
            />
          </div>
        </div>

        {/* Dialogue Text */}
        <div className="p-4 min-h-[100px] bg-gray-900 border-b border-gray-700">
          <p className="text-gray-200 text-sm whitespace-pre-line font-pixel">{dialogue}</p>
        </div>

        {/* Back Button */}
        <div className="mt-4 text-center">
          {hasParentDialogue && (
            <button
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-xs text-gray-300 font-pixel"
              onClick={onBack}
            >
              Back
            </button>
          )}

          {/* Close Button */}
          <button
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-xs text-gray-300 font-pixel ml-2"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
