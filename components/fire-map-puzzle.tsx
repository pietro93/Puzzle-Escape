"use client"

import type React from "react"
import { useState, useEffect } from "react"

type City = {
  name: string
  acceptableAnswers: string[]
}

type CityPair = {
  color: string
  colorName: string
  cities: City[]
  inputs: {
    value: string
    isCorrect: boolean
    cityIndex: number | null
  }[]
  connectionImage: string
}

export default function FireMapPuzzle({ onSolve }: { onSolve?: () => void }) {
  const [cityPairs, setCityPairs] = useState<CityPair[]>([
    {
      color: "gray-600",
      colorName: "Gray",
      cities: [
        {
          name: "Zhanaozen",
          acceptableAnswers: ["zhanaozen", "жаңаөзен"],
        },
        {
          name: "Mary",
          acceptableAnswers: ["mary"],
        },
      ],
      inputs: [
        { value: "", isCorrect: false, cityIndex: null },
        { value: "", isCorrect: false, cityIndex: null },
      ],
      connectionImage: "/images/hellmap_zhanaozen-mary.webp",
    },
    {
      color: "blue-600",
      colorName: "Blue",
      cities: [
        {
          name: "Kungrad",
          acceptableAnswers: ["qonirat", "qońirat", "kungrad", "кунград"],
        },
        {
          name: "Ashgabat",
          acceptableAnswers: ["ashgabat"],
        },
      ],
      inputs: [
        { value: "", isCorrect: false, cityIndex: null },
        { value: "", isCorrect: false, cityIndex: null },
      ],
      connectionImage: "/images/hellmap_kungrad-ashgabat.webp",
    },
    {
      color: "green-600",
      colorName: "Green",
      cities: [
        {
          name: "Urgench",
          acceptableAnswers: ["urgench", "урганч"],
        },
        {
          name: "Sari",
          acceptableAnswers: ["siri", "sari", "سارى"],
        },
      ],
      inputs: [
        { value: "", isCorrect: false, cityIndex: null },
        { value: "", isCorrect: false, cityIndex: null },
      ],
      connectionImage: "/images/hellmap_sari-urgench.webp",
    },
    {
      color: "purple-600",
      colorName: "Purple",
      cities: [
        {
          name: "Navoi",
          acceptableAnswers: ["navoi", "navoiy", "навоий"],
        },
        {
          name: "Turkmenbashi",
          acceptableAnswers: ["turkmenbasy", "turkmenbashy", "turkmenbasi", "turkmenbashi"],
        },
      ],
      inputs: [
        { value: "", isCorrect: false, cityIndex: null },
        { value: "", isCorrect: false, cityIndex: null },
      ],
      connectionImage: "/images/hellmap_turkmenbay-navoi.webp",
    },
  ])

  const [activeConnections, setActiveConnections] = useState<string[]>([])
  const [allPairsCorrect, setAllPairsCorrect] = useState(false)

  useEffect(() => {
    const allCorrect = cityPairs.every((pair) => pair.inputs.every((input) => input.isCorrect))

    setAllPairsCorrect(allCorrect)

    if (allCorrect && onSolve) {
      onSolve()
    }
  }, [cityPairs, onSolve])

  const handleInputChange = (pairIndex: number, inputIndex: number, value: string) => {
    const updatedCityPairs = [...cityPairs]
    updatedCityPairs[pairIndex].inputs[inputIndex].value = value
    setCityPairs(updatedCityPairs)
  }

  const checkAnswer = (pairIndex: number, inputIndex: number) => {
    const pair = cityPairs[pairIndex]
    const inputValue = pair.inputs[inputIndex].value.trim().toLowerCase()

    if (!inputValue) return

    // Check which city this input matches
    let matchedCityIndex: number | null = null

    // First check if the other input already has a correct city assigned
    const otherInputIndex = inputIndex === 0 ? 1 : 0
    const otherInput = pair.inputs[otherInputIndex]

    if (otherInput.isCorrect && otherInput.cityIndex !== null) {
      // The other input is already correct, so this must be the remaining city
      const remainingCityIndex = otherInput.cityIndex === 0 ? 1 : 0
      const remainingCity = pair.cities[remainingCityIndex]

      if (remainingCity.acceptableAnswers.some((answer) => answer.toLowerCase() === inputValue)) {
        matchedCityIndex = remainingCityIndex
      }
    } else {
      // Check against both cities
      for (let i = 0; i < pair.cities.length; i++) {
        if (pair.cities[i].acceptableAnswers.some((answer) => answer.toLowerCase() === inputValue)) {
          matchedCityIndex = i
          break
        }
      }
    }

    const updatedCityPairs = [...cityPairs]

    if (matchedCityIndex !== null) {
      // Valid city name found - capitalize the first letter
      const cityName = pair.cities[matchedCityIndex].name

      updatedCityPairs[pairIndex].inputs[inputIndex] = {
        value: cityName,
        isCorrect: true,
        cityIndex: matchedCityIndex,
      }

      // Check if both inputs are now correct
      const updatedPair = updatedCityPairs[pairIndex]
      if (updatedPair.inputs.every((input) => input.isCorrect)) {
        // Add connection
        if (!activeConnections.includes(pair.connectionImage)) {
          setActiveConnections([...activeConnections, pair.connectionImage])
        }
      }
    } else {
      // Invalid city name
      updatedCityPairs[pairIndex].inputs[inputIndex] = {
        value: inputValue,
        isCorrect: false,
        cityIndex: null,
      }
    }

    setCityPairs(updatedCityPairs)
  }

  const handleKeyPress = (e: React.KeyboardEvent, pairIndex: number, inputIndex: number) => {
    if (e.key === "Enter") {
      checkAnswer(pairIndex, inputIndex)
    }
  }

  return (
    <div className="w-full bg-gray-900 rounded-lg overflow-hidden p-4">
      <h3 className="text-lg font-bold mb-4 text-amber-500">Mysterious Map</h3>

      <div className="w-full max-w-4xl mx-auto">
        <div
          className="relative border border-gray-700 rounded-lg overflow-hidden mb-4 bg-amber-50/90"
          style={{ height: "60vh", minHeight: "400px" }}
        >
          {/* Base layer - City names */}
          <img
            src="/images/hellmap_cities.webp"
            alt="Map with city names"
            className="absolute inset-0 w-full h-full object-contain"
            style={{ zIndex: 1 }}
          />

          {/* Middle layer - Connection lines */}
          {activeConnections.map((connection, index) => (
            <img
              key={index}
              src={connection || "/placeholder.svg"}
              alt="Connection line"
              className="absolute inset-0 w-full h-full object-contain"
              style={{ zIndex: 2 }}
            />
          ))}

          {/* Top layer - Pins */}
          <img
            src="/images/hellmap_pins.webp"
            alt="Location pins"
            className={`absolute inset-0 w-full h-full object-contain transition-all duration-500 ${
              allPairsCorrect ? "opacity-30 grayscale" : ""
            }`}
            style={{ zIndex: 3 }}
          />

          {/* Final layer - Central pin (only shown when all pairs are correct) */}
          {allPairsCorrect && (
            <img
              src="/images/hellmap_central-pin.webp"
              alt="Central location pin"
              className="absolute inset-0 w-full h-full object-contain"
              style={{ zIndex: 4 }}
            />
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {cityPairs.map((pair, pairIndex) => (
            <div key={pairIndex} className={`p-3 rounded-lg border border-${pair.color}`}>
              <div className={`text-${pair.color} font-medium mb-2`}>{pair.colorName} Locations</div>
              <div className="grid grid-cols-2 gap-2">
                {pair.inputs.map((input, inputIndex) => (
                  <div key={inputIndex} className="flex flex-col">
                    <input
                      type="text"
                      value={input.value}
                      onChange={(e) => handleInputChange(pairIndex, inputIndex, e.target.value)}
                      onBlur={() => checkAnswer(pairIndex, inputIndex)}
                      onKeyDown={(e) => handleKeyPress(e, pairIndex, inputIndex)}
                      disabled={input.isCorrect}
                      className={`px-2 py-1 text-sm rounded border ${
                        input.value
                          ? input.isCorrect
                            ? "border-green-500 bg-green-900/30"
                            : "border-red-500 bg-red-900/30"
                          : "border-gray-600 bg-gray-800"
                      } text-white ${input.isCorrect ? "opacity-75" : ""}`}
                      placeholder="City name"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
