"use client"

import { useState } from "react"
import { Heart, Coins, Share2, Trophy } from "lucide-react"

interface StatusBarProps {
  level: number
  lives: number
  coins: number
  setting: string
}

export default function StatusBar({ level, lives, coins, setting }: StatusBarProps) {
  const [showShareMenu, setShowShareMenu] = useState(false)

  // Calculate progress percentage based on level
  const getProgress = () => {
    const chapter = Math.ceil(level / 10)
    const levelInChapter = level % 10 === 0 ? 10 : level % 10
    return (levelInChapter / 10) * 100
  }

  const getChapterName = () => {
    switch (setting) {
      case "prison":
        return "Prison"
      case "mansion":
        return "Mansion"
      case "forest":
        return "Forest"
      case "desert":
        return "Desert"
      case "hell":
        return "Underworld"
      default:
        return "Chapter"
    }
  }

  const handleShare = () => {
    setShowShareMenu(!showShareMenu)
  }

  const shareToSocial = (platform: string) => {
    const text = `I've reached level ${level} in Riddle Escape! Can you solve the puzzles and escape?`
    const url = window.location.href

    let shareUrl = ""

    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
        break
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`
        break
      case "copy":
        navigator.clipboard.writeText(`${text} ${url}`)
        alert("Link copied to clipboard!")
        setShowShareMenu(false)
        return
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank")
      setShowShareMenu(false)
    }
  }

  return (
    <div className="w-full bg-gray-900/90 border-b border-gray-800 px-3 py-2 sticky top-0 z-50 backdrop-blur-sm shadow-lg">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <div className="flex items-center">
            {[...Array(3)].map((_, i) => (
              <Heart
                key={i}
                className={`w-5 h-5 transition-all duration-300 ${
                  i < lives ? "text-red-500 fill-red-500 animate-pulse" : "text-gray-700"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="text-xs text-yellow-400 font-pixel flex items-center gap-1">
            <Trophy className="w-3 h-3" /> {getChapterName()} {Math.ceil(level / 10)}
          </div>
          <div className="w-24 h-1.5 bg-gray-800 rounded-full mt-1 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${getProgress()}%` }}
            ></div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-yellow-900/30 px-2 py-1 rounded-full border border-yellow-800/50">
            <Coins className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 font-pixel text-sm">{coins}</span>
          </div>

          <div className="relative">
            <button
              onClick={handleShare}
              className="flex items-center justify-center w-7 h-7 rounded-full bg-purple-900/50 border border-purple-800 hover:bg-purple-800/50 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-purple-300" />
            </button>

            {showShareMenu && (
              <div className="absolute right-0 top-full mt-1 bg-gray-900 border border-gray-800 rounded-md shadow-lg p-2 w-32 z-50 animate-fadeIn">
                <button
                  onClick={() => shareToSocial("twitter")}
                  className="w-full text-left px-2 py-1 text-xs hover:bg-gray-800 rounded flex items-center gap-2 transition-colors"
                >
                  <span className="text-blue-400">𝕏</span> Twitter
                </button>
                <button
                  onClick={() => shareToSocial("facebook")}
                  className="w-full text-left px-2 py-1 text-xs hover:bg-gray-800 rounded flex items-center gap-2 transition-colors"
                >
                  <span className="text-blue-600">f</span> Facebook
                </button>
                <button
                  onClick={() => shareToSocial("copy")}
                  className="w-full text-left px-2 py-1 text-xs hover:bg-gray-800 rounded flex items-center gap-2 transition-colors"
                >
                  <span>📋</span> Copy Link
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
