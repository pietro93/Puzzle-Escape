import Image from "next/image"

interface LocationImageProps {
  setting: string
  customImage?: string
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

    // Otherwise use the default image for the setting
    switch (setting) {
      case "prison":
        return "/images/prison-bg.webp"
      case "mansion":
        return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mansion-Qd9jgVQwNdCF6yT2PFKtFg0KEhxQ4Q.webp" // Updated mansion interior
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
  const isGif = imageUrl.endsWith(".gif")

  return (
    <div className="w-40 h-40 relative pixelated-container">
      <div className="absolute inset-0 bg-black/30 rounded-lg z-0"></div>
      {isGif ? (
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={`${setting} location`}
          className="pixelated z-10 relative w-full h-full object-cover"
        />
      ) : (
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={`${setting} location`}
          width={160}
          height={160}
          className="pixelated z-10 relative"
        />
      )}
      <div className="absolute -inset-1 border-2 border-gray-800 rounded-lg z-20 pointer-events-none"></div>
      <div className="absolute -bottom-1 left-0 right-0 h-1 bg-black/50 blur-sm z-30"></div>
    </div>
  )
}
