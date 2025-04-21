export interface BookPage {
  text?: string
  imageUrl?: string
  title?: string
}

export interface Book {
  title: string
  pages: BookPage[]
  sections?: {
    id: string
    title: string
    pages: BookPage[]
  }[]
}

export const demonologyBook: Book = {
  title: "Demonology",
  pages: [
    {
      title: "Aswang",
      text: `
Creature Name: Aswang
Origin / Culture: Philippines
How They Kill / Draw Blood: Uses a long tongue to suck blood, often from sleeping children
Where They Kill / Lurk: Rural villages at night
Signs on Victims: Puncture wounds, pale, often die in sleep
`,
      imageUrl: "/placeholder.svg?height=150&width=200",
    },
    {
      title: "Baobhan Sith",
      text: `
Creature Name: Baobhan Sith
Origin / Culture: Scotland
How They Kill / Draw Blood: Seduces men, drains blood with sharp fingernails
Where They Kill / Lurk: Scottish Highlands, forests
Signs on Victims: Exsanguinated, scratches or cuts
`,
      imageUrl: "/placeholder.svg?height=150&width=200",
    },
    {
      title: "Bunyip",
      text: `
Creature Name: Bunyip
Origin / Culture: Australian Aboriginal
How They Kill / Draw Blood: Attacks by drowning or clawing, sometimes causes blood loss
Where They Kill / Lurk: Swamps, billabongs, creeks, waterholes
Signs on Victims: Drowned or wounded victims with blood loss
`,
      imageUrl: "/placeholder.svg?height=150&width=200",
    },
    {
      title: "Encantado",
      text: `
Creature Name: Encantado
Origin / Culture: Amazonian
How They Kill / Draw Blood: Shape-shifting river dolphin that abducts or drowns
Where They Kill / Lurk: Amazon River and tributaries
Signs on Victims: Drowned, dreamy or enchanted expression
`,
      imageUrl: "/placeholder.svg?height=150&width=200",
    },
    {
      title: "Jiangshi",
      text: `
Creature Name: Jiangshi
Origin / Culture: China
How They Kill / Draw Blood: Hops on victims to suck life force or blood
Where They Kill / Lurk: Cemeteries, abandoned places
Signs on Victims: Pale, bruised, drained of energy or blood
`,
      imageUrl: "/placeholder.svg?height=150&width=200",
    },
    {
      title: "Kappa",
      text: `
Creature Name: Kappa
Origin / Culture: Japan
How They Kill / Draw Blood: Drags victims underwater, removes mythical organ (shirikodama)
Where They Kill / Lurk: Rivers, ponds in Japan
Signs on Victims: Drowned, strange wounds, missing organs
`,
      imageUrl: "/placeholder.svg?height=150&width=200",
    },
    {
      title: "Kelpie",
      text: `
Creature Name: Kelpie
Origin / Culture: Scotland
How They Kill / Draw Blood: Shape-shifting water horse that drowns riders
Where They Kill / Lurk: Scottish lochs and rivers
Signs on Victims: Drowned, bite marks or missing flesh
`,
      imageUrl: "/placeholder.svg?height=150&width=200",
    },
    {
      title: "Leshy",
      text: `
Creature Name: Leshy
Origin / Culture: Slavic
How They Kill / Draw Blood: Leads people astray in forests/swamps, causes death by exposure or animal attack
Where They Kill / Lurk: Forests, swamps, near sacred/old trees
Signs on Victims: Lost, disoriented, signs of exposure or animal wounds
`,
      imageUrl: "/placeholder.svg?height=150&width=200",
    },
    {
      title: "Mami Wata",
      text: `
Creature Name: Mami Wata
Origin / Culture: West African
How They Kill / Draw Blood: Drowns or abducts those who disrespect or fail offerings
Where They Kill / Lurk: Rivers, lakes, coastal waters
Signs on Victims: Drowned, peaceful or entranced look, sometimes jewelry found
`,
      imageUrl: "/placeholder.svg?height=150&width=200",
    },
    {
      title: "Moroi",
      text: `
Creature Name: Moroi
Origin / Culture: Romania
How They Kill / Draw Blood: Living vampires draining blood and energy
Where They Kill / Lurk: Rural areas at night
Signs on Victims: Weak, pale, bite marks
`,
      imageUrl: "/placeholder.svg?height=150&width=200",
    },
    {
      title: "Muldjewangk",
      text: `
Creature Name: Muldjewangk
Origin / Culture: Australian Aboriginal
How They Kill / Draw Blood: Aggressive water spirits causing injury and blood loss
Where They Kill / Lurk: Murray River, under floating seaweed
Signs on Victims: Injuries, bloodied or missing victims
`,
      imageUrl: "/placeholder.svg?height=150&width=200",
    },
    {
      title: "Mullo",
      text: `
Creature Name: Mullo
Origin / Culture: Roma/Gypsy
How They Kill / Draw Blood: Rises from grave to drink blood
Where They Kill / Lurk: Near graveyards or places deceased frequented
Signs on Victims: Pale, unexplained wounds
`,
      imageUrl: "/placeholder.svg?height=150&width=200",
    },
    {
      title: "Näkki",
      text: `
Creature Name: Näkki
Origin / Culture: Finland
How They Kill / Draw Blood: Lures children to water and drowns them
Where They Kill / Lurk: Ponds, wells, rivers in Finland
Signs on Victims: Drowned children near water edge
`,
      imageUrl: "/placeholder.svg?height=150&width=200",
    },
    {
      title: "Nosferatu",
      text: `
Creature Name: Nosferatu
Origin / Culture: Eastern European
How They Kill / Draw Blood: Classic vampire draining blood from neck
Where They Kill / Lurk: Abandoned buildings, graveyards, homes
Signs on Victims: Puncture wounds on neck, exsanguination
`,
      imageUrl: "/placeholder.svg?height=150&width=200",
    },
    {
      title: "Nuckelavee",
      text: `
Creature Name: Nuckelavee
Origin / Culture: Orcadian (Scotland)
How They Kill / Draw Blood: Spreads disease, kills with breath or touch, drags into sea
Where They Kill / Lurk: Coastal waters and lochs of Orkney Islands
Signs on Victims: Drowned or mysteriously dead with signs of decay
`,
      imageUrl: "/placeholder.svg?height=150&width=200",
    },
    {
      title: "Yara-ma-yha-who",
      text: `
Creature Name: Yara-ma-yha-who
Origin / Culture: Australian Aboriginal
How They Kill / Draw Blood: Suck blood from ill and weak
Where They Kill / Lurk: Wilderness near water
Signs on Victims: Victims weakened, pale, sometimes dead
`,
      imageUrl: "/placeholder.svg?height=150&width=200",
    },
    {
      title: "Peuchen",
      text: `
Creature Name: Peuchen
Origin / Culture: Chilean (Mapuche)
How They Kill / Draw Blood: Hypnotizes and drains blood from humans and livestock
Where They Kill / Lurk: Forests, rivers in Chile
Signs on Victims: Pale, mysterious wounds or no visible marks
`,
      imageUrl: "/placeholder.svg?height=150&width=200",
    },
    {
      title: "Rougarou",
      text: `
Creature Name: Rougarou
Origin / Culture: Louisiana (French)
How They Kill / Draw Blood: Werewolf-like creature that drinks blood
Where They Kill / Lurk: Swamps and forests of Louisiana
Signs on Victims: Bite marks, partially devoured, drained blood
`,
      imageUrl: "/placeholder.svg?height=150&width=200",
    },
    {
      title: "Rusalka",
      text: `
Creature Name: Rusalka
Origin / Culture: Slavic
How They Kill / Draw Blood: Lures victims to drown in water
Where They Kill / Lurk: Lakes, rivers, ponds near willow/birch trees
Signs on Victims: Drowned with water plants in hair, peaceful/enchanted expression
`,
      imageUrl: "/placeholder.svg?height=150&width=200",
    },
    {
      title: "Soucouyant",
      text: `
Creature Name: Soucouyant
Origin / Culture: Caribbean
How They Kill / Draw Blood: Shape-shifting hag sucks blood from sleeping victims
Where They Kill / Lurk: Villages, enters homes through cracks/keyholes
Signs on Victims: Black/blue marks, weak or dead victims
`,
      imageUrl: "/placeholder.svg?height=150&width=200",
    },
    {
      title: "Strigoi",
      text: `
Creature Name: Strigoi
Origin / Culture: Romania
How They Kill / Draw Blood: Undead or witches feeding on blood at night
Where They Kill / Lurk: Graveyards, villages, homes
Signs on Victims: Bite marks, pale, weak victims
`,
      imageUrl: "/placeholder.svg?height=150&width=200",
    },
    {
      title: "Utopiec",
      text: `
Creature Name: Utopiec
Origin / Culture: Poland
How They Kill / Draw Blood: Drowns people, especially those disrespecting water
Where They Kill / Lurk: Rivers, lakes, ponds in Poland
Signs on Victims: Drowned in unnatural positions, greenish skin tint
`,
      imageUrl: "/placeholder.svg?height=150&width=200",
    },
    {
      title: "Vodyanoy",
      text: `
Creature Name: Vodyanoy
Origin / Culture: Slavic/Polish
How They Kill / Draw Blood: Pulls victims underwater at night
Where They Kill / Lurk: Deep lakes, mill ponds, rivers
Signs on Victims: Drowned, mud or water plants on body
`,
      imageUrl: "/placeholder.svg?height=150&width=200",
    },
    {
      title: "Yara-ma-yha-who",
      text: `
Creature Name: Yara-ma-yha-who
Origin / Culture: Australian Aboriginal
How They Kill / Draw Blood: Sucks blood with suction-cup hands, swallows/regurgitates victims, slowly transforms them
Where They Kill / Lurk: Lives in fig trees in Australian forests
Signs on Victims: Blood drained but not fully, victims weakened, sometimes transformed
`,
      imageUrl: "/placeholder.svg?height=150&width=200",
    },
  ],
}

