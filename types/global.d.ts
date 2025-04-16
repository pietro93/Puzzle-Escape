// Type definitions for platform-specific APIs

interface Window {
  // Capacitor API for mobile
  Capacitor?: {
    getPlatform: () => string
    isNativePlatform: () => boolean
    convertFileSrc: (filePath: string) => string
    Plugins: {
      SplashScreen: {
        hide: () => Promise<void>
        show: () => Promise<void>
      }
      StatusBar: {
        setStyle: (options: { style: string }) => Promise<void>
        setBackgroundColor: (options: { color: string }) => Promise<void>
      }
      Haptics: {
        impact: (options: { style: "light" | "medium" | "heavy" }) => Promise<void>
        notification: (options: { type: "success" | "warning" | "error" }) => Promise<void>
        vibrate: (options: { duration: number }) => Promise<void>
      }
    }
  }

  // Electron API for desktop
  electronAPI?: {
    saveGame: (data: any) => Promise<{ success: boolean; error?: string }>
    loadGame: () => Promise<{ success: boolean; data?: any; error?: string }>
    platform: string
  }
}
