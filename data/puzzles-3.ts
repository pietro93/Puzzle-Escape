import type { Puzzle } from "@/types/puzzle"

// Forest - Gypsy (Levels 21-30)
export const puzzlesSet3: Puzzle[] = [
  {
    level: 21,
    question: "The gypsy woman invites you to answer some questions about yourself.",
    description:
      "The gypsy woman leans forward, her eyes gleaming with curiosity. 'Before I can read your future, I must understand your essence. Answer truthfully, for the cards see  'Before I can read your future, I must understand your essence. Answer truthfully, for the cards see through all deception.'",
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
      "",
    imageUrl: "/images/zodiac-animation.webp",
    solution: "1639:Mèo",
    category: "pattern",
    hints: [
      "The shifting patterns in the crystal ball resemble phases or cycles.",
      "Consider what celestial body changes its appearance regularly as viewed from Earth.",
      "This celestial body controls the tides and is associated with intuition and emotions in mystical traditions.",
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
    description:
      '"These symbols were used by ancient mystics to encode their most powerful secrets," the gypsy woman explains, her eyes gleaming with excitement. "Each shape holds a specific value, and when combined, they reveal the key to unlocking hidden knowledge. Solve this puzzle, and you\'ll glimpse the numeric code that opens the door to the next realm."',
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/level25-KjGxNqXIj7Bz3lk4O8unDeM6LrRptD.webp",
    solution: "1052",
    category: "math",
    hints: [
      "Start by adding the values of the shapes together in each equation. See if this assumption helps you make sense of the puzzle.",
      'Choose an equation that includes a "red circle" and see if you can use it to figure out the value of the "red circle."',
      'Solve for the value of the "red triangle" using Red Circle + Red Triangle = 22 and the value of the "red circle" you found.',
      'Use the relationship between "blue circle" and "red circle" to find the value of the "blue circle."',
      'Use the values of the "blue circle," "blue triangle," and "blue square" to calculate the "red star."',
      'The value of the "blue star" is equal to "red star" plus "red circle".',
    ],
  },
  {
    level: 26,
    question: "The gypsy woman invites you to look at the sky.",
    description:
      "The gypsy woman leads you outside her wagon and points upward. 'The stars have much to tell us tonight,' she whispers. 'Look closely at the heavens. What do you see?'",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/constellation-BrFgIvZ7mYNL3Z41mcVTuNl2ittf5X.gif",
    locationImage: "/images/forest.webp", // Use default forest image
    solution: "CAPRICORN|CAPRICORNUS", // Accept both solutions
    category: "pattern",
    hints: [
      "The sky is clear. You are definitely looking at stars.",
      "Can you identify what constellation you are looking at?",
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
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hands-animation-J6PNaCc88j264qQxkPiSfPzA6Fzsbs.mp4", // Use the MP4 video instead of GIF
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
