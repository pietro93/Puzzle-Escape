"use client"
import Image from "next/image"
import { X } from "lucide-react"

interface DevilDialogueProps {
  onClose: () => void
  currentFloor: number
}

export default function DevilDialogue({ onClose, currentFloor }: DevilDialogueProps) {
  // Get dialogue based on floor
  const getDialogue = () => {
    switch (currentFloor) {
      // Hot hells
      case -1: // Samjiva
        return "How precious, the mind's little trick of shutting off before the terror finishes its work. I forbid it here. The heart restarts the instant the brain tries to sever the connection, so a man who spent his life claiming he'd never hurt anyone gets to stay awake for every second of what he actually did."

      case -2: // Kalasutra
        return "I drew every line myself, and if that impresses you, I won't stop you. The blade follows the charcoal a hair's width at a time, slow enough to feel deliberate. He spent thirty years insisting his mistakes were accidents. Down here, nothing is."

      case -3: // Samghata
        return "That sound is two mountains finally agreeing on something, with a soul caught in the middle of the argument. She spent her life certain that words could never really wound anyone. I'm teaching her the difference between an opinion and a weight."

      case -4: // Raurava
        return "I come here to relax. Every voice in this valley insists it never wanted to be heard, which I find touching, coming from a woman who spent forty years deciding who got to speak and when. The screaming usually stops meaning anything after a while. Hers hasn't yet. I admire the stamina."

      case -5: // Maharaurava
        return "An upgrade on the last room. Molten metal, poured slow enough to enjoy properly. He spent decades lecturing his congregation about restraint, then helped himself to whatever he liked first. Poetic, that his portions were finally decided for him."

      case -6: // Tapana
        return "One stake, heel to crown, and the body finishes the job itself from the inside. Elegant, I think. He built three towers on foundations he knew wouldn't hold and called the collapse an act of god. Something is finishing what he started too."

      case -7: // Pratapana
        return "A proper reduction takes centuries. Nobody down here is counting anymore. She used to call patience a virtue, usually right before using it to outlast anyone who disagreed with her. Seems only fair she has more of it now than she knows what to do with."

      case -8: // Avici
        return "My masterpiece, and I don't say that often. Not one pause, not one second of relief, ever. He spent his whole life insisting there was no excuse for rest. I happen to agree with him completely."

      // Cold hells
      case -9: // Arbuda
        return "The first cold room, and already its newest guest is begging for the flames she was so glad to leave behind. The blisters swell like ripened fruit before the frost seals them shut. She built a career telling people pain was weakness if you let it show. Hers is on full display now, whether she likes it or not."

      case -10: // Nirarbuda
        return "When the blisters finally burst, the ice inside tears through the muscle like broken glass leaving the room. He spent his life bragging that nothing could break him. I'd say the argument is settled."

      case -11: // Atata
        return "Named for the sound the teeth make against the frost. At-at-at, over and over, which is more than she ever let anyone else get a word in edgewise while she was alive. The muscle tears, the cold seals it, then it tears again. A rhythm, if you're patient. I have nothing but time."

      case -12: // Hahava
        return "All that's left of his voice is 'ha-ha-va,' which strikes me as fitting, since he spent his life laughing at people for considerably less. The breath freezes into little shapes on the way out. I've kept a few of the prettier ones, if you'd like to see."

      case -13: // Huhuva
        return "The blue room. Blood freezes in the vein and cracks it from the inside, a sound not unlike a windowpane going. She used to pride herself on never letting anything get under her skin. Now nothing can get out."

      case -14: // Utpala
        return "Named for the color the skin turns on its way out. The eyes freeze solid in their sockets and keep working regardless. He spent a long career insisting he never saw what was happening right in front of him. I've made sure that excuse won't hold up much longer."

      case -15: // Padma
        return "The skin splits into patterns like lotus petals as it freezes, and the blood that escapes hardens into small red sculptures. She spent her career calling suffering beautiful whenever it wasn't hers. I've simply given her an exhibit of her own."

      case -16: // Pundarika
        return "The coldest of them, where even thought slows and eventually stops. What's left just sits, half aware, for longer than your calendars have numbers for. He used to say nothing ever got to him. I'd call this a fair test of that claim, and a fitting place to end the tour."

      default:
        return "This particular pit requires total darkness to do its work properly. What shape the flesh takes down there is a private matter between the architecture and whoever earned it. Everyone discovers something different about themselves in the dark. Rarely something worth knowing."
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg border-2 border-red-900 max-w-md w-full animate-fadeIn">
        {/* Header */}
        <div className="bg-red-900/50 p-3 border-b border-red-800 flex justify-between items-center">
          <h3 className="text-red-200 font-pixel">The Devil Speaks</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-16 h-16 relative pixelated-container shrink-0">
              <Image src="/images/devil.webp" alt="The Devil" width={64} height={64} className="pixelated" />
            </div>
            <div className="flex-1">
              <p className="text-gray-300 text-sm">{getDialogue()}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-900 p-3 border-t border-gray-800 flex justify-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-xs text-gray-300 font-pixel"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
