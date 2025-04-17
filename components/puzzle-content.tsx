"use client"

// Update the puzzle-content.tsx file to include the GoldenScarabPuzzle component

import { useState } from "react"
import type { Puzzle } from "@/types/puzzle"
import PuzzleImage from "./puzzle-image"
import AnswerInput from "./answer-input"
import LibraryPuzzle from "./library-puzzle"
import InmatePuzzle from "./inmate-puzzle"
import ParrotPuzzle from "./parrot-puzzle"
import CoffeeGroundsPuzzle from "./coffee-grounds-puzzle"
import QuestionnairePuzzle from "./questionnaire-puzzle"
import TarotPuzzle from "./tarot-puzzle"
import AnimatedGifPuzzle from "./animated-gif-puzzle"
import ZodiacPuzzle from "./zodiac-puzzle"
import FamiliarFacesPuzzle from "./familiar-faces-puzzle"
import JigsawPuzzle from "./jigsaw-puzzle"
import CrystalJigsawPuzzle from "./crystal-jigsaw-puzzle"
import CrystalSequencePuzzle from "./crystal-sequence-puzzle"
import HellJigsawPuzzle from "./hell-jigsaw-puzzle"
import CrocodileJigsawPuzzle from "./crocodile-jigsaw-puzzle"
import MouthOfTruthPuzzle from "./mouth-of-truth-puzzle"
import BinarySwitchPuzzle from "./binary-switch-puzzle"
import ElevatorPanel from "./elevator-panel"
import FinalJigsawPuzzle from "./final-jigsaw-puzzle"
import LightSwitchPuzzle from "./light-switch-puzzle"
import FinalLevelPuzzle from "./final-level-puzzle"
import InfernalCasinoPuzzle from "./infernal-casino-puzzle"
import EgyptianPillarsPuzzle from "./egyptian-pillars-puzzle"
import EgyptianMathPuzzle from "./egyptian-math-puzzle"
import DarkRoomPuzzle from "./dark-room-puzzle"
import PyramidPuzzle from "./pyramid-puzzle"
import FireMapPuzzle from "./fire-map-puzzle"
import GoldenScarabPuzzle from "./puzzles/golden-scarab-puzzle"

export default function PuzzleContent({
  puzzle,
  onSolve,
}: {
  puzzle: Puzzle
  onSolve: (solution: string) => void
}) {
  const [showInput, setShowInput] = useState(true)

  if (puzzle.isLibraryPuzzle) {
    return <LibraryPuzzle onSolve={onSolve} />
  }

  if (puzzle.isInmatePuzzle) {
    return <InmatePuzzle onSolve={onSolve} />
  }

  if (puzzle.isParrotPuzzle) {
    return <ParrotPuzzle onSolve={onSolve} />
  }

  if (puzzle.isCoffeeGroundsPuzzle) {
    return <CoffeeGroundsPuzzle onSolve={onSolve} />
  }

  if (puzzle.isQuestionnairePuzzle) {
    return <QuestionnairePuzzle onSolve={onSolve} />
  }

  if (puzzle.isTarotPuzzle) {
    return <TarotPuzzle onSolve={onSolve} />
  }

  if (puzzle.isAnimatedGifPuzzle) {
    return <AnimatedGifPuzzle onSolve={onSolve} />
  }

  if (puzzle.isZodiacPuzzle) {
    return <ZodiacPuzzle onSolve={onSolve} />
  }

  if (puzzle.isFamiliarFacesPuzzle) {
    return <FamiliarFacesPuzzle onSolve={onSolve} />
  }

  if (puzzle.isJigsawPuzzle) {
    return <JigsawPuzzle onSolve={onSolve} />
  }

  if (puzzle.isCrystalJigsawPuzzle) {
    return <CrystalJigsawPuzzle onSolve={onSolve} />
  }

  if (puzzle.isCrystalSequencePuzzle) {
    return <CrystalSequencePuzzle onSolve={onSolve} />
  }

  if (puzzle.isHellJigsawPuzzle) {
    return <HellJigsawPuzzle onSolve={onSolve} />
  }

  if (puzzle.isCrocodileJigsawPuzzle) {
    return <CrocodileJigsawPuzzle onSolve={onSolve} />
  }

  if (puzzle.isMouthOfTruthPuzzle) {
    return <MouthOfTruthPuzzle onSolve={onSolve} />
  }

  if (puzzle.isBinarySwitchPuzzle) {
    return <BinarySwitchPuzzle onSolve={onSolve} />
  }

  if (puzzle.isElevatorPuzzle) {
    return <ElevatorPanel onSolve={onSolve} />
  }

  if (puzzle.isFinalJigsawPuzzle) {
    return <FinalJigsawPuzzle onSolve={onSolve} />
  }

  if (puzzle.isLightSwitchPuzzle) {
    return <LightSwitchPuzzle onSolve={onSolve} />
  }

  if (puzzle.isFinalLevelPuzzle) {
    return <FinalLevelPuzzle onSolve={onSolve} />
  }

  if (puzzle.isInfernalCasinoPuzzle) {
    return <InfernalCasinoPuzzle onSolve={onSolve} />
  }

  if (puzzle.isEgyptianPillarsPuzzle) {
    return <EgyptianPillarsPuzzle onSolve={onSolve} />
  }

  if (puzzle.isEgyptianMathPuzzle) {
    return <EgyptianMathPuzzle onSolve={onSolve} />
  }

  if (puzzle.isDarkRoomPuzzle) {
    return <DarkRoomPuzzle onSolve={onSolve} />
  }

  if (puzzle.isPyramidPuzzle) {
    return <PyramidPuzzle onSolve={onSolve} />
  }

  if (puzzle.isFireMapPuzzle) {
    return <FireMapPuzzle onSolve={onSolve} />
  }

  if (puzzle.isGoldenScarabPuzzle) {
    return <GoldenScarabPuzzle onSolve={onSolve} />
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      {puzzle.isPuzzleImage ? (
        <PuzzleImage level={puzzle.level} />
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold mb-2">{puzzle.question}</h2>
            <p className="whitespace-pre-line">{puzzle.description}</p>
          </div>
          {puzzle.imageUrl && (
            <div className="my-4">
              <img
                src={puzzle.imageUrl || "/placeholder.svg"}
                alt={`Puzzle ${puzzle.level}`}
                className="max-w-full max-h-[50vh] object-contain"
              />
            </div>
          )}
        </div>
      )}
      {showInput && <AnswerInput onSubmit={onSolve} />}
    </div>
  )
}
