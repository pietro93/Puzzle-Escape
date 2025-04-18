"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import type { Puzzle } from "@/types/puzzle"
import HintSystem from "./hint-system"
import { Lightbulb, ChevronUp, ChevronDown, Volume2, VolumeX, Sparkles } from "lucide-react"
import DevilDialogue from "./devil-dialogue"
import ElevatorPanel from "./elevator-panel"
import { useAudio } from "@/hooks/use-audio"
import { useHaptics } from "@/hooks/use-haptics"
import { useAchievements } from "@/hooks/use-achievements"
import { useStorage } from "@/hooks/use-storage"
import { useCharacterDialogue, guardDialogLines, getRandomElevatorMessage } from "@/utils/dialogue-utils"
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
  characterDialogues?: Record<string, string[]>
  onLevelComplete: () => void
  onTransition: (transitionId: string) => void
}

// Define dialogueOptions here
const dialogueOptions = [
  "AAAGH! IT HURTS!",
  "Can't... think...",
  "STOP! PLEASE!",
  "My brain... melting...",
  "No more... switches...",
]

// Define getBrainLampImage here
const getBrainLampImage = (correctCombinations: number) => {
  switch (correctCombinations) {
    case 0:
      return "/images/brainlamp.webp" // 0 correct
    case 1:
      return "/images/brainlamp1animated.webp" // 1 correct
    case 2:
      return "/images/brainlamp2animated.webp" // 2 correct
    case 3:
      return "/images/brainlamp3animated.webp" // 3 correct
    case 4:
      return "/images/brainlamp4animated.webp" // 4 correct
    case 5:
      return "/images/brainlamp5animated.webp" // 5 correct
    case 6:
      return "/images/brainlamp6animated.webp" // 6 correct (all)
    default:
      return "/images/brainlamp.webp" // Default
  }
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
  characterDialogues,
  onLevelComplete,
  onTransition,
}: GameScreenProps) {
  const { playSound } = useAudio()
  const { vibrate } = useHaptics()
  const { unlockAchievement } = useAchievements()
  const { getItem, setItem } = useStorage()
  const getRandomDialogue = useCharacterDialogue()

  const [answer, setAnswer] = useState("")
  const [feedback, setFeedback] = useState("")
  const [isCorrect, setIsCorrect] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [isWrong, setIsWrong] = useState(false)
  const [touchStartY, setTouchStartY] = useState(0)
  const [touchEndY, setTouchEndY] = useState(0)
  const [showPuzzleDetails, setShowPuzzleDetails] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)
  const [guardDialogIndex, setGuardDialogIndex] = useState(0)
  const [showGuardPopup, setShowGuardPopup] = useState(false)
  const [jigsawComplete, setJigsawComplete] = useState(false)
  const [lightsOn, setLightsOn] = useState(false)
  const [solved, setSolved] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const questionnaireRef = useRef<any>(null)
  const [dynamicSolution, setDynamicSolution] = useState<string | null>(null)
  const [currentPyramidRoom, setCurrentPyramidRoom] = useState<string>("entrance")
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
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null)
  const [userInput, setUserInput] = useState("")
  const [hintIndex, setHintIndex] = useState(0)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [attempts, setAttempts] = useState(0)
  // Add state for brain dialogue
  const [brainDialogue, setBrainDialogue] = useState<string>("")
  const [showBrainDialogue, setShowBrainDialogue] = useState<boolean>(false)

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
    const normalizedCorrectAnswers =
      puzzle.isQuestionnairePuzzle && dynamicSolution ? [dynamicSolution] : puzzle.solution.toLowerCase().split("|")
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

  const togglePuzzleDetails = () => {
    setShowPuzzleDetails(!showPuzzleDetails)
  }

  // Handle location image click for level 50
  const handleLocationClick = () => {
    if (level === 50) {
      // Always show elevator panel when location image is clicked in level 50
      setShowElevatorPanel(true)
      setHasUsedElevator(true)
    }
  }

  // Update the handleGuardClick function to properly handle sphinx click for level 38
  const handleGuardClick = () => {
    // Only handle special guard click for level 10
    if (level === 10 || level === 38) {
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
  }

  const handleJigsawComplete = () => {
    setJigsawComplete(true)
  }

  const handleParrotSolve = () => {
    setFeedback("Correct! Well done.")
    setIsCorrect(true)

    setTimeout(() => {
      setAnswer("")
      setFeedback("")
      setIsCorrect(false)
      setShowHints(false)
      onCorrect(false) // Normal progression
    }, 1500)
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
    // Don't automatically solve, let the player type the answer
  }

  // Handle pyramid room changes
  const handlePyramidRoomChange = (room: string) => {
    setCurrentPyramidRoom(room)
  }

  // Handle pyramid torch acquisition
  const handlePyramidTorchAcquired = () => {
    setHasPyramidTorch(true)
  }

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
          "My... thoughts...",
        ]
        dialogue = earlyDialogues[Math.floor(Math.random() * earlyDialogues.length)]
      } else if (binaryCorrectCombinations <= 3) {
        // Middle stage - increasing pain, less coherent
        const middleDialogues = [
          "AAAGH! IT HURTS!",
          "Can't... think...",
          "STOP! PLEASE!",
          "My brain... melting...",
          "No more... switches...",
        ]
        dialogue = middleDialogues[Math.floor(Math.random() * dialogueOptions.length)]
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

      {/* Level indicator */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm font-pixel text-purple-300 bg-gray-900/70 px-3 py-1 rounded-full border border-gray-800 shadow-lg flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-yellow-400" /> Level {level}
        </div>
        {level === 47 && (
          <div className="text-sm font-pixel text-purple-300 bg-gray-900/70 px-3 py-1 rounded-full border border-gray-800 shadow-lg flex items-center gap-1">
            The Brain
          </div>
        )}
        <button
          onClick={togglePuzzleDetails}
          className="flex items-center gap-1 text-xs bg-gray-800/80 px-2 py-1 rounded-full font-pixel border border-gray-700 hover:bg-gray-700/80 transition-colors"
        >
          {showPuzzleDetails ? (
            <>
              Hide Details <ChevronUp className="w-3 h-3" />
            </>
          ) : (
            <>
              Show Details <ChevronDown className="w-3 h-3" />
            </>
          )}
        </button>
      </div>

      {/* Character and location section */}
      {showPuzzleDetails && (
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
        />
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
        onSolutionGenerated={(solution) => setDynamicSolution(solution)}
        setBinaryCorrectCombinations={setBinaryCorrectCombinations}
        questionnaireRef={questionnaireRef}
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
          brainImage={getBrainLampImage(binaryCorrectCombinations)} // Pass the brain image
        />
      )}

      {/* Guard Dialog popup for level 10 */}
      {showGuardPopup && (level === 10 || level === 38) && (
        <CharacterDialoguePopup
          character={level === 10 ? "skeleton" : "sphinx"}
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
