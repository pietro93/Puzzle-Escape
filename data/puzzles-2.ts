import type { Puzzle } from "@/types/puzzle"

// Mansion - Butler (Levels 11-20)
export const puzzlesSet2: Puzzle[] = [
  {
    level: 11,
    question: "The butler shows some of the master's favourite readings.",
    description: "The master's library has fallen into disarray. It once told a story, in order.",
    solution: "TEARDROP|TEAR DROP",
    category: "pattern",
    isBookshelfChronologyPuzzle: true,
    hints: [
      'Why was "The Third Eye" highlighted?',
      "Try arranging the books by their publication year. The plaques beneath the shelf tell you where each one belongs.",
      "Once every book finds its year, the light through the window will show you the rest.",
    ],
  },
  {
    level: 12,
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
    level: 13,
    question: "I am looking for a spice. Must be somewhere around here.",
    description: "",
    imageUrl: "",
    isAnagramSpicePuzzle: true,
    solution: "star anise",
    category: "pattern",
    hints: [
      "Drag spice jars onto the plate, two at a time. The hands react to what you place.",
      "A still hand means neither spice belongs in the solution. A turning hand means one of them does. Pair an untested jar with one you already know is a dud to isolate the result.",
      "Once you've confirmed which word a jar belongs to, rest it on that word's pedestal to keep track — the order on the pedestal doesn't matter, only the letters.",
      "The answer is formed by two words: the name of the spice and its shape.",
    ],
  },
  {
    level: 14,
    question: "The butler presents you with an ornate clock.",
    description: "",
    imageUrl: "",
    isMansionClockPuzzle: true,
    solution: "XV:XXXVI",
    category: "pattern",
    hints: [
      "Pay attention to the position of the hour and minute hands throughout the sequence.",
      "Talk to the butler at each stage. He'll tell you the exact time.",
      "Look at how the hour and minute values change from one entry to the next.",
      "Calculate the next position in the sequence, then write the solution using roman numerals.",
    ],
  },
  {
    level: 15,
    question: "",
    description: "",
    imageUrl: "",
    locationImage: "/images/color-palette/color_palette.webp",
    isColorPalettePuzzle: true,
    solution: "Vampire Island",
    category: "math",
    hints: [
      "Use color theory to identify the relationship between colors.",
      "You can add or subtract colors to find the values that are missing.",
      "You can find pink by adding red and white together.",
      "To find green, first find the value for yellow by subtracting red from orange. Then find blue by adding azure and black. Finally, add blue to yellow to get green.",
      "Examine the color palette to find a hidden message.",
      "The message in French says: \"The green and pink hide a secret. Among the numbers, an island awaits discovery.\"",
      "The correct values of green and pink will give you the coordinates of an island in Australia. The name of the island is the solution for this level.",
    ],
  },
  {
    level: 16,
    question: "The butler presents you with a mathematical puzzle involving the mansion's silverware.",
    description: "Can you determine the value of knife + fork + spoon?",
    imageUrl: "/images/puzzle18.webp",
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
    level: 17,
    question: "",
    description: "It's pitch dark.",
    imageUrl: "",
    isLightSwitchPuzzle: true,
    solution: "RANDOM", // This will be overridden by the component
    category: "logic",
    hints: [
      "It's too dark to see anything. But there must be something you can do to shed some light in this room.",
      "There are light switches hidden in the dark. Find the first switch then try different combinations on the others.",
      "Perhaps the position of each lever holds significance beyond just providing light?",
      "A compass needle is not supposed to point West. What happens if you move it 'Up' (clockwise) and 'Down'(anticlockwise)?"
    ],
  },
  {
    level: 18,
    question: "Count Papagalul awaits.",
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
    level: 19,
    question:
      "Find the name of the heir.",
    description: "Discover the identity of a forgotten heir who ruled with a brief yet infamous reign.",
    imageUrl: "",
    isLibraryPuzzle: true,
    libraryData: {
      books: [
        {
          id: "legacy-of-morvane",
          title: "The Dark Legacy of Morvane",
          image: "/images/book-legacy-of-morvane.webp",
          content:
            "They called her the Uncrowned, and the name outlived her by centuries. Her mother died of a wasting fever in the third week of the long rains; her father followed within the year, whether of grief or the same fever no one troubled to record. The High Septon climbed the seventy chapel steps himself, the circlet resting on a cushion of moth-eaten velvet, exactly as custom demanded when both crown-parents lay in the crypt. She looked at it the length of three candle-drips, then sent him back down the stairs.\n\nShe never let the priests set the circlet on her head, not that day nor any after. Three lords offered for her hand that first winter, with gifts of cattle, ships, and verse no one had asked for, and she turned away every one of them; she never took a husband. The old stewards still swear she kept the rejected betrothal rings in a drawer, if only to count them on bad nights.",
        },
        {
          id: "royal-intrigue",
          title: "Royal Intrigue",
          image: "/images/book-royal-intrigue.webp",
          content:
            "Our histories rarely agree on much, but on this they do not quarrel: she shared her name with a woman three generations dead, a powerful ancestress whose portrait still hangs, cracked and smoke-stained, in the east gallery. Whether the naming was an honor or an omen, the maesters never settled, and the argument fills three volumes no one but archivists has read since.\n\nHer reign — if reign is the word for what she held — lasted a single year, no more, before it slipped from her hands entirely. She spent that year, by every account, quarrelling with cousins who thought the seat should have gone to them, and won not one of those quarrels.",
        },
        {
          id: "forgotten-chronicles",
          title: "Forgotten Chronicles",
          image: "/images/book-forgotten-chronicles.webp",
          content:
            "She was the daughter of Princess Aethera, the Forgotten — a woman so thoroughly struck from the official record that even her own daughter appears in the ledgers only as 'issue, female, unnamed.' Whoever ordered that erasure did their work well; we know the daughter ruled, and little else of how she came to it.\n\nShe ruled with an iron fist, though her time at it was brief — brief enough that the court tailors never finished her second set of formal robes. Fear was her instrument, and she used it without apparent regret, for as long as it lasted, which by every surviving account was not very long at all.",
        },
        {
          id: "shadows-of-the-past",
          title: "Shadows of the Past",
          image: "/images/book-shadow-of-the-past.webp",
          content:
            "They called her the Accursed, and not as a figure of speech. No one agrees on why; three separate chroniclers offer three separate catastrophes — a fire, a famine, a death no one would name aloud — and none of the three accounts agree on the year.\n\nOnly this much holds steady across all of them: the name stuck to her like pitch, and it never came loose, not in her lifetime, and not in the two centuries since.",
        },
        {
          id: "lost-heirs",
          title: "Lost Heirs",
          image: "/images/book-lost-heirs.webp",
          content:
            "Prince Marcen was stolen from his cradle one autumn night, by a hand the household guard never identified, and never recovered — not his body, not his bones, not so much as a scrap of the blanket he was wrapped in. They called him the Unseen before he was old enough to earn any other name, which in hindsight reads less like a nickname and more like a prophecy.\n\nHis mother, the Lady Lirien, was known at court as the Deceiver, a title she reportedly found more amusing than insulting. She is said to have laughed, once, when a visiting lord used it to her face, and asked him whether he'd ridden all this way just to flatter her.",
        },
        {
          id: "royal-deceit",
          title: "Royal Deceit",
          image: "/images/book-royal-deceit.webp",
          content:
            "Lord Ryker wed Lirien the Deceiver knowing full well what she was, or so he claimed afterward to anyone who would listen, which by the end of his life was mostly servants and a deaf hunting dog. Their son's disappearance was never solved, and the investigation — such as it was — closed within the season, for want of a single living witness.\n\nHe ruled nothing, in the end; he is a name in a ledger, a few lines in three of these very books, and little more. Some histories are not mysteries so much as wounds the family stopped bothering to dress.",
        },
        {
          id: "fractured-throne",
          title: "The Fractured Throne",
          image: "/images/book-the-fractured-throne.webp",
          content:
            "Both her mother and her father were dead before the end came for her too, and something in her that had held steady through their funerals began, slowly, to give. She kept fewer counsellors, then none at all; she would not be seen for days at a stretch, and when she was seen, the household staff learned to agree with whatever she said, however little sense it made.\n\nThe crown was to be set on her head at dawn, in the same chapel, on the same seventy steps. She did not live to see the sunrise. She took her own life the night before, and so she never wore the circlet, and never answered to the title.",
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
  {
    level: 20,
    question: "The butler leads you into a wing of the mansion lined with the master's art.",
    description: "",
    isMansionMapPuzzle: true,
    solution: "mors et vita in manibus aurigae temerarii|mors et vita in manibus aurigae temerarii.",
    category: "riddle",
    hints: [
      "There are several works of art scattered through this wing, and each one is hiding a piece of the final answer. Look closely at everything, not just the paintings themselves.",
      "Search for jewelry in the mansion's foyer, a very useful item can be used to inspect the artworks more closely.",
      "Pope Gregory's alcove is worth lingering in. Both search the statue and inspect the stone tablet next to it, you will need this info to piece everything together.",
      "Gregory listed the seven deadly sins in order. Note it down for later. Every piece of art in the mansion is linked to one of those sins. Examine each piece carefully, and ask the butler if you need more to go on.",
      "The Ember Room, just west of the foyer, has an artwork hidden somewhere. You are going to need a way to reach it. Three other rooms can be reached from here.",
      "The Green Room and the Drowsing Parlor each contain a painting that can be analyzed for clues using the loupe. See if you can find anything useful while zooming in.",
      "The snake heads in the Flower Room seem connected to some sort of dry watering system, may be worth trying to revive it.",
      "The Banquet Hall, north of the Foyer, hosts multiple useful items for you to pick up. The painting in it can be investigated, but the Loupe alone won't help.",
      "The Stillwater Room, east of Foyer, has a small water fountain and a statue, both hiding something.",
      "Two of the artworks require some cleaning, and one of them wants you to write on it, but you need to find a way to do so without vandalizing it.",
      "There is a golden frog somewhere hungry for something small and shiny.",
      "Regular water won't help with blood stains. Salt can purify, you are going to need something to carry it. But it won't do much for your sins.",
      "Something in the mansion is strong enough to melt gold. But you are going to need a tool to scrape it off.",
      "Nudity should not be allowed in the mansion. Find something to cover the statue in the Stillwater Room. Then, find something to \"trace\" it.",
      "Find a large container to carry water from the fountain to the Flower Room to restore the watering system. Doing this properly will unlock something in another room.",
      "Place the Ladder in the Ember Room to reach high points.",
      "Make sure you have collected the Loupe from the Foyer, the Coin from the Stillwater Room, the Ewer and Charcoal from the Banquet Hall, the Drape from the Drowsing Parlor, the Holy Water from Gregory's Statue, the Ladder from Gregory's Alcove, the Caliche from the Golden Hall (fill it with salt from the chest there), and the Oil Lamp from the Crimson Room.",
      "You should be able to find a hidden piece of text in each art piece. Use the artwork's title, info from the Butler, imagery and room decor to assign each piece to a Capital Sin. Use the order defined in the Stone Tablet to piece together the final solution to this level.",
    ],
  },
]
