"use client"

import type React from "react"

import { useState } from "react"
import PuzzleImage from "./puzzle-image"
import CharacterImage from "./character-image"
import LocationImage from "./location-image"
import AnswerInput from "./answer-input"
import HintSystem from "./hint-system"
import { useRouter } from "next/navigation"

interface GameScreenProps {
  level: number
  setting: string
  character: string
  puzzle: any
  onCorrect: (isSkipping: boolean) => void
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
  const [showHints, setShowHints] = useState(false)
  const [lives, setLives] = useState(3)
  const [coins, setCoins] = useState(0)
  const [guardDialogIndex, setGuardDialogIndex] = useState(0)
  const router = useRouter()

  // Touch handling for answer input
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    const swipeDistance = touchStart - touchEnd
    const isSwipeLeft = swipeDistance > 50
    const isSwipeRight = swipeDistance < -50

    if (isSwipeLeft) {
      checkAnswer()
    } else if (isSwipeRight) {
      setAnswer("")
    }
  }

  const checkAnswer = () => {
    if (answer.toLowerCase() === puzzle.solution.toLowerCase()) {
      setIsCorrect(true)
      onCorrect()
    } else {
      setIsWrong(true)
      setLives(lives - 1)
      onWrong()
      setTimeout(() => {
        setIsWrong(false)
      }, 1000)
    }
  }

  const toggleHints = () => {
    setShowHints(!showHints)
  }

  const handleGuardClick = () => {
    // Cycle through guard dialog lines
    setGuardDialogIndex((prevIndex) => (prevIndex + 1) % 4)
  }

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <p className="font-pixel text-lg text-purple-300 leading-relaxed">Level {level}</p>
        </div>

        <div className="flex justify-between items-center mb-3">
          <PuzzleImage puzzle={puzzle} />
          <CharacterImage character={character} />
          <LocationImage setting={setting} />
        </div>

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

        {showHints && <HintSystem hints={puzzle.hints || []} />}
      </div>
    </div>
  )
}
