// Per-level intro scenes shown once before the puzzle UI mounts. The mentor
// for each zone "speaks" the level's flavor text as a short, click-through
// scene instead of it being dumped as a static paragraph in the puzzle UI.
// Keyed by level number. Every level has an entry; short ones just resolve
// in one or two beats.
export interface LevelIntroScene {
  character: string
  lines: string[]
}

export const levelIntroScenes: Record<number, LevelIntroScene> = {
  // Zone 1: Prison Cell - Skeleton Guard
  1: {
    character: "skeleton",
    lines: [`"There's a secret message hidden somewhere in this cell," the guard rasps.`, `"Find it, if you can."`],
  },
  2: {
    character: "skeleton",
    lines: [`"Fine, let's see if you figure out what to do next," the guard mutters.`, `"Tsk."`],
  },
  3: {
    character: "skeleton",
    lines: [`"Mphf. Let's test your math," the guard grunts, nodding toward the three locks.`],
  },
  4: {
    character: "skeleton",
    lines: [`Scratched into the stone wall: "FEAR YOUR DREAMS."`, `The guard says nothing — he just watches you read it.`],
  },
  5: {
    character: "skeleton",
    lines: [`"Like clockwork," the guard mutters, nodding at the circular markings.`, `"Clockwise. That's the only hint you're getting."`],
  },
  6: {
    character: "skeleton",
    lines: [`"This is Shackles," the guard grunts, nodding at the spectral dog blocking your path.`, `"Feed him right, and he'll let you through."`],
  },
  7: {
    character: "skeleton",
    lines: [`"Mphf. I can't let you go," the guard taunts.`, `"You won't solve this one!"`],
  },
  8: {
    character: "skeleton",
    lines: [`"You think these puzzles are easy? Ha!"`, `"I present you: the magic box."`],
  },
  9: {
    character: "skeleton",
    lines: [`"Heh. Rats," the guard snorts, watching them skitter between the skulls in the dark.`, `"Good luck making sense of that."`],
  },
  10: {
    character: "skeleton",
    lines: [`"An inmate has been murdered, and one of these four did it," the guard says.`, `"Find out who, if you're clever enough."`],
  },

  // Zone 2: Mansion - The Butler
  11: {
    character: "butler",
    lines: [`"These were some of the master's favorite books," the butler explains, gesturing to the shelf.`, `"I myself was particularly fond of 'The Third Eye.' The master said it provided a unique perspective on the other works."`],
  },
  12: {
    character: "butler",
    lines: [`"This belonged to the master's collection of culinary curiosities," the butler explains with a slight bow.`, `"Assemble the pieces to reveal the hidden message."`],
  },
  13: {
    character: "butler",
    lines: [`"I am looking for a spice," the butler murmurs, scanning the shelves.`, `"Must be somewhere around here."`],
  },
  14: {
    character: "butler",
    lines: [
      `"This timepiece has been in the master's family for generations," the butler explains, his gloved finger tracing the numerals on the clock's face.`,
      `"The master was fond of creating sequences with these times. He left this particular sequence unfinished. Can you determine what comes next?"`,
    ],
  },
  15: {
    character: "butler",
    lines: [
      `"This palette belonged to a rather renowned French painter," the butler explains, presenting a curious arrangement of colors.`,
      `"The labels remain in his native tongue. I trust that will not prove an insurmountable obstacle."`,
    ],
  },
  16: {
    character: "butler",
    lines: [`The butler adjusts his bow tie.`, `"I have a mathematical problem for you, if you would be so kind."`, `"The master was quite fond of these little brain teasers. Can you determine the value of knife plus fork plus spoon?"`],
  },
  17: {
    character: "butler",
    lines: [`"It's pitch dark in here," the butler's voice calls out from somewhere in the room.`, `"You'll need to find the switches yourself."`],
  },
  18: {
    character: "butler",
    lines: [`"This is Count Papagalul," the butler says, gesturing to the parrot's cage.`, `"He's quite the conversationalist, though his manners leave something to be desired. Be careful, he bites."`],
  },
  19: {
    character: "butler",
    lines: [
      `"I do hope you are prepared for a challenge," the butler says, gesturing toward the library archive.`,
      `"Before you lies the family tree of the House of Morvane — and its secrets."`,
      `"Somewhere in these records is a forgotten heir. One who ruled briefly, and infamously."`,
      `"The answer lies in the books, and in the tree itself. I trust you have a keen eye for genealogy."`,
    ],
  },
  20: {
    character: "butler",
    lines: [
      `"This wing was sealed for years," the butler says, unlocking a door you hadn't noticed before.`,
      `"The master gathered these pieces over a long and curious life. Each has its own history, if you care to ask."`,
      `"Wander as you please. I will be nearby, should you have questions about what you find."`,
    ],
  },

  // Zone 3: Forest - The Gypsy
  21: {
    character: "gypsy",
    lines: [
      `The gypsy woman leans forward, her eyes gleaming with curiosity.`,
      `"Before I can read your future, I must understand your essence."`,
      `"Answer truthfully — for the cards see through all deception."`,
    ],
  },
  22: {
    character: "gypsy",
    lines: [`She presents you with three cups, each containing mysterious patterns in the coffee residue.`, `"The grounds never lie," she whispers.`],
  },
  23: {
    character: "gypsy",
    lines: [`The crystal ball clouds over, then clears to reveal shifting patterns of light.`, `"I see a distant culture, an ancient zodiac cycle," the gypsy whispers.`, `"Tell me the year and animal I'm seeing."`],
  },
  24: {
    character: "gypsy",
    lines: [`The gypsy woman presents you with fragments of a crystal mosaic.`, `"Reassemble the pieces to reveal the name of a precious stone with mystical properties."`],
  },
  25: {
    character: "gypsy",
    lines: [
      `"These symbols were used by ancient mystics to encode their most powerful secrets," the gypsy explains, her eyes gleaming with excitement.`,
      `"Each shape holds a specific value. Combined, they reveal the key to hidden knowledge."`,
      `"Solve this, and you'll glimpse the numeric code that opens the door to the next realm."`,
    ],
  },
  26: {
    character: "gypsy",
    lines: [`The gypsy woman leads you outside her wagon and points upward.`, `"The stars have much to tell us tonight," she whispers.`, `"Look closely at the heavens. What do you see?"`],
  },
  27: {
    character: "gypsy",
    lines: [`The gypsy woman lays out a collection of tapestries and frames before you, and waits.`],
  },
  28: {
    character: "gypsy",
    lines: [`The gypsy woman presents you with magical crystals and a compendium.`, `"Arrange the seven crystals in their proper sequence, starting from the top and moving clockwise."`],
  },
  29: {
    character: "gypsy",
    lines: [`The gypsy woman goes quiet.`, `She begins to move her hands in a strange pattern, then stops. Her eyes lock with yours, waiting for your understanding.`],
  },
  30: {
    character: "gypsy",
    lines: [`The gypsy woman prepares to give you a tarot reading using the Major Arcana cards.`, `"The final card reveals your destiny," she says.`],
  },

  // Zone 4: Desert - The Sphinx
  31: {
    character: "sphinx",
    lines: [`The Sphinx presents you with ancient symbols carved in stone.`, `"The symbols seem to hold a message from the distant past."`],
  },
  32: {
    character: "sphinx",
    lines: [
      `The Sphinx presents you with a golden scarab and ancient pedestals, speaking in riddles.`,
      `"Guide the sacred beetle along the path of the one whose generosity changed the value of gold itself."`,
      `"Trace the journey of the golden pilgrim who brought splendor to the lands he crossed."`,
    ],
  },
  33: {
    character: "sphinx",
    lines: [`The Sphinx leads you into a dark chamber with ancient inscriptions, then falls silent.`],
  },
  34: {
    character: "sphinx",
    lines: [`The Sphinx presents you with a fragmented mosaic of an ancient deity.`, `"Reassemble it to reveal the identity of the crocodile god worshipped in this region."`],
  },
  35: {
    character: "sphinx",
    lines: [`The Sphinx presents you with a riddle of the sands.`, `"The sands shift to reveal a pattern of symbols that seem to change with the desert winds."`],
  },
  36: {
    character: "sphinx",
    lines: [`The Sphinx presents you with a challenge of construction.`, `"Build a pyramid by moving blocks through the workshops."`],
  },
  37: {
    character: "sphinx",
    lines: [`The Sphinx says nothing, only gestures toward the pillars before you.`],
  },
  38: {
    character: "sphinx",
    lines: [`A strange message appears in the desert sand. The Sphinx gazes at you with ancient eyes.`, `"Ask me, and I shall give you the key to decode this message."`],
  },
  39: {
    character: "sphinx",
    lines: [`The Sphinx presents you with ancient Egyptian mathematical papyri, and waits for you to begin.`],
  },
  40: {
    character: "sphinx",
    lines: [`The Sphinx leads you into a pyramid with multiple chambers.`, `"Explore them to uncover the hidden message."`],
  },

  // Zone 5: Hell - The Devil
  41: {
    character: "devil",
    lines: [`The Devil presents you with a mysterious map of Central Asia.`, `"Pins of the same color are related somehow," he muses.`],
  },
  42: {
    character: "devil",
    lines: [`The Devil challenges you to a game of infernal chess.`, `"Four horsemen. Twenty moves. Let's see if you survive the apocalypse," he grins.`],
  },
  43: {
    character: "devil",
    lines: [`The Devil presents you with five mysterious chests. You can hear screaming inside.`, `"Numbers, old tongue, and a little arithmetic," he says. "Nothing you can't handle."`],
  },
  44: {
    character: "devil",
    lines: [`The Devil presents you with fragments of a haunting scene.`, `"Reassemble the pieces to reveal the name of this infernal transportation."`],
  },
  45: {
    character: "devil",
    lines: [
      `The Devil brings back some familiar faces from your journey, grinning wickedly.`,
      `"I've brought some old friends to help you with this challenge. One of them knows the identity of a lost soul you must name."`,
      `"But be careful who you trust..."`,
    ],
  },
  46: {
    character: "devil",
    lines: [`The Devil invites you to try your luck at his infernal casino.`, `"The house always wins," he chuckles. "Usually."`],
  },
  47: {
    character: "devil",
    lines: [`The Devil gestures toward an infernal machine: dozens of switches connected to what appears to be a human brain — still attached to its head.`, `The owner seems to be in pain.`],
  },
  48: {
    character: "devil",
    lines: [`"The ancient Mouth of Truth is said to bite the hand of those who lie," the Devil says, almost fondly.`, `"Place the correct marbles in the right positions to reveal its secret."`],
  },
  49: {
    character: "devil",
    lines: [`The Devil challenges you to face death, in a sort of murder mystery game.`, `"Find the killer," he says, "before the killer finds you."`],
  },
  50: {
    character: "devil",
    lines: [`The Devil smiles, wider than should be possible.`, `"One final challenge before you may leave... or stay forever."`],
  },
}
