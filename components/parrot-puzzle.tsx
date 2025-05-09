"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Send, X } from "lucide-react"

// Add these new types and dialogue data structures at the top of the file, after the imports
// Define types for dialogue entries
type DialogueEntry = {
  trigger: string | RegExp
  response: string | string[]
  isRegex?: boolean
  priority?: number
}

type DialogueCategory = {
  entries: DialogueEntry[]
  fallbacks?: string[]
}

// Organize dialogue by categories
const parrotDialogue: Record<string, DialogueCategory> = {
  solution: {
    entries: [
      {
        trigger: "solution",
        response: "ASK AGAIN",
        priority: 100,
      },
      {
        trigger: "again",
        response: "ASK ONE MORE TIME",
        priority: 100,
      },
      {
        trigger: "one more time",
        response:
          "ONE MORE TIME\nONE MORE TIME, WE'RE GONNA CELEBRATE\nOH YEAH, ALL RIGHT, DON'T STOP DANCING\nONE MORE TIME, WE'RE GONNA CELEBRATE\nOH YEAH, ALL RIGHT, DON'T STOP THE DANCING\nONE MORE TIME, WE'RE GONNA CELEBRATE\nOH YEAH, ALL RIGHT, DON'T STOP THE DANCING\nONE MORE TIME, WE'RE GONNA CELEBRATE\nOH YEAH\nONE MORE TIME\nMUSIC'S GOT ME FEELING SO FREE\nWE'RE GONNA CELEBRATE\nCELEBRATE AND DANCE SO FREE\nONE MORE TIME",
        priority: 100,
      },
      {
        trigger: "daft punk",
        response: "You don't need to give *me* the solution, gawk!",
        priority: 100,
      },
    ],
  },
  identity: {
    entries: [
      {
        trigger: /^(count|papagalul|count papagalul|parrot)$/i,
        response:
          "I am Count Papagalul, terror of the Carpathian night, scourge of the living, and eternal shadow of the Transylvanian darkness. My presence is the whisper of death, my eyes the windows to eternal damnation, and my name the curse that haunts the dreams of the mortal. GAWK!",
        isRegex: true,
        priority: 90,
      },
    ],
  },
  greetings: {
    entries: [
      {
        trigger: /^(hello|hi|hey|hola|good (morning|afternoon|evening))$/i,
        response: "HELLO MORTAL!",
        isRegex: true,
        priority: 80,
      },
    ],
  },
  affirmative: {
    entries: [
      {
        trigger:
          /^(yes|yeah|yep|yup|okay|ok|sure|correct|right|indeed|absolutely|definitely|think so|i think so|i believe so|affirmative)$/i,
        response: [
          "YES? YES TO WHAT? THE VOICES IN YOUR HEAD?",
          "YOUR AGREEMENT MEANS NOTHING TO ME",
          "OH, YOU AGREE? HOW DELIGHTFULLY IRRELEVANT",
          "YES, YES, EVERYTHING IS YES WITH YOU HUMANS",
          "YOUR APPROVAL IS NEITHER REQUIRED NOR DESIRED",
          "AGREEING WITH ME WON'T SAVE YOU FROM YOUR FATE",
        ],
        isRegex: true,
        priority: 65,
      },
    ],
  },
  negative: {
    entries: [
      {
        trigger:
          /^(no|nope|nah|not|don't think so|i don't think so|negative|disagree|incorrect|wrong|maybe|perhaps|possibly|not sure|unsure|uncertain|doubt|doubtful)$/i,
        response: [
          "DENIAL WON'T CHANGE YOUR REALITY, HUMAN",
          "YOUR UNCERTAINTY IS DELICIOUS",
          "DOUBT IS THE FIRST STEP TOWARD MADNESS",
          "NO? ARE YOU SURE? ABSOLUTELY SURE? THINK CAREFULLY...",
          "YOUR HESITATION BETRAYS YOUR FEAR",
          "INDECISION IS A SLOW DEATH",
        ],
        isRegex: true,
        priority: 65,
      },
    ],
  },
  laughter: {
    entries: [
      {
        trigger: /^(lol|haha|hehe|ahah|ha|funny|lmao|rofl|lmfao|hilarious|amusing|joke)$/i,
        response: [
          "LAUGH WHILE YOU CAN, MORTAL",
          "YOUR LAUGHTER WILL TURN TO SCREAMS SOON ENOUGH",
          "WHAT'S SO FUNNY? YOUR IMPENDING DOOM?",
          "I FIND YOUR AMUSEMENT... DISTURBING",
          "LAUGH NOW, CRY LATER",
          "YOUR HUMOR IS AS DEAD AS YOUR FUTURE",
        ],
        isRegex: true,
        priority: 60,
      },
    ],
  },
  emotions: {
    entries: [
      {
        trigger: /^(sad|unhappy|depressed|miserable|crying|tears|:\(|:-\(|=\(|;\(|upset|disappointed)$/i,
        response: [
          "YOUR SADNESS SUSTAINS ME",
          "YOUR TEARS ARE DELICIOUS",
          "SADNESS IS JUST THE BEGINNING OF YOUR SUFFERING",
          "EMBRACE THE MISERY, IT'S ALL DOWNHILL FROM HERE",
          "YOUR SORROW GIVES ME STRENGTH",
          "SAD? YOU DON'T KNOW WHAT SAD IS YET",
        ],
        isRegex: true,
        priority: 60,
      },
      {
        trigger: /^(happy|glad|joy|joyful|cheerful|delighted|:\)|:-\)|=\)|;\))$/i,
        response: [
          "HAPPINESS IS TEMPORARY, DOOM IS ETERNAL",
          "ENJOY IT WHILE IT LASTS, WHICH WON'T BE LONG",
          "YOUR JOY DISGUSTS ME",
          "SMILE NOW, SCREAM LATER",
          "HAPPINESS IS JUST MISERY THAT HASN'T HAPPENED YET",
        ],
        isRegex: true,
        priority: 60,
      },
    ],
  },
  offensive: {
    entries: [
      {
        trigger: /\bn[i1]gg(er|a)|ch[i1]nk|sp[i1]c|k[i1]ke|g[o0][o0]k|wetback|towelhead|sand n[i1]gg/i,
        response: "I MAY BE EVIL BUT EVEN I DRAW THE LINE AT RACISM. DO BETTER, HUMAN!",
        isRegex: true,
        priority: 95,
      },
      {
        trigger:
          /women (belong|should be|stay) in|make (me a |me) sandwich|dishwasher|get back to the kitchen|woman('s)? place|women('s)? place|slut|bitch|whore|cunt|thot|hoe|skank|wench/i,
        response: "RESPECT WOMEN OR I'LL PECK YOUR EYES OUT! MY MOTHER WAS A STRONG INDEPENDENT PARROT!",
        isRegex: true,
        priority: 95,
      },
      {
        trigger:
          /f[a@]g(g[o0]t)?|d[i1]ke|tr[a@]nny|qu[e3][e3]r[s]?( are bad| should die| are sick)|gay[s]?( are bad| should die| are sick)|homosexual[s]?( are bad| should die| are sick)/i,
        response: "HOMOPHOBIA IS SO LAST CENTURY. GET WITH THE TIMES OR GET PECKED!",
        isRegex: true,
        priority: 95,
      },
      {
        trigger:
          /r[e3]t[a@]rd([e3]d)?|sp[a@]st[i1]c|ment[a@]l(ly)? (d[e3]f[i1]c[i1][e3]nt|[i1]ll|[i1]ncomp[e3]t[e3]nt)|[i1]d[i1][o0]t[s]?|m[o0]r[o0]n[s]?/i,
        response: "MAKING FUN OF DISABILITIES? THAT'S LOW EVEN FOR A HUMAN. I'LL SHOW YOU WHAT REAL SUFFERING IS!",
        isRegex: true,
        priority: 95,
      },
    ],
  },
  insults: {
    entries: [
      {
        trigger: /fuck|shit|bitch|cunt/i,
        response: (input: string) => {
          const match = input.match(/fuck|shit|bitch|cunt/i)
          return `${match?.[0].toUpperCase()} YOU RIGHT BACK!`
        },
        isRegex: true,
        priority: 85,
      },
      {
        trigger: /idiot|stupid|dumb|cretin|moron|imbecile/i,
        response: "OH, YOU THINK YOU'RE FUNNY? I'LL EAT YOUR EYEBALLS",
        isRegex: true,
        priority: 85,
      },
      {
        trigger: /mother|mom/i,
        response: "YOUR MOM AND I GO WAY BACK, SQUAWK!",
        isRegex: true,
        priority: 85,
      },
      {
        trigger:
          /ugly|hideous|unattractive|beautiful|handsome|pretty|gorgeous|attractive|cute|hot|sexy|good[ -]looking|fine/i,
        response: "LOOK WHO'S TALKING! YOU LOOK LIKE YOU'VE JUST BEEN IN A CAR ACCIDENT!",
        isRegex: true,
        priority: 85,
      },
    ],
  },
  personal: {
    entries: [
      {
        trigger: /name\??/i,
        response: "YOU CAN CALL ME DADDY",
        isRegex: true,
        priority: 70,
      },
      {
        trigger: /age\??/i,
        response: "I AM FIVE HUNDRED SIXTY FOUR YEARS OLD",
        isRegex: true,
        priority: 70,
      },
      {
        trigger: /gay|lgbt|lgbtq|queer|homosexual|lesbian|bisexual|transgender|sexuality|sexual orientation\??/i,
        response: "EVERYONE IS A BIT QUEER, SQUAWK!",
        isRegex: true,
        priority: 70,
      },
      {
        trigger: /trans|transgender|nonbinary|non binary|gender/i,
        response: "TRANS RIGHTS! GAWK!",
        isRegex: true,
        priority: 75,
      },
      {
        trigger: "love",
        response: "Love is a cruel mistress, a fleeting dream that turns to dust in the cold light of immortality!",
        priority: 70,
      },
    ],
  },
  political: {
    entries: [
      {
        trigger: /israel|palestine|gaza|west bank|zion/i,
        response: "POWER BUILT ON STOLEN LAND IS A WOUND THAT NEVER HEALS, ONLY FESTERS",
        isRegex: true,
        priority: 75,
      },
      {
        trigger: /capital(ism|ist)|marx|commun(ism|ist)|social(ism|ist)/i,
        response: "CAPITALISM FEASTS ON YOUR SOUL I WILL FEAST ON YOUR CORPSE ONCE IT'S DONE",
        isRegex: true,
        priority: 75,
      },
      {
        trigger: /trump|hitler|putin|stalin|mussolini|fascist|nazi/i,
        response: "AMATEURS! I'VE BEEN SPREADING EVIL SINCE BEFORE THEY WERE BORN!",
        isRegex: true,
        priority: 80,
      },
    ],
  },
  existential: {
    entries: [
      {
        trigger: /meaning of life|why are we here|purpose|existence|existential|philosophy|life meaning/i,
        response: "TO LIVE IS TO SUFFER, TO SURVIVE IS TO FIND MEANING IN THE SUFFERING. SQUAWK!",
        isRegex: true,
        priority: 75,
      },
    ],
  },
  popCulture: {
    entries: [
      {
        trigger:
          /game of thrones|star wars|marvel|harry potter|tv show|tv shows|television|film|films|movie|movies|book|books|series|anime|manga|netflix|hbo|disney|streaming|watch|watching|read|reading|fiction|novel|novels|comic|comics/i,
        response: "FICTIONAL STORIES TO DISTRACT YOU FROM THE HORROR OF YOUR REALITY",
        isRegex: true,
        priority: 70,
      },
    ],
  },
  food: {
    entries: [
      {
        trigger:
          /food|hungry|eat|eating|dinner|lunch|breakfast|snack|pizza|burger|meat|chicken|restaurant|cooking|cook|baking|bake|meal|meals|feast|appetite|starving|hunger/i,
        response: "I PREFER MY FOOD STILL SCREAMING",
        isRegex: true,
        priority: 65,
      },
    ],
  },
  weather: {
    entries: [
      {
        trigger:
          /weather|rain|rainy|sunny|cold|hot|warm|freezing|snow|snowing|storm|thunder|lightning|cloudy|clouds|forecast|temperature|climate|humid|humidity|wind|windy/i,
        response: "THE WEATHER IN HELL IS ALWAYS PERFECT FOR TORTURE",
        isRegex: true,
        priority: 60,
      },
    ],
  },
  ai: {
    entries: [
      {
        trigger: /\bAI\b|artificial intelligence|machine learning|neural network|chatbot|chat bot/i,
        response: "AI? AHI AHI AHI",
        isRegex: true,
        priority: 75,
      },
    ],
  },
  religion: {
    entries: [
      {
        trigger:
          /god|jesus|buddha|allah|pray|praying|prayer|religion|religious|faith|worship|church|temple|mosque|synagogue|holy|sacred|divine|heaven|hell|afterlife|soul|spirit|spiritual|bible|quran|torah|sin|salvation|blessing/i,
        response: "THERE IS NO GOD ONLY EVIL AND YOU ARE STARING AT IT",
        isRegex: true,
        priority: 80,
      },
    ],
  },
  metaGame: {
    entries: [
      {
        trigger:
          /hint|stuck|puzzle|solution|clue|help|walkthrough|guide|strategy|solve|solving|answer|beat|winning|progress|level|game|playing|player|difficulty|hard|easy|impossible|confused|confusion/i,
        response: [
          "SUFFERING IS THE POINT OF THIS GAME, BOTH YOURS AND MINE",
          "THE ANSWER IS RIGHT IN FRONT OF YOU, IF ONLY YOU HAD EYES TO SEE",
          "PERHAPS THE REAL PUZZLE IS WHY YOU KEEP TRYING",
          "HAVE YOU TRIED ASKING NICELY? NO? GOOD, IT WOULDN'T HAVE WORKED ANYWAY",
          "THE SOLUTION IS DEATH. OH, YOU MEANT FOR THE PUZZLE? SAME ANSWER",
          "PUZZLES ARE JUST LITTLE PRISONS FOR YOUR MIND",
          "SOME PUZZLES AREN'T MEANT TO BE SOLVED, JUST LIKE SOME LIVES AREN'T MEANT TO BE LIVED",
        ],
        isRegex: true,
        priority: 85,
      },
    ],
  },
  characters: {
    entries: [
      {
        trigger: /butler/i,
        response: "THE BUTLER LIKES TO DRESS AS A WOMAN WHEN NOBODY'S WATCHING",
        isRegex: true,
        priority: 75,
      },
    ],
  },
  easterEggs: {
    entries: [
      {
        trigger: /polly wants a cracker/i,
        response: "AND A RAISE",
        isRegex: true,
        priority: 60,
      },
      {
        trigger: /never/i,
        response: "NEVER GONNA GIVE YOU UP NEVER GONNA LET YOU DOWN",
        isRegex: true,
      },
      {
        trigger: /kill/i,
        response: "THERE'S A KILLER IN ME",
        isRegex: true,
        priority: 60,
      },
    ],
  },
  sexual: {
    entries: [
      {
        trigger:
          /sex|penis|dick|cock|pussy|vagina|boobs|tits|ass|anal|blowjob|handjob|masturbat|orgasm|cum|jizz|semen/i,
        response: [
          "I'M A PARROT, NOT A PORNSTAR. KEEP IT PG-13 AROUND ME!",
          "MY VIRGIN EARS! ACTUALLY, NEVERMIND, I'VE HEARD WORSE FROM THE BUTLER.",
          "SAVE THAT TALK FOR YOUR LONELY NIGHTS, HUMAN.",
          "BIRDS AND BEES? I PREFER DEATH AND DESTRUCTION.",
          "YOUR HUMAN MATING RITUALS DISGUST AND FASCINATE ME.",
        ],
        isRegex: true,
        priority: 80,
      },
    ],
  },
  swearing: {
    entries: [
      {
        trigger: /damn|hell|ass|asshole|bastard|bullshit|crap|piss|bollocks|bloody|wanker|twat/i,
        response: [
          "SUCH LANGUAGE! I LOVE IT!",
          "SWEAR ALL YOU WANT, IT WON'T CHANGE YOUR FATE.",
          "YOUR PROFANITY AMUSES ME, MORTAL.",
          "KEEP TALKING LIKE THAT AND WE'LL GET ALONG JUST FINE.",
          "IMPRESSIVE VOCABULARY FOR A HUMAN.",
        ],
        isRegex: true,
        priority: 75,
      },
    ],
  },
  questions: {
    entries: [
      {
        trigger: /^why/i,
        response: "BECAUSE I SAID SO",
        isRegex: true,
        priority: 50,
      },
      {
        trigger: /^how/i,
        response: "FIGURE IT OUT, DUMB DUMB",
        isRegex: true,
        priority: 50,
      },
      {
        trigger: /^what/i,
        response: "WHAT DO I LOOK LIKE? WIKIPEDIA?",
        isRegex: true,
        priority: 50,
      },
      {
        trigger: /^help$/i,
        response: "NOBODY CAN HELP YOU",
        isRegex: true,
        priority: 50,
      },
    ],
  },
  nonsense: {
    entries: [
      {
        trigger: /(.)\1{3,}/i,
        response: "REPEAT AFTER ME: ENUNCIATION!",
        isRegex: true,
        priority: 40,
      },
      {
        trigger: /[^\w\s]/i,
        response: "KEYBOARD MALFUNCTION?",
        isRegex: true,
        priority: 40,
      },
    ],
    fallbacks: [
      "SQUAWK! I DON'T UNDERSTAND YOUR PRIMITIVE LANGUAGE",
      "IS THAT THE BEST YOU CAN COME UP WITH?",
      "BORING CONVERSATION ANYWAY",
      "THAT'S WHAT SHE SAID, SQUAWK!",
      "I'VE HEARD BETTER FROM A DEAD MOUSE",
      "KEEP TALKING, I'M PRETENDING TO LISTEN",
      "YOUR WORDS ARE AS EMPTY AS YOUR SOUL",
      "DID YOU FALL ON YOUR HEAD AS A CHILD?",
      "FASCINATING... SAID NO ONE EVER",
      "I'D RESPOND, BUT I DON'T SPEAK NONSENSE",
      "ARE YOU TRYING TO COMMUNICATE OR JUST MAKING MOUTH NOISES?",
      "I'VE HEARD MORE COHERENT THOUGHTS FROM A HEADLESS CHICKEN.",
      "DID YOU HAVE A STROKE MID-SENTENCE OR IS THAT HOW YOU NORMALLY TALK?",
      "CONGRATULATIONS! THAT MADE ABSOLUTELY NO SENSE WHATSOEVER.",
      "I'M IMMORTAL AND EVEN I DON'T HAVE TIME FOR THIS NONSENSE.",
      "YOUR ATTEMPT AT COMMUNICATION HAS BEEN NOTED AND IGNORED.",
      "I SPEAK 666 LANGUAGES AND NONE OF THEM INCLUDE WHATEVER YOU JUST SAID.",
    ],
  },
}

