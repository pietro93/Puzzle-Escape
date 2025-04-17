// Update the Puzzle type to include isGoldenScarabPuzzle

export type Puzzle = {
  level: number
  question: string
  description: string
  imageUrl: string
  solution: string
  category: "riddle" | "math" | "pattern" | "logic"
  hints: string[]
  isPuzzleImage?: boolean
  isLibraryPuzzle?: boolean
  isInmatePuzzle?: boolean
  isParrotPuzzle?: boolean
  isCoffeeGroundsPuzzle?: boolean
  isQuestionnairePuzzle?: boolean
  isTarotPuzzle?: boolean
  isAnimatedGifPuzzle?: boolean
  isZodiacPuzzle?: boolean
  isFamiliarFacesPuzzle?: boolean
  isJigsawPuzzle?: boolean
  isCrystalJigsawPuzzle?: boolean
  isCrystalSequencePuzzle?: boolean
  isHellJigsawPuzzle?: boolean
  isCrocodileJigsawPuzzle?: boolean
  isMouthOfTruthPuzzle?: boolean
  isBinarySwitchPuzzle?: boolean
  isElevatorPuzzle?: boolean
  isFinalJigsawPuzzle?: boolean
  isLightSwitchPuzzle?: boolean
  isFinalLevelPuzzle?: boolean
  isInfernalCasinoPuzzle?: boolean
  isEgyptianPillarsPuzzle?: boolean
  isEgyptianMathPuzzle?: boolean
  isDarkRoomPuzzle?: boolean
  isPyramidPuzzle?: boolean
  isFireMapPuzzle?: boolean
  isGoldenScarabPuzzle?: boolean
}
