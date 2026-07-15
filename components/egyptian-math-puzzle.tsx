"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

interface EgyptianMathPuzzleProps {
  onSolve: () => void
}

export default function EgyptianMathPuzzle({ onSolve }: EgyptianMathPuzzleProps) {
  // State for the current papyrus in each carousel
  const [currentPapyrus, setCurrentPapyrus] = useState<number[]>([0, 0, 0])
  // State for the popup image
  const [popupImage, setPopupImage] = useState<string | null>(null)

  // Define all papyrus images
  const papyrusImages = [
    {
      id: "gold",
      src: "/images/papyrus_gold.webp",
      alt: "Golden Papyrus",
    },
    {
      id: "1",
      src: "/images/papyrus1.png",
      alt: "Papyrus 1",
    },
    {
      id: "2",
      src: "/images/papyrus2.webp",
      alt: "Papyrus 2",
    },
    {
      id: "3",
      src: "/images/papyrus3.webp",
      alt: "Papyrus 3",
    },
    {
      id: "4",
      src: "/images/papyrus4.webp",
      alt: "Papyrus 4",
    },
    {
      id: "5",
      src: "/images/papyrus5.webp",
      alt: "Papyrus 5",
    },
    {
      id: "6",
      src: "/images/papyrus6.webp",
      alt: "Papyrus 6",
    },
    {
      id: "7",
      src: "/images/papyrus7.webp",
      alt: "Papyrus 7",
    },
    {
      id: "8",
      src: "/images/papyrus8.webp",
      alt: "Papyrus 8",
    },
    {
      id: "9",
      src: "/images/papyrus9.webp",
      alt: "Papyrus 9",
    },
    {
      id: "10",
      src: "/images/papyrus10.webp",
      alt: "Papyrus 10",
    },
    {
      id: "11",
      src: "/images/papyrus11.webp",
      alt: "Papyrus 11",
    },
  ]

  // Define symbol icons and their corresponding full images
  const symbols = [
    {
      id: "ankh",
      iconSrc: "/images/ankh-icon.webp",
      fullSrc: "/images/ankh.webp",
      alt: "Ankh",
    },
    {
      id: "djed",
      iconSrc: "/images/djed-icon.webp",
      fullSrc: "/images/djed.webp",
      alt: "Djed",
    },
    {
      id: "eye-of-ra",
      iconSrc:
        "/images/eye-of-ra-icon.webp",
      fullSrc: "/images/eye-of-ra.webp",
      alt: "Eye of Ra",
    },
    {
      id: "eye-of-horus",
      iconSrc:
        "/images/eye-of-horus-icon.webp",
      fullSrc:
        "/images/eye-of-horus-icon.webp",
      alt: "Eye of Horus",
    },
    {
      id: "was",
      iconSrc: "/images/was-icon.webp",
      fullSrc: "/images/was.webp",
      alt: "Was",
    },
    {
      id: "shen",
      iconSrc: "/images/shen-icon.webp",
      fullSrc: "/images/shen.webp",
      alt: "Shen",
    },
  ]

  // Randomly distribute papyrus images into three carousels
  const [carousels, setCarousels] = useState<Array<Array<(typeof papyrusImages)[0]>>>([[], [], []])

  useEffect(() => {
    // Separate the golden papyrus from the rest
    const goldPapyrus = papyrusImages.find((p) => p.id === "gold")
    const regularPapyri = papyrusImages.filter((p) => p.id !== "gold")

    // Shuffle the regular papyri
    const shuffledPapyri = [...regularPapyri].sort(() => Math.random() - 0.5)

    // Create three groups of papyri, ensuring gold is not in first position
    const group1 = shuffledPapyri.slice(0, 3)
    const group2 = shuffledPapyri.slice(3, 7)
    const group3 = shuffledPapyri.slice(7)

    // Insert the gold papyrus at a random non-first position
    const goldCarouselIndex = Math.floor(Math.random() * 3) // Choose random carousel (0, 1, or 2)
    const goldPositionIndex = Math.floor(Math.random() * 3) + 1 // Random position (1, 2, or 3) - never 0

    // Insert gold papyrus into the chosen carousel at the chosen position
    if (goldCarouselIndex === 0) {
      group1.splice(goldPositionIndex, 0, goldPapyrus!)
    } else if (goldCarouselIndex === 1) {
      group2.splice(goldPositionIndex, 0, goldPapyrus!)
    } else {
      group3.splice(goldPositionIndex, 0, goldPapyrus!)
    }

    setCarousels([group1, group2, group3])
  }, [])

  // Papyri the player has actually viewed per carousel — unlocks the answer
  // input once every scroll in every carousel has been read at least once.
  const [viewedPapyri, setViewedPapyri] = useState<Set<number>[]>([new Set(), new Set(), new Set()])

  // Handle navigation in carousels
  const navigateCarousel = (carouselIndex: number, direction: "left" | "right") => {
    setCurrentPapyrus((prev) => {
      const newIndices = [...prev]
      const carouselLength = carousels[carouselIndex]?.length || 0

      if (direction === "left") {
        newIndices[carouselIndex] = (newIndices[carouselIndex] - 1 + carouselLength) % carouselLength
      } else {
        newIndices[carouselIndex] = (newIndices[carouselIndex] + 1) % carouselLength
      }

      return newIndices
    })
  }

  // Mark the current scroll of every carousel as viewed, and unlock once
  // every carousel has been fully browsed.
  useEffect(() => {
    if (carousels.every((c) => c.length === 0)) return
    setViewedPapyri((prev) => {
      const next = prev.map((set, i) => new Set(set).add(currentPapyrus[i]))
      const allViewed = next.every((set, i) => carousels[i].length > 0 && set.size >= carousels[i].length)
      if (allViewed) {
        onSolve()
      }
      return next
    })
  }, [currentPapyrus, carousels])

  // Handle symbol icon click
  const handleSymbolClick = (fullSrc: string) => {
    setPopupImage(fullSrc)
  }

  // Close popup
  const closePopup = () => {
    setPopupImage(null)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Three carousels stacked vertically */}
      {carousels.map((carousel, carouselIndex) => (
        <div key={carouselIndex} className="mb-6">
          {carousel.length > 0 && (
            <div className="flex items-center justify-center">
              {/* Left navigation arrow - minimal styling */}
              <button
                onClick={() => navigateCarousel(carouselIndex, "left")}
                className="flex-shrink-0 w-6 text-amber-300 hover:text-amber-200 transition-colors mx-1"
                aria-label="Previous papyrus"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Papyrus image - maximized width */}
              <div className="relative flex-grow">
                <Image
                  src={carousel[currentPapyrus[carouselIndex]]?.src || "/placeholder.svg"}
                  alt={carousel[currentPapyrus[carouselIndex]]?.alt || "Papyrus"}
                  width={500}
                  height={100}
                  className="w-full h-auto rounded-lg border border-amber-700/30"
                />
              </div>

              {/* Right navigation arrow - minimal styling */}
              <button
                onClick={() => navigateCarousel(carouselIndex, "right")}
                className="flex-shrink-0 w-6 text-amber-300 hover:text-amber-200 transition-colors mx-1"
                aria-label="Next papyrus"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      ))}

      {/* Symbol icons with circular button styling */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        {symbols.map((symbol) => (
          <div key={symbol.id} className="flex justify-center" onClick={() => handleSymbolClick(symbol.fullSrc)}>
            <div className="w-14 h-14 relative rounded-full border border-amber-700/50 bg-amber-900/10 hover:bg-amber-900/30 transition-all hover:scale-105 cursor-pointer p-1 flex items-center justify-center">
              <Image
                src={symbol.iconSrc || "/placeholder.svg"}
                alt={symbol.alt}
                width={40}
                height={40}
                className="w-10 h-10 object-contain"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Popup for full symbol image */}
      {popupImage && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={closePopup}>
          <div
            className="bg-amber-900/30 p-4 rounded-lg border-2 border-amber-700/50 max-w-sm w-full animate-fadeIn relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* X button in top-right corner */}
            <button
              onClick={closePopup}
              className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-black/50 hover:bg-black/70 rounded-full text-amber-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative w-full h-64 mt-4">
              <Image src={popupImage || "/placeholder.svg"} alt="Egyptian Symbol" fill className="object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
