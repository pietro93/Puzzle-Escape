"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useCharacterDialogue, guardDialogLines } from "../utils/dialogue-utils"

interface CharacterDialoguePopupProps {
  character: string
  level: number
  onClose: () => void
  isVisible: boolean
}

const CharacterDialoguePopup: React.FC<CharacterDialoguePopupProps> = ({ character, level, onClose, isVisible }) => {
  const [dialogueText, setDialogueText] = useState<string>("")
  const getCharacterDialogue = useCharacterDialogue()

  useEffect(() => {
    if (isVisible) {
      // Special case for level 10 guard
      if (level === 10 && character === "skeleton") {
        const randomIndex = Math.floor(Math.random() * guardDialogLines.length)
        setDialogueText(guardDialogLines[randomIndex])
      } else {
        setDialogueText(getCharacterDialogue(character, level))
      }
    }
  }, [isVisible, character, level, getCharacterDialogue])

  if (!isVisible) return null

  // Get the character image path for all characters
  const getCharacterImagePath = () => {
    switch (character) {
      case "skeleton":
        return "/images/skeleton.webp"
      case "butler":
        return "/images/butler.webp"
      case "gypsy":
        return "/images/gypsy.webp"
      case "sphinx":
        return "/images/sphinx.webp"
      case "devil":
        return "/images/devil.webp"
      case "brain":
        return "/images/brainlamp.webp"
      default:
        return null
    }
  }

  const characterImage = getCharacterImagePath()

  return (
    <div className="dialogue-popup">
      <div className="dialogue-content">
        {characterImage && (
          <div className="character-portrait">
            <img src={characterImage || "/placeholder.svg"} alt={character} />
          </div>
        )}
        <div className="dialogue-text">{dialogueText}</div>
      </div>
      <button className="close-button" onClick={onClose}>
        Close
      </button>
    </div>
  )
}

export default CharacterDialoguePopup
