// Types for the murder mystery puzzle
export interface DialogueOption {
  id: string
  text: string
  response: string
  followUp?: DialogueOption[]
  condition?: string
  action?: string
  specialAction?: () => void
}

export interface Location {
  id: string
  name: string
}

export interface AutopsyReportPage {
  title: string
  content: string
}

export interface BookPage {
  title?: string
  text?: string
  imageUrl?: string
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
