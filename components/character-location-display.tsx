"use client"

import Image from "next/image"
import CharacterImage from "./character-image"
import LocationImage from "./location-image"

interface CharacterLocationDisplayProps {
  level: number
  setting: string
  character: string
  puzzle: any
  lightsOn?: boolean
  solved?: boolean
  binaryCorrectCombinations?: number
  currentPyramidRoom?: string
  hasPyramidTorch?: boolean
  hasUsedElevator?: boolean
  showElevator?: boolean
  jigsawComplete?: boolean
  murderMysteryLocation?: string
  onGuardClick: () => void; // Added semicolon here
  onLocationClick?: () => void
  onPyramidLocationImageClick?: () => void
}

// Speech Indicator Component using the new image
export const SpeechIndicator = () => (
  <div className="absolute bottom-1 right-1 w-6 h-6 z-40">
    <Image
      src="/images/speech-icon.webp"
      alt="Speech Icon"
      width={24} // Adjust size as needed
      height={24} // Adjust size as needed
      className="pixelated animate-pulse" // Optional: Add pulsing animation
    />
  </div>
);

// Character Display Wrapper Component for reusability
interface CharacterDisplayWrapperProps {
  character: string;
  onGuardClick: () => void;
  enableInteraction: boolean; // Controls clickability and speech icon visibility
}

