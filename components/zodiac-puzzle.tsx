"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { X } from "lucide-react"

interface ZodiacSign {
  id: number
  name: string
  image: string
  correctFrame: number
}

interface Frame {
  id: number
  season: string
  image: string
  occupiedBy: number | null
}

interface ZodiacPuzzleProps {
  onSolve: () => void
}

export default function ZodiacPuzzle({ onSolve }: ZodiacPuzzleProps) {
  // State for frames
  const [frames, setFrames] = useState<Frame[]>([])
  // State for tapestries
  const [zodiacSigns, setZodiacSigns] = useState<ZodiacSign[]>([])
  // State for puzzle completion
  const [isPuzzleComplete, setIsPuzzleComplete] = useState(false)
  // State for showing the snake
  const [showSnake, setShowSnake] = useState(false)
  // State for popup
  const [showPopup, setShowPopup] = useState(false)
  // State for selected frame
  const [selectedFrame, setSelectedFrame] = useState<number | null>(null)

  // Initialize the puzzle
  useEffect(() => {
    // Create frames
    const springFrames: Frame[] = [
      {
        id: 1,
        season: "spring",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/spring-frame-vwiplx2pXxn9hWEYmNaQGIq1EK4C4s.webp",
        occupiedBy: null,
      },
      {
        id: 2,
        season: "spring",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/spring-frame-vwiplx2pXxn9hWEYmNaQGIq1EK4C4s.webp",
        occupiedBy: null,
      },
      {
        id: 3,
        season: "spring",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/spring-frame-vwiplx2pXxn9hWEYmNaQGIq1EK4C4s.webp",
        occupiedBy: null,
      },
    ]

    const summerFrames: Frame[] = [
      {
        id: 4,
        season: "summer",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/summer-frame-CpfCnNY3TBdqQviSHc3aeaYg2xej7N.webp",
        occupiedBy: null,
      },
      {
        id: 5,
        season: "summer",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/summer-frame-CpfCnNY3TBdqQviSHc3aeaYg2xej7N.webp",
        occupiedBy: null,
      },
      {
        id: 6,
        season: "summer",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/summer-frame-CpfCnNY3TBdqQviSHc3aeaYg2xej7N.webp",
        occupiedBy: null,
      },
    ]

    const autumnFrames: Frame[] = [
      {
        id: 7,
        season: "autumn",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/autumn-frame-ON3ix5o0YlDXCtbjRjGe8f4QssKewl.webp",
        occupiedBy: null,
      },
      {
        id: 8,
        season: "autumn",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/autumn-frame-ON3ix5o0YlDXCtbjRjGe8f4QssKewl.webp",
        occupiedBy: null,
      },
      {
        id: 9,
        season: "autumn",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/autumn-frame-ON3ix5o0YlDXCtbjRjGe8f4QssKewl.webp",
        occupiedBy: null,
      },
    ]

    const winterFrames: Frame[] = [
      {
        id: 10,
        season: "winter",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/winter-frame-xPnPfq0rX5giqbt5oSVOoW1P44fTCX.webp",
        occupiedBy: null,
      },
      {
        id: 11,
        season: "winter",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/winter-frame-xPnPfq0rX5giqbt5oSVOoW1P44fTCX.webp",
        occupiedBy: null,
      },
      {
        id: 12,
        season: "winter",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/winter-frame-xPnPfq0rX5giqbt5oSVOoW1P44fTCX.webp",
        occupiedBy: null,
      },
    ]

    setFrames([...springFrames, ...summerFrames, ...autumnFrames, ...winterFrames])

    // Create tapestries
    const signs: ZodiacSign[] = [
      {
        id: 1,
        name: "Aries",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/aries-rXmF25q4t2WV4iPZoiMNZh5lxKlqsv.webp",
        correctFrame: 1,
      },
      {
        id: 2,
        name: "Taurus",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/taurus-IotLgagIc1IAPzSuQq0pGi2FIHncoc.webp",
        correctFrame: 2,
      },
      {
        id: 3,
        name: "Gemini",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/gemini-99AqftLp1blVVjcOfyGzaYJ7VHDxos.webp",
        correctFrame: 3,
      },
      {
        id: 4,
        name: "Cancer",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cancer-NosP1hU3WsA3edG9FFW5nMedl6RKub.webp",
        correctFrame: 4,
      },
      {
        id: 5,
        name: "Leo",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/leo-aTJNi2U3INDqzzStd8PV2gQFXMV8gy.webp",
        correctFrame: 5,
      },
      {
        id: 6,
        name: "Virgo",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/virgo-bUkhDQ4YVp9GDh3AXfC9R3WfxyzQTn.webp",
        correctFrame: 6,
      },
      {
        id: 7,
        name: "Libra",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/libra-rp1gHjWJThl3yqAomhIFa5zyuCYQ5s.webp",
        correctFrame: 7,
      },
      {
        id: 8,
        name: "Scorpio",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/scorpio-tA4d9HMtcXzSAHZQgXmfQzKEJhfWY6.webp",
        correctFrame: 8,
      },
      {
        id: 9,
        name: "Sagittarius",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sagittarius-B8GNcOhxsd6RJYKzMhPQB7FPmJcKYq.webp",
        correctFrame: 9,
      },
      {
        id: 10,
        name: "Capricorn",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/capricorn-xQT49HAK59B3Dh0yJswQjsCvFV9rJN.webp",
        correctFrame: 10,
      },
      {
        id: 11,
        name: "Aquarius",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/aquarius-ADwmTE0Byl6E6Il1FNfUu45qX3rXvQ.webp",
        correctFrame: 11,
      },
      {
        id: 12,
        name: "Pisces",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pisces-hYv5h5KlU3r7oB3zZXAeJ3ZzBxpmJ9.webp",
        correctFrame: 12,
      },
    ]

    // Shuffle the tapestries
    const shuffledSigns = [...signs].sort(() => Math.random() - 0.5)
    setZodiacSigns(shuffledSigns)
  }, [])

  // Check if the puzzle is complete
  useEffect(() => {
    if (frames.length === 0 || zodiacSigns.length === 0) return

    const allCorrect = frames.every((frame) => {
      if (frame.occupiedBy === null) return false
      const sign = zodiacSigns.find((s) => s.id === frame.occupiedBy)
      return sign && sign.correctFrame === frame.id
    })

    if (allCorrect && !isPuzzleComplete) {
      setIsPuzzleComplete(true)
      setTimeout(() => {
        setShowSnake(true)
        onSolve()
      }, 1000)
    }
  }, [frames, zodiacSigns, isPuzzleComplete, onSolve])

  // Handle frame click
  const handleFrameClick = (frameId: number) => {
    // If the frame is already occupied, do nothing
    const frame = frames.find((f) => f.id === frameId)
    if (frame && frame.occupiedBy !== null) return

    // Set the selected frame and show the popup
    setSelectedFrame(frameId)
    setShowPopup(true)
  }

  // Handle sign selection
  const handleSignSelect = (signId: number) => {
    if (selectedFrame === null) return

    // Update frames
    const updatedFrames = frames.map((frame) => {
      if (frame.id === selectedFrame) {
        return { ...frame, occupiedBy: signId }
      }
      return frame
    })

    setFrames(updatedFrames)
    setShowPopup(false)
    setSelectedFrame(null)
  }

  // Handle sign removal
  const handleRemoveSign = (frameId: number) => {
    // Update frames
    const updatedFrames = frames.map((frame) => {
      if (frame.id === frameId) {
        return { ...frame, occupiedBy: null }
      }
      return frame
    })

    setFrames(updatedFrames)
  }

  // Get signs that are not placed in frames
  const getUnplacedSigns = () => {
    const placedSignIds = frames.map((frame) => frame.occupiedBy).filter((id) => id !== null) as number[]
    return zodiacSigns.filter((sign) => !placedSignIds.includes(sign.id))
  }

  // Get frame border color based on season
  const getFrameBorderColor = (season: string) => {
    switch (season) {
      case "spring":
        return "border-green-500"
      case "summer":
        return "border-yellow-500"
      case "autumn":
        return "border-orange-500"
      case "winter":
        return "border-blue-500"
      default:
        return "border-gray-500"
    }
  }

  // Find a sign by ID
  const findSignById = (id: number | null) => {
    if (id === null) return null
    return zodiacSigns.find((sign) => sign.id === id) || null
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {showSnake ? (
        <div className="flex flex-col items-center">
          <div className="w-full max-w-md relative">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/snake-jO3Mb2e0X6kf9TOrktuoLz7AM0HaBr.webp"
              alt="Ophiuchus"
              width={400}
              height={400}
              className="w-full h-auto"
            />
          </div>
          <p className="text-center text-purple-300 font-pixel mt-4">A mysterious new tapestry reveals itself...</p>
        </div>
      ) : (
        <>
          {/* Frames grid */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {frames.map((frame) => {
              const isOccupied = frame.occupiedBy !== null
              const sign = isOccupied ? findSignById(frame.occupiedBy) : null

              return (
                <div
                  key={frame.id}
                  className={`relative w-24 h-24 border-2 ${getFrameBorderColor(frame.season)} rounded-lg overflow-hidden 
                    ${!isOccupied ? "cursor-pointer hover:ring-2 hover:ring-purple-400 hover:scale-105" : ""}
                    transition-all duration-150`}
                  onClick={() => !isOccupied && handleFrameClick(frame.id)}
                >
                  {/* Frame or Sign Image */}
                  <div className="w-full h-full">
                    <Image
                      src={isOccupied && sign ? sign.image : frame.image}
                      alt={isOccupied && sign ? sign.name : `${frame.season} Frame`}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Remove button for occupied frames */}
                  {isOccupied && (
                    <button
                      className="absolute bottom-1 right-1 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveSign(frame.id)
                      }}
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  )}
                </div>
              )
            })}
          </div>

          {/* Popup for selecting signs */}
          {showPopup && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-900 rounded-lg border-2 border-gray-700 p-4 max-w-md w-full animate-fadeIn">
                <h3 className="text-purple-300 font-pixel mb-4 text-center">Select a Tapestry</h3>

                <div className="grid grid-cols-3 gap-3">
                  {getUnplacedSigns().map((sign) => (
                    <div
                      key={sign.id}
                      className="w-24 h-24 cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => handleSignSelect(sign.id)}
                    >
                      <Image
                        src={sign.image || "/placeholder.svg"}
                        alt="Tapestry"
                        width={96}
                        height={96}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex justify-center">
                  <button
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md text-sm"
                    onClick={() => {
                      setShowPopup(false)
                      setSelectedFrame(null)
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
