"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import PuzzleImage from "./puzzle-image"
import AnswerInput from "./answer-input"
import LibraryPuzzle from "./library-puzzle"
import InmatePuzzle from "./inmate-puzzle"
import TarotPuzzle from "./tarot-puzzle"
import JigsawPuzzle from "./jigsaw-puzzle"
import ZodiacPuzzle from "./zodiac-puzzle"
import FamiliarFacesPuzzle from "./familiar-faces-puzzle"
import CrystalJigsawPuzzle from "./crystal-jigsaw-puzzle"
import CrocodileJigsawPuzzle from "./crocodile-jigsaw-puzzle"
import CrystalSequencePuzzle from "./crystal-sequence-puzzle"
import ParrotPuzzle from "./parrot-puzzle"
import CoffeeGroundsPuzzle from "./coffee-grounds-puzzle"
import QuestionnairePuzzle from "./questionnaire-puzzle"
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
import AnimatedGifPuzzle from "./animated-gif-puzzle"
import FireMapPuzzle from "./fire-map-puzzle"
import GoldenScarabPuzzle from "./golden-scarab-puzzle"
import { useAudio } from "@/hooks/use-audio"

interface PuzzleContentProps {
  level: number
  question: string
  description: string
  imageUrl?: string
  isPuzzleImage?: boolean
  isLibraryPuzzle?: boolean
  isInteractiveInmates?: boolean
  isTarotPuzzle?: boolean
  isJigsawPuzzle?: boolean
  isZodiacPuzzle?: boolean
  isFamiliarFacesPuzzle?: boolean
  isCrystalJigsawPuzzle?: boolean
  isCrocodileJigsawPuzzle?: boolean
  isCrystalSequencePuzzle?: boolean
  isParrotPuzzle?: boolean
  isCoffeeGroundsPuzzle?: boolean
  isQuestionnairePuzzle?: boolean
  isHellJigsawPuzzle?: boolean
  isFinalJigsawPuzzle?: boolean
  isLightSwitchPuzzle?: boolean
  isFinalLevelPuzzle?: boolean
  isInfernalCasinoPuzzle?: boolean
  isEgyptianPillarsPuzzle?: boolean
  isPyramidPuzzle?: boolean
  isEgyptianMathPuzzle?: boolean
  isDarkRoomPuzzle?: boolean
  isMouthOfTruthPuzzle?: boolean
  isBinarySwitchPuzzle?: boolean
  isAnimatedGifPuzzle?: boolean
  isFireMapPuzzle?: boolean
  isGoldenScarabPuzzle?: boolean
  inmateData?: any[]
  guardStatement?: string
  onSolve: () => void
}

