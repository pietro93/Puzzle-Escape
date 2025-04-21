"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { demonologyBook } from "@/data/books"
import Image from "next/image"
import { X, Book, MapPin, FileText } from "lucide-react"
import { botanyBook } from "@/data/books"
import { cn } from "@/lib/utils"

// Define the dialogue tree structure
interface DialogueOption {
  id: string
  text: string
  response: string
  followUp?: DialogueOption[]
  condition?: string
  action?: string
  specialAction?: () => void
}

interface MurderMysteryPuzzleProps {
  onSolve?: () => void
  onLocationChange?: (location: string) => void
  currentQuestion?: string
}

export default function MurderMysteryPuzzle({ onSolve, onLocationChange, currentQuestion }: MurderMysteryPuzzleProps) {
  // Location State
  const [currentLocation, setCurrentLocation] = useState<string>("crime scene")
  const locations = [
    { id: "crime scene", name: "Crime Scene" },
    { id: "police station", name: "Police Station" },
    { id: "morgue", name: "Morgue" },
    { id: "library", name: "Library" },
  ]

  // Book Modal State
  const [selectedBook, setSelectedBook] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [currentSection, setCurrentSection] = useState<string | null>(null)

  // Police Data State
  const [showPoliceReport, setShowPoliceReport] = useState(false)
  const [showPassport, setShowPassport] = useState(false)

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

  const typingSpeed = 30
  const typingRef = useRef<NodeJS.Timeout | null>(null)

  // // // // // // DIALOGUE TREES  // // // // // // // // // // // // // // // // // // // // // //
  // Police Woman
  const policewomanDialogue = [
    {
      id: "initial-greeting",
      text: "Start",
      response: "How can I help you?",
      followUp: [
        {
          id: "who-are-you",
          text: "Who are you?",
          response: "Who am I? Who are YOU? Some make-believe detective?",
          followUp: [],
        },
        {
          id: "tell-about-murder",
          text: "Tell me about the murder.",
          response:
            "Murder? What murder? There was no murder. The victim died of natural causes. Just an accident, really.",
          followUp: [
            {
              id: "what-natural-causes",
              text: "What natural causes?",
              response: "How would I know? Ask forensics. I just know there was no murder.",
              followUp: [],
            },
            {
              id: "was-there-no-weapon",
              text: "Was there no weapon?",
              response: "Told you, there was no murder. Are you even listening?",
              followUp: [],
            },
            {
              id: "police-report",
              text: "Is there a police report?",
              response: "Yeah, I wrote it up. Not much to say though. Open and shut case of natural causes.",
              condition: "exhausted-murder-questions",
              followUp: [
                {
                  id: "can-see-report",
                  text: "Can I see the report?",
                  response: "Sure, knock yourself out. It's just a formality anyway.",
                  followUp: [
                    {
                      id: "check-police-report",
                      text: "Check police report",
                      response: "",
                      action: "showPoliceReport",
                      specialAction: () => setShowPoliceReport(true),
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "who-is-victim",
          text: "Who is the victim?",
          response:
            "Some tourist who was here on vacation by himself. Short man, kinda cute. Slightly too dead for my taste, I like 'em still warm.",
          followUp: [
            {
              id: "victim-name",
              text: "Does he have a name?",
              response: "I would assume so.",
              followUp: [],
            },
            {
              id: "more-about-victim",
              text: "What else can you tell me about the victim?",
              response: "I have got nothing to tell.",
              followUp: [],
            },
            {
              id: "how-identify-victim",
              text: "How did you identify the victim?",
              response: "Oh, that was easy. He had his passport on him.",
              followUp: [
                {
                  id: "can-see-passport",
                  text: "Can I see it?",
                  response: "Fine, but only if you promise to leave me alone.",
                  followUp: [
                    {
                      id: "check-passport",
                      text: "Check victim's passport",
                      response: "",
                      action: "showPassport",
                      specialAction: () => setShowPassport(true),
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ]

  // Mortician
  const morticianDialogue = []

  // // // // // // MODALS  // // // // // // // // // // // // // // // // // // // // // //
  const closePassport = () => {
    setShowPassport(false)
  }
  const closePoliceReport = () => {
    setShowPoliceReport(false)
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
    setAskedQuestions(new Set()) // Reset asked questions

    // Set initial dialogue options based on character
    if (character === "policewoman") {
      setCurrentDialogueOptions(policewomanDialogue[0].followUp || [])
      setCurrentResponse(policewomanDialogue[0].response)
      setIsTyping(true)
    } else if (character === "mortician") {
      setCurrentDialogueOptions(morticianDialogue)
      setCurrentResponse("...")
      setIsTyping(true)
    }
  }

  const handleDialogueOption = (option: DialogueOption) => {
    // Mark this question as asked
    setAskedQuestions((prev) => new Set([...prev, option.id]))

    // Set the response and start typing animation
    setCurrentResponse(option.response)
    setTypedText("")
    setIsTyping(true)

    // Handle special actions
    if (option.specialAction) {
      option.specialAction()
    }

    // Update dialogue path for nested navigation
    if (option.followUp && option.followUp.length > 0) {
      setDialoguePath((prev) => [...prev, option])
      setCurrentDialogueOptions(option.followUp)
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

      if (newPath.length === 0) {
        // Back to root
        if (currentCharacter === "policewoman") {
          setCurrentDialogueOptions(policewomanDialogue[0].followUp || [])
        } else if (currentCharacter === "mortician") {
          setCurrentDialogueOptions(morticianDialogue)
        }
      } else {
        // Back to previous level
        setCurrentDialogueOptions(newPath[newPath.length - 1].followUp || [])
      }
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

  useEffect(() => {
    // Automatically start dialogue when entering the police station
    if (currentLocation === "police station" || currentLocation === "morgue") {
      startDialogue(currentLocation === "police station" ? "policewoman" : "mortician")
    }
  }, [currentLocation])

  // // // // // // FUNCTION CALLS  // // // // // // // // // // // // // // // // // // // // // //
  const navigateTo = (location: string) => {
    setCurrentLocation(location)
    setShowDialogue(false)

    if (onLocationChange) {
      onLocationChange(location)
    }
  }

  // Conditionally render "Is there a police report?" option
  const showPoliceReportOption = askedQuestions.has("what-natural-causes") && askedQuestions.has("was-there-no-weapon")

  const currentContent = getCurrentContent()
  const totalPages = getTotalPages()

  return (
    <div className="flex flex-col items-center space-y-4 relative pb-16">
      <h2 className="text-xl font-bold text-red-500">Murder Mystery</h2>
      <p className="text-gray-300 mb-2">Explore locations to gather clues and solve the mystery.</p>

      {/* Location Content */}
      <Card className="w-full bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-purple-300">{locations.find((loc) => loc.id === currentLocation)?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          {currentLocation === "crime scene" && (
            <div className="flex justify-center">
              <Image
                src="/images/murder-mystery/crime-scene.webp"
                alt="Crime Scene"
                width={400}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          )}

          {/* Police and Mortician Dialogue  */}
          {(currentLocation === "police station" || currentLocation === "morgue") && showDialogue && (
            <div className="flex items-center space-x-4 p-4">
              {/* Character Portrait */}
              <div className="w-24 h-24 relative">
                <Image
                  src={
                    currentCharacter === "policewoman"
                      ? "/images/murder-mystery/policewoman.webp"
                      : "/images/murder-mystery/mortician.webp"
                  }
                  alt={currentCharacter}
                  width={96}
                  height={96}
                  className="rounded-lg border-2 border-gray-700"
                />
              </div>

              {/* Speech Bubble */}
              <div className="bg-gray-700 p-4 rounded-lg flex-1">
                <p className="text-gray-300 font-mono text-sm">{typedText}</p>
              </div>
            </div>
          )}

          {/* Police Report Button */}
          {showPoliceReport && (
            <div className="p-6">
              {/* Placeholder for passport image - will be replaced with actual image */}
              <div className="bg-gray-800 p-4 rounded border border-gray-700 w-full">
                <div className="text-center text-gray-400 mb-2 font-pixel">Police Report</div>
                <div className="aspect-[3/4] bg-gray-700 rounded flex items-center justify-center">
                  <p className="text-gray-500 font-pixel">Police Report Placeholder</p>
                </div>
                <div className="mt-4 space-y-2 text-sm font-pixel">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Reporting Officer:</span>
                    <span className="text-gray-300">Officer Jenny</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Case:</span>
                    <span className="text-gray-300">2025-04-21-001</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Info:</span>
                    <span className="text-gray-300">Death By Natural Causes</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Police Report Button */}
          {showPassport && (
            <div className="p-6">
              {/* Placeholder for passport image - will be replaced with actual image */}
              <div className="bg-gray-800 p-4 rounded border border-gray-700 w-full">
                <div className="text-center text-gray-400 mb-2 font-pixel">Passport</div>
                <div className="aspect-[3/4] bg-gray-700 rounded flex items-center justify-center">
                  <p className="text-gray-500 font-pixel">Passport Image Placeholder</p>
                </div>
                <div className="mt-4 space-y-2 text-sm font-pixel">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Name:</span>
                    <span className="text-gray-300">John Doe</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Nationality:</span>
                    <span className="text-gray-300">United States</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Date of Birth:</span>
                    <span className="text-gray-300">01/01/1980</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentLocation === "library" && (
            <div className="text-gray-300">
              <p>The library contains thousands of books on various subjects.</p>
              <p className="mt-2">Two books catch your attention:</p>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div
                  className="bg-gray-700 p-3 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
                  onClick={() => openBook(demonologyBook)}
                >
                  <div className="flex items-center gap-2">
                    <Book className="text-red-400" />
                    <h3 className="font-semibold text-red-300">Demonology</h3>
                  </div>
                  <p className="text-sm mt-2">A comprehensive guide to supernatural creatures that feed on humans.</p>
                </div>

                <div
                  className="bg-gray-700 p-3 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
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

      {/* Book Modal */}
      {selectedBook && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-amber-300">{selectedBook.title}</h3>
              <Button variant="ghost" size="sm" onClick={closeBook} className="text-gray-400 hover:text-white">
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Content - show either regular book pages or sections of the Botany book */}
            <div className="p-6 book-page" style={{ maxHeight: "50vh", overflowY: "auto" }}>
              {selectedBook.sections ? (
                <>
                  <div className="flex space-x-4 mb-4">
                    {selectedBook.sections.map((section: any) => (
                      <Button
                        variant="link"
                        key={section.id}
                        onClick={() => switchSection(section.id)}
                        className={cn(
                          "text-sm text-gray-400 hover:text-gray-200",
                          currentSection === section.id && "font-bold text-amber-300",
                        )}
                      >
                        {section.title}
                      </Button>
                    ))}
                  </div>
                  {currentContent && (
                    <>
                      <h4 className="text-lg font-semibold text-gray-300 mb-2">{currentContent.title}</h4>
                      <p className="text-sm text-gray-400">{currentContent.text}</p>
                    </>
                  )}
                </>
              ) : (
                selectedBook.pages[currentPage]?.text
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-700 flex justify-between items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={prevPage}
                disabled={currentPage === 0}
                className="font-pixel text-xs"
              >
                Previous
              </Button>
              <span className="text-sm text-gray-400">{`${currentPage + 1} / ${totalPages}`}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={nextPage}
                disabled={currentPage === totalPages - 1}
                className="font-pixel text-xs"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Dialogue functions - will only be displayed when there is a selected chracter and you are a police station or a moruge */}
      {showDialogue && (
        <div className="fixed inset-0 flex items-end justify-center z-50 pointer-events-none">
          <div className="w-full max-w-4xl pointer-events-auto">
            {/* Character Portrait and Speech Bubble */}
            <div className="flex items-start mb-2 px-4">
              <div className="w-24 h-24 relative">
                <Image
                  src={
                    currentCharacter === "policewoman"
                      ? "/images/murder-mystery/policewoman.webp"
                      : "/images/murder-mystery/mortician.webp"
                  }
                  alt={currentCharacter}
                  width={96}
                  height={96}
                  className="rounded-lg border-2 border-gray-700"
                />
              </div>

              {/* Speech Bubble */}
              <div className="ml-2 relative bg-gray-800 p-4 rounded-lg border border-gray-600 flex-1 min-h-[80px] speech-bubble">
                <p className="font-pixel text-gray-200 text-lg leading-relaxed">
                  {typedText}
                  {isTyping && <span className="animate-pulse">_</span>}
                </p>
              </div>
            </div>

            {/* Dialogue Options */}
            <div className="bg-gray-900/95 border-t-2 border-gray-700 p-4 rounded-t-lg">
              <div className="grid gap-2 max-h-[200px] overflow-y-auto dialogue-options">
                {currentDialogueOptions
                  .filter((option) => {
                    // Conditionally render "Is there a police report?" option
                    if (option.id === "police-report") {
                      return showPoliceReportOption
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
                <Button variant="outline" size="sm" onClick={goBackInDialogue} className="font-pixel text-xs">
                  {dialoguePath.length === 0 ? "Exit" : "Back"}
                </Button>
                <Button variant="outline" size="sm" onClick={closeDialogue} className="font-pixel text-xs">
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Passport Popup */}
      {showPassport && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg max-w-md w-full overflow-hidden flex flex-col shadow-2xl border border-gray-700">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-800">
              <h3 className="text-xl font-bold text-amber-300 font-pixel">Victim's Passport</h3>
              <Button variant="ghost" size="sm" onClick={closePassport} className="text-gray-400 hover:text-white">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-6">
              {/* Placeholder for passport image - will be replaced with actual image */}
              <div className="bg-gray-800 p-4 rounded border border-gray-700 w-full">
                <div className="text-center text-gray-400 mb-2 font-pixel">Passport</div>
                <div className="aspect-[3/4] bg-gray-700 rounded flex items-center justify-center">
                  <p className="text-gray-500 font-pixel">Passport Image Placeholder</p>
                </div>
                <div className="mt-4 space-y-2 text-sm font-pixel">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Name:</span>
                    <span className="text-gray-300">John Doe</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Nationality:</span>
                    <span className="text-gray-300">United States</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Date of Birth:</span>
                    <span className="text-gray-300">01/01/1980</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Police Report Popup */}
      {showPoliceReport && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg max-w-md w-full overflow-hidden flex flex-col shadow-2xl border border-gray-700">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-800">
              <h3 className="text-xl font-bold text-amber-300 font-pixel">Police Report</h3>
              <Button variant="ghost" size="sm" onClick={closePoliceReport} className="text-gray-400 hover:text-white">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-6">
              <div className="bg-gray-800 p-4 rounded border border-gray-700">
                <div className="flex items-center justify-center mb-4">
                  <FileText className="text-gray-400 mr-2" />
                  <h4 className="text-gray-300 font-pixel">Official Police Report</h4>
                </div>
                <div className="bg-gray-100 p-4 rounded text-gray-800 font-pixel text-sm leading-relaxed">
                  <p className="mb-2">Date: April 21, 2025</p>
                  <p className="mb-2">Case #: 2025-04-21-001</p>
                  <p className="mb-2">Reporting Officer: Officer Jenny</p>
                  <p className="mb-4">Subject: Death of tourist - Natural causes</p>

                  <p className="mb-2">
                    Victim was found in hotel room after calling for emergency services. Deceased upon arrival. No signs
                    of struggle or forced entry.
                  </p>
                  <p className="mb-2">
                    Cause of death appears to be natural causes. No further investigation required.
                  </p>
                  <p className="mb-2">Personal effects collected and stored in evidence.</p>

                  <div className="mt-4 text-right">
                    <p>
                      Signed: <span className="italic">Officer Jenny</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Character dialogue pop up */}
      {showDialogue && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div
            className="bg-gray-900 p-4 rounded-lg border-2 border-gray-700 max-w-sm w-full animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="w-16 h-16 relative pixelated-container shrink-0">
                <Image
                  src={
                    currentCharacter === "policewoman"
                      ? "/images/murder-mystery/policewoman.webp"
                      : "/images/murder-mystery/mortician.webp"
                  }
                  alt={currentCharacter}
                  width={64}
                  height={64}
                  className="pixelated"
                />
              </div>
              <div className="flex-1">
                <p className="text-purple-300 font-pixel mb-2">
                  {currentCharacter === "policewoman" ? "Policewoman:" : "Mortician:"}
                </p>
                <p className="text-gray-200 text-sm">{typedText}</p>
              </div>
            </div>

            {/* Dialogue options inside popup */}
            <div className="mt-4 text-center flex justify-center">
              {showDialogue && (
                <Button variant="outline" size="sm" onClick={goBackInDialogue} className="font-pixel text-xs">
                  {dialoguePath.length === 0 ? "Exit" : "Back"}
                </Button>
              )}
              {/* Close Button */}
              <Button
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-xs text-gray-300 font-pixel"
                onClick={closeDialogue}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

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
