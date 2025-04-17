"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface MapLocation {
  id: string
  x: number
  y: number
  label: string
  acceptableAnswers: string[]
  color: "purple" | "blue" | "green" | "gray"
  numbers?: string
}

interface FireMapPuzzleProps {
  onSolve?: () => void
}

export default function FireMapPuzzle({ onSolve }: FireMapPuzzleProps) {
  // Define the locations with empty labels - positions carefully measured from the image
  const initialLocations: MapLocation[] = [
    { id: "loc1", x: 40, y: 40, label: "", acceptableAnswers: ["ashgabat"], color: "purple" },
    { id: "loc2", x: 405, y: 70, label: "", acceptableAnswers: ["qonirat", "qońirat", "kungrad"], color: "blue" },
    {
      id: "loc3",
      x: 520,
      y: 190,
      label: "",
      acceptableAnswers: ["turkmenbasy", "turkmenbashy", "turkmenbasi", "turkmenbashi"],
      color: "green",
    },
    { id: "loc4", x: 825, y: 320, label: "", acceptableAnswers: ["navoi", "navoiy"], color: "purple" },
    { id: "loc5", x: 40, y: 610, label: "", acceptableAnswers: ["sari"], color: "green" },
    { id: "loc6", x: 405, y: 490, label: "", acceptableAnswers: ["mary"], color: "blue", numbers: "√1436\n√3411" },
    { id: "loc7", x: 600, y: 490, label: "", acceptableAnswers: ["inferno"], color: "gray", numbers: "√1414\n√3825" },
    { id: "loc8", x: 40, y: 320, label: "", acceptableAnswers: ["tartarus"], color: "purple", numbers: "√1600\n√2807" },
  ]

  const [locations, setLocations] = useState<MapLocation[]>(initialLocations)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")
  const [solved, setSolved] = useState(false)
  const [showConnections, setShowConnections] = useState<{ [key: string]: boolean }>({
    purple: false,
    blue: false,
    green: false,
    gray: false,
  })

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

      // Check if we should show connections for any color
      updateConnections(newLocations)
    }
  }

  // Update which color groups have all pins labeled
  const updateConnections = (locs: MapLocation[]) => {
    const newShowConnections = { ...showConnections }

    // Check each color group
    const colors = ["purple", "blue", "green", "gray"] as const

    colors.forEach((color) => {
      const pinsOfColor = locs.filter((loc) => loc.color === color)
      const allLabeled = pinsOfColor.every((pin) => pin.label.trim() !== "")
      newShowConnections[color] = allLabeled
    })

    setShowConnections(newShowConnections)
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

  return (
    <div className="w-full bg-gray-900 rounded-lg overflow-hidden p-4">
      <h3 className="text-lg font-bold mb-4 text-amber-500">Sacred Fires Map</h3>

      {/* Instructions */}
      <div className="mb-4 text-gray-300 text-sm">
        <p>
          An ancient map shows the locations of sacred eternal flames. Click on each label to enter the correct name.
          When all pins of the same color are labeled, connections will appear.
        </p>
      </div>

      {/* Map container */}
      <div className="relative w-full" style={{ minHeight: "700px" }}>
        {/* Map image with SVG overlay for connections */}
        <div className="relative w-full h-full flex justify-center">
          <div className="relative" style={{ maxWidth: "900px" }}>
            <img src="/images/fire-map.png" alt="Map with location pins" className="w-full" />

            {/* SVG overlay for connections */}
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
              {/* Purple connections */}
              {showConnections.purple && (
                <>
                  {/* Connect all purple pins */}
                  {locations
                    .filter((loc) => loc.color === "purple")
                    .flatMap((loc1, i, arr) =>
                      arr
                        .slice(i + 1)
                        .map((loc2) => (
                          <line
                            key={`${loc1.id}-${loc2.id}`}
                            x1={loc1.x}
                            y1={loc1.y}
                            x2={loc2.x}
                            y2={loc2.y}
                            stroke="red"
                            strokeWidth="3"
                            strokeDasharray="5,5"
                          />
                        )),
                    )}
                </>
              )}

              {/* Blue connections */}
              {showConnections.blue && (
                <>
                  {/* Connect all blue pins */}
                  {locations
                    .filter((loc) => loc.color === "blue")
                    .flatMap((loc1, i, arr) =>
                      arr
                        .slice(i + 1)
                        .map((loc2) => (
                          <line
                            key={`${loc1.id}-${loc2.id}`}
                            x1={loc1.x}
                            y1={loc1.y}
                            x2={loc2.x}
                            y2={loc2.y}
                            stroke="red"
                            strokeWidth="3"
                            strokeDasharray="5,5"
                          />
                        )),
                    )}
                </>
              )}

              {/* Green connections */}
              {showConnections.green && (
                <>
                  {/* Connect all green pins */}
                  {locations
                    .filter((loc) => loc.color === "green")
                    .flatMap((loc1, i, arr) =>
                      arr
                        .slice(i + 1)
                        .map((loc2) => (
                          <line
                            key={`${loc1.id}-${loc2.id}`}
                            x1={loc1.x}
                            y1={loc1.y}
                            x2={loc2.x}
                            y2={loc2.y}
                            stroke="red"
                            strokeWidth="3"
                            strokeDasharray="5,5"
                          />
                        )),
                    )}
                </>
              )}
            </svg>

            {/* Labels */}
            {locations.map((location) => (
              <div
                key={location.id}
                className="absolute"
                style={{
                  left: `${location.x}px`,
                  top: `${location.y}px`,
                  transform: "translate(-50%, 40px)",
                }}
              >
                {/* Editable label */}
                {editingId === location.id ? (
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={handleSaveEdit}
                    onKeyDown={handleKeyPress}
                    className="px-2 py-1 text-sm bg-white border border-gray-300 rounded"
                    autoFocus
                  />
                ) : (
                  <div
                    className={`px-2 py-1 text-sm font-bold cursor-pointer whitespace-nowrap rounded ${
                      location.label ? "bg-gray-800 text-white" : "bg-gray-700 text-gray-400"
                    }`}
                    onClick={() => handleLabelClick(location.id, location.label)}
                  >
                    {location.label || "?"}
                  </div>
                )}

                {/* Display numbers if any */}
                {location.numbers && (
                  <div className="mt-1 text-xs font-bold whitespace-pre-line text-center text-amber-400">
                    {location.numbers}
                  </div>
                )}
              </div>
            ))}
          </div>
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
