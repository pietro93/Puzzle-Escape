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
  onGuardClick: () => void
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
  showElevator = false,
  jigsawComplete = false,
  onGuardClick,
  onLocationClick,
  onPyramidLocationImageClick,
}: CharacterLocationDisplayProps) {
  // Helper function to get the correct brain lamp image based on correct combinations
  const getBrainLampImage = (correctCount: number) => {
    switch (correctCount) {
      case 0:
        return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/brainlamp-WFdoE18rmyknvtBRPsfJ9IhWxiF6UF.webp" // 0 correct
      case 1:
        return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/brainlamp1a-jtarQ6DvWLbkdtCw85rPutJZjTRo7m.webp" // 1 correct
      case 2:
        return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/brainlamp2a.webp-UzQCOHqf2namH8byDVbukpZaSsa4hh.jpeg" // 2 correct
      case 3:
        return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/brainlamp3a.webp-qAtXl3omCCUIuJTEfDrOR67BrSbG1Q.jpeg" // 3 correct
      case 4:
        return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/brainlamp4a-Xrk7CsmuuYZ9jE2TiSiO704I0Hz7GG.webp" // 4 correct
      case 5:
        return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/brainlamp5a.webp-Zlp6vJ310VRTduwCjeLLFI19WZmY3t.jpeg" // 5 correct
      case 6:
        return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/brainlamp6a.webp-tFVEX3bXENwvQR5P0V3jv2zOyTb7u4.jpeg" // 6 correct (all)
      default:
        return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/brainlamp-WFdoE18rmyknvtBRPsfJ9IhWxiF6UF.webp" // Default
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

    // Ra room with no torch
    if (currentPyramidRoom === "ra" && !hasPyramidTorch) {
      return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pyramid-inside-lit-VmsutDcMH6wQp2notj76LQQo7dgKut.webp"
    }

    // Dark mural rooms with no torch
    if (!hasPyramidTorch && ["mural1", "mural2", "mural3", "mural4"].includes(currentPyramidRoom)) {
      return "/images/pitch-darkness.webp"
    }

    // Default for all other rooms or when torch is present
    return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pyramid-inside-DpO8zywmCoFoK1uuVLRL6w0rd7yZTt.webp"
  }

  // Special handling for level 17 (light switch puzzle)
  if (level === 17) {
    return (
      <div className="grid grid-cols-2 gap-3 mb-4 animate-fadeIn">
        <div className="flex justify-center items-center">
          <div className="w-40 h-40 relative pixelated-container bg-black">
            <div className="absolute inset-0 bg-black rounded-lg z-0"></div>
            <Image
              src={
                solved
                  ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/the-butler-UiGmVrOHpSIeCMysGrv0fnFXeIKb8c.webp" // the-butler.webp
                  : lightsOn
                    ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/the-butler-undead-MP8fUsQPQyAfYNqQ8vh5jHD6ccDAiX.webp" // butler-undead.webp
                    : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pitch-darkness-hHHhjqR7LwsUXdako3Kczz70K9LK40.webp" // pitch-darkness.webp
              }
              alt={lightsOn ? "Butler" : "Darkness"}
              width={160}
              height={160}
              className="pixelated"
            />
          </div>
        </div>
        <div className="flex justify-center items-center">
          <div className="w-40 h-40 relative pixelated-container bg-black">
            <div className="absolute inset-0 bg-black rounded-lg z-0"></div>
            <Image
              src={
                solved
                  ? "https://v0.blob.com/mansion-8F0FXySQS7FpTruWOt1MsbbrL7IKiw.webp" // mansion.webp
                  : lightsOn
                    ? "https://v0.blob.com/mansion-lit-Y00BfTg0ZTovGTlXIoaVpm4btmNctX.webp" // Updated mansion-lit.webp
                    : "https://v0.blob.com/pitch-darkness-hHHhjqR7LwsUXdako3Kczz70K9LK40.webp" // pitch-darkness.webp
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
        <div className="flex justify-center items-center">
          <CharacterImage character={character} />
        </div>
        <div className="flex justify-center items-center">
          <LocationImage setting={setting} customImage={puzzle.locationImage} hintImage={puzzle.imageHint} />
        </div>
      </div>
    )
  }

  // Special handling for level 39 (Egyptian math puzzle)
  if (level === 39) {
    return (
      <div className="grid grid-cols-2 gap-3 mb-4 animate-fadeIn">
        <div className="flex justify-center items-center cursor-pointer" onClick={onGuardClick}>
          <CharacterImage character={character} />
        </div>
        <div className="flex justify-center items-center">
          <div className="w-40 h-40 relative pixelated-container bg-black">
            <div className="absolute inset-0 bg-black rounded-lg z-0"></div>
            <LocationImage setting={setting} customImage={null} hintImage={null} />
          </div>
        </div>
      </div>
    )
  }

  // Special handling for level 40 (pyramid puzzle)
  if (level === 40) {
    return (
      <div className="grid grid-cols-2 gap-3 mb-4 animate-fadeIn">
        <div className="flex justify-center items-center cursor-pointer" onClick={onGuardClick}>
          <CharacterImage character={character} />
        </div>
        <div className="flex justify-center items-center cursor-pointer" onClick={onPyramidLocationImageClick}>
          <div className="w-40 h-40 relative pixelated-container bg-black">
            <div className="absolute inset-0 bg-black rounded-lg z-0"></div>
            <Image
              src={getPyramidLocationImage() || `/images/${setting}-bg.webp`}
              alt={`${setting} location`}
              width={160}
              height={160}
              className="pixelated z-10 relative"
            />
          </div>
        </div>
      </div>
    )
  }

  // Special handling for level 47 (brain lamp puzzle)
  if (level === 47) {
    return (
      <div className="grid grid-cols-2 gap-3 mb-4 animate-fadeIn">
        <div className="flex justify-center items-center cursor-pointer" onClick={onGuardClick}>
          <CharacterImage character={character} />
        </div>
        <div
          className="flex justify-center items-center cursor-pointer"
          onClick={() => {
            // Call the location click handler which will trigger the dialogue
            if (onPyramidLocationImageClick) {
              onPyramidLocationImageClick()
            }
          }}
        >
          <div className="w-40 h-40 relative pixelated-container bg-black">
            <div className="absolute inset-0 bg-black rounded-lg z-0"></div>
            <Image
              src={getBrainLampImage(binaryCorrectCombinations) || "/images/brainlamp.webp"}
              alt="Brain Lamp"
              width={160}
              height={160}
              className="pixelated z-10 relative w-full h-full object-contain"
              style={{ opacity: getBrainLampOpacity(binaryCorrectCombinations) }}
            />
          </div>
        </div>
      </div>
    )
  }

  // Special handling for level 50 (elevator puzzle)
  if (level === 50) {
    return (
      <div className="grid grid-cols-2 gap-3 mb-4 animate-fadeIn">
        {/* Character image (Devil) */}
        <div className="flex justify-center items-center">
          <CharacterImage character="devil" />
        </div>

        {/* Location image - always clickable for elevator access */}
        <div className="flex justify-center items-center cursor-pointer" onClick={onLocationClick}>
          <div className="w-40 h-40 relative pixelated-container bg-black">
            <div className="absolute inset-0 bg-black rounded-lg z-0"></div>
            <Image
              src={hasUsedElevator || showElevator || jigsawComplete ? "/images/elevator.webp" : "/images/hell-bg.webp"}
              alt={`${setting} location`}
              width={160}
              height={160}
              className="pixelated z-10 relative"
            />
          </div>
        </div>
      </div>
    )
  }

  // Special handling for level 49 (murder mystery)
  if (level === 49) {
    return (
      <div className="grid grid-cols-2 gap-3 mb-4 animate-fadeIn">
        {/* Character image (Policewoman) */}
        <div className="flex justify-center items-center">
          <div className="w-40 h-40 relative pixelated-container">
            <div className="absolute inset-0 bg-black rounded-lg z-0"></div>
            <Image
              src="/images/murder-mystery/policewoman.webp"
              alt="Policewoman"
              width={160}
              height={160}
              className="pixelated z-10 relative"
            />
          </div>
        </div>

        {/* Location image (Police Station) */}
        <div className="flex justify-center items-center">
          <div className="w-40 h-40 relative pixelated-container">
            <div className="absolute inset-0 bg-black rounded-lg z-0"></div>
            <Image
              src="/images/prison-bg.webp" // Use prison exterior as police station for now
              alt="Police Station"
              width={160}
              height={160}
              className="pixelated z-10 relative"
            />
          </div>
        </div>
      </div>
    )
  }

  // Default display for all other levels
  return (
    <div className="grid grid-cols-2 gap-3 mb-4 animate-fadeIn">
      <div className="flex justify-center items-center cursor-pointer" onClick={onGuardClick}>
        <CharacterImage character={character} />
      </div>
      <div className="flex justify-center items-center">
        <div className="w-40 h-40 relative pixelated-container">
          <div className="absolute inset-0 bg-black rounded-lg z-0"></div>
          <Image
            src={puzzle.locationImage || `/images/${setting}-bg.webp`}
            alt={`${setting} location`}
            width={160}
            height={160}
            className="pixelated z-10 relative"
          />
        </div>
      </div>
    </div>
  )
}
