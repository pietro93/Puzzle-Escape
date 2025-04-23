export interface BookPage {
  text?: string
  imageUrl?: string
  title?: string
}

export interface Book {
  title: string
  sections?: {
    id: string
    title: string
    pages: BookPage[]
  }[]
}

export const botanyBook: Book = {
  title: "Botany",
  sections: [
    {
      id: "trees",
      title: "Trees",
      pages: [
        {
          title: "Oak Tree",
          text: "The mighty oak is known for its strength and longevity. Its wood has been used for centuries in construction and furniture making. Oak trees can live for hundreds of years and provide habitat for countless species.",
          imageUrl: "/placeholder.svg?height=150&width=200",
        },
        {
          title: "Pine Tree",
          text: "Evergreen and aromatic, pine trees are found across the northern hemisphere. They produce resin that has been used in traditional medicines. Their distinctive needles and cones make them easily recognizable in forests.",
          imageUrl: "/placeholder.svg?height=150&width=200",
        },
        {
          title: "Birch Tree",
          text: "With its distinctive white bark, the birch tree has been important in many cultures. The bark can be used to make paper, containers, and even canoes. Birch sap can be tapped in spring and made into a refreshing drink.",
          imageUrl: "/placeholder.svg?height=150&width=200",
        },
      ],
    },
    {
      id: "plants",
      title: "Plants",
      pages: [
        {
          title: "Deadly Nightshade",
          text: "Also known as belladonna, this highly toxic plant has been used both as a poison and medicine throughout history. All parts of the plant contain tropane alkaloids that can cause hallucinations and death.",
          imageUrl: "/placeholder.svg?height=150&width=200",
        },
        {
          title: "Foxglove",
          text: "While beautiful, foxglove contains powerful cardiac glycosides that affect heart rhythm. In controlled doses, it's the source of the medicine digoxin, but improper use can be fatal.",
          imageUrl: "/placeholder.svg?height=150&width=200",
        },
        {
          title: "Professor Hemlock",
          text: "Named after the renowned botanist who first classified it, this rare variety of water hemlock is among the most poisonous plants in North America. It contains cicutoxin that attacks the central nervous system, causing seizures and death. The poison can be extracted and concentrated into a nearly undetectable toxin that leaves minimal traces in the victim's system.",
          imageUrl: "/placeholder.svg?height=150&width=200",
        },
        {
          title: "Wolfsbane",
          text: "Also called monkshood or aconite, this plant contains aconitine, a potent neurotoxin. It has been used in hunting and warfare throughout history. Even handling the plant without gloves can cause symptoms.",
          imageUrl: "/placeholder.svg?height=150&width=200",
        },
      ],
    },
  ],
}
