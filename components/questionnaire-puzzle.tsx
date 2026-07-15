"use client"

import { useState, useEffect, forwardRef, useImperativeHandle } from "react"

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
        question: "Before I begin your reading, I must know... What celestial sign guides your path?",
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
            "Ah, a child of fire! Bold and impetuous. Your spirit burns bright, but beware the flames of your own making.",
          TAURUS:
            "The bull... stubborn yet reliable. You plant your feet firmly in the earth, but sometimes roots can become chains.",
          GEMINI:
            "Two faces, two souls... The twins dance within you. Your mind is quick, but does your heart keep pace?",
          CANCER:
            "The crab carries its home upon its back. You protect what you love fiercely, sometimes too fiercely, no?",
          LEO: "The proud lion! Your presence commands attention, but remember even kings must sometimes kneel.",
          VIRGO:
            "Precise, methodical Virgo. You see the flaws in everything... including yourself. Too harshly, perhaps?",
          LIBRA: "Balance in all things... yet I sense your scales tip and sway more than you admit.",
          SCORPIO: "The scorpion hides its sting until the moment is right. Your passions run deep and dangerous.",
          SAGITTARIUS: "The wandering archer! Always seeking new horizons. But what are you running from, I wonder?",
          CAPRICORN:
            "The mountain goat climbs ever upward. Your ambition is admirable, but the summit can be a lonely place.",
          AQUARIUS:
            "A water-bearer who walks apart from the crowd. Your vision of the future is clear, but the present often puzzles you.",
          PISCES:
            "Swimming between worlds, between dreams and reality. Your intuition serves you well, but can lead you astray.",
        },
      },
      {
        question: "Interesting... Now tell me, what do you seek most in this life?",
        options: ["LOVE", "FORTUNE", "SUCCESS", "PEACE", "HAPPINESS", "FREEDOM"],
        comments: {
          LOVE: "Love... the eternal quest. Yet sometimes what we seek has been beside us all along, unnoticed.",
          FORTUNE: "Wealth glitters in your eyes. But remember, gold cannot warm a cold heart or mend a broken spirit.",
          SUCCESS: "Ambition drives you forward! But success is a horizon—always visible, never reached. What then?",
          PEACE:
            "Peace is rare in these troubled times. You seek stillness in a storm... admirable, if perhaps unattainable.",
          HAPPINESS:
            "Happiness... elusive as morning mist. We chase it our whole lives, only to find it was within us all along.",
          FREEDOM: "Freedom calls to your spirit! But remember, even birds return to their nests when night falls.",
        },
      },
      {
        question: "The cards reveal much about you... Which sin, I wonder, has the strongest hold on your soul?",
        options: ["LUST", "GLUTTONY", "PRIDE", "WRATH", "SLOTH", "GREED"],
        comments: {
          LUST: "Desire burns in you like a fever. It can warm the soul or consume it entirely.",
          GLUTTONY: "You indulge your appetites freely. There is joy in pleasure, yes, but wisdom in restraint.",
          PRIDE: "Pride stands tall in your heart. It gives strength, but blinds you to your own failings.",
          WRATH: "Anger simmers beneath your calm surface. A powerful force, but one that burns its wielder first.",
          SLOTH: "You resist the rushing current of life. There is wisdom in stillness, but danger in stagnation.",
          GREED:
            "You clutch tightly what you believe is yours. But possessions are like water—hold too tight, and they slip through your fingers.",
        },
      },
      {
        question: "Ah, I see shadows in your eyes... Tell me, what specter haunts your darkest dreams?",
        options: ["DEATH", "AGING", "BEING ALONE", "CAPITALISM"],
        comments: {
          DEATH:
            "Death... the universal fear. Yet it is merely a doorway, not an end. Perhaps what truly frightens you is what lies beyond.",
          AGING:
            "Time's march troubles you. The mirror becomes an enemy, but wisdom is the gift that youth cannot possess.",
          "BEING ALONE":
            "Solitude terrifies you more than any monster. Yet sometimes it is in silence that we truly find ourselves.",
          CAPITALISM:
            "Ha! You fear the systems that bind us all. A philosophical soul, questioning the chains most never see.",
        },
      },
      {
        question: "One final question... After your spirit leaves this form, what new shape would please you most?",
        options: ["ANIMAL", "OBJECT", "HUMAN", "PLANT"],
        comments: {
          ANIMAL: "To run wild and free, guided by instinct rather than thought. There is honesty in such existence.",
          OBJECT:
            "Curious! To be still, unchanging, serving a single purpose. Perhaps you tire of life's constant demands.",
          HUMAN:
            "To walk this path again? Either you have found great joy in this life, or you seek to correct great regrets.",
          PLANT:
            "To grow slowly, rooted in earth yet reaching for sky. There is profound peace in such a simple existence.",
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
          <p className="text-purple-200 font-pixel text-sm">{gypsyComment}</p>
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
