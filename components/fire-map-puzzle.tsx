"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"

interface MapLocation {
  id: string
  x: number
  y: number
  label: string
  acceptableAnswers: string[]
  pinColor: "purple" | "blue" | "green"
  numbers?: string
}

interface Connection {
  from: string
  to: string
  color: string
}

interface FireMapPuzzleProps {
  onSolve?: () => void
}

export default function FireMapPuzzle({ onSolve }: FireMapPuzzleProps) {
  // Define the initial locations with empty labels
  const initialLocations: MapLocation[] = [
    {
      id: "loc1",
      x: 53,
      y: 70,
      label: "",
      acceptableAnswers: ["ashgabat"],
      pinColor: "purple",
    },
    {
      id: "loc2",
      x: 285,
      y: 85,
      label: "",
      acceptableAnswers: ["qonirat", "qońirat", "kungrad"],
      pinColor: "blue",
    },
    {
      id: "loc3",
      x: 408,
      y: 123,
      label: "",
      acceptableAnswers: ["turkmenbasy", "turkmenbashy", "turkmenbasi", "turkmenbashi"],
      pinColor: "green",
    },
    {
      id: "loc4",
      x: 532,
      y: 180,
      label: "",
      acceptableAnswers: ["navoi", "navoiy"],
      pinColor: "purple",
    },
    {
      id: "loc5",
      x: 53,
      y: 250,
      label: "",
      acceptableAnswers: ["sari"],
      pinColor: "green",
    },
    {
      id: "loc6",
      x: 285,
      y: 350,
      label: "",
      acceptableAnswers: ["mary"],
      pinColor: "blue",
      numbers: "√1436\n√3411",
    },
    {
      id: "loc7",
      x: 408,
      y: 350,
      label: "",
      acceptableAnswers: ["inferno"],
      pinColor: "purple",
      numbers: "√1414\n√3825",
    },
    {
      id: "loc8",
      x: 53,
      y: 350,
      label: "",
      acceptableAnswers: ["tartarus"],
      pinColor: "purple",
      numbers: "√1600\n√2807",
    },
  ]

  const [locations, setLocations] = useState<MapLocation[]>(initialLocations)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")
  const [solved, setSolved] = useState(false)
  const [connections, setConnections] = useState<Connection[]>([])
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [mapDimensions, setMapDimensions] = useState({ width: 0, height: 0 })

  // Function to handle clicking on a label to edit it
  const handleLabelClick = (id: string, currentValue: string) => {
    setEditingId(id)
    setEditValue(currentValue)
  }

  // Function to save the edited value
  const handleSaveEdit = () => {
    if (editingId) {
      const newLocations = locations.map((loc) => (loc.id === editingId ? { ...loc, label: editValue } : loc))

      setLocations(newLocations)
      setEditingId(null)

      // Check for connections after updating the locations
      updateConnections(newLocations)
    }
  }

  // Update connections between pins of the same color with matching answers
  const updateConnections = (locs: MapLocation[]) => {
    const newConnections: Connection[] = []

    // Group locations by color
    const purplePins = locs.filter((loc) => loc.pinColor === "purple")
    const bluePins = locs.filter((loc) => loc.pinColor === "blue")
    const greenPins = locs.filter((loc) => loc.pinColor === "green")

    // Check for connections within each color group
    checkConnectionsInGroup(purplePins, newConnections)
    checkConnectionsInGroup(bluePins, newConnections)
    checkConnectionsInGroup(greenPins, newConnections)

    setConnections(newConnections)
  }

  // Helper function to check connections within a group of pins
  const checkConnectionsInGroup = (pins: MapLocation[], connections: Connection[]) => {
    for (let i = 0; i < pins.length; i++) {
      for (let j = i + 1; j < pins.length; j++) {
        const pin1 = pins[i]
        const pin2 = pins[j]

        // If both pins have labels and they match (case insensitive)
        if (pin1.label && pin2.label && pin1.label.toLowerCase() === pin2.label.toLowerCase()) {
          connections.push({
            from: pin1.id,
            to: pin2.id,
            color: "red",
          })
        }
      }
    }
  }

  // Handle key press events for the input field
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveEdit()
    } else if (e.key === "Escape") {
      setEditingId(null)
    }
  }

  // Check if the puzzle is solved
  useEffect(() => {
    // Check if all locations have been correctly labeled
    const isSolved = locations.every((loc) => {
      if (!loc.label) return false
      return loc.acceptableAnswers.some((answer) => answer.toLowerCase() === loc.label.toLowerCase())
    })

    if (isSolved && !solved) {
      setSolved(true)
      onSolve?.()
    }
  }, [locations, onSolve, solved])

  // Update map dimensions when the window resizes
  useEffect(() => {
    const updateDimensions = () => {
      if (mapContainerRef.current) {
        const { width, height } = mapContainerRef.current.getBoundingClientRect()
        setMapDimensions({ width, height })
      }
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)

    return () => {
      window.removeEventListener("resize", updateDimensions)
    }
  }, [])

  // Calculate scaled positions based on the original image dimensions and current container size
  const getScaledPosition = (x: number, y: number) => {
    // Original image dimensions
    const originalWidth = 600
    const originalHeight = 400

    // Calculate the scale factor
    const scaleX = mapDimensions.width / originalWidth
    const scaleY = mapDimensions.height / originalHeight

    return {
      x: x * scaleX,
      y: y * scaleY,
    }
  }

  return (
    <div className="w-full bg-gray-900 rounded-lg overflow-hidden p-4">
      <h3 className="text-lg font-bold mb-4 text-amber-500">Sacred Fires Map</h3>

      {/* Instructions */}
      <div className="mb-4 text-gray-300 text-sm">
        <p>
          An ancient map shows the locations of sacred eternal flames. Click on each pin to label it with the correct
          name. When two pins of the same color have the same name, a connection will appear.
        </p>
      </div>

      {/* Map with pins */}
      <div
        ref={mapContainerRef}
        className="relative w-full"
        style={{
          height: "calc(100vh - 300px)",
          minHeight: "400px",
          maxHeight: "600px",
        }}
      >
        <Image
          src="/images/map-background.png"
          alt="Map with location pins"
          layout="fill"
          objectFit="contain"
          className="pointer-events-none"
        />

        {/* Draw connections between pins */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {connections.map((connection, index) => {
            const fromLoc = locations.find((loc) => loc.id === connection.from)
            const toLoc = locations.find((loc) => loc.id === connection.to)

            if (fromLoc && toLoc) {
              const fromPos = getScaledPosition(fromLoc.x, fromLoc.y)
              const toPos = getScaledPosition(toLoc.x, toLoc.y)

              return (
                <line
                  key={index}
                  x1={fromPos.x}
                  y1={fromPos.y}
                  x2={toPos.x}
                  y2={toPos.y}
                  stroke={connection.color}
                  strokeWidth="2"
                />
              )
            }
            return null
          })}
        </svg>

        {/* Render each location pin and label */}
        {locations.map((location) => {
          const position = getScaledPosition(location.x, location.y)

          return (
            <div
              key={location.id}
              className="absolute"
              style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                transform: "translate(-50%, -100%)",
              }}
            >
              {/* Pin with fire icon */}
              <div
                className={`w-10 h-12 relative ${
                  location.pinColor === "purple"
                    ? "text-purple-700"
                    : location.pinColor === "blue"
                      ? "text-blue-700"
                      : "text-green-700"
                }`}
              >
                <svg viewBox="0 0 24 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0C5.4 0 0 5.4 0 12c0 6.2 12 20 12 20s12-13.8 12-20c0-6.6-5.4-12-12-12z" />
                  <circle cx="12" cy="12" r="8" fill="#000" />
                  <path d="M12 6c0 0-4 3-4 6c0 2.2 1.8 4 4 4s4-1.8 4-4C16 9 12 6 12 6z" fill="#ff7700" />
                  <path d="M12 7c0 0-3 2-3 4.5c0 1.7 1.3 3 3 3s3-1.3 3-3C15 9 12 7 12 7z" fill="#ffaa00" />
                  <path d="M12 8c0 0-2 1-2 3c0 1.1 0.9 2 2 2s2-0.9 2-2C14 9 12 8 12 8z" fill="#ffdd00" />
                </svg>
              </div>

              {/* Editable label */}
              {editingId === location.id ? (
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={handleSaveEdit}
                  onKeyDown={handleKeyPress}
                  className="absolute top-12 left-1/2 transform -translate-x-1/2 px-1 py-0.5 text-sm bg-white border border-gray-300 rounded"
                  autoFocus
                />
              ) : (
                <div
                  className={`absolute top-12 left-1/2 transform -translate-x-1/2 text-sm font-bold cursor-pointer whitespace-nowrap px-1 py-0.5 rounded ${
                    location.label ? "bg-gray-800 text-white" : "bg-gray-700 text-gray-400"
                  }`}
                  onClick={() => handleLabelClick(location.id, location.label)}
                >
                  {location.label || "?"}
                </div>
              )}

              {/* Display numbers if any */}
              {location.numbers && (
                <div className="absolute top-20 left-1/2 transform -translate-x-1/2 text-xs font-bold whitespace-pre-line text-center text-amber-400">
                  {location.numbers}
                </div>
              )}
            </div>
          )
        })}
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
