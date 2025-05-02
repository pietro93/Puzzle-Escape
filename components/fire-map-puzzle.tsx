"use client"

import type React from "react"

import { useState, useEffect } from "react"

type CityPair = {
  color: string
  cities: {
    name: string
    acceptableAnswers: string[]
    position: { x: number; y: number }
    answered: boolean
    userInput: string
  }[]
}

export default function FireMapPuzzle({ onSolve }: { onSolve?: () => void }) {
  const [cityPairs, setCityPairs] = useState<CityPair[]>([
    {
      color: "gray",
      cities: [
        {
          name: "Zhanaozen",
          acceptableAnswers: ["zhanaozen", "жаңаөзен"],
          position: { x: 15, y: 15 },
          answered: false,
          userInput: "",
        },
        {
          name: "Mary",
          acceptableAnswers: ["mary"],
          position: { x: 65, y: 65 },
          answered: false,
          userInput: "",
        },
      ],
    },
    {
      color: "blue",
      cities: [
        {
          name: "Kungrad",
          acceptableAnswers: ["qonirat", "qońirat", "kungrad", "кунград"],
          position: { x: 45, y: 20 },
          answered: false,
          userInput: "",
        },
        {
          name: "Ashgabat",
          acceptableAnswers: ["ashgabat"],
          position: { x: 45, y: 65 },
          answered: false,
          userInput: "",
        },
      ],
    },
    {
      color: "green",
      cities: [
        {
          name: "Urgench",
          acceptableAnswers: ["urgench", "урганч"],
          position: { x: 60, y: 30 },
          answered: false,
          userInput: "",
        },
        {
          name: "Sari",
          acceptableAnswers: ["siri", "sari", "سارى"],
          position: { x: 15, y: 80 },
          answered: false,
          userInput: "",
        },
      ],
    },
    {
      color: "purple",
      cities: [
        {
          name: "Navoi",
          acceptableAnswers: ["navoi", "navoiy", "навоий"],
          position: { x: 85, y: 45 },
          answered: false,
          userInput: "",
        },
        {
          name: "Turkmenbashi",
          acceptableAnswers: ["turkmenbasy", "turkmenbashy", "turkmenbasi", "turkmenbashi"],
          position: { x: 15, y: 45 },
          answered: false,
          userInput: "",
        },
      ],
    },
  ])

  const [activeConnections, setActiveConnections] = useState<string[]>([])
  const [selectedCity, setSelectedCity] = useState<{ pairIndex: number; cityIndex: number } | null>(null)
  const [inputValue, setInputValue] = useState("")
  const [solved, setSolved] = useState(false)

  // Check if all cities are answered correctly
  useEffect(() => {
    const allAnswered = cityPairs.every((pair) => pair.cities.every((city) => city.answered))
    if (allAnswered && !solved) {
      setSolved(true)
      if (onSolve) onSolve()
    }
  }, [cityPairs, solved, onSolve])

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  // Handle city selection
  const handleCityClick = (pairIndex: number, cityIndex: number) => {
    setSelectedCity({ pairIndex, cityIndex })
    setInputValue(cityPairs[pairIndex].cities[cityIndex].userInput)
  }

  // Check answer
  const checkAnswer = () => {
    if (!selectedCity) return

    const { pairIndex, cityIndex } = selectedCity
    const city = cityPairs[pairIndex].cities[cityIndex]
    const isCorrect = city.acceptableAnswers.some((answer) => answer.toLowerCase() === inputValue.trim().toLowerCase())

    // Update city state
    const updatedCityPairs = [...cityPairs]
    updatedCityPairs[pairIndex].cities[cityIndex] = {
      ...city,
      answered: isCorrect,
      userInput: inputValue.trim(),
    }
    setCityPairs(updatedCityPairs)

    // Check if both cities in the pair are answered correctly
    const pair = updatedCityPairs[pairIndex]
    if (pair.cities.every((c) => c.answered)) {
      // Add connection
      const connectionName = getConnectionName(pair.cities[0].name, pair.cities[1].name)
      if (connectionName && !activeConnections.includes(connectionName)) {
        setActiveConnections([...activeConnections, connectionName])
      }
    }

    // Clear selection
    setSelectedCity(null)
    setInputValue("")
  }

  // Get connection image name based on city names
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

  // Handle keyboard events
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      checkAnswer()
    } else if (e.key === "Escape") {
      setSelectedCity(null)
      setInputValue("")
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

      <div className="relative w-full max-w-4xl mx-auto">
        {/* Map container */}
        <div className="relative border border-gray-700 rounded-lg overflow-hidden" style={{ aspectRatio: "16/9" }}>
          {/* Base map image */}
          <img
            src="/images/hellmap/hellmap_full.webp"
            alt="Map with location pins"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Connection overlays */}
          {activeConnections.map((connection, index) => (
            <img
              key={index}
              src={connection || "/placeholder.svg"}
              alt="Connection line"
              className="absolute inset-0 w-full h-full object-cover z-10"
            />
          ))}

          {/* City markers */}
          {cityPairs.map((pair, pairIndex) =>
            pair.cities.map((city, cityIndex) => (
              <div
                key={`${pairIndex}-${cityIndex}`}
                className="absolute z-20"
                style={{
                  left: `${city.position.x}%`,
                  top: `${city.position.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {/* Pin marker */}
                <div
                  className={`w-6 h-6 rounded-full cursor-pointer mb-1 flex items-center justify-center
                    ${city.answered ? "bg-green-600" : pair.color === "gray" ? "bg-gray-600" : `bg-${pair.color}-600`}`}
                  onClick={() => handleCityClick(pairIndex, cityIndex)}
                >
                  <div className="w-3 h-3 bg-amber-300 rounded-full"></div>
                </div>

                {/* City name input/display */}
                <div className="relative">
                  {selectedCity && selectedCity.pairIndex === pairIndex && selectedCity.cityIndex === cityIndex ? (
                    <input
                      type="text"
                      value={inputValue}
                      onChange={handleInputChange}
                      onBlur={checkAnswer}
                      onKeyDown={handleKeyPress}
                      className="px-2 py-1 text-xs rounded border border-gray-400 w-20 bg-gray-800 text-white"
                      autoFocus
                    />
                  ) : (
                    <div
                      onClick={() => handleCityClick(pairIndex, cityIndex)}
                      className={`
                        px-2 py-1 text-xs rounded cursor-pointer text-center w-20
                        ${
                          city.userInput
                            ? city.answered
                              ? "bg-green-600 text-white"
                              : "bg-red-600 text-white"
                            : "bg-gray-800 text-gray-300"
                        }
                      `}
                    >
                      {city.userInput || "?"}
                    </div>
                  )}
                </div>
              </div>
            )),
          )}
        </div>
      </div>

      {/* Success message */}
      {solved && (
        <div className="mt-4 p-2 bg-green-800 text-green-100 rounded-lg text-center">
          All locations correctly identified! The connections reveal the word "INFERNO".
        </div>
      )}
    </div>
  )
}
