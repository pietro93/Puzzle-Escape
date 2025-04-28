"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import type { Book } from "./types"

interface BookModalProps {
  isOpen: boolean
  onClose: () => void
  book: Book
}

export function BookModal({ isOpen, onClose, book }: BookModalProps) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)

  if (!isOpen) return null

  const currentSection = book.sections[currentSectionIndex]
  const currentPage = currentSection.pages[currentPageIndex]

  const handleNextPage = () => {
    if (currentPageIndex < currentSection.pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1)
    } else if (currentSectionIndex < book.sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1)
      setCurrentPageIndex(0)
    }
  }

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1)
    } else if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1)
      setCurrentPageIndex(book.sections[currentSectionIndex - 1].pages.length - 1)
    }
  }

  const handleSectionChange = (sectionIndex: number) => {
    setCurrentSectionIndex(sectionIndex)
    setCurrentPageIndex(0)
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 p-4 rounded border border-gray-700 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <div className="text-xl text-gray-300 font-pixel">{book.title}</div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Section tabs */}
        <div className="flex mb-4 overflow-x-auto pb-2">
          {book.sections.map((section, index) => (
            <Button
              key={section.id}
              variant={currentSectionIndex === index ? "default" : "outline"}
              size="sm"
              onClick={() => handleSectionChange(index)}
              className="mr-2 whitespace-nowrap"
            >
              {section.title}
            </Button>
          ))}
        </div>

        {/* Page content */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Image */}
          {currentPage.imageUrl && (
            <div className="flex-shrink-0 flex justify-center items-start">
              <div className="relative w-48 h-48 pixelated-container">
                <Image
                  src={currentPage.imageUrl || "/placeholder.svg"}
                  alt={currentPage.title}
                  fill
                  className="pixelated object-contain"
                />
              </div>
            </div>
          )}

          {/* Text content */}
          <div className="flex-grow">
            <h3 className="text-lg text-gray-300 mb-2 font-pixel">{currentPage.title}</h3>
            <div
              className="text-gray-400 text-sm font-pixel space-y-2"
              dangerouslySetInnerHTML={{ __html: currentPage.text }}
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevPage}
            disabled={currentSectionIndex === 0 && currentPageIndex === 0}
            className="text-gray-300"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          <div className="text-gray-400 text-sm">
            Page {currentPageIndex + 1} of {currentSection.pages.length}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={
              currentSectionIndex === book.sections.length - 1 &&
              currentPageIndex === book.sections[book.sections.length - 1].pages.length - 1
            }
            className="text-gray-300"
          >
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}
