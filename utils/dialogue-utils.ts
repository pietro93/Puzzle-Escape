// Define guard dialog lines for level 10 only
export const guardDialogLines = [
  "An inmate's been murdered, and one of these four did it. Who's the killer?",
  "Oh, *ya* think yer gonna figure this out? Cute.",
  "Don't bother lookin' at me. I wouldn't know a thing about it. Even if I did see it. Which I didn't.",
  "Go on, ask 'em yer questions. Honest, law-abidin' folk, the lot of 'em. Hah-hah-hah.",
  "Don't worry, I'm on yer side. Hah-hah-hah.",
  "Hurry up. I've got all eternity. Ya don't.",
  "The victim? Won't be needin' their kneecaps anymore. Or anythin' else. Hah-hah-hah.",
  "I'd give ya a hand, but I already ate it. Went straight through me. Hah-hah-hah."
]

// Add a specific sphinx riddle for level 38
export const sphinxRiddle = "What has a bed, a mouth, banks, and a crystal clear body?"

// Level 14 (Mansion Clock) — the time the butler reads out matches the clock's actual hand position, never random
export const clockTimeSequence = ["III", "XII:IX", "XXI:XVIII", "VI:XXVII"]

// A couple of remarks per step, so re-interacting at the same step before advancing doesn't
// always show the identical line. The final entry is the "shuts down" state (clockStep 4),
// where the hint is deliberately softer — noticing the pattern rather than stating it.
const clockButlerRemarksByStep: string[][] = [
  [
    "One might say this puzzle requires a certain punctuality in thought.",
    "Do take your time. It is, after all, the one thing I cannot polish back into existence.",
  ],
  [
    "Roman numerals possess a dignity one does not often find today.",
    "I have dusted this clock for longer than I care to admit. It has never once kept me waiting.",
  ],
  [
    "Time reveals all, especially those who underestimate it, I assure you.",
    "Tick by tick, kind guest. Some things in this house are far less patient than I am.",
  ],
  [
    "Curious. It always seizes up at precisely this hour. Every single time.",
  ],
]

// Tracks which remark to show next for each step, so repeated clicks cycle rather than repeat.
const clockRemarkCycle: Record<number, number> = {}

export const getClockButlerLine = (step: number): string => {
  if (step <= 0) {
    return "The mechanism awaits your hand upon the lever."
  }
  const index = Math.min(step, clockTimeSequence.length) - 1
  const time = clockTimeSequence[index]
  const options = clockButlerRemarksByStep[index]
  const cycle = clockRemarkCycle[index] ?? 0
  const remark = options[cycle % options.length]
  clockRemarkCycle[index] = cycle + 1
  return `${time}. ${remark}`
}

// Level 20 (Mansion Gallery) — butler commentary keyed by room, not level.
// Two separate pools per room: "ambient" fires while the player is merely
// standing in the room, "examining" fires only once the player has opened
// a piece's full inspector view. Never overlap the two — ambient lines must
// stay pure scene-setting (no story, no theme) so they can't be mistaken for
// hints about what's hidden in the art; examining lines carry the real
// art-historical content once the player has actually chosen to look closer.
const mansionAmbientLines: Record<string, string[]> = {
  foyer: [
    "That compass rose worked into the rug has guided guests since before my time here.",
    "The suit of armor by the stairs has not moved in decades, though I still greet it out of habit.",
  ],
  foyerAnnex: [
    "This end of the hall catches rather less light than the other.",
    "The staircase from here always feels steeper than it looks.",
  ],
  gregory: [
    "That wolf carved into the sconce has watched over this alcove longer than any butler has.",
    "The stonework in this alcove took the masons the better part of a year, or so the master claimed.",
    "The tablet's reckoning of sin is older than the one you'd hear preached today. A few of those names have drifted rather far from their origins.",
    "Tristitia, the tablet calls it there. What we now call sloth was once mourned as a species of sorrow, or so I understand.",
  ],
  gregoryAnnex: [
    "That archway leads nowhere pleasant, as far as I am concerned.",
    "The little stone angel on the banister has lost most of her nose to the years.",
  ],
  invidia: [
    "The wolves carved into this paneling were the master's own touch, added long after the house was built.",
    "That lamp above the frame has never once gone out, to my knowledge.",
  ],
  ivan: [
    "The desk in this study has not been used for correspondence in longer than I can say.",
    "That candle on the desk burns rather low. I really ought to replace it.",
  ],
  narcissus: [
    "That pool at your feet has never once frozen, even in the coldest months.",
    "The ironwork on these walls took a blacksmith the better part of a decade, or so I am told.",
  ],
  thesin: [
    "Those carved serpents in the panel doors have unsettled more guests than I can count.",
    "The staircase through that door leads down further than most care to explore.",
  ],
  desidia: [
    "That chair has held up rather better than most of the furniture in this house.",
    "The window here looks out over the grounds, on the rare clear night.",
  ],
  saturn: [
    "This hall has not hosted a proper dinner in longer than I care to admit.",
    "That fireplace has sat cold for years, though the chairs remain set as if for guests.",
  ],
  mammon: [
    "Every surface in this room was gilded by hand, guest and gold leaf both, or so the master liked to say.",
    "Those carved heads flanking the frame have watched this room longer than anyone currently living.",
  ],
}

