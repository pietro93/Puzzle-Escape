"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"
import Image from "next/image"

interface InfernalCasinoPuzzleProps {
  onSolve: () => void
}

// Individual slot component
const Slot = ({ slotContent, currentIndex, onRotate, isJackpot }) => {
  return (
    <div
      className={`relative w-12 h-36 bg-black border-2 ${isJackpot ? "border-yellow-500 shadow-[0_0_15px_rgba(255,215,0,0.7)]" : "border-red-800"} rounded-lg overflow-hidden shadow-lg transition-all duration-300`}
    >
      {/* Slot machine window effect with hellish glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-900/30 to-black/30 pointer-events-none"></div>
      <div className="absolute inset-0 shadow-[inset_0_0_10px_rgba(255,0,0,0.3)] pointer-events-none"></div>

      {/* Previous position (blurred) */}
      <div className="absolute inset-0 flex flex-col items-center justify-start pt-1 opacity-50 blur-[1px]">
        <div className="w-8 h-8 relative">
          <Image
            src={slotContent[(currentIndex - 1 + 6) % 6].topEmoji || "/placeholder.svg"}
            alt="Emoji"
            width={32}
            height={32}
            className="pixelated"
          />
        </div>
        <span className="text-2xl font-bold text-red-500">{slotContent[(currentIndex - 1 + 6) % 6].letter}</span>
        <div className="w-8 h-8 relative">
          <Image
            src={slotContent[(currentIndex - 1 + 6) % 6].bottomEmoji || "/placeholder.svg"}
            alt="Emoji"
            width={32}
            height={32}
            className="pixelated"
          />
        </div>
      </div>

      {/* Current position display */}
      <div className={`absolute inset-0 flex flex-col items-center justify-center ${isJackpot ? "animate-pulse" : ""}`}>
        <div className="w-8 h-8 relative">
          <Image
            src={slotContent[currentIndex].topEmoji || "/placeholder.svg"}
            alt="Emoji"
            width={32}
            height={32}
            className="pixelated"
          />
        </div>
        <span
          className={`text-3xl font-bold ${isJackpot ? "text-yellow-400" : "text-red-500"} border-2 ${isJackpot ? "border-yellow-500 bg-red-900/70" : "border-red-700 bg-black/50"} px-2 py-1 rounded transition-all duration-300`}
        >
          {slotContent[currentIndex].letter}
        </span>
        <div className="w-8 h-8 relative">
          <Image
            src={slotContent[currentIndex].bottomEmoji || "/placeholder.svg"}
            alt="Emoji"
            width={32}
            height={32}
            className="pixelated"
          />
        </div>
      </div>

      {/* Next position (blurred) */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-1 opacity-50 blur-[1px]">
        <div className="w-8 h-8 relative">
          <Image
            src={slotContent[(currentIndex + 1) % 6].topEmoji || "/placeholder.svg"}
            alt="Emoji"
            width={32}
            height={32}
            className="pixelated"
          />
        </div>
        <span className="text-2xl font-bold text-red-500">{slotContent[(currentIndex + 1) % 6].letter}</span>
        <div className="w-8 h-8 relative">
          <Image
            src={slotContent[(currentIndex + 1) % 6].bottomEmoji || "/placeholder.svg"}
            alt="Emoji"
            width={32}
            height={32}
            className="pixelated"
          />
        </div>
      </div>

      {/* Rotation buttons */}
      <button
        className="absolute top-0 left-0 right-0 h-6 flex justify-center items-center bg-black/70 hover:bg-red-900/70"
        onClick={() => onRotate("counterclockwise")}
      >
        <ChevronUp className="w-3 h-3 text-red-400" />
      </button>

      <button
        className="absolute bottom-0 left-0 right-0 h-6 flex justify-center items-center bg-black/70 hover:bg-red-900/70"
        onClick={() => onRotate("clockwise")}
      >
        <ChevronDown className="w-3 h-3 text-red-400" />
      </button>
    </div>
  )
}

// Dice and Coin component
const DiceAndCoin = ({ onRoll, diceValues, isRolling, coinSide }) => {
  // Function to render the appropriate dice face
  const renderDiceFace = (value) => {
    if (value === null) return <span className="text-4xl font-bold text-gray-400">?</span>

    // Custom dice faces with dots
    const renderDots = (num) => {
      switch (num) {
        case 1:
          return (
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="w-4 h-4 bg-red-600 rounded-full"></div>
            </div>
          )
        case 2:
          return (
            <div className="relative w-full h-full">
              <div className="absolute top-3 left-3 w-4 h-4 bg-red-600 rounded-full"></div>
              <div className="absolute bottom-3 right-3 w-4 h-4 bg-red-600 rounded-full"></div>
            </div>
          )
        case 3:
          return (
            <div className="relative w-full h-full">
              <div className="absolute top-3 left-3 w-4 h-4 bg-red-600 rounded-full"></div>
              <div className="absolute center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-red-600 rounded-full"></div>
              <div className="absolute bottom-3 right-3 w-4 h-4 bg-red-600 rounded-full"></div>
            </div>
          )
        case 4:
          return (
            <div className="relative w-full h-full">
              <div className="absolute top-3 left-3 w-4 h-4 bg-red-600 rounded-full"></div>
              <div className="absolute top-3 right-3 w-4 h-4 bg-red-600 rounded-full"></div>
              <div className="absolute bottom-3 left-3 w-4 h-4 bg-red-600 rounded-full"></div>
              <div className="absolute bottom-3 right-3 w-4 h-4 bg-red-600 rounded-full"></div>
            </div>
          )
        case 5:
          return (
            <div className="relative w-full h-full">
              <div className="absolute top-3 left-3 w-4 h-4 bg-red-600 rounded-full"></div>
              <div className="absolute top-3 right-3 w-4 h-4 bg-red-600 rounded-full"></div>
              <div className="absolute center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-red-600 rounded-full"></div>
              <div className="absolute bottom-3 left-3 w-4 h-4 bg-red-600 rounded-full"></div>
              <div className="absolute bottom-3 right-3 w-4 h-4 bg-red-600 rounded-full"></div>
            </div>
          )
        case 6:
          return (
            <div className="relative w-full h-full">
              <div className="absolute top-3 left-3 w-4 h-4 bg-red-600 rounded-full"></div>
              <div className="absolute top-3 right-3 w-4 h-4 bg-red-600 rounded-full"></div>
              <div className="absolute top-1/2 left-3 transform -translate-y-1/2 w-4 h-4 bg-red-600 rounded-full"></div>
              <div className="absolute top-1/2 right-3 transform -translate-y-1/2 w-4 h-4 bg-red-600 rounded-full"></div>
              <div className="absolute bottom-3 left-3 w-4 h-4 bg-red-600 rounded-full"></div>
              <div className="absolute bottom-3 right-3 w-4 h-4 bg-red-600 rounded-full"></div>
            </div>
          )
        default:
          return null
      }
    }

    return renderDots(value)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Coin display */}
      <div className="mb-2">
        <div
          className={`w-24 h-24 relative rounded-full overflow-hidden shadow-lg ${
            isRolling ? "animate-[flip_0.5s_ease-in-out]" : ""
          }`}
        >
          <Image
            src={
              coinSide === "heads"
                ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/coin_heads-9rmwIL7gw3p8f6DL2EOeQJmO5V9NyE.webp"
                : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/coin_tails-yKpHAhKj0UbBEKWpbMM7KGfhFVCoGX.webp"
            }
            alt={coinSide === "heads" ? "Heads" : "Tails"}
            width={96}
            height={96}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Dice display */}
      <div className="flex gap-6">
        <div
          className={`w-20 h-20 bg-white rounded-lg border-2 border-red-800 flex items-center justify-center shadow-lg ${
            isRolling ? "animate-[spin_0.5s_ease-in-out]" : ""
          }`}
        >
          {renderDiceFace(diceValues ? diceValues[0] : null)}
        </div>

        <div
          className={`w-20 h-20 bg-white rounded-lg border-2 border-red-800 flex items-center justify-center shadow-lg ${
            isRolling ? "animate-[spin_0.5s_ease-in-out]" : ""
          }`}
        >
          {renderDiceFace(diceValues ? diceValues[1] : null)}
        </div>
      </div>

      <button
        className="px-4 py-2 bg-red-800 hover:bg-red-700 text-white rounded-lg font-pixel shadow-lg transition-transform active:scale-95"
        onClick={onRoll}
        disabled={isRolling}
      >
        Flip Coin & Roll Dice 🎲
      </button>
    </div>
  )
}

