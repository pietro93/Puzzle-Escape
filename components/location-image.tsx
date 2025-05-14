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
      console.log(`Using hint image: ${hintImage}`)
      return hintImage
    }

    // If there's a custom image specified, use that
    if (customImage) {
      console.log(`Using custom image: ${customImage}`)
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

    // Special case for level 43 Latin math puzzle
    if (level === 43) {
      return "/images/latinmathpuzzle.webp"
    }

    // Otherwise use the default image for the setting
    const defaultImage = `/images/${setting}-bg.webp`
    console.log(`Using default location image: ${defaultImage}`)
    return defaultImage
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
            console.error(`Failed to load location image: ${imageUrl}`)
            ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=140&width=112"
          }}
        />
      </div>
      <div className="absolute -inset-1 border-2 border-gray-800 rounded-lg z-20 pointer-events-none"></div>
      <div className="absolute -bottom-1 left-0 right-0 h-1 bg-black/50 blur-sm z-30"></div>
    </div>
  )
}
