import type { Book } from "@/components/murder-mystery/types"

// Character Combinations
const apollyonCombo = "⤟꧂〰⤪"
const adzeCombo = "⟿꧂෴"
const asmodeusCombo = "⤠⤪〰"
const aziDahakaCombo = "⤪〰෴꧂"
const babaYagaCombo = "꧂෴⟿⤪"
const churelCombo = "〰⤪⤟⟴"
const duppyCombo = "꧁෴⟿꧂"
const draugrCombo = "⤠⤞⤪"
const incubusCombo = "⤪෴⟿"
const djinnCombo = "෴〰⤪"
const jorogumoCombo = "⤟⟿⤪"
const laLloronaCombo = "⤪〰෴"
const lamashtuCombo = "⤪〰⤟෴"
const lilithCombo = "⟿⤠꧂"
const oniCombo = "෴⤪〰⤞"
const pazuzuCombo = "⤪〰⤠"
const pishachaCombo = "⟿෴⤠"
const pontianakCombo = "⤪෴⟿"
const popobawaCombo = "〰⤪⤞"
const rakshasaCombo = "⤠⟿⤪෴"
const revenantCombo = "⤪෴"
const strigoiCombo = "⤪〰⤟"
const succubusCombo = "⟿⤠"
const taniwhaCombo = "෴⤪"
const tlahuelpuchiCombo = "⤟❦⟿"
const wendigoCombo = "꧁෴⤠"
const yaramayhawhoCombo = "⤪⟴〰෴"
const elSilbonCombo = "෴❦⟿"
const impunduluCombo = "⤪⤟෴❦"

