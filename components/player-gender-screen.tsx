"use client"

import { Volume2, VolumeX } from "lucide-react"
import { setPlayerGender, type PlayerGender } from "@/utils/player-gender"

interface PlayerGenderScreenProps {
  onChoose: () => void
  soundEnabled: boolean
  toggleSound: () => void
}

const OPTIONS: { value: PlayerGender; label: string }[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
]

// Shown once per new game, before the intro. Only changes how characters
// address the player; never affects puzzles or answers.
export default function PlayerGenderScreen({ onChoose, soundEnabled, toggleSound }: PlayerGenderScreenProps) {
  const choose = (gender: PlayerGender) => {
    setPlayerGender(gender)
    onChoose()
  }

  return (
    <div className="w-full max-w-md mx-auto p-4 rounded-lg bg-black min-h-[100vh] flex flex-col relative overflow-hidden">
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={toggleSound}
          className="w-10 h-10 rounded-full bg-gray-800/80 flex items-center justify-center border border-gray-700"
        >
          {soundEnabled ? (
            <Volume2 className="w-5 h-5 text-purple-300" />
          ) : (
            <VolumeX className="w-5 h-5 text-gray-500" />
          )}
        </button>
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-center items-center gap-6">
        <h1 className="text-2xl font-pixel text-purple-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-center">
          Who are you?
        </h1>

        <div className="flex flex-col gap-3 w-full max-w-[220px]">
          {OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => choose(option.value)}
              className="px-4 py-3 bg-purple-900/80 hover:bg-purple-800 rounded-xl font-pixel transition-colors border-2 border-purple-700 text-purple-300 shadow-[0_4px_0_rgba(0,0,0,0.3)] active:shadow-none active:translate-y-1"
            >
              {option.label}
            </button>
          ))}
        </div>

        <p className="text-xs text-gray-500 font-pixel text-center">This only changes how characters address you.</p>
      </div>
    </div>
  )
}
