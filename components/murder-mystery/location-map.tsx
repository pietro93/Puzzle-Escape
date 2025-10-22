"use client"

import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"
import type { Location } from "./types"

interface LocationMapProps {
  locations: Location[]
  currentLocation: string
  onNavigate: (locationId: string) => void
}

export function LocationMap({ locations, currentLocation, onNavigate }: LocationMapProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 p-2 border-t border-gray-700 z-10">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {locations.map((location) => (
          <Button
            key={location.id}
            variant={currentLocation === location.id ? "default" : "outline"}
            size="sm"
            onClick={() => onNavigate(location.id)}
            className="flex items-center gap-1"
          >
            <MapPin className="w-3 h-3" />
            <span className="text-xs sm:text-sm">{location.name}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}
