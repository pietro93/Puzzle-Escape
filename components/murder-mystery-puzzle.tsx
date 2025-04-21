"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { demonologyBook } from "@/data/books"
import Image from "next/image"
import { X, Book, MapPin, ChevronLeft, ChevronRight } from "lucide-react"

interface MurderMysteryPuzzleProps {
  onSolve?: () => void
}

// Enhanced botany book with sections
const botanyBook = {
  title: "Botany",
  sections: [
    {
      id: "trees",
      title: "Trees",
      pages: [
        {
          title: "Oak Tree",
          text: "The mighty oak is known for its strength and longevity. Its wood has been used for centuries in construction and furniture making. Oak trees can live for hundreds of years and provide habitat for countless species.",
          imageUrl: "/placeholder.svg?height=150&width=200",
        },
        {
          title: "Pine Tree",
          text: "Evergreen and aromatic, pine trees are found across the northern hemisphere. They produce resin that has been used in traditional medicines. Their distinctive needles and cones make them easily recognizable in forests.",
          imageUrl: "/placeholder.svg?height=150&width=200",
        },
        {
          title: "Birch Tree",
          text: "With its distinctive white bark, the birch tree has been important in many cultures. The bark can be used to make paper, containers, and even canoes. Birch sap can be tapped in spring and made into a refreshing drink.",
          imageUrl: "/placeholder.svg?height=150&width=200",
        },
      ],
    },
    {
      id: "plants",
      title: "Plants",
      pages: [
        {
          title: "Deadly Nightshade",
          text: "Also known as belladonna, this highly toxic plant has been used both as a poison and medicine throughout history. All parts of the plant contain tropane alkaloids that can cause hallucinations and death.",
          imageUrl: "/placeholder.svg?height=150&width=200",
        },
        {
          title: "Foxglove",
          text: "While beautiful, foxglove contains powerful cardiac glycosides that affect heart rhythm. In controlled doses, it's the source of the medicine digoxin, but improper use can be fatal.",
          imageUrl: "/placeholder.svg?height=150&width=200",
        },
        {
          title: "Professor Hemlock",
          text: "Named after the renowned botanist who first classified it, this rare variety of water hemlock is among the most poisonous plants in North America. It contains cicutoxin that attacks the central nervous system, causing seizures and death. The poison can be extracted and concentrated into a nearly undetectable toxin that leaves minimal traces in the victim's system.",
          imageUrl: "/placeholder.svg?height=150&width=200",
        },
        {
          title: "Wolfsbane",
          text: "Also called monkshood or aconite, this plant contains aconitine, a potent neurotoxin. It has been used in hunting and warfare throughout history. Even handling the plant without gloves can cause symptoms.",
          imageUrl: "/placeholder.svg?height=150&width=200",
        },
      ],
    },
  ],
}

