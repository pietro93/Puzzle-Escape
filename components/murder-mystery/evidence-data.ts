import type { AutopsyReportPage } from "./types"

// Autopsy Report Data
export const autopsyReportPages: AutopsyReportPage[] = [
  {
    title: "Autopsy Report - Page 1",
    content: `Name: Dohn Joe  \n
Gender: Male (assumed, based on tax records)  \n
Age: Early 30s (the best years, lucky bastard died in his prime)   \n
Eyes: The same shade of brown as a good, solid, albeit unremarkable coffee   \n
Hair: The same shade of brown as a well-trodden forest path) \n
**Additional Notes**:  
> *“Subject appeared to be attempting to ‘relax’ while dying. Arms folded. Expression serene. Very rude. We had to reposition him for the photos.”*`,

  },
  {
    title: "Autopsy Report - Page 2",
    content: `Clinical Summary: \n
    Our dear Dohn met his untimely end due to a severe case of "not enough red stuff in the veins." Also known as anemia. \n
    Before kicking the bucket, he called emergency services and said, "I'm not feeling well." Paramedics arrived, only to find he had already turned into a human-level lamp. No signs of trauma, injury, or anyone poking him with a stick.`,
  },
  {
    title: "Autopsy Report - Page 3",
    content: `External examination: \n
    Height: 168 cm \n
    External examination: Height 168 cm. The body presents with the ghostly pallor of an underboiled shrimp. \n
    Either weird bruises or VERY weird tattoos on limbs but no sign of struggle so I guess that's nothing to be concerned about.
    `,
  },
  {
    title: "Autopsy Report - Page 4",
    content: `Toxicology \n
    Our tests found a profound absence of poison, venom, or exciting toxins. Bro did not know how to party.`,
  },
  {
    title: "Autopsy Report - Page 5",
    content: `Summary:
    The official cause of death is organ failure due to extreme anemia. 
    His blood gave up first, then his soul left his body out of politeness. \n
    100% Natural. Case closed.`,
  },
]

// Locations data
export const locations = [
  { id: "crime scene", name: "Crime Scene" },
  { id: "police station", name: "Police Station" },
  { id: "morgue", name: "Morgue" },
  { id: "library", name: "Library" },
]
