// Player gender, chosen once per new game (see components/player-gender-screen.tsx).
// Dialogue that should vary uses an inline {{male|female|other}} token, e.g.
//   "We've been expecting you, {{sir|madam|guest}}."
// resolved with genderize() at the point the full line is picked, BEFORE any
// typewriter slicing, so a half-typed token never shows on screen.
// Saves from before this feature have no stored choice and fall back to "other".

export type PlayerGender = "male" | "female" | "other"

const STORAGE_KEY = "puzzle_escape_player_gender"

let cached: PlayerGender | null = null

export function getPlayerGender(): PlayerGender {
  if (cached) return cached
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === "male" || stored === "female" || stored === "other") {
      cached = stored
      return stored
    }
  }
  return "other"
}

export function setPlayerGender(gender: PlayerGender) {
  cached = gender
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, gender)
  }
}

// Pick one of three variants directly, for lines built in code.
export function g(male: string, female: string, other: string): string {
  const gender = getPlayerGender()
  return gender === "male" ? male : gender === "female" ? female : other
}

// Resolve every {{male|female|other}} token in a line.
export function genderize(text: string): string {
  if (!text.includes("{{")) return text
  return text.replace(/\{\{([^|}]*)\|([^|}]*)\|([^|}]*)\}\}/g, (_, male, female, other) => g(male, female, other))
}
