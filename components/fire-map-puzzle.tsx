"use client"

import type React from "react"

import { useState, useEffect } from "react"

type CityPair = {
  color: string
  colorName: string
  cities: {
    name: string
    acceptableAnswers: string[]
    answered: boolean
    userInput: string
  }[]
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
          answered: false,
          userInput: "",
        },
        {
          name: "Mary",
          acceptableAnswers: ["mary"],
          answered: false,
          userInput: "",
        },
      ],
    },
    {
      color: "blue-600",
      colorName: "Blue",
      cities: [
        {
          name: "Kungrad",
          acceptableAnswers: ["qonirat", "qońirat", "kungrad", "кунград"],
          answered: false,
          userInput: "",
        },
        {
          name: "Ashgabat",
          acceptableAnswers: ["ashgabat"],
          answered: false,
          userInput: "",
        },
      ],
    },
    {
      color: "green-600",
      colorName: "Green",
      cities: [
        {
          name: "Urgench",
          acceptableAnswers: ["urgench", "урганч"],
          answered: false,
          userInput: "",
        },
        {
          name: "Sari",
          acceptableAnswers: ["siri", "sari", "سارى"],
          answered: false,
          userInput: "",
        },
      ],
    },
    {
      color: "purple-600",
      colorName: "Purple",
      cities: [
        {
          name: "Navoi",
          acceptableAnswers: ["navoi", "navoiy", "навоий"],
          answered: false,
          userInput: "",
        },
        {
          name: "Turkmenbashi",
          acceptableAnswers: ["turkmenbasy", "turkmenbashy", "turkmenbasi", "turkmenbashi"],
          answered: false,
          userInput: "",
        },
      ],
    },
  ])

  const [activeConnections, setActiveConnections] = useState<string[]>([])
  const [solved, setSolved] = useState(false)

  useEffect(() => {
    const allAnswered = cityPairs.every((pair) => pair.cities.every((city) => city.answered))
    if (allAnswered && !solved) {
      setSolved(true)
      if (onSolve) onSolve()
    }
  }, [cityPairs, solved, onSolve])

  const handleInputChange = (pairIndex: number, cityIndex: number, value: string) => {
    const updatedCityPairs = [...cityPairs]
    updatedCityPairs[pairIndex].cities[cityIndex].userInput = value
    setCityPairs(updatedCityPairs)
  }

  const checkAnswer = (pairIndex: number, cityIndex: number) => {
    const city = cityPairs[pairIndex].cities[cityIndex]
    const isCorrect = city.acceptableAnswers.some(
      (answer) => answer.toLowerCase() === city.userInput.trim().toLowerCase(),
    )

    const updatedCityPairs = [...cityPairs]
    updatedCityPairs[pairIndex].cities[cityIndex] = {
      ...city,
      answered: isCorrect,
    }
    setCityPairs(updatedCityPairs)

    const pair = updatedCityPairs[pairIndex]
    if (pair.cities.every((c) => c.answered)) {
      const connectionName = getConnectionName(pair.cities[0].name, pair.cities[1].name)
      if (connectionName && !activeConnections.includes(connectionName)) {
        setActiveConnections([...activeConnections, connectionName])
      }
    }
  }

  const getConnectionName = (city1: string, city2: string): string | null => {
    const cities = [city1.toLowerCase(), city2.toLowerCase()].sort()

    if ((cities.includes("sari") || cities.includes("siri")) && cities.includes("urgench")) {
      return "/images/hellmap/hellmap_sari-urgench.webp"
    }

    if (
      (cities.includes("turkmenbashi") || cities.includes("turkmenbasy")) &&
      (cities.includes("navoi") || cities.includes("navoiy"))
    ) {
      return "/images/hellmap/hellmap_turkmenbay-navoi.webp"
    }

    return null
  }

  const handleKeyPress = (e: React.KeyboardEvent, pairIndex: number, cityIndex: number) => {
    if (e.key === "Enter") {
      checkAnswer(pairIndex, cityIndex)
    }
  }

  return (
    <div className="w-full bg-gray-900 rounded-lg overflow-hidden p-4">
      <h3 className="text-lg font-bold mb-4 text-amber-500">Mysterious Map</h3>

      <div className="mb-4 text-gray-300 text-sm">
        <p>
          Identify each location on the map by entering the correct city name. When you correctly identify both
          locations of the same color, a hidden connection will be revealed.
        </p>
      </div>

      <div className="w-full max-w-4xl mx-auto">
        <div
          className="relative border border-gray-700 rounded-lg overflow-hidden mb-4"
          style={{ aspectRatio: "16/9" }}
        >
          <img
            src="/images/hellmap/hellmap_full.webp"
            alt="Map with location pins"
            className="w-full h-full object-cover"
          />

          {activeConnections.map((connection, index) => (
            <img
              key={index}
              src={connection || "/placeholder.svg"}
              alt="Connection line"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ zIndex: 10 }}
            />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {cityPairs.map((pair, pairIndex) => (
            <div key={pairIndex} className={`p-3 rounded-lg border border-${pair.color}`}>
              <div className={`text-${pair.color} font-medium mb-2`}>{pair.colorName} Locations</div>
              <div className="grid grid-cols-2 gap-2">
                {pair.cities.map((city, cityIndex) => (
                  <div key={cityIndex} className="flex flex-col">
                    <input
                      type="text"
                      value={city.userInput}
                      onChange={(e) => handleInputChange(pairIndex, cityIndex, e.target.value)}
                      onBlur={() => checkAnswer(pairIndex, cityIndex)}
                      onKeyDown={(e) => handleKeyPress(e, pairIndex, cityIndex)}
                      className={`px-2 py-1 text-sm rounded border ${
                        city.userInput
                          ? city.answered
                            ? "border-green-500 bg-green-900/30"
                            : "border-red-500 bg-red-900/30"
                          : "border-gray-600 bg-gray-800"
                      } text-white`}
                      placeholder="City name"
                    />
                    {city.answered && <span className="text-green-500 text-xs mt-1">Correct!</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {solved && (
        <div className="mt-4 p-2 bg-green-800 text-green-100 rounded-lg text-center">
          All locations correctly identified!
        </div>
      )}
    </div>
  )
}