const CharacterDisplayWrapper = ({ character, onGuardClick, enableInteraction }: CharacterDisplayWrapperProps) => {
  return (
    <div className="flex justify-center items-center">
      <div
        className={`w-40 h-40 relative pixelated-container ${enableInteraction ? "cursor-pointer" : ""}`}
        onClick={enableInteraction ? onGuardClick : undefined}
      >
        <CharacterImage character={character} />
        {enableInteraction && <SpeechIndicator />}
      </div>
    </div>
  );
};


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
  showElevator = false,
  jigsawComplete = false,
  murderMysteryLocation,
  onGuardClick,
  onLocationClick,
  onPyramidLocationImageClick,
}: CharacterLocationDisplayProps) {
  // Helper function to get the correct brain lamp image based on correct combinations
  const getBrainLampImage = (correctCount: number) => {
    switch (correctCount) {
      case 0:
        return "/images/brainlamp.webp" // 0 correct - static image
      case 1:
        return "/images/xbrainlampa1.webp" // 1 correct
      case 2:
        return "/images/xbrainlampa2.webp" // 2 correct
      case 3:
        return "/images/xbrainlampa3.webp" // 3 correct
      case 4:
        return "/images/xbrainlampa4.webp" // 4 correct
      case 5:
        return "/images/xbrainlampa5.webp" // 5 correct
      case 6:
        return "/images/xbrainlampa6.webp" // 6 correct (with red glow)
      default:
        return "/images/brainlamp.webp" // Default - static image
    }
  }

  // Helper function to get the correct brain lamp opacity based on correct combinations
  const getBrainLampOpacity = (correctCount: number) => {
    switch (correctCount) {
      case 0:
        return 0.55 // 0 correct
      case 1:
        return 0.6 // 1 correct
      case 2:
        return 0.65 // 2 correct
      case 3:
        return 0.75 // 3 correct
      case 4:
        return 0.85 // 4 correct
      case 5:
        return 0.9 // 5 correct
      case 6:
        return 1 // 6 correct (all)
      default:
        return 0.55 // Default
    }
  }

  // Get location image for pyramid puzzle
  const getPyramidLocationImage = () => {
    if (level !== 40) return null

    switch (currentPyramidRoom) {
    case "entrance":
    case "isis":
    case "osiris":
    case "horus":
    case "toth":
    case "anubis":
      return "/images/pyramid-inside.webp"
    case "ra":
      // Ra room: lit initially, becomes regular inside after torch is taken
      return hasPyramidTorch ? "/images/pyramid-inside.webp" : "/images/pyramid-inside-lit.webp"
    case "mural1":
    case "mural2":
    case "mural3":
    case "mural4":
        // Mural rooms: dark without torch, inside with torch
        return hasPyramidTorch ? "/images/pyramid-inside.webp" : "/images/pitch-darkness.webp"
      default:
        return "/images/pitch-darkness.webp"
    }
  }

  // Special handling for level 17 (light switch puzzle)
  if (level === 17) {
    return (
      <div className="grid grid-cols-2 gap-3 mb-4 animate-fadeIn">
        {/* Character image for level 17 - clickable only when solved */}
        <div className="flex justify-center items-center">
          <div
            className={`w-40 h-40 relative pixelated-container ${solved ? "cursor-pointer" : ""}`}
            onClick={solved ? onGuardClick : undefined} // Only clickable if solved
          >
            <Image
              src={
                solved
                  ? "/images/butler.webp"
                  : lightsOn
                    ? "/images/butler-undead.webp"
                    : "/images/pitch-darkness.webp"
              }
              alt={lightsOn ? "Butler" : "Darkness"}
              width={160}
              height={160}
              className="pixelated"
            />
            {solved && <SpeechIndicator />} {/* Only show indicator if solved */}
          </div>
        </div>
        <div className="flex justify-center items-center">
          <div className="w-40 h-40 relative pixelated-container">
            <Image
              src={                solved
                  ? "/images/compass.webp"
                  : lightsOn
                    ? "/images/compass_dim.webp"
                    : "/images/pitch-darkness.webp"
              }
              alt={lightsOn ? "Mansion" : "Darkness"}
              width={160}
              height={160}
              className="pixelated"
            />
          </div>
        </div>
      </div>
    )
  }

  // Special handling for level 29 (sign language puzzle)
  if (level === 29) {
    return (
      <div className="grid grid-cols-2 gap-3 mb-4 animate-fadeIn">
        <CharacterDisplayWrapper character={character} onGuardClick={onGuardClick} enableInteraction={true} />
        <div className="flex justify-center items-center">
          <LocationImage setting={setting} customImage={puzzle.locationImage} hintImage={puzzle.imageHint} murderMysteryLocation={murderMysteryLocation} />
        </div>
      </div>
    )
  }

  // Special handling for level 39 (Egyptian math puzzle)
  if (level === 39) {
    return (
      <div className="grid grid-cols-2 gap-3 mb-4 animate-fadeIn">
        <CharacterDisplayWrapper character={character} onGuardClick={onGuardClick} enableInteraction={true} />
        <div className="flex justify-center items-center">
          <LocationImage setting={setting} customImage={null} murderMysteryLocation={murderMysteryLocation} />
        </div>
      </div>
    )
  }

  // Special handling for level 40 (pyramid puzzle)
  if (level === 40) {
    return (
      <div className="grid grid-cols-2 gap-3 mb-4 animate-fadeIn">
        <CharacterDisplayWrapper character={character} onGuardClick={onGuardClick} enableInteraction={true} />
        <div
          className={`flex justify-center items-center ${!hasPyramidTorch ? "cursor-pointer" : ""}`}
          onClick={!hasPyramidTorch ? onPyramidLocationImageClick : undefined}
        >
          <div className="w-40 h-40 relative pixelated-container">
            <div className="absolute inset-0 bg-black/30 rounded-lg z-0"></div>
            <Image
              src={getPyramidLocationImage() || `/images/${setting}-bg.webp`}
              alt={`${setting} location`}
              width={160}
              height={160}
              className="pixelated z-10 relative"
            />
            <div className="absolute -inset-1 border-2 border-gray-800 rounded-lg z-20 pointer-events-none"></div>
            <div className="absolute -bottom-1 left-0 right-0 h-1 bg-black/50 blur-sm z-30"></div>
          </div>
        </div>
      </div>
    )
  }

  // Special handling for level 47 (brain lamp puzzle)
  if (level === 47) {
    return (
      <div className="grid grid-cols-2 gap-3 mb-4 animate-fadeIn">
        <CharacterDisplayWrapper character={character} onGuardClick={onGuardClick} enableInteraction={true} />
        <div
          className="flex justify-center items-center cursor-pointer"
          onClick={() => {
            if (onPyramidLocationImageClick) {
              onPyramidLocationImageClick()
            }
          }}
        >
          <div className="w-40 h-40 relative pixelated-container">
            <div className="absolute inset-0 bg-black/30 rounded-lg z-0"></div>
            <img
              src={getBrainLampImage(binaryCorrectCombinations) || "/placeholder.svg"}
              alt="Brain Lamp"
              width={160}
              height={160}
              className="pixelated z-10 relative w-full h-full object-contain"
              style={{
                opacity: getBrainLampOpacity(binaryCorrectCombinations),
                imageRendering: "pixelated",
              }}
            />
            <SpeechIndicator />
            <div className="absolute -inset-1 border-2 border-gray-800 rounded-lg z-20 pointer-events-none"></div>
          <div className="absolute -bottom-1 left-0 right-0 h-1 bg-black/50 blur-sm z-30"></div>
          </div>
        </div>
      </div>
    )
  }  // Special handling for level 50 (elevator puzzle)
  if (level === 50) {
    return (
      <div className="grid grid-cols-2 gap-3 mb-4 animate-fadeIn">
        {/* Character image (Devil) */}
        <CharacterDisplayWrapper character="devil" onGuardClick={onGuardClick} enableInteraction={true} />

        {/* Location image - always clickable for elevator access */}
        <div className="flex justify-center items-center cursor-pointer" onClick={onLocationClick}>
          <div className="w-40 h-40 relative pixelated-container">
            <div className="absolute inset-0 bg-black/30 rounded-lg z-0"></div>
            <Image
              src={hasUsedElevator || showElevator || jigsawComplete ? "/images/elevator.webp" : "/images/hell-bg.webp"}
              alt={`${setting} location`}
              width={160}
              height={160}
              className="pixelated z-10 relative"
            />            <div className="absolute -inset-1 border-2 border-gray-800 rounded-lg z-20 pointer-events-none"></div>
            <div className="absolute -bottom-1 left-0 right-0 h-1 bg-black/50 blur-sm z-30"></div>
          </div>
        </div>
      </div>
    )
  }

  // Default display for all other levels (including level 38)
  const getLocationImageSrc = () => {
    if (puzzle.isMurderMysteryPuzzle && murderMysteryLocation) {
      switch (murderMysteryLocation) {
        case "library":
          return "/images/murder-mystery/library.webp"
        case "police station":
          return "/images/murder-mystery/police-station.webp"
        case "morgue":
          return "/images/murder-mystery/morgue.webp"
        case "crime scene":
        default:
          return "/images/murder-mystery/crime-scene-loc.webp"
      }
    }
    return puzzle.locationImage || `/images/${setting}-bg.webp`
  }

  return (
    <div className="grid grid-cols-2 gap-3 mb-4 animate-fadeIn">
      <CharacterDisplayWrapper character={character} onGuardClick={onGuardClick} enableInteraction={true} />
      <div className="flex justify-center items-center">
        <div className="w-40 h-40 relative pixelated-container">
          <div className="absolute inset-0 bg-black/30 rounded-lg z-0"></div>
          <Image
            src={getLocationImageSrc()}
            alt={`${setting} location`}
            width={160}
            height={160}
            className="pixelated z-10 relative w-full h-full object-contain"
          />
          <div className="absolute -inset-1 border-2 border-gray-800 rounded-lg z-20 pointer-events-none"></div>
          <div className="absolute -bottom-1 left-0 right-0 h-1 bg-black/50 blur-sm z-30"></div>
        </div>
      </div>
    </div>
  )
}