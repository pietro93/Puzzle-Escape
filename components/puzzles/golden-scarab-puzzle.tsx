"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

type Pedestal = {
  id: string
  name: string
  description: string
  imageUrl: string
  position: { x: number; y: number }
}

const pedestals: Pedestal[] = [
  {
    id: "mali",
    name: "Mali",
    description:
      "The golden kingdom of Mali, where wealth flows like the Niger River. A land of ancient wisdom and prosperity, where traders exchange gold dust for salt and knowledge. The markets bustle with merchants from distant lands, and the libraries of Timbuktu hold the secrets of the stars.",
    imageUrl: "/images/golden-scarab/mansa-musa-mali-pedistal.webp",
    position: { x: 50, y: 20 },
  },
  {
    id: "egypt",
    name: "Egypt",
    description:
      "The eternal land of the pharaohs, where the Nile brings life to the desert. Pyramids reach toward the heavens, and ancient temples honor gods older than memory. Scholars and pilgrims alike seek wisdom in this cradle of civilization, where history is written in stone and sand.",
    imageUrl: "/images/golden-scarab/mansa-musa-egypt-pedistal.webp",
    position: { x: 75, y: 40 },
  },
  {
    id: "songhai",
    name: "Songhai",
    description:
      "The mighty Songhai Empire, where warriors and scholars rule together. The crossroads of trade routes spanning across Africa, where caravans laden with treasures meet. The people are known for their craftsmanship in metal and cloth, creating works that rival any in the known world.",
    imageUrl: "/images/golden-scarab/mansa-musa-songhai-pedistal.webp",
    position: { x: 25, y: 40 },
  },
  {
    id: "sahara",
    name: "Sahara",
    description:
      "The great desert, a sea of sand where only the bravest dare to journey. Caravans follow ancient paths marked by stars and bones, carrying treasures between worlds. The desert holds secrets in its shifting dunes, and those who respect its power may find oases of unimaginable beauty.",
    imageUrl: "/images/golden-scarab/mansa-musa-sahara-pedistal.webp",
    position: { x: 50, y: 60 },
  },
  {
    id: "hejaz",
    name: "Hejaz",
    description:
      "The sacred land of Hejaz, where pilgrims from across the world converge. Holy cities shimmer in the desert heat, their minarets reaching toward heaven. Markets overflow with spices, incense, and pilgrims seeking blessings. The birthplace of prophecies and the destination of the faithful.",
    imageUrl: "/images/golden-scarab/mansa-musa-hejaz-pedistal.webp",
    position: { x: 80, y: 70 },
  },
]

const correctPath = ["start", "mali", "sahara", "egypt", "hejaz", "songhai", "mali", "end"]