const mansionExaminingLines: Record<string, string[]> = {
  gregory: [
    "Pope Gregory set pride above the others entirely, as the root every sin grows from. A comfort, kind guest. It means the rest of us are merely branches.",
    "The Master left the cracks in the alabaster exactly as he found them. He held that a flaw honestly shown is worth more than a repair. I have tried to extend the same courtesy to you.",
    "Gregorian chant is named for him. I play it on Sunday mornings to drown out the household. It has never once worked.",
    "He wrote at length on pride for the instruction of the powerful. I have served the powerful for many years. They did not read it.",
  ],
  narcissus: [
    "I would not presume to judge another man's mirror, kind guest. Narcissus fell in love with his own reflection and wasted away beside it. I notice you have not once looked at yours.",
    "John Gibson carved him in marble and presented him to the Royal Academy. I am told the Academy admired him almost as much as he admired himself.",
    "The ancients told his story with rather more affection between young men than the Victorians cared to discuss. I shall say no more, kind guest. You look as though you would rather I didn't.",
    "Vanity was a sin long before mirrors were cheap. Now anyone can afford one. Even, I suspect, you.",
  ],
  invidia: [
    "Look at her ear, kind guest. Giotto made it enormous, the better to hear every unkind word about the neighbours. My own hearing is also excellent.",
    "Enrico Scrovegni paid for the chapel this fresco lives in, largely so that his father, a notorious usurer, might be forgiven. Money cannot buy salvation, I am told. It can, however, buy a very good painter.",
    "She clutches at the air with a claw for a hand, and stands in fire she does not seem to notice. I have met several such persons at the Master's dinners.",
    "Giotto gave Envy a serpent that leaves her own mouth and turns back to bite her eyes. A warning against speaking ill of others, kind guest. I, of course, would never.",
  ],
  ivan: [
    "Repin painted the moment after, kind guest. The Tsar struck his son in a fit of rage and now holds him, too late. I find most tempers end that way.",
    "The canvas has been attacked twice, once with a knife and once with a metal post. Some people cannot look at anger without joining in.",
    "Look at the Tsar's eyes. A man who has just understood what his own hands have done. You may recognise the expression, kind guest. Or perhaps not yet.",
    "Repin meant it as a warning to the autocrats of his day, and for a time it was banned from exhibition. The autocrats, I gather, received the message.",
  ],
  desidia: [
    "Bruegel drew Sloth asleep on a donkey while demons do all the work around her. I confess the arrangement has its appeal, kind guest.",
    "Note the giant hand on the clock, near the eleventh hour. Everyone in the picture has time to repent, and nobody is getting up to do it.",
    "His drawings were engraved and sold in great numbers in Antwerp. A sermon against idleness that made somebody a great deal of money. One does admire a man who works.",
    "The old reckoning called it sorrow before it called it sloth. A weariness of the soul. You have looked tired since you arrived, kind guest. I simply mention it.",
  ],
  mammon: [
    "Watts dedicated it to Mammon's worshippers, kind guest, which I always felt was rather pointed. He hoped they would recognise themselves. Mostly they admired the frame.",
    "Scarlet and gold, and a lap full of money bags. Watts meant to shame the rich of London. They hung it in a gallery and went to lunch.",
    "Some call it thrift. Watts did not. I mention it only because you have not yet tipped me.",
    "Watts gave Mammon the ears of an ass and put two young people beneath his hands. He crushes them without once looking down. One so rarely does.",
  ],
  saturn: [
    "Goya painted this directly onto the wall of his own dining room, kind guest. I have never dared ask what he served.",
    "Saturn ate his children so that none of them could replace him. A hunger that has nothing to do with the stomach. Certain guests remind me of it at dinner.",
    "Look at the eyes. Not a god enjoying his meal, kind guest. A creature that cannot stop.",
    "Goya was entirely deaf by then, and painted for no one but himself. I do wish our guests were as considerate of the silence.",
  ],
  thesin: [
    "Von Stuck built the gilded frame himself, like an altar, and set it in his own house. I would not presume to say what he worshipped there, kind guest.",
    "Her eyes find you from the dark. Most guests find this flattering. I would not, in your position.",
    "The serpent lies across her shoulders like a fur. Temptation, dressed for the evening. I keep this room cool for a reason.",
    "It made von Stuck famous. He painted it again and again, by popular request. Scandal is so often a form of admiration.",
  ],
}

// Cycles through a room's pool so repeated clicks don't repeat the same line
// twice in a row, same convention as clockRemarkCycle above.
const mansionLineCycle: Record<string, number> = {}

