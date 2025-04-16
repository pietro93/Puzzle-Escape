"use client"

import { useState, useEffect } from "react"
import { usePlatform } from "./use-platform"

// Define the game save data structure
interface GameSaveData {
  level: number
  soundEnabled: boolean
  lastPlayed?: number
}

export function useStorage() {
  const { platform, isNative } = usePlatform()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setIsReady(true)
  }, [])

  const saveGame = async (data: GameSaveData): Promise<boolean> => {
    if (!isReady) return false

    try {
      // Add timestamp
      const saveData = {
        ...data,
        lastPlayed: Date.now(),
      }

      // Electron storage
      if (platform === "electron" && window.electronAPI) {
        const result = await window.electronAPI.saveGame(saveData)
        return result.success
      }
      // Web/Capacitor storage
      else {
        localStorage.setItem("riddle_escape_save", JSON.stringify(saveData))
        return true
      }
    } catch (error) {
      console.error("Failed to save game:", error)
      return false
    }
  }

  const loadGame = async (): Promise<GameSaveData | null> => {
    if (!isReady) return null

    try {
      // Electron storage
      if (platform === "electron" && window.electronAPI) {
        const result = await window.electronAPI.loadGame()
        return result.success ? result.data : null
      }
      // Web/Capacitor storage
      else {
        const savedData = localStorage.getItem("riddle_escape_save")
        return savedData ? JSON.parse(savedData) : null
      }
    } catch (error) {
      console.error("Failed to load game:", error)
      return null
    }
  }

  const clearGame = async (): Promise<boolean> => {
    if (!isReady) return false

    try {
      // Electron storage
      if (platform === "electron" && window.electronAPI) {
        const result = await window.electronAPI.saveGame({})
        return result.success
      }
      // Web/Capacitor storage
      else {
        localStorage.removeItem("riddle_escape_save")
        return true
      }
    } catch (error) {
      console.error("Failed to clear game:", error)
      return false
    }
  }

  return {
    saveGame,
    loadGame,
    clearGame,
    isReady,
  }
}
