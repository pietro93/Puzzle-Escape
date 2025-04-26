"use client"

import { useState, useRef, useEffect } from "react"
import type { DialogueOption, DialogueAction } from "@/components/murder-mystery/types"
import { useDialogueContext } from "@/components/murder-mystery/dialogue-context"

interface UseDialogueSystemProps {
  initialDialogue: DialogueOption[]
  typingSpeed?: number
  onSpecialAction?: (action: DialogueAction) => void
}

export function useDialogueSystem({ initialDialogue, typingSpeed = 30, onSpecialAction }: UseDialogueSystemProps) {
  // Get dialogue context
  const dialogueContext = useDialogueContext()

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

      // Filter initial options based on conditions
      const filteredOptions = filterDialogueOptions(dialogue[0].followUp || [])
      setCurrentDialogueOptions(filteredOptions)
    }

    // Start typing animation
    setIsTyping(true)
  }

  // Filter dialogue options based on conditions
  const filterDialogueOptions = (options: DialogueOption[]): DialogueOption[] => {
    return options.filter((option) => dialogueContext.checkCondition(option.condition))
  }

  // Handle dialogue option selection
  const handleDialogueOption = (option: DialogueOption) => {
    // Mark this question as asked
    setAskedQuestions((prev) => new Set([...prev, option.id]))

    // Check for special actions
    if (option.specialAction) {
      dialogueContext.executeAction(option.specialAction)
      if (onSpecialAction) {
        onSpecialAction(option.specialAction)
      }
    }

    // Update dialogue state based on option ID
    if (option.id === "tell-about-murder") {
      dialogueContext.executeAction("mark-asked-about-murder")
    } else if (option.id === "anemia-question") {
      dialogueContext.executeAction("mark-knows-about-anemia")
    }

    // Check if all murder questions have been asked
    if (
      askedQuestions.has("what-natural-causes") &&
      askedQuestions.has("was-there-no-weapon") &&
      askedQuestions.has("crime-scene-items")
    ) {
      dialogueContext.executeAction("mark-exhausted-murder-questions")
    }

    // Set the response and start typing animation
    setCurrentResponse(option.response)
    setTypedText("")
    setIsTyping(true)

    // Update dialogue path for nested navigation
    if (option.followUp && option.followUp.length > 0) {
      setDialoguePath((prev) => [...prev, option])

      // Filter follow-up options based on conditions
      const filteredOptions = filterDialogueOptions(option.followUp)
      setCurrentDialogueOptions(filteredOptions)
    } else {
      // If there are no follow-ups, update based on the current level
      if (dialoguePath.length === 0) {
        // At root level
        const rootOptions = initialDialogue[0].followUp || []
        setCurrentDialogueOptions(filterDialogueOptions(rootOptions))
      } else {
        // At a nested level
        const parentOption = dialoguePath[dialoguePath.length - 1]
        const nestedOptions = parentOption.followUp || []
        setCurrentDialogueOptions(filterDialogueOptions(nestedOptions))
      }
    }
  }

  // Go back in dialogue tree
  const goBackInDialogue = () => {
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
        setCurrentDialogueOptions(filterDialogueOptions(rootOptions))
        setCurrentResponse(initialDialogue[0].response)
      } else {
        // Back to previous level
        const parentOption = newPath[newPath.length - 1]
        setCurrentDialogueOptions(filterDialogueOptions(parentOption.followUp || []))
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
