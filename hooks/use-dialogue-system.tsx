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
  const [dialogueTree, setDialogueTree] = useState<DialogueOption[]>(initialDialogue)

  const typingRef = useRef<NodeJS.Timeout | null>(null)

  // Start dialogue with a character
  const startDialogue = (
    character: string,
    customDialogue?: DialogueOption[],
    filterOptions?: (options: DialogueOption[]) => DialogueOption[],
  ) => {
    setCurrentCharacter(character)
    setShowDialogue(true)
    setCurrentResponse("")
    setTypedText("")
    setDialoguePath([])
    setLastAction(null)

    // Set the dialogue tree if custom dialogue is provided
    const dialogue = customDialogue || initialDialogue
    setDialogueTree(dialogue)

    // Set initial response based on character and dialogue
    if (dialogue && dialogue.length > 0) {
      setCurrentResponse(dialogue[0].response)

      // Apply filter to initial options if provided
      const initialOptions = dialogue[0].followUp || []
      setCurrentDialogueOptions(filterOptions ? filterOptions(initialOptions) : initialOptions)
    }

    // Start typing animation
    setIsTyping(true)
  }

  // Handle dialogue option selection
  const handleDialogueOption = (
    option: DialogueOption,
    filterOptions?: (options: DialogueOption[]) => DialogueOption[],
  ) => {
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
        const rootOptions = dialogueTree[0].followUp || []
        setCurrentDialogueOptions(filterOptions ? filterOptions(rootOptions) : rootOptions)
      } else {
        // At a nested level
        const parentOption = dialoguePath[dialoguePath.length - 1]
        const nestedOptions = parentOption.followUp || []
        setCurrentDialogueOptions(filterOptions ? filterOptions(nestedOptions) : nestedOptions)
      }
    }
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
        const rootOptions = dialogueTree[0].followUp || []
        setCurrentDialogueOptions(filterRootOptions ? filterRootOptions(rootOptions) : rootOptions)
        setCurrentResponse(dialogueTree[0].response)
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
