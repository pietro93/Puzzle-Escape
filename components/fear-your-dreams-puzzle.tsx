"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface LetterItem {
  letter: string
  mark: string
  isCarousel: boolean
  correct?: string
}

interface WordData {
  word: string
  letters: LetterItem[]
  endMark: string
}

const letterData: WordData[] = [
  {
    word: "FEAR",
    letters: [
      { letter: "F", mark: "*", isCarousel: true, correct: "I" },
      { letter: "E", mark: "II", isCarousel: false },
      { letter: "A", mark: "0", isCarousel: false },
      { letter: "R", mark: "*", isCarousel: true, correct: "I" },
    ],
    endMark: "IV",
  },
  {
    word: "YOUR",
    letters: [
      { letter: "Y", mark: "*", isCarousel: true, correct: "0" },
      { letter: "O", mark: "I", isCarousel: false },
      { letter: "U", mark: "*", isCarousel: true, correct: "0" },
      { letter: "R", mark: "*", isCarousel: true, correct: "I" },
    ],
    endMark: "II",
  },
  {
    word: "DREAMS",
    letters: [
      { letter: "D", mark: "*", isCarousel: true, correct: "I" },
      { letter: "R", mark: "*", isCarousel: true, correct: "I" },
      { letter: "E", mark: "II", isCarousel: false },
      { letter: "A", mark: "*", isCarousel: true, correct: "0" },
      { letter: "M", mark: "*", isCarousel: true, correct: "I" },
      { letter: "S", mark: "0", isCarousel: false },
    ],
    endMark: "V",
  },
]

const carouselOptions = ["0", "I", "II"] // Corresponding to 0mark, Imark, IImark

const getMarkImage = (value: string) => {
  if (value === "I") return "Imark.webp"
  if (value === "II") return "IImark.webp"
  if (value === "IV") return "IVmark.webp"
  if (value === "V") return "Vmark.webp"
  return "0mark.webp"
}

const getLetterOpacity = (mark: string) => {
  if (mark === "0") return 0.45
  if (mark === "I") return 0.75
  return 1.0 // II
}

export default function FearYourDreamsPuzzle({ onSolve }: { onSolve: () => void }) {
  const [carouselValues, setCarouselValues] = useState<Record<string, string>>({})
  const [isLocked, setIsLocked] = useState(false)

  // Initialize carousel values to first option
  useEffect(() => {
    const initialValues: Record<string, string> = {}
    letterData.forEach((wordData, wordIndex) => {
      wordData.letters.forEach((letter, letterIndex) => {
        if (letter.isCarousel) {
          const key = `${wordIndex}-${letterIndex}`
          initialValues[key] = carouselOptions[0]
        }
      })
    })
    setCarouselValues(initialValues)
  }, [])

  // Check if all carousel values match the correct ones
  useEffect(() => {
    const allCorrect = letterData.every((wordData, wordIndex) =>
      wordData.letters.every((letter, letterIndex) => {
        if (!letter.isCarousel) return true
        const key = `${wordIndex}-${letterIndex}`
        return carouselValues[key] === letter.correct
      })
    )
    if (allCorrect && !isLocked) {
      setIsLocked(true)
      // Interaction complete — unlocks the answer input, but the player still
      // has to type the solution themselves.
      onSolve()
    }
  }, [carouselValues, isLocked])

  const handleCarouselClick = (wordIndex: number, letterIndex: number) => {
    if (isLocked) return
    const key = `${wordIndex}-${letterIndex}`
    const currentValue = carouselValues[key]
    const currentIndex = carouselOptions.indexOf(currentValue)
    const nextIndex = (currentIndex + 1) % carouselOptions.length
    const nextValue = carouselOptions[nextIndex]
    setCarouselValues(prev => ({ ...prev, [key]: nextValue }))
  }

  const isSpecialMark = (mark: string) => ["IV", "II", "V"].includes(mark)

  return (
    <div className="flex flex-col items-center space-y-6">
      {letterData.map((wordData, wordIndex) => (
        <div key={wordIndex} className="flex flex-col items-center space-y-2">
          {/* Word letters */}
          <div className="flex space-x-2">
            {wordData.letters.map((letter, letterIndex) => (
              <div key={letterIndex} className="flex flex-col items-center space-y-1">
                {(() => {
                  const effectiveMark = letter.isCarousel
                    ? (carouselValues[`${wordIndex}-${letterIndex}`] || carouselOptions[0])
                    : letter.mark
                  const opacity = isLocked ? getLetterOpacity(effectiveMark) : 0.8
                  return (
                    <Image
                      src={`/images/${letter.letter}.webp`}
                      alt={letter.letter}
                      width={40}
                      height={40}
                      className="pixelated"
                      style={{ opacity }}
                    />
                  )
                })()}
                {letter.isCarousel ? (
                  <button
                    onClick={() => handleCarouselClick(wordIndex, letterIndex)}
                    disabled={isLocked}
                    className={`p-1 rounded transition-all ${isLocked ? 'cursor-not-allowed opacity-90' : 'cursor-pointer hover:border-blue-600 animate-pulse border-2 border-blue-400'}`}
                  >
                    <Image
                      src={`/images/${getMarkImage(carouselValues[`${wordIndex}-${letterIndex}`] || carouselOptions[0])}`}
                      alt={carouselValues[`${wordIndex}-${letterIndex}`] || carouselOptions[0]}
                      width={20}
                      height={20}
                      className="pixelated"
                    />
                  </button>
                ) : (
                  <div className="p-1 rounded opacity-90">
                    <Image
                      src={`/images/${getMarkImage(letter.mark)}`}
                      alt={letter.mark}
                      width={20}
                      height={20}
                      className="pixelated"
                    />
                  </div>
                )}
              </div>
            ))}
            {/* End mark */}
            <div className="flex items-center ml-4">
              <Image
                src={`/images/${getMarkImage(wordData.endMark)}`}
                alt={wordData.endMark}
                width={20}
                height={isSpecialMark(wordData.endMark) ? 30 : 20}
                className={`pixelated ${isSpecialMark(wordData.endMark) ? 'special-mark' : ''}`}
              />
            </div>
          </div>
        </div>
      ))}
      <style jsx>{`
        .special-mark {
          filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.8));
          animation: glow 2s ease-in-out infinite alternate;
        }
        @keyframes glow {
          from {
            filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.8));
          }
          to {
            filter: drop-shadow(0 0 20px rgba(255, 215, 0, 1));
          }
        }
      `}</style>
    </div>
  )
}
