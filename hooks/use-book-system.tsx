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

    // If it's a book with sections, set the initial section
    if (book.sections && book.sections.length > 0) {
      setCurrentSection(book.sections[0].id)
    } else {
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
      if (selectedBook.sections && currentSection) {
        // For books with sections
        const currentSectionObj = selectedBook.sections.find((s) => s.id === currentSection)
        if (currentSectionObj && currentPage < currentSectionObj.pages.length - 1) {
          setCurrentPage(currentPage + 1)
        }
      } else {
        // For regular books
        if (currentPage < selectedBook.pages.length - 1) {
          setCurrentPage(currentPage + 1)
        }
      }
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const switchSection = (sectionId: string) => {
    setCurrentSection(sectionId)
    setCurrentPage(0)
  }

  const handleSwitchSection = (sectionId: string) => {
    setCurrentSection(sectionId)
    setCurrentPage(0)
  }

  const getCurrentContent = () => {
    if (!selectedBook) return null

    if (currentSection && selectedBook.sections) {
      const section = selectedBook.sections.find((s) => s.id === currentSection)
      if (section && section.pages.length > currentPage) {
        return section.pages[currentPage]
      }
      return null
    }

    if (selectedBook.pages.length > currentPage) {
      return selectedBook.pages[currentPage]
    }

    return null
  }

  const getTotalPages = () => {
    if (!selectedBook) return 0

    if (currentSection && selectedBook.sections) {
      const section = selectedBook.sections.find((s) => s.id === currentSection)
      return section ? section.pages.length : 0
    }

    return selectedBook.pages.length
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
