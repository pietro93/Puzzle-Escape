"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import type { Puzzle } from "@/types/puzzle"
import HintSystem from "./hint-system"
import { Lightbulb, ChevronUp, ChevronDown, Volume2, VolumeX, Sparkles } from "lucide-react"
import { useAudio } from "@/hooks/use-audio"
import { useHaptics } from "@/hooks/use-haptics"
import { useAchievements } from "@/hooks/use-achievements"
import { useStorage } from "@/hooks/use-storage"
import { useCharacterDialogue } from "@/utils/dialogue-utils"
import CharacterLocationDisplay from "./character-location-display"
import AnswerInput from "./answer-input"
import CharacterDialoguePopup from "./character-dialogue-popup"
import PuzzleContent from "./puzzle-content"
import InfernalChessPuzzle from "./infernal-chess-puzzle"

interface GameScreenProps {
  level: number
  setting: string
  character: string
  puzzle: Puzzle
  onCorrect: (isSkipping?: boolean) => void
  onWrong: () => void
  soundEnabled: boolean
  toggleSound: () => void
  onJumpToLevel?: (level: number) => void
  characterDialogues?: Record<string, string[]>
  onLevelComplete: () => void
  onTransition: (transitionId: string) => void
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
  characterDialogues,
  onLevelComplete,
  onTransition,
}: GameScreenProps) {
  const { playSound } = useAudio()
  const { vibrate } = useHaptics()
  const { unlockAchievement } = useAchievements()
  const { getItem, setItem } = useStorage()
  const getRandomDialogue = useCharacterDialogue()

  const [answer, setAnswer] = useState("")
  const [feedback, setFeedback] = useState("")
  const [isCorrect, setIsCorrect] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [isWrong, setIsWrong] = useState(false)
  const [touchStartY, setTouchStartY] = useState(0)
  const [touchEndY, setTouchEndY] = useState(0)
  const [showPuzzleDetails, setShowPuzzleDetails] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)
  const [guardDialogIndex, setGuardDialogIndex] = useState(0)
  const [showGuardPopup, setShowGuardPopup] = useState(false)
  const [jigsawComplete, setJigsawComplete] = useState(false)
  const [lightsOn, setLightsOn] = useState(false)
  const [solved, setSolved] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [dynamicSolution, setDynamicSolution] = useState<string | null>(null)
  const [characterDialogue, setCharacterDialogue] = useState<string>("")
  const [showCharacterDialogue, setShowCharacterDialogue] = useState<boolean>(false)

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 500)
    }

    // Add entrance animation
    setIsAnimating(true)
    const timer = setTimeout(() => {
      setIsAnimating(false)
    }, 600)

    return () => clearTimeout(timer)
  }, [])

  const checkAnswer = () => {
    if (!answer.trim()) return

    const normalizedUserAnswer = answer.trim().toLowerCase()
    const normalizedCorrectAnswers = puzzle.solution.toLowerCase().split("|")

    if (normalizedCorrectAnswers.includes(normalizedUserAnswer)) {
      setFeedback("Correct! Well done.")
      setIsCorrect(true)

      setTimeout(() => {
        setAnswer("")
        setFeedback("")
        setIsCorrect(false)
        setShowHints(false)
        onCorrect(false) // Normal progression
      }, 1500)
    } else {
      setFeedback("That's not quite right. Try again.")
      setIsWrong(true)

      onWrong() // Trigger wrong answer sound

      setTimeout(() => {
        setAnswer("")
        setFeedback("")
        setIsWrong(false)
      }, 1500)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.targetTouches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndY(e.targetTouches[0].clientY)
  }

  const handleTouchEnd = () => {
    if (touchStartY - touchEndY > 50) {
      // Swipe up to submit
      checkAnswer()
    } else if (touchEndY - touchStartY > 50) {
      // Swipe down to clear
      setAnswer("")
    }
  }

  const getSettingBackground = () => {
    switch (setting) {
      case "prison":
        return "bg-black"
      case "mansion":
        return "bg-black"
      case "forest":
        return "bg-black"
      case "desert":
        return "bg-black"
      case "hell":
        return "bg-black"
    }
  }

  const togglePuzzleDetails = () => {
    setShowPuzzleDetails(!showPuzzleDetails)
  }

  const handleGuardClick = () => {
    // For all other levels, show a random character dialogue
    setCharacterDialogue(getRandomDialogue(character, level))
    setShowCharacterDialogue(true)
  }

  const handleCloseCharacterDialogue = () => {
    setShowCharacterDialogue(false)
    setShowGuardPopup(false)
  }

  const handleChessPuzzleSolve = () => {
    // Don't automatically solve, let the player type the answer
    setAnswer("")
    setFeedback("")
  }

  return (
    <div
      className={`w-full max-w-md mx-auto p-4 ${getSettingBackground()} transition-colors duration-1000 min-h-[100vh] flex flex-col ${isAnimating ? "animate-fadeIn" : ""}`}
    >
      {/* Sound toggle button */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={toggleSound}
          className="w-10 h-10 rounded-full bg-gray-800/80 flex items-center justify-center border border-gray-700 hover:bg-gray-700/80 transition-colors"
        >
          {soundEnabled ? (
            <Volume2 className="w-5 h-5 text-purple-300" />
          ) : (
            <VolumeX className="w-5 h-5 text-gray-500" />
          )}
        </button>
      </div>

      {/* Level indicator */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm font-pixel text-purple-300 bg-gray-900/70 px-3 py-1 rounded-full border border-gray-800 shadow-lg flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-yellow-400" /> Level {level}
        </div>
        <button
          onClick={togglePuzzleDetails}
          className="flex items-center gap-1 text-xs bg-gray-800/80 px-2 py-1 rounded-full font-pixel border border-gray-700 hover:bg-gray-700/80 transition-colors"
        >
          {showPuzzleDetails ? (
            <>
              Hide Details <ChevronUp className="w-3 h-3" />
            </>
          ) : (
            <>
              Show Details <ChevronDown className="w-3 h-3" />
            </>
          )}
        </button>
      </div>

      {/* Character and location section */}
      {showPuzzleDetails && (
        <CharacterLocationDisplay
          level={level}
          setting={setting}
          character={character}
          puzzle={puzzle}
          lightsOn={lightsOn}
          solved={solved}
          binaryCorrectCombinations={0}
          currentPyramidRoom={""}
          hasPyramidTorch={false}
          hasUsedElevator={false}
          showElevator={false}
          jigsawComplete={jigsawComplete}
          onGuardClick={handleGuardClick}
          onLocationClick={() => {}}
          onPyramidLocationImageClick={() => {}}
        />
      )}

      {/* Puzzle description */}
      <div className="bg-gray-900/80 p-5 rounded-lg mb-4 border border-gray-800 shadow-inner flex-1 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-3">
          <p className="font-pixel text-lg text-purple-300 leading-relaxed">{puzzle.question}</p>
        </div>

        {puzzle.description && (
          <div className="text-gray-300 whitespace-pre-line font-mono text-sm bg-gray-950/50 p-4 rounded-lg border border-gray-800 shadow-inner mb-4">
            {puzzle.description}
          </div>
        )}

        {/* Render the chess puzzle only for level 42 */}
        {level === 42 && <InfernalChessPuzzle onSolve={handleChessPuzzleSolve} />}

        {/* For other levels, render the regular puzzle content */}
        {level !== 42 && (
          <PuzzleContent
            level={level}
            puzzle={puzzle}
            guardDialogIndex={guardDialogIndex}
            handleGuardClick={handleGuardClick}
            handleJigsawComplete={() => setJigsawComplete(true)}
            handleParrotSolve={() => {}}
            handleQuestionnaireRestart={() => {}}
            handleLightSwitchUpdate={(isLightOn, isSolved) => {
              setLightsOn(isLightOn)
              setSolved(isSolved)
            }}
            handleZodiacSolve={() => {}}
            handlePyramidRoomChange={() => {}}
            handlePyramidTorchAcquired={() => {}}
            currentPyramidRoom={""}
            hasPyramidTorch={false}
            handleAllPiecesRemoved={() => {}}
            handleElevatorPanelOpen={() => {}}
            currentElevatorFloor={0}
            setCurrentElevatorFloor={() => {}}
            onSolutionGenerated={(solution) => setDynamicSolution(solution)}
            setBinaryCorrectCombinations={() => {}}
            questionnaireRef={null}
          />
        )}
      </div>

      {/* Answer input section */}
      <div className="space-y-3 mt-auto">
        <AnswerInput
          answer={answer}
          setAnswer={setAnswer}
          isCorrect={isCorrect}
          isWrong={isWrong}
          checkAnswer={checkAnswer}
          level={level}
          jigsawComplete={jigsawComplete}
          showElevator={false}
          isSubmitButtonHovered={false}
          handleSubmitButtonMouseEnter={() => {}}
          handleSubmitButtonMouseLeave={() => {}}
          handleTouchStart={handleTouchStart}
          handleTouchMove={handleTouchMove}
          handleTouchEnd={handleTouchEnd}
        />

        {feedback && (
          <div
            className={`p-3 rounded-lg text-center font-pixel ${
              isCorrect
                ? "bg-green-900/80 text-green-200 border border-green-700"
                : "bg-red-900/80 text-red-200 border border-red-700"
            } animate-fadeIn shadow-lg`}
          >
            {feedback}
          </div>
        )}

        <div className="flex justify-between items-center pt-2">
          <button
            onClick={() => setShowHints(!showHints)}
            className="text-xs text-purple-400 hover:text-purple-300 font-pixel flex items-center gap-1 px-3 py-1.5 bg-purple-950/30 rounded-full border border-purple-900/50 hover:bg-purple-900/30 transition-colors"
          >
            <Lightbulb className="w-3 h-3" />
            {showHints ? "Hide Hints" : "Show Hints"}
          </button>
        </div>

        {showHints && <HintSystem hints={puzzle.hints || []} />}
      </div>

      {/* Character dialogue popup */}
      {showCharacterDialogue && (
        <CharacterDialoguePopup
          character={character}
          dialogue={characterDialogue}
          onClose={handleCloseCharacterDialogue}
        />
      )}
    </div>
  )
}
