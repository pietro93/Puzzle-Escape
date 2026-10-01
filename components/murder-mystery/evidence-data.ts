import type { AutopsyReportPage } from "./types"

// Autopsy Report Data
export const autopsyReportPages: AutopsyReportPage[] = [
  {
    title: "Autopsy Report - Page 1",
    content: `Name: Dohn Joe  \n
Gender: Male (assumed, based on tax records)  \n
Age: Early 30s  \n
Eyes: Brown  \n
Hair: Brown  \n
**Additional Notes**:
> *"Found lying down. Arms folded. Expression serene. Rude."*`,
  },
  {
    title: "Autopsy Report - Page 2",
    content: `Clinical Summary: \n
    Anemia. Severe. \n
    Victim phoned emergency services. Said: "I'm not feeling well." Correct. \n
    Dead before paramedics arrived. Paler than the ambulance. No trauma. No injury. Nobody poked him with a stick.`,
  },
  {
    title: "Autopsy Report - Page 3",
    content: `External examination: \n
    Height: 168 cm \n
    Pale. Very. \n
    Marks on arms and legs. Bruises, or bad tattoos. No sign of struggle. Not my problem.`,
  },
  {
    title: "Autopsy Report - Page 4",
    content: `Toxicology: \n
    No poison. No venom. No drugs. \n
    Boring.`,
  },
  {
    title: "Autopsy Report - Page 5",
    content: `Summary: \n
    Cause of death: organ failure due to extreme anemia. \n
    Natural. Case closed.`,
  },
]

// Locations data
export const locations = [
  { id: "crime scene", name: "Crime Scene" },
  { id: "police station", name: "Police Station" },
  { id: "morgue", name: "Morgue" },
  { id: "library", name: "Library" },
]
