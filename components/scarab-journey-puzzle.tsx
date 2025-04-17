"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { X } from "lucide-react"

interface City {
  id: string
  name: string
  lat: number
  lng: number
  clue: string
}

interface ScarabJourneyPuzzleProps {
  onSolve?: () => void
}

export default function ScarabJourneyPuzzle({ onSolve }: ScarabJourneyPuzzleProps) {
  // Reference for the map container to get dimensions
  const mapContainerRef = useRef<HTMLDivElement>(null)

  // State for the scarab's position and animation
  const [scarabPosition, setScarabPosition] = useState({ x: 0, y: 0 })
  const [currentCityIndex, setCurrentCityIndex] = useState(0)
  const [isOutboundJourney, setIsOutboundJourney] = useState(true)
  const [isMoving, setIsMoving] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [popupContent, setPopupContent] = useState<City | null>(null)
  const [journeyStarted, setJourneyStarted] = useState(false)
  const [journeyCompleted, setJourneyCompleted] = useState(false)
  const [scarabRotation, setScarabRotation] = useState(0)

  // Define the cities with their coordinates and clues
  const cities: City[] = [
    {
      id: "niani",
      name: "Niani",
      lat: 12.25,
      lng: -10.88,
      clue: "The capital of the Mali Empire, where our journey begins. From here, the richest merchant in history set forth with gold that dazzled the world.",
    },
    {
      id: "walata",
      name: "Walata",
      lat: 20.93,
      lng: -7.33,
      clue: "A historic trading town where caravans gathered before crossing the vast desert. The merchant's wealth grew as he traded salt for gold.",
    },
    {
      id: "taghaza",
      name: "Taghaza",
      lat: 22.9,
      lng: -3.98,
      clue: "Salt mines in the Sahara, more valuable than gold. The merchant's caravan collected this white gold to fund his sacred journey.",
    },
    {
      id: "tuat",
      name: "Tuat",
      lat: 29.0,
      lng: -2.5,
      clue: "An oasis region providing respite from the harsh desert. The merchant rested here before continuing his pilgrimage eastward.",
    },
    {
      id: "ghadames",
      name: "Ghadames",
      lat: 30.13,
      lng: 9.5,
      clue: "An ancient oasis town at the edge of the desert. The merchant's faith grew stronger as he approached holy lands.",
    },
    {
      id: "cairo",
      name: "Cairo",
      lat: 30.04,
      lng: 31.24,
      clue: "A great city of learning and trade. The merchant studied ancient texts here before continuing his sacred journey.",
    },
    {
      id: "medina",
      name: "Medina",
      lat: 24.47,
      lng: 39.61,
      clue: "The first holy city on the pilgrimage route. The merchant's heart filled with devotion as he approached his destination.",
    },
    {
      id: "mecca",
      name: "Mecca",
      lat: 21.42,
      lng: 39.83,
      clue: "The final destination of the outbound journey, the holiest site of pilgrimage. The merchant completed his sacred duty here.",
    },
    {
      id: "gao",
      name: "Gao",
      lat: 16.27,
      lng: -0.04,
      clue: "An important trading city on the Niger River. The merchant chose a different route home, bringing new knowledge and treasures.",
    },
    {
      id: "timbuktu",
      name: "Timbuktu",
      lat: 16.77,
      lng: -3.0,
      clue: "A center of Islamic learning and scholarship. The merchant shared his experiences and wisdom before completing his journey.",
    },
  ]

  // Define the outbound and return routes
  const outboundRoute = ["niani", "walata", "taghaza", "tuat", "ghadames", "cairo", "medina", "mecca"]
  const returnRoute = ["mecca", "medina", "cairo", "ghadames", "gao", "timbuktu", "niani"]

  // Convert geographic coordinates to screen coordinates
  const geoToScreenCoords = (lat: number, lng: number) => {
    if (!mapContainerRef.current) return { x: 0, y: 0 }

    const containerWidth = mapContainerRef.current.clientWidth
    const containerHeight = mapContainerRef.current.clientHeight

    // Define the geographic bounds of our map
    const minLng = -15
    const maxLng = 45
    const minLat = 5
    const maxLat = 35

    // Convert to screen coordinates
    const x = ((lng - minLng) / (maxLng - minLng)) * containerWidth
    // Invert y-axis since geographic coordinates increase northward
    const y = (1 - (lat - minLat) / (maxLat - minLat)) * containerHeight

    return { x, y }
  }

  // Calculate rotation angle between two points
  const calculateRotation = (startX: number, startY: number, endX: number, endY: number) => {
    const deltaX = endX - startX
    const deltaY = endY - startY
    // Calculate angle in radians and convert to degrees
    const angleRad = Math.atan2(deltaY, deltaX)
    const angleDeg = (angleRad * 180) / Math.PI
    return angleDeg
  }

  // Start the scarab's journey
  const startJourney = () => {
    if (journeyStarted) return

    setJourneyStarted(true)
    setIsMoving(true)

    // Set initial position to the first city
    const startCity = cities.find((city) => city.id === "niani")
    if (startCity) {
      const { x, y } = geoToScreenCoords(startCity.lat, startCity.lng)
      setScarabPosition({ x, y })
    }

    // Start the animation
    moveToNextCity()
  }

  // Move the scarab to the next city
  const moveToNextCity = () => {
    const route = isOutboundJourney ? outboundRoute : returnRoute

    if (currentCityIndex >= route.length - 1) {
      // End of current route
      if (isOutboundJourney) {
        // Switch to return journey
        setIsOutboundJourney(false)
        setCurrentCityIndex(0)
        moveToNextCity()
      } else {
        // Journey completed
        setIsMoving(false)
        setJourneyCompleted(true)
        if (onSolve) onSolve()
      }
      return
    }

    // Get current and next city
    const currentCityId = route[currentCityIndex]
    const nextCityId = route[currentCityIndex + 1]

    const currentCity = cities.find((city) => city.id === currentCityId)
    const nextCity = cities.find((city) => city.id === nextCityId)

    if (!currentCity || !nextCity) return

    // Calculate start and end positions
    const startPos = geoToScreenCoords(currentCity.lat, currentCity.lng)
    const endPos = geoToScreenCoords(nextCity.lat, nextCity.lng)

    // Calculate rotation angle
    const rotation = calculateRotation(startPos.x, startPos.y, endPos.x, endPos.y)
    setScarabRotation(rotation)

    // Animate the scarab's movement
    animateScarab(startPos, endPos, nextCity)
  }

  // Animate the scarab's movement between two points
  const animateScarab = (startPos: { x: number; y: number }, endPos: { x: number; y: number }, nextCity: City) => {
    const duration = 3000 // 3 seconds per city
    const startTime = Date.now()

    const animate = () => {
      const currentTime = Date.now()
      const elapsedTime = currentTime - startTime
      const progress = Math.min(elapsedTime / duration, 1)

      // Calculate current position using linear interpolation
      const currentX = startPos.x + (endPos.x - startPos.x) * progress
      const currentY = startPos.y + (endPos.y - startPos.y) * progress

      setScarabPosition({ x: currentX, y: currentY })

      if (progress < 1) {
        // Continue animation
        requestAnimationFrame(animate)
      } else {
        // Animation complete, show popup
        setPopupContent(nextCity)
        setShowPopup(true)

        // Wait for a moment before continuing
        setTimeout(() => {
          setShowPopup(false)
          setCurrentCityIndex(currentCityIndex + 1)
          moveToNextCity()
        }, 2000)
      }
    }

    // Start animation
    animate()
  }

  // Close the popup manually
  const closePopup = () => {
    setShowPopup(false)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-amber-900/20 p-4 rounded-lg border border-amber-800/30 mb-4">
        <p className="text-amber-200 font-pixel text-sm">
          The Sphinx speaks: "Follow the path of the richest merchant, whose gold dazzled empires and whose faith led
          him east. Watch the scarab trace his sacred pilgrimage across sands and cities, then return home by a
          different road."
        </p>
      </div>

      <div
        ref={mapContainerRef}
        className="relative w-full h-[400px] bg-amber-100/10 rounded-lg border-2 border-amber-800/30 overflow-hidden"
      >
        {/* Map background */}
        <div className="absolute inset-0 bg-[url('/images/north-africa-map.webp')] bg-cover bg-center opacity-70"></div>

        {/* City pins - only showing coordinates */}
        {cities.map((city) => {
          const { x, y } = geoToScreenCoords(city.lat, city.lng)
          return (
            <div
              key={city.id}
              className="absolute w-2 h-2 bg-amber-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: x, top: y }}
            >
              <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-[8px] text-amber-200 whitespace-nowrap">
                {city.lat.toFixed(2)}°N, {Math.abs(city.lng).toFixed(2)}°{city.lng < 0 ? "W" : "E"}
              </div>
            </div>
          )
        })}

        {/* Scarab */}
        {journeyStarted && (
          <div
            className="absolute w-8 h-8 transform -translate-x-1/2 -translate-y-1/2 transition-transform"
            style={{
              left: scarabPosition.x,
              top: scarabPosition.y,
              transform: `translate(-50%, -50%) rotate(${scarabRotation}deg)`,
            }}
          >
            <Image
              src="/images/moonstone.webp" // Placeholder, will be replaced with scarab image
              alt="Scarab"
              width={32}
              height={32}
              className="w-full h-full object-contain"
            />
          </div>
        )}

        {/* City popup */}
        {showPopup && popupContent && (
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900/90 p-3 rounded-lg border border-amber-700 max-w-[80%] z-10">
            <button
              onClick={closePopup}
              className="absolute -top-2 -right-2 w-5 h-5 bg-red-900 rounded-full flex items-center justify-center text-white text-xs"
            >
              <X className="w-3 h-3" />
            </button>
            <h3 className="text-amber-300 font-pixel text-sm mb-1">{popupContent.name}</h3>
            <p className="text-amber-100 text-xs">{popupContent.clue}</p>
          </div>
        )}
      </div>

      {!journeyStarted && (
        <div className="flex justify-center mt-4">
          <button
            onClick={startJourney}
            className="px-4 py-2 bg-amber-900/50 hover:bg-amber-800/60 text-amber-200 rounded-md font-pixel text-sm border border-amber-700/50 transition-colors"
          >
            Begin Scarab's Journey
          </button>
        </div>
      )}

      {journeyCompleted && (
        <div className="mt-4 bg-amber-900/20 p-3 rounded-lg border border-amber-800/30">
          <p className="text-amber-200 font-pixel text-sm text-center">
            The scarab has completed its journey, following the path of Mansa Musa, the richest merchant in history.
          </p>
        </div>
      )}
    </div>
  )
}
