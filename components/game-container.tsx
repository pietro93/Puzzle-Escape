"use client"

import { useState, useEffect, useCallback } from "react"
import SplashScreen from "./splash-screen"
import GameScreen from "./game-screen"
import { puzzleData } from "@/data/puzzles"
import { useAudio } from "@/hooks/use-audio"
import { useStorage } from "@/hooks/use-storage"
import { useHaptics } from "@/hooks/use-haptics"
import { usePlatform } from "@/hooks/use-platform"

const SAVE_KEY = "math-riddles-save"

export default function GameContainer() {
  const [showSplash, setShowSplash] = useState(true)
  const [gameStarted, setGameStarted] = useState(false)
  const [currentLevel, setCurrentLevel] = useState(49) // Start at level 49
  const [showCongrats, setShowCongrats] = useState(false)
  const [hasSavedGame, setHasSavedGame] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)

  const {
    playBackgroundMusic,
    stopBackgroundMusic,
    playCorrectSound: playCorrectSoundBase,
    playWrongSound: playWrongSoundBase,
    playButtonSound: playButtonSoundBase,
    isMuted,
    toggleMute,
  } = useAudio()

  const { saveGame, loadGame, clearGame } = useStorage()
  const { platform, isNative } = usePlatform()
  const { impact, notification } = useHaptics()

  // Check for saved game on mount
  useEffect(() => {
    const loadSavedGame = async () => {
      const savedGame = await loadGame()
      if (savedGame) {
        setHasSavedGame(true)
        if (savedGame.level) setCurrentLevel(savedGame.level)
        if (savedGame.soundEnabled !== undefined) setSoundEnabled(savedGame.soundEnabled)
      }
    }

    loadSavedGame()
  }, [loadGame])

  // Start background music when game starts
  useEffect(() => {
    if (gameStarted && soundEnabled) {
      playBackgroundMusic()
    }

    return () => {
      stopBackgroundMusic()
    }
  }, [gameStarted, soundEnabled, playBackgroundMusic, stopBackgroundMusic])

  // Save game progress
  useEffect(() => {
    if (gameStarted) {
      saveGame({
        level: currentLevel,
        soundEnabled,
      })
      setHasSavedGame(true)
    }
  }, [currentLevel, gameStarted, soundEnabled, saveGame])

  const startNewGame = () => {
    playButtonSound()
    setShowSplash(false)
    setGameStarted(true)
  }

  const continueGame = () => {
    playButtonSound()
    if (typeof window !== "undefined") {
      const savedGame = localStorage.getItem(SAVE_KEY)
      if (savedGame) {
        try {
          const { level, soundEnabled: savedSoundEnabled } = JSON.parse(savedGame)
          setCurrentLevel(level)
          if (savedSoundEnabled !== undefined) setSoundEnabled(savedSoundEnabled)
          setShowSplash(false)
          setGameStarted(true)
        } catch (e) {
          console.error("Error parsing saved game", e)
        }
      }
    }
  }

  const restartGame = () => {
    playButtonSound()
    setCurrentLevel(49)
    setShowCongrats(false)
    setShowSplash(false)
    setGameStarted(true)
  }

  const resetGame = () => {
    playButtonSound()
    clearGame()
    setCurrentLevel(49)
    setShowCongrats(false)
    setShowSplash(true)
    setGameStarted(false)
    setHasSavedGame(false)
  }

  const handleWrongAnswer = () => {
    playWrongSound()
  }

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled)
    toggleMute()
  }

  // Get current setting and character based on level
  const getCurrentSetting = () => {
    return { setting: "hell", character: "devil" }
  }

  const playCorrectSound = useCallback(() => {
    if (soundEnabled) {
      playCorrectSoundBase()
    }

    // Add haptic feedback
    notification("success")
  }, [soundEnabled, notification, playCorrectSoundBase])

  const playWrongSound = useCallback(() => {
    if (soundEnabled) {
      playWrongSoundBase()
    }

    // Add haptic feedback
    notification("error")
  }, [soundEnabled, notification, playWrongSoundBase])

  const playButtonSound = useCallback(() => {
    if (soundEnabled) {
      playButtonSoundBase()
    }

    // Add haptic feedback
    impact("light")
  }, [soundEnabled, impact, playButtonSoundBase])

  return (
    <div className="relative w-full h-full flex flex-col">
      {showSplash && (
        <SplashScreen
          onNewGame={startNewGame}
          onContinue={continueGame}
          onRestart={restartGame}
          hasSavedGame={hasSavedGame}
          soundEnabled={soundEnabled}
          toggleSound={toggleSound}
        />
      )}

      {gameStarted &&
        (() => {
          const { setting, character } = getCurrentSetting()

          // Find the current puzzle
          const currentPuzzle = puzzleData.find((p) => p.level === currentLevel)

          // If puzzle not found, skip to the next available puzzle
          if (!currentPuzzle) {
            return null
          }

          return (
            <GameScreen
              level={currentLevel}
              setting={setting}
              character={character}
              puzzle={currentPuzzle}
              onCorrect={startNewGame}
              onWrong={handleWrongAnswer}
              soundEnabled={soundEnabled}
              toggleSound={toggleSound}
            />
          )
        })()}
    </div>
  )
}
