export interface Transition {
  title: string
  paragraphs: string[]
  characterImage: string
  characterName: string
  backgroundImage: string
  nextLocation: string
  bgClass: string
  // Overrides the automatic quarter-based image cycling for specific
  // paragraphs (by index) — for beats that need a precise image swap tied
  // to a specific line, e.g. a character's reveal mid-transition.
  paragraphImages?: Record<number, string>
}
