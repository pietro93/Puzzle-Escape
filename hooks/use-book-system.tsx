"use client"

import { useState, useCallback } from "react"
import { botanyBook } from "@/data/books/botany"
import { demonologyBook } from "@/data/books/demonology"
import { useAudio } from "@/hooks/use-audio"

export function useBookSystem() {
  const [currentBook, setCurrentBook] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [currentSection, setCurrentSection] = useState<string | null>(null)
  const { playSound } = useAudio()

  const openBook = useCallback(
    (bookId: string) => {
      playSound("button-click")
      let book

      if (bookId === "botany") {
        book = botanyBook
        // For botany book, always select "plants" section by default
        setCurrentSection("plants")
      } else if (bookId === "demonology") {
        book = demonologyBook
        setCurrentSection(null)
      } else {
        return
      }

      setCurrentBook(book)
      setCurrentPage(0)
    },
    [playSound],
  )

  const closeBook = useCallback(() => {
    playSound("button-click")
    setCurrentBook(null)
    setCurrentPage(0)
    setCurrentSection(null)
  }, [playSound])

  const nextPage = useCallback(() => {
    playSound("button-click")
    if (!currentBook) return

    const totalPages = getTotalPages()
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    }
  }, [currentBook, currentPage, playSound])

  const prevPage = useCallback(() => {
    playSound("button-click")
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }, [currentPage, playSound])

  const switchSection = useCallback(
    (sectionId: string | null) => {
      playSound("button-click")

      // For botany book, don't allow null section
      if (currentBook === botanyBook && sectionId === null) {
        return
      }

      setCurrentSection(sectionId)
      setCurrentPage(0)
    },
    [currentBook, playSound],
  )

  const getCurrentContent = useCallback(() => {
    if (!currentBook) return null

    // If we have a section selected, show content from that section
    if (currentSection && currentBook.sections) {
      const section = currentBook.sections.find((s) => s.id === currentSection)
      if (section && section.pages && section.pages.length > currentPage) {
        return section.pages[currentPage]
      }
      return null
    }

    // If no section is selected but the book has pages, show those
    if (currentBook.pages && currentBook.pages.length > currentPage) {
      return currentBook.pages[currentPage]
    }

    return null
  }, [currentBook, currentSection, currentPage])

  const getTotalPages = useCallback(() => {
    if (!currentBook) return 0

    // If we have a section selected, count pages in that section
    if (currentSection && currentBook.sections) {
      const section = currentBook.sections.find((s) => s.id === currentSection)
      if (section && section.pages) {
        return section.pages.length
      }
      return 0
    }

    // If no section is selected but the book has pages, count those
    if (currentBook.pages) {
      return currentBook.pages.length
    }

    return 0
  }, [currentBook, currentSection])

  return {
    currentBook,
    currentPage,
    currentSection,
    openBook,
    closeBook,
    nextPage,
    prevPage,
    switchSection,
    getCurrentContent,
    getTotalPages,
  }
}
