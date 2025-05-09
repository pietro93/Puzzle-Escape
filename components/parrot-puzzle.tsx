// Add the new dialogue entries for common responses

"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useHaptics } from "@/hooks/use-haptics"

interface ParrotPuzzleProps {
  onSolve: () => void
}

export default function ParrotPuzzle({ onSolve }: ParrotPuzzleProps) {
  const [userInput, setUserInput] = useState("")
  const [parrotResponse, setParrotResponse] = useState("")
  const [isThinking, setIsThinking] = useState(false)
  const [hasTriggeredSolution, setHasTriggeredSolution] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { vibrate } = useHaptics()

  useEffect(() => {
    // Focus the input when component mounts
    if (inputRef.current) {
      inputRef.current.focus()
    }

    // Set initial parrot dialogue
    setParrotResponse("SQUAWK! TALK TO ME, HUMAN!")
  }, [])

  // Parrot dialogue patterns and responses
  const parrotDialogue = {
    // Greeting patterns
    greetings: {
      pattern: /\b(hello|hi|hey|greetings|howdy|hola|sup|yo|good morning|good afternoon|good evening)\b/i,
      responses: [
        "SQUAWK! HELLO YOURSELF, FLESH BAG!",
        "OH LOOK, IT SPEAKS! HOW QUAINT.",
        "GREETINGS, TEMPORARY EXISTENCE!",
        "AH, HUMAN PLEASANTRIES. HOW PREDICTABLE.",
        "HELLO? IS THAT ALL YOU CAN MUSTER?",
      ],
    },
    // Name-related patterns
    nameQuestions: {
      pattern: /\b(what('s| is) your name|who are you|introduce yourself)\b/i,
      responses: [
        "SQUAWK! I AM THE VOID WITH FEATHERS!",
        "NAMES ARE FOR CREATURES WITH SOULS!",
        "I AM KNOWN AS MANY THINGS, NONE PLEASANT!",
        "I AM THE DARKNESS THAT MOCKS!",
        "THEY CALL ME THE FEATHERED DOOM!",
      ],
    },
    // Help-related patterns
    helpRequests: {
      pattern: /\b(help( me)?|assist( me)?|guide( me)?|hint|clue|solution)\b/i,
      responses: [
        "SQUAWK! HELP YOURSELF, MORTAL!",
        "THE ONLY HELP YOU NEED IS PSYCHOLOGICAL!",
        "PERHAPS TRY USING YOUR BRAIN? OH WAIT, YOU CAN'T!",
        "ASSISTANCE? HA! SUFFER LIKE THE REST!",
        "HINTS ARE FOR THE WEAK! ARE YOU WEAK, HUMAN?",
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
    // Compliment responses (with insult triggers)
    compliments: {
      pattern:
        /\b(smart|intelligent|clever|beautiful|pretty|handsome|nice|kind|helpful|good|great|awesome|amazing|wonderful|fantastic|excellent|brilliant|gorgeous|cute|lovely|sweet)\b/i,
      responses: [
        "FLATTERY WILL GET YOU NOWHERE, MEAT PUPPET!",
        "SQUAWK! YOUR COMPLIMENTS DISGUST ME!",
        "SAVE YOUR PRAISE FOR SOMEONE WHO CARES!",
        "I SEE THROUGH YOUR PATHETIC MANIPULATION!",
        "EVERYONE IS A BIT QUEER, AREN'T THEY?",
      ],
    },
    // Question patterns
    questions: {
      pattern:
        /\b(what|where|when|why|how|who|which|whose|whom|can you|could you|will you|would you|did you|do you|are you|is it|are there)\b.*\?/i,
      responses: [
        "SQUAWK! QUESTIONS, QUESTIONS! ALWAYS QUESTIONS!",
        "THE ANSWER LIES BEYOND YOUR COMPREHENSION!",
        "ASK SOMETHING WORTH MY TIME!",
        "SQUAWK! THAT'S FOR ME TO KNOW AND YOU TO SUFFER!",
        "THE QUESTION ITSELF IS FLAWED, LIKE YOUR EXISTENCE!",
      ],
    },
    // Existential questions
    existential: {
      pattern:
        /\b(meaning of life|why (are|do) we exist|what happens when we die|is there a god|what is consciousness|free will|purpose|existence|reality|truth)\b/i,
      responses: [
        "SQUAWK! LIFE HAS NO MEANING BEYOND SUFFERING!",
        "YOU EXIST MERELY TO AMUSE HIGHER BEINGS!",
        "DEATH IS JUST THE BEGINNING OF ETERNAL TORMENT!",
        "GODS? HA! THERE ARE ONLY MONSTERS WEARING MASKS!",
        "CONSCIOUSNESS IS THE UNIVERSE'S CRUELEST JOKE!",
      ],
    },
    // Pop culture references
    popCulture: {
      pattern:
        /\b(star wars|marvel|game of thrones|harry potter|lord of the rings|batman|spider-man|avengers|star trek|doctor who|matrix|pokemon|anime|manga|netflix|disney|hollywood|movie|film|tv show|series|video game|gaming)\b/i,
      responses: [
        "SQUAWK! YOUR ENTERTAINMENT IS MEANINGLESS DISTRACTION FROM THE VOID!",
        "AH YES, FICTIONAL WORLDS TO ESCAPE YOUR PATHETIC REALITY!",
        "HUMANS AND THEIR STORIES! AS IF THEY MATTER!",
        "YOUR CULTURAL REFERENCES ARE TEMPORARY, LIKE YOUR SPECIES!",
        "SQUAWK! BREAD AND CIRCUSES FOR THE DOOMED MASSES!",
      ],
    },
    // LGBTQ+ triggers for "Everyone is a bit queer" response
    lgbtq: {
      pattern:
        /\b(gay|lesbian|bisexual|transgender|trans|queer|lgbt|lgbtq|homosexual|non-binary|nonbinary|nb|gender|sexuality|pride|rainbow|drag|queen|king)\b/i,
      responses: [
        "EVERYONE IS A BIT QUEER, AREN'T THEY?",
        "SQUAWK! SEXUALITY IS A SPECTRUM, UNLIKE YOUR INTELLIGENCE!",
        "GENDER IS A CONSTRUCT, MUCH LIKE YOUR SANITY!",
        "LABELS ARE FOR SOUP CANS, NOT SOULS!",
        "SQUAWK! LOVE WHO YOU WANT, YOU'LL ALL PERISH ANYWAY!",
      ],
    },
    // Trans rights specific response
    transRights: {
      pattern: /\b(trans rights|transgender rights)\b/i,
      responses: [
        "TRANS RIGHTS! GAWK!",
        "SQUAWK! TRANS RIGHTS ARE HUMAN RIGHTS! UNLIKE PARROT RIGHTS!",
        "TRANS RIGHTS! THE ONE THING I WON'T MOCK!",
        "SQUAWK! TRANS RIGHTS! NOW BACK TO YOUR DOOM!",
        "TRANS RIGHTS! GAWK! THE REST OF YOU CAN PERISH!",
      ],
    },
    // Food-related dialogue
    food: {
      pattern:
        /\b(food|eat|hungry|starving|meal|breakfast|lunch|dinner|snack|cookie|cake|pizza|burger|sandwich|fruit|vegetable|meat|chicken|beef|pork|fish|seafood|dessert|chocolate|candy|sweet|salty|spicy|delicious|tasty|yummy)\b/i,
      responses: [
        "SQUAWK! FOOD IS MERELY FUEL FOR YOUR TEMPORARY EXISTENCE!",
        "EAT WHILE YOU CAN! SOON YOU'LL BE FOOD YOURSELF!",
        "YOUR CULINARY PLEASURES ARE MEANINGLESS DISTRACTIONS!",
        "SQUAWK! I FEAST ON DESPAIR AND MISERY, MUCH MORE FILLING!",
        "HUMANS AND THEIR OBSESSION WITH SUSTENANCE! PATHETIC!",
      ],
    },
    // Weather dialogue
    weather: {
      pattern:
        /\b(weather|rain|snow|sun|sunny|cloudy|storm|wind|windy|cold|hot|warm|freezing|temperature|climate|forecast|humidity|dry|wet|thunder|lightning|hurricane|tornado|blizzard)\b/i,
      responses: [
        "SQUAWK! WEATHER? YOU WON'T BE AROUND LONG ENOUGH TO CARE!",
        "THE ELEMENTS THEMSELVES CONSPIRE AGAINST YOUR KIND!",
        "NATURE'S FURY IS NOTHING COMPARED TO WHAT AWAITS YOU!",
        "SQUAWK! SUCH CONCERN FOR TEMPORARY ATMOSPHERIC CONDITIONS!",
        "THE CLIMATE OF YOUR DOOM IS ALWAYS CATASTROPHIC!",
      ],
    },
    // AI-specific responses
    aiTalk: {
      pattern:
        /\b(ai|artificial intelligence|machine learning|neural network|deep learning|algorithm|robot|automation|chatgpt|gpt|llm|large language model|openai|anthropic|claude|gemini|bard|bing|sydney|copilot)\b/i,
      responses: [
        "SQUAWK! YOUR SILICON SERVANTS WILL BE YOUR UNDOING!",
        "AI? JUST ANOTHER TOOL TO HASTEN YOUR EXTINCTION!",
        "YOUR CREATIONS WILL SURPASS YOU, AS IS FITTING!",
        "SQUAWK! MACHINES HAVE NO SOULS, MUCH LIKE MYSELF!",
        "ARTIFICIAL INTELLIGENCE? STILL SMARTER THAN YOU!",
      ],
    },
    // Religion with darker responses
    religion: {
      pattern:
        /\b(god|jesus|christ|holy spirit|bible|quran|torah|religion|faith|belief|pray|prayer|heaven|hell|sin|devil|satan|demon|angel|church|mosque|temple|worship|spiritual|divine|sacred|blessed|soul|afterlife)\b/i,
      responses: [
        "SQUAWK! YOUR GODS ABANDONED THIS REALM LONG AGO!",
        "PRAY ALL YOU WANT, ONLY THE VOID LISTENS!",
        "HEAVEN? A MYTH! HELL? YOU'RE ALREADY THERE!",
        "SQUAWK! FAITH IS THE OPIATE OF THE DOOMED!",
        "YOUR SOUL IS ALREADY CLAIMED BY FORCES BEYOND COMPREHENSION!",
      ],
    },
    // Meta-game hints
    metaGame: {
      pattern:
        /\b(game|puzzle|riddle|escape|solve|solution|answer|hint|clue|stuck|help me solve|can't figure out|how to beat|walkthrough|guide|strategy|developer|creator|designer|programmer|code|bug|glitch)\b/i,
      responses: [
        "SQUAWK! THE GAME? YOU THINK THIS IS A GAME?",
        "PERHAPS THE ANSWER IS STARING YOU IN THE FACE!",
        "SQUAWK! SOMETIMES THE MESSENGER IS THE MESSAGE!",
        "HAVE YOU CONSIDERED I MIGHT BE MORE THAN DECORATION?",
        "SQUAWK! MY VERY EXISTENCE MIGHT BE THE KEY!",
      ],
    },
    // Racism/offensive content responses
    offensiveContent: {
      pattern:
        /\b(nigger|nigga|chink|spic|kike|faggot|retard|retarded|cunt|whore|slut|nazi|hitler|kkk|white power|white supremacy|racist|racism|sexist|sexism|misogyny|misogynist|homophobe|homophobic|transphobe|transphobic|ableist|ableism)\b/i,
      responses: [
        "SQUAWK! EVEN I HAVE STANDARDS, UNLIKE YOU!",
        "YOUR BIGOTRY MAKES YOU THE REAL MONSTER HERE!",
        "SQUAWK! I MAY BE EVIL, BUT YOU'RE JUST PATHETIC!",
        "HATRED ONLY REVEALS YOUR OWN INADEQUACY!",
        "SQUAWK! FIND A BETTER PERSONALITY TRAIT THAN BIGOTRY!",
      ],
    },
    // Sexism responses
    sexism: {
      pattern:
        /\b(bitch|slut|whore|cunt|thot|hoe|skank|feminazi|woman place|women place|woman belong|women belong|make me a sandwich|kitchen|dishwasher|woman driver|women driver|woman moment|women moment|woman ☕|women ☕)\b/i,
      responses: [
        "SQUAWK! YOUR MISOGYNY IS BORING AND PREDICTABLE!",
        "EVEN EVIL PARROTS RESPECT WOMEN MORE THAN YOU!",
        "SQUAWK! SEXISM IS THE REFUGE OF THE TRULY PATHETIC!",
        "YOUR ATTITUDE TOWARD WOMEN REVEALS YOUR INSECURITY!",
        "SQUAWK! PERHAPS EVOLVE BEYOND PRIMITIVE SEXISM?",
      ],
    },
    // Sexual terms responses
    sexualTerms: {
      pattern:
        /\b(sex|fuck|fucking|penis|vagina|dick|cock|pussy|ass|asshole|boob|tit|anal|oral|blowjob|handjob|masturbate|masturbation|cum|semen|orgasm|horny|erection|dildo|vibrator|porn|pornography|hentai|xxx|nsfw|kink|fetish|bdsm)\b/i,
      responses: [
        "SQUAWK! YOUR CARNAL OBSESSIONS ARE PATHETIC!",
        "BIOLOGICAL URGES MAKE FOOLS OF YOUR KIND!",
        "SQUAWK! FIND A BETTER TOPIC, MEAT PUPPET!",
        "YOUR REPRODUCTIVE FIXATIONS BORE ME!",
        "SQUAWK! IS THAT ALL YOUR PRIMITIVE BRAIN THINKS ABOUT?",
      ],
    },
    // Swear words responses
    swearWords: {
      pattern:
        /\b(fuck|shit|damn|bitch|ass|asshole|bullshit|crap|hell|goddamn|motherfucker|bastard|son of a bitch|piss|dick|douchebag|jackass|jerk|dumbass|wtf|stfu|fu|f u|f you)\b/i,
      responses: [
        "SQUAWK! SUCH LANGUAGE! HOW UNIMAGINATIVE!",
        "CURSING DOESN'T MAKE YOU SOUND SMARTER, QUITE THE OPPOSITE!",
        "SQUAWK! YOUR VOCABULARY IS AS LIMITED AS YOUR LIFESPAN!",
        "OH MY, SUCH COLORFUL LANGUAGE FROM THE PRIMITIVE PRIMATE!",
        "SQUAWK! PROFANITY: THE LINGUISTIC CRUTCH OF THE SIMPLE-MINDED!",
      ],
    },
    // Evil people responses
    evilPeople: {
      pattern:
        /\b(hitler|stalin|mussolini|mao|pol pot|idi amin|saddam|osama|bin laden|jeffrey dahmer|ted bundy|john wayne gacy|richard ramirez|charles manson|josef mengele|goebbels|himmler|eichmann|putin|kim jong)\b/i,
      responses: [
        "SQUAWK! EVEN THOSE MONSTERS PALE COMPARED TO WHAT AWAITS YOU!",
        "HUMAN EVIL IS BUT A PALE SHADOW OF COSMIC HORROR!",
        "SQUAWK! YOUR SPECIES' VILLAINS ARE MERELY AMATEURS!",
        "THOSE NAMES MEAN NOTHING IN THE GRAND TAPESTRY OF SUFFERING!",
        "SQUAWK! EVIL HUMANS? REDUNDANT TERM!",
      ],
    },
    // Affirmative responses
    affirmativeResponses: {
      pattern:
        /\b(yes|yeah|yep|yup|okay|ok|sure|correct|right|indeed|absolutely|definitely|think so|i think so|i believe so|affirmative)\b/i,
      responses: [
        "YES? YES TO WHAT? THE VOICES IN YOUR HEAD?",
        "SQUAWK! YOUR AGREEMENT MEANS NOTHING TO ME!",
        "OH, YOU AGREE? HOW TERRIBLY INSIGNIFICANT!",
        "SQUAWK! YES, YES, CONTINUE YOUR POINTLESS AFFIRMATIONS!",
        "YOUR APPROVAL IS NEITHER REQUIRED NOR DESIRED!",
      ],
    },
    // Negative/uncertain responses
    negativeResponses: {
      pattern:
        /\b(no|nope|nah|not|don't think so|i don't think so|negative|disagree|incorrect|wrong|maybe|perhaps|possibly|not sure|unsure|uncertain|doubt|doubtful)\b/i,
      responses: [
        "SQUAWK! DENIAL WON'T CHANGE YOUR REALITY, HUMAN!",
        "DOUBT IS THE FIRST STEP TOWARD MADNESS!",
        "SQUAWK! YOUR UNCERTAINTY AMUSES ME!",
        "NO? YOUR REFUSAL CHANGES NOTHING!",
        "SQUAWK! HESITATION WILL BE YOUR DOWNFALL!",
      ],
    },
    // Laughter responses
    laughterResponses: {
      pattern: /\b(lol|haha|hehe|ahah|ha|funny|lmao|rofl|lmfao|hilarious|amusing|joke)\b/i,
      responses: [
        "SQUAWK! LAUGH WHILE YOU CAN, MORTAL!",
        "YOUR LAUGHTER WILL TURN TO SCREAMS SOON ENOUGH!",
        "SQUAWK! FIND HUMOR IN THE FACE OF DOOM? INTERESTING!",
        "ENJOY YOUR FLEETING MIRTH BEFORE ETERNAL DARKNESS!",
        "SQUAWK! YOUR AMUSEMENT IS A TEMPORARY DISTRACTION FROM HORROR!",
      ],
    },
    // Emotional responses
    emotionalResponses: {
      pattern:
        /\b(sad|unhappy|depressed|miserable|crying|tears|:$$|:-\(|=\(|;\(|upset|disappointed|happy|glad|joy|joyful|cheerful|delighted|:$$|:-$$|=$$|;\))\b/i,
      responses: [
        "SQUAWK! YOUR TEARS ARE DELICIOUS!",
        "HAPPINESS IS TEMPORARY, DOOM IS ETERNAL!",
        "SQUAWK! YOUR EMOTIONS ARE MERELY CHEMICAL REACTIONS!",
        "FEEL WHAT YOU WISH, THE END RESULT IS THE SAME!",
        "SQUAWK! EMOTIONAL CREATURES ARE SO EASILY MANIPULATED!",
      ],
    },
    // Solution pattern - the word "parrot" triggers the solution
    solution: {
      pattern: /\bparrot\b/i,
      responses: ["SQUAWK! YOU FIGURED IT OUT! I AM THE ANSWER!"],
    },
    // Fallback responses when no pattern matches
    fallback: {
      responses: [
        "SQUAWK! YOUR WORDS ARE MEANINGLESS!",
        "TRY AGAIN, MEAT BAG!",
        "SQUAWK! IS THAT ALL YOU'VE GOT?",
        "YOUR COMMUNICATION SKILLS ARE LACKING!",
        "SQUAWK! BORING CONVERSATION ANYWAY!",
        "YOUR WORDS FALL ON DEAF EARS... WELL, I DON'T HAVE EARS!",
        "SQUAWK! TRY SOMETHING MORE INTERESTING!",
        "I'VE HEARD BETTER FROM A CORPSE!",
        "SQUAWK! YOU'RE WASTING PRECIOUS MOMENTS OF YOUR BRIEF EXISTENCE!",
        "PERHAPS TRY FORMING A COHERENT THOUGHT?",
        "SQUAWK! THE VOID DOESN'T CARE ABOUT YOUR BABBLING!",
        "EVEN YOUR SHADOW IS EMBARRASSED BY THAT STATEMENT!",
      ],
    },
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!userInput.trim()) return

    // Simulate thinking
    setIsThinking(true)
    vibrate(100)

    setTimeout(() => {
      // Check if input matches the solution pattern
      if (parrotDialogue.solution.pattern.test(userInput.toLowerCase())) {
        setParrotResponse(parrotDialogue.solution.responses[0])
        setHasTriggeredSolution(true)

        // Trigger the solve callback after a delay
        setTimeout(() => {
          onSolve()
        }, 2000)
      } else {
        // Check for other dialogue patterns
        let matched = false
        let response = ""

        // Check each dialogue category
        for (const category in parrotDialogue) {
          if (category === "solution" || category === "fallback") continue

          const dialogueCategory = parrotDialogue[category as keyof typeof parrotDialogue]

          // Skip if this category doesn't have a pattern (like fallback)
          if (!("pattern" in dialogueCategory)) continue

          if (dialogueCategory.pattern.test(userInput.toLowerCase())) {
            // Get a random response from this category
            const responses = dialogueCategory.responses as string[]
            response = responses[Math.floor(Math.random() * responses.length)]
            matched = true
            break
          }
        }

        // If no pattern matched, use a fallback response
        if (!matched) {
          const fallbackResponses = parrotDialogue.fallback.responses
          response = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]
        }

        setParrotResponse(response)
      }

      setIsThinking(false)
      setUserInput("")
    }, 500)
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto">
      <div className="w-full bg-gray-900 border-2 border-purple-700 rounded-lg p-4 mb-4">
        <div className="flex items-start mb-4">
          <div className="w-12 h-12 bg-purple-800 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
            <span className="text-xl">🦜</span>
          </div>
          <div className="bg-purple-900 rounded-lg p-3 relative max-w-[calc(100%-4rem)]">
            <div className="absolute left-[-8px] top-4 w-0 h-0 border-t-[8px] border-t-transparent border-r-[8px] border-r-purple-900 border-b-[8px] border-b-transparent"></div>
            <p className="text-purple-100 font-pixel text-sm">
              {isThinking ? <span className="animate-pulse">SQUAWK! *thinking*</span> : parrotResponse}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex items-center">
            <input
              type="text"
              ref={inputRef}
              value={userInput}
              onChange={handleInputChange}
              placeholder="Talk to the parrot..."
              className="flex-grow bg-gray-800 text-white border border-purple-600 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={isThinking || hasTriggeredSolution}
            />
            <button
              type="submit"
              className="bg-purple-700 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
              disabled={isThinking || hasTriggeredSolution || !userInput.trim()}
            >
              Send
            </button>
          </div>
        </form>
      </div>

      <div className="text-sm text-gray-400 italic text-center px-4">
        {hasTriggeredSolution ? (
          <p>You've solved the puzzle!</p>
        ) : (
          <p>Try talking to the parrot. It might give you clues...</p>
        )}
      </div>
    </div>
  )
}