export const getMansionButlerLine = (room: string, examining: boolean): string => {
  const pool = (examining ? mansionExaminingLines[room] : mansionAmbientLines[room]) ?? mansionAmbientLines[room]
  if (!pool || pool.length === 0) {
    return "Nothing of note here, I'm afraid."
  }
  const key = `${examining ? "examining" : "ambient"}:${room}`
  const cycle = mansionLineCycle[key] ?? 0
  const line = pool[cycle % pool.length]
  mansionLineCycle[key] = cycle + 1
  return line
}

// Level 12 (Bookshelf Chronology Puzzle) — the butler's line depends on
// whether the shelf order is still unsolved or the window light has already
// revealed itself, not on a single level-wide pool.
const bookshelfButlerLinesBefore: string[] = [
  "I dust these shelves daily. The Master was most particular about the order of things.",
  "Do mind the spines, kind guest. Bending them is nothing short of barbarism.",
  "Every volume knows its place, if one bothers to consult the plaques below.",
  "First editions once bore their year plainly on the spine. This shelf extends you no such courtesy.",
  "Do you read, {{sir|madam|guest}}? Menus count, I suppose.",
]

const bookshelfButlerLinesAfter: string[] = [
  "The third eye, in certain traditions, sees what the other two cannot. Make of that what you will.",
  "The answer was never hidden, kind guest. It merely waited for you to look properly.",
  "Every title holds more than its story, should one read closely enough.",
]

const bookshelfLineCycle: Record<string, number> = {}

export const getBookshelfButlerLine = (revealed: boolean): string => {
  const pool = revealed ? bookshelfButlerLinesAfter : bookshelfButlerLinesBefore
  const key = revealed ? "after" : "before"
  const cycle = bookshelfLineCycle[key] ?? 0
  const line = pool[cycle % pool.length]
  bookshelfLineCycle[key] = cycle + 1
  return line
}

// Level 2 (Bone Counting Puzzle) — optional, undiscoverable-by-UI interaction:
// dropping a bone on the guard's portrait. Rust bones are his own and he keeps
// them; any skull colour gets a colour-specific brush-off and stays in the pile.
const guardRustBoneLines: string[] = [
  "Mphf. Mine now.",
  "Rusty. Just how I like 'em.",
  "Ya found the ones nobody wanted. Fittin'.",
  "Don't expect a thank ya.",
  "Into the collection. Yers are next.",
  "Hah-hah-hah. Ya fetch like a dog.",
]

const guardRustBoneFinalLine = "That's all of 'em. Now go count, before I start collectin' yers."

const guardWrongBoneLines: Record<string, string[]> = {
  white: [
    "White? Do I look like I've got any shine left?",
    "Put it back. Yer as color-blind as ya are slow.",
  ],
  purple: [
    "Purple's not mine. Use yer eyes.",
    "Tsk. Does that look like it came off me?",
  ],
  orange: [
    "Orange. Not mine. Not ever.",
    "Mphf. Wrong bone. Keep tryin', I'm enjoyin' this.",
  ],
  black: [
    "Black's not mine either. Keep guessin'.",
    "Hah-hah-hah. Ya think I'd take any old bone?",
  ],
}

const guardWrongBoneCycle: Record<string, number> = {}

export const getGuardBoneLine = (color: string, rustReturned: number, rustTotal: number): string => {
  if (color === "rust") {
    if (rustReturned >= rustTotal) return guardRustBoneFinalLine
    return guardRustBoneLines[(rustReturned - 1) % guardRustBoneLines.length]
  }
  const pool = guardWrongBoneLines[color] ?? guardWrongBoneLines.white
  const cycle = guardWrongBoneCycle[color] ?? 0
  guardWrongBoneCycle[color] = cycle + 1
  return pool[cycle % pool.length]
}

// Answer feedback, voiced by the zone's host. Plain text (no ~foreign~ markup):
// the feedback line is not rendered through DialogueText. Never hint at answers.
const answerFeedbackLines: Record<string, { correct: string[]; wrong: string[] }> = {
  skeleton: {
    correct: ["Mphf. Lucky.", "Fine. Ya got it. Don't let it go to yer head.", "Tsk. Correct."],
    wrong: ["Wrong. Hah-hah-hah.", "Nope. Try again, genius.", "Hah-hah-hah. Not even close."],
  },
  butler: {
    correct: ["Correct. I am as surprised as you are.", "Quite right. Do sit down before you strain something.", "Correct, kind guest."],
    wrong: ["Regrettably, no.", "Not quite. Do try again.", "I would never presume to say you were wrong. You are, however."],
  },
  gypsy: {
    correct: ["Correct! Cards are surprised also.", "Yes! See? You have little bit of gift.", "Correct. I knew. I always know."],
    wrong: ["No. Cards say try again. Cards are polite today.", "Wrong. Is fine. Everybody is wrong first time. And second.", "No. Try again, bre."],
  },
  sphinx: {
    correct: ["Thou hast answered well.", "Correct, seeker.", "So it is."],
    wrong: ["That is not the answer.", "No, seeker. Again.", "The scales do not move. Try again."],
  },
  devil: {
    correct: ["Correct. How DISAPPOINTING.", "Well done. I suppose.", "Right. Don't get comfortable."],
    wrong: ["WRONG. How delightful.", "Wrong. Do it again. I'm enjoying this.", "No. Take all the time you need. I have eternity."],
  },
}

