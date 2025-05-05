import type { Puzzle } from "@/types/puzzle"

// Prison Cell - Skeleton Guard (Levels 1-10)
export const puzzlesSet1: Puzzle[] = [
  {
    level: 1,
    question: "First one is child's play.",
    description: "The skeleton guard rattles its bones as it awaits your answer.",
    imageUrl: "/images/puzzle1.webp",
    solution: "murder",
    category: "riddle",
    hints: [
      "The solution appears on a mirror.",
      "The solution is mirrored - you have to spell it backwards.",
      'The first letter is "M".',
    ],
  },
  {
    level: 2,
    question: "Fine, let's see if you figure out what to do next. Tsk.",
    description: "",
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/level2-esZSejIFD8qWJPgO6NDR787T0gabZF.webp",
    solution: "14123",
    category: "pattern",
    hints: [
      "Why are the skulls and bones blue, green, white and red?",
      "Try counting each set of colored bones.",
      "Combine the number of bones for each color to the matching skull. E.g. Blue=1. The final solution is a number.",
    ],
  },
  {
    level: 3,
    question: "Mphf. Let's test your math.",
    description: "If:\nKey + Key = 12\nKey + Lock = 10\nLock × Chain = 8\nThen:\nKey + Lock + Chain = ?",
    imageUrl: "/images/puzzle3.webp",
    solution: "14",
    category: "math",
    hints: [
      "Assign a value to each symbol by solving the equations one by one.",
      "Start by figuring out what 🔑 equals from the first equation.",
      "Once you know 🔑, you can find 🔒 from the second equation, then ⛓️ from the third.",
    ],
  },
  {
    level: 4,
    question: "FEAR YOUR DREAMS",
    description: "F*1 E*2 A*0 R*1 Y*0 O*1 U*0 R*1 D*1 R*1 E*2 A*0 M*1 S*0",
    imageUrl: "/images/puzzle4.webp",
    solution: "freedom",
    category: "pattern",
    hints: [
      "The roman numbers indicate how many times to include each letter.",
      "If a letter has a dash next to it, don't include it in the answer.",
      "The answer is a 7-letter word starting with 'F'.",
    ],
  },
  {
    level: 5,
    question: "You think these puzzles are easy? Ha! I present you: the magic box.",
    description:
      "",
    solution: "bloodshoot eyes",
    category: "logic",
    hints: [
      "Each row, column, and diagonal must sum to the same number.",
      "Try to find what the target sum should be based on the available numbers.",
      "The numbers 1, 2, 2, 3, 3, 3, 4, 4, 5 must all be used exactly once.",
      "The magic sum for this puzzle is 9.",
    ],
    isMagicBoxPuzzle: true,
  },
  {
    level: 6,
    question: "Like clockwork",
    description: "Clockwise",
    imageUrl: "/images/puzzle6.webp",
    solution: "Amber",
    category: "logic",
    hints: [
      "Find letters hidden in the image and arrange them clockwise",
      "There's one letter hidden in each quadrant, and one which is outside of the quadrants.",
      "Start with the upper-right quadrant and make your way clockwise. Solution has two vowels and three consonants.",
    ],
  },
  {
    level: 7,
    question: "Mphf. I can't let you go. You won't solve this one!",
    description: "BONE GONE GORE BONE TONE TOME",
    imageUrl: "/images/puzzle10.webp",
    solution: "BONE LONE LOVE",
    category: "riddle",
    hints: [
      'You have to change the word "BONE" like in the examples',
      "Change one letter at a time, starting with B",
      "The final solution is made of three words",
    ],
  },
  {
    level: 8,
    question: "Unscramble the letters to find what keeps you locked away",
    description: "A1C2EK0HLSS",
    imageUrl: "/images/puzzle8.webp",
    solution: "shackles",
    category: "word",
    hints: [
      "Isolate all the letters from the bones and re-arrange them to form a word.",
      "From left to right: SHECSKAL. Ignore the bones with no letters in them.",
      "The solution starts and ends with S.",
    ],
  },
  {
    level: 9,
    question: "What is this? Some kind of code?",
    description: "I bet you won't be able to decipher this...",
    imageUrl: "/images/puzzle9.webp",
    solution: "DECAY",
    category: "logic",
    hints: [
      "There seem to be five separate characters.",
      "The symbols look like a series of dashes and dots.",
      "Could this be Morse code?",
    ],
  },
  {
    level: 10,
    question: "An inmate has been murdered, and one of these four inmates did it. Who is the killer?",
    description:
      "The guard claims one of the inmates is the murderer. Speak with each inmate to hear their statements. Beware - only one of them is saying the truth.",
    imageUrl: "",
    isInteractiveInmates: true,
    inmateData: [
      {
        name: "Caine",
        image: "/images/caine.webp",
        statements: [
          { text: "I know Ronan did it. He's a killer." },
          { text: "All four of us are liars." },
          { text: "The killer is a woman." },
        ],
      },
      {
        name: "Ronan",
        image: "/images/ronan.webp",
        statements: [
          { text: "Silas has blood on his boots. He's the killer." },
          { text: "Lyra is always lying, do not trust her." },
          { text: "I always say the truth." },
        ],
      },
      {
        name: "Lyra",
        image: "/images/lyra.webp",
        statements: [
          { text: "The guard is lying. Do not trust what he said." },
          { text: "None of us four are murderers." },
          { text: "The murder is in this room - but not who you think." },
        ],
      },
      {
        name: "Silas",
        image: "/images/silas.webp",
        statements: [
          { text: "I know Lyra did it. She's a murderer and a liar." },
          { text: "Nobody committed the murder." },
          { text: "More than one person committed the murder." },
        ],
      },
    ],
    guardStatement: "An inmate has been murdered, and one of these four inmates did it. Who is the killer?",
    solution: "guard",
    category: "logic",
    hints: [
      "Try to find out who is lying and who is telling the truth. Find inconsistencies in the inmates statements.",
      "If Lyra is telling the truth, what does that imply?",
      "If the guard is lying but the murder is in this room - then who could it be?",
    ],
  },
]
