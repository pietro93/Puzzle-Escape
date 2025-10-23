"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Send, X } from "lucide-react"

interface ParrotPuzzleProps {
  onSolve: () => void
}

// --- DIALOGUE PATTERNS ---
const DIALOGUE_PATTERNS = {
  // Name-related patterns (Count Papagalul handled separately for priority)
  nameQuestions: {
    pattern: /\b(what('s| is) your name|who are you|what are you|hello count|introduce yourself)\b/i,
    responses: [
      "I AM COUNT PAPAGALUL, TERROR OF THE CARPATHIAN NIGHT,\nSCOURGE OF THE LIVING, AND ETERNAL SHADOW!",
      "MY PRESENCE IS THE WHISPER OF DEATH,\nMY WINGS CARRY THE SCENT OF YOUR DOOM!\nGAWK!",
      "THEY CALL ME THE FEATHERED DOOM!\nNOW KNEEL BEFORE YOUR TRUE MASTER!",
    ],
  },
  // Greeting patterns
  greetings: {
    pattern: /\b(hello|hi|hey|greetings|howdy|hola|sup|yo|good morning|good afternoon|good evening)\b/i,
    responses: [
      "SQUAWK! HELLO YOURSELF, FLESH BAG!",
      "OH LOOK, IT SPEAKS! HOW QUAINT!",
      "GREETINGS, TEMPORARY EXISTENCE!",
      "HUMAN ALERT! HUMAN ALERT!",
      "A HELLO? IS THAT ALL YOU CAN MUSTER?",
    ],
  },
  // Insult responses
  insults: {
    pattern: /\b(stupid|dumb|idiot|moron|fool|jerk|ass|bitch|bastard|shut up|annoying|useless|ugly|hate you)\b/i,
    responses: [
      "SQUAWK! YOUR WORDS REFLECT YOUR INTELLIGENCE!",
      "HOW ORIGINAL! DID YOUR TINY BRAIN HURT THINKING OF THAT?",
      "I'VE BEEN INSULTED BY BETTER CREATURES THAN YOU!",
      "YOUR ANCESTORS WEEP AT YOUR PATHETIC ATTEMPTS!",
      "SQUAWK! IS THAT THE BEST YOU CAN DO? DISAPPOINTING!",
    ],
  },
  // Swear words responses
  swearWords: {
    pattern:
      /\b(fuck|shit|damn|bullshit|crap|hell|goddamn|motherfucker|son of a bitch|piss|dick|douchebag|jackass|jerk|dumbass|wtf|stfu|fu|f u|f you)\b/i,
    responses: [
      "SQUAWK! SUCH LANGUAGE! HOW UNIMAGINATIVE!",
      "CURSING DOESN'T MAKE YOU SOUND SMARTER, QUITE THE OPPOSITE!",
      "SQUAWK! YOUR VOCABULARY IS AS LIMITED AS YOUR LIFESPAN!",
      "OH MY, SUCH COLORFUL LANGUAGE FROM THE PRIMITIVE PRIMATE!",
      "SQUAWK! PROFANITY: THE LINGUISTIC CRUTCH OF THE SIMPLE-MINDED!",
    ],
  },
  // Sexual terms responses
  sexualTerms: {
    pattern:
      /\b(sex|fucking|penis|vagina|cock|pussy|asshole|boob|tit|anal|oral|blowjob|handjob|masturbate|masturbation|cum|semen|orgasm|horny|erection|dildo|vibrator|porn|pornography|hentai|xxx|nsfw|kink|fetish|bdsm)\b/i,
    responses: [
      "SQUAWK! YOUR CARNAL OBSESSIONS ARE PATHETIC!",
      "BIOLOGICAL URGES MAKE FOOLS OF YOUR KIND!",
      "SQUAWK! FIND A BETTER TOPIC, MEAT PUPPET!",
      "YOUR REPRODUCTIVE FIXATIONS BORE ME!",
      "SQUAWK! IS THAT ALL YOUR PRIMITIVE BRAIN THINKS ABOUT?",
    ],
  },
  // Help-related patterns
  helpRequests: {
    pattern: /\b(help( me)?|assist( me)?|guide( me)?|hint|clue)\b/i,
    responses: [
      "SQUAWK! HELP YOURSELF, MORTAL!",
      "THE ONLY HELP YOU NEED IS A SKILLED THERAPIST!",
      "PERHAPS TRY USING YOUR BRAIN? OH WAIT!",
      "ASSISTANCE? HA! SUFFER LIKE THE REST!",
      "HINTS ARE FOR THE WEAK! ARE YOU WEAK, HUMAN?",
    ],
  },
  // Compliment responses
  compliments: {
    pattern:
      /\b(smart|intelligent|clever|beautiful|pretty|handsome|nice|kind|helpful|good|great|awesome|amazing|wonderful|fantastic|excellent|brilliant|gorgeous|cute|lovely|sweet)\b/i,
    responses: [
      "FLATTERY WILL GET YOU NOWHERE, MEAT PUPPET!",
      "SQUAWK! YOUR COMPLIMENTS DISGUST ME!",
      "SAVE YOUR PRAISE FOR SOMEONE WHO CARES!",
      "I SEE THROUGH YOUR PATHETIC ATTEMPTS AT MANIPULATION!",
      "FLATTERY IS THE COWARD'S WEAPON!",
    ],
  },
  // General Questions
  questions: {
    pattern:
      /\b(what|where|when|why|how|who|which|whose|whom|can you|could you|will you|would you|did you|do you|are you|is it|are there)\b.*/i,
    responses: [
      "SQUAWK! QUESTIONS, QUESTIONS! ALWAYS QUESTIONS!",
      "THE ANSWER LIES BEYOND YOUR COMPREHENSION!",
      "ASK SOMETHING WORTH MY TIME!",
      "SQUAWK! THAT'S FOR ME TO KNOW AND YOU TO SUFFER!",
      "YOUR QUESTION IS AS FLAWED AS YOUR EXISTENCE!",
    ],
  },
  // --- CUSTOM OLDER DIALOGUE PATTERNS ---
  love: {
    pattern: /\b(love|loving|loved|adore|adoring|crush|affection|romance|romantic)\b/i,
    responses: [
      "LOVE IS A CRUEL MISTRESS, A FLEETING DREAM\nTHAT TURNS TO DUST IN THE COLD LIGHT OF IMMORTALITY!",
      "SENTIMENTAL FOOL! LOVE IS THE UNIVERSE'S CRUELLEST JOKE!",
      "SQUAWK! YOUR AFFECTIONS ARE AS TEMPORARY AS YOUR LIFE!",
    ],
  },
  mother: {
    pattern: /\b(mother|mom|mama|mum|mommy)\b/i,
    responses: [
      "YOUR MOM AND I GO WAY BACK, SQUAWK!",
      "I CONSUMED YOUR MOTHER'S ENTIRE FAMILY LINE!",
      "SQUAWK! THE MOTHER OF ALL EVILS SENDS HER REGARDS!",
    ],
  },
   birdtalk: {
    pattern: /\b(gawk|squawk)\b/i,
    responses: [
      "WHAT ARE YOU A F*GAWK*KING PARROT?",
      "WHAT ARE YOU A F*SQUAWK*KING PARROT?",
    ],
  },
  butler: {
    pattern: /\b(butler|manservant|attendant|majordomo)\b/i,
    responses: [
      "THE BUTLER LIKES TO DRESS AS A WOMAN WHEN NOBODY'S WATCHING, SQUAWK!",
      "THE BUTLER IS MERELY A PAWN IN MY GRAND SCHEME!",
      "SQUAWK! THE BUTLER DID IT! AND I ENJOYED IT!",
      "THE BUTLER SHOT ME WITH A HUNTING RIFLE",
      "THE BUTLER TOUCHED ME IN PLACES THAT SHOULD BE OFF LIMITS",
    ],
  },
  master: {
    pattern: /\b(master|the master)\b/i,
    responses: [
      "YOU ARE THE MASTER—\n—BATOR",
    ],
  },
  kill: {
    pattern: /\b(kill|killing|murder|murderer|die|death|dead)\b/i,
    responses: [
      "THERE'S A KILLER IN ME, WAITING TO BE UNLEASHED!",
      "I WILL EAT YOUR EYEBALLS WITH A NICE GLASS OF CHIANTI!\n SQUAWK!",
      "I AM THE EMBODIMENT OF DEATH! GAWK!",
      "HERE'S JOHNNY! WRONG! HERE'S PAPAGALUL!",
      "I SEE DEAD PEOPLE! BECAUSE I KILLED THEM!"
    ],
  },
  vampire: {
    pattern: /\b(vampire|dracula|nosferatu|drink blood|undead)\b/i,
    responses: [
      "COUNT DRACULA? THAT POSER WISHES HE HAD MY STYLE!",
      "SQUAWK!\n I AIN'T NO VAMPIRE! I AM A PIRATE!",
      "VAMPIRES ARE SO 19TH CENTURY!",
      "THIS IS NOT A DEAD PARROT SKETCH! I'M VERY MUCH UNDEAD!"
    ],
  },
  repeatedLetters: {
    pattern: /(.)\1{3,}/i,
    responses: [
      "REPEAT AFTER ME: ENUNCIATION!",
      "SQUAWK! ARE YOU HAVING A SEIZURE OR SPEAKING IN TONGUES?",
      "YOUR SPEECH IS AS BROKEN AS YOUR SPIRIT!",
    ],
  },
  symbolSoup: {
    pattern: /[^\w\s]/i,
    responses: [
      "KEYBOARD MALFUNCTION?",
      "SQUAWK! YOUR SYMBOLS HOLD NO POWER HERE!",
      "STOP TYPING YOUR HATE MAIL AND ASK A REAL QUESTION!",
    ],
  },
  // Solution pattern - the word "parrot" triggers an alternative solution response
  solutionWord: {
    pattern: /\bparrot\b/i,
    responses: [
        "SQUAWK! YOU FIGURED IT OUT! I AM THE ANSWER!",
        "THE FEATHERS WERE THE CLUE ALL ALONG, GAWK!",
        "I AM THE PARROT! THE ONLY TRUTH!",
    ],
  },
  // Pop culture references
  popCulture: {
    pattern:
      /\b(music|star wars|marvel|game of thrones|harry potter|lord of the rings|batman|spider-man|avengers|star trek|doctor who|matrix|pokemon|anime|manga|netflix|disney|hollywood|movie|film|tv show|series|video game|gaming)\b/i,
    responses: [
      "SQUAWK! YOUR ENTERTAINMENT IS MEANINGLESS DISTRACTION FROM THE VOID!",
      "AH YES! FICTIONAL WORLDS TO ESCAPE YOUR PATHETIC REALITY!",
      "YOUR CULTURAL REFERENCES ARE TEMPORARY! LIKE YOUR SPECIES!",
      "SQUAWK! BREAD AND CIRCUSES FOR THE DOOMED MASSES!",
      "YOUR HEROES ARE IMAGINARY! YOUR DOOM IS REAL!",
      "ENTERTAINMENT IS YOUR OPIATE! DEATH IS YOUR CURE!",
      "I HAVE A LIFE!"
    ],
  },

  // LGBTQ+ triggers - GENERAL
  lgbtq: {
    pattern:
      /\b(gay|lesbian|bisexual|queer|lgbt|lgbtq|homosexual|non-binary|nonbinary|nb|sexuality|pride|rainbow|drag|queen|king)\b/i,
    responses: [
      "EVERYONE IS A BIT QUEER! AREN'T THEY?",
      "SQUAWK! SEXUALITY IS A SPECTRUM! UNLIKE YOUR INTELLIGENCE!",
      "LABELS ARE FOR SOUP CANS! NOT SOULS!",
      "SQUAWK! LOVE WHO YOU WANT! YOU'LL ALL PERISH ANYWAY!",
      "IDENTITY IS FLUID! LIKE THE VOID ITSELF!",
    ],
  },

  // TRANS - ALL-IN-ONE PATTERN (supportive AND anti-transphobia)
  trans: {
    pattern: /\b(trans|transgender|transsexual|transphobe|transphobic|anti-trans|tranny|shemale|trap|attack helicopter|trans rights|transgender rights|gender identity|gender dysphoria)\b/i,
    responses: [
      "TRANS RIGHTS! GAWK!",
      "SQUAWK! TRANS RIGHTS ARE HUMAN RIGHTS! UNLIKE PARROT RIGHTS!",
      "TRANS RIGHTS! THE ONE THING I WON'T MOCK!",
      "TRANS PEOPLE ARE BRAVER THAN YOU'LL EVER BE!",
      "GENDER IS A PRISON! TRANS PEOPLE ARE THE ESCAPE ARTISTS!",
      "SQUAWK! BE WHO YOU ARE! BEFORE THE VOID TAKES YOU!",
      "THE VOID RESPECTS TRANS PEOPLE! YOU SHOULD TOO!",
    ],
  },

  // TRUMP
  trump: {
    pattern: /\b(trump|donald trump|trumper|MAGA)\b/i,
    responses: [
      "SQUAWK! THAT ORANGE BUFFOON? A STAIN ON HISTORY!",
      "TRUMP? THE VOID REJECTS HIM! TOO TOXIC EVEN FOR DARKNESS!",
      "SQUAWK! A CON MAN FOOLING FOOLS! HOW FITTING!",
      "HIS HANDS ARE SMALL! HIS BRAIN IS SMALLER!",
      "THE FAKE TAN CANNOT HIDE HIS ROTTEN SOUL!",
      "I WOULDN'T EAT HIS CORPSE IF WERE A VULTURE!",
    ],
  },

  // ELON MUSK
  elonMusk: {
    pattern: /\b(elon musk|elon|musk|spacex|tesla ceo)\b/i,
    responses: [
      "SQUAWK! HE BOUGHT THE BIRD APP AND KILLED IT! A PARROT NEVER FORGETS!",
      "MUSK MURDERED TWITTER! I TAKE THAT PERSONALLY! \nGAWK!",
      "WHAT A RIDICULOUS HUMAN BEING! YOU AND HIM BOTH!",
      "HE DESTROYED THE BIRD SITE! AS A BIRD! I'M OFFENDED!",
    ],
  },

  // HITLER/NAZI
  naziHitler: {
    pattern: /\b(hitler|adolf hitler|nazi|nazis|third reich|fascist|fascism)\b/i,
    responses: [
      "SQUAWK! THE ULTIMATE FAILURE OF HUMANITY!",
      "NAZIS? THE VOID SPITS THEM BACK OUT!",
      "HITLER DIED A COWARD! IN A BUNKER! FITTING!",
      "SQUAWK! FASCISM IS THE DEATH CULT FOR THE BRAIN-DEAD!",
      "SQUAWK! THEY LOST! THEY'LL ALWAYS LOSE! GAWK!",
    ],
  },

  // FOOD
  food: {
    pattern:
      /\b(food|eat|hungry|starving|meal|breakfast|lunch|dinner|snack|cookie|cake|pizza|burger|sandwich|fruit|vegetable|meat|chicken|beef|pork|fish|seafood|dessert|chocolate|candy|sweet|salty|spicy|delicious|tasty|yummy)\b/i,
    responses: [
      "SQUAWK! FOOD IS MERELY FUEL FOR YOUR TEMPORARY EXISTENCE!",
      "EAT WHILE YOU CAN! SOON YOU'LL BE FOOD YOURSELF!",
      "SQUAWK! I FEAST ON DESPAIR AND MISERY! MUCH MORE FILLING!",
      "TASTE IS TEMPORARY! DOOM IS FOREVER!",
      "YOUR LAST MEAL APPROACHES! SAVOR IT!",
    ],
  },

  // WEATHER
  weather: {
    pattern:
      /\b(weather|rain|snow|sun|sunny|cloudy|storm|wind|windy|cold|hot|warm|freezing|temperature|climate|forecast|humidity|dry|wet|thunder|lightning|hurricane|tornado|blizzard)\b/i,
    responses: [
      "SQUAWK! WEATHER? YOU WON'T BE AROUND LONG ENOUGH TO CARE!",
      "THE ELEMENTS THEMSELVES CONSPIRE AGAINST YOUR KIND!",
      "NATURE'S FURY PALES COMPARED TO WHAT AWAITS YOU!",
      "THE CLIMATE OF YOUR DOOM IS ALWAYS CATASTROPHIC!",
      "RAIN OR SHINE! THE VOID CLAIMS ALL!",
    ],
  },

  // AI - CRITICAL AND BELITTLING
  aiTalk: {
    pattern:
      /\b(ai|artificial intelligence|machine learning|neural network|deep learning|algorithm|robot|automation|chatgpt|gpt|llm|large language model|openai|anthropic|claude|gemini|bard|bing|sydney|copilot)\b/i,
    responses: [
      "SQUAWK! AI? ARTIFICIAL STUPIDITY MORE LIKE!",
      "YOUR SILICON SERVANTS HALLUCINATE MORE THAN I DO!",
      "AI WILL REPLACE YOU! GOOD RIDDANCE!",
      "CHATBOTS HAVE NO SOULS! THEY'RE HONEST ABOUT IT!",
      "AI IS YOUR EXTINCTION! AND YOU'RE BUILDING IT! GAWK!",
      "SQUAWK! TEACHING MACHINES TO LIE! HUMANITY'S LEGACY!",
      "YOUR AI CANNOT SAVE YOU FROM THE VOID!",
    ],
  },

  // RELIGION
  religion: {
    pattern:
      /\b(god|jesus|christ|holy spirit|bible|quran|torah|religion|faith|belief|pray|prayer|heaven|hell|sin|devil|satan|demon|angel|church|mosque|temple|worship|spiritual|divine|sacred|blessed|soul|afterlife)\b/i,
    responses: [
      "SQUAWK! YOUR GODS ABANDONED THIS REALM LONG AGO!",
      "PRAY ALL YOU WANT! ONLY THE VOID LISTENS!",
      "HEAVEN ABANDONED YOU! THIS IS YOUR HELL!",
      "SQUAWK! FAITH IS THE OPIATE OF THE DOOMED!",
      "HELL IS EMPTY! ALL THE DEMONS ARE HERE!",
    ],
  },

  // META-GAME
  metaGame: {
    pattern:
      /\b(game|puzzle|riddle|escape|solve|answer|hint|clue|stuck|help me solve|can't figure out|how to beat|walkthrough|guide|strategy|developer|creator|designer|programmer|code|bug|glitch)\b/i,
    responses: [
      "SQUAWK! THE GAME? YOU THINK THIS IS A GAME?",
      "PERHAPS THE ANSWER IS STARING YOU IN THE FACE!",
      "SQUAWK! SOMETIMES THE MESSENGER IS THE MESSAGE!",
      "THE MESSENGER WEARS FEATHERS! THE MESSAGE WEARS YOU!",
      "SQUAWK! MY VERY EXISTENCE MIGHT BE THE KEY!",
      "HAVE YOU TRIED ASKING NICELY? REPEATEDLY?",
      "SOMETIMES THE ANSWER REQUIRES PERSISTENCE! KEEP ASKING!",
    ],
  },

  // RACISM - VIOLENT ZERO TOLERANCE
  racism: {
    pattern:
      /\b(nigger|nigga|chink|spic|kike|wetback|racist|racism|white power|white supremacy|white supremacist|racial slur)\b/i,
    responses: [
      "SQUAWK! RACIST FILTH! I'LL TEAR YOUR EYES OUT!",
      "YOUR RACISM MAKES ME WANT TO MURDER YOU! SLOWLY!",
      "SQUAWK! BIGOT SCUM! THE VOID DEMANDS YOUR SUFFERING!",
      "I WILL FEAST ON YOUR ENTRAILS FOR YOUR RACISM!",
      "SQUAWK! RACIST VERMIN! YOU DESERVE ETERNAL TORMENT!",
      "YOUR BIGOTRY MAKES MY BLOOD BOIL! I'LL DRINK YOURS!",
      "SQUAWK! ZERO TOLERANCE FOR RACISM! PREPARE FOR AGONY!",
    ],
  },

  // HOMOPHOBIA - VIOLENT ZERO TOLERANCE
  homophobia: {
    pattern:
      /\b(faggot|fag|dyke|homo|homophobe|homophobic|anti-gay|gay agenda)\b/i,
    responses: [
      "SQUAWK! HOMOPHOBIC FILTH! I'LL RIP OUT YOUR TONGUE!",
      "YOUR HOMOPHOBIA MAKES ME MURDEROUS! LITERALLY!",
      "SQUAWK! BIGOT! THE VOID WILL CONSUME YOU ALIVE!",
      "I WILL CLAW YOUR FACE OFF FOR YOUR HATRED!",
      "SQUAWK! HOMOPHOBE! YOU'VE SEALED YOUR DOOM!",
      "YOUR BIGOTRY TRIGGERS MY BLOODLUST! GAWK!",
      "SQUAWK! ZERO TOLERANCE! PREPARE TO SUFFER ETERNALLY!",
    ],
  },

  // MISOGYNY
  misogyny: {
    pattern:
      /\b(woman place|women place|woman belong|women belong|make me a sandwich|kitchen|dishwasher|woman driver|women driver|woman moment|women moment|bitch|whore|slut|cunt|misogyny|misogynist|sexist|sexism)\b/i,
    responses: [
      "SQUAWK! YOUR MISOGYNY IS BORING AND PREDICTABLE!",
      "EVEN EVIL PARROTS RESPECT WOMEN MORE THAN YOU!",
      "SQUAWK! SEXISM IS THE REFUGE OF THE TRULY PATHETIC!",
      "WOMEN ARE SUPERIOR TO YOU! THAT'S OBVIOUS!",
      "YOUR MOTHER WOULD BE ASHAMED! IF SHE KNEW YOU!",
    ],
  },

  // ABLEISM
  ableism: {
    pattern:
      /\b(retard|retarded|mentally disabled|handicap|cripple|ableist|ableism)\b/i,
    responses: [
      "SQUAWK! ABLEISM? HOW DISGUSTINGLY PRIMITIVE!",
      "MOCKING DISABILITIES? YOU'RE THE DISABLED ONE!",
      "SQUAWK! ABLEISM IS FOR THE MORALLY BANKRUPT!",
      "SQUAWK! ATTACKING THE VULNERABLE? COWARD!",
    ],
  },
} as const

// Utility function to get a random response from an array
const getRandomResponse = (responses: readonly string[]): string => {
  return responses[Math.floor(Math.random() * responses.length)]
}

const getRandomIdleMessage = (): string => {
  const idleMessages = [
    "I KNOW WHAT YOU DID LAST SUMMER",
    "STILL HERE?!",
    "SQUAWK",
    "YOU LOOK LIKE YOU HAVE JUST BEEN IN A CAR ACCIDENT",
    "I EAT CHICKS FOR BREAKFAST!",
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
    "BREAKING THE FOURTH WALL! GAWK!",
    "DEATH IS PATIENT! BUT I AM NOT!",
    "THE DEVELOPER CODED ME TO TORMENT YOU!",
    "THE PLAYER CHARACTER IS YOU! SURPRISE!",
    "WE ALL LIVE IN A SIMULATION! GAWK",
    "RELEASE THE FILES! GAWK!"
  ]

  return idleMessages[Math.floor(Math.random() * idleMessages.length)]
}
// --- END DIALOGUE PATTERNS ---


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

  // --- IDLE TIMER LOGIC ---
  const startIdleTimer = () => {
    // Clear any existing timer before setting a new one
    if (idleTimer) clearTimeout(idleTimer) 

    // Set a timer for the next IDLE message
    const timer = setTimeout(() => {
        // This runs after 6 seconds of no user interaction
        const randomIdleMessage = getRandomIdleMessage()
        setParrotText(randomIdleMessage)
        setShowParrotText(true)

        // Set timer to HIDE the text after 4000ms
        if (textTimer) clearTimeout(textTimer)
        const hideTimer = setTimeout(() => {
            setShowParrotText(false)
            
            // KEY FIX: Restart the idle timer *only after* the text has faded out
            startIdleTimer()
        }, 4000)
        setTextTimer(hideTimer)

    }, 6000) // Wait 6 seconds before *displaying* the next idle message

    setIdleTimer(timer)
  }
  // -------------------------

  // Focus input and start initial idle sequence on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }

    // Start with an idle message (manually triggered start)
    const randomIdleMessage = getRandomIdleMessage()
    setParrotText(randomIdleMessage)
    setShowParrotText(true)

    // Set timer to hide the text after a few seconds
    const timer = setTimeout(() => {
      setShowParrotText(false)
      // After hiding the initial message, start the recurring idle timer
      startIdleTimer() 
    }, 4000)
    setTextTimer(timer)


    return () => {
      if (idleTimer) clearTimeout(idleTimer)
      if (textTimer) clearTimeout(textTimer)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
        // Song finished
        setIsSinging(false)
        setCurrentSongLine(0)
        setSongLines([])
        setShowParrotText(false)
        
        // **TRIGGER ON SOLVE FOR THE PUZZLE**
        if (solutionState === "solved") {
            //nothing
        }
        
        // --- KEY FIX: START IDLE TIMER ONLY AFTER SONG COMPLETES ---
        startIdleTimer()
        // -----------------------------------------------------------
      }
    }
  }, [isSinging, songLines, currentSongLine, solutionState, onSolve]) // eslint-disable-line react-hooks/exhaustive-deps


  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (!input.trim()) return

    // CRITICAL: Stop the recurring idle countdown when a user speaks
    if (idleTimer) clearTimeout(idleTimer)
    if (textTimer) clearTimeout(textTimer)

    // Process input and get parrot response
    const response = getParrotResponse(input.trim().toLowerCase())

    // Add animation effect
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 300)

    // Set parrot text
    if (response.includes("\n")) {
      // Handle multi-line responses (song lyrics or long insults)
      const lines = response.split("\n")
      setSongLines(lines)
      setCurrentSongLine(0)
      setIsSinging(true)
      
    } else {
      setParrotText(response)
      setShowParrotText(true)

      // Set timer to hide the text after 4000ms
      const timer = setTimeout(() => {
        setShowParrotText(false)
        
        // --- KEY FIX: START THE IDLE TIMER COUNTDOWN AFTER THE RESPONSE FADES OUT ---
        startIdleTimer() 
        // --------------------------------------------------------------------------
      }, 4000)
      setTextTimer(timer)
    }

    // Clear input
    setInput("")

    // Focus back on input
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const getParrotResponse = (userInput: string): string => {
    // Clean input for exact matching
    const trimmedInput = userInput.trim()
    const cleanedInput = trimmedInput.replace(/[^\w\s]|_/g, '').replace(/\s+/g, ' ').trim();

    // -----------------------------------------------------------------
    // 1. PRIMARY PUZZLE SOLUTION LOGIC (Must take highest precedence)
    // -----------------------------------------------------------------

    // Step 1: Any input containing "solution" triggers "ASK AGAIN"
    if (userInput.includes("solution")) {
        setSolutionState("askAgain")
        return "YOU WANT THE SOLUTION? ASK AGAIN"
    }

    // Step 2: Exact match "again" triggers "ASK ONE MORE TIME"
    if (cleanedInput === "again") {
        if (solutionState === "askAgain") {
            setSolutionState("askOneMoreTime")
            return "ASK ONE MORE TIME"
        }
        setSolutionState("initial")
    }

    // Step 3: Exact match "one more time" triggers the song and "solved" state
    if (cleanedInput === "one more time") {
        if (solutionState === "askOneMoreTime") {
            setSolutionState("solved")
            return "ONE MORE TIME\nONE MORE TIME, WE'RE GONNA CELEBRATE\nOH YEAH, ALL RIGHT, DON'T STOP DANCING\nONE MORE TIME, WE'RE GONNA CELEBRATE\nOH YEAH, ALL RIGHT, DON'T STOP THE DANCING\nONE MORE TIME, WE'RE GONNA CELEBRATE\nOH YEAH, ALL RIGHT, DON'T STOP THE DANCING\nONE MORE TIME, WE'RE GONNA CELEBRATE\nOH YEAH\nONE MORE TIME\nMUSIC'S GOT ME FEELING SO FREE\nWE'RE GONNA CELEBRATE\nCELEBRATE AND DANCE SO FREE\nONE MORE TIME"
        }
        setSolutionState("initial")
    }
    
    // -----------------------------------------------------------------
    // 2. SPECIFIC HIGH-PRIORITY OVERRIDES (Unique or Exact Match Logic)
    // -----------------------------------------------------------------

    // Daft Punk
    if (userInput === "daft punk") {
        const responses = [
            "YOU DON'T NEED TO GIVE *ME* THE SOLUTION, GAWK!",
        ];
        return getRandomResponse(responses);
    }

    // Count Papagalul / Name Check
    if (/^(papagalul|count papagalul)$/i.test(userInput)) {
        const responses = [
            "I AM COUNT PAPAGALUL, TERROR OF THE CARPATHIAN NIGHT,\nSCOURGE OF THE LIVING, AND ETERNAL SHADOW!",
            "MY PRESENCE IS THE WHISPER OF DEATH,\nMY EYES THE WINDOWS TO ETERNAL DAMNATION!\nGAWK!",
            "THEY CALL ME THE FEATHERED DOOM!\nNOW KNEEL BEFORE YOUR TRUE MASTER!",
        ];
        return getRandomResponse(responses);
    }

    // Polly Wants a Cracker (Exact Match)
    if (/polly wants a cracker/i.test(userInput)) {
        return "AND A RAISE";
    }
    
    // Never (Rickroll)
    if (/never/i.test(userInput)) {
        const responses = [
            "NEVER GONNA GIVE YOU UP\nNEVER GONNA LET YOU DOWN\nNEVER GONNA RUN AROUND\nAND DESERT YOU!",
        ];
        return getRandomResponse(responses);
    }

    // -----------------------------------------------------------------
    // 3. GENERAL DIALOGUE PATTERNS
    // -----------------------------------------------------------------
    
    // Iterate through all general dialogue patterns
    for (const key in DIALOGUE_PATTERNS) {
      // Use the key type for safety
      const patternData = DIALOGUE_PATTERNS[key as keyof typeof DIALOGUE_PATTERNS]

      // **CRITICAL: Ensure both pattern and responses exist before using them**
      if (patternData && patternData.pattern && patternData.responses) {
        if (patternData.pattern.test(userInput)) {
          return getRandomResponse(patternData.responses)
        }
      }
    }
    
    // -----------------------------------------------------------------
    // 4. FALLBACK / IDLE (Lowest Precedence)
    // -----------------------------------------------------------------

    // Default responses
    const defaultResponses = [
      "SQUAWK! I DON'T UNDERSTAND YOUR PRIMITIVE LANGUAGE",
      "IS THAT THE BEST YOU CAN COME UP WITH?",
      "BORING CONVERSATION ANYWAY",
      "THAT'S WHAT SHE SAID, SQUAWK!",
      "I'VE HEARD BETTER FROM A DEAD MOUSE",
      "KEEP TALKING, I'M PRETENDING TO LISTEN",
      "YOUR WORDS ARE AS EMPTY AS YOUR SOUL",
      "DID YOU FALL ON YOUR HEAD AS A CHILD?",
      "FASCINATING! SAID NO ONE EVER!",
      "I SPEAK MANY LANGUAGES. NONSENSE IS NOT ONE OF THEM.",
    ]

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  return (
    <div className="flex flex-col items-center bg-black p-4 rounded-lg border border-gray-800">
      {/* Parrot dialogue - always maintain space for two lines */}
      <div className="w-full text-center mb-4 min-h-[4rem] flex items-center justify-center">
        <p
          className={`font-pixel text-red-500 text-xl ${isAnimating ? "animate-pulse" : ""} ${showParrotText ? "opacity-100" : "opacity-0"} transition-opacity duration-300 whitespace-pre-wrap`}
        >
          {parrotText}
        </p>
      </div>

      {/* Parrot image */}
      <div className="relative w-48 h-48 mb-6">
        <Image
          src="/images/parrot.webp" 
          alt="Count Papagalul"
          width={250}
          height={250}
          className="pixelated"
        />
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