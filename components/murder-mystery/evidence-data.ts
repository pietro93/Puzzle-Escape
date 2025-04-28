import type { AutopsyReportPage } from "./types"

// Autopsy Report Data
export const autopsyReportPages: AutopsyReportPage[] = [
  {
    title: "Autopsy Report - Page 1",
    content: `Name: Declan Tremblay
Age: Early 30s
Eyes: Brown
Hair: Brown`,
  },
  {
    title: "Autopsy Report - Page 2",
    content: `Clinical summary: The decedent was found dead following a suspected organ failure attributed to complications from anemia. Prior to death, the individual had called emergency services reporting feeling unwell. Upon arrival, paramedics found the victim deceased. There was no history or evidence of trauma or injury. The clinical picture is consistent with severe anemia leading to multiorgan compromise and failure.`,
  },
  {
    title: "Autopsy Report - Page 3",
    content: `External examination: Height: 168 cm The body exhibited pallor with a slight reddish tint to the skin, consistent with anemia-related hypoxia and circulatory changes. Notably, ecchymoses were present on the arms and legs, indicative of minor subcutaneous bleeding or bruising without associated trauma. The body showed signs of reduced blood volume, with visibly low levels of blood noted at the scene. No external injuries, wounds, or signs of violence were observed.`,
  },
  {
    title: "Autopsy Report - Page 4",
    content: `Toxicology: Comprehensive toxicological analysis revealed no evidence of poison, venom, or other toxic substances contributing to death.`,
  },
  {
    title: "Autopsy Report - Page 5",
    content: `Summary: The external and clinical findings support death due to organ failure secondary to complications of anemia, with no indication of external trauma or intoxication. The presence of ecchymoses may reflect underlying hematologic fragility or coagulopathy associated with the anemia. This aligns with known fatal outcomes in severe anemia cases complicated by multiorgan dysfunction.`,
  },
]

// Locations data
export const locations = [
  { id: "crime scene", name: "Crime Scene" },
  { id: "police station", name: "Police Station" },
  { id: "morgue", name: "Morgue" },
  { id: "library", name: "Library" },
]
