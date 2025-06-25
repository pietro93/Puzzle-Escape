"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Sparkles, Home, RotateCcw, Volume2, VolumeX } from "lucide-react"

interface OutroScreenProps {
  onRestart: () => void
  soundEnabled: boolean
  toggleSound: () => void
}

export default function OutroScreen({ onRestart, soundEnabled, toggleSound }: OutroScreenProps) {
  const [currentParagraph, setCurrentParagraph] = useState(0)
  const [textVisible, setTextVisible] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [showButtons, setShowButtons] = useState(false)
  const [skipTyping, setSkipTyping] = useState(false)
  const [showChoices, setShowChoices] = useState(false)
  const [ending, setEnding] = useState<"none" | "hell" | "heaven" | "neither">("none")

  const devilIntro = [
    "As you solve the Devil's final riddle, a profound silence falls over the hellish landscape. The flames around you dim to embers, casting long, dancing shadows across the obsidian floor.",

    '"Bravo! BRAVO!" The Devil\'s voice booms as he slow-claps with theatrical flair, his perfect teeth gleaming in a smile that never quite reaches his eyes. "Few souls have ever made it this far, and fewer still have matched wits with me and lived to tell the tale."',

    "He circles you like a predator, his form shifting between human and something... other. Something with too many angles, too many teeth. The air around him shimmers with heat, and the scent of brimstone grows stronger.",

    '"I find myself with a most intriguing moral dilemma," he purrs, conjuring an ornate throne from the darkness and lounging upon it. "Perhaps a clever soul like yourself could offer some... insight."',

    'The Devil leans forward, his eyes now glowing like hot coals. "I have a particular soul in my ledger—a fascinating case study in human fallibility. This person was, by all accounts, good. Kind to strangers. Generous to charities. Loved by friends and family."',

    'His voice drops to a whisper that somehow fills the entire chamber. "But then came one fateful night. This person, struggling with inner demons, made a catastrophic error. They mixed alcohol with prescription antidepressants—a deadly cocktail—and decided to drive home."',

    "With a snap of his long fingers, the air before you tears open like a wound. Through the rift, you see images playing out in terrible clarity: rain-slicked roads, headlights blurring through a windshield, empty bottles rolling on a car floor, a driver's unfocused eyes.",

    '"The inevitable occurred," the Devil continues, his voice now soft with mock sympathy. "A crash. Metal screaming against metal. Glass shattering like frozen stars. And when the silence finally fell, two lives had been extinguished—the driver\'s and an innocent pedestrian\'s who was simply in the wrong place at the wrong time."',

    "He dismisses the vision with a casual flick of his wrist, and the rift seals itself with a sound like tearing silk. The Devil's eyes bore into yours, unblinking and ancient.",

    '"So here\'s my quandary: What is the just fate for such a soul? They lived virtuously but died causing death and destruction. One moment of selfish, reckless behavior erased a lifetime of goodness."',

    "The Devil rises from his throne, which crumbles to ash behind him. He extends a hand toward you, palm up, fingers slightly curled as if beckoning.",

    '"Should this soul burn in Hell for eternity for one terrible mistake?" His voice drops an octave, resonating through your bones. "Should they be forgiven and welcomed into Heaven despite the life they took?" His tone becomes mocking. "Or perhaps... something else entirely?"',

    'The chamber grows darker, the flames dimming further until only the Devil\'s eyes glow in the darkness. "What say you, clever soul? Heaven, Hell, or Neither?"',
  ]

  const hellEnding = [
    '"Hell?" The Devil\'s eyes flare with sudden, terrible delight. His smile stretches impossibly wide, revealing row upon row of needle-sharp teeth. "How deliciously severe of you! Such unwavering moral judgment!"',

    "He stalks around you, his movements no longer human but predatory, joints bending at unnatural angles. The temperature in the chamber rises dramatically, the air becoming thick and difficult to breathe.",

    '"One mistake," he hisses, his voice now layered with multiple tones speaking in unison, "and eternal damnation follows. No redemption. No second chances. Just endless suffering as payment for a single moment of weakness."',

    "The Devil stops abruptly before you, growing taller, his shadow stretching across the walls like spilled ink. His skin cracks in places, revealing molten fire beneath.",

    '"I couldn\'t agree more," he growls, the ground trembling beneath your feet. "And how... FORTUNATE... that you\'ve made your judgment so clear."',

    "With a violent gesture, he tears another rift in reality. But this time, the vision shows you behind the wheel of that car on that rainy night.",

    '"Because the soul I described," the Devil whispers, his breath hot against your ear though he stands before you, "was yours."',

    "The memories crash into you like a physical blow. The drinks. The pills. The rain-slicked roads. The momentary distraction. The horrific impact. The screams. The silence. Your death—and the death you caused.",

    "Horror floods through you as you realize the truth. This entire journey—the prison, the mansion, the forest, the desert, and finally this hellish domain—it was all a trial for your soul.",

    '"By your own judgment," the Devil says, his voice now a triumphant roar, "you belong to ME."',

    "His hand, now a twisted claw of obsidian and flame, closes around your wrist with burning finality. The flesh where he touches you blackens and smokes.",

    '"I have so many puzzles prepared for you," he whispers, his face inches from yours. "Puzzles with no solutions. Riddles with no answers. Locks without keys. And we have all of eternity to explore them together."',

    "The ground beneath you splits open, revealing a chasm of writhing flames and distant screams. As you begin to fall, the Devil's laughter follows you down, down into the endless dark.",

    '"Welcome home," his voice echoes as the inferno rises to claim you. "We\'re going to have so much FUN together."',

    "You plummet through layers of fire and darkness, each level more terrifying than the last. The screams of the damned rise to meet you, a cacophony of eternal suffering that will soon include your own voice.",

    "As you descend deeper, you catch glimpses of torments beyond imagination—souls trapped in personal hells tailored to their specific sins. A gambler forever reaching for cards that turn to ash in his hands. A glutton surrounded by feasts that turn rancid at first bite.",

    "Your fall slows as you approach your own personal hell. A twisted version of that rain-soaked highway stretches before you, the moment of impact playing on endless loop. Each time, you feel the full force of the crash, the terror, the guilt, the pain—only to be reset and forced to experience it again.",

    "The Devil's voice surrounds you, no longer charming but raw with malevolent glee: \"You chose this fate for others, and now you've chosen it for yourself. Poetic, isn't it? I do so love when souls condemn themselves.\"",

    "And so begins your eternity—trapped in the moment of your greatest failure, your greatest sin, with no hope of redemption or escape. Just as you judged, so have you been judged.",

    "The Devil was right about one thing: there will be puzzles here. The puzzle of maintaining your sanity through endless torment. The puzzle of remembering who you were before this became your reality. And the greatest puzzle of all—wondering if, given another chance, you might have chosen differently.",
  ]

  const heavenEnding = [
    '"Heaven?" The Devil\'s eyebrows arch high on his forehead, his expression one of genuine surprise that quickly morphs into something darker. "How... remarkably generous of you. Forgiveness regardless of consequence. How very... convenient."',

    'He begins to pace, his movements becoming increasingly agitated, leaving scorched footprints on the stone floor. "So one should be judged by the entirety of their life, not by a single mistake? Even when that mistake STOLE an innocent life?"',

    'The Devil stops abruptly, his handsome face contorting with barely contained rage. "How DARE you presume to be so magnanimous with forgiveness that isn\'t yours to give!"',

    "With a violent gesture, he tears open another rift in reality. But this time, the vision shows you behind the wheel of that car on that rainy night.",

    '"The soul I described," he snarls, all pretense of charm vanishing, "was YOURS."',

    "The memories flood back in a torrent of guilt and horror. The drinks. The pills. The fatal decision to drive. The crash. The life you ended along with your own.",

    "The Devil's form grows larger, more monstrous, his skin splitting to reveal something ancient and terrible beneath. His voice becomes a cacophony of screams and whispers.",

    '"SUCH NARCISSISM!" he roars, the chamber shaking with his fury. "Such ENTITLEMENT! You think you deserve paradise after what you\'ve done? You think your \'good life\' outweighs the life you STOLE?"',

    'He looms over you, his shadow engulfing you completely. "You disgust me with your self-serving morality. Heaven? HEAVEN?! You won\'t see Heaven for a thousand lifetimes!"',

    "The Devil's rage suddenly cools, replaced by something more calculated and cruel. \"But I'm feeling... creative today. I can't claim your soul—your judgment prevents that—but I can ensure you remain in Limbo. Forever.\"",

    'He leans in close, his breath like the heat from an open grave. "Neither Heaven nor Hell will have you. You\'ll drift in the void between worlds, alone with your memories and guilt for eternity. Or perhaps..."',

    'A terrible smile spreads across his face. "Perhaps reincarnation is in order. Something humbling. A dung beetle, perhaps? Or if you\'re lucky, a cute but perpetually confused puppy, doomed to chase its tail in endless circles, much like your circular, self-serving logic."',

    'As the ground beneath you dissolves into mist, the Devil\'s mocking laughter follows you into the void. "Better luck next time! Do try to make better choices!"',

    "The mist envelops you completely, and you feel yourself drifting, untethered from physical form. The Devil's realm fades away, but so does any sense of direction or purpose. You are nowhere and everywhere, suspended in a gray limbo of your own making.",

    "Time loses all meaning. You might have been floating for minutes or millennia—there's no way to tell. Occasionally, you catch glimpses of both realms you've been denied: flashes of heavenly light from above, echoes of hellish screams from below. Both equally unreachable.",

    "Your only companions are your memories and regrets. The life you lived plays before you in fragments—moments of kindness and generosity that now seem hollow against the weight of your final mistake. The face of the person whose life you ended haunts you, their unfinished story a constant accusation.",

    "Sometimes, you feel yourself drawn toward a new beginning—the pull of reincarnation, the promise of another chance. But each time, at the threshold of rebirth, you hesitate, paralyzed by the fear of making the same mistakes again.",

    "This is your purgatory—not a place of cleansing and redemption, but a state of eternal indecision and regret. Neither damned nor saved, neither punished nor forgiven. Just... forgotten.",

    "In rare moments of clarity, you wonder if this was the Devil's cruelest trick of all—letting you believe you could judge your own fate, only to ensure you would choose the one path that would leave you forever adrift, forever alone with the knowledge of what you've done and what you've lost.",

    "And somewhere in the darkness between worlds, you can still hear the faint echo of the Devil's laughter.",
  ]

  const neitherEnding = [
    '"Neither?" The Devil tilts his head, studying you with newfound interest. His eyes narrow, then widen with something almost like respect. "Not Heaven, not Hell... a nuanced answer. How... unexpected."',

    'He circles you slowly, tapping one long finger against his chin. "Justice tempered with mercy. Punishment without eternal condemnation. Fascinating."',

    'For the first time, the Devil\'s theatrical facade seems to slip, revealing something older and more contemplative beneath. "You know," he says quietly, "I think you\'ve just solved my little riddle."',

    "With a gesture more gentle than before, he opens another rift in reality. But this time, the vision shows you behind the wheel of that car on that rainy night.",

    '"The soul I described," he says, his voice now soft but clear, "was yours."',

    "The memories return, not in a crushing wave but in a steady flow of clarity. The depression. The medication. The alcohol that promised temporary relief. The fatal decision to drive. The crash. The life you took along with your own.",

    '"You\'ve been in Limbo," the Devil explains, his form now more contained, almost dignified. "This journey—from prison to mansion to forest to desert, and finally to my realm—was your soul\'s trial. And you\'ve passed."',

    'He gestures, and a path of soft light appears, cutting through the darkness toward a distant horizon. "Not Heaven—that door is closed to you for now. But not Hell either. You\'ve earned another chance."',

    'The Devil approaches you, extending his hand not to grab you but in a gesture almost like... respect. "A new life awaits you. New challenges, new puzzles to solve. A chance to do better."',

    "As you step onto the path of light, the Devil's expression shifts to something unreadable—part amusement, part warning.",

    '"Don\'t mess it up this time," he calls after you, his voice echoing strangely. "The universe rarely offers second chances."',

    "He smiles then, a smile that doesn't quite reach his eyes, and adds in a whisper that somehow carries clearly to your ears: \"Besides, I'd hate to see you back here so soon... though I must admit, you are entertaining company.\"",

    "The path before you brightens, and as you walk forward, you feel the weight of your past life lifting. Not forgotten—never that—but no longer a chain binding you to eternal punishment.",

    'Behind you, barely audible as the light grows stronger, you hear the Devil\'s final words: "Until we meet again... and we will meet again."',

    "The path leads you through a shimmering veil, and suddenly you're standing in a vast, misty expanse. It's neither the fiery depths of Hell nor the radiant heights of Heaven, but something in between—a realm of second chances.",

    "Before you stretches a gallery of lives—countless possible futures, each a different path your soul might take. You see yourself as a teacher, guiding troubled youth away from the mistakes you made. You see yourself as a doctor, saving lives to balance the one you took. You see yourself as a simple gardener, finding redemption in nurturing life in all its forms.",

    'A gentle voice—neither male nor female, neither young nor old—speaks from the mist: "Choose wisely. Your judgment of yourself shows wisdom beyond what most souls possess. You understand that actions have consequences, but also that a single mistake need not define an entire existence."',

    "You move among the possible lives, feeling drawn to some more than others. Each represents not just a future, but a form of atonement, a way to make amends for the life you ended through your recklessness.",

    '"The soul you harmed has continued its journey," the voice tells you. "In your new life, your paths may cross again—not as victim and perpetrator, but perhaps as teacher and student, healer and patient, friend and friend. The universe has a way of bringing souls together to resolve what remains unfinished."',

    "As you reach toward your chosen future, you feel a profound sense of gratitude mixed with determination. This is not forgiveness—not yet—but it is opportunity. A chance to prove that your one terrible mistake is not the sum total of who you are or who you can become.",

    "The mist swirls around you, and you feel yourself beginning to change, to diminish, to be reborn. Your memories of this place will fade like a dream upon waking, but the lessons—those will remain, buried deep in your new consciousness, guiding you toward better choices.",

    "And as you slip into your new beginning, you carry with you both the weight of what you've done and the hope of what you might yet do. Neither damned nor saved—just human, with all the terrible and wonderful potential that entails.",
  ]

  // Determine which paragraphs to show based on the current state
  const getCurrentParagraphs = () => {
    if (ending === "none") {
      return devilIntro
    } else if (ending === "hell") {
      return hellEnding
    } else if (ending === "heaven") {
      return heavenEnding
    } else {
      return neitherEnding
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
                      ? "Your journey continues in a different form..."
                      : "Your journey continues beyond this realm..."}
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
