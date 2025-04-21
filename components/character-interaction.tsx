"use client"

import type React from "react"
import { useState } from "react"
import { MurderMysteryDialogue } from "./murder-mystery-dialogue"

interface CharacterInteractionProps {
  character: "policewoman" | "mortician"
  position: { top: string; left: string }
}

export const CharacterInteraction: React.FC<CharacterInteractionProps> = ({ character, position }) => {
  const [showDialogue, setShowDialogue] = useState(false)

  const characterImages = {
    policewoman: "/images/murder-mystery/policewoman.webp",
    mortician: "/images/murder-mystery/mortician.webp",
  }

  return (
    <>
      <div
        className="absolute cursor-pointer hover:brightness-110 transition-all duration-200"
        style={{ top: position.top, left: position.left }}
        onClick={() => setShowDialogue(true)}
      >
        <img
          src={characterImages[character] || "/placeholder.svg"}
          alt={character === "policewoman" ? "Police Officer" : "Mortician"}
          className="w-24 h-auto"
        />
      </div>

      {showDialogue && <MurderMysteryDialogue character={character} onClose={() => setShowDialogue(false)} />}
    </>
  )
}
