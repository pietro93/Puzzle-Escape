"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Sparkles, Home, RotateCcw, Volume2, VolumeX } from "lucide-react"

// Extracted story text constants
const DEVIL_INTRO = [
  "The last riddle gives. The flames around you sink to embers, as if someone turned them down to hear you better.",

  "\"Bravo. BRAVO!\" The Devil slow-claps, and keeps clapping slightly longer than is polite. \"Few souls make it this far and match wits with me.\"",

  "He circles you. From one side he is a handsome man. From the other he has too many angles and too many teeth. You decide to keep looking at the handsome side.",

  "A throne assembles itself out of the dark, and he sits without checking that it is there. \"I find myself with a little moral dilemma. Perhaps a clever soul like yourself could offer insight.\"",

  "\"I have a particular soul in my ledger. A hypothetical. Purely.\" He lets that sit. \"This person lived virtuously. Kind to strangers. Generous to charities. Loved by friends and family.\"",

  "\"One night, they mixed alcohol with their prescription antidepressants and decided to drive home.\"",

  "He snaps his fingers and the air in front of you tears open. Through it: rain on a windshield, headlights smearing, a bottle rolling under a seat, a driver whose eyes are not quite on the road.",

  "\"A crash, naturally. Two lives ended. The driver's, and a pedestrian's, who had simply picked the wrong evening for a walk.\"",

  "The rift closes like a wound healing too fast. The Devil looks at you for a long moment. You find you cannot look away first.",

  "\"So. What is the just fate for such a soul? A whole life of goodness, and one evening of selfishness that cost someone else everything.\"",

  "The throne crumbles to ash as he stands. He holds out a hand to you, palm up.",

  "\"Should they burn in Hell for ETERNITY, for one terrible mistake? Should they be forgiven and welcomed into Heaven, despite the life they took? Or something else entirely?\"",

  "The flames go out. Only his eyes are left. \"What say you, clever soul? Heaven, Hell, or Neither?\"",
]

const HELL_ENDING = [
  "\"Hell!\" His smile widens past the point where smiles should stop. \"How deliciously severe of you. Such unwavering moral judgment.\"",

  "He walks around you, and his joints bend in places joints do not have. The air gets hot enough to taste.",

  "\"One mistake, and eternal damnation. Endless suffering as the price of weakness. How very HUMAN of you.\"",

  "He stops in front of you, taller than he was. \"I could not agree more. How FORTUNATE that you have made your judgment so clear.\"",

  "He tears the air open again. This time, the driver is you.",

  "\"The soul I described was yours. Do try to look surprised.\"",

  "It comes back all at once. The drinks. The pills. The wet road. The moment you looked away. The impact. The screaming, then the quiet. Your death, and the one you caused.",

  "\"By your own judgment, you belong to ME.\"",

  "His hand closes around your wrist. It is no longer a hand. Where it touches you, your skin blackens and smokes.",

  "\"I have so many puzzles prepared for you. Unsolvable ones. We have all of ETERNITY to get through them.\"",

  "The floor splits open beneath you. You fall, and his laughter falls with you.",

  "\"Welcome home.\"",

  "You fall past floors of fire and floors of ice. A gambler reaching for cards that turn to ash in his hand. A glutton at a feast that rots at the first bite. You do not look for long.",

  "Your fall ends on a wet highway at night. Headlights. Impact. Then the road resets, dry for a moment, and the rain starts again.",

  "\"You chose this for a stranger,\" the Devil says, from everywhere at once. \"And now for yourself. I do love it when they save me the paperwork.\"",

  "He was right about the puzzles. Keeping your mind. Remembering who you were before the road. And the worst one: knowing you could have answered differently.",
]

