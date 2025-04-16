"use client"

import { useCallback } from "react"
import { usePlatform } from "./use-platform"

export function useHaptics() {
  const { platform, isNative } = usePlatform()

  const vibrate = useCallback(
    (pattern: number | number[]) => {
      // Native platforms
      if (isNative && platform !== "electron") {
        if (window.Capacitor && window.Capacitor.Plugins.Haptics) {
          if (typeof pattern === "number") {
            window.Capacitor.Plugins.Haptics.vibrate({ duration: pattern })
          } else {
            // For complex patterns, just use the first value
            window.Capacitor.Plugins.Haptics.vibrate({ duration: pattern[0] })
          }
        }
      }
      // Web fallback
      else if (navigator.vibrate) {
        navigator.vibrate(pattern)
      }
    },
    [isNative, platform],
  )

  const impact = useCallback(
    (style: "light" | "medium" | "heavy" = "medium") => {
      // Native platforms
      if (isNative && platform !== "electron") {
        if (window.Capacitor && window.Capacitor.Plugins.Haptics) {
          window.Capacitor.Plugins.Haptics.impact({ style })
        }
      }
      // Web fallback
      else if (navigator.vibrate) {
        const duration = style === "light" ? 10 : style === "medium" ? 20 : 30
        navigator.vibrate(duration)
      }
    },
    [isNative, platform],
  )

  const notification = useCallback(
    (type: "success" | "warning" | "error" = "success") => {
      // Native platforms
      if (isNative && platform !== "electron") {
        if (window.Capacitor && window.Capacitor.Plugins.Haptics) {
          window.Capacitor.Plugins.Haptics.notification({ type })
        }
      }
      // Web fallback
      else if (navigator.vibrate) {
        const pattern =
          type === "success" ? [50, 50, 50] : type === "warning" ? [100, 50, 100] : [100, 50, 100, 50, 100]
        navigator.vibrate(pattern)
      }
    },
    [isNative, platform],
  )

  return {
    vibrate,
    impact,
    notification,
  }
}
