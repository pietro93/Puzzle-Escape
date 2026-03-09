"use client"

import React, { useState, useEffect } from "react"

interface DugBone {
  letter: string
  x: number
  y: number
  rotation: number
}

interface ShacklesPuzzleProps {
  onSolve: () => void
}

const ShacklesPuzzle: React.FC<ShacklesPuzzleProps> = ({ onSolve }) => {
  const solution = ["R", "A", "B", "I", "D", " ", "R", "E", "N", "D"]
  const preInscribedBones = ["R", "B", "D", "R", "N", "D"] // Available pre-inscribed bones
  const boneSequence = ["pre", "empty", "pre", "empty", "empty", "pre", "empty", "pre", "empty", "pre", "pre"] // What type Shackles provides
  const inscribeSequence = ["A", "I", " ", "E"] // Letters to inscribe on empty bones
  const [currentIndex, setCurrentIndex] = useState(0)
  const [inventory, setInventory] = useState<string[]>([]) // Start empty
  const [boneSequenceIndex, setBoneSequenceIndex] = useState(0) // Track position in bone sequence
  const [remainingPreBones, setRemainingPreBones] = useState<string[]>([...preInscribedBones]) // Track remaining pre-inscribed bones
  const [dugBones, setDugBones] = useState<DugBone[]>([])
  const [shacklesState, setShacklesState] = useState<"resting" | "excited" | "holding" | "digging">("resting")
  const [tombState, setTombState] = useState<"filled" | "dig">("filled")
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [showInputPopup, setShowInputPopup] = useState(false)
  const [inputLetter, setInputLetter] = useState("")
  const [dialogue, setDialogue] = useState<string | null>(null)
  const [inscribeIndex, setInscribeIndex] = useState(0) // Track position in inscription sequence

  const handleDragStart = (letter: string) => {
    setDraggedItem(letter)
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
  }

  const handleInputSubmit = () => {
  const rawLetter = inputLetter
  const letter = rawLetter.trim().toUpperCase()
  setInputLetter("")
  setShowInputPopup(false)

  // Special handling for the space position (index 2)
  let isCorrectLetter = false

  if (inscribeIndex === 2) {
    // For space position: accept empty input, space character, or empty string after trim
    isCorrectLetter = rawLetter === "" || rawLetter === " " || letter === ""
  } else {
    // For other positions: match the expected letter
    isCorrectLetter = letter === inscribeSequence[inscribeIndex]
  }
  
    if (isCorrectLetter) {
      // Correct letter - bury it (remove only one empty bone)
      setInventory(prev => {
        const index = prev.indexOf("empty")
        if (index !== -1) {
          return [...prev.slice(0, index), ...prev.slice(index + 1)]
        }
        return prev
      })
      setShacklesState("excited")
      setTimeout(() => {
        setShacklesState("holding")
        setTimeout(() => {
          setShacklesState("digging")
          setTombState("dig")
          // Place bone in hole, ensuring minimum distance from existing bones
          const minDistance = 50 // Minimum pixels between bones (increased)
          let x: number, y: number, attempts = 0
          const maxAttempts = 100 // More attempts to find valid position

          do {
            x = 30 + Math.random() * 140 // Wider area: 30 to 170
            y = 130 + Math.random() * 100 // Taller area: 130 to 230
            attempts++
          } while (attempts < maxAttempts && dugBones.some(bone =>
            Math.sqrt((bone.x - x) ** 2 + (bone.y - y) ** 2) < minDistance
          ))



          const rotation = Math.random() * 360
          setDugBones(prev => [...prev, { letter: rawLetter || letter, x, y, rotation }])
          setTimeout(() => {
            setShacklesState("resting")
            setCurrentIndex(prev => prev + 1)
            setInscribeIndex(prev => prev + 1)

            setDialogue("Shackles carefully buries your inscribed bone, then looks at you expectantly.")
            setTimeout(() => setDialogue(null), 4000)

            // Check if solved
            if (currentIndex + 1 === solution.length) {
              onSolve()
            }
          }, 1000)
        }, 1000)
      }, 500)
    } else {
      // Wrong letter - toss it (no new bone given automatically)
      setInventory(prev => {
        const index = prev.indexOf("empty")
        if (index !== -1) {
          return [...prev.slice(0, index), ...prev.slice(index + 1)]
        }
        return prev
      })
      setDialogue("Shackles sniffs the bone disapprovingly, then tosses it aside. Try again!")
      setTimeout(() => setDialogue(null), 4000)
    }
  }

  const handleInputCancel = () => {
    setInputLetter("")
    setShowInputPopup(false)
  }

  const handleShacklesClick = () => {
    if (shacklesState !== "resting") return // Prevent clicking during animation

    // Stop providing bones after puzzle is solved
    if (currentIndex >= solution.length) {
      setDialogue("Shackles has already received all the bones needed. He contentedly chews on them.")
      setTimeout(() => setDialogue(null), 3000)
      return
    }

    const hasBuriedFirstR = currentIndex > 0 // After first R is buried

    if (!hasBuriedFirstR) {
      // Before first R: only give pre-inscribed bones randomly
      if (remainingPreBones.length > 0) {
        const randomIndex = Math.floor(Math.random() * remainingPreBones.length)
        const randomBone = remainingPreBones[randomIndex]

        // Remove from remaining bones
        setRemainingPreBones(prev => prev.filter((_, index) => index !== randomIndex))

        setInventory(prev => [...prev, randomBone])
        setShacklesState("excited")
        setTimeout(() => {
          setShacklesState("holding")
          setTimeout(() => {
            setShacklesState("resting")
          }, 1000)
        }, 500)
        setDialogue(`Shackles digs up a bone already marked with "${randomBone}".`)
        setTimeout(() => setDialogue(null), 4000)
      } else {
        // No more pre-inscribed bones available
        setDialogue("Shackles paws at the earth but finds nothing more to give.")
        setTimeout(() => setDialogue(null), 3000)
      }
    } else {
      // After first R: give either empty bone or remaining pre-inscribed bones randomly
      // But only give empty bone if the last buried letter is a consonant (or space)
      const consonants = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z']
      const lastBuriedLetter = currentIndex > 0 ? solution[currentIndex - 1] : null
      const lastWasConsonant = lastBuriedLetter && (consonants.includes(lastBuriedLetter) || lastBuriedLetter === ' ')

      const canGiveEmpty = !inventory.includes("empty") && lastWasConsonant
      const hasPreBonesLeft = remainingPreBones.length > 0

      if (!canGiveEmpty && !hasPreBonesLeft) {
        setDialogue("Shackles paws at the earth but finds nothing more to give.")
        setTimeout(() => setDialogue(null), 3000)
        return
      }

      // Randomly choose between empty bone or pre-inscribed bone
      const giveEmpty = canGiveEmpty && (!hasPreBonesLeft || Math.random() < 0.5)

      if (giveEmpty) {
        // Give empty bone
        setInventory(prev => [...prev, "empty"])
        setBoneSequenceIndex(prev => prev + 1)
        setShacklesState("excited")
        setTimeout(() => {
          setShacklesState("holding")
          setTimeout(() => {
            setShacklesState("resting")
          }, 1000)
        }, 500)
        setDialogue("Shackles paws at the earth and unearths a blank bone for you to inscribe.")
        setTimeout(() => setDialogue(null), 4000)
      } else if (hasPreBonesLeft) {
        // Give random pre-inscribed bone
        const randomIndex = Math.floor(Math.random() * remainingPreBones.length)
        const randomBone = remainingPreBones[randomIndex]

        // Remove from remaining bones
        setRemainingPreBones(prev => prev.filter((_, index) => index !== randomIndex))

        setInventory(prev => [...prev, randomBone])
        setShacklesState("excited")
        setTimeout(() => {
          setShacklesState("holding")
          setTimeout(() => {
            setShacklesState("resting")
          }, 1000)
        }, 500)
        setDialogue(`Shackles digs up a bone already marked with "${randomBone}".`)
        setTimeout(() => setDialogue(null), 4000)
      } else {
        // Fallback - this shouldn't happen
        setDialogue("Shackles paws at the earth but finds nothing more to give.")
        setTimeout(() => setDialogue(null), 3000)
      }
    }
  }

  const handleDrop = () => {
    if (!draggedItem || shacklesState !== "resting") return

    if (draggedItem === "empty") {
      // Show input popup for empty bone
      setDialogue("Do you want to inscribe something on the bone?")
      setTimeout(() => {
        setDialogue(null)
        setShowInputPopup(true)
      }, 2000)
      setDraggedItem(null)
      return
    }

    if (draggedItem === solution[currentIndex]) {
      // Correct bone - remove only one instance
      setInventory(prev => {
        const index = prev.indexOf(draggedItem)
        if (index !== -1) {
          return [...prev.slice(0, index), ...prev.slice(index + 1)]
        }
        return prev
      })
      setShacklesState("excited")
      setTimeout(() => {
        setShacklesState("holding")
        setTimeout(() => {
          setShacklesState("digging")
          setTombState("dig")
          // Place bone in hole
          const x = 43.7 + Math.random() * 107.9
          const y = 152 + Math.random() * 64.5
          const rotation = Math.random() * 360
          setDugBones(prev => [...prev, { letter: draggedItem, x, y, rotation }])
          setTimeout(() => {
            setShacklesState("resting")
            setCurrentIndex(prev => prev + 1)

            // After first R, the sequence continues automatically
            if (currentIndex === 0) {
              setDialogue("Shackles buries the bone deep underground, then looks at you expectantly.")
              setTimeout(() => setDialogue(null), 4000)
            }

            // Check if solved
            if (currentIndex + 1 === solution.length) {
              onSolve()
            }
          }, 1000)
        }, 1000)
      }, 500)
    } else {
      // Wrong bone, return to inventory
      setDraggedItem(null)
    }
    setDraggedItem(null)
  }

  const getShacklesImage = () => {
    switch (shacklesState) {
      case "excited":
        return "/images/shackles-2.webp"
      case "holding":
        return "/images/shackles-bone.webp"
      default:
        return "/images/shackles.webp"
    }
  }

  const getTombImage = () => {
    return tombState === "dig" ? "/images/tomb-dig.webp" : "/images/tomb-filled.webp"
  }

  return (
    <div className="flex flex-col">
      {/* Main Puzzle Area with Black Background */}
      <div className="bg-black w-full max-w-md mx-auto relative min-h-[400px] p-4">
        {/* Shackles - Higher z-index, moved towards center */}
        <div className="absolute top-1/3 left-1/3 transform -translate-x-1/3 -translate-y-1/3 z-10">
          <div
            className="cursor-pointer"
            onClick={handleShacklesClick}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <img src={getShacklesImage()} alt="Shackles" className="w-[120] h-[120] object-contain" />
          </div>
        </div>

        {/* Tomb - Lower z-index, moved more towards center */}
        <div className="absolute bottom-6 right-6 z-0">
          <div className="relative">
            <img src={getTombImage()} alt="Tomb" className="w-[220px] h-[270px] object-contain" />
            {/* Dug bones */}
            {dugBones.map((bone, index) => (
              <img
                key={index}
                src={bone.letter === " " ? `/images/shackles-bone-empty.webp` : `/images/shackles-bone-${bone.letter.toLowerCase()}.webp`}
                alt={`Bone ${bone.letter}`}
                className="absolute w-16 h-16 object-contain"
                style={{
                  left: `${bone.x}px`,
                  top: `${bone.y}px`,
                  transform: `rotate(${bone.rotation}deg)`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Inventory - Separate section below */}
      <div className="w-full bg-gray-800/50 p-4 rounded-md shadow-md mt-4">
        <div className="flex flex-wrap gap-4 justify-center max-w-md mx-auto">
          {inventory.map((letter, index) => (
            <img
              key={index}
              src={letter === "empty" ? "/images/shackles-bone-empty.webp" : `/images/shackles-bone-${letter.toLowerCase()}.webp`}
              alt={`Bone ${letter}`}
              className="w-16 h-16 object-contain cursor-move"
              draggable
              onDragStart={() => handleDragStart(letter)}
              onDragEnd={handleDragEnd}
            />
          ))}
        </div>
      </div>

      {/* Dialogue Display */}
      {dialogue && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-40 max-w-sm w-full">
          <div className="bg-gray-900 p-4 rounded-lg border-2 border-gray-700 animate-fadeIn">
            <div className="flex items-start gap-3">
              {/* Shackles Image */}
              <div className="w-12 h-12 relative pixelated-container shrink-0">
                <img
                  src="/images/shackles.webp"
                  alt="Shackles"
                  width={48}
                  height={48}
                  className="pixelated"
                  style={{ imageRendering: "pixelated" }}
                />
              </div>

              {/* Dialogue Text */}
              <div className="flex-1">
                <p className="text-purple-300 font-pixel mb-1 text-xs">Shackles:</p>
                <p className="text-gray-200 text-xs whitespace-pre-line font-pixel">
                  {dialogue}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Input Popup */}
      {showInputPopup && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-900 p-4 rounded-lg border-2 border-gray-700 max-w-sm w-full animate-fadeIn">
            <div className="flex items-start gap-3">
              {/* Shackles Image */}
              <div className="w-16 h-16 relative pixelated-container shrink-0">
                <img
                  src="/images/shackles.webp"
                  alt="Shackles"
                  width={64}
                  height={64}
                  className="pixelated"
                  style={{ imageRendering: "pixelated" }}
                />
              </div>

              {/* Input Content */}
              <div className="flex-1">
                <p className="text-purple-300 font-pixel mb-2">Shackles:</p>
                <p className="text-gray-200 text-sm whitespace-pre-line font-pixel mb-4">
                  Inscribe a letter on this bone?
                </p>
                <input
                  type="text"
                  value={inputLetter}
                  onChange={(e) => setInputLetter(e.target.value.slice(0, 1))} // Allow space or letter
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleInputSubmit()
                    }
                  }}
                  className="w-full p-2 bg-gray-800 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none text-center text-xl font-bold font-pixel"
                  placeholder="?"
                  maxLength={1}
                  autoFocus
                />
              </div>
              </div>
              <div className="mt-4 text-center">
              <button
                className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-md text-xs text-gray-300 font-pixel mr-2"
                onClick={handleInputSubmit}
              >
                INSCRIBE
              </button>
              <button
                className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-md text-xs text-gray-300 font-pixel"
                onClick={handleInputCancel}
              >
                LEAVE BLANK
              </button>
              </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ShacklesPuzzle
