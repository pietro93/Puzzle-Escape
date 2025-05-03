"use client"
import InmatePuzzle from "./inmate-puzzle"
import LibraryPuzzle from "./library-puzzle"
import JigsawPuzzle from "./jigsaw-puzzle"
import ParrotPuzzle from "./parrot-puzzle"
import AnimatedGifPuzzle from "./animated-gif-puzzle"
import LightSwitchPuzzle from "./light-switch-puzzle"
import TarotPuzzle from "./tarot-puzzle"
import QuestionnairePuzzle from "./questionnaire-puzzle"
import CoffeeGroundsPuzzle from "./coffee-grounds-puzzle"
import ZodiacPuzzle from "./zodiac-puzzle"
import CrystalJigsawPuzzle from "./crystal-jigsaw-puzzle"
import CrocodileJigsawPuzzle from "./crocodile-jigsaw-puzzle"
import PyramidPuzzle from "./pyramid-puzzle"
import FamiliarFacesPuzzle from "./familiar-faces-puzzle"
import HellJigsawPuzzle from "./hell-jigsaw-puzzle"
import CrystalSequencePuzzle from "./crystal-sequence-puzzle"
import FinalLevelPuzzle from "./final-level-puzzle"
import InfernalCasinoPuzzle from "./infernal-casino-puzzle"
import EgyptianPillarsPuzzle from "./egyptian-pillars-puzzle"
import DarkRoomPuzzle from "./dark-room-puzzle"
import EgyptianMathPuzzle from "./egyptian-math-puzzle"
import MouthOfTruthPuzzle from "./mouth-of-truth-puzzle"
import BinarySwitchPuzzle from "./binary-switch-puzzle"
import { useState } from "react"
import FireMapPuzzle from "./fire-map-puzzle"
import ColorPalettePuzzle from "./color-palette-puzzle"
import MurderMysteryPuzzle from "./murder-mystery-puzzle"
import GoldenScarabPuzzle from "./golden-scarab-puzzle"
import PyramidOfHanoiPuzzle from "./pyramid-of-hanoi-puzzle"
import MagicBoxPuzzle from "./magic-box-puzzle"
import type { Puzzle } from "@/types/puzzle"
import AnswerInput from "./answer-input"
import PuzzleImage from "./puzzle-image"
import DevilDialogue from "./devil-dialogue"
import ElevatorPanel from "./elevator-panel"
import FinalJigsawPuzzle from "./final-jigsaw-puzzle"

interface PuzzleContentProps {
  puzzle: Puzzle
  onSolve: () => void
}

