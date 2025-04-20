"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { demonologyBook, botanyBook } from "@/data/books"
import Image from "next/image"
import { X, Book, MapPin } from "lucide-react"

interface MurderMysteryPuzzleProps {
  onSolve?: () => void
}

export default function MurderMysteryPuzzle({ onSolve }: MurderMysteryPuzzleProps) {
  const [currentLocation, setCurrentLocation] = useState<string>("crime scene")
  const [selectedBook, setSelectedBook] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(0)

  const locations = [
    { id: "crime scene", name: "Crime Scene", description: "A bloody mess with evidence scattered around." },
    {
      id: "police station",
      name: "Police Station",
      description: "Officers are busy with paperwork and interrogations.",
    },
    { id: "morgue", name: "Morgue", description: "Cold and clinical, with several bodies awaiting examination." },
    { id: "library", name: "Library", description: "Rows of books and ancient tomes line the walls." },
  ]

  const navigateTo = (location: string) => {
    setCurrentLocation(location)
  }

  const openBook = (book: any) => {
    setSelectedBook(book)
    setCurrentPage(0)
  }

  const closeBook = () => {
    setSelectedBook(null)
    setCurrentPage(0)
  }

  const nextPage = () => {
    if (selectedBook && currentPage < selectedBook.pages.length - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <h2 className="text-xl font-bold text-red-500">Murder Mystery</h2>
      <p className="text-gray-300 mb-2">Explore locations to gather clues and solve the mystery.</p>

      {/* Navigation Bar */}
      <div className="w-full bg-gray-800 p-2 rounded-lg mb-4 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          {locations.map((location) => (
            <Button
              key={location.id}
              variant={currentLocation === location.id ? "default" : "outline"}
              size="sm"
              onClick={() => navigateTo(location.id)}
              className="flex items-center gap-1"
            >
              <MapPin className="w-3 h-3" />
              {location.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Location Content */}
      <Card className="w-full bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-purple-300">{locations.find((loc) => loc.id === currentLocation)?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          {currentLocation === "crime scene" && (
            <div className="text-gray-300">
              <p>You examine the crime scene carefully. Blood spatters suggest a violent struggle.</p>
              <p className="mt-2">There are several items that might be worth investigating:</p>
              <ul className="list-disc pl-5 mt-2">
                <li>A broken vial with traces of an unknown substance</li>
                <li>Footprints leading to and from the scene</li>
                <li>A torn piece of fabric caught on a nearby bush</li>
              </ul>
            </div>
          )}

          {currentLocation === "police station" && (
            <div className="text-gray-300">
              <p>The police station is busy with officers discussing the case.</p>
              <p className="mt-2">You overhear snippets of conversation:</p>
              <ul className="list-disc pl-5 mt-2">
                <li>"...third victim this month with the same MO..."</li>
                <li>"...toxicology report showed unusual plant compounds..."</li>
                <li>"...witness mentioned seeing someone from the university..."</li>
              </ul>
            </div>
          )}

          {currentLocation === "morgue" && (
            <div className="text-gray-300">
              <p>The morgue is cold and clinical. The medical examiner shows you the victim's body.</p>
              <p className="mt-2">You notice several unusual features:</p>
              <ul className="list-disc pl-5 mt-2">
                <li>Small puncture wounds that don't match any typical weapon</li>
                <li>Traces of a green substance under the fingernails</li>
                <li>An unusual discoloration around the mouth and nose</li>
              </ul>
            </div>
          )}

          {currentLocation === "library" && (
            <div className="text-gray-300">
              <p>The library contains thousands of books on various subjects.</p>
              <p className="mt-2">Two books catch your attention:</p>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div
                  className="bg-gray-700 p-3 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
                  onClick={() => openBook(demonologyBook)}
                >
                  <div className="flex items-center gap-2">
                    <Book className="text-red-400" />
                    <h3 className="font-semibold text-red-300">Demonology</h3>
                  </div>
                  <p className="text-sm mt-2">A comprehensive guide to supernatural creatures that feed on humans.</p>
                </div>

                <div
                  className="bg-gray-700 p-3 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
                  onClick={() => openBook(botanyBook)}
                >
                  <div className="flex items-center gap-2">
                    <Book className="text-green-400" />
                    <h3 className="font-semibold text-green-300">Botany</h3>
                  </div>
                  <p className="text-sm mt-2">An encyclopedia of plants, including many poisonous varieties.</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Book Modal */}
      {selectedBook && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-purple-300">{selectedBook.title}</h3>
              <Button variant="ghost" size="sm" onClick={closeBook}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-4">
              {selectedBook.pages[currentPage].imageUrl && (
                <div className="flex justify-center mb-4">
                  <Image
                    src={selectedBook.pages[currentPage].imageUrl || "/placeholder.svg"}
                    alt="Book illustration"
                    width={200}
                    height={150}
                    className="rounded-md"
                  />
                </div>
              )}

              <div className="text-gray-300 whitespace-pre-line">{selectedBook.pages[currentPage].text}</div>

              <div className="flex justify-between items-center mt-6">
                <Button variant="outline" onClick={prevPage} disabled={currentPage === 0}>
                  Previous Page
                </Button>
                <span className="text-gray-400 text-sm">
                  Page {currentPage + 1} of {selectedBook.pages.length}
                </span>
                <Button variant="outline" onClick={nextPage} disabled={currentPage === selectedBook.pages.length - 1}>
                  Next Page
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
