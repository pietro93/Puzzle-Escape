"use client"

import type React from "react"

import { useState } from "react"

// Define the pin locations and their correct answers
interface PinLocation {
  id: string
  x: number // percentage from left
  y: number // percentage from top
  color: "blue" | "green" | "purple" | "grey"
  correctAnswer: string[]
  userAnswer: string
}

// Define the connection pairs
interface ConnectionPair {
  pin1: string
  pin2: string
  overlayImage: string
  active: boolean
}

export default function FireMapPuzzle({ onSolve }: { onSolve?: () => void }) {
  // Define pin locations based on the image
  const [pins, setPins] = useState<PinLocation[]>([
    {
      id: "ashgabat",
      x: 42, // percentage from left
      y: 58, // percentage from top
      color: "blue",
      correctAnswer: ["ashgabat"],
      userAnswer: "",
    },
    {
      id: "qonirat",
      x: 42, // percentage from left
      y: 15, // percentage from top
      color: "blue",
      correctAnswer: ["qonirat", "qońirat", "kungrad", "кунград"],
      userAnswer: "",
    },
    {
      id: "zhanaozen",
      x: 7, // percentage from left
      y: 8, // percentage from top
      color: "grey",
      correctAnswer: ["zhanaozen", "жаңаөзен"],
      userAnswer: "",
    },
    {
      id: "mary",
      x: 60, // percentage from left
      y: 58, // percentage from top
      color: "grey",
      correctAnswer: ["mary"],
      userAnswer: "",
    },
    {
      id: "siri",
      x: 7, // percentage from left
      y: 75, // percentage from top
      color: "green",
      correctAnswer: ["siri", "sari", "سارى"],
      userAnswer: "",
    },
    {
      id: "urgench",
      x: 60, // percentage from left
      y: 22, // percentage from top
      color: "green",
      correctAnswer: ["urgench", "урганч"],
      userAnswer: "",
    },
    {
      id: "turkmenbasy",
      x: 7, // percentage from left
      y: 40, // percentage from top
      color: "purple",
      correctAnswer: ["turkmenbasy", "turkmenbashy", "turkmenbasi", "turkmenbashi"],
      userAnswer: "",
    },
    {
      id: "navoi",
      x: 85, // percentage from left
      y: 40, // percentage from top
      color: "purple",
      correctAnswer: ["navoi", "navoiy", "навоий"],
      userAnswer: "",
    },
  ])

  // Define connection pairs
  const [connections, setConnections] = useState<ConnectionPair[]>([
    {
      pin1: "siri",
      pin2: "urgench",
      overlayImage: "/images/hellmap/hellmap_sari-urgench.webp",
      active: false,
    },
    {
      pin1: "turkmenbasy",
      pin2: "navoi",
      overlayImage: "/images/hellmap/hellmap_turkmenbay-navoi.webp",
      active: false,
    },
  ])

  const [activePin, setActivePin] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState("")
  const [solved, setSolved] = useState(false)

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  // Handle input blur
  const handleInputBlur = () => {
    if (activePin) {
      // Update the pin's user answer
      const updatedPins = pins.map((pin) => (pin.id === activePin ? { ...pin, userAnswer: inputValue } : pin))
      setPins(updatedPins)
      setActivePin(null)

      // Check for connections
      checkConnections(updatedPins)

      // Check if puzzle is solved
      checkIfSolved(updatedPins)
    }
  }

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleInputBlur()
    }
  }

  // Check for connections
  const checkConnections = (currentPins: PinLocation[]) => {
    const updatedConnections = connections.map((connection) => {
      const pin1 = currentPins.find((p) => p.id === connection.pin1)
      const pin2 = currentPins.find((p) => p.id === connection.pin2)

      if (pin1 && pin2) {
        const pin1Correct = pin1.correctAnswer.some((answer) => answer.toLowerCase() === pin1.userAnswer.toLowerCase())
        const pin2Correct = pin2.correctAnswer.some((answer) => answer.toLowerCase() === pin2.userAnswer.toLowerCase())

        return {
          ...connection,
          active: pin1Correct && pin2Correct,
        }
      }

      return connection
    })

    setConnections(updatedConnections)
  }

  // Check if puzzle is solved
  const checkIfSolved = (currentPins: PinLocation[]) => {
    const allCorrect = currentPins.every((pin) =>
      pin.correctAnswer.some((answer) => answer.toLowerCase() === pin.userAnswer.toLowerCase()),
    )

    if (allCorrect && !solved) {
      setSolved(true)
      if (onSolve) onSolve()
    }
  }

  // Handle pin click
  const handlePinClick = (pinId: string) => {
    const pin = pins.find((p) => p.id === pinId)
    if (pin) {
      setActivePin(pinId)
      setInputValue(pin.userAnswer)
    }
  }

  return (
    <div className="w-full bg-gray-900 rounded-lg overflow-hidden p-4">
      <h3 className="text-lg font-bold mb-4 text-amber-500">Sacred Fires Map</h3>

      <div className="mb-4 text-gray-300 text-sm">
        <p>
          An ancient map shows the locations of sacred eternal flames. Click near each pin to label it with the correct
          name. When pairs of locations are correctly identified, hidden connections will be revealed.
        </p>
      </div>

      <div className="relative w-full" style={{ maxWidth: "100%", margin: "0 auto" }}>
        {/* Base map image */}
        <img src="/images/hellmap/hellmap_full.webp" alt="Map with location pins" className="w-full" />

        {/* Connection overlays */}
        {connections.map(
          (connection, index) =>
            connection.active && (
              <img
                key={`connection-${index}`}
                src={connection.overlayImage || "/placeholder.svg"}
                alt="Connection"
                className="absolute top-0 left-0 w-full h-full"
                style={{ zIndex: 10 }}
              />
            ),
        )}

        {/* Pin input areas */}
        {pins.map((pin) => (
          <div
            key={pin.id}
            className="absolute"
            style={{
              left: `${pin.x}%`,
              top: `${pin.y}%`,
              transform: "translate(-50%, -50%)",
              zIndex: 20,
            }}
          >
            {activePin === pin.id ? (
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                onKeyDown={handleKeyPress}
                className="px-2 py-1 text-sm bg-white border border-gray-300 rounded"
                autoFocus
                style={{ width: "100px" }}
              />
            ) : (
              <div
                className={`px-2 py-1 text-sm font-bold cursor-pointer whitespace-nowrap rounded ${
                  pin.userAnswer
                    ? pin.correctAnswer.some((a) => a.toLowerCase() === pin.userAnswer.toLowerCase())
                      ? "bg-green-800 text-white"
                      : "bg-red-800 text-white"
                    : "bg-gray-700 text-gray-400"
                }`}
                onClick={() => handlePinClick(pin.id)}
                style={{
                  minWidth: "60px",
                  textAlign: "center",
                }}
              >
                {pin.userAnswer || "?"}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Feedback message */}
      {solved && (
        <div className="mt-4 p-2 bg-green-800 text-green-100 rounded-lg text-center">
          Correct! You've identified all the sacred fire locations.
        </div>
      )}
    </div>
  )
}
