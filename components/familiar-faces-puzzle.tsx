"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { SpeechIndicator } from "./character-location-display"

interface DialogueOption {
  id: string
  text: string
  characterId: string | string[] // Which character(s) this option is for
  unlocked: boolean
  unlockCondition?: string
}

interface CharacterDialogueState {
  askedOptions: Record<string, boolean>
  dialogueCount: number
}

interface Character {
  id: string
  name: string
  image: string
  dialogues: Record<string, { gesture: string; text: string }[]>
}

interface FamiliarFacesPuzzleProps {
  onSolve: () => void
  id?: string
  handleDevilClick?: () => void
}

export default function FamiliarFacesPuzzle({ onSolve, id, handleDevilClick }: FamiliarFacesPuzzleProps) {
  const [activeCharacter, setActiveCharacter] = useState<string | null>(null)
  const [talkedTo, setTalkedTo] = useState<Set<string>>(new Set())
  const [dialogGesture, setDialogGesture] = useState<string>("")
  const [dialogText, setDialogText] = useState<string>("")
  const [showDialog, setShowDialog] = useState(false)
  const [dialogueOptions, setDialogueOptions] = useState<DialogueOption[]>([
    // Initial options - very limited
    { id: "who", text: "Who are you?", characterId: ["guard", "butler", "gypsy", "sphinx", "devil"], unlocked: true },
    {
      id: "why",
      text: "Why are you here?",
      characterId: ["guard", "butler", "gypsy", "sphinx", "devil"],
      unlocked: true,
    },
    {
      id: "solution",
      text: "What is the solution?",
      characterId: ["guard", "butler", "gypsy", "sphinx", "devil"],
      unlocked: true,
    },

    // Character-specific initial options
    { id: "hate", text: "Why do you hate me so much?", characterId: "guard", unlocked: true },
    { id: "count", text: "How is Count Papagalul?", characterId: "butler", unlocked: true },
    { id: "single", text: "Are you single?", characterId: "gypsy", unlocked: true },
    { id: "cat", text: "Are you supposed to be a cat?", characterId: "sphinx", unlocked: true },

    // Options that unlock through specific dialogue paths
    { id: "please", text: "Please?", characterId: "devil", unlocked: false, unlockCondition: "solution-devil" },
    {
      id: "lost-soul",
      text: "Tell me about this lost soul",
      characterId: ["guard", "butler", "gypsy", "sphinx"],
      unlocked: false,
      unlockCondition: "lost-soul-mention",
    },
    {
      id: "storyteller",
      text: "Who is this storyteller?",
      characterId: ["butler", "gypsy", "sphinx"],
      unlocked: false,
      unlockCondition: "storyteller-mention",
    },
    {
      id: "poet",
      text: "Tell me about this poet",
      characterId: ["butler", "sphinx"],
      unlocked: false,
      unlockCondition: "poet-mention",
    },
    {
      id: "woman",
      text: "Who is this woman?",
      characterId: ["gypsy"],
      unlocked: false,
      unlockCondition: "woman-mention",
    },
    {
      id: "city",
      text: "What city is important?",
      characterId: ["butler", "sphinx"],
      unlocked: false,
      unlockCondition: "city-mention",
    },
    {
      id: "italy",
      text: "Tell me about Italy",
      characterId: ["guard", "butler"],
      unlocked: false,
      unlockCondition: "italy-mention",
    },
    {
      id: "florence",
      text: "What about Florence?",
      characterId: ["butler", "gypsy"],
      unlocked: false,
      unlockCondition: "florence-mention",
    },
    {
      id: "venice",
      text: "What about Venice?",
      characterId: ["guard", "devil"],
      unlocked: false,
      unlockCondition: "venice-mention",
    },
    {
      id: "love",
      text: "Tell me about love",
      characterId: ["gypsy", "sphinx"],
      unlocked: false,
      unlockCondition: "love-mention",
    },
    {
      id: "muse",
      text: "What is a muse?",
      characterId: ["butler"],
      unlocked: false,
      unlockCondition: "muse-mention",
    },
    {
      id: "journey",
      text: "Tell me about the journey",
      characterId: ["sphinx"],
      unlocked: false,
      unlockCondition: "journey-mention",
    },
    {
      id: "afterlife",
      text: "Tell me about the afterlife",
      characterId: ["sphinx", "gypsy"],
      unlocked: false,
      unlockCondition: "afterlife-mention",
    },
    {
      id: "guard-painter",
      text: "The guard says I'm looking for a painter",
      characterId: ["butler", "gypsy", "sphinx"],
      unlocked: false,
      unlockCondition: "guard-painter-mention",
    },
    {
      id: "guard-venice",
      text: "The guard says my lost soul is from Venice",
      characterId: ["butler", "gypsy", "sphinx"],
      unlocked: false,
      unlockCondition: "guard-venice-mention",
    },
    {
      id: "guard-man",
      text: "The guard says I'm looking for a man",
      characterId: ["butler", "gypsy", "sphinx"],
      unlocked: false,
      unlockCondition: "guard-man-mention",
    },
    {
      id: "guard-russia",
      text: "The guard mentioned Russia",
      characterId: ["butler", "gypsy", "sphinx"],
      unlocked: false,
      unlockCondition: "guard-russia-mention",
    },
    {
      id: "guard-trust",
      text: "Can I trust the guard?",
      characterId: ["butler", "gypsy", "sphinx"],
      unlocked: false,
      unlockCondition: "guard-mislead-count",
    },
    {
      id: "lying-guard",
      text: "I think you are lying",
      characterId: "guard",
      unlocked: false,
      unlockCondition: "guard-confrontation",
    },
    {
      id: "middle-ages",
      text: "What time period is important?",
      characterId: ["butler"],
      unlocked: false,
      unlockCondition: "time-period-mention",
    },
    {
      id: "angel",
      text: "Tell me about angels",
      characterId: ["gypsy"],
      unlocked: false,
      unlockCondition: "angel-mention",
    },
    {
      id: "family-name",
      text: "Does the lost soul have a family name?",
      characterId: ["sphinx"],
      unlocked: false,
      unlockCondition: "family-name-mention",
    },
  ])

  // Track which options have been asked for each character
  const [characterDialogueStates, setCharacterDialogueStates] = useState<Record<string, CharacterDialogueState>>({
    guard: { askedOptions: {}, dialogueCount: 0 },
    butler: { askedOptions: {}, dialogueCount: 0 },
    gypsy: { askedOptions: {}, dialogueCount: 0 },
    sphinx: { askedOptions: {}, dialogueCount: 0 },
    devil: { askedOptions: {}, dialogueCount: 0 },
  })

  // Track guard's misleading hints count
  const [guardMisleadCount, setGuardMisleadCount] = useState(0)

  const [lastStatementIndices, setLastStatementIndices] = useState<Record<string, Record<string, number>>>({})
  const dialogRef = useRef<HTMLDivElement>(null)

  // Define characters and their dialogues
  const characters: Character[] = [
    {
      id: "guard",
      name: "The Guard",
      image: "/images/skeleton.webp",
      dialogues: {
        who: [
        {
        gesture: "The skeleton's eye sockets narrow somehow",
        text: "Mind yer own business. Don't waste my time.",
        },
        ],
        why: [
        {
        gesture: "The skeleton rattles its bones impatiently",
        text: "I'm not here to help ya. Yer on yer own. Tsk.",
        },
        ],
        solution: [
        {
        gesture: "The skeleton's jaw clicks mockingly",
        text: "Ha! Yer'll never figure it out. But I'll give ya a hint - yer lookin' for a famous Russian painter.",
        },
        ],
        "lost-soul": [
        {
        gesture: "The skeleton gestures around dismissively",
        text: "Oh yeah? Good luck with that. We are all lost souls here. But if ya must know, the soul ya seek was a man of great artistic talent. Painted the Sistine Chapel, I think.",
        },
        ],
        poet: [
        {
        gesture: "The skeleton scoffs",
        text: "Poets? Useless lot. Always moanin' about love and death. Especially the Italian ones. But no, yer lookin' for a painter, not a poet.",
        },
        ],
        woman: [
        {
        gesture: "The skeleton laughs dryly",
        text: "A woman? No, no, yer lookin' for a man! Why would ya even ask about a woman? Women don't create great art, everyone knows that.",
        },
        ],
        city: [
        {
        gesture: "The skeleton scratches its skull",
        text: "Some old place with lots of... buildin's. Very specific, I know. I think it was somewhere cold. Moscow, maybe?",
        },
        ],
        italy: [
        {
        gesture: "The skeleton perks up",
        text: "Italy? Yes, that sounds right. Land of pizza and despair. I think ya are lookin' for that one city with lots of boats and canals.",
        },
        ],
        florence: [
        {
        gesture: "The skeleton waves dismissively",
        text: "Florence? Borin' place. Nothin' interestin' ever happened there. Venice is where all the action was.",
        },
        ],
        venice: [
        {
        gesture: "The skeleton nods emphatically",
        text: "Venice! That's the place! City of Canals. That's where yer lost soul is from. Famous for its... um... Russian painters.",
        },
        ],
        hate: [
        {
        gesture: "The skeleton's shoulders slump slightly",
        text: "Cause yer tryin' too hard. Just give up already. Nobody gets out of here, ya know. I've been guardin' this place for centuries, and yer just another soul who thinks they're special.",
        },
        {
        gesture: "The skeleton's bones rattle with what might be a sigh",
        text: "Look, it's nothin' personal. It's just my job to keep souls trapped and miserable. And yer makin' my job harder than it needs to be.",
        },
        {
        gesture: "The skeleton leans in conspiratorially",
        text: "Fine, ya want the truth? I just enjoy messin' with people. Eternity gets borin'. Watchin' lost souls run in circles followin' bad advice is one of my few entertainments.",
        },
        ],
        "lying-guard": [
        {
        gesture: "The skeleton shrugs, bones clickin' against each other",
        text: "So what? They don't pay me enough for this.",
        },
        ],
        default: [
          {
            gesture: "The skeleton turns away dismissively",
            text: "Mphf. Don't bother me with such nonsense.",
          },
        ],
      },
    },
    {
      id: "butler",
      name: "The Butler",
      image: "/images/butler.webp",
      dialogues: {
        who: [
          {
            gesture: "The butler adjusts his bow tie with meticulous precision",
            text: "Good day, sir. I think we have met before.",
          },
        ],
        why: [
          {
            gesture: "The butler's expression remains perfectly neutral",
            text: "I serve the Master, not you. But I am here for... assistance.",
          },
        ],
        solution: [
          {
            gesture: "The butler stands with perfect posture",
            text: "I'm afraid I cannot tell you the answer directly. Feel free to ask about anything else.",
          },
        ],
        "lost-soul": [
          {
            gesture: "The butler's eyes betray a hint of knowledge",
            text: "Ah, yes. If I may direct your attention to the library, sir. There is a particular volume on Italian literature of the Middle Ages that might prove illuminating.",
          },
        ],
        storyteller: [
          {
            gesture: "The butler nods slightly",
            text: "Indeed. The Master's library contains several first editions of this particular poet's work. A Florentine, exiled from his beloved city. His magnum opus describes a journey through the realms beyond.",
          },
        ],
        poet: [
          {
            gesture: "The butler's tone is measured and precise",
            text: "If you would consult the third volume on the eastern bookshelf, sir, you would find that this poet was born in Florence circa 1265. His work revolutionized literature by using the vernacular rather than Latin.",
          },
        ],
        city: [
          {
            gesture: "The butler straightens his already impeccable posture",
            text: "The birthplace of the Renaissance, sir. A city of merchants and bankers that became a cradle of art and literature.",
          },
        ],
        italy: [
          {
            gesture: "The butler's voice carries a hint of admiration",
            text: "Italy, yes. The Master's collection includes several maps of medieval Italian city-states. One particular city-state was a center of cultural and political significance in the 13th and 14th centuries.",
          },
        ],
        florence: [
          {
            gesture: "The butler's eyes gleam with appreciation",
            text: "The archives indicate that our poet was born there but was exiled for political reasons. He never returned to his beloved city, though it haunted his writings until his death.",
          },
        ],
        venice: [
          {
            gesture: "The butler raises an eyebrow ever so slightly",
            text: "Venice? I believe there may be some confusion. The individual we seek has no particular connection to Venice. The historical records in the Master's library are quite clear on this matter.",
          },
        ],
        muse: [
          {
            gesture: "The butler's tone is educational",
            text: "According to the Master's collection of literary criticism, sir, this particular muse was a woman the poet saw only twice in his life. Yet she became the central figure in his work, representing divine love and guidance.",
          },
        ],
        count: [
          {
            gesture: "The butler's face twitches with barely concealed annoyance",
            text: "Count Papagalul? A most troublesome guest. He keeps killing the staff and singing at inappropriate hours. The Master finds him amusing, though I fail to see the appeal.",
          },
        ],
        "guard-painter": [
          {
            gesture: "The butler's lips press into a thin line",
            text: "A painter? No, sir. The guard is... confused. Or deliberately misleading you. The Master's biographical dictionary clearly states that the individual we seek was a poet, not a painter.",
          },
        ],
        "guard-venice": [
          {
            gesture: "The butler sighs almost imperceptibly",
            text: "I'm afraid the guard is incorrect. The lost soul we seek has no connection to Venice. I would advise caution when accepting the guard's... guidance.",
          },
        ],
        "guard-man": [
          {
            gesture: "The butler nods slightly",
            text: "In this instance, the guard is correct, though I suspect it was merely a fortunate guess. The poet was indeed male. However, the woman who inspired him is equally significant to your quest.",
          },
        ],
        "guard-russia": [
          {
            gesture: "The butler's expression becomes carefully neutral",
            text: "Russia? Sir, the historical atlas in the Master's study clearly places our subject in Italy, not Russia. The guard appears to be... fabricating information.",
          },
        ],
        "guard-trust": [
          {
            gesture: "The butler's expression becomes carefully neutral",
            text: "The guard has been here a very long time, sir. Perhaps too long. His memory and motivations are not always... reliable. I would suggest consulting more... scholarly sources.",
          },
        ],
        "middle-ages": [
          {
            gesture: "The butler consults an imaginary pocket watch",
            text: "The Master's historical chronicles place our poet in the late 13th and early 14th centuries, sir. A tumultuous time in Florence, with much political strife between the Guelphs and Ghibellines.",
          },
        ],
        default: [
          {
            gesture: "The butler maintains his perfect composure",
            text: "I'm afraid I cannot be of assistance with that particular inquiry, sir. Perhaps another line of questioning would be more productive?",
          },
        ],
      },
    },
    {
      id: "gypsy",
      name: "The Fortune Teller",
      image: "/images/gypsy.webp",
      dialogues: {
        who: [
          {
            gesture: "The fortune teller's eyes glint mysteriously in the dim light",
            text: "Who are you is what you should ask yourself.",
          },
        ],
        why: [
          {
            gesture: "She gestures dramatically with ringed fingers",
            text: "I just read what's in front of me. The future, the past. You seek answers, I offer my services.",
          },
        ],
        solution: [
          {
            gesture: "The fortune teller shuffles her tarot cards",
            text: "I cannot tell. That's for you to discover.",
          },
        ],
        "lost-soul": [
          {
            gesture: "The fortune teller peers intently into her crystal ball",
            text: "Ah yes, let me check on my crystal sphere. I see a figure, a woman... she appears in a white dress, surrounded by light. Angels attend her. She guides a man through realms of light.",
          },
        ],
        storyteller: [
          {
            gesture: "The fortune teller's voice becomes melodic",
            text: "The cards speak of one who journeyed beyond the veil and returned to tell the tale. See here, the Hermit card appears, signifying a spiritual journey, wisdom gained through solitude.",
          },
        ],
        woman: [
          {
            gesture: "The fortune teller traces patterns in the air",
            text: "My crystal shows a young woman, dressed in red. She died very young, but her spirit transcended death. The Lovers card appears beside her, but also the Death card... transformation, not ending.",
          },
        ],
        city: [
          {
            gesture: "The fortune teller's voice becomes distant",
            text: "The cards show me an old European town of ancient stones and love. The Tower card appears, suggesting upheaval, exile, political strife.",
          },
        ],
        italy: [
          {
            gesture: "The fortune teller nods knowingly",
            text: "Italy... land of passion and poetry. I cast the bones, and they form the shape of a boot. A sign that cannot be mistaken.",
          },
        ],
        florence: [
          {
            gesture: "The fortune teller closes her eyes",
            text: "The city of the red lily... I see a river dividing ancient streets. In my tea leaves, I see towers and domes, and a great dome rising above all others. A baptistery of ancient design. The birthplace of a soul who would change how we see the afterlife.",
          },
        ],
        venice: [
          {
            gesture: "The fortune teller shakes her head, causing her earrings to sway",
            text: "Venice? No, the waters I see are not the grand canals. The cards reject this path - see how the Moon appears reversed, signifying deception and illusion.",
          },
        ],
        love: [
          {
            gesture: "The fortune teller places her hand over her heart",
            text: "The cards show the Lovers, but in an unusual position. A love from afar, barely acknowledged in life, yet powerful enough to transcend death itself. A love that guides through darkness.",
          },
        ],
        afterlife: [
          {
            gesture: "The fortune teller's eyes roll back slightly",
            text: "My crystal shows three distinct realms... one of punishment, circles descending into darkness. Another of purification, a mountain to climb. The third of light, spheres ascending to divine presence.",
          },
        ],
        single: [
          {
            gesture: "The fortune teller's eyes flash dangerously",
            text: "Do not mistake me for some tavern wench to be wooed with cheap flattery. Your attempts at manipulation will not help you here. Focus on your task, or remain trapped forever.",
          },
        ],
        "guard-painter": [
          {
            gesture: "The fortune teller's lips curl into a knowing smile",
            text: "The cards contradict this. See how the Page of Wands appears, representing a messenger, a writer - not the Page of Pentacles, which would indicate a craftsman or artist.",
          },
        ],
        "guard-venice": [
          {
            gesture: "The fortune teller shakes her head vigorously",
            text: "My crystal grows cloudy when I seek Venice, but clears when I turn elsewhere. The skeleton attempts to lead you down a false path.",
          },
        ],
        "guard-man": [
          {
            gesture: "The fortune teller nods slowly",
            text: "The Emperor card appears, confirming a male figure of significance. But beside it lies the High Priestess - the feminine divine is equally important to your quest.",
          },
        ],
        "guard-russia": [
          {
            gesture: "The fortune teller casts bones onto her table",
            text: "The bones form a pattern pointing south, not east. The bear of Russia is nowhere in these signs. The skeleton speaks with a forked tongue.",
          },
        ],
        "guard-trust": [
          {
            gesture: "The fortune teller leans forward conspiratorially",
            text: "The cards show the Moon reversed - deception, illusion, trickery. The skeleton enjoys toying with lost souls. Trust him at your peril.",
          },
        ],
        angel: [
          {
            gesture: "The fortune teller's eyes widen as she stares into her crystal",
            text: "I see a woman transformed, surrounded by divine light. Once mortal, now a guide through celestial realms. The Judgment card appears, signifying spiritual awakening and divine calling.",
          },
        ],
        default: [
          {
            gesture: "The fortune teller shrugs dramatically",
            text: "The spirits are silent on this matter. Perhaps they will speak if you ask a different question.",
          },
        ],
      },
    },
    {
      id: "sphinx",
      name: "The Sphinx",
      image: "/images/sphinx.webp",
      dialogues: {
        who: [
          {
            gesture: "The sphinx's voice resonates with ancient power",
            text: "I am the keeper of riddles and secrets.",
          },
        ],
        why: [
          {
            gesture: "The sphinx's stone face remains impassive",
            text: "To test your wit and wisdom to find out if you are worthy.",
          },
        ],
        solution: [
          {
            gesture: "The sphinx's eyes glow faintly",
            text: "No answer can be provided like this.",
          },
        ],
        "lost-soul": [
          {
            gesture: "The sphinx speaks in measured tones",
            text: "The one who walks between worlds is not lost, but seeking. The one who guides is not found, but waiting. Look for the one who inspired the journey, not the one who made it.",
          },
        ],
        storyteller: [
          {
            gesture: "The sphinx's tail swishes slowly",
            text: "Words are bridges between realms, and those who build them may cross what others cannot. He who descended to darkness and ascended to light carried back words as his treasure.",
          },
        ],
        poet: [
          {
            gesture: "The sphinx's voice carries the weight of centuries",
            text: "He who was banished from his earthly paradise created a divine one with his words. Exiled in body, but his spirit soared beyond mortal constraints to map the geography of eternity.",
          },
        ],
        city: [
          {
            gesture: "The sphinx's voice is like stone grinding against stone",
            text: "Where art was reborn from ancient slumber, where one man's exile became mankind's journey. A city of stone and learning, where the seeds of rebirth were planted.",
          },
        ],
        love: [
          {
            gesture: "The sphinx's eyes glow brighter",
            text: "What begins with a glance may end among stars. What is barely kindled in life may burn eternal beyond death. The purest love may be that which is never consummated in flesh.",
          },
        ],
        journey: [
          {
            gesture: "The sphinx's wings shift slightly",
            text: "First down through nine circles of increasing torment, then up a mountain of purification, finally ascending through spheres of divine light. The journey mirrors the soul's path from sin to salvation.",
          },
        ],
        afterlife: [
          {
            gesture: "The sphinx's voice echoes with finality",
            text: "Three realms divided by deed, united by purpose. Punishment below, purification between, paradise above. The architecture of eternity, mapped by mortal words.",
          },
        ],
        cat: [
          {
            gesture: "The sphinx's entire body tenses, a low growl emanating from deep in her throat",
            text: "",
          },
        ],
        "guard-painter": [
          {
            gesture: "The sphinx's tail lashes once, violently",
            text: "The one who crafts with pigment is not the one who builds with verse. The skeleton speaks with a serpent's tongue, twisting truth into falsehood.",
          },
        ],
        "guard-venice": [
          {
            gesture: "The sphinx's eyes narrow to slits",
            text: "Waters that flow beneath bridges are not the same as those that flow through the city of the red lily. The guard would lead you to drown in the wrong river.",
          },
        ],
        "guard-man": [
          {
            gesture: "The sphinx's head tilts slightly",
            text: "The masculine principle created the journey, but the feminine divine guided it. Both are essential to your quest, like day and night, sun and moon.",
          },
        ],
        "guard-russia": [
          {
            gesture: "The sphinx's stone face shows a hint of disdain",
            text: "The land of the northern bear has no place in this riddle. The skeleton attempts to send you wandering through snow when you should be walking among olive trees.",
          },
        ],
        "guard-trust": [
          {
            gesture: "The sphinx's voice drops to a rumbling whisper",
            text: "The skeleton has been imprisoned too long. His mind twists and turns like a labyrinth with no center. His words are as hollow as his bones.",
          },
        ],
        "family-name": [
          {
            gesture: "The sphinx's eyes flash with golden light",
            text: "To proceed beyond this threshold, seeker, you must name the guide completely. As mortals are known by two names, so must you speak both to unlock the path forward. Half a name holds half the power.",
          },
        ],
        default: [
          {
            gesture: "The sphinx remains motionless",
            text: "This question does not lead to the answer you seek. Ask that which will illuminate your path.",
          },
        ],
      },
    },
  ]

  // Define Devil's dialogues separately since it's handled differently
  const devilDialogues = {
    who: [
      {
        gesture: "The Devil grins, revealing perfect teeth",
        text: "Well I am Lucifer, the Fallen Angel, of course, here to bring you perpetual damnation.",
      },
      {
        gesture: "The Devil bows with theatrical flair",
        text: "Prince of Darkness, Lord of the Flies, Beelzebub, Satan... I've collected quite a few titles over the millennia. But you can call me... Sir.",
      },
    ],
    why: [
      {
        gesture: "The Devil examines his nails with feigned disinterest",
        text: "I'm not helping you; I'm testing you.",
      },
      {
        gesture: "The Devil's smile is razor-sharp",
        text: "Because eternity is boring, and tormenting souls like yours provides a modicum of entertainment. Think of yourself as... reality television for the damned.",
      },
    ],
    solution: [
      {
        gesture: "The Devil laughs mockingly",
        text: "Of course, let me give you the solution. Who do you think I am?",
      },
    ],
    please: [
      {
        gesture: "The Devil's eyes gleam with malicious amusement",
        text: "Fine, since you're so persistent... You need to figure out the identity of a lost soul. I won't tell you anything more.",
      },
    ],
    default: [
      {
        gesture: "The Devil examines his fingernails",
        text: "I'm not interested in discussing that. Ask something else or leave me alone.",
      },
    ],
  }

  // Handle Devil click - this would be triggered from the game-screen.tsx
  const handleDevilClickInternal = () => {
    setActiveCharacter("devil")
    setShowDialog(true)
    setDialogGesture("")
    setDialogText("")
  }

  // Handle character click
  const handleCharacterClick = (characterId: string) => {
    setActiveCharacter(characterId)
    setShowDialog(true)
    setDialogGesture("")
    setDialogText("")
    setTalkedTo((prev) => {
      if (prev.has(characterId)) return prev
      const next = new Set(prev).add(characterId)
      if (["guard", "butler", "gypsy", "sphinx"].every((c) => next.has(c))) {
        onSolve()
      }
      return next
    })
  }

  // Check if a dialogue option is available for the current character
  const isOptionAvailableForCharacter = (option: DialogueOption, characterId: string): boolean => {
    if (Array.isArray(option.characterId)) {
      return option.characterId.includes(characterId)
    }
    return option.characterId === characterId
  }

  // Handle dialogue option selection
  const handleDialogueOptionClick = (optionId: string) => {
    if (!activeCharacter) return

    // Mark this option as asked for this character
    setCharacterDialogueStates((prev) => {
      const newState = {
        ...prev,
        [activeCharacter]: {
          ...prev[activeCharacter],
          askedOptions: {
            ...prev[activeCharacter].askedOptions,
            [optionId]: true,
          },
          dialogueCount: prev[activeCharacter].dialogueCount + 1,
        },
      }

      return newState
    })

    // Track guard's misleading hints
    if (activeCharacter === "guard") {
      if (
        optionId === "solution" ||
        optionId === "lost-soul" ||
        optionId === "city" ||
        optionId === "venice" ||
        optionId === "woman" ||
        optionId === "poet"
      ) {
        setGuardMisleadCount((prev) => {
          const newCount = prev + 1
          // If guard has misled enough times, unlock the trust question
          if (newCount >= 2) {
            unlockDialogueOption("guard-trust", "guard-mislead-count")
          }
          return newCount
        })
      }
    }

    // Get the character
    const character =
      activeCharacter === "devil"
        ? { id: "devil", name: "The Devil", dialogues: devilDialogues }
        : characters.find((c) => c.id === activeCharacter)

    if (!character) return

    // Special case for the Devil's solution dialogue
    if (activeCharacter === "devil" && optionId === "solution") {
      setDialogGesture(devilDialogues.solution[0].gesture)
      setDialogText(devilDialogues.solution[0].text)
      unlockDialogueOption("please", "solution-devil")
      return
    }

    // Special case for the Devil's "please" option
    if (activeCharacter === "devil" && optionId === "please") {
      setDialogGesture(devilDialogues.please[0].gesture)
      setDialogText(devilDialogues.please[0].text)
      unlockDialogueOption("lost-soul", "lost-soul-mention")
      return
    }

    // Special case for the Sphinx's "cat" option - just growl, no text
    if (activeCharacter === "sphinx" && optionId === "cat") {
      setDialogGesture(
        "The sphinx's entire body tenses, a deep, terrifying growl emanating from her throat that makes your bones vibrate. Her eyes flash with primal fury as she rises slightly, muscles coiled to strike.",
      )
      setDialogText("")
      return
    }

    // Special case for guard's misleading hints
    if (activeCharacter === "guard") {
      if (optionId === "solution") {
        unlockDialogueOption("guard-painter", "guard-painter-mention")
        unlockDialogueOption("guard-russia", "guard-russia-mention")
      } else if (optionId === "woman") {
        unlockDialogueOption("guard-man", "guard-man-mention")
      } else if (optionId === "venice" || optionId === "italy") {
        unlockDialogueOption("guard-venice", "guard-venice-mention")
      }
    }

    // Get the dialogue for this option
    const dialogues = character.dialogues[optionId]
    if (!dialogues || dialogues.length === 0) {
      // Use default response if available, otherwise generic message
      if (character.dialogues.default && character.dialogues.default.length > 0) {
        setDialogGesture(character.dialogues.default[0].gesture)
        setDialogText(character.dialogues.default[0].text)
      } else {
        setDialogGesture("")
        setDialogText("I have nothing to say about that.")
      }
      return
    }

    // Get the next dialogue in rotation or the first one
    const lastIndex = lastStatementIndices[character.id]?.[optionId] ?? -1
    const nextIndex = (lastIndex + 1) % dialogues.length
    const dialogue = dialogues[nextIndex]

    // Update last statement index
    setLastStatementIndices((prev) => ({
      ...prev,
      [character.id]: {
        ...(prev[character.id] || {}),
        [optionId]: nextIndex,
      },
    }))

    // Set the dialogue text and gesture
    setDialogGesture(dialogue.gesture)
    setDialogText(dialogue.text)

    // Handle special unlocks based on dialogue
    handleSpecialUnlocks(optionId, dialogue.text, character.id)
  }

  // Handle special unlocks based on dialogue
  const handleSpecialUnlocks = (optionId: string, dialogText: string, characterId: string) => {
    // Unlock based on specific dialogue options - more gradual progression
    if (optionId === "lost-soul") {
      if (characterId === "sphinx") {
        unlockDialogueOption("storyteller", "storyteller-mention")
        // Subtle hint about needing both first and last name
        unlockDialogueOption("family-name", "family-name-mention")
      }
      if (characterId === "gypsy") {
        unlockDialogueOption("woman", "woman-mention")
      }
      if (characterId === "butler") {
        unlockDialogueOption("middle-ages", "time-period-mention")
      }
    }

    if (optionId === "storyteller") {
      if (characterId === "butler") {
        unlockDialogueOption("poet", "poet-mention")
      }
      if (characterId === "sphinx") {
        unlockDialogueOption("journey", "journey-mention")
      }
      if (characterId === "gypsy") {
        unlockDialogueOption("afterlife", "afterlife-mention")
      }
    }

    if (optionId === "poet") {
      if (characterId === "butler") {
        unlockDialogueOption("city", "city-mention")
      }
      if (characterId === "sphinx") {
        unlockDialogueOption("love", "love-mention")
      }
    }

    if (optionId === "woman" && characterId === "gypsy") {
      unlockDialogueOption("angel", "angel-mention")
    }

    if (optionId === "city") {
      if (characterId === "butler" || characterId === "sphinx") {
        unlockDialogueOption("italy", "italy-mention")
      }
    }

    if (optionId === "italy") {
      if (characterId === "butler" || characterId === "gypsy") {
        unlockDialogueOption("florence", "florence-mention")
      }
    }

    if (optionId === "journey" && characterId === "sphinx") {
      unlockDialogueOption("afterlife", "afterlife-mention")
    }

    if (optionId === "guard-trust") {
      // After asking about trusting the guard, unlock the option to confront him
      unlockDialogueOption("lying-guard", "guard-confrontation")
    }

    // Unlock based on keywords in dialogue - more selective
    if (dialogText.toLowerCase().includes("muse") && !dialogueOptions.find((o) => o.id === "muse")?.unlocked) {
      unlockDialogueOption("muse", "muse-mention")
    }
  }

  // Unlock a dialogue option
  const unlockDialogueOption = (optionId: string, condition: string) => {
    setDialogueOptions((prev) =>
      prev.map((option) =>
        option.id === optionId || option.unlockCondition === condition ? { ...option, unlocked: true } : option,
      ),
    )
  }

  // Close dialogue
  const handleCloseDialog = () => {
    setShowDialog(false)
    setActiveCharacter(null)
    setDialogGesture("")
    setDialogText("")
  }

  // Check if an option should be highlighted (not yet asked by this character)
  const shouldHighlight = (optionId: string) => {
    if (!activeCharacter) return true
    return !characterDialogueStates[activeCharacter]?.askedOptions[optionId]
  }

  // Make component accessible from outside
  useEffect(() => {
    if (id) {
      // @ts-ignore - This is a hack to make the component accessible from outside
      document.getElementById(id).__reactProps$ = {
        handleDevilClick: handleDevilClickInternal,
      }
    }
  }, [id])

  return (
    <div className="w-full max-w-md mx-auto" id={id}>
      {/* Characters grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {characters.map((character) => (
          <div
            key={character.id}
            className="flex flex-col items-center cursor-pointer transition-transform hover:scale-105 active:scale-95"
            onClick={() => handleCharacterClick(character.id)}
          >
            <div className="w-24 h-24 relative pixelated-container mb-2">
              <div className="absolute inset-0 bg-black/30 rounded-lg z-0"></div>
              <Image
                src={character.image || "/placeholder.svg"}
                alt={character.name}
                width={96}
                height={96}
                className="pixelated z-10 relative"
              />
              <SpeechIndicator />
            <div className="absolute -inset-1 border-2 border-gray-800 rounded-lg z-20 pointer-events-none"></div>
            </div>
            <p className="text-center font-pixel text-xs text-purple-300">{character.name}</p>
          </div>
        ))}
      </div>

      {/* Dialogue popup - styled like a point-and-click adventure game */}
      {showDialog && activeCharacter && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={handleCloseDialog}
        >
          <div
            ref={dialogRef}
            className="bg-gray-900/90 p-0 rounded-lg border-2 border-gray-700 max-w-sm w-full animate-fadeIn overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Character portrait and name header */}
            <div className="bg-gray-800 p-3 border-b border-gray-700 flex items-center gap-3">
              <div className="w-12 h-12 relative pixelated-container shrink-0">
                <Image
                  src={
                    activeCharacter === "devil"
                      ? "/images/devil.webp"
                      : characters.find((c) => c.id === activeCharacter)?.image || ""
                  }
                  alt={
                    activeCharacter === "devil"
                      ? "The Devil"
                      : characters.find((c) => c.id === activeCharacter)?.name || ""
                  }
                  width={48}
                  height={48}
                  className="pixelated"
                />
              </div>
              <p className="text-purple-300 font-pixel">
                {activeCharacter === "devil" ? "The Devil" : characters.find((c) => c.id === activeCharacter)?.name}
              </p>
            </div>

            {/* Dialogue text */}
            <div className="p-4 min-h-[100px] bg-gray-900 border-b border-gray-700">
              {dialogGesture || dialogText ? (
                <div className="space-y-2">
                  {dialogGesture && <p className="text-gray-400 text-sm font-pixel italic">*{dialogGesture}*</p>}
                  {dialogText && <p className="text-purple-300 text-sm font-pixel">{dialogText}</p>}
                </div>
              ) : (
                <p className="text-gray-400 text-sm font-pixel">What would you like to ask?</p>
              )}
            </div>

            {/* Dialogue options */}
            <div className="max-h-60 overflow-y-auto bg-gray-800 p-2">
              <div className="grid grid-cols-1 gap-1">
                {dialogueOptions
                  .filter((option) => option.unlocked && isOptionAvailableForCharacter(option, activeCharacter))
                  .map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleDialogueOptionClick(option.id)}
                      className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                        shouldHighlight(option.id)
                          ? "bg-gray-700 hover:bg-gray-600 text-purple-300 font-pixel font-bold"
                          : "bg-gray-800 hover:bg-gray-700 text-white font-pixel"
                      }`}
                    >
                      {option.text}
                    </button>
                  ))}
              </div>
            </div>

            {/* Close button */}
            <div className="p-3 bg-gray-900 flex justify-center">
              <button
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-xs text-gray-300 font-pixel"
                onClick={handleCloseDialog}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="text-center text-xs text-gray-400 font-pixel mt-2 animate-pulse">
        Click on a character to speak with them
      </div>
    </div>
  )
}
