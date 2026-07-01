export interface FamilyTreeNode {
  id: string
  title?: string
  name?: string
  nickname?: string
  scribbled?: boolean
  children?: FamilyTreeNode[]
}

export const familyTree: FamilyTreeNode = {
  id: "arin",
  title: "King",
  name: "Arin",
  nickname: "the Unyielding",
  children: [
    {
      id: "lirien",
      title: "Princess",
      name: "Lirien",
      nickname: "the Deceiver",
      children: [{ id: "marcen", scribbled: true }],
    },
    {
      id: "kael",
      title: "Prince",
      name: "Kael",
      nickname: "the Ambitious",
      children: [
        {
          id: "thrain",
          title: "Prince",
          name: "Thrain",
          nickname: "the Unstable",
          children: [
            {
              id: "cormac",
              title: "Lord",
              name: "Cormac",
              nickname: "the Folly",
              children: [
                {
                  id: "niamh",
                  title: "Queen",
                  name: "Niamh",
                  nickname: "the Ruthless",
                  children: [
                    {
                      id: "aethera",
                      title: "Princess",
                      name: "Aethera",
                      nickname: "the Forgotten",
                      children: [{ id: "accursed", scribbled: true }],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
