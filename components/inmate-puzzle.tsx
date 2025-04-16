"use client"

import { useState } from "react"
import Image from "next/image"

interface InmateStatement {
  text: string
}

interface Inmate {
  name: string
  image: string
  statements: InmateStatement[]
}

interface InmatePuzzleProps {
  inmates: Inmate[]
  guardStatement?: string
  level?: number
  onGuardClick?: () => void
}

export default function InmatePuzzle({
  inmates,
  guardStatement = "An inmate has been murdered, and one of these four inmates did it. Who is the killer?",
  level = 0,
  onGuardClick,
}: InmatePuzzleProps) {
  const [activeInmate, setActiveInmate] = useState<number | null>(null)
  const [dialogText, setDialogText] = useState<string>("")
  const [showGuardDialog, setShowGuardDialog] = useState(true)
  const [showGuardPopup, setShowGuardPopup] = useState(false)
  // Keep track of the last statement index shown for each inmate
  const [lastStatementIndices, setLastStatementIndices] = useState<number[]>(inmates.map(() => -1))

  const handleInmateClick = (index: number) => {
    // Get the next statement for this inmate in rotation
    const inmate = inmates[index]
    if (inmate && inmate.statements.length > 0) {
      // Get the next statement index in rotation
      const nextIndex = (lastStatementIndices[index] + 1) % inmate.statements.length
      const statement = inmate.statements[nextIndex].text

      // Update the last statement index for this inmate
      const newIndices = [...lastStatementIndices]
      newIndices[index] = nextIndex
      setLastStatementIndices(newIndices)

      setDialogText(statement)
    }

    // Set the active inmate and hide guard dialog
    setActiveInmate(index)
    setShowGuardDialog(false)
    setShowGuardPopup(false)
  }

  const handleCloseDialog = () => {
    setActiveInmate(null)
    setShowGuardPopup(false)
  }

  return (
    <div className="flex flex-col items-center relative">
      {/* Guard statement */}
      {showGuardDialog && guardStatement && (
        <div className="mb-6 w-full">
          <div className="bg-gray-900 p-3 rounded-lg border border-gray-800 text-sm text-white font-pixel animate-fadeIn shadow-lg mx-auto">
            <div className="flex items-start gap-3 mb-2">
              <div className="w-12 h-12 relative pixelated-container shrink-0">
                <Image src="/images/skeleton.webp" alt="Guard" width={48} height={48} className="pixelated" />
              </div>
              <div className="flex-1">
                <p className="text-purple-300 font-pixel mb-1">Guard:</p>
                <p className="text-gray-200 text-sm">"{guardStatement}"</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-6 w-full max-w-md mt-4">
        {/* Inmates - no guard here */}
        {inmates.map((inmate, index) => (
          <div
            key={index}
            className="flex flex-col items-center cursor-pointer transition-transform hover:scale-105 active:scale-95"
            onClick={() => handleInmateClick(index)}
          >
            <div className="w-32 h-32 relative pixelated-container mb-2 border-2 border-gray-800 hover:border-purple-600 transition-colors">
              <Image
                src={inmate.image || "/placeholder.svg"}
                alt={`Inmate ${inmate.name}`}
                width={128}
                height={128}
                className="pixelated"
              />
            </div>
            <p className="text-center font-pixel text-sm text-purple-300">{inmate.name}</p>
          </div>
        ))}
      </div>

      {/* Guard Dialog popup */}
      {showGuardPopup && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={handleCloseDialog}
        >
          <div
            className="bg-gray-900 p-4 rounded-lg border-2 border-gray-700 max-w-sm w-full animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="w-16 h-16 relative pixelated-container shrink-0">
                <Image src="/images/skeleton.webp" alt="Guard" width={64} height={64} className="pixelated" />
              </div>
              <div className="flex-1">
                <p className="text-purple-300 font-pixel mb-2">Guard:</p>
                <p className="text-gray-200 text-sm">"{guardStatement}"</p>
              </div>
            </div>
            <div className="mt-4 text-center">
              <button
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-xs text-gray-300 font-pixel"
                onClick={handleCloseDialog}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inmate Dialog popup */}
      {activeInmate !== null && dialogText && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={handleCloseDialog}
        >
          <div
            className="bg-gray-900 p-4 rounded-lg border-2 border-gray-700 max-w-sm w-full animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="w-16 h-16 relative pixelated-container shrink-0">
                <Image
                  src={inmates[activeInmate].image || "/placeholder.svg"}
                  alt={inmates[activeInmate].name}
                  width={64}
                  height={64}
                  className="pixelated"
                />
              </div>
              <div className="flex-1">
                <p className="text-purple-300 font-pixel mb-2">{inmates[activeInmate].name}:</p>
                <p className="text-gray-200 text-sm">"{dialogText}"</p>
              </div>
            </div>
            <div className="mt-4 text-center">
              <button
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-xs text-gray-300 font-pixel"
                onClick={handleCloseDialog}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="text-center text-xs text-gray-400 font-pixel mt-2 animate-pulse">
        Tap on an inmate to hear their statement
      </div>
    </div>
  )
}
