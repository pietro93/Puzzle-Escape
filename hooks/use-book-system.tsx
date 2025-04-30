"use client"

import { useState, useCallback } from "react"
import { BookModal } from "@/components/murder-mystery/book-modal"
import type { Book } from "@/components/murder-mystery/types"

export function useBookSystem() {
  const [currentBook, setCurrentBook] = useState<Book | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [currentSection, setCurrentSection] = useState<string | null>(null)

  const openBook = useCallback((book: Book) => {
    setCurrentBook(book)
    setCurrentPage(0)
    setCurrentSection(null)
  }, [])

  const closeBook = useCallback(() => {
    setCurrentBook(null)
    setCurrentPage(0)
    setCurrentSection(null)
  }, [])

  const nextPage = useCallback(() => {
    if (!currentBook) return

    const totalPages = getTotalPages()
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1)
    }
  }, [currentBook, currentPage])

  const prevPage = useCallback(() => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1)
    }
  }, [currentPage])

  const switchSection = useCallback((sectionId: string | null) => {
    setCurrentSection(sectionId)
    setCurrentPage(0)
  }, [])

  const getCurrentContent = useCallback(() => {
    if (!currentBook) return null

    // If a section is selected, show pages from that section
    if (currentSection && currentBook.sections) {
      const section = currentBook.sections.find((s) => s.id === currentSection)
      if (section && section.pages && section.pages.length > 0) {
        return section.pages[currentPage] || null
      }
      return null
    }

    // Otherwise, show pages from the main book
    return currentBook.pages[currentPage] || null
  }, [currentBook, currentPage, currentSection])

  const getTotalPages = useCallback(() => {
    if (!currentBook) return 0

    // If a section is selected, count pages in that section
    if (currentSection && currentBook.sections) {
      const section = currentBook.sections.find((s) => s.id === currentSection)
      return section?.pages?.length || 0
    }

    // Otherwise, count pages in the main book
    return currentBook.pages.length
  }, [currentBook, currentSection])

  const BookModalComponent = useCallback(
    () =>
      currentBook ? (
        <BookModal
          book={currentBook}
          currentPage={currentPage}
          currentSection={currentSection}
          onClose={closeBook}
          onNextPage={nextPage}
          onPrevPage={prevPage}
          onSwitchSection={switchSection}
          getCurrentContent={getCurrentContent}
          getTotalPages={getTotalPages}
        />
      ) : null,
    [
      currentBook,
      currentPage,
      currentSection,
      closeBook,
      nextPage,
      prevPage,
      switchSection,
      getCurrentContent,
      getTotalPages,
    ],
  )

  return {
    currentBook,
    openBook,
    closeBook,
    BookModalComponent,
  }
}
