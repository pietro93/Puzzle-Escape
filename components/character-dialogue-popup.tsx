"use client"
import Image from "next/image"
import { parseDialogueForItalics, characterImageMap } from "@/utils/dialogue-utils"

interface CharacterDialoguePopupProps {
  character: string
  dialogue: string
  onClose: () => void
  onBack?: () => void
  hasParentDialogue?: boolean
  isGuardPopup?: boolean
  guardDialogIndex?: number
  level?: number
  brainImage?: string
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
  brainImage,
}: CharacterDialoguePopupProps) {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-900 p-4 rounded-lg border-2 border-gray-700 max-w-sm w-full animate-fadeIn">
        <div className="flex items-start gap-3">
          {/* Character Image */}
          {character === "brain" && brainImage ? (
            // Specific logic for dynamic brain image
            <div className="w-16 h-16 relative pixelated-container shrink-0">
              <img
                src={brainImage}
                alt="Brain"
                width={64}
                height={64}
                className="pixelated"
                style={{ imageRendering: "pixelated" }}
              />
            </div>
          ) : (
            // General logic for all other characters using characterImageMap
            <div className="w-16 h-16 relative pixelated-container shrink-0">
              <Image
                src={characterImageMap[character] || "/placeholder.svg"} // Use map, fallback to placeholder
                alt={character}
                width={64}
                height={64}
                className="pixelated"
              />
            </div>
          )}

          {/* Dialogue Text */}
          <div className="flex-1">
            <p className="text-purple-300 font-pixel mb-2">
              {character.charAt(0).toUpperCase() + character.slice(1)}:
            </p>
            <p
              className="text-gray-200 text-sm whitespace-pre-line font-pixel"
              dangerouslySetInnerHTML={{ __html: parseDialogueForItalics(dialogue) }}
            />
          </div>
        </div>
        <div className="mt-4 text-center">
          <button
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-xs text-gray-300 font-pixel"
            onClick={onClose}
          >
            Close
          </button>
          {hasParentDialogue && onBack && (
            <button
              className="ml-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-xs text-gray-300 font-pixel"
              onClick={onBack}
            >
              Back
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

