"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { useRef } from "react"
import type { Book as BookType } from "./types"

interface BookModalProps {
  book: BookType | null
  currentPage: number
  currentSection: string | null
  onClose: () => void
  onNextPage: () => void
  onPrevPage: () => void
  onSwitchSection: (sectionId: string | null) => void
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
  const geoCarouselRef = useRef<HTMLDivElement>(null)
  const typeCarouselRef = useRef<HTMLDivElement>(null)

  if (!book) return null

  const content = getCurrentContent()
  const totalPages = getTotalPages()

  // Define which sections belong to each category type
  const geographicalSections = [
    "east-asia",
    "europe",
    "judeo-christian",
    "middle-east-persia",
    "oceanic",
    "slavic-eastern-europe",
    "south-southeast-asia",
    "sub-saharan-africa",
    "the-americas",
  ]

  const typeSections = [
    "cannibalistic",
    "child-predating",
    "demons",
    "monstrous",
    "shape-shifting",
    "undead-spirits",
    "vampiric",
    "witchcraft",
  ]

  // Check if this is the botany book
  const isBotanyBook = book.title === "Plant Identification Manual"

  // Scroll functions for carousels
  const scrollCarousel = (carouselRef: React.RefObject<HTMLDivElement>, direction: "left" | "right") => {
    if (!carouselRef.current) return

    const scrollAmount = 200 // Adjust as needed
    const scrollLeft = carouselRef.current.scrollLeft

    carouselRef.current.scrollTo({
      left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
      behavior: "smooth",
    })
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 w-full max-w-2xl">
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

        {/* Section tabs for books with sections */}
        {book.sections && (
          <div className="mb-4 space-y-3">
            {/* Botany Book Tabs - Simple horizontal tabs */}
            {isBotanyBook && (
              <div className="flex justify-center space-x-4">
                {book.sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => onSwitchSection(section.id)}
                    className={`px-3 py-1.5 whitespace-nowrap rounded-md transition-colors ${
                      currentSection === section.id
                        ? "bg-green-900/50 text-green-300 font-pixel border border-green-300"
                        : "text-green-200/70 font-pixel hover:text-green-200 hover:bg-green-900/30 border border-green-900/30"
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </div>
            )}

            {/* Demonology Book Categories - Carousels */}
            {!isBotanyBook && (
              <>
                {/* Geographical Origin Categories (First Carousel) */}
                <div className="relative">
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-0 z-10 bg-gray-900/80 hover:bg-gray-800"
                      onClick={() => scrollCarousel(geoCarouselRef, "left")}
                    >
                      <ChevronLeft className="h-4 w-4 text-purple-300" />
                    </Button>

                    <div
                      ref={geoCarouselRef}
                      className="flex overflow-x-auto py-2 px-8 space-x-2 w-full scroll-smooth"
                      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                      {book.sections
                        .filter((section) => geographicalSections.includes(section.id))
                        .map((section) => (
                          <button
                            key={section.id}
                            onClick={() =>
                              currentSection === section.id ? onSwitchSection(null) : onSwitchSection(section.id)
                            }
                            className={`px-3 py-1.5 whitespace-nowrap rounded-md transition-colors flex-shrink-0 ${
                              currentSection === section.id
                                ? "bg-purple-900/50 text-purple-300 font-pixel border border-purple-300"
                                : "text-purple-200/70 font-pixel hover:text-purple-200 hover:bg-purple-900/30 border border-purple-900/30"
                            }`}
                          >
                            {section.title}
                          </button>
                        ))}
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 z-10 bg-gray-900/80 hover:bg-gray-800"
                      onClick={() => scrollCarousel(geoCarouselRef, "right")}
                    >
                      <ChevronRight className="h-4 w-4 text-purple-300" />
                    </Button>
                  </div>
                </div>

                {/* Type/Nature Categories (Second Carousel) */}
                <div className="relative">
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-0 z-10 bg-gray-900/80 hover:bg-gray-800"
                      onClick={() => scrollCarousel(typeCarouselRef, "left")}
                    >
                      <ChevronLeft className="h-4 w-4 text-red-300" />
                    </Button>

                    <div
                      ref={typeCarouselRef}
                      className="flex overflow-x-auto py-2 px-8 space-x-2 w-full scroll-smooth"
                      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                      {book.sections
                        .filter((section) => typeSections.includes(section.id))
                        .map((section) => (
                          <button
                            key={section.id}
                            onClick={() =>
                              currentSection === section.id ? onSwitchSection(null) : onSwitchSection(section.id)
                            }
                            className={`px-3 py-1.5 whitespace-nowrap rounded-md transition-colors flex-shrink-0 ${
                              currentSection === section.id
                                ? "bg-red-900/50 text-red-300 font-pixel border border-red-300"
                                : "text-red-200/70 font-pixel hover:text-red-200 hover:bg-red-900/30 border border-red-900/30"
                            }`}
                          >
                            {section.title}
                          </button>
                        ))}
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 z-10 bg-gray-900/80 hover:bg-gray-800"
                      onClick={() => scrollCarousel(typeCarouselRef, "right")}
                    >
                      <ChevronRight className="h-4 w-4 text-red-300" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Book content */}
        {content && (
          <div className="p-4 bg-[#f5f2e8] rounded-lg">
            {content.title && <h4 className="text-lg font-medium text-red-700 font-pixel mb-4">{content.title}</h4>}

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
                  <p className="text-gray-700 font-pixel text-sm mt-2 text-center italic leading-relaxed">
                    {content.caption}
                  </p>
                )}
              </div>
            )}

            {content.text && (
              <div
                className="text-gray-800 font-pixel text-sm leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{
                  __html: content.text
                    .replace(/<b>(.*?):<\/b>/g, '<b class="text-purple-800">$1:</b>')
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
      </div>
    </div>
  )
}
