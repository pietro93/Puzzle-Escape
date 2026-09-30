"use client"

import { useState } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import { DialogueText } from "@/components/dialogue-text"

interface TarotPuzzleProps {
  onSolve: () => void
}

export default function TarotPuzzle({ onSolve }: TarotPuzzleProps) {
  // States for tracking the puzzle progress
  const [currentStep, setCurrentStep] = useState(0)
  const [revealedCards, setRevealedCards] = useState<number[]>([])
  const [showFullCard, setShowFullCard] = useState<number | null>(null)
  const [readingComplete, setReadingComplete] = useState(false)
  const [waitingForClick, setWaitingForClick] = useState(false)
  const [showDecoderCard, setShowDecoderCard] = useState(false)

  // Card data
  const cards = [
    {
      id: 0,
      name: "The Tower",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/the-tower-oMGGoAM5EyK5uRozTQwIRVGRAsFXLO.webp",
      description:
        "Ah, The Tower. From your past. Lightning hits, crown falls. One moment everything is solid, next moment noise and glass and falling. Something broke in your life, all at once.",
      position: "Past",
    },
    {
      id: 1,
      name: "Death (Reversed)",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/the-death-q4CUzCuQkIcICz5umh922SunC7de4h.webp",
      description:
        "Death, but reversed, upside down. In your present! Relax your face, Death card means change. Upside down means you fight it. You stand at the door and won't walk through. Why you hold on so tight, eh?",
      position: "Present",
      isReversed: true,
    },
    {
      id: 2,
      name: "The Devil",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/the-devil-card-jbUOfPq9O11r05SnRDPanCMeEUMqM4.webp",
      description:
        "The Devil, in your future. Bad sign, very bad. Chains you make yourself, then blame on fate. Tell me, you like things that make the head cloudy? The bottle, maybe? The Devil gives pleasure first. Then he sends the bill.",
      position: "Future",
    },
    {
      id: 3,
      name: "The Hanged Man (Reversed)",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/the-hanged-man-lfRUkpx4fBO2LaBKp6PYretlisTMHo.webp",
      description:
        "The Hanged Man, also reversed. Your challenge. Right way up, he hangs by one foot and he is happy, he sees world from new angle. Upside down, he kicks and kicks. This is you. The road says wait, and you press the pedal anyway.",
      position: "Challenge",
      isReversed: true,
    },
    {
      id: 4,
      name: "The Fool",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/the-fool-zIJkNTtQTZ72JEe3OEifaAsNqZs4CU.webp",
      description:
        "The Fool! He walks off cliff smiling like baby. Stupid? Maybe. But he walks. You, you stand at the edge too long. See little dog at his feet? Dog knows. Listen to dog.",
      position: "Guidance",
    },
  ]

  // Decoder card
  const decoderCard = {
    id: 5,
    name: "Tarot Decoder",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tarot-decoder-ArWhfze9wYYvng3iPHW6CItDve6wQZ.webp",
    description:
      "Ooh, my eyes, they go big. Last card is a key, ~dragă~. The spirits want you to work for it. I have faith in you. Little bit. Solve, then go.",
  }

  // Handle card click during the reading
  const handleCardClick = (cardId: number) => {
    if (readingComplete) {
      // If reading is complete, show the full card
      setShowFullCard(cardId)
      return
    }

    if (waitingForClick) {
      // If waiting for click to proceed, move to next step
      setWaitingForClick(false)

      if (currentStep === cards.length) {
        // Show decoder card and complete reading
        setShowDecoderCard(true)
        setReadingComplete(true)
        onSolve()
      } else {
        setCurrentStep(currentStep + 1)
      }
      return
    }

    if (currentStep <= cards.length && !revealedCards.includes(cardId)) {
      setRevealedCards([...revealedCards, cardId])

      // Set waiting for click to proceed
      setWaitingForClick(true)
    }
  }

  // Close full card view
  const closeFullCard = () => {
    setShowFullCard(null)
  }

  // Get the current card to reveal
  const getCurrentCard = () => {
    if (currentStep < cards.length) {
      return cards[currentStep]
    }
    return decoderCard
  }

  // Get the gypsy's dialogue based on current step
  const getGypsyDialogue = () => {
    if (currentStep === 0) {
      return "Cards say your name all morning, traveler. Very rude, they don't let me sleep. Sit. Big cards only today, Major Arcana. Draw first one, your past."
    } else if (currentStep === 1) {
      return "So, that was before. Now, what shapes you today? Draw."
    } else if (currentStep === 2) {
      return "Now the future. Draw, draw, I don't bite."
    } else if (currentStep === 3) {
      return "Now what stands in your way. Next card."
    } else if (currentStep === 4) {
      return "Last one tells you what to do about it. Draw."
    } else if (currentStep === 5) {
      return "Reading is done. But spirits, they are greedy. They want one more card. This last one is a key. Keep it close."
    } else {
      return "Look at the cards good, traveler. The answer is in them. Spirits talked, now you do the thinking."
    }
  }

  // Get the instruction text based on current state
  const getInstructionText = () => {
    if (waitingForClick) {
      return "Click anywhere to continue..."
    } else if (!revealedCards.includes(currentStep)) {
      return "Click the card to reveal"
    }
    return ""
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Gypsy's dialogue */}
      <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-800 mb-4">
        <p className="text-purple-200 font-pixel text-sm"><DialogueText text={getGypsyDialogue()} /></p>
      </div>

      {/* Reading in progress */}
      {!readingComplete && (
        <div className="flex flex-col items-center" onClick={() => waitingForClick && handleCardClick(currentStep)}>
          <div
            className="w-64 h-96 relative cursor-pointer transition-transform hover:scale-105 active:scale-95"
            onClick={() => !waitingForClick && handleCardClick(currentStep)}
          >
            <Image
              src={
                revealedCards.includes(currentStep)
                  ? getCurrentCard().image
                  : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tarot-card-I42UWmPEoMDBNUaYOIjXZaePOUhs25.webp"
              }
              alt={revealedCards.includes(currentStep) ? getCurrentCard().name : "Tarot Card Back"}
              width={256}
              height={384}
              className="rounded-lg shadow-lg"
            />
          </div>

          {revealedCards.includes(currentStep) && (
            <div className="mt-4 bg-gray-900/70 p-3 rounded-lg border border-gray-800 animate-fadeIn">
              <p className="text-purple-300 font-pixel text-sm mb-1">
                {getCurrentCard().name} - {getCurrentCard().position}
              </p>
              <p className="text-gray-300 text-xs"><DialogueText text={getCurrentCard().description} /></p>
            </div>
          )}

          {getInstructionText() && <p className="mt-4 text-gray-400 text-xs animate-pulse">{getInstructionText()}</p>}
        </div>
      )}

      {/* Reading complete - show all cards */}
      {readingComplete && (
        <div className="animate-fadeIn">
          <h3 className="text-center text-purple-300 font-pixel mb-4">Your Tarot Reading</h3>

          {/* All cards in a row */}
          <div className="grid grid-cols-5 gap-2 mb-6">
            {cards.map((card) => (
              <div
                key={card.id}
                className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
                onClick={() => handleCardClick(card.id)}
              >
                <Image
                  src={card.image || "/placeholder.svg"}
                  alt={card.name}
                  width={80}
                  height={120}
                  className="rounded-lg shadow-lg"
                />
                <p className="text-xs text-center text-gray-400 mt-1">{card.position}</p>
              </div>
            ))}
          </div>

          {/* Decoder card */}
          <div className="flex justify-center mb-6">
            <div
              className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
              onClick={() => handleCardClick(decoderCard.id)}
            >
              <Image
                src={decoderCard.image || "/placeholder.svg"}
                alt={decoderCard.name}
                width={100}
                height={150}
                className="rounded-lg shadow-lg"
              />
              <p className="text-xs text-center text-gray-400 mt-1">Decoder</p>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-purple-300 font-pixel text-sm">
              "The cards have revealed your path. Now you must decipher their message to continue your journey."
            </p>
          </div>
        </div>
      )}

      {/* Full card view */}
      {showFullCard !== null && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={closeFullCard}
        >
          <div className="relative max-w-sm" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closeFullCard}
              className="absolute -top-4 -right-4 w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center border border-gray-700 z-10"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>

            <Image
              src={showFullCard < cards.length ? cards[showFullCard].image : decoderCard.image}
              alt={showFullCard < cards.length ? cards[showFullCard].name : decoderCard.name}
              width={320}
              height={480}
              className="rounded-lg shadow-lg"
            />

            {showFullCard < cards.length && (
              <div className="mt-4 bg-gray-900/90 p-3 rounded-lg border border-gray-800">
                <p className="text-purple-300 font-pixel text-sm mb-1">
                  {cards[showFullCard].name} - {cards[showFullCard].position}
                </p>
                <p className="text-gray-300 text-xs"><DialogueText text={cards[showFullCard].description} /></p>
              </div>
            )}

            {showFullCard === 5 && (
              <div className="mt-4 bg-gray-900/90 p-3 rounded-lg border border-gray-800">
                <p className="text-purple-300 font-pixel text-sm mb-1">{decoderCard.name}</p>
                <p className="text-gray-300 text-xs"><DialogueText text={decoderCard.description} /></p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
