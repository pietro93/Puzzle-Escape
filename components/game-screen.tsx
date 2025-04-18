import type React from "react"
;('"use client')

import { useState } from "react"
import CharacterLocationDisplay from "./character-location-display"
import AnswerInput from "./answer-input"
import HintSystem from "./hint-system"
import { useCharacterDialogue } from "@/utils/dialogue-utils"
import CharacterDialoguePopup from "./character-dialogue-popup"
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
  const [showDialogue, setShowDialogue] = useState(false)
  const [guardDialogIndex, setGuardDialogIndex] = useState(0)
  const [isSubmitButtonHovered, setIsSubmitButtonHovered] = useState(false)
  const [currentPyramidRoom, setCurrentPyramidRoom] = useState("entrance")
  const [hasPyramidTorch, setHasPyramidTorch] = useState(false)
  const [hasUsedElevator, setHasUsedElevator] = useState(false)
  const [showElevator, setShowElevator] = useState(false)
  const [jigsawComplete, setJigsawComplete] = useState(false)
  const [currentElevatorFloor, setCurrentElevatorFloor] = useState(0)
  const [solution, setSolution] = useState("")

  const router = useRouter()

  const { getCharacterDialogue } = useCharacterDialogue()

  const handleGuardClick = () => {
    setShowDialogue(true)
  }

  const handleCloseDialogue = () => {
    setShowDialogue(false)
  }

  const checkAnswer = () => {
    if (answer.toLowerCase() === puzzle.solution.toLowerCase() || puzzle.solution.includes(answer.toLowerCase())) {
      setIsCorrect(true)
      onCorrect(false)
    } else {
      setIsWrong(true)
      onWrong()
    }
  }

  const handleJigsawComplete = () => {
    setJigsawComplete(true)
  }

  const handleParrotSolve = () => {
    setIsCorrect(true)
    onCorrect(false)
  }

  const handleQuestionnaireRestart = () => {
    setAnswer("")
    setIsCorrect(false)
    setIsWrong(false)
  }

  const handleLightSwitchUpdate = (isLightOn: boolean, isSolved: boolean) => {
    // No specific logic needed here, just passing the props
  }

  const handleZodiacSolve = () => {
    setIsCorrect(true)
    onCorrect(false)
  }

  const handlePyramidRoomChange = (room: string) => {
    setCurrentPyramidRoom(room)
  }

  const handlePyramidTorchAcquired = () => {
    setHasPyramidTorch(true)
  }

  const handleAllPiecesRemoved = () => {
    setShowElevator(true)
  }

  const handleElevatorPanelOpen = () => {
    setHasUsedElevator(true)
  }

  const handleSecretKey = () => {
    if (answer.toLowerCase() === "tiengviet") {
      onCorrect(true)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    // Add touch start logic if needed
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    // Add touch move logic if needed
  }

  const handleTouchEnd = () => {
    // Add touch end logic if needed
    if (answer.trim()) {
      checkAnswer()
    }
  }

  const handleSolutionGenerated = (solution: string) => {
    setSolution(solution)
  }

  const handleJumpToLevel = (level: number) => {
    onJumpToLevel(level)
  }

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Character and Location Display */}
      <CharacterLocationDisplay
        level={level}
        setting={setting}
        character={character}
        puzzle={puzzle}
        lightsOn={false}
        solved={false}
        onGuardClick={handleGuardClick}
        onLocationClick={() => {}}
        onPyramidLocationImageClick={() => {}}
        currentPyramidRoom={currentPyramidRoom}
        hasPyramidTorch={hasPyramidTorch}
        hasUsedElevator={hasUsedElevator}
        showElevator={showElevator}
        jigsawComplete={jigsawComplete}
      />

      {/* Answer Input */}
      <AnswerInput
        answer={answer}
        setAnswer={setAnswer}
        isCorrect={isCorrect}
        isWrong={isWrong}
        checkAnswer={checkAnswer}
        level={level}
        jigsawComplete={jigsawComplete}
        showElevator={showElevator}
        isSubmitButtonHovered={isSubmitButtonHovered}
        handleSubmitButtonMouseEnter={() => setIsSubmitButtonHovered(true)}
        handleSubmitButtonMouseLeave={() => setIsSubmitButtonHovered(false)}
        handleTouchStart={handleTouchStart}
        handleTouchMove={handleTouchMove}
        handleTouchEnd={handleTouchEnd}
      />

      {/* Hint System */}
      <HintSystem hints={puzzle.hints || []} />

      {/* Character Dialogue Popup */}
      {showDialogue && (
        <CharacterDialoguePopup
          character={character}
          dialogue={getCharacterDialogue(character, level)}
          onClose={handleCloseDialogue}
          isGuardPopup={true}
          guardDialogIndex={guardDialogIndex}
          level={level}
        />
      )}
    </div>
  )
}
