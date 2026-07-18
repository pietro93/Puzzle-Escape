"use client"

import type React from "react"
import Image from "next/image"

import { useState, useRef, useEffect, useCallback } from "react"
import type { Puzzle } from "@/types/puzzle"
import HintSystem from "./hint-system"
import { Lightbulb, Volume2, VolumeX, Sparkles, RotateCcw } from "lucide-react"
import DevilDialogue from "./devil-dialogue"
import ElevatorPanel from "./elevator-panel"
import { useAudio } from "@/hooks/use-audio"
import { useHaptics } from "@/hooks/use-haptics"
import { useAchievements } from "@/hooks/use-achievements"
import { useStorage } from "@/hooks/use-storage"
import { useCharacterDialogue, guardDialogLines, getRandomElevatorMessage, sphinxRiddle, getClockButlerLine, getMansionButlerLine } from "@/utils/dialogue-utils"
import CharacterLocationDisplay from "./character-location-display"
import AnswerInput from "./answer-input"
import CharacterDialoguePopup from "./character-dialogue-popup"
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
  1, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 17, 19, 20, 21, 22, 24, 27, 28, 30, 32, 33, 34, 36, 37, 39, 40, 41, 42,
  43, 44, 45, 46, 47, 48, 49, 50,
])

// Levels that don't require any interaction to unlock, but still play the
// gate's closed-to-open animation for atmosphere as soon as the level starts.
const AUTO_OPEN_LEVELS = new Set<number>([2, 3])
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
      isis: "The mural in this chamber represents Isis, the goddess of magic and fertility.",
      osiris: "The mural in this chamber represents Osiris, the god of the underworld.",
      horus: "The mural in this chamber represents Horus, the god of the sky.",
      toth: "The mural in this chamber represents Thoth, the god of wisdom and writing.",
      ra: "The mural in this chamber represents Ra, the god of light.",
      anubis: "The mural in this chamber represents Anubis, the god of mummification.",
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
  const [hasPyramidTorch, setHasPyramidTorch] = useState(false)
  const [showDevilDialogue, setShowDevilDialogue] = useState(false)
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
      setFeedback("Correct! Well done.")
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
      setFeedback("Correct! Well done.")
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
      setFeedback("That's not quite right. Try again.")
      setIsWrong(true)

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

  // Get devil dialogue for level 50 based on current floor and dialogue part
  const getDevilDialogueForFloor = (floor: number, dialogueIndex: number = 0): string => {
    const devilDialogues: Record<number, string[]> = {
      // HOT HELLS
      [-1]: [
        "In this realm, death becomes meaningless.",
        "The damned are slaughtered by my guards, only to awaken fully aware of what they have just endured.",
        "The memory is pristine. Unbearable. And then it happens again.",
        "Do you understand the cruelty of that? A soul cannot escape even through oblivion."
      ],

      [-2]: [
        "My surveyors mark each victim with precision before the saws descend.",
        "Black lines chart their division perfectly. Flesh parts from flesh with geometric accuracy.",
        "Once severed, the pieces reassemble themselves—only to be marked anew and cut again.",
        "I find the symmetry of this punishment particularly elegant."
      ],

      [-3]: [
        "Two mountains serve as my instrument of compression.",
        "They meet with inexorable force, and the damned experience the full mathematics of being crushed.",
        "Bones become powder. Organs become paste.",
        "When the mountains part, what remains reassembles, awaiting the next collision. I have perfected the timing of their embrace."
      ],

      [-4]: [
        "The screaming here reaches decibel levels that would rupture mortal eardrums.",
        "The damned cook slowly in iron cauldrons, their skin separating from muscle.",
        "The chorus of wailing gives this realm its nature.",
        "Imagine a scream that never diminishes, never finds release. That is what I have created here."
      ],

      [-5]: [
        "Molten metal serves as both tomb and womb.",
        "The damned submerge into glowing pools, dissolve, reform, and sink again in an endless tide.",
        "The metal glows with colors that have no name.",
        "Each reformation brings fresh sensation, fresh agony. This realm is the amplified version of my screaming hall. Everything is magnified."
      ],

      [-6]: [
        "Iron stakes pierce through the soles of the damned and emerge from their crowns.",
        "The heat radiates from within, cooking organs slowly and deliberately.",
        "My attendants rotate the stakes to ensure even distribution of suffering.",
        "I take great care with this one. Precision matters."
      ],

      [-7]: [
        "Cauldrons the size of mountains filled with blazing fire.",
        "The damned are thrown into this furnace where they are cooked like stew.",
        "The bubbling is constant. The heat is tremendous.",
        "This realm makes my other heating hell seem almost gentle by comparison."
      ],

      [-8]: [
        "There is no respite here. Not even for a moment.",
        "Individual cells of flame isolate each soul in solitary burning.",
        "The fire burns so hot it appears white—it consumes yet preserves the damned for eternity.",
        "This is uninterrupted suffering. This is my final statement on heat. Nothing lies beneath this."
      ],

      // COLD HELLS
      [-9]: [
        "Cold becomes a weapon more terrible than flame.",
        "The skin of the damned erupts in blisters the size of mountains, filled with infected ice and frozen blood.",
        "The winds howl through this barren white landscape.",
        "This is where cold suffering begins. This is where I introduce the damned to freezing."
      ],

      [-10]: [
        "The blisters burst. That is the defining cruelty of this realm.",
        "The cold is so severe that the massive frozen sores split open from internal pressure.",
        "Jagged crystals of ice tear outward from within the flesh.",
        "The wounds refreeze immediately. This is the escalation. Everything that came before, but worse."
      ],

      [-11]: [
        "The damned can only produce one sound here: at-at-at.",
        "Their teeth chatter so violently that muscles tear and bones splinter.",
        "Their bodies convulse and freeze in grotesque positions.",
        "Imagine your own skeleton fracturing with every tremor. Imagine that never stopping."
      ],

      [-12]: [
        "A different cry reaches this level: ha-ha-va.",
        "Their breath freezes solid as it leaves their mouths, creating clouds of ice that hang suspended like ghosts.",
        "The frostbite claims extremities that snap away like icicles.",
        "Skin turns white, then blue, then black. This realm is colder than before."
      ],

      [-13]: [
        "The bodies turn completely blue in this realm.",
        "The sound becomes hu-hu-va—the damned try to scream but their voices freeze in their throats.",
        "Their blood becomes ice in their veins. Crystals tear through arteries.",
        "Joint by joint, they become immobilized by their own frozen essence."
      ],

      [-14]: [
        "A delicate flower gives this realm its character.",
        "The skin takes on the color of the utpala—perfect blue.",
        "The cold reaches into the eye sockets and freezes the eyeballs solid.",
        "The tongue becomes a rigid block of ice. The landscape fills with frozen statues, each locked in eternal agony."
      ],

      [-15]: [
        "The skin cracks into petal-like patterns, as if blooming in slow motion.",
        "Beautiful cracks that deepen until they reach bone.",
        "The bone itself splits along these same lines.",
        "The damned become flowers themselves. The realm grows quiet here. Even I appreciate the silence of such perfect suffering."
      ],

      [-16]: [
        "This is the absolute. The coldest. The deepest. The final realm of freezing suffering.",
        "The skin splits into enormous petal-like patterns.",
        "Chunks of flesh fall like autumn leaves, revealing muscle and bone preserved in perfect ice.",
        "Thought itself begins to freeze. Consciousness becomes a burden they carry for eons. This is my greatest work. Beyond this, there is only void."
      ],
    }

    const floorDialogues = devilDialogues[floor]
    if (!floorDialogues) return "This realm defies description. Even I find it difficult to articulate the nature of the suffering here."

    return floorDialogues[dialogueIndex % floorDialogues.length] || floorDialogues[0]
  }

  // Get the number of dialogue parts for a floor
  const getDevilDialoguePartsCount = (floor: number): number => {
    const devilDialogues: Record<number, string[]> = {
      [-1]: ["", "", "", ""], // 4 parts
      [-2]: ["", "", "", ""], // 4 parts
      [-3]: ["", "", "", ""], // 4 parts
      [-4]: ["", "", "", ""], // 4 parts
      [-5]: ["", "", "", ""], // 4 parts
      [-6]: ["", "", "", ""], // 4 parts
      [-7]: ["", "", "", ""], // 4 parts
      [-8]: ["", "", "", ""], // 4 parts
      [-9]: ["", "", "", ""], // 4 parts
      [-10]: ["", "", "", ""], // 4 parts
      [-11]: ["", "", "", ""], // 4 parts
      [-12]: ["", "", "", ""], // 4 parts
      [-13]: ["", "", "", ""], // 4 parts
      [-14]: ["", "", "", ""], // 4 parts
      [-15]: ["", "", "", ""], // 4 parts
      [-16]: ["", "", "", ""], // 4 parts
    }

    return devilDialogues[floor]?.length || 4
  }

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
    setCharacterDialogue("Are you a fan of rebuses? Hehe")
    setShowCharacterDialogue(true)
    }
    // Special handling for level 12 (mansion clock puzzle) — reflects the clock's actual hand position, not random
    else if (level === 12) {
      setCharacterDialogue(getClockButlerLine(clockStep))
      setShowCharacterDialogue(true)
    }
    // Special handling for level 15 (mansion gallery) — the butler's line
    // depends on the room the player is in and whether they're actively
    // examining that room's art, not on a level-wide random pool.
    else if (level === 15) {
      setCharacterDialogue(getMansionButlerLine(mansionRoom.room, mansionRoom.examining))
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
        showColorPalettePopup={showColorPalettePopup}
        onCloseColorPalettePopup={() => setShowColorPalettePopup(false)}
        onInteractionComplete={handleInteractionComplete}
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
      {showDevilDialogue && level === 50 && (
        <DevilDialogue onClose={() => setShowDevilDialogue(false)} currentFloor={currentElevatorFloor} />
      )}

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
