"use client"

import type React from "react"

import { useState } from "react"
import PuzzleContent from "./puzzle-content"
import AnswerInput from "./answer-input"
import StatusBar from "./status-bar"
import { useCharacterDialogue } from "@/utils/dialogue-utils"
import CharacterDialoguePopup from "./character-dialogue-popup"
import { useHaptics } from "@/hooks/use-haptics"

interface GameScreenProps {
  level: number
  setting: string
  character: string
  puzzle: any
  onCorrect: (isSkipping?: boolean) => void
  onWrong: () => void
  soundEnabled: boolean
  toggleSound: () => void
  onJumpToLevel: (level: number) => void
}

export default function GameScreen({
  level,
  setting,
  character,
  puzzle,
  onCorrect,
  onWrong,
  soundEnabled,
  toggleSound,
  onJumpToLevel,
}: GameScreenProps) {
  const [answer, setAnswer] = useState("")
  const [isCorrect, setIsCorrect] = useState(false)
  const [isWrong, setIsWrong] = useState(false)
  const [showDialogue, setShowDialogue] = useState(false)
  const [lives, setLives] = useState(3)
  const [coins, setCoins] = useState(0)
  const [showSecretKeyInput, setShowSecretKeyInput] = useState(false)
  const [secretKey, setSecretKey] = useState("")
  const [showCongrats, setShowCongrats] = useState(false)
  const [showCheatMessage, setShowCheatMessage] = useState(false)
  const [touchStartX, setTouchStartX] = useState(0)
  const [touchStartY, setTouchStartY] = useState(0)

  const { impact } = useHaptics()
  const getCharacterDialogue = useCharacterDialogue()

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX)
    setTouchStartY(e.touches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartX || !touchStartY) {
      return
    }

    const deltaX = e.touches[0].clientX - touchStartX
    const deltaY = e.touches[0].clientY - touchStartY

    // Check for vertical swipe
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      if (deltaY < 0) {
        // Swipe up
        checkAnswer()
      } else {
        // Swipe down
        setAnswer("")
      }
    }

    setTouchStartX(0)
    setTouchStartY(0)
  }

  const handleTouchEnd = () => {
    setTouchStartX(0)
    setTouchStartY(0)
  }

  const checkAnswer = () => {
    if (
      answer.toLowerCase() === puzzle.solution.toLowerCase() ||
      puzzle.solution.split("|").includes(answer.toLowerCase())
    ) {
      setIsCorrect(true)
      setCoins((prev) => prev + 10)
      onCorrect()
      impact("success")
    } else if (answer.toLowerCase() === "tiengviet") {
      setShowCheatMessage(true)
      setShowSecretKeyInput(true)
    } else {
      setIsWrong(true)
      setLives((prev) => prev - 1)
      onWrong()
      impact("error")
      setTimeout(() => {
        setIsWrong(false)
      }, 1000)
    }
  }

  const handleSecretKeySubmit = () => {
    if (secretKey === "skip") {
      onCorrect(true)
    } else if (secretKey === "reset") {
      localStorage.removeItem("riddle_escape_save")
      window.location.reload()
    } else if (/^jump (\d+)$/.test(secretKey)) {
      const level = Number.parseInt(secretKey.split(" ")[1])
      onJumpToLevel(level)
    }
    setShowSecretKeyInput(false)
    setShowCheatMessage(false)
  }

  const handleGuardClick = () => {
    setShowDialogue(true)
  }

  const handleCloseDialogue = () => {
    setShowDialogue(false)
  }

  return (
    <div className="relative w-full h-full flex flex-col">
      <StatusBar level={level} lives={lives} coins={coins} setting={setting} />

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <PuzzleContent puzzle={puzzle} onGuardClick={handleGuardClick} />

        <AnswerInput
          answer={answer}
          setAnswer={setAnswer}
          isCorrect={isCorrect}
          isWrong={isWrong}
          checkAnswer={checkAnswer}
          level={level}
          handleTouchStart={handleTouchStart}
          handleTouchMove={handleTouchMove}
          handleTouchEnd={handleTouchEnd}
        />

        {showCheatMessage && (
          <div className="mt-4">
            <input
              type="text"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="Enter secret key..."
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <button
              onClick={handleSecretKeySubmit}
              className="px-4 py-2 bg-purple-900 hover:bg-purple-800 rounded-md text-white ml-2"
            >
              Submit
            </button>
          </div>
        )}
      </div>

      {showDialogue && (
        <CharacterDialoguePopup
          character={character}
          dialogue={getCharacterDialogue(character, level)}
          onClose={handleCloseDialogue}
        />
      )}
    </div>
  )
}
