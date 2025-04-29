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
  imageStyle?: {
    width: string
    height: string
  }
}

export interface Location {
  id: string
  name: string
}