export const botanyBook: Book = {
  title: "Botany",
  sections: [
    {
      id: "toxicology",
      title: "Toxicology",
      pages: [
        {
          title: "Aconitum",
          text: "Aconitum, also known as monkshood or wolfsbane, is a highly poisonous plant containing aconitine, a potent neurotoxin and cardiotoxin. Symptoms of poisoning include nausea, vomiting, cardiac arrhythmia, paralysis, and death. All parts of the plant are toxic, but the roots and seeds are especially dangerous. Aconitine disrupts nerve and muscle function, leading to respiratory failure and cardiac arrest. There is no antidote, and treatment focuses on managing symptoms.",
          imageUrl: "/placeholder.svg?height=150&width=200",
        },
        {
          title: "Atropa belladonna",
          text: "Atropa belladonna, commonly known as deadly nightshade, is a perennial herbaceous plant in the nightshade family, Solanaceae. It is native to Europe, North Africa, and Western Asia. The foliage and berries of Atropa belladonna are extremely toxic, containing tropane alkaloids that cause delirium, hallucinations, dilated pupils, sensitivity to light, blurred vision, tachycardia, loss of balance, staggering, headache, rash, severely dry mouth and throat, slurred speech, urinary retention, constipation, confusion, hallucinations, and convulsions. The root is generally the most toxic part of the plant, though this can vary from one specimen to another. Infants and children are most susceptible to belladonna poisoning because of their smaller body mass.",
          imageUrl: "/placeholder.svg?height=150&width=200",
        },
        {
          title: "Conium maculatum",
          text: "Conium maculatum, or hemlock, is a highly poisonous biennial herbaceous flowering plant in the family Apiaceae, originating from Europe and North Africa. It is known for its potent neurotoxic alkaloids, including coniine and gamma-coniceine, which cause respiratory paralysis and death. All parts of the plant are poisonous, but the seeds and roots contain the highest concentrations of toxins. Symptoms of hemlock poisoning include muscle weakness, paralysis, nausea, vomiting, and respiratory failure. There is no antidote, and treatment focuses on supportive care.",
          imageUrl: "/placeholder.svg?height=150&width=200",
        },
        {
          title: "Ricinus communis",
          text: "Ricinus communis, or castor bean, is a species of flowering plant in the spurge family, Euphorbiaceae. Its seeds contain ricin, a potent toxin that inhibits protein synthesis. Symptoms of ricin poisoning include nausea, vomiting, abdominal pain, diarrhea, and internal bleeding. Severe cases can lead to organ failure and death. Ricin is a ribosome-inactivating protein, meaning it disrupts the cellular machinery responsible for protein production. There is no antidote, and treatment focuses on supportive care.",
          imageUrl: "/placeholder.svg?height=150&width=200",
        },
      ],
    },
    {
      id: "medicinal",
      title: "Medicinal Plants",
      pages: [
        {
          title: "Aloe vera",
          text: "Aloe vera is a succulent plant species of the genus Aloe. It grows wild in tropical climates around the world and is cultivated for agricultural and medicinal uses. Aloe vera is used in traditional medicine as a skin treatment. Clinical trials have shown that it is effective for healing first- and second-degree burns and accelerating wound healing. Aloe vera is also used for treating minor skin irritations, such as sunburn, insect bites, and rashes.",
          imageUrl: "/placeholder.svg?height=150&width=200",
        },
        {
          title: "Echinacea",
          text: "Echinacea is a genus of herbaceous flowering plants in the daisy family, Asteraceae. It is native to North America. Echinacea is used in traditional medicine to treat colds, flu, and other respiratory infections. Clinical trials have shown that it may reduce the duration and severity of colds, but the evidence is not conclusive. Echinacea is also used to boost the immune system and treat skin conditions.",
          imageUrl: "/placeholder.svg?height=150&width=200",
        },
        {
          title: "Ginkgo biloba",
          text: "Ginkgo biloba, also known as ginkgo or maidenhair tree, is a species of tree native to China. It is used in traditional medicine to improve memory and cognitive function. Clinical trials have shown that it may improve memory in people with Alzheimer's disease and other forms of dementia, but the evidence is not conclusive. Ginkgo biloba is also used to treat anxiety, depression, and other conditions.",
          imageUrl: "/placeholder.svg?height=150&width=200",
        },
        {
          title: "Hypericum perforatum",
          text: "Hypericum perforatum, also known as St John's wort, is a flowering plant in the family Hypericaceae. It is native to Europe, North Africa, and Western Asia. St John's wort is used in traditional medicine to treat depression, anxiety, and other mood disorders. Clinical trials have shown that it may be effective for treating mild to moderate depression, but the evidence is not conclusive. St John's wort can interact with many medications, so it is important to talk to a doctor before using it.",
          imageUrl: "/placeholder.svg?height=150&width=200",
        },
      ],
    },
  ],
}
