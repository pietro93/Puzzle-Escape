"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface ColorPalettePuzzleProps {
  onSolve: () => void
}

export default function ColorPalettePuzzle({ onSolve }: ColorPalettePuzzleProps) {
  const [green, setGreen] = useState("")
  const [blue, setBlue] = useState("")
  const [yellow, setYellow] = useState("")
  const [pink, setPink] = useState("")
  const [isGreenCorrect, setIsGreenCorrect] = useState(false)
  const [isBlueCorrect, setIsBlueCorrect] = useState(false)
  const [isYellowCorrect, setIsYellowCorrect] = useState(false)
  const [isPinkCorrect, setIsPinkCorrect] = useState(false)

  const correctGreen = -20.6872
  const correctBlue = -20
  const correctYellow = -0.6872
  const correctPink = 117.1857

  useEffect(() => {
    setIsGreenCorrect(false)
    setIsBlueCorrect(false)
    setIsYellowCorrect(false)
    setIsPinkCorrect(false)
  }, [green, blue, yellow, pink])

  const checkGreen = () => {
    setIsGreenCorrect(Math.abs(correctGreen - Number(green)) < 0.001)
  }

  const checkBlue = () => {
    setIsBlueCorrect(Math.abs(correctBlue - Number(blue)) < 0.001)
  }

  const checkYellow = () => {
    setIsYellowCorrect(Math.abs(correctYellow - Number(yellow)) < 0.001)
  }

  const checkPink = () => {
    setIsPinkCorrect(Math.abs(correctPink - Number(pink)) < 0.001)
  }

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">Vert (Green):</label>
          <div className="flex items-center">
            <Image
              src="/public/images/color-palette/paint-green.webp"
              alt="Green Paint"
              width={40}
              height={40}
              className="mr-2"
            />
            <input
              type="number"
              value={green}
              onChange={(e) => setGreen(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-gray-900 text-white ${isGreenCorrect ? "text-green-500" : ""}`}
            />
            <button onClick={checkGreen} className="ml-2 px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-gray-300">
              Check
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Rose (Pink):</label>
          <div className="flex items-center">
            <Image
              src="/public/images/color-palette/paint-pink.webp"
              alt="Pink Paint"
              width={40}
              height={40}
              className="mr-2"
            />
            <input
              type="number"
              value={pink}
              onChange={(e) => setPink(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-gray-900 text-white ${isPinkCorrect ? "text-green-500" : ""}`}
            />
            <button onClick={checkPink} className="ml-2 px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-gray-300">
              Check
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Bleu (Blue):</label>
          <div className="flex items-center">
            <Image
              src="/public/images/color-palette/paint-blue.webp"
              alt="Blue Paint"
              width={40}
              height={40}
              className="mr-2"
            />
            <input
              type="number"
              value={blue}
              onChange={(e) => setBlue(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-gray-900 text-white ${isBlueCorrect ? "text-green-500" : ""}`}
            />
            <button onClick={checkBlue} className="ml-2 px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-gray-300">
              Check
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Jaune (Yellow):</label>
          <div className="flex items-center">
            <Image
              src="/public/images/color-palette/paint-yellow.webp"
              alt="Yellow Paint"
              width={40}
              height={40}
              className="mr-2"
            />
            <input
              type="number"
              value={yellow}
              onChange={(e) => setYellow(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-gray-900 text-white ${isYellowCorrect ? "text-green-500" : ""}`}
            />
            <button
              onClick={checkYellow}
              className="ml-2 px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-gray-300"
            >
              Check
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
