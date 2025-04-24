"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

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

// Import data
import { policewomanDialogue, morticianDialogue, librarianDialogue } from "@/components/murder-mystery/dialogue-data"
import { autopsyReportPages, locations } from "@/components/murder-mystery/evidence-data"

// Define the DialogueOption type
interface DialogueOption {
  id: string
  text: string
  response: string
  next?: string
}

interface MurderMysteryPuzzleProps {
  onSolve?: () => void
  onLocationChange?: (location: string) => void
  currentQuestion?: string
}

export default function MurderMysteryPuzzle({ onSolve, onLocationChange, currentQuestion }: MurderMysteryPuzzleProps) {
  // Location State
  const [currentLocation, setCurrentLocation] = useState<string>("crime scene")

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
  const [currentBodyPart, setCurrentBodyPart] = useState<string | null>(null)
  const [askedAboutAnemia, setAskedAboutAnemia] = useState(false)
  const [askedAboutMarks, setAskedAboutMarks] = useState(false)

  // Initialize dialogue system
  const dialogue = useDialogueSystem({
    initialDialogue:
      currentLocation === "police station"
        ? policewomanDialogue
        : currentLocation === "morgue"
          ? morticianDialogue
          : currentLocation === "library"
            ? librarianDialogue
            : [],
  })

  // Initialize book system
  const bookSystem = useBookSystem()

  // // // // // // MODALS  // // // // // // // // // // // // // // // // // // // // // //
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

  // Function to change which body part is being viewed
  const changeBodyPart = (part: string) => {
    setCurrentBodyPart(part)
  }

  // // // // // // DIALOGUE FUNCTIONS  // // // // // // // // // // // // // // // // // // // // // //
  // Custom filter for dialogue options
  const filterDialogueOptions = (options: any[]) => {
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
      if (opt.id === "blood-diseases") {
        return askedAboutAnemia
      }
      if (opt.id === "demons-evil") {
        return askedAboutMarks
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
    } else if (option.id === "check-victim-body") {
      setShowVictimBody(true)
      dialogue.setLastAction("viewed-body")
    } else if (option.id === "check-autopsy-report") {
      setShowAutopsyReport(true)
      dialogue.setLastAction("viewed-autopsy")
    } else if (option.id === "tell-about-body") {
      // Check if the mortician mentions anemia
      if (option.response.includes("anemia")) {
        setAskedAboutAnemia(true)
      }
    } else if (option.id === "weird-signs") {
      // Check if the mortician mentions marks
      if (option.response.includes("tattoos")) {
        setAskedAboutMarks(true)
      }
    }

    // Use the dialogue system to handle the option
    dialogue.handleDialogueOption(option, filterDialogueOptions)
  }

  // // // // // // NAVIGATION  // // // // // // // // // // // // // // // // // // // // // //
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
  const showCheckVictimBodyOption = canSeeBody

  // Function to start dialogue
  const startDialogue = useCallback(
    (character: string, customDialogue?: DialogueOption[]) => {
      dialogue.startDialogue(character, customDialogue)
    },
    [dialogue],
  )

  // Automatically start dialogue when entering a location
  useEffect(() => {
    if (currentLocation === "police station") {
      startDialogue("policewoman", policewomanDialogue)
    } else if (currentLocation === "morgue") {
      startDialogue("mortician", morticianDialogue)
    } else if (currentLocation === "library") {
      startDialogue("librarian", librarianDialogue)
    }
  }, [currentLocation, startDialogue])

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

          {/* Dialogue Interface */}
          {(currentLocation === "police station" || currentLocation === "morgue" || currentLocation === "library") &&
            dialogue.showDialogue && (
              <DialogueInterface
                character={dialogue.currentCharacter}
                typedText={dialogue.typedText}
                dialogueOptions={dialogue.currentDialogueOptions}
                askedQuestions={dialogue.askedQuestions}
                dialoguePath={dialogue.dialoguePath}
                onSelectOption={handleDialogueOption}
                onGoBack={dialogue.goBackInDialogue}
              />
            )}

          {/* Library View */}
          {/* {currentLocation === "library" && (
            <LibraryView onOpenBook={bookSystem.openBook} demonologyBook={demonologyBook} botanyBook={botanyBook} />
          )} */}
        </CardContent>
      </Card>

      {/* Evidence Modals */}
      <PoliceReportModal isOpen={showPoliceReport} onClose={closePoliceReport} />
      <PassportModal isOpen={showPassport} onClose={closePassport} />
      <VictimBodyModal isOpen={showVictimBody} onClose={closeVictimBody} changeBodyPart={changeBodyPart} />
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