export const getAnswerFeedback = (level: number, correct: boolean): string => {
  const host = level <= 10 ? "skeleton" : level <= 20 ? "butler" : level <= 30 ? "gypsy" : level <= 40 ? "sphinx" : "devil"
  const pool = correct ? answerFeedbackLines[host].correct : answerFeedbackLines[host].wrong
  return pool[Math.floor(Math.random() * pool.length)]
}

// Level 50 elevator, one pool for every ride
export const getRandomElevatorMessage = (): string => {
  const messages = [
    "The floor indicator has more numbers than the building has floors.",
    "The elevator drops, then seems to remember it is meant to be descending politely, and slows down.",
    "Somewhere below, someone is screaming. The elevator music does not acknowledge it.",
    "It gets warmer with every floor. You stop leaning on the walls.",
    "The doors open on a different smell each time. None of them are good.",
    "There is a button for the ground floor. Someone has painted over it.",
    "The lights flicker. When they come back, you are standing slightly closer to the doors.",
    "The elevator groans, as if it has opinions about where you are going.",
    "Your ears pop. Then they pop again, in a direction ears should not pop.",
    "A certificate of inspection hangs on the wall. It is signed by the Devil, and dated tomorrow.",
    "The mirror on the back wall shows the inside of the elevator. It does not show you.",
    "The cables sound tired.",
  ]
  return messages[Math.floor(Math.random() * messages.length)]
}

