"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import FinalJigsawPuzzle from "./final-jigsaw-puzzle"
import ElevatorPanel from "./elevator-panel"

// Helper functions for encoding/decoding
/**
 * Convert a number to Roman numeral
 */
function toRoman(num: number): string {
  const romanNumerals: Record<number, string> = {
    1: "I",
    2: "II",
    3: "III",
    4: "IV",
    5: "V",
    6: "VI",
    7: "VII",
    8: "VIII",
    9: "IX",
    10: "X",
  }

  return romanNumerals[num] || num.toString()
}

/**
 * Find all positions of a character in the table
 */
function findCharPositions(
  char: string,
  table: string[][],
): Array<{ column: number; row: number; letterPosition: number }> {
  const positions: Array<{ column: number; row: number; letterPosition: number }> = []

  // Search through the table
  for (let row = 0; row < table.length; row++) {
    for (let col = 0; col < table[row].length; col++) {
      const word = table[row][col].toLowerCase()

      // Find all occurrences of the character in the word
      for (let pos = 0; pos < word.length; pos++) {
        if (word[pos] === char) {
          positions.push({
            column: col + 1, // 1-indexed
            row: row + 1, // 1-indexed
            letterPosition: pos + 1, // 1-indexed
          })
        }
      }
    }
  }

  return positions
}

/**
 * Validate if all characters in the input can be found in the table
 */
function validateInput(input: string, table: string[][]): boolean {
  const cleanInput = input.toLowerCase().replace(/\s/g, "")
  for (const char of cleanInput) {
    const positions = findCharPositions(char, table)
    if (positions.length === 0) {
      return false
    }
  }
  return true
}

/**
 * Function to encode a string using position references from a table
 */
function encodeString(input: string): string[] | null {
  // Define the reference table
  const table = [
    ["Samjiva", "Hahava"],
    ["Kalasutra", "Atata"],
    ["Samghata", "Alala"],
    ["Raurava", "Ababa"],
    ["Maharaurava", "Utpala"],
    ["Tapana", "Padma"],
    ["Pratapana", "Kumuda"],
    ["Avici", "Pundarika"],
  ]

  // First validate the input
  if (!validateInput(input, table)) {
    return null
  }

  // Remove spaces and convert to lowercase for consistent processing
  const cleanInput = input.toLowerCase().replace(/\s/g, "")
  const result: string[] = []

  // Process each character
  for (const char of cleanInput) {
    const positions = findCharPositions(char, table)
    // Randomly select one of the positions
    const randomIndex = Math.floor(Math.random() * positions.length)
    const position = positions[randomIndex]

    // Convert to Roman numerals (column, row, letter position)
    const romanPosition = `${toRoman(position.column)},${toRoman(position.row)},${toRoman(position.letterPosition)}`
    result.push(romanPosition)
  }

  return result
}

// Helper function to get the appropriate hell image based on floor number
function getHellImage(floor: number): string {
  const hellImages: Record<number, string> = {
    [-1]: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sanjiva-Qum6JaYX4HbbmDQ7vboJhdurDG7Fcs.webp",
    [-2]: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kalasutra-5wddXuYdte7YsztzNA1unMS0HB9soO.webp",
    [-3]: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/samghata-iVNtHRCeDMVY1dMIpbYTtZxsxi1eix.webp",
    [-4]: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/raurava-vB9FtmGGwk01dbh2vTmJBKCJnbaUfc.webp",
    [-5]: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/maharaurava-ScCMruzUupCO6VYubvWaMecp36xAGU.webp",
    [-6]: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tapana-V4P1oGePE8JLCyNFILAkoenvSHeyJ1.webp",
    [-7]: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pratapana-axNRuDoGpQblmqBLO6EfNycHn2Pmmz.webp",
    [-8]: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/avici-ve4kJh6a29EjVPErs7MlHZGYVON4zh.webp",
    [-9]: "/images/arbuda.webp",
    [-10]: "/images/nirarbuda.webp",
    [-11]: "/images/atata.webp",
    [-12]: "/images/hahava.webp",
    [-13]: "/images/huhuva.webp",
    [-14]: "/images/utpala.webp",
    [-15]: "/images/mahapadma.webp",
    [-16]: "/images/pundarika.webp",
  }

  return hellImages[floor] || "/images/elevator.webp"
}

interface FinalLevelPuzzleProps {
  onSolve: () => void
  onDevilClick: () => void
  onAllPiecesRemoved?: () => void
  onElevatorPanelOpen?: () => void
  currentFloor?: number
  onFloorChange?: (floor: number) => void
}

