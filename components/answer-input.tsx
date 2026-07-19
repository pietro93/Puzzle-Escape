"use client"

import type React from "react"
import { useRef } from "react"
import { Send, X, Lock } from "lucide-react"

interface AnswerInputProps {
  answer: string
  setAnswer: (value: string) => void
  isCorrect: boolean
  isWrong: boolean
  checkAnswer: () => void
  level: number
  locked?: boolean
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
  locked = false,
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
      <div className="relative rounded-xl overflow-hidden">
        <input
          ref={inputRef}
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Enter your answer..."
          className={`w-full pl-4 pr-20 py-3 bg-gray-900/80 border-2 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-600 font-mono text-center text-sm sm:text-base ${
            isCorrect
              ? "border-green-600 focus:ring-green-600"
              : isWrong
                ? "border-red-600 focus:ring-red-600"
                : "border-gray-700"
          } ${locked ? "cursor-not-allowed" : ""} transition-all duration-300 shadow-lg`}
          disabled={isCorrect || locked}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              checkAnswer()
            }
          }}
        />

        {/* Vault gate: two riveted metal leaves that part vertically once the level's mechanic is solved */}
        <div className="absolute inset-0 pointer-events-none z-10">
          <div
            className={`absolute left-0 right-0 top-0 h-1/2 bg-gradient-to-b from-gray-700 via-gray-800 to-gray-900 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.6)] transition-transform duration-[1400ms] ease-[cubic-bezier(0.65,0,0.35,1)] ${
              locked ? "translate-y-0" : "-translate-y-full"
            }`}
          >
            <span className="absolute left-2 top-1.5 w-1.5 h-1.5 rounded-full bg-gray-950 shadow-[0_1px_0_rgba(255,255,255,0.15)]" />
            <span className="absolute right-2 top-1.5 w-1.5 h-1.5 rounded-full bg-gray-950 shadow-[0_1px_0_rgba(255,255,255,0.15)]" />
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-purple-800/70" />
          </div>
          <div
            className={`absolute left-0 right-0 bottom-0 h-1/2 bg-gradient-to-t from-gray-700 via-gray-800 to-gray-900 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] transition-transform duration-[1400ms] ease-[cubic-bezier(0.65,0,0.35,1)] ${
              locked ? "translate-y-0" : "translate-y-full"
            }`}
          >
            <span className="absolute left-2 bottom-1.5 w-1.5 h-1.5 rounded-full bg-gray-950 shadow-[0_-1px_0_rgba(255,255,255,0.15)]" />
            <span className="absolute right-2 bottom-1.5 w-1.5 h-1.5 rounded-full bg-gray-950 shadow-[0_-1px_0_rgba(255,255,255,0.15)]" />
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-purple-800/70" />
          </div>

          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
              locked ? "opacity-100 scale-100" : "opacity-0 scale-50 delay-300"
            }`}
          >
            <div className="w-6 h-6 rounded-full bg-gray-950 border border-purple-800/70 flex items-center justify-center shadow-lg">
              <Lock className="w-3.5 h-3.5 text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {answer && !locked && (
        <button
          onClick={() => setAnswer("")}
          className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {!locked && (
        <button
          onClick={checkAnswer}
          onMouseEnter={handleSubmitButtonMouseEnter}
          onMouseLeave={handleSubmitButtonMouseLeave}
          disabled={
            isCorrect ||
            !answer.trim() ||
            (level === 50 && jigsawComplete && !showElevator && isSubmitButtonHovered)
          }
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
            answer.trim() && !(level === 50 && jigsawComplete && !showElevator && isSubmitButtonHovered)
              ? "bg-purple-900 hover:bg-purple-800 text-white"
              : "bg-gray-800 text-gray-600 cursor-not-allowed"
          } ${level === 50 && jigsawComplete && !showElevator && isSubmitButtonHovered ? "opacity-0" : "opacity-100"}`}
        >
          <Send className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
