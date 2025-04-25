"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { demonologyBook } from "@/data/books"
import { botanyBook } from "@/data/books"
import { puppiesBook } from "@/data/books/puppies"
import { genghisKhanBook } from "@/data/books/genghis-khan"
import { serialKillersBook } from "@/data/books/serial-killers"

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

interface MurderMysteryPuzzleProps {
  onSolve?: () => void
  onLocationChange?: (location: string) => void
  currentQuestion?: string
}

// Define dialogue option type
interface DialogueOption {
  id: string
  text: string
  response: string
  followUp: DialogueOption[]
  condition?: string
  specialAction?: () => void
}

export const policewomanDialogue: DialogueOption[] = [
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
                specialAction: () => {}, // This will be handled in the component
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
                specialAction: () => {}, // This will be handled in the component
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
        specialAction: () => {}, // This will be handled in the component
      },
      {
        id: "can-see-passport-again",
        text: "Can I see that ID again?",
        response: "Here you go, but don't say I didn't warn you. It's not like it's gonna change anything.",
        condition: "seen-passport",
        followUp: [],
        specialAction: () => {}, // This will be handled in the component
      },
    ],
  },
]

export const morticianDialogue: DialogueOption[] = [
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
        id: "be-your-friend",
        text: "I'll be your friend!",
        response: "Hell no. Please leave me alone. I prefer my relationships... one-sided.",
        condition: "asked-about-friends",
        followUp: [
          {
            id: "hobbies",
            text: "Do you have any hobbies?",
            response: "Fondling dead people. Arranging them in pleasing poses. You know, the usual.",
            specialAction: () => {}, // This will be handled in the component
            followUp: [],
          },
          {
            id: "puzzle-games",
            text: "Do you like puzzle games?",
            response: "What am I, some kind of loser? I have a life, you know.",
            specialAction: () => {}, // This will be handled in the component
            followUp: [],
          },
        ],
      },
      {
        id: "unconditional-friendship",
        text: "I am not leaving until you accept my unconditional love and friendship.",
        response: "Enough of this nonsense! I'll let you check the body, just leave me the HELL alone.",
        condition: "asked-both-hobby-questions",
        specialAction: () => {}, // This will be handled in the component
        followUp: [],
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
                specialAction: () => {}, // This will be handled in the component
                followUp: [],
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
            specialAction: () => {}, // This will be handled in the component
          },
        ],
        specialAction: () => {}, // This will be handled in the component
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

export const librarianDialogue: DialogueOption[] = [
  {
    id: "initial-greeting",
    text: "Start",
    response: "...",
    followUp: [
      {
        id: "who-are-you",
        text: "Who are you?",
        response: "Shhhhhhhhh!!!",
        followUp: [],
      },
      {
        id: "investigating-murder",
        text: "I'm investigating a murder.",
        response: "This is a library!",
        followUp: [
          {
            id: "reading-for-case",
            text: "Do you have any reading that could help me with my case?",
            response: 'I\'m afraid your "case" is a lost cause.',
            followUp: [],
          },
        ],
      },
      {
        id: "looking-for-book",
        text: "I'm looking for a book.",
        response: "Color me impressed.",
        followUp: [
          {
            id: "whats-your-favorite",
            text: "What's your favorite?",
            response: "This one never fails to put a smile on my face.",
            followUp: [
              {
                id: "read-favorite-book",
                text: 'Read book: "Absolutely True* Facts About Genghis Khan (*Not Actually True)"',
                response: "",
                followUp: [],
                specialAction: () => {}, // This will be handled in the component
              },
            ],
          },
          {
            id: "book-about-puppies",
            text: "I need a book about puppies.",
            response: "I think this is appropriate for your mental age.",
            followUp: [
              {
                id: "read-puppies-book",
                text: 'Read book: "Adorable Photos of Cutesy-cute Puppies for Kids and the Mentally Impaired"',
                response: "",
                followUp: [],
                specialAction: () => {}, // This will be handled in the component
              },
            ],
          },
          {
            id: "book-about-serial-killers",
            text: "I need a book about serial killers.",
            response: "Oh, another creep. Don't get *too* inspired. Serialized murder is a respectful art.",
            followUp: [
              {
                id: "read-serial-killers-book",
                text: 'Read book: "Penchant For Murder: Everyone and Their Mother Wants To Kill These Days"',
                response: "",
                followUp: [],
                specialAction: () => {}, // This will be handled in the component
              },
            ],
          },
          {
            id: "book-about-botany",
            text: "I need a book about botany.",
            response: "Looking for creative ways to get high huh? Just leave the frogs alone.",
            followUp: [
              {
                id: "read-botany-book",
                text: 'Read book: "Plant Identification Manual"',
                response: "",
                followUp: [],
                specialAction: () => {}, // This will be handled in the component
              },
            ],
          },
          {
            id: "book-about-blood-diseases",
            text: "I need a book about blood diseases.",
            response: "You do look awful. But I would recommend going to see a doctor.",
            condition: "knows-about-anemia",
            followUp: [
              {
                id: "read-blood-diseases-book",
                text: 'Read Book: "Blood diseases: Causes, Signs and Symptoms"',
                response: "",
                followUp: [],
                specialAction: () => {}, // This will be handled in the component
              },
            ],
          },
          {
            id: "book-about-demons",
            text: "I need a book about demons and evil creatures.",
            response: "Another worshipper huh? If you summon the Devil, tell him he owes me 5,000 rupees and a kitten.",
            condition: "knows-about-body-marks",
            followUp: [
              {
                id: "read-demons-book",
                text: 'Read Book: "Monsters, Demons and Other Evil Creatures from Around the World"',
                response: "",
                followUp: [],
                specialAction: () => {}, // This will be handled in the component
              },
            ],
          },
        ],
      },
    ],
  },
]

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
        book = genghisKhanBook
        break
      case "puppies":
        book = puppiesBook
        break
      case "serial-killers":
        book = serialKillersBook
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
