"use client"

import type React from "react"
import { useState } from "react"
import { X } from "lucide-react"

export interface DialogueOption {
  id: string
  text: string
  response: string
  followUp?: DialogueOption[]
  condition?: () => boolean
  onSelect?: () => void
  special?: "passport" | "evidence" | "clue"
}

interface DialogueSystemProps {
  character: {
    name: string
    image: string
    dialogueOptions: DialogueOption[]
  }
  onClose: () => void
}

export const DialogueSystem: React.FC<DialogueSystemProps> = ({ character, onClose }) => {
  const [askedQuestions, setAskedQuestions] = useState<Set<string>>(new Set())
  const [currentOptions, setCurrentOptions] = useState<DialogueOption[]>(character.dialogueOptions)
  const [dialogueHistory, setDialogueHistory] = useState<Array<{ question: string; response: string }>>([])
  const [optionStack, setOptionStack] = useState<DialogueOption[][]>([])
  const [showPassport, setShowPassport] = useState(false)

  const handleSelectOption = (option: DialogueOption) => {
    // Mark this question as asked
    setAskedQuestions((prev) => {
      const newSet = new Set(prev)
      newSet.add(option.id)
      return newSet
    })

    // Add to dialogue history
    setDialogueHistory((prev) => [...prev, { question: option.text, response: option.response }])

    // Execute any side effects
    if (option.onSelect) {
      option.onSelect()
    }

    // Handle special options
    if (option.special === "passport") {
      setShowPassport(true)
      return
    }

    // If there are follow-up questions, push current options to stack and set new options
    if (option.followUp && option.followUp.length > 0) {
      setOptionStack((prev) => [...prev, currentOptions])
      setCurrentOptions(option.followUp)
    }
  }

  const handleGoBack = () => {
    if (optionStack.length > 0) {
      const prevOptions = optionStack[optionStack.length - 1]
      setCurrentOptions(prevOptions)
      setOptionStack((prev) => prev.slice(0, -1))
    } else {
      // If at root level, close the dialogue
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative w-full max-w-3xl max-h-[80vh] bg-gray-900 rounded-lg overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-amber-400">{character.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {/* Dialogue history */}
          {dialogueHistory.map((entry, index) => (
            <div key={index} className="mb-4">
              <div className="bg-gray-800 p-3 rounded-lg inline-block max-w-[80%] text-white">
                <p className="text-sm text-gray-400">You</p>
                <p>{entry.question}</p>
              </div>
              <div className="mt-2 bg-amber-900/30 p-3 rounded-lg inline-block max-w-[80%] ml-auto">
                <p className="text-sm text-amber-400">{character.name}</p>
                <p className="text-white">{entry.response}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Dialogue options */}
        <div className="p-4 border-t border-gray-700 bg-gray-800">
          {optionStack.length > 0 && (
            <button onClick={handleGoBack} className="mb-2 text-sm text-gray-400 hover:text-white flex items-center">
              ← Back
            </button>
          )}

          <div className="space-y-2">
            {currentOptions
              .filter((option) => !option.condition || option.condition())
              .map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option)}
                  className={`w-full text-left p-2 rounded-md hover:bg-gray-700 transition-colors ${
                    askedQuestions.has(option.id) ? "text-gray-300" : "text-purple-400 font-medium"
                  }`}
                  disabled={option.special === "passport" && askedQuestions.has(option.id)}
                >
                  {option.text}
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* Passport popup */}
      {showPassport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="bg-gray-800 p-4 rounded-lg max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">Victim's Passport</h3>
              <button onClick={() => setShowPassport(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <img src="/placeholder.svg?height=300&width=400" alt="Passport" className="w-full h-auto rounded" />
              <div className="mt-4 text-sm text-gray-300">
                <p>
                  <span className="font-bold">Name:</span> John Doe
                </p>
                <p>
                  <span className="font-bold">Nationality:</span> United States
                </p>
                <p>
                  <span className="font-bold">Date of Birth:</span> 01/01/1980
                </p>
                <p>
                  <span className="font-bold">Passport No:</span> AB123456
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
