"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface Pin {
  id: string
  x: number // exact pixel position
  y: number // exact pixel position
  color: string
  correctAnswers: string[]
  userAnswer: string
}

interface Connection {
  pin1Id: string
  pin2Id: string
  imagePath: string
  active: boolean
}

export default function FireMapPuzzle({ onSolve }: { onSolve?: () => void }) {
  // Define pins with exact pixel positions from the 971x813px image
  const [pins, setPins] = useState<Pin[]>([
    {
      id: "zhanaozen",
      x: 60,
      y: 70,
      color: "grey",
      correctAnswers: ["zhanaozen", "жаңаөзен"],
      userAnswer: "",
    },
    {
      id: "qonirat",
      x: 445,
      y: 120,
      color: "blue",
      correctAnswers: ["qonirat", "qońirat", "kungrad", "кунград"],
      userAnswer: "",
    },
    {
      id: "urgench",
      x: 570,
      y: 190,
      color: "green",
      correctAnswers: ["urgench", "урганч"],
      userAnswer: "",
    },
    {
      id: "navoi",
      x: 825,
      y: 320,
      color: "purple",
      correctAnswers: ["navoi", "navoiy", "навоий"],
      userAnswer: "",
    },
    {
      id: "turkmenbasy",
      x: 60,
      y: 320,
      color: "purple",
      correctAnswers: ["turkmenbasy", "turkmenbashy", "turkmenbasi", "turkmenbashi"],
      userAnswer: "",
    },
    {
      id: "ashgabat",
      x: 445,
      y: 490,
      color: "blue",
      correctAnswers: ["ashgabat"],
      userAnswer: "",
    },
    {
      id: "mary",
      x: 600,
      y: 490,
      color: "grey",
      correctAnswers: ["mary"],
      userAnswer: "",
    },
    {
      id: "siri",
      x: 60,
      y: 610,
      color: "green",
      correctAnswers: ["siri", "sari", "سارى"],
      userAnswer: "",
    },
  ])

  // Define connections
  const [connections, setConnections] = useState<Connection[]>([
    {
      pin1Id: "siri",
      pin2Id: "urgench",
      imagePath: "/images/hellmap/hellmap_sari-urgench.webp",
      active: false,
    },
    {
      pin1Id: "turkmenbasy",
      pin2Id: "navoi",
      imagePath: "/images/hellmap/hellmap_turkmenbay-navoi.webp",
      active: false,
    },
  ])

  const [editingPinId, setEditingPinId] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState("")
  const [solved, setSolved] = useState(false)

  // Handle clicking on a pin label
  const handlePinClick = (pinId: string) => {
    const pin = pins.find((p) => p.id === pinId)
    if (pin) {
      setEditingPinId(pinId)
      setInputValue(pin.userAnswer)
    }
  }

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  // Handle saving the answer
  const handleSaveAnswer = () => {
    if (editingPinId) {
      const updatedPins = pins.map((pin) => (pin.id === editingPinId ? { ...pin, userAnswer: inputValue } : pin))
      setPins(updatedPins)
      setEditingPinId(null)

      // Check for connections
      checkConnections(updatedPins)
    }
  }

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveAnswer()
    } else if (e.key === "Escape") {
      setEditingPinId(null)
    }
  }

  // Check for connections
  const checkConnections = (currentPins: Pin[]) => {
    const updatedConnections = connections.map((connection) => {
      const pin1 = currentPins.find((p) => p.id === connection.pin1Id)
      const pin2 = currentPins.find((p) => p.id === connection.pin2Id)

      if (pin1 && pin2) {
        const pin1Correct = pin1.correctAnswers.some((answer) => answer.toLowerCase() === pin1.userAnswer.toLowerCase())
        const pin2Correct = pin2.correctAnswers.some((answer) => answer.toLowerCase() === pin2.userAnswer.toLowerCase())

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
  useEffect(() => {
    const allCorrect = pins.every((pin) =>
      pin.correctAnswers.some((answer) => answer.toLowerCase() === pin.userAnswer.toLowerCase()),
    )

    if (allCorrect && !solved) {
      setSolved(true)
      if (onSolve) onSolve()
    }
  }, [pins, onSolve, solved])

  return (
    <div className="w-full flex justify-center p-4 bg-gray-900">
      <div className="relative" style={{ width: "971px", height: "813px", backgroundColor: "rgba(255,255,255,0.5)" }}>
        {/* Base map image */}
        <img
          src="/images/hellmap/hellmap_full.webp"
          alt="Map with location pins"
          className="absolute top-0 left-0 w-full h-full"
        />

        {/* Connection overlays */}
        {connections.map(
          (connection, index) =>
            connection.active && (
              <img
                key={`connection-${index}`}
                src={connection.imagePath || "/placeholder.svg"}
                alt="Connection"
                className="absolute top-0 left-0 w-full h-full"
                style={{ zIndex: 10 }}
              />
            ),
        )}

        {/* Pin labels */}
        {pins.map((pin) => (
          <div
            key={pin.id}
            className="absolute"
            style={{
              left: `${pin.x}px`,
              top: `${pin.y}px`,
              transform: "translate(20px, 0)",
              zIndex: 20,
            }}
          >
            {editingPinId === pin.id ? (
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleSaveAnswer}
                onKeyDown={handleKeyPress}
                className="px-2 py-1 text-sm bg-white border border-gray-300 rounded"
                autoFocus
                style={{ width: "120px" }}
              />
            ) : (
              <div
                className={`px-2 py-1 text-sm font-bold cursor-pointer whitespace-nowrap rounded ${
                  pin.userAnswer
                    ? pin.correctAnswers.some((a) => a.toLowerCase() === pin.userAnswer.toLowerCase())
                      ? "bg-green-700 text-white"
                      : "bg-red-700 text-white"
                    : "bg-gray-700 text-gray-200"
                }`}
                onClick={() => handlePinClick(pin.id)}
              >
                {pin.userAnswer || "?"}
              </div>
            )}
          </div>
        ))}

        {/* Feedback message */}
        {solved && (
          <div
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 p-2 bg-green-800 text-green-100 rounded-lg text-center"
            style={{ zIndex: 30 }}
          >
            Correct! You've identified all the sacred fire locations.
          </div>
        )}
      </div>
    </div>
  )
}
