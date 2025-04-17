"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

interface LeafletMapProps {
  cities: any[]
  scarabPosition: { x: number; y: number }
  scarabRotation: number
}

const LeafletMap: React.FC<LeafletMapProps> = ({ cities, scarabPosition, scarabRotation }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const scarabMarkerRef = useRef<L.Marker | null>(null)

  useEffect(() => {
    const container = mapContainerRef.current
    if (!container) return

    const map = L.map(container, {
      center: [20, 10],
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

    // Create scarab marker
    const scarabIcon = L.icon({
      iconUrl: "/images/moonstone.webp",
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    })

    const scarabMarker = L.marker([scarabPosition.x, scarabPosition.y], {
      icon: scarabIcon,
      rotationAngle: scarabRotation,
      rotationOrigin: "center",
    }).addTo(map)
    scarabMarkerRef.current = scarabMarker

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    const scarabMarker = scarabMarkerRef.current

    if (!map || !scarabMarker) return

    scarabMarker.setLatLng([scarabPosition.x, scarabPosition.y])
    scarabMarker.setRotationAngle(scarabRotation)
  }, [scarabPosition, scarabRotation])

  return <div ref={mapContainerRef} className="relative w-full h-full" />
}

export default LeafletMap
