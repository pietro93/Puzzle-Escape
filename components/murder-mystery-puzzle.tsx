"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { demonologyBook } from "@/data/books"
import Image from "next/image"
import { X, Book, MapPin } from "lucide-react"
import { botanyBook } from "@/data/books"
import { cn } from "@/lib/utils"

// Import data
import { policewomanDialogue, morticianDialogue } from "@/components/murder-mystery/dialogue-data"
import { autopsyReportPages } from "@/components/murder-mystery/evidence-data"

interface MurderMysteryPuzzleProps {
  onSolve?: () => void
  onLocationChange?: (location: string) => void
  currentQuestion?: string
}

interface DialogueOption {
  id: string
  text: string
  response: string
  followUp?: DialogueOption[]
  condition?: string
  specialAction?: () => void
}

export default function MurderMysteryPuzzle({ onSolve, onLocationChange, currentQuestion }: MurderMysteryPuzzleProps) {
  // Location State
  const [currentLocation, setCurrentLocation] = useState<string>("crime scene")
  const [locations] = useState([
    { id: "crime scene", name: "Crime Scene" },
    { id: "police station", name: "Police Station" },
    { id: "morgue", name: "Morgue" },
    { id: "library", name: "Library" },
  ])

  // Book Modal State
  const [selectedBook, setSelectedBook] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [currentSection, setCurrentSection] = useState<string | null>(null)

  // Police Data State
  const [showPoliceReport, setShowPoliceReport] = useState(false)
  const [showPassport, setShowPassport] = useState(false)
  const [showVictimBody, setShowVictimBody] = useState(false)
  const [showAutopsyReport, setShowAutopsyReport] = useState(false)
  const [currentAutopsyPage, setCurrentAutopsyPage] = useState(0)

  // Dialogue State
  const [showDialogue, setShowDialogue] = useState(false)
  const [currentCharacter, setCurrentCharacter] = useState<string | null>(null)
  const [currentResponse, setCurrentResponse] = useState<string>("")
  const [currentDialogueOptions, setCurrentDialogueOptions] = useState<DialogueOption[]>([])

  // Local State
  const [askedQuestions, setAskedQuestions] = useState<Set<string>>(new Set())
  const [isTyping, setIsTyping] = useState(false)
  const [typedText, setTypedText] = useState("")
  const [dialoguePath, setDialoguePath] = useState<DialogueOption[]>([])
  const [askedAboutFriends, setAskedAboutFriends] = useState(false)
  const [canSeeBody, setCanSeeBody] = useState(false)
  const [hasCheckedBody, setHasCheckedBody] = useState(false)
  const [currentBodyPart, setCurrentBodyPart] = useState("head")

  // Add these state variables near the other state declarations
  const [askedHobbies, setAskedHobbies] = useState(false)
  const [askedPuzzleGames, setAskedPuzzleGames] = useState(false)
  const [lastAction, setLastAction] = useState<string | null>(null)

  const typingSpeed = 30
  const typingRef = useRef<NodeJS.Timeout | null>(null)

  // // // // // // MODALS  // // // // // // // // // // // // // // // // // // // // // //
  const closePassport = () => {
    setShowPassport(false)
    setLastAction("viewed-passport")
    setCurrentResponse("Seen enough? I've got work to do, you know.")
    setTypedText("")
    setIsTyping(true)
  }

  const closePoliceReport = () => {
    setShowPoliceReport(false)
    setLastAction("viewed-report")
    setCurrentResponse("Told you it wasn't anything special. Just a routine report.")
    setTypedText("")
    setIsTyping(true)
  }

  const closeVictimBody = () => {
    setShowVictimBody(false)
    setHasCheckedBody(true)
    setLastAction("viewed-body")
    setCurrentResponse("Seen enough? The body isn't going anywhere. Neither am I, unfortunately.")
    setTypedText("")
    setIsTyping(true)
  }

  const closeAutopsyReport = () => {
    setShowAutopsyReport(false)
    setLastAction("viewed-autopsy")
    setCurrentResponse("Satisfied? Now get out of here.")
    setTypedText("")
    setIsTyping(true)
  }

  // Function to change which body part is being viewed
  const changeBodyPart = (part: string) => {
    setCurrentBodyPart(part)
  }

  // // // // // // BOOK MODAL  // // // // // // // // // // // // // // // // // // // // // //
  const openBook = (book: any) => {
    setSelectedBook(book)
    setCurrentPage(0)

    // If it's the botany book, set the initial section
    if (book.sections) {
      setCurrentSection(book.sections[0].id)
    } else {
      setCurrentSection(null)
    }
  }
  const closeBook = () => {
    setSelectedBook(null)
    setCurrentPage(0)
    setCurrentSection(null)
  }

  const nextPage = () => {
    if (selectedBook) {
      if (selectedBook.sections) {
        // For botany book with sections
        const currentSectionObj = selectedBook.sections.find((s: any) => s.id === currentSection)
        if (currentSectionObj && currentPage < currentSectionObj.pages.length - 1) {
          setCurrentPage(currentPage + 1)
        }
      } else {
        // For regular books
        if (currentPage < selectedBook.pages.length - 1) {
          setCurrentPage(currentPage + 1)
        }
      }
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const switchSection = (sectionId: string) => {
    setCurrentSection(sectionId)
    setCurrentPage(0)
  }

  const getCurrentContent = () => {
    if (!selectedBook) return null

    if (selectedBook.sections) {
      const section = selectedBook.sections.find((s: any) => s.id === currentSection)
      return section ? section.pages[currentPage] : null
    } else {
      return selectedBook.pages[currentPage]
    }
  }

  const getTotalPages = () => {
    if (!selectedBook) return 0

    if (selectedBook.sections) {
      const section = selectedBook.sections.find((s: any) => s.id === currentSection)
      return section ? section.pages.length : 0
    } else {
      return selectedBook.pages.length
    }
  }

  // // // // // // DIALOGUE FUNCTIONS  // // // // // // // // // // // // // // // // // // // // // //
  const startDialogue = (character: string) => {
    setCurrentCharacter(character)
    setShowDialogue(true)
    setCurrentResponse("")
    setTypedText("")
    setDialoguePath([])
    setLastAction(null)

    // Set initial response based on character
    if (character === "policewoman") {
      setCurrentResponse(policewomanDialogue[0].response)
      setCurrentDialogueOptions(policewomanDialogue[0].followUp || [])
    } else if (character === "mortician") {
      setCurrentResponse(morticianDialogue[0].response)
      setCurrentDialogueOptions(morticianDialogue[0].followUp || [])
    }

    // Start typing animation
    setIsTyping(true)
  }

  // Update the handleDialogueOption function to track hobby questions
  const handleDialogueOption = (option: DialogueOption) => {
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

    // Track hobby questions
    if (option.id === "hobbies") {
      setAskedHobbies(true)
    }
    if (option.id === "puzzle-games") {
      setAskedPuzzleGames(true)
    }

    // Update dialogue path for nested navigation
    if (option.followUp && option.followUp.length > 0) {
      setDialoguePath((prev) => [...prev, option])
      setCurrentDialogueOptions(
        option.followUp.filter((opt) => {
          // Filter based on conditions
          if (opt.condition === "asked-about-friends") {
            return askedAboutFriends
          }
          if (opt.condition === "asked-both-hobby-questions") {
            return askedHobbies && askedPuzzleGames
          }
          return true
        }) || [],
      )
    } else {
      // If there are no follow-ups, update the dialogue options based on the current level
      if (dialoguePath.length === 0) {
        // At root level
        if (currentCharacter === "policewoman") {
          setCurrentDialogueOptions(
            policewomanDialogue[0].followUp.filter((opt) => {
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
            }) || [],
          )
        } else if (currentCharacter === "mortician") {
          setCurrentDialogueOptions(
            morticianDialogue[0].followUp.filter((opt) => {
              if (opt.id === "like-job" || opt.id === "can-see-body-initial") {
                return !canSeeBody
              }
              if (opt.id === "check-victim-body") {
                return canSeeBody
              }
              return true
            }) || [],
          )
        }
      } else {
        // At a nested level
        const parentOption = dialoguePath[dialoguePath.length - 1]
        setCurrentDialogueOptions(
          parentOption.followUp?.filter((opt) => {
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
          }) || [],
        )
      }
    }
  }

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
        if (currentCharacter === "policewoman") {
          setCurrentDialogueOptions(
            policewomanDialogue[0].followUp.filter((opt) => {
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
            }) || [],
          )
          setCurrentResponse(policewomanDialogue[0].response)
        } else if (currentCharacter === "mortician") {
          setCurrentDialogueOptions(
            morticianDialogue[0].followUp.filter((opt) => {
              if (opt.id === "like-job" || opt.id === "can-see-body-initial") {
                return !canSeeBody
              }
              if (opt.id === "check-victim-body") {
                return canSeeBody
              }
              return true
            }) || [],
          )
          setCurrentResponse(morticianDialogue[0].response)
        }
      } else {
        // Back to previous level
        const parentOption = newPath[newPath.length - 1]
        setCurrentDialogueOptions(
          parentOption.followUp?.filter((opt) => {
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
          }) || [],
        )
        setCurrentResponse(parentOption.response)
      }

      setTypedText("")
      setIsTyping(true)
    }
  }

  const closeDialogue = () => {
    setShowDialogue(false)
    setCurrentCharacter(null)
  }

  // // // // // // TEXT TYPING ANIMATION  // // // // // // // // // // // // // // // // // // // // // //
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
  }, [isTyping, currentResponse])

  // // // // // // FUNCTION CALLS  // // // // // // // // // // // // // // // // // // // // // //
  const navigateTo = (location: string) => {
    setCurrentLocation(location)
    setShowDialogue(false)

    if (onLocationChange) {
      onLocationChange(location)
    }
  }

  const handlePrevAutopsyPage = () => {
    setCurrentAutopsyPage((prevPage) => Math.max(prevPage - 1, 0))
  }

  const handleNextAutopsyPage = () => {
    setCurrentAutopsyPage((prevPage) => Math.min(prevPage + 1, autopsyReportPages.length - 1))
  }

  // Conditionally render "Is there a police report?" option
  const showPoliceReportOption = askedQuestions.has("what-natural-causes") && askedQuestions.has("was-there-no-weapon")
  const showWitnessesOption = askedQuestions.has("tell-about-murder")
  const showPoliceReportAgainOption = askedQuestions.has("check-police-report")
  const showPassportAgainOption = askedQuestions.has("check-passport")
  const showCheckVictimBodyOption = canSeeBody

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

          {/* Police and Mortician Dialogue  */}
          {(currentLocation === "police station" || currentLocation === "morgue") && showDialogue && (
            <div className="flex flex-col bg-black">
              {/* Character Portrait and Speech Bubble */}
              <div className="flex flex-col items-center mb-2 p-6 pt-0 bg-black">
                <div className="w-40 h-40 relative pixelated-container bg-black p-0">
                  <Image
                    src={
                      currentCharacter === "policewoman"
                        ? "/images/murder-mystery/policewoman.webp"
                        : "/images/murder-mystery/mortician.webp"
                    }
                    alt={currentCharacter || ""}
                    width={160}
                    height={160}
                    className="pixelated"
                  />
                </div>

                {/* Speech Bubble */}
                <div className="mt-2 relative bg-gray-900 p-4 rounded-lg border border-gray-600 flex-1 min-h-[80px]">
                  <p className="font-pixel text-gray-200 text-sm">{typedText || "..."}</p>
                </div>
              </div>

              {/* Dialogue Options */}
              <div className="bg-gray-900/95 border-t-2 border-gray-700 p-4 rounded-t-lg">
                <div className="grid gap-2 max-h-[200px] overflow-y-auto">
                  {currentDialogueOptions
                    .filter((option) => {
                      // Filter based on conditions
                      if (option.id === "police-report") {
                        return showPoliceReportOption
                      }
                      if (option.id === "were-there-any-witnesses") {
                        return showWitnessesOption
                      }
                      if (option.id === "can-see-report-again") {
                        return showPoliceReportAgainOption
                      }
                      if (option.id === "can-see-passport-again") {
                        return showPassportAgainOption
                      }
                      return true
                    })
                    .map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleDialogueOption(option)}
                        className={cn(
                          "text-left p-2 rounded font-pixel transition-colors hover:bg-gray-700",
                          askedQuestions.has(option.id) ? "text-gray-300" : "text-purple-300 font-bold",
                        )}
                      >
                        {option.text}
                      </button>
                    ))}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-4">
                  {dialoguePath.length > 0 && (
                    <Button variant="outline" size="sm" onClick={goBackInDialogue} className="font-pixel text-xs">
                      Back
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Police Report Button */}
          {showPoliceReport && (
            <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
              <div className="bg-gray-900 p-4 rounded border border-gray-700 w-full max-w-md">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-center text-gray-400 font-pixel">Police Report</div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={closePoliceReport}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-4 space-y-2 text-sm font-pixel">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Victim:</span>
                    <span className="text-gray-300">Male, caucasian, early to mid 30s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Eyes:</span>
                    <span className="text-gray-300">Brown</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Hair:</span>
                    <span className="text-gray-300">Brown, short, wavy</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Cause of death:</span>
                    <span className="text-gray-300">suspected stroke, organ failure</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Visible trauma:</span>
                    <span className="text-gray-300">none observed</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Passport Button */}
          {showPassport && (
            <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
              <div className="bg-gray-900 p-4 rounded border border-gray-700 w-full max-w-md">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-center text-gray-400 font-pixel">ID</div>
                  <Button variant="ghost" size="sm" onClick={closePassport} className="text-gray-400 hover:text-white">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center">
                  <div className="w-24 h-24 relative mr-4 pixelated-container bg-black p-0">
                    <Image
                      src="/images/murder-mystery/victim_passport-headshot.webp"
                      alt="Victim's Headshot"
                      width={96}
                      height={96}
                      className="pixelated"
                    />
                  </div>
                  <div className="mt-4 space-y-2 text-sm font-pixel">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Name:</span>
                      <span className="text-gray-300">Declan Tremblay</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Date of Birth:</span>
                      <span className="text-gray-300">1993/04/21</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Height:</span>
                      <span className="text-gray-300">180 cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Place of birth:</span>
                      <span className="text-gray-300">Toronto, ON</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Victim Body Modal - Modified to show one body part at a time */}
          {showVictimBody && (
            <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
              <div className="bg-gray-900 p-4 rounded border border-gray-700 w-full max-w-md">
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={closeVictimBody}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-center text-gray-400 mb-2 font-pixel">Victim's Body</div>
                <div className="flex flex-col items-center justify-center">
                  {/* Show only the current body part */}
                  <div className="mb-4">
                    {currentBodyPart === "head" && (
                      <Image
                        src={`/images/murder-mystery/victim-head.webp`}
                        alt="Victim's Head"
                        width={200}
                        height={200}
                        className="pixelated"
                      />
                    )}
                    {currentBodyPart === "leftHand" && (
                      <Image
                        src={`/images/murder-mystery/victim-left-hand.webp`}
                        alt="Victim's Left Hand"
                        width={200}
                        height={200}
                        className="pixelated"
                      />
                    )}
                    {currentBodyPart === "rightHand" && (
                      <Image
                        src={`/images/murder-mystery/victim-right-hand.webp`}
                        alt="Victim's Right Hand"
                        width={200}
                        height={200}
                        className="pixelated"
                      />
                    )}
                    {currentBodyPart === "leftLeg" && (
                      <Image
                        src={`/images/murder-mystery/victim-left-leg.webp`}
                        alt="Victim's Left Leg"
                        width={200}
                        height={200}
                        className="pixelated"
                      />
                    )}
                    {currentBodyPart === "rightLeg" && (
                      <Image
                        src={`/images/murder-mystery/victim-right-leg.webp`}
                        alt="Victim's Right Leg"
                        width={200}
                        height={200}
                        className="pixelated"
                      />
                    )}
                  </div>

                  {/* Navigation buttons for body parts */}
                  <div className="grid grid-cols-2 gap-2">
                    {currentBodyPart !== "head" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => changeBodyPart("head")}
                        className="text-gray-300"
                      >
                        Check Head
                      </Button>
                    )}
                    {currentBodyPart !== "leftHand" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => changeBodyPart("leftHand")}
                        className="text-gray-300"
                      >
                        Check Left Arm
                      </Button>
                    )}
                    {currentBodyPart !== "rightHand" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => changeBodyPart("rightHand")}
                        className="text-gray-300"
                      >
                        Check Right Arm
                      </Button>
                    )}
                    {currentBodyPart !== "leftLeg" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => changeBodyPart("leftLeg")}
                        className="text-gray-300"
                      >
                        Check Left Leg
                      </Button>
                    )}
                    {currentBodyPart !== "rightLeg" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => changeBodyPart("rightLeg")}
                        className="text-gray-300"
                      >
                        Check Right Leg
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Autopsy Report Button */}
          {showAutopsyReport && (
            <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
              <div className="bg-gray-900 p-4 rounded border border-gray-700 w-full max-w-md">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-center text-gray-400 font-pixel">
                    Autopsy Report - Page {currentAutopsyPage + 1}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={closeAutopsyReport}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-4 space-y-2 text-sm font-pixel">
                  <p>{autopsyReportPages[currentAutopsyPage].content}</p>
                </div>
                <div className="flex justify-between mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevAutopsyPage}
                    disabled={currentAutopsyPage === 0}
                    className="text-gray-300"
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextAutopsyPage}
                    disabled={currentAutopsyPage === autopsyReportPages.length - 1}
                    className="text-gray-300"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}

          {currentLocation === "library" && (
            <div className="text-gray-300 bg-black p-4">
              <p>The library contains thousands of books on various subjects.</p>
              <p className="mt-2">Two books catch your attention:</p>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div
                  className="bg-gray-900 p-3 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors"
                  onClick={() => openBook(demonologyBook)}
                >
                  <div className="flex items-center gap-2">
                    <Book className="text-red-400" />
                    <h3 className="font-semibold text-red-300">Demonology</h3>
                  </div>
                  <p className="text-sm mt-2">A comprehensive guide to supernatural creatures that feed on humans.</p>
                </div>

                <div
                  className="bg-gray-900 p-3 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors"
                  onClick={() => openBook(botanyBook)}
                >
                  <div className="flex items-center gap-2">
                    <Book className="text-green-400" />
                    <h3 className="font-semibold text-green-300">Botany</h3>
                  </div>
                  <p className="text-sm mt-2">An encyclopedia of plants, including many poisonous varieties.</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Location Map */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 p-2 border-t border-gray-700 z-10">
        <div className="flex justify-between items-center max-w-md mx-auto">
          {locations.map((location) => (
            <Button
              key={location.id}
              variant={currentLocation === location.id ? "default" : "outline"}
              size="sm"
              onClick={() => navigateTo(location.id)}
              className="flex items-center gap-1"
            >
              <MapPin className="w-3 h-3" />
              <span className="text-xs sm:text-sm">{location.name}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
