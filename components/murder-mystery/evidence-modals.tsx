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

interface PassportModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PassportModal({ isOpen, onClose }: PassportModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 p-4 rounded border border-gray-700 w-full max-w-md">
        <div className="flex justify-between items-center mb-2">
          <div className="text-center text-gray-400 font-pixel">ID</div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center">
          <div className="w-24 h-24 relative mr-4 pixelated-container bg-black p-0">
            <Image
              src="/images/murder-mystery/victim_passport-headshot.webp"
              alt="Victim's Headshot"
              width={96}
              height={96}
              className="pixelated"
            />
          </div>
          <div className="mt-4 space-y-2 text-sm font-pixel">
            <div className="flex justify-between">
              <span className="text-gray-400">Name:</span>
              <span className="text-gray-300">Declan Tremblay</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Date of Birth:</span>
              <span className="text-gray-300">1993/04/21</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Height:</span>
              <span className="text-gray-300">180 cm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Place of birth:</span>
              <span className="text-gray-300">Toronto, ON</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface VictimBodyModalProps {
  isOpen: boolean
  onClose: () => void
}

export function VictimBodyModal({ isOpen, onClose }: VictimBodyModalProps) {
  const [currentBodyPart, setCurrentBodyPart] = useState("head")

  if (!isOpen) return null

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
            {currentBodyPart === "head" && (
              <Image
                src="/images/murder-mystery/victim-head.webp"
                alt="Victim's Head"
                width={200}
                height={200}
                className="pixelated"
              />
            )}
            {currentBodyPart === "leftHand" && (
              <Image
                src="/images/murder-mystery/victim-left-hand.webp"
                alt="Victim's Left Hand"
                width={200}
                height={200}
                className="pixelated"
              />
            )}
            {currentBodyPart === "rightHand" && (
              <Image
                src="/images/murder-mystery/victim-right-hand.webp"
                alt="Victim's Right Hand"
                width={200}
                height={200}
                className="pixelated"
              />
            )}
            {currentBodyPart === "leftLeg" && (
              <Image
                src="/images/murder-mystery/victim-left-leg.webp"
                alt="Victim's Left Leg"
                width={200}
                height={200}
                className="pixelated"
              />
            )}
            {currentBodyPart === "rightLeg" && (
              <Image
                src="/images/murder-mystery/victim-right-leg.webp"
                alt="Victim's Right Leg"
                width={200}
                height={200}
                className="pixelated"
              />
            )}
          </div>

          {/* Navigation buttons for body parts */}
          <div className="grid grid-cols-2 gap-2">
            {currentBodyPart !== "head" && (
              <Button variant="outline" size="sm" onClick={() => setCurrentBodyPart("head")} className="text-gray-300">
                Check Head
              </Button>
            )}
            {currentBodyPart !== "leftHand" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentBodyPart("leftHand")}
                className="text-gray-300"
              >
                Check Left Arm
              </Button>
            )}
            {currentBodyPart !== "rightHand" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentBodyPart("rightHand")}
                className="text-gray-300"
              >
                Check Right Arm
              </Button>
            )}
            {currentBodyPart !== "leftLeg" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentBodyPart("leftLeg")}
                className="text-gray-300"
              >
                Check Left Leg
              </Button>
            )}
            {currentBodyPart !== "rightLeg" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentBodyPart("rightLeg")}
                className="text-gray-300"
              >
                Check Right Leg
              </Button>
            )}
          </div>
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
