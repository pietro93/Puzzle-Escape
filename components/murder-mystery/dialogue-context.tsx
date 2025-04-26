"use client"

import type React from "react"
import { createContext, useContext, useState, type ReactNode } from "react"
import type { DialogueState, DialogueCondition, DialogueAction } from "./types"

// Define the context shape
interface DialogueContextType {
  state: DialogueState
  checkCondition: (condition?: DialogueCondition) => boolean
  executeAction: (action?: DialogueAction) => void
  resetState: () => void
}

// Create the context
const DialogueContext = createContext<DialogueContextType | undefined>(undefined)

// Initial dialogue state
const initialDialogueState: DialogueState = {
  askedAboutMurder: false,
  seenPoliceReport: false,
  seenPassport: false,
  exhaustedMurderQuestions: false,
  askedAboutFriends: false,
  canSeeBody: false,
  askedHobbies: false,
  askedPuzzleGames: false,
  knowsAboutAnemia: false,
  knowsAboutBodyMarks: false,
  viewedBody: false,
  viewedAutopsyReport: false,
}

// Provider component
export const DialogueProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<DialogueState>(initialDialogueState)

  // Function to check if a condition is met
  const checkCondition = (condition?: DialogueCondition): boolean => {
    if (!condition) return true

    switch (condition) {
      case "exhausted-murder-questions":
        return state.exhaustedMurderQuestions
      case "asked-about-murder":
        return state.askedAboutMurder
      case "seen-police-report":
        return state.seenPoliceReport
      case "seen-passport":
        return state.seenPassport
      case "body-not-accessible":
        return !state.canSeeBody
      case "can-see-body":
        return state.canSeeBody
      case "asked-about-friends":
        return state.askedAboutFriends
      case "asked-both-hobby-questions":
        return state.askedHobbies && state.askedPuzzleGames
      case "after-viewing-evidence":
        return state.viewedBody || state.viewedAutopsyReport || state.seenPoliceReport || state.seenPassport
      case "knows-about-anemia":
        return state.knowsAboutAnemia
      case "knows-about-body-marks":
        return state.knowsAboutBodyMarks
      default:
        return false
    }
  }

  // Function to execute a special action
  const executeAction = (action?: DialogueAction) => {
    if (!action) return

    switch (action) {
      case "show-police-report":
        setState((prev) => ({ ...prev, seenPoliceReport: true }))
        break
      case "show-passport":
        setState((prev) => ({ ...prev, seenPassport: true }))
        break
      case "show-victim-body":
        setState((prev) => ({ ...prev, viewedBody: true }))
        break
      case "show-autopsy-report":
        setState((prev) => ({ ...prev, viewedAutopsyReport: true }))
        break
      case "mark-asked-about-friends":
        setState((prev) => ({ ...prev, askedAboutFriends: true }))
        break
      case "mark-asked-hobbies":
        setState((prev) => ({ ...prev, askedHobbies: true }))
        break
      case "mark-asked-puzzle-games":
        setState((prev) => ({ ...prev, askedPuzzleGames: true }))
        break
      case "allow-body-access":
        setState((prev) => ({ ...prev, canSeeBody: true }))
        break
      case "mark-knows-about-anemia":
        setState((prev) => ({ ...prev, knowsAboutAnemia: true }))
        break
      case "mark-knows-about-body-marks":
        setState((prev) => ({ ...prev, knowsAboutBodyMarks: true }))
        break
      // Book actions would be handled separately
    }
  }

  // Function to reset the state
  const resetState = () => {
    setState(initialDialogueState)
  }

  return (
    <DialogueContext.Provider value={{ state, checkCondition, executeAction, resetState }}>
      {children}
    </DialogueContext.Provider>
  )
}

// Custom hook to use the dialogue context
export const useDialogueContext = () => {
  const context = useContext(DialogueContext)
  if (context === undefined) {
    throw new Error("useDialogueContext must be used within a DialogueProvider")
  }
  return context
}
