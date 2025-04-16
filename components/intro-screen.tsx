"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronRight, SkipForward, Volume2, VolumeX } from "lucide-react"

interface IntroScreenProps {
  onStart: () => void
  soundEnabled: boolean
  toggleSound: () => void
}

export default function IntroScreen({ onStart, soundEnabled, toggleSound }: IntroScreenProps) {
  const [currentParagraph, setCurrentParagraph] = useState(0)
  const [textVisible, setTextVisible] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [skipTyping, setSkipTyping] = useState(false)
  const [showSkipButton, setShowSkipButton] = useState(false)
  const [showImages, setShowImages] = useState(false)

  const introParagraphs = [
    "You awaken in a cold, damp cell. The stone walls are slick with moisture, and the only light filters through a small, barred window high above.",

    "Your head throbs with a dull ache, and your memory is a fog of disconnected images. How did you get here? What crime could you have possibly committed?",

    "The sound of bones rattling against stone breaks the silence. A figure approaches your cell—a walking skeleton, its empty eye sockets somehow fixed upon you.",

    '"Solve my riddles," it rasps, voice like dry leaves scraping against stone. "And you may earn your freedom. Fail, and you\'ll remain here... forever."',
  ]

  // Show skip button after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkipButton(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  // Show images after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowImages(true)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Text typing effect for intro paragraphs
  useEffect(() => {
    if (currentParagraph >= introParagraphs.length) {
      return
    }

    const text = introParagraphs[currentParagraph]

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
  }, [currentParagraph, skipTyping, introParagraphs])

  const handleContinue = () => {
    if (isTyping) {
      // If still typing, show full text immediately
      setSkipTyping(true)
      return
    }

    if (currentParagraph < introParagraphs.length - 1) {
      // Move to next paragraph
      setCurrentParagraph(currentParagraph + 1)
      setSkipTyping(false)
    } else {
      // Start the game
      onStart()
    }
  }

  const skipIntro = () => {
    onStart()
  }

  // Determine which images to show based on current paragraph
  const showGuard = currentParagraph >= 2
  const showCell = true

  return (
    <div className="w-full max-w-md mx-auto p-4 rounded-lg bg-black min-h-[100vh] flex flex-col relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0 opacity-30">
        <Image src="/images/intro-bg.png" alt="Game Introduction" fill className="object-cover pixelated" />
      </div>

      {/* Sound toggle button */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={toggleSound}
          className="w-10 h-10 rounded-full bg-gray-800/80 flex items-center justify-center border border-gray-700"
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
            onClick={skipIntro}
            className="px-3 py-1.5 bg-gray-800/80 rounded-full text-xs text-gray-300 flex items-center gap-1 border border-gray-700"
          >
            <SkipForward className="w-3 h-3" /> Skip
          </button>
        </div>
      )}

      <div className="relative z-10 flex-1 flex flex-col pt-8">
        <h1 className="text-3xl font-pixel text-purple-300 mb-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-center">
          Puzzle Escape
        </h1>

        {/* Visual elements - prison cell and guard */}
        {showImages && (
          <div className="grid grid-cols-2 gap-3 mb-4 animate-fadeIn">
            <div className="flex justify-center items-center">
              {showGuard ? (
                <div className="w-32 h-32 relative pixelated-container transition-opacity duration-500 opacity-100">
                  <div className="absolute inset-0 bg-black/30 rounded-lg z-0"></div>
                  <Image
                    src="/images/skeleton.webp"
                    alt="Prison Guard"
                    width={128}
                    height={128}
                    className="pixelated z-10 relative"
                  />
                  <div className="absolute -inset-1 border-2 border-gray-800 rounded-lg z-20 pointer-events-none"></div>
                </div>
              ) : (
                <div className="w-32 h-32 relative pixelated-container opacity-0">
                  <div className="absolute inset-0 bg-black/30 rounded-lg z-0"></div>
                </div>
              )}
            </div>
            <div className="flex justify-center items-center">
              {showCell && (
                <div className="w-32 h-32 relative pixelated-container transition-opacity duration-500 opacity-100">
                  <div className="absolute inset-0 bg-black/30 rounded-lg z-0"></div>
                  <Image
                    src="/images/prison-cell.webp"
                    alt="Prison Cell"
                    width={128}
                    height={128}
                    className="pixelated z-10 relative"
                  />
                  <div className="absolute -inset-1 border-2 border-gray-800 rounded-lg z-20 pointer-events-none"></div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col">
          <div
            className="bg-black/70 p-4 rounded-lg border border-gray-800 flex-1 min-h-[300px] flex flex-col"
            onClick={handleContinue}
          >
            <p className="font-pixel text-base text-gray-200 mb-4 flex-1 leading-relaxed">
              {textVisible}
              {isTyping && <span className="animate-pulse">|</span>}
            </p>

            <div className="flex justify-between items-center">
              <p className="text-xs text-purple-400/70 animate-pulse font-pixel">Tap anywhere to continue...</p>

              {currentParagraph === introParagraphs.length - 1 && !isTyping && (
                <button
                  onClick={onStart}
                  className="px-4 py-3 bg-purple-900/80 hover:bg-purple-800 rounded-xl font-pixel transition-colors border-2 border-purple-700 text-purple-300 flex items-center gap-1 shadow-[0_4px_0_rgba(0,0,0,0.3)] active:shadow-none active:translate-y-1"
                >
                  Begin <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
