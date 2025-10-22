"use client"

import { useState, useEffect } from "react"
import GameContainer from "@/components/game-container-web"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading assets
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-0 bg-black text-white">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="w-16 h-16 border-t-4 border-purple-500 border-solid rounded-full animate-spin"></div>
          <p className="mt-4 font-pixel text-purple-400">Loading...</p>
        </div>
      ) : (
        <GameContainer />
      )}
    </main>
  )
}