// Define level-specific dialogue for each character
const levelDialogue: Record<string, Record<number, string[]>> = {
  
skeleton: {

    1: [
    "Mirrors show hard truths. Like the fact that yer ugly.",
    "Stare longer. Maybe yer face will make sense.",
    "Tsk. Yer starin' at failure. It wears yer face well.",
    "Ya came all this way to admire yerself? Mphf.",
    "First puzzle and already stuck? My ribs are rattlin' with amusement.",
    "Smoke goes right through me. Wanna see? Come closer. Closer.",
    "Stare all ya like. That face ain't gettin' any better."
    ],

    2: [
    "Countin' bones. I count mine every night. Always come up a couple short. Ya didn't pinch any, did ya?",
    "Yer fingers tremble and make countin' harder. Are ya *beggin'* me to break 'em?",
    "I kept a ledger of who owned these. They all ended up here just like ya.",
    "The last prisoner who took this puzzle ended up becomin' part of the exhibit.",
    "These are spares. I keep mine in the freezer.",
    "My ribs are better organized than yer thoughts.",
    "I collected these from the previous occupants. They would want ya to have them."
    ],

    3: [
    "Math: the universal language of sufferin'. And yer failin' the alphabet.",
    "I solved this with no brain at all. Don't tell me yer stuck.",
    "Countin' on yer fingers? I've got a jar full of 'em if ya run out.",
    "Hah-hah-hah. The solution is *sufferin'*.",
    "Numbers don't lie. Neither do I. Much."
    ],

    4: [
    "Hah-hah-hah. Dreams? Here, we call those delusions.",
    "The alphabet's against ya. Believe me.",
    "Tsk. Ya sleep? Sleep is a luxury for the hopeful.",
    "Yer nightmares are my favorite bedtime stories.",
    "Haven't dreamed in centuries. Yer face might fix that.",
    "Sleep tight. I'll be right here when ya wake up. *If* ya wake up."
    ],

    5: [
    "Tick. Tock. Yer coffin's gettin' cold.",
    "Hey. Stop wastin' everyone's eternity with yer slowness.",
    "The clock keeps score. Yer losin'.",
    "The hands of that clock are countin' down to somethin' ya will not survive.",
    "Some days I can't remember if I'm dead or just really, really bored. Yer guess is as good as mine.",
    "Bricks and stones may break my bones, but I can also break yers."
    ],

    6: [
    "Meet Shackles. All bone, no flesh, just how I like company.",
    "Tried eatin' him once. Bone on bone, no good. Yer much meatier.",
    "Feed him right and he might not tear yer hand off. Might.",
    "Mphf. Shackles is pickier than I am about his meals.",
    "Give him the wrong bone and he'll spit it right back at ya."
    ],

    7: [
    "Heh. LIFE to DEATH. I can help ya skip a few steps.",
    "Yer logic has more gaps than my ribcage.",
    "Change HOPE to NOPE in one move. Congrats, yer doomed.",
    "HATE becomes FATE becomes... nah. Figure it out yerself.",
    "Mphf. Word games are for children and fools. Thought ya might like this one."
    ],

    8: [
    "This puzzle is unsolvable. Just like yer problems.",
    "Mphf. Even I don't know the answer. Isn't that wonderful?",
    "This puzzle has broken minds harder than yers. They tasted much better, too.",
    "I think randomly smashin' the pieces might actually work. Try it.",
    "Guessin' already? That was quick.",
    "Tsk. Arrange 'em at random. Ya'll get it eventually. Few hundred years. I can wait.",
    "C'mon, I'm bored. Give up already.",
    "Ah, yer gettin' tired. Good.",
    ],

    9: [
    "I skewer three of 'em at a time. Roast nicely over the brazier, they do.",
    "Squeak all ya want. I've heard sweeter music from a rat on a spit.",
    "Named that fat grey one after a warden I outlived. Tastes about the same too.",
    "Mphf. Nothin' pairs better with stale bread than a well-charred tail. Goes right through me, but the taste lingers.",
    "Oh, ya want my help? That's adorable. Tsk.",
    "Careful with the plump ones. They bite back right up till they're dinner.",
    "I wonder what sound *yer* bones will make when I finally get to play with them.",
    "Hah-hah-hah. Ya squirm just like they do, right before the skewer."
    ]

  }
,
butler: {
  11: [ // Assembly Puzzle / Box (escargot)
    "Trial and error is a method, of sorts. You appear to have mastered the second half.",
    "I have polished these pieces weekly for thirty years. I trust you will handle them with care.",
    "Assembly is a matter of order, a concept apparently elusive to some.",
    "I would offer to help, but I should hate to rob you of the achievement. Such as it is.",
    "The Japanese mend broken bowls with gold and call the scar beautiful. I fear the gold would be wasted on you."
  ],
  // 12 (Bookshelf Chronology Puzzle) uses getBookshelfButlerLine above, not this table.
  13: [ // Exotic Spices Puzzle
    "The Master took something exotic with every meal. You, I suspect, take ketchup.",
    "Saffron is the stigma of a crocus, picked by hand, some hundred and fifty flowers to the gram. I would ask you not to touch it, but I see I am too late.",
    "Nutmeg was once worth more than gold. The Dutch handed over Manhattan to keep an island of it.",
    "Nutmeg by the spoonful is a hallucinogen. I suspect you would go positively nuts for it, pardon the pun.",
    "A guest once mistook cumin for cinnamon. They were not invited back."
  ],
  // 14 (Mansion Clock Puzzle) uses getClockButlerLine / clockButlerRemarksByStep above, not this table.
  15: [ // Color / Pigment Puzzle
    "I do hope your eyes serve you better than your instincts thus far.",
    "Scheele's green was made with arsenic and papered half of Victorian England. It poisoned guests slowly, in their own beds. I took the liberty of papering your room in it.",
    "Tyrian purple took some ten thousand sea snails to the gram and was reserved for emperors. A commoner caught wearing it could lose his head. I mention this for no particular reason.",
    "I do hope you possess a basic grasp of colour theory. It would be most unfortunate otherwise.",
    "The painter labelled every hue in French. A rather stubborn habit of his countrymen, I find.",
    "Do not fret over the language, kind guest. Colour, unlike vocabulary, requires no translation.",
    "I confess my own French extends little beyond ordering wine. Yours, I suspect, extends little beyond the fries."
  ],
  16: [ // Silverware / Math Puzzle
    "The silver is sterling, polished daily and counted nightly. I shall be counting it *again* after you leave.",
    "Do be careful. The tarnish of a single fingerprint takes ages to buff out.",
    "Cutlery is used from the outside in, {{sir|madam|guest}}. I mention it in case you were planning to use your hands.",
    "The Victorians kept a separate fork for oysters, sardines and ice cream. I'm afraid you will have to make do with one fork, and supervision.",
    "I would never presume to correct a guest's table manners. I shall simply watch them."
  ],
  17: [ // Light Switch & Compass Puzzle
    "Ah, light. A considerable improvement. Your fumbling in the dark was quite audible.",
    "The Master was fond of navigational instruments. This one, however, appears to have lost its bearings. It insists on pointing West.",
    "Nyctophilia is a fondness for darkness. I myself am a devoted practitioner.",
    "The Chinese of the Han Dynasty used the compass for fortune-telling. Navigation came later. You appear to be using it for neither.",
    "Lost, kind guest? Do not worry. Nobody here is expecting you home."
  ],
  18: [ // Parrot Puzzle
    "Count Papagalul has endured through generations with unusual vitality.",
    "The Count possesses a rather colourful vocabulary. The Master found it endlessly amusing. Myself, not so much.",
    "Kind guest, please exercise extreme caution in his presence. His bite lacks discretion.",
    "He tends to repeat things he overhears. I would be mindful of what you say.",
    "The Count dislikes nearly every guest. In your case, I share his view.",
    "Whatever the Count has told you about me, I would remind you that he is but a bird."
  ],
  19: [ // Library / Family Tree (heir) Puzzle
    "Every noble family tree is half fact and half flattery. This one leans toward flattery.",
    "The Habsburgs married their cousins until the jaw became hereditary. Charles the Second could barely chew.",
    "One must admire the care taken to conceal certain family affairs.",
    "Some branches of the family tree were deliberately pruned. For the health of the whole.",
    "I would ask after your own family, but I suspect you no longer remember them."
  ]
  // 20 (Mansion Gallery Puzzle) uses getMansionButlerLine / mansionAmbientLines / mansionExaminingLines above, not this table.
},
  gypsy: {
    21: [
      "Tell me your truth. The spirits, they listen, yes?",
      "Answer fast. First answer is true one. Second answer is lawyer.",
      "Everybody lies to Gypsy. Is fine. I charge extra.",
      "I see your ~baht~. Is very bendy road. Who builds road like this? Drunk man.",
      "Why you sit like you still wear seatbelt? Relax, ~bre~.",
      "Don't whistle in my wagon! Whistling calls the Devil. I have enough problems.",
      "You think you know yourself? Ha! I know you better already, and I only see your shoes.",
      "Secrets are like stone in shoe. You can walk, but you walk funny."
    ],
    22: [
      "I am ~drabarni~, I read cups. Tasseomancy, you call it. Coffee makes me run. To the nearest toilet, usually.",
      "Turn cup three times, toward you. Away from you is for people who want bad news.",
      "Last week I see a horse in cup. Man says is duck. We argue one hour. He never pays.",
      "Bad luck if you spill. Very worse if you spill on my carpet.",
      "Some see stains. Wise ones see stories. You? You have stain face.",
      "I feel storm coming. Or is my stomach. With me, hard to say, ~va~?",
      "Cup is like face. After forty, everything shows.",
      "This coffee, it rumbles my belly like thunder. *Uf*. So much gas."
    ],
    23: [
      "Stars sing same song everywhere. But every land, it changes the words, yes?",
      "Twelve animals, twelve years. I am Rat. Everybody says this explains a lot. Rude, but true.",
      "My favorite animal? I had a pig once. Jambon, I call him. Such a good boy. Everybody says he tastes delicious. Joke! Mostly.",
      "Different country, different animals. Same year, different face. Like me after coffee. Not a good face.",
      "Your phone knows where you are. My ball knows where you should be. Big difference.",
      "This year remembers big change. For you. *Heh*. Don't ask. Is extra.",
      "My second husband, very faithful man. Is why he is still alive and not in well.",
      "Some signs bring luck. Some bring ~bibaht~. You bring mostly questions."
    ],
    24: [
      "Crystals hold old power. Like ~baht~, but fits in pocket.",
      "Each piece wants to go home. You also, I think. Too bad.",
      "You look broken too, ~bre~. Maybe pieces help. Maybe not. I am psychic, not doctor.",
      "This rose quartz? Very nice for comfort. For lonely night. Don't ask how I know. *Heh*.",
      "My grandmother made mosaic from broken plates. Plates were broken on my grandfather.",
      "This stone remembers everything. Even betrayals. Like me. My first husband learned this. In the well.",
      "Careful, edges are sharp. Blood on the pieces is bad luck. Also I must clean.",
      "Put pieces fast. Stone gets bored. Bored stone, very bad energy."
    ],
    25: [
      "Shapes speak. Numbers sing. But I don't trust numbers. Numbers took my money in casino.",
      "Once I predict my first husband live to hundred. Next week he 'falls' in well. Still alive down there, so maybe I am right.",
      "Old secrets hide in symbols. Like my grandmother's soup. She dies, soup dies with her. Math survives. Unfair.",
      "Simple? Ha! Nothing is simple. Not even ~sarma~. Three days to make, ten minutes to eat.",
      "Geometry is old language. Pyramid men speak it. I speak a little. Mostly I nod.",
      "Find balance, or face chaos. Me, I choose chaos. Is cheaper.",
      "You count with fingers? Good. Fingers never lie. Calculators lie. Casinos also.",
      "Your ancestors knew these shapes before they knew letters. You know letters. Is something."
    ],
    26: [
      "Look up. Sky tells stories. Much better than your glowing screen.",
      "Don't point at stars with finger! ~Ptu, ptu.~ Now you wait for wart.",
      "My grandmother says every star is somebody who died owing money. Is why they don't come down.",
      "This pattern has a name. Very old name. Sky people were not good at drawing.",
      "People are sheep with wolf teeth. Mostly they bite themselves.",
      "Sailors follow these. Some arrive. Some become fish food. Stars don't give refund.",
      "Men want to fly to stars now. ~Devla~. They can't even find their keys.",
      "Find the shape. Connect dots. Like children's book, but children's book has answers in back."
    ],
    27: [
      "Twelve signs, everybody says. Some say more. Nobody asks Gypsy. I know there are more.",
      "This season, it hides a sign. A hidden one. Very shy, like me at weddings. I am not shy. I lie.",
      "You are what, Scorpio? You have Scorpio face. Is not compliment.",
      "The heavens keep order. My wagon, no. Don't open the cupboards.",
      "Your heart is in tune with stars? No? Is fine. Stars also are not in tune. They pretend.",
      "Frames and tapestries. I weave these myself. Very slow hands. Very fast tongue.",
      "Your path twists like Romani dance. Two steps forward, one step back, then everybody drinks.",
      "Secrets hide in plain sight. Right there, in the thread. ~Haide~! Even my goat would see it, and my goat is blind."
    ],
    28: [
      "Crystals hum, if you listen. I don't listen. I talk. Is my gift.",
      "Right order opens power. Wrong order opens headache. I know, I tried.",
      "These stones remember many hands. Some hands, very dirty. I don't say whose.",
      "Some stones sing together, like at wedding. Some scream, like my first husband in the well.",
      "Harmony is fragile. Like crystal ball when I drop it. Which is often. ~Devla, Devla~.",
      "Stones don't like to be pushed. My first husband also didn't like. Too late now.",
      "This one is mischievous stone. Like child with shiny things. It likes to roll away and hide. Watch it.",
      "Amethyst is for sleep. I need big one. My blood is mostly espresso, and I don't even drink."
    ],
    29: [
      "*She taps two fingers on her lips, then points at her hands.*"
    ],
    30: [
      "Cards show your ~baht~. Is written. I only read, I don't write. Don't blame me.",
      "Upright is joy. Reversed is trouble. Turn your head if you must, ~bre~, nobody watches.",
      "Empires fall like cards. Towers also. You know about towers, I think.",
      "Choices have echoes. Yours, very loud echo. I hear it from here.",
      "You think you are done? ~Shaj~. Road is still long, and road is hot. Bring water.",
      "End of one road, start of new one. I would give you coffee for the road, but coffee is my enemy.",
      "Did you learn something, or you just pass through? Cards know. They see sand in your soul.",
      "Last card, it is about your future. Be ready. You walk toward a burning place. *Heh*."
    ]
  },
  sphinx: {
    31: [
      "These signs were old when the first of thy words was young.",
      "The hands that built the pyramids wrote these signs. The signs have outlasted the hands.",
      "Each picture is also a sound. Look, and then listen.",
      "Each sign holds more than it shows, seeker. So dost thou.",
    ],
    32: [
      "Each dawn the scarab rolls the sun out of the dark. Each dawn it must be done again.",
      "There was once a king whose gold made gold worthless. Follow him.",
      "A pilgrim returns to where he began, but he does not return the same.",
      "The scarab was laid upon the hearts of the dead. Ask thyself why.",
    ],
    33: [
      "The dark hides nothing from those who carry fire. For a while.",
      "Light is temporary. Darkness is eternal.",
      "What was sealed in the dark was sealed there for a reason.",
      "What is written in darkness can only be read in light. And only for a moment.",
    ],
    34: [
      "The crocodile god watches from the depths of the Nile.",
      "On the river, the crocodile was feared. In the temple, he was worshipped. Both were wise.",
      "Broken things keep their secrets until they are made whole.",
      "The old gods sleep. Do not mistake sleep for death.",
    ],
    35: [
      "The desert deceives the eye and parches the tongue.",
      "What thou seest may not be. What is, thou mayest not see.",
      "The sun bends all that it touches. The truth also.",
      "The sands shift, and what they showed thee is gone. Was it ever there?",
    ],
    36: [
      "No monument was raised in a day, seeker. Nor in a single move.",
      "Pharaohs built toward the sky to reach the afterlife. Thou art nearer to it than they ever were.",
      "The great may carry the small. Never the reverse.",
      "These stones were laid by the light of stars that still watch over them.",
    ],
    37: [
      "A city may wear many names. Its stones remember the first.",
      "A god may be known by his face, his name, or his sign. Here, only the sign is given.",
      "Names hold power in the ancient tongue. That is why some were chiselled away.",
      "Kings follow kings as night follows day. Place them so.",
    ],
    38: [
      "Messages hidden in sand wash away with the next wind.",
      "Priests wrote their secrets so that only the patient could read them. Art thou patient?",
      "Water flows like knowledge, seeking the lowest point.",
      "Ask the right question, receive the true answer.",
    ],
    39: [
      "Every sign on these scrolls stands for something. Here, it stands for a number.",
      "The staff, the ring and the pillar each have their worth. Learn one, and the others follow.",
      "The eye sees fractions of the whole truth.",
      "Equations balance like Ma'at's scales of justice.",
    ],
    40: [
      "Some chambers are dark because no one was meant to see them. Others wait for light.",
      "Light reaches the deepest chamber only when a god allows it.",
      "These walls show the road of the dead through the underworld. Does it look familiar?",
      "Some chambers were sealed to keep the living out. Others, to keep something in.",
    ],
  },
  devil: {
  41: [
    "Maps are just stories people tell themselves about territory they don't own.",
    "All roads lead to Rome. Or, well... to here in hell, with me. Ha!",
    "Geography is just politics with better maps.",
    "Every map is a list of places people tried to be instead of here. They all arrive EVENTUALLY.",
    "I keep one entry in my ledger that I cannot close. Remind me to show you."
  ],

  42: [
    "I've played this game longer than your civilization has existed.",
    "The Horsemen are such reliable employees. Pestilence always clears the board for War.",
    "Twenty moves to orchestrate the apocalypse. I could do it in one, but I appreciate the theater.",
    "I choreographed the apocalypse itself; your moves are merely a curtain call."
  ],

  43: [
    "Theology and mathematics. Both systems designed by people who needed meaning.",
    "Mathematics is the art of pretending to understand the world around you.",
    "Your scriptures speak of divine judgment? How well do you know your Bible?",
    "Feeling sorry for them? These were horrible humans or they would have not ended up here.",
    "What? Did you think being in the Church grants you access to heaven? Ha! These souls belong to me."
  ],

  44: [
    "Many artists have glimpsed my domain in their nightmares.",
    "Painters throughout history have tried to warn you. Their visions were accurate, if anything, understated.",
    "Horror and beauty dance together in the best nightmares. I'm quite the artist myself.",
    "Madness is just clarity with better lighting. Artists understand this.",
    "Some souls see my realm in fever dreams and spend their lives trying to paint it. They never quite capture the smell."
  ],

  45: [
    "You seek a single soul among millions? Like hunting for needles in a haystack.",
    "Consult the Skeleton Guard if you wish. That rattling fool with his bone-dry wit thinks himself clever, but his humor is as blunt as his femur clubs.",
    "Consult the butler if you wish. His mask of civility is a charming performance, what a caricature.",
    "You seek truth from a chorus of fools and frauds. That Romani woman's magic is nothing but charming folk nonsense.",
    "The Sphinx and I are kin of a sort, arbiters of judgment. Though I suspect she'd find my methods lacking in subtlety.",
  ],

  46: [
    "Don't you love casinos? The only house where the odds are always in my favor.",
    "The house never loses. The house is me. And I never lose.",
    "Luck is what people call it when they don't understand probability.",
    "Fear and Loathing, always.",
    "I adore people who bet everything on getting home safe."
  ],

  47: [
    "Sharp minds make interesting subjects. And they save me a fortune on electricity bills.",
    "The smarter they are, the louder they scream when I play with their brains.",
    "He used to say he did his best thinking under pressure. I am simply supplying the PRESSURE.",
    "I believe this lost soul just had a BRILLIANT idea!"
  ],

  48: [
    "Truth has teeth. The Romans learned that slowly.",
    "This is the Mouth of Truth. Place your hand inside if you're feeling particularly brave.",
    "Honesty won't get you far in hell. Everyone lies here. Even me... well, ESPECIALLY me. He he.",
    "Losing your marbles on this one?"
  ],

  49: [
    "A murder mystery! How delightful. I do love a good whodunit. Especially when I did it.",
    "The Butler did it, of course.",
    "I always seek out creative murders when I am bored.",
    "Thought you might enjoy a little game of Clue before the end of your journey.",
    "A dead man nobody looked at properly. You would know NOTHING about that."
  ],

  50: [
    "We've reached the end of our little game. Feeling nostalgic already.",
    "You made it this far. That says something about you: you are not a quitter. You must really like suffering.",
    "One floor left. Mind the step. It is a LONG one."
  ]
},

}

