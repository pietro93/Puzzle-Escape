"use client"

import { useState, useEffect, useRef } from "react"
import SplashScreen from "./splash-screen"
import IntroScreen from "./intro-screen"
import GameScreen from "./game-screen"
import TransitionScreen from "./transition-screen"
import OutroScreen from "./outro-screen"
import LevelIntroSceneView from "./level-intro-scene"
import { puzzleData } from "@/data/puzzles"
import { transitions } from "@/data/transitions"
import { levelIntroScenes } from "@/data/level-intro-scenes"

// Local storage keys
const SAVE_KEY = "riddle_escape_save"
const SEEN_INTROS_KEY = "puzzle_escape_seen_level_intros"

export default function GameContainer() {
  const [showSplash, setShowSplash] = useState(true)
  const [gameStarted, setGameStarted] = useState(false)
  const [showIntro, setShowIntro] = useState(false)
  const [currentLevel, setCurrentLevel] = useState(1)
  const [showCongrats, setShowCongrats] = useState(false)
  const [showTransition, setShowTransition] = useState(false)
  const [currentTransition, setCurrentTransition] = useState(0)
  const [currentPuzzle, setCurrentPuzzle] = useState<any>(null)

  // Set the current puzzle whenever the level changes
  useEffect(() => {
    const puzzle = puzzleData.find((p) => p.level === currentLevel)
    setCurrentPuzzle(puzzle)
  }, [currentLevel])
  const [hasSavedGame, setHasSavedGame] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [seenIntroLevels, setSeenIntroLevels] = useState<number[]>([])
  const [showLevelIntro, setShowLevelIntro] = useState(false)
  const [levelRestartNonce, setLevelRestartNonce] = useState(0)

  // Audio references
  const bgMusicRef = useRef<HTMLAudioElement | null>(null)
  const correctSoundRef = useRef<HTMLAudioElement | null>(null)
  const wrongSoundRef = useRef<HTMLAudioElement | null>(null)
  const buttonSoundRef = useRef<HTMLAudioElement | null>(null)
  const transitionSoundRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio elements
  useEffect(() => {
    if (typeof window !== "undefined") {
      bgMusicRef.current = new Audio("/audio/ambient-mystery.mp3")
      bgMusicRef.current.loop = true
      bgMusicRef.current.volume = 0.3

      correctSoundRef.current = new Audio("/audio/correct.mp3")
      correctSoundRef.current.volume = 0.5

      wrongSoundRef.current = new Audio("/audio/wrong.mp3")
      wrongSoundRef.current.volume = 0.5

      buttonSoundRef.current = new Audio("/audio/button-click.mp3")
      buttonSoundRef.current.volume = 0.4

      transitionSoundRef.current = new Audio("/audio/transition.mp3")
      transitionSoundRef.current.volume = 0.5
    }

    return () => {
      if (bgMusicRef.current) {
        bgMusicRef.current.pause()
        bgMusicRef.current = null
      }
      correctSoundRef.current = null
      wrongSoundRef.current = null
      buttonSoundRef.current = null
      transitionSoundRef.current = null
    }
  }, [])

  // Load which level intro scenes have already been seen
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(SEEN_INTROS_KEY)
      if (saved) {
        try {
          setSeenIntroLevels(JSON.parse(saved))
        } catch (e) {
          console.error("Error parsing seen intros", e)
        }
      }
    }
  }, [])

  // Show the level intro scene the first time a level with one is reached
  useEffect(() => {
    setShowLevelIntro(Boolean(gameStarted && levelIntroScenes[currentLevel] && !seenIntroLevels.includes(currentLevel)))
  }, [currentLevel, gameStarted, seenIntroLevels])

  const handleIntroContinue = () => {
    playButtonSound()
    setSeenIntroLevels((prev) => {
      const next = [...prev, currentLevel]
      if (typeof window !== "undefined") {
        localStorage.setItem(SEEN_INTROS_KEY, JSON.stringify(next))
      }
      return next
    })
    setShowLevelIntro(false)
  }

  // Check for saved game on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedGame = localStorage.getItem(SAVE_KEY)
      if (savedGame) {
        try {
          const parsed = JSON.parse(savedGame)
          setHasSavedGame(true)
          if (parsed.soundEnabled !== undefined) setSoundEnabled(parsed.soundEnabled)
        } catch (e) {
          console.error("Error parsing saved game", e)
        }
      }
    }
  }, [])

  // Start background music when game starts
  useEffect(() => {
    if (gameStarted && soundEnabled) {
      playBackgroundMusic()
    }

    return () => {
      stopBackgroundMusic()
    }
  }, [gameStarted, soundEnabled])

  // Save game progress
  useEffect(() => {
    if (gameStarted && typeof window !== "undefined") {
      localStorage.setItem(
        SAVE_KEY,
        JSON.stringify({
          level: currentLevel,
          soundEnabled,
        }),
      )
      setHasSavedGame(true)
    }
  }, [currentLevel, gameStarted, soundEnabled])

  const playBackgroundMusic = () => {
    if (bgMusicRef.current) {
      // Some browsers require user interaction before playing audio
      const playPromise = bgMusicRef.current.play()

      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Auto-play was prevented. User interaction required.")
        })
      }
    }
  }

  const stopBackgroundMusic = () => {
    if (bgMusicRef.current) {
      bgMusicRef.current.pause()
      bgMusicRef.current.currentTime = 0
    }
  }

  const playCorrectSound = () => {
    if (correctSoundRef.current && soundEnabled) {
      correctSoundRef.current.currentTime = 0
      correctSoundRef.current.play().catch((e) => console.log("Error playing sound:", e))
    }
  }

  const playWrongSound = () => {
    if (wrongSoundRef.current && soundEnabled) {
      wrongSoundRef.current.currentTime = 0
      wrongSoundRef.current.play().catch((e) => console.log("Error playing sound:", e))
    }
  }

  const playButtonSound = () => {
    if (buttonSoundRef.current && soundEnabled) {
      buttonSoundRef.current.currentTime = 0
      buttonSoundRef.current.play().catch((e) => console.log("Error playing sound:", e))
    }
  }

  const playTransitionSound = () => {
    if (transitionSoundRef.current && soundEnabled) {
      transitionSoundRef.current.currentTime = 0
      transitionSoundRef.current.play().catch((e) => console.log("Error playing sound:", e))
    }
  }

  const toggleMute = () => {
    setSoundEnabled(!soundEnabled)
    if (!soundEnabled) {
      if (gameStarted) {
        playBackgroundMusic()
      }
    } else {
      stopBackgroundMusic()
    }
  }

  const startNewGame = () => {
    playButtonSound()
    setShowSplash(false)
    setShowIntro(true)
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

  const completeTransition = () => {
    playButtonSound()
    setShowTransition(false)
    setCurrentLevel(currentLevel + 1)
  }

  const resetGame = () => {
    playButtonSound()
    if (typeof window !== "undefined") {
      localStorage.removeItem(SAVE_KEY)
    }
    setCurrentLevel(1)
    setShowCongrats(false)
    setShowSplash(true)
    setGameStarted(false)
    setHasSavedGame(false)
  }

  const handleWrongAnswer = () => {
    playWrongSound()
  }

  const restartLevel = () => {
    playButtonSound()
    setSeenIntroLevels((prev) => {
      const next = prev.filter((l) => l !== currentLevel)
      if (typeof window !== "undefined") {
        localStorage.setItem(SEEN_INTROS_KEY, JSON.stringify(next))
      }
      return next
    })
    setLevelRestartNonce((n) => n + 1)
  }

  const handleSolutionGenerated = (solution: string) => {
    if (currentPuzzle) {
      setCurrentPuzzle({ ...currentPuzzle, solution })
    }
  }

  // Get current setting and character based on level
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
          toggleSound={toggleMute}
        />
      )}

      {showIntro && <IntroScreen onStart={startGameAfterIntro} soundEnabled={soundEnabled} toggleSound={toggleMute} />}

      {showTransition && (
        <TransitionScreen
          transition={transitions[currentTransition]}
          onContinue={completeTransition}
          soundEnabled={soundEnabled}
          toggleSound={toggleMute}
        />
      )}

      {showCongrats && <OutroScreen onRestart={resetGame} soundEnabled={soundEnabled} toggleSound={toggleMute} />}

      {gameStarted && !showTransition && !showCongrats && showLevelIntro && levelIntroScenes[currentLevel] && (
        <LevelIntroSceneView scene={levelIntroScenes[currentLevel]} onContinue={handleIntroContinue} />
      )}

      {gameStarted &&
        !showTransition &&
        !showCongrats &&
        !showLevelIntro &&
        (() => {
          const { setting, character } = getCurrentSetting()

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
              key={`level-restart-${levelRestartNonce}`}
              level={currentLevel}
              setting={setting}
              character={character}
              puzzle={currentPuzzle}
              onCorrect={advanceLevel}
              onWrong={handleWrongAnswer}
              soundEnabled={soundEnabled}
              toggleSound={toggleMute}
              onJumpToLevel={jumpToLevel}
              onSolutionGenerated={handleSolutionGenerated}
              onRestartLevel={restartLevel}
            />
          )
        })()}
    </div>
  )
}
