// Define guard dialog lines for level 10 only
export const guardDialogLines = [
  "An inmate has been murdered, and one of these four inmates did it. Who is the killer?",
  "Oh, you think *you're* going to figure this out? Cute.",
  "Don't bother looking at me. I wouldn't know the first thing about what happened... even if I did see it, which I didn't.",
  "Go on, ask them your questions. I'm sure these honest law-abiding folks will be nothing but thrilled to help you.",
  "Don't worry, I'm on your side. Hehehe!",
  "Hurry up. I haven't got all eternity, unlike you.",
  "The victim? Let's just say they won't be needing their kneecaps anymore. Or anything else, for that matter. Hahaha!",
  "I would give you a hand, but I already ate it. Hehehe!"
]

// Add a specific sphinx riddle for level 38
export const sphinxRiddle = "What has a bed, a mouth, banks, and a crystal clear body?"

// Level 12 (Mansion Clock) — the time the butler reads out matches the clock's actual hand position, never random
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
    "Pope Gregory established the definitive order of the seven deadly sins with pride at the very forefront to ensure a remarkably tidy piece of moral accounting.",
    "The master chose to leave the natural cracks in this alabaster sculpture of Pope Gregory completely exposed to demonstrate a rather questionable sense of interior design.",
    "Gregorian chant takes its name directly from Pope Gregory and provides a vastly superior auditory experience compared to the usual clamor of this household.",
    "Pope Gregory authored the strict religious doctrines concerning human pride to offer a splendid layer of irony for anyone employed in service to the elite.",
  ],
  narcissus: [
    "John Gibson carved the Narcissus sculpture from solid marble to celebrate an entirely pure and classical interpretation of beauty.",
    "The British art establishment strictly preferred the cold white stone of the Narcissus statue to the painted works of antiquity.",
    "A classical education reveals the rather prominent homoerotic traditions celebrated by the Narcissus sculpture.",
    "One observes Narcissus pining over his own reflection with a dedication frequently mirrored by the guests of this estate.",
  ],
  invidia: [
    "Giotto di Bondone painted Envy with a serpent biting her face to demonstrate the literal poison of malicious speech.",
    "Enrico Scrovegni funded the chapel housing the Envy fresco to purchase his father a comfortable seat in paradise.",
    "The clutching claw of Envy grasps permanently at the air in a gesture quite common among the aristocracy.",
    "Giotto forced Western painting into three-dimensional realism specifically to capture the agonizing grip of true greed.",
  ],
  ivan: [
    "Ilya Repin captured the precise moment Tsar Ivan the Fourth secured his legacy with a heavy metal staff.",
    "Vandals have violently attacked the Ivan the Terrible canvas on two separate occasions out of sheer political fervor.",
    "Ilya Repin painted Ivan the Terrible as a direct condemnation of the unchecked autocracy dominating nineteenth-century Russia.",
    "Repin temporarily lost the use of his right hand from the psychological torment of painting such a brutal tableau.",
  ],
  desidia: [
    "Pieter Bruegel the Elder manufactured the grotesque demonic hellscape of Desidia because nightmares sold exceptionally well in sixteenth-century Antwerp.",
    "The giant hand in Desidia points directly at the eleventh hour to signify the rapid approach of the final judgment.",
    "Pieter Bruegel demonstrates the virtue of hard work by profiting immensely from this detailed sketch of utter laziness.",
    "The sleepy woman in Desidia rests on her sluggish donkey with an apathy I frequently observe during the morning hours in this household.",
  ],
  mammon: [
    "George Frederic Watts crowned Mammon with the ears of a donkey to explicitly equate wealth worship with absolute foolishness.",
    "Mammon crushes a young man and a girl under his weight with the cold indifference entirely characteristic of the industrial era.",
    "George Frederic Watts painted Mammon as a heavy beast in scarlet and gold to effectively shame the wealthy elites of London.",
    "The sheer apathy in the gaze of Mammon captures the essence of modern capitalism with flawless precision.",
  ],
  saturn: [
    "Francisco Goya chose to decorate his own dining room wall with Saturn Devouring His Son as a charming piece of home decor.",
    "The Titan Cronus in Saturn Devouring His Son consumes a fully grown adult in a desperate attempt to maintain his authority over the household.",
    "The bulging eyes of Saturn display a horrific mix of panic and madness typical of a cornered beast.",
    "A period of complete deafness allowed Goya to focus entirely on painting the darkest reaches of human paranoia in Saturn Devouring His Son.",
  ],
  thesin: [
    "Franz von Stuck constructed the heavy gilded frame of The Sin himself to serve as a literal altar for his provocative painting.",
    "The luminous eyes of Eve in The Sin stare outward from the heavy shadows with a deeply predatory intent.",
    "Franz von Stuck utilized extreme chiaroscuro in The Sin to highlight the terrifying weight of the python.",
    "The heavy python wraps around the subject of The Sin to symbolize transgression in the most confrontational manner possible.",
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

// Define random elevator messages
export const getRandomElevatorMessage = (): string => {
  const messages = [
    "The elevator descends with a sickening lurch...",
    "You feel the temperature rising as you descend deeper...",
    "Screams echo from somewhere far below...",
    "The walls of the elevator seem to pulse like a living thing...",
    "Blood begins to seep from the corners of the elevator...",
    "Whispers surround you as the elevator continues its descent...",
    "The lights flicker, plunging you into momentary darkness...",
    "The elevator shudders violently as it passes through another threshold...",
    "A distant wailing grows louder as you descend...",
    "The air becomes thick with the smell of sulfur and decay...",
    "Shadows move across the walls of the elevator, though you stand perfectly still...",
    "The floor beneath your feet becomes uncomfortably warm...",
    "You feel countless eyes watching you through the walls...",
    "The elevator creaks and groans like a dying animal...",
    "Your ears pop painfully as you descend to impossible depths...",
  ]
  return messages[Math.floor(Math.random() * messages.length)]
}

// Define level-specific dialogue for each character
const levelDialogue: Record<string, Record<number, string[]>> = {
  
skeleton: {

    1: [
    "Mirrors show hard truths. Like the fact that yer ugly.",
    "Stare longer. Maybe yer face will make sense.",
    "Tsk. Ya are staring at failure. It wears yer face well.",
    "Ya came all this way to admire yerself? Mphf.",
    "First puzzle and already stuck? My ribs are rattlin' with amusement.",
    "Starin' at yer reflection shows a deep lack of self-respect."
    ],

    2: [
    "Countin' bones. I do that nightly. It is a terrible habit.",
    "Yer fingers tremble and make countin' harder. Are ya *beggin'* me to break 'em?",
    "I kept a ledger of who owned these. They all ended up here just like ya.",
    "The last prisoner who took this puzzle ended up becomin' part of the exhibit.",
    "These are spares. I keep mine in the freezer.",
    "My ribs are better organized than yer thoughts.",
    "I collected these from the previous occupants. They would want ya to have them."
    ],

    3: [
    "Math: the universal language of sufferin'. And yer failin' the alphabet.",
    "I solved this with half my brain missin'. Don't tell me that yer stuck.",
    "Add yer regrets. Subtract yer chances. Divide yer hope.",
    "Hah-hah-hah. The solution is *sufferin'*.",
    "Numbers are honest creatures. Unlike ya, they refuse to lie about yer odds."
    ],

    4: [
    "Hah-hah-hah. Dreams? Here, we call those delusions.",
    "The alphabet actively conspires against ya. Believe me.",
    "Tsk. Ya sleep? Sleep is a luxury for the hopeful.",
    "Yer nightmares are my favorite bedtime stories.",
    "I stopped havin' dreams centuries ago. But I think I may start havin' nightmares after seein' yer face.",
    "Mphf. Yer unconscious mind is currently negotiatin' yer surrender."
    ],

    5: [
    "Tick. Tock. Yer coffin's gettin' cold.",
    "Hey. Stop wastin' everyone's eternity with yer slowness.",
    "The clock keeps score. It says ya suck at this.",
    "The hands of that clock are countin' down to somethin' ya will not survive.",
    "Some days I can't remember if I'm dead or just really, really bored. Yer guess is as good as mine.",
    "Bricks and stones may break my bones, but I can also break yers."
    ],

    6: [
    "Meet Shackles. All bone, no flesh, just how I like company.",
    "Tried eatin' him once. Too gristly. Kept him as a pet instead.",
    "Feed him right and he might not tear yer hand off. Might.",
    "Mphf. Shackles is pickier than I am about his meals.",
    "Give him the wrong bone and he'll spit it right back at ya."
    ],

    7: [
    "Heh. I can make ya change LIFE to DEATH in only two steps.",
    "Yer logic has more gaps than my ribcage.",
    "Change HOPE to NOPE in one move. Congrats, yer doomed.",
    "HATE becomes FATE becomes... whatever",
    "Mphf. Word games are for children and fools. Thought ya might like this one."
    ],

    8: [
    "This puzzle is unsolvable. Just like yer problems.",
    "Mphf. Even I don't know the answer. Isn't that wonderful?",
    "This puzzle has broken minds harder than yers. They tasted much better, too.",
    "I think randomly smashin' the pieces might actually work. Try it.",
    "The real magic is how quickly ya abandon logic for guesswork.",
    "Tsk. I think if ya arrange them at random eventually yer'll get it right.",
    "C'mon, I'm bored. Give up already.",
    "Ah, yer gettin' tired. Good.",
    ],

    9: [
    "I skewer three of 'em at a time. Roast nicely over the brazier, they do.",
    "Squeak all ya want. I've heard sweeter music from a rat on a spit.",
    "Named that fat grey one after a warden I outlived. Tastes about the same too.",
    "Mphf. Nothin' pairs better with stale bread than a well-charred tail.",
    "Oh, ya want my help? That's adorable. Tsk.",
    "Careful with the plump ones. They bite back right up till they're dinner.",
    "I wonder what sound *yer* bones will make when I finally get to play with them.",
    "Hah-hah-hah. Ya squirm just like they do, right before the skewer."
    ]

  }
,
butler: {
  11: [ // Bookshelf Chronology Puzzle
    "I dust these shelves daily. The Master was most particular about the preservation of knowledge.",
    "Please refrain from bending the spines. It is an act of barbarism. You are a guest here, after all.",
    "The Master's library contains over ten thousand volumes. Have you read any books at all?",
    "The stories preserved here far outlast the fleeting lives they recount.",
    "Fascinating. Your taste in literature appears... unrefined."
  ],
  12: [ // Assembly Puzzle / Box (escargot)
    "We find much depends on the patience invested versus mere trial and error.",
    "I have polished these pieces weekly for thirty years. I trust you will handle them with care.",
    "Assembly is a matter of order, a concept apparently elusive to some.",
    "Some things are more valuable when taken apart. It reveals their inner workings.",
    "Kintsugi is the Japanese art of repairing broken pottery with gold. It treats breakage as part of an object's history."
  ],
  13: [ // Exotic Spices Puzzle
    "The Master did enjoy a hint of the exotic in every meal. One must have standards.",
    "Lessons in flavour, like this puzzle, require patience and discernment.",
    "The pungent aroma of these spices was once worth more than gold. Quite the investment.",
    "The Master's palate was exceptionally refined. A rare quality these days.",
    "A guest once mistook cumin for cinnamon. They were not invited back."
  ],
  // 14 (Mansion Clock Puzzle) uses getClockButlerLine / clockButlerRemarksByStep above, not this table.
  15: [ // Color / Pigment Puzzle
    "I do hope your eyes serve you better than your instincts thus far.",
    "You would do well not to overlook the nuances of hue and tone.",
    "Tyrian purple, a color once reserved for emperors, was famously extracted from sea snails. Thousands for a single gram.",
    "I do hope you possess a basic grasp of color theory. It would be most unfortunate otherwise.",
    "The Master believed colour could alter one's mood. This room is a testament to that.",
    "The painter labeled every hue in French. A rather stubborn habit of his countrymen, I find.",
    "Do not fret over the language, kind guest. Colour, unlike vocabulary, requires no translation.",
    "I confess my own French extends little beyond ordering wine. This palette demands rather more of you."
  ],
  16: [ // Silverware / Math Puzzle
    "The family silverware is solid sterling. Polished daily, of course.",
    "Do be careful. The tarnish of a single fingerprint takes ages to buff out.",
    "The Master was fastidious about place settings, as etiquette demanded. Thankfully for you, they are not around.",
    "Table manners may escape you, but they are quite important to me.",
    "One cannot underestimate the silent conversation of a well-laid table."
  ],
  17: [ // Light Switch & Compass Puzzle
    "Ah, light. A considerable improvement. Your fumbling in the dark was quite audible.",
    "The Master was fond of navigational instruments. This one, however, appears to have lost its bearings. It insists on pointing West.",
    "Nyctophilia is a fondness for darkness. I myself am a devoted practitioner.",
    "Fascinating, isn't it? The first magnetic compass was invented in China during the Han Dynasty.",
    "Are you lost, kind guest? Perhaps this compass will help you find the way."
  ],
  18: [ // Parrot Puzzle
    "Count Papagalul has endured through generations with unusual vitality.",
    "The Count possesses a rather colorful vocabulary. The Master found it endlessly amusing. Myself, not so much.",
    "Kind guest, please exercise extreme caution in his presence. His bite lacks discretion.",
    "He tends to repeat things he overhears. I would be mindful of what you say.",
    "He seems to have taken a dislike to you. How curious."
  ],
  19: [ // Library / Family Tree (heir) Puzzle
    "The family records are a meticulously woven tapestry of facts and fabrications.",
    "The Master devoted countless hours untangling the family's intricate roots.",
    "One must admire the care taken to conceal certain family affairs.",
    "Some branches of the family tree were deliberately pruned. For the health of the whole.",
    "Genealogy is a fascinating pursuit. It reveals how the past is never truly past.",
    "Be careful where you pry. Some ancestors are best left undisturbed."
  ]
  // 20 (Mansion Gallery Puzzle) uses getMansionButlerLine / mansionAmbientLines / mansionExaminingLines above, not this table.
},
  gypsy: {
    21: [
      "Tell me your truth. The spirits listen, yes?",
      "Your essence speaks volumes. Louder than any shout.",
      "Secrets are sharp stones. Be careful where you step, *dragul meu*.",
      "My **duende** sees your **drabardi**. It is... a winding road.",
      "Everyone hides something. Even the pebbles on the path. Heh.",
      "Face your answers. Do not fear what you find inside.",
      "You think you know yourself? We will see. *Aha!*",
      "Your path unfolds now. Like a stubborn riddle."
    ],
    22: [
      "*Ghicitul în cafea*. Tasseomancy, you call it. It makes me run.",
      "This coffee... it rumbles my belly. Like thunder. *Pfiu*. So much gas.",
      "The grounds whisper secrets. Like old winds through bones.",
      "Your future swirls in there. Like mud after a big rain.",
      "Patterns hold truth. Like runes in the dirt. Very old truth.",
      "Bad luck if you spill. Or worse. Heh. Very worse.",
      "Some see stains. Wise ones see stories. Which are you?",
      "A storm is coming. Or maybe just... indigestion. *Da?*"
    ],
    23: [
      "Stars sing songs. Different lands, different tunes, yes?",
      "Your year has a voice. A very... spirited animal voice.",
      "My favorite animal? Hmm. I once had a pig. Jambon, I called him. Such a good boy. Everyone said he tasted delicious. Ha! Just kidding. Mostly.",
      "Cycles turn. Like a peasant's wheel. Or a wolf's mood. Always turning.",
      "Some signs bring luck. Some bring *grijă* (care). Be watchful.",
      "The sky knows more than your noisy metal maps. Always.",
      "This year remembers change. A big change. For you. *Heh*.",
      "Beware the animal's temper. It bites. Like a stray dog."
    ],
    24: [
      "Crystals hold power. Old power. Like **duende**. This one? Clear quartz. Amplifies everything. Even my collection.",
      "Each piece wants home. Like a lost soul. Like you? Perhaps.",
      "Stones whisper secrets. Louder than your little phone. This amethyst? For calm. Helps me sleep. When I'm not jittery.",
      "Some crystals heal. Some reveal. Some just... help you feel good. This rose quartz? Very nice for... comfort. For a lonely night. *Heh*.",
      "You look broken too. Maybe these pieces help put you back? Like my obsidian. Cleanses bad energy.",
      "Fit them together. See what truth the stones show. Like my agate. Swirls hide worlds.",
      "This stone remembers. It remembers everything. Even betrayals. Like my jade. Protects against bad vibes.",
      "Sharp edges bring pain. Like harsh truths. Or using this smooth tourmaline for... other purposes. Very effective."
    ],
    25: [
      "Shapes speak. Numbers sing. The universe's song, *da*. But I don't trust numbers.",
      "Ancient secrets hid in symbols. Like my grandmother's soup. But math? Bah!",
      "Simple? Ha! Nothing is simple. Not even *sarmale*. Very complex. Logic is for the birds.",
      "Find balance. Or face chaos. My magic tells me balance is best. Not your rigid lines.",
      "Geometry is language. Older than your noisy metal. But numbers? Cold. Dead.",
      "Your ancestors knew these shapes. Before all the noise. They felt the magic.",
      "Numbers build wonders. Or trap you forever. Like a cage. Magic sets you free.",
      "Find the pattern. Or get lost. My gut tells me the way. Not your silly rules."
    ],
    26: [
      "Look up. The sky tells stories. Not your glowing screen. Much better from here.",
      "Stars are old memories. They watch everything. Always. So much watching.",
      "Your ancestors navigated by these. Did they find their way? Or just get lost?",
      "This pattern has a name. A secret name. Like a hidden treasure.",
      "Aha! You see the wolf in the sheep's clothing now? Clever boy.",
      "The sky watches your steps. It remembers all. Even your mistakes.",
      "Destiny's dice are thrown in the stars. Tossed high. Men want to travel there? Fools.",
      "Find the shape. Or wander lost. In the dark. Much easier to read from here, yes?"
    ],
    27: [
      "Zodiac tells of year, soul. And your restless heart. Always restless.",
      "Cycles turn. Human hearts? Always chasing shadows. *Heh*. Unlike the moon.",
      "Twelve signs? Some say more. How many signs are out there? Few know the true answer.",
      "Is your heart in sync? Or lost like a sheep? Be honest now.",
      "This season hides a sign. A hidden one. Like a secret wish.",
      "The heavens know order. Humans? Ha! A different story. Always different.",
      "Your path twists. Like a Romani dance. Or a river. *Da*.",
      "Secrets hide in plain sight. Like a wolf in the flock. Always watching."
    ],
    28: [
      "Crystals hum songs. Like my stomach. Ha! Avoid the coffee. It brings only pain.",
      "Right order unlocks power. Or a secret trap. Be careful. This tourmaline wards off bad dreams.",
      "These stones remember hands. Many hands. Many stories. Like my collection. So many stones.",
      "Some sing together. Like a wedding. Some scream. Like bad singers. This one? It's for... focus. Very potent.",
      "Harmony is fragile. Like your hope. Or my crystal ball when I drop it. Oops. Use this jade for protection.",
      "Place them true. They don't like to be pushed around. This amethyst helps me sleep. When I'm not too jittery.",
      "This stone is mischievous. Like a child with shiny things. Watch it. It likes to roll away. Fun!",
      "Balance your path. Like these crystals. Or like using this smooth agate... for inner peace. And other things. *Heh*."
    ],
    29: [
      "..."
    ],
    30: [
      "Cards show your soul's journey. Your **drabardi**. Yes. It is written.",
      "Empires fall. Like cards. Like noisy toys. So flimsy. *Poate*.",
      "Joy upright. Despair reversed. Like shortcuts and blisters. *Oof*. A painful lesson.",
      "Choices have echoes. Especially yours. Listen for them. They follow you.",
      "You think you are done? *Poate*. Maybe. For now. The journey is long.",
      "End of road. Start of new. Always. Like the sun rising. Or setting in fire.",
      "Did you learn? Or just pass through? Cards know. They see the desert in your soul.",
      "This last card. It is about your future. Be ready. You walk towards a burning place. *Heh*."
    ]
  },
  sphinx: {
    31: [
      "These symbols were carved when your kind still dwelled in caves.",
      "Hieroglyphs hold the wisdom of a civilization that built wonders.",
      "The ancient ones spoke through pictures, not mere letters.",
      "Each symbol contains a world of meaning, seeker.",
    ],
    32: [
      "The sacred scarab pushes the sun across the sky each day.",
      "Gold was as common as dust to some ancient rulers.",
      "Pilgrimages reveal more about the traveler than the destination.",
      "The beetle's path mirrors the journey of the soul after death.",
    ],
    33: [
      "Darkness conceals and reveals in equal measure.",
      "Light is temporary. Darkness is eternal.",
      "Ancient chambers hold secrets best left undisturbed.",
      "What is written in darkness can only be read in light.",
    ],
    34: [
      "The crocodile god watches from the depths of the Nile.",
      "Some deities demand blood. Others protect from bloodshed.",
      "Fragments, when properly arranged, reveal the whole truth.",
      "The gods of old have not died. They merely sleep.",
    ],
    35: [
      "The desert deceives the eye and parches the tongue.",
      "What you see may not exist. What exists, you may not see.",
      "Heat bends light as easily as time bends truth.",
      "The sands shift, revealing patterns only to bury them again.",
    ],
    36: [
      "Great monuments rise stone by stone, seeker.",
      "Pharaohs built toward the sky to reach the afterlife.",
      "Each block must find its proper place in the greater whole.",
      "The pyramids align with stars that guided the ancient ones.",
    ],
    37: [
      "Pillars support more than mere ceilings, seeker.",
      "Gods and pharaohs share the burden of holding up the sky.",
      "Names hold power in the ancient tongue.",
      "Order matters in ritual as in architecture.",
    ],
    38: [
      "Messages hidden in sand wash away with the next wind.",
      "Codes and ciphers protected the secrets of temples.",
      "Water flows like knowledge—seeking the lowest point.",
      "Ask the right question, receive the true answer.",
    ],
    39: [
      "Mathematics was sacred to the ancient ones.",
      "Numbers hold mystical properties beyond mere counting.",
      "The eye sees fractions of the whole truth.",
      "Equations balance like Ma'at's scales of justice.",
    ],
    40: [
      "Pyramids contain chambers unknown even to their builders.",
      "Light penetrates the deepest darkness once yearly.",
      "A lost soul's journey through the underworld mirrors your own.",
      "Some chambers were sealed to contain dangers, others treasures",
    ],
  },
  devil: {
  41: [
    "Maps are just stories people tell themselves about territory they don't own.",
    "All roads lead to Rome. Or, well... to here in hell, with me. Ha!",
    "Geography is just politics with better maps.",
    "Maps are so futile, every lost soul ends up here eventually."
  ],

  42: [
    "I've played this game longer than your civilization has existed.",
    "The Horsemen are such reliable employees. Pestilence always clears the board for War.",
    "Twenty moves to orchestrate the apocalypse. I could do it in one, but I appreciate the theater.",
    "I choreographed the apocalypse itself; your moves are merely a curtain call."
  ],

  43: [
    "Theology and mathematics—both systems designed by people who needed meaning.",
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
    "The Sphinx and I are kin of a sort—ancient arbiters of judgment. Though I suspect she'd find my methods lacking in subtlety.",
  ],

  46: [
    "Don't you love casinos? The only house where the odds are always in my favor.",
    "The house never loses. The house is me. And I never lose.",
    "Luck is what people call it when they don't understand probability.",
    "Fear and Loathing, always."
  ],

  47: [
    "Sharp minds make interesting subjects. And they save me a fortune on electricity bills.",
    "The smarter they are, the louder they scream when I play with their brains.",
    "I am quite proud of this machine of mine.",
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
    "Thought you might enjoy a little game of Clue before the end of your journey."
  ],

  50: [
    "We've reached the end of our little game. Feeling nostalgic already.",
    "You made it this far. That says something about you: you are not a quitter. You must really like suffering.",
    "Welcome to MY realm..."
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

// Utility to parse dialogue for italicized words
export const parseDialogueForItalics = (text: string): string => {
  // Replace *word* with <em>word</em>, but only for single asterisks
  return text.replace(/\*([^*]+?)\*/g, '<em>$1</em>');
};
