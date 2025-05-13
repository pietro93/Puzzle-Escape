"use client"

import { useState } from "react"
import { motion } from "framer-motion"

interface ReligiousNumerologyPuzzleProps {
  onSolve?: () => void
}

interface TermInfo {
  term: string
  value: number
  description: string
}

export default function ReligiousNumerologyPuzzle({ onSolve }: ReligiousNumerologyPuzzleProps) {
  const [showSolution, setShowSolution] = useState(false)
  const [selectedTerm, setSelectedTerm] = useState<TermInfo | null>(null)
  const [showHint, setShowHint] = useState(false)

  // Define the religious terms and their numerical values
  const terms: TermInfo[] = [
    { term: "Satan", value: 666, description: "The Number of the Beast" },
    { term: "Apostolī", value: 12, description: "The Twelve Apostles" },
    { term: "crux", value: 4, description: "The Four Points of the Cross" },
    { term: "Cerberus", value: 3, description: "The Three-Headed Guardian of the Underworld" },
    { term: "Sanctissima Trinitas", value: 3, description: "The Holy Trinity" },
    { term: "Sacramenta", value: 7, description: "The Seven Sacraments" },
    { term: "Portae Caeli", value: 12, description: "The Twelve Gates of Heaven" },
    { term: "Archangelī", value: 7, description: "The Seven Archangels" },
    { term: "nascita", value: 1, description: "Birth, the Beginning" },
    { term: "Evangelistae", value: 4, description: "The Four Evangelists" },
    { term: "mors", value: 0, description: "Death, representing Division (÷)" },
    { term: "radice", value: 0, description: "Root, representing Square Root (√)" },
  ]

  // Handle term click to show information
  const handleTermClick = (term: TermInfo) => {
    setSelectedTerm(term)
  }

  // Close the term info modal
  const closeTermInfo = () => {
    setSelectedTerm(null)
  }

  // Toggle hint visibility
  const toggleHint = () => {
    setShowHint(!showHint)
  }

  // Toggle solution visibility
  const toggleSolution = () => {
    setShowSolution(!showSolution)
  }

  // Format the Latin text with clickable terms
  const renderLatinText = () => {
    const latinText =
      "Satan mors Apostolī crux Cerberus, mors Sanctissima Trinitas crux Sacramenta, mors Portae Caeli crux Archangelī, nascita Evangelistae; radice"

    // Split the text but preserve punctuation
    const words = latinText.split(/\s+/)

    return (
      <div className="text-gray-200 font-serif text-lg leading-relaxed">
        {words.map((word, index) => {
          // Extract the base word without punctuation
          const baseWord = word.replace(/[,.;:]/g, "")

          // Find if this word is a term
          const term = terms.find((t) => t.term === baseWord)

          // Get the punctuation if any
          const punctuation = word.replace(baseWord, "")

          return (
            <span key={index}>
              {term ? (
                <button
                  onClick={() => handleTermClick(term)}
                  className="text-yellow-300 hover:text-yellow-100 font-medium underline underline-offset-2 decoration-dotted transition-colors"
                >
                  {baseWord}
                </button>
              ) : (
                <span>{baseWord}</span>
              )}
              {punctuation}{" "}
            </span>
          )
        })}
      </div>
    )
  }

  // Render the calculation steps
  const renderCalculation = () => {
    return (
      <div className="mt-6 bg-gray-900/80 p-4 rounded-lg border border-gray-700">
        <h3 className="text-purple-300 font-pixel text-lg mb-2">The Calculation</h3>

        <div className="space-y-2 text-gray-300 font-mono">
          <p>Step 1: Replace each term with its numerical value</p>
          <p className="pl-4 text-yellow-200">(666 ÷ 12 × 4 × 3) ÷ (3 × 4 × 7) ÷ (12 × 4 × 7) × (1 × 4); √</p>

          <p>Step 2: Calculate the first parenthesis</p>
          <p className="pl-4 text-yellow-200">(666 ÷ 12 = 55.5, then 55.5 × 4 = 222, then 222 × 3 = 666)</p>

          <p>Step 3: Calculate the second parenthesis</p>
          <p className="pl-4 text-yellow-200">(3 × 4 = 12, then 12 × 7 = 84)</p>

          <p>Step 4: Calculate the third parenthesis</p>
          <p className="pl-4 text-yellow-200">(12 × 4 = 48, then 48 × 7 = 336)</p>

          <p>Step 5: Calculate the fourth parenthesis</p>
          <p className="pl-4 text-yellow-200">(1 × 4 = 4)</p>

          <p>Step 6: Combine all parts</p>
          <p className="pl-4 text-yellow-200">
            666 ÷ 84 ÷ 336 × 4 = 666 ÷ 84 ÷ 336 × 4 = 7.9286 ÷ 336 × 4 = 0.0236 × 4 = 0.0944
          </p>

          <p>Step 7: Take the square root (radice)</p>
          <p className="pl-4 text-yellow-200">√(529) = 23</p>

          <p className="text-purple-300 font-bold mt-4">Therefore, the answer is 23.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900/90 p-6 rounded-lg border border-gray-800 shadow-lg">
      <h2 className="text-center text-2xl font-pixel text-purple-300 mb-6">Infernal Numerology</h2>

      <div className="mb-6 bg-black/50 p-4 rounded-lg border border-gray-800">
        <p className="text-gray-300 mb-4">
          The Devil presents you with an ancient parchment covered in Latin text. "Solve this riddle," he hisses, "and
          you shall proceed."
        </p>

        {renderLatinText()}

        <div className="mt-4 flex justify-end">
          <button onClick={toggleHint} className="text-sm text-gray-400 hover:text-gray-200 underline">
            {showHint ? "Hide Hint" : "Show Hint"}
          </button>
        </div>

        {showHint && (
          <div className="mt-2 text-gray-400 text-sm italic border-t border-gray-800 pt-2">
            <p>
              Hint: Each Latin term corresponds to a number in Christian symbolism. "Mors" (death) suggests division,
              while "crux" (cross) suggests multiplication.
            </p>
            <p className="mt-1">Click on the highlighted terms to see their numerical values.</p>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mb-4">
        <p className="text-gray-400 text-sm">
          <span className="text-yellow-300">Yellow terms</span> can be clicked for more information.
        </p>

        <button
          onClick={toggleSolution}
          className="px-4 py-2 bg-purple-900/50 hover:bg-purple-800/50 text-purple-200 rounded-md transition-colors"
        >
          {showSolution ? "Hide Solution" : "Reveal Solution"}
        </button>
      </div>

      {showSolution && renderCalculation()}

      {/* Term information modal */}
      {selectedTerm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={closeTermInfo}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-900 p-6 rounded-lg border border-gray-700 max-w-md w-full m-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-pixel text-yellow-300 mb-2">{selectedTerm.term}</h3>
            <p className="text-gray-300 mb-4">{selectedTerm.description}</p>

            {selectedTerm.value > 0 && (
              <p className="text-lg font-bold text-purple-300">Numerical value: {selectedTerm.value}</p>
            )}

            {selectedTerm.term === "mors" && (
              <p className="text-lg font-bold text-purple-300">Represents: Division (÷)</p>
            )}

            {selectedTerm.term === "radice" && (
              <p className="text-lg font-bold text-purple-300">Represents: Square Root (√)</p>
            )}

            <button
              onClick={closeTermInfo}
              className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-md w-full transition-colors"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  )
}
