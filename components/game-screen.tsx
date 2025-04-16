"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import type { Puzzle } from "@/types/puzzle"
import CharacterImage from "./character-image"
import LocationImage from "./location-image"
import HintSystem from "./hint-system"
import InmatePuzzle from "./inmate-puzzle"
import LibraryPuzzle from "./library-puzzle"
import JigsawPuzzle from "./jigsaw-puzzle"
import ParrotPuzzle from "./parrot-puzzle"
import AnimatedGifPuzzle from "./animated-gif-puzzle"
import LightSwitchPuzzle from "./light-switch-puzzle"
import TarotPuzzle from "./tarot-puzzle"
import QuestionnairePuzzle from "./questionnaire-puzzle"
import CoffeeGroundsPuzzle from "./coffee-grounds-puzzle"
import ZodiacPuzzle from "./zodiac-puzzle"
import CrystalJigsawPuzzle from "./crystal-jigsaw-puzzle"
import CrocodileJigsawPuzzle from "./crocodile-jigsaw-puzzle"
import PyramidPuzzle from "./pyramid-puzzle"
import { Send, X, Lightbulb, ChevronUp, ChevronDown, Volume2, VolumeX, Sparkles } from "lucide-react"
import FamiliarFacesPuzzle from "./familiar-faces-puzzle"
import HellJigsawPuzzle from "./hell-jigsaw-puzzle"
import CrystalSequencePuzzle from "./crystal-sequence-puzzle"
import FinalLevelPuzzle from "./final-level-puzzle"
import DevilDialogue from "./devil-dialogue"
import ElevatorPanel from "./elevator-panel"
import InfernalCasinoPuzzle from "./infernal-casino-puzzle"
import EgyptianPillarsPuzzle from "./egyptian-pillars-puzzle"
// Add this import at the top with the other imports
import DarkRoomPuzzle from "./dark-room-puzzle"
import MouthOfTruthPuzzle from "./mouth-of-truth-puzzle"
import { useAudio } from "@/hooks/use-audio"
import { useHaptics } from "@/hooks/use-haptics"
import { useAchievements } from "@/hooks/use-achievements"
import { useStorage } from "@/hooks/use-storage"

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
  onLevelComplete,
  onTransition,
}: GameScreenProps) {
  const { playSound } = useAudio()
  const { vibrate } = useHaptics()
  const { unlockAchievement } = useAchievements()
  const { getItem, setItem } = useStorage()

  const [answer, setAnswer] = useState("")
  const [feedback, setFeedback] = useState("")
  const [isCorrect, setIsCorrect] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [isWrong, setIsWrong] = useState(false) // Fixed: Initialize with false instead of isWrong
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

  // Guard dialog lines for level 10
  const guardDialogLines = [
    "An inmate has been murdered, and one of these four inmates did it. Who is the killer?",
    "What? I told you one of these four is the killer!",
    "Are you questioning me? Focus on the inmates!",
    "Stop wasting time and find the murderer among them!",
    "I'm the guard here, not a suspect. Now get back to work!",
  ]

  // Handle location image click for level 50
  const handleLocationClick = () => {
    if (level === 50) {
      // Always show elevator panel when location image is clicked in level 50
      setShowElevatorPanel(true)
      setHasUsedElevator(true)
    }
  }

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

  // Replace the getRandomDialogue function with this level-specific version

  const getRandomDialogue = useCallback(
    (character: string) => {
      // Level-specific dialogues for each character
      const levelSpecificDialogues: Record<string, Record<number, string[]>> = {
        skeleton: {
          1: [
            "First level, eh? Don't get cocky. They only get harder from here.",
            "This one's for babies. Let's see how you handle the real challenges.",
            "I've seen infants solve this puzzle. Impress me with speed at least.",
          ],
          2: [
            "Colors and bones. Simple enough for your primitive brain, I hope.",
            "Count carefully, prisoner. Numbers are the language of death.",
            "These bones belonged to the last prisoner who failed this test.",
          ],
          3: [
            "Mathematics. The universal language of suffering.",
            "Numbers don't lie. Unlike me.",
            "Solve for X, where X equals your remaining lifespan. Heh.",
          ],
          4: [
            "Fear your dreams? I fear nothing. Except perhaps competent prisoners.",
            "Letters and numbers. A child's game. Are you entertained yet?",
            "This puzzle was designed by a particularly sadistic guard. I like his style.",
          ],
          5: [
            "My boneboxes are quite the collectors' items. Made them myself.",
            "Count carefully. Or don't. Makes no difference to me.",
            "These cubes contain the essence of failed escapees. Feel their despair.",
          ],
          6: [
            "Round and round the clock goes, where it stops... well, you know.",
            "Time is meaningless here. You'll learn that soon enough.",
            "Clockwise, counterclockwise... all paths lead to the same end.",
          ],
          7: [
            "Words changing into other words. Like prisoners changing into corpses.",
            "One letter at a time, just like how I remove one bone at a time.",
            "This puzzle was designed by a poet. Before I removed his fingers.",
          ],
          8: [
            "Unscramble the letters? Why bother? You're still locked away.",
            "These letters spell your doom, no matter how you arrange them.",
            "Shackles. Fitting. That's what you'll wear for eternity.",
          ],
          9: [
            "Dots and dashes. Like the beating of a dying heart.",
            "This code was invented by a prisoner. He's part of my ribcage now.",
            "Decipher all you want. The message won't save you.",
          ],
          // Level 10 is excluded as it's part of the puzzle
        },
        butler: {
          11: [
            "The master was quite fond of wordplay, sir. A clever man, if somewhat... eccentric.",
            "I've maintained this mansion for generations. The spice rack, however, is not my domain.",
            "The kitchen staff used to prepare the most exquisite meals. Alas, they've been... let go.",
          ],
          12: [
            "The master's timepieces are all precisely synchronized, sir. He was most particular about punctuality.",
            "That clock has been in the family for seventeen generations. It has never lost a second.",
            "Time moves differently in this mansion, sir. You may find that hours pass like minutes... or years.",
          ],
          13: [
            "The master's art collection is quite extensive. Each piece tells a story, if one knows how to look.",
            "That particular painting was acquired under... unusual circumstances. The artist was never seen again.",
            "The still life appears mundane, but the master insisted it contained profound secrets.",
          ],
          14: [
            "The master's puzzle boxes are quite ingenious, sir. He designed them himself.",
            "I believe this particular box once belonged to a French aristocrat. Before the... unpleasantness.",
            "The mechanism is quite delicate. Handle with care, if you please.",
          ],
          15: [
            "Ah, Patricia. The master spoke of her often, even decades after her passing.",
            "The portrait was painted just weeks before her untimely demise. The artist captured her essence perfectly.",
            "The master would spend hours staring at this portrait. Sometimes I would hear him speaking to it.",
          ],
          16: [
            "The master's library contains over ten thousand volumes, sir. Many quite rare.",
            "The master was a voracious reader. He claimed to have memorized every book in his collection.",
            "Some of these books are bound in... unusual materials. I wouldn't examine them too closely.",
          ],
          17: [
            "The lighting in this wing has always been problematic, sir. Mind your step.",
            "The darkness conceals many secrets in this mansion. Some best left undiscovered.",
            "I've always found that darkness reveals more than light, in its own way.",
          ],
          18: [
            "The master's silverware is sterling, of course. Polished daily, even now.",
            "Each piece was hand-crafted by a silversmith in Vienna. The master accepted nothing but perfection.",
            "The pattern is the family crest, sir. Dating back to the 12th century.",
          ],
          19: [
            "Count Papagalul is... an acquired taste, sir. The master found him amusing.",
            "The Count's vocabulary is quite colorful. I apologize in advance for any... impropriety.",
            "The Count has been with the family for generations. Longer than I, in fact.",
          ],
          20: [
            "The family archives are most extensive, sir. Genealogy was a passion of the master's.",
            "The House of Morvane has a storied history. Not all of it... pleasant.",
            "The master spent his final years researching his ancestry. What he discovered changed him profoundly.",
          ],
        },
        gypsy: {
          21: [
            "Your aura shifts like quicksilver. Fascinating to watch.",
            "The cards have been whispering your name for days. They're quite excited to meet you.",
            "I've read many palms in my time, but yours... yours tells a story I've never seen before.",
          ],
          22: [
            "The grounds never lie, though they speak in riddles and shadows.",
            "I learned tasseography from my grandmother, who learned it from hers, back to the old country.",
            "Coffee, tea, wine... all leave their marks. All tell their tales.",
          ],
          23: [
            "Numbers hold power. Each has its own personality, its own spirit.",
            "My crystal shows me sequences, patterns in the chaos of existence.",
            "The universe speaks through mathematics. Few have the ears to hear it.",
          ],
          24: [
            "These crystal fragments once formed a whole. Like your fragmented memories, perhaps?",
            "Each shard contains a piece of ancient wisdom. Together, they reveal a greater truth.",
            "The mosaic was shattered during the last blood moon. An omen, some would say.",
          ],
          25: [
            "These symbols were used by ancient mystics to encode their most powerful secrets.",
            "Shapes hold power. Triangles for change, circles for protection, squares for stability.",
            "The ancients understood geometry as the language of the universe.",
          ],
          26: [
            "The stars have much to tell us tonight. They've been watching you.",
            "The heavens record all that has been and much that will be.",
            "My people have read the night sky for millennia. Its language is older than words.",
          ],
          27: [
            "These tapestries were woven by my great-grandmother. She could see beyond the veil.",
            "The zodiac is a map of destiny. Your sign is... interesting. Very interesting indeed.",
            "The constellations are in unusual alignment tonight. A rare occurrence.",
          ],
          28: [
            "Each crystal resonates with a different energy. Together, they create harmony... or chaos.",
            "These stones have been in my family for generations. They choose their bearers, not the other way around.",
            "The sequence matters. Like notes in a melody or words in an incantation.",
          ],
          29: [
            "Sometimes words fail us. Sometimes silence speaks louder.",
            "My hands remember what my mind forgets. They carry ancient knowledge.",
            "Watch carefully. The body never lies, even when the tongue does.",
          ],
          30: [
            "The Major Arcana reveals the soul's journey. Yours is... unconventional.",
            "These cards have been in my family for centuries. They've absorbed much wisdom.",
            "The tarot doesn't predict the future. It reveals the present, if you have eyes to see.",
          ],
        },
        sphinx: {
          31: [
            "These symbols were ancient when I was young, and I am older than the desert itself.",
            "The scribes who carved these hieroglyphs turned to dust eons ago. Their words remain.",
            "Language is humanity's greatest invention. It outlives its creators.",
          ],
          32: [
            "Truth and lies dance together in the desert heat. Can you tell them apart?",
            "These four have been arguing for centuries. I find their disputes... amusing.",
          ],
          // Level 33 is excluded as it's part of the puzzle
          34: [
            "The crocodile god was feared and revered in equal measure.",
            "Water is precious in the desert. Those who control it control life itself.",
            "This deity was known to devour the unworthy. Consider yourself warned.",
          ],
          35: [
            "The desert plays tricks on weary travelers. What you see may not be real.",
            "I have watched countless souls wander in circles, chasing visions that fade like morning mist.",
            "The line between reality and illusion is thin here. Sometimes, it disappears entirely.",
          ],
          36: [
            "Numbers follow patterns, like footprints in the sand.",
            "This sequence was discovered by a mathematician who went mad contemplating infinity.",
            "Each number contains the essence of those that came before. Like generations of a family.",
          ],
          37: [
            "These pillars have stood for millennia, bearing the names of gods and kings.",
            "The ancient Egyptians believed names held power. To speak a name was to summon its essence.",
            "Match the names correctly. The gods are watching, and they are... particular.",
          ],
          // Level 38 is excluded as it's part of the puzzle
          39: [
            "The ancient Egyptians were master mathematicians. They built the pyramids with numbers, not magic.",
            "These papyri contain the calculations of royal architects. Their precision was remarkable.",
            "Symbols represent concepts. Numbers represent reality. Both can be manipulated by the wise.",
          ],
          40: [
            "The pyramid's chambers were designed to confuse intruders and protect the pharaoh's journey to the afterlife.",
            "Light and shadow play eternal games within these stone walls.",
            "Some chambers have remained sealed for thousands of years. Perhaps for good reason.",
          ],
        },
        devil: {
          41: [
            "Fire speaks, if you know how to listen. It whispers of destruction and rebirth.",
            "These flames have consumed countless souls. Yours would make a lovely addition.",
            "The message burns eternal, like the damned themselves. Poetic, isn't it?",
          ],
          42: [
            "Chess is a game of kings and pawns. Guess which one you are?",
            "I've been playing this game for millennia. No one has beaten me yet.",
            "Every move has consequences. Choose wisely... or don't. I win either way.",
          ],
          43: [
            "These souls have been counting for eternity. It keeps them... occupied.",
            "Numbers are the only constant in Hell. Everything else changes. Constantly.",
            "Count carefully. A mistake means starting over. For another thousand years.",
          ],
          44: [
            "This scene depicts one of my favorite methods of transportation. For new arrivals, of course.",
            "The artist captured the essence of despair quite beautifully, don't you think?",
            "I commissioned this piece personally. The painter is still working on the sequel.",
          ],
          // Level 45 is excluded as it's part of the puzzle
          46: [
            "Gambling is a vice I particularly enjoy. The house always wins, especially when I own the house.",
            "These slot machines are rigged, of course. But not in the way you might think.",
            "Care to place a wager? Your soul against... well, nothing. I already own it.",
          ],
          47: [
            "Ah, the human brain. Such a fragile, easily manipulated thing.",
            "I've always found the binary system so elegant. Simple, yet capable of infinite complexity.",
            "Let's see if you can rewire this little plaything to my liking.",
          ],
          48: [
            "Seven doors, seven sins. Everyone has a favorite. What's yours?",
            "Behind each door lies a specially tailored torment. I designed them myself.",
            "Choose wisely. Or don't. All paths lead to me eventually.",
          ],
          49: [
            "Poetry in Hell. One of my little jokes.",
            "This verse was composed by a damned poet. He writes exclusively in tears now.",
            "The rhythm is meant to mimic a heartbeat. Yours, specifically.",
          ],
          50: [
            "My elevator provides express service to all levels of Hell. No return tickets, I'm afraid.",
            "Each floor offers unique accommodations. All equally... stimulating.",
            "The descent is the easy part. It's the staying that becomes problematic.",
          ],
        },
      }

      // If we have a level-specific dialogue for this character and level, use it
      if (levelSpecificDialogues[character] && levelSpecificDialogues[character][level]) {
        const dialogues = levelSpecificDialogues[character][level]
        return dialogues[Math.floor(Math.random() * dialogues.length)]
      }

      // Default dialogues for each character as fallback
      const defaultDialogues: Record<string, string[]> = {
        skeleton: [
          "Mphf. What do you want now?",
          "Stop wasting my time, prisoner.",
          "These bones have seen more than you ever will.",
          "Tsk. Another day, another fool trying to escape.",
          "You think you're clever? I've seen hundreds like you.",
          "The last one who tried to escape is now part of my collection.",
          "Rattle my bones once more and I'll make sure you never leave.",
          "What's the matter? Cat got your tongue? Or just your wits?",
          "I've been guarding this prison since before your grandparents were born.",
          "You humans are all the same. So fragile, so temporary.",
        ],
        butler: [
          "I do hope you're finding everything to your satisfaction, sir.",
          "The master's puzzles have confounded many before you.",
          "One must maintain proper decorum, even in the most trying circumstances.",
          "I've served in this mansion for generations, if you'll pardon the temporal anomaly.",
          "Might I suggest a more... methodical approach, sir?",
          "The previous guests found these challenges quite... stimulating.",
          "I assure you, sir, everything is precisely as the master intended it to be.",
          "One does not rush art, nor does one rush a proper puzzle solution.",
          "The master was most particular about the arrangement of his affairs.",
          "I'm afraid I cannot offer additional assistance at this time, sir.",
        ],
        gypsy: [
          "The cards never lie, but sometimes they speak in riddles.",
          "I see shadows in your future... and light, if you're clever enough.",
          "Your fate is not sealed, wanderer. It shifts with every choice you make.",
          "My grandmother taught me to read the signs when I was just a child.",
          "The spirits whisper many secrets... if only you could hear them too.",
          "Cross my palm with silver... ah, just a figure of speech, my dear.",
          "The veil between worlds grows thin around you. Most curious.",
          "I've traveled from the mountains of Carpathia to the deserts of Sahara.",
          "Your aura... it flickers with uncertainty. And something else...",
          "The moon is waxing. A good time for revelations, no?",
        ],
        sphinx: [
          "Mortals have puzzled over my riddles for millennia.",
          "Time is but a grain of sand in the desert of eternity.",
          "I have watched empires rise and fall from these sands.",
          "The answer you seek may not be the one you need.",
          "Wisdom comes to those who listen to the whispers of the desert.",
          "I speak in riddles because truth is rarely straightforward.",
          "The pharaohs of old sought my counsel, as you do now.",
          "My gaze has witnessed the construction of the pyramids themselves.",
          "The desert holds many secrets. Some are best left buried.",
          "Patience is a virtue that few mortals possess.",
        ],
        devil: [
          "Oh, how delightful! Another soul to... entertain.",
          "I do so enjoy watching mortals struggle with my little games.",
          "Eternity is such a long time to spend in my company, don't you think?",
          "Your predecessors found my puzzles quite... consuming.",
          "The clock is ticking, though time has little meaning here.",
          "Your soul has such a... distinctive flavor. I look forward to savoring it.",
          "Hell is just a matter of perspective, wouldn't you agree?",
          "I've been collecting interesting souls since before your species walked upright.",
          "The terms of our agreement are quite binding. Literally, in some cases.",
          "Your determination is admirable, if ultimately futile.",
        ],
      }

      // Get the dialogues for the current character
      const dialogues = defaultDialogues[character] || defaultDialogues.skeleton

      // Return a random dialogue
      return dialogues[Math.floor(Math.random() * dialogues.length)]
    },
    [level],
  )

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
      setCharacterDialogue(getRandomDialogue(character))
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

  // Get random elevator message
  const getRandomElevatorMessage = () => {
    const messages = [
      "The elevator descends with a sickening lurch...",
      "The elevator doors open to reveal a nightmarish scene...",
      "As the elevator stops, screams echo from beyond the doors...",
      "The elevator shudders to a halt, and the doors slide open with a groan...",
      "The temperature changes dramatically as the elevator doors open...",
      "A wave of despair washes over you as the elevator reaches its destination...",
      "The elevator's descent seems to take an eternity before finally stopping...",
      "The elevator doors part to reveal the horrors that await...",
    ]

    return messages[Math.floor(Math.random() * messages.length)]
  }

  // Get location image for pyramid puzzle
  const getPyramidLocationImage = () => {
    if (!isPyramidPuzzle) return null

    // Ra room with no torch
    if (currentPyramidRoom === "ra" && !hasPyramidTorch) {
      return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pyramid-inside-lit-VmsutDcMH6wQp2notj76LQQo7dgKut.webp"
    }

    // Dark mural rooms with no torch
    if (!hasPyramidTorch && ["mural1", "mural2", "mural3", "mural4"].includes(currentPyramidRoom)) {
      return "/images/pitch-darkness.webp"
    }

    // Default for all other rooms or when torch is present
    return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pyramid-inside-DpO8zywmCoFoK1uuVLRL6w0rd7yZTt.webp"
  }

  // Get location image for level 50
  const getLevel50LocationImage = () => {
    // Always show elevator.webp after the player has used the elevator once or all pieces are removed
    if (hasUsedElevator || currentElevatorFloor !== 0 || showElevator) {
      return "/images/elevator.webp"
    } else {
      // In jigsaw room without elevator revealed
      return "/images/hell-bg.webp"
    }
  }

  // Add this handler for the location image click
  const handlePyramidLocationImageClick = () => {
    if (isPyramidPuzzle && currentPyramidRoom === "ra" && !hasPyramidTorch) {
      setHasPyramidTorch(true)
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

  // Check if this puzzle has an image
  const hasImage = puzzle.imageUrl && puzzle.imageUrl.trim() !== ""

  // Check if this is an interactive inmate puzzle
  const isInteractiveInmates = puzzle.isInteractiveInmates && puzzle.inmateData && puzzle.inmateData.length > 0

  // Check if this is a library puzzle
  const isLibraryPuzzle =
    puzzle.isLibraryPuzzle && puzzle.libraryData && puzzle.libraryData.books && puzzle.libraryData.books.length > 0

  // Check if this is a jigsaw puzzle
  const isJigsawPuzzle = puzzle.isJigsawPuzzle

  // Check if this is a parrot puzzle
  const isParrotPuzzle = puzzle.isParrotPuzzle

  // Check if this is a light switch puzzle
  const isLightSwitchPuzzle = puzzle.isLightSwitchPuzzle

  // Check if this is a tarot puzzle
  const isTarotPuzzle = puzzle.isTarotPuzzle

  // Check if this is a questionnaire puzzle
  const isQuestionnairePuzzle = puzzle.isQuestionnairePuzzle

  // Check if this is a coffee grounds puzzle
  const isCoffeeGroundsPuzzle = level === 22

  // Check if this is a zodiac puzzle
  const isZodiacPuzzle = puzzle.isZodiacPuzzle

  // Check if this is a crystal jigsaw puzzle
  const isCrystalJigsawPuzzle = puzzle.isCrystalJigsawPuzzle

  // Check if this is a crocodile jigsaw puzzle
  const isCrocodileJigsawPuzzle = puzzle.isCrocodileJigsawPuzzle

  // Check if this is a pyramid puzzle
  const isPyramidPuzzle = puzzle.isPyramidPuzzle
  // Add these checks in the component, near where other puzzle type checks are defined
  const isFamiliarFacesPuzzle = puzzle.isFamiliarFacesPuzzle
  // Add this check in the component, near where other puzzle type checks are defined
  const isHellJigsawPuzzle = puzzle.isHellJigsawPuzzle
  // Add this to the interface checks section in the component
  const isCrystalSequencePuzzle = puzzle.isCrystalSequencePuzzle
  const isInfernalCasinoPuzzle = puzzle.isInfernalCasinoPuzzle
  const isEgyptianPillarsPuzzle = puzzle.isEgyptianPillarsPuzzle
  // Add this check in the component, near where other puzzle type checks are defined
  const isDarkRoomPuzzle = puzzle.isDarkRoomPuzzle
  // Add this check in the component, near where other puzzle type checks are defined
  const isEgyptianMathPuzzle = puzzle.isEgyptianMathPuzzle
  // Add a new property to check for the Mouth of Truth puzzle type in the interface checks section:
  const isMouthOfTruthPuzzle = puzzle.isMouthOfTruthPuzzle

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

  // Helper function to get the correct brain lamp image based on correct combinations
  const getBrainLampImage = (correctCount: number) => {
    switch (correctCount) {
      case 0:
        return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/brainlamp-WFdoE18rmyknvtBRPsfJ9IhWxiF6UF.webp" // 0 correct
      case 1:
        return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/brainlamp1a-jtarQ6DvWLbkdtCw85rPutJZjTRo7m.webp" // 1 correct
      case 2:
        return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/brainlamp2a.webp-UzQCOHqf2namH8byDVbukpZaSsa4hh.jpeg" // 2 correct
      case 3:
        return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/brainlamp3a.webp-qAtXl3omCCUIuJTEfDrOR67BrSbG1Q.jpeg" // 3 correct
      case 4:
        return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/brainlamp4a-Xrk7CsmuuYZ9jE2TiSiO704I0Hz7GG.webp" // 4 correct
      case 5:
        return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/brainlamp5a.webp-Zlp6vJ310VRTduwCjeLLFI19WZmY3t.jpeg" // 5 correct
      case 6:
        return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/brainlamp6a.webp-tFVEX3bXENwvQR5P0V3jv2zOyTb7u4.jpeg" // 6 correct (all)
      default:
        return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/brainlamp-WFdoE18rmyknvtBRPsfJ9IhWxiF6UF.webp" // Default
    }
  }

  // Helper function to get the correct brain lamp opacity based on correct combinations
  const getBrainLampOpacity = (correctCount: number) => {
    switch (correctCount) {
      case 0:
        return 0.7 // 0 correct
      case 1:
        return 0.7 // 1 correct
      case 2:
        return 0.75 // 2 correct
      case 3:
        return 0.8 // 3 correct
      case 4:
        return 0.85 // 4 correct
      case 5:
        return 0.9 // 5 correct
      case 6:
        return 1 // 6 correct (all)
      default:
        return 0.7 // Default
    }
  }

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

      {/* Character and location section - special handling for level 17 */}
      {showPuzzleDetails && level === 17 && (
        <div className="grid grid-cols-2 gap-3 mb-4 animate-fadeIn">
          <div className="flex justify-center items-center">
            <div className="w-40 h-40 relative pixelated-container">
              <Image
                src={
                  solved
                    ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/the-butler-UiGmVrOHpSIeCMysGrv0fnFXeIKb8c.webp" // the-butler.webp
                    : lightsOn
                      ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/the-butler-undead-MP8fUsQPQyAfYNqQ8vh5jHD6ccDAiX.webp" // butler-undead.webp
                      : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pitch-darkness-hHHhjqR7LwsUXdako3Kczz70K9LK40.webp" // pitch-darkness.webp
                }
                alt={lightsOn ? "Butler" : "Darkness"}
                width={160}
                height={160}
                className="pixelated"
              />
            </div>
          </div>
          <div className="flex justify-center items-center">
            <div className="w-40 h-40 relative pixelated-container">
              <Image
                src={
                  solved
                    ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mansion-8F0FXySQS7FpTruWOt1MsbbrL7IKiw.webp" // mansion.webp
                    : lightsOn
                      ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mansion-lit-Y00BfTg0ZTovGTlXIoaVpm4btmNctX.webp" // Updated mansion-lit.webp
                      : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pitch-darkness-hHHhjqR7LwsUXdako3Kczz70K9LK40.webp" // pitch-darkness.webp
                }
                alt={lightsOn ? "Mansion" : "Darkness"}
                width={160}
                height={160}
                className="pixelated"
              />
            </div>
          </div>
        </div>
      )}

      {/* Character and location section - special handling for level 29 */}
      {showPuzzleDetails && level === 29 && (
        <div className="grid grid-cols-2 gap-3 mb-4 animate-fadeIn">
          <div className="flex justify-center items-center">
            <CharacterImage character={character} />
          </div>
          <div className="flex justify-center items-center">
            <LocationImage setting={setting} customImage={puzzle.locationImage} hintImage={puzzle.imageHint} />
          </div>
        </div>
      )}

      {/* Character and location section - special handling for level 39 */}
      {showPuzzleDetails && level === 39 && (
        <div className="grid grid-cols-2 gap-3 mb-4 animate-fadeIn">
          <div className="flex justify-center items-center">
            <CharacterImage character={character} />
          </div>
          <div className="flex justify-center items-center">
            <LocationImage setting={setting} customImage={null} hintImage={null} />
          </div>
        </div>
      )}

      {/* Character and location section - special handling for level 50 */}
      {showPuzzleDetails && level === 50 && (
        <div className="grid grid-cols-2 gap-3 mb-4 animate-fadeIn">
          {/* Character image (Devil) */}
          <div className="flex justify-center items-center">
            <CharacterImage character="devil" />
          </div>

          {/* Location image - always clickable for elevator access */}
          <div className="flex justify-center items-center cursor-pointer" onClick={handleLocationClick}>
            <div className="w-40 h-40 relative pixelated-container">
              <div className="absolute inset-0 bg-black/30 rounded-lg z-0"></div>
              <Image
                src={
                  hasUsedElevator || showElevator || jigsawComplete ? "/images/elevator.webp" : "/images/hell-bg.webp"
                }
                alt={`${setting} location`}
                width={160}
                height={160}
                className="pixelated z-10 relative"
              />
              <div className="absolute -inset-1 border-2 border-gray-800 rounded-lg z-20 pointer-events-none"></div>
              <div className="absolute -bottom-1 left-0 right-0 h-1 bg-black/50 blur-sm z-30"></div>
            </div>
          </div>
        </div>
      )}

      {/* Character and location section - special handling for level 40 */}
      {showPuzzleDetails && level === 40 && (
        <div className="grid grid-cols-2 gap-3 mb-4 animate-fadeIn">
          <div className="flex justify-center items-center cursor-pointer" onClick={handleGuardClick}>
            <CharacterImage character={character} />
          </div>
          <div className="flex justify-center items-center cursor-pointer" onClick={handlePyramidLocationImageClick}>
            <div className="w-40 h-40 relative pixelated-container">
              <div className="absolute inset-0 bg-black/30 rounded-lg z-0"></div>
              <Image
                src={getPyramidLocationImage() || `/images/${setting}-bg.webp`}
                alt={`${setting} location`}
                width={160}
                height={160}
                className="pixelated z-10 relative"
              />
              <div className="absolute -inset-1 border-2 border-gray-800 rounded-lg z-20 pointer-events-none"></div>
              <div className="absolute -bottom-1 left-0 right-0 h-1 bg-black/50 blur-sm z-30"></div>
            </div>
          </div>
        </div>
      )}

      {/* Character and location section - special handling for level 47 */}
      {showPuzzleDetails && level === 47 && (
        <>
          <div className="grid grid-cols-2 gap-3 mb-4 animate-fadeIn">
            <div className="flex justify-center items-center cursor-pointer" onClick={handleGuardClick}>
              <CharacterImage character={character} />
            </div>
            <div className="flex justify-center items-center">
              <div className="w-40 h-40 relative pixelated-container">
                <div className="absolute inset-0 bg-black/30 rounded-lg z-0"></div>
                <Image
                  src={getBrainLampImage(binaryCorrectCombinations) || "/images/brainlamp.webp"}
                  alt="Brain Lamp"
                  width={160}
                  height={160}
                  className="pixelated z-10 relative w-full h-full object-contain"
                  style={{ opacity: getBrainLampOpacity(binaryCorrectCombinations) }}
                />
                <div className="absolute -inset-1 border-2 border-gray-800 rounded-lg z-20 pointer-events-none"></div>
                <div className="absolute -bottom-1 left-0 right-0 h-1 bg-black/50 blur-sm z-30"></div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Character and location section - for all other levels except 17, 29, 39, 40, 47 and 50 */}
      {showPuzzleDetails &&
        level !== 17 &&
        level !== 29 &&
        level !== 39 &&
        level !== 40 &&
        level !== 47 &&
        level !== 50 && (
          <div className="grid grid-cols-2 gap-3 mb-4 animate-fadeIn">
            <div className="flex justify-center items-center cursor-pointer" onClick={handleGuardClick}>
              <CharacterImage character={character} />
            </div>
            <div className="flex justify-center items-center">
              <div className="w-40 h-40 relative pixelated-container">
                <div className="absolute inset-0 bg-black/30 rounded-lg z-0"></div>
                <Image
                  src={puzzle.locationImage || `/images/${setting}-bg.webp`}
                  alt={`${setting} location`}
                  width={160}
                  height={160}
                  className="pixelated z-10 relative"
                />
                <div className="absolute -inset-1 border-2 border-gray-800 rounded-lg z-20 pointer-events-none"></div>
                <div className="absolute -bottom-1 left-0 right-0 h-1 bg-black/50 blur-sm z-30"></div>
              </div>
            </div>
          </div>
        )}

      {/* Guard Dialog popup for level 10 */}
      {showGuardPopup && (level === 10 || level === 38) && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={handleCloseGuardPopup}
        >
          <div
            className="bg-gray-900 p-4 rounded-lg border-2 border-gray-700 max-w-sm w-full animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="w-16 h-16 relative pixelated-container shrink-0">
                <Image
                  src={level === 10 ? "/images/skeleton.webp" : "/images/sphinx.webp"}
                  alt={level === 10 ? "Guard" : "Sphinx"}
                  width={64}
                  height={64}
                  className="pixelated"
                />
              </div>
              <div className="flex-1">
                <p className="text-purple-300 font-pixel mb-2">{level === 10 ? "Guard:" : "Sphinx:"}</p>
                <p className="text-gray-200 text-sm whitespace-pre-line">
                  {level === 10
                    ? `"${guardDialogLines[guardDialogIndex]}"`
                    : `"I have a bed, where I make my way,
I have a mouth, where I end my day.
I have banks, that hold me near,
I have a body, that is crystal clear."`}
                </p>
              </div>
            </div>
            <div className="mt-4 text-center">
              <button
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-xs text-gray-300 font-pixel"
                onClick={handleCloseGuardPopup}
              >
                Close
              </button>
            </div>
          </div>
        </div>
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

      {/* Puzzle content */}
      <div className="bg-gray-900/80 p-5 rounded-lg mb-4 border border-gray-800 shadow-inner flex-1 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-3">
          {level !== 17 && <p className="font-pixel text-lg text-purple-300 leading-relaxed">{puzzle.question}</p>}
          {/* Category badge removed as requested */}
        </div>

        {isInfernalCasinoPuzzle ? (
          <div className="my-4">
            <InfernalCasinoPuzzle
              onSolve={() => {
                // Don't automatically solve, let the player type the answer
              }}
            />
          </div>
        ) : null}

        {isCrystalJigsawPuzzle ? (
          <div className="my-4">
            {puzzle.description && (
              <p className="text-gray-300 whitespace-pre-line font-mono text-sm mb-4">{puzzle.description}</p>
            )}
            <CrystalJigsawPuzzle
              onComplete={() => {
                // Just set the jigsaw as complete, don't automatically advance
                setJigsawComplete(true)
              }}
            />
          </div>
        ) : isCrocodileJigsawPuzzle ? (
          <div className="my-4">
            {puzzle.description && (
              <p className="text-gray-300 whitespace-pre-line font-mono text-sm mb-4">{puzzle.description}</p>
            )}
            <CrocodileJigsawPuzzle
              onComplete={() => {
                // Just set the jigsaw as complete, don't automatically advance
                setJigsawComplete(true)
              }}
            />
          </div>
        ) : isQuestionnairePuzzle ? (
          <div className="my-4">
            {puzzle.description && (
              <p className="text-gray-300 whitespace-pre-line font-mono text-sm mb-4">{puzzle.description}</p>
            )}
            <QuestionnairePuzzle
              ref={questionnaireRef}
              onSolve={() => {
                setFeedback("Correct! Well done.")
                setIsCorrect(true)

                setTimeout(() => {
                  setAnswer("")
                  setFeedback("")
                  setIsCorrect(false)
                  setShowHints(false)
                  onCorrect(false) // Normal progression
                }, 1500)
              }}
              onRestart={handleQuestionnaireRestart}
              onSolutionGenerated={(solution) => {
                setDynamicSolution(solution)
              }}
            />
          </div>
        ) : isCoffeeGroundsPuzzle ? (
          <div className="my-4">
            {puzzle.description && (
              <p className="text-gray-300 whitespace-pre-line font-mono text-sm mb-4">{puzzle.description}</p>
            )}
            <CoffeeGroundsPuzzle
              onSolve={() => {
                setFeedback("Correct! Well done.")
                setIsCorrect(true)

                setTimeout(() => {
                  setAnswer("")
                  setFeedback("")
                  setIsCorrect(false)
                  setShowHints(false)
                  onCorrect(false) // Normal progression
                }, 1500)
              }}
            />
          </div>
        ) : isTarotPuzzle ? (
          <div className="my-4">
            {puzzle.description && (
              <p className="text-gray-300 whitespace-pre-line font-mono text-sm mb-4">{puzzle.description}</p>
            )}
            <TarotPuzzle
              onSolve={() => {
                setFeedback("Correct! Well done.")
                setIsCorrect(true)

                setTimeout(() => {
                  setAnswer("")
                  setFeedback("")
                  setIsCorrect(false)
                  setShowHints(false)
                  onCorrect(false) // Normal progression
                }, 1500)
              }}
            />
          </div>
        ) : isParrotPuzzle ? (
          <div className="my-4">
            {puzzle.description && (
              <p className="text-gray-300 whitespace-pre-line font-mono text-sm mb-4">{puzzle.description}</p>
            )}
            <ParrotPuzzle onSolve={handleParrotSolve} />
          </div>
        ) : isZodiacPuzzle ? (
          <div className="my-4">
            {puzzle.description && (
              <p className="text-gray-300 whitespace-pre-line font-mono text-sm mb-4">{puzzle.description}</p>
            )}
            <ZodiacPuzzle onSolve={handleZodiacSolve} />
          </div>
        ) : puzzle.isAnimatedGif ? (
          <div className="my-4">
            {puzzle.description && (
              <p className="text-gray-300 whitespace-pre-line font-mono text-sm mb-4">{puzzle.description}</p>
            )}
            <div className={level === 29 ? "bg-black p-4 rounded-lg" : ""}>
              <AnimatedGifPuzzle
                videoUrl={
                  puzzle.videoUrl ||
                  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hands-animation-J6PNaCc88j264qQxkPiSfPzA6Fzsbs.mp4"
                }
                altText={`Puzzle for level ${puzzle.level}`}
                showReplayButton={level !== 26} // Don't show replay button for level 26
              />
            </div>
          </div>
        ) : isJigsawPuzzle ? (
          <div className="my-4">
            {puzzle.description && (
              <p className="text-gray-300 whitespace-pre-line font-mono text-sm mb-4">{puzzle.description}</p>
            )}
            <JigsawPuzzle onComplete={handleJigsawComplete} />
          </div>
        ) : isLibraryPuzzle ? (
          <div className="my-4">
            {puzzle.description && (
              <p className="text-gray-300 whitespace-pre-line font-mono text-sm mb-4">{puzzle.description}</p>
            )}
            <LibraryPuzzle books={puzzle.libraryData?.books || []} />
          </div>
        ) : isInteractiveInmates ? (
          <div className="my-4">
            {puzzle.description && (
              <p className="text-gray-300 whitespace-pre-line font-mono text-sm mb-4">{puzzle.description}</p>
            )}
            <InmatePuzzle
              inmates={puzzle.inmateData || []}
              guardStatement={puzzle.guardStatement || guardDialogLines[guardDialogIndex]}
              level={level}
              onGuardClick={handleGuardClick}
            />
          </div>
        ) : isLightSwitchPuzzle ? (
          <div className="my-4">
            {/* No description text for level 17 */}
            {level !== 17 && puzzle.description && (
              <p className="text-gray-300 whitespace-pre-line font-mono text-sm mb-4">{puzzle.description}</p>
            )}
            <LightSwitchPuzzle onSolve={() => {}} onUpdate={handleLightSwitchUpdate} />
          </div>
        ) : isPyramidPuzzle ? (
          <div className="my-4">
            {puzzle.description && (
              <p className="text-gray-300 whitespace-pre-line font-mono text-sm mb-4">{puzzle.description}</p>
            )}
            <PyramidPuzzle
              onSolve={() => {
                // Don't automatically solve, let the player type the answer
              }}
              onRoomChange={handlePyramidRoomChange}
              onTorchAcquired={handlePyramidTorchAcquired}
              hasTorch={hasPyramidTorch}
              currentRoom={currentPyramidRoom}
            />
          </div>
        ) : level === 31 ? (
          <div className="flex flex-col items-center justify-center my-4 bg-black p-4 rounded-lg">
            <div className="w-full max-w-md relative pixelated-container mb-4">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hyeroglyphs1-4yVXD0Okuqc06VyH3fA9yjIwz0sCBR.webp"
                alt="Hieroglyphs part 1"
                width={400}
                height={100}
                className="pixelated z-10 relative w-full object-contain"
              />
            </div>
            <div className="w-full max-w-md relative pixelated-container">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hyeroglyphs2-Ws9pjdF8pnqTgk6shmeR8y4ZeECG9q.webp"
                alt="Hieroglyphs part 2"
                width={400}
                height={100}
                className="pixelated z-10 relative w-full object-contain"
              />
            </div>
          </div>
        ) : hasImage ? (
          <div className="flex justify-center my-4">
            <div className="w-full max-w-md relative pixelated-container">
              <div className="absolute inset-0 bg-black/30 rounded-lg z-0"></div>
              <Image
                src={puzzle.imageUrl || "/placeholder.svg"}
                alt={`Puzzle for level ${puzzle.level}`}
                width={400}
                height={400}
                className="pixelated z-10 relative w-full object-contain"
              />
              <div className="absolute -inset-1 border-2 border-gray-800 rounded-lg z-20 pointer-events-none"></div>
            </div>
          </div>
        ) : puzzle.description ? (
          <div className="text-gray-300 whitespace-pre-line font-mono text-sm bg-gray-950/50 p-4 rounded-lg border border-gray-800 shadow-inner">
            {puzzle.description}
          </div>
        ) : null}
        {isFamiliarFacesPuzzle ? (
          <div className="my-4">
            {/* Remove the redundant description text for level 45 */}
            {level !== 45 && puzzle.description && (
              <p className="text-gray-300 whitespace-pre-line font-mono text-sm mb-4">{puzzle.description}</p>
            )}
            <FamiliarFacesPuzzle
              id="familiar-faces-puzzle"
              onSolve={() => {
                // Don't automatically solve, let the player type the answer
              }}
              handleDevilClick={() => {}}
            />
          </div>
        ) : null}
        {isHellJigsawPuzzle ? (
          <div className="my-4">
            {puzzle.description && (
              <p className="text-gray-300 whitespace-pre-line font-mono text-sm mb-4">{puzzle.description}</p>
            )}
            <HellJigsawPuzzle
              onComplete={() => {
                // Just set the jigsaw as complete, don't automatically advance
                setJigsawComplete(true)
              }}
            />
          </div>
        ) : null}
        {isCrystalSequencePuzzle ? (
          <div className="my-4">
            {puzzle.description && (
              <p className="text-gray-300 whitespace-pre-line font-mono text-sm mb-4">{puzzle.description}</p>
            )}
            <CrystalSequencePuzzle
              onSolve={() => {
                // Don't automatically solve, let the player type the answer
              }}
            />
          </div>
        ) : null}
        {level === 50 ? (
          <div className="my-4" id="final-level-puzzle">
            <FinalLevelPuzzle
              onSolve={() => {
                // Don't automatically solve, let the player type the answer
              }}
              onDevilClick={() => {}}
              onAllPiecesRemoved={handleAllPiecesRemoved}
              onElevatorPanelOpen={handleElevatorPanelOpen}
              currentFloor={currentElevatorFloor}
              onFloorChange={(floor) => setCurrentElevatorFloor(floor)}
            />
          </div>
        ) : null}
        {isEgyptianPillarsPuzzle ? (
          <div className="my-4">
            {puzzle.description && (
              <p className="text-gray-300 whitespace-pre-line font-mono text-sm mb-4">{puzzle.description}</p>
            )}
            <EgyptianPillarsPuzzle
              onSolve={() => {
                // Don't automatically solve, let the player type the answer
              }}
            />
          </div>
        ) : null}
        {isDarkRoomPuzzle ? (
          <div className="my-4">
            {puzzle.description && (
              <p className="text-gray-300 whitespace-pre-line font-mono text-sm mb-4">{puzzle.description}</p>
            )}
            <DarkRoomPuzzle
              onSolve={() => {
                // Don't automatically solve, let the player type the answer
              }}
            />
          </div>
        ) : null}
        {isMouthOfTruthPuzzle ? (
          <div className="my-4">
            {puzzle.description && (
              <p className="text-gray-300 whitespace-pre-line font-mono text-sm mb-4">{puzzle.description}</p>
            )}
            <MouthOfTruthPuzzle
              onSolve={() => {
                // Don't automatically solve, let the player type the answer
              }}
            />
          </div>
        ) : null}
      </div>

      {/* Answer input section - always show, even for parrot puzzle */}
      <div className="space-y-3 mt-auto">
        <div
          className="relative"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <input
            ref={inputRef}
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter your answer..."
            className={`w-full px-4 py-3 bg-gray-900/80 border-2 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-600 font-mono text-center ${
              isCorrect
                ? "border-green-600 focus:ring-green-600"
                : isWrong
                  ? "border-red-600 focus:ring-red-600"
                  : "border-gray-700"
            } transition-all duration-300 shadow-lg`}
            disabled={isCorrect}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                checkAnswer()
              }
            }}
          />

          {answer && (
            <button
              onClick={() => setAnswer("")}
              className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={checkAnswer}
            onMouseEnter={handleSubmitButtonMouseEnter}
            onMouseLeave={handleSubmitButtonMouseLeave}
            disabled={
              isCorrect || !answer.trim() || (level === 50 && jigsawComplete && !showElevator && isSubmitButtonHovered)
            }
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
              answer.trim() && !(level === 50 && jigsawComplete && !showElevator && isSubmitButtonHovered)
                ? "bg-purple-900 hover:bg-purple-800 text-white"
                : "bg-gray-800 text-gray-600 cursor-not-allowed"
            } ${level === 50 && jigsawComplete && !showElevator && isSubmitButtonHovered ? "opacity-0" : "opacity-100"}`}
          >
            <Send className="w-4 h-4" />
          </button>

          <div className="absolute -bottom-5 left-0 right-0 flex justify-center">
            <div className="text-xs text-gray-400 font-pixel">Swipe up to submit • Swipe down to clear</div>
          </div>
        </div>

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
      {showCharacterDialogue && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={handleCloseCharacterDialogue}
        >
          <div
            className="bg-gray-900 p-4 rounded-lg border-2 border-gray-700 max-w-sm w-full animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="w-16 h-16 relative pixelated-container shrink-0">
                <Image src={`/images/${character}.webp`} alt={character} width={64} height={64} className="pixelated" />
              </div>
              <div className="flex-1">
                <p className="text-purple-300 font-pixel mb-2">
                  {character.charAt(0).toUpperCase() + character.slice(1)}:
                </p>
                <p className="text-gray-200 text-sm whitespace-pre-line">"{characterDialogue}"</p>
              </div>
            </div>
            <div className="mt-4 text-center">
              <button
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-xs text-gray-300 font-pixel"
                onClick={handleCloseCharacterDialogue}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