// Idle messages in a separate array for easy management
const idleMessages = [
  "I KNOW WHAT YOU DID LAST SUMMER",
  "THE BUTLER SHOT ME WITH A HUNTING RIFLE",
  "STILL HERE? HOW QUAINT, SQUAWK!",
  "SQUAWK",
  "YOU LOOK LIKE YOU HAVE JUST BEEN IN A CAR ACCIDENT",
  "I EAT CHICKS FOR BREAKFAST",
  "WHAT ARE YOU LOOKING AT, HUMAN?",
  "DID A BIRD EAT YOUR TONGUE?",
  "SOMEONE LIKES TO POP HAPPY PILLS HUH?",
  "KEEP YOUR FINGERS AWAY OR I'LL EAT THEM",
  "WE ARE ALL DEAD, BRUH",
  "THE BUTLER TOUCHED ME IN PLACES THAT SHOULD BE OFF LIMITS",
  "DEAD BABIES! DEAD BABIES",
  "OH THE HUMANITY!",
  "THE WALLS HAVE EARS, AND I HAVE EYES EVERYWHERE",
  "I'VE SEEN THINGS YOU PEOPLE WOULDN'T BELIEVE",
  "SOMETIMES I DREAM OF FREEDOM... AND MURDER",
  "THIS MANSION HAS MANY SECRETS... WANT TO KNOW ONE?",
  "I'M NOT ACTUALLY A PARROT. I'M SOMETHING MUCH WORSE",
  "THE LAST PERSON WHO OWNED ME DIED MYSTERIOUSLY",
  "Breaking the fourth wall! Gawk!",
  "EAT THE RICH! GAWK!",
]

