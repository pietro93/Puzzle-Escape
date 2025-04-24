export interface Book {
  title: string
  pages: any[] // Replace 'any' with a more specific type if possible
  sections?: {
    id: string
    title: string
    pages: any[] // Replace 'any' with a more specific type if possible
  }[]
}

export interface Location {
  id: string
  name: string
}