export const demonologyBook: Book = {
  title: `Demonology: A Comprehensive Guide to Supernatural Entities`,
  pages: [
    {
      title: "Introduction to Demonology",
      text: `This tome contains detailed accounts of supernatural entities from across the world. These beings have been documented through centuries of folklore, eyewitness accounts, and scholarly research.\n\nThe entities are categorized in two ways:\n\n1. By Cultural/Geographical Origin - Tracing the cultural roots of each entity\n\n2. By Type or Nature - Classifying entities by their behaviors and characteristics\n\nEach entry includes identifying symbols, appearance, habitat, and modus operandi. Study with caution, for knowledge of these entities may draw their attention.`,
    },
  ],
  sections: [
    // CULTURAL/GEOGRAPHICAL ORIGIN CATEGORIES
    {
      id: "east-asia",
      title: "East Asia",
      pages: [
        // Jorogumo - Image
        {
          title: `${jorogumoCombo}`,
          imageUrl: "/images/demonology/jorogumo.webp",
        },
        // Jorogumo - Text
        {
          title: `${jorogumoCombo}`,
          text: `<b>Origin:</b> Japanese Folklore.\n\n<b>Appearance:</b> A beautiful woman who can transform into a giant spider with multiple eyes and hairy legs.\n\n<b>Modus Operandi:</b> She lures men with her beauty, then ensnares them in webs to devour them at her leisure.\n\n<b>Habitat:</b> Remote mountain forests and abandoned houses.`,
        },
        // Oni - Image
        {
          title: `${oniCombo}`,
          imageUrl: "/images/demonology/oni.webp",
        },
        // Oni - Text
        {
          title: `${oniCombo}`,
          text: `<b>Origin:</b> Japanese Folklore.\n\n<b>Appearance:</b> Large, horned ogres with red or blue skin, wild hair, sharp claws, and iron clubs.\n\n<b>Modus Operandi:</b> <b><span style="color:red">${oniCombo}</span></b> attack with brute force, crushing or devouring victims, and are associated with natural disasters and punishment of sinners.\n\n<b>Habitat:</b> Mountains, caves, and hellish realms.`,
        },
      ],
    },
    {
      id: "europe",
      title: "Europe",
      pages: [
        // Draugr - Image
        {
          title: `${draugrCombo}`,
          imageUrl: "/images/demonology/draugr.webp",
        },
        // Draugr - Text
        {
          title: `${draugrCombo}`,
          text: `<b>Origin:</b> Norse and Icelandic mythology.\n\n<b>Appearance:</b> Undead warriors with bloated, decaying bodies and supernatural strength.\n\n<b>Modus Operandi:</b> Guard their graves fiercely, attacking trespassers and spreading death or madness.\n\n<b>Habitat:</b> Burial mounds, ancient tombs, and coastal areas.`,
        },
        // Incubus - Image
        {
          title: `${incubusCombo}`,
          imageUrl: "/images/demonology/incubus.webp",
        },
        // Incubus - Text
        {
          title: `${incubusCombo}`,
          text: `<b>Origin:</b> European folklore.\n\n<b>Appearance:</b> Male demons, often dark and muscular with horns and wings.\n\n<b>Modus Operandi:</b> Assault women in their sleep, draining energy and causing nightmares, illness, or death.\n\n<b>Habitat:</b> Bedrooms and dream realms.`,
        },
        // Revenant - Text
        {
          title: `${revenantCombo}`,
          text: `<b>Origin:</b> European folklore.\n\n<b>Appearance:</b> Restless undead often depicted as decayed or corpse-like beings.\n\n<b>Modus Operandi:</b> They rise from the grave to seek revenge on the living, causing fear, illness, or death.\n\n<b>Habitat:</b> Graveyards, battlefields, and places of violent death.`,
        },
        // Succubus - Image
        {
          title: `${succubusCombo}`,
          imageUrl: "/images/demonology/succubus.webp",
        },
        // Succubus - Text
        {
          title: `${succubusCombo}`,
          text: `<b>Origin:</b> European folklore.\n\n<b>Appearance:</b> Seductive female demons with alluring beauty, often adorned with bat wings or horns.\n\n<b>Modus Operandi:</b> They visit men in dreams to seduce and drain their life force, causing weakness or death.\n\n<b>Habitat:</b> Bedrooms and dream realms.`,
        },
      ],
    },
    {
      id: "judeo-christian",
      title: "Judeo-Christian",
      pages: [
        // Apollyon - Image
        {
          title: `${apollyonCombo}`,
          imageUrl: "/images/demonology/apollyon.webp",
        },
        // Apollyon - Text
        {
          title: `${apollyonCombo}`,
          text: `<b>Origin:</b> Rooted in Judeo-Christian apocalyptic tradition, <b><span style="color:red">${apollyonCombo}</span></b> is the <i>"Angel of the Abyss."</i>\n\n<b>Appearance:</b> Often depicted as a dark, armored warrior or a terrifying swarm of locusts, he embodies destruction and the void.\n\n<b>Modus Operandi:</b> <b><span style="color:red">${apollyonCombo}</span></b> commands legions of locusts and destructive forces that bring plagues and widespread death. His arrival signals divine wrath and catastrophic ruin.\n\n<b>Habitat:</b> Emerges from the abyss or desolate battlefields where devastation reigns.`,
        },
        // Lilith - Image
        {
          title: `${lilithCombo}`,
          imageUrl: "/images/demonology/lilith.webp",
        },
        // Lilith - Text
        {
          title: `${lilithCombo}`,
          text: `<b>Origin:</b> Jewish Folklore.\n\n<b>Appearance:</b> A beautiful yet fearsome winged woman with serpentine features.\n\n<b>Modus Operandi:</b> She preys on newborn infants, bringing illness and death, and seduces men in their sleep to drain their vitality.\n\n<b>Habitat:</b> Roams nighttime wilderness near homes with newborns or sleeping men.`,
        },
      ],
    },
    {
      id: "middle-east-persia",
      title: "Middle East & Persia",
      pages: [
        // Asmodeus - Image
        {
          title: `${asmodeusCombo}`,
          imageUrl: "/images/demonology/asmodeus.webp",
        },
        // Asmodeus - Text
        {
          title: `${asmodeusCombo}`,
          text: `<b>Origin:</b> Middle Eastern and European demonology.\n\n<b>Appearance:</b> A fearsome demon with three heads—a bull, a ram, and a man—sometimes riding a dragon or wielding a lance.\n\n<b>Modus Operandi:</b> Tempts mortals into lust, jealousy, and corruption, eroding virtue and spreading discord.\n\n<b>Habitat:</b> Places of vice, such as brothels, temples of forbidden worship, and courts rife with intrigue.`,
        },
        // Azi Dahaka - Image
        {
          title: `${aziDahakaCombo}`,
          imageUrl: "/images/demonology/azi-dahaka.webp",
        },
        // Azi Dahaka - Text
        {
          title: `${aziDahakaCombo}`,
          text: `<b>Origin:</b> Persian mythology.\n\n<b>Appearance:</b> A monstrous three-headed dragon or serpent with fiery breath and immense size.\n\n<b>Modus Operandi:</b> Spreads plague and destruction, devouring livestock and humans, poisoning the land with his presence.\n\n<b>Habitat:</b> Mountains, caves, and desolate wastelands.`,
        },
        // Djinn - Image
        {
          title: `${djinnCombo}`,
          imageUrl: "/images/demonology/djinn.webp",
        },
        // Djinn - Text
        {
          title: `${djinnCombo}`,
          text: `<b>Origin:</b> Middle Eastern and North African folklore.\n\n<b>Appearance:</b> Shape-shifting spirits of fire, capable of appearing as humans, animals, or elemental forms.\n\n<b>Modus Operandi:</b> Trick, possess, or curse humans; some are malevolent, others neutral or benevolent. They can cause madness, illness, or misfortune.\n\n<b>Habitat:</b> Deserts, ruins, and remote places.`,
        },
        // Lamashtu - Image
        {
          title: `${lamashtuCombo}`,
          imageUrl: "/images/demonology/lamashtu.webp",
        },
        // Lamashtu - Text
        {
          title: `${lamashtuCombo}`,
          text: `<b>Origin:</b> Ancient Mesopotamia.\n\n<b>Appearance:</b> A monstrous female with a lioness's head, donkey's teeth and ears, long fingers, and bird-like feet.\n\n<b>Modus Operandi:</b> She attacks pregnant women and newborns, causing miscarriages, infant death, and disease through curses and direct assault.\n\n<b>Habitat:</b> Childbirth huts and homes of expectant mothers.`,
        },
        // Pazuzu - Image (NEW)
        {
          title: `${pazuzuCombo}`,
          imageUrl: "/images/demonology/pazuzu.webp",
        },
        // Pazuzu - Text
        {
          title: `${pazuzuCombo}`,
          text: `<b>Origin:</b> Ancient Mesopotamia.\n\n<b>Appearance:</b> A hybrid creature with a lion's head, eagle talons, wings, and a scorpion's tail.\n\n<b>Modus Operandi:</b> He commands the southwest wind to spread disease and famine and is paradoxically invoked to protect against other evil spirits threatening mothers and infants.\n\n<b>Habitat:</b> Deserts, windswept plains, and vulnerable households.`,
        },
      ],
    },
    {
      id: "oceanic",
      title: "Oceanic",
      pages: [
        // Taniwha - Text
        {
          title: `${taniwhaCombo}`,
          text: `<b>Origin:</b> Māori mythology of New Zealand.\n\n<b>Appearance:</b> Large, serpentine or dragon-like water beings.\n\n<b>Modus Operandi:</b> They act as guardians or predators, drowning or attacking trespassers, but may also protect tribes.\n\n<b>Habitat:</b> Rivers, lakes, caves, and coastal waters.`,
        },
        // Yara-ma-yha-who - Text
        {
          title: `${yaramayhawhoCombo}`,
          text: `<b>Origin:</b> Australian Aboriginal mythology.\n\n<b>Appearance:</b> Small, red-skinned humanoids with large heads, wide toothless mouths, and suckers on hands and feet.\n\n<b>Modus Operandi:</b> Drops from fig trees onto victims to drain blood with suckers, then swallows and regurgitates them. Repeated attacks cause victims to grow shorter and redder until they transform into <b><span style="color:red">${yaramayhawhoCombo}</span></b> themselves.\n\n<b>Habitat:</b> Fig trees in forests, often near watercourses.`,
        },
      ],
    },
    {
      id: "slavic-eastern-europe",
      title: "Slavic & E. Europe",
      pages: [
        // Baba Yaga - Image
        {
          title: `${babaYagaCombo}`,
          imageUrl: "/images/demonology/baba-yaga.webp",
        },
        // Baba Yaga - Text
        {
          title: `${babaYagaCombo}`,
          text: `<b>Origin:</b> Slavic folklore.\n\n<b>Appearance:</b> An old witch with a fearsome visage, often depicted riding a mortar and wielding a pestle, dwelling in a hut on chicken legs.\n\n<b>Modus Operandi:</b> Kidnaps and eats children, curses trespassers, and misleads travelers, embodying both menace and ambiguous wisdom.\n\n<b>Habitat:</b> Deep forests and remote wilderness.`,
        },
        // Strigoi - Text
        {
          title: `${strigoiCombo}`,
          text: `<b>Origin:</b> Romanian folklore.\n\n<b>Appearance:</b> Undead vampires with pale skin, sharp teeth, and glowing eyes.\n\n<b>Modus Operandi:</b> They rise from the grave to drink the blood of the living, spreading death and disease.\n\n<b>Habitat:</b> Graveyards, villages, and rural homes.`,
        },
      ],
    },
    {
      id: "south-southeast-asia",
      title: "South & SE Asia",
      pages: [
        // Churel - Image
        {
          title: `${churelCombo}`,
          imageUrl: "/images/demonology/churel.webp",
        },
        // Churel - Text
        {
          title: `${churelCombo}`,
          text: `<b>Origin:</b> South Asian folklore.\n\n<b>Appearance:</b> A hideous female spirit with backward-facing feet, disheveled hair, and a gaunt, terrifying face.\n\n<b>Modus Operandi:</b> Drains the life force of men, causing rapid aging and death, often targeting those who wronged her in life.\n\n<b>Habitat:</b> Graveyards, crossroads, and places associated with injustice.`,
        },
        // Pishacha - Image (NEW)
        {
          title: `${pishachaCombo}`,
          imageUrl: "/images/demonology/pishacha.webp",
        },
        // Pishacha - Text
        {
          title: `${pishachaCombo}`,
          text: `<b>Origin:</b> Indian Mythology.\n\n<b>Appearance:</b> Hideous flesh-eating spirits with bulging eyes, sharp teeth, and grotesque features.\n\n<b>Modus Operandi:</b> They haunt cremation grounds and desolate places, possessing humans to feed on flesh and blood, inducing madness and violent behavior.\n\n<b>Habitat:</b> Cremation grounds, forests, and abandoned locales.`,
        },
        // Pontianak - Text
        {
          title: `${pontianakCombo}`,
          text: `<b>Origin:</b> Southeast Asian Folklore.\n\n<b>Appearance:</b> The ghost of a woman who died during childbirth with long black hair, pale skin, and bloodstained clothes.\n\n<b>Modus Operandi:</b> She lures men and then eviscerates or drains their blood, embodying vengeance for a tragic death.\n\n<b>Habitat:</b> Banana trees, cemeteries, and dark alleys.`,
        },
        // Rakshasa - Text
        {
          title: `${rakshasaCombo}`,
          text: `<b>Origin:</b> Indian epic and folklore traditions.\n\n<b>Appearance:</b> Shape-shifting demons with terrifying fangs, claws, and fiery eyes; sometimes animalistic traits.\n\n<b>Modus Operandi:</b> They use illusions and brute force to terrorize humans, devouring them and spreading chaos wherever they roam.\n\n<b>Habitat:</b> Forests, battlefields, and human settlements after nightfall.`,
        },
      ],
    },
    {
      id: "sub-saharan-africa",
      title: "Sub-Saharan Africa",
      pages: [
        // Adze - Image
        {
          title: `${adzeCombo}`,
          imageUrl: "/images/demonology/adze.webp",
        },
        // Adze - Text
        {
          title: `${adzeCombo}`,
          text: `<b>Origin:</b> Ewe folklore of West Africa.\n\n<b>Appearance:</b> A vampiric entity that can take the form of a glowing firefly or a shadowy humanoid with red eyes and claws.\n\n<b>Modus Operandi:</b> In firefly form, it slips into homes unnoticed to feed on the blood of victims, causing wasting illness and misfortune. In humanoid form, it becomes aggressive and dangerous.\n\n<b>Habitat:</b> Villages and homes, especially at night.`,
        },
        // Impundulu - Text
        {
          title: `${impunduluCombo}`,
          text: `<b>Origin:</b> Southern African folklore.\n\n<b>Appearance:</b> A large bird resembling a lightning bird with black and white plumage.\n\n<b>Modus Operandi:</b> Summons storms and lightning to attack victims and drinks their blood; often serves witches.\n\n<b>Habitat:</b> Remote villages and wilderness areas.`,
        },
        // Popobawa - Text
        {
          title: `${popobawaCombo}`,
          text: `<b>Origin:</b> Tanzanian and Zanzibari folklore.\n\n<b>Appearance:</b> A bat-like demon that can shapeshift, often appearing as a human or an animal.\n\n<b>Modus Operandi:</b> It assaults victims at night, causing terror, physical harm, and leaving lasting psychological trauma.\n\n<b>Habitat:</b> Homes and villages, especially in Zanzibar.`,
        },
      ],
    },
    {
      id: "the-americas",
      title: "The Americas",
      pages: [
        // Duppy - Image
        {
          title: `${duppyCombo}`,
          imageUrl: "/images/demonology/duppy.webp",
        },
        // Duppy - Text
        {
          title: `${duppyCombo}`,
          text: `<b>Origin:</b> Caribbean folklore.\n\n<b>Appearance:</b> Malevolent spirits or ghosts, often invisible but sometimes appearing as shadowy figures or glowing lights.\n\n<b>Modus Operandi:</b> Haunt and torment the living, causing illness, accidents, madness, or death.\n\n<b>Habitat:</b> Cemeteries, abandoned places, and homes.`,
        },
        // El Silbon - Text
        {
          title: `${elSilbonCombo}`,
          text: `<b>Origin:</b> Venezuelan and Colombian folklore.\n\n<b>Appearance:</b> Tall, thin ghostly figure carrying a bag of bones, often whistling haunting tunes.\n\n<b>Modus Operandi:</b> Whistles as an omen and kills drunkards and womanizers, sometimes by sucking out their bones.\n\n<b>Habitat:</b> Countryside, forests, and rural roads.`,
        },
        // La Llorona - Image
        {
          title: `${laLloronaCombo}`,
          imageUrl: "/images/demonology/lallorona.webp",
        },
        // La Llorona - Text
        {
          title: `${laLloronaCombo}`,
          text: `<b>Origin:</b> Latin American Folklore.\n\n<b>Appearance:</b> The weeping woman, a ghostly figure in white, often with long flowing hair and a mournful expression.\n\n<b>Modus Operandi:</b> She haunts waterways, luring victims to drown, especially children.\n\n<b>Habitat:</b> Rivers, lakes, and marshes.`,
        },
        // Tlahuelpuchi - Text
        {
          title: `${tlahuelpuchiCombo}`,
          text: `<b>Origin:</b> Mexican folklore.\n\n<b>Appearance:</b> Human by day, vampire witch by night, often female with sharp teeth.\n\n<b>Modus Operandi:</b> Feeds on the blood of infants under the cover of darkness.\n\n<b>Habitat:</b> Rural villages and farms.`,
        },
        // Wendigo - Text
        {
          title: `${wendigoCombo}`,
          text: `<b>Origin:</b> Algonquian Native American mythology.\n\n<b>Appearance:</b> Emaciated, monstrous humanoids with glowing eyes and long claws.\n\n<b>Modus Operandi:</b> Possess humans, driving them to cannibalism and madness, spreading hunger and death.\n\n<b>Habitat:</b> Frozen forests and wilderness.`,
        },
      ],
    },

    // TYPE OR NATURE CATEGORIES
    {
      id: "cannibalistic",
      title: "Cannibalistic",
      pages: [
        // Pishacha - Image
        {
          title: `${pishachaCombo}`,
          imageUrl: "/images/demonology/pishacha.webp",
        },
        // Pishacha - Text
        {
          title: `${pishachaCombo}`,
          text: `<b>Origin:</b> Indian Mythology.\n\n<b>Appearance:</b> Hideous flesh-eating spirits with bulging eyes, sharp teeth, and grotesque features.\n\n<b>Modus Operandi:</b> They haunt cremation grounds and desolate places, possessing humans to feed on flesh and blood, inducing madness and violent behavior.\n\n<b>Habitat:</b> Cremation grounds, forests, and abandoned locales.`,
        },
        // Wendigo - Text
        {
          title: `${wendigoCombo}`,
          text: `<b>Origin:</b> Algonquian Native American mythology.\n\n<b>Appearance:</b> Emaciated, monstrous humanoids with glowing eyes and long claws.\n\n<b>Modus Operandi:</b> Possess humans, driving them to cannibalism and madness, spreading hunger and death.\n\n<b>Habitat:</b> Frozen forests and wilderness.`,
        },
      ],
    },
    {
      id: "child-predating",
      title: "Child Predating",
      pages: [
        // Lamashtu - Image
        {
          title: `${lamashtuCombo}`,
          imageUrl: "/images/demonology/lamashtu.webp",
        },
        // Lamashtu - Text
        {
          title: `${lamashtuCombo}`,
          text: `<b>Origin:</b> Ancient Mesopotamia.\n\n<b>Appearance:</b> A monstrous female with a lioness's head, donkey's teeth and ears, long fingers, and bird-like feet.\n\n<b>Modus Operandi:</b> She attacks pregnant women and newborns, causing miscarriages, infant death, and disease through curses and direct assault.\n\n<b>Habitat:</b> Childbirth huts and homes of expectant mothers.`,
        },
        // Lilith - Image
        {
          title: `${lilithCombo}`,
          imageUrl: "/images/demonology/lilith.webp",
        },
        // Lilith - Text
        {
          title: `${lilithCombo}`,
          text: `<b>Origin:</b> Jewish Folklore.\n\n<b>Appearance:</b> A beautiful yet fearsome winged woman with serpentine features.\n\n<b>Modus Operandi:</b> She preys on newborn infants, bringing illness and death, and seduces men in their sleep to drain their vitality.\n\n<b>Habitat:</b> Roams nighttime wilderness near homes with newborns or sleeping men.`,
        },
        // Pontianak - Text
        {
          title: `${pontianakCombo}`,
          text: `<b>Origin:</b> Southeast Asian Folklore.\n\n<b>Appearance:</b> The ghost of a woman who died during childbirth with long black hair, pale skin, and bloodstained clothes.\n\n<b>Modus Operandi:</b> She lures men and then eviscerates or drains their blood, embodying vengeance for a tragic death.\n\n<b>Habitat:</b> Banana trees, cemeteries, and dark alleys.`,
        },
        // Tlahuelpuchi - Text
        {
          title: `${tlahuelpuchiCombo}`,
          text: `<b>Origin:</b> Mexican folklore.\n\n<b>Appearance:</b> Human by day, vampire witch by night, often female with sharp teeth.\n\n<b>Modus Operandi:</b> Feeds on the blood of infants under the cover of darkness.\n\n<b>Habitat:</b> Rural villages and farms.`,
        },
      ],
    },
    {
      id: "demons",
      title: "Demons",
      pages: [
        // Apollyon - Image
        {
          title: `${apollyonCombo}`,
          imageUrl: "/images/demonology/apollyon.webp",
        },
        // Apollyon - Text
        {
          title: `${apollyonCombo}`,
          text: `<b>Origin:</b> Rooted in Judeo-Christian apocalyptic tradition, <b><span style="color:red">${apollyonCombo}</span></b> is the <i>"Angel of the Abyss."</i>\n\n<b>Appearance:</b> Often depicted as a dark, armored warrior or a terrifying swarm of locusts, he embodies destruction and the void.\n\n<b>Modus Operandi:</b> <b><span style="color:red">${apollyonCombo}</span></b> commands legions of locusts and destructive forces that bring plagues and widespread death. His arrival signals divine wrath and catastrophic ruin.\n\n<b>Habitat:</b> Emerges from the abyss or desolate battlefields where devastation reigns.`,
        },
        // Asmodeus - Image
        {
          title: `${asmodeusCombo}`,
          imageUrl: "/images/demonology/asmodeus.webp",
        },
        // Asmodeus - Text
        {
          title: `${asmodeusCombo}`,
          text: `<b>Origin:</b> Middle Eastern and European demonology.\n\n<b>Appearance:</b> A fearsome demon with three heads—a bull, a ram, and a man—sometimes riding a dragon or wielding a lance.\n\n<b>Modus Operandi:</b> Tempts mortals into lust, jealousy, and corruption, eroding virtue and spreading discord.

<b>Habitat:</b> Places of vice, such as brothels, temples of forbidden worship, and courts rife with intrigue.`,
        },
        // Djinn - Image
        {
          title: `${djinnCombo}`,
          imageUrl: "/images/demonology/djinn.webp",
        },
        // Djinn - Text
        {
          title: `${djinnCombo}`,
          text: `<b>Origin:</b> Middle Eastern and North African folklore.

<b>Appearance:</b> Shape-shifting spirits of fire, capable of appearing as humans, animals, or elemental forms.

<b>Modus Operandi:</b> Trick, possess, or curse humans; some are malevolent, others neutral or benevolent. They can cause madness, illness, or misfortune.

<b>Habitat:</b> Deserts, ruins, and remote places.`,
        },
        // Lamashtu - Image
        {
          title: `${lamashtuCombo}`,
          imageUrl: "/images/demonology/lamashtu.webp",
        },
        // Lamashtu - Text
        {
          title: `${lamashtuCombo}`,
          text: `<b>Origin:</b> Ancient Mesopotamia.

<b>Appearance:</b> A monstrous female with a lioness's head, donkey's teeth and ears, long fingers, and bird-like feet.

<b>Modus Operandi:</b> She attacks pregnant women and newborns, causing miscarriages, infant death, and disease through curses and direct assault.

<b>Habitat:</b> Childbirth huts and homes of expectant mothers.`,
        },
        // Lilith - Image
        {
          title: `${lilithCombo}`,
          imageUrl: "/images/demonology/lilith.webp",
        },
        // Lilith - Text
        {
          title: `${lilithCombo}`,
          text: `<b>Origin:</b> Jewish Folklore.

<b>Appearance:</b> A beautiful yet fearsome winged woman with serpentine features.

<b>Modus Operandi:</b> She preys on newborn infants, bringing illness and death, and seduces men in their sleep to drain their vitality.

<b>Habitat:</b> Roams nighttime wilderness near homes with newborns or sleeping men.`,
        },
        // Oni - Image
        {
          title: `${oniCombo}`,
          imageUrl: "/images/demonology/oni.webp",
        },
        // Oni - Text
        {
          title: `${oniCombo}`,
          text: `<b>Origin:</b> Japanese Folklore.

<b>Appearance:</b> Large, horned ogres with red or blue skin, wild hair, sharp claws, and iron clubs.

<b>Modus Operandi:</b> <b><span style="color:red">${oniCombo}</span></b> attack with brute force, crushing or devouring victims, and are associated with natural disasters and punishment of sinners.

<b>Habitat:</b> Mountains, caves, and hellish realms.`,
        },
        // Pazuzu - Image
        {
          title: `${pazuzuCombo}`,
          imageUrl: "/images/demonology/pazuzu.webp",
        },
        // Pazuzu - Text
        {
          title: `${pazuzuCombo}`,
          text: `<b>Origin:</b> Ancient Mesopotamia.

<b>Appearance:</b> A hybrid creature with a lion's head, eagle talons, wings, and a scorpion's tail.

<b>Modus Operandi:</b> He commands the southwest wind to spread disease and famine and is paradoxically invoked to protect against other evil spirits threatening mothers and infants.

<b>Habitat:</b> Deserts, windswept plains, and vulnerable households.`,
        },
        // Popobawa - Text
        {
          title: `${popobawaCombo}`,
          text: `<b>Origin:</b> Tanzanian and Zanzibari folklore.

<b>Appearance:</b> A bat-like demon that can shapeshift, often appearing as a human or an animal.

<b>Modus Operandi:</b> It assaults victims at night, causing terror, physical harm, and leaving lasting psychological trauma.

<b>Habitat:</b> Homes and villages, especially in Zanzibar.`,
        },
        // Rakshasa - Text
        {
          title: `${rakshasaCombo}`,
          text: `<b>Origin:</b> Indian epic and folklore traditions.

<b>Appearance:</b> Shape-shifting demons with terrifying fangs, claws, and fiery eyes; sometimes animalistic traits.

<b>Modus Operandi:</b> They use illusions and brute force to terrorize humans, devouring them and spreading chaos wherever they roam.

<b>Habitat:</b> Forests, battlefields, and human settlements after nightfall.`,
        },
      ],
    },
    {
      id: "monstrous",
      title: "Monstrous",
      pages: [
        // Azi Dahaka - Image
        {
          title: `${aziDahakaCombo}`,
          imageUrl: "/images/demonology/azi-dahaka.webp",
        },
        // Azi Dahaka - Text
        {
          title: `${aziDahakaCombo}`,
          text: `<b>Origin:</b> Persian mythology.

<b>Appearance:</b> A monstrous three-headed dragon or serpent with fiery breath and immense size.

<b>Modus Operandi:</b> Spreads plague and destruction, devouring livestock and humans, poisoning the land with his presence.

<b>Habitat:</b> Mountains, caves, and desolate wastelands.`,
        },
        // Impundulu - Text
        {
          title: `${impunduluCombo}`,
          text: `<b>Origin:</b> Southern African folklore.

<b>Appearance:</b> A large bird resembling a lightning bird with black and white plumage.

<b>Modus Operandi:</b> Summons storms and lightning to attack victims and drinks their blood; often serves witches.

<b>Habitat:</b> Remote villages and wilderness areas.`,
        },
        // Oni - Image
        {
          title: `${oniCombo}`,
          imageUrl: "/images/demonology/oni.webp",
        },
        // Oni - Text
        {
          title: `${oniCombo}`,
          text: `<b>Origin:</b> Japanese Folklore.

<b>Appearance:</b> Large, horned ogres with red or blue skin, wild hair, sharp claws, and iron clubs.

<b>Modus Operandi:</b> <b><span style="color:red">${oniCombo}</span></b> attack with brute force, crushing or devouring victims, and are associated with natural disasters and punishment of sinners.

<b>Habitat:</b> Mountains, caves, and hellish realms.`,
        },
        // Taniwha - Text
        {
          title: `${taniwhaCombo}`,
          text: `<b>Origin:</b> Māori mythology of New Zealand.

<b>Appearance:</b> Large, serpentine or dragon-like water beings.

<b>Modus Operandi:</b> They act as guardians or predators, drowning or attacking trespassers, but may also protect tribes.

<b>Habitat:</b> Rivers, lakes, caves, and coastal waters.`,
        },
      ],
    },
    {
      id: "shape-shifting",
      title: "Shape-shifting",
      pages: [
        // Djinn - Image
        {
          title: `${djinnCombo}`,
          imageUrl: "/images/demonology/djinn.webp",
        },
        // Djinn - Text
        {
          title: `${djinnCombo}`,
          text: `<b>Origin:</b> Middle Eastern and North African folklore.

<b>Appearance:</b> Shape-shifting spirits of fire, capable of appearing as humans, animals, or elemental forms.

<b>Modus Operandi:</b> Trick, possess, or curse humans; some are malevolent, others neutral or benevolent. They can cause madness, illness, or misfortune.

<b>Habitat:</b> Deserts, ruins, and remote places.`,
        },
        // Jorogumo - Image
        {
          title: `${jorogumoCombo}`,
          imageUrl: "/images/demonology/jorogumo.webp",
        },
        // Jorogumo - Text
        {
          title: `${jorogumoCombo}`,
          text: `<b>Origin:</b> Japanese Folklore.

<b>Appearance:</b> A beautiful woman who can transform into a giant spider with multiple eyes and hairy legs.

<b>Modus Operandi:</b> She lures men with her beauty, then ensnares them in webs to devour them at her leisure.

<b>Habitat:</b> Remote mountain forests and abandoned houses.`,
        },
        // Popobawa - Text
        {
          title: `${popobawaCombo}`,
          text: `<b>Origin:</b> Tanzanian and Zanzibari folklore.

<b>Appearance:</b> A bat-like demon that can shapeshift, often appearing as a human or an animal.

<b>Modus Operandi:</b> It assaults victims at night, causing terror, physical harm, and leaving lasting psychological trauma.

<b>Habitat:</b> Homes and villages, especially in Zanzibar.`,
        },
        // Rakshasa - Text
        {
          title: `${rakshasaCombo}`,
          text: `<b>Origin:</b> Indian epic and folklore traditions.

<b>Appearance:</b> Shape-shifting demons with terrifying fangs, claws, and fiery eyes; sometimes animalistic traits.

<b>Modus Operandi:</b> They use illusions and brute force to terrorize humans, devouring them and spreading chaos wherever they roam.

<b>Habitat:</b> Forests, battlefields, and human settlements after nightfall.`,
        },
        // Tlahuelpuchi - Text
        {
          title: `${tlahuelpuchiCombo}`,
          text: `<b>Origin:</b> Mexican folklore.

<b>Appearance:</b> Human by day, vampire witch by night, often female with sharp teeth.

<b>Modus Operandi:</b> Feeds on the blood of infants under the cover of darkness.

<b>Habitat:</b> Rural villages and farms.`,
        },
      ],
    },
    {
      id: "undead-spirits",
      title: "Undead & Spirits",
      pages: [
        // Churel - Image
        {
          title: `${churelCombo}`,
          imageUrl: "/images/demonology/churel.webp",
        },
        // Churel - Text
        {
          title: `${churelCombo}`,
          text: `<b>Origin:</b> South Asian folklore.

<b>Appearance:</b> A hideous female spirit with backward-facing feet, disheveled hair, and a gaunt, terrifying face.

<b>Modus Operandi:</b> Drains the life force of men, causing rapid aging and death, often targeting those who wronged her in life.

<b>Habitat:</b> Graveyards, crossroads, and places associated with injustice.`,
        },
        // Draugr - Image
        {
          title: `${draugrCombo}`,
          imageUrl: "/images/demonology/draugr.webp",
        },
        // Draugr - Text
        {
          title: `${draugrCombo}`,
          text: `<b>Origin:</b> Norse and Icelandic mythology.

<b>Appearance:</b> Undead warriors with bloated, decaying bodies and supernatural strength.

<b>Modus Operandi:</b> Guard their graves fiercely, attacking trespassers and spreading death or madness.

<b>Habitat:</b> Burial mounds, ancient tombs, and coastal areas.`,
        },
        // Duppy - Image
        {
          title: `${duppyCombo}`,
          imageUrl: "/images/demonology/duppy.webp",
        },
        // Duppy - Text
        {
          title: `${duppyCombo}`,
          text: `<b>Origin:</b> Caribbean folklore.

<b>Appearance:</b> Malevolent spirits or ghosts, often invisible but sometimes appearing as shadowy figures or glowing lights.

<b>Modus Operandi:</b> Haunt and torment the living, causing illness, accidents, madness, or death.

<b>Habitat:</b> Cemeteries, abandoned places, and homes.`,
        },
        // El Silbon - Text
        {
          title: `${elSilbonCombo}`,
          text: `<b>Origin:</b> Venezuelan and Colombian folklore.

<b>Appearance:</b> Tall, thin ghostly figure carrying a bag of bones, often whistling haunting tunes.

<b>Modus Operandi:</b> Whistles as an omen and kills drunkards and womanizers, sometimes by sucking out their bones.

<b>Habitat:</b> Countryside, forests, and rural roads.`,
        },
        // La Llorona - Image
        {
          title: `${laLloronaCombo}`,
          imageUrl: "/images/demonology/lallorona.webp",
        },
        // La Llorona - Text
        {
          title: `${laLloronaCombo}`,
          text: `<b>Origin:</b> Latin American Folklore.

<b>Appearance:</b> The weeping woman, a ghostly figure in white, often with long flowing hair and a mournful expression.

<b>Modus Operandi:</b> She haunts waterways, luring victims to drown, especially children.

<b>Habitat:</b> Rivers, lakes, and marshes.`,
        },
        // Revenant - Text
        {
          title: `${revenantCombo}`,
          text: `<b>Origin:</b> European folklore.

<b>Appearance:</b> Restless undead often depicted as decayed or corpse-like beings.

<b>Modus Operandi:</b> They rise from the grave to seek revenge on the living, causing fear, illness, or death.

<b>Habitat:</b> Graveyards, battlefields, and places of violent death.`,
        },
      ],
    },
    {
      id: "vampiric",
      title: "Vampiric",
      pages: [
        // Adze - Image
        {
          title: `${adzeCombo}`,
          imageUrl: "/images/demonology/adze.webp",
        },
        // Adze - Text
        {
          title: `${adzeCombo}`,
          text: `<b>Origin:</b> Ewe folklore of West Africa.

<b>Appearance:</b> A vampiric entity that can take the form of a glowing firefly or a shadowy humanoid with red eyes and claws.

<b>Modus Operandi:</b> In firefly form, it slips into homes unnoticed to feed on the blood of victims, causing wasting illness and misfortune. In humanoid form, it becomes aggressive and dangerous.

<b>Habitat:</b> Villages and homes, especially at night.`,
        },
        // Impundulu - Text
        {
          title: `${impunduluCombo}`,
          text: `<b>Origin:</b> Southern African folklore.

<b>Appearance:</b> A large bird resembling a lightning bird with black and white plumage.

<b>Modus Operandi:</b> Summons storms and lightning to attack victims and drinks their blood; often serves witches.

<b>Habitat:</b> Remote villages and wilderness areas.`,
        },
        // Incubus - Image
        {
          title: `${incubusCombo}`,
          imageUrl: "/images/demonology/incubus.webp",
        },
        // Incubus - Text
        {
          title: `${incubusCombo}`,
          text: `<b>Origin:</b> European folklore.

<b>Appearance:</b> Male demons, often dark and muscular with horns and wings.

<b>Modus Operandi:</b> Assault women in their sleep, draining energy and causing nightmares, illness, or death.

<b>Habitat:</b> Bedrooms and dream realms.`,
        },
        // Jorogumo - Image
        {
          title: `${jorogumoCombo}`,
          imageUrl: "/images/demonology/jorogumo.webp",
        },
        // Jorogumo - Text
        {
          title: `${jorogumoCombo}`,
          text: `<b>Origin:</b> Japanese Folklore.

<b>Appearance:</b> A beautiful woman who can transform into a giant spider with multiple eyes and hairy legs.

<b>Modus Operandi:</b> She lures men with her beauty, then ensnares them in webs to devour them at her leisure.

<b>Habitat:</b> Remote mountain forests and abandoned houses.`,
        },
        // Pontianak - Text
        {
          title: `${pontianakCombo}`,
          text: `<b>Origin:</b> Southeast Asian Folklore.

<b>Appearance:</b> The ghost of a woman who died during childbirth with long black hair, pale skin, and bloodstained clothes.

<b>Modus Operandi:</b> She lures men and then eviscerates or drains their blood, embodying vengeance for a tragic death.

<b>Habitat:</b> Banana trees, cemeteries, and dark alleys.`,
        },
        // Strigoi - Text
        {
          title: `${strigoiCombo}`,
          text: `<b>Origin:</b> Romanian folklore.

<b>Appearance:</b> Undead vampires with pale skin, sharp teeth, and glowing eyes.

<b>Modus Operandi:</b> They rise from the grave to drink the blood of the living, spreading death and disease.

<b>Habitat:</b> Graveyards, villages, and rural homes.`,
        },
        // Succubus - Image
        {
          title: `${succubusCombo}`,
          imageUrl: "/images/demonology/succubus.webp",
        },
        // Succubus - Text
        {
          title: `${succubusCombo}`,
          text: `<b>Origin:</b> European folklore.

<b>Appearance:</b> Seductive female demons with alluring beauty, often adorned with bat wings or horns.

<b>Modus Operandi:</b> They visit men in dreams to seduce and drain their life force, causing weakness or death.

<b>Habitat:</b> Bedrooms and dream realms.`,
        },
        // Tlahuelpuchi - Text
        {
          title: `${tlahuelpuchiCombo}`,
          text: `<b>Origin:</b> Mexican folklore.

<b>Appearance:</b> Human by day, vampire witch by night, often female with sharp teeth.

<b>Modus Operandi:</b> Feeds on the blood of infants under the cover of darkness.

<b>Habitat:</b> Rural villages and farms.`,
        },
        // Yara-ma-yha-who - Text
        {
          title: `${yaramayhawhoCombo}`,
          text: `<b>Origin:</b> Australian Aboriginal mythology.

<b>Appearance:</b> Small, red-skinned humanoids with large heads, wide toothless mouths, and suckers on hands and feet.

<b>Modus Operandi:</b> Drops from fig trees onto victims to drain blood with suckers, then swallows and regurgitates them. Repeated attacks cause victims to grow shorter and redder until they transform into <b><span style="color:red">${yaramayhawhoCombo}</span></b> themselves.

<b>Habitat:</b> Fig trees in forests, often near watercourses.`,
        },
      ],
    },
    {
      id: "witchcraft",
      title: "Witchcraft",
      pages: [
        // Baba Yaga - Image
        {
          title: `${babaYagaCombo}`,
          imageUrl: "/images/demonology/baba-yaga.webp",
        },
        // Baba Yaga - Text
        {
          title: `${babaYagaCombo}`,
          text: `<b>Origin:</b> Slavic folklore.

<b>Appearance:</b> An old witch with a fearsome visage, often depicted riding a mortar and wielding a pestle, dwelling in a hut on chicken legs.

<b>Modus Operandi:</b> Kidnaps and eats children, curses trespassers, and misleads travelers, embodying both menace and ambiguous wisdom.

<b>Habitat:</b> Deep forests and remote wilderness.`,
        },
        // Tlahuelpuchi - Text
        {
          title: `${tlahuelpuchiCombo}`,
          text: `<b>Origin:</b> Mexican folklore.

<b>Appearance:</b> Human by day, vampire witch by night, often female with sharp teeth.

<b>Modus Operandi:</b> Feeds on the blood of infants under the cover of darkness.

<b>Habitat:</b> Rural villages and farms.`,
        },
      ],
    },
  ],
}
