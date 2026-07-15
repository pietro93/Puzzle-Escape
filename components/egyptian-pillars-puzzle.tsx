"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface EgyptianPillarsPuzzleProps {
  onSolve?: () => void
}

type Word = {
  id: string
  text: string
  isPlaced: boolean
}

type Pillar = {
  id: string
  label?: string
  symbol?: string
  symbolAlt?: string
  placedWord: string | null
  outputLetter: string
}

type PillarSet = {
  id: string
  pillars: Pillar[]
}

export default function EgyptianPillarsPuzzle({ onSolve }: EgyptianPillarsPuzzleProps) {
  // Available words for dragging
  const [words, setWords] = useState<Word[]>([
    { id: "waset", text: "Waset", isPlaced: false },
    { id: "men-nefer", text: "Men-nefer", isPlaced: false },
    { id: "raqnote", text: "Raqnote", isPlaced: false },
    { id: "hut-waret", text: "Hut-waret", isPlaced: false },
    { id: "hatshepsut", text: "Hatshepsut", isPlaced: false },
    { id: "akhenaten", text: "Akhenaten", isPlaced: false },
    { id: "tutankhamun", text: "Tutankhamun", isPlaced: false },
    { id: "ay", text: "Ay", isPlaced: false },
    { id: "ra", text: "Ra", isPlaced: false },
    { id: "osiris", text: "Osiris", isPlaced: false },
    { id: "anubis", text: "Anubis", isPlaced: false },
    { id: "khepri", text: "Khepri", isPlaced: false },
  ])

  // Define the pillar sets
  const [pillarSets, setPillarSets] = useState<PillarSet[]>([
    {
      id: "cities",
      pillars: [
        { id: "thebes", label: "Thebes", placedWord: null, outputLetter: "" },
        { id: "memphis", label: "Memphis", placedWord: null, outputLetter: "" },
        { id: "alexandria", label: "Alexandria", placedWord: null, outputLetter: "" },
        { id: "avaris", label: "Avaris", placedWord: null, outputLetter: "" },
      ],
    },
    {
      id: "gods",
      pillars: [
        {
          id: "scarab",
          symbol:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/scarab-icon-hLMNbQZuOdWFFMAtoXBuiPARTOqN65.webp",
          symbolAlt: "Scarab",
          placedWord: null,
          outputLetter: "",
        },
        {
          id: "eye-of-ra",
          symbol:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/eye-of-ra-icon-HC4IsTyuj0PndTT9Ff7pYd1lBDQFX7.webp",
          symbolAlt: "Eye of Ra",
          placedWord: null,
          outputLetter: "",
        },
        {
          id: "djed",
          symbol:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/djed-icon-m3WfAvMoiOTrQVUw7CBUD52znIAMnW.webp",
          symbolAlt: "Djed",
          placedWord: null,
          outputLetter: "",
        },
        {
          id: "jackal",
          symbol:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/jackal-icon-9zV0og0BgjiCTIL2PZzdoM1prwvkeb.webp",
          symbolAlt: "Jackal",
          placedWord: null,
          outputLetter: "",
        },
      ],
    },
    {
      id: "pharaohs",
      pillars: [
        { id: "position1", placedWord: null, outputLetter: "" },
        { id: "position2", placedWord: null, outputLetter: "" },
        { id: "position3", placedWord: null, outputLetter: "" },
        { id: "position4", placedWord: null, outputLetter: "" },
      ],
    },
  ])

  // Current active pillar set
  const [activePillarSetIndex, setActivePillarSetIndex] = useState(0)

  // Output message
  const [outputMessage, setOutputMessage] = useState("")

  // Drag state
  const [draggedWord, setDraggedWord] = useState<string | null>(null)

  // Letter mappings for each pillar and word combination
  const letterMappings: Record<string, Record<string, string>> = {
    // Cities
    thebes: {
      waset: "S",
      "men-nefer": "A",
      raqnote: "B",
      "hut-waret": "C",
      hatshepsut: "D",
      akhenaten: "E",
      tutankhamun: "F",
      ay: "G",
      ra: "H",
      osiris: "J",
      anubis: "K",
      khepri: "L",
    },
    memphis: {
      waset: "M",
      "men-nefer": "I",
      raqnote: "N",
      "hut-waret": "O",
      hatshepsut: "P",
      akhenaten: "Q",
      tutankhamun: "R",
      ay: "S",
      ra: "T",
      osiris: "U",
      anubis: "V",
      khepri: "W",
    },
    alexandria: {
      waset: "X",
      "men-nefer": "Y",
      raqnote: "L",
      "hut-waret": "Z",
      hatshepsut: "A",
      akhenaten: "B",
      tutankhamun: "C",
      ay: "D",
      ra: "E",
      osiris: "F",
      anubis: "G",
      khepri: "H",
    },
    avaris: {
      waset: "I",
      "men-nefer": "J",
      raqnote: "K",
      "hut-waret": "E",
      hatshepsut: "L",
      akhenaten: "M",
      tutankhamun: "N",
      ay: "O",
      ra: "P",
      osiris: "Q",
      anubis: "R",
      khepri: "S",
    },

    // Gods
    scarab: {
      waset: "T",
      "men-nefer": "U",
      raqnote: "V",
      "hut-waret": "W",
      hatshepsut: "X",
      akhenaten: "Y",
      tutankhamun: "Z",
      ay: "A",
      ra: "B",
      osiris: "C",
      anubis: "D",
      khepri: "N",
    },
    "eye-of-ra": {
      waset: "E",
      "men-nefer": "F",
      raqnote: "G",
      "hut-waret": "H",
      hatshepsut: "I",
      akhenaten: "J",
      tutankhamun: "K",
      ay: "L",
      ra: "T",
      osiris: "M",
      anubis: "N",
      khepri: "O",
    },
    djed: {
      waset: "P",
      "men-nefer": "Q",
      raqnote: "R",
      "hut-waret": "S",
      hatshepsut: "T",
      akhenaten: "U",
      tutankhamun: "V",
      ay: "W",
      ra: "X",
      osiris: "M",
      anubis: "Y",
      khepri: "Z",
    },
    jackal: {
      waset: "A",
      "men-nefer": "B",
      raqnote: "C",
      "hut-waret": "D",
      hatshepsut: "E",
      akhenaten: "F",
      tutankhamun: "G",
      ay: "H",
      ra: "I",
      osiris: "J",
      anubis: "I",
      khepri: "K",
    },

    // Pharaohs
    position1: {
      waset: "L",
      "men-nefer": "M",
      raqnote: "N",
      "hut-waret": "O",
      hatshepsut: "R",
      akhenaten: "P",
      tutankhamun: "Q",
      ay: "R",
      ra: "S",
      osiris: "T",
      anubis: "U",
      khepri: "V",
    },
    position2: {
      waset: "W",
      "men-nefer": "X",
      raqnote: "Y",
      "hut-waret": "Z",
      hatshepsut: "A",
      akhenaten: "A",
      tutankhamun: "B",
      ay: "C",
      ra: "D",
      osiris: "E",
      anubis: "F",
      khepri: "G",
    },
    position3: {
      waset: "H",
      "men-nefer": "I",
      raqnote: "J",
      "hut-waret": "K",
      hatshepsut: "L",
      akhenaten: "M",
      tutankhamun: "G",
      ay: "N",
      ra: "O",
      osiris: "P",
      anubis: "Q",
      khepri: "R",
    },
    position4: {
      waset: "S",
      "men-nefer": "T",
      raqnote: "U",
      "hut-waret": "V",
      hatshepsut: "W",
      akhenaten: "X",
      tutankhamun: "Y",
      ay: "E",
      ra: "Z",
      osiris: "A",
      anubis: "B",
      khepri: "C",
    },
  }

  // Update output message whenever pillars change
  useEffect(() => {
    let message = ""

    // Process first set (cities)
    pillarSets[0].pillars.forEach((pillar) => {
      if (pillar.placedWord && letterMappings[pillar.id] && letterMappings[pillar.id][pillar.placedWord]) {
        message += letterMappings[pillar.id][pillar.placedWord]
      }
    })

    // Process second set (gods)
    pillarSets[1].pillars.forEach((pillar) => {
      if (pillar.placedWord && letterMappings[pillar.id] && letterMappings[pillar.id][pillar.placedWord]) {
        message += letterMappings[pillar.id][pillar.placedWord]
      }
    })

    // Process third set (pharaohs)
    pillarSets[2].pillars.forEach((pillar) => {
      if (pillar.placedWord && letterMappings[pillar.id] && letterMappings[pillar.id][pillar.placedWord]) {
        message += letterMappings[pillar.id][pillar.placedWord]
      }
    })

    setOutputMessage(message)
  }, [pillarSets])

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, wordId: string) => {
    setDraggedWord(wordId)
    // Set drag image to be transparent (improves UX)
    const img = new Image()
    img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
    e.dataTransfer.setDragImage(img, 0, 0)
  }

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  // Handle drop on pillar
  const handleDrop = (pillarSetIndex: number, pillarIndex: number) => {
    if (!draggedWord) return

    // Create new pillar sets array
    const newPillarSets = [...pillarSets]

    // Get the pillar that's being dropped on
    const targetPillar = newPillarSets[pillarSetIndex].pillars[pillarIndex]

    // If there's already a word on this pillar, put it back in the word list
    if (targetPillar.placedWord) {
      setWords((prevWords) =>
        prevWords.map((word) => (word.id === targetPillar.placedWord ? { ...word, isPlaced: false } : word)),
      )
    }

    // Place the dragged word on the pillar
    targetPillar.placedWord = draggedWord

    // Update the pillar sets
    setPillarSets(newPillarSets)

    // Mark the word as placed
    setWords((prevWords) => prevWords.map((word) => (word.id === draggedWord ? { ...word, isPlaced: true } : word)))

    // Reset dragged word
    setDraggedWord(null)
  }

  // Handle removing a word from a pillar
  const handleRemoveWord = (pillarSetIndex: number, pillarIndex: number) => {
    const newPillarSets = [...pillarSets]
    const pillar = newPillarSets[pillarSetIndex].pillars[pillarIndex]

    if (pillar.placedWord) {
      // Mark the word as not placed - this returns it to the word cloud
      const wordId = pillar.placedWord
      setWords((prevWords) => prevWords.map((word) => (word.id === wordId ? { ...word, isPlaced: false } : word)))

      // Remove the word from the pillar
      pillar.placedWord = null

      // Update the pillar sets
      setPillarSets(newPillarSets)
    }
  }

  // Unlock the answer input once every pillar across every set has a word placed.
  useEffect(() => {
    const allFilled = pillarSets.every((set) => set.pillars.every((pillar) => pillar.placedWord !== null))
    if (allFilled) {
      onSolve?.()
    }
  }, [pillarSets])

  // Navigate between pillar sets
  const goToPreviousSet = () => {
    setActivePillarSetIndex((prev) => (prev === 0 ? pillarSets.length - 1 : prev - 1))
  }

  const goToNextSet = () => {
    setActivePillarSetIndex((prev) => (prev === pillarSets.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="w-full max-w-md mx-auto bg-gray-900/50 p-4 rounded-lg border border-gray-800">
      {/* Word cloud */}
      <div className="mb-6">
        <div className="flex flex-wrap justify-center gap-2">
          {words.map(
            (word) =>
              !word.isPlaced && (
                <div
                  key={word.id}
                  className="px-3 py-1.5 bg-gradient-to-b from-amber-800/60 to-amber-900/60 backdrop-blur-sm rounded-md text-amber-200 font-pixel text-sm cursor-grab hover:from-amber-700/60 hover:to-amber-800/60 transition-colors shadow-md border border-amber-700/30"
                  draggable
                  onDragStart={(e) => handleDragStart(e, word.id)}
                >
                  {word.text}
                </div>
              ),
          )}
        </div>
      </div>

      {/* Pillar set carousel */}
      <div className="relative mb-6">
        <div className="flex justify-between items-center mb-2">
          <button
            onClick={goToPreviousSet}
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
            aria-label="Previous set"
          >
            <ChevronLeft className="w-5 h-5 text-gray-300" />
          </button>
          <button
            onClick={goToNextSet}
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
            aria-label="Next set"
          >
            <ChevronRight className="w-5 h-5 text-gray-300" />
          </button>
        </div>

        {/* Active pillar set */}
        <div className="grid grid-cols-2 gap-4">
          {pillarSets[activePillarSetIndex].pillars.map((pillar, pillarIndex) => (
            <div key={pillar.id} className="flex flex-col items-center">
              {/* Pillar structure with drop zone */}
              <div className="relative flex flex-col items-center">
                {/* Top half of pillar with label or symbol */}
                <div className="relative">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pillar_top-dnHRCub2izhpe9OPQjKaBgOe37twJP.webp"
                    alt="Pillar top"
                    width={100}
                    height={100}
                    className="w-32 h-auto object-contain"
                  />

                  {/* City name or symbol in the center of top half */}
                  {activePillarSetIndex === 0 && pillar.label && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-3 py-1.5 bg-gradient-to-b from-amber-800/60 to-amber-900/60 backdrop-blur-sm rounded-md text-amber-200 font-pixel text-sm border border-amber-700/30">
                      {pillar.label}
                    </div>
                  )}

                  {activePillarSetIndex === 1 && pillar.symbol && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-gradient-to-b from-amber-800/60 to-amber-900/60 backdrop-blur-sm rounded-full border border-amber-700/30">
                      <Image
                        src={pillar.symbol || "/placeholder.svg"}
                        alt={pillar.symbolAlt || "Symbol"}
                        width={32}
                        height={32}
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                  )}

                  {/* Position number for pharaoh set */}
                  {activePillarSetIndex === 2 && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-amber-900/80 border border-amber-700 flex items-center justify-center text-amber-200 font-pixel text-xs">
                      {pillarIndex + 1}
                    </div>
                  )}
                </div>

                {/* Bottom half of pillar - drop zone */}
                <div
                  className="relative"
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(activePillarSetIndex, pillarIndex)}
                >
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pillar_bottom-SPWdkFa96Ek0YXicIAZQAQNXdbDdvn.webp"
                    alt="Pillar bottom"
                    width={100}
                    height={100}
                    className="w-32 h-auto object-contain -mt-1"
                  />

                  {/* Drop zone indicator */}
                  {!pillar.placedWord && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-12 border-2 border-dashed border-amber-700/30 rounded-md flex items-center justify-center">
                      <span className="text-amber-700/50 text-xs">Drop here</span>
                    </div>
                  )}

                  {/* Placed word */}
                  {pillar.placedWord && (
                    <div
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-3 py-1.5 bg-gradient-to-b from-amber-800/60 to-amber-900/60 backdrop-blur-sm rounded-md text-amber-200 font-pixel text-sm cursor-pointer hover:from-amber-600/80 hover:to-amber-800/80 transition-colors shadow-md border border-amber-600/30"
                      onClick={() => handleRemoveWord(activePillarSetIndex, pillarIndex)}
                    >
                      {words.find((w) => w.id === pillar.placedWord)?.text || ""}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Output message */}
      <div className="bg-gray-900 p-3 rounded-lg border border-gray-800 text-center">
        <p className="text-lg font-mono tracking-wider text-purple-300">{outputMessage || "..."}</p>
      </div>
    </div>
  )
}
