// Let's examine how puzzle content is rendered
// This will help us understand how images are being displayed in puzzles

import type React from "react"
import type { Puzzle } from "@/types/puzzle"
import InmatesPuzzle from "./inmate-puzzle"
import LibraryPuzzle from "./library-puzzle"
import JigsawPuzzle from "./jigsaw-puzzle"
import TarotPuzzle from "./tarot-puzzle"
import AnimatedGifPuzzle from "./animated-gif-puzzle"
import CoffeeGroundsPuzzle from "./coffee-grounds-puzzle"
import QuestionnairePuzzle from "./questionnaire-puzzle"
import CrystalJigsawPuzzle from "./crystal-jigsaw-puzzle"
import CrocodileJigsawPuzzle from "./crocodile-jigsaw-puzzle"
import ZodiacPuzzle from "./zodiac-puzzle"
import CrystalSequencePuzzle from "./crystal-sequence-puzzle"
import HellJigsawPuzzle from "./hell-jigsaw-puzzle"
import FinalJigsawPuzzle from "./final-jigsaw-puzzle"
import LightSwitchPuzzle from "./light-switch-puzzle"
import FinalLevelPuzzle from "./final-level-puzzle"
import InfernalCasinoPuzzle from "./infernal-casino-puzzle"
import EgyptianPillarsPuzzle from "./egyptian-pillars-puzzle"
import PyramidPuzzle from "./pyramid-puzzle"
import MouthOfTruthPuzzle from "./mouth-of-truth-puzzle"
import BinarySwitchPuzzle from "./binary-switch-puzzle"
import EgyptianMathPuzzle from "./egyptian-math-puzzle"
import DarkRoomPuzzle from "./dark-room-puzzle"
import ColorPalettePuzzle from "./color-palette-puzzle"
import ParrotPuzzle from "./parrot-puzzle"
import FamiliarFacesPuzzle from "./familiar-faces-puzzle"
import FireMapPuzzle from "./fire-map-puzzle"
import InfernalChessPuzzle from "./infernal-chess-puzzle"
import PuzzleImage from "./puzzle-image"

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
  onSolutionGenerated: (solution: string) => void
  setBinaryCorrectCombinations: (count: number) => void
  questionnaireRef: React.RefObject<any>
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
        <InmatesPuzzle
          guardStatement={puzzle.guardStatement || ""}
          inmateStatements={puzzle.inmateStatements || []}
          guardDialogIndex={guardDialogIndex}
          onGuardClick={handleGuardClick}
        />
      )
    } else if (puzzle.isLibraryPuzzle) {
      return <LibraryPuzzle />
    } else if (puzzle.isJigsawPuzzle) {
      return <JigsawPuzzle onComplete={handleJigsawComplete} />
    } else if (puzzle.isTarotPuzzle) {
      return <TarotPuzzle />
    } else if (puzzle.isAnimatedGifPuzzle) {
      return <AnimatedGifPuzzle />
    } else if (puzzle.isCoffeeGroundsPuzzle) {
      return <CoffeeGroundsPuzzle />
    } else if (puzzle.isQuestionnairePuzzle) {
      return (
        <QuestionnairePuzzle
          ref={questionnaireRef}
          onSolutionGenerated={onSolutionGenerated}
          onRestart={handleQuestionnaireRestart}
        />
      )
    } else if (puzzle.isCrystalJigsawPuzzle) {
      return <CrystalJigsawPuzzle onComplete={handleJigsawComplete} />
    } else if (puzzle.isCrocodileJigsawPuzzle) {
      return <CrocodileJigsawPuzzle onComplete={handleJigsawComplete} />
    } else if (puzzle.isZodiacPuzzle) {
      return <ZodiacPuzzle onSolve={handleZodiacSolve} />
    } else if (puzzle.isCrystalSequencePuzzle) {
      return <CrystalSequencePuzzle />
    } else if (puzzle.isHellJigsawPuzzle) {
      return <HellJigsawPuzzle onComplete={handleJigsawComplete} />
    } else if (puzzle.isFinalJigsawPuzzle) {
      return <FinalJigsawPuzzle onComplete={handleJigsawComplete} />
    } else if (puzzle.isLightSwitchPuzzle) {
      return <LightSwitchPuzzle onUpdate={handleLightSwitchUpdate} />
    } else if (puzzle.isFinalLevelPuzzle) {
      return (
        <FinalLevelPuzzle
          onAllPiecesRemoved={handleAllPiecesRemoved}
          onElevatorPanelOpen={handleElevatorPanelOpen}
          currentElevatorFloor={currentElevatorFloor}
        />
      )
    } else if (puzzle.isInfernalCasinoPuzzle) {
      return <InfernalCasinoPuzzle />
    } else if (puzzle.isEgyptianPillarsPuzzle) {
      return <EgyptianPillarsPuzzle />
    } else if (puzzle.isPyramidPuzzle) {
      return (
        <PyramidPuzzle
          onRoomChange={handlePyramidRoomChange}
          onTorchAcquired={handlePyramidTorchAcquired}
          currentRoom={currentPyramidRoom}
          hasTorch={hasPyramidTorch}
        />
      )
    } else if (puzzle.isMouthOfTruthPuzzle) {
      return <MouthOfTruthPuzzle />
    } else if (puzzle.isBinarySwitchPuzzle) {
      return <BinarySwitchPuzzle onCorrectCombinationsChange={setBinaryCorrectCombinations} />
    } else if (puzzle.isEgyptianMathPuzzle) {
      return <EgyptianMathPuzzle />
    } else if (puzzle.isDarkRoomPuzzle) {
      return <DarkRoomPuzzle />
    } else if (puzzle.isColorPalettePuzzle) {
      return <ColorPalettePuzzle />
    } else if (puzzle.isParrotPuzzle) {
      return <ParrotPuzzle onSolve={handleParrotSolve} />
    } else if (puzzle.isFamiliarFacesPuzzle) {
      return <FamiliarFacesPuzzle />
    } else if (puzzle.isFireMapPuzzle) {
      return <FireMapPuzzle />
    } else if (puzzle.isInfernalChessPuzzle) {
      return <InfernalChessPuzzle />
    } else if (puzzle.component) {
      const CustomComponent = puzzle.component
      return <CustomComponent />
    } else {
      // Default case: show the puzzle question and image if available
      return (
        <div className="flex flex-col items-center justify-center space-y-4 p-4">
          <div className="text-center font-pixel text-gray-300 text-sm mb-4">{puzzle.description}</div>
          {puzzle.imageUrl && (
            <div className="relative w-full max-w-xs mx-auto">
              <PuzzleImage
                src={puzzle.imageUrl}
                alt={`Puzzle ${level}`}
                className="pixelated rounded-lg border-2 border-gray-800 shadow-lg"
              />
            </div>
          )}
        </div>
      )
    }
  }

  return (
    <div className="bg-gray-900/70 rounded-lg p-4 mb-4 border border-gray-800 shadow-lg">
      <h2 className="text-lg font-pixel text-purple-300 mb-4 text-center">{puzzle.question}</h2>
      {renderPuzzleComponent()}
    </div>
  )
}
