"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import type { DialogueOption } from "./types"
import { cn } from "@/lib/utils"

interface DialogueInterfaceProps {
  character: string | null
  typedText: string
  dialogueOptions: DialogueOption[]
  askedQuestions: Set<string>
  dialoguePath: DialogueOption[]
  onSelectOption: (option: DialogueOption) => void
  onGoBack: () => void
}

export function DialogueInterface({
  character,
  typedText,
  dialogueOptions,
  askedQuestions,
  dialoguePath,
  onSelectOption,
  onGoBack,
}: DialogueInterfaceProps) {
  return (
    <div className="flex flex-col bg-black">
      {/* Character Portrait and Speech Bubble */}
      <div className="flex flex-col items-center mb-2 p-6 pt-0 bg-black">
        <div className="flex items-start mb-4">
          <div className="w-16 h-16 relative mr-3 bg-black">
            <Image
              src={`/images/murder-mystery/${character?.toLowerCase()}.webp`}
              alt={character}
              width={64}
              height={64}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <div className="flex-1">
            <p className="font-medium text-yellow-300 mb-1">{character}:</p>
            <p className="text-gray-200">{typedText}</p>
          </div>
        </div>
      </div>

      {/* Dialogue Options */}
      <div className="bg-gray-900/95 border-t-2 border-gray-700 p-4 rounded-t-lg">
        <div className="grid gap-2 max-h-[200px] overflow-y-auto">
          {dialogueOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => onSelectOption(option)}
              className={cn(
                "text-left p-2 rounded font-pixel transition-colors hover:bg-gray-700",
                askedQuestions.has(option.id) ? "text-gray-300" : "text-purple-300 font-bold",
              )}
            >
              {option.text}
            </button>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-4">
          {dialoguePath.length > 0 && (
            <Button variant="outline" size="sm" onClick={onGoBack} className="font-pixel text-xs">
              Back
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
