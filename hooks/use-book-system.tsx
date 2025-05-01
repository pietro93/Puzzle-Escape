"use client"

import { useState } from "react"
import type { Book } from "@/components/murder-mystery/types"

export function useBookSystem() {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [currentSection, setCurrentSection] = useState<string | null>(null)

  const openBook = (book: Book) => {
    setSelectedBook(book)
    setCurrentPage(0)

    // For botany book, always select "plants" section by default
    if (book.title === "Plant Identification Manual") {
      setCurrentSection("plants")
    } else {
      // For other books, start with no section selected
      setCurrentSection(null)
    }
  }

  const closeBook = () => {
    setSelectedBook(null)
    setCurrentPage(0)
    setCurrentSection(null)
  }

  const nextPage = () => {
    if (selectedBook) {
      const totalPages = getTotalPages()
      if (currentPage < totalPages - 1) {
        setCurrentPage(currentPage + 1)
      }
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const switchSection = (sectionId: string | null) => {
    // For botany book, don't allow null section
    if (selectedBook?.title === "Plant Identification Manual" && sectionId === null) {
      return
    }

    setCurrentSection(sectionId)
    setCurrentPage(0)
  }

  const handleSwitchSection = (sectionId: string) => {
    setCurrentSection(sectionId)
    setCurrentPage(0)
  }

  const getCurrentContent = () => {
    if (!selectedBook) return null

    // If a section is selected and the book has sections
    if (currentSection && selectedBook.sections) {
      const section = selectedBook.sections.find((s) => s.id === currentSection)
      if (section && section.pages.length > currentPage) {
        return section.pages[currentPage]
      }
      return null
    }

    // If no section is selected but the book has sections, show all pages alphabetically
    if (!currentSection && selectedBook.sections) {
      // Collect all pages from all sections
      const allPages = []

      // For each section, collect pairs of pages (image + text)
      for (const section of selectedBook.sections) {
        for (let i = 0; i < section.pages.length; i += 2) {
          if (i + 1 < section.pages.length) {
            // If this is an image page followed by a text page with the same title
            if (
              section.pages[i].imageUrl &&
              section.pages[i + 1].text &&
              section.pages[i].title === section.pages[i + 1].title
            ) {
              // Add both pages as a pair
              allPages.push({
                title: section.pages[i].title,
                pages: [section.pages[i], section.pages[i + 1]],
              })
            }
          }
        }
      }

      // Sort pairs alphabetically by title
      const sortedPairs = [...allPages].sort((a, b) => {
        if (a.title && b.title) {
          return a.title.localeCompare(b.title)
        }
        return 0
      })

      // Flatten the sorted pairs back into a single array
      const sortedPages = sortedPairs.flatMap((pair) => pair.pages)

      // Return the current page from the sorted list
      if (sortedPages.length > currentPage) {
        return sortedPages[currentPage]
      }
      return null
    }

    // For books without sections
    if (selectedBook.pages && selectedBook.pages.length > currentPage) {
      return selectedBook.pages[currentPage]
    }

    return null
  }

  const getTotalPages = () => {
    if (!selectedBook) return 0

    // If a section is selected and the book has sections
    if (currentSection && selectedBook.sections) {
      const section = selectedBook.sections.find((s) => s.id === currentSection)
      return section ? section.pages.length : 0
    }

    // If no section is selected but the book has sections, count all pages
    if (!currentSection && selectedBook.sections) {
      // Count all pages from all sections
      const allPagesCount = selectedBook.sections.reduce((total, section) => total + section.pages.length, 0)
      return allPagesCount
    }

    // For books without sections
    return selectedBook.pages ? selectedBook.pages.length : 0
  }

  return {
    selectedBook,
    currentPage,
    currentSection,
    openBook,
    closeBook,
    nextPage,
    prevPage,
    switchSection,
    getCurrentContent,
    getTotalPages,
    onSwitchSection: handleSwitchSection,
  }
}
