"use client"
import type { Puzzle } from "@/types/puzzle"
import { useState } from "react"
import InmatePuzzle from "./inmate-puzzle"
import LibraryPuzzle from "./library-puzzle"
import TarotPuzzle from "./tarot-puzzle"
import JigsawPuzzle from "./jigsaw-puzzle"
import ZodiacPuzzle from "./zodiac-puzzle"
import CrystalJigsawPuzzle from "./crystal-jigsaw-puzzle"
import CrocodileJigsawPuzzle from "./crocodile-jigsaw-puzzle"
import ParrotPuzzle from "./parrot-puzzle"
import CoffeeGroundsPuzzle from "./coffee-grounds-puzzle"
import QuestionnairePuzzle from "./questionnaire-puzzle"
import FamiliarFacesPuzzle from "./familiar-faces-puzzle"
import AnimatedGifPuzzle from "./animated-gif-puzzle"
import CrystalSequencePuzzle from "./crystal-sequence-puzzle"
import HellJigsawPuzzle from "./hell-jigsaw-puzzle"
import FinalJigsawPuzzle from "./final-jigsaw-puzzle"
import LightSwitchPuzzle from "./light-switch-puzzle"
import InfernalCasinoPuzzle from "./infernal-casino-puzzle"
import EgyptianPillarsPuzzle from "./egyptian-pillars-puzzle"
import PyramidPuzzle from "./pyramid-puzzle"
import MouthOfTruthPuzzle from "./mouth-of-truth-puzzle"
import BinarySwitchPuzzle from "./binary-switch-puzzle"
import EgyptianMathPuzzle from "./egyptian-math-puzzle"
import DarkRoomPuzzle from "./dark-room-puzzle"
import ColorPalettePuzzle from "./color-palette-puzzle"
import MurderMysteryPuzzle from "./murder-mystery-puzzle"
import GoldenScarabPuzzle from "./golden-scarab-puzzle"
import PyramidOfHanoiPuzzle from "./pyramid-of-hanoi-puzzle"
import FireMapPuzzle from "./fire-map-puzzle"
import MagicBoxPuzzle from "./magic-box-puzzle"
import AnswerInput from "./answer-input"

interface PuzzleContentProps {
  puzzle: Puzzle
  onSolve: () => void
}

export default function PuzzleContent({ puzzle, onSolve }: PuzzleContentProps) {
  const [showHint, setShowHint] = useState(false)

  const renderPuzzle = () => {
    switch (puzzle.type) {
      case "inmate":
        return <InmatePuzzle onSolve={onSolve} />
      case "library":
        return <LibraryPuzzle onSolve={onSolve} />
      case "tarot":
        return <TarotPuzzle onSolve={onSolve} />
      case "jigsaw":
        return <JigsawPuzzle onSolve={onSolve} />
      case "zodiac":
        return <ZodiacPuzzle onSolve={onSolve} />
      case "crystal-jigsaw":
        return <CrystalJigsawPuzzle onSolve={onSolve} />
      case "crocodile-jigsaw":
        return <CrocodileJigsawPuzzle onSolve={onSolve} />
      case "parrot":
        return <ParrotPuzzle onSolve={onSolve} />
      case "coffee-grounds":
        return <CoffeeGroundsPuzzle onSolve={onSolve} />
      case "questionnaire":
        return <QuestionnairePuzzle onSolve={onSolve} />
      case "familiar-faces":
        return <FamiliarFacesPuzzle onSolve={onSolve} />
      case "animated-gif":
        return <AnimatedGifPuzzle onSolve={onSolve} />
      case "crystal-sequence":
        return <CrystalSequencePuzzle onSolve={onSolve} />
      case "hell-jigsaw":
        return <HellJigsawPuzzle onSolve={onSolve} />
      case "final-jigsaw":
        return <FinalJigsawPuzzle onSolve={onSolve} />
      case "light-switch":
        return <LightSwitchPuzzle onSolve={onSolve} />
      case "infernal-casino":
        return <InfernalCasinoPuzzle onSolve={onSolve} />
      case "egyptian-pillars":
        return <EgyptianPillarsPuzzle onSolve={onSolve} />
      case "pyramid":
        return <PyramidPuzzle onSolve={onSolve} />
      case "mouth-of-truth":
        return <MouthOfTruthPuzzle onSolve={onSolve} />
      case "binary-switch":
        return <BinarySwitchPuzzle onSolve={onSolve} />
      case "egyptian-math":
        return <EgyptianMathPuzzle onSolve={onSolve} />
      case "dark-room":
        return <DarkRoomPuzzle onSolve={onSolve} />
      case "color-palette":
        return <ColorPalettePuzzle onSolve={onSolve} />
      case "murder-mystery":
        return <MurderMysteryPuzzle onSolve={onSolve} />
      case "golden-scarab":
        return <GoldenScarabPuzzle onSolve={onSolve} />
      case "pyramid-of-hanoi":
        return <PyramidOfHanoiPuzzle onSolve={onSolve} />
      case "fire-map":
        return <FireMapPuzzle onSolve={onSolve} />
      case "magic-box":
        return <MagicBoxPuzzle onSolve={onSolve} />
      default:
        return <div>Unknown puzzle type</div>
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Title */}
      <h1 className="text-2xl font-pixel text-purple-300 mb-4">{puzzle.title}</h1>

      {/* For magic-box puzzle type, don't show the description */}
      {puzzle.type !== "magic-box" && <p className="text-gray-300 mb-6 text-center max-w-md">{puzzle.description}</p>}

      {/* Puzzle content */}
      <div className="mb-8 w-full flex justify-center">{renderPuzzle()}</div>

      {/* Answer input */}
      <AnswerInput puzzle={puzzle} onSolve={onSolve} />

      {/* Hint button and text */}
      <div className="mt-4 text-center">
        <button
          onClick={() => setShowHint(!showHint)}
          className="text-amber-300 hover:text-amber-100 font-pixel text-sm"
        >
          {showHint ? "Hide Hint" : "Show Hint"}
        </button>
        {showHint && <p className="mt-2 text-amber-200 font-pixel text-sm">{puzzle.hint}</p>}
      </div>
    </div>
  )
}
