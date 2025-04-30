export interface BookPage {
  title?: string
  text?: string
  imageUrl?: string
}

export interface BookCategory {
  id: string
  name: string
  entries: string[] // Array of demon symbol combinations that belong to this category
}

export interface BookCategorySystem {
  id: string
  name: string
  categories: BookCategory[]
}

export interface Book {
  title: string
  pages: BookPage[]
  sections?: {
    id: string
    title: string
    pages: BookPage[]
  }[]
  categorySystems?: BookCategorySystem[] // New field for category systems
}
