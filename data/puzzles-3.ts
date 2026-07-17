import type { Puzzle } from "@/types/puzzle"

// Forest - Gypsy (Levels 21-30)
export const puzzlesSet3: Puzzle[] = [
  {
    level: 21,
    question: "The gypsy woman invites you to answer some questions about yourself.",
    description: "Answer truthfully — the cards see through all deception.",
    imageUrl: "",
    isQuestionnairePuzzle: true,
    solution: "RANDOM", // This will be overridden by the component
    category: "pattern",
    hints: [
      "Have you ever played the hangman? This puzzle is quite similar.",
      'If you haven\'t revealed enough letters to solve this, type in "RESTART LEVEL" to restart from scratch. The final solution will also change.',
      "The solution comprises three words - a descriptor, a color and a noun.",
    ],
  },
  {
    level: 22,
    question: "The gypsy woman prepares to perform some tasseography with a bunch of coffee grounds.",
    description:
      "She presents you with three cups, each containing mysterious patterns in the coffee residue. 'The grounds never lie,' she whispers.",
    imageUrl: "",
    solution: "STORMY TIMES AHEAD",
    category: "pattern",
    hints: [
      "Rotate the coffee cups to reveal two letters and one image for each.",
      "The letters represent the first and last letter of a word and the image can help you identify each word.",
      "The solution is a combination of three words, S____Y T___S A___D",
    ],
  },
  {
    level: 23,
    question: "The gypsy woman's crystal ball reveals shadows from a faraway land.",
    description:
      "The crystal ball clouds over, then clears to reveal shifting patterns of light. 'I see a distant culture, an ancient zodiac cycle,' the gypsy whispers. 'Tell me the year and animal I'm seeing.'",
    imageUrl: "/images/zodiac-animation.webp",
    solution: "1639:Mèo|1639:mèo|1639 Mèo|1639 mèo",
    category: "pattern",
    hints: [
      "The shifting patterns in the crystal ball reveal an Eastern zodiac cycle.",
      "Look carefully at the symbols - they represent a specific year in an Eastern zodiac. Can you identify which language is being used?",
      "The sequence of years follows a pattern with two distinct operations alternating. Try to identify what these operations are.",
      "The pattern adds 25 then subtracts 95, repeatedly.",
      "Once you identify the year, find the corresponding sign. You have to write both as the solution, and pay attention to grammar!",
    ],
  },
  {
    level: 24,
    question: "The gypsy woman presents you with fragments of a crystal mosaic.",
    description: "Reassemble the pieces to reveal the name of a precious stone with mystical properties.",
    imageUrl: "",
    isCrystalJigsawPuzzle: true,
    solution: "lapis lazuli|lapislazuli",
    category: "pattern",
    hints: [
      "You should be able to clearly identify the four corners of the mosaic. Start from there when you assemble it.",
      "The mosaic seem to represent various magical crystals.",
      "The mosaic contains some characters: Lap... ...uli? Looks like some letters are missing.",
    ],
  },
  {
    level: 25,
    question: "The gypsy woman presents you with an ancient geometric puzzle.",
    description: "Each rune holds a specific value. Solve each equation and lock in the runes to reveal the final expression.",
    imageUrl: "",
    isMysticsGeometryPuzzle: true,
    solution: "1052",
    category: "math",
    hints: [
      "Start with the equation that only uses one shape, the red circle - solve it and lock it in.",
      "Use the value of the red circle to solve for the red triangle.",
      "The blue circle's equation uses both the red circle and the red triangle you already solved.",
      "The blue triangle and the blue square each have their own simple equation - solve those independently.",
      "Once blue circle, blue triangle, and blue square are locked in, use them to solve the red star.",
      "The blue star is equal to the red star plus the red circle.",
      "Once every rune glows, evaluate: Blue Triangle × Blue Star + Red Circle.",
    ],
  },
  {
    level: 26,
    question: "The gypsy woman invites you to look at the sky.",
    description:
      "The gypsy woman leads you outside her wagon and points upward. 'The stars have much to tell us tonight,' she whispers. 'Trace the shape hidden among them, and tell me what you see.'",
    imageUrl: "",
    locationImage: "/images/constellation.gif",
    isConstellationPuzzle: true,
    solution: "CAPRICORN|CAPRICORNUS", // Accept both solutions
    category: "pattern",
    hints: [
      "Click two stars to draw a line between them. Not every star belongs to the shape.",
      "Once the outline is fully traced, step back and look at what you've drawn.",
      "Many constellations share their names with Zodiac signs. If you can't identify it, try guessing.",
    ],
  },
  {
    level: 27,
    question: "The gypsy woman presents you with a collection of tapestries and frames.",
    description: "",
    imageUrl: "",
    isZodiacPuzzle: true,
    solution: "OPHIUCHUS",
    category: "pattern",
    hints: [
      "Try to match all tapestries and frames and see what happens.",
      "The tapestries represent zodiac signs while the frames represent seasons.",
      "Make sure to order all zodiac signs in order from 1 to 12. Is there a 13th sign?",
    ],
  },
  {
    level: 28,
    question: "The gypsy woman presents you with magical crystals and a compendium.",
    description: "Arrange the seven crystals in their proper sequence, starting from the top and moving clockwise.",
    imageUrl: "",
    isCrystalSequencePuzzle: true,
    solution: "tiger's eye|tigers eye",
    category: "pattern",
    hints: [
      "The gem that mirrors the night's glow must be the moonstone.",
      "The blue stone is between a white stone and a purple crystal.",
      'Obsidian is "forged from fire", as it is found in volcanos.',
      "The citrine comes after the amethyst.",
      "The last crystal in the sequence is the same color as the first stone in the sequence.",
      "There is one stone leftover once you complete the sequence, place it in the center and check the compendium. What's the name of this stone?",
    ],
  },
  {
    level: 29,
    question: "The Gypsy woman goes quiet.",
    description:
      "She begins to move her hands in a strange pattern, then stops. Her eyes lock with yours, waiting for your understanding.",
    imageUrl: "",
    isPuzzleImage: true,
    isAnimatedGif: true,
    videoUrl:
      "/images/sign-language.gif", // Using local GIF instead of MP4
    solution: "abandon hope",
    category: "pattern",
    hints: [
      "The Gypsy is communicating through sign language.",
      "She's spelling out two words: a 7-letter word followed by a 4-letter word.",
      "The first word starts with 'A' and the second word starts with 'H'.",
    ],
  },
  {
    level: 30,
    question: "The final card reveals your destiny",
    description: "The Gypsy woman prepares to give you a tarot reading using the Major Arcana cards.",
    imageUrl: "",
    isTarotPuzzle: true,
    solution: "livid",
    category: "pattern",
    hints: [
      "The Gypsy is using Major Arcana cards. Perhaps you can find out something about the five cards she showed you.",
      "All Major Arcana cards are numbered from 0 to 21.",
      "The last card appears to be some sort of decryption key. Perhaps you can do something with the numbers?",
      "Try using roman numbers for each card. But be careful - some cards are reversed.",
      'With roman numbers for each card you get "XVI", "XIII", "XV", "XII", and "O". But "XIII" and "XII" upside down will look like "IIIX" and "IIX"',
      "Use the decipher key to decipher the combination of numbers. The 'X' is used as a separator for each letter.",
      "The final solution is a five-letter word.",
    ],
  },
]
