"use client"

import { useState, useEffect, forwardRef, useImperativeHandle } from "react"
import { DialogueText } from "@/components/dialogue-text"

interface QuestionnaireProps {
  onSolve: () => void
  onRestart: () => void
  onSolutionGenerated?: (solution: string) => void
}

const QuestionnairePuzzle = forwardRef<{ initializePuzzle: () => void }, QuestionnaireProps>(
  ({ onSolve, onRestart, onSolutionGenerated }, ref) => {
    // Possible solutions
    const prefixes = ["UNFATHOMABLE", "ENIGMATIC", "ETHEREAL", "MALEDICTIVE", "EUPHORIC", "OBSCURE", "DELIGHTFUL"]
    const colors = ["AMARANTH", "ARGENTINE", "ALABASTER", "VIRIDIAN", "CERULEAN", "CELADON"]
    const nouns = ["CARIBOU", "CARAVAN", "CATAMARAN", "CHERUB", "CAROB", "CAROUSEL"]

    // State
    const [solution, setSolution] = useState<string>("")
    const [displaySolution, setDisplaySolution] = useState<string>("")
    const [currentQuestion, setCurrentQuestion] = useState<number>(0)
    const [selectedAnswers, setSelectedAnswers] = useState<string[]>([])
    const [gypsyComment, setGypsyComment] = useState<string>("")
    const [readingComplete, setReadingComplete] = useState(false)
    const [isProcessingAnswer, setIsProcessingAnswer] = useState(false)
    const [allSelectedAnswers, setAllSelectedAnswers] = useState<string[]>([])
    const [usedLetters, setUsedLetters] = useState<Record<string, Record<string, boolean>>>({})

    // Questions and options
    const questions = [
      {
        question: "Before reading, I must know. Which star sign is yours?",
        options: [
          "ARIES",
          "TAURUS",
          "GEMINI",
          "CANCER",
          "LEO",
          "VIRGO",
          "LIBRA",
          "SCORPIO",
          "SAGITTARIUS",
          "CAPRICORN",
          "AQUARIUS",
          "PISCES",
        ],
        comments: {
          ARIES:
            "Ram! Fire sign. You run at walls with your head. Sometimes wall moves. Mostly, head hurts.",
          TAURUS:
            "Bull. You plant your feet and nobody moves you. Not even me, and I move many things.",
          GEMINI:
            "Twins! Two faces. I talk to one, the other one doesn't listen. Like my first husband. Now he listens. He has no choice.",
          CANCER:
            "Crab. You carry your house on your back and pinch anybody who comes close. I like you. A little.",
          LEO: "Lion! Big hair, big voice. But even kings must kneel sometimes, ~dragă~. Usually to tax man.",
          VIRGO:
            "Virgo. Already you see three things wrong in my wagon. Say nothing. I know.",
          LIBRA: "Balance, balance. But your scales, they wobble. I see from here.",
          SCORPIO: "Scorpion. You hide your sting until the good moment. I sit a little farther now, is fine?",
          SAGITTARIUS: "Archer! Always looking far away. Tell me, what you are running from?",
          CAPRICORN:
            "Mountain goat, always climbing. At the top is nice view and nobody to show it.",
          AQUARIUS:
            "Water-bearer. You walk apart from the crowd. Crowd doesn't notice. Sorry.",
          PISCES:
            "Fish, swimming between dream and awake. Careful. Fish who dreams too much ends up in soup.",
        },
      },
      {
        question: "Good. Now tell me, what you want most in this life?",
        options: ["LOVE", "FORTUNE", "SUCCESS", "PEACE", "HAPPINESS", "FREEDOM"],
        comments: {
          LOVE: "Love! Everybody wants. Nobody reads the small print. ~Vai de mine~.",
          FORTUNE: "Money. Honest answer! Most people lie and say love. Money keeps you warm at night. Not very warm, but warm.",
          SUCCESS: "Success is a horizon. Always visible, never reached. Keep walking anyway, legs need exercise.",
          PEACE:
            "Peace. You want quiet, but you stand in the storm and complain about rain.",
          HAPPINESS:
            "Happiness is like good cabbage. Everybody talks about it, nobody finds it in market.",
          FREEDOM: "Freedom! Nice. But even birds go home at night. Birds are smarter than people.",
        },
      },
      {
        question: "Now the ugly question. Which sin holds you strongest?",
        options: ["LUST", "GLUTTONY", "PRIDE", "WRATH", "SLOTH", "GREED"],
        comments: {
          LUST: "Lust! Ha! At least you are honest. The spirits, they blush. I don't.",
          GLUTTONY: "Gluttony. Good! Skinny people, I don't trust. They are hiding something. Usually food.",
          PRIDE: "Pride. It makes you stand tall. Also you walk into doors, because you never look down.",
          WRATH: "Anger. It burns the one who holds it first. Put it down, ~dragă~. Is hot.",
          SLOTH: "Sloth. You don't want to move. Is fine. Sometimes the road moves for you. Not always in good direction.",
          GREED:
            "Greed. You hold too tight, like water in fist. Everything drips out, and you have wet hand.",
        },
      },
      {
        question: "I see shadows in your eyes. Tell me, what scares you most in the dark?",
        options: ["DEATH", "AGING", "BEING ALONE", "CAPITALISM"],
        comments: {
          DEATH:
            "Death. Everybody fears it. Is only a door, ~dragă~. What scares you is who waits on other side.",
          AGING:
            "Old age. Look at me. Is not so bad. Only knees and memory and teeth. Otherwise perfect.",
          "BEING ALONE":
            "Alone. Yes. I understand. Why you think I talk so much?",
          CAPITALISM:
            "Ha! Smart one. Capitalism takes your money, then sells you candle to feel better. I sell candles too. You want one?",
        },
      },
      {
        question: "Last question. When your soul leaves this body, what shape you want next?",
        options: ["ANIMAL", "OBJECT", "HUMAN", "PLANT"],
        comments: {
          ANIMAL: "Animal. Good. No thinking, no taxes. Only running and eating. Like most men I know.",
          OBJECT:
            "Object? Strange choice. You are tired, I think. Very tired. Rest, then.",
          HUMAN:
            "Human again? Brave. Or you have something to fix. Cards will tell which.",
          PLANT:
            "Plant. Slow life. Sun, water, nobody asks questions. Only dogs visit. You know why.",
        },
      },
    ]

    // Expose the initializePuzzle method to the parent component
    useImperativeHandle(ref, () => ({
      initializePuzzle,
    }))

    // Initialize the puzzle
    useEffect(() => {
      initializePuzzle()
    }, [])

    const initializePuzzle = () => {
      // Randomly select a prefix, color and noun
      const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)]
      const randomColor = colors[Math.floor(Math.random() * colors.length)]
      const randomNoun = nouns[Math.floor(Math.random() * nouns.length)]
      const newSolution = `${randomPrefix} ${randomColor} ${randomNoun}`

      // Create the display with underscores
      const newDisplay = newSolution
        .split("")
        .map((char) => (char === " " ? " " : "_"))
        .join("")

      setSolution(newSolution)
      setDisplaySolution(newDisplay)
      setCurrentQuestion(0)
      setSelectedAnswers([])
      setAllSelectedAnswers([])
      setUsedLetters({})
      setReadingComplete(false)
      setIsProcessingAnswer(false)
      setGypsyComment(
        "Welcome, seeker. The cards have been whispering your name. Before I read your fortune, I must understand your essence. Answer truthfully, for the cards see through all deception.",
      )

      // Send the solution back to the parent component
      if (onSolutionGenerated) {
        onSolutionGenerated(newSolution.toLowerCase())
      }
    }

    const handleOptionSelect = (option: string) => {
      // Prevent multiple selections for the same question
      if (isProcessingAnswer) return

      // Set processing flag to prevent multiple selections
      setIsProcessingAnswer(true)

      // Add to selected answers
      const newSelectedAnswers = [...selectedAnswers, option]
      setSelectedAnswers(newSelectedAnswers)

      // Add to all selected answers history
      setAllSelectedAnswers([...allSelectedAnswers, option])

      // Update the display solution by revealing matching letters
      const newDisplay = displaySolution.split("")
      const solutionChars = solution.split("")

      // Count occurrences of each letter in the selected option
      const optionLetterCounts: Record<string, number> = {}
      option.split("").forEach((letter) => {
        optionLetterCounts[letter] = (optionLetterCounts[letter] || 0) + 1
      })

      // Track which letters are used from this answer
      const usedLettersForOption: Record<string, boolean> = {}

      // For each unique letter in the option, reveal up to that many occurrences in the solution
      Object.entries(optionLetterCounts).forEach(([letter, count]) => {
        let revealedCount = 0

        for (let i = 0; i < solutionChars.length; i++) {
          if (solutionChars[i] === letter && newDisplay[i] === "_" && revealedCount < count) {
            newDisplay[i] = letter
            revealedCount++

            // Track that this letter was used
            usedLettersForOption[letter] = true
          }
        }
      })

      // Update used letters tracking
      setUsedLetters({
        ...usedLetters,
        [option]: usedLettersForOption,
      })

      setDisplaySolution(newDisplay.join(""))

      // Set the gypsy's comment
      setGypsyComment(questions[currentQuestion].comments[option])

      // Move to next question or finish
      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1)
          setIsProcessingAnswer(false) // Reset processing flag
        } else {
          // Final state - player needs to guess
          setReadingComplete(true)
          onSolve()
          setGypsyComment(
            "I have seen enough. The spirits have revealed much about you. Now, what vision comes to your mind? What do you see in the mists between us?",
          )
          setIsProcessingAnswer(false) // Reset processing flag
        }
      }, 2000)
    }

    return (
      <div className="w-full max-w-md mx-auto">
        {/* Gypsy's dialogue */}
        <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-800 mb-4">
          <p className="text-purple-200 font-pixel text-sm"><DialogueText text={gypsyComment} /></p>
        </div>

        {/* Display the current solution with underscores and revealed letters */}
        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800 mb-4 text-center">
          <p className="font-mono text-xl tracking-widest text-purple-300">{displaySolution}</p>
        </div>

        {allSelectedAnswers.length > 0 && (
          <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800 mb-4">
            <h4 className="text-purple-300 font-pixel mb-2">Your Answers:</h4>
            <div className="grid grid-cols-1 gap-2">
              {allSelectedAnswers.map((answer, index) => (
                <div key={index} className="text-sm">
                  {answer.split("").map((letter, letterIndex) => {
                    // Check if this letter was used from this answer
                    const letterWasUsed = usedLetters[answer] && usedLetters[answer][letter]

                    return (
                      <span key={letterIndex} className={letterWasUsed ? "text-purple-400 font-bold" : "text-gray-400"}>
                        {letter}
                      </span>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Current question and options */}
        {currentQuestion < questions.length && !readingComplete && (
          <div className="animate-fadeIn">
            <h3 className="text-purple-300 font-pixel mb-3">{questions[currentQuestion].question}</h3>

            <div className="grid grid-cols-2 gap-2">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(option)}
                  disabled={isProcessingAnswer}
                  className={`px-3 py-2 bg-purple-900/40 hover:bg-purple-800/60 border border-purple-700 rounded-md text-purple-200 font-pixel text-sm transition-colors ${
                    isProcessingAnswer ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  },
)

QuestionnairePuzzle.displayName = "QuestionnairePuzzle"

export default QuestionnairePuzzle