export function GoldenScarabPuzzle({
  onSolve,
}: {
  onSolve: (solution: string) => void
}) {
  const [path, setPath] = useState<string[]>(["start"])
  const [scarabPosition, setScarabPosition] = useState<"center" | string>("center")
  const [selectedPedestal, setSelectedPedestal] = useState<Pedestal | null>(null)
  const [lines, setLines] = useState<{ from: { x: number; y: number }; to: { x: number; y: number } }[]>([])
  const [isSolved, setIsSolved] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const centerPosition = { x: 50, y: 50 }

  const handleScarabClick = () => {
    if (scarabPosition === "center") {
      // Scarab is already at center, nothing to do
      return
    }

    // Reset the journey
    setPath(["start"])
    setScarabPosition("center")
    setLines([])
  }

  const handlePedestalClick = (pedestal: Pedestal) => {
    if (isSolved) return

    setSelectedPedestal(pedestal)
  }

  const handlePedestalSelect = (pedestal: Pedestal) => {
    if (isSolved) return

    // Add to path
    const newPath = [...path, pedestal.id]
    setPath(newPath)

    // Calculate line
    const fromPosition =
      scarabPosition === "center"
        ? centerPosition
        : pedestals.find((p) => p.id === scarabPosition)?.position || centerPosition

    const newLine = {
      from: fromPosition,
      to: pedestal.position,
    }

    setLines([...lines, newLine])
    setScarabPosition(pedestal.id)

    // Check if path is complete and correct
    if (newPath.length === correctPath.length) {
      const isCorrect = newPath.every((step, index) => step === correctPath[index])

      if (isCorrect) {
        setIsSolved(true)
        setTimeout(() => {
          onSolve("sublime splendor")
        }, 2000)
      } else {
        // Wrong path
        setTimeout(() => {
          // Reset after a delay
          setPath(["start"])
          setScarabPosition("center")
          setLines([])
        }, 1500)
      }
    }
  }

  const closePedestalDialog = () => {
    setSelectedPedestal(null)
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-amber-50 p-4 rounded-lg">
      <div className="mb-6 text-center max-w-2xl">
        <h2 className="text-xl font-bold mb-2">The Golden Scarab's Journey</h2>
        <p className="text-sm">
          The Sphinx speaks in riddles: "Guide the golden scarab through the path of the richest pilgrim who changed the
          history of West Africa. The journey must visit all lands and return to where it began."
        </p>
        <Button variant="outline" className="mt-2" onClick={() => setShowHint(!showHint)}>
          {showHint ? "Hide Hint" : "Show Hint"}
        </Button>
        {showHint && (
          <div className="mt-2 p-2 bg-amber-100 rounded-md text-sm">
            <p>
              The scarab must follow the historical pilgrimage route. Click on the scarab first, then on the pedestals
              in the correct order. The journey must visit all locations and return to Mali.
            </p>
          </div>
        )}
      </div>

      <div
        ref={containerRef}
        className="relative w-full max-w-3xl aspect-square border-2 border-amber-800 rounded-lg bg-amber-100 overflow-hidden"
      >
        {/* SVG for lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          {lines.map((line, index) => (
            <line
              key={index}
              x1={`${line.from.x}%`}
              y1={`${line.from.y}%`}
              x2={`${line.to.x}%`}
              y2={`${line.to.y}%`}
              stroke="goldenrod"
              strokeWidth="3"
              strokeDasharray="5,5"
            />
          ))}
        </svg>

        {/* Center scarab position */}
        <div
          className={`absolute z-20 cursor-pointer transition-all duration-300 transform ${scarabPosition === "center" ? "opacity-100" : "opacity-50"}`}
          style={{
            left: `calc(${centerPosition.x}% - 2rem)`,
            top: `calc(${centerPosition.y}% - 2rem)`,
          }}
          onClick={handleScarabClick}
        >
          {scarabPosition === "center" && (
            <Image
              src="/images/golden-scarab/golden_scarab.webp"
              alt="Golden Scarab"
              width={64}
              height={64}
              className="transition-transform hover:scale-110"
            />
          )}
          {scarabPosition !== "center" && (
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-amber-600 flex items-center justify-center">
              <span className="text-xs text-amber-800">Return</span>
            </div>
          )}
        </div>

        {/* Pedestals */}
        {pedestals.map((pedestal) => (
          <div
            key={pedestal.id}
            className="absolute z-20 cursor-pointer transition-all duration-300"
            style={{
              left: `calc(${pedestal.position.x}% - 2rem)`,
              top: `calc(${pedestal.position.y}% - 2rem)`,
            }}
            onClick={() => handlePedestalClick(pedestal)}
          >
            <div className="relative">
              <Image
                src={pedestal.imageUrl || "/placeholder.svg"}
                alt={pedestal.name}
                width={64}
                height={64}
                className="transition-transform hover:scale-110"
              />
              <div className="absolute -bottom-6 left-0 right-0 text-center">
                <span className="text-xs font-semibold bg-amber-800 text-white px-2 py-0.5 rounded-full">
                  {pedestal.name}
                </span>
              </div>

              {/* Show scarab on this pedestal if it's the current position */}
              {scarabPosition === pedestal.id && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <Image src="/images/golden-scarab/golden_scarab.webp" alt="Golden Scarab" width={40} height={40} />
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Solution overlay */}
        {isSolved && (
          <div className="absolute inset-0 bg-amber-900/80 flex items-center justify-center z-30 animate-fade-in">
            <div className="text-center p-6 bg-amber-100 rounded-lg shadow-xl">
              <h3 className="text-2xl font-bold text-amber-800 mb-2">Journey Complete!</h3>
              <p className="text-lg font-semibold">SUBLIME SPLENDOR</p>
            </div>
          </div>
        )}
      </div>

      {/* Pedestal Dialog */}
      <Dialog open={!!selectedPedestal} onOpenChange={() => closePedestalDialog()}>
        <DialogContent className="sm:max-w-md">
          {selectedPedestal && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedPedestal.name}</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center gap-4">
                <Image
                  src={selectedPedestal.imageUrl || "/placeholder.svg"}
                  alt={selectedPedestal.name}
                  width={200}
                  height={200}
                  className="rounded-md"
                />
                <DialogDescription>{selectedPedestal.description}</DialogDescription>
                <div className="flex justify-between w-full">
                  <Button variant="outline" onClick={closePedestalDialog}>
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      handlePedestalSelect(selectedPedestal)
                      closePedestalDialog()
                    }}
                  >
                    Travel Here
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
