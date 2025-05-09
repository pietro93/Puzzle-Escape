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
  onLocationClick?: () => () => void
  onPyramidLocationImageClick?: () => void
}

export default function CharacterLocationDisplay({
  level,
  setting,
  character,
  puzzle,
  lightsOn,
  solved,
  binaryCorrectCombinations,
  currentPyramidRoom,
  hasPyramidTorch,
  hasUsedElevator,
  showElevator,
  jigsawComplete,
  onGuardClick,
  onLocationClick,
  onPyramidLocationImageClick,
}: CharacterLocationDisplayProps) {
  // Get custom location image based on level
  const getCustomLocationImage = () => {
    // Special case for level 47 (brain lamp puzzle)
    if (level === 47) {
      if (binaryCorrectCombinations === 0) return "/images/brainlamp.webp"
      if (binaryCorrectCombinations === 1) return "/images/brainlamp1animated.gif"
      if (binaryCorrectCombinations === 2) return "/images/brainlamp2animated.gif"
      if (binaryCorrectCombinations === 3) return "/images/brainlamp3animated.gif"
      if (binaryCorrectCombinations === 4) return "/images/brainlamp4animated.gif"
      if (binaryCorrectCombinations === 5) return "/images/brainlamp5animated.gif"
      if (binaryCorrectCombinations === 6) return "/images/brainlamp6animated.gif"
    }

    // Special case for level 40 (pyramid puzzle)
    if (level === 40 && currentPyramidRoom) {
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
      if (jigsawComplete) {
        return "/images/hell-throne.webp"
      }
    }

    // Special case for level 10 (guard puzzle)
    if (level === 10) {
      return "/images/the-guard.webp"
    }

    // Special case for level 38 (sphinx puzzle)
    if (level === 38) {
      return "/images/sphinx.webp"
    }

    // Special case for level 25 (dark room puzzle)
    if (level === 25) {
      return lightsOn ? "/images/mansion-library.webp" : "/images/pitch-darkness.webp"
    }

    // Special case for level 30 (parrot puzzle)
    if (level === 30) {
      return "/images/parrot.webp"
    }

    // Default location images based on setting
    switch (setting) {
      case "prison":
        return level === 5 ? "/images/prison-exit.webp" : "/images/prison-cell.webp"
      case "mansion":
        return level === 15 ? "/images/mansion-library.webp" : null
      case "forest":
        return level === 25 ? "/images/forest-clearing.webp" : null
      case "desert":
        return level === 35 ? "/images/desert-temple.webp" : null
      case "hell":
        return level === 45 ? "/images/hell-throne.webp" : null
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-4 items-center justify-center">
      {/* Character image */}
      <div className="cursor-pointer" onClick={onGuardClick} aria-label={`${character} character`}>
        <CharacterImage character={character} />
      </div>

      {/* Location image */}
      <div
        className="cursor-pointer"
        onClick={level === 40 ? onPyramidLocationImageClick : onLocationClick}
        aria-label={`${setting} location`}
      >
        <LocationImage setting={setting} customImage={getCustomLocationImage()} level={level} />
      </div>
    </div>
  )
}
