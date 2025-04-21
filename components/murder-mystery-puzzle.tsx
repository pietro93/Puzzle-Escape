"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { demonologyBook } from "@/data/books"
import Image from "next/image"
import { X, Book, MapPin } from "lucide-react"
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
          followUp: [
            {
              id: "devil-sent-me",
              text: "The Devil sent me here.",
              response: "Oh, did he now? Well, tell him I said 'hi'.",
              followUp: [],
            },
          ],
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
              id: "crime-scene-items",
              text: "Did you find anything on the crime scene?",
              response:
                "Ah yes, we got lucky. He left this box of donuts untouched. Managed to rescue it before it goes to waste",
              followUp: [
                {
                  id: "eating-donuts",
                  text: "You're eating donuts from the crime scene?!",
                  response: "Of course. Don't tell my boss. I don't want to share.",
                  followUp: [],
                },
              ],
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
        {
          id: "were-there-any-witnesses",
          text: "Where there any witnesses?",
          response: "Nope. resuce team arrived on site and found the body",
          condition: "asked-about-murder",
          followUp: [
            {
              id: "who-called-rescue",
              text: "Who called the rescue team?",
              response: "well, the victim himself. he called an ambulance but died before they arrived on site",
              followUp: [],
            },
            {
              id: "victim-alive",
              text: "Wait, so the victim was alive?",
              response: "d'huh. I told you there was no murder. I think he just felt ill and died. Totally natural",
              followUp: [],
            },
          ],
        },
        {
          id: "can-see-report-again",
          text: "Can I see that police report again?",
          response: "Here you go, but don't say I didn't warn you.",
          condition: "seen-police-report",
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
        {
          id: "can-see-passport-again",
          text: "Can I see that passport again?",
          response: "Here you go, but don't say I didn't warn you.",
          condition: "seen-passport",
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
  const showWitnessesOption = askedQuestions.has("tell-about-murder")
  const showPoliceReportAgainOption = askedQuestions.has("check-police-report")
  const showPassportAgainOption = askedQuestions.has("check-passport")

  const currentContent = getCurrentContent()
  const totalPages = getTotalPages()

  return (
    <div className="flex flex-col items-center space-y-4 relative pb-16">
      <h2 className="text-xl font-bold text-red-500">Murder Mystery</h2>
      {/* <p className="text-gray-300 mb-2">Explore locations to gather clues and solve the mystery.</p> */}

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
          {(currentLocation === "police station" || currentLocation === "morgue") && (
            <div className="flex flex-col">
              {/* Character Portrait and Speech Bubble */}
              <div className="flex flex-col items-center mb-2 px-4">
                <div className="w-40 h-40 relative">
                  <Image
                    src={
                      currentCharacter === "policewoman"
                        ? "/images/murder-mystery/policewoman.webp"
                        : "/images/murder-mystery/mortician.webp"
                    }
                    alt={currentCharacter}
                    width={160}
                    height={160}
                    className="rounded-lg border-2 border-gray-700"
                  />
                </div>

                {/* Speech Bubble */}
                <div className="mt-2 relative bg-gray-800 p-4 rounded-lg border border-gray-600 flex-1 min-h-[80px]">
                  <p className="font-pixel text-gray-200 text-sm">{typedText}</p>
                </div>
              </div>

              {/* Dialogue Options */}
              <div className="bg-gray-900/95 border-t-2 border-gray-700 p-4 rounded-t-lg">
                <div className="grid gap-2 max-h-[200px] overflow-y-auto">
                  {currentDialogueOptions
                    .filter((option) => {
                      // Conditionally render "Is there a police report?" option
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
              <div className="bg-gray-800 p-4 rounded border border-gray-700 w-full max-w-md">
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={closePoliceReport}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
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
                    <span className="text-gray-400">Victim:</span>
                    <span className="text-gray-300">Male, caucasian, early to mid 30s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Height:</span>
                    <span className="text-gray-300">5 ft 11 in / 1.80m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Weight:</span>
                    <span className="text-gray-300">165lbs / 75kg</span>
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
                  <div className="flex justify-between">
                    <span className="text-gray-400">Pending:</span>
                    <span className="text-gray-300">autopsy and toxicology report</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Notes:</span>
                    <span className="text-gray-300">
                      Victim found lying on their back, eyes closed. No signs of struggle or external wounds noted.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Passport Button */}
          {showPassport && (
            <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
              <div className="bg-gray-800 p-4 rounded border border-gray-700 w-full max-w-md">
                <div className="flex justify-end">
                  <Button variant="ghost" size="sm" onClick={closePassport} className="text-gray-400 hover:text-white">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
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
