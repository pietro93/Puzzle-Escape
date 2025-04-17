"use client"

import type React from "react"

import { useState } from "react"

interface PinLocation {
  id: string
  x: number // pixel position
  y: number // pixel position
  color: string
  correctAnswers: string[]
  userAnswer: string
}

interface ConnectionPair {
  pin1Id: string
  pin2Id: string
  overlayImage: string
}

export default function FireMapPuzzle({ onSolve }: { onSolve?: () => void }) {
  // Define all pins with their exact pixel positions on the 971x813px image
  const [pins, setPins] = useState<PinLocation[]>([
    {
      id: "pin1",
      x: 60, // Zhanaozen (grey top left)
      y: 70,
      color: "grey",
      correctAnswers: ["zhanaozen", "жаңаөзен"],
      userAnswer: "",
    },
    {
      id: "pin2",
      x: 435, // Qonirat (top blue)
      y: 120,
      color: "blue",
      correctAnswers: ["qonirat", "qońirat", "kungrad", "кунград"],
      userAnswer: "",
    },
    {
      id: "pin3",
      x: 570, // Urgench (top right green)
      y: 190,
      color: "green",
      correctAnswers: ["urgench", "урганч"],
      userAnswer: "",
    },
    {
      id: "pin4",
      x: 840, // Navoi (far right purple)
      y: 320,
      color: "purple",
      correctAnswers: ["navoi", "navoiy", "навоий"],
      userAnswer: "",
    },
    {
      id: "pin5",
      x: 60, // Turkmenbasy (far left purple)
      y: 320,
      color: "purple",
      correctAnswers: ["turkmenbasy", "turkmenbashy", "turkmenbasi", "turkmenbashi"],
      userAnswer: "",
    },
    {
      id: "pin6",
      x: 435, // Ashgabat (bottom blue)
      y: 490,
      color: "blue",
      correctAnswers: ["ashgabat"],
      userAnswer: "",
    },
    {
      id: "pin7",
      x: 600, // Mary (bottom right grey)
      y: 490,
      color: "grey",
      correctAnswers: ["mary"],
      userAnswer: "",
    },
    {
      id: "pin8",
      x: 60, // Siri (bottom left green)
      y: 610,
      color: "green",
      correctAnswers: ["siri", "sari", "سارى"],
      userAnswer: "",
    },
  ])

  // Define connection pairs
  const connectionPairs: ConnectionPair[] = [
    {
      pin1Id: "pin8", // Siri
      pin2Id: "pin3", // Urgench
      overlayImage: "/images/hellmap/hellmap_sari-urgench.webp",
    },
    {
      pin1Id: "pin5", // Turkmenbasy
      pin2Id: "pin4", // Navoi
      overlayImage: "/images/hellmap/hellmap_turkmenbay-navoi.webp",
    },
  ]

  const [activePin, setActivePin] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState("")
  const [activeOverlays, setActiveOverlays] = useState<string[]>([])
  const [solved, setSolved] = useState(false)

  // Handle input click
  const handleInputClick = (pinId: string) => {
    const pin = pins.find((p) => p.id === pinId)
    if (pin) {
      setActivePin(pinId)
      setInputValue(pin.userAnswer)
    }
  }

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  // Handle save answer
  const handleSaveAnswer = () => {
    if (activePin) {
      // Update pin answer
      const updatedPins = pins.map((pin) => (pin.id === activePin ? { ...pin, userAnswer: inputValue.trim() } : pin))
      setPins(updatedPins)
      setActivePin(null)

      // Check for connections
      checkConnections(updatedPins)
    }
  }

  // Handle keyboard events
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveAnswer()
    } else if (e.key === "Escape") {
      setActivePin(null)
    }
  }

  // Check for matching pairs to show overlays
  const checkConnections = (currentPins: PinLocation[]) => {
    const newOverlays: string[] = []

    connectionPairs.forEach((pair) => {
      const pin1 = currentPins.find((p) => p.id === pair.pin1Id)
      const pin2 = currentPins.find((p) => p.id === pair.pin2Id)

      if (pin1 && pin2) {
        const pin1Correct = pin1.correctAnswers.some((answer) => answer.toLowerCase() === pin1.userAnswer.toLowerCase())
        const pin2Correct = pin2.correctAnswers.some((answer) => answer.toLowerCase() === pin2.userAnswer.toLowerCase())

        if (pin1Correct && pin2Correct) {
          newOverlays.push(pair.overlayImage)
        }
      }
    })

    setActiveOverlays(newOverlays)

    // Check if all pins are correct
    const allCorrect = currentPins.every((pin) =>
      pin.correctAnswers.some((answer) => answer.toLowerCase() === pin.userAnswer.toLowerCase()),
    )

    if (allCorrect && !solved) {
      setSolved(true)
      if (onSolve) onSolve()
    }
  }

  return (
    <div className="w-full flex justify-center bg-gray-900 p-4">
      <div className="relative" style={{ width: "971px", height: "813px" }}>
        {/* Semi-transparent white background */}
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}></div>

        {/* Base map image */}
        <img
          src="/images/hellmap/hellmap_full.webp"
          alt="Map with location pins"
          className="absolute inset-0"
          style={{ width: "971px", height: "813px" }}
        />

        {/* Overlay images for connections */}
        {activeOverlays.map((overlay, index) => (
          <img
            key={index}
            src={overlay || "/placeholder.svg"}
            alt="Connection overlay"
            className="absolute inset-0"
            style={{ width: "971px", height: "813px", zIndex: 10 }}
          />
        ))}

        {/* Input fields for each pin */}
        {pins.map((pin) => (
          <div
            key={pin.id}
            className="absolute"
            style={{
              left: `${pin.x}px`,
              top: `${pin.y}px`,
              transform: "translate(-50%, 50%)",
              zIndex: 20,
            }}
          >
            {activePin === pin.id ? (
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleSaveAnswer}
                onKeyDown={handleKeyPress}
                className="px-2 py-1 text-sm rounded border border-gray-400 w-24"
                autoFocus
              />
            ) : (
              <div
                onClick={() => handleInputClick(pin.id)}
                className={`
                  px-2 py-1 text-sm rounded cursor-pointer text-center w-24
                  ${
                    pin.userAnswer
                      ? pin.correctAnswers.some((a) => a.toLowerCase() === pin.userAnswer.toLowerCase())
                        ? "bg-green-600 text-white"
                        : "bg-red-600 text-white"
                      : "bg-gray-700 text-gray-200"
                  }
                `}
              >
                {pin.userAnswer || "?"}
              </div>
            )}
          </div>
        ))}

        {/* Success message */}
        {solved && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded">
            All locations correctly identified!
          </div>
        )}
      </div>
    </div>
  )
}