// Store the last shown dialogue index for each character and level
const lastShownDialogue: Record<string, Record<number, number>> = {};

// Store the shuffled dialogue options and current index for each character and level
const shuffledDialogue: Record<string, Record<number, { options: string[]; index: number }>> = {};

// Function to shuffle an array (Fisher-Yates shuffle)
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Define character-specific dialogue
export const useCharacterDialogue = () => {
  return (character: string, level: number): string => {
    const options = levelDialogue[character]?.[level] || ["..."];

    if (!shuffledDialogue[character]) {
      shuffledDialogue[character] = {};
    }

    if (!shuffledDialogue[character][level]) {
      // Initialize shuffled options and index if not already present
      shuffledDialogue[character][level] = {
        options: shuffleArray(options),
        index: 0,
      };
    }

    const { options: shuffledOptions, index: currentIndex } = shuffledDialogue[character][level];
    const dialogue = shuffledOptions[currentIndex];

    // Increment index or reset to 0 if at the end
    shuffledDialogue[character][level].index = (currentIndex + 1) % shuffledOptions.length;

    return dialogue;
  };
};

// Define character-to-image mapping
export const characterImageMap: Record<string, string> = {
  skeleton: "/images/skeleton.webp",
  butler: "/images/butler.webp",
  gypsy: "/images/gypsy.webp",
  sphinx: "/images/sphinx.webp",
  devil: "/images/devil.webp",
  brain: "/images/brainlamp.webp", // Default brain image
};

