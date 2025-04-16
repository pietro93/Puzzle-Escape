"use client"

import { useState, useEffect } from "react"

interface DarkRoomPuzzleProps {
  onSolve: () => void
}

export default function DarkRoomPuzzle({ onSolve }: DarkRoomPuzzleProps) {
  const [message, setMessage] = useState("")

  useEffect(() => {
    // Simulate a delayed reveal of the message
    const timer = setTimeout(() => {
      setMessage("The walls are covered in ancient symbols...")
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="w-full">
      <div className="bg-black text-white p-4 rounded-lg">
        {message ? (
          <p className="text-gray-300 font-mono text-sm text-center">{message}</p>
        ) : (
          <p className="text-gray-500 font-mono text-sm text-center">It's pitch black. You can't see anything.</p>
        )}
      </div>
    </div>
  )
}
