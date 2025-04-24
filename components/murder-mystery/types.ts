export interface DialogueOption {
  id: string
  text: string
  response: string
  followUp: DialogueOption[]
  condition?: string
  specialAction?: () => void
}

export interface AutopsyReportPage {
  title: string
  content: string
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

export interface BookPage {
  text?: string
  imageUrl?: string
  title?: string
}

export interface Location {
  id: string
  name: string
}
