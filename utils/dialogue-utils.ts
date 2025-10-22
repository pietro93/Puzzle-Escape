// Define guard dialog lines for level 10 only
export const guardDialogLines = [
  "An inmate has been murdered, and one of these four inmates did it. Who is the killer?",
  "Oh, you think *you're* going to figure this out? Cute.",
  "Don't bother looking at me. I wouldn't know the first thing about what happened... even if I did see it, which I didn't.",
  "Go on, ask them your questions. I'm sure these honest law-abiding folks will be nothing but thrilled to help you.",
  "Don't worry, I'm on your side. Hehehe!",
  "Hurry up. I haven't got all eternity, unlike you.",
  "The victim? Let's just say they won't be needing their kneecaps anymore. Or anything else, for that matter. Hahaha!",
  "I would give you a hand, but I already ate it. Hehehe!"
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
      "Mirrors show hard truths. Like the fact that you're ugly.",
      "Stare longer. Maybe your face will make sense.",
      "Tsk. You are staring at failure. It wears your face well.",
      "You came all this way to admire yourself? Mphf.",
      "First puzzle and already stuck? My ribs are rattling with amusement.",
      "Staring at your reflection shows a deep lack of self-respect."
    ],

    2: [
      "Counting bones. I do that nightly. It is a terrible habit.",
      "Your fingers tremble and make counting harder. Are you *begging* me to break them?",
      "I kept a ledger of who owned these. They all ended up here just like you.",
      "The last prisoner who took this puzzle ended up becoming part of the exhibit.",
      "These are spares. I keep mine in the freezer.",
      "My ribs are better organized than your thoughts.",
      "I collected these from the previous occupants. They would want you to have them."
    ],

    3: [
      "Math: the universal language of suffering. And you’re failing the alphabet.",
      "I solved this with half my brain missing. Don't tell me that you're stuck.",
      "Add your regrets. Subtract your chances. Divide your hope.",
      "Hah-hah-hah. The solution is *suffering*.",
      "Numbers are honest creatures. Unlike you, they refuse to lie about your odds."
    ],

    4: [
      "Hah-hah-hah. Dreams? Here, we call those delusions.",
      "The alphabet actively conspires against you. Believe me.",
      "Tsk. You sleep? Sleep is a luxury for the hopeful.",
      "Your nightmares are my favorite bedtime stories.",
      "I stopped having dreams centuries ago. But I think I may start having nightmares after seeing your face.",
      "Mphf. Your unconscious mind is currently negotiating your surrender."
    ],

    5: [
      "Tick. Tock. Your coffin’s getting cold.",
      "Hey. Stop wasting everyone’s eternity with your slowness.",
      "The clock keeps score. It says you suck at this.",
      "The hands of that clock are counting down to something you will not survive.",
      "Some days I can’t remember if I’m dead or just really, really bored. Your guess is as good as mine.",
      "Bricks and stones may break my bones, but I can also break yours."
    ],

    6: [
      "Unscramble your life next. Wait, too late.",
      "Jumbled letters for that jumbled brain of yours.",
      "C'mon, I am bored. Give up already.",
      "Ah, you're getting tired. Good. Exhaustion is the first step toward acceptance.",
      "Mphf. Jumbled letters. How very clever.",
      "Unscramble all you want. You're still trapped."
    ],

    7: [
      "Hehe. I watched a man change life to death in only two steps.",
      "Your logic has more gaps than my ribcage.",
      "Change hope to nope in one move. Congrats, you’re doomed.",
      "Word games are for children. Thought you might enjoy this one.",
      "HATE becomes FATE becomes... whatever",
      "Mphf. Word games are for children and fools. Thought you might like this."
    ],

    8: [
      "This puzzle is unsolvable. Just like your problems.",
      "Mphf. Even I don't know the answer. Isn't that wonderful?",
      "This puzzle has broken minds harder than yours. They tasted much better, too.",
      "I think randomly smashing the pieces might actually work. Try it.",
      "The real magic is how quickly you abandon logic for guesswork.",
      "Tsk. I think if you arrange them at random eventually you'll get it right."
    ],

    9: [
      "Primitive. Like a Neanderthal rattling his own tibia.",
      "Silence is the only effective communication used here. You can try screaming, too.",
      "The rhythm of your distress is deeply annoying to my ears.",
      "I wonder what sound *your* bones will make when I finally get to play with them.",
      "Oh, you want my help? That's adorable. Tsk.",
      "Dots and dashes. How primitive."
    ]

  }
