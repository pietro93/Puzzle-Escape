"use client"

import { useState, useEffect } from "react"

interface DarkRoomPuzzleProps {
  onSolve: () => void
}

export default function DarkRoomPuzzle({ onSolve }: DarkRoomPuzzleProps) {
  const [message, setMessage] = useState("")
  const [showArabicText, setShowArabicText] = useState(false)

  useEffect(() => {
    // Simulate a delayed reveal of the message
    const timer = setTimeout(() => {
      setMessage("The walls are covered in ancient symbols...")
    }, 1000)

    // After another delay, show the Arabic text
    const arabicTimer = setTimeout(() => {
      setShowArabicText(true)
    }, 3000)

    return () => {
      clearTimeout(timer)
      clearTimeout(arabicTimer)
    }
  }, [])

  return (
    <div className="w-full">
      <div className="bg-black text-white p-4 rounded-lg">
        {message ? (
          <div className="text-center">
            <p className="text-gray-300 font-mono text-sm mb-4">{message}</p>
            {showArabicText && (
              <p className="text-amber-300 font-mono text-lg mt-4 direction-rtl" style={{ direction: "rtl" }}>
                قلب مكسور
              </p>
            )}
          </div>
        ) : (
          <p className="text-gray-500 font-mono text-sm text-center">It's pitch black. You can't see anything.</p>
        )}
      </div>
    </div>
  )
}
