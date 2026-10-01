"use client"

import type React from "react"
import Image from "next/image"

import { useState, useRef, useEffect, useCallback } from "react"
import type { Puzzle } from "@/types/puzzle"
import HintSystem from "./hint-system"
import { Lightbulb, Volume2, VolumeX, Sparkles, RotateCcw } from "lucide-react"
import ElevatorPanel from "./elevator-panel"
import { useAudio } from "@/hooks/use-audio"
import { useHaptics } from "@/hooks/use-haptics"
import { useAchievements } from "@/hooks/use-achievements"
import { useStorage } from "@/hooks/use-storage"
import { useCharacterDialogue, guardDialogLines, getRandomElevatorMessage, getAnswerFeedback, sphinxRiddle, getClockButlerLine, getMansionButlerLine, getBookshelfButlerLine, getGuardBoneLine } from "@/utils/dialogue-utils"
import CharacterLocationDisplay from "./character-location-display"
import AnswerInput from "./answer-input"
import CharacterDialoguePopup from "./character-dialogue-popup"
import { genderize } from "@/utils/player-gender"
import PuzzleContent from "./puzzle-content"

interface GameScreenProps {
  level: number
  setting: string
  character: string
  puzzle: Puzzle
  onCorrect: (isSkipping?: boolean) => void
  onWrong: () => void
  soundEnabled: boolean
  toggleSound: () => void
  onJumpToLevel?: (level: number) => void
  onSolutionGenerated: (solution: string) => void
  characterDialogues?: Record<string, string[]>
  onLevelComplete: () => void
  onTransition: (transitionId: string) => void
  onRestartLevel?: () => void
  onOpenMap?: () => void
}

// Helper functions
const getBrainLampImage = (correctCombinations: number): string => {
  const brainLampImages: Record<number, string> = {
    0: "/images/brainlamp.webp", // 0 correct - static image
    1: "/images/xbrainlampa1.webp", // 1 correct
    2: "/images/xbrainlampa2.webp", // 2 correct
    3: "/images/xbrainlampa3.webp", // 3 correct
    4: "/images/xbrainlampa4.webp", // 4 correct
    5: "/images/xbrainlampa5.webp", // 5 correct
    6: "/images/xbrainlampa6.webp", // 6 correct (with red glow)
  }

  return brainLampImages[correctCombinations] || "/images/brainlamp.webp"
}

// Levels whose interaction-complete signal is currently wired up. The answer
// input stays locked until that signal fires. Levels not yet in this set are
// unaffected (input behaves as before) until their gating is implemented.
const GATED_LEVELS = new Set<number>([
  1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 17, 19, 20, 21, 22, 24, 27, 28, 30, 32, 33, 34, 36, 37, 39, 40, 41, 42,
  43, 44, 45, 46, 47, 48, 49, 50,
])

// Levels that don't require any interaction to unlock, but still play the
// gate's closed-to-open animation for atmosphere as soon as the level starts.
const AUTO_OPEN_LEVELS = new Set<number>([3])
const AUTO_OPEN_DELAY_MS = 900

// Number of clock times the player must step through in level 12 before the puzzle is "read".
const MANSION_CLOCK_STEPS = 4

// Define dialogue options for brain lamp
const brainDialogueOptions = [
  "AAAGH! IT HURTS!",
  "Can't... think...",
  "STOP! PLEASE!",
  "My brain... melting...",
  "No more... switches...",
]


