"use client"

import { useState } from "react"
import { Book } from "lucide-react"
import type { Book as BookType } from "../../types/book-types"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface LibraryViewProps {
  onOpenBook: (book: BookType) => void
  books: {
    demonologyBook: BookType
    botanyBook: BookType
    bloodDiseasesBook: BookType
    serialKillersBook: BookType
  }
}

export function LibraryView({ onOpenBook, books }: LibraryViewProps) {
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
              "Namaste, welcome to our library! I was just organizing these books. We have quite a collection here,
              haan? There's one about demons, another about plants, and I've just shelved these medical texts on blood
              diseases and criminal psychology. Which one would you like to see? All are very informative, very good."
            </p>
          </div>

          <div className="grid gap-2 mt-4">
            <Button
              variant="outline"
              className={`text-left p-2 rounded font-pixel transition-colors hover:bg-gray-700 ${selectedBook?.title === books.demonologyBook.title ? "bg-gray-700" : ""}`}
              onClick={() => handleBookSelection(books.demonologyBook)}
            >
              "I'd like to see the Demonology book, please."
            </Button>

            <Button
              variant="outline"
              className={`text-left p-2 rounded font-pixel transition-colors hover:bg-gray-700 ${selectedBook?.title === books.botanyBook.title ? "bg-gray-700" : ""}`}
              onClick={() => handleBookSelection(books.botanyBook)}
            >
              "I'd like to see the Botany book, please."
            </Button>

            <Button
              variant="outline"
              className={`text-left p-2 rounded font-pixel transition-colors hover:bg-gray-700 ${selectedBook?.title === books.bloodDiseasesBook.title ? "bg-gray-700" : ""}`}
              onClick={() => handleBookSelection(books.bloodDiseasesBook)}
            >
              "I'm interested in the book about blood diseases."
            </Button>

            <Button
              variant="outline"
              className={`text-left p-2 rounded font-pixel transition-colors hover:bg-gray-700 ${selectedBook?.title === books.serialKillersBook.title ? "bg-gray-700" : ""}`}
              onClick={() => handleBookSelection(books.serialKillersBook)}
            >
              "The criminal psychology book sounds interesting."
            </Button>

            {selectedBook && (
              <Button variant="default" className="mt-2 font-pixel" onClick={confirmBookSelection}>
                Open the {selectedBook.title.split(":")[0]} book
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div>
          <p>The library contains thousands of books on various subjects.</p>
          <p className="mt-2">Four books catch your attention:</p>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div
              className="bg-gray-900 p-3 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors"
              onClick={() => onOpenBook(books.demonologyBook)}
            >
              <div className="flex items-center gap-2">
                <Book className="text-red-400" />
                <h3 className="font-semibold text-red-300">Demonology</h3>
              </div>
              <div className="mt-2 h-24 relative">
                <Image
                  src="/images/murder-mystery/books/demonology.webp"
                  alt="Demonology Book"
                  width={100}
                  height={100}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
            </div>

            <div
              className="bg-gray-900 p-3 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors"
              onClick={() => onOpenBook(books.botanyBook)}
            >
              <div className="flex items-center gap-2">
                <Book className="text-green-400" />
                <h3 className="font-semibold text-green-300">Botany</h3>
              </div>
              <div className="mt-2 h-24 relative">
                <Image
                  src="/images/murder-mystery/books/botany.webp"
                  alt="Botany Book"
                  width={100}
                  height={100}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
            </div>

            <div
              className="bg-gray-900 p-3 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors"
              onClick={() => onOpenBook(books.bloodDiseasesBook)}
            >
              <div className="flex items-center gap-2">
                <Book className="text-blue-400" />
                <h3 className="font-semibold text-blue-300">Hematological Disorders</h3>
              </div>
              <div className="mt-2 h-24 relative">
                <Image
                  src="/images/murder-mystery/books/blood-diseases.webp"
                  alt="Blood Diseases Book"
                  width={100}
                  height={100}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
            </div>

            <div
              className="bg-gray-900 p-3 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors"
              onClick={() => onOpenBook(books.serialKillersBook)}
            >
              <div className="flex items-center gap-2">
                <Book className="text-purple-400" />
                <h3 className="font-semibold text-purple-300">Criminal Psychology</h3>
              </div>
              <div className="mt-2 h-24 relative">
                <Image
                  src="/images/murder-mystery/books/serial-killers.webp"
                  alt="Serial Killers Book"
                  width={100}
                  height={100}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
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
