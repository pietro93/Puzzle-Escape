"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import Image from "next/image"
import type { AutopsyReportPage } from "./types"

interface PoliceReportModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PoliceReportModal({ isOpen, onClose }: PoliceReportModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 p-4 rounded border border-gray-700 w-full max-w-md">
        <div className="flex justify-between items-center mb-2">
          <div className="text-center text-gray-400 font-pixel">Police Report</div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-4 space-y-2 text-sm font-pixel">
          <div className="flex justify-between">
            <span className="text-gray-400">Victim:</span>
            <span className="text-gray-300">Male, caucasian, early to mid 30s</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Eyes:</span>
            <span className="text-gray-300">Brown</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Hair:</span>
            <span className="text-gray-300">Brown, short, wavy</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Cause of death:</span>
            <span className="text-gray-300">suspected stroke, organ failure</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Visible trauma:</span>
            <span className="text-gray-300">none observed</span>
          </div>
        </div>
      </div>
    </div>
  )
}

interface ModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PassportModal({ isOpen, onClose }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Victim's Passport</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        <div className="flex justify-center mb-4">
          <Image
            src="/images/murder-mystery/victim_passport-headshot.webp"
            alt="Passport Photo"
            width={200}
            height={200}
            className="border-2 border-gray-300"
          />
        </div>
        <div className="space-y-2 text-sm">
          <p>
            <strong>Name:</strong> Alexei Volkov
          </p>
          <p>
            <strong>Nationality:</strong> Russian
          </p>
          <p>
            <strong>Date of Birth:</strong> 15 March 1985
          </p>
          <p>
            <strong>Place of Birth:</strong> Saint Petersburg, Russia
          </p>
          <p>
            <strong>Issue Date:</strong> 10 January 2020
          </p>
          <p>
            <strong>Expiry Date:</strong> 10 January 2030
          </p>
          <p>
            <strong>Passport Number:</strong> 75392614
          </p>
        </div>
      </div>
    </div>
  )
}

export function VictimBodyModal({ isOpen, onClose }: ModalProps) {
  const [selectedPart, setSelectedPart] = useState<string | null>(null)

  if (!isOpen) return null

  const bodyParts = [
    {
      id: "head",
      name: "Head",
      image: "/images/murder-mystery/victim-head.webp",
      notes: "Pale complexion. No visible trauma.",
    },
    {
      id: "left-hand",
      name: "Left Hand",
      image: "/images/murder-mystery/victim-left-hand.webp",
      notes: "Fingernails clean. No defensive wounds.",
    },
    {
      id: "right-hand",
      name: "Right Hand",
      image: "/images/murder-mystery/victim-right-hand.webp",
      notes: "Small puncture wound between thumb and index finger.",
    },
    {
      id: "left-leg",
      name: "Left Leg",
      image: "/images/murder-mystery/victim-left-leg.webp",
      notes: "No visible marks or injuries.",
    },
    {
      id: "right-leg",
      name: "Right Leg",
      image: "/images/murder-mystery/victim-right-leg.webp",
      notes: "No visible marks or injuries.",
    },
  ]

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 p-4 rounded border border-gray-700 w-full max-w-md">
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-center text-gray-400 mb-2 font-pixel">Victim's Body</div>
        <div className="flex flex-col items-center justify-center">
          {/* Show only the current body part */}
          <div className="mb-4">
            {selectedPart === "head" && (
              <Image
                src={`/images/murder-mystery/victim-head.webp`}
                alt="Victim's Head"
                width={200}
                height={200}
                className="pixelated"
              />
            )}
            {selectedPart === "left-hand" && (
              <Image
                src={`/images/murder-mystery/victim-left-hand.webp`}
                alt="Victim's Left Hand"
                width={200}
                height={200}
                className="pixelated"
              />
            )}
            {selectedPart === "right-hand" && (
              <Image
                src={`/images/murder-mystery/victim-right-hand.webp`}
                alt="Victim's Right Hand"
                width={200}
                height={200}
                className="pixelated"
              />
            )}
            {selectedPart === "left-leg" && (
              <Image
                src={`/images/murder-mystery/victim-left-leg.webp`}
                alt="Victim's Left Leg"
                width={200}
                height={200}
                className="pixelated"
              />
            )}
            {selectedPart === "right-leg" && (
              <Image
                src={`/images/murder-mystery/victim-right-leg.webp`}
                alt="Victim's Right Leg"
                width={200}
                height={200}
                className="pixelated"
              />
            )}
          </div>

          {/* Navigation buttons for body parts */}
          <div className="grid grid-cols-2 gap-2">
            {bodyParts.map((part) => (
              <Button
                key={part.id}
                variant="outline"
                size="sm"
                onClick={() => setSelectedPart(part.id)}
                className="text-gray-300"
                disabled={selectedPart === part.id}
              >
                Check {part.name}
              </Button>
            ))}
          </div>
          {selectedPart && (
            <div className="mt-4 text-sm text-gray-300 font-pixel">
              <strong>Notes:</strong> {bodyParts.find((part) => part.id === selectedPart)?.notes}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface AutopsyReportModalProps {
  isOpen: boolean
  onClose: () => void
  pages: AutopsyReportPage[]
}

export function AutopsyReportModal({ isOpen, onClose, pages }: AutopsyReportModalProps) {
  const [currentPage, setCurrentPage] = useState(0)

  if (!isOpen) return null

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % pages.length)
  }

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev - 1 + pages.length) % pages.length)
  }

  // Function to format text with bold and line breaks
  const formatText = (text: string) => {
    // Replace markdown-style bold with HTML bold
    const boldFormatted = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

    // Replace newlines with HTML line breaks
    const lineBreakFormatted = boldFormatted.replace(/\n\n/g, "<br/><br/>")

    return lineBreakFormatted
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 p-4 rounded border border-gray-700 w-full max-w-md">
        <div className="flex justify-between items-center mb-2">
          <div className="text-center text-gray-400 font-pixel">{pages[currentPage].title}</div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-4 space-y-2 text-sm font-pixel">
          <div
            dangerouslySetInnerHTML={{ __html: formatText(pages[currentPage].content) }}
            className="text-gray-300 leading-relaxed"
          />
        </div>
        <div className="flex justify-between mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className="text-gray-300"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === pages.length - 1}
            className="text-gray-300"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
