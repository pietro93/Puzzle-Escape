"use client"

import type React from "react"

import { useState, useEffect } from "react"
import PuzzleContent from "./puzzle-content"
import StatusBar from "./status-bar"
import { usePlatform } from "@/hooks/use-platform"
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
  const [lives, setLives] = useState(3)
  const [coins, setCoins] = useState(0)
  const [isCorrect, setIsCorrect] = useState(false)
  const [isWrong, setIsWrong] = useState(false)
  const [answer, setAnswer] = useState("")
  const { platform } = usePlatform()
  const { impact } = useHaptics()

  // Reset correct/wrong states after a delay
  useEffect(() => {
    if (isCorrect || isWrong) {
      const timer = setTimeout(() => {
        setIsCorrect(false)
        setIsWrong(false)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [isCorrect, isWrong])

  const checkAnswer = () => {
    if (
      answer.toLowerCase() === puzzle.solution.toLowerCase() ||
      (puzzle.solution.includes("|") &&
        puzzle.solution.split("|").some((sol) => sol.toLowerCase() === answer.toLowerCase()))
    ) {
      setIsCorrect(true)
      setCoins(coins + 10)
      onCorrect()
    } else {
      setIsWrong(true)
      setAnswer("")
      setLives(lives - 1)
      onWrong()
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    const startX = e.touches[0].clientX
    const startY = e.touches[0].clientY

    const handleTouchMove = (e: TouchEvent) => {
      const deltaX = e.touches[0].clientX - startX
      const deltaY = e.touches[0].clientY - startY

      // Check for swipe up
      if (deltaY < -50 && Math.abs(deltaX) < 50) {
        checkAnswer()
      }

      // Check for swipe down
      if (deltaY > 50 && Math.abs(deltaX) < 50) {
        setAnswer("")
      }
    }

    const handleTouchEnd = () => {
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }

    document.addEventListener("touchmove", handleTouchMove)
    document.addEventListener("touchend", handleTouchEnd)
  }

  return (
    <div className="relative w-full h-full flex flex-col">
      <StatusBar level={level} lives={lives} coins={coins} setting={setting} />

      <div className="flex-1 p-4 flex flex-col items-center">
        <PuzzleContent
          level={level}
          question={puzzle.question}
          description={puzzle.description}
          imageUrl={puzzle.imageUrl}
          isPuzzleImage={puzzle.isPuzzleImage}
          isLibraryPuzzle={puzzle.isLibraryPuzzle}
          isInmatePuzzle={puzzle.isInteractiveInmates}
          isTarotPuzzle={puzzle.isTarotPuzzle}
          isJigsawPuzzle={puzzle.isJigsawPuzzle}
          isZodiacPuzzle={puzzle.isZodiacPuzzle}
          isFamiliarFacesPuzzle={puzzle.isFamiliarFacesPuzzle}
          isCrystalJigsawPuzzle={puzzle.isCrystalJigsawPuzzle}
          isCrocodileJigsawPuzzle={puzzle.isCrocodileJigsawPuzzle}
          isCrystalSequencePuzzle={puzzle.isCrystalSequencePuzzle}
          isParrotPuzzle={puzzle.isParrotPuzzle}
          isCoffeeGroundsPuzzle={puzzle.isCoffeeGroundsPuzzle}
          isQuestionnairePuzzle={puzzle.isQuestionnairePuzzle}
          isHellJigsawPuzzle={puzzle.isHellJigsawPuzzle}
          isFinalJigsawPuzzle={puzzle.isFinalJigsawPuzzle}
          isLightSwitchPuzzle={puzzle.isLightSwitchPuzzle}
          isFinalLevelPuzzle={puzzle.isFinalLevelPuzzle}
          isInfernalCasinoPuzzle={puzzle.isInfernalCasinoPuzzle}
          isEgyptianPillarsPuzzle={puzzle.isEgyptianPillarsPuzzle}
          isPyramidPuzzle={puzzle.isPyramidPuzzle}
          isEgyptianMathPuzzle={puzzle.isEgyptianMathPuzzle}
          isDarkRoomPuzzle={puzzle.isDarkRoomPuzzle}
          isMouthOfTruthPuzzle={puzzle.isMouthOfTruthPuzzle}
          isBinarySwitchPuzzle={puzzle.isBinarySwitchPuzzle}
          isAnimatedGifPuzzle={puzzle.isAnimatedGifPuzzle}
          isFireMapPuzzle={puzzle.isFireMapPuzzle}
          isGoldenScarabPuzzle={puzzle.isGoldenScarabPuzzle}
          inmateData={puzzle.inmateData}
          guardStatement={puzzle.guardStatement}
          onSolve={onCorrect}
        />
      </div>
    </div>
  )
}
