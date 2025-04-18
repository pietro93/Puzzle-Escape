"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface ColorPalettePuzzleProps {
  onSolve: () => void
}

export default function ColorPalettePuzzle({ onSolve }: ColorPalettePuzzleProps) {
  const [white, setWhite] = useState("")
  const [black, setBlack] = useState("")
  const [lightBlue, setLightBlue] = useState("")
  const [orange, setOrange] = useState("")
  const [red, setRed] = useState("")
  const [grey, setGrey] = useState("")
  const [green, setGreen] = useState("")
  const [blue, setBlue] = useState("")
  const [yellow, setYellow] = useState("")
  const [pink, setPink] = useState("")

  const [isWhiteCorrect, setIsWhiteCorrect] = useState(false)
  const [isBlackCorrect, setIsBlackCorrect] = useState(false)
  const [isLightBlueCorrect, setIsLightBlueCorrect] = useState(false)
  const [isOrangeCorrect, setIsOrangeCorrect] = useState(false)
  const [isRedCorrect, setIsRedCorrect] = useState(false)
  const [isGreyCorrect, setIsGreyCorrect] = useState(false)
  const [isGreenCorrect, setIsGreenCorrect] = useState(false)
  const [isBlueCorrect, setIsBlueCorrect] = useState(false)
  const [isYellowCorrect, setIsYellowCorrect] = useState(false)
  const [isPinkCorrect, setIsPinkCorrect] = useState(false)

  const correctWhite = 0.1857
  const correctBlack = -0.1857
  const correctLightBlue = -19.8143
  const correctOrange = 116.3128
  const correctRed = 117.0
  const correctGrey = 0
  const correctGreen = -20.6872
  const correctBlue = -20
  const correctYellow = -0.6872
  const correctPink = 117.1857

  useEffect(() => {
    setIsWhiteCorrect(false)
    setIsBlackCorrect(false)
    setIsLightBlueCorrect(false)
    setIsOrangeCorrect(false)
    setIsRedCorrect(false)
    setIsGreyCorrect(false)
    setIsGreenCorrect(false)
    setIsBlueCorrect(false)
    setIsYellowCorrect(false)
    setIsPinkCorrect(false)
  }, [white, black, lightBlue, orange, red, grey, green, blue, yellow, pink])

  const checkWhite = () => {
    setIsWhiteCorrect(Math.abs(correctWhite - Number(white)) < 0.001)
  }

  const checkBlack = () => {
    setIsBlackCorrect(Math.abs(correctBlack - Number(black)) < 0.001)
  }

  const checkLightBlue = () => {
    setIsLightBlueCorrect(Math.abs(correctLightBlue - Number(lightBlue)) < 0.001)
  }

  const checkOrange = () => {
    setIsOrangeCorrect(Math.abs(correctOrange - Number(orange)) < 0.001)
  }

  const checkRed = () => {
    setIsRedCorrect(Math.abs(correctRed - Number(red)) < 0.001)
  }

  const checkGrey = () => {
    setIsGreyCorrect(Math.abs(correctGrey - Number(grey)) < 0.001)
  }

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
          <label className="block text-sm font-medium text-gray-300">Blanc (White):</label>
          <div className="flex items-center">
            <Image
              src="/public/images/color-palette/paint-white.webp"
              alt="White Paint"
              width={40}
              height={40}
              className="mr-2"
            />
            <input
              type="number"
              value={white}
              onChange={(e) => setWhite(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-gray-900 text-white ${isWhiteCorrect ? "text-green-500" : ""}`}
            />
            <button onClick={checkWhite} className="ml-2 px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-gray-300">
              Check
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Noir (Black):</label>
          <div className="flex items-center">
            <Image
              src="/public/images/color-palette/paint-black.webp"
              alt="Black Paint"
              width={40}
              height={40}
              className="mr-2"
            />
            <input
              type="number"
              value={black}
              onChange={(e) => setBlack(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-gray-900 text-white ${isBlackCorrect ? "text-green-500" : ""}`}
            />
            <button onClick={checkBlack} className="ml-2 px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-gray-300">
              Check
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Bleu clair (Light Blue):</label>
          <div className="flex items-center">
            <Image
              src="/public/images/color-palette/paint-lightblue.webp"
              alt="Light Blue Paint"
              width={40}
              height={40}
              className="mr-2"
            />
            <input
              type="number"
              value={lightBlue}
              onChange={(e) => setLightBlue(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-gray-900 text-white ${isLightBlueCorrect ? "text-green-500" : ""}`}
            />
            <button
              onClick={checkLightBlue}
              className="ml-2 px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-gray-300"
            >
              Check
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Orange:</label>
          <div className="flex items-center">
            <Image
              src="/public/images/color-palette/paint-orange.webp"
              alt="Orange Paint"
              width={40}
              height={40}
              className="mr-2"
            />
            <input
              type="number"
              value={orange}
              onChange={(e) => setOrange(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-gray-900 text-white ${isOrangeCorrect ? "text-green-500" : ""}`}
            />
            <button
              onClick={checkOrange}
              className="ml-2 px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-gray-300"
            >
              Check
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Rouge (Red):</label>
          <div className="flex items-center">
            <Image
              src="/public/images/color-palette/paint-red.webp"
              alt="Red Paint"
              width={40}
              height={40}
              className="mr-2"
            />
            <input
              type="number"
              value={red}
              onChange={(e) => setRed(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-gray-900 text-white ${isRedCorrect ? "text-green-500" : ""}`}
            />
            <button onClick={checkRed} className="ml-2 px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-gray-300">
              Check
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Gris (Grey):</label>
          <div className="flex items-center">
            <Image
              src="/public/images/color-palette/paint-grey.webp"
              alt="Grey Paint"
              width={40}
              height={40}
              className="mr-2"
            />
            <input
              type="number"
              value={grey}
              onChange={(e) => setGrey(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-gray-900 text-white ${isGreyCorrect ? "text-green-500" : ""}`}
            />
            <button onClick={checkGrey} className="ml-2 px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-gray-300">
              Check
            </button>
          </div>
        </div>
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
      </div>
    </div>
  )
}
