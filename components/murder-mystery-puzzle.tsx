"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { demonologyBook } from "@/data/books"
import { botanyBook } from "@/data/books"

// Import refactored components and hooks
import { useDialogueSystem } from "@/hooks/use-dialogue-system"
import { useBookSystem } from "@/hooks/use-book-system"
import {
  PoliceReportModal,
  PassportModal,
  VictimBodyModal,
  AutopsyReportModal,
} from "@/components/murder-mystery/evidence-modals"
import { BookModal } from "@/components/murder-mystery/book-modal"
import { DialogueInterface } from "@/components/murder-mystery/dialogue-interface"
import { LocationMap } from "@/components/murder-mystery/location-map"
import { LibraryView } from "@/components/murder-mystery/library-view"

// Import data
import { policewomanDialogue, morticianDialogue } from "@/components/murder-mystery/dialogue-data"
import { autopsyReportPages } from "@/components/murder-mystery/evidence-data"

// Define the dialogue tree structure more explicitly
interface DialogueOption {
  id: string
  text: string
  response: string
  followUp?: DialogueOption[]
  condition?: string
  action?: string
  specialAction?: () => void
}

interface Location {
  id: string
  name: string
}

interface MurderMysteryPuzzleProps {
  onSolve?: () => void
  onLocationChange?: (location: string) => void
  currentQuestion?: string
}

