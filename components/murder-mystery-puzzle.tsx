"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { demonologyBook } from "@/data/books/demonology"
import { botanyBook } from "@/data/books/botany"
import { puppiesBook } from "@/data/books/puppies"
import { genghisKhanBook } from "@/data/books/genghis-khan"
import { serialKillersBook } from "@/data/books/serial-killers"
import { bloodDiseasesBook } from "@/data/books/blood-diseases"
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
import { autopsyReportPages, locations } from "@/components/murder-mystery/evidence-data"
import { policewomanDialogue, morticianDialogue, librarianDialogue } from "@/components/murder-mystery/dialogue-data"

interface MurderMysteryPuzzleProps {
  onSolve?: () => void
  onLocationChange?: (location: string) => void
  currentQuestion?: string
  level?: number // Add level prop to detect level changes
}

export default function MurderMysteryPuzzle({
  onSolve,
  onLocationChange,
  currentQuestion,
  level,
}: MurderMysteryPuzzleProps) {
  // Location State
  const [currentLocation, setCurrentLocation] = useState<string>("crime scene")

  // Evidence State
  const [showPoliceReport, setShowPoliceReport] = useState(false)
  const [showPassport, setShowPassport] = useState(false)
  const [showVictimBody, setShowVictimBody] = useState(false)
  const [showAutopsyReport, setShowAutopsyReport] = useState(false)
  const [currentEvidence, setCurrentEvidence] = useState<string>("")

  // Track if the demonology book has been opened
  const [demonologyBookOpened, setDemonologyBookOpened] = useState(false)

  // Track previous level to detect level changes
  const prevLevelRef = useRef<number | undefined>(level)

  // Initialize dialogue system with the appropriate dialogue tree
  const dialogue = useDialogueSystem({
    initialDialogue:
      currentLocation === "police station"
        ? policewomanDialogue
        : currentLocation === "morgue"
          ? morticianDialogue
          : librarianDialogue,
  })

  // Initialize book system
  const bookSystem = useBookSystem()

  // Reset dialogue state when level changes or component mounts
  useEffect(() => {
    dialogue.resetDialogueState()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Run once on mount

  // Reset dialogue state when level changes
  useEffect(() => {
    if (level !== prevLevelRef.current) {
      dialogue.resetDialogueState()
      prevLevelRef.current = level
    }
  }, [level, dialogue])

  // Function to handle "restart level" command
  const handleRestartLevel = () => {
    dialogue.resetDialogueState()
    setCurrentLocation("crime scene")
    setShowPoliceReport(false)
    setShowPassport(false)
    setShowVictimBody(false)
    setShowAutopsyReport(false)
    setCurrentEvidence("")
    setDemonologyBookOpened(false)
    bookSystem.closeBook()
  }

  // // // // // // MODALS  // // // // // // // // // // // // // // // // // // // // // //
  const showEvidenceModal = (evidenceType: string) => {
    setCurrentEvidence(evidenceType)
    switch (evidenceType) {
      case "police-report":
        setShowPoliceReport(true)
        break
      case "passport":
        setShowPassport(true)
        break
      case "victim-body":
        setShowVictimBody(true)
        break
      case "autopsy-report":
        setShowAutopsyReport(true)
        break
    }
  }

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
    dialogue.setDialogueFlags((prev) => ({ ...prev, "after-viewing-evidence": true }))
    dialogue.setLastAction("viewed-body")
    dialogue.setCurrentResponse("Seen enough? The body isn't going anywhere. Neither am I, unfortunately.")
    dialogue.setTypedText("")
    dialogue.setIsTyping(true)
  }

  const closeAutopsyReport = () => {
    setShowAutopsyReport(false)
    dialogue.setDialogueFlags((prev) => ({ ...prev, "after-viewing-evidence": true }))
    dialogue.setLastAction("viewed-autopsy")
    dialogue.setCurrentResponse("Satisfied? Now get out of here.")
    dialogue.setTypedText("")
    dialogue.setIsTyping(true)
  }

  // // // // // // DIALOGUE FUNCTIONS  // // // // // // // // // // // // // // // // // // // // // //
  // Custom filter for policewoman dialogue options
  const filterPoliceOptions = (options: any[]) => {
    return options.filter((opt) => {
      if (opt.id === "police-report") {
        // Show police report option only if all required questions have been asked
        return (
          dialogue.askedQuestions.has("what-natural-causes") &&
          dialogue.askedQuestions.has("was-there-no-weapon") &&
          dialogue.askedQuestions.has("crime-scene-items")
        )
      }
      if (opt.id === "were-there-any-witnesses") {
        return dialogue.dialogueFlags["asked-about-murder"]
      }
      if (opt.id === "can-see-report-again") {
        return dialogue.dialogueFlags["seen-police-report"]
      }
      if (opt.id === "can-see-passport-again") {
        return dialogue.dialogueFlags["seen-passport"]
      }
      return true
    })
  }

  // Custom filter for mortician dialogue options
  const filterMorticianOptions = (options: any[]) => {
    return options.filter((opt) => {
      if (opt.id === "like-job" || opt.id === "can-see-body-initial") {
        return dialogue.dialogueFlags["body-not-accessible"]
      }
      if (opt.id === "check-victim-body") {
        return dialogue.dialogueFlags["can-see-body"]
      }
      if (opt.id === "after-viewing-evidence") {
        return dialogue.dialogueFlags["after-viewing-evidence"]
      }
      if (opt.id === "be-your-friend") {
        return dialogue.dialogueFlags["asked-about-friends"]
      }
      if (opt.id === "unconditional-friendship") {
        return dialogue.dialogueFlags["asked-both-hobby-questions"]
      }
      return true
    })
  }

  // Custom filter for librarian dialogue options
  const filterLibrarianOptions = (options: any[]) => {
    return options.filter((opt) => {
      if (opt.id === "book-about-blood-diseases") {
        return dialogue.dialogueFlags["knows-about-anemia"]
      }
      if (opt.id === "book-about-demons") {
        return dialogue.dialogueFlags["knows-about-body-marks"]
      }
      return true
    })
  }

  // Handle dialogue option selection with special actions
  const handleDialogueOption = (option: any) => {
    // Special actions based on option ID
    if (option.id === "any-friends") {
      dialogue.setDialogueFlags((prev) => ({ ...prev, "asked-about-friends": true }))
    } else if (option.id === "hobbies") {
      dialogue.setDialogueFlags((prev) => ({ ...prev, "asked-hobbies": true }))
      if (dialogue.dialogueFlags["asked-puzzle-games"]) {
        dialogue.setDialogueFlags((prev) => ({ ...prev, "asked-both-hobby-questions": true }))
      }
    } else if (option.id === "puzzle-games") {
      dialogue.setDialogueFlags((prev) => ({ ...prev, "asked-puzzle-games": true }))
      if (dialogue.dialogueFlags["asked-hobbies"]) {
        dialogue.setDialogueFlags((prev) => ({ ...prev, "asked-both-hobby-questions": true }))
      }
    } else if (option.id === "unconditional-friendship") {
      dialogue.setDialogueFlags((prev) => ({
        ...prev,
        "can-see-body": true,
        "body-not-accessible": false,
      }))
    } else if (option.id === "check-victim-body") {
      showEvidenceModal("victim-body")
    } else if (option.id === "check-autopsy-report") {
      showEvidenceModal("autopsy-report")
    } else if (option.id === "anemia-question") {
      dialogue.setDialogueFlags((prev) => ({ ...prev, "knows-about-anemia": true }))
    } else if (option.id === "weird-signs") {
      dialogue.setDialogueFlags((prev) => ({ ...prev, "knows-about-body-marks": true }))
    } else if (
      option.id === "read-favorite-book" ||
      option.id === "read-puppies-book" ||
      option.id === "read-serial-killers-book" ||
      option.id === "read-botany-book" ||
      option.id === "read-blood-diseases-book" ||
      option.id === "read-demons-book"
    ) {
      // Handle book reading
      const bookId = option.id.replace("read-", "").replace("-book", "")
      handleOpenBook(bookId)
    }

    // Use the dialogue system to handle the option
    if (dialogue.currentCharacter === "policewoman") {
      dialogue.handleDialogueOption(option, filterPoliceOptions)
    } else if (dialogue.currentCharacter === "mortician") {
      dialogue.handleDialogueOption(option, filterMorticianOptions)
    } else {
      dialogue.handleDialogueOption(option, filterLibrarianOptions)
    }
  }

  // Handle opening books
  const handleOpenBook = (bookId: string) => {
    let book = null
    if (bookId === "favorite") {
      book = genghisKhanBook
    } else if (bookId === "puppies") {
      book = puppiesBook
    } else if (bookId === "serial-killers") {
      book = serialKillersBook
    } else if (bookId === "botany") {
      book = botanyBook
    } else if (bookId === "blood-diseases") {
      book = bloodDiseasesBook
    } else if (bookId === "demons") {
      book = demonologyBook
    }

    if (book) {
      // Check if it's the demonology book and it hasn't been opened before
      if (book.title === "Demonology" && !demonologyBookOpened) {
        // Trigger the devil dialogue
        dialogue.startDialogue("devil")
        // Mark the demonology book as opened
        setDemonologyBookOpened(true)
      }
      bookSystem.openBook(book)
    }
  }

  // // // // // // NAVIGATION  // // // // // // // // // // // // // // // // // // // // // //
  const navigateTo = (location: string) => {
    setCurrentLocation(location)
    dialogue.closeDialogue()

    if (onLocationChange) {
      onLocationChange(location)
    }
  }

  // Automatically start dialogue when entering the police station, morgue, or library
  useEffect(() => {
    if (currentLocation === "police station") {
      dialogue.startDialogue("policewoman")
    } else if (currentLocation === "morgue") {
      dialogue.startDialogue("mortician")
    } else if (currentLocation === "library") {
      dialogue.startDialogue("librarian")
    }
  }, [currentLocation, dialogue])

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

          {/* Police, Mortician, and Librarian Dialogue */}
          {(currentLocation === "police station" || currentLocation === "morgue" || currentLocation === "library") &&
            dialogue.showDialogue && (
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
                  } else if (dialogue.currentCharacter === "mortician") {
                    dialogue.goBackInDialogue(filterMorticianOptions)
                  } else {
                    dialogue.goBackInDialogue(filterLibrarianOptions)
                  }
                }}
                setDialogueFlags={dialogue.setDialogueFlags}
                showEvidenceModal={showEvidenceModal}
                setCurrentEvidence={setCurrentEvidence}
                setShowEvidenceModal={(show) => {
                  if (!show) {
                    setShowPoliceReport(false)
                    setShowPassport(false)
                    setShowVictimBody(false)
                    setShowAutopsyReport(false)
                  }
                }}
              />
            )}

          {/* Library View with Librarian */}
          {currentLocation === "library" && !dialogue.showDialogue && (
            <div className="flex flex-col items-center justify-center p-4">
              <div className="w-full max-w-md h-64 relative pixelated-container bg-black mb-4">
                <Image
                  src="/images/murder-mystery/librarian.webp"
                  alt="Librarian"
                  width={400}
                  height={300}
                  className="pixelated w-full h-full object-contain"
                />
              </div>
              <button
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                onClick={() => dialogue.startDialogue("librarian")}
              >
                Talk to Librarian
              </button>
            </div>
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
