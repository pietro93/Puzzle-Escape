"use client"

import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import Image from "next/image"
import type { Book as BookType } from "./types"
import { useState } from "react"

interface BookModalProps {
  book: BookType | null
  currentPage: number
  currentSection: string | null
  onClose: () => void
  onNextPage: () => void
  onPrevPage: () => void
  onSwitchSection: (sectionId: string) => void
  getCurrentContent: () => any
  getTotalPages: () => number
}

export function BookModal({
  book,
  currentPage,
  currentSection,
  onClose,
  onNextPage,
  onPrevPage,
  onSwitchSection,
  getCurrentContent,
  getTotalPages,
}: BookModalProps) {
  const [viewMode, setViewMode] = useState<"normal" | "category">("normal")
  const [selectedCategorySystem, setSelectedCategorySystem] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedDemon, setSelectedDemon] = useState<string | null>(null)

  if (!book) return null

  const content = getCurrentContent()
  const totalPages = getTotalPages()

  // Find the demon title in the current page
  const currentDemonTitle = content?.title || null

  // Handle category system selection
  const handleCategorySystemSelect = (systemId: string) => {
    setSelectedCategorySystem(systemId)
    setSelectedCategory(null)
    setSelectedDemon(null)
    setViewMode("category")
  }

  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setSelectedDemon(null)
  }

  // Handle demon selection from category
  const handleDemonSelect = (demonSymbol: string) => {
    setSelectedDemon(demonSymbol)

    // Find the page index for this demon
    if (book.pages) {
      const pageIndex = book.pages.findIndex((page) => page.title === demonSymbol && page.imageUrl)
      if (pageIndex >= 0) {
        // Switch to normal view and go to that page
        setViewMode("normal")
        // We need to use the onSwitchSection function to navigate to the right page
        // This is a bit of a hack since we're reusing the section navigation for categories
        onSwitchSection("main")
        // Set the current page directly - this might need adjustment based on your book system
        // You might need to add a new function to the props to handle direct page navigation
        // For now, we'll just use the existing navigation functions multiple times
        let currentIdx = currentPage
        if (pageIndex > currentIdx) {
          while (currentIdx < pageIndex) {
            onNextPage()
            currentIdx++
          }
        } else if (pageIndex < currentIdx) {
          while (currentIdx > pageIndex) {
            onPrevPage()
            currentIdx--
          }
        }
      }
    }
  }

  // Get the current category system
  const currentCategorySystem = book.categorySystems?.find((system) => system.id === selectedCategorySystem)

  // Get the current category
  const currentCategory = currentCategorySystem?.categories.find((category) => category.id === selectedCategory)

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-200 font-pixel">{book.title}</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 font-pixel text-sm hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* View mode toggle */}
        <div className="flex mb-4 border-b border-gray-700">
          <button
            onClick={() => setViewMode("normal")}
            className={`px-4 py-2 ${
              viewMode === "normal"
                ? "text-purple-300 font-pixel text-sm border-b-2 border-purple-300"
                : "text-gray-400 font-pixel text-sm hover:text-gray-200"
            }`}
          >
            Pages
          </button>
          <button
            onClick={() => {
              setViewMode("category")
              setSelectedCategorySystem(null)
              setSelectedCategory(null)
            }}
            className={`px-4 py-2 ${
              viewMode === "category"
                ? "text-purple-300 font-pixel text-sm border-b-2 border-purple-300"
                : "text-gray-400 font-pixel text-sm hover:text-gray-200"
            }`}
          >
            Categories
          </button>
        </div>

        {/* Category view */}
        {viewMode === "category" && (
          <div className="p-4 bg-gray-800 rounded-lg">
            {!selectedCategorySystem && (
              <>
                <h4 className="text-lg font-medium text-purple-300 font-pixel mb-4">Select Category System</h4>
                <div className="grid grid-cols-1 gap-2">
                  {book.categorySystems?.map((system) => (
                    <button
                      key={system.id}
                      onClick={() => handleCategorySystemSelect(system.id)}
                      className="text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-md text-gray-200 font-pixel"
                    >
                      {system.name}
                    </button>
                  ))}
                </div>
              </>
            )}

            {selectedCategorySystem && !selectedCategory && (
              <>
                <div className="flex items-center mb-4">
                  <button
                    onClick={() => setSelectedCategorySystem(null)}
                    className="text-purple-300 font-pixel text-sm hover:text-purple-200 mr-2"
                  >
                    ← Back
                  </button>
                  <h4 className="text-lg font-medium text-purple-300 font-pixel">{currentCategorySystem?.name}</h4>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {currentCategorySystem?.categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category.id)}
                      className="text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-md text-gray-200 font-pixel"
                    >
                      {category.name} ({category.entries.length})
                    </button>
                  ))}
                </div>
              </>
            )}

            {selectedCategorySystem && selectedCategory && (
              <>
                <div className="flex items-center mb-4">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="text-purple-300 font-pixel text-sm hover:text-purple-200 mr-2"
                  >
                    ← Back
                  </button>
                  <h4 className="text-lg font-medium text-purple-300 font-pixel">{currentCategory?.name}</h4>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {currentCategory?.entries.map((demonSymbol) => {
                    // Find the demon's page to get its image
                    const demonPage = book.pages.find((page) => page.title === demonSymbol && page.imageUrl)
                    const demonTextPage = book.pages.find((page) => page.title === demonSymbol && page.text)

                    // Extract the demon name from the text if available
                    let demonName = demonSymbol
                    if (demonTextPage?.text) {
                      const originMatch = demonTextPage.text.match(/<b>Origin:<\/b>(.*?)\./)
                      if (originMatch && originMatch[1]) {
                        // The name is likely at the beginning of the origin text
                        const nameParts = originMatch[1].trim().split(" ")
                        // Take the last word which is often the demon name
                        demonName = nameParts[nameParts.length - 1]
                      }
                    }

                    return (
                      <button
                        key={demonSymbol}
                        onClick={() => handleDemonSelect(demonSymbol)}
                        className="flex items-center p-3 bg-gray-700 hover:bg-gray-600 rounded-md text-gray-200 font-pixel"
                      >
                        {demonPage?.imageUrl && (
                          <div className="relative w-12 h-12 mr-3">
                            <Image
                              src={demonPage.imageUrl || "/placeholder.svg"}
                              alt={demonName}
                              fill
                              className="rounded-md object-cover"
                            />
                          </div>
                        )}
                        <span>{demonSymbol}</span>
                      </button>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* Normal book view */}
        {viewMode === "normal" && (
          <>
            {/* Section tabs for books with sections */}
            {book.sections && (
              <div className="flex mb-4 border-b border-gray-700 overflow-x-auto">
                {book.sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => onSwitchSection(section.id)}
                    className={`px-4 py-2 whitespace-nowrap ${
                      currentSection === section.id
                        ? "text-purple-300 font-pixel text-sm border-b-2 border-purple-300"
                        : "text-gray-400 font-pixel text-sm hover:text-gray-200"
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </div>
            )}

            {/* Book content */}
            {content && (
              <div className="p-4 bg-gray-800 rounded-lg">
                {content.title && <h4 className="text-lg font-medium text-red-500 font-pixel mb-4">{content.title}</h4>}

                {content.imageUrl && (
                  <div className="mb-4 flex flex-col items-center">
                    <div className="relative" style={content.imageStyle || { width: "300px", height: "300px" }}>
                      <Image
                        src={content.imageUrl || "/placeholder.svg"}
                        alt={content.caption || content.title || "Book illustration"}
                        fill
                        className="rounded-md pixelated object-contain"
                      />
                    </div>
                    {content.caption && (
                      <p className="text-gray-300 font-pixel text-sm mt-2 text-center italic leading-relaxed">
                        {content.caption}
                      </p>
                    )}
                  </div>
                )}

                {content.text && (
                  <div
                    className="text-gray-300 font-pixel text-sm leading-relaxed space-y-4"
                    dangerouslySetInnerHTML={{
                      __html: content.text
                        .replace(/<b>(.*?):<\/b>/g, '<b class="text-purple-400">$1:</b>')
                        .replace(/\n\n/g, "</p><p>")
                        .replace(/^(.+)/, "<p>$1</p>"),
                    }}
                  />
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={onPrevPage}
                disabled={currentPage === 0}
                className="font-pixel text-sm"
              >
                Previous Page
              </Button>
              <span className="text-gray-400 font-pixel text-sm">
                Page {currentPage + 1} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={onNextPage}
                disabled={currentPage === totalPages - 1}
                className="font-pixel text-sm"
              >
                Next Page
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
