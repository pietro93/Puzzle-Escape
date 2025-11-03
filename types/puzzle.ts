interface Inmate {
  name: string
  image: string
  statements: { text: string }[]
}

export interface Puzzle {
  level: number
  question: string
  description: string
  imageUrl?: string
  locationImage?: string
  characterImage?: string
  solution: string
  category: string
  hints?: string[]
  isLibraryPuzzle?: boolean
  isInmatePuzzle?: boolean
  isTarotPuzzle?: boolean
  isParrotPuzzle?: boolean
  isCoffeeGroundsPuzzle?: boolean
  isQuestionnairePuzzle?: boolean
  isCrystalJigsawPuzzle?: boolean
  isCrocodileJigsawPuzzle?: boolean
  isJigsawPuzzle?: boolean
  isZodiacPuzzle?: boolean
  isCrystalSequencePuzzle?: boolean
  isHellJigsawPuzzle?: boolean
  isFamiliarFacesPuzzle?: boolean
  isAnimatedGifPuzzle?: boolean
  isEgyptianMathPuzzle?: boolean
  isEgyptianPillarsPuzzle?: boolean
  isPyramidPuzzle?: boolean
  isDarkRoomPuzzle?: boolean
  isBinarySwitchPuzzle?: boolean
  isInfernalCasinoPuzzle?: boolean
  isInfernalChessPuzzle?: boolean
  isDamnedSoulsPuzzle?: boolean
  isElevatorPuzzle?: boolean
  isFinalJigsawPuzzle?: boolean
  isLightSwitchPuzzle?: boolean
  isFinalLevelPuzzle?: boolean
  isDevilDialogue?: boolean
  isMouthOfTruthPuzzle?: boolean
  isFireMapPuzzle?: boolean
  isMagicBoxPuzzle?: boolean
  isPrisonCellPuzzle?: boolean
  isBoneCountingPuzzle?: boolean
  isInteractiveInmates?: boolean
  inmateData?: Inmate[]
  guardStatement?: string
  isMurderMysteryPuzzle?: boolean
  isColorPalettePuzzle?: boolean
  libraryData?: any
  isFearYourDreamsPuzzle?: boolean
  isWordLadderCarouselPuzzle?: boolean
}
