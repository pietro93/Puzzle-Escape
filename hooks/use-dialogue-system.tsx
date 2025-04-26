"use client"

import { useState, useRef, useEffect } from "react"
import type { DialogueOption } from "@/components/murder-mystery/types"

interface UseDialogueSystemProps {
  initialDialogue: DialogueOption[]
  typingSpeed?: number
}

export function useDialogueSystem({ initialDialogue, typingSpeed = 30 }: UseDialogueSystemProps) {
  // Dialogue State
  const [showDialogue, setShowDialogue] = useState(false)
  const [currentCharacter, setCurrentCharacter] = useState<string | null>(null)
  const [currentResponse, setCurrentResponse] = useState<string>("")
  const [currentDialogueOptions, setCurrentDialogueOptions] = useState<DialogueOption[]>([])
  const [askedQuestions, setAskedQuestions] = useState<Set<string>>(new Set())
  const [isTyping, setIsTyping] = useState(false)
  const [typedText, setTypedText] = useState("")
  const [dialoguePath, setDialoguePath] = useState<DialogueOption[]>([])
  const [lastAction, setLastAction] = useState<string | null>(null)

  const typingRef = useRef<NodeJS.Timeout | null>(null)

  // Start dialogue with a character
  const startDialogue = (character: string, customDialogue?: DialogueOption[]) => {
    setCurrentCharacter(character)
    setShowDialogue(true)
    setCurrentResponse("")
    setTypedText("")
    setDialoguePath([])
    setLastAction(null)

    // Set initial response based on character and dialogue
    const dialogue = customDialogue || initialDialogue
    if (dialogue && dialogue.length > 0) {
      setCurrentResponse(dialogue[0].response)
      setCurrentDialogueOptions(dialogue[0].followUp || [])
    }

    // Start typing animation
    setIsTyping(true)
  }

  // Add support for condition checking in the useDialogueSystem hook

  // Update the filterDialogueOptions function to check conditions
  const filterDialogueOptions = (
    options: DialogueOption[],
    customFilter?: (options: DialogueOption[]) => DialogueOption[],
  ) => {
    let filteredOptions = options.filter((option) => {
      // Check for conditions
      if (option.condition === "exhausted-murder-questions") {
        return (
          askedQuestions.has("what-natural-causes") &&
          askedQuestions.has("was-there-no-weapon") &&
          askedQuestions.has("crime-scene-items")
        )
      }

      if (option.condition === "asked-about-murder") {
        return askedQuestions.has("tell-about-murder")
      }

      if (option.condition === "seen-police-report") {
        return lastAction === "viewed-report"
      }

      if (option.condition === "seen-passport") {
        return lastAction === "viewed-passport"
      }

      // Add other conditions as needed

      return !option.condition // If no condition, show by default
    })

    // Apply custom filter if provided
    if (customFilter) {
      filteredOptions = customFilter(filteredOptions)
    }

    return filteredOptions
  }

  // Update the handleDialogueOption function to use the improved filtering
  const handleDialogueOption = (
    option: DialogueOption,
    customFilter?: (options: DialogueOption[]) => DialogueOption[],
  ) => {
    // Add the option to asked questions
    setAskedQuestions((prev) => new Set([...prev, option.id]))

    // Set the current response
    setCurrentResponse(option.response)
    setTypedText("")
    setIsTyping(true)

    // Update dialogue path
    setDialoguePath((prev) => [...prev, option])

    // Filter follow-up options based on conditions
    const filteredOptions = filterDialogueOptions(option.followUp, customFilter)
    setCurrentDialogueOptions(filteredOptions)
  }

  // Go back in dialogue tree
  const goBackInDialogue = (filterRootOptions?: (options: DialogueOption[]) => DialogueOption[]) => {
    if (dialoguePath.length === 0) {
      // If at root level, close dialogue
      setShowDialogue(false)
    } else {
      // Go back one level in the dialogue tree
      const newPath = [...dialoguePath]
      newPath.pop()
      setDialoguePath(newPath)
      setLastAction(null)

      if (newPath.length === 0) {
        // Back to root
        const rootOptions = initialDialogue[0].followUp || []
        setCurrentDialogueOptions(filterRootOptions ? filterRootOptions(rootOptions) : rootOptions)
        setCurrentResponse(initialDialogue[0].response)
      } else {
        // Back to previous level
        const parentOption = newPath[newPath.length - 1]
        setCurrentDialogueOptions(parentOption.followUp || [])
        setCurrentResponse(parentOption.response)
      }

      setTypedText("")
      setIsTyping(true)
    }
  }

  // Close dialogue
  const closeDialogue = () => {
    setShowDialogue(false)
    setCurrentCharacter(null)
  }

  // Text typing animation effect
  useEffect(() => {
    if (isTyping && currentResponse) {
      let currentIndex = 0

      const typeNextCharacter = () => {
        if (currentIndex < currentResponse.length) {
          setTypedText(currentResponse.substring(0, currentIndex + 1))
          currentIndex++
          typingRef.current = setTimeout(typeNextCharacter, typingSpeed)
        } else {
          setIsTyping(false)
        }
      }

      typingRef.current = setTimeout(typeNextCharacter, typingSpeed)

      return () => {
        if (typingRef.current) {
          clearTimeout(typingRef.current)
        }
      }
    }
  }, [isTyping, currentResponse, typingSpeed])

  return {
    showDialogue,
    currentCharacter,
    currentResponse,
    currentDialogueOptions,
    typedText,
    isTyping,
    askedQuestions,
    dialoguePath,
    lastAction,
    startDialogue,
    handleDialogueOption,
    goBackInDialogue,
    closeDialogue,
    setLastAction,
    setCurrentResponse,
    setTypedText,
    setIsTyping,
  }
}
