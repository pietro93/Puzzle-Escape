"use client"

import type React from "react"
import Image from "next/image"
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
import { guardDialogLines } from "@/utils/dialogue-utils"
import { useState } from "react"
import FireMapPuzzle from "./fire-map-puzzle"
import ColorPalettePuzzle from "./color-palette-puzzle"
import MurderMysteryPuzzle from "./murder-mystery-puzzle"
import GoldenScarabPuzzle from "./golden-scarab-puzzle"
import PyramidOfHanoiPuzzle from "./pyramid-of-hanoi-puzzle"
import MagicBoxPuzzle from "./magic-box-puzzle"
import InfernalChessPuzzle from "./infernal-chess-puzzle"
import DamnedSoulsPuzzle from "./damned-souls-puzzle"
import PrisonCellPuzzle from "./prison-cell-puzzle"
import BoneCountingPuzzle from "./bone-counting-puzzle"
import FearYourDreamsPuzzle from "./fear-your-dreams-puzzle"
import WordLadderCarouselPuzzle from "./word-ladder-carousel-puzzle"

interface PuzzleContentProps {
  level: number
  puzzle: any
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
  isMagicBoxPuzzle?: boolean
  onMurderMysteryLocationUpdate?: (location: string) => void
  onMagicBoxSolved?: () => void
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
  onMurderMysteryLocationUpdate,
  onMagicBoxSolved,
}: PuzzleContentProps) {
  // Check if this puzzle has an image
  const hasImage = puzzle.imageUrl && puzzle.imageUrl.trim() !== ""

  // Check if this is an interactive inmate puzzle
  const isInteractiveInmates = puzzle.isInteractiveInmates && puzzle.inmateData && puzzle.inmateData.length > 0

  // Check if this is a library puzzle
  const isLibraryPuzzle =
    puzzle.isLibraryPuzzle && puzzle.libraryData && puzzle.libraryData.books && puzzle.libraryData.books.length > 0

  // Check if this is a jigsaw puzzle
  const isJigsawPuzzle = puzzle.isJigsawPuzzle

  // Check if this is a parrot puzzle
  const isParrotPuzzle = puzzle.isParrotPuzzle

  // Check if this is a light switch puzzle
  const isLightSwitchPuzzle = puzzle.isLightSwitchPuzzle

  // Check if this is a tarot puzzle
  const isTarotPuzzle = puzzle.isTarotPuzzle

  // Check if this is a questionnaire puzzle
  const isQuestionnairePuzzle = puzzle.isQuestionnairePuzzle

  // Check if this is a coffee grounds puzzle
  const isCoffeeGroundsPuzzle = level === 22

  // Check if this is a zodiac puzzle
  const isZodiacPuzzle = puzzle.isZodiacPuzzle

  // Check if this is a crystal jigsaw puzzle
  const isCrystalJigsawPuzzle = puzzle.isCrystalJigsawPuzzle

  // Check if this is a crocodile jigsaw puzzle
  const isCrocodileJigsawPuzzle = puzzle.isCrocodileJigsawPuzzle

  // Check if this is a pyramid puzzle
  const isPyramidPuzzle = puzzle.isPyramidPuzzle

  // Check if this is a familiar faces puzzle
  const isFamiliarFacesPuzzle = puzzle.isFamiliarFacesPuzzle

  // Check if this is a hell jigsaw puzzle
  const isHellJigsawPuzzle = puzzle.isHellJigsawPuzzle

  // Check if this is a crystal sequence puzzle
  const isCrystalSequencePuzzle = puzzle.isCrystalSequencePuzzle

  // Check if this is an infernal casino puzzle
  const isInfernalCasinoPuzzle = puzzle.isInfernalCasinoPuzzle

  // Check if this is an Egyptian pillars puzzle
  const isEgyptianPillarsPuzzle = puzzle.isEgyptianPillarsPuzzle

  // Check if this is a dark room puzzle
  const isDarkRoomPuzzle = puzzle.isDarkRoomPuzzle

  // Check if this is an Egyptian math puzzle
  const isEgyptianMathPuzzle = puzzle.isEgyptianMathPuzzle

  // Check if this is a mouth of truth puzzle
  const isMouthOfTruthPuzzle = puzzle.isMouthOfTruthPuzzle

  // Check if this is a binary switch puzzle
  const isBinarySwitchPuzzle = puzzle.isBinarySwitchPuzzle

  // Check if this is a pyramid of hanoi puzzle
  const isPyramidOfHanoiPuzzle = puzzle.isPyramidOfHanoiPuzzle

  // Check if this is a magic box puzzle
  const isMagicBoxPuzzle = puzzle.isMagicBoxPuzzle

   // Check if this is a prison cell puzzle
   const isPrisonCellPuzzle = puzzle.isPrisonCellPuzzle

   // Check if this is a bone counting puzzle
   const isBoneCountingPuzzle = puzzle.isBoneCountingPuzzle

     // Check if this is a fear your dreams puzzle
    const isFearYourDreamsPuzzle = puzzle.isFearYourDreamsPuzzle

    // Check if this is a word ladder carousel puzzle
    const isWordLadderCarouselPuzzle = puzzle.isWordLadderCarouselPuzzle

  const [binaryCorrectCombinations, setBinaryCorrectCombinationsState] = useState(0)
  const [magicBoxSolved, setMagicBoxSolved] = useState(false)

  const handleMagicBoxSolved = () => {
    setMagicBoxSolved(true)
    onMagicBoxSolved?.()
  }

  // Add a new function to handle brain lamp clicks
  const handleBrainLampClick = () => {
    // Generate dialogue based on the number of correct combinations
    let dialogue = "..." // Default dialogue

    if (binaryCorrectCombinations < 6) {
      // Different dialogue tiers based on progress
      if (binaryCorrectCombinations <= 1) {
        // Early stage - more coherent pleas
        const earlyDialogues = [
          "Help... me...",
          "Make it... stop...",
          "Please... no more...",
          "It burns...",
          "My... thoughts...",
        ]
        dialogue = earlyDialogues[Math.floor(Math.random() * earlyDialogues.length)]
      } else if (binaryCorrectCombinations <= 3) {
        // Middle stage - increasing pain, less coherent
        const middleDialogues = [
          "AAAGH! IT HURTS!",
          "Can't... think...",
          "My brain... burning...",
          "No more... please...",
          "STOP THE PAIN!",
        ]
        dialogue = middleDialogues[Math.floor(Math.random() * middleDialogues.length)]
      } else {
        // Late stage - extreme agony, barely coherent
        const lateDialogues = [
          "AAAAAAHHH!",
          "KILL... ME...",
          "*unintelligible screaming*",
          "*gurgling sounds*",
          "END... THIS...",
        ]
        dialogue = lateDialogues[Math.floor(Math.random() * lateDialogues.length)]
      }
    }

    // Show the dialogue popup with the brain character
    //setShowBrainDialogue(true);
    //setBrainDialogue(dialogue);
  }

  return (
    <div className="bg-gray-900/80 p-5 rounded-lg mb-4 border border-gray-800 shadow-inner flex-1 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-3">
        {level !== 17 && <p className="font-pixel text-lg text-purple-300 leading-relaxed">{puzzle.question}</p>}
      </div>

      {isPrisonCellPuzzle ? (
      <div className="my-4">
      <PrisonCellPuzzle
      puzzle={puzzle}
      onSolve={() => {}}
      />
      </div>
      ) : null}

       {isBoneCountingPuzzle ? (
       <div className="my-4">
       <BoneCountingPuzzle onSolve={() => {}} />
       </div>
       ) : null}

       {isFearYourDreamsPuzzle ? (
       <div className="my-4">
       <FearYourDreamsPuzzle onSolve={() => {}} />
       </div>
       ) : null}

       {isWordLadderCarouselPuzzle ? (
         <div className="my-4">
            <WordLadderCarouselPuzzle onSolve={() => {}} />
          </div>
        ) : null}

        {isMagicBoxPuzzle ? (
        <div className="my-4">
        <MagicBoxPuzzle
        onSolve={() => {
        // Don't automatically solve, let the player type the answer
        }}
          onSolved={handleMagicBoxSolved}
          />
          </div>
       ) : null}

      {isInfernalCasinoPuzzle ? (
        <div className="my-4">
          <InfernalCasinoPuzzle
            onSolve={() => {
              // Don't automatically solve, let the player type the answer
            }}
          />
        </div>
      ) : null}

      {puzzle.isInfernalChessPuzzle && <InfernalChessPuzzle />}

      {puzzle.isDamnedSoulsPuzzle && <DamnedSoulsPuzzle />}

      {isCrystalJigsawPuzzle ? (
        <div className="my-4">
          {puzzle.description && (
            <p className="text-gray-300 whitespace-pre-line font-mono text-sm mb-4">{puzzle.description}</p>
          )}
          <CrystalJigsawPuzzle
            onComplete={() => {
              // Just set the jigsaw as complete, don't automatically advance
              handleJigsawComplete()
            }}
          />
        </div>
      ) : isCrocodileJigsawPuzzle ? (
        <div className="my-4">
          {puzzle.description && (
            <p className="text-gray-300 whitespace-pre-line font-mono text-sm mb-4">{puzzle.description}</p>
          )}
          <CrocodileJigsawPuzzle
            onComplete={() => {
              // Just set the jigsaw as complete, don't automatically advance
              handleJigsawComplete()
            }}
          />
        </div>
      ) : isQuestionnairePuzzle ? (
        <div className="my-4">
          {puzzle.description && (
            <p className="text-gray-300 whitespace-pre-line font-mono text-sm mb-4">{puzzle.description}</p>
          )}
          <QuestionnairePuzzle
            ref={questionnaireRef}
            onSolve={handleParrotSolve}
            onRestart={handleQuestionnaireRestart}
            onSolutionGenerated={onSolutionGenerated}
          />
        </div>
      ) : isCoffeeGroundsPuzzle ? (
        <div className="my-4">
          {puzzle.description && (
            <p className="text-gray-300 whitespace-pre-line font-mono text-sm mb-4">{puzzle.description}</p>
          )}
          <CoffeeGroundsPuzzle onSolve={handleParrotSolve} />
        </div>
      ) : isTarotPuzzle ? (
        <div className="my-4">
          {puzzle.description && (
            <p className="text-gray-300 whitespace-pre-line font-mono text-sm mb-4">{puzzle.description}</p>
          )}
          <TarotPuzzle onSolve={handleParrotSolve} />
        </div>
      ) : isParrotPuzzle ? (
        <div className="my-4">
          {puzzle.description && (
            <p className="text-gray-300 whitespace-pre-line font-mono text-sm mb-4">{puzzle.description}</p>
          )}
          <ParrotPuzzle onSolve={handleParrotSolve} />
        </div>
      ) : isZodiacPuzzle ? (
        <div className="my-4">
          {puzzle.description && (
            <p className="text-gray-300 whitespace-pre-line font-mono text-sm mb-4">{puzzle.description}</p>
          )}
          <ZodiacPuzzle onSolve={handleZodiacSolve} />
        </div>
      ) : puzzle.isAnimatedGif ? (
        <div className="my-4">
          {puzzle.description && (
            <p className="text-gray-300 whitespace-pre-line font-mono text-sm mb-4">{puzzle.description}</p>
          )}
          <div className={level === 29 ? "bg-black p-4 rounded-lg" : ""}>
            <AnimatedGifPuzzle
              videoUrl={
                puzzle.videoUrl ||
                "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hands-animation-J6PNaCc88j264qQxkPiSfPzA6Fzsbs.mp4"
              }
              altText={`Puzzle for level ${puzzle.level}`}
              showReplayButton={level !== 26} // Don't show replay button for level 26
            />
          </div>
        </div>
      ) : isJigsawPuzzle ? (
        <div className="my-4">
          {puzzle.description && (
            <p className="text-gray-300 whitespace-pre-line font-mono text-sm mb-4">{puzzle.description}</p>
          )}
          <JigsawPuzzle onComplete={handleJigsawComplete} />
        </div>
      ) : isLibraryPuzzle ? (
        <div className="my-4">
          {puzzle.description && (
            <p className="text-gray-300 whitespace-pre-line font-mono text-sm mb-4">{puzzle.description}</p>
          )}
          <LibraryPuzzle books={puzzle.libraryData?.books || []} />
        </div>
      ) : isInteractiveInmates ? (
        <div className="my-4">
          {puzzle.description && (
            <p className="text-gray-300 whitespace-pre-line font-mono text-sm mb-4">{puzzle.description}</p>
          )}
          <InmatePuzzle
            inmates={puzzle.inmateData || []}
            guardStatement={puzzle.guardStatement || guardDialogLines[guardDialogIndex]}
            level={level}
            onGuardClick={handleGuardClick}
          />
        </div>
      ) : isLightSwitchPuzzle ? (
        <div className="my-4">
          {/* No description text for level 17 */}
          {level !== 17 && puzzle.description && (
            <p className="text-gray-300 whitespace-pre-line font-mono text-sm mb-4">{puzzle.description}</p>
          )}
          <LightSwitchPuzzle onSolve={() => {}} onUpdate={handleLightSwitchUpdate} onSolutionGenerated={onSolutionGenerated} />
        </div>
      ) : isPyramidPuzzle ? (
        <div className="my-4">
          {puzzle.description && (
            <p className="text-gray-300 whitespace-pre-line font-mono text-sm mb-4">{puzzle.description}</p>
          )}
          <PyramidPuzzle
            onSolve={() => {
              // Don't automatically solve, let the player type the answer
            }}
            onRoomChange={handlePyramidRoomChange}
            onTorchAcquired={handlePyramidTorchAcquired}
            hasTorch={hasPyramidTorch}
            currentRoom={currentPyramidRoom}
          />
        </div>
      ) : level === 31 ? (
        <div className="flex flex-col items-center justify-center my-4 bg-black p-4 rounded-lg">
          <div className="w-full max-w-md relative pixelated-container mb-4">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hyeroglyphs1-4yVXD0Okuqc06VyH3fA9yjIwz0sCBR.webp"
              alt="Hieroglyphs part 1"
              width={400}
              height={100}
              className="pixelated z-10 relative w-full object-contain"
            />
          </div>
          <div className="w-full max-w-md relative pixelated-container">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hyeroglyphs2-Ws9pjdF8pnqTgk6shmeR8y4ZeECG9q.webp"
              alt="Hieroglyphs part 2"
              width={400}
              height={100}
              className="pixelated z-10 relative w-full object-contain"
            />
          </div>
        </div>
      ) : hasImage ? (
        <div className="flex justify-center my-4">
          <div className="w-full max-w-md relative pixelated-container">
            <div className="absolute inset-0 bg-black/30 rounded-lg z-0"></div>
            <img
              src={puzzle.imageUrl || "/placeholder.svg"}
              alt={`Puzzle for level ${puzzle.level}`}
              className="pixelated z-10 relative w-full object-contain"
            />
            <div className="absolute -inset-1 border-2 border-gray-800 rounded-lg z-20 pointer-events-none"></div>
          </div>
        </div>
      ) : puzzle.description ? (
        <div className="text-gray-300 whitespace-pre-line font-mono text-sm bg-gray-950/50 p-4 rounded-lg border border-gray-800 shadow-inner">
          {puzzle.description}
        </div>
      ) : null}

      {isFamiliarFacesPuzzle ? (
        <div className="my-4">
          {/* Remove the redundant description text for level 45 */}
          {level !== 45 && puzzle.description && (
            <p className="text-gray-300 whitespace-pre-line font-mono text-sm mb-4">{puzzle.description}</p>
          )}
          <FamiliarFacesPuzzle
            id="familiar-faces-puzzle"
            onSolve={() => {
              // Don't automatically solve, let the player type the answer
            }}
            handleDevilClick={() => {}}
          />
        </div>
      ) : null}

      {isHellJigsawPuzzle ? (
        <div className="my-4">
          {puzzle.description && (
            <p className="text-gray-300 whitespace-pre-line font-mono text-sm mb-4">{puzzle.description}</p>
          )}
          <HellJigsawPuzzle
            onComplete={() => {
              // Just set the jigsaw as complete, don't automatically advance
              handleJigsawComplete()
            }}
          />
        </div>
      ) : null}

      {isCrystalSequencePuzzle ? (
        <div className="my-4">
          {puzzle.description && (
            <p className="text-gray-300 whitespace-pre-line font-mono text-sm mb-4">{puzzle.description}</p>
          )}
          <CrystalSequencePuzzle
            onSolve={() => {
              // Don't automatically solve, let the player type the answer
            }}
          />
        </div>
      ) : null}

      {level === 50 ? (
        <div className="my-4" id="final-level-puzzle">
          <FinalLevelPuzzle
            onSolve={() => {
              // Don't automatically solve, let the player type the answer
            }}
            onDevilClick={() => {}}
            onAllPiecesRemoved={handleAllPiecesRemoved}
            onElevatorPanelOpen={handleElevatorPanelOpen}
            currentFloor={currentElevatorFloor}
            onFloorChange={(floor) => setCurrentElevatorFloor(floor)}
          />
        </div>
      ) : null}

      {isEgyptianPillarsPuzzle ? (
        <div className="my-4">
          {puzzle.description && (
            <p className="text-gray-300 whitespace-pre-line font-mono text-sm mb-4">{puzzle.description}</p>
          )}
          <EgyptianPillarsPuzzle
            onSolve={() => {
              // Don't automatically solve, let the player type the answer
            }}
          />
        </div>
      ) : null}

      {isDarkRoomPuzzle ? (
        <div className="my-4">
          {puzzle.description && (
            <p className="text-gray-300 whitespace-pre-line font-mono text-sm mb-4">{puzzle.description}</p>
          )}
          <DarkRoomPuzzle
            onSolve={() => {
              // Don't automatically solve, let the player type the answer
            }}
          />
        </div>
      ) : null}

      {isEgyptianMathPuzzle ? (
        <div className="my-4">
          {puzzle.description && (
            <p className="text-gray-300 whitespace-pre-line font-mono text-sm mb-4">{puzzle.description}</p>
          )}
          <EgyptianMathPuzzle
            onSolve={() => {
              // Don't automatically solve, let the player type the answer
            }}
          />
        </div>
      ) : null}

      {isMouthOfTruthPuzzle ? (
        <div className="my-4">
          {puzzle.description && (
            <p className="text-gray-300 whitespace-pre-line font-mono text-sm mb-4">{puzzle.description}</p>
          )}
          <MouthOfTruthPuzzle
            onSolve={() => {
              // Don't automatically solve, let the player type the answer
            }}
          />
        </div>
      ) : null}

      {isBinarySwitchPuzzle ? (
        <div className="my-4">
          {puzzle.description && (
            <p className="text-gray-300 whitespace-pre-line font-mono text-sm mb-4">{puzzle.description}</p>
          )}
          <BinarySwitchPuzzle
            onSolve={() => {
              // Don't automatically solve, let the player type the answer
            }}
            onCorrectCombinationsChange={setBinaryCorrectCombinations}
          />
        </div>
      ) : null}
      {isPyramidOfHanoiPuzzle ? (
        <div className="my-4">
          {puzzle.description && (
            <p className="text-gray-300 whitespace-pre-line font-mono text-sm mb-4">{puzzle.description}</p>
          )}
          <PyramidOfHanoiPuzzle
            onSolve={() => {
              // Don't automatically solve, let the player type the answer
            }}
          />
        </div>
      ) : null}
      {puzzle.isFireMapPuzzle && <FireMapPuzzle onSolve={() => handleParrotSolve()} />}
      {puzzle.isColorPalettePuzzle && (
        <div className="mb-4">
          <ColorPalettePuzzle onSolve={() => {}} />
        </div>
      )}
      {puzzle.isMurderMysteryPuzzle && <MurderMysteryPuzzle onSolve={handleParrotSolve} onLocationUpdate={onMurderMysteryLocationUpdate} />}
      {puzzle.isGoldenScarabPuzzle && <GoldenScarabPuzzle />}
    </div>
  )
}
