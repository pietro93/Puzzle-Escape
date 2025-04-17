"use client"

import type React from "react"
import { useRef } from "react"
import { Send, X } from "lucide-react"

interface AnswerInputProps {
  answer: string
  setAnswer: (value: string) => void
  isCorrect: boolean
  isWrong: boolean
  checkAnswer: () => void
  level: number
  jigsawComplete?: boolean
  showElevator?: boolean
  isSubmitButtonHovered?: boolean
  handleSubmitButtonMouseEnter?: () => void
  handleSubmitButtonMouseLeave?: () => void
  handleTouchStart: (e: React.TouchEvent) => void
  handleTouchMove: (e: React.TouchEvent) => void
  handleTouchEnd: () => void
}

export default function AnswerInput({
  answer,
  setAnswer,
  isCorrect,
  isWrong,
  checkAnswer,
  level,
  jigsawComplete = false,
  showElevator = false,
  isSubmitButtonHovered = false,
  handleSubmitButtonMouseEnter,
  handleSubmitButtonMouseLeave,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
}: AnswerInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="relative" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
      <input
        ref={inputRef}
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Enter your answer..."
        className={`w-full px-4 py-3 bg-gray-900/80 border-2 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-600 font-mono text-center ${
          isCorrect
            ? "border-green-600 focus:ring-green-600"
            : isWrong
              ? "border-red-600 focus:ring-red-600"
              : "border-gray-700"
        } transition-all duration-300 shadow-lg`}
        disabled={isCorrect}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            checkAnswer()
          }
        }}
      />

      {answer && (
        <button
          onClick={() => setAnswer("")}
          className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      <button
        onClick={checkAnswer}
        onMouseEnter={handleSubmitButtonMouseEnter}
        onMouseLeave={handleSubmitButtonMouseLeave}
        disabled={
          isCorrect ||
          typeof answer !== "string" ||
          !answer.trim() ||
          (level === 50 && jigsawComplete && !showElevator && isSubmitButtonHovered)
        }
        className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
          typeof answer === "string" &&
          answer.trim() &&
          !(level === 50 && jigsawComplete && !showElevator && isSubmitButtonHovered)
            ? "bg-purple-900 hover:bg-purple-800 text-white"
            : "bg-gray-800 text-gray-600 cursor-not-allowed"
        } ${level === 50 && jigsawComplete && !showElevator && isSubmitButtonHovered ? "opacity-0" : "opacity-100"}`}
      >
        <Send className="w-4 h-4" />
      </button>

      <div className="absolute -bottom-5 left-0 right-0 flex justify-center">
        <div className="text-xs text-gray-400 font-pixel">Swipe up to submit • Swipe down to clear</div>
      </div>
    </div>
  )
}