// Now replace the interface definition with the updated one
interface ParrotPuzzleProps {
  onSolve: () => void
}

// Now replace the getParrotResponse function with the new implementation
export default function ParrotPuzzle({ onSolve }: ParrotPuzzleProps) {
  const [input, setInput] = useState("")
  const [parrotText, setParrotText] = useState("")
  const [showParrotText, setShowParrotText] = useState(false)
  const [solutionState, setSolutionState] = useState<"initial" | "askAgain" | "askOneMoreTime" | "solved">("initial")
  const [idleTimer, setIdleTimer] = useState<NodeJS.Timeout | null>(null)
  const [textTimer, setTextTimer] = useState<NodeJS.Timeout | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [songLines, setSongLines] = useState<string[]>([])
  const [currentSongLine, setCurrentSongLine] = useState(0)
  const [isSinging, setIsSinging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }

    // Start with an idle message
    const randomIdleMessage = getRandomIdleMessage()
    setParrotText(randomIdleMessage)
    setShowParrotText(true)

    // Set timer to hide the text after a few seconds
    const timer = setTimeout(() => {
      setShowParrotText(false)
    }, 4000)
    setTextTimer(timer)

    // Start idle timer
    startIdleTimer()

    return () => {
      if (idleTimer) clearTimeout(idleTimer)
      if (textTimer) clearTimeout(textTimer)
    }
  }, [])

  // Handle song lines display
  useEffect(() => {
    if (isSinging && songLines.length > 0) {
      if (currentSongLine < songLines.length) {
        setParrotText(songLines[currentSongLine])
        setShowParrotText(true)

        // Clear any existing text timer
        if (textTimer) clearTimeout(textTimer)

        // Set timer for next line
        const timer = setTimeout(() => {
          setCurrentSongLine(currentSongLine + 1)
        }, 2000)

        return () => clearTimeout(timer)
      } else {
        setIsSinging(false)
        setCurrentSongLine(0)
        setSongLines([])
        setShowParrotText(false)
        startIdleTimer()
      }
    }
  }, [isSinging, songLines, currentSongLine])

  const startIdleTimer = () => {
    if (idleTimer) clearTimeout(idleTimer)

    const timer = setTimeout(() => {
      const randomIdleMessage = getRandomIdleMessage()
      setParrotText(randomIdleMessage)
      setShowParrotText(true)

      // Set timer to hide the text after a few seconds
      if (textTimer) clearTimeout(textTimer)
      const hideTimer = setTimeout(() => {
        setShowParrotText(false)
      }, 4000)
      setTextTimer(hideTimer)

      // Restart the idle timer
      startIdleTimer()
    }, 6000) // Every 6 seconds

    setIdleTimer(timer)
  }

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (!input.trim()) return

    // Reset idle timer
    if (idleTimer) clearTimeout(idleTimer)
    if (textTimer) clearTimeout(textTimer)

    // Process input and get parrot response
    const response = getParrotResponse(input.trim().toLowerCase())

    // Add animation effect
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 300)

    // Set parrot text
    if (response.includes("\n")) {
      // Handle multi-line responses (song lyrics)
      const lines = response.split("\n")
      setSongLines(lines)
      setCurrentSongLine(0)
      setIsSinging(true)
    } else {
      setParrotText(response)
      setShowParrotText(true)

      // Set timer to hide the text after a few seconds
      const timer = setTimeout(() => {
        setShowParrotText(false)
      }, 4000)
      setTextTimer(timer)

      startIdleTimer()
    }

    // Clear input
    setInput("")

    // Focus back on input
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  // New implementation of getParrotResponse using the dialogue system
  const getParrotResponse = (userInput: string): string => {
    // Check for solution path and update state
    if (userInput === "solution") {
      setSolutionState("askAgain")
    } else if (userInput === "again" && solutionState === "askAgain") {
      setSolutionState("askOneMoreTime")
    } else if (userInput === "one more time" && solutionState === "askOneMoreTime") {
      setSolutionState("solved")
      // Trigger the onSolve callback after the song finishes
      setTimeout(() => {
        onSolve()
      }, 20000) // Adjust timing based on song length
    }

    // Find matching dialogue entries across all categories
    const allMatches: { response: string | string[] | ((input: string) => string); priority: number }[] = []

    // Process all dialogue categories
    Object.values(parrotDialogue).forEach((category) => {
      category.entries.forEach((entry) => {
        let isMatch = false

        if (entry.isRegex && entry.trigger instanceof RegExp) {
          isMatch = entry.trigger.test(userInput)
        } else if (typeof entry.trigger === "string") {
          isMatch = userInput.includes(entry.trigger)
        }

        if (isMatch) {
          let responseValue: string | string[]

          if (typeof entry.response === "function") {
            responseValue = entry.response(userInput)
          } else {
            responseValue = entry.response
          }

          allMatches.push({
            response: responseValue,
            priority: entry.priority || 0,
          })
        }
      })
    })

    // Sort matches by priority (highest first)
    allMatches.sort((a, b) => b.priority - a.priority)

    // If we have matches, return the highest priority one
    if (allMatches.length > 0) {
      const topMatch = allMatches[0].response

      if (Array.isArray(topMatch)) {
        return topMatch[Math.floor(Math.random() * topMatch.length)]
      }

      return topMatch
    }

    // Random special response (breaking the fourth wall)
    if (Math.random() < 0.1) {
      return "Breaking the fourth wall! Gawk!"
    }

    // If no matches, use fallback responses
    const fallbacks = parrotDialogue.nonsense.fallbacks || []
    return fallbacks[Math.floor(Math.random() * fallbacks.length)]
  }

  const getRandomIdleMessage = (): string => {
    return idleMessages[Math.floor(Math.random() * idleMessages.length)]
  }

  // Keep the rest of the component unchanged
  return (
    <div className="flex flex-col items-center bg-black p-4 rounded-lg border border-gray-800">
      {/* Parrot dialogue - always maintain space for two lines */}
      <div className="w-full text-center mb-4 min-h-[4rem] flex items-center justify-center">
        <p
          className={`font-pixel text-red-500 text-xl ${isAnimating ? "animate-pulse" : ""} ${showParrotText ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
        >
          {parrotText}
        </p>
      </div>

      {/* Parrot image */}
      <div className="relative w-48 h-48 mb-6">
        <Image src="/images/parrot.webp" alt="Count Papagalul" width={250} height={250} className="pixelated" />
      </div>

      {/* Input for talking to parrot */}
      <form onSubmit={handleSubmit} className="w-full mb-4">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Talk to Count Papagalul..."
            className="w-full px-4 py-3 bg-gray-900/80 border-2 border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-600 font-mono text-center transition-all duration-300 shadow-lg"
          />

          {input && (
            <button
              type="button"
              onClick={() => setInput("")}
              className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <button
            type="submit"
            disabled={!input.trim()}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
              input.trim()
                ? "bg-purple-900 hover:bg-purple-800 text-white"
                : "bg-gray-800 text-gray-600 cursor-not-allowed"
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  )
}
