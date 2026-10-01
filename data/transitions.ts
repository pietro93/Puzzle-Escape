import type { Transition } from "@/types/transition"

export const transitions: Transition[] = [
  // Prison to Mansion (after level 10)
  {
    title: "Escape from the Prison",
    paragraphs: [
      "The skeleton guard's bones clatter to the floor as you solve the final riddle. The cell door creaks open, revealing a path to freedom.",

      "\"Heh, think yer clever, do ya, {{lad|lass|pal}}?\" the guard's skull hisses as you step past. \"But I still have a bone to pick with ya. We'll meet again. That noggin o' yers knows what ya did. Hah-hah-hah.\"",

      "You walk out through damp corridors and empty cells, waiting for someone to stop you. Nobody does. What did you do? You can't remember, and you notice you would rather not.",

      "Outside it is neither night nor day. On the hill there is a house with every window lit, the way a house is lit when someone is waiting up. You have nowhere else to be.",

      "As you approach the mansion's ornate entrance, the massive doors swing open of their own accord. In the doorway stands a tall, gaunt butler with an unnaturally rigid posture.",

      '"We have been expecting you, {{sir|madam|guest}}," he says in a crisp, proper English accent. His eyes do not blink as he studies you. "Do come in. One mustn\'t linger on the threshold. It is most dreadfully improper."',
    ],
    characterImage: "/images/butler.webp",
    characterName: "Butler",
    backgroundImage:
      "/images/mansion-exterior.webp",
    nextLocation: "the Mansion",
    bgClass: "bg-amber-950/90",
  },

  // Mansion to Forest (after level 20)
  {
    title: "Beyond the Mansion's Walls",
    paragraphs: [
      "The butler opens his mouth. For a moment, nothing comes out.",

      '"MORS ET VITA IN MANIBUS AURIGAE TEMERARII!" The shriek tears loose like something that has been trapped in him for years.',

      "A chill runs through you that has nothing to do with the room. For a moment you're somewhere else, foot pressed to a pedal that isn't there.",

      '"I daresay you find yourself in what one might call a transitional phase," he says, his voice settling back into that same conspiratorial politeness, as though screaming were merely another courtesy.',

      '"Between what was and what shall be. Your soul requires a certain amount of processing, as it were, hence your presence in our humble establishment."',

      'The mansion begins to tremble, dust falling from the ornate ceiling. "I\'m afraid I cannot divulge further details," the butler says with a slight bow.',

      '"The master would be most displeased. What you did carries consequences. A proper {{gentleman|lady|guest}} would already know that much."',

      "You race through the mansion's twisting corridors, dodging falling debris. Bursting through the garden doors, you run until the sounds of destruction fade behind you.",

      "The path gives up after a mile. The forest does not. Between the trunks, small lights keep pace with you, and stop when you stop.",

      "Just as you begin to fear you're hopelessly lost, you stumble upon a small clearing. In its center sits a colorful wagon, smoke curling from its chimney. An elderly woman emerges from within.",

      '"Ah, finally you come, {{handsome|beautiful|pretty face}}!" she exclaims, her accent thick, her r\'s rolling dramatically. "Cards tell me you come Tuesday. Is Thursday. Cards are never wrong, so you are late."',
    ],
    // The reveal beat: silence on the ordinary butler, then the scream lands
    // right as his portrait swaps to the undead version. Unlike a jump
    // scare, the mask doesn't go back on — he stays undead through the
    // rest of his lines, since the mansion is visibly falling apart around
    // him by paragraph 5 anyway.
    paragraphImages: {
      0: "/images/butler.webp",
      1: "/images/butler-undead.webp",
      2: "/images/butler-undead.webp",
      3: "/images/butler-undead.webp",
      4: "/images/butler-undead.webp",
      5: "/images/butler-undead.webp",
      6: "/images/butler-undead.webp",
    },
    characterImage: "/images/gypsy.webp",
    characterName: "Fortune Teller",
    backgroundImage:
      "/images/mansion-exterior.webp",
    nextLocation: "the Forest",
    bgClass: "bg-green-950/90",
  },

  // Forest to Desert (after level 30)
  {
    title: "Visions of Past and Future",
    paragraphs: [
      "The fortune teller's eyes widen as you solve her final riddle. The cards in her hand flutter to the table, arranging themselves in a perfect circle.",

      '"I see your past," she says, and for once she does not joke. "A good soul you were, kind heart beating strong. But then, darkness came! Metal screaming against metal. Glass shattering like the ice of frozen river."',

      "Headlights in rain. The screech of brakes. The memory goes as fast as it came, and you decide not to chase it.",

      'She grabs your hand suddenly, her rings cold against your skin. "Your future, nobody wrote it yet," she continues, her gnarled fingers tracing the lines on your palm. "Not even me, and I tried. The path you walk now, it judges you. The spirits, they test you, yes? Very strict teachers."',

      "The forest around you begins to shift. Trees bend away, creating a path where none existed before. The mist parts, revealing a trail bathed in moonlight.",

      '"Go now," the fortune teller urges, pressing a strange coin into your palm. "Face what comes next. First you understand, then you forgive. Even yourself, yes? Cards never lie. They say road is still long."',

      "You walk for what seems like hours, the forest gradually thinning around you. The air grows warmer, the soil beneath your feet increasingly gritty. Suddenly, the last trees fall away, and you find yourself standing at the edge of a vast desert. Golden dunes stretch to the horizon, shimmering in the heat.",

      "In the distance, an enormous shape rises from the sand. As you approach, the silhouette resolves into a massive sphinx, its stone eyes following your movement across the dunes.",
    ],
    characterImage: "/images/sphinx.webp",
    characterName: "Sphinx",
    backgroundImage: "/images/desert-transition.png",
    nextLocation: "the Desert",
    bgClass: "bg-yellow-900/90",
  },

  // Desert to Hell (after level 40)
  {
    title: "The Trial of the Soul",
    paragraphs: [
      'The sphinx\'s stone face cracks into what might be a smile as you solve her final riddle. "The mortal possesses wisdom," she rumbles, her voice ancient as the desert itself. "But does the mortal possess understanding?"',

      'Her massive paws shift in the sand. She does not blink. "Thou art being judged," she intones. "For actions taken in the realm of the living, for choices made when clothed in flesh. For lives altered by thy hand."',

      '"I..." you begin, but the sphinx cuts you off with a raised paw.',

      '"I am not thy judge," she says. "Merely a waypoint on thy road to the eternal scales. But know this truth: what awaits thee next is the final arbiter of thy fate. Answer with truth in thy heart, face what thou hast done, and perhaps thy ka may yet find peace in the afterlife."',

      "The ground beneath you begins to shift, not like the gentle movement of sand, but a deliberate parting. The sand gives way completely, and you find yourself falling through darkness. The air grows hotter. You notice you are not afraid, and wonder when that stopped.",

      "Your descent slows, and you land gently on a surface of smooth, warm stone. All around you, flames cast dancing shadows on cavern walls.",

      "Someone walks out of the flames toward you. He is tall, and handsome in a way that looks rehearsed.",

      '"Well, well, well!" he says. "Look what the sphinx dragged in! Welcome to my humble abode, {{my good man|my dear lady|traveler}}." His teeth are very white against his red skin. "I\'ve been watching your progress with great interest. Not many make it this far, you know."',

      'He circles you, appraising. "I am the final test. Pass my little challenges, and your soul may yet escape my hospitality. Fail," he gestures to the flames, "and you\'ll have plenty of time to practice your puzzle-solving. For ETERNITY."',
    ],
    characterImage: "/images/devil.webp",
    characterName: "The Devil",
    backgroundImage: "/images/hell-transition.png",
    nextLocation: "Hell",
    bgClass: "bg-red-950/90",
  },
]
