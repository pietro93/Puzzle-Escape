import type { Puzzle } from "@/types/puzzle"

// Hell - Devil (Levels 41-50)
export const puzzlesSet5: Puzzle[] = [
  // Level 41 - Fire Map Puzzle
  {
    level: 41,
    question: "The Devil presents you with a map of sacred eternal flames.",
    description:
      "The Devil smirks as he hands you an ancient map. 'These are the locations of sacred eternal flames across the mortal realm. Label them correctly, and I'll reward you with knowledge.'",
    hints: [
      "The pins mark locations of sacred eternal flames.",
      "Match the city names to their correct locations on the map.",
      "The numbers below some pins are coordinates that may help identify them.",
      "Some locations are real cities in Central Asia, while others are mythological places.",
    ],
    solution: "inferno",
    isFireMapPuzzle: true,
    category: "pattern",
  },
  {
    level: 42,
    question: "The Devil challenges you to a game of infernal chess.",
    description:
      "The chess pieces are made of bone and ember, and they move of their own accord. 'Find the winning move,' the Devil says with a smirk.",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/level42-placeholder-KjGxNqXIj7Bz3lk4O8unDeM6LrRptD.webp",
    solution: "queen to h7",
    category: "logic",
    hints: [
      "Look for a checkmate in one move.",
      "The queen is your most powerful piece.",
      "The black king is vulnerable on the h-file.",
    ],
  },
  {
    level: 43,
    question: "The Devil shows you a series of damned souls, each bearing a number.",
    description: "Five souls stand in a line, each with a number branded on their forehead: 8, 5, 4, 9, ?",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/level43-placeholder-KjGxNqXIj7Bz3lk4O8unDeM6LrRptD.webp",
    solution: "1",
    category: "pattern",
    hints: [
      "The numbers seem to follow a pattern, but not a mathematical one.",
      "Try counting something about each number.",
      "How many letters are in the word form of each number?",
    ],
  },
  {
    level: 44,
    question: "The Devil presents you with fragments of a haunting scene.",
    description: "Reassemble the pieces to reveal the name of this infernal transportation.",
    imageUrl: "",
    isHellJigsawPuzzle: true,
    solution: "ghost ship",
    category: "pattern",
    hints: [
      "If you are having difficulties with recomposing the painting, try focusing on the parts with people in it at first.",
      "The painting seems to be a piece from a famous Dutch painter from the 1500s.",
      "The painting is a piece by Hieronymus Bosch. Can you track down the original and look for clues?",
      "The title of the painting is Tondal's Vision. Can you find any differences with the original?",
    ],
  },
  {
    level: 45,
    question: "The Devil brings back some familiar faces from your journey.",
    description:
      "The Devil grins wickedly. 'I've brought some old friends to help you with this challenge. One of them knows the identity of a lost soul you must name. But be careful who you trust...'",
    imageUrl: "",
    isFamiliarFacesPuzzle: true, // This will use our new component
    solution: "beatrice portinari",
    category: "riddle",
    hints: [
      "Talk to each character and pay attention to their hints about literature and poetry.",
      "The lost soul is connected to a famous poet and his journey through the afterlife.",
      "The solution requires both the first and last name of this historical figure from Florence.",
    ],
  },
  {
    level: 46,
    question: "The Devil invites you to try your luck at his infernal casino.",
    description: "",
    imageUrl: "",
    isInfernalCasinoPuzzle: true,
    solution: "heaven mayhem",
    category: "pattern",
    hints: [
      "You need to find two words by rotating the slot machines.",
      "The dice will give you hints about which slot to rotate and by how many positions.",
      "The first word is the opposite of Hell, and the second word describes chaos and disorder.",
    ],
  },
  {
    level: 47,
    question:
      "The Devil gestures towards an infernal machine: dozens of switches connected to what appears to be a human brain... still attached to its head. The owner seems to be in pain.",
    description: "",
    imageUrl: "",
    solution: "eureka",
    category: "logic",
    hints: [
      "The numbers next to each row of switches show how many switches need to be flipped up.",
      "Pay attention to the flickering of the light. When you find the correct combination for one set of switches, the lightbulb become slightly brighter.",
      "Once you find all six combinations, pay attention to what's in front of you. Perhaps the solution is hidden somewhere.",
      "The switches seem to be a combinations of 0s and 1s. Perhaps the solution is encoded in binary",
    ],
    isBinarySwitchPuzzle: true,
  },
  // Level 48 - Mouth of Truth puzzle
  {
    level: 48,
    question: "The Mouth of Truth Reveals All",
    description:
      "The ancient Mouth of Truth is said to bite the hand of those who lie. Place the correct marbles in the right positions to reveal its secret.",
    imageUrl: "",
    locationImage: "/images/hell-bg.webp",
    isMouthOfTruthPuzzle: true,
    solution: "chaplain",
    hints: [
      "Each marble represents a different sin.",
      "The position of each marble matters.",
      "The Mouth of Truth will only speak when the correct combination is found.",
      "Look for patterns in the symbols on each marble.",
    ],
    category: "pattern",
  },
  {
    level: 49,
    question: "The Mouth of Truth",
    description:
      "Place the colored marbles in the correct positions to reveal the truth. Legend says if you lie while your hand is in the Mouth of Truth, it will bite your hand off.",
    solution: "chaplain",
    category: "puzzle",
    isMouthOfTruthPuzzle: true,
    hints: [
      "The Mouth of Truth requires a specific arrangement of marbles.",
      "Try different combinations of marbles in the four corners.",
      "The colors represent different virtues or concepts.",
      "The Latin word for 'truth' might be relevant here.",
    ],
  },
  {
    level: 50,
    question: "The Devil presents you with a final challenge.",
    description: "",
    imageUrl: "",
    solution:
      "dark haunting pain|dark plaguing limb|dark stinging limb|dark unliving pain|grim burning pains|grim hiding ruins|grim killing limbs|grim haunting ruin|grim plaguing pain|grim stinging pain|grim unliving ruin|harsh burning limbs|harsh hiding pains|harsh killing ruins|harsh plaguing ruin|harsh stinging ruin|lurid burning vault|lurid hiding blight|lurid killing limb|rigid burning limb|rigid hiding vault|rigid killing pain|brutal burning scar|brutal hiding vault|brutal killing ruin|dark burning ruins|dark hiding limbs|dark killing pains",
    category: "riddle",
    hints: [
      "The elevator takes you to different realms of Buddhist hell.",
      "Each floor has a specific name. Try to identify them from the descriptions.",
      "The Sanskrit word for the Buddhist hell realms is the solution.",
    ],
  },
]
