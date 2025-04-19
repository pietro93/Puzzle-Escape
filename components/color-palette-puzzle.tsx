"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAudio } from "@/hooks/use-audio"
import { useHaptics } from "@/hooks/use-haptics"

interface ColorPalettePuzzleProps {
  onSolve: () => void
}

interface ColorData {
  name: string
  frenchName: string
  value: number | null
  imagePath: string
}

export function ColorPalettePuzzle({ onSolve }: ColorPalettePuzzleProps) {
  const { playCorrect, playWrong } = useAudio()
  const { triggerHapticSuccess, triggerHapticError } = useHaptics()

  const [greenValue, setGreenValue] = useState<string>("")
  const [blueValue, setBlueValue] = useState<string>("")
  const [yellowValue, setYellowValue] = useState<string>("")
  const [pinkValue, setPinkValue] = useState<string>("")
  const [solved, setSolved] = useState<boolean>(false)

  const colors: ColorData[] = [
    { name: "White", frenchName: "Blanc", value: 0.1857, imagePath: "/images/color-palette/paint-white.webp" },
    { name: "Black", frenchName: "Noir", value: -0.1857, imagePath: "/images/color-palette/paint-black.webp" },
    {
      name: "Light Blue",
      frenchName: "Azur",
      value: -19.8143,
      imagePath: "/images/color-palette/paint-light-blue.webp",
    },
    { name: "Orange", frenchName: "Orange", value: 116.3128, imagePath: "/images/color-palette/paint-orange.webp" },
    { name: "Red", frenchName: "Rouge", value: 117.0, imagePath: "/images/color-palette/paint-red.webp" },
    { name: "Grey", frenchName: "Gris", value: 0, imagePath: "/images/color-palette/paint-grey.webp" },
    { name: "Green", frenchName: "Vert", value: null, imagePath: "/images/color-palette/paint-green.webp" },
    { name: "Blue", frenchName: "Bleu", value: null, imagePath: "/images/color-palette/paint-blue.webp" },
    { name: "Yellow", frenchName: "Jaune", value: null, imagePath: "/images/color-palette/paint-yellow.webp" },
    { name: "Pink", frenchName: "Rose", value: null, imagePath: "/images/color-palette/paint-pink.webp" },
  ]

  const checkAnswers = () => {
    const correctGreen = Math.abs(Number.parseFloat(greenValue) - -20.6872) < 0.001
    const correctBlue = Math.abs(Number.parseFloat(blueValue) - -20) < 0.001
    const correctYellow = Math.abs(Number.parseFloat(yellowValue) - -0.6872) < 0.001
    const correctPink = Math.abs(Number.parseFloat(pinkValue) - 117.1857) < 0.001

    if (correctGreen && correctBlue && correctYellow && correctPink) {
      playCorrect()
      triggerHapticSuccess()
      setSolved(true)
      onSolve()
    } else {
      playWrong()
      triggerHapticError()
    }
  }

  const handleInputChange = (value: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
    // Allow empty string, minus sign, decimal point, and numbers
    if (value === "" || value === "-" || /^-?\d*\.?\d*$/.test(value)) {
      setter(value)
    }
  }

  useEffect(() => {
    if (greenValue && blueValue && yellowValue && pinkValue) {
      checkAnswers()
    }
  }, [greenValue, blueValue, yellowValue, pinkValue])

  // Group colors in pairs for display
  const colorPairs = []
  for (let i = 0; i < colors.length; i += 2) {
    if (i + 1 < colors.length) {
      colorPairs.push([colors[i], colors[i + 1]])
    } else {
      colorPairs.push([colors[i]])
    }
  }

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto p-4 bg-black/80 rounded-lg">
      <div className="grid grid-cols-1 gap-4 w-full">
        {colorPairs.map((pair, index) => (
          <div key={index} className="flex justify-between gap-4">
            {pair.map((color) => (
              <div key={color.name} className="flex items-center gap-2 w-full">
                <img
                  src={color.imagePath || "/placeholder.svg"}
                  alt={color.name}
                  className="w-12 h-12 object-contain"
                />
                <div className="flex flex-col flex-1">
                  <span className="text-white text-sm">{color.frenchName}</span>
                  {color.value !== null ? (
                    <span className="text-white font-mono">{color.value}</span>
                  ) : (
                    <input
                      type="text"
                      className="w-full bg-gray-800 text-white px-2 py-1 rounded font-mono"
                      value={
                        color.name === "Green"
                          ? greenValue
                          : color.name === "Blue"
                            ? blueValue
                            : color.name === "Yellow"
                              ? yellowValue
                              : color.name === "Pink"
                                ? pinkValue
                                : ""
                      }
                      onChange={(e) => {
                        if (color.name === "Green") handleInputChange(e.target.value, setGreenValue)
                        if (color.name === "Blue") handleInputChange(e.target.value, setBlueValue)
                        if (color.name === "Yellow") handleInputChange(e.target.value, setYellowValue)
                        if (color.name === "Pink") handleInputChange(e.target.value, setPinkValue)
                      }}
                      disabled={solved}
                      placeholder="?"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
