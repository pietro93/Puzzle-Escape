"use client"

import { useState, useEffect } from "react"
import type { Book } from "@/components/murder-mystery/types"

export function useBookSystem() {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [currentSection, setCurrentSection] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (isOpen && selectedBook && selectedBook.sections && selectedBook.sections.length > 0) {
      // Set initial section and page
      const initialSection = selectedBook.sections[0]?.id || ""
      setCurrentSection(initialSection)

      // Assuming pages also have an id
      // const initialPage = selectedBook.sections[0]?.pages[0]?.id || '';
      // setCurrentPage(initialPage);
      setCurrentPage(0) // Reset to the first page index (0)
    }
  }, [isOpen, selectedBook])

  const openBook = (book: Book) => {
    setSelectedBook(book)
    setCurrentPage(0)
    setIsOpen(true)

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
    setIsOpen(false)
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
      const allPages = selectedBook.sections.flatMap((section) => section.pages)

      // Sort pages alphabetically by title
      const sortedPages = [...allPages].sort((a, b) => {
        if (a.title && b.title) {
          return a.title.localeCompare(b.title)
        }
        return 0
      })

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