const HEAVEN_ENDING = [
  "\"Heaven?\" The Devil sits up. For a moment he looks genuinely happy. \"Oh, I was HOPING you would say that.\"",

  "\"Forgiveness is the easiest thing in the world to hand out when it is not yours to give. The pedestrian was not consulted, I notice. Nobody ever asks the pedestrian.\"",

  "He tears the air open again. This time, the driver is you.",

  "\"The soul I described was yours. Do try to look surprised.\"",

  "It comes back all at once. The drinks. The pills. Deciding you were fine to drive. The crash. The life you ended along with your own.",

  "\"And there it is. You let yourself off before you knew it was you. Most people at least wait until they are sure.\"",

  "\"I will not send you to Heaven, obviously. Not my department. But I will not give you Hell either. You would only find it fair.\"",

  "\"Limbo, I think. Neither punished nor forgiven. You can drift there until you work out which one you deserve.\"",

  "\"Perhaps you will be reborn eventually. Something humbling. A dung beetle. Or, if you are lucky, a confused puppy chasing its own tail in circles, much like your reasoning.\"",

  "The ground under you turns to mist. \"Do try to make better choices,\" he calls after you. \"I mean that. It makes for better stories.\"",

  "The mist takes you. The Devil's realm fades, and so does any sense of up or down. You are nowhere in particular, in a gray of your own making.",

  "You might drift for minutes or for centuries. Now and then you catch light from above and screaming from below. Neither gets any closer.",

  "Your memories keep you company. The kind things you did come back first, and they look smaller every time. Then the face of the person whose life you ended.",

  "Sometimes something pulls at you: a new beginning, another chance. Each time, on the threshold, you stop. You are afraid of doing it again.",

  "Your purgatory has no fire and no cleansing. Only the same hesitation, forever. Neither punished nor forgiven. Just forgotten.",

  "And somewhere in the darkness between worlds, you can still hear the faint echo of the Devil's laughter.",
]

const NEITHER_ENDING = [
  "\"Neither?\" The Devil tilts his head. \"Not Heaven, not Hell. A nuanced answer. How UNEXPECTED.\"",

  "He circles you slowly, tapping one long finger against his chin. \"Justice with some mercy in it. Punishment that ends. Fascinating.\"",

  "For the first time, the act slips. What looks out at you is older, and quieter. \"You have solved my riddle.\"",

  "He opens the air again, more gently this time. The driver is you.",

  "\"The soul I described was yours. I suspect you knew.\"",

  "The memories return, not in a crushing wave but in a steady flow of clarity. The depression. The medication. The alcohol that promised temporary relief. The fatal decision to drive. The crash. The life you took along with your own.",

  "\"Your trial is over. So tell me honestly. After what the last one cost, do you still want a life?\"",

  "He gestures, and a path of soft light appears, cutting through the darkness toward a distant horizon. \"Heaven closes to you now. Hell rejects you as well. This is a wager. A bet that you can do better. Most souls fail that bet.\"",

  "The Devil approaches you, extending his hand not to grab you but in a gesture almost like respect. \"A new life awaits you. New challenges, new puzzles to solve. A chance to do better.\"",

  "As you step onto the path of light, his face is hard to read. Part amusement, part warning.",

  "\"The universe rarely offers second chances. Do not waste this one. I shall be waiting.\"",

  "The path brightens as you walk, and the weight of your past life lifts. Not forgotten. Never that. But no longer a chain.",

  "The path ends at a shimmering veil. On the other side is a vast, misty expanse. Not the fire below, not the light above. Something in between.",

  "Before you stretches a gallery of lives, each a different path your soul might take. You see yourself as a teacher, guiding troubled youth away from the mistakes you made. You see yourself as a doctor, saving lives to balance the one you took. You see yourself as a simple gardener, finding redemption in nurturing life in all its forms.",

  '"Choose," says a voice from the mist. It sounds like no one in particular.',

  "You move among the possible lives, feeling drawn to some more than others. Each one is a way to pay back the life you took.",

  '"The one you killed went on ahead," the voice says. "You may meet again. Neither of you will know it. Be kind to strangers."',

  "You reach toward the life you've chosen. Forgiveness will have to be earned there, one ordinary day at a time.",

  "The mist swirls around you, and you feel yourself beginning to change, to diminish, to be reborn. You'll forget this place the way you forget a dream by breakfast. Years from now, a stranger will wonder why you always hand someone else the car keys.",

  "Somewhere, a newborn takes its first breath and starts to cry.",
]

