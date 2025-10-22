import type { Transition } from "@/types/transition"

export const transitions: Transition[] = [
  // Prison to Mansion (after level 10)
  {
    title: "Escape from the Prison",
    paragraphs: [
      "The skeleton guard's bones clatter to the floor as you solve the final riddle. The cell door creaks open, revealing a path to freedom.",

      "\"Heh, think yer clever, do ya?\" the guard's skull hisses as you step past. \"But ya deserve to rot in 'ere. Ya know what ya did, even if that noggin o' yours don't remember it yet.\"",

      "His mocking words echo in your mind as you navigate through damp corridors and past empty cells. What did you do? Why can't you remember?",

      "Finally, you emerge into a strange twilight. In the distance, perched atop a hill, stands a grand mansion. Its windows glow with an eerie light, beckoning you forward. With nowhere else to go, you begin the trek toward the imposing structure.",

      "As you approach the mansion's ornate entrance, the massive doors swing open of their own accord. In the doorway stands a tall, gaunt butler with an unnaturally rigid posture.",

      '"We\'ve been expecting you, sir," he says in a crisp, proper English accent. His eyes never blinking as he studies you with cold precision. "Do come in. One mustn\'t linger on the threshold—it\'s most dreadfully improper."',
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
      'As you solve the butler\'s final challenge, his composed demeanor cracks. "Most impressive, if I may say so," he murmurs, straightening his bow tie with nervous precision.',

      '"I daresay you are in what one might call a transitional phase," he says, his voice softening to a conspiratorial tone. "Between what was and what shall be. Your soul requires... processing, as it were. That is why you find yourself in our humble establishment."',

      'The mansion begins to tremble, dust falling from the ornate ceiling. "I\'m afraid I cannot divulge further details," the butler says with a slight bow. "The master would be most displeased. But do know that your journey is quite necessary. What you did... well, there are consequences, as any proper gentleman would understand."',

      "You race through the mansion's twisting corridors, dodging falling debris. Bursting through the garden doors, you run until the sounds of destruction fade behind you.",

      "The path leads you deep into a dense, mist-shrouded forest unlike any you've seen before. Strange lights flicker between the trunks, and whispers seem to follow your every step.",

      "Just as you begin to fear you're hopelessly lost, you stumble upon a small clearing. In its center sits a colorful wagon, smoke curling from its chimney. An elderly woman emerges, her clothes a riot of patterns and her fingers adorned with rings that catch what little light filters through the canopy.",

      '"Ah, the wanderer arrives!" she exclaims in a thick accent, rolling her r\'s dramatically. "The cards have foretold your coming. Your past haunts you, and your future... it waits to be read."',
    ],
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

      '"I see your past," she whispers, her voice like dry leaves rustling in a Transylvanian wind. "A good soul you were, kind heart beating strong... but then darkness came! Metal screaming against metal. Glass shattering like the ice of frozen river. Blood on your hands that wasn\'t yours alone."',

      "You feel a chill despite the warmth of her wagon. Fragments of memory flash through your mind—headlights in rain, the screech of brakes, a bottle rolling on the floor.",

      'She grabs your hand suddenly, her rings cold against your skin. "Your future, it remains unwritten in the great book of fate," she continues, her gnarled fingers tracing the lines on your palm. "The path you walk now is one of judgment, but also of possibility. The spirits, they test you, yes? They watch with ancient eyes."',

      "The forest around you begins to shift. Trees bend away, creating a path where none existed before. The mist parts, revealing a trail bathed in moonlight.",

      '"Go now," the fortune teller urges, pressing a strange coin into your palm. "Face what comes next. Remember that understanding comes before forgiveness—even forgiveness of self. The cards never lie, and they say your journey is far from over."',

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
      'The sphinx\'s stone face cracks into what might be a smile as you solve its final riddle. "The mortal possesses wisdom," it rumbles, its voice ancient as the desert itself. "But does the mortal possess understanding?"',

      'Its massive paws shift in the sand, eyes boring into yours like twin suns. "Thou art being judged," it intones. "For actions taken in the realm of the living, for choices made when clothed in flesh. For lives altered by thy hand."',

      '"I..." you begin, but the sphinx cuts you off with a raised paw.',

      '"This one is not thy judge," it says. "Merely a waypoint on thy journey through the eternal scales. But know this truth: what awaits thee next is the final arbiter of thy fate. Answer with truth in thy heart, face what thou hast done, and perhaps thy ka may yet find peace in the afterlife."',

      "The ground beneath you begins to shift, not like the gentle movement of sand, but a deliberate parting. The sand gives way completely, and you find yourself falling through darkness. The air grows hotter around you, yet you feel no fear—only a strange sense of inevitability.",

      "Your descent slows, and you land gently on a surface of smooth, warm stone. All around you, flames cast dancing shadows on cavern walls.",

      "A figure approaches through the flames, tall and imposing. Neither fully human nor entirely other, he carries himself with the confidence of one who has ruled for eternity.",

      '"Well, well, well!" he says with a theatrical flourish, his voice melodious and charming. "Look what the sphinx dragged in! Welcome to my humble abode, traveler." His smile is dazzling, perfect white teeth against red skin. "I\'ve been watching your progress with great interest. Not many make it this far, you know."',

      'He circles you, appraising. "I am the final test on your journey. Pass my little challenges, and your soul may yet escape my... hospitality. Fail, and well..." He gestures to the flames, his smile never faltering. "Let\'s just say you\'ll have plenty of time to practice your puzzle-solving skills. For eternity."',
    ],
    characterImage: "/images/devil.webp",
    characterName: "The Devil",
    backgroundImage: "/images/hell-transition.png",
    nextLocation: "the Afterlife",
    bgClass: "bg-red-950/90",
  },
]