export default function MurderMysteryPuzzle({ onSolve }: MurderMysteryPuzzleProps) {
  const [currentLocation, setCurrentLocation] = useState<string>("crime scene")
  const [selectedBook, setSelectedBook] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [currentSection, setCurrentSection] = useState<string | null>(null)

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

    // If it's the botany book, set the initial section
    if (book.sections) {
      setCurrentSection(book.sections[0].id)
    } else {
      setCurrentSection(null)
    }
  }

  const closeBook = () => {
    setSelectedBook(null)
    setCurrentPage(0)
    setCurrentSection(null)
  }

  const nextPage = () => {
    if (selectedBook) {
      if (selectedBook.sections) {
        // For botany book with sections
        const currentSectionObj = selectedBook.sections.find((s: any) => s.id === currentSection)
        if (currentSectionObj && currentPage < currentSectionObj.pages.length - 1) {
          setCurrentPage(currentPage + 1)
        }
      } else {
        // For regular books
        if (currentPage < selectedBook.pages.length - 1) {
          setCurrentPage(currentPage + 1)
        }
      }
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const switchSection = (sectionId: string) => {
    setCurrentSection(sectionId)
    setCurrentPage(0)
  }

  // Get current content based on book type and section
  const getCurrentContent = () => {
    if (!selectedBook) return null

    if (selectedBook.sections) {
      // For botany book with sections
      const section = selectedBook.sections.find((s: any) => s.id === currentSection)
      if (section && section.pages[currentPage]) {
        return section.pages[currentPage]
      }
      return null
    } else {
      // For regular books
      return selectedBook.pages[currentPage]
    }
  }

  // Get total pages for current view
  const getTotalPages = () => {
    if (!selectedBook) return 0

    if (selectedBook.sections && currentSection) {
      const section = selectedBook.sections.find((s: any) => s.id === currentSection)
      return section ? section.pages.length : 0
    } else {
      return selectedBook.pages.length
    }
  }

  const currentContent = getCurrentContent()
  const totalPages = getTotalPages()

  return (
    <div className="flex flex-col items-center space-y-4 relative pb-16">
      <h2 className="text-xl font-bold text-red-500">Murder Mystery</h2>
      <p className="text-gray-300 mb-2">Explore locations to gather clues and solve the mystery.</p>

      {/* Location Content */}
      <Card className="w-full bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-purple-300">{locations.find((loc) => loc.id === currentLocation)?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          {currentLocation === "crime scene" && (
            <div className="flex justify-center">
              <div className="relative w-full aspect-square max-w-xl">
                <Image
                  src="/images/murder-mystery/crime-scene.webp"
                  alt="Crime Scene"
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
            </div>
          )}

          {currentLocation === "police station" && (
            <div className="flex justify-center">
              <div className="relative w-full aspect-square max-w-xl">
                <Image
                  src="/images/murder-mystery/policewoman.webp"
                  alt="Police Officer"
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
            </div>
          )}

          {currentLocation === "morgue" && (
            <div className="flex justify-center">
              <div className="relative w-full aspect-square max-w-xl">
                <Image
                  src="/images/murder-mystery/mortician.webp"
                  alt="Mortician"
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
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

      {/* Navigation Bar - Now at the bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 p-2 border-t border-gray-700 z-10">
        <div className="flex justify-between items-center max-w-md mx-auto">
          {locations.map((location) => (
            <Button
              key={location.id}
              variant={currentLocation === location.id ? "default" : "outline"}
              size="sm"
              onClick={() => navigateTo(location.id)}
              className="flex items-center gap-1"
            >
              <MapPin className="w-3 h-3" />
              <span className="text-xs sm:text-sm">{location.name}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Book Modal - Enhanced to look more like a book */}
      {selectedBook && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#2a2a2a] rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Book Header */}
            <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-[#1a1a1a]">
              <h3 className="text-xl font-bold text-amber-300">{selectedBook.title}</h3>
              <Button variant="ghost" size="sm" onClick={closeBook} className="text-gray-400 hover:text-white">
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Section Tabs for Botany Book */}
            {selectedBook.sections && (
              <div className="flex border-b border-gray-700">
                {selectedBook.sections.map((section: any) => (
                  <button
                    key={section.id}
                    className={`px-4 py-2 text-sm font-medium ${
                      currentSection === section.id
                        ? "bg-green-900/30 text-green-300 border-b-2 border-green-500"
                        : "text-gray-400 hover:text-white hover:bg-gray-700/30"
                    }`}
                    onClick={() => switchSection(section.id)}
                  >
                    {section.title}
                  </button>
                ))}
              </div>
            )}

            {/* Book Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-8 bg-[#252525] min-h-[300px] flex flex-col items-center">
                {/* Book Page Content */}
                <div className="max-w-md w-full bg-[#f5f5dc] text-gray-800 p-6 rounded shadow-md relative book-page">
                  {currentContent?.title && (
                    <h4 className="text-lg font-semibold text-center mb-4 text-gray-900 border-b border-gray-300 pb-2">
                      {currentContent.title}
                    </h4>
                  )}

                  {currentContent?.imageUrl && (
                    <div className="flex justify-center mb-4">
                      <div className="border border-gray-400 p-1 bg-white inline-block">
                        <Image
                          src={currentContent.imageUrl || "/placeholder.svg"}
                          alt="Book illustration"
                          width={200}
                          height={150}
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}

                  <div className="text-gray-700 whitespace-pre-line leading-relaxed font-serif">
                    {currentContent?.text}
                  </div>

                  {/* Page number */}
                  <div className="absolute bottom-2 right-2 text-gray-500 text-xs">{currentPage + 1}</div>
                </div>
              </div>
            </div>

            {/* Book Navigation */}
            <div className="p-4 border-t border-gray-700 bg-[#1a1a1a] flex justify-between items-center">
              <Button
                variant="outline"
                onClick={prevPage}
                disabled={currentPage === 0}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              <span className="text-gray-400 text-sm">
                Page {currentPage + 1} of {totalPages}
              </span>

              <Button
                variant="outline"
                onClick={nextPage}
                disabled={currentPage === totalPages - 1}
                className="flex items-center gap-1"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .book-page {
          background-image: linear-gradient(to right, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0) 5%, rgba(0,0,0,0) 95%, rgba(0,0,0,0.05) 100%);
        }
      `}</style>
    </div>
  )
}
