"use client"
import Image from "next/image"
import { X } from "lucide-react"

interface DevilDialogueProps {
  onClose: () => void
  currentFloor: number
  level: number
  currentLocation: string
}

export default function DevilDialogue({ onClose, currentFloor, level, currentLocation }: DevilDialogueProps) {
  // Get dialogue based on floor

  // Update the devil's dialogue to include location-specific text for level 49

  // Add location-specific dialogue for level 49 (murder mystery)
  const getDialogue = () => {
    // For level 49 (murder mystery), provide location-specific dialogue
    if (level === 49) {
      switch (currentLocation) {
        case "crime scene":
          return "Look at this mess. Such beautiful chaos. The victim suffered greatly before death - just how I like it. Examine everything carefully. The killer was... creative."

        case "police station":
          return "Ah, the authorities. So earnest, so clueless. They're missing what's right in front of them. The policewoman might know more than she's letting on. Question her carefully."

        case "morgue":
          return "Death has such a pleasant aroma, doesn't it? The mortician has seen many bodies, but this one troubled even him. Ask about the unusual aspects of this killing."

        case "library":
          return "Knowledge is power, and these books contain secrets that might reveal our killer. I'm particularly fond of the botany section... plants can be so deadly in the right hands."

        default:
          return "This realm is... special. I've crafted it with particular attention to detail. The suffering here is... exquisite. I do hope you're taking notes."
      }
    }

    // For other levels, use the existing dialogue
    switch (currentFloor) {
      // Hot hells
      case -1: // Samjiva
        return "Ah, Samjiva - the Hell of Reviving. I find this one particularly amusing. These souls die over and over, only to be revived for more torment. Quite the endless cycle, wouldn't you say? The look on their faces when they realize they'll never truly die... priceless."

      case -2: // Kalasutra
        return "Kalasutra - the Hell of Black Threads. I designed this one myself. The precision of those blades following the black lines... it's like watching artists at work. Some souls have been dismembered millions of times. They never get used to it."

      case -3: // Samghata
        return "Samghata - the Crushing Hell. Listen closely... can you hear that? The sound of mountains smashing together, with souls caught between them. The crunch of bones is quite musical after a few millennia of listening."

      case -4: // Raurava
        return "Raurava - the Hell of Screaming. I come here when I need to relax. The cacophony of wails has a certain... harmony to it. Some souls have been screaming for so long they've forgotten why they're screaming at all."

      case -5: // Maharaurava
        return "Maharaurava - the Hell of Great Screaming. An upgrade from Raurava, if you will. The molten metal adds a certain... sizzle to the experience. I find it pairs well with the screams. Like wine and cheese."

      case -6: // Tapana
        return "Tapana - the Heating Hell. Those stakes are quite the innovation. They enter through the feet and exit through the crown of the head. The souls cook from the inside out. Efficient, don't you think?"

      case -7: // Pratapana
        return "Pratapana - the Great Heating Hell. Those cauldrons are the size of mountains. Some souls have been boiling in there since before your civilization began. The bubbling sound is rather soothing."

      case -8: // Avici
        return "Avici - the Hell Without Interruption. My masterpiece. No respite, not even for a moment. Souls burn in isolation, forever. Some say it's cruel, but I prefer to think of it as... thorough."

      // Cold hells
      case -9: // Arbuda
        return "Arbuda - the Hell of Blisters. The first of the cold hells. Those blisters grow to the size of melons before they freeze solid. The souls here long for the fires of the hot hells. Ironic, isn't it?"

      case -10: // Nirarbuda
        return "Nirarbuda - the Hell of Burst Blisters. When those frozen blisters burst, the ice crystals tear through flesh like glass. Some souls have been here so long they're more ice than flesh now."

      case -11: // Atata
        return "Atata - named for the sound of chattering teeth. Listen... 'at-at-at'... that's all they can say now. Their muscles tear from the violent shivering, only to freeze and tear again. Quite the rhythm."

      case -12: // Hahava
        return "Hahava - where souls can only cry 'ha-ha-va' as they freeze. Their breath crystallizes in the air, creating beautiful patterns before it falls and shatters. I find it rather artistic."

      case -13: // Huhuva
        return "Huhuva - the blue hell. Their blood freezes in their veins, you know. The sound it makes as it cracks the vessels... like breaking thin glass. Quite delicate, really."

      case -14: // Utpala
        return "Utpala - the Blue Lotus Hell. Named for the color the flesh turns. Blue like the deepest ice. Their eyeballs freeze solid in their sockets. They can still see, of course. I made sure of that."

      case -15: // Padma
        return "Padma - the Lotus Hell. Their skin cracks in patterns like lotus flowers. Some find beauty in suffering, don't you think? The blood freezes as it seeps out, creating crimson ice sculptures."

      case -16: // Pundarika
        return "Pundarika - the Great Lotus Hell. The coldest of all. Even thought itself begins to freeze here. Souls exist in a state of semi-conscious agony for eons. A fitting end to our little tour, wouldn't you say?"

      default:
        return "This realm is... special. I've crafted it with particular attention to detail. The suffering here is... exquisite. I do hope you're taking notes."
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