export default function PuzzleContent({
  level,
  question,
  description,
  imageUrl,
  isPuzzleImage,
  isLibraryPuzzle,
  isInteractiveInmates,
  isTarotPuzzle,
  isJigsawPuzzle,
  isZodiacPuzzle,
  isFamiliarFacesPuzzle,
  isCrystalJigsawPuzzle,
  isCrocodileJigsawPuzzle,
  isCrystalSequencePuzzle,
  isParrotPuzzle,
  isCoffeeGroundsPuzzle,
  isQuestionnairePuzzle,
  isHellJigsawPuzzle,
  isFinalJigsawPuzzle,
  isLightSwitchPuzzle,
  isFinalLevelPuzzle,
  isInfernalCasinoPuzzle,
  isEgyptianPillarsPuzzle,
  isPyramidPuzzle,
  isEgyptianMathPuzzle,
  isDarkRoomPuzzle,
  isMouthOfTruthPuzzle,
  isBinarySwitchPuzzle,
  isAnimatedGifPuzzle,
  isFireMapPuzzle,
  isGoldenScarabPuzzle,
  inmateData,
  guardStatement,
  onSolve,
}: PuzzleContentProps) {
  const [showInput, setShowInput] = useState(true)
  const { playSound } = useAudio()

  useEffect(() => {
    setShowInput(
      !isLibraryPuzzle &&
        !isInteractiveInmates &&
        !isTarotPuzzle &&
        !isJigsawPuzzle &&
        !isZodiacPuzzle &&
        !isFamiliarFacesPuzzle &&
        !isCrystalJigsawPuzzle &&
        !isCrocodileJigsawPuzzle &&
        !isCrystalSequencePuzzle &&
        !isParrotPuzzle &&
        !isCoffeeGroundsPuzzle &&
        !isQuestionnairePuzzle &&
        !isHellJigsawPuzzle &&
        !isFinalJigsawPuzzle &&
        !isLightSwitchPuzzle &&
        !isFinalLevelPuzzle &&
        !isInfernalCasinoPuzzle &&
        !isEgyptianPillarsPuzzle &&
        !isPyramidPuzzle &&
        !isEgyptianMathPuzzle &&
        !isDarkRoomPuzzle &&
        !isMouthOfTruthPuzzle &&
        !isBinarySwitchPuzzle &&
        !isAnimatedGifPuzzle &&
        !isFireMapPuzzle &&
        !isGoldenScarabPuzzle,
    )
  }, [
    isLibraryPuzzle,
    isInteractiveInmates,
    isTarotPuzzle,
    isJigsawPuzzle,
    isZodiacPuzzle,
    isFamiliarFacesPuzzle,
    isCrystalJigsawPuzzle,
    isCrocodileJigsawPuzzle,
    isCrystalSequencePuzzle,
    isParrotPuzzle,
    isCoffeeGroundsPuzzle,
    isQuestionnairePuzzle,
    isHellJigsawPuzzle,
    isFinalJigsawPuzzle,
    isLightSwitchPuzzle,
    isFinalLevelPuzzle,
    isInfernalCasinoPuzzle,
    isEgyptianPillarsPuzzle,
    isPyramidPuzzle,
    isEgyptianMathPuzzle,
    isDarkRoomPuzzle,
    isMouthOfTruthPuzzle,
    isBinarySwitchPuzzle,
    isAnimatedGifPuzzle,
    isFireMapPuzzle,
    isGoldenScarabPuzzle,
  ])

  const handleSolve = () => {
    playSound("correct")
    onSolve()
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {question && <h2 className="text-xl font-pixel text-yellow-500">{question}</h2>}
      {description && <p className="text-gray-300">{description}</p>}

      {isPuzzleImage && <PuzzleImage level={level} onSolve={handleSolve} />}

      {isLibraryPuzzle && <LibraryPuzzle onSolve={handleSolve} />}

      {isInteractiveInmates && inmateData && guardStatement && (
        <InmatePuzzle inmateData={inmateData} guardStatement={guardStatement} onSolve={handleSolve} />
      )}

      {isTarotPuzzle && <TarotPuzzle onSolve={handleSolve} />}

      {isJigsawPuzzle && <JigsawPuzzle onSolve={handleSolve} />}

      {isZodiacPuzzle && <ZodiacPuzzle onSolve={handleSolve} />}

      {isFamiliarFacesPuzzle && <FamiliarFacesPuzzle onSolve={handleSolve} />}

      {isCrystalJigsawPuzzle && <CrystalJigsawPuzzle onSolve={handleSolve} />}

      {isCrocodileJigsawPuzzle && <CrocodileJigsawPuzzle onSolve={handleSolve} />}

      {isCrystalSequencePuzzle && <CrystalSequencePuzzle onSolve={handleSolve} />}

      {isParrotPuzzle && <ParrotPuzzle onSolve={handleSolve} />}

      {isCoffeeGroundsPuzzle && <CoffeeGroundsPuzzle onSolve={handleSolve} />}

      {isQuestionnairePuzzle && <QuestionnairePuzzle onSolve={handleSolve} />}

      {isHellJigsawPuzzle && <HellJigsawPuzzle onSolve={handleSolve} />}

      {isFinalJigsawPuzzle && <FinalJigsawPuzzle onSolve={handleSolve} />}

      {isLightSwitchPuzzle && <LightSwitchPuzzle onSolve={handleSolve} />}

      {isFinalLevelPuzzle && <FinalLevelPuzzle onSolve={handleSolve} />}

      {isInfernalCasinoPuzzle && <InfernalCasinoPuzzle onSolve={handleSolve} />}

      {isEgyptianPillarsPuzzle && <EgyptianPillarsPuzzle onSolve={handleSolve} />}

      {isPyramidPuzzle && <PyramidPuzzle onSolve={handleSolve} />}

      {isEgyptianMathPuzzle && <EgyptianMathPuzzle onSolve={handleSolve} />}

      {isDarkRoomPuzzle && <DarkRoomPuzzle onSolve={handleSolve} />}

      {isMouthOfTruthPuzzle && <MouthOfTruthPuzzle onSolve={handleSolve} />}

      {isBinarySwitchPuzzle && <BinarySwitchPuzzle onSolve={handleSolve} />}

      {isAnimatedGifPuzzle && <AnimatedGifPuzzle onSolve={handleSolve} />}

      {isFireMapPuzzle && <FireMapPuzzle onSolve={handleSolve} />}

      {isGoldenScarabPuzzle && <GoldenScarabPuzzle onSolve={handleSolve} />}

      {imageUrl && !isPuzzleImage && (
        <div className="flex justify-center">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt="Puzzle"
            width={400}
            height={300}
            className="rounded-lg object-contain"
          />
        </div>
      )}

      {showInput && <AnswerInput onSolve={handleSolve} />}
    </div>
  )
}
