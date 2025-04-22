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
  const [showVictimBody, setShowVictimBody] = useState(false)
  const [showAutopsyReport, setShowAutopsyReport] = useState(false)

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

  // Police Woman
  const policewomanDialogue = [
    {
      id: "initial-greeting",
      text: "Start",
      response: "Hey you! This is a restricted area. What are you doing here?",
      followUp: [
        {
          id: "who-are-you",
          text: "Who are you?",
          response: "Who am I? Who are YOU? Some make-believe detective?",
          followUp: [
            {
              id: "devil-sent-me",
              text: "The Devil sent me here.",
              response:
                "Oh, did he now? Well, tell him I said 'hi'. And that he still owes me five bucks from that poker game last Tuesday.",
              followUp: [],
            },
          ],
        },
        {
          id: "tell-about-murder",
          text: "Tell me about the murder.",
          response:
            "Murder? What murder? There was no murder. The victim died of natural causes. Just an accident, really. Happens all the time, ya know?",
          followUp: [
            {
              id: "what-natural-causes",
              text: "What natural causes?",
              response:
                "How would I know? Ask forensics. I just know there was no murder. And I'm not supposed to talk about it, so shhh!",
              followUp: [],
            },
            {
              id: "was-there-no-weapon",
              text: "Was there no weapon?",
              response: "Told you, there was no murder. Are you even listening? Maybe you need a hearing aid, gramps.",
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
                  response:
                    "Of course. Don't tell my boss. I don't want to share. Besides, they're evidence... of deliciousness!",
                  followUp: [],
                },
              ],
            },
            {
              id: "police-report",
              text: "Is there a police report?",
              response: "Yeah, I wrote it up. Not much to say though. Open and shut case of natural causes. Yawn.",
              condition: "exhausted-murder-questions",
              followUp: [
                {
                  id: "can-see-report",
                  text: "Can I see the report?",
                  response: "Sure, knock yourself out. It's about as thrilling as watching paint dry.",
                  followUp: [],
                  specialAction: () => {
                    setShowPoliceReport(true)
                    setLastAction("viewed-report")
                  },
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
              response: "I would assume so. I didn't bother to ask him, though.",
              followUp: [],
            },
            {
              id: "more-about-victim",
              text: "What else can you tell me about the victim?",
              response: "I have got nothing to tell. I'm not his biographer, you know.",
              followUp: [],
            },
            {
              id: "how-identify-victim",
              text: "How did you identify the victim?",
              response: "Oh, that was easy. He had his ID on him. Lucky for us, or we'd be calling John Doe.",
              followUp: [
                {
                  id: "can-see-passport",
                  text: "Can I see it?",
                  response: "Fine, but only if you promise to leave me alone. I'm on my break, you know.",
                  followUp: [],
                  specialAction: () => {
                    setShowPassport(true)
                    setLastAction("viewed-passport")
                  },
                },
              ],
            },
          ],
        },
        {
          id: "were-there-any-witnesses",
          text: "Where there any witnesses?",
          response: "Nope. rescue team arrived on site and found the body",
          condition: "asked-about-murder",
          followUp: [
            {
              id: "who-called-rescue",
              text: "Who called the rescue team?",
              response:
                "Well, the victim himself. He called an ambulance but died before they arrived on site. Talk about bad luck, eh?",
              followUp: [],
            },
            {
              id: "victim-alive",
              text: "Wait, so the victim was alive?",
              response:
                "D'huh. I told you there was no murder. I think he just felt ill and died. Totally natural. Happens all the time, ya know?",
              followUp: [],
            },
          ],
        },
        {
          id: "can-see-report-again",
          text: "Can I see that police report again?",
          response: "Here you go, but don't say I didn't warn you. It's about as thrilling as watching paint dry.",
          condition: "seen-police-report",
          followUp: [],
          specialAction: () => {
            setShowPoliceReport(true)
            setLastAction("viewed-report")
          },
        },
        {
          id: "can-see-passport-again",
          text: "Can I see that ID again?",
          response: "Here you go, but don't say I didn't warn you. It's not like it's gonna change anything.",
          condition: "seen-passport",
          followUp: [],
          specialAction: () => {
            setShowPassport(true)
            setLastAction("viewed-passport")
          },
        },
      ],
    },
  ]

  // Mortician
  const morticianDialogue = [
    {
      id: "initial-greeting",
      text: "Start",
      response: "Hmm? A visitor? How... unusual. What do you want?",
      followUp: [
        {
          id: "who-are-you",
          text: "Who are you?",
          response: "Name's Psychopompus. Psycho for short.",
          followUp: [
            {
              id: "hello-psycho",
              text: "Huh... hello, Psycho.",
              response: "...",
              followUp: [],
            },
          ],
        },
        {
          id: "tell-about-body",
          text: "What can you tell me about the body that was found by the lake?",
          response: "It's dead. Obviously.",
          followUp: [
            {
              id: "cause-of-death",
              text: "What was the cause of death?",
              response: "Anemia.",
              followUp: [
                {
                  id: "anemia-question",
                  text: "Anemia?",
                  response: "Low blood levels. Caused organ failure. A rather... pale affair.",
                  followUp: [],
                },
                {
                  id: "natural-question",
                  text: "Was it natural?",
                  response: "As natural as having almost no blood gets. A slow fade, like a dying ember.",
                  followUp: [
                    {
                      id: "what-no-blood",
                      text: "What do you mean almost no blood?",
                      response: "The body was almost completely void of blood when it was found.",
                      followUp: [],
                    },
                    {
                      id: "murder-question",
                      text: "Are you sure this wasn't murder?",
                      response: "Oh, I guess it could be. Not my concern.",
                      followUp: [],
                    },
                  ],
                },
              ],
            },
            {
              id: "can-see-body-initial",
              text: "Can I see the victim's body?",
              response: "No.",
              condition: "body-not-accessible",
              followUp: [],
            },
          ],
        },
        {
          id: "like-job",
          text: "Do you like your job?",
          response: "I enjoy the company. They're not demanding conversationalists.",
          condition: "body-not-accessible",
          followUp: [
            {
              id: "alone-with-corpses",
              text: "Aren't you alone with corpses all the time?",
              response: "As I said. I enjoy the company. They don't complain.",
              followUp: [
                {
                  id: "any-friends",
                  text: "Don't you have any friends?",
                  response: "In this line of work, the living are more trouble than they're worth.",
                  specialAction: () => setAskedAboutFriends(true),
                  followUp: [
                    {
                      id: "be-your-friend",
                      text: "I'll be your friend!",
                      response: "Hell no. Please leave me alone. I prefer my relationships... one-sided.",
                      condition: "asked-about-friends",
                      followUp: [
                        {
                          id: "hobbies",
                          text: "Do you have any hobbies?",
                          response: "Fondling dead people. Arranging them in pleasing poses. You know, the usual.",
                          specialAction: () => setAskedHobbies(true),
                          followUp: [],
                        },
                        {
                          id: "puzzle-games",
                          text: "Do you like puzzle games?",
                          response: "What am I, some kind of loser? I have a life, you know.",
                          specialAction: () => setAskedPuzzleGames(true),
                          followUp: [],
                        },
                        {
                          id: "unconditional-friendship",
                          text: "I am not leaving until you accept my unconditional love and friendship.",
                          response:
                            "Enough of this nonsense! I'll let you check the body, just leave me the HELL alone.",
                          condition: "asked-both-hobby-questions",
                          specialAction: () => setCanSeeBody(true),
                          followUp: [],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              id: "macabre-stuff",
              text: "You must have seen some pretty macabre stuff in here.",
              response: "Your face is a contender. But I've seen worse.",
              followUp: [],
            },
          ],
        },
        {
          id: "check-victim-body",
          text: "Let's check the victim's body.",
          response:
            "Fine. But don't touch anything. And don't tell anyone I showed you this. I'd rather not have to explain myself to the living.",
          condition: "can-see-body",
          followUp: [
            {
              id: "weird-signs",
              text: "What are those weird signs on the body?",
              response:
                "What weird signs? Probably tattoos or something. Kids these days have no respect for their own body.",
              followUp: [],
            },
            {
              id: "check-autopsy-report",
              text: "Can I check the autopsy report?",
              response: "Oh for fu--I mean sure, whatever.",
              followUp: [],
              specialAction: () => {
                setShowAutopsyReport(true)
                setLastAction("viewed-autopsy")
              },
            },
          ],
          specialAction: () => {
            setShowVictimBody(true)
            setLastAction("viewed-body")
          },
        },
        {
          id: "after-viewing-evidence",
          text: "...",
          response: "Are you done staring? I don't have all day for this nonsense.",
          condition: "after-viewing-evidence",
          followUp: [],
        },
      ],
    },
  ]

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
          // Filter options based on conditions
          if (opt.condition === "asked-about-friends") {
            return askedAboutFriends
          }
          if (opt.condition === "asked-both-hobby-questions") {
            return askedHobbies && askedPuzzleGames
          }
          return true
        }),
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
              if (opt.id === "after-viewing-evidence") {
                return (
                  lastAction === "viewed-body" ||
                  lastAction === "viewed-passport" ||
                  lastAction === "viewed-report" ||
                  lastAction === "viewed-autopsy"
                )
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

  useEffect(() => {
    // Automatically start dialogue when entering the police station or morgue
    if (currentLocation === "police station" || currentLocation === "morgue") {
      startDialogue(currentLocation === "police station" ? "policewoman" : "mortician")
    }
  }, [currentLocation])

  // Update dialogue options when canSeeBody changes
  useEffect(() => {
    if (currentCharacter === "mortician" && dialoguePath.length === 0) {
      setCurrentDialogueOptions(
        morticianDialogue[0].followUp.filter((opt) => {
          if (opt.id === "like-job" || opt.id === "can-see-body-initial") {
            return !canSeeBody
          }
          if (opt.id === "check-victim-body") {
            return canSeeBody
          }
          if (opt.id === "after-viewing-evidence") {
            return (
              lastAction === "viewed-body" ||
              lastAction === "viewed-passport" ||
              lastAction === "viewed-report" ||
              lastAction === "viewed-autopsy"
            )
          }
          return true
        }) || [],
      )
    }
  }, [canSeeBody, lastAction, currentCharacter, dialoguePath])

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
          {(currentLocation === "police station" || currentLocation === "morgue") && (
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
                      if (option.id === "check-victim-body") {
                        return canSeeBody
                      }
                      if (option.id === "after-viewing-evidence") {
                        return (
                          lastAction === "viewed-body" ||
                          lastAction === "viewed-passport" ||
                          lastAction === "viewed-report" ||
                          lastAction === "viewed-autopsy"
                        )
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
                <div className="flex justify-end">
                  <Button variant="ghost" size="sm" onClick={closePassport} className="text-gray-400 hover:text-white">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-center text-gray-400 mb-2 font-pixel">ID</div>
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
                        src={`/images/murder-mystery/victim-${
                          currentBodyPart === "head"
                            ? "head"
                            : currentBodyPart === "leftHand"
                              ? "left-hand"
                              : currentBodyPart === "rightHand"
                                ? "right-hand"
                                : currentBodyPart === "leftLeg"
                                  ? "left-leg"
                                  : "right-leg"
                        }.webp`}
                        alt="Victim's Head"
                        width={200}
                        height={200}
                        className="pixelated"
                      />
                    )}
                    {currentBodyPart === "leftHand" && (
                      <Image
                        src={`/images/murder-mystery/victim-${
                          currentBodyPart === "head"
                            ? "head"
                            : currentBodyPart === "leftHand"
                              ? "left-hand"
                              : currentBodyPart === "rightHand"
                                ? "right-hand"
                                : currentBodyPart === "leftLeg"
                                  ? "left-leg"
                                  : "right-leg"
                        }.webp`}
                        alt="Victim's Left Hand"
                        width={200}
                        height={200}
                        className="pixelated"
                      />
                    )}
                    {currentBodyPart === "rightHand" && (
                      <Image
                        src={`/images/murder-mystery/victim-${
                          currentBodyPart === "head"
                            ? "head"
                            : currentBodyPart === "leftHand"
                              ? "left-hand"
                              : currentBodyPart === "rightHand"
                                ? "right-hand"
                                : currentBodyPart === "leftLeg"
                                  ? "left-leg"
                                  : "right-leg"
                        }.webp`}
                        alt="Victim's Right Hand"
                        width={200}
                        height={200}
                        className="pixelated"
                      />
                    )}
                    {currentBodyPart === "leftLeg" && (
                      <Image
                        src={`/images/murder-mystery/victim-${
                          currentBodyPart === "head"
                            ? "head"
                            : currentBodyPart === "leftHand"
                              ? "left-hand"
                              : currentBodyPart === "rightHand"
                                ? "right-hand"
                                : currentBodyPart === "leftLeg"
                                  ? "left-leg"
                                  : "right-leg"
                        }.webp`}
                        alt="Victim's Left Leg"
                        width={200}
                        height={200}
                        className="pixelated"
                      />
                    )}
                    {currentBodyPart === "rightLeg" && (
                      <Image
                        src={`/images/murder-mystery/victim-${
                          currentBodyPart === "head"
                            ? "head"
                            : currentBodyPart === "leftHand"
                              ? "left-hand"
                              : currentBodyPart === "rightHand"
                                ? "right-hand"
                                : currentBodyPart === "leftLeg"
                                  ? "left-leg"
                                  : "right-leg"
                        }.webp`}
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
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={closeAutopsyReport}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-center text-gray-400 mb-2 font-pixel">Autopsy Report</div>
                <div className="mt-4 space-y-2 text-sm font-pixel">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Name:</span>
                    <span className="text-gray-300">Declan Tremblay</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Age:</span>
                    <span className="text-gray-300">Early 30s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Eyes:</span>
                    <span className="text-gray-300">Brown</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Hair:</span>
                    <span className="text-gray-300">Brown</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Clinical summary:</span>
                    <span className="text-gray-300">
                      The decedent was found dead following a suspected organ failure attributed to complications from
                      anemia. Prior to death, the individual had called emergency services reporting feeling unwell.
                      Upon arrival, paramedics found the victim deceased. There was no history or evidence of trauma or
                      injury. The clinical picture is consistent with severe anemia leading to multiorgan compromise and
                      failure.
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">External examination:</span>
                    <span className="text-gray-300">
                      Height: 168 cm The body exhibited pallor with a slight reddish tint to the skin, consistent with
                      anemia-related hypoxia and circulatory changes. Notably, ecchymoses were present on the arms and
                      legs, indicative of minor subcutaneous bleeding or bruising without associated trauma. The body
                      showed signs of reduced blood volume, with visibly low levels of blood noted at the scene. No
                      external injuries, wounds, or signs of violence were observed.
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Toxicology:</span>
                    <span className="text-gray-300">
                      Comprehensive toxicological analysis revealed no evidence of poison, venom, or other toxic
                      substances contributing to death.
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Summary:</span>
                    <span className="text-gray-300">
                      The external and clinical findings support death due to organ failure secondary to complications
                      of anemia, with no indication of external trauma or intoxication. The presence of ecchymoses may
                      reflect underlying hematologic fragility or coagulopathy associated with the anemia. This aligns
                      with known fatal outcomes in severe anemia cases complicated by multiorgan dysfunction.
                    </span>
                  </div>
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
