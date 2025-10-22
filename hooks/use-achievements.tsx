"use client"

import { useCallback } from "react"
import { usePlatform } from "./use-platform"

// Define achievement IDs
export const ACHIEVEMENTS = {
  ESCAPE_PRISON: "achievement_escape_prison",
  ESCAPE_MANSION: "achievement_escape_mansion",
  ESCAPE_FOREST: "achievement_escape_forest",
  ESCAPE_DESERT: "achievement_escape_desert",
  COMPLETE_GAME: "achievement_complete_game",
  PERFECT_SOLVER: "achievement_perfect_solver",
  SPEED_RUNNER: "achievement_speed_runner",
}

export function useAchievements() {
  const { platform } = usePlatform()

  const unlockAchievement = useCallback(
    (achievementId: string) => {
      // Steam platform
      if (platform === "electron") {
        try {
          // This would use the actual Steam API in a real implementation
          if (window.steamworks) {
            window.steamworks.achievements.activate(achievementId)
          }
        } catch (error) {
          console.error("Failed to unlock Steam achievement:", error)
        }
      }

      // For mobile platforms, you would integrate with Google Play Games or Game Center
      // This is just a placeholder for demonstration
      console.log(`Achievement unlocked: ${achievementId}`)

      // Store locally that this achievement has been unlocked
      try {
        const achievements = JSON.parse(localStorage.getItem("riddle_escape_achievements") || "{}")
        achievements[achievementId] = true
        localStorage.setItem("riddle_escape_achievements", JSON.stringify(achievements))
      } catch (error) {
        console.error("Failed to store achievement locally:", error)
      }
    },
    [platform],
  )

  const getAchievements = useCallback(() => {
    try {
      const achievements = JSON.parse(localStorage.getItem("riddle_escape_achievements") || "{}")
      return achievements
    } catch (error) {
      console.error("Failed to get achievements:", error)
      return {}
    }
  }, [])

  return {
    unlockAchievement,
    getAchievements,
    ACHIEVEMENTS,
  }
}
