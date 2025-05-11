// Define guard dialog lines for level 10 only
export const guardDialogLines = [
  "An inmate has been murdered, and one of these four inmates did it. Who is the killer?",
  "I've been guarding this prison for centuries. Nobody escapes on my watch.",
  "These inmates are all liars. Only one of them tells the truth.",
  "The murderer is in this room. Find them, or you'll never leave.",
  "Time is running out. Make your choice.",
  "I grow tired of your hesitation. Choose wisely.",
  "The answer is right in front of you. Can't you see it?",
  "The truth is often hidden in plain sight.",
]

// Add a specific sphinx riddle for level 38
export const sphinxRiddle = "What has a bed, a mouth, banks, and a crystal clear body?"

// Define random elevator messages
export const getRandomElevatorMessage = (): string => {
  const messages = [
    "The elevator descends with a sickening lurch...",
    "You feel the temperature rising as you descend deeper...",
    "Screams echo from somewhere far below...",
    "The walls of the elevator seem to pulse like a living thing...",
    "Blood begins to seep from the corners of the elevator...",
    "Whispers surround you as the elevator continues its descent...",
    "The lights flicker, plunging you into momentary darkness...",
    "The elevator shudders violently as it passes through another threshold...",
    "A distant wailing grows louder as you descend...",
    "The air becomes thick with the smell of sulfur and decay...",
    "Shadows move across the walls of the elevator, though you stand perfectly still...",
    "The floor beneath your feet becomes uncomfortably warm...",
    "You feel countless eyes watching you through the walls...",
    "The elevator creaks and groans like a dying animal...",
    "Your ears pop painfully as you descend to impossible depths...",
  ]
  return messages[Math.floor(Math.random() * messages.length)]
}

