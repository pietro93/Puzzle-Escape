"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Head from "next/head"

// Damned soul screams
const SCREAMS = [
  '<span style="color: red;">Satan</span> <span style="color: white;">mors</span> <span style="color: red;">Apostoli</span> <span style="color: white;">crux</span> <span style="color: red;">Cerberus</span><span style="color: white;">,</span>',
  '<span style="color: white;">mors</span> <span style="color: red;">Sanctissima</span> <span style="color: red;">Trinitas</span> <span style="color: white;">crux</span> <span style="color: red;">Sacramenta</span><span style="color: white;">,</span>',
  '<span style="color: white;">mors</span> <span style="color: red;">Porta</span> <span style="color: red;">Caeli</span> <span style="color: white;">crux</span> <span style="color: red;">Archangeli</span><span style="color: white;">,</span>',
  '<span style="color: white;">nascita</span> <span style="color: red;">Evangelistae</span><span style="color: white;">;</span>',
  '<span style="color: white;">radice</span><span style="color: white;">.</span>'
]

export default function DamnedSoulsPuzzle() {
  const [selectedChest, setSelectedChest] = useState<number | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const handleChestSelect = (chestIndex: number) => {
    if (selectedChest === chestIndex) {
      // Toggle open/close
      setIsOpen(!isOpen)
    } else {
      // Select new chest (closed)
      setSelectedChest(chestIndex)
      setIsOpen(false)
    }
  }

  return (
    <>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=UnifrakturCook:wght@700&display=swap" rel="stylesheet" />
      </Head>
      <div className="flex flex-col items-center justify-center w-full h-full p-4 bg-black">
      {/* Selected chest display */}
      <div className="min-h-96 flex items-center justify-center">
        <AnimatePresence>
          {selectedChest !== null && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="mb-4 relative cursor-pointer flex flex-col items-center"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 text-center"
              >
                <p
                  className="text-2xl md:text-3xl"
                  style={{
                    fontFamily: "'UnifrakturCook', 'Blackletter', 'Gothic', serif",
                    color: 'white'
                  }}
                  dangerouslySetInnerHTML={{
                    __html: SCREAMS[selectedChest]
                  }}
                />
              </motion.div>
            )}
            <img
              src={`/images/chest-${selectedChest + 1}-${isOpen ? 'open' : 'closed'}.webp`}
              alt={`Chest ${selectedChest + 1}`}
              className="w-64 md:w-80 h-auto"
            />
          </motion.div>
        )}
        </AnimatePresence>
      </div>

      {/* Bottom row of closed chests */}
      <div className="flex flex-wrap gap-2 mt-8 justify-center">
        {[0, 1, 2, 3, 4].map((chestIndex) => (
          <motion.div
            key={chestIndex}
            className={`w-16 h-16 cursor-pointer transition-all duration-200 overflow-hidden ${
              selectedChest === chestIndex ? 'ring-2 ring-red-500 scale-110' : 'hover:scale-105'
            }`}
            onClick={() => handleChestSelect(chestIndex)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              backgroundImage: `url("/images/chest-${chestIndex + 1}-closed.webp")`,
              backgroundPosition: `-${248 * (64 / 920)}px -40px`,
              backgroundSize: `${1500 * (64 / 920)}px auto`,
              backgroundRepeat: 'no-repeat',
            }}
          />
        ))}
      </div>
    </div>
    </>
  )
}
