"use client"

import { useState } from "react"
import { X, Edit2, Check } from "lucide-react"

// Define the hell types
interface Hell {
  id: string
  name: string
  floor: number
  image: string
  description: string
  userLabel: string
}

interface ElevatorPanelProps {
  onClose: () => void
  onFloorSelect: (floor: Hell) => void
  currentFloor: number
  onRenameFloor: (floor: number, name: string) => void
  floorLabels: Record<number, string>
  correctNames: Record<number, string>
}

export default function ElevatorPanel({
  onClose,
  onFloorSelect,
  currentFloor,
  onRenameFloor,
  floorLabels,
  correctNames,
}: ElevatorPanelProps) {
  const [editingFloor, setEditingFloor] = useState<number | null>(null)
  const [editValue, setEditValue] = useState("")

  // Define all 16 hells
  const hells: Hell[] = [
    // Hot hells (8)
    {
      id: "samjiva",
      name: "Samjiva",
      floor: -1,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sanjiva-Qum6JaYX4HbbmDQ7vboJhdurDG7Fcs.webp",
      description: "The hell of reviving, where beings are repeatedly killed and revived by hellish guards.",
      userLabel: floorLabels[-1] || "???",
    },
    {
      id: "kalasutra",
      name: "Kalasutra",
      floor: -2,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kalasutra-5wddXuYdte7YsztzNA1unMS0HB9soO.webp",
      description: "The hell of black threads, where beings are marked with black lines and cut along these lines.",
      userLabel: floorLabels[-2] || "???",
    },
    {
      id: "samghata",
      name: "Samghata",
      floor: -3,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/samghata-iVNtHRCeDMVY1dMIpbYTtZxsxi1eix.webp",
      description: "The hell of crushing, where beings are repeatedly crushed between massive mountains.",
      userLabel: floorLabels[-3] || "???",
    },
    {
      id: "raurava",
      name: "Raurava",
      floor: -4,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/raurava-vB9FtmGGwk01dbh2vTmJBKCJnbaUfc.webp",
      description: "The hell of screaming, where beings wail in agony as they burn in an iron cauldron.",
      userLabel: floorLabels[-4] || "???",
    },
    {
      id: "maharaurava",
      name: "Maharaurava",
      floor: -5,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/maharaurava-ScCMruzUupCO6VYubvWaMecp36xAGU.webp",
      description: "The hell of great screaming, where beings are cooked in molten metal.",
      userLabel: floorLabels[-5] || "???",
    },
    {
      id: "tapana",
      name: "Tapana",
      floor: -6,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tapana-V4P1oGePE8JLCyNFILAkoenvSHeyJ1.webp",
      description: "The hell of heating, where beings are impaled on red-hot iron stakes.",
      userLabel: floorLabels[-6] || "???",
    },
    {
      id: "pratapana",
      name: "Pratapana",
      floor: -7,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pratapana-axNRuDoGpQblmqBLO6EfNycHn2Pmmz.webp",
      description: "The hell of great heating, where beings are thrown into a blazing iron cauldron.",
      userLabel: floorLabels[-7] || "???",
    },
    {
      id: "avici",
      name: "Avici",
      floor: -8,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/avici-ve4kJh6a29EjVPErs7MlHZGYVON4zh.webp",
      description: "The hell without interruption, the most terrible hot hell where suffering is unceasing.",
      userLabel: floorLabels[-8] || "???",
    },

    // Cold hells (8)
    {
      id: "arbuda",
      name: "Arbuda",
      floor: -9,
      image: "/images/arbuda.webp",
      description: "The hell of blisters, where intense cold causes painful blisters to form on the skin.",
      userLabel: floorLabels[-9] || "???",
    },
    {
      id: "nirarbuda",
      name: "Nirarbuda",
      floor: -10,
      image: "/images/nirarbuda.webp",
      description: "The hell of burst blisters, where the cold is so intense that blisters burst open.",
      userLabel: floorLabels[-10] || "???",
    },
    {
      id: "atata",
      name: "Atata",
      floor: -11,
      image: "/images/atata.webp",
      description: "The hell of shivering, where beings can only utter 'at-at-at' as their teeth chatter from cold.",
      userLabel: floorLabels[-11] || "???",
    },
    {
      id: "hahava",
      name: "Hahava",
      floor: -12,
      image: "/images/hahava.webp",
      description: "The hell of lamentation, where beings can only cry 'ha-ha-va' as they freeze.",
      userLabel: floorLabels[-12] || "???",
    },
    {
      id: "huhuva",
      name: "Huhuva",
      floor: -13,
      image: "/images/huhuva.webp",
      description: "The hell of chattering teeth, where beings can only utter 'hu-hu-va' as their bodies turn blue.",
      userLabel: floorLabels[-13] || "???",
    },
    {
      id: "utpala",
      name: "Utpala",
      floor: -14,
      image: "/images/utpala.webp",
      description: "The hell of blue lotuses, where the skin turns blue like the utpala flower from extreme cold.",
      userLabel: floorLabels[-14] || "???",
    },
    {
      id: "padma",
      name: "Padma",
      floor: -15,
      image: "/images/mahapadma.webp",
      description: "The hell of lotuses, where the skin cracks into patterns resembling lotus flowers.",
      userLabel: floorLabels[-15] || "???",
    },
    {
      id: "pundarika",
      name: "Pundarika",
      floor: -16,
      image: "/images/pundarika.webp",
      description: "The hell of great lotuses, the coldest hell where the skin splits into great lotus-like patterns.",
      userLabel: floorLabels[-16] || "???",
    },
  ]

  const startEditing = (floor: number) => {
    // Don't allow editing if the name is already correct
    if (isCorrectName(floor, floorLabels[floor])) return

    setEditingFloor(floor)
    setEditValue(floorLabels[floor] || "???")
  }

  const saveEdit = () => {
    if (editingFloor !== null) {
      // Validate input - only allow letters and numbers, max 16 characters
      const sanitizedValue = editValue.replace(/[^a-zA-Z0-9 ]/g, "").substring(0, 16)

      // Check if the input matches the correct name (case-insensitive)
      const correctName = correctNames[editingFloor]
      if (correctName && sanitizedValue.toLowerCase() === correctName.toLowerCase()) {
        // If correct, capitalize the first letter
        const capitalizedValue = sanitizedValue.charAt(0).toUpperCase() + sanitizedValue.slice(1).toLowerCase()
        onRenameFloor(editingFloor, capitalizedValue)
      } else {
        // Otherwise, just use the sanitized value
        onRenameFloor(editingFloor, sanitizedValue)
      }

      setEditingFloor(null)
    }
  }

  const cancelEdit = () => {
    setEditingFloor(null)
  }

  // Check if a floor name is correct
  const isCorrectName = (floor: number, name: string): boolean => {
    if (!name || name === "???") return false

    const correctName = correctNames[floor]
    if (!correctName) return false

    return name.toLowerCase() === correctName.toLowerCase()
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg border-2 border-red-900 max-w-md w-full max-h-[80vh] overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="bg-red-900/50 p-3 border-b border-red-800 flex justify-between items-center">
          <h3 className="text-red-200 font-pixel">Elevator Control Panel</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Elevator panel */}
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-2">
            {/* First column - floors -1 to -8 */}
            <div className="space-y-2">
              {hells
                .filter((hell) => hell.floor >= -8 && hell.floor <= -1)
                .map((hell) => (
                  <div
                    key={hell.id}
                    className={`flex items-center justify-between p-2 rounded border ${
                      currentFloor === hell.floor
                        ? "bg-red-900/30 border-red-700"
                        : "bg-gray-800/50 border-gray-700 hover:bg-gray-800"
                    } cursor-pointer`}
                    onClick={() => onFloorSelect(hell)}
                  >
                    <div className="flex-1">
                      {editingFloor === hell.floor ? (
                        <div className="flex items-center">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm w-full"
                            onClick={(e) => e.stopPropagation()}
                            maxLength={16}
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              saveEdit()
                            }}
                            className="ml-1 p-1 bg-green-800 rounded-full"
                          >
                            <Check className="w-3 h-3 text-green-200" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              cancelEdit()
                            }}
                            className="ml-1 p-1 bg-red-800 rounded-full"
                          >
                            <X className="w-3 h-3 text-red-200" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs font-pixel ${
                              isCorrectName(hell.floor, floorLabels[hell.floor]) ? "text-green-400" : "text-white"
                            }`}
                          >
                            {floorLabels[hell.floor] || "???"}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              startEditing(hell.floor)
                            }}
                            className={`p-1 hover:bg-gray-700 rounded-full ${
                              isCorrectName(hell.floor, floorLabels[hell.floor]) ? "hidden" : ""
                            }`}
                          >
                            <Edit2 className="w-3 h-3 text-gray-400" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>

            {/* Second column - floors -9 to -16 */}
            <div className="space-y-2">
              {hells
                .filter((hell) => hell.floor <= -9)
                .map((hell) => (
                  <div
                    key={hell.id}
                    className={`flex items-center justify-between p-2 rounded border ${
                      currentFloor === hell.floor
                        ? "bg-blue-900/30 border-blue-700"
                        : "bg-gray-800/50 border-gray-700 hover:bg-gray-800"
                    } cursor-pointer`}
                    onClick={() => onFloorSelect(hell)}
                  >
                    <div className="flex-1">
                      {editingFloor === hell.floor ? (
                        <div className="flex items-center">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm w-full"
                            onClick={(e) => e.stopPropagation()}
                            maxLength={16}
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              saveEdit()
                            }}
                            className="ml-1 p-1 bg-green-800 rounded-full"
                          >
                            <Check className="w-3 h-3 text-green-200" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              cancelEdit()
                            }}
                            className="ml-1 p-1 bg-red-800 rounded-full"
                          >
                            <X className="w-3 h-3 text-red-200" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs font-pixel ${
                              isCorrectName(hell.floor, floorLabels[hell.floor]) ? "text-green-400" : "text-white"
                            }`}
                          >
                            {floorLabels[hell.floor] || "???"}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              startEditing(hell.floor)
                            }}
                            className={`p-1 hover:bg-gray-700 rounded-full ${
                              isCorrectName(hell.floor, floorLabels[hell.floor]) ? "hidden" : ""
                            }`}
                          >
                            <Edit2 className="w-3 h-3 text-gray-400" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="bg-gray-900 p-3 border-t border-gray-800">
          <p className="text-xs text-gray-400 text-center">{/* Removed text as requested */}</p>
        </div>
      </div>
    </div>
  )
}