// Define level-specific dialogue for each character
const levelDialogue: Record<string, Record<number, string[]>> = {
  skeleton: {
    1: [
      "Mphf. Mirrors don't lie, unlike you.",
      "Tsk. Staring at your reflection won't save you.",
      "First puzzle and already stuck? Pathetic.",
      "Your reflection looks desperate. How fitting.",
    ],
    2: [
      "Counting bones? How morbid of you.",
      "Colors mean nothing to the dead. Mphf.",
      "These aren't mine. I keep better care of my bones.",
      "Tsk. The previous prisoner took weeks to solve this one.",
    ],
    3: [
      "Mathematics. The universal language of suffering.",
      "Numbers won't add up to your freedom.",
      "Mphf. Even I can solve this one, and I'm missing half my brain.",
      "Symbols and equations. How tedious.",
    ],
    4: [
      "Dreams become nightmares here. Always.",
      "Mphf. Letters and numbers. How original.",
      "Your dreams of escape are amusing to me.",
    ],
    5: [
      "Tik, tok. Tik, tok...",
      "Round and round we go. Where we stop? Nowhere.",
      "Stop wasting everyone's time.",
    ],
    6: [
      "Mphf. Jumbled letters. How very clever.",
      "Unscramble all you want. You're still trapped.",
      "My bones spell your doom, prisoner.",
    ],
    7: [
      "Words changing into other words. Fascinating. Not.",
      "Mphf. Word games are for children and fools. Thought you might like this.",
      "Change one letter at a time. Like hope dying slowly.",
    ],
    8: [
      "Magic boxes. The Master's favorite torture device.",
      "Numbers in boxes. How extraordinarily dull.",
      "Tsk. Arrange them however you want. You're still doomed.",
      "This puzzle has broken stronger minds than yours.",
    ],
    9: [
      "Dots and dashes. How primitive.",
      "Mphf. Secret codes won't help you here.",
      "Tap tap tap. Like the sound of hope fading away.",
      "Decipher all you want. The message isn't pleasant.",
    ],
    10: [
      "Murderers among murderers. How delightful.",
      "Tsk. Trust no one. Not even yourself.",
      "One tells the truth, the rest lie. Including me, perhaps?",
      "The killer is obvious. If you had my empty eye sockets.",
    ],
  },
  butler: {
    11: [
      "The Master was quite fond of exotic spices, sir.",
      "I believe this particular puzzle was inspired by the Master's travels to the Orient.",
      "The Master's palate was exceptionally refined, unlike most guests.",
      "Perhaps sir would prefer a simpler challenge? No? Very well.",
    ],
    12: [
      "The Master's timepieces are all precisely maintained, I assure you.",
      "This clock has been in the family for generations. Quite valuable.",
      "Time is of particular interest to the Master. He has... unusual theories about it.",
      "Roman numerals. So much more elegant than Arabic, don't you agree, sir?",
    ],
    13: [
      "The Master was quite the artist in his spare time.",
      "These pigments are mixed from the rarest ingredients, sir.",
      "Color theory was a particular passion of the Master's.",
      "I do hope sir is not colorblind. That would be most unfortunate.",
    ],
    14: [
      "The Master enjoyed puzzles of all sorts, particularly those requiring assembly.",
      "This box contains one of the Master's favorite culinary curiosities.",
      "I've polished these pieces weekly for decades, sir.",
      "The Master often said that broken things reveal their true nature.",
    ],
    15: [
      "Ah, Patricia. The Master never quite recovered from her loss.",
      "The Master commissioned this portrait from a renowned Italian artist.",
      "Love and death, sir. The two constants in the Master's life.",
      "The Master would stare at this portrait for hours. Most disturbing.",
    ],
    16: [
      "The Master's library contains over ten thousand volumes, sir.",
      "These particular books were the Master's bedtime reading.",
      "The Master believed books contained more than just words.",
      "I dust these shelves daily, sir. The Master was most particular about his books.",
    ],
    17: [
      "The Master preferred the darkness, sir. Said it sharpened his other senses.",
      "This room has not been illuminated in decades, sir.",
      "The Master could navigate this room blindfolded. Often did, in fact.",
      "Darkness conceals many things, sir. Not all of them pleasant.",
    ],
    18: [
      "The Master's silverware is solid silver. Polished daily, of course.",
      "The Master enjoyed mathematical diversions during dinner parties.",
      "Each piece of silverware has its proper place and value, sir.",
      "The Master was most particular about his table settings.",
    ],
    19: [
      "Count Papagalul has been with the family for generations, sir.",
      "The Count has a rather colorful vocabulary. The Master found it amusing.",
      "I would advise against sudden movements near the Count, sir. He bites.",
      "The Count has outlived three generations of the Master's family.",
    ],
    20: [
      "The family records are meticulously maintained, sir.",
      "The Master was obsessed with his lineage. Spent hours studying it.",
      "The House of Morvane has a most... interesting history, sir.",
      "Some branches of the family tree were deliberately pruned, if you take my meaning, sir.",
    ],
  },
  gypsy: {
    21: [
      "Your answers reveal more than you know, traveler.",
      "The spirits listen when you speak your truth.",
      "I've read the fortunes of kings who revealed less than you.",
      "Your essence speaks volumes, even when your words do not.",
    ],
    22: [
      "The grounds never lie, though they speak in riddles.",
      "I've read fortunes in coffee since I was a child. The patterns never deceive.",
      "Your future swirls in these cups, whether you believe it or not.",
      "Some see mere stains. The wise see stories yet to unfold.",
    ],
    23: [
      "The zodiac cycles have guided humanity since time immemorial.",
      "Eastern wisdom flows through these symbols like water.",
      "The stars speak different languages across the world.",
      "Your birth sign in one culture may be your death sign in another.",
    ],
    24: [
      "These crystal fragments hold ancient power.",
      "Each piece yearns to be reunited with its brothers.",
      "The stones speak, if you listen with more than your ears.",
      "Some crystals heal. Others reveal. The wisest do both.",
    ],
    25: [
      "Geometry is the language of the universe, traveler.",
      "These symbols were ancient when your ancestors still lived in caves.",
      "The mystics encoded their wisdom in shapes and numbers.",
      "What appears simple often hides profound complexity.",
    ],
    26: [
      "The night sky is an open book to those who can read it.",
      "Stars are the memories of the universe, traveler.",
      "Your ancestors navigated by these same patterns.",
      "The constellations watch us with ancient eyes.",
    ],
    27: [
      "The zodiac tells the story of the year and the soul.",
      "Each sign has its season, its element, its truth.",
      "The heavens move in perfect cycles, unlike human hearts.",
      "Some believe there are signs beyond the twelve we know.",
    ],
    28: [
      "Each crystal vibrates with its own frequency.",
      "The proper sequence unlocks energies beyond your understanding.",
      "These stones have passed through many hands before yours.",
      "Some crystals complement each other. Others clash violently.",
    ],
    29: [
      "Sometimes words fail. Then, we speak with our hands.",
      "Silence often conveys what sound cannot.",
      "Watch closely. My hands speak an ancient language.",
      "Not all communication requires voice, traveler.",
    ],
    30: [
      "The Major Arcana reveals the journey of the soul.",
      "These cards have foretold the fall of empires.",
      "The Fool's journey begins anew with each reading.",
      "Some cards bring joy when upright, despair when reversed.",
    ],
  },
  sphinx: {
    31: [
      "These symbols were carved when your kind still dwelled in caves.",
      "Hieroglyphs hold the wisdom of a civilization that built wonders.",
      "The ancient ones spoke through pictures, not mere letters.",
      "Each symbol contains a world of meaning, seeker.",
    ],
    32: [
      "The sacred scarab pushes the sun across the sky each day.",
      "Gold was as common as dust to some ancient rulers.",
      "Pilgrimages reveal more about the traveler than the destination.",
      "The beetle's path mirrors the journey of the soul after death.",
    ],
    33: [
      "Darkness conceals and reveals in equal measure.",
      "Light is temporary. Darkness is eternal.",
      "Ancient chambers hold secrets best left undisturbed.",
      "What is written in darkness can only be read in light.",
    ],
    34: [
      "The crocodile god watches from the depths of the Nile.",
      "Some deities demand blood. Others protect from bloodshed.",
      "Fragments, when properly arranged, reveal the whole truth.",
      "The gods of old have not died. They merely sleep.",
    ],
    35: [
      "The desert deceives the eye and parches the tongue.",
      "What you see may not exist. What exists, you may not see.",
      "Heat bends light as easily as time bends truth.",
      "The sands shift, revealing patterns only to bury them again.",
    ],
    36: [
      "Great monuments rise stone by stone, seeker.",
      "Pharaohs built toward the sky to reach the afterlife.",
      "Each block must find its proper place in the greater whole.",
      "The pyramids align with stars that guided the ancient ones.",
    ],
    37: [
      "Pillars support more than mere ceilings, seeker.",
      "Gods and pharaohs share the burden of holding up the sky.",
      "Names hold power in the ancient tongue.",
      "Order matters in ritual as in architecture.",
    ],
    38: [
      "Messages hidden in sand wash away with the next wind.",
      "Codes and ciphers protected the secrets of temples.",
      "Water flows like knowledge—seeking the lowest point.",
      "Ask the right question, receive the true answer.",
    ],
    39: [
      "Mathematics was sacred to the ancient ones.",
      "Numbers hold mystical properties beyond mere counting.",
      "The eye sees fractions of the whole truth.",
      "Equations balance like Ma'at's scales of justice.",
    ],
    40: [
      "Pyramids contain chambers unknown even to their builders.",
      "Light penetrates the deepest darkness once yearly.",
      "Ra's journey through the underworld mirrors your own.",
      "Some chambers were sealed to contain dangers, not treasures.",
    ],
  },
  devil: {
    41: [
      "Geography is different in hell. Places bleed into one another.",
      "Some locations on Earth mirror my domain perfectly.",
      "Humans named this place well. Their fear amuses me.",
      "Fire above ground is nothing compared to what burns below.",
    ],
    42: [
      "Chess was invented in my domain, did you know?",
      "Kings and pawns end up in the same place eventually.",
      "Strategy is pointless when the game is rigged from the start.",
      "I've played this game for millennia. Never lost.",
    ],
    43: [
      "Numbers have meaning beyond your mortal understanding.",
      "These souls counted their sins differently than I did.",
      "Patterns exist even in chaos. Especially in chaos.",
      "Count carefully. Your soul may depend on it.",
    ],
    44: [
      "This vessel carries souls across the burning sea.",
      "Many artists have glimpsed my domain in their nightmares.",
      "Bosch came closest to capturing the true essence of hell.",
      "Fragments of horror, when assembled, become unbearable.",
    ],
    45: [
      "Your companions from previous realms have all found their way to me.",
      "Trust is a luxury you cannot afford in my domain.",
      "Everyone lies in hell. Even me. Especially me.",
      "Literature is full of lost souls. Some more lost than others.",
    ],
    46: [
      "Gambling with me always ends the same way.",
      "The house always wins. And I own the house.",
      "Luck is an illusion I allow humans to believe in.",
      "Roll the dice. Spin the wheel. The outcome was decided eons ago.",
    ],
    47: [
      "This poor soul was a brilliant scientist in life.",
      "His mind now serves a greater purpose in my collection.",
      "Pain focuses the intellect wonderfully, don't you think?",
      "Binary is the language of modern souls. On or off. Pain or agony.",
    ],
    48: [
      "The Mouth of Truth bites liars and devours souls.",
      "Ancient Romans barely glimpsed the true power of this artifact.",
      "Place your hand inside if you're feeling particularly brave.",
      "Truth in hell is more painful than any lie on Earth.",
    ],
    49: [
      "Murder is such a human concept. I prefer 'soul acquisition.'",
      "This little game is based on a true story. Several, actually.",
      "Detectives in hell solve cases for eternity, never finding peace.",
      "The victim deserved worse than death. The killer deserved better.",
    ],
    50: [
      "We've reached the end of our little game.",
      "Fifty levels of torment, and still you persist.",
      "Freedom is an illusion I allow you to believe in.",
      "Perhaps I'll let you go. Perhaps I already have.",
    ],
  },
  brain: {
    47: [
      "Please... make it stop...",
      "The pain... unbearable...",
      "Help... me...",
      "Can't... think... clearly...",
      "Too many... connections...",
      "Memories... fading...",
      "Who... am I?",
      "Was once... human...",
      "They... took my body...",
      "Just want... to die...",
    ],
  },
}

// Define character-specific dialogue
export const useCharacterDialogue = () => {
  // Return a function that gets dialogue for a character based on level
  return (character: string, level: number): string => {
    // Get the dialogue options for the character and level
    const options = levelDialogue[character]?.[level] || [
      "...", // Fallback if no dialogue is found
    ]

    // Return a random dialogue option
    return options[Math.floor(Math.random() * options.length)]
  }
}
