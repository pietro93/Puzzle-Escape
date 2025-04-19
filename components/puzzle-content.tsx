"use client"

import Image from "next/image"
import LibraryPuzzle from "./library-puzzle"
import InmatePuzzle from "./inmate-puzzle"
import TarotPuzzle from "./tarot-puzzle"
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
import BinarySwitchPuzzle from "./binary-switch-puzzle"
import InfernalCasinoPuzzle from "./infernal-casino-puzzle"

interface PuzzleContentProps {
  puzzle: any
  onSolve?: () => void
  onWrong?: () => void
  onGuardClick?: () => void
  onLocationClick?: () => void
  onPyramidLocationImageClick?: () => void
}

export default function PuzzleContent({
  puzzle,
  onSolve,
  onWrong,
  onGuardClick,
  onLocationClick,
  onPyramidLocationImageClick,
}: PuzzleContentProps) {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-pixel text-purple-300 mb-4 text-center">{puzzle.question}</h2>
      <p className="text-gray-300 font-pixel text-sm text-center mb-4">{puzzle.description}</p>

      {puzzle.imageUrl && !puzzle.isAnimatedGifPuzzle && (
        <div className="w-full max-w-md relative mb-4">
          <Image
            src={puzzle.imageUrl || "/placeholder.svg"}
            alt="Puzzle Image"
            width={500}
            height={300}
            className="w-full h-auto rounded-lg border-2 border-gray-800 pixelated"
          />
        </div>
      )}

      {puzzle.isAnimatedGifPuzzle && <AnimatedGifPuzzle videoUrl={puzzle.videoUrl} altText="Animated GIF" />}

      {puzzle.isLibraryPuzzle && puzzle.libraryData && <LibraryPuzzle books={puzzle.libraryData.books} />}

      {puzzle.isInmatePuzzle && puzzle.inmateData && (
        <InmatePuzzle inmates={puzzle.inmateData} guardStatement={puzzle.guardStatement} onGuardClick={onGuardClick} />
      )}

      {puzzle.isTarotPuzzle && <TarotPuzzle onSolve={onSolve} />}

      {puzzle.isParrotPuzzle && <ParrotPuzzle onSolve={onSolve} />}

      {puzzle.isCoffeeGroundsPuzzle && <CoffeeGroundsPuzzle onSolve={onSolve} />}

      {puzzle.isQuestionnairePuzzle && <QuestionnairePuzzle onSolve={onSolve} onRestart={() => {}} />}

      {puzzle.isCrystalJigsawPuzzle && <CrystalJigsawPuzzle onComplete={onSolve} />}

      {puzzle.isCrocodileJigsawPuzzle && <CrocodileJigsawPuzzle onComplete={onSolve} />}

      {puzzle.isJigsawPuzzle && <JigsawPuzzle onComplete={onSolve} />}

      {puzzle.isZodiacPuzzle && <ZodiacPuzzle onSolve={onSolve} />}

      {puzzle.isCrystalSequencePuzzle && <CrystalSequencePuzzle onSolve={onSolve} />}

      {puzzle.isHellJigsawPuzzle && <HellJigsawPuzzle onComplete={onSolve} />}

      {puzzle.isFamiliarFacesPuzzle && <FamiliarFacesPuzzle onSolve={onSolve} />}

      {puzzle.isEgyptianMathPuzzle && <EgyptianMathPuzzle onSolve={onSolve} />}

      {puzzle.isEgyptianPillarsPuzzle && <EgyptianPillarsPuzzle />}

      {puzzle.isPyramidPuzzle && <PyramidPuzzle onSolve={onSolve} />}

      {puzzle.isBinarySwitchPuzzle && <BinarySwitchPuzzle onSolve={onSolve} />}

      {puzzle.isInfernalCasinoPuzzle && <InfernalCasinoPuzzle onSolve={onSolve} />}
    </div>
  )
}
