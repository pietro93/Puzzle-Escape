import type { CapacitorConfig } from "@capacitor/cli"

const config: CapacitorConfig = {
  appId: "com.yourdomain.riddleescape",
  appName: "Riddle Escape",
  webDir: "out",
  server: {
    androidScheme: "https",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#121212",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    CapacitorHaptics: {
      enabled: true,
    },
    CapacitorStatusBar: {
      style: "dark",
      backgroundColor: "#121212",
    },
  },
}

export default config
