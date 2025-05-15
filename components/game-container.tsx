"use client"

import { useState, useEffect, useCallback } from "react"
import SplashScreen from "./splash-screen"
import IntroScreen from "./intro-screen"
import GameScreen from "./game-screen"
import TransitionScreen from "./transition-screen"
import OutroScreen from "./outro-screen"
import { puzzleData } from "@/data/puzzles"
import { transitions } from "@/data/transitions"
import { useAudio } from "@/hooks/use-audio"
import { useStorage } from "@/hooks/use-storage"
import { usePlatform } from "@/hooks/use-platform"
import { useHaptics } from "@/hooks/use-haptics"

// Local storage keys
const SAVE_KEY = "riddle_escape_save"

export default function GameContainer() {
  // Game state
  const [showSplash, setShowSplash] = useState(true)
  const [gameStarted, setGameStarted] = useState(false)
  const [showIntro, setShowIntro] = useState(false)
  const [currentLevel, setCurrentLevel] = useState(1)
  const [showCongrats, setShowCongrats] = useState(false)
  const [showTransition, setShowTransition] = useState(false)
  const [currentTransition, setCurrentTransition] = useState(0)
  const [hasSavedGame, setHasSavedGame] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)

  // Hooks
  const {
    playBackgroundMusic,
    stopBackgroundMusic,
    playCorrectSound: playCorrectSoundBase,
    playWrongSound: playWrongSoundBase,
    playButtonSound: playButtonSoundBase,
    playTransitionSound,
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

  // Game navigation functions
  const startNewGame = () => {
    playButtonSound()
    setShowSplash(false)
    setShowIntro(true)
  }

  const continueGame = () => {
    playButtonSound()
    loadSavedGame()
  }

  const loadSavedGame = async () => {
    const savedGame = await loadGame()
    if (savedGame) {
      if (savedGame.level) setCurrentLevel(savedGame.level)
      if (savedGame.soundEnabled !== undefined) setSoundEnabled(savedGame.soundEnabled)
      setShowSplash(false)
      setGameStarted(true)
    }
  }

  const restartGame = () => {
    playButtonSound()
    setCurrentLevel(1)
    setShowCongrats(false)
    setShowSplash(false)
    setShowIntro(true)
  }

  const startGameAfterIntro = () => {
    playButtonSound()
    setShowIntro(false)
    setGameStarted(true)
  }

  // Find the next available puzzle level
  const findNextAvailableLevel = (currentLevel: number) => {
    // If we're at a transition point, just go to the next level
    if (currentLevel === 10 || currentLevel === 20 || currentLevel === 30 || currentLevel === 40) {
      return currentLevel + 1
    }

    // If we're at level 50, we're done
    if (currentLevel >= 50) {
      return 51 // This will trigger the outro
    }

    // Find the next milestone (10, 20, 30, 40, 50)
    const nextMilestone = Math.ceil(currentLevel / 10) * 10

    // Check if there's a puzzle at the next milestone
    const puzzleExists = puzzleData.some((p) => p.level === nextMilestone)

    if (puzzleExists) {
      return nextMilestone
    } else {
      // If no puzzle at milestone, find the next available puzzle
      for (let i = currentLevel + 1; i <= 50; i++) {
        if (puzzleData.some((p) => p.level === i)) {
          return i
        }
      }
      return 51 // If no more puzzles, trigger the outro
    }
  }

  const advanceLevel = (isSkipping = false) => {
    playCorrectSound()

    if (isSkipping) {
      // When using secret key, skip to the next available puzzle
      const nextLevel = findNextAvailableLevel(currentLevel)

      if (nextLevel > 50) {
        setShowCongrats(true)
      } else if (nextLevel === 11 || nextLevel === 21 || nextLevel === 31 || nextLevel === 41) {
        // If the next level is the start of a new chapter, show transition
        const transitionIndex = Math.floor((nextLevel - 1) / 10) - 1
        setCurrentTransition(transitionIndex)
        setShowTransition(true)
        playTransitionSound()
      } else {
        setCurrentLevel(nextLevel)
      }
      return
    }

    // Normal progression
    if (currentLevel === 10 || currentLevel === 20 || currentLevel === 30 || currentLevel === 40) {
      const transitionIndex = currentLevel / 10 - 1
      setCurrentTransition(transitionIndex)
      setShowTransition(true)
      playTransitionSound()
    } else if (currentLevel < 50) {
      setCurrentLevel(currentLevel + 1)
    } else {
      setShowCongrats(true)
    }
  }

  // Sound and haptic feedback
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled)
    toggleMute()
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

  const jumpToLevel = (level: number) => {
    playButtonSound()

    // Check if the level exists in puzzleData
    const puzzleExists = puzzleData.some((p) => p.level === level)
    if (!puzzleExists) {
      console.warn(`Level ${level} does not exist in puzzleData`)
      return
    }

    setCurrentLevel(level)
  }

  const handleWrongAnswer = () => {
    playWrongSound()
  }

  const completeTransition = () => {
    playButtonSound()
    setShowTransition(false)
    setCurrentLevel(currentLevel + 1)
  }

  const resetGame = () => {
    playButtonSound()
    clearGame()
    setCurrentLevel(1)
    setShowCongrats(false)
    setShowSplash(true)
    setGameStarted(false)
    setHasSavedGame(false)
  }

  // Helper functions
  const getCurrentSetting = () => {
    if (currentLevel <= 10) return { setting: "prison", character: "skeleton" }
    if (currentLevel <= 20) return { setting: "mansion", character: "butler" }
    if (currentLevel <= 30) return { setting: "forest", character: "gypsy" }
    if (currentLevel <= 40) return { setting: "desert", character: "sphinx" }
    return { setting: "hell", character: "devil" }
  }

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

      {showIntro && <IntroScreen onStart={startGameAfterIntro} soundEnabled={soundEnabled} toggleSound={toggleSound} />}

      {showTransition && (
        <TransitionScreen
          transition={transitions[currentTransition]}
          onContinue={completeTransition}
          soundEnabled={soundEnabled}
          toggleSound={toggleSound}
        />
      )}

      {showCongrats && <OutroScreen onRestart={resetGame} soundEnabled={soundEnabled} toggleSound={toggleSound} />}

      {gameStarted &&
        !showTransition &&
        !showCongrats &&
        (() => {
          const { setting, character } = getCurrentSetting()

          // Find the current puzzle
          const currentPuzzle = puzzleData.find((p) => p.level === currentLevel)

          // If puzzle not found, skip to the next available puzzle
          if (!currentPuzzle) {
            // Find the next available puzzle
            const nextLevel = findNextAvailableLevel(currentLevel)

            // Update the level or show outro
            if (nextLevel > 50) {
              setShowCongrats(true)
              return null // Return null while state updates
            } else {
              setCurrentLevel(nextLevel)
              return null // Return null while state updates
            }
          }

          return (
            <GameScreen
              level={currentLevel}
              setting={setting}
              character={character}
              puzzle={currentPuzzle}
              onCorrect={advanceLevel}
              onWrong={handleWrongAnswer}
              soundEnabled={soundEnabled}
              toggleSound={toggleSound}
              onJumpToLevel={jumpToLevel}
            />
          )
        })()}
    </div>
  )
}
