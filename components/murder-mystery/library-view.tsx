"use client"

import { useState } from "react"
import { Book } from "lucide-react"
import type { Book as BookType } from "./types"
import { Button } from "@/components/ui/button"

interface LibraryViewProps {
  onOpenBook: (book: BookType) => void
  demonologyBook: BookType
  botanyBook: BookType
}

export function LibraryView({ onOpenBook, demonologyBook, botanyBook }: LibraryViewProps) {
  const [showDialogue, setShowDialogue] = useState(true)
  const [selectedBook, setSelectedBook] = useState<BookType | null>(null)

  // Handle book selection in dialogue
  const handleBookSelection = (book: BookType) => {
    setSelectedBook(book)
  }

  // Confirm book selection and open it
  const confirmBookSelection = () => {
    if (selectedBook) {
      onOpenBook(selectedBook)
      setShowDialogue(false)
    }
  }

  // Reset dialogue
  const resetDialogue = () => {
    setSelectedBook(null)
    setShowDialogue(true)
  }

  return (
    <div className="text-gray-300 bg-black p-4">
      {showDialogue ? (
        <div className="mb-4">
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 mb-4">
            <p className="font-pixel text-yellow-200 mb-2">Librarian Priya:</p>
            <p className="font-pixel text-gray-200">
              "Namaste, welcome to our library! I was just organizing these books. These two are quite interesting,
              haan? One is about demons and the other about plants. Which one would you like to see? Both are very good,
              very good."
            </p>
          </div>

          <div className="grid gap-2 mt-4">
            <Button
              variant="outline"
              className={`text-left p-2 rounded font-pixel transition-colors hover:bg-gray-700 ${selectedBook?.title === "Demonology" ? "bg-gray-700" : ""}`}
              onClick={() => handleBookSelection(demonologyBook)}
            >
              "I'd like to see the Demonology book, please."
            </Button>

            <Button
              variant="outline"
              className={`text-left p-2 rounded font-pixel transition-colors hover:bg-gray-700 ${selectedBook?.title === "Botany" ? "bg-gray-700" : ""}`}
              onClick={() => handleBookSelection(botanyBook)}
            >
              "I'd like to see the Botany book, please."
            </Button>

            {selectedBook && (
              <Button variant="default" className="mt-2 font-pixel" onClick={confirmBookSelection}>
                Open the {selectedBook.title} book
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div>
          <p>The library contains thousands of books on various subjects.</p>
          <p className="mt-2">Two books catch your attention:</p>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div
              className="bg-gray-900 p-3 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors"
              onClick={() => onOpenBook(demonologyBook)}
            >
              <div className="flex items-center gap-2">
                <Book className="text-red-400" />
                <h3 className="font-semibold text-red-300">Demonology</h3>
              </div>
              <p className="text-sm mt-2">A comprehensive guide to supernatural creatures that feed on humans.</p>
            </div>

            <div
              className="bg-gray-900 p-3 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors"
              onClick={() => onOpenBook(botanyBook)}
            >
              <div className="flex items-center gap-2">
                <Book className="text-green-400" />
                <h3 className="font-semibold text-green-300">Botany</h3>
              </div>
              <p className="text-sm mt-2">An encyclopedia of plants, including many poisonous varieties.</p>
            </div>
          </div>

          <Button variant="outline" className="mt-4 font-pixel" onClick={resetDialogue}>
            Talk to the librarian again
          </Button>
        </div>
      )}
    </div>
  )
}
