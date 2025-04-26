export interface DialogueOption {
  id: string
  text: string
  response: string
  followUp: DialogueOption[]
  condition?: DialogueCondition
  specialAction?: DialogueAction
}

// Define dialogue condition types
export type DialogueCondition =
  | "exhausted-murder-questions"
  | "asked-about-murder"
  | "seen-police-report"
  | "seen-passport"
  | "body-not-accessible"
  | "can-see-body"
  | "asked-about-friends"
  | "asked-both-hobby-questions"
  | "after-viewing-evidence"
  | "knows-about-anemia"
  | "knows-about-body-marks"

// Define dialogue action types
export type DialogueAction =
  | "show-police-report"
  | "show-passport"
  | "show-victim-body"
  | "show-autopsy-report"
  | "mark-asked-about-friends"
  | "mark-asked-hobbies"
  | "mark-asked-puzzle-games"
  | "allow-body-access"
  | "mark-knows-about-anemia"
  | "mark-knows-about-body-marks"
  | "open-book-favorite"
  | "open-book-puppies"
  | "open-book-serial-killers"
  | "open-book-botany"
  | "open-book-blood-diseases"
  | "open-book-demons"

// Define dialogue state interface
export interface DialogueState {
  askedAboutMurder: boolean
  seenPoliceReport: boolean
  seenPassport: boolean
  exhaustedMurderQuestions: boolean
  askedAboutFriends: boolean
  canSeeBody: boolean
  askedHobbies: boolean
  askedPuzzleGames: boolean
  knowsAboutAnemia: boolean
  knowsAboutBodyMarks: boolean
  viewedBody: boolean
  viewedAutopsyReport: boolean
}

export interface AutopsyReportPage {
  title: string
  content: string
}

export interface Book {
  title: string
  pages?: BookPage[]
  sections?: BookSection[]
}

export interface BookSection {
  id: string
  title: string
  pages: BookPage[]
}

export interface BookPage {
  title?: string
  text?: string
  imageUrl?: string
  caption?: string
}

export interface Location {
  id: string
  name: string
}
