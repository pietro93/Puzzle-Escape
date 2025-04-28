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

  // Knowledge State - for conditional dialogue options
  const [knowsAboutAnemia, setKnowsAboutAnemia] = useState(false)
  const [knowsAboutBodyMarks, setKnowsAboutBodyMarks] = useState(false)

  // Tracking state for viewed evidence
  const [hasSeenPoliceReport, setHasSeenPoliceReport] = useState(false)
  const [hasSeenPassport, setHasSeenPassport] = useState(false)
  const [hasSeenBody, setHasSeenBody] = useState(false)
  const [hasSeenAutopsyReport, setHasSeenAutopsyReport] = useState(false)

  // Mortician specific state
  const [canSeeBody, setCanSeeBody] = useState(false)
  const [askedAboutFriends, setAskedAboutFriends] = useState(false)
  const [askedHobbies, setAskedHobbies] = useState(false)
  const [askedPuzzleGames, setAskedPuzzleGames] = useState(false)
  const [showedUnconditionalFriendship, setShowedUnconditionalFriendship] = useState(false)

  // Track if the demonology book has been opened
  const [demonologyBookOpened, setDemonologyBookOpened] = useState(false)

  // Initialize dialogue system with the appropriate dialogue tree based on current location
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

  // // // // // // MODALS  // // // // // // // // // // // // // // // // // // // // // //
  const closePassport = () => {
    setShowPassport(false)
    setHasSeenPassport(true)
    dialogue.setLastAction("viewed-passport")
    dialogue.setCurrentResponse("Seen enough? I've got work to do, you know.")
    dialogue.setTypedText("")
    dialogue.setIsTyping(true)
  }

  const closePoliceReport = () => {
    setShowPoliceReport(false)
    setHasSeenPoliceReport(true)
    dialogue.setLastAction("viewed-report")
    dialogue.setCurrentResponse("Told you it wasn't anything special. Just a routine report.")
    dialogue.setTypedText("")
    dialogue.setIsTyping(true)
  }

  const closeVictimBody = () => {
    setShowVictimBody(false)
    setHasSeenBody(true)
    dialogue.setLastAction("viewed-body")
    dialogue.setCurrentResponse("Seen enough? The body isn't going anywhere. Neither am I, unfortunately.")
    dialogue.setTypedText("")
    dialogue.setIsTyping(true)
  }

  const closeAutopsyReport = () => {
    setShowAutopsyReport(false)
    setHasSeenAutopsyReport(true)
    dialogue.setLastAction("viewed-autopsy")
    dialogue.setCurrentResponse("Satisfied? Now get out of here.")
    dialogue.setTypedText("")
    dialogue.setIsTyping(true)
  }

  // // // // // // DIALOGUE FUNCTIONS  // // // // // // // // // // // // // // // // // // // // // //
  // Custom filter for policewoman dialogue options
  const filterPoliceOptions = (options: any[]) => {
    return options.filter((opt) => {
      // Only show "police-report" option if the player has asked about the murder
      if (opt.id === "police-report") {
        return dialogue.askedQuestions.has("tell-about-murder")
      }

      // Only show "were-there-any-witnesses" if the player has asked about the murder
      if (opt.id === "were-there-any-witnesses") {
        return dialogue.askedQuestions.has("tell-about-murder")
      }

      // Only show "can-see-report-again" if the player has seen the police report
      if (opt.id === "can-see-report-again") {
        return hasSeenPoliceReport
      }

      // Only show "can-see-passport-again" if the player has seen the passport
      if (opt.id === "can-see-passport-again") {
        return hasSeenPassport
      }

      // Show all other options
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
      // Show the "let-me-see-body" option only if both hobbies and puzzle games have been asked about
      // and it hasn't been shown before
      if (opt.id === "let-me-see-body") {
        return askedHobbies && askedPuzzleGames && !showedUnconditionalFriendship
      }
      if ((opt.id === "hobbies" || opt.id === "puzzle-games") && askedHobbies && askedPuzzleGames) {
        return false
      }
      return true
    })
  }

  // Custom filter for librarian dialogue options
  const filterLibrarianOptions = (options: any[]) => {
    return options.filter((opt) => {
      if (opt.id === "book-about-blood-diseases") {
        return knowsAboutAnemia
      }
      if (opt.id === "book-about-demons") {
        return knowsAboutBodyMarks
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
    } else if (option.id === "let-me-see-body") {
      setCanSeeBody(true)
      setShowedUnconditionalFriendship(true)
    } else if (option.id === "can-see-report" || option.id === "can-see-report-again") {
      setShowPoliceReport(true)
      dialogue.setLastAction("viewing-report")
    } else if (option.id === "can-see-passport" || option.id === "can-see-passport-again") {
      setShowPassport(true)
      dialogue.setLastAction("viewing-passport")
    } else if (option.id === "check-victim-body") {
      setShowVictimBody(true)
      dialogue.setLastAction("viewing-body")
    } else if (option.id === "check-autopsy-report") {
      setShowAutopsyReport(true)
      dialogue.setLastAction("viewing-autopsy")
    } else if (option.id === "anemia-question") {
      setKnowsAboutAnemia(true)
    } else if (option.id === "weird-signs") {
      setKnowsAboutBodyMarks(true)
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

    // Use the dialogue system to handle the option with the appropriate filter
    if (currentLocation === "police station") {
      dialogue.handleDialogueOption(option, filterPoliceOptions)
    } else if (currentLocation === "morgue") {
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
      if (!demonologyBookOpened) {
        setDemonologyBookOpened(true)
      }
    }

    if (book) {
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
      // Start dialogue with policewoman and apply police filter
      dialogue.startDialogue("policewoman", policewomanDialogue, filterPoliceOptions)
    } else if (currentLocation === "morgue") {
      // Start dialogue with mortician and apply mortician filter
      dialogue.startDialogue("mortician", morticianDialogue, filterMorticianOptions)
    } else if (currentLocation === "library") {
      // Start dialogue with librarian and apply librarian filter
      dialogue.startDialogue("librarian", librarianDialogue, filterLibrarianOptions)
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
                onSelectOption={handleDialogueOption}
                onGoBack={() => {
                  if (currentLocation === "police station") {
                    dialogue.goBackInDialogue(filterPoliceOptions)
                  } else if (currentLocation === "morgue") {
                    dialogue.goBackInDialogue(filterMorticianOptions)
                  } else {
                    dialogue.goBackInDialogue(filterLibrarianOptions)
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
                onClick={() => dialogue.startDialogue("librarian", librarianDialogue, filterLibrarianOptions)}
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
