import type { Puzzle } from "@/types/puzzle"

// Desert - Sphinx (Levels 31-40)
export const puzzlesSet4: Puzzle[] = [
  {
    level: 31,
    question: "The Sphinx presents you with ancient symbols carved in stone.",
    description: "The symbols seem to hold a message from the distant past.",
    imageUrl: "", // We'll handle the images differently
    isPuzzleImage: true,
    solution: "tutankhamon|tutankhamun",
    category: "pattern",
    hints: [
      "These are actual ancient Egyptian hieroglyphs!",
      "Find yourself a hieroglyph dictionary - each symbol can be translated onto a letter.",
      'The fourth symbol is an "ankh".',
      "The final solution is a single word of 11 letters.",
    ],
  },
  {
    level: 32,
    question: "The Sphinx presents you with four ancient figures, each claiming to know the secret of the desert.",
    description:
      "Four figures stand before you, each claiming to know the secret of the desert. The Sphinx tells you that only one speaks the truth, while the others lie. You must determine who speaks the truth.",
    imageUrl: "",
    isInteractiveInmates: true,
    inmateData: [
      {
        name: "Priest",
        image: "/images/priest.webp", // Placeholder
        statements: [
          { text: "The merchant knows the secret path through the desert." },
          { text: "The scribe is not to be trusted." },
          { text: "I have served the gods faithfully for decades." },
        ],
      },
      {
        name: "Merchant",
        image: "/images/merchant.webp", // Placeholder
        statements: [
          { text: "The priest speaks falsely about me." },
          { text: "The soldier has never set foot in the sacred temple." },
          { text: "I have traveled the desert many times." },
        ],
      },
      {
        name: "Scribe",
        image: "/images/scribe.webp", // Placeholder
        statements: [
          { text: "I alone know the ancient texts that reveal the secret." },
          { text: "The priest has been corrupted by gold." },
          { text: "The merchant's maps are forgeries." },
        ],
      },
      {
        name: "Soldier",
        image: "/images/soldier.webp", // Placeholder
        statements: [
          { text: "I have guarded the secret for many years." },
          { text: "The scribe's knowledge comes from stolen scrolls." },
          { text: "The merchant has never left the city walls." },
        ],
      },
    ],
    guardStatement: "Only one of these four speaks the truth. The others lie. Who speaks the truth?",
    solution: "merchant",
    category: "logic",
    hints: [
      "Analyze each statement carefully and look for contradictions.",
      "If only one person tells the truth, then all statements by the others must be false.",
      "The truthful person's statements must all be true, while the liars must have at least one false statement each.",
    ],
  },
  {
    level: 33,
    question: "The Sphinx leads you into a dark chamber with ancient inscriptions.",
    description: "",
    imageUrl: "",
    isDarkRoomPuzzle: true,
    solution: "broken heart",
    category: "pattern",
    hints: [
      "Light the torches to reveal what's hidden in the darkness.",
      "Each torch will only stay lit for a short time.",
      "The text appears to be in Arabic. What could it mean?",
      "Try to translate the Arabic text to English.",
    ],
  },
  {
    level: 34,
    question: "The Sphinx presents you with a fragmented mosaic of an ancient deity.",
    description: "Reassemble the mosaic to reveal the identity of the crocodile god worshipped in this region.",
    imageUrl: "",
    isCrocodileJigsawPuzzle: true,
    solution: "sobek",
    category: "pattern",
    hints: [
      "The mosaic depicts a crocodile in the backdrop of Ancient Egypt.",
      "There is a hidden message in the mosaic... all letters appear diagonally from the top left to the bottom right corner.",
      "Is there any Egyptian deity linked to crocodiles?",
    ],
  },
  {
    level: 35,
    question: "The Sphinx presents you with a riddle of the sands.",
    description: "The sands shift to reveal a pattern of symbols that seem to change with the desert winds.",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/level35-placeholder-KjGxNqXIj7Bz3lk4O8unDeM6LrRptD.webp",
    solution: "mirage",
    category: "riddle",
    hints: [
      "The symbols appear and disappear like illusions in the desert.",
      "What phenomenon is common in the desert that makes you see things that aren't really there?",
      "The answer is a single word that describes an optical illusion caused by atmospheric conditions.",
    ],
  },
  {
    level: 36,
    question: "The Sphinx challenges you to follow the path of a legendary merchant.",
    description: "",
    imageUrl: "",
    isScarabJourneyPuzzle: true,
    solution: "mansa musa",
    category: "pattern",
    hints: [
      "The scarab traces the journey of a famous historical figure.",
      "This merchant was known for his incredible wealth and famous pilgrimage.",
      "The journey from Mali to Mecca was undertaken by a king whose generosity crashed economies.",
      "This African ruler's hajj to Mecca in 1324-1325 is legendary for the gold he distributed along the way.",
    ],
  },
  {
    level: 37,
    question: "",
    description: "",
    imageUrl: "",
    isEgyptianPillarsPuzzle: true,
    solution: "silent mirage",
    category: "pattern",
    hints: [
      "Try placing the ancient Egyptian names on the pillars with their Greek counterparts.",
      "Each correct combination reveals a letter at the bottom of the screen.",
      "The divine symbols in the second set correspond to specific Egyptian gods.",
      "The order of pharaohs in the third set matters - place them in chronological order.",
    ],
  },
  {
    level: 38,
    question: "A strange message appears in the desert sand.",
    description:
      'The Sphinx gazes at you with ancient eyes. "Ask me and I shall give you the key to decode this message."',
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/level38-IjLJlyFe22TRibVQWBLk5ss8gYbYf7.webp",
    solution: "desert rose",
    category: "pattern",
    hints: [
      "The code in the sand needs to be decoded with a key - it is a type of Vigenère cipher.",
      "To obtain the key, interact with the sphinx and solve her riddle.",
      'What has a "bed", a "mouth", "banks" and a "crystal clear body"? Could it be some kind of body of water?',
      'Use the key "river" to decipher the code "UMNIIK AJYC". You will need to repeat the key twice.',
      "Convert each letter to its corresponding number in the alphabet starting from 0 (A=0, B=1, C=2, etc.), then subtract the key's letter number from the code's letter number for each pair, and convert the resulting numbers back to letters.",
      'The first letter in the code "U" is number 20 and the first letter from the key "R" is number 17. so the first letter of the solution is 20-17=3, which corresponds to the letter "D".',
    ],
  },
  {
    level: 39,
    question: "The Sphinx presents you with ancient Egyptian mathematical papyri.",
    description: "",
    imageUrl: "",
    isEgyptianMathPuzzle: true,
    solution: "eye of horus",
    category: "math",
    hints: [
      "Each papyrus contains a mathematical equation using Egyptian symbols.",
      "Start by finding the value of the Was symbol (staff) from the equations.",
      "Once you know the value of Was, you can determine the values of other symbols like Shen and Djed.",
      "The golden papyrus contains a special equation that will lead you to the solution.",
      "Which symbol's value matches the number in the golden papyrus?",
    ],
  },
  {
    level: 40,
    question: "The Sphinx leads you into a pyramid with multiple chambers.",
    description: "Explore the chambers of the pyramid to uncover the hidden message.",
    imageUrl: "",
    isPyramidPuzzle: true,
    solution: "bird of prey",
    category: "pattern",
    hints: [
      "Find a way to bring light to all chambers. Perhaps Ra can help?",
      "The murals hidden in the dark can help you translate the message in the entrance room.",
    ],
  },
]
