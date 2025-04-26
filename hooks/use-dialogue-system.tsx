"use client"

import { useState, useEffect, useCallback } from "react"
import type { DialogueOption } from "@/components/murder-mystery/types"

interface DialogueSystemProps {
  initialDialogue: DialogueOption[]
}

export function useDialogueSystem({ initialDialogue }: DialogueSystemProps) {
  const [showDialogue, setShowDialogue] = useState(false)
  const [currentCharacter, setCurrentCharacter] = useState<string | null>(null)
  const [dialogueTree, setDialogueTree] = useState<DialogueOption[]>(initialDialogue)
  const [dialoguePath, setDialoguePath] = useState<DialogueOption[]>([])
  const [currentDialogueOptions, setCurrentDialogueOptions] = useState<DialogueOption[]>([])
  const [currentResponse, setCurrentResponse] = useState("")
  const [typedText, setTypedText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [askedQuestions, setAskedQuestions] = useState<Set<string>>(new Set())
  const [lastAction, setLastAction] = useState<string | null>(null)

  // Add dialogue flags state to track conditions
  const [dialogueFlags, setDialogueFlags] = useState<Record<string, boolean>>({
    "asked-about-murder": false,
    "seen-police-report": false,
    "seen-passport": false,
    "body-not-accessible": true, // Default to true
    "can-see-body": false,
    "asked-about-friends": false,
    "asked-both-hobby-questions": false,
    "knows-about-anemia": false,
    "knows-about-body-marks": false,
    "after-viewing-evidence": false,
  })

  // Reset function to clear all dialogue state
  const resetDialogueState = useCallback(() => {
    setShowDialogue(false)
    setCurrentCharacter(null)
    setDialoguePath([])
    setCurrentDialogueOptions([])
    setCurrentResponse("")
    setTypedText("")
    setIsTyping(false)
    setAskedQuestions(new Set())
    setLastAction(null)

    // Reset all dialogue flags
    setDialogueFlags({
      "asked-about-murder": false,
      "seen-police-report": false,
      "seen-passport": false,
      "body-not-accessible": true, // Default to true
      "can-see-body": false,
      "asked-about-friends": false,
      "asked-both-hobby-questions": false,
      "knows-about-anemia": false,
      "knows-about-body-marks": false,
      "after-viewing-evidence": false,
    })
  }, [])

  // Type out the response character by character
  useEffect(() => {
    if (isTyping && currentResponse) {
      const timeout = setTimeout(() => {
        if (typedText.length < currentResponse.length) {
          setTypedText(currentResponse.substring(0, typedText.length + 1))
        } else {
          setIsTyping(false)
        }
      }, 20)
      return () => clearTimeout(timeout)
    }
  }, [isTyping, currentResponse, typedText])

  // Filter dialogue options based on conditions
  const filterDialogueOptions = useCallback(
    (options: DialogueOption[], customFilter?: (options: DialogueOption[]) => DialogueOption[]) => {
      // First apply custom filter if provided
      const filteredOptions = customFilter ? customFilter(options) : options

      // Then filter based on conditions
      return filteredOptions.filter((option) => {
        if (!option.condition) return true
        return dialogueFlags[option.condition] === true
      })
    },
    [dialogueFlags],
  )

  // Start a dialogue with a character
  const startDialogue = useCallback(
    (character: string) => {
      setCurrentCharacter(character)
      setShowDialogue(true)
      setDialoguePath([])

      // Set initial dialogue options based on character
      const options = filterDialogueOptions(dialogueTree[0].followUp)
      setCurrentDialogueOptions(options)
      setCurrentResponse(dialogueTree[0].response)
      setTypedText("")
      setIsTyping(true)
    },
    [dialogueTree, filterDialogueOptions],
  )

  // Close the dialogue
  const closeDialogue = useCallback(() => {
    setShowDialogue(false)
    setCurrentCharacter(null)
  }, [])

  // Handle selecting a dialogue option
  const handleDialogueOption = useCallback(
    (option: DialogueOption, customFilter?: (options: DialogueOption[]) => DialogueOption[]) => {
      // Mark this question as asked
      setAskedQuestions((prev) => new Set([...prev, option.id]))

      // Update dialogue path
      setDialoguePath((prev) => [...prev, option])

      // Set response and start typing animation
      setCurrentResponse(option.response)
      setTypedText("")
      setIsTyping(true)

      // Update available options
      const newOptions = filterDialogueOptions(option.followUp, customFilter)
      setCurrentDialogueOptions(newOptions)

      // Handle special actions if defined as strings
      if (typeof option.specialAction === "string") {
        switch (option.specialAction) {
          case "set-asked-about-murder":
            setDialogueFlags((prev) => ({ ...prev, "asked-about-murder": true }))
            break
          case "show-police-report":
            setDialogueFlags((prev) => ({ ...prev, "seen-police-report": true }))
            break
          case "show-passport":
            setDialogueFlags((prev) => ({ ...prev, "seen-passport": true }))
            break
          // Add other cases as needed
        }
      }
    },
    [filterDialogueOptions],
  )

  // Go back in the dialogue tree
  const goBackInDialogue = useCallback(
    (customFilter?: (options: DialogueOption[]) => DialogueOption[]) => {
      if (dialoguePath.length > 0) {
        // Remove the last option from the path
        const newPath = [...dialoguePath]
        newPath.pop()
        setDialoguePath(newPath)

        // If we're back at the root, show root options
        if (newPath.length === 0) {
          const rootOptions = filterDialogueOptions(dialogueTree[0].followUp, customFilter)
          setCurrentDialogueOptions(rootOptions)
          setCurrentResponse(dialogueTree[0].response)
        } else {
          // Otherwise, show options from the previous point in the path
          const previousOption = newPath[newPath.length - 1]
          const options = filterDialogueOptions(previousOption.followUp, customFilter)
          setCurrentDialogueOptions(options)
          setCurrentResponse(previousOption.response)
        }

        setTypedText("")
        setIsTyping(true)
      }
    },
    [dialoguePath, dialogueTree, filterDialogueOptions],
  )

  return {
    showDialogue,
    currentCharacter,
    dialoguePath,
    currentDialogueOptions,
    currentResponse,
    typedText,
    isTyping,
    askedQuestions,
    lastAction,
    dialogueFlags,
    startDialogue,
    closeDialogue,
    handleDialogueOption,
    goBackInDialogue,
    setLastAction,
    setCurrentResponse,
    setTypedText,
    setIsTyping,
    setDialogueFlags,
    resetDialogueState, // Export the reset function
  }
}
