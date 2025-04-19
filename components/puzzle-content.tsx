"use client"
import type { Puzzle } from "@/types/puzzle"
import PuzzleImage from "./puzzle-image"
import InmatePuzzle from "./inmate-puzzle"
import LightSwitchPuzzle from "./light-switch-puzzle"
import LibraryPuzzle from "./library-puzzle"
import ParrotPuzzle from "./parrot-puzzle"
import JigsawPuzzle from "./jigsaw-puzzle"
import QuestionnairePuzzle from "./questionnaire-puzzle"
import TarotPuzzle from "./tarot-puzzle"
import ZodiacPuzzle from "./zodiac-puzzle"
import CrystalJigsawPuzzle from "./crystal-jigsaw-puzzle"
import CrystalSequencePuzzle from "./crystal-sequence-puzzle"
import CrocodileJigsawPuzzle from "./crocodile-jigsaw-puzzle"
import AnimatedGifPuzzle from "./animated-gif-puzzle"
import CoffeeGroundsPuzzle from "./coffee-grounds-puzzle"
import FamiliarFacesPuzzle from "./familiar-faces-puzzle"
import PyramidPuzzle from "./pyramid-puzzle"
import EgyptianPillarsPuzzle from "./egyptian-pillars-puzzle"
import EgyptianMathPuzzle from "./egyptian-math-puzzle"
import DarkRoomPuzzle from "./dark-room-puzzle"
import HellJigsawPuzzle from "./hell-jigsaw-puzzle"
import FinalJigsawPuzzle from "./final-jigsaw-puzzle"
import BinarySwitchPuzzle from "./binary-switch-puzzle"
import FinalLevelPuzzle from "./final-level-puzzle"
import InfernalCasinoPuzzle from "./infernal-casino-puzzle"
import FireMapPuzzle from "./fire-map-puzzle"
import MouthOfTruthPuzzle from "./mouth-of-truth-puzzle"
import ColorPalettePuzzle from "./color-palette-puzzle"

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
  setBinaryCorrectCombinations: (count: number) => void
  questionnaireRef: any
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
  // Render the appropriate puzzle component based on the puzzle type
  const renderPuzzleComponent = () => {
    if (puzzle.isInteractiveInmates) {
      return (
        <InmatePuzzle
          guardDialogIndex={guardDialogIndex}
          onGuardClick={handleGuardClick}
          guardStatement={puzzle.guardStatement || ""}
        />
      )
    } else if (puzzle.isLightSwitchPuzzle) {
      return <LightSwitchPuzzle onUpdate={handleLightSwitchUpdate} />
    } else if (puzzle.isLibraryPuzzle) {
      return <LibraryPuzzle libraryData={puzzle.libraryData} />
    } else if (puzzle.isParrotPuzzle) {
      return <ParrotPuzzle onSolve={handleParrotSolve} />
    } else if (puzzle.isJigsawPuzzle) {
      return <JigsawPuzzle onComplete={handleJigsawComplete} level={level} />
    } else if (puzzle.isQuestionnairePuzzle) {
      return (
        <QuestionnairePuzzle
          ref={questionnaireRef}
          onRestart={handleQuestionnaireRestart}
          onSolutionGenerated={onSolutionGenerated}
        />
      )
    } else if (puzzle.isTarotPuzzle) {
      return <TarotPuzzle />
    } else if (puzzle.isZodiacPuzzle) {
      return <ZodiacPuzzle onSolve={handleZodiacSolve} />
    } else if (puzzle.isCrystalJigsawPuzzle) {
      return <CrystalJigsawPuzzle onComplete={handleJigsawComplete} />
    } else if (puzzle.isCrystalSequencePuzzle) {
      return <CrystalSequencePuzzle />
    } else if (puzzle.isCrocodileJigsawPuzzle) {
      return <CrocodileJigsawPuzzle onComplete={handleJigsawComplete} />
    } else if (puzzle.isAnimatedGifPuzzle) {
      return <AnimatedGifPuzzle />
    } else if (puzzle.isCoffeeGroundsPuzzle) {
      return <CoffeeGroundsPuzzle />
    } else if (puzzle.isFamiliarFacesPuzzle) {
      return <FamiliarFacesPuzzle />
    } else if (puzzle.isPyramidPuzzle) {
      return (
        <PyramidPuzzle
          onRoomChange={handlePyramidRoomChange}
          onTorchAcquired={handlePyramidTorchAcquired}
          currentRoom={currentPyramidRoom}
          hasTorch={hasPyramidTorch}
        />
      )
    } else if (puzzle.isEgyptianPillarsPuzzle) {
      return <EgyptianPillarsPuzzle />
    } else if (puzzle.isEgyptianMathPuzzle) {
      return <EgyptianMathPuzzle />
    } else if (puzzle.isDarkRoomPuzzle) {
      return <DarkRoomPuzzle />
    } else if (puzzle.isHellJigsawPuzzle) {
      return <HellJigsawPuzzle onComplete={handleJigsawComplete} />
    } else if (puzzle.isFinalJigsawPuzzle) {
      return <FinalJigsawPuzzle onComplete={handleJigsawComplete} onAllPiecesRemoved={handleAllPiecesRemoved} />
    } else if (puzzle.isBinarySwitchPuzzle) {
      return <BinarySwitchPuzzle onCorrectCombinationsChange={setBinaryCorrectCombinations} />
    } else if (puzzle.isFinalLevelPuzzle) {
      return (
        <FinalLevelPuzzle
          onElevatorPanelOpen={handleElevatorPanelOpen}
          currentFloor={currentElevatorFloor}
          setCurrentFloor={setCurrentElevatorFloor}
        />
      )
    } else if (puzzle.isInfernalCasinoPuzzle) {
      return <InfernalCasinoPuzzle />
    } else if (puzzle.isFireMapPuzzle) {
      return <FireMapPuzzle />
    } else if (puzzle.isMouthOfTruthPuzzle) {
      return <MouthOfTruthPuzzle />
    } else if (puzzle.isColorPalettePuzzle) {
      return <ColorPalettePuzzle onSolve={() => {}} />
    } else if (puzzle.imageUrl) {
      return <PuzzleImage imageUrl={puzzle.imageUrl} />
    } else {
      return null
    }
  }

  return (
    <div className="my-4 flex flex-col items-center">
      {/* Puzzle question */}
      {puzzle.question && (
        <div className="mb-4 p-3 bg-gray-800/80 rounded-lg border border-gray-700 w-full text-center">
          <p className="text-purple-200 font-pixel">{puzzle.question}</p>
        </div>
      )}

      {/* Puzzle description */}
      {puzzle.description && (
        <div className="mb-4 p-3 bg-gray-800/80 rounded-lg border border-gray-700 w-full">
          <p className="text-gray-300 font-pixel whitespace-pre-line">{puzzle.description}</p>
        </div>
      )}

      {/* Puzzle component */}
      <div className="w-full">{renderPuzzleComponent()}</div>
    </div>
  )
}
