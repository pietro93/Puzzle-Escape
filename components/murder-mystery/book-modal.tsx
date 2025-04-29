"use client"

import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import Image from "next/image"
import type { Book as BookType } from "./types"

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
  if (!book) return null

  const content = getCurrentContent()
  const totalPages = getTotalPages()

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
      </div>
    </div>
  )
}
