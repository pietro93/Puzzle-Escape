"use client"

import { useState, useEffect } from "react"

type Platform = "web" | "ios" | "android" | "electron"

export function usePlatform() {
  const [platform, setPlatform] = useState<Platform>("web")
  const [isNative, setIsNative] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check for Capacitor (iOS/Android)
    if (typeof window !== "undefined") {
      if (window.Capacitor) {
        const capacitorPlatform = window.Capacitor.getPlatform() as Platform
        if (capacitorPlatform === "ios" || capacitorPlatform === "android") {
          setPlatform(capacitorPlatform)
          setIsNative(true)
          setIsMobile(true)
        }
      }
      // Check for Electron
      else if (window.electronAPI) {
        setPlatform("electron")
        setIsNative(true)
        setIsDesktop(true)
      }
      // Otherwise it's web
      else {
        setPlatform("web")
        setIsNative(false)
        // Check if it's a mobile browser
        setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
        setIsDesktop(!isMobile)
      }
    }
  }, [])

  return {
    platform,
    isNative,
    isDesktop,
    isMobile,
  }
}
