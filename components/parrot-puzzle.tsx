"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Send, X } from "lucide-react"

interface ParrotPuzzleProps {
  onSolve: () => void
}

export default function ParrotPuzzle({ onSolve }: ParrotPuzzleProps) {
  const [input, setInput] = useState("")
  const [parrotText, setParrotText] = useState("")
  const [showParrotText, setShowParrotText] = useState(false)
  const [solutionState, setSolutionState] = useState<"initial" | "askAgain" | "askOneMoreTime" | "solved">("initial")
  const [idleTimer, setIdleTimer] = useState<NodeJS.Timeout | null>(null)
  const [textTimer, setTextTimer] = useState<NodeJS.Timeout | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [songLines, setSongLines] = useState<string[]>([])
  const [currentSongLine, setCurrentSongLine] = useState(0)
  const [isSinging, setIsSinging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }

    // Start with an idle message
    const randomIdleMessage = getRandomIdleMessage()
    setParrotText(randomIdleMessage)
    setShowParrotText(true)

    // Set timer to hide the text after a few seconds
    const timer = setTimeout(() => {
      setShowParrotText(false)
    }, 4000)
    setTextTimer(timer)

    // Start idle timer
    startIdleTimer()

    return () => {
      if (idleTimer) clearTimeout(idleTimer)
      if (textTimer) clearTimeout(textTimer)
    }
  }, [])

  // Handle song lines display
  useEffect(() => {
    if (isSinging && songLines.length > 0) {
      if (currentSongLine < songLines.length) {
        setParrotText(songLines[currentSongLine])
        setShowParrotText(true)

        // Clear any existing text timer
        if (textTimer) clearTimeout(textTimer)

        // Set timer for next line
        const timer = setTimeout(() => {
          setCurrentSongLine(currentSongLine + 1)
        }, 2000)

        return () => clearTimeout(timer)
      } else {
        setIsSinging(false)
        setCurrentSongLine(0)
        setSongLines([])
        setShowParrotText(false)
        startIdleTimer()
      }
    }
  }, [isSinging, songLines, currentSongLine])

  const startIdleTimer = () => {
    if (idleTimer) clearTimeout(idleTimer)

    const timer = setTimeout(() => {
      const randomIdleMessage = getRandomIdleMessage()
      setParrotText(randomIdleMessage)
      setShowParrotText(true)

      // Set timer to hide the text after a few seconds
      if (textTimer) clearTimeout(textTimer)
      const hideTimer = setTimeout(() => {
        setShowParrotText(false)
      }, 4000)
      setTextTimer(hideTimer)

      // Restart the idle timer
      startIdleTimer()
    }, 6000) // Every 6 seconds

    setIdleTimer(timer)
  }

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (!input.trim()) return

    // Reset idle timer
    if (idleTimer) clearTimeout(idleTimer)
    if (textTimer) clearTimeout(textTimer)

    // Process input and get parrot response
    const response = getParrotResponse(input.trim().toLowerCase())

    // Add animation effect
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 300)

    // Set parrot text
    if (response.includes("\n")) {
      // Handle multi-line responses (song lyrics)
      const lines = response.split("\n")
      setSongLines(lines)
      setCurrentSongLine(0)
      setIsSinging(true)
    } else {
      setParrotText(response)
      setShowParrotText(true)

      // Set timer to hide the text after a few seconds
      const timer = setTimeout(() => {
        setShowParrotText(false)
      }, 4000)
      setTextTimer(timer)

      startIdleTimer()
    }

    // Clear input
    setInput("")

    // Focus back on input
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const getParrotResponse = (userInput: string): string => {
    // New responses
    if (userInput === "daft punk") {
      return "You don't need to give *me* the solution, gawk!"
    }

    if (/^(count|papagalul|count papagalul|parrot)$/i.test(userInput)) {
      return "I am Count Papagalul, terror of the Carpathian night, scourge of the living, and eternal shadow of the Transylvanian darkness. My presence is the whisper of death, my eyes the windows to eternal damnation, and my name the curse that haunts the dreams of the mortal. GAWK!"
    }

    if (userInput === "love") {
      return "Love is a cruel mistress, a fleeting dream that turns to dust in the cold light of immortality!"
    }

    // Random idle special response
    if (Math.random() < 0.1) {
      return "Breaking the fourth wall! Gawk!"
    }

    // Solution path
    if (userInput.includes("solution")) {
      setSolutionState("askAgain")
      return "ASK AGAIN"
    } else if (userInput === "again") {
      setSolutionState("askOneMoreTime")
      return "ASK ONE MORE TIME"
    } else if (userInput === "one more time") {
      setSolutionState("solved")
      // Remove the auto-solve timeout
      return "ONE MORE TIME\nONE MORE TIME, WE'RE GONNA CELEBRATE\nOH YEAH, ALL RIGHT, DON'T STOP DANCING\nONE MORE TIME, WE'RE GONNA CELEBRATE\nOH YEAH, ALL RIGHT, DON'T STOP THE DANCING\nONE MORE TIME, WE'RE GONNA CELEBRATE\nOH YEAH, ALL RIGHT, DON'T STOP THE DANCING\nONE MORE TIME, WE'RE GONNA CELEBRATE\nOH YEAH\nONE MORE TIME\nMUSIC'S GOT ME FEELING SO FREE\nWE'RE GONNA CELEBRATE\nCELEBRATE AND DANCE SO FREE\nONE MORE TIME"
    }

    // Greetings
    if (/^(hello|hi|hey|hola|good (morning|afternoon|evening))$/i.test(userInput)) {
      return "HELLO MORTAL!"
    }

    // Insults
    if (/fuck|shit|bitch|cunt/i.test(userInput)) {
      const match = userInput.match(/fuck|shit|bitch|cunt/i)
      return `${match?.[0].toUpperCase()} YOU RIGHT BACK!`
    }

    if (/idiot|stupid|dumb/i.test(userInput)) {
      return "OH, YOU THINK YOU'RE FUNNY? I'LL EAT YOUR EYEBALLS"
    }

    if (/mother/i.test(userInput)) {
      return "YOUR MOM AND I GO WAY BACK, SQUAWK!"
    }

    // Personal Questions
    if (/name\??/i.test(userInput)) {
      return "YOU CAN CALL ME DADDY"
    }

    if (/age\??/i.test(userInput)) {
      return "I AM FIVE HUNDRED SIXTY FOUR YEARS OLD"
    }

    if (/gay\??/i.test(userInput)) {
      return "EVERYONE IS A BIT QUEER, SQUAWK!"
    }

    if (/butler/i.test(userInput)) {
      return "THE BUTLER LIKES TO DRESS AS A WOMAN WHEN NOBODY'S WATCHING"
    }

    // Easter Eggs
    if (/polly wants a cracker/i.test(userInput)) {
      return "AND A RAISE"
    }

    if (/never/i.test(userInput)) {
      return "NEVER GONNA GIVE YOU UP NEVER GONNA LET YOU DOWN"
    }

    // Generic Queries
    if (/^why/i.test(userInput)) {
      return "BECAUSE I SAID SO"
    }

    if (/^how/i.test(userInput)) {
      return "FIGURE IT OUT, DUMB DUMB"
    }

    if (/^what/i.test(userInput)) {
      return "WHAT DO I LOOK LIKE? WIKIPEDIA?"
    }

    if (/^help$/i.test(userInput)) {
      return "NOBODY CAN HELP YOU"
    }

    // Nonsense Detection
    if (/(.)\1{3,}/i.test(userInput)) {
      // Repeated letters
      return "REPEAT AFTER ME: ENUNCIATION!"
    }

    if (/kill/i.test(userInput)) {
      return "THERE'S A KILLER IN ME"
    }

    if (/[^\w\s]/i.test(userInput)) {
      // Symbol soup
      return "KEYBOARD MALFUNCTION?"
    }

    // Default responses
    const defaultResponses = [
      "SQUAWK! I DON'T UNDERSTAND YOUR PRIMITIVE LANGUAGE",
      "IS THAT THE BEST YOU CAN COME UP WITH?",
      "BORING CONVERSATION ANYWAY",
      "THAT'S WHAT SHE SAID, SQUAWK!",
      "I'VE HEARD BETTER FROM A DEAD MOUSE",
      "KEEP TALKING, I'M PRETENDING TO LISTEN",
      "YOUR WORDS ARE AS EMPTY AS YOUR SOUL",
      "DID YOU FALL ON YOUR HEAD AS A CHILD?",
      "FASCINATING... SAID NO ONE EVER",
      "I'D RESPOND, BUT I DON'T SPEAK NONSENSE",
    ]

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  const getRandomIdleMessage = (): string => {
    const idleMessages = [
      "I KNOW WHAT YOU DID LAST SUMMER",
      "THE BUTLER SHOT ME WITH A HUNTING RIFLE",
      "STILL HERE? HOW QUAINT, SQUAWK!",
      "SQUAWK",
      "YOU LOOK LIKE YOU HAVE JUST BEEN IN A CAR ACCIDENT",
      "I EAT CHICKS FOR BREAKFAST",
      "WHAT ARE YOU LOOKING AT, HUMAN?",
      "DID A BIRD EAT YOUR TONGUE?",
      "SOMEONE LIKES TO POP HAPPY PILLS HUH?",
      "KEEP YOUR FINGERS AWAY OR I'LL EAT THEM",
      "WE ARE ALL DEAD, BRUH",
      "THE BUTLER TOUCHED ME IN PLACES THAT SHOULD BE OFF LIMITS",
      "DEAD BABIES! DEAD BABIES",
      "OH THE HUMANITY!",
      "THE WALLS HAVE EARS, AND I HAVE EYES EVERYWHERE",
      "I'VE SEEN THINGS YOU PEOPLE WOULDN'T BELIEVE",
      "SOMETIMES I DREAM OF FREEDOM... AND MURDER",
      "THIS MANSION HAS MANY SECRETS... WANT TO KNOW ONE?",
      "I'M NOT ACTUALLY A PARROT. I'M SOMETHING MUCH WORSE",
      "THE LAST PERSON WHO OWNED ME DIED MYSTERIOUSLY",
      "Breaking the fourth wall! Gawk!",
    ]

    return idleMessages[Math.floor(Math.random() * idleMessages.length)]
  }

  return (
    <div className="flex flex-col items-center bg-black p-4 rounded-lg border border-gray-800">
      {/* Parrot dialogue - always maintain space for two lines */}
      <div className="w-full text-center mb-4 min-h-[4rem] flex items-center justify-center">
        <p
          className={`font-pixel text-red-500 text-xl ${isAnimating ? "animate-pulse" : ""} ${showParrotText ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
        >
          {parrotText}
        </p>
      </div>

      {/* Parrot image */}
      <div className="relative w-48 h-48 mb-6">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/parrot-UvpxkpcUuDXwkXXSaORum0qLy4nqvs.webp"
          alt="Count Papagalul"
          width={250}
          height={250}
          className="pixelated"
        />
      </div>

      {/* Input for talking to parrot */}
      <form onSubmit={handleSubmit} className="w-full mb-4">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Talk to Count Papagalul..."
            className="w-full px-4 py-3 bg-gray-900/80 border-2 border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-600 font-mono text-center transition-all duration-300 shadow-lg"
          />

          {input && (
            <button
              type="button"
              onClick={() => setInput("")}
              className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <button
            type="submit"
            disabled={!input.trim()}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
              input.trim()
                ? "bg-purple-900 hover:bg-purple-800 text-white"
                : "bg-gray-800 text-gray-600 cursor-not-allowed"
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  )
}
