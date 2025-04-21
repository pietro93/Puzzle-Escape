"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { demonologyBook } from "@/data/books"
import Image from "next/image"
import { X, Book, MapPin, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react"
import { botanyBook } from "@/data/books"

// Add the dialogue tree interface and data structure
interface DialogueOption {
  id: string
  text: string
  response: string
  followUp?: DialogueOption[]
  condition?: string
  action?: string
}

// Update the component props to include dialogue state
interface MurderMysteryPuzzleProps {
  onSolve?: () => void
  onLocationChange?: (location: string) => void
  onShowDevilDialogue?: () => void
}

// Replace the component implementation with our enhanced version that includes dialogue
export default function MurderMysteryPuzzle({
  onSolve,
  onLocationChange,
  onShowDevilDialogue,
}: MurderMysteryPuzzleProps) {
  const [currentLocation, setCurrentLocation] = useState<string>("crime scene")
  const [selectedBook, setSelectedBook] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [currentSection, setCurrentSection] = useState<string | null>(null)

  // Add dialogue state
  const [showDialogue, setShowDialogue] = useState(false)
  const [currentCharacter, setCurrentCharacter] = useState<string>("")
  const [askedQuestions, setAskedQuestions] = useState<Set<string>>(new Set())
  const [dialogueHistory, setDialogueHistory] = useState<{ question: string; answer: string }[]>([])
  const [currentDialogueOptions, setCurrentDialogueOptions] = useState<DialogueOption[]>([])
  const [dialoguePath, setDialoguePath] = useState<DialogueOption[]>([])
  const [showPassport, setShowPassport] = useState(false)

  const locations = [
    { id: "crime scene", name: "Crime Scene" },
    { id: "police station", name: "Police Station" },
    { id: "morgue", name: "Morgue" },
    { id: "library", name: "Library" },
  ]

  // Define the policewoman dialogue tree
  const policewomanDialogue: DialogueOption[] = [
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
          followUp: [
            {
              id: "who-found-body",
              text: "Who found the body?",
              response:
                "The rescuer found the body. The victim himself called for help but died before help could arrive.",
              followUp: [],
            },
          ],
        },
        {
          id: "was-there-no-weapon",
          text: "Was there no weapon?",
          response: "Told you, there was no murder. Are you even listening?",
          followUp: [
            {
              id: "find-anything-crime-scene",
              text: "Did you find anything on the crime scene?",
              response:
                "Ah yes, we got lucky. He left this box of donuts untouched. Managed to rescue it before it goes to waste.",
              followUp: [
                {
                  id: "eating-donuts",
                  text: "You're eating donuts from the crime scene?!",
                  response: "Of course. Don't tell my boss. I don't want to share.",
                  followUp: [],
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
                  followUp: [],
                },
              ],
            },
          ],
        },
      ],
    },
  ]

  // Define the mortician dialogue tree (we'll implement this later)
  const morticianDialogue: DialogueOption[] = []

  useEffect(() => {
    // Reset dialogue options when character changes
    if (currentCharacter === "policewoman") {
      setCurrentDialogueOptions(policewomanDialogue)
    } else if (currentCharacter === "mortician") {
      setCurrentDialogueOptions(morticianDialogue)
    }
  }, [currentCharacter])

  const navigateTo = (location: string) => {
    setCurrentLocation(location)
    // Close any open dialogues when changing location
    setShowDialogue(false)
    if (onLocationChange) {
      onLocationChange(location)
    }
  }

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

  // Get current content based on book type and section
  const getCurrentContent = () => {
    if (!selectedBook) return null

    if (selectedBook.sections) {
      // For botany book with sections
      const section = selectedBook.sections.find((s: any) => s.id === currentSection)
      if (section && section.pages[currentPage]) {
        return section.pages[currentPage]
      }
      return null
    } else {
      // For regular books
      return selectedBook.pages[currentPage]
    }
  }

  // Get total pages for current view
  const getTotalPages = () => {
    if (!selectedBook) return 0

    if (selectedBook.sections && currentSection) {
      const section = selectedBook.sections.find((s: any) => s.id === currentSection)
      return section ? section.pages.length : 0
    } else {
      return selectedBook.pages.length
    }
  }

  // Dialogue functions
  const startDialogue = (character: string) => {
    setCurrentCharacter(character)
    setShowDialogue(true)
    setDialogueHistory([])

    // Set initial dialogue options based on character
    if (character === "policewoman") {
      setCurrentDialogueOptions(policewomanDialogue)
    } else if (character === "mortician") {
      setCurrentDialogueOptions(morticianDialogue)
    }

    setDialoguePath([])
  }

  const handleDialogueOption = (option: DialogueOption) => {
    // Mark this question as asked
    setAskedQuestions((prev) => new Set(prev).add(option.id))

    // Add to dialogue history
    setDialogueHistory((prev) => [...prev, { question: option.text, answer: option.response }])

    // Handle special actions
    if (option.action === "showPassport") {
      setShowPassport(true)
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
          setCurrentDialogueOptions(policewomanDialogue)
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
  }

  const closePassport = () => {
    setShowPassport(false)
  }

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

          {currentLocation === "police station" && (
            <div className="flex justify-center">
              <Image
                src="/images/murder-mystery/policewoman.webp"
                alt="Policewoman"
                width={300}
                height={300}
                className="rounded-lg shadow-lg cursor-pointer"
                onClick={() => startDialogue("policewoman")}
              />
              {!showDialogue && (
                <div className="absolute bottom-4 bg-black/70 px-3 py-1 rounded text-white text-sm">
                  Click to talk to the Policewoman
                </div>
              )}
            </div>
          )}

          {currentLocation === "morgue" && (
            <div className="flex justify-center">
              <Image
                src="/images/murder-mystery/mortician.webp"
                alt="Mortician"
                width={300}
                height={300}
                className="rounded-lg shadow-lg cursor-pointer"
                onClick={() => startDialogue("mortician")}
              />
              {!showDialogue && (
                <div className="absolute bottom-4 bg-black/70 px-3 py-1 rounded text-white text-sm">
                  Click to talk to the Mortician
                </div>
              )}
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

      {/* Dialogue Overlay */}
      {showDialogue && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col shadow-2xl border border-gray-700">
            {/* Dialogue Header */}
            <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-800">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={goBackInDialogue} className="text-gray-400 hover:text-white">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <h3 className="text-xl font-bold text-amber-300">
                  {currentCharacter === "policewoman" ? "Policewoman" : "Mortician"}
                </h3>
              </div>
              <Button variant="ghost" size="sm" onClick={closeDialogue} className="text-gray-400 hover:text-white">
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Dialogue Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Dialogue History */}
              {dialogueHistory.length > 0 && (
                <div className="mb-6 space-y-4">
                  {dialogueHistory.map((entry, index) => (
                    <div key={index} className="space-y-2">
                      <div className="bg-gray-800 p-3 rounded-lg text-gray-300 inline-block">
                        <span className="text-purple-300 font-semibold">You: </span>
                        {entry.question}
                      </div>
                      <div className="bg-gray-700 p-3 rounded-lg text-gray-300 inline-block ml-4">
                        <span className="text-amber-300 font-semibold">
                          {currentCharacter === "policewoman" ? "Policewoman: " : "Mortician: "}
                        </span>
                        {entry.answer}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Dialogue Options */}
              <div className="space-y-2">
                {currentDialogueOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleDialogueOption(option)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      askedQuestions.has(option.id)
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-700 text-purple-300 font-semibold hover:bg-gray-600"
                    }`}
                  >
                    {option.text}
                  </button>
                ))}
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
              <h3 className="text-xl font-bold text-amber-300">Victim's Passport</h3>
              <Button variant="ghost" size="sm" onClick={closePassport} className="text-gray-400 hover:text-white">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-6 flex justify-center">
              {/* Placeholder for passport image - will be replaced with actual image */}
              <div className="bg-gray-800 p-4 rounded border border-gray-700 w-full max-w-xs">
                <div className="text-center text-gray-400 mb-2">Passport</div>
                <div className="aspect-[3/4] bg-gray-700 rounded flex items-center justify-center">
                  <p className="text-gray-500">Passport Image Placeholder</p>
                </div>
                <div className="mt-4 space-y-2 text-sm">
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

      {/* Navigation Bar - Now at the bottom */}
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

      {/* Book Modal - Enhanced to look more like a book */}
      {selectedBook && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#2a2a2a] rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Book Header */}
            <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-[#1a1a1a]">
              <h3 className="text-xl font-bold text-amber-300">{selectedBook.title}</h3>
              <Button variant="ghost" size="sm" onClick={closeBook} className="text-gray-400 hover:text-white">
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Section Tabs for Botany Book */}
            {selectedBook.sections && (
              <div className="flex border-b border-gray-700">
                {selectedBook.sections.map((section: any) => (
                  <button
                    key={section.id}
                    className={`px-4 py-2 text-sm font-medium ${
                      currentSection === section.id
                        ? "bg-green-900/30 text-green-300 border-b-2 border-green-500"
                        : "text-gray-400 hover:text-white hover:bg-gray-700/30"
                    }`}
                    onClick={() => switchSection(section.id)}
                  >
                    {section.title}
                  </button>
                ))}
              </div>
            )}

            {/* Book Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-8 bg-[#252525] min-h-[300px] flex flex-col items-center">
                {/* Book Page Content */}
                <div className="max-w-md w-full bg-[#f5f5dc] text-gray-800 p-6 rounded shadow-md relative book-page">
                  {currentContent?.title && (
                    <h4 className="text-lg font-semibold text-center mb-4 text-gray-900 border-b border-gray-300 pb-2">
                      {currentContent.title}
                    </h4>
                  )}

                  {currentContent?.imageUrl && (
                    <div className="flex justify-center mb-4">
                      <div className="border border-gray-400 p-1 bg-white inline-block">
                        <Image
                          src={currentContent.imageUrl || "/placeholder.svg"}
                          alt="Book illustration"
                          width={200}
                          height={150}
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}

                  <div className="text-gray-700 whitespace-pre-line leading-relaxed font-serif">
                    {currentContent?.text}
                  </div>

                  {/* Page number */}
                  <div className="absolute bottom-2 right-2 text-gray-500 text-xs">{currentPage + 1}</div>
                </div>
              </div>
            </div>

            {/* Book Navigation */}
            <div className="p-4 border-t border-gray-700 bg-[#1a1a1a] flex justify-between items-center">
              <Button
                variant="outline"
                onClick={prevPage}
                disabled={currentPage === 0}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              <span className="text-gray-400 text-sm">
                Page {currentPage + 1} of {totalPages}
              </span>

              <Button
                variant="outline"
                onClick={nextPage}
                disabled={currentPage === totalPages - 1}
                className="flex items-center gap-1"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .book-page {
          background-image: linear-gradient(to right, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0) 5%, rgba(0,0,0,0) 95%, rgba(0,0,0,0.05) 100%);
        }
      `}</style>
    </div>
  )
}
