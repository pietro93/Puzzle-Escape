interface CharacterImageProps {
  character: string
}

export default function CharacterImage({ character }: CharacterImageProps) {
  const getCharacterImage = () => {
    const imagePath = `/images/${character}.webp`
    console.log(`Loading character image: ${imagePath}`)
    return imagePath
  }

  return (
    <div className="w-40 h-40 relative pixelated-container">
      <div className="absolute inset-0 bg-black/30 rounded-lg z-0"></div>
      <img
        src={getCharacterImage() || "/placeholder.svg"}
        alt={`${character} character`}
        className="pixelated z-10 relative object-contain w-full h-full"
        onError={(e) => {
          console.error(`Failed to load character image: ${getCharacterImage()}`)
          ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=140&width=112"
        }}
      />
      <div className="absolute -inset-1 border-2 border-gray-800 rounded-lg z-20 pointer-events-none"></div>
      <div className="absolute -bottom-1 left-0 right-0 h-1 bg-black/50 blur-sm z-30"></div>
    </div>
  )
}
