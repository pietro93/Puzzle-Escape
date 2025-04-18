"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface ColorPalettePuzzleProps {
  onSolve: () => void
}

export default function ColorPalettePuzzle({ onSolve }: ColorPalettePuzzleProps) {
  const [blanc, setBlanc] = useState(0.1857)
  const [noir, setNoir] = useState(-0.1857)
  const [bleuClair, setBleuClair] = useState(-19.8143)
  const [orange, setOrange] = useState(116.3128)
  const [rouge, setRouge] = useState(117.0)
  const [gris, setGris] = useState(0)
  const [vert, setVert] = useState("")
  const [bleu, setBleu] = useState("")
  const [jaune, setJaune] = useState("")
  const [rose, setRose] = useState("")

  const [isVertCorrect, setIsVertCorrect] = useState(false)
  const [isBleuCorrect, setIsBleuCorrect] = useState(false)
  const [isJauneCorrect, setIsJauneCorrect] = useState(false)
  const [isRoseCorrect, setIsRoseCorrect] = useState(false)

  const correctVert = -20.6872
  const correctBleu = -20
  const correctJaune = -0.6872
  const correctRose = 117.1857

  useEffect(() => {
    setIsVertCorrect(false)
    setIsBleuCorrect(false)
    setIsJauneCorrect(false)
    setIsRoseCorrect(false)
  }, [vert, bleu, jaune, rose])

  const checkVert = () => {
    setIsVertCorrect(Math.abs(correctVert - Number(vert)) < 0.001)
  }

  const checkBleu = () => {
    setIsBleuCorrect(Math.abs(correctBleu - Number(bleu)) < 0.001)
  }

  const checkJaune = () => {
    setIsJauneCorrect(Math.abs(correctJaune - Number(jaune)) < 0.001)
  }

  const checkRose = () => {
    setIsRoseCorrect(Math.abs(correctRose - Number(rose)) < 0.001)
  }

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">Blanc:</label>
          <div className="flex items-center">
            <Image
              src="/images/paint-colors/paint-white.webp"
              alt="White Paint"
              width={40}
              height={40}
              className="mr-2"
            />
            <input
              type="number"
              value={blanc}
              readOnly
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-gray-900 text-white"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Noir:</label>
          <div className="flex items-center">
            <Image
              src="/images/paint-colors/paint-black.webp"
              alt="Black Paint"
              width={40}
              height={40}
              className="mr-2"
            />
            <input
              type="number"
              value={noir}
              readOnly
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-gray-900 text-white"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Bleu clair:</label>
          <div className="flex items-center">
            <Image
              src="/images/paint-colors/paint-light-blue.webp"
              alt="Light Blue Paint"
              width={40}
              height={40}
              className="mr-2"
            />
            <input
              type="number"
              value={bleuClair}
              readOnly
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-gray-900 text-white"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Orange:</label>
          <div className="flex items-center">
            <Image
              src="/images/paint-colors/paint-orange.webp"
              alt="Orange Paint"
              width={40}
              height={40}
              className="mr-2"
            />
            <input
              type="number"
              value={orange}
              readOnly
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-gray-900 text-white"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Rouge:</label>
          <div className="flex items-center">
            <Image src="/images/paint-colors/paint-red.webp" alt="Red Paint" width={40} height={40} className="mr-2" />
            <input
              type="number"
              value={rouge}
              readOnly
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-gray-900 text-white"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Gris:</label>
          <div className="flex items-center">
            <Image
              src="/images/paint-colors/paint-grey.webp"
              alt="Grey Paint"
              width={40}
              height={40}
              className="mr-2"
            />
            <input
              type="number"
              value={gris}
              readOnly
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-gray-900 text-white"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Vert:</label>
          <div className="flex items-center">
            <Image
              src="/images/paint-colors/paint-green.webp"
              alt="Green Paint"
              width={40}
              height={40}
              className="mr-2"
            />
            <input
              type="number"
              value={vert}
              onChange={(e) => setVert(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-gray-900 text-white ${isVertCorrect ? "text-green-500" : ""}`}
            />
            <button onClick={checkVert} className="ml-2 px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-gray-300">
              Check
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Bleu:</label>
          <div className="flex items-center">
            <Image
              src="/images/paint-colors/paint-blue.webp"
              alt="Blue Paint"
              width={40}
              height={40}
              className="mr-2"
            />
            <input
              type="number"
              value={bleu}
              onChange={(e) => setBleu(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-gray-900 text-white ${isBleuCorrect ? "text-green-500" : ""}`}
            />
            <button onClick={checkBleu} className="ml-2 px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-gray-300">
              Check
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Jaune:</label>
          <div className="flex items-center">
            <Image
              src="/images/paint-colors/paint-yellow.webp"
              alt="Yellow Paint"
              width={40}
              height={40}
              className="mr-2"
            />
            <input
              type="number"
              value={jaune}
              onChange={(e) => setJaune(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-gray-900 text-white ${isJauneCorrect ? "text-green-500" : ""}`}
            />
            <button onClick={checkJaune} className="ml-2 px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-gray-300">
              Check
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Rose:</label>
          <div className="flex items-center">
            <Image
              src="/images/paint-colors/paint-pink.webp"
              alt="Pink Paint"
              width={40}
              height={40}
              className="mr-2"
            />
            <input
              type="number"
              value={rose}
              onChange={(e) => setRose(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-gray-900 text-white ${isRoseCorrect ? "text-green-500" : ""}`}
            />
            <button onClick={checkRose} className="ml-2 px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-gray-300">
              Check
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