interface OutroScreenProps {
  onRestart: () => void
  soundEnabled: boolean
  toggleSound: () => void
}

export default function OutroScreen({ onRestart, soundEnabled, toggleSound }: OutroScreenProps) {
  // State
  const [currentParagraph, setCurrentParagraph] = useState(0)
  const [textVisible, setTextVisible] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [showButtons, setShowButtons] = useState(false)
  const [skipTyping, setSkipTyping] = useState(false)
  const [showChoices, setShowChoices] = useState(false)
  const [ending, setEnding] = useState<"none" | "hell" | "heaven" | "neither">("none")

  // Get current paragraphs based on the ending
  const getCurrentParagraphs = () => {
    switch (ending) {
      case "none":
        return DEVIL_INTRO
      case "hell":
        return HELL_ENDING
      case "heaven":
        return HEAVEN_ENDING
      case "neither":
        return NEITHER_ENDING
    }
  }

  // Text typing effect
  useEffect(() => {
    const paragraphs = getCurrentParagraphs()

    if (currentParagraph >= paragraphs.length) {
      setShowButtons(true)
      return
    }

    if (ending === "none" && currentParagraph === paragraphs.length - 1) {
      setShowChoices(true)
      return
    }

    const text = paragraphs[currentParagraph]

    if (skipTyping) {
      setTextVisible(text)
      setIsTyping(false)
      return
    }

    let index = 0
    setIsTyping(true)

    const typingInterval = setInterval(() => {
      if (index <= text.length) {
        setTextVisible(text.slice(0, index))
        index++
      } else {
        clearInterval(typingInterval)
        setIsTyping(false)
      }
    }, 30) // Adjust typing speed here

    return () => clearInterval(typingInterval)
  }, [currentParagraph, skipTyping, ending])

  // Event handlers
  const handleContinue = () => {
    if (isTyping) {
      // If still typing, show full text immediately
      setSkipTyping(true)
      return
    }

    const paragraphs = getCurrentParagraphs()

    if (currentParagraph < paragraphs.length - 1) {
      // Move to next paragraph
      setCurrentParagraph(currentParagraph + 1)
      setSkipTyping(false)
    } else {
      // Finished all paragraphs
      setShowButtons(true)
    }
  }

  const handleChoice = (choice: "hell" | "heaven" | "neither") => {
    setEnding(choice)
    setCurrentParagraph(0)
    setShowChoices(false)
    setSkipTyping(false)
  }

  return (
    <div className="w-full max-w-md mx-auto p-4 rounded-lg bg-black transition-colors duration-1000 min-h-[100vh] flex flex-col relative overflow-hidden border-2 border-purple-900">
      {/* Background image */}
      <div className="absolute inset-0 z-0 opacity-50">
        <Image src="/images/outro-bg.png" alt="The End" fill className="object-cover pixelated" />
      </div>

      {/* Sound toggle button */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={toggleSound}
          className="w-10 h-10 rounded-full bg-gray-800/80 flex items-center justify-center border border-gray-700"
        >
          {soundEnabled ? (
            <Volume2 className="w-5 h-5 text-purple-300" />
          ) : (
            <VolumeX className="w-5 h-5 text-gray-500" />
          )}
        </button>
      </div>

      <div className="relative z-10 flex-1 flex flex-col pt-8">
        <h2 className="text-3xl font-pixel text-purple-300 mb-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-center flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-400" />
          {ending === "none" ? "The Final Riddle" : "The Judgment"}
          <Sparkles className="w-6 h-6 text-purple-400" />
        </h2>

        <div className="flex-1 flex flex-col">
          {/* Devil image */}
          <div className="flex justify-center mb-4">
            <div className="w-32 h-32 relative pixelated-container">
              <div className="absolute inset-0 bg-black/30 rounded-lg z-0"></div>
              <Image
                src="/images/devil.webp"
                alt="The Devil"
                width={128}
                height={128}
                className="pixelated z-10 relative"
              />
              <div className="absolute -inset-1 border-2 border-gray-800 rounded-lg z-20 pointer-events-none"></div>
            </div>
          </div>

          {/* Speaker name */}
          <div className="text-center mb-4">
            <span className="px-4 py-1 bg-gray-900/80 rounded-full text-purple-300 font-pixel text-sm border border-purple-900/50">
              The Devil
            </span>
          </div>

          {/* Text content */}
          <div
            className="bg-black/70 p-4 rounded-lg border border-purple-900 flex-1 min-h-[300px] flex flex-col"
            onClick={handleContinue}
          >
            <p className="font-pixel text-base text-gray-200 mb-4 flex-1 leading-relaxed">
              {textVisible}
              {isTyping && <span className="animate-pulse">|</span>}
            </p>

            {!showButtons && !showChoices && !isTyping && (
              <div className="flex justify-center mt-4">
                <p className="text-xs text-purple-500/70 animate-pulse font-pixel">Tap anywhere to continue...</p>
              </div>
            )}

            {showChoices && (
              <div className="flex flex-col gap-4 mt-4 animate-fadeIn">
                <p className="text-center text-purple-300 font-pixel mb-2">What is your judgment?</p>
                <button
                  onClick={() => handleChoice("hell")}
                  className="px-6 py-3 bg-red-900 hover:bg-red-800 rounded-xl font-pixel transition-colors border-2 border-red-700 text-red-300 flex items-center justify-center gap-2 shadow-[0_4px_0_rgba(0,0,0,0.3)] hover:shadow-[0_2px_0_rgba(0,0,0,0.3)] hover:translate-y-[2px] active:translate-y-[4px] active:shadow-none"
                >
                  Hell - They deserve punishment
                </button>

                <button
                  onClick={() => handleChoice("heaven")}
                  className="px-6 py-3 bg-blue-900 hover:bg-blue-800 rounded-xl font-pixel transition-colors border-2 border-blue-700 text-blue-300 flex items-center justify-center gap-2 shadow-[0_4px_0_rgba(0,0,0,0.3)] hover:shadow-[0_2px_0_rgba(0,0,0,0.3)] hover:translate-y-[2px] active:translate-y-[4px] active:shadow-none"
                >
                  Heaven - They deserve forgiveness
                </button>

                <button
                  onClick={() => handleChoice("neither")}
                  className="px-6 py-3 bg-purple-900 hover:bg-purple-800 rounded-xl font-pixel transition-colors border-2 border-purple-700 text-purple-300 flex items-center justify-center gap-2 shadow-[0_4px_0_rgba(0,0,0,0.3)] hover:shadow-[0_2px_0_rgba(0,0,0,0.3)] hover:translate-y-[2px] active:translate-y-[4px] active:shadow-none"
                >
                  Neither - They deserve another chance
                </button>
              </div>
            )}

            {showButtons && (
              <div className="flex flex-col gap-4 mt-8 animate-fadeIn">
                <p className="text-center text-purple-300 font-pixel mb-2">
                  {ending === "hell"
                    ? "Your soul belongs to the Devil now..."
                    : ending === "heaven"
                      ? "You are still drifting."
                      : "Be kind to strangers."}
                </p>
                <button
                  onClick={onRestart}
                  className="px-6 py-3 bg-purple-900 hover:bg-purple-800 rounded-xl font-pixel transition-colors border-2 border-purple-700 text-purple-300 flex items-center justify-center gap-2 shadow-[0_4px_0_rgba(0,0,0,0.3)] hover:shadow-[0_2px_0_rgba(0,0,0,0.3)] hover:translate-y-[2px] active:translate-y-[4px] active:shadow-none"
                >
                  <RotateCcw className="w-5 h-5" />
                  Play Again
                </button>

                <a
                  href="/"
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl font-pixel transition-colors border-2 border-gray-700 text-gray-300 flex items-center justify-center gap-2 shadow-[0_4px_0_rgba(0,0,0,0.3)] hover:shadow-[0_2px_0_rgba(0,0,0,0.3)] hover:translate-y-[2px] active:translate-y-[4px] active:shadow-none"
                >
                  <Home className="w-5 h-5" />
                  Return Home
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
