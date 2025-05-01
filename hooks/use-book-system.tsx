"use client"

import { useState, useEffect } from "react"
import type { Book } from "@/components/murder-mystery/types"

export function useBookSystem() {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [currentSection, setCurrentSection] = useState<string | null>(null)
  const [sortedPages, setSortedPages] = useState<any[]>([])

  // Effect to handle sorting pages when book or section changes
  useEffect(() => {
    if (!selectedBook) return

    // If no section is selected and the book has sections
    if (!currentSection && selectedBook.sections) {
      const allDemonEntries: { title: string; pages: any[] }[] = []

      // First, collect all demon entries (pairs of image + text pages)
      for (const section of selectedBook.sections) {
        for (let i = 0; i < section.pages.length; i += 2) {
          if (i + 1 < section.pages.length) {
            // Check if this is a pair with matching titles
            if (section.pages[i].title === section.pages[i + 1].title) {
              allDemonEntries.push({
                title: section.pages[i].title || "",
                pages: [section.pages[i], section.pages[i + 1]],
              })
            }
          }
        }
      }

      // Sort entries alphabetically by title
      allDemonEntries.sort((a, b) => a.title.localeCompare(b.title))

      // Flatten the sorted entries into a single array of pages
      const flattenedPages = allDemonEntries.flatMap((entry) => entry.pages)

      setSortedPages(flattenedPages)
    } else {
      // If a section is selected or the book doesn't have sections
      setSortedPages([])
    }
  }, [selectedBook, currentSection])

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
    setSortedPages([])
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

    // If no section is selected but we have sorted pages
    if (!currentSection && sortedPages.length > 0) {
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

    // If no section is selected but we have sorted pages
    if (!currentSection && sortedPages.length > 0) {
      return sortedPages.length
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
