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

  // Local State
  const [askedAboutFriends, setAskedAboutFriends] = useState(false)
  const [canSeeBody, setCanSeeBody] = useState(false)
  const [hasCheckedBody, setHasCheckedBody] = useState(false)
  const [askedHobbies, setAskedHobbies] = useState(false)
  const [askedPuzzleGames, setAskedPuzzleGames] = useState(false)

  // Knowledge State - for conditional dialogue options
  const [knowsAboutAnemia, setKnowsAboutAnemia] = useState(false)
  const [knowsAboutBodyMarks, setKnowsAboutBodyMarks] = useState(false)

  // Initialize dialogue system
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
    let book
    switch (bookId) {
      case "favorite":
        book = {
          title: "Librarian's Favorite Book",
          sections: [{ title: "Content", pages: ["This is a placeholder for the librarian's favorite book."] }],
        }
        break
      case "puppies":
        book = {
          title: "Adorable Photos of Cutesy-cute Puppies for Kids and the Mentally Impaired",
          sections: [{ title: "Photos", pages: ["This is a placeholder for puppy photos."] }],
        }
        break
      case "serial-killers":
        book = {
          title: "Penchant For Murder: Everyone and Their Mother Wants To Kill These Days",
          sections: [{ title: "Content", pages: ["This is a placeholder for the serial killers book."] }],
        }
        break
      case "botany":
        book = botanyBook
        break
      case "blood-diseases":
        book = {
          title: "Blood diseases: Causes, Signs and Symptoms",
          sections: [{ title: "Content", pages: ["This is a placeholder for the blood diseases book."] }],
        }
        break
      case "demons":
        book = demonologyBook
        break
      default:
        book = { title: "Unknown Book", sections: [{ title: "Content", pages: ["This book doesn't exist."] }] }
    }

    bookSystem.openBook(book)
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
              />
            )}

          {/* Library View with Librarian */}
          {currentLocation === "library" && !dialogue.showDialogue && (
            <div className="flex flex-col items-center justify-center p-4">
              <div className="w-full max-w-md h-64 relative pixelated-container bg-black mb-4">
                <Image
                  src="/images/librarian.webp"
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
