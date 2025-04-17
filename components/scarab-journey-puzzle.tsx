"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

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
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)

  const [scarabPosition, setScarabPosition] = useState({ x: 0, y: 0 })
  const [currentCityIndex, setCurrentCityIndex] = useState(0)
  const [isOutboundJourney, setIsOutboundJourney] = useState(true)
  const [isMoving, setIsMoving] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [popupContent, setPopupContent] = useState<City | null>(null)
  const [journeyStarted, setJourneyStarted] = useState(false)
  const [journeyCompleted, setJourneyCompleted] = useState(false)
  const [scarabRotation, setScarabRotation] = useState(0)

  const cities: City[] = [
    { id: "niani", name: "Niani", lat: 12.25, lng: -10.88, clue: "The capital of the Mali Empire." },
    { id: "walata", name: "Walata", lat: 20.93, lng: -7.33, clue: "A historic trading town." },
    { id: "taghaza", name: "Taghaza", lat: 22.9, lng: -3.98, clue: "Salt mines in the Sahara." },
    { id: "tuat", name: "Tuat", lat: 29.0, lng: -2.5, clue: "An oasis region in Algeria." },
    { id: "ghadames", name: "Ghadames", lat: 30.13, lng: 9.5, clue: "An ancient oasis town in Libya." },
    { id: "cairo", name: "Cairo", lat: 30.04, lng: 31.24, clue: "A great city of learning and trade in Egypt." },
    { id: "medina", name: "Medina", lat: 24.47, lng: 39.61, clue: "The first holy city on the pilgrimage route." },
    { id: "mecca", name: "Mecca", lat: 21.42, lng: 39.83, clue: "The final destination of the outbound journey." },
    { id: "gao", name: "Gao", lat: 16.27, lng: -0.04, clue: "An important trading city on the Niger River." },
    { id: "timbuktu", name: "Timbuktu", lat: 16.77, lng: 3.0, clue: "A center of Islamic learning and scholarship." },
  ]

  const outboundRoute = ["niani", "walata", "taghaza", "tuat", "ghadames", "cairo", "medina", "mecca"]
  const returnRoute = ["mecca", "medina", "cairo", "ghadames", "gao", "timbuktu", "niani"]

  useEffect(() => {
    const container = mapContainerRef.current
    if (!container) return

    const map = L.map(container, {
      center: [20, 20], // Center on North Africa
      zoom: 3,
      attributionControl: false,
      dragging: false,
      zoomControl: false,
      scrollWheelZoom: false,
    })

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map)

    cities.forEach((city) => {
      L.marker([city.lat, city.lng]).addTo(map)
    })

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  const geoToScreenCoords = (lat: number, lng: number) => {
    const map = mapRef.current
    if (!map) return { x: 0, y: 0 }

    const point = map.latLngToContainerPoint([lat, lng])
    return { x: point.x, y: point.y }
  }

  const calculateRotation = (startX: number, startY: number, endX: number, endY: number) => {
    const deltaX = endX - startX
    const deltaY = endY - startY
    const angleRad = Math.atan2(deltaY, deltaX)
    const angleDeg = (angleRad * 180) / Math.PI
    return angleDeg
  }

  const startJourney = () => {
    if (journeyStarted) return

    setJourneyStarted(true)
    setIsMoving(true)

    const startCity = cities.find((city) => city.id === "niani")
    if (startCity) {
      const { x, y } = geoToScreenCoords(startCity.lat, startCity.lng)
      setScarabPosition({ x, y })
    }

    moveToNextCity()
  }

  const moveToNextCity = () => {
    const route = isOutboundJourney ? outboundRoute : returnRoute

    if (currentCityIndex >= route.length - 1) {
      if (isOutboundJourney) {
        setIsOutboundJourney(false)
        setCurrentCityIndex(0)
        moveToNextCity()
      } else {
        setIsMoving(false)
        setJourneyCompleted(true)
        if (onSolve) onSolve()
      }
      return
    }

    const currentCityId = route[currentCityIndex]
    const nextCityId = route[currentCityIndex + 1]

    const currentCity = cities.find((city) => city.id === currentCityId)
    const nextCity = cities.find((city) => city.id === nextCityId)

    if (!currentCity || !nextCity) return

    const startPos = geoToScreenCoords(currentCity.lat, currentCity.lng)
    const endPos = geoToScreenCoords(nextCity.lat, nextCity.lng)

    const rotation = calculateRotation(startPos.x, startPos.y, endPos.x, endPos.y)
    setScarabRotation(rotation)

    animateScarab(startPos, endPos, nextCity)
  }

  const animateScarab = (startPos: { x: number; y: number }, endPos: { x: number; y: number }, nextCity: City) => {
    const duration = 3000
    const startTime = Date.now()

    const animate = () => {
      const currentTime = Date.now()
      const elapsedTime = currentTime - startTime
      const progress = Math.min(elapsedTime / duration, 1)

      const currentX = startPos.x + (endPos.x - startPos.x) * progress
      const currentY = startPos.y + (endPos.y - startPos.y) * progress

      setScarabPosition({ x: currentX, y: currentY })

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setPopupContent(nextCity)
        setShowPopup(true)

        setTimeout(() => {
          setShowPopup(false)
          setCurrentCityIndex(currentCityIndex + 1)
          moveToNextCity()
        }, 2000)
      }
    }

    animate()
  }

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
        {/* Map container */}
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
              src="/images/moonstone.webp"
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
