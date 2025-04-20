"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface ColorPalettePuzzleProps {
  onSolve?: () => void
}

interface ColorEntry {
  name: string
  frenchName: string
  value: number | null
  imagePath: string
  isInput: boolean
}

export default function ColorPalettePuzzle({ onSolve }: ColorPalettePuzzleProps) {
  // Define the color entries with their values
  const colorEntries: ColorEntry[] = [
    {
      name: "White",
      frenchName: "Blanc",
      value: 0.1857,
      imagePath: "/images/color-palette/paint-white.webp",
      isInput: false,
    },
    {
      name: "Black",
      frenchName: "Noir",
      value: -0.1857,
      imagePath: "/images/color-palette/paint-black.webp",
      isInput: false,
    },
    {
      name: "Light Blue",
      frenchName: "Azur",
      value: -19.8143,
      imagePath: "/images/color-palette/paint-light-blue.webp",
      isInput: false,
    },
    {
      name: "Orange",
      frenchName: "Orange",
      value: 116.3128,
      imagePath: "/images/color-palette/paint-orange.webp",
      isInput: false,
    },
    {
      name: "Red",
      frenchName: "Rouge",
      value: 117.0,
      imagePath: "/images/color-palette/paint-red.webp",
      isInput: false,
    },
    { name: "Grey", frenchName: "Gris", value: 0, imagePath: "/images/color-palette/paint-grey.webp", isInput: false },
    {
      name: "Green",
      frenchName: "Vert",
      value: null,
      imagePath: "/images/color-palette/paint-green.webp",
      isInput: true,
    },
    {
      name: "Blue",
      frenchName: "Bleu",
      value: null,
      imagePath: "/images/color-palette/paint-blue.webp",
      isInput: true,
    },
    {
      name: "Yellow",
      frenchName: "Jaune",
      value: null,
      imagePath: "/images/color-palette/paint-yellow.webp",
      isInput: true,
    },
    {
      name: "Pink",
      frenchName: "Rose",
      value: null,
      imagePath: "/images/color-palette/paint-pink.webp",
      isInput: true,
    },
  ]

  // Correct answers with 4 decimal places
  const correctAnswers = {
    Green: -20.6872,
    Blue: -20.0,
    Yellow: -0.6872,
    Pink: 117.1857,
  }

  // State for user inputs
  const [userInputs, setUserInputs] = useState<{ [key: string]: string }>({
    Green: "",
    Blue: "",
    Yellow: "",
    Pink: "",
  })

  // State for tracking which inputs are correct and locked
  const [correctInputs, setCorrectInputs] = useState<{ [key: string]: boolean }>({
    Green: false,
    Blue: false,
    Yellow: false,
    Pink: false,
  })

  // State for checking if all answers are correct
  const [allCorrect, setAllCorrect] = useState(false)

  // Check if all answers are correct
  useEffect(() => {
    const isAllCorrect = Object.values(correctInputs).every((value) => value === true)
    setAllCorrect(isAllCorrect)

    if (isAllCorrect && onSolve) {
      onSolve()
    }
  }, [correctInputs, onSolve])

  // Handle input change
  const handleInputChange = (color: string, value: string) => {
    // If the input is already correct and locked, don't allow changes
    if (correctInputs[color]) return

    setUserInputs((prev) => ({
      ...prev,
      [color]: value,
    }))

    // Check if the input is correct
    if (value) {
      const numValue = Number.parseFloat(value)
      const isCorrect = Math.abs(numValue - correctAnswers[color as keyof typeof correctAnswers]) < 0.001

      if (isCorrect) {
        // Format to 4 decimal places
        const formattedValue = correctAnswers[color as keyof typeof correctAnswers].toFixed(4)

        // Update the input with the formatted value
        setUserInputs((prev) => ({
          ...prev,
          [color]: formattedValue,
        }))

        // Mark this input as correct and locked
        setCorrectInputs((prev) => ({
          ...prev,
          [color]: true,
        }))
      }
    }
  }

  return (
    <div className="p-4 bg-gray-900/80 rounded-lg border border-gray-700 shadow-lg max-w-md mx-auto">
      <div className="mb-4 text-center">
        <h3 className="text-lg font-pixel text-purple-300 mb-2">La Palette du Maître</h3>
        <p className="text-sm text-gray-300 font-pixel">
          Les roses verte et rose cachent un secret. Entre les nombres, une île attend d'être découverte.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {colorEntries.map((entry, index) => (
          <div key={index} className="flex items-center space-x-3 bg-gray-800/60 p-2 rounded-lg border border-gray-700">
            <div className="w-12 h-12 relative">
              <Image
                src={entry.imagePath || "/placeholder.svg"}
                alt={entry.name}
                width={48}
                height={48}
                className="object-contain pixelated"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-pixel text-purple-200">{entry.frenchName}</p>
              {entry.isInput ? (
                <div className="mt-1">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={userInputs[entry.name]}
                    onChange={(e) => handleInputChange(entry.name, e.target.value)}
                    className={`w-full px-2 py-1 border rounded text-sm font-pixel appearance-none ${
                      correctInputs[entry.name]
                        ? "bg-green-700/50 border-green-500 text-white"
                        : "bg-gray-700 border-gray-600 text-white"
                    }`}
                    placeholder="?"
                    disabled={correctInputs[entry.name]}
                  />
                </div>
              ) : (
                <p className="text-sm font-mono text-yellow-300">{entry.value}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {allCorrect && (
        <div className="mt-4 p-2 bg-green-900/50 border border-green-700 rounded-lg text-center">
          <p className="text-green-300 font-pixel">Correct! You've solved the pattern.</p>
        </div>
      )}
    </div>
  )
}
