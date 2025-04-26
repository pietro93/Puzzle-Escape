"use client"

import { useState, useEffect } from "react"
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
import { DialogueProvider, useDialogueContext } from "@/components/murder-mystery/dialogue-context"
import {
  PoliceReportModal,
  PassportModal,
  VictimBodyModal,
  AutopsyReportModal,
} from "@/components/murder-mystery/evidence-modals"
import { BookModal } from "@/components/murder-mystery/book-modal"
import { DialogueInterface } from "@/components/murder-mystery/dialogue-interface"
import { LocationMap } from "@/components/murder-mystery/location-map"
import type { DialogueAction } from "@/components/murder-mystery/types"

// Import data
import { autopsyReportPages, locations } from "@/components/murder-mystery/evidence-data"
import { policewomanDialogue, morticianDialogue, librarianDialogue } from "@/components/murder-mystery/dialogue-data"

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

  // Track if the demonology book has been opened
  const [demonologyBookOpened, setDemonologyBookOpened] = useState(false)

  // Initialize book system
  const bookSystem = useBookSystem()

  // Get dialogue context
  const dialogueContext = useDialogueContext()

  // Initialize dialogue system with special action handler
  const dialogue = useDialogueSystem({
    initialDialogue:
      currentLocation === "police station"
        ? policewomanDialogue
        : currentLocation === "morgue"
          ? morticianDialogue
          : librarianDialogue,
    onSpecialAction: handleSpecialAction,
  })

  // Handle special actions from dialogue
  function handleSpecialAction(action: DialogueAction) {
    switch (action) {
      case "show-police-report":
        setShowPoliceReport(true)
        break
      case "show-passport":
        setShowPassport(true)
        break
      case "show-victim-body":
        setShowVictimBody(true)
        break
      case "show-autopsy-report":
        setShowAutopsyReport(true)
        break
      case "open-book-favorite":
        handleOpenBook("favorite")
        break
      case "open-book-puppies":
        handleOpenBook("puppies")
        break
      case "open-book-serial-killers":
        handleOpenBook("serial-killers")
        break
      case "open-book-botany":
        handleOpenBook("botany")
        break
      case "open-book-blood-diseases":
        handleOpenBook("blood-diseases")
        break
      case "open-book-demons":
        handleOpenBook("demons")
        break
    }
  }

  // Modal closing handlers
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

  // Navigation between locations
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

          {/* Police, Mortician, and Librarian Dialogue */}
          {(currentLocation === "police station" || currentLocation === "morgue" || currentLocation === "library") &&
            dialogue.showDialogue && (
              <DialogueInterface
                character={dialogue.currentCharacter}
                typedText={dialogue.typedText}
                dialogueOptions={dialogue.currentDialogueOptions}
                askedQuestions={dialogue.askedQuestions}
                dialoguePath={dialogue.dialoguePath}
                onSelectOption={dialogue.handleDialogueOption}
                onGoBack={dialogue.goBackInDialogue}
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

// Wrapper component to provide dialogue context
export function MurderMysteryPuzzleWithContext(props: MurderMysteryPuzzleProps) {
  return (
    <DialogueProvider>
      <MurderMysteryPuzzle {...props} />
    </DialogueProvider>
  )
}
