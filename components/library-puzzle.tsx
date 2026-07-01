"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { X, Eraser } from "lucide-react"
import FamilyTreeScroll from "@/components/family-tree-scroll"

const HIGHLIGHTS_STORAGE_KEY = "puzzle-escape-library-highlights"

const MIN_CLAUSE_WORDS = 4

function splitIntoSentences(paragraph: string): string[] {
  const sentenceChunks = paragraph.match(/[^.!?;]+[.!?;]+["']?\s*|[^.!?;]+$/g) ?? [paragraph]
  const result: string[] = []

  for (const chunk of sentenceChunks) {
    const commaParts = chunk.match(/[^,]+,\s*|[^,]+$/g) ?? [chunk]
    for (const part of commaParts) {
      const wordCount = part.trim().split(/\s+/).filter(Boolean).length
      if (wordCount < MIN_CLAUSE_WORDS && result.length > 0) {
        result[result.length - 1] += part
      } else {
        result.push(part)
      }
    }
  }

  return result
}

interface Book {
  id: string
  title: string
  image: string
  content: string
}

interface LibraryPuzzleProps {
  books: Book[]
}

export default function LibraryPuzzle({ books }: LibraryPuzzleProps) {
  const [activeBook, setActiveBook] = useState<string | null>(null)
  const [showFamilyTree, setShowFamilyTree] = useState(false)
  const [shuffledBooks, setShuffledBooks] = useState<Book[]>([])
  const [readBooks, setReadBooks] = useState<Set<string>>(new Set())
  const [highlights, setHighlights] = useState<Set<string>>(new Set())

  // Shuffle books on initial load (except family tree scroll)
  useEffect(() => {
    const shuffled = [...books].sort(() => Math.random() - 0.5)
    setShuffledBooks(shuffled)
  }, [books])

  // Load persisted highlights on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(HIGHLIGHTS_STORAGE_KEY)
      if (stored) setHighlights(new Set(JSON.parse(stored)))
    } catch {
      // ignore corrupt/missing storage
    }
  }, [])

  const toggleHighlight = (key: string) => {
    setHighlights((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      localStorage.setItem(HIGHLIGHTS_STORAGE_KEY, JSON.stringify(Array.from(next)))
      return next
    })
  }

  const clearHighlightsForActiveBook = () => {
    setHighlights((prev) => {
      const next = new Set(Array.from(prev).filter((key) => !key.startsWith(`${activeBook}-`)))
      localStorage.setItem(HIGHLIGHTS_STORAGE_KEY, JSON.stringify(Array.from(next)))
      return next
    })
  }

  const [pageIndex, setPageIndex] = useState(0)

  const handleBookClick = (bookId: string) => {
    setActiveBook(bookId)
    setPageIndex(0)
    setReadBooks((prev) => new Set(prev).add(bookId))
  }

  const handleCloseBook = () => {
    setActiveBook(null)
  }

  const handleFamilyTreeClick = () => {
    setShowFamilyTree(true)
  }

  const handleCloseFamilyTree = () => {
    setShowFamilyTree(false)
  }

  const getBookById = (id: string) => {
    return books.find((book) => book.id === id)
  }

  return (
    <div className="flex flex-col items-center">
      {/* Books Grid - now includes the family tree scroll */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6 w-full max-w-md">
        {/* Family Tree Scroll - always first */}
        <div
          className="flex flex-col items-center cursor-pointer transition-transform hover:scale-105 active:scale-95"
          onClick={handleFamilyTreeClick}
        >
          <div className="w-24 h-24 relative pixelated-container mb-2">
            <div className="absolute inset-0 bg-black/30 rounded-lg z-0"></div>
            <Image
              src="/images/family-tree-scroll.webp"
              alt="Family Tree Scroll"
              width={96}
              height={96}
              className="pixelated z-10 relative"
            />
            <div className="absolute -inset-1 border-2 border-gray-800 rounded-lg z-20 pointer-events-none"></div>
            {readBooks.has("family-tree") && (
              <div className="absolute -top-2 -right-2 w-5 h-5 bg-green-600 rounded-full z-30 flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
          </div>
          <p className="text-center font-pixel text-xs text-purple-300 max-w-[100px]">House Morvane Family Tree</p>
        </div>

        {/* Other books */}
        {shuffledBooks.map((book) => (
          <div
            key={book.id}
            className={`flex flex-col items-center cursor-pointer transition-transform hover:scale-105 active:scale-95 ${
              readBooks.has(book.id) ? "opacity-100" : "opacity-90"
            }`}
            onClick={() => handleBookClick(book.id)}
          >
            <div className="w-24 h-24 relative pixelated-container mb-2">
              <div className="absolute inset-0 bg-black/30 rounded-lg z-0"></div>
              <Image
                src={book.image || "/placeholder.svg"}
                alt={book.title}
                width={96}
                height={96}
                className="pixelated z-10 relative"
              />
              <div className="absolute -inset-1 border-2 border-gray-800 rounded-lg z-20 pointer-events-none"></div>
              {readBooks.has(book.id) && (
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-green-600 rounded-full z-30 flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>
            <p className="text-center font-pixel text-xs text-purple-300 max-w-[100px]">{book.title}</p>
          </div>
        ))}
      </div>

      {/* Active Book Modal */}
      {activeBook && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-gray-900 rounded-lg border-2 border-gray-700 p-5 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-pixel text-purple-300">{getBookById(activeBook)?.title}</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearHighlightsForActiveBook}
                  className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 opacity-50 hover:opacity-100 transition-opacity"
                  aria-label="Clear highlights"
                >
                  <Eraser className="w-4 h-4 text-gray-400" />
                </button>
                <button
                  onClick={handleCloseBook}
                  className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-center mb-4">
              <div className="w-20 h-20 relative pixelated-container">
                <Image
                  src={getBookById(activeBook)?.image || ""}
                  alt={getBookById(activeBook)?.title || ""}
                  width={80}
                  height={80}
                  className="pixelated"
                />
              </div>
            </div>
            {(() => {
              const content = getBookById(activeBook)?.content ?? ""
              const paragraphs = content.split(/\n\s*\n/)
              const page = paragraphs[pageIndex] ?? ""
              const sentences = splitIntoSentences(page)
              return (
                <>
                  <div className="text-gray-300 font-mono text-sm leading-relaxed min-h-[6rem]">
                    {sentences.map((sentence, sIdx) => {
                      const key = `${activeBook}-${pageIndex}-${sIdx}`
                      const isHighlighted = highlights.has(key)
                      return (
                        <span
                          key={key}
                          onClick={() => toggleHighlight(key)}
                          className={`cursor-pointer rounded-sm transition-colors duration-150 ${
                            isHighlighted ? "bg-yellow-400/40 text-yellow-100" : "hover:bg-yellow-400/15"
                          }`}
                        >
                          {sentence}
                        </span>
                      )
                    })}
                  </div>
                  {paragraphs.length > 1 && (
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-800">
                      <button
                        onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
                        disabled={pageIndex === 0}
                        className="text-xs font-pixel text-purple-300 disabled:opacity-30 disabled:cursor-not-allowed hover:text-purple-200 px-2 py-1"
                      >
                        ← Prev
                      </button>
                      <span className="text-xs font-pixel text-gray-500">
                        {pageIndex + 1} / {paragraphs.length}
                      </span>
                      <button
                        onClick={() => setPageIndex((p) => Math.min(paragraphs.length - 1, p + 1))}
                        disabled={pageIndex === paragraphs.length - 1}
                        className="text-xs font-pixel text-purple-300 disabled:opacity-30 disabled:cursor-not-allowed hover:text-purple-200 px-2 py-1"
                      >
                        Next →
                      </button>
                    </div>
                  )}
                </>
              )
            })()}
          </div>
        </div>
      )}

      {/* Family Tree Modal */}
      {showFamilyTree && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <FamilyTreeScroll onClose={handleCloseFamilyTree} />
        </div>
      )}

      <div className="text-center text-xs text-gray-400 font-pixel mt-2 animate-pulse">
        Tap on a book or the scroll to examine it
      </div>
    </div>
  )
}
