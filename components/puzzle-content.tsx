"use client"

import { useState } from "react"
import PuzzleImage from "@/components/puzzle-image"
import AnswerInput from "@/components/answer-input"
import LibraryPuzzle from "@/components/library-puzzle"
import InmatePuzzle from "@/components/inmate-puzzle"
import JigsawPuzzle from "@/components/jigsaw-puzzle"
import TarotPuzzle from "@/components/tarot-puzzle"
import AnimatedGifPuzzle from "@/components/animated-gif-puzzle"
import ParrotPuzzle from "@/components/parrot-puzzle"
import CoffeeGroundsPuzzle from "@/components/coffee-grounds-puzzle"
import QuestionnairePuzzle from "@/components/questionnaire-puzzle"
import CrystalJigsawPuzzle from "@/components/crystal-jigsaw-puzzle"
import CrocodileJigsawPuzzle from "@/components/crocodile-jigsaw-puzzle"
import HellJigsawPuzzle from "@/components/hell-jigsaw-puzzle"
import FamiliarFacesPuzzle from "@/components/familiar-faces-puzzle"
import ZodiacPuzzle from "@/components/zodiac-puzzle"
import CrystalSequencePuzzle from "@/components/crystal-sequence-puzzle"
import MouthOfTruthPuzzle from "@/components/mouth-of-truth-puzzle"
import BinarySwitchPuzzle from "@/components/binary-switch-puzzle"
import EgyptianPillarsPuzzle from "@/components/egyptian-pillars-puzzle"
import DarkRoomPuzzle from "@/components/dark-room-puzzle"
import EgyptianMathPuzzle from "@/components/egyptian-math-puzzle"
import PyramidPuzzle from "@/components/pyramid-puzzle"
import FireMapPuzzle from "@/components/fire-map-puzzle"
import GoldenScarabPuzzle from "@/components/golden-scarab-puzzle"
import HintSystem from "@/components/hint-system"
import type { Puzzle } from "@/types/puzzle"

interface PuzzleContentProps {
  puzzle: Puzzle
  onSolve: () => void
}

export default function PuzzleContent({ puzzle, onSolve }: PuzzleContentProps) {
  const [answer, setAnswer] = useState("")
  const [isCorrect, setIsCorrect] = useState(false)
  const [isIncorrect, setIsIncorrect] = useState(false)
  const [showHints, setShowHints] = useState(false)

  const handleAnswerChange = (value: string) => {
    setAnswer(value)
  }

  const handleSubmit = () => {
    const normalizedAnswer = answer.trim().toLowerCase()
    const normalizedSolution = puzzle.solution.toLowerCase()

    const solutions = normalizedSolution.split("|")
    const isCorrectAnswer = solutions.some((solution) => normalizedAnswer === solution.trim())

    if (isCorrectAnswer) {
      setIsCorrect(true)
      setTimeout(() => {
        onSolve()
      }, 1500)
    } else {
      setIsIncorrect(true)
      setTimeout(() => {
        setIsIncorrect(false)
      }, 1500)
    }
  }

  const toggleHints = () => {
    setShowHints(!showHints)
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="w-full max-w-4xl">
        {puzzle.isPuzzleImage && <PuzzleImage level={puzzle.level} />}
        {puzzle.isLibraryPuzzle && <LibraryPuzzle />}
        {puzzle.isInmatePuzzle && <InmatePuzzle />}
        {puzzle.isJigsawPuzzle && <JigsawPuzzle />}
        {puzzle.isTarotPuzzle && <TarotPuzzle />}
        {puzzle.isAnimatedGifPuzzle && <AnimatedGifPuzzle />}
        {puzzle.isParrotPuzzle && <ParrotPuzzle />}
        {puzzle.isCoffeeGroundsPuzzle && <CoffeeGroundsPuzzle />}
        {puzzle.isQuestionnairePuzzle && <QuestionnairePuzzle />}
        {puzzle.isCrystalJigsawPuzzle && <CrystalJigsawPuzzle />}
        {puzzle.isCrocodileJigsawPuzzle && <CrocodileJigsawPuzzle />}
        {puzzle.isHellJigsawPuzzle && <HellJigsawPuzzle />}
        {puzzle.isFamiliarFacesPuzzle && <FamiliarFacesPuzzle />}
        {puzzle.isZodiacPuzzle && <ZodiacPuzzle />}
        {puzzle.isCrystalSequencePuzzle && <CrystalSequencePuzzle />}
        {puzzle.isMouthOfTruthPuzzle && <MouthOfTruthPuzzle />}
        {puzzle.isBinarySwitchPuzzle && <BinarySwitchPuzzle />}
        {puzzle.isEgyptianPillarsPuzzle && <EgyptianPillarsPuzzle />}
        {puzzle.isDarkRoomPuzzle && <DarkRoomPuzzle />}
        {puzzle.isEgyptianMathPuzzle && <EgyptianMathPuzzle />}
        {puzzle.isPyramidPuzzle && <PyramidPuzzle />}
        {puzzle.isFireMapPuzzle && <FireMapPuzzle />}
        {puzzle.isGoldenScarabPuzzle && <GoldenScarabPuzzle />}

        {puzzle.imageUrl && !puzzle.isPuzzleImage && (
          <div className="flex justify-center mb-4">
            <img src={puzzle.imageUrl || "/placeholder.svg"} alt="Puzzle" className="max-w-full max-h-96" />
          </div>
        )}

        <div className="mt-4">
          <AnswerInput
            value={answer}
            onChange={handleAnswerChange}
            onSubmit={handleSubmit}
            isCorrect={isCorrect}
            isIncorrect={isIncorrect}
          />
        </div>

        <div className="mt-4 flex justify-center">
          <button onClick={toggleHints} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md">
            {showHints ? "Hide Hints" : "Show Hints"}
          </button>
        </div>

        {showHints && <HintSystem hints={puzzle.hints} />}
      </div>
    </div>
  )
}
