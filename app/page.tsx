"use client"

import { useState } from "react"
import GameContainer from "@/components/game-container-web"
import StudioSplash from "@/components/studio-splash"

export default function Home() {
  const [showSplash, setShowSplash] = useState(
    typeof window !== "undefined" ? !window.location.search.includes("skip=1") : true,
  )

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-0 bg-black text-white">
      {showSplash ? <StudioSplash onComplete={() => setShowSplash(false)} /> : <GameContainer />}
    </main>
  )
}
