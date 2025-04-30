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
        <div className="w-40 h-40 relative pixelated-container bg-black p-0">
          <Image
            src={
              character === "policewoman"
                ? "/images/murder-mystery/policewoman.webp"
                : character === "mortician"
                  ? "/images/murder-mystery/mortician.webp"
                  : "/images/murder-mystery/librarian.webp"
            }
            alt={character || ""}
            width={160}
            height={160}
            className="pixelated"
          />
        </div>

        {/* Speech Bubble */}
        <div className="mt-2 relative bg-gray-900 p-4 rounded-lg border border-gray-600 flex-1 min-h-[80px]">
          <p className="font-pixel text-gray-200 text-sm">{typedText || "..."}</p>
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
