import type { Puzzle } from "@/types/puzzle"

// Mansion - Butler (Levels 11-20)
export const puzzlesSet2: Puzzle[] = [
  {
    level: 11,
    question: "I am looking for a spice. Must be somewhere around here.",
    description: "Tx1 Hx0 Ex1 M*0 A*2 N*1 S*1 I*1 O*1 N*1",
    imageUrl: "/images/puzzle11.webp",
    solution: "star anise",
    category: "pattern",
    hints: [
      "The answer is an anagram. The colors indicate how many times a letter must be used.",
      "Each letter must be used as many times as it appears in green (underline). Remove all other letters.",
      "The answer is formed by two words: the name of the spice and its shape.",
    ],
  },
  {
    level: 12,
    question: "The butler presents you with an ornate clock, its face adorned with Roman numerals.",
    description:
      '"This timepiece has been in the master\'s family for generations," the butler explains, his gloved finger tracing the numerals on the clock\'s face. "The master was fond of creating sequences with these times. He left this particular sequence unfinished. Can you determine what comes next?"\n\nIII\nXII:IX\nXXI:XVIII\nVI:XXVII',
    imageUrl: "",
    locationImage: "/images/mansion-clock.webp",
    solution: "XV:XXXVI",
    category: "pattern",
    hints: [
      "Convert the roman numerals to regular numbers to better analyze the sequence.",
      "Find the next time in the sequence by analyzing how hours and minutes are added.",
      "Convert the next time in the sequence back to roman numerals to find the solution.",
    ],
  },
  {
    level: 13,
    question: "The butler presents you with a curious color palette.",
    description:
      '"This palette was gifted to the master by a renowned French painter," the butler explains, handling the artifact with reverence. "The painter mentioned that the canvas contains a sort of treasure map. The master was fascinated by the numerical patterns hidden within the colors."',
    imageUrl: "",
    locationImage: "/images/color-palette/color_palette.webp",
    isColorPalettePuzzle: true,
    solution: "Vampire Island",
    category: "math",
    hints: [
      "Look for mathematical patterns in the known values of the colors.",
      "Try to find relationships between colors that are similar in value.",
      "The colors form a mathematical sequence that can help you determine the missing values.",
      "Once you've found all the correct values, convert them to letters using their positions in the alphabet.",
    ],
  },
  {
    level: 14,
    question:
      "The butler presents you with a peculiar puzzle box. 'This belonged to the master's collection of culinary curiosities,' he explains with a slight bow.",
    description: "Assemble the pieces to reveal the hidden message.",
    imageUrl: "",
    isJigsawPuzzle: true,
    solution: "escargot",
    category: "pattern",
    hints: [
      "The image shows a delicacy popular in French cuisine.",
      "The message 'EAT ME' suggests it's something edible.",
      "The spiral shape in the image is a clue to what creature this dish is made from.",
    ],
  },
  {
    level: 15,
    question: "The butler introduces the master's first love.",
    description:
      '"This is a portrait of Patricia, the master\'s first love," the butler explains with a hint of melancholy. "She was the daughter of a wealthy merchant from Florence. The master met her during his travels in Italy and was immediately captivated by her intelligence and beauty. Sadly, she died of fever at the young age of twenty-four, before they could be married. He commissioned this painting shortly before her untimely demise. The master claimed there was a message hidden within it—something only those with keen eyes would notice."',
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/level15-yKL4h24APeyThov1puBOPxn8k91pnM.webp",
    solution: "life and death",
    category: "riddle",
    hints: [
      "Is something hidden in the painting?",
      "There's a message barely visible above Patricia's head, upside down.",
      "The messages says 'Vita et Mors'. Is this latin?",
    ],
  },
  {
    level: 16,
    question: "The butler shows some of the master's favourite readings.",
    description:
      "'These were some of the master's favorite books,' the butler explains, gesturing to the shelf. 'I myself was particularly fond of \"The Third Eye.\" The master said it provided a unique perspective on the other works.'",
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/level16-ndyLwTr9VvTpqI8YPjNHPSviMqaMkW.webp",
    solution: "TEARS",
    category: "pattern",
    hints: [
      'Why was "The Third Eye" highlighted?',
      "Perhaps The Third Eye provides a clue for what to do with the other titles.",
      "Try counting the third letter from each title, excluding The Third Eye.",
    ],
  },
  {
    level: 17,
    question: "",
    description: "",
    imageUrl: "",
    isLightSwitchPuzzle: true,
    solution: "you may proceed",
    category: "logic",
    hints: [
      "It's too dark to see anything. But there must be something you can do to shed some light.",
      "There are four switches hidden in the dark. Find and flip the third switch to turn on the lights.",
      "While keeping the third switch flipped up, flip the other remaining switches up and down until you find the right combination and the solution will appear.",
    ],
  },
  {
    level: 18,
    question: "The butler presents you with a mathematical puzzle involving the mansion's silverware.",
    description:
      "The butler adjusts his bow tie. 'I have a mathematical problem for you, if you would be so kind. The master was quite fond of these little brain teasers. Can you determine the value of knife + fork + spoon?'",
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/puzzle18-jq3ObXeHCzJOyXNLxUGCxDZJ6iddqc.webp",
    solution: "135",
    category: "math",
    hints: [
      "You can simplify the first equation by dividing everything by 4.",
      "You can combine the first, second and fourth equation to find the value of the spoon.",
      "By combining the equations you can find that 9 spoons = 90.",
      "If one spoon equals 10, then you can easily find the value of the fork by solving the first equation, fork = 15 + 10",
      "Knowing that spoon is 10 and fork is 25, you can solve the third equation to find that the knife is equal to 500 - 400 = 100.",
    ],
  },
  {
    level: 19,
    question:
      "This is Count Papagalul. He's quite the conversationalist, though his manners leave something to be desired. Be careful, he bites.",
    description: "",
    imageUrl: "",
    isParrotPuzzle: true,
    solution: "daft punk",
    category: "riddle",
    hints: [
      "Try asking the Count for the solution.",
      "The Count seems to respond to specific phrases. Pay attention to its exact words and do as he says.",
      'Ask the Count and he\'ll sing "One More Time"... who is this song from?',
    ],
  },
  {
    level: 20,
    question:
      "I do hope you are prepared for a most intriguing challenge. I present you with the labyrinthine family tree of the House of Morvane, you shall uncover secrets shrouded in the very darkness that has haunted our noble lineage for generations. Your task, if you will, is to discover the identity of a forgotten heir who ruled with a brief yet most infamous reign. The answer, I dare say, lies within the dusty annals of our history and a cryptic prophecy that has plagued our house for centuries.",
    description: "Find the name of the heir.",
    imageUrl: "",
    isLibraryPuzzle: true,
    libraryData: {
      books: [
        {
          id: "legacy-of-morvane",
          title: "The Dark Legacy of Morvane",
          image: "/images/book-legacy-of-morvane.webp",
          content:
            "The House of Morvane has long been shrouded in mystery and intrigue. Our ancestors built grand castles and forged alliances that endured for centuries, yet beneath this grandeur, discord brewed. It is said that one of our most infamous rulers, a Lady of noble birth, left an indelible mark on our history. Her reign, though brief, was marked by terror and despair. She never married and never accepted the title of Queen, even after her parents passed away.\n\nThe early days of our kingdom were marked by grandeur and power. Our rulers were known for their strength and diplomacy, often securing alliances through strategic marriages. However, these alliances sometimes came at a great cost, leading to internal strife and external threats that consistently challenged the stability of our realm.",
        },
        {
          id: "royal-intrigue",
          title: "Royal Intrigue",
          image: "/images/book-royal-intrigue.webp",
          content:
            "In the House of Morvane, diplomacy has always been a delicate art. Marriages were often arranged to secure alliances, and the fate of entire kingdoms hung in the balance of these negotiations. Despite these efforts, internal strife and external threats have consistently challenged the stability of our realm. The balance between ambition and wisdom is a delicate one, and those who fail to find this balance often suffer dire consequences.\n\nOur history is a tale of a ruler who shared her first name with a powerful ancestor, for cyclical is the nature of fate. Her rise to power was as unexpected as it was short-lived, for she ruled for just about a year before succumbing to her own thirst for power.",
        },
        {
          id: "forgotten-chronicles",
          title: "Forgotten Chronicles",
          image: "/images/book-forgotten-chronicles.webp",
          content:
            "Deep within our archives lies a tale of a monarch who ruled with an iron fist for a brief period. She was the daughter of Princess Aethera the Forgotten, a child whose existence was overshadowed by the grandeur of her parents. Her reign was marked by fear and terror, leaving behind only whispers and rumors.\n\nThe kingdom of Morvane has faced numerous challenges throughout its history, from wars with neighboring kingdoms to internal conflicts that have threatened to tear us apart. Despite these challenges, our people have always found a way to persevere, often through the leadership of strong and determined rulers.",
        },
        {
          id: "shadows-of-the-past",
          title: "Shadows of the Past",
          image: "/images/book-shadow-of-the-past.webp",
          content:
            "The history of Morvane is filled with stories of great heroes and villains, each leaving their mark on our collective memory. From brave warriors to cunning politicians, our ancestors have shaped the course of our kingdom's destiny. However, it is often the lesser-known figures who have had the most profound impact on our history.\n\nIn the annals of our family, there is a tale of a ruler known by a nickname that struck fear into the hearts of our people: The Accursed. This monarch's downfall was as swift as their rise, leaving behind a legacy of darkness and despair.",
        },
        {
          id: "lost-heirs",
          title: "Lost Heirs",
          image: "/images/book-lost-heirs.webp",
          content:
            'Prince Marcen the I, also known as "The Unseen," was a figure of great promise. Alas, his fate was sealed when he was kidnapped as a child and never found. Despite his title, he never ascended to power, leaving his ambitions unfulfilled. His mother, Princess Lirien the Deceiver was known for her cunning and manipulative nature, often using her charm to influence those around her.\n\nPrincess Lirien\'s marriage to Lord Ryker was a union of convenience and power. While she was known for her deceitful nature, her true intentions were often shrouded in mystery. This marriage, like many others in our history, highlights the complex web of alliances and rivalries that have shaped our kingdom.',
        },
        {
          id: "royal-deceit",
          title: "Royal Deceit",
          image: "/images/book-royal-deceit.webp",
          content:
            "Throughout the centuries, the House of Morvane has been marked by both grand achievements and tragic failures. Our rulers have walked a thin line between glory and disaster, often leaving behind legacies that are as complex as they are fascinating. Understanding these complexities is key to unraveling the mysteries of our past.\n\nPrince Marcen remains a mystery, a prince lost to the shadows of history before he could ever claim his rightful place. His story serves as a reminder of the fragility of power and the unpredictability of fate.",
        },
        {
          id: "fractured-throne",
          title: "The Fractured Throne",
          image: "/images/book-the-fractured-throne.webp",
          content:
            "One of our most powerful monarchs ruled with an iron fist, but her reign was cut short by a descent into madness. After the death of both her parents, her grip on reality faltered, and she became increasingly isolated, unable to make rational decisions. This led to a period of chaos and instability, as factions within the kingdom vied for control.\n\nDespite her initial strength, her downfall was swift and tragic, leaving behind a legacy of fear and confusion. The Lady took her own life the night before she was meant to be officially crowned, hence never officially becoming a Queen. This tale serves as a cautionary story about the dangers of unchecked power and the importance of mental fortitude in leadership.",
        },
      ],
    },
    solution: "Lady Niamh the Accursed",
    category: "riddle",
    hints: [
      "You need to collect information from several sources to find the name of a ruler with a brief yet infamous reign.",
      'The solution must include the royal title, first name and nickname e.g. "King Arin the Unyielding".',
      "The ruler never became a Queen, shares her first name with one of her ancestors, and her nickname is mentioned in two of the texts.",
    ],
  },
]