// Level 50 hell floors: the Devil's speech for each floor, split into click-through parts.
const HELL_FLOOR_SPEECHES: Record<number, string[]> = {
  // HOT HELLS
  [-1]: [
    "How precious, the mind's little trick of shutting off before the terror finishes its work. I forbid it here.",
    "My guards cut them down, and the heart restarts the instant the brain tries to sever the connection. They wake fully aware of what they just endured.",
    "So a man who spent his life claiming he'd never hurt anyone gets to stay awake for every second of what he actually did.",
  ],
  [-2]: [
    "I drew every black line myself, and if that impresses you, I won't stop you.",
    "The saw follows the charcoal a hair's width at a time, slow enough to feel deliberate.",
    "He spent thirty years insisting his mistakes were accidents. Down here, nothing is.",
  ],
  [-3]: [
    "That sound is two mountains finally agreeing on something, with a soul caught in the middle of the argument.",
    "She spent her life certain that words could never really wound anyone.",
    "I'm teaching her the difference between an opinion and a weight.",
  ],
  [-4]: [
    "I come here to relax. Every voice in this valley is screaming, and every one insists it never wanted to be heard.",
    "Which I find touching, coming from a woman who spent forty years deciding who got to speak and when.",
    "The screaming usually stops meaning anything after a while. Hers hasn't yet. I admire the stamina.",
  ],
  [-5]: [
    "An upgrade on the screaming hall upstairs. LOUDER, and molten metal, poured slow enough to enjoy properly.",
    "He spent decades lecturing his congregation about restraint, then helped himself to whatever he liked first.",
    "Poetic, that his portions are finally decided for him.",
  ],
  [-6]: [
    "One iron stake, heel to crown, and the heat finishes the job from the inside. Elegant, I think.",
    "He built three towers on foundations he knew wouldn't hold and called the collapse an act of god.",
    "Something is finishing what he started too.",
  ],
  [-7]: [
    "The floor above was the warm-up. This is the great furnace: cauldrons the size of mountains, and a proper reduction takes centuries.",
    "Nobody down here is counting anymore.",
    "She used to call patience a virtue, usually right before using it to outlast anyone who disagreed with her. Seems only fair she has more of it now than she knows what to do with.",
  ],
  [-8]: [
    "My masterpiece, and I don't say that often. Fire so hot it burns white, and not one pause, not one second of relief, EVER.",
    "He spent his whole life insisting there was no excuse for rest.",
    "I happen to agree with him completely.",
  ],

  // COLD HELLS
  [-9]: [
    "The first cold room, and already its newest guest is begging for the flames she was so glad to leave behind.",
    "The blisters swell like ripened fruit before the frost seals them shut.",
    "She built a career telling people pain was weakness if you let it show. Hers is on full display now, whether she likes it or not.",
  ],
  [-10]: [
    "Here the blisters finally burst, and the ice inside tears through the muscle like broken glass leaving the room.",
    "He spent his life bragging that nothing could break him.",
    "I'd say the argument is settled.",
  ],
  [-11]: [
    "Named for the sound the teeth make against the frost. At-at-at, over and over.",
    "Which is more than she ever let anyone else get a word in edgewise while she was alive.",
    "The muscle tears, the cold seals it, then it tears again. A rhythm, if you're patient. I have nothing but time.",
  ],
  [-12]: [
    "All that's left of his voice is 'ha-ha-va', which strikes me as fitting.",
    "He spent his life laughing at people for considerably less.",
    "The breath freezes into little shapes on the way out. I've kept a few of the prettier ones, if you'd like to see.",
  ],
  [-13]: [
    "The blue room. Even the scream freezes on the way out. Hu-hu-va, and then nothing.",
    "Blood freezes in the vein and cracks it from the inside, a sound not unlike a windowpane going.",
    "She used to pride herself on never letting anything get under her skin. Now nothing can get out.",
  ],
  [-14]: [
    "Named for the utpala, a blue flower, and for the color the skin turns on its way out.",
    "The eyes freeze solid in their sockets and keep working regardless.",
    "He spent a long career insisting he never saw what was happening right in front of him. I've made sure that excuse won't hold up much longer.",
  ],
  [-15]: [
    "The skin splits into patterns like lotus petals as it freezes, and the blood that escapes hardens into small red sculptures.",
    "She spent her career calling suffering beautiful whenever it wasn't hers.",
    "I've simply given her an exhibit of her own.",
  ],
  [-16]: [
    "The coldest of them, where even thought slows and eventually stops.",
    "What's left just sits, half aware, for longer than your calendars have numbers for.",
    "He used to say nothing ever got to him. I'd call this a fair test of that claim, and a fitting place to end the tour.",
  ],
}