export default function PuzzleContent({ puzzle, onSolve }: PuzzleContentProps) {
  const [showInput, setShowInput] = useState(false)

  const handleSpecialPuzzleSolve = () => {
    if (puzzle.isAnswerInput) {
      setShowInput(true)
    } else {
      onSolve()
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      {puzzle.isInmatePuzzle && <InmatePuzzle onSolve={handleSpecialPuzzleSolve} />}
      {puzzle.isLibraryPuzzle && <LibraryPuzzle onSolve={handleSpecialPuzzleSolve} />}
      {puzzle.isTarotPuzzle && <TarotPuzzle onSolve={handleSpecialPuzzleSolve} />}
      {puzzle.isAnimatedGifPuzzle && <AnimatedGifPuzzle onSolve={handleSpecialPuzzleSolve} />}
      {puzzle.isZodiacPuzzle && <ZodiacPuzzle onSolve={handleSpecialPuzzleSolve} />}
      {puzzle.isParrotPuzzle && <ParrotPuzzle onSolve={handleSpecialPuzzleSolve} />}
      {puzzle.isCoffeeGroundsPuzzle && <CoffeeGroundsPuzzle onSolve={handleSpecialPuzzleSolve} />}
      {puzzle.isQuestionnairePuzzle && <QuestionnairePuzzle onSolve={handleSpecialPuzzleSolve} />}
      {puzzle.isCrystalJigsawPuzzle && <CrystalJigsawPuzzle onSolve={handleSpecialPuzzleSolve} />}
      {puzzle.isCrocodileJigsawPuzzle && <CrocodileJigsawPuzzle onSolve={handleSpecialPuzzleSolve} />}
      {puzzle.isHellJigsawPuzzle && <HellJigsawPuzzle onSolve={handleSpecialPuzzleSolve} />}
      {puzzle.isFamiliarFacesPuzzle && <FamiliarFacesPuzzle onSolve={handleSpecialPuzzleSolve} />}
      {puzzle.isJigsawPuzzle && <JigsawPuzzle onSolve={handleSpecialPuzzleSolve} />}
      {puzzle.isCrystalSequencePuzzle && <CrystalSequencePuzzle onSolve={handleSpecialPuzzleSolve} />}
      {puzzle.isDevilDialogue && <DevilDialogue onSolve={handleSpecialPuzzleSolve} />}
      {puzzle.isElevatorPanel && <ElevatorPanel onSolve={handleSpecialPuzzleSolve} />}
      {puzzle.isFinalJigsawPuzzle && <FinalJigsawPuzzle onSolve={handleSpecialPuzzleSolve} />}
      {puzzle.isLightSwitchPuzzle && <LightSwitchPuzzle onSolve={handleSpecialPuzzleSolve} />}
      {puzzle.isFinalLevelPuzzle && <FinalLevelPuzzle onSolve={handleSpecialPuzzleSolve} />}
      {puzzle.isInfernalCasinoPuzzle && <InfernalCasinoPuzzle onSolve={handleSpecialPuzzleSolve} />}
      {puzzle.isEgyptianPillarsPuzzle && <EgyptianPillarsPuzzle onSolve={handleSpecialPuzzleSolve} />}
      {puzzle.isPyramidPuzzle && <PyramidPuzzle onSolve={handleSpecialPuzzleSolve} />}
      {puzzle.isMouthOfTruthPuzzle && <MouthOfTruthPuzzle onSolve={handleSpecialPuzzleSolve} />}
      {puzzle.isBinarySwitchPuzzle && <BinarySwitchPuzzle onSolve={handleSpecialPuzzleSolve} />}
      {puzzle.isEgyptianMathPuzzle && <EgyptianMathPuzzle onSolve={handleSpecialPuzzleSolve} />}
      {puzzle.isDarkRoomPuzzle && <DarkRoomPuzzle onSolve={handleSpecialPuzzleSolve} />}
      {puzzle.isColorPalettePuzzle && <ColorPalettePuzzle onSolve={handleSpecialPuzzleSolve} />}
      {puzzle.isMurderMysteryPuzzle && <MurderMysteryPuzzle onSolve={handleSpecialPuzzleSolve} />}
      {puzzle.isGoldenScarabPuzzle && <GoldenScarabPuzzle onSolve={handleSpecialPuzzleSolve} />}
      {puzzle.isPyramidOfHanoiPuzzle && <PyramidOfHanoiPuzzle onSolve={handleSpecialPuzzleSolve} />}
      {puzzle.isFireMapPuzzle && <FireMapPuzzle onSolve={handleSpecialPuzzleSolve} />}
      {puzzle.isMagicBoxPuzzle && <MagicBoxPuzzle onSolve={handleSpecialPuzzleSolve} />}

      {!puzzle.isInmatePuzzle &&
        !puzzle.isLibraryPuzzle &&
        !puzzle.isTarotPuzzle &&
        !puzzle.isAnimatedGifPuzzle &&
        !puzzle.isZodiacPuzzle &&
        !puzzle.isParrotPuzzle &&
        !puzzle.isCoffeeGroundsPuzzle &&
        !puzzle.isQuestionnairePuzzle &&
        !puzzle.isCrystalJigsawPuzzle &&
        !puzzle.isCrocodileJigsawPuzzle &&
        !puzzle.isHellJigsawPuzzle &&
        !puzzle.isFamiliarFacesPuzzle &&
        !puzzle.isJigsawPuzzle &&
        !puzzle.isCrystalSequencePuzzle &&
        !puzzle.isDevilDialogue &&
        !puzzle.isElevatorPanel &&
        !puzzle.isFinalJigsawPuzzle &&
        !puzzle.isLightSwitchPuzzle &&
        !puzzle.isFinalLevelPuzzle &&
        !puzzle.isInfernalCasinoPuzzle &&
        !puzzle.isEgyptianPillarsPuzzle &&
        !puzzle.isPyramidPuzzle &&
        !puzzle.isMouthOfTruthPuzzle &&
        !puzzle.isBinarySwitchPuzzle &&
        !puzzle.isEgyptianMathPuzzle &&
        !puzzle.isDarkRoomPuzzle &&
        !puzzle.isColorPalettePuzzle &&
        !puzzle.isMurderMysteryPuzzle &&
        !puzzle.isGoldenScarabPuzzle &&
        !puzzle.isPyramidOfHanoiPuzzle &&
        !puzzle.isFireMapPuzzle &&
        !puzzle.isMagicBoxPuzzle && (
          <>
            <PuzzleImage puzzleId={puzzle.id} />
            <AnswerInput puzzle={puzzle} onCorrectAnswer={onSolve} />
          </>
        )}

      {showInput && <AnswerInput puzzle={puzzle} onCorrectAnswer={onSolve} />}
    </div>
  )
}
