"use client"

import { useEffect, useState } from "react"
import type { Puzzle } from "@/types/puzzle"
import LibraryPuzzle from "./library-puzzle"
import InmatePuzzle from "./inmate-puzzle"
import TarotPuzzle from "./tarot-puzzle"
import ParrotPuzzle from "./parrot-puzzle"
import CoffeeGroundsPuzzle from "./coffee-grounds-puzzle"
import QuestionnairePuzzle from "./questionnaire-puzzle"
import CrystalJigsawPuzzle from "./crystal-jigsaw-puzzle"
import CrocodileJigsawPuzzle from "./crocodile-jigsaw-puzzle"
import JigsawPuzzle from "./jigsaw-puzzle"
import ZodiacPuzzle from "./zodiac-puzzle"
import CrystalSequencePuzzle from "./crystal-sequence-puzzle"
import HellJigsawPuzzle from "./hell-jigsaw-puzzle"
import FamiliarFacesPuzzle from "./familiar-faces-puzzle"
import AnimatedGifPuzzle from "./animated-gif-puzzle"
import EgyptianMathPuzzle from "./egyptian-math-puzzle"
import EgyptianPillarsPuzzle from "./egyptian-pillars-puzzle"
import PyramidPuzzle from "./pyramid-puzzle"
import DarkRoomPuzzle from "./dark-room-puzzle"
import BinarySwitchPuzzle from "./binary-switch-puzzle"
import InfernalCasinoPuzzle from "./infernal-casino-puzzle"
import ElevatorPuzzle from "./elevator-panel"
import FinalJigsawPuzzle from "./final-jigsaw-puzzle"
import LightSwitchPuzzle from "./light-switch-puzzle"
import FinalLevelPuzzle from "./final-level-puzzle"
import DevilDialogue from "./devil-dialogue"
import MouthOfTruthPuzzle from "./mouth-of-truth-puzzle"
import FireMapPuzzle from "./fire-map-puzzle"
import MagicBoxPuzzle from "./magic-box-puzzle"

interface PuzzleContentProps {
  level: number
  puzzle: Puzzle
  guardDialogIndex: number
  handleGuardClick: () => void
  handleJigsawComplete: () => void
  handleParrotSolve: () => void
  handleQuestionnaireRestart: () => void
  handleLightSwitchUpdate: (isLightOn: boolean, isSolved: boolean) => void
  handleZodiacSolve: () => void
  handlePyramidRoomChange: (room: string) => void
  handlePyramidTorchAcquired: () => void
  currentPyramidRoom: string
  hasPyramidTorch: boolean
  handleAllPiecesRemoved: () => void
  handleElevatorPanelOpen: () => void
  currentElevatorFloor: number
  setCurrentElevatorFloor: (floor: number) => void
  onSolutionGenerated?: (solution: string) => void
  setBinaryCorrectCombinations?: (count: number) => void
  questionnaireRef?: any
}

export default function PuzzleContent({
  level,
  puzzle,
  guardDialogIndex,
  handleGuardClick,
  handleJigsawComplete,
  handleParrotSolve,
  handleQuestionnaireRestart,
  handleLightSwitchUpdate,
  handleZodiacSolve,
  handlePyramidRoomChange,
  handlePyramidTorchAcquired,
  currentPyramidRoom,
  hasPyramidTorch,
  handleAllPiecesRemoved,
  handleElevatorPanelOpen,
  currentElevatorFloor,
  setCurrentElevatorFloor,
  onSolutionGenerated,
  setBinaryCorrectCombinations,
  questionnaireRef,
}: PuzzleContentProps) {
  const [showPuzzle, setShowPuzzle] = useState(true)

  useEffect(() => {
    setShowPuzzle(true)
  }, [level])

  if (!showPuzzle) return null

  // Render the appropriate puzzle component based on the puzzle type
  return (
    <div className="my-4">
      {puzzle.isLibraryPuzzle && <LibraryPuzzle />}

      {puzzle.isInmatePuzzle && (
        <InmatePuzzle guardDialogIndex={guardDialogIndex} handleGuardClick={handleGuardClick} />
      )}

      {puzzle.isTarotPuzzle && <TarotPuzzle />}

      {puzzle.isParrotPuzzle && <ParrotPuzzle onSolve={handleParrotSolve} />}

      {puzzle.isCoffeeGroundsPuzzle && <CoffeeGroundsPuzzle />}

      {puzzle.isQuestionnairePuzzle && (
        <QuestionnairePuzzle
          onRestart={handleQuestionnaireRestart}
          onSolutionGenerated={onSolutionGenerated}
          ref={questionnaireRef}
        />
      )}

      {puzzle.isCrystalJigsawPuzzle && <CrystalJigsawPuzzle />}

      {puzzle.isCrocodileJigsawPuzzle && <CrocodileJigsawPuzzle />}

      {puzzle.isJigsawPuzzle && <JigsawPuzzle onComplete={handleJigsawComplete} />}

      {puzzle.isZodiacPuzzle && <ZodiacPuzzle onSolve={handleZodiacSolve} />}

      {puzzle.isCrystalSequencePuzzle && <CrystalSequencePuzzle />}

      {puzzle.isHellJigsawPuzzle && <HellJigsawPuzzle onComplete={handleJigsawComplete} />}

      {puzzle.isFamiliarFacesPuzzle && <FamiliarFacesPuzzle />}

      {puzzle.isAnimatedGifPuzzle && <AnimatedGifPuzzle />}

      {puzzle.isEgyptianMathPuzzle && <EgyptianMathPuzzle />}

      {puzzle.isEgyptianPillarsPuzzle && <EgyptianPillarsPuzzle />}

      {puzzle.isPyramidPuzzle && (
        <PyramidPuzzle
          currentRoom={currentPyramidRoom}
          hasTorch={hasPyramidTorch}
          onRoomChange={handlePyramidRoomChange}
          onTorchAcquired={handlePyramidTorchAcquired}
        />
      )}

      {puzzle.isDarkRoomPuzzle && <DarkRoomPuzzle />}

      {puzzle.isBinarySwitchPuzzle && <BinarySwitchPuzzle onCorrectCombinationsChange={setBinaryCorrectCombinations} />}

      {puzzle.isInfernalCasinoPuzzle && <InfernalCasinoPuzzle />}

      {puzzle.isElevatorPuzzle && <ElevatorPuzzle onClose={() => {}} onFloorSelect={() => {}} currentFloor={0} />}

      {puzzle.isFinalJigsawPuzzle && <FinalJigsawPuzzle onAllPiecesRemoved={handleAllPiecesRemoved} />}

      {puzzle.isLightSwitchPuzzle && <LightSwitchPuzzle onUpdate={handleLightSwitchUpdate} />}

      {puzzle.isFinalLevelPuzzle && (
        <FinalLevelPuzzle onElevatorPanelOpen={handleElevatorPanelOpen} currentFloor={currentElevatorFloor} />
      )}

      {puzzle.isDevilDialogue && <DevilDialogue onClose={() => {}} currentFloor={0} />}

      {puzzle.isMouthOfTruthPuzzle && <MouthOfTruthPuzzle />}

      {puzzle.isFireMapPuzzle && <FireMapPuzzle />}

      {puzzle.isMagicBoxPuzzle && <MagicBoxPuzzle />}

      {/* We'll handle the InfernalChessPuzzle in the game-screen.tsx file */}
    </div>
  )
}
