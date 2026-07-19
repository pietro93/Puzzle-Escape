"use client"

import { useState, useEffect } from "react"
import type { Transition } from "@/types/transition"
import Image from "next/image"
import { ChevronRight, SkipForward, Volume2, VolumeX } from "lucide-react"

interface TransitionScreenProps {
  transition: Transition
  onContinue: () => void
  soundEnabled: boolean
  toggleSound: () => void
}

export default function TransitionScreen({ transition, onContinue, soundEnabled, toggleSound }: TransitionScreenProps) {
  // State
  const [currentParagraph, setCurrentParagraph] = useState(0)
  const [textVisible, setTextVisible] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [skipTyping, setSkipTyping] = useState(false)
  const [showSkipButton, setShowSkipButton] = useState(false)
  const [currentImage, setCurrentImage] = useState<string>("")
  const [fadeIn, setFadeIn] = useState(false)

  // Helper functions
  const getPreviousCharacter = (nextLocation: string): string => {
    const characterMap: Record<string, string> = {
      "the Mansion": "/images/skeleton.webp", // Coming from prison
      "the Forest": "/images/butler.webp", // Coming from mansion
      "the Desert": "/images/gypsy.webp", // Coming from forest
      "the Afterlife": "/images/sphinx.webp", // Coming from desert
    }

    return characterMap[nextLocation] || "/images/skeleton.webp"
  }

  const getPreviousLocation = (nextLocation: string): string => {
    const locationMap: Record<string, string> = {
      "the Mansion": "/images/prison-bg.webp", // Coming from prison
      "the Forest":
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mansion-Qd9jgVQwNdCF6yT2PFKtFg0KEhxQ4Q.webp", // Coming from mansion (interior)
      "the Desert": "/images/forest-bg.webp", // Coming from forest
      "the Afterlife": "/images/desert-bg.webp", // Coming from desert
    }

    return locationMap[nextLocation] || "/images/prison-bg.webp"
  }

  const getLocationFromName = (locationName: string): string => {
    const locationMap: Record<string, string> = {
      "the Mansion":
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mansion-exterior-KTmGONVi3wa6sx2G9nKqAybVn3qVV0.webp", // Mansion exterior
      "the Forest": "/images/forest-bg.webp",
      "the Desert": "/images/desert-bg.webp",
      "the Afterlife": "/images/hell-bg.webp",
    }

    return locationMap[locationName] || "/images/prison-bg.webp"
  }

  const updateImageForParagraph = (paragraphIndex: number, transition: Transition) => {
    const override = transition.paragraphImages?.[paragraphIndex]
    if (override) {
      setCurrentImage(override)
      setFadeIn(false)
      setTimeout(() => {
        setFadeIn(true)
      }, 50)
      return
    }

    const totalParagraphs = transition.paragraphs.length

    if (paragraphIndex < Math.floor(totalParagraphs / 4)) {
      // First quarter: Previous character
      setCurrentImage(getPreviousCharacter(transition.nextLocation))
    } else if (paragraphIndex < Math.floor(totalParagraphs / 2)) {
      // Second quarter: Previous location
      setCurrentImage(getPreviousLocation(transition.nextLocation))
    } else if (paragraphIndex < Math.floor((3 * totalParagraphs) / 4)) {
      // Third quarter: New location
      const locationImage = getLocationFromName(transition.nextLocation)
      setCurrentImage(locationImage)
    } else {
      // Last quarter: New character
      setCurrentImage(transition.characterImage)
    }

    // Reset and trigger fade-in animation
    setFadeIn(false)
    setTimeout(() => {
      setFadeIn(true)
    }, 50)
  }

  // Show skip button after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkipButton(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  // Set initial image
  useEffect(() => {
    // Start with the character from the previous location
    const previousCharacter = getPreviousCharacter(transition.nextLocation)
    setCurrentImage(previousCharacter)

    // Add fade-in effect
    setTimeout(() => {
      setFadeIn(true)
    }, 100)
  }, [transition.nextLocation])

  // Text typing effect
  useEffect(() => {
    if (currentParagraph >= transition.paragraphs.length) return

    const text = transition.paragraphs[currentParagraph]

    // Update the displayed image based on paragraph number
    updateImageForParagraph(currentParagraph, transition)

    if (skipTyping) {
      setTextVisible(text)
      setIsTyping(false)
      return
    }

    let index = 0
    setIsTyping(true)

    const typingInterval = setInterval(() => {
      if (index <= text.length) {
        setTextVisible(text.slice(0, index))
        index++
      } else {
        clearInterval(typingInterval)
        setIsTyping(false)
      }
    }, 30) // Adjust typing speed here

    return () => clearInterval(typingInterval)
  }, [currentParagraph, skipTyping, transition])

  // Event handlers
  const handleContinue = () => {
    if (isTyping) {
      // If still typing, show full text immediately
      setSkipTyping(true)
      return
    }

    if (currentParagraph < transition.paragraphs.length - 1) {
      // Move to next paragraph
      setCurrentParagraph(currentParagraph + 1)
      setSkipTyping(false)
    } else {
      // Finished all paragraphs
      onContinue()
    }
  }

  const skipTransition = () => {
    onContinue()
  }

  return (
    <div
      className={`w-full max-w-md mx-auto p-4 rounded-lg transition-colors duration-1000 min-h-[100vh] flex flex-col relative overflow-hidden bg-black`}
    >
      <div className="absolute inset-0 bg-black/50 z-0"></div>

      {/* Background image */}
      <div className="absolute inset-0 z-0 opacity-70">
        <Image
          src={transition.backgroundImage.replace(".png", ".webp") || "/placeholder.svg"}
          alt={transition.title}
          fill
          className="object-cover pixelated"
        />
      </div>

      {/* Sound toggle button */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={toggleSound}
          className="w-10 h-10 rounded-full bg-gray-800/80 flex items-center justify-center border border-gray-700 hover:bg-gray-700/80 transition-colors"
        >
          {soundEnabled ? (
            <Volume2 className="w-5 h-5 text-purple-300" />
          ) : (
            <VolumeX className="w-5 h-5 text-gray-500" />
          )}
        </button>
      </div>

      {/* Skip button */}
      {showSkipButton && (
        <div className="absolute top-4 left-4 z-20">
          <button
            onClick={skipTransition}
            className="px-3 py-1.5 bg-gray-800/80 rounded-full text-xs text-gray-300 flex items-center gap-1 border border-gray-700 hover:bg-gray-700/80 transition-colors"
          >
            <SkipForward className="w-3 h-3" /> Skip
          </button>
        </div>
      )}

      <div className="relative z-10 flex-1 flex flex-col pt-8">
        <h2 className="text-2xl font-pixel text-purple-300 mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-center">
          {transition.title}
        </h2>

        <div className="flex-1 flex flex-col gap-6 items-center">
          {/* Character/Location image */}
          <div
            className={`w-48 h-48 relative pixelated-container shrink-0 transition-opacity duration-500 ${fadeIn ? "opacity-100" : "opacity-0"}`}
          >
            <div className="absolute inset-0 bg-black/30 rounded-lg z-0"></div>
            <Image
              src={currentImage || "/placeholder.svg"}
              alt="Transition scene"
              width={192}
              height={192}
              className="pixelated z-10 relative"
            />
            <div className="absolute -inset-1 border-2 border-gray-800 rounded-lg z-20 pointer-events-none"></div>
            <div className="absolute -bottom-1 left-0 right-0 h-1 bg-black/50 blur-sm z-30"></div>
          </div>

          {/* Text content */}
          <div
            className="bg-black/70 p-5 rounded-lg border border-gray-800 flex-1 min-h-[200px] flex flex-col shadow-lg backdrop-blur-sm"
            onClick={handleContinue}
          >
            <p className="font-pixel text-sm text-gray-300 mb-4 flex-1 leading-relaxed">
              {textVisible}
              {isTyping && <span className="animate-pulse">|</span>}
            </p>

            <div className="flex justify-between items-center">
              <p className="text-xs text-purple-400/70 animate-pulse font-pixel">Tap to continue...</p>

              {currentParagraph === transition.paragraphs.length - 1 && !isTyping && (
                <button
                  onClick={onContinue}
                  className="px-4 py-2 bg-purple-900/80 hover:bg-purple-800 rounded-xl font-pixel transition-colors border-2 border-purple-700 text-purple-300 flex items-center gap-1 shadow-[0_4px_0_rgba(0,0,0,0.3)] active:shadow-none active:translate-y-1"
                >
                  Enter {transition.nextLocation} <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
