"use client"

import CharacterImage from "./character-image"
import LocationImage from "./location-image"
import type { Puzzle } from "@/types/puzzle"

interface CharacterLocationDisplayProps {
  level: number
  setting: string
  character: string
  puzzle: Puzzle
  lightsOn?: boolean
  solved?: boolean
  binaryCorrectCombinations?: number
  currentPyramidRoom?: string
  hasPyramidTorch?: boolean
  hasUsedElevator?: boolean
  showElevator?: boolean
  jigsawComplete?: boolean
  onGuardClick?: () => void
  onLocationClick?: () => void
  onPyramidLocationImageClick?: () => void
}

export default function CharacterLocationDisplay({
  level,
  setting,
  character,
  puzzle,
  lightsOn = false,
  solved = false,
  binaryCorrectCombinations = 0,
  currentPyramidRoom = "entrance",
  hasPyramidTorch = false,
  hasUsedElevator = false,
  showElevator = true,
  jigsawComplete = false,
  onGuardClick,
  onLocationClick,
  onPyramidLocationImageClick,
}: CharacterLocationDisplayProps) {
  // Get custom location image for specific levels
  const getCustomLocationImage = () => {
    // Special case for level 47 (brain lamp)
    if (level === 47) {
      return getBrainLampImage(binaryCorrectCombinations)
    }

    // Special case for level 40 (pyramid rooms)
    if (level === 40) {
      switch (currentPyramidRoom) {
        case "entrance":
          return "/images/desert-temple.webp"
        case "ra":
          return hasPyramidTorch ? "/images/scarab-symbol.webp" : "/images/eye-of-ra-symbol.webp"
        case "anubis":
          return "/images/jackal-symbol.webp"
        case "osiris":
          return "/images/djed-symbol.webp"
        default:
          return "/images/desert-temple.webp"
      }
    }

    // Special case for level 50 (elevator)
    if (level === 50) {
      if (hasUsedElevator && showElevator) {
        return "/images/elevator.webp"
      }
      return jigsawComplete ? null : "/images/hell-throne.webp"
    }

    // Special case for level 34 (jigsaw puzzle)
    if (level === 34 && jigsawComplete) {
      return "/images/yama_jigsaw_full-9.webp"
    }

    // Special case for level 44 (hell jigsaw puzzle)
    if (level === 44 && jigsawComplete) {
      return "/images/hell-jigsaw-full.webp"
    }

    // Special case for level 10 (prison exit)
    if (level === 10) {
      return "/images/prison-exit.webp"
    }

    // Special case for level 20 (mansion library)
    if (level === 20) {
      return "/images/mansion-library.webp"
    }

    // Special case for level 30 (forest clearing)
    if (level === 30) {
      return "/images/forest-clearing.webp"
    }

    // Special case for level 38 (desert temple)
    if (level === 38) {
      return "/images/desert-temple.webp"
    }

    // Special case for dark room puzzle
    if (puzzle.isDarkRoomPuzzle) {
      return lightsOn
        ? solved
          ? "/images/pitch-darkness.webp"
          : "/images/prison-cell.webp"
        : "/images/pitch-darkness.webp"
    }

    return null
  }

  // Get brain lamp image based on correct combinations
  const getBrainLampImage = (correctCombinations: number) => {
    switch (correctCombinations) {
      case 0:
        return "/images/brainlamp.webp" // 0 correct
      case 1:
        return "/images/brainlamp1animated.gif" // 1 correct
      case 2:
        return "/images/brainlamp2animated.gif" // 2 correct
      case 3:
        return "/images/brainlamp3animated.gif" // 3 correct
      case 4:
        return "/images/brainlamp4animated.gif" // 4 correct
      case 5:
        return "/images/brainlamp5animated.gif" // 5 correct
      case 6:
        return "/images/brainlamp6animated.gif" // 6 correct (all)
      default:
        return "/images/brainlamp.webp" // Default
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      {/* Character section */}
      <div className="flex-1 flex flex-col items-center">
        <h2 className="text-xs text-gray-400 mb-2 font-pixel">Character</h2>
        <div onClick={onGuardClick} className="cursor-pointer">
          <CharacterImage character={character} />
        </div>
      </div>

      {/* Location section */}
      <div className="flex-1 flex flex-col items-center">
        <h2 className="text-xs text-gray-400 mb-2 font-pixel">Location</h2>
        <div onClick={level === 40 ? onPyramidLocationImageClick : onLocationClick} className="cursor-pointer">
          <LocationImage setting={setting} customImage={getCustomLocationImage()} level={level} />
        </div>
      </div>
    </div>
  )
}
