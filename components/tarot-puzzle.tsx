"use client"

import { useState } from "react"
import Image from "next/image"
import { X } from "lucide-react"

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
        "Ah, The Tower... a powerful omen from your past. I see destruction, chaos, a sudden and violent change that shattered the foundations of your life. The lightning strikes, the crown falls, and those who once dwelled in false security are cast down. This card speaks of a moment when everything you believed to be solid crumbled beneath you.",
      position: "Past",
    },
    {
      id: 1,
      name: "Death (Reversed)",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/the-death-q4CUzCuQkIcICz5umh922SunC7de4h.webp",
      description:
        "Death reversed in your present... most interesting. The great transformation is being resisted. Something is preventing you from fully releasing the past and embracing necessary change. You stand at a threshold but refuse to cross it. The scythe is dull, the harvest delayed. Perhaps you cling to old patterns, old habits... or perhaps something external blocks your path forward.",
      position: "Present",
      isReversed: true,
    },
    {
      id: 2,
      name: "The Devil",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/the-devil-card-jbUOfPq9O11r05SnRDPanCMeEUMqM4.webp",
      description:
        "The Devil awaits in your future... a troubling sign. I see entrapment, addiction, the chains we forge ourselves yet blame on fate. Tell me, do you have a history with substances that cloud the mind? Or perhaps your bondage is of another nature—a relationship, a belief, a fear that holds you captive? The Devil offers power and pleasure but demands your freedom as payment.",
      position: "Future",
    },
    {
      id: 3,
      name: "The Hanged Man (Reversed)",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/the-hanged-man-lfRUkpx4fBO2LaBKp6PYretlisTMHo.webp",
      description:
        "The Hanged Man reversed represents your challenge. You resist the suspension, the surrender, the sacrifice needed for enlightenment. In your right position, this figure gains wisdom through stillness and seeing the world from a different perspective. But reversed, I see impatience, an unwillingness to pause and reflect. You struggle against necessary delays, fighting the very stillness that would grant you insight.",
      position: "Challenge",
      isReversed: true,
    },
    {
      id: 4,
      name: "The Fool",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/the-fool-zIJkNTtQTZ72JEe3OEifaAsNqZs4CU.webp",
      description:
        "And finally, The Fool offers guidance. The divine innocent, stepping joyfully into the unknown. This card encourages you to embrace new beginnings with faith and optimism. Release your fear of appearing foolish. Take that first step, even when you cannot see the entire path. Trust in the journey. The little dog at The Fool's heels represents instinct and loyalty—listen to your intuition, but do not let fear hold you back.",
      position: "Guidance",
    },
  ]

  // Decoder card
  const decoderCard = {
    id: 5,
    name: "Tarot Decoder",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tarot-decoder-ArWhfze9wYYvng3iPHW6CItDve6wQZ.webp",
    description:
      "My eyes grow wide as I reveal this final card. The spirits have spoken clearly tonight. This key will unlock the path forward, but only for those with the wisdom to interpret its meaning. I have faith in you, traveler. Solve this riddle and continue your journey.",
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
      return "The cards have been whispering your name, traveler. I will now give you a tarot reading using the Major Arcana—the most powerful cards in my deck. These ancient symbols will reveal what has been, what is, and what may yet come to pass. Draw your first card to reveal your past."
    } else if (currentStep === 1) {
      return "The past reveals itself. Now, let us see what forces shape your present. Draw the next card."
    } else if (currentStep === 2) {
      return "Your present stands exposed. Now we must peer into the mists of what is yet to come. Draw the card of your future."
    } else if (currentStep === 3) {
      return "The future casts its shadow. Now we must understand what obstacles stand in your path. Draw the card that reveals your challenge."
    } else if (currentStep === 4) {
      return "Your challenge is clear. Finally, we seek wisdom on how to move forward. Draw the card that will provide guidance."
    } else if (currentStep === 5) {
      return "The reading is complete, but the spirits have one final message. This last card holds the key to continuing your journey."
    } else {
      return "Study these cards carefully, traveler. The answer lies within them. The spirits have spoken—it is now up to you to understand their message."
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
        <p className="text-purple-200 font-pixel text-sm">{getGypsyDialogue()}</p>
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
              <p className="text-gray-300 text-xs">{getCurrentCard().description}</p>
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
                <p className="text-gray-300 text-xs">{cards[showFullCard].description}</p>
              </div>
            )}

            {showFullCard === 5 && (
              <div className="mt-4 bg-gray-900/90 p-3 rounded-lg border border-gray-800">
                <p className="text-purple-300 font-pixel text-sm mb-1">{decoderCard.name}</p>
                <p className="text-gray-300 text-xs">{decoderCard.description}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
