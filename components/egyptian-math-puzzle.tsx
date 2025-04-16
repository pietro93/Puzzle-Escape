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
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/papyrus_gold-kGK3QEcuqWJYiHhdMP5h8VD6wBZ3Ij.webp",
      alt: "Golden Papyrus",
    },
    {
      id: "1",
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/papyrus1-vnIBvjfjXNsX4xh6RsHQLLnCD0yau6.png",
      alt: "Papyrus 1",
    },
    {
      id: "2",
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/papyrus2-k6QlsDn6uKLgUljh9BqUVA1T2IEhXb.webp",
      alt: "Papyrus 2",
    },
    {
      id: "3",
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/papyrus3-srbYWQLkPyembJH4S9fiz0wq0XQmDE.webp",
      alt: "Papyrus 3",
    },
    {
      id: "4",
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/papyrus4-ESGCVRFdbKnPCqZR3VvZitAuBmecAo.webp",
      alt: "Papyrus 4",
    },
    {
      id: "5",
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/papyrus5-AVjCFUHONUYkLyr8yrScQ59nbTq3oC.webp",
      alt: "Papyrus 5",
    },
    {
      id: "6",
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/papyrus6-q2z1vXqDqvQGPHfuUG8W0pvh9Xy26z.webp",
      alt: "Papyrus 6",
    },
    {
      id: "7",
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/papyrus7-Rl4ps2CbLXG7WFqjQaKcc59eUI76lA.webp",
      alt: "Papyrus 7",
    },
    {
      id: "8",
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/papyrus8-fygscCXrwAxahfQDRIyTgtUeERfqqz.webp",
      alt: "Papyrus 8",
    },
    {
      id: "9",
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/papyrus9-HCupq9PzbY1LF9FCiUrZQ8AnDHsMUq.webp",
      alt: "Papyrus 9",
    },
    {
      id: "10",
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/papyrus10-3E44eCkCwoYVl7aRBeqiA0YpDocgY6.webp",
      alt: "Papyrus 10",
    },
    {
      id: "11",
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/papyrus11-T66xkQZ0y2o5BI40YV3LCro7OTIMAr.webp",
      alt: "Papyrus 11",
    },
  ]

  // Define symbol icons and their corresponding full images
  const symbols = [
    {
      id: "ankh",
      iconSrc: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ankh-icon-LvSJnwvKdzWLWvf7BlFZtH3j4ltcmR.webp",
      fullSrc: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ankh-EAxF5YIH3bAxqZnHcGJMzQmAFszRgy.webp",
      alt: "Ankh",
    },
    {
      id: "djed",
      iconSrc: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/djed-icon-m3WfAvMoiOTrQVUw7CBUD52znIAMnW.webp",
      fullSrc: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/djed-NgK7veEkw7HLf6dcpWPbbtm3y2OEsg.webp",
      alt: "Djed",
    },
    {
      id: "eye-of-ra",
      iconSrc:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/eye-of-ra-icon-HC4IsTyuj0PndTT9Ff7pYd1lBDQFX7.webp",
      fullSrc: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/eye-of-ra-1vn4m4zH939tFjLXyQgQ4dUp85P6iI.webp",
      alt: "Eye of Ra",
    },
    {
      id: "eye-of-horus",
      iconSrc:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/eye-of-horus-icon-hCOCvJ27NLIifXa7GrgsdpCwLuNbLL.webp",
      fullSrc:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/eye-of-horus-OBxTO2LVWTFcH1TIndgRB8cm0rgmJP.webp",
      alt: "Eye of Horus",
    },
    {
      id: "was",
      iconSrc: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/was-icon-umUBH8pDgTHCWLsnMAAjLxaYINNfa9.webp",
      fullSrc: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/was-BVwggjCcGafMrsVk0aTsn3KKXDkxLu.webp",
      alt: "Was",
    },
    {
      id: "shen",
      iconSrc: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/shen-icon-TZaOZW6Me8s1Ea4MoPGOjAZE53T8Tw.webp",
      fullSrc: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/shen-8YpMj4yJsFxxlcOqUmjU4AO8ydglFt.webp",
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
