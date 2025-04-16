"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Play, HelpCircle, BookOpen, Volume2, VolumeX, Sparkles } from "lucide-react"

interface SplashScreenProps {
  onNewGame: () => void
  onContinue: () => void
  onRestart: () => void
  hasSavedGame: boolean
  soundEnabled: boolean
  toggleSound: () => void
}

export default function SplashScreen({
  onNewGame,
  onContinue,
  onRestart,
  hasSavedGame,
  soundEnabled,
  toggleSound,
}: SplashScreenProps) {
  const [showHowToPlay, setShowHowToPlay] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [logoScale, setLogoScale] = useState(1)

  // Add title animation effect
  useEffect(() => {
    setIsAnimating(true)

    // Pulse animation for logo
    const interval = setInterval(() => {
      setLogoScale((prev) => (prev === 1 ? 1.05 : 1))
    }, 2000)

    const timer = setTimeout(() => {
      setIsAnimating(false)
    }, 1500)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="w-full max-w-md mx-auto p-4 rounded-lg bg-black min-h-[100vh] flex flex-col relative overflow-hidden border-gray-800 touch-none">
      {/* Animated background particles */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        <div className="stars-container">
          <div className="stars"></div>
          <div className="stars2"></div>
          <div className="stars3"></div>
        </div>
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

      <div className="relative z-0 flex-1 flex flex-col items-center justify-center pt-10">
        <div
          className={`mb-8 transform transition-transform duration-1000 ${isAnimating ? "scale-110" : ""}`}
          style={{ transform: `scale(${logoScale})`, transition: "transform 1s ease-in-out" }}
        >
          <div className="w-72 h-72 relative mx-auto mb-4">
            <Image src="/images/logo.webp" alt="Riddle Escape" width={288} height={288} className="pixelated" />
          </div>
        </div>

        {!showHowToPlay ? (
          <div className="flex flex-col gap-4 w-64 mt-8 animate-fadeIn z-20">
            <button
              onClick={onNewGame}
              className="px-6 py-4 bg-purple-900 hover:bg-purple-800 rounded-xl font-pixel transition-all duration-300 border-2 border-purple-700 text-purple-200 flex items-center justify-center gap-2 shadow-[0_4px_0_rgba(0,0,0,0.3)] hover:shadow-[0_2px_0_rgba(0,0,0,0.3)] hover:translate-y-[2px] active:translate-y-[4px] active:shadow-none"
            >
              <Play className="w-5 h-5" />
              New Game
            </button>

            <button
              onClick={onContinue}
              disabled={!hasSavedGame}
              className={`px-6 py-4 rounded-xl font-pixel transition-all duration-300 border-2 flex items-center justify-center gap-2 shadow-[0_4px_0_rgba(0,0,0,0.3)] hover:shadow-[0_2px_0_rgba(0,0,0,0.3)] hover:translate-y-[2px] active:translate-y-[4px] active:shadow-none ${
                hasSavedGame
                  ? "bg-teal-900 hover:bg-teal-800 border-teal-700 text-teal-300"
                  : "bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed"
              }`}
            >
              <BookOpen className="w-5 h-5" />
              Continue
            </button>

            <button
              onClick={() => setShowHowToPlay(true)}
              className="px-6 py-4 bg-indigo-900 hover:bg-indigo-800 rounded-xl font-pixel transition-all duration-300 border-2 border-indigo-700 text-indigo-300 flex items-center justify-center gap-2 shadow-[0_4px_0_rgba(0,0,0,0.3)] hover:shadow-[0_2px_0_rgba(0,0,0,0.3)] hover:translate-y-[2px] active:translate-y-[4px] active:shadow-none"
            >
              <HelpCircle className="w-5 h-5" />
              How to Play
            </button>
          </div>
        ) : (
          <div className="bg-black/70 p-6 rounded-lg border border-gray-800 max-w-lg mx-4 shadow-lg backdrop-blur-sm animate-fadeIn z-20">
            <h2 className="text-xl font-pixel text-purple-300 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" /> How to Play
            </h2>

            <div className="space-y-4 text-gray-300 font-pixel text-sm">
              <p>Solve riddles and puzzles to escape from each location and progress through the game.</p>

              <div>
                <h3 className="text-purple-300 mb-1">Puzzle Types:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Word riddles</li>
                  <li>Math problems</li>
                  <li>Logic puzzles</li>
                  <li>Pattern recognition</li>
                  <li>Visual puzzles</li>
                </ul>
              </div>

              <div>
                <h3 className="text-purple-300 mb-1">Tips:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Read each riddle carefully</li>
                  <li>Use hints if you get stuck</li>
                  <li>Type your answer and swipe to submit</li>
                  <li>For testing, use the secret key: TIENGVIET</li>
                </ul>
              </div>

              <div>
                <h3 className="text-purple-300 mb-1">Game Features:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Your progress is automatically saved</li>
                  <li>Hints are available for each puzzle</li>
                  <li>Atmospheric sound effects and music</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setShowHowToPlay(false)}
                className="px-4 py-3 bg-purple-900 hover:bg-purple-800 rounded-xl font-pixel transition-all duration-300 border-2 border-purple-700 text-purple-300 shadow-[0_4px_0_rgba(0,0,0,0.3)] hover:shadow-[0_2px_0_rgba(0,0,0,0.3)] hover:translate-y-[2px] active:translate-y-[4px] active:shadow-none"
              >
                Back to Menu
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="relative z-20 text-center text-xs text-gray-500 mt-4 mb-2">v1.0.0 • Tap to interact</div>
    </div>
  )
}
