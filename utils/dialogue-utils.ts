"use client"

import { useCallback } from "react"

// Get random dialogue for a character based on level
export const useCharacterDialogue = () => {
  return useCallback((character: string, level: number) => {
    // Level-specific dialogues for each character
    const levelSpecificDialogues: Record<string, Record<number, string[]>> = {
      skeleton: {
        1: [
          "First level, eh? Don't get cocky. They only get harder from here.",
          "This one's for babies. Let's see how you handle the real challenges.",
          "I've seen infants solve this puzzle. Impress me with speed at least.",
        ],
        2: [
          "Colors and bones. Simple enough for your primitive brain, I hope.",
          "Count carefully, prisoner. Numbers are the language of death.",
          "These bones belonged to the last prisoner who failed this test.",
        ],
        3: [
          "Mathematics. The universal language of suffering.",
          "Numbers don't lie. Unlike me.",
          "Solve for X, where X equals your remaining lifespan. Heh.",
        ],
        4: [
          "Fear your dreams? I fear nothing. Except perhaps competent prisoners.",
          "Letters and numbers. A child's game. Are you entertained yet?",
          "This puzzle was designed by a particularly sadistic guard. I like his style.",
        ],
        5: [
          "My boneboxes are quite the collectors' items. Made them myself.",
          "Count carefully. Or don't. Makes no difference to me.",
          "These cubes contain the essence of failed escapees. Feel their despair.",
        ],
        6: [
          "Round and round the clock goes, where it stops... well, you know.",
          "Time is meaningless here. You'll learn that soon enough.",
          "Clockwise, counterclockwise... all paths lead to the same end.",
        ],
        7: [
          "Words changing into other words. Like prisoners changing into corpses.",
          "One letter at a time, just like how I remove one bone at a time.",
          "This puzzle was designed by a poet. Before I removed his fingers.",
        ],
        8: [
          "Unscramble the letters? Why bother? You're still locked away.",
          "These letters spell your doom, no matter how you arrange them.",
          "Shackles. Fitting. That's what you'll wear for eternity.",
        ],
        9: [
          "Dots and dashes. Like the beating of a dying heart.",
          "This code was invented by a prisoner. He's part of my ribcage now.",
          "Decipher all you want. The message won't save you.",
        ],
        // Level 10 is excluded as it's part of the puzzle
      },
      butler: {
        11: [
          "The master was quite fond of wordplay, sir. A clever man, if somewhat... eccentric.",
          "I've maintained this mansion for generations. The spice rack, however, is not my domain.",
          "The kitchen staff used to prepare the most exquisite meals. Alas, they've been... let go.",
        ],
        12: [
          "The master's timepieces are all precisely synchronized, sir. He was most particular about punctuality.",
          "That clock has been in the family for seventeen generations. It has never lost a second.",
          "Time moves differently in this mansion, sir. You may find that hours pass like minutes... or years.",
        ],
        13: [
          "This palette was gifted to the master by a renowned French painter. The numerical values of the colors are said to hide a secret message.",
          "The master spent many hours studying this palette. He believed the mathematical relationships between the colors revealed a hidden location.",
          "The French painter who created this palette was known for hiding cryptic messages in his works. This one supposedly reveals the name of a mysterious place.",
        ],
        14: [
          "The master's puzzle boxes are quite ingenious, sir. He designed them himself.",
          "I believe this particular box once belonged to a French aristocrat. Before the... unpleasantness.",
          "The mechanism is quite delicate. Handle with care, if you please.",
        ],
        15: [
          "Ah, Patricia. The master spoke of her often, even decades after her passing.",
          "The portrait was painted just weeks before her untimely demise. The artist captured her essence perfectly.",
          "The master would spend hours staring at this portrait. Sometimes I would hear him speaking to it.",
        ],
        16: [
          "The master's library contains over ten thousand volumes, sir. Many quite rare.",
          "The master was a voracious reader. He claimed to have memorized every book in his collection.",
          "Some of these books are bound in... unusual materials. I wouldn't examine them too closely.",
        ],
        17: [
          "The lighting in this wing has always been problematic, sir. Mind your step.",
          "The darkness conceals many secrets in this mansion. Some best left undiscovered.",
          "I've always found that darkness reveals more than light, in its own way.",
        ],
        18: [
          "The master's silverware is sterling, of course. Polished daily, even now.",
          "Each piece was hand-crafted by a silversmith in Vienna. The master accepted nothing but perfection.",
          "The pattern is the family crest, sir. Dating back to the 12th century.",
        ],
        19: [
          "Count Papagalul is... an acquired taste, sir. The master found him amusing.",
          "The Count's vocabulary is quite colorful. I apologize in advance for any... impropriety.",
          "The Count has been with the family for generations. Longer than I, in fact.",
        ],
        20: [
          "The family archives are most extensive, sir. Genealogy was a passion of the master's.",
          "The House of Morvane has a storied history. Not all of it... pleasant.",
          "The master spent his final years researching his ancestry. What he discovered changed him profoundly.",
        ],
      },
      gypsy: {
        21: [
          "Your aura shifts like quicksilver. Fascinating to watch.",
          "The cards have been whispering your name for days. They're quite excited to meet you.",
          "I've read many palms in my time, but yours... yours tells a story I've never seen before.",
        ],
        22: [
          "The grounds never lie, though they speak in riddles and shadows.",
          "I learned tasseography from my grandmother, who learned it from hers, back to the old country.",
          "Coffee, tea, wine... all leave their marks. All tell their tales.",
        ],
        23: [
          "Numbers hold power. Each has its own personality, its own spirit.",
          "My crystal shows me sequences, patterns in the chaos of existence.",
          "The universe speaks through mathematics. Few have the ears to hear it.",
        ],
        24: [
          "These crystal fragments once formed a whole. Like your fragmented memories, perhaps?",
          "Each shard contains a piece of ancient wisdom. Together, they reveal a greater truth.",
          "The mosaic was shattered during the last blood moon. An omen, some would say.",
        ],
        25: [
          "These symbols were used by ancient mystics to encode their most powerful secrets.",
          "Shapes hold power. Triangles for change, circles for protection, squares for stability.",
          "The ancients understood geometry as the language of the universe.",
        ],
        26: [
          "The stars have much to tell us tonight. They've been watching you.",
          "The heavens record all that has been and much that will be.",
          "My people have read the night sky for millennia. Its language is older than words.",
        ],
        27: [
          "These tapestries were woven by my great-grandmother. She could see beyond the veil.",
          "The zodiac is a map of destiny. Your sign is... interesting. Very interesting indeed.",
          "The constellations are in unusual alignment tonight. A rare occurrence.",
        ],
        28: [
          "Each crystal resonates with a different energy. Together, they create harmony... or chaos.",
          "These stones have been in my family for generations. They choose their bearers, not the other way around.",
          "The sequence matters. Like notes in a melody or words in an incantation.",
        ],
        29: [
          "Sometimes words fail us. Sometimes silence speaks louder.",
          "My hands remember what my mind forgets. They carry ancient knowledge.",
          "Watch carefully. The body never lies, even when the tongue does.",
        ],
        30: [
          "The Major Arcana reveals the soul's journey. Yours is... unconventional.",
          "These cards have been in my family for centuries. They've absorbed much wisdom.",
          "The tarot doesn't predict the future. It reveals the present, if you have eyes to see.",
        ],
      },
      sphinx: {
        31: [
          "These symbols were ancient when I was young, and I am older than the desert itself.",
          "The scribes who carved these hieroglyphs turned to dust eons ago. Their words remain.",
          "Language is humanity's greatest invention. It outlives its creators.",
        ],
        32: [
          "Truth and lies dance together in the desert heat. Can you tell them apart?",
          "These four have been arguing for centuries. I find their disputes... amusing.",
        ],
        // Level 33 is excluded as it's part of the puzzle
        34: [
          "The crocodile god was feared and revered in equal measure.",
          "Water is precious in the desert. Those who control it control life itself.",
          "This deity was known to devour the unworthy. Consider yourself warned.",
        ],
        35: [
          "The desert plays tricks on weary travelers. What you see may not be real.",
          "I have watched countless souls wander in circles, chasing visions that fade like morning mist.",
          "The line between reality and illusion is thin here. Sometimes, it disappears entirely.",
        ],
        36: [
          "Numbers follow patterns, like footprints in the sand.",
          "This sequence was discovered by a mathematician who went mad contemplating infinity.",
          "Each number contains the essence of those that came before. Like generations of a family.",
        ],
        37: [
          "These pillars have stood for millennia, bearing the names of gods and kings.",
          "The ancient Egyptians believed names held power. To speak a name was to summon its essence.",
          "Match the names correctly. The gods are watching, and they are... particular.",
        ],
        // Level 38 is excluded as it's part of the puzzle
        39: [
          "The ancient Egyptians were master mathematicians. They built the pyramids with numbers, not magic.",
          "These papyri contain the calculations of royal architects. Their precision was remarkable.",
          "Symbols represent concepts. Numbers represent reality. Both can be manipulated by the wise.",
        ],
        40: [
          "The pyramid's chambers were designed to confuse intruders and protect the pharaoh's journey to the afterlife.",
          "Light and shadow play eternal games within these stone walls.",
          "Some chambers have remained sealed for thousands of years. Perhaps for good reason.",
        ],
      },
      devil: {
        41: [
          "Fire speaks, if you know how to listen. It whispers of destruction and rebirth.",
          "These flames have consumed countless souls. Yours would make a lovely addition.",
          "The message burns eternal, like the damned themselves. Poetic, isn't it?",
        ],
        42: [
          "Chess is a game of kings and pawns. Guess which one you are?",
          "I've been playing this game for millennia. No one has beaten me yet.",
          "Every move has consequences. Choose wisely... or don't. I win either way.",
        ],
        43: [
          "These souls have been counting for eternity. It keeps them... occupied.",
          "Numbers are the only constant in Hell. Everything else changes. Constantly.",
          "Count carefully. A mistake means starting over. For another thousand years.",
        ],
        44: [
          "This scene depicts one of my favorite methods of transportation. For new arrivals, of course.",
          "The artist captured the essence of despair quite beautifully, don't you think?",
          "I commissioned this piece personally. The painter is still working on the sequel.",
        ],
        // Level 45 is excluded as it's part of the puzzle
        46: [
          "Gambling is a vice I particularly enjoy. The house always wins, especially when I own the house.",
          "These slot machines are rigged, of course. But not in the way you might think.",
          "Care to place a wager? Your soul against... well, nothing. I already own it.",
        ],
        47: [
          "Ah, the human brain. Such a fragile, easily manipulated thing.",
          "I've always found the binary system so elegant. Simple, yet capable of infinite complexity.",
          "Let's see if you can rewire this little plaything to my liking.",
        ],
        48: [
          "Seven doors, seven sins. Everyone has a favorite. What's yours?",
          "Behind each door lies a specially tailored torment. I designed them myself.",
          "Choose wisely. Or don't. All paths lead to me eventually.",
        ],
        49: [
          "Poetry in Hell. One of my little jokes.",
          "This verse was composed by a damned poet. He writes exclusively in tears now.",
          "The rhythm is meant to mimic a heartbeat. Yours, specifically.",
        ],
        50: [
          "My elevator provides express service to all levels of Hell. No return tickets, I'm afraid.",
          "Each floor offers unique accommodations. All equally... stimulating.",
          "The descent is the easy part. It's the staying that becomes problematic.",
        ],
      },
    }

    // If we have a level-specific dialogue for this character and level, use it
    if (levelSpecificDialogues[character] && levelSpecificDialogues[character][level]) {
      const dialogues = levelSpecificDialogues[character][level]
      return dialogues[Math.floor(Math.random() * dialogues.length)]
    }

    // Default dialogues for each character as fallback
    const defaultDialogues: Record<string, string[]> = {
      skeleton: [
        "Mphf. What do you want now?",
        "Stop wasting my time, prisoner.",
        "These bones have seen more than you ever will.",
        "Tsk. Another day, another fool trying to escape.",
        "You think you're clever? I've seen hundreds like you.",
        "The last one who tried to escape is now part of my collection.",
        "Rattle my bones once more and I'll make sure you never leave.",
        "What's the matter? Cat got your tongue? Or just your wits?",
        "I've been guarding this prison since before your grandparents were born.",
        "You humans are all the same. So fragile, so temporary.",
      ],
      butler: [
        "I do hope you're finding everything to your satisfaction, sir.",
        "The master's puzzles have confounded many before you.",
        "One must maintain proper decorum, even in the most trying circumstances.",
        "I've served in this mansion for generations, if you'll pardon the temporal anomaly.",
        "Might I suggest a more... methodical approach, sir?",
        "The previous guests found these challenges quite... stimulating.",
        "I assure you, sir, everything is precisely as the master intended it to be.",
        "One does not rush art, nor does one rush a proper puzzle solution.",
        "The master was most particular about the arrangement of his affairs.",
        "I'm afraid I cannot offer additional assistance at this time, sir.",
      ],
      gypsy: [
        "The cards never lie, but sometimes they speak in riddles.",
        "I see shadows in your future... and light, if you're clever enough.",
        "Your fate is not sealed, wanderer. It shifts with every choice you make.",
        "My grandmother taught me to read the signs when I was just a child.",
        "The spirits whisper many secrets... if only you could hear them too.",
        "Cross my palm with silver... ah, just a figure of speech, my dear.",
        "The veil between worlds grows thin around you. Most curious.",
        "I've traveled from the mountains of Carpathia to the deserts of Sahara.",
        "Your aura... it flickers with uncertainty. And something else...",
        "The moon is waxing. A good time for revelations, no?",
      ],
      sphinx: [
        "Mortals have puzzled over my riddles for millennia.",
        "Time is but a grain of sand in the desert of eternity.",
        "I have watched empires rise and fall from these sands.",
        "The answer you seek may not be the one you need.",
        "Wisdom comes to those who listen to the whispers of the desert.",
        "I speak in riddles because truth is rarely straightforward.",
        "The pharaohs of old sought my counsel, as you do now.",
        "My gaze has witnessed the construction of the pyramids themselves.",
        "The desert holds many secrets. Some are best left buried.",
        "Patience is a virtue that few mortals possess.",
      ],
      devil: [
        "Oh, how delightful! Another soul to... entertain.",
        "I do so enjoy watching mortals struggle with my little games.",
        "Eternity is such a long time to spend in my company, don't you think?",
        "Your predecessors found my puzzles quite... consuming.",
        "The clock is ticking, though time has little meaning here.",
        "Your soul has such a... distinctive flavor. I look forward to savoring it.",
        "Hell is just a matter of perspective, wouldn't you agree?",
        "I've been collecting interesting souls since before your species walked upright.",
        "The terms of our agreement are quite binding. Literally, in some cases.",
        "Your determination is admirable, if ultimately futile.",
      ],
    }

    // Get the dialogues for the current character
    const dialogues = defaultDialogues[character] || defaultDialogues.skeleton

    // Return a random dialogue
    return dialogues[Math.floor(Math.random() * dialogues.length)]
  }, [])
}

// Guard dialog lines for level 10
export const guardDialogLines = [
  "An inmate has been murdered, and one of these four inmates did it. Who is the killer?",
  "What? I told you one of these four is the killer!",
  "Are you questioning me? Focus on the inmates!",
  "Stop wasting time and find the murderer among them!",
  "I'm the guard here, not a suspect. Now get back to work!",
]

// Get random elevator message
export const getRandomElevatorMessage = () => {
  const messages = [
    "The elevator descends with a sickening lurch...",
    "The elevator doors open to reveal a nightmarish scene...",
    "As the elevator stops, screams echo from beyond the doors...",
    "The elevator shudders to a halt, and the doors slide open with a groan...",
    "The temperature changes dramatically as the elevator doors open...",
    "A wave of despair washes over you as the elevator reaches its destination...",
    "The elevator's descent seems to take an eternity before finally stopping...",
    "The elevator doors part to reveal the horrors that await...",
  ]

  return messages[Math.floor(Math.random() * messages.length)]
}