export default function FinalLevelPuzzle({
  onSolve,
  onDevilClick,
  onAllPiecesRemoved,
  onElevatorPanelOpen,
  currentFloor: propCurrentFloor,
  onFloorChange,
}: FinalLevelPuzzleProps) {
  // State for tracking puzzle progress
  const [isPuzzleComplete, setIsPuzzleComplete] = useState(false)
  const [piecesRemoved, setPiecesRemoved] = useState(0)
  const [allPiecesRemoved, setAllPiecesRemoved] = useState(false)
  const [showElevator, setShowElevator] = useState(false)
  const [showElevatorPanel, setShowElevatorPanel] = useState(false)
  const [currentFloor, setCurrentFloor] = useState(0) // Start at floor 0 (jigsaw room)
  const [floorLabels, setFloorLabels] = useState<Record<number, string>>({})
  const [submitHovered, setSubmitHovered] = useState(false)
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [hasUsedElevator, setHasUsedElevator] = useState(false)
  const [encodedSolution, setEncodedSolution] = useState<string[]>([])
  const [solution, setSolution] = useState<string>("")
  const [hellDescriptions, setHellDescriptions] = useState<Record<number, string>>({})

  // Sync with the currentFloor prop if provided
  useEffect(() => {
    if (propCurrentFloor !== undefined) {
      setCurrentFloor(propCurrentFloor)
    }
  }, [propCurrentFloor])

  // Generate a random solution when the elevator is first used
  useEffect(() => {
    if (hasUsedElevator && encodedSolution.length === 0) {
      const possibleSolutions = [
        "BRUTAL BURNING SCAR",
        "BRUTAL HIDING VAULT",
        "BRUTAL KILLING RUIN",
        "DARK BURNING RUINS",
        "DARK HIDING LIMBS",
        "DARK KILLING PAINS",
        "DARK HAUNTING PAIN",
        "DARK PLAGUING LIMB",
        "DARK STINGING LIMB",
        "DARK UNLIVING PAIN",
        "GRIM BURNING PAINS",
        "GRIM HIDING RUINS",
        "GRIM KILLING LIMBS",
        "GRIM HAUNTING RUIN",
        "GRIM PLAGUING PAIN",
        "GRIM STINGING PAIN",
        "GRIM UNLIVING RUIN",
        "HARSH BURNING LIMBS",
        "HARSH HIDING PAINS",
        "HARSH KILLING RUINS",
        "HARSH PLAGUING RUIN",
        "HARSH STINGING RUIN",
        "LURID BURNING VAULT",
        "LURID HIDING BLIGHT",
        "LURID KILLING LIMB",
        "RIGID BURNING LIMB",
        "RIGID HIDING VAULT",
        "RIGID KILLING PAIN",
      ]

      // Select a random solution
      const randomSolution = possibleSolutions[Math.floor(Math.random() * possibleSolutions.length)]
      setSolution(randomSolution)

      // Encode the solution
      const encoded = encodeString(randomSolution)
      if (encoded) {
        setEncodedSolution(encoded)

        // Initialize hell descriptions
        initializeHellDescriptions()
      }
    }
  }, [hasUsedElevator, encodedSolution.length])

  // Initialize descriptions for each hell
  const initializeHellDescriptions = () => {
    const descriptions: Record<number, string> = {
      // Hot hells
      [-1]: "In this realm, the damned are repeatedly killed and revived, only to be killed again. The cycle of death and rebirth is endless, each revival bringing with it the full memory of previous torments. Guards with animal heads wield weapons of flame, hunting down souls who futilely attempt to hide or escape.",
      [-2]: "Here, the damned are marked with black lines by demonic surveyors. Massive saws and blades follow these lines precisely, dismembering the victims along the markings. Once cut apart, the pieces reassemble, only for the process to begin anew. The ground runs black with ink and blood.",
      [-3]: "Mountains of iron crash together like cymbals, with the damned caught between them. The sound of bones being pulverized echoes throughout this cavernous realm. When the mountains part, the flattened souls reform, only to be crushed again when the cycle repeats.",
      [-4]: "The screams here are so loud they would shatter mortal eardrums. Souls burn in massive iron cauldrons, their skin blistering and peeling away. The air is thick with the stench of burning flesh and the sound of desperate wailing that gives this hell its name.",
      [-5]: "A place of great screaming, where souls are submerged in vats of molten metal. Their bodies melt and reform continuously, each cycle bringing fresh agony. The metal glows with an unnatural light, illuminating the twisted faces of the damned as they howl in torment.",
      [-6]: "Souls here are impaled on red-hot iron stakes that enter through the feet and emerge from the crown of the head. The heat is so intense that the victims glow from within, their organs cooking slowly. Demonic attendants rotate the stakes to ensure even heating.",
      [-7]: "The great heating hell, where souls are packed into immense iron cauldrons the size of mountains. The metal is heated until it glows white, and the damned within are cooked like so much stew. The bubbling of boiling blood and liquefied fat creates a horrific symphony.",
      [-8]: "The lowest and most terrible of the hot hells. Here, there is no respite, not even for a moment - hence its name, 'without interruption.' Souls burn in individual cells of fire, isolated and alone. The flames are so hot they appear almost white, consuming everything yet preserving the damned for eternal suffering.",

      // Cold hells
      [-9]: "The first of the cold hells, where the temperature drops so low that the skin of the damned erupts in painful blisters. These blisters grow to enormous size, filled with frozen pus and blood. The landscape is barren and white, with howling winds that cut like knives.",
      [-10]:
        "Colder still than Arbuda, here the massive blisters that cover the damned burst open from the intense cold. The wounds immediately freeze over, creating jagged crystals of ice that tear at the flesh from within. The ground is littered with frozen fragments of skin and fluid.",
      [-11]:
        "In this realm of intense cold, the damned can only utter 'at-at-at' as their teeth chatter uncontrollably. Their bodies shake so violently that muscles tear and bones fracture, only to freeze solid in grotesque positions. The sound of chattering teeth creates a constant background noise.",
      [-12]:
        "The cold is so severe here that victims can only cry 'ha-ha-va' in their agony. Their breath freezes solid as it leaves their mouths, creating clouds of ice crystals that hang in the air. Skin turns blue then black as frostbite claims extremities, which snap off like icicles.",
      [-13]:
        "Souls here can only utter 'hu-hu-va' as their bodies turn completely blue from the cold. Their blood freezes in their veins, causing excruciating pain as the ice crystals tear through capillaries and arteries. Movement becomes impossible as joints freeze solid.",
      [-14]:
        "Named for the blue lotus, in this hell the skin of the damned turns as blue as the utpala flower. The cold is so intense that the eyeballs freeze solid in their sockets, and the tongue becomes a rigid block of ice. The landscape is dotted with frozen figures, their faces locked in expressions of agony.",
      [-15]:
        "In this penultimate cold hell, the skin cracks open in patterns resembling lotus flowers, with blood freezing as it seeps from the wounds. These cracks deepen until they reach bone, which also begins to split. The entire realm is silent except for the occasional sound of breaking bone.",
      [-16]:
        "The coldest and most terrible of all the cold hells. Here, the skin splits completely into great lotus-like patterns, with entire chunks of flesh falling away to reveal frozen muscle and bone beneath. The cold is so absolute that even thought itself begins to freeze, leaving victims in a state of semi-conscious agony for eons.",
    }

    setHellDescriptions(descriptions)
  }

  // Handle puzzle completion
  const handlePuzzleComplete = () => {
    setIsPuzzleComplete(true)
  }

  // Handle piece removal
  const handlePieceRemoved = (count: number) => {
    setPiecesRemoved(count)
  }

  // Handle all pieces removed
  const handleAllPiecesRemoved = () => {
    setAllPiecesRemoved(true)
    setShowElevator(true)
    // Ensure the elevator is accessible
    setHasUsedElevator(true)

    // Call the callback if provided
    if (onAllPiecesRemoved) {
      onAllPiecesRemoved()
    }
  }

  // Handle elevator click
  const handleElevatorClick = () => {
    setShowElevatorPanel(true)
    setHasUsedElevator(true)

    // Call the callback if provided
    if (onElevatorPanelOpen) {
      onElevatorPanelOpen()
    }
  }

  // Handle floor selection
  const handleFloorSelect = (hell: any) => {
    setCurrentFloor(hell.floor)
    setShowElevatorPanel(false)

    // Call the onFloorChange callback if provided
    if (onFloorChange) {
      onFloorChange(hell.floor)
    }
  }

  // Handle floor renaming
  const handleRenameFloor = (floor: number, name: string) => {
    setFloorLabels((prev) => ({
      ...prev,
      [floor]: name,
    }))
  }

  // Handle submit hover
  const handleSubmitHover = () => {
    if (isPuzzleComplete && !allPiecesRemoved) {
      setSubmitHovered(true)
      setSubmitAttempted(true)
    }
  }

  // Handle submit leave
  const handleSubmitLeave = () => {
    setSubmitHovered(false)
  }

  // Get the encoded string for the current floor
  const getEncodedStringForFloor = (floor: number) => {
    // Convert floor to index (e.g., -1 -> 0, -2 -> 1, etc.)
    const index = Math.abs(floor) - 1

    if (encodedSolution && index >= 0 && index < encodedSolution.length) {
      return encodedSolution[index]
    }

    return "???"
  }

  // Get random elevator message
  const getRandomElevatorMessage = () => {
    const messages = [
      "The elevator descends with a sickening lurch...",
      "The elevator doors open to reveal a nightmarish scene...",
      "As the elevator stops, screams echo from beyond the doors...",
      "The elevator shudders to a halt, and the doors slide open with a groan...",
      "The temperature changes dramatically as the elevator doors open...",
      "A wave of despair washes over you as the elevator reaches its destination...",
      "The elevator's descent seems to take an eternity before finally stopping...",
      "The elevator doors part to reveal the horrors that await...",
    ]

    return messages[Math.floor(Math.random() * messages.length)]
  }

  // Get the description for the current floor
  const getHellDescription = (floor: number) => {
    return (
      hellDescriptions[floor] ||
      "This realm defies description. Even the Devil finds it difficult to articulate the nature of the suffering here."
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Jigsaw puzzle room */}
      {currentFloor === 0 && (
        <>
          {/* Jigsaw puzzle */}
          {!showElevator && (
            <FinalJigsawPuzzle
              onComplete={handlePuzzleComplete}
              onPieceRemoved={handlePieceRemoved}
              onAllPiecesRemoved={handleAllPiecesRemoved}
            />
          )}

          {/* Message after puzzle completion */}
          {isPuzzleComplete && !allPiecesRemoved && (
            <p className="text-gray-300 whitespace-pre-line font-mono text-sm mt-4">
              The image shows Yama, the God of Death, overlooking the Underworld.
            </p>
          )}

          {/* Elevator image (after all pieces removed) */}
          {showElevator && (
            <div className="mt-4">
              <div
                className="w-full max-w-md relative cursor-pointer transition-transform hover:scale-105"
                onClick={handleElevatorClick}
              >
                <Image
                  src="/images/elevator.webp"
                  alt="Elevator to Hell"
                  width={400}
                  height={400}
                  className="w-full h-auto rounded-lg border-2 border-red-900/50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg"></div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Hell rooms */}
      {currentFloor !== 0 && !showElevatorPanel && (
        <>
          <h3 className="text-center text-red-300 font-pixel mb-4">{getRandomElevatorMessage()}</h3>

          <p className="text-gray-300 whitespace-pre-line font-mono text-sm mb-4">{getHellDescription(currentFloor)}</p>

          <div className="flex justify-center mb-4">
            <Image
              src={getHellImage(currentFloor) || "/placeholder.svg"}
              alt="Hell realm"
              width={400}
              height={400}
              className="w-full h-auto rounded-lg border-2 border-gray-800"
            />
          </div>

          {/* Encoded solution string */}
          <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700 mb-4 text-center">
            <p className="text-red-300 font-pixel">{getEncodedStringForFloor(currentFloor)}</p>
          </div>

          {/* For testing purposes - show solution in the last room */}
          {currentFloor === -16 && (
            <div className="mt-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
              <p className="text-xs text-gray-400">For testing: The solution is "{solution.toLowerCase()}"</p>
            </div>
          )}
        </>
      )}

      {/* Elevator panel */}
      {showElevatorPanel && (
        <ElevatorPanel
          onClose={() => setShowElevatorPanel(false)}
          onFloorSelect={handleFloorSelect}
          currentFloor={currentFloor}
          onRenameFloor={handleRenameFloor}
          floorLabels={floorLabels}
          correctNames={{
            [-1]: "samjiva",
            [-2]: "kalasutra",
            [-3]: "samghata",
            [-4]: "raurava",
            [-5]: "maharaurava",
            [-6]: "tapana",
            [-7]: "pratapana",
            [-8]: "avici",
            [-9]: "arbuda",
            [-10]: "nirarbuda",
            [-11]: "atata",
            [-12]: "hahava",
            [-13]: "huhuva",
            [-14]: "utpala",
            [-15]: "padma",
            [-16]: "pundarika",
          }}
        />
      )}
    </div>
  )
}