export default function GameScreen({
  level,
  setting,
  character,
  puzzle,
  onCorrect,
  onWrong,
  soundEnabled,
  toggleSound,
  onJumpToLevel,
  onSolutionGenerated,
  characterDialogues,
  onLevelComplete,
  onTransition,
  onRestartLevel,
  onOpenMap,
}: GameScreenProps) {
  const { playSound } = useAudio()
  const { vibrate } = useHaptics()
  const { unlockAchievement } = useAchievements()
  const { getItem, setItem } = useStorage()
  const getRandomDialogue = useCharacterDialogue()

  // Handle sphinx interaction in pyramid puzzle
  const handleSphinxInteract = (room: string) => {
    const godRoomMessages: Record<string, string> = {
      isis: "Isis, goddess of magic and fertility. She gave life back to one who had lost it.",
      osiris: "Osiris, god of the underworld. All who die come before him, in time.",
      horus: "Horus, god of the sky, who sees all that lies beneath it.",
      toth: "Thoth, god of wisdom and writing. What he writes is never erased.",
      ra: "Ra, god of light. Where he goes, the dark cannot stay.",
      anubis: "Anubis, god of mummification. He has weighed many hearts. He will weigh more.",
    }

    if (godRoomMessages[room]) {
      setCharacterDialogue(godRoomMessages[room])
    } else {
      setCharacterDialogue(getRandomDialogue("sphinx", level))
    }
    setShowCharacterDialogue(true)
  }

  const [answer, setAnswer] = useState("")
  const [feedback, setFeedback] = useState("")
  const [isCorrect, setIsCorrect] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [isWrong, setIsWrong] = useState(false)
  // Last wrong submission, for puzzles that give per-part feedback (level 2's skulls)
  const [lastWrongAnswer, setLastWrongAnswer] = useState<{ text: string; nonce: number } | null>(null)
  const [touchStartY, setTouchStartY] = useState(0)
  const [touchEndY, setTouchEndY] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [guardDialogIndex, setGuardDialogIndex] = useState(0)
  const [showGuardPopup, setShowGuardPopup] = useState(false)
  const [jigsawComplete, setJigsawComplete] = useState(false)
  const [lightsOn, setLightsOn] = useState(false)
  const [solved, setSolved] = useState(false)
  const [showCompassPopup, setShowCompassPopup] = useState(false) // State for the compass image popup
  const [showRestartConfirm, setShowRestartConfirm] = useState(false)
  const [showColorPalettePopup, setShowColorPalettePopup] = useState(false)
  // Answer input stays locked until the level's interactive mechanic is completed
  // (or, for AUTO_OPEN_LEVELS, until the entrance animation finishes).
  const [locked, setLocked] = useState(() => GATED_LEVELS.has(level) || AUTO_OPEN_LEVELS.has(level))

  // State to manage interaction level for level 17: 'disabled', 'dim', 'active'
  const [lightSwitchInteractionState, setLightSwitchInteractionState] = useState<'disabled' | 'dim' | 'active'>('disabled')
  const inputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const questionnaireRef = useRef<any>(null)
  const [currentPyramidRoom, setCurrentPyramidRoom] = useState<string>("entrance")
  const [clockStep, setClockStep] = useState(0)
  const [mansionRoom, setMansionRoom] = useState<{ room: string; examining: boolean }>({ room: "foyer", examining: false })
  const [bookshelfRevealed, setBookshelfRevealed] = useState(false)
  const [hasPyramidTorch, setHasPyramidTorch] = useState(false)
  const [currentElevatorFloor, setCurrentElevatorFloor] = useState(0)
  const [floorLabels, setFloorLabels] = useState<Record<number, string>>({})
  const [hasUsedElevator, setHasUsedElevator] = useState(false)
  const [isSubmitButtonHovered, setIsSubmitButtonHovered] = useState(false)
  const [showElevator, setShowElevator] = useState(true)
  const [showElevatorPanel, setShowElevatorPanel] = useState(false)
  const [elevatorDescription, setElevatorDescription] = useState("")
  const [characterDialogue, setCharacterDialogue] = useState<string>("")
  const [showCharacterDialogue, setShowCharacterDialogue] = useState<boolean>(false)
  const [binaryCorrectCombinations, setBinaryCorrectCombinations] = useState(0)
  const [murderMysteryLocation, setMurderMysteryLocation] = useState<string>("crime scene")
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null)
  const [magicBoxRebusShown, setMagicBoxRebusShown] = useState(false)

  const handleMagicBoxSolved = () => {
    setMagicBoxRebusShown(true)
  }

  const [userInput, setUserInput] = useState("")
  const [hintIndex, setHintIndex] = useState(0)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [attempts, setAttempts] = useState(0)
  // Add state for brain dialogue
  const [brainDialogue, setBrainDialogue] = useState<string>("")
  const [showBrainDialogue, setShowBrainDialogue] = useState<boolean>(false)

  // State for devil dialogue cycling in level 50
  const [devilDialogueIndices, setDevilDialogueIndices] = useState<Record<number, number>>({})

  // New state for dim light butler dialogue popup
  const [showDimLightButlerPopup, setShowDimLightButlerPopup] = useState(false)

    // Effect to update interaction state based on lightsOn and solved
  useEffect(() => {
    if (solved) {
      setLightSwitchInteractionState('active')
    } else if (lightsOn) {
      setLightSwitchInteractionState('dim')
    } else {
      setLightSwitchInteractionState('disabled')
    }
  }, [lightsOn, solved])

  // Reset the answer-input lock whenever the level changes
  useEffect(() => {
    setLocked(GATED_LEVELS.has(level) || AUTO_OPEN_LEVELS.has(level))

    if (AUTO_OPEN_LEVELS.has(level)) {
      const timer = setTimeout(() => setLocked(false), AUTO_OPEN_DELAY_MS)
      return () => clearTimeout(timer)
    }
  }, [level])

  const handleInteractionComplete = () => {
    setLocked(false)
  }

  // Debug shortcut: press "x" to force-unlock the answer input gate for the current level.
  useEffect(() => {
    const handleDebugUnlock = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "x") return
      const target = e.target as HTMLElement | null
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return
      setLocked(false)
    }
    window.addEventListener("keydown", handleDebugUnlock)
    return () => window.removeEventListener("keydown", handleDebugUnlock)
  }, [])

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 500)
    }

    // Add entrance animation
    setIsAnimating(true)
    const timer = setTimeout(() => {
      setIsAnimating(false)
    }, 600)

    return () => clearTimeout(timer)
  }, [])

  const checkAnswer = () => {
    if (!answer.trim()) return

    // Check for "RESTART LEVEL" command
    if (answer.trim().toUpperCase() === "RESTART LEVEL") {
      setAnswer("")
      setFeedback("Restarting level...")

      setTimeout(() => {
        setFeedback("")
        // Reset any level-specific state here
        if (puzzle.isQuestionnairePuzzle && questionnaireRef.current) {
          questionnaireRef.current.initializePuzzle()
        }
      }, 1000)
      return
    }

    const normalizedUserAnswer = answer.trim().toLowerCase()
    // Use dynamic solution for questionnaire puzzle if available
    const normalizedCorrectAnswers = puzzle.solution.toLowerCase().split("|")
    const secretPassword = "tiengviet"

    // Check for level-specific secret password (e.g., TIENGVIET20)
    const levelJumpRegex = /^tiengviet(\d+)$/i
    const levelJumpMatch = normalizedUserAnswer.match(levelJumpRegex)

    if (levelJumpMatch && onJumpToLevel) {
      const targetLevel = Number.parseInt(levelJumpMatch[1], 10)
      if (!isNaN(targetLevel) && targetLevel >= 1 && targetLevel <= 50) {
        setFeedback(`Jumping to level ${targetLevel}...`)
        setIsCorrect(true)

        setTimeout(() => {
          setAnswer("")
          setFeedback("")
          setIsCorrect(false)
          setShowHints(false)
          onJumpToLevel(targetLevel)
        }, 1500)
        return
      }
    }

    // Special case for puzzle 10 to accept both "guard" and "the guard"
    if (puzzle.level === 10 && (normalizedUserAnswer === "guard" || normalizedUserAnswer === "the guard")) {
      setFeedback(getAnswerFeedback(puzzle.level, true))
      setIsCorrect(true)

      setTimeout(() => {
        setAnswer("")
        setFeedback("")
        setIsCorrect(false)
        setShowHints(false)
        onCorrect(false) // Normal progression
      }, 1500)
      return
    }

    if (normalizedCorrectAnswers.includes(normalizedUserAnswer)) {
      setFeedback(getAnswerFeedback(puzzle.level, true))
      setIsCorrect(true)

      setTimeout(() => {
        setAnswer("")
        setFeedback("")
        setIsCorrect(false)
        setShowHints(false)
        onCorrect(false) // Normal progression
      }, 1500)
    } else if (normalizedUserAnswer === secretPassword) {
      setFeedback("Secret password accepted! Skipping ahead...")
      setIsCorrect(true)

      setTimeout(() => {
        setAnswer("")
        setFeedback("")
        setIsCorrect(false)
        setShowHints(false)
        onCorrect(true) // Skip to next available puzzle
      }, 1500)
    } else {
      setFeedback(getAnswerFeedback(puzzle.level, false))
      setIsWrong(true)
      setLastWrongAnswer((prev) => ({ text: normalizedUserAnswer, nonce: (prev?.nonce ?? 0) + 1 }))

      onWrong() // Trigger wrong answer sound

      setTimeout(() => {
        setAnswer("")
        setFeedback("")
        setIsWrong(false)
      }, 1500)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.targetTouches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndY(e.targetTouches[0].clientY)
  }

  const handleTouchEnd = () => {
    if (touchStartY - touchEndY > 50) {
      // Swipe up to submit
      checkAnswer()
    } else if (touchEndY - touchStartY > 50) {
      // Swipe down to clear
      setAnswer("")
    }
  }

  const getSettingBackground = () => {
    switch (setting) {
      case "prison":
        return "bg-black"
      case "mansion":
        return "bg-black"
      case "forest":
        return "bg-black"
      case "desert":
        return "bg-black"
      case "hell":
        return "bg-black"
      default:
        return "bg-black"
    }
  }

  const handleDimLightButlerClick = () => {
    setShowDimLightButlerPopup(true)
  }

  const handleCompassClick = () => {
    setShowCompassPopup(true)
  }

  // Handle location image click
  const handleLocationClick = () => {
    if (level === 17 && lightSwitchInteractionState === 'active') {
      handleCompassClick()
      return
    }

    if (level === 50) {
      // Always show elevator panel when location image is clicked in level 50
      setShowElevatorPanel(true)
      setHasUsedElevator(true)
    }
  }

  // Level 50 floor speeches. Each floor pairs its punishment with the excuse the
  // sinner used in life. Every floor keeps the detail that identifies which hell
  // it is (the sound, the color, the instrument), since the final answer
  // depends on naming the floors. Clicking the Devil steps through the parts.
  const getDevilDialogueForFloor = (floor: number, dialogueIndex: number = 0): string => {
    const floorDialogues = HELL_FLOOR_SPEECHES[floor]
    if (!floorDialogues) return "This particular pit requires total darkness to do its work properly. Everyone discovers something different about themselves in the dark. Rarely something worth knowing."

    return floorDialogues[dialogueIndex % floorDialogues.length] || floorDialogues[0]
  }

  const getDevilDialoguePartsCount = (floor: number): number => HELL_FLOOR_SPEECHES[floor]?.length || 1

  // Update the handleGuardClick function to properly handle sphinx click for level 38 and 40
  const handleGuardClick = () => {
    // Special handling for level 50 (devil interaction after accessing hell rooms)
    if (level === 50 && hasUsedElevator && currentElevatorFloor !== 0) {
      // Get current dialogue index for this floor, default to 0
      const currentIndex = devilDialogueIndices[currentElevatorFloor] || 0

      // Get the dialogue for current index
      const devilDialogue = getDevilDialogueForFloor(currentElevatorFloor, currentIndex)

      // Update the index for next click (cycle through the parts)
      setDevilDialogueIndices(prev => ({
        ...prev,
        [currentElevatorFloor]: (currentIndex + 1) % getDevilDialoguePartsCount(currentElevatorFloor)
      }))

      setCharacterDialogue(devilDialogue)
      setShowCharacterDialogue(true)
    }
    // Special handling for level 38 (sphinx riddle)
    else if (level === 38) {
      // For level 38, we use the specific sphinxRiddle
      setCharacterDialogue(sphinxRiddle)
      setShowCharacterDialogue(true)
    }
    // Special handling for level 40 (pyramid puzzle sphinx interaction)
    else if (level === 40) {
      handleSphinxInteract(currentPyramidRoom)
    }
    // Special handling for level 8 (magic box rebus)
    else if (level === 8 && magicBoxRebusShown) {
    setCharacterDialogue("A rebus. Say what ya see, out loud. Go on, I could use a laugh.")
    setShowCharacterDialogue(true)
    }
    // Special handling for level 14 (mansion clock puzzle) — reflects the clock's actual hand position, not random
    else if (level === 14) {
      setCharacterDialogue(getClockButlerLine(clockStep))
      setShowCharacterDialogue(true)
    }
    // Special handling for level 20 (mansion gallery) — the butler's line
    // depends on the room the player is in and whether they're actively
    // examining that room's art, not on a level-wide random pool.
    else if (level === 20) {
      setCharacterDialogue(getMansionButlerLine(mansionRoom.room, mansionRoom.examining))
      setShowCharacterDialogue(true)
    }
    // Special handling for level 12 (bookshelf chronology) — the butler's line
    // depends on whether the shelf order is solved and the window light has
    // revealed itself yet, not on a level-wide random pool.
    else if (level === 12) {
      setCharacterDialogue(getBookshelfButlerLine(bookshelfRevealed))
      setShowCharacterDialogue(true)
    }
    // Special handling for level 10 (guard puzzle)
    else if (level === 10) {
    // Rotate through guard dialog lines
    const nextIndex = (guardDialogIndex + 1) % guardDialogLines.length
    setGuardDialogIndex(nextIndex)

    // Update the puzzle's guardStatement
    if (puzzle.isInteractiveInmates) {
        puzzle.guardStatement = guardDialogLines[nextIndex]
      }

      // Show the guard popup
      setShowGuardPopup(true)
    } else {
      // For all other levels, show a random character dialogue
      setCharacterDialogue(getRandomDialogue(character, level))
      setShowCharacterDialogue(true)
    }
  }

  // Add a function to close the character dialogue popup
  const handleCloseCharacterDialogue = () => {
    setShowCharacterDialogue(false)
    setShowGuardPopup(false) // Also close guard popup if open
    setShowBrainDialogue(false) // Also close brain dialogue if open
  }

  const handleJigsawComplete = () => {
    setJigsawComplete(true)
    handleInteractionComplete()
  }

  const handleParrotSolve = () => {
    handleInteractionComplete()
  }

  const handleQuestionnaireRestart = () => {
    // This will be called when the player clicks the restart button in the questionnaire
    setAnswer("")
    setFeedback("")
  }

  const handleLightSwitchUpdate = (isLightOn: boolean, isSolved: boolean) => {
    setLightsOn(isLightOn)
    setSolved(isSolved)
  }

  const handleZodiacSolve = () => {
    // Don't automatically solve, let the player type the answer — just unlock the input
    handleInteractionComplete()
  }

  // Handle pyramid room changes
  const handlePyramidRoomChange = (room: string) => {
    setCurrentPyramidRoom(room)
  }

  // Handle pyramid torch acquisition
  const handlePyramidTorchAcquired = () => {
    setHasPyramidTorch(true)
  }

  // Handle mansion gallery (level 15) room/examining changes. Memoized so
  // the identity stays stable across renders — mansion-map-puzzle.tsx
  // fires this from a useEffect keyed on room/examining state alone.
  const handleMansionRoomStateChange = useCallback((room: string, examining: boolean) => {
    setMansionRoom({ room, examining })
  }, [])

  // Handle elevator floor change for level 50
  const handleElevatorFloorChange = (floor: any) => {
    setCurrentElevatorFloor(floor.floor)
    setHasUsedElevator(true)
    setShowElevatorPanel(false)

    // Set a random elevator description
    setElevatorDescription(getRandomElevatorMessage())
  }

  // Add a function to handle brain lamp clicks
  const handleBrainLampClick = () => {
    // Generate dialogue based on the number of correct combinations
    let dialogue = "..." // Default dialogue

    if (binaryCorrectCombinations < 6) {
      // Different dialogue tiers based on progress
      if (binaryCorrectCombinations <= 1) {
        // Early stage - more coherent pleas
        const earlyDialogues = [
          "Help... me...",
          "Make it... stop...",
          "Please... no more...",
          "It burns...",
          "My... thoughts... hurt...",
          "They... took my body..."
        ]
        dialogue = earlyDialogues[Math.floor(Math.random() * earlyDialogues.length)]
      } else if (binaryCorrectCombinations <= 3) {
        // Middle stage - increasing pain, less coherent
        const middleDialogues = [
          "AAAGH! IT HURTS!",
          "Can't... think...",
          "My brain... burning...",
          "No more... please...",
          "STOP THE PAIN!",
          "Just want... to die...",
          "Memories... fading..."
        ]
        dialogue = middleDialogues[Math.floor(Math.random() * middleDialogues.length)]
      } else {
        // Late stage - extreme agony, barely coherent
        const lateDialogues = [
          "AAAAAAHHH!",
          "KILL... ME...",
          "*unintelligible screaming*",
          "*gurgling sounds*",
          "END... THIS...",
        ]
        dialogue = lateDialogues[Math.floor(Math.random() * lateDialogues.length)]
      }
    }

    // Show the dialogue popup with the brain character
    setShowBrainDialogue(true)
    setBrainDialogue(dialogue)
  }

  // Add this handler for the location image click
  const handlePyramidLocationImageClick = () => {
    if (level === 40 && currentPyramidRoom === "ra" && !hasPyramidTorch) {
      setHasPyramidTorch(true)
    } else if (level === 47) {
      // Call the brain lamp click handler for level 47
      handleBrainLampClick()
    }
  }

  const handleMurderMysteryLocationUpdate = (location: string) => {
    setMurderMysteryLocation(location)
  }

  // Handle submit button hover for level 50
  const handleSubmitButtonMouseEnter = () => {
    if (level === 50 && jigsawComplete && !showElevator) {
      setIsSubmitButtonHovered(true)
      // Update the FinalLevelPuzzle component to show the devil's message
      const finalLevelPuzzleElement = document.getElementById("final-level-puzzle")
      if (finalLevelPuzzleElement && finalLevelPuzzleElement.__reactProps$) {
        if (finalLevelPuzzleElement.__reactProps$.handleSubmitHover) {
          finalLevelPuzzleElement.__reactProps$.handleSubmitHover()
        }
      }
    }
  }

  const handleSubmitButtonMouseLeave = () => {
    if (level === 50) {
      setIsSubmitButtonHovered(false)
      // Update the FinalLevelPuzzle component
      const finalLevelPuzzleElement = document.getElementById("final-level-puzzle")
      if (finalLevelPuzzleElement && finalLevelPuzzleElement.__reactProps$) {
        if (finalLevelPuzzleElement.__reactProps$.handleSubmitLeave) {
          finalLevelPuzzleElement.__reactProps$.handleSubmitLeave()
        }
      }
    }
  }

  // Handle elevator panel events from FinalLevelPuzzle
  const handleElevatorPanelOpen = () => {
    setShowElevatorPanel(true)
    setHasUsedElevator(true)
  }

  const handleAllPiecesRemoved = () => {
    setShowElevator(true)
    // Ensure the location image is updated to show the elevator
    setHasUsedElevator(true)
  }

  // Update the FinalLevelPuzzle component when the elevator floor changes
  useEffect(() => {
    if (level === 50) {
      const finalLevelPuzzleElement = document.getElementById("final-level-puzzle")
      if (finalLevelPuzzleElement && finalLevelPuzzleElement.__reactProps$) {
        if (finalLevelPuzzleElement.__reactProps$.onFloorChange) {
          finalLevelPuzzleElement.__reactProps$.onFloorChange(currentElevatorFloor)
        }
      }
    }
  }, [currentElevatorFloor, level])

  // Function to close the guard popup
  const handleCloseGuardPopup = () => {
    setShowGuardPopup(false)
  }

  return (
    <div
      className={`w-full max-w-md mx-auto p-4 ${getSettingBackground()} transition-colors duration-1000 min-h-[100vh] flex flex-col ${isAnimating ? "animate-fadeIn" : ""}`}
    >
      {/* Restart confirmation modal */}
      {showRestartConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setShowRestartConfirm(false)}
        >
          <div
            className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-xs w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-pixel text-white text-lg mb-2">Restart Level?</h3>
            <p className="text-sm text-gray-400 mb-6">
              Your progress on this level will be lost and the intro scene will play again.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowRestartConfirm(false)}
                className="flex-1 py-2 rounded-xl bg-gray-800 text-gray-300 font-pixel text-sm hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowRestartConfirm(false)
                  onRestartLevel()
                }}
                className="flex-1 py-2 rounded-xl bg-red-900 text-white font-pixel text-sm hover:bg-red-800 transition-colors"
              >
                Restart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Level indicator */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={onOpenMap}
          aria-label={`Level ${level} — open map`}
          className="text-sm font-pixel text-purple-300 bg-gray-900/70 px-3 py-1 rounded-full border border-gray-800 shadow-lg flex items-center gap-1 hover:border-purple-800 hover:bg-gray-800/80 transition-colors cursor-pointer"
        >
          <Sparkles className="w-3 h-3 text-yellow-400" /> Level {level}
        </button>
        {level === 47 && (
          <div className="text-sm font-pixel text-purple-300 bg-gray-900/70 px-3 py-1 rounded-full border border-gray-800 shadow-lg flex items-center gap-1">
            The Brain
          </div>
        )}
      </div>

            {/* Character and location section */}
      {level !== 17 && (
        <CharacterLocationDisplay
          level={level}
          setting={setting}
          character={character}
          puzzle={puzzle}
          lightsOn={lightsOn}
          solved={solved}
          binaryCorrectCombinations={binaryCorrectCombinations}
          currentPyramidRoom={currentPyramidRoom}
          hasPyramidTorch={hasPyramidTorch}
          hasUsedElevator={hasUsedElevator}
          showElevator={showElevator}
          jigsawComplete={jigsawComplete}
          onGuardClick={handleGuardClick}
                    onLocationClick={handleLocationClick}
          onPyramidLocationImageClick={handlePyramidLocationImageClick}
          murderMysteryLocation={murderMysteryLocation}
          onColorPaletteClick={() => setShowColorPalettePopup(true)}
          speech={
            showCharacterDialogue ? genderize(characterDialogue) : showGuardPopup ? genderize(guardDialogLines[guardDialogIndex]) : null
          }
        />
      )}

      {/* Special display for level 17 to handle custom interactions */}
      {level === 17 && (
        <div className="grid grid-cols-2 gap-3 mb-4 animate-fadeIn">
          <div
            className={`flex justify-center items-center ${lightSwitchInteractionState !== 'disabled' ? 'cursor-pointer' : ''}`}
            onClick={lightSwitchInteractionState === 'active' ? handleGuardClick : (lightSwitchInteractionState === 'dim' ? handleDimLightButlerClick : undefined)}
          >
            <div className="w-40 h-40 relative pixelated-container">
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
            </div>
          </div>
          <div
            className={`flex justify-center items-center ${lightSwitchInteractionState === 'active' ? 'cursor-pointer' : ''}`}
            onClick={lightSwitchInteractionState === 'active' ? handleLocationClick : undefined}
          >
            <div className="w-40 h-40 relative pixelated-container">
              <Image
                src={
                  solved
                    ? "/images/compass.webp"
                    : lightsOn
                      ? "/images/compass_dim.webp"
                      : "/images/pitch-darkness.webp"
                }
                alt={lightsOn ? "Compass" : "Darkness"}
                width={160}
                height={160}
                className="pixelated"
              />
            </div>
          </div>
        </div>
      )}

      {/* Puzzle content */}
      <PuzzleContent
        level={level}
        puzzle={puzzle}
        guardDialogIndex={guardDialogIndex}
        handleGuardClick={handleGuardClick}
        handleJigsawComplete={handleJigsawComplete}
        handleParrotSolve={handleParrotSolve}
        handleQuestionnaireRestart={handleQuestionnaireRestart}
        handleLightSwitchUpdate={handleLightSwitchUpdate}
        handleZodiacSolve={handleZodiacSolve}
        handlePyramidRoomChange={handlePyramidRoomChange}
        handlePyramidTorchAcquired={handlePyramidTorchAcquired}
        currentPyramidRoom={currentPyramidRoom}
        hasPyramidTorch={hasPyramidTorch}
        handleAllPiecesRemoved={handleAllPiecesRemoved}
        handleElevatorPanelOpen={handleElevatorPanelOpen}
        currentElevatorFloor={currentElevatorFloor}
        setCurrentElevatorFloor={setCurrentElevatorFloor}
        onSolutionGenerated={onSolutionGenerated}
        setBinaryCorrectCombinations={setBinaryCorrectCombinations}
        questionnaireRef={questionnaireRef}
        onMurderMysteryLocationUpdate={handleMurderMysteryLocationUpdate}
          onMagicBoxSolved={handleMagicBoxSolved}
        onMansionClockStepChange={(step) => {
          setClockStep(step)
          if (step >= MANSION_CLOCK_STEPS) {
            handleInteractionComplete()
          }
        }}
        onMansionRoomStateChange={handleMansionRoomStateChange}
        onBookshelfRevealedChange={setBookshelfRevealed}
        showColorPalettePopup={showColorPalettePopup}
        onCloseColorPalettePopup={() => setShowColorPalettePopup(false)}
        onInteractionComplete={handleInteractionComplete}
        onBoneOfferedToGuard={(color, rustReturned, rustTotal) => {
          setCharacterDialogue(getGuardBoneLine(color, rustReturned, rustTotal))
          setShowCharacterDialogue(true)
        }}
        lastWrongAnswer={lastWrongAnswer}
      />

      {/* Answer input section */}
      <div className="space-y-3 mt-auto">
        <AnswerInput
          answer={answer}
          setAnswer={setAnswer}
          isCorrect={isCorrect}
          isWrong={isWrong}
          checkAnswer={checkAnswer}
          level={level}
          locked={locked}
          jigsawComplete={jigsawComplete}
          showElevator={showElevator}
          isSubmitButtonHovered={isSubmitButtonHovered}
          handleSubmitButtonMouseEnter={handleSubmitButtonMouseEnter}
          handleSubmitButtonMouseLeave={handleSubmitButtonMouseLeave}
          handleTouchStart={handleTouchStart}
          handleTouchMove={handleTouchMove}
          handleTouchEnd={handleTouchEnd}
        />

        {feedback && (
          <div
            className={`p-3 rounded-lg text-center font-pixel ${
              isCorrect
                ? "bg-green-900/80 text-green-200 border border-green-700"
                : "bg-red-900/80 text-red-200 border border-red-700"
            } animate-fadeIn shadow-lg`}
          >
            {feedback}
          </div>
        )}

        {jigsawComplete && !isCorrect && level === 34 && (
          <div className="p-3 rounded-lg text-center font-pixel bg-purple-900/80 text-purple-200 border border-purple-700 animate-fadeIn shadow-lg">
            You've completed the puzzle! What could this image represent?
          </div>
        )}

        {jigsawComplete && !isCorrect && level === 44 && (
          <div className="p-3 rounded-lg text-center font-pixel bg-purple-900/80 text-purple-200 border border-purple-700 animate-fadeIn shadow-lg">
            You've completed the puzzle! What could this painting represent?
          </div>
        )}

        <div className="flex justify-between items-center pt-2">
          <button
            onClick={() => setShowHints(!showHints)}
            className="text-xs text-purple-400 hover:text-purple-300 font-pixel flex items-center gap-1 px-3 py-1.5 bg-purple-950/30 rounded-full border border-purple-900/50 hover:bg-purple-900/30 transition-colors"
          >
            <Lightbulb className="w-3 h-3" />
            {showHints ? "Hide Hints" : "Show Hints"}
          </button>

          <div className="flex items-center gap-2">
            {onRestartLevel && (
              <button
                onClick={() => setShowRestartConfirm(true)}
                aria-label="Restart level"
                className="w-8 h-8 rounded-full bg-gray-800/80 flex items-center justify-center border border-gray-700 hover:bg-gray-700/80 transition-colors"
              >
                <RotateCcw className="w-4 h-4 text-purple-300" />
              </button>
            )}
            <button
              onClick={toggleSound}
              aria-label="Toggle sound"
              className="w-8 h-8 rounded-full bg-gray-800/80 flex items-center justify-center border border-gray-700 hover:bg-gray-700/80 transition-colors"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-purple-300" />
              ) : (
                <VolumeX className="w-4 h-4 text-gray-500" />
              )}
            </button>
          </div>
        </div>

        {showHints && <HintSystem hints={puzzle.hints} />}
      </div>

      {/* Devil Dialog popup for level 50 */}

      {/* Character dialogue popup */}
      {showCharacterDialogue && (
        <CharacterDialoguePopup
          character={character}
          dialogue={characterDialogue}
          onClose={handleCloseCharacterDialogue}
          brainImage={getBrainLampImage(binaryCorrectCombinations)}
        />
      )}

      {/* Guard Dialog popup for level 10 and Sphinx Dialog popup for level 38 */}
      {showGuardPopup && (
        <CharacterDialoguePopup
          character={level === 38 ? "sphinx" : "skeleton"}
          dialogue={guardDialogLines[guardDialogIndex]}
          onClose={handleCloseGuardPopup}
          isGuardPopup={true}
          guardDialogIndex={guardDialogIndex}
          level={level}
        />
      )}

      {/* Elevator Panel popup for level 50 */}
      {showElevatorPanel && level === 50 && (
        <ElevatorPanel
          onClose={() => setShowElevatorPanel(false)}
          onFloorSelect={handleElevatorFloorChange}
          currentFloor={currentElevatorFloor}
          onRenameFloor={(floor, name) => {
            setFloorLabels((prev) => ({
              ...prev,
              [floor]: name,
            }))
          }}
          floorLabels={floorLabels}
          correctNames={{
            [-1]: "samjiva",
            [-2]: "kalasutra",
            [-3]: "samghata",
            [-4]: "raurava",
            [-5]: "maharaurava",
            [-6]: "tapana",
            [-7]: "pratapana",
            [-8]: "avici",
            [-9]: "arbuda",
            [-10]: "nirarbuda",
            [-11]: "atata",
            [-12]: "hahava",
            [-13]: "huhuva",
            [-14]: "utpala",
            [-15]: "padma",
            [-16]: "pundarika",
          }}
        />
      )}
            {/* Compass image popup for level 17 */}
      {showCompassPopup && level === 17 && (
        <div
          className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-70 z-50 animate-fadeIn"
          onClick={() => setShowCompassPopup(false)}
        >
          <div className="relative p-4 bg-gray-900 border-2 border-gray-700 rounded-lg">
            <Image src="/images/compass.webp" alt="Compass" width={320} height={320} className="pixelated" />
            <button
                className="absolute top-2 right-2 px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded-md text-xs text-gray-300 font-pixel"
                onClick={() => setShowCompassPopup(false)}
            >
                Close
            </button>
          </div>
        </div>
      )}

      {/* Dim light Butler popup for level 17 */}
      {showDimLightButlerPopup && level === 17 && (
        <div 
          className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={() => setShowDimLightButlerPopup(false)}
        >
          <div className="bg-gray-900 p-4 rounded-lg border-2 border-gray-700 max-w-sm w-full animate-fadeIn" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start gap-3">
              <div className="w-16 h-16 relative pixelated-container shrink-0">
                <Image
                  src={"/images/butler-undead.webp"}
                  alt={"butler-undead"}
                  width={64}
                  height={64}
                  className="pixelated"
                />
              </div>
              <div className="flex-1">
                <p className="text-purple-300 font-pixel mb-2">
                  Butler:
                </p>
                <p
                  className="text-gray-200 text-sm whitespace-pre-line font-pixel"
                >...</p>
              </div>
            </div>
            <div className="mt-4 text-center">
              <button
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-xs text-gray-300 font-pixel"
                onClick={() => setShowDimLightButlerPopup(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add the brain dialogue popup to the return statement, near the other dialogue popups */}
      {showBrainDialogue && (
        <CharacterDialoguePopup
          character="brain"
          dialogue={brainDialogue}
          onClose={() => setShowBrainDialogue(false)}
          brainImage={getBrainLampImage(binaryCorrectCombinations)} // Pass the brain image
        />
      )}
    </div>
  )
}
