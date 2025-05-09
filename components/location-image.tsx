interface LocationImageProps {
  setting: string
  customImage?: string | null
  hintImage?: string
  level?: number
}

export default function LocationImage({ setting, customImage, hintImage, level }: LocationImageProps) {
  const getLocationImage = () => {
    // If there's a hint image specified, use that
    if (hintImage) {
      return hintImage
    }

    // If there's a custom image specified, use that
    if (customImage) {
      return customImage
    }

    // Special case for level 13 color palette
    if (setting === "mansion" && level === 13) {
      return "/images/color-palette/color_palette.webp"
    }

    // Special case for murder mystery images
    if (setting === "murder-mystery") {
      return "/images/murder-mystery/crime-scene.webp"
    }

    // Otherwise use the default image for the setting
    switch (setting) {
      case "prison":
        return "/images/prison-bg.webp"
      case "mansion":
        return "/images/mansion-bg.webp"
      case "forest":
        return "/images/forest-bg.webp"
      case "desert":
        return "/images/desert-bg.webp"
      case "hell":
        return "/images/hell-bg.webp"
      default:
        return "/images/prison-bg.webp"
    }
  }

  const imageUrl = getLocationImage()
  const isGif = imageUrl?.endsWith(".gif")

  // Special styling for the color palette image
  const isColorPalette = setting === "mansion" && level === 13

  return (
    <div className="w-40 h-40 relative pixelated-container">
      <div className="absolute inset-0 bg-black/30 rounded-lg z-0"></div>
      <div className={`relative w-full h-full flex items-center justify-center ${isColorPalette ? "p-2" : ""}`}>
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={`${setting} location`}
          className={`pixelated z-10 relative object-contain w-full h-full`}
          onError={(e) => {
            console.error("Failed to load image:", imageUrl)
            ;(e.target as HTMLImageElement).src = "/placeholder.svg"
          }}
        />
      </div>
      <div className="absolute -inset-1 border-2 border-gray-800 rounded-lg z-20 pointer-events-none"></div>
      <div className="absolute -bottom-1 left-0 right-0 h-1 bg-black/50 blur-sm z-30"></div>
    </div>
  )
}