export default function MurderMysteryPuzzle({ onSolve, onLocationChange, currentQuestion }: MurderMysteryPuzzleProps) {
  // Group related state variables together with comments

  // Location State
  const [currentLocation, setCurrentLocation] = useState<string>("crime scene")
  const locations = [
    { id: "crime scene", name: "Crime Scene" },
    { id: "police station", name: "Police Station" },
    { id: "morgue", name: "Morgue" },
    { id: "library", name: "Library" },
  ]

  // Evidence State
  const [showPoliceReport, setShowPoliceReport] = useState(false)
  const [showPassport, setShowPassport] = useState(false)
  const [showVictimBody, setShowVictimBody] = useState(false)
  const [showAutopsyReport, setShowAutopsyReport] = useState(false)

  // Local State
  const [askedAboutFriends, setAskedAboutFriends] = useState(false)
  const [canSeeBody, setCanSeeBody] = useState(false)
  const [hasCheckedBody, setHasCheckedBody] = useState(false)
  const [askedHobbies, setAskedHobbies] = useState(false)
  const [askedPuzzleGames, setAskedPuzzleGames] = useState(false)

  // Initialize dialogue system
  const dialogue = useDialogueSystem({
    initialDialogue: currentLocation === "police station" ? policewomanDialogue : morticianDialogue,
  })

  // Initialize book system
  const bookSystem = useBookSystem()

  // ==================== MODAL HANDLERS ====================
  const closePassport = () => {
    setShowPassport(false)
    dialogue.setLastAction("viewed-passport")
    dialogue.setCurrentResponse("Seen enough? I've got work to do, you know.")
    dialogue.setTypedText("")
    dialogue.setIsTyping(true)
  }

  const closePoliceReport = () => {
    setShowPoliceReport(false)
    dialogue.setLastAction("viewed-report")
    dialogue.setCurrentResponse("Told you it wasn't anything special. Just a routine report.")
    dialogue.setTypedText("")
    dialogue.setIsTyping(true)
  }

  const closeVictimBody = () => {
    setShowVictimBody(false)
    setHasCheckedBody(true)
    dialogue.setLastAction("viewed-body")
    dialogue.setCurrentResponse("Seen enough? The body isn't going anywhere. Neither am I, unfortunately.")
    dialogue.setTypedText("")
    dialogue.setIsTyping(true)
  }

  const closeAutopsyReport = () => {
    setShowAutopsyReport(false)
    dialogue.setLastAction("viewed-autopsy")
    dialogue.setCurrentResponse("Satisfied? Now get out of here.")
    dialogue.setTypedText("")
    dialogue.setIsTyping(true)
  }

  // ==================== DIALOGUE HANDLERS ====================
  // Custom filter for policewoman dialogue options
  const filterPoliceOptions = (options: any[]) => {
    return options.filter((opt) => {
      if (opt.id === "police-report") {
        return showPoliceReportOption
      }
      if (opt.id === "were-there-any-witnesses") {
        return showWitnessesOption
      }
      if (opt.id === "can-see-report-again") {
        return showPoliceReportAgainOption
      }
      if (opt.id === "can-see-passport-again") {
        return showPassportAgainOption
      }
      return true
    })
  }

  // Custom filter for mortician dialogue options
  const filterMorticianOptions = (options: any[]) => {
    return options.filter((opt) => {
      if (opt.id === "like-job" || opt.id === "can-see-body-initial") {
        return !canSeeBody
      }
      if (opt.id === "check-victim-body") {
        return canSeeBody
      }
      if (opt.id === "after-viewing-evidence") {
        return (
          dialogue.lastAction === "viewed-body" ||
          dialogue.lastAction === "viewed-passport" ||
          dialogue.lastAction === "viewed-report" ||
          dialogue.lastAction === "viewed-autopsy"
        )
      }
      if (opt.id === "be-your-friend") {
        return askedAboutFriends
      }
      if (opt.id === "unconditional-friendship") {
        return askedHobbies && askedPuzzleGames
      }
      if ((opt.id === "hobbies" || opt.id === "puzzle-games") && askedHobbies && askedPuzzleGames) {
        return false
      }
      return true
    })
  }

  // Handle dialogue option selection with special actions
  const handleDialogueOption = (option: any) => {
    // Special actions based on option ID
    if (option.id === "any-friends") {
      setAskedAboutFriends(true)
    } else if (option.id === "hobbies") {
      setAskedHobbies(true)
    } else if (option.id === "puzzle-games") {
      setAskedPuzzleGames(true)
    } else if (option.id === "unconditional-friendship") {
      setCanSeeBody(true)
    } else if (option.id === "can-see-report" || option.id === "can-see-report-again") {
      setShowPoliceReport(true)
      dialogue.setLastAction("viewed-report")
    } else if (option.id === "can-see-passport" || option.id === "can-see-passport-again") {
      setShowPassport(true)
      dialogue.setLastAction("viewed-passport")
    } else if (option.id === "check-victim-body") {
      setShowVictimBody(true)
      dialogue.setLastAction("viewed-body")
    } else if (option.id === "check-autopsy-report") {
      setShowAutopsyReport(true)
      dialogue.setLastAction("viewed-autopsy")
    }

    // Use the dialogue system to handle the option
    if (dialogue.currentCharacter === "policewoman") {
      dialogue.handleDialogueOption(option, filterPoliceOptions)
    } else {
      dialogue.handleDialogueOption(option, filterMorticianOptions)
    }
  }

  // ==================== NAVIGATION HANDLERS ====================
  const navigateTo = (location: string) => {
    setCurrentLocation(location)
    dialogue.closeDialogue()

    if (onLocationChange) {
      onLocationChange(location)
    }
  }

  // Conditionally render dialogue options
  const showPoliceReportOption =
    dialogue.askedQuestions.has("what-natural-causes") && dialogue.askedQuestions.has("was-there-no-weapon")
  const showWitnessesOption = dialogue.askedQuestions.has("tell-about-murder")
  const showPoliceReportAgainOption = dialogue.askedQuestions.has("check-police-report")
  const showPassportAgainOption = dialogue.askedQuestions.has("check-passport")

  // Automatically start dialogue when entering the police station or morgue
  useEffect(() => {
    if (currentLocation === "police station" || currentLocation === "morgue") {
      dialogue.startDialogue(currentLocation === "police station" ? "policewoman" : "mortician")
    }
  }, [currentLocation])

  return (
    <div className="flex flex-col items-center space-y-4 relative pb-16">
      <h2 className="text-xl font-bold text-red-500">Murder Mystery</h2>

      {/* Location Content */}
      <Card className="w-full bg-black border-gray-700">
        <CardHeader className="bg-black text-purple-300">
          <CardTitle className="text-purple-300">{locations.find((loc) => loc.id === currentLocation)?.name}</CardTitle>
        </CardHeader>
        <CardContent className="bg-black p-0">
          {currentLocation === "crime scene" && (
            <div className="flex justify-center">
              <div className="w-full h-full relative pixelated-container bg-black p-0">
                <Image
                  src="/images/murder-mystery/crime-scene.webp"
                  alt="Crime Scene"
                  width={400}
                  height={400}
                  className="pixelated w-full h-full object-contain"
                />
              </div>
            </div>
          )}

          {/* Police and Mortician Dialogue */}
          {(currentLocation === "police station" || currentLocation === "morgue") && dialogue.showDialogue && (
            <DialogueInterface
              character={dialogue.currentCharacter}
              typedText={dialogue.typedText}
              dialogueOptions={dialogue.currentDialogueOptions}
              askedQuestions={dialogue.askedQuestions}
              dialoguePath={dialogue.dialoguePath}
              onSelectOption={handleDialogueOption}
              onGoBack={() => {
                if (dialogue.currentCharacter === "policewoman") {
                  dialogue.goBackInDialogue(filterPoliceOptions)
                } else {
                  dialogue.goBackInDialogue(filterMorticianOptions)
                }
              }}
            />
          )}

          {/* Library View */}
          {currentLocation === "library" && (
            <LibraryView onOpenBook={bookSystem.openBook} demonologyBook={demonologyBook} botanyBook={botanyBook} />
          )}
        </CardContent>
      </Card>

      {/* Evidence Modals */}
      <PoliceReportModal isOpen={showPoliceReport} onClose={closePoliceReport} />
      <PassportModal isOpen={showPassport} onClose={closePassport} />
      <VictimBodyModal isOpen={showVictimBody} onClose={closeVictimBody} />
      <AutopsyReportModal isOpen={showAutopsyReport} onClose={closeAutopsyReport} pages={autopsyReportPages} />

      {/* Book Modal */}
      <BookModal
        book={bookSystem.selectedBook}
        currentPage={bookSystem.currentPage}
        currentSection={bookSystem.currentSection}
        onClose={bookSystem.closeBook}
        onNextPage={bookSystem.nextPage}
        onPrevPage={bookSystem.prevPage}
        onSwitchSection={bookSystem.switchSection}
        getCurrentContent={bookSystem.getCurrentContent}
        getTotalPages={bookSystem.getTotalPages}
      />

      {/* Location Map */}
      <LocationMap locations={locations} currentLocation={currentLocation} onNavigate={navigateTo} />
    </div>
  )
}
