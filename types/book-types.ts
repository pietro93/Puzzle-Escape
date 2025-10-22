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
