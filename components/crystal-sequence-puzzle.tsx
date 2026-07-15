"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

// Define crystal types
interface Crystal {
  id: string
  name: string
  image: string
  description: string
}

// Define the props for the component
interface CrystalSequencePuzzleProps {
  onSolve: () => void
}

export default function CrystalSequencePuzzle({ onSolve }: CrystalSequencePuzzleProps) {
  // State for available crystals (randomly ordered)
  const [availableCrystals, setAvailableCrystals] = useState<Crystal[]>([])

  // State for the sequence slots (7 positions in a circle)
  const [sequence, setSequence] = useState<(Crystal | null)[]>(Array(7).fill(null))

  // State for drag and drop
  const [draggedCrystal, setDraggedCrystal] = useState<Crystal | null>(null)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  // State for the compendium
  const [showCompendium, setShowCompendium] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)

  // State for puzzle completion
  const [isPuzzleComplete, setIsPuzzleComplete] = useState(false)
  const [showTigerEye, setShowTigerEye] = useState(false)
  const [tigerEyeInCenter, setTigerEyeInCenter] = useState(false)

  // Reference to the container for positioning
  const containerRef = useRef<HTMLDivElement>(null)

  // Define all crystals with their properties
  const allCrystals: Crystal[] = [
    {
      id: "amethyst",
      name: "Amethyst",
      image: "/images/amethyst.webp",
      description:
        "**Color**: Rich purple hues ranging from light lavender to deep violet.\n\n**Shape**: Clustered points or polished geodes.\n\n**Magical Properties**: *Protects against negative energies, enhances spiritual awareness, and calms the mind.*\n\nIn ancient lore, amethyst was said to ward off the darkness, its purple hue a beacon of tranquility amidst turmoil. Those who possess it are shielded from malevolent forces, their minds clear and focused on the path ahead.",
    },
    {
      id: "citrine",
      name: "Citrine",
      image: "/images/citrine.webp",
      description:
        "**Color**: Vibrant yellow-orange tones, reminiscent of sunlight.\n\n**Shape**: Pointed clusters or polished gems.\n\n**Magical Properties**: *Radiates joy, abundance, and positivity.*\n\nCitrine is known as the sunstone, imbuing its bearers with warmth and optimism. It is said to attract prosperity and happiness, illuminating the path to success.",
    },
    {
      id: "lapis-lazuli",
      name: "Lapis Lazuli",
      image: "/images/lapislazuli.webp",
      description:
        "**Color**: Deep blue with golden flecks of pyrite, evoking the night sky.\n\n**Shape**: Polished cabochons or rectangular slabs.\n\n**Magical Properties**: *Promotes wisdom, clarity, and connection to celestial realms.*\n\nThis celestial stone is said to hold the secrets of the universe. It grants wisdom to those who seek it, allowing them to navigate the mysteries of the cosmos with clarity and purpose.",
    },
    {
      id: "moonstone",
      name: "Moonstone",
      image: "/images/moonstone.webp",
      description:
        "**Color**: Soft white with a bluish shimmer, resembling moonlight.\n\n**Shape**: Polished cabochons, often oval or rounded.\n\n**Magical Properties**: *Enhances intuition, dreams, and emotional balance. Associated with lunar energy and feminine power.*\n\nMoonstone is a gentle guide, connecting its bearers to the mystical power of the moon. It fosters intuition and emotional harmony, allowing one to navigate life's challenges with grace and wisdom.",
    },
    {
      id: "obsidian",
      name: "Obsidian",
      image: "/images/obsidian.webp",
      description:
        "**Color**: Glossy black or dark green with a mirror-like surface.\n\n**Shape**: Smooth spheres or sharp-edged shards.\n\n**Magical Properties**: *Provides protection, grounding, and shields against negativity.*\n\nObsidian is born from the fiery depths of volcanoes, its dark beauty forged in the intense heat of the earth. It protects its wielders from harm, grounding them in the present and reflecting back any malevolent energy.",
    },
    {
      id: "rose-quartz",
      name: "Rose Quartz",
      image: "/images/rose-quartz.webp",
      description:
        "**Color**: Soft pink tones with a translucent glow.\n\n**Shape**: Rounded masses or polished hearts.\n\n**Magical Properties**: *Represents love, compassion, and emotional healing.*\n\nRose quartz is the heart of the earth, radiating love and warmth to all who touch it. It heals emotional wounds and fosters compassion, reminding us of the power of love in our lives.",
    },
    {
      id: "selenite",
      name: "Selenite",
      image: "/images/selenite.webp",
      description:
        "**Color**: Pure white with a radiant glow; often translucent.\n\n**Shape**: Columnar formations or polished rods.\n\n**Magical Properties**: *Cleanses energy fields, illuminates spiritual paths, and promotes clarity.*\n\nSelenite is a beacon of light, cleansing the aura and guiding us toward spiritual enlightenment. It illuminates the path ahead, ensuring clarity and purpose in our journey.",
    },
    {
      id: "tigers-eye",
      name: "Tiger's Eye",
      image: "/images/tigers-eye.webp",
      description: "",
    },
  ]

  // The clues for the crystal sequence
  const crystalClues = [
    "The gem that mirrors the night's glow must be the moonstone.",
    "The blue stone is between a white stone and a purple crystal.",
    'Obsidian is "forged from fire", as it is found in volcanos.',
    "The citrine comes after the amethyst.",
    "The last crystal in the sequence is the same color as the first stone in the sequence.",
    "There is one stone leftover once you complete the sequence, place it in the center and check the compendium. What's the name of this stone?",
  ]

  // Initialize the puzzle
  useEffect(() => {
    // Shuffle the crystals
    const shuffled = [...allCrystals].sort(() => Math.random() - 0.5)
    setAvailableCrystals(shuffled)
  }, [])

  // Check if the sequence is correct
  useEffect(() => {
    // Only check if all slots are filled
    if (sequence.every((slot) => slot !== null)) {
      // The correct sequence based on the clues:
      // Moonstone (start) -> Lapis Lazuli -> Amethyst -> Citrine -> Rose Quartz -> Obsidian -> Selenite (end)
      const correctSequence = [
        "moonstone", // The ethereal gem that mirrors the night's glow must either begin or end the sequence
        "lapis-lazuli", // Closely following the lunar gem is the stone of deep wisdom that reflects the stars within its core
        "amethyst", // A purple-hued sentinel must stand before any crystal touched by the earth's grounding force
        "citrine", // The sun's radiant sibling dances beside a crystal that radiates positivity
        "rose-quartz", // Near one forged from fire rests a crystal born of love and compassion
        "obsidian", // A dark guardian follows the gem that leads to radiant joy
        "selenite", // To seal the path, conclude the sequence with the crystal that purifies and illuminates
      ]

      // Check if the current sequence matches the correct one
      const currentSequence = sequence.map((crystal) => crystal?.id)
      const isCorrect = correctSequence.every((id, index) => currentSequence[index] === id)

      if (isCorrect && !isPuzzleComplete) {
        setIsPuzzleComplete(true)
        onSolve()

        // Find the Tiger's Eye crystal and make it glow
        const tigersEye = availableCrystals.find((crystal) => crystal.id === "tigers-eye")
        if (tigersEye) {
          setShowTigerEye(true)
        }
      }
    }
  }, [sequence, availableCrystals, isPuzzleComplete])

  // Handle drag start
  const handleDragStart = (crystal: Crystal, index: number | null, e: React.DragEvent) => {
    // If puzzle is complete and not tiger's eye, prevent dragging
    if (isPuzzleComplete && crystal.id !== "tigers-eye") {
      e.preventDefault()
      return
    }

    setDraggedCrystal(crystal)
    setDraggedIndex(index)
  }

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  // Handle drop on a sequence slot
  const handleDropOnSlot = (slotIndex: number) => {
    if (!draggedCrystal) return

    // If puzzle is complete, only allow tiger's eye to be placed in center
    if (isPuzzleComplete && draggedCrystal.id !== "tigers-eye") return

    // Create a new sequence array
    const newSequence = [...sequence]

    // Check if the target slot is already occupied
    const targetCrystal = newSequence[slotIndex]

    // If the crystal was already in the sequence, remove it from its previous position
    if (draggedIndex !== null) {
      newSequence[draggedIndex] = null
    }

    // If the target slot is occupied, add that crystal back to available crystals
    if (targetCrystal) {
      setAvailableCrystals((prev) => [...prev, targetCrystal])
    }

    // Place the dragged crystal in the new slot
    newSequence[slotIndex] = draggedCrystal

    // Update the sequence
    setSequence(newSequence)

    // Remove the crystal from available crystals if it wasn't already in the sequence
    if (draggedIndex === null) {
      setAvailableCrystals(availableCrystals.filter((c) => c.id !== draggedCrystal.id))
    }

    // Reset drag state
    setDraggedCrystal(null)
    setDraggedIndex(null)
  }

  // Handle drop on center
  const handleDropOnCenter = () => {
    if (!draggedCrystal || draggedCrystal.id !== "tigers-eye" || !isPuzzleComplete || !showTigerEye) return

    setTigerEyeInCenter(true)

    // Remove tiger's eye from available crystals
    setAvailableCrystals(availableCrystals.filter((c) => c.id !== "tigers-eye"))

    // Reset drag state
    setDraggedCrystal(null)
    setDraggedIndex(null)

    // Open compendium with tiger image
    setTimeout(() => {
      setShowCompendium(true)
    }, 500)
  }

  // Handle drop back to available crystals
  const handleDropOnAvailable = () => {
    if (!draggedCrystal || draggedIndex === null) return

    // If puzzle is complete, prevent removing crystals
    if (isPuzzleComplete) return

    // Remove the crystal from the sequence
    const newSequence = [...sequence]
    newSequence[draggedIndex] = null
    setSequence(newSequence)

    // Add the crystal back to available crystals if it's not already there
    if (!availableCrystals.some((c) => c.id === draggedCrystal.id)) {
      setAvailableCrystals([...availableCrystals, draggedCrystal])
    }

    // Reset drag state
    setDraggedCrystal(null)
    setDraggedIndex(null)
  }

  // Handle click on a crystal in the sequence to remove it
  const handleRemoveFromSequence = (index: number) => {
    // If puzzle is complete, prevent removing crystals
    if (isPuzzleComplete) return

    const crystal = sequence[index]
    if (!crystal) return

    const newSequence = [...sequence]
    newSequence[index] = null
    setSequence(newSequence)

    // Add the crystal back to available crystals
    if (!availableCrystals.some((c) => c.id === crystal.id)) {
      setAvailableCrystals([...availableCrystals, crystal])
    }
  }

  // Handle click on an available crystal to add it to the first empty slot
  const handleAddToSequence = (crystal: Crystal) => {
    const emptySlotIndex = sequence.findIndex((slot) => slot === null)
    if (emptySlotIndex !== -1) {
      const newSequence = [...sequence]
      newSequence[emptySlotIndex] = crystal
      setSequence(newSequence)

      // Remove the crystal from available crystals
      setAvailableCrystals(availableCrystals.filter((c) => c.id !== crystal.id))
    }
  }

  // Toggle compendium visibility
  const handleToggleCompendium = () => {
    setShowCompendium(!showCompendium)
  }

  // Navigate compendium pages
  const handleNextPage = () => {
    // If tiger's eye is in center, only show the tiger page
    if (tigerEyeInCenter) {
      return
    }

    // Skip tiger's eye in normal browsing
    const filteredCrystals = allCrystals.filter((c) => c.id !== "tigers-eye")
    setCurrentPage((prev) => (prev + 1) % filteredCrystals.length)
  }

  const handlePrevPage = () => {
    // If tiger's eye is in center, only show the tiger page
    if (tigerEyeInCenter) {
      return
    }

    // Skip tiger's eye in normal browsing
    const filteredCrystals = allCrystals.filter((c) => c.id !== "tigers-eye")
    setCurrentPage((prev) => (prev - 1 + filteredCrystals.length) % filteredCrystals.length)
  }

  // Calculate positions for the circular arrangement
  const getSlotPosition = (index: number, totalSlots: number) => {
    // Start from the top (12 o'clock position) and go clockwise
    const angle = (index * 2 * Math.PI) / totalSlots - Math.PI / 2
    const radius = 120 // Adjust based on your layout

    return {
      left: `calc(50% + ${radius * Math.cos(angle)}px - 30px)`,
      top: `calc(50% + ${radius * Math.sin(angle)}px - 30px)`,
    }
  }

  // Get the current crystal for the compendium
  const getCurrentCrystal = () => {
    if (tigerEyeInCenter) {
      return null // Will show tiger page instead
    }

    // Skip tiger's eye in normal browsing
    const filteredCrystals = allCrystals.filter((c) => c.id !== "tigers-eye")
    return filteredCrystals[currentPage]
  }

  // Parse markdown-like formatting in descriptions
  const formatDescription = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<span class="font-bold text-purple-300">$1</span>')
      .replace(/\*(.*?)\*/g, '<span class="italic text-amber-300">$1</span>')
      .split("\n\n")
      .map((paragraph, i) => `<p key=${i} class="mb-2">${paragraph}</p>`)
      .join("")
  }

  return (
    <div className="w-full max-w-md mx-auto relative" ref={containerRef}>
      {/* Gypsy's clues */}
      <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-800 mb-6">
        <h3 className="text-purple-300 font-pixel mb-2 text-center">The Gypsy's Instructions</h3>
        <ul className="space-y-2 text-purple-200 text-sm">
          {crystalClues.map((clue, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-amber-300 mt-1">•</span>
              <span>{clue}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Crystal sequence circle */}
      <div
        className="relative w-full h-[300px] bg-gray-900/50 rounded-lg border border-gray-800 mb-6"
        onDragOver={handleDragOver}
      >
        {/* Sequence slots in a circle */}
        {sequence.map((crystal, index) => (
          <div
            key={index}
            className={`absolute w-[60px] h-[60px] rounded-full ${
              crystal ? "bg-transparent" : "bg-gray-800/80 border-2 border-dashed border-gray-600"
            }`}
            style={getSlotPosition(index, sequence.length)}
            onDragOver={handleDragOver}
            onDrop={() => handleDropOnSlot(index)}
          >
            {crystal && (
              <div className="relative w-full h-full">
                <Image
                  src={crystal.image || "/placeholder.svg"}
                  alt={crystal.name}
                  width={60}
                  height={60}
                  className="w-full h-full object-contain rounded-full"
                  draggable={!isPuzzleComplete}
                  onDragStart={(e) => handleDragStart(crystal, index, e)}
                />
                {!isPuzzleComplete && (
                  <button
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                    onClick={() => handleRemoveFromSequence(index)}
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Center area for Tiger's Eye */}
        <div
          className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full ${
            tigerEyeInCenter ? "bg-transparent" : "bg-gray-800/40 border border-dashed border-gray-600"
          }`}
          onDragOver={handleDragOver}
          onDrop={handleDropOnCenter}
        >
          {tigerEyeInCenter && (
            <div className="w-full h-full relative">
              <Image
                src="/images/tigers-eye.webp"
                alt="Crystal"
                width={64}
                height={64}
                className="w-full h-full object-contain rounded-full animate-[glow_1.5s_ease-in-out_infinite_alternate] shadow-[0_0_10px_5px_rgba(255,215,0,0.7)]"
              />
            </div>
          )}
        </div>

        {/* Top indicator (starting point) */}
        <div className="absolute left-1/2 top-[10px] transform -translate-x-1/2 text-xs text-purple-300 font-pixel">
          Start
        </div>
      </div>

      {/* Available crystals */}
      <div
        className="grid grid-cols-4 gap-2 mb-4 bg-gray-900/30 p-3 rounded-lg border border-gray-800"
        onDragOver={handleDragOver}
        onDrop={handleDropOnAvailable}
      >
        {availableCrystals.map((crystal, index) => (
          <div
            key={crystal.id}
            className={`relative w-[60px] h-[60px] cursor-grab ${
              showTigerEye && crystal.id === "tigers-eye" ? "animate-pulse" : ""
            }`}
            onClick={() => handleAddToSequence(crystal)}
          >
            <Image
              src={crystal.image || "/placeholder.svg"}
              alt={crystal.name}
              width={60}
              height={60}
              className={`w-full h-full object-contain rounded-full ${
                showTigerEye && crystal.id === "tigers-eye"
                  ? "animate-[glow_1.5s_ease-in-out_infinite_alternate] shadow-[0_0_10px_5px_rgba(255,215,0,0.7)]"
                  : ""
              }`}
              draggable
              onDragStart={(e) => handleDragStart(crystal, null, e)}
            />
          </div>
        ))}
      </div>

      {/* Compendium button (image instead of text) */}
      <div className="flex justify-center">
        <div
          onClick={handleToggleCompendium}
          className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
        >
          <Image
            src="/images/crystal-compendium.webp"
            alt="Crystal Compendium"
            width={80}
            height={80}
            className="object-contain"
          />
        </div>
      </div>

      {/* Crystal Compendium Modal */}
      {showCompendium && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg border-2 border-purple-900 max-w-md w-full max-h-[80vh] overflow-hidden animate-fadeIn">
            {/* Compendium header */}
            <div className="bg-purple-900/50 p-3 border-b border-purple-800 flex justify-between items-center">
              <h3 className="text-purple-200 font-pixel">Crystal Compendium</h3>
              <button
                onClick={handleToggleCompendium}
                className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Compendium content */}
            <div className="p-4">
              {tigerEyeInCenter ? (
                // Show the Tiger's Eye page when placed in center
                <div className="flex flex-col items-center">
                  <Image src="/images/crystal-tiger.webp" alt="Crystal" width={200} height={200} className="mb-4" />
                  <div className="text-gray-300 text-sm">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: formatDescription(
                          "**Color**: Golden-brown with chatoyant bands resembling a tiger's eye.\n\n**Shape**: Polished cabochons or tumbled stones.\n\n**Magical Properties**: *Enhances focus, willpower, and balance. Provides protection and grounding.*\n\nThis powerful stone combines the earth energy with the energies of the sun, creating a powerful stone that helps you see clearly even in difficult situations. It stimulates taking action and helps you make decisions with discernment and understanding.",
                        ),
                      }}
                    />
                  </div>
                </div>
              ) : (
                // Show regular crystal pages
                <div>
                  <div className="flex justify-center mb-4">
                    <Image
                      src={getCurrentCrystal()?.image || "/placeholder.svg"}
                      alt={getCurrentCrystal()?.name || "Crystal"}
                      width={120}
                      height={120}
                      className="object-contain"
                    />
                  </div>
                  <p className="text-center text-purple-300 font-pixel mb-2">{getCurrentCrystal()?.name}</p>
                  <div className="text-gray-300 text-sm">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: formatDescription(getCurrentCrystal()?.description || ""),
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Navigation buttons */}
            {!tigerEyeInCenter && (
              <div className="bg-gray-900 p-3 border-t border-gray-800 flex justify-between">
                <button
                  onClick={handlePrevPage}
                  className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded flex items-center gap-1 text-xs"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>
                <div className="text-xs text-gray-400">
                  {currentPage + 1} / {allCrystals.length - 1}
                </div>
                <button
                  onClick={handleNextPage}
                  className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded flex items-center gap-1 text-xs"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="text-center text-xs text-gray-400 mt-4 animate-pulse">
        {isPuzzleComplete && showTigerEye && !tigerEyeInCenter
          ? "Drag the glowing crystal to the center of the circle"
          : "Drag and drop crystals to arrange them in the correct sequence"}
      </div>

      {/* CSS for the glowing effect */}
      <style jsx global>{`
        @keyframes glow {
          0% {
            box-shadow: 0 0 5px 2px rgba(255, 215, 0, 0.3);
          }
          100% {
            box-shadow: 0 0 20px 10px rgba(255, 215, 0, 0.7);
          }
        }
      `}</style>
    </div>
  )
}