export default function InfernalCasinoPuzzle({ onSolve }) {
  // Custom pixel art casino emojis
  const casinoEmojis = [
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/emoji_heart-Zgh290RQMLHpQ41yk9Rmis2DWZO3Zb.webp", // heart
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/emoji_cards-LuQXaIIGnGnw0q5M2zsoKlHtQNp8bh.webp", // cards
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/emoji_skull-nJ3i7Fu6MlyoXQv0gUZDO00pAJZdPG.webp", // skull
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/emoji_star-R39hppxr97h3gx2A16gFxvHQgJrB0H.webp", // star (updated)
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/emoji_flame-XHobXIYuEOJhBdvpZqysVK5lSa6Rzu.webp", // flame
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/emoji_spade-VP8dbS30fx3CmoFc8uM1Nn5bVbuizE.webp", // spade
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/emoji_club-pAEweiM0aCccWUWagUheD7acHGNBCU.webp", // club
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/emoji_seven-tPMG87eWpSe964c39RpdYZmqE3bhE2.webp", // seven
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/emoji_diamond-orAaxCuICSUWkI0R4XWX98FHKSIH5a.webp", // diamond
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/emoji_pokerchipblue-G2pnQBIRNX8p2NFDhk8xh3VqCIMO0z.webp", // poker chip blue
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/emoji_angel-5mLEQszoFuwWwN3bPj3ShqNsdq6L45.webp", // angel
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/emoji_moneybag-JZzR62WAPH1XYMe9JUpAUb5PYBmsDt.webp", // money bag
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/emoji_trident-2jtMqA1EL3l16zVjiajMSLtEcfa8lm.webp", // trident
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/emoji_diamondgem-TUqvdI3VKew3NuRs5rfO1p6A07EJa6.webp", // diamond gem
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/emoji_imp-Ll1ar62hDIY8Lo0OemN6VQDnKUmODF.webp", // imp
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/emoji_pokerchipred-97TsZd8QeXHpfYgdiJ9AiIS96IcFQ2.webp", // poker chip red
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/emoji_dollarsign-6epVMUlHhr0Zp7IkZAEIryi3K5bW3B.webp", // dollar sign
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/emoji_horseshoe-MWZxZ2UGkJx5Wpdv9owmCquRRuUO1j.webp", // horseshoe
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/emoji_clover-Ljrt4wMwuziYmZRCUpuf2noOdRhTcq.webp", // clover
  ]

  // Helper function to generate slot content with letters and emojis
  const generateSlotContent = (requiredLetters) => {
    const result = []

    // Add required letters with random emojis
    for (const letter of requiredLetters) {
      result.push({
        letter,
        topEmoji: casinoEmojis[Math.floor(Math.random() * casinoEmojis.length)],
        bottomEmoji: casinoEmojis[Math.floor(Math.random() * casinoEmojis.length)],
      })
    }

    // Fill remaining slots with random letters and emojis
    const commonLetters = "BCDFGIJKLOPQRSTUVWXYZ"
    const rareLetters = "HEAMNY"

    while (result.length < 6) {
      // 80% chance to pick from common letters, 20% chance for rare letters
      const letterPool = Math.random() < 0.8 ? commonLetters : rareLetters
      const randomLetter = letterPool[Math.floor(Math.random() * letterPool.length)]

      // Avoid duplicates in the same slot
      if (!result.some((item) => item.letter === randomLetter)) {
        result.push({
          letter: randomLetter,
          topEmoji: casinoEmojis[Math.floor(Math.random() * casinoEmojis.length)],
          bottomEmoji: casinoEmojis[Math.floor(Math.random() * casinoEmojis.length)],
        })
      }
    }

    // Shuffle the array
    return result.sort(() => Math.random() - 0.5)
  }

  // Initialize slot contents with the required letters and random ones
  const [slots, setSlots] = useState([
    generateSlotContent(["H", "M"]),
    generateSlotContent(["E", "A"]),
    generateSlotContent(["A", "Y"]),
    generateSlotContent(["V", "H"]),
    generateSlotContent(["E"]),
    generateSlotContent(["N", "M"]),
  ])

  // Current index for each slot (0-5)
  const [currentIndices, setCurrentIndices] = useState([0, 0, 0, 0, 0, 0])

  // Dice and coin state
  const [diceValues, setDiceValues] = useState(null)
  const [isRolling, setIsRolling] = useState(false)
  const [coinSide, setCoinSide] = useState("heads") // Initial state is heads

  // Word tracking
  const [lastFoundWord, setLastFoundWord] = useState("none")
  const [currentTargetWord, setCurrentTargetWord] = useState("heaven")

  // Add jackpot animation state
  const [showJackpot, setShowJackpot] = useState(false)
  const [jackpotWord, setJackpotWord] = useState("")

  // Check if a word is currently displayed
  const getCurrentWord = useCallback(() => {
    const currentLetters = currentIndices.map((index, slotIndex) => slots[slotIndex][index].letter)
    const word = currentLetters.join("")

    if (word === "HEAVEN") return "heaven"
    if (word === "MAYHEM") return "mayhem"
    return "none"
  }, [slots, currentIndices])

  // Update the effect to check if a word has been found
  useEffect(() => {
    const currentWord = getCurrentWord()

    if (currentWord !== "none" && currentWord !== lastFoundWord) {
      // Show jackpot animation on the slots
      setJackpotWord(currentWord.toUpperCase())
      setShowJackpot(true)
      setTimeout(() => {
        setShowJackpot(false)
      }, 3000)

      setLastFoundWord(currentWord)

      // Switch target word
      setCurrentTargetWord(currentWord === "heaven" ? "mayhem" : "heaven")

      // If both words have been found, trigger solve
      if (
        (currentWord === "heaven" && lastFoundWord === "mayhem") ||
        (currentWord === "mayhem" && lastFoundWord === "heaven")
      ) {
        setTimeout(() => {
          onSolve()
        }, 3000)
      }
    }
  }, [getCurrentWord, lastFoundWord, onSolve])

  // Handle slot rotation with animation
  const handleRotate = (slotIndex, direction) => {
    setCurrentIndices((prev) => {
      const newIndices = [...prev]
      if (direction === "clockwise") {
        newIndices[slotIndex] = (newIndices[slotIndex] + 1) % 6
      } else {
        newIndices[slotIndex] = (newIndices[slotIndex] - 1 + 6) % 6
      }
      return newIndices
    })
  }

  // Handle dice roll and coin flip
  const handleRollDiceAndFlipCoin = () => {
    setIsRolling(true)

    // Simulate dice rolling and coin flipping animation
    setTimeout(() => {
      // Flip the coin (50% chance for each side)
      const newCoinSide = Math.random() < 0.5 ? "heads" : "tails"
      setCoinSide(newCoinSide)

      const targetWord =
        currentTargetWord === "heaven" ? ["H", "E", "A", "V", "E", "N"] : ["M", "A", "Y", "H", "E", "M"]

      // Find slots that don't have the correct letter for the target word
      const incorrectSlots = targetWord
        .map((letter, index) => {
          const currentLetter = slots[index][currentIndices[index]].letter
          return currentLetter !== letter ? index : -1
        })
        .filter((index) => index !== -1)

      if (incorrectSlots.length === 0) {
        setIsRolling(false)
        return
      }

      // Randomly select one of the incorrect slots
      const slotIndex = incorrectSlots[Math.floor(Math.random() * incorrectSlots.length)]

      // Find the target letter we want to reach
      const targetLetter = targetWord[slotIndex]

      // Get the current slot content and index
      const slotContent = slots[slotIndex]
      const currentLetterIndex = currentIndices[slotIndex]

      // Find the position of the target letter in this slot
      let targetPosition = -1
      for (let i = 0; i < slotContent.length; i++) {
        if (slotContent[i].letter === targetLetter) {
          targetPosition = i
          break
        }
      }

      if (targetPosition === -1) {
        // No target letter found in this slot, just use a random dice value
        const diceResult = [slotIndex + 1, 1 + Math.floor(Math.random() * 6)]
        setDiceValues(diceResult)
        setIsRolling(false)
        return
      }

      // Calculate the number of steps needed based on the coin side
      let steps
      if (newCoinSide === "heads") {
        // For heads: count steps going UP (counterclockwise)
        steps = (currentLetterIndex - targetPosition + 6) % 6
      } else {
        // For tails: count steps going DOWN (clockwise)
        steps = (targetPosition - currentLetterIndex + 6) % 6
      }

      // If steps is 0, make it 6 (full rotation)
      if (steps === 0) steps = 6

      // Set dice values - first die is the slot number (1-6), second die is steps needed (1-6)
      const diceResult = [slotIndex + 1, steps]
      setDiceValues(diceResult)

      setIsRolling(false)
    }, 800)
  }

  return (
    <div className="flex flex-col items-center gap-6 p-4 bg-gray-900/80 rounded-lg border-2 border-red-800 shadow-[0_0_15px_rgba(255,0,0,0.3)]">
      <h2 className="text-2xl font-pixel text-red-500">Infernal Casino</h2>

      {/* Slot machines - responsive layout */}
      <div className="flex flex-wrap justify-center gap-3 w-full relative">
        <div className="flex justify-center gap-3 sm:flex-nowrap flex-wrap">
          {slots.map((slotContent, index) => (
            <Slot
              key={index}
              slotContent={slotContent}
              currentIndex={currentIndices[index]}
              onRotate={(direction) => handleRotate(index, direction)}
              isJackpot={showJackpot}
            />
          ))}
        </div>
      </div>

      {/* Dice and Coin */}
      <DiceAndCoin
        onRoll={handleRollDiceAndFlipCoin}
        diceValues={diceValues}
        isRolling={isRolling}
        coinSide={coinSide}
      />

      {/* Add some slot machine styling */}
      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotateX(0deg); }
          100% { transform: rotateX(360deg); }
        }
      
        @keyframes flip {
          0% { transform: rotateY(0deg); }
          50% { transform: rotateY(90deg); }
          100% { transform: rotateY(0deg); }
        }
      
        @keyframes jackpot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      
        .animate-jackpot {
          animation: jackpot 0.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
