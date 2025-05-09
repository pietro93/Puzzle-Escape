"use client"

import type React from "react"
import { useState, useEffect } from "react"

type City = {
  name: string
  acceptableAnswers: string[]
}

type CityPair = {
  color: string
  pinImage: string
  cities: City[]
  inputs: {
    value: string
    isCorrect: boolean
    cityIndex: number | null
  }[]
  connectionImage?: string
}

export default function FireMapPuzzle({ onSolve }: { onSolve?: () => void }) {
  const [cityPairs, setCityPairs] = useState<CityPair[]>([
    {
      color: "black",
      pinImage: "/images/hellmap/hellmap_pin_black.webp",
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
      connectionImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hellmap_zhanaozen-mary-veJaDHrUxQAEsQIvPQMkvesf7QDApG.webp", // hellmap_zhanaozen-mary
    },
    {
      color: "blue",
      pinImage: "/images/hellmap/hellmap_pin_blue.webp",
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
      connectionImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hellmap_kungrad-ashgabat-fz1LayFBjPHIaKwt24eBWnfvFjt5e2.webp", // New kungrad-ashgabat connection
    },
    {
      color: "green",
      pinImage: "/images/hellmap/hellmap_pin_green.webp",
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
      connectionImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hellmap_sari-urgench-0iEmAQWEwxGXmdrtNBrHVtuWSPpZnM.webp", // hellmap_sari-urgench
    },
    {
      color: "purple",
      pinImage: "/images/hellmap/hellmap_pin_purple.webp",
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
      connectionImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hellmap_turkmenbasy-navoi-5jq3S8SucwT5wGH63XiBPn1ZZIq4Xk.webp", // Updated turkmenbasy-navoi connection
    },
  ])

  const [activeConnections, setActiveConnections] = useState<string[]>([])
  const [allCitiesGuessed, setAllCitiesGuessed] = useState(false)

  useEffect(() => {
    const allCorrect = cityPairs.every((pair) => pair.inputs.every((input) => input.isCorrect))
    setAllCitiesGuessed(allCorrect)
  }, [cityPairs])

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
      if (updatedPair.inputs.every((input) => input.isCorrect) && updatedPair.connectionImage) {
        // Add connection if it's not already active
        if (!activeConnections.includes(updatedPair.connectionImage)) {
          setActiveConnections([...activeConnections, updatedPair.connectionImage])
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
          style={{ aspectRatio: "1.5/1", maxHeight: "50vh" }}
        >
          {/* Base layer - City names map */}
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hellmap_cities-emL12jHZ4AuxFCMkhGkM3uPbg22iX3.webp" // hellmap_cities
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
            src="/images/hellmap/hellmap_pins.webp"
            alt="Location pins"
            className={`absolute inset-0 w-full h-full object-contain transition-all duration-500 ${
              allCitiesGuessed ? "opacity-50 grayscale" : ""
            }`}
            style={{ zIndex: 3 }}
          />

          {/* Central pin - only appears when all cities are guessed */}
          {allCitiesGuessed && (
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hellmap_central-pin-oDy8nOxCTK6nQzT1bVEAOQfwcy2Huj.webp" // hellmap_central-pin
              alt="Central location pin"
              className="absolute inset-0 w-full h-full object-contain"
              style={{ zIndex: 4 }}
            />
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {cityPairs.map((pair, pairIndex) => (
            <div key={pairIndex} className={`p-3 rounded-lg border border-${pair.color}-600`}>
              <div className="flex items-center gap-2 mb-2">
                <img
                  src={pair.pinImage || "/placeholder.svg"}
                  alt={`${pair.color} pin`}
                  className="w-6 h-6 object-contain"
                />
                <img
                  src={pair.pinImage || "/placeholder.svg"}
                  alt={`${pair.color} pin`}
                  className="w-6 h-6 object-contain"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {pair.inputs.map((input, inputIndex) => (
                  <div key={inputIndex} className="flex items-center gap-2">
                    <img
                      src={pair.pinImage || "/placeholder.svg"}
                      alt={`${pair.color} pin`}
                      className="w-6 h-6 object-contain"
                    />
                    <input
                      type="text"
                      value={input.value}
                      onChange={(e) => handleInputChange(pairIndex, inputIndex, e.target.value)}
                      onBlur={() => checkAnswer(pairIndex, inputIndex)}
                      onKeyDown={(e) => handleKeyPress(e, pairIndex, inputIndex)}
                      disabled={input.isCorrect}
                      className={`px-2 py-1 text-sm rounded border w-full ${
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
