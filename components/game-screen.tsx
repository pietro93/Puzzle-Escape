import type React from "react"
;('"use client')

import { useState } from "react"
import CharacterLocationDisplay from "./character-location-display"
import AnswerInput from "./answer-input"
import HintSystem from "./hint-system"
import { useHaptics } from "@/hooks/use-haptics"
import { useAchievements, ACHIEVEMENTS } from "@/hooks/use-achievements"
import { useCharacterDialogue } from "@/utils/dialogue-utils"
import CharacterDialoguePopup from "./character-dialogue-popup"
import { useRouter } from "next/navigation"

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
  const [showHint, setShowHint] = useState(false)
  const [hintIndex, setHintIndex] = useState(0)
  const [showSolution, setShowSolution] = useState(false)
  const [showCongrats, setShowCongrats] = useState(false)
  const [showCheat, setShowCheat] = useState(false)
  const [guardDialogIndex, setGuardDialogIndex] = useState(0)
  const [showGuardDialog, setShowGuardDialog] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [isSubmitButtonHovered, setIsSubmitButtonHovered] = useState(false)

  const { impact } = useHaptics()
  const { unlockAchievement } = useAchievements()
  const getCharacterDialogue = useCharacterDialogue()
  const router = useRouter()

  const handleCorrect = (isSkipping = false) => {
    setIsCorrect(true)
    setIsWrong(false)
    setAnswer("")
    onCorrect(isSkipping)
    if (setting === "prison") unlockAchievement(ACHIEVEMENTS.ESCAPE_PRISON)
    if (setting === "mansion") unlockAchievement(ACHIEVEMENTS.ESCAPE_MANSION)
    if (setting === "forest") unlockAchievement(ACHIEVEMENTS.ESCAPE_FOREST)
    if (setting === "desert") unlockAchievement(ACHIEVEMENTS.ESCAPE_DESERT)
  }

  const handleWrong = () => {
    setIsWrong(true)
    setIsCorrect(false)
    setAnswer("")
    onWrong()
  }

  const checkAnswer = () => {
    if (
      answer.toLowerCase() === puzzle.solution.toLowerCase() ||
      puzzle.solution.split("|").includes(answer.toLowerCase())
    ) {
      handleCorrect()
    } else {
      handleWrong()
    }
  }

  const handleHint = () => {
    setShowHint(true)
  }

  const handleSolution = () => {
    setShowSolution(true)
  }

  const handleCongrats = () => {
    setShowCongrats(true)
  }

  const handleCheat = () => {
    setShowCheat(true)
  }

  const handleNextHint = () => {
    setHintIndex((prev) => (prev + 1) % (puzzle.hints?.length || 1))
  }

  const handleGuardClick = () => {
    setShowGuardDialog(true)
  }

  const closeGuardDialog = () => {
    setShowGuardDialog(false)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return

    const touchEnd = e.touches[0].clientY
    const touchDiff = touchStart - touchEnd

    // Swipe up
    if (touchDiff > 5) {
      checkAnswer()
    }
    // Swipe down
    if (touchDiff < -5) {
      setAnswer("")
    }

    setTouchStart(null)
  }

  const handleTouchEnd = () => {
    setTouchStart(null)
  }

  const handleSecretKey = () => {
    if (answer.toLowerCase() === "tiengviet") {
      handleCorrect(true)
      impact("heavy")
    }
  }

  return (
    <div className="relative w-full h-full flex flex-col">
      {showGuardDialog && (
        <CharacterDialoguePopup
          character={character}
          dialogue={getCharacterDialogue(character, level)}
          onClose={closeGuardDialog}
        />
      )}

      <div className="flex-1 flex flex-col p-4">
        <CharacterLocationDisplay
          level={level}
          setting={setting}
          character={character}
          puzzle={puzzle}
          onGuardClick={handleGuardClick}
        />

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

        {puzzle.hints && puzzle.hints.length > 0 && <HintSystem hints={puzzle.hints} />}
      </div>
    </div>
  )
}
