"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Send, X } from "lucide-react"
import { createParrotDialogueManager } from "../utils/parrot-dialogue-manager"

interface ParrotPuzzleProps {
  onSolve: () => void
}

export default function ParrotPuzzle({ onSolve }: ParrotPuzzleProps) {
  const [input, setInput] = useState("")
  const [parrotText, setParrotText] = useState("")
  const [showParrotText, setShowParrotText] = useState(false)
  const [solutionState, setSolutionState] = useState<"initial" | "askAgain" | "askOneMoreTime" | "solved">("initial")
  const [idleTimer, setIdleTimer] = useState<NodeJS.Timeout | null>(null)
  const [textTimer, setTextTimer] = useState<NodeJS.Timeout | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [songLines, setSongLines] = useState<string[]>([])
  const [currentSongLine, setCurrentSongLine] = useState(0)
  const [isSinging, setIsSinging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }

    // Start with an idle message
    const randomIdleMessage = getRandomIdleMessage()
    setParrotText(randomIdleMessage)
    setShowParrotText(true)

    // Set timer to hide the text after a few seconds
    const timer = setTimeout(() => {
      setShowParrotText(false)
    }, 4000)
    setTextTimer(timer)

    // Start idle timer
    startIdleTimer()

    return () => {
      if (idleTimer) clearTimeout(idleTimer)
      if (textTimer) clearTimeout(textTimer)
    }
  }, [])

  // Handle song lines display
  useEffect(() => {
    if (isSinging && songLines.length > 0) {
      if (currentSongLine < songLines.length) {
        setParrotText(songLines[currentSongLine])
        setShowParrotText(true)

        // Clear any existing text timer
        if (textTimer) clearTimeout(textTimer)

        // Set timer for next line
        const timer = setTimeout(() => {
          setCurrentSongLine(currentSongLine + 1)
        }, 2000)

        return () => clearTimeout(timer)
      } else {
        setIsSinging(false)
        setCurrentSongLine(0)
        setSongLines([])
        setShowParrotText(false)
        startIdleTimer()
      }
    }
  }, [isSinging, songLines, currentSongLine])

  const startIdleTimer = () => {
    if (idleTimer) clearTimeout(idleTimer)

    const timer = setTimeout(() => {
      const randomIdleMessage = getRandomIdleMessage()
      setParrotText(randomIdleMessage)
      setShowParrotText(true)

      // Set timer to hide the text after a few seconds
      if (textTimer) clearTimeout(textTimer)
      const hideTimer = setTimeout(() => {
        setShowParrotText(false)
      }, 4000)
      setTextTimer(hideTimer)

      // Restart the idle timer
      startIdleTimer()
    }, 6000) // Every 6 seconds

    setIdleTimer(timer)
  }

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (!input.trim()) return

    // Reset idle timer
    if (idleTimer) clearTimeout(idleTimer)
    if (textTimer) clearTimeout(textTimer)

    // Process input and get parrot response
    const response = getParrotResponse(input.trim().toLowerCase())

    // Add animation effect
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 300)

    // Set parrot text
    if (response.includes("\n")) {
      // Handle multi-line responses (song lyrics)
      const lines = response.split("\n")
      setSongLines(lines)
      setCurrentSongLine(0)
      setIsSinging(true)
    } else {
      setParrotText(response)
      setShowParrotText(true)

      // Set timer to hide the text after a few seconds
      const timer = setTimeout(() => {
        setShowParrotText(false)
      }, 4000)
      setTextTimer(timer)

      startIdleTimer()
    }

    // Clear input
    setInput("")

    // Focus back on input
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  // Initialize the dialogue manager
  const dialogueManager = useRef(createParrotDialogueManager())

  const getParrotResponse = (userInput: string): string => {
    const { response, newSolutionState, isMultiline } = dialogueManager.current.getResponse(userInput, solutionState)

    // Update solution state if it changed
    if (newSolutionState !== solutionState) {
      setSolutionState(newSolutionState)
    }

    return response
  }

  const getRandomIdleMessage = (): string => {
    return dialogueManager.current.getIdleMessage()
  }

  return (
    <div className="flex flex-col items-center bg-black p-4 rounded-lg border border-gray-800">
      {/* Parrot dialogue - always maintain space for two lines */}
      <div className="w-full text-center mb-4 min-h-[4rem] flex items-center justify-center">
        <p
          className={`font-pixel text-red-500 text-xl ${isAnimating ? "animate-pulse" : ""} ${showParrotText ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
        >
          {parrotText}
        </p>
      </div>

      {/* Parrot image */}
      <div className="relative w-48 h-48 mb-6">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/parrot-UvpxkpcUuDXwkXXSaORum0qLy4nqvs.webp"
          alt="Count Papagalul"
          width={250}
          height={250}
          className="pixelated"
        />
      </div>

      {/* Input for talking to parrot */}
      <form onSubmit={handleSubmit} className="w-full mb-4">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Talk to Count Papagalul..."
            className="w-full px-4 py-3 bg-gray-900/80 border-2 border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-600 font-mono text-center transition-all duration-300 shadow-lg"
          />

          {input && (
            <button
              type="button"
              onClick={() => setInput("")}
              className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <button
            type="submit"
            disabled={!input.trim()}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
              input.trim()
                ? "bg-purple-900 hover:bg-purple-800 text-white"
                : "bg-gray-800 text-gray-600 cursor-not-allowed"
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  )
}
