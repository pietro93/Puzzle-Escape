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
    lines: [`"There's a secret message hidden somewhere in this cell," the guard rasps.`, `"Find it, if ya can."`],
  },
  2: {
    character: "skeleton",
    lines: [`"Fine, let's see if ya figure out what to do next," the guard mutters.`, `"Tsk."`],
  },
  3: {
    character: "skeleton",
    lines: [`"Mphf. Let's test yer math," the guard grunts, nodding toward the three locks.`],
  },
  4: {
    character: "skeleton",
    lines: [`Scratched into the stone wall: "FEAR YOUR DREAMS."`, `The guard says nothing. He just watches you read it.`],
  },
  5: {
    character: "skeleton",
    lines: [`"Like clockwork," the guard mutters, nodding at the circular markings.`, `"Clockwise. That's the only hint yer gettin'."`, `For a moment your hands feel wet, as if you have just come in out of the rain. Then the feeling passes.`],
  },
  6: {
    character: "skeleton",
    lines: [`"This is Shackles," the guard grunts, nodding at the spectral dog blocking your path.`, `"Feed him right, and he'll let ya through."`],
  },
  7: {
    character: "skeleton",
    lines: [`"Mphf. I can't let ya go," the guard taunts.`, `"Ya won't solve this one!"`],
  },
  8: {
    character: "skeleton",
    lines: [`"Ya think these puzzles are easy? Hah-hah-hah."`, `"I present to ya: the magic box."`],
  },
  9: {
    character: "skeleton",
    lines: [`"Heh. Rats," the guard snorts, watching them skitter between the skulls in the dark.`, `"Good luck makin' sense of that."`],
  },
  10: {
    character: "skeleton",
    lines: [`"An inmate's been murdered, and one of these four did it," the guard says.`, `"Find out who, if yer clever enough."`],
  },

  // Zone 2: Mansion - The Butler
  11: {
    character: "butler",
    lines: [`"This belonged to the master's collection of culinary curiosities," the butler explains with a slight bow.`, `"Assemble the pieces to reveal the hidden message."`],
  },
  12: {
    character: "butler",
    lines: [`"These were some of the master's favourite books," the butler explains, gesturing to the shelf.`, `"I myself was particularly fond of 'The Third Eye.' The master said it provided a unique perspective on the other works."`],
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
      `There is a mirror behind him. You glance at it the way you would check a rear-view mirror. It shows the room, and nobody standing in it.`,
    ],
  },
  16: {
    character: "butler",
    lines: [`The butler adjusts his bow tie.`, `"I have a mathematical problem for you, if you would be so kind."`, `"The master was quite fond of these little brain teasers. Can you determine the value of knife plus fork plus spoon?"`],
  },
  17: {
    character: "butler",
    lines: [`"It is rather dark in here, I'm afraid," the butler's voice calls out from somewhere in the room.`, `"You will have to find the switches yourself. I would help, but I do enjoy listening to you walk into the furniture."`],
  },
  18: {
    character: "butler",
    lines: [`"This is Count Papagalul," the butler says, gesturing to the parrot's cage.`, `"He is quite the conversationalist, though his manners leave something to be desired. Be careful, he bites."`],
  },
  19: {
    character: "butler",
    lines: [
      `"I do hope you are prepared for a challenge," the butler says, gesturing toward the library archive.`,
      `"Before you lies the family tree of the House of Morvane, and all its secrets."`,
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
      `"Before I read your future, I must know what you are made of."`,
      `"Answer true. Cards see through lies. Also I do."`,
    ],
  },
  22: {
    character: "gypsy",
    lines: [`She sets three cups in front of you. Each has its own pattern in the coffee residue.`, `"Grounds never lie," she says. "People lie. Grounds only gossip."`],
  },
  23: {
    character: "gypsy",
    lines: [`The crystal ball clouds over, then clears to reveal shifting patterns of light.`, `"I see faraway land. Very old zodiac," she says.`, `"Tell me year and animal I see."`],
  },
  24: {
    character: "gypsy",
    lines: [`She tips a cloth bag onto the table. It was a mosaic once.`, `"Put pieces back together. Is precious stone, very magic. You tell me its name."`],
  },
  25: {
    character: "gypsy",
    lines: [
      `"Old mystics hide their secrets in these symbols," the gypsy says, eyes gleaming. "Very clever people. Very bad handwriting."`,
      `"Each shape has its own value. Put together, they make key to hidden knowledge."`,
      `"Solve, and you see number code that opens door to next place."`,
      `The symbols swim if you look at them too long, the way road signs swam once. You don't remember when. You remember the signs.`,
    ],
  },
  26: {
    character: "gypsy",
    lines: [`The gypsy woman leads you outside her wagon and points upward.`, `"Stars are talking tonight," she says. "Inside wagon I cannot hear them."`, `"Look close at the sky. What you see?"`],
  },
  27: {
    character: "gypsy",
    lines: [`The gypsy woman lays out a collection of tapestries and frames before you, and waits.`],
  },
  28: {
    character: "gypsy",
    lines: [`Seven crystals lie on a velvet cloth beside a thick, much-thumbed book.`, `"Seven crystals. Put them in proper order. Start from top, go clockwise."`],
  },
  29: {
    character: "gypsy",
    lines: [`The gypsy woman goes quiet.`, `She begins to move her hands in a strange pattern, then stops. Her eyes lock with yours, waiting for your understanding.`],
  },
  30: {
    character: "gypsy",
    lines: [`The gypsy woman prepares to give you a tarot reading using the Major Arcana cards.`, `"Last card shows your destiny," she says. "No refunds."`],
  },

  // Zone 4: Desert - The Sphinx
  31: {
    character: "sphinx",
    lines: [`Symbols are carved into the stone at the Sphinx's feet. She waits until you have looked at every one.`, `"These signs carry a message from a distant past. Perhaps from thine as well."`],
  },
  32: {
    character: "sphinx",
    lines: [
      `A golden scarab rests beside a row of pedestals. The Sphinx speaks without looking at it.`,
      `"Guide the sacred beetle along the path of the one whose generosity changed the value of gold itself."`,
      `"Trace the journey of the golden pilgrim who brought splendor to the lands he crossed."`,
    ],
  },
  33: {
    character: "sphinx",
    lines: [`The Sphinx leads you into a dark chamber covered in inscriptions.`, `"Read, seeker. The dark will not read them for thee."`],
  },
  34: {
    character: "sphinx",
    lines: [`Broken tiles lie in the sand. Together, they were once a god.`, `"Reassemble it, and name the crocodile god worshipped in this land."`],
  },
  35: {
    character: "sphinx",
    lines: [`The wind moves the sand at your feet. Symbols surface in it, then sink again.`, `Half buried nearby are two sets of footprints. One of them stops.`, `"The desert writes slowly, seeker. Read quickly."`],
  },
  36: {
    character: "sphinx",
    lines: [`Cut stone waits in the sand. The Sphinx looks at the blocks, then at you.`, `"Build a pyramid, mortal. Every block must pass through the workshops."`],
  },
  37: {
    character: "sphinx",
    lines: [`The Sphinx gestures toward the pillars before you.`, `"Stone keeps what it is told. Look well."`],
  },
  38: {
    character: "sphinx",
    lines: [`A message is written in the sand that was not there a moment ago. The Sphinx watches you read it.`, `"Ask of me, and I shall give thee the key to this message."`],
  },
  39: {
    character: "sphinx",
    lines: [`Papyri covered in numbers are weighted down with stones. The Sphinx waits for you to begin.`, `"The scribes of this land counted grain, and days, and the dead. Count, seeker."`],
  },
  40: {
    character: "sphinx",
    lines: [`The Sphinx leads you into a pyramid with multiple chambers.`, `"Explore them all. Not every chamber will be lit for thee."`],
  },

  // Zone 5: Hell - The Devil
  41: {
    character: "devil",
    lines: [`The Devil unrolls a map of Central Asia across a table that was not there a moment ago.`, `"Pins of the same color are related somehow," he muses.`],
  },
  42: {
    character: "devil",
    lines: [`The Devil sets four horsemen on a chessboard and turns it to face you.`, `"Four horsemen. Twenty moves. Let's see if you survive the apocalypse," he grins.`],
  },
  43: {
    character: "devil",
    lines: [`Five chests sit in a row. Something inside them is screaming.`, `"Numbers, old tongue, and a little arithmetic," he says. "Nothing you can't handle."`],
  },
  44: {
    character: "devil",
    lines: [`The Devil empties a box of painted fragments at your feet.`, `"Reassemble the pieces to reveal the name of this infernal transportation."`],
  },
  45: {
    character: "devil",
    lines: [
      `The Devil brings back some familiar faces, grinning. You count them twice. You keep expecting one more: someone you only saw for a second, in the headlights.`,
      `"I've brought some old friends to help you with this challenge. One of them knows the identity of a lost soul you must name."`,
      `"But be careful who you trust. Some of them LIE."`,
    ],
  },
  46: {
    character: "devil",
    lines: [`The Devil invites you to try your luck at his infernal casino.`, `"The house always wins," he chuckles. "Usually."`],
  },
  47: {
    character: "devil",
    lines: [`The Devil gestures toward an infernal machine: dozens of switches connected to what appears to be a human brain, still attached to its head.`, `The owner seems to be in pain.`],
  },
  48: {
    character: "devil",
    lines: [`"The ancient Mouth of Truth is said to bite the hand of those who lie," the Devil says, almost fondly.`, `"Place the correct marbles in the right positions to reveal its secret."`],
  },
  49: {
    character: "devil",
    lines: [`A man has died beside a road, and nobody at the scene much cares who he was.`, `"Find the killer," the Devil says. "Or decide there wasn't one. People usually do."`],
  },
  50: {
    character: "devil",
    lines: [`The Devil smiles, wider than should be possible.`, `"One final challenge. Then you may leave. Or stay. I am very accommodating."`],
  },
}
