import type React from "react"
import type { Puzzle } from "@/types/puzzle"
import PuzzleImage from "./puzzle-image"
import InmatePuzzle from "./inmate-puzzle"
import LibraryPuzzle from "./library-puzzle"
import ParrotPuzzle from "./parrot-puzzle"
import CoffeeGroundsPuzzle from "./coffee-grounds-puzzle"
import QuestionnairePuzzle from "./questionnaire-puzzle"
import CrystalJigsawPuzzle from "./crystal-jigsaw-puzzle"
import CrocodileJigsawPuzzle from "./crocodile-jigsaw-puzzle"
import JigsawPuzzle from "./jigsaw-puzzle"
import ZodiacPuzzle from "./zodiac-puzzle"
import TarotPuzzle from "./tarot-puzzle"
import AnimatedGifPuzzle from "./animated-gif-puzzle"
import FamiliarFacesPuzzle from "./familiar-faces-puzzle"
import HellJigsawPuzzle from "./hell-jigsaw-puzzle"
import FinalJigsawPuzzle from "./final-jigsaw-puzzle"
import LightSwitchPuzzle from "./light-switch-puzzle"
import FinalLevelPuzzle from "./final-level-puzzle"
import InfernalCasinoPuzzle from "./infernal-casino-puzzle"
import EgyptianPillarsPuzzle from "./egyptian-pillars-puzzle"
import PyramidPuzzle from "./pyramid-puzzle"
import EgyptianMathPuzzle from "./egyptian-math-puzzle"
import DarkRoomPuzzle from "./dark-room-puzzle"
import MouthOfTruthPuzzle from "./mouth-of-truth-puzzle"
import BinarySwitchPuzzle from "./binary-switch-puzzle"
import FireMapPuzzle from "./fire-map-puzzle"
import GoldenScarabPuzzle from "./golden-scarab-puzzle"

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
  // Function to handle when the Golden Scarab puzzle is solved
  const handleScarabPuzzleSolve = () => {
    // This will be handled by the parent component (game-screen.tsx)
    // We'll dispatch a custom event that game-screen.tsx can listen for
    const event = new CustomEvent("scarabPuzzleSolved", { detail: { level } })
    window.dispatchEvent(event)
  }

  // Render the appropriate puzzle component based on the puzzle type
  if (puzzle.isPuzzleImage) {
    return <PuzzleImage level={level} />
  } else if (puzzle.isInteractiveInmates) {
    return (
      <InmatePuzzle
        inmateData={puzzle.inmateData || []}
        guardStatement={puzzle.guardStatement || ""}
        guardDialogIndex={guardDialogIndex}
        onGuardClick={handleGuardClick}
      />
    )
  } else if (puzzle.isLibraryPuzzle) {
    return <LibraryPuzzle onSolve={() => {}} />
  } else if (puzzle.isParrotPuzzle) {
    return <ParrotPuzzle onSolve={handleParrotSolve} />
  } else if (puzzle.isCoffeeGroundsPuzzle) {
    return <CoffeeGroundsPuzzle />
  } else if (puzzle.isQuestionnairePuzzle) {
    return (
      <QuestionnairePuzzle
        ref={questionnaireRef}
        onRestart={handleQuestionnaireRestart}
        onSolutionGenerated={onSolutionGenerated}
      />
    )
  } else if (puzzle.isCrystalJigsawPuzzle) {
    return <CrystalJigsawPuzzle onComplete={handleJigsawComplete} />
  } else if (puzzle.isCrocodileJigsawPuzzle) {
    return <CrocodileJigsawPuzzle onComplete={handleJigsawComplete} />
  } else if (puzzle.isJigsawPuzzle) {
    return <JigsawPuzzle onComplete={handleJigsawComplete} />
  } else if (puzzle.isZodiacPuzzle) {
    return <ZodiacPuzzle onSolve={handleZodiacSolve} />
  } else if (puzzle.isTarotPuzzle) {
    return <TarotPuzzle />
  } else if (puzzle.isAnimatedGifPuzzle) {
    return <AnimatedGifPuzzle />
  } else if (puzzle.isFamiliarFacesPuzzle) {
    return <FamiliarFacesPuzzle />
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
  } else if (puzzle.isEgyptianMathPuzzle) {
    return <EgyptianMathPuzzle />
  } else if (puzzle.isDarkRoomPuzzle) {
    return <DarkRoomPuzzle />
  } else if (puzzle.isMouthOfTruth) {
    return <MouthOfTruthPuzzle />
  } else if (puzzle.isBinarySwitchPuzzle) {
    return <BinarySwitchPuzzle onCorrectCombinationsChange={setBinaryCorrectCombinations} />
  } else if (puzzle.isFireMapPuzzle) {
    return <FireMapPuzzle />
  } else if (puzzle.isGoldenScarabPuzzle) {
    return <GoldenScarabPuzzle onSolve={handleScarabPuzzleSolve} />
  } else {
    // Default case: just show the puzzle description
    return (
      <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-800 shadow-lg mb-4">
        <p className="text-purple-200 font-pixel text-sm">{puzzle.description}</p>
      </div>
    )
  }
}
