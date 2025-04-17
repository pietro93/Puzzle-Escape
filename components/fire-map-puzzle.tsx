"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface MapLocation {
  id: string
  x: number
  y: number
  label: string
  acceptableAnswers: string[]
  color: string
  numbers?: string
}

interface ConnectionPair {
  location1: string
  location2: string
  overlayImage: string
  active: boolean
}

interface FireMapPuzzleProps {
  onSolve?: () => void
}

export default function FireMapPuzzle({ onSolve }: FireMapPuzzleProps) {
  // Define the locations with empty labels
  const initialLocations: MapLocation[] = [
    {
      id: "loc1",
      x: 60,
      y: 70,
      label: "",
      acceptableAnswers: ["ashgabat", "жаңаөзен"],
      color: "purple",
    },
    {
      id: "loc2",
      x: 445,
      y: 120,
      label: "",
      acceptableAnswers: ["qonirat", "qońirat", "kungrad", "кунград"],
      color: "blue",
    },
    {
      id: "loc3",
      x: 570,
      y: 190,
      label: "",
      acceptableAnswers: ["urgench", "урганч"],
      color: "green",
    },
    {
      id: "loc4",
      x: 825,
      y: 320,
      label: "",
      acceptableAnswers: ["navoi", "navoiy", "навоий"],
      color: "purple",
    },
    {
      id: "loc5",
      x: 60,
      y: 610,
      label: "",
      acceptableAnswers: ["sari", "سارى"],
      color: "green",
    },
    {
      id: "loc6",
      x: 445,
      y: 490,
      label: "",
      acceptableAnswers: ["mary"],
      color: "blue",
      numbers: "√1436\n√3411",
    },
    {
      id: "loc7",
      x: 600,
      y: 490,
      label: "",
      acceptableAnswers: ["inferno"],
      color: "gray",
      numbers: "√1414\n√3825",
    },
    {
      id: "loc8",
      x: 60,
      y: 320,
      label: "",
      acceptableAnswers: ["turkmenbasy", "turkmenbashy", "turkmenbasi", "turkmenbashi"],
      color: "purple",
      numbers: "√1600\n√2807",
    },
  ]

  // Define connection pairs
  const initialConnectionPairs: ConnectionPair[] = [
    {
      location1: "loc5", // Sari (green pin lower left)
      location2: "loc3", // Urgench (green pin upper right)
      overlayImage: "/images/hellmap_sari_urgench.webp",
      active: false,
    },
    {
      location1: "loc8", // Turkmenbay (purple pin left)
      location2: "loc4", // Navoi (purple pin right)
      overlayImage: "/images/hellmap_turkmenbay-navoi.webp",
      active: false,
    },
  ]

  const [locations, setLocations] = useState<MapLocation[]>(initialLocations)
  const [connectionPairs, setConnectionPairs] = useState<ConnectionPair[]>(initialConnectionPairs)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")
  const [solved, setSolved] = useState(false)

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

      // Check for connections
      checkConnections(newLocations)
    }
  }

  // Check if any connection pairs should be activated
  const checkConnections = (locs: MapLocation[]) => {
    const newConnectionPairs = [...connectionPairs]

    newConnectionPairs.forEach((pair, index) => {
      const loc1 = locs.find((loc) => loc.id === pair.location1)
      const loc2 = locs.find((loc) => loc.id === pair.location2)

      if (loc1 && loc2) {
        // Check if both locations have correct labels
        const loc1Correct = loc1.acceptableAnswers.some((answer) => answer.toLowerCase() === loc1.label.toLowerCase())
        const loc2Correct = loc2.acceptableAnswers.some((answer) => answer.toLowerCase() === loc2.label.toLowerCase())

        newConnectionPairs[index].active = loc1Correct && loc2Correct
      }
    })

    setConnectionPairs(newConnectionPairs)
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
          When certain locations are correctly identified, hidden connections will be revealed.
        </p>
      </div>

      {/* Map container */}
      <div className="relative w-full" style={{ minHeight: "700px" }}>
        <div className="relative w-full h-full flex justify-center">
          <div className="relative" style={{ maxWidth: "900px" }}>
            {/* Base map image */}
            <img src="/images/hellmap_full.webp" alt="Map with location pins" className="w-full" />

            {/* Connection overlays */}
            {connectionPairs.map(
              (pair, index) =>
                pair.active && (
                  <img
                    key={index}
                    src={pair.overlayImage || "/placeholder.svg"}
                    alt="Connection line"
                    className="absolute top-0 left-0 w-full h-full"
                    style={{ zIndex: 10 }}
                  />
                ),
            )}

            {/* Editable labels */}
            {locations.map((location) => (
              <div
                key={location.id}
                className="absolute"
                style={{
                  left: `${location.x}px`,
                  top: `${location.y}px`,
                  transform: "translate(20px, 0)",
                  zIndex: 20,
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
