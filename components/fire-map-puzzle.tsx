"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"

interface MapLocation {
  id: string
  x: number
  y: number
  label: string
  correctLabel: string
  numbers?: string
  pinColor: "purple" | "blue" | "green"
}

interface FireMapPuzzleProps {
  onSolve?: () => void
}

export default function FireMapPuzzle({ onSolve }: FireMapPuzzleProps) {
  // Define the initial locations with empty labels
  const initialLocations: MapLocation[] = [
    { id: "loc1", x: 53, y: 70, label: "", correctLabel: "Zhanaozen", pinColor: "purple" },
    { id: "loc2", x: 285, y: 85, label: "", correctLabel: "Kungrad", pinColor: "blue" },
    { id: "loc3", x: 408, y: 123, label: "", correctLabel: "Urgench", pinColor: "green" },
    { id: "loc4", x: 532, y: 180, label: "", correctLabel: "Navoi", pinColor: "purple" },
    { id: "loc5", x: 53, y: 250, label: "", correctLabel: "Sari", pinColor: "green" },
    { id: "loc6", x: 285, y: 350, label: "", correctLabel: "Inferno", numbers: "1436\n3411", pinColor: "blue" },
    { id: "loc7", x: 408, y: 350, label: "", correctLabel: "Gehenna", numbers: "1414\n3825", pinColor: "purple" },
    { id: "loc8", x: 53, y: 350, label: "", correctLabel: "Tartarus", numbers: "1600\n2807", pinColor: "purple" },
  ]

  // List of city names to display to the player
  const cityNames = [
    { name: "Жаңаөзен (Zhanaozen)", hint: "Kazakh city" },
    { name: "Кунград (Kungrad)", hint: "Uzbek city" },
    { name: "Урганч (Urgench)", hint: "Uzbek city" },
    { name: "Навоий (Navoi)", hint: "Uzbek city" },
    { name: "سارى (Sari)", hint: "Iranian city" },
    { name: "Inferno", hint: "Coordinates: 1436, 3411" },
    { name: "Gehenna", hint: "Coordinates: 1414, 3825" },
    { name: "Tartarus", hint: "Coordinates: 1600, 2807" },
  ]

  const [locations, setLocations] = useState<MapLocation[]>(initialLocations)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")
  const [solved, setSolved] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [draggedCity, setDraggedCity] = useState<string | null>(null)

  // Function to handle clicking on a label to edit it
  const handleLabelClick = (id: string, currentValue: string) => {
    setEditingId(id)
    setEditValue(currentValue)
  }

  // Function to save the edited value
  const handleSaveEdit = () => {
    if (editingId) {
      setLocations(
        locations.map((loc) =>
          loc.id === editingId
            ? {
                ...loc,
                label: editValue,
              }
            : loc,
        ),
      )
      setEditingId(null)
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

  // Handle drag start for city names
  const handleDragStart = (e: React.DragEvent, cityName: string) => {
    e.dataTransfer.setData("text/plain", cityName)
    setDraggedCity(cityName)
  }

  // Handle drag over for location pins
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  // Handle drop for location pins
  const handleDrop = (e: React.DragEvent, locationId: string) => {
    e.preventDefault()
    const cityName = e.dataTransfer.getData("text/plain")

    // Extract just the English name in parentheses if it exists
    let englishName = cityName
    const match = cityName.match(/$$([^)]+)$$/)
    if (match) {
      englishName = match[1]
    }

    setLocations(
      locations.map((loc) =>
        loc.id === locationId
          ? {
              ...loc,
              label: englishName,
            }
          : loc,
      ),
    )
    setDraggedCity(null)
  }

  // Check if the puzzle is solved
  useEffect(() => {
    // Check if all locations have been correctly labeled
    const isSolved = locations.every((loc) => {
      // Case insensitive comparison
      return loc.label.toLowerCase() === loc.correctLabel.toLowerCase()
    })

    if (isSolved && !solved) {
      setSolved(true)
      onSolve?.()
    }
  }, [locations, onSolve, solved])

  return (
    <div className="relative w-full max-w-md mx-auto bg-gray-900 rounded-lg overflow-hidden p-4">
      <h3 className="text-lg font-bold mb-4 text-amber-500">Sacred Fires Map</h3>

      {/* Instructions */}
      <div className="mb-4 text-gray-300 text-sm">
        <p>
          An ancient map shows the locations of sacred eternal flames. Label each location by dragging the city names to
          the correct pins or by clicking on a pin to type a name.
        </p>
        <button
          className="mt-2 text-xs text-amber-400 hover:text-amber-300 underline"
          onClick={() => setShowHints(!showHints)}
        >
          {showHints ? "Hide Hints" : "Show Hints"}
        </button>
      </div>

      {/* City names to drag */}
      <div className="mb-4 p-3 bg-gray-800 rounded-lg">
        <h4 className="text-sm font-bold mb-2 text-gray-300">City Names:</h4>
        <div className="flex flex-wrap gap-2">
          {cityNames.map((city, index) => (
            <div
              key={index}
              className={`px-2 py-1 bg-gray-700 rounded text-xs cursor-move flex flex-col ${
                draggedCity === city.name ? "opacity-50" : "opacity-100"
              }`}
              draggable
              onDragStart={(e) => handleDragStart(e, city.name)}
            >
              <span className="text-white">{city.name}</span>
              {showHints && <span className="text-gray-400 text-xs italic">{city.hint}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Map with pins */}
      <div className="relative w-full" style={{ paddingBottom: "75%" }}>
        <div className="absolute inset-0">
          <Image
            src="/images/map-background.png"
            alt="Map with location pins"
            layout="fill"
            objectFit="contain"
            className="pointer-events-none"
          />

          {/* Render each location pin and label */}
          {locations.map((location) => (
            <div
              key={location.id}
              className="absolute"
              style={{
                left: `${location.x}px`,
                top: `${location.y}px`,
                transform: "translate(-50%, -100%)",
              }}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, location.id)}
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
          ))}
        </div>
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
