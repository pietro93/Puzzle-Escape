"use client"

import { useState, useRef, useCallback } from "react"
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
  const startDialogue = useCallback((character: string, customDialogue?: DialogueOption[]) => {
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
  }, [])

  // Handle dialogue option selection
  const handleDialogueOption = useCallback(
    (option: DialogueOption, filterOptions?: (options: DialogueOption[]) => DialogueOption[]) => {
      // Mark this question as asked
      setAskedQuestions((prev) => new Set([...prev, option.id]))
      setLastAction(null)

      // Set the response and start typing animation
      setCurrentResponse(option.response)
      setTypedText("")
      setIsTyping(true)

      // Handle special actions
      if (option.specialAction) {
        option.specialAction()
      }

      // Update dialogue path for nested navigation
      if (option.followUp && option.followUp.length > 0) {
        setDialoguePath((prev) => [...prev, option])

        // Apply custom filtering if provided
        const filteredOptions = filterOptions ? filterOptions(option.followUp) : option.followUp

        setCurrentDialogueOptions(filteredOptions)
      } else {
        // If there are no follow-ups, update based on the current level
        if (dialoguePath.length === 0) {
          // At root level
          const rootOptions = initialDialogue[0].followUp || []
          setCurrentDialogueOptions(filterOptions ? filterOptions(rootOptions) : rootOptions)
        } else {
          // At a nested level
          const parentOption = dialoguePath[dialoguePath.length - 1]
          const nestedOptions = parentOption.followUp || []
          setCurrentDialogueOptions(filterOptions ? filterOptions(nestedOptions) : nestedOptions)
        }
      }
    },
    [],
  )

  // Go back in the dialogue tree
  const goBackInDialogue = useCallback(() => {
    if (dialoguePath.length > 0) {
      // Remove the last option from the path
      const newPath = [...dialoguePath]
      newPath.pop()
      setDialoguePath(newPath)

      if (newPath.length === 0) {
        // If we're back at the root, show the initial options
        const initialOption = initialDialogue[0]
        setCurrentResponse(initialOption.response)
        setCurrentDialogueOptions(initialOption.followUp || [])
      } else {
        // Otherwise, show the options for the last option in the path
        const lastOption = newPath[newPath.length - 1]
        setCurrentResponse(lastOption.response)
        setCurrentDialogueOptions(lastOption.followUp || [])
      }

      // Reset the typing effect
      setTypedText("")
      setIsTyping(true)
    }
  }, [dialoguePath, initialDialogue])

  // Close the dialogue
  const closeDialogue = useCallback(() => {
    setShowDialogue(false)
    setCurrentCharacter(null)
  }, [])

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
