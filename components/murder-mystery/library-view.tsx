"use client"

import { useState } from "react"
import { Book } from "lucide-react"
import type { Book as BookType } from "../../types/book-types"
import { Button } from "@/components/ui/button"

interface LibraryViewProps {
  onOpenBook: (book: BookType) => void
  demonologyBook: BookType
  botanyBook: BookType
  genghisKhanBook: BookType
  dogsInCostumesBook: BookType
}

export function LibraryView({
  onOpenBook,
  demonologyBook,
  botanyBook,
  genghisKhanBook,
  dogsInCostumesBook,
}: LibraryViewProps) {
  const [showDialogue, setShowDialogue] = useState(true)
  const [selectedBook, setSelectedBook] = useState<BookType | null>(null)
  const [showFavoriteBook, setShowFavoriteBook] = useState(false)
  const [showDogBook, setShowDogBook] = useState(false)

  // Handle book selection in dialogue
  const handleBookSelection = (book: BookType) => {
    setSelectedBook(book)
  }

  // Confirm book selection and open it
  const confirmBookSelection = () => {
    if (selectedBook) {
      onOpenBook(selectedBook)
      setShowDialogue(false)
      setShowFavoriteBook(false)
      setShowDogBook(false)
    }
  }

  // Reset dialogue
  const resetDialogue = () => {
    setSelectedBook(null)
    setShowDialogue(true)
    setShowFavoriteBook(false)
    setShowDogBook(false)
  }

  // Show librarian's favorite book
  const showLibrarianFavorite = () => {
    setShowFavoriteBook(true)
    setShowDogBook(false)
    setSelectedBook(genghisKhanBook)
  }

  // Show dog picture book
  const showLibrarianDogBook = () => {
    setShowDogBook(true)
    setShowFavoriteBook(false)
    setSelectedBook(dogsInCostumesBook)
  }

  return (
    <div className="text-gray-300 bg-black p-4">
      {showDialogue ? (
        <div className="mb-4">
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 mb-4">
            <p className="font-pixel text-yellow-200 mb-2">Librarian Priya:</p>
            {showFavoriteBook ? (
              <p className="font-pixel text-gray-200">
                "Oh! You want to know my favorite book? *Her eyes light up with enthusiasm* I simply adore this one
                about Genghis Khan! It's factual but so humorous. My family originally came from the region, you know.
                It's a good mix of history and comedy, perfect for when the library gets quiet. Here, take a look!"
              </p>
            ) : showDogBook ? (
              <p className="font-pixel text-gray-200">
                "Dogs in costumes? *She giggles* I keep this one behind the counter for when I need a smile! My nephew
                gave it to me last Diwali. It has absolutely no educational value, but sometimes during a murder
                investigation, one needs a bit of lightness, no? Here, enjoy these adorable pups!"
              </p>
            ) : (
              <p className="font-pixel text-gray-200">
                "Namaste, welcome to our library! I was just organizing these books. These two are quite interesting,
                haan? One is about demons and the other about plants. Which one would you like to see? Both are very
                good, very good."
              </p>
            )}
          </div>

          <div className="grid gap-2 mt-4">
            {!showFavoriteBook && !showDogBook ? (
              <>
                <Button
                  variant="outline"
                  className={`text-left p-2 rounded font-pixel transition-colors hover:bg-gray-700 ${selectedBook?.title === demonologyBook.title ? "bg-gray-700" : ""}`}
                  onClick={() => handleBookSelection(demonologyBook)}
                >
                  "I'd like to see the Demonology book, please."
                </Button>

                <Button
                  variant="outline"
                  className={`text-left p-2 rounded font-pixel transition-colors hover:bg-gray-700 ${selectedBook?.title === botanyBook.title ? "bg-gray-700" : ""}`}
                  onClick={() => handleBookSelection(botanyBook)}
                >
                  "I'd like to see the Botany book, please."
                </Button>

                <Button
                  variant="outline"
                  className="text-left p-2 rounded font-pixel transition-colors hover:bg-gray-700"
                  onClick={showLibrarianFavorite}
                >
                  "Can you show me your favorite book?"
                </Button>

                <Button
                  variant="outline"
                  className="text-left p-2 rounded font-pixel transition-colors hover:bg-gray-700"
                  onClick={showLibrarianDogBook}
                >
                  "I need a book with pictures of dogs."
                </Button>
              </>
            ) : (
              <Button variant="default" className="mt-2 font-pixel" onClick={confirmBookSelection}>
                Open "{selectedBook?.title.split(":")[0]}"
              </Button>
            )}

            {selectedBook && !showFavoriteBook && !showDogBook && (
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

            <div
              className="bg-gray-900 p-3 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors"
              onClick={() => onOpenBook(genghisKhanBook)}
            >
              <div className="flex items-center gap-2">
                <Book className="text-amber-400" />
                <h3 className="font-semibold text-amber-300">The Great Khan: Unfiltered Facts</h3>
              </div>
              <p className="text-sm mt-2">A humorous yet factual account of history's most successful conqueror.</p>
            </div>

            <div
              className="bg-gray-900 p-3 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors"
              onClick={() => onOpenBook(dogsInCostumesBook)}
            >
              <div className="flex items-center gap-2">
                <Book className="text-pink-400" />
                <h3 className="font-semibold text-pink-300">Dogs in Costumes</h3>
              </div>
              <p className="text-sm mt-2">A pictorial collection of adorable dogs wearing various outfits.</p>
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