,
butler: {
  11: [ // Exotic Spices Puzzle
    "The Master did enjoy a hint of the exotic in every meal. One must have standards.",
    "Lessons in flavour, like this puzzle, require patience and discernment.",
    "The pungent aroma of these spices was once worth more than gold. Quite the investment.",
    "The Master's palate was exceptionally refined. A rare quality these days.",
    "A guest once mistook cumin for cinnamon. They were not invited back."
  ],
  12: [ // Clock / Time Puzzle
    "Each timepiece here ticks with unwavering precision, as the Master demanded.",
    "Generations of this family have entrusted their hours to this particular clock.",
    "The Master entertained curious theories about time’s passage, none conventional.",
    "Roman numerals possess a dignity one does not often find today.",
    "Time reveals all, especially those who underestimate it, I assure you.",
    "One might say this puzzle requires a certain punctuality in thought."
  ],
  13: [ // Color / Pigment Puzzle
    "I do hope your eyes serve you better than your instincts thus far.",
    "You would do well not to overlook the nuances of hue and tone.",
    "Tyrian purple, a color once reserved for emperors, was famously extracted from sea snails. Thousands for a single gram.",
    "I do hope you possess a basic grasp of color theory. It would be most unfortunate otherwise.",
    "The Master believed colour could alter one's mood. This room is a testament to that."
  ],
  14: [ // Assembly Puzzle / Box
    "We find much depends on the patience invested versus mere trial and error.",
    "I have polished these pieces weekly for thirty years. I trust you will handle them with care.",
    "Assembly is a matter of order, a concept apparently elusive to some.",
    "Some things are more valuable when taken apart. It reveals their inner workings.",
    "Kintsugi is the Japanese art of repairing broken pottery with gold. It treats breakage as part of an object's history."
  ],
  15: [ // Portrait Puzzle (Patricia)
    "Ah, Lady Patricia. Her demise left a shadow the Master never quite shook off.",
    "The Master would stare at this portrait for hours. Most unsettling at times.",
    "The artist, a rather renowned Italian, insisted on using a 'chiaroscuro' technique. Dramatic lighting.",
    "A striking likeness. The artist captured her spirit perfectly. Perhaps too perfectly.",
    "Her eyes are said to follow you. A common trick of perspective, I am told."
  ],
  16: [ // Library / Book Puzzle
    "I dust these shelves daily. The Master was most particular about the preservation of knowledge.",
    "Please refrain from bending the spines. It is an act of barbarism. You are a guest here, after all.",
    "The Master's library contains over ten thousand volumes. Have you read any books at all?",
    "The stories preserved here far outlast the fleeting lives they recount.",
    "Fascinating. Your taste in literature appears... unrefined."
  ],
  17: [ // Darkness Puzzle
    "Darkness conceals many secrets, and not all are comforting.",
    "One might say this place is less empty and more full of things unseen.",
    "Nyctophilia is a fondness for darkness. I myself am a devoted practitioner.",
    "Your fumbling is quite audible.",
    "The Master could navigate this room blindfolded. Often did, in fact."
  ],
  18: [ // Silverware / Math Puzzle
    "The family silverware is solid sterling. Polished daily, of course.",
    "Do be careful. The tarnish of a single fingerprint takes ages to buff out.",
    "The Master was fastidious about place settings, as etiquette demanded. Thankfully for you, they are not around.",
    "Table manners may escape you, but they are quite important to me.",
    "One cannot underestimate the silent conversation of a well-laid table."
  ],
  19: [ // Parrot Puzzle
    "Count Papagalul has endured through generations with unusual vitality.",
    "The Count possesses a rather colorful vocabulary. The Master found it endlessly amusing. Myself, not so much.",
    "Kind guest, please exercise extreme caution in his presence. His bite lacks discretion.",
    "He tends to repeat things he overhears. I would be mindful of what you say.",
    "He seems to have taken a dislike to you. How curious."
  ],
  20: [ // Family Tree Puzzle
    "The family records are a meticulously woven tapestry of facts and fabrications.",
    "The Master devoted countless hours untangling the family’s intricate roots.",
    "One must admire the care taken to conceal certain family affairs.",
    "Some branches of the family tree were deliberately pruned. For the health of the whole.",
    "Genealogy is a fascinating pursuit. It reveals how the past is never truly past.",
    "Be careful where you pry. Some ancestors are best left undisturbed."
  ]
},
  gypsy: {
    21: [
      "Tell me your truth. The spirits listen, yes?",
      "Your essence speaks volumes. Louder than any shout.",
      "Secrets are sharp stones. Be careful where you step, *dragul meu*.",
      "My **duende** sees your **drabardi**. It is... a winding road.",
      "Everyone hides something. Even the pebbles on the path. Heh.",
      "Face your answers. Do not fear what you find inside.",
      "You think you know yourself? We will see. *Aha!*",
      "Your path unfolds now. Like a stubborn riddle."
    ],
    22: [
      "*Ghicitul în cafea*. Tasseomancy, you call it. It makes me run.",
      "This coffee... it rumbles my belly. Like thunder. *Pfiu*. So much gas.",
      "The grounds whisper secrets. Like old winds through bones.",
      "Your future swirls in there. Like mud after a big rain.",
      "Patterns hold truth. Like runes in the dirt. Very old truth.",
      "Bad luck if you spill. Or worse. Heh. Very worse.",
      "Some see stains. Wise ones see stories. Which are you?",
      "A storm is coming. Or maybe just... indigestion. *Da?*"
    ],
    23: [
      "Stars sing songs. Different lands, different tunes, yes?",
      "Your year has a voice. A very... spirited animal voice.",
      "My favorite animal? Hmm. I once had a pig. Jambon, I called him. Such a good boy. Everyone said he tasted delicious. Ha! Just kidding. Mostly.",
      "Cycles turn. Like a peasant's wheel. Or a wolf's mood. Always turning.",
      "Some signs bring luck. Some bring *grijă* (care). Be watchful.",
      "The sky knows more than your noisy metal maps. Always.",
      "This year remembers change. A big change. For you. *Heh*.",
      "Beware the animal's temper. It bites. Like a stray dog."
    ],
    24: [
      "Crystals hold power. Old power. Like **duende**. This one? Clear quartz. Amplifies everything. Even my collection.",
      "Each piece wants home. Like a lost soul. Like you? Perhaps.",
      "Stones whisper secrets. Louder than your little phone. This amethyst? For calm. Helps me sleep. When I'm not jittery.",
      "Some crystals heal. Some reveal. Some just... help you feel good. This rose quartz? Very nice for... comfort. For a lonely night. *Heh*.",
      "You look broken too. Maybe these pieces help put you back? Like my obsidian. Cleanses bad energy.",
      "Fit them together. See what truth the stones show. Like my agate. Swirls hide worlds.",
      "This stone remembers. It remembers everything. Even betrayals. Like my jade. Protects against bad vibes.",
      "Sharp edges bring pain. Like harsh truths. Or using this smooth tourmaline for... other purposes. Very effective."
    ],
    25: [
      "Shapes speak. Numbers sing. The universe's song, *da*. But I don't trust numbers.",
      "Ancient secrets hid in symbols. Like my grandmother's soup. But math? Bah!",
      "Simple? Ha! Nothing is simple. Not even *sarmale*. Very complex. Logic is for the birds.",
      "Find balance. Or face chaos. My magic tells me balance is best. Not your rigid lines.",
      "Geometry is language. Older than your noisy metal. But numbers? Cold. Dead.",
      "Your ancestors knew these shapes. Before all the noise. They felt the magic.",
      "Numbers build wonders. Or trap you forever. Like a cage. Magic sets you free.",
      "Find the pattern. Or get lost. My gut tells me the way. Not your silly rules."
    ],
    26: [
      "Look up. The sky tells stories. Not your glowing screen. Much better from here.",
      "Stars are old memories. They watch everything. Always. So much watching.",
      "Your ancestors navigated by these. Did they find their way? Or just get lost?",
      "This pattern has a name. A secret name. Like a hidden treasure.",
      "Aha! You see the wolf in the sheep's clothing now? Clever boy.",
      "The sky watches your steps. It remembers all. Even your mistakes.",
      "Destiny's dice are thrown in the stars. Tossed high. Men want to travel there? Fools.",
      "Find the shape. Or wander lost. In the dark. Much easier to read from here, yes?"
    ],
    27: [
      "Zodiac tells of year, soul. And your restless heart. Always restless.",
      "Cycles turn. Human hearts? Always chasing shadows. *Heh*. Unlike the moon.",
      "Twelve signs? Some say more. How many signs are out there? Few know the true answer.",
      "Is your heart in sync? Or lost like a sheep? Be honest now.",
      "This season hides a sign. A hidden one. Like a secret wish.",
      "The heavens know order. Humans? Ha! A different story. Always different.",
      "Your path twists. Like a Romani dance. Or a river. *Da*.",
      "Secrets hide in plain sight. Like a wolf in the flock. Always watching."
    ],
    28: [
      "Crystals hum songs. Like my stomach. Ha! Avoid the coffee. It brings only pain.",
      "Right order unlocks power. Or a secret trap. Be careful. This tourmaline wards off bad dreams.",
      "These stones remember hands. Many hands. Many stories. Like my collection. So many stones.",
      "Some sing together. Like a wedding. Some scream. Like bad singers. This one? It's for... focus. Very potent.",
      "Harmony is fragile. Like your hope. Or my crystal ball when I drop it. Oops. Use this jade for protection.",
      "Place them true. They don't like to be pushed around. This amethyst helps me sleep. When I'm not too jittery.",
      "This stone is mischievous. Like a child with shiny things. Watch it. It likes to roll away. Fun!",
      "Balance your path. Like these crystals. Or like using this smooth agate... for inner peace. And other things. *Heh*."
    ],
    29: [
      "Shhh. Words are loud. Like your noisy metal boxes. Always buzzing.",
      "My hands speak. An old language. Romani way. Yes.",
      "Silence holds secrets. Listen with your eyes. You can learn.",
      "My hands tell truth. Or maybe smoke. What do you see?",
      "You understand? Good. Maybe it is a trick. Heh.",
      "Truth hides. Like a fox in fog. Hard to catch.",
      "This dance tells a story. Your story. I think.",
      "Steer your path. The river bends. Always bends."
    ],
    30: [
      "Cards show your soul's journey. Your **drabardi**. Yes. It is written.",
      "Empires fall. Like cards. Like noisy toys. So flimsy. *Poate*.",
      "Joy upright. Despair reversed. Like shortcuts and blisters. *Oof*. A painful lesson.",
      "Choices have echoes. Especially yours. Listen for them. They follow you.",
      "You think you are done? *Poate*. Maybe. For now. The journey is long.",
      "End of road. Start of new. Always. Like the sun rising. Or setting in fire.",
      "Did you learn? Or just pass through? Cards know. They see the desert in your soul.",
      "This last card. It is about your future. Be ready. You walk towards a burning place. *Heh*."
    ]
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
      "Their mind now serves a greater purpose in my collection.",
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

// Store the last shown dialogue index for each character and level
const lastShownDialogue: Record<string, Record<number, number>> = {};

// Store the shuffled dialogue options and current index for each character and level
const shuffledDialogue: Record<string, Record<number, { options: string[]; index: number }>> = {};

// Function to shuffle an array (Fisher-Yates shuffle)
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Define character-specific dialogue
export const useCharacterDialogue = () => {
  return (character: string, level: number): string => {
    const options = levelDialogue[character]?.[level] || ["..."];

    if (!shuffledDialogue[character]) {
      shuffledDialogue[character] = {};
    }

    if (!shuffledDialogue[character][level]) {
      // Initialize shuffled options and index if not already present
      shuffledDialogue[character][level] = {
        options: shuffleArray(options),
        index: 0,
      };
    }

    const { options: shuffledOptions, index: currentIndex } = shuffledDialogue[character][level];
    const dialogue = shuffledOptions[currentIndex];

    // Increment index or reset to 0 if at the end
    shuffledDialogue[character][level].index = (currentIndex + 1) % shuffledOptions.length;

    return dialogue;
  };
};

// Define character-to-image mapping
export const characterImageMap: Record<string, string> = {
  skeleton: "/images/skeleton.webp",
  butler: "/images/butler.webp",
  gypsy: "/images/gypsy.webp",
  sphinx: "/images/sphinx.webp",
  devil: "/images/devil.webp",
  brain: "/images/brainlamp.webp", // Default brain image
};

// Utility to parse dialogue for italicized words
export const parseDialogueForItalics = (text: string): string => {
  // Replace *word* with <em>word</em>, but only for single asterisks
  return text.replace(/\*([^*]+?)\*/g, '<em>$1</em>');
};