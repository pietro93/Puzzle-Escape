"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { ChevronRight, SkipForward } from "lucide-react"
import { characterImageMap } from "@/utils/dialogue-utils"
import type { LevelIntroScene } from "@/data/level-intro-scenes"

interface LevelIntroSceneProps {
  scene: LevelIntroScene
  onContinue: () => void
}

export default function LevelIntroSceneView({ scene, onContinue }: LevelIntroSceneProps) {
  const [currentLine, setCurrentLine] = useState(0)
  const [textVisible, setTextVisible] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [skipTyping, setSkipTyping] = useState(false)
  const [showSkipButton, setShowSkipButton] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowSkipButton(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const text = scene.lines[currentLine]

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
    }, 25)

    return () => clearInterval(typingInterval)
  }, [currentLine, skipTyping, scene])

  const handleContinue = () => {
    if (isTyping) {
      setSkipTyping(true)
      return
    }

    if (currentLine < scene.lines.length - 1) {
      setCurrentLine(currentLine + 1)
      setSkipTyping(false)
    } else {
      onContinue()
    }
  }

  const isLastLine = currentLine === scene.lines.length - 1

  return (
    <div className="w-full max-w-md mx-auto p-4 min-h-[100vh] flex flex-col relative overflow-hidden bg-black">
      <div className="absolute inset-0 bg-black/60 z-0" />

      {showSkipButton && (
        <div className="absolute top-4 left-4 z-20">
          <button
            onClick={onContinue}
            className="px-3 py-1.5 bg-gray-800/80 rounded-full text-xs text-gray-300 flex items-center gap-1 border border-gray-700 hover:bg-gray-700/80 transition-colors"
          >
            <SkipForward className="w-3 h-3" /> Skip
          </button>
        </div>
      )}

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-6">
        <div className="w-32 h-32 relative pixelated-container shrink-0">
          <div className="absolute inset-0 bg-black/30 rounded-lg z-0" />
          <Image
            src={characterImageMap[scene.character] || "/placeholder.svg"}
            alt={scene.character}
            width={128}
            height={128}
            className="pixelated z-10 relative"
          />
          <div className="absolute -inset-1 border-2 border-gray-800 rounded-lg z-20 pointer-events-none" />
        </div>

        <div
          className="bg-black/70 p-5 rounded-lg border border-gray-800 w-full min-h-[160px] flex flex-col shadow-lg backdrop-blur-sm"
          onClick={handleContinue}
        >
          <p className="font-pixel text-sm text-gray-300 mb-4 flex-1 leading-relaxed">
            {textVisible}
            {isTyping && <span className="animate-pulse">|</span>}
          </p>

          <div className="flex justify-between items-center">
            <p className="text-xs text-purple-400/70 animate-pulse font-pixel">Tap to continue...</p>

            {isLastLine && !isTyping && (
              <button
                onClick={onContinue}
                className="px-4 py-2 bg-purple-900/80 hover:bg-purple-800 rounded-xl font-pixel transition-colors border-2 border-purple-700 text-purple-300 flex items-center gap-1 shadow-[0_4px_0_rgba(0,0,0,0.3)] active:shadow-none active:translate-y-1"
              >
                Begin <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
