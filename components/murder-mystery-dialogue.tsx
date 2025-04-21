"use client"

import type React from "react"
import { DialogueSystem, type DialogueOption } from "./dialogue-system"

// Define the dialogue tree for the policewoman
const policewomanDialogue: DialogueOption[] = [
  {
    id: "who-are-you",
    text: "Who are you?",
    response: "Who are YOU? Some make-believe detective?",
    followUp: [],
  },
  {
    id: "tell-about-murder",
    text: "Tell me about the murder.",
    response: "There was no murder. The victim died of natural causes. It was just an accident.",
    followUp: [
      {
        id: "what-natural-causes",
        text: "What natural causes?",
        response: "How would I know? Ask forensics. I just know there was no murder.",
        followUp: [
          {
            id: "who-found-body",
            text: "Who found the body?",
            response:
              "The rescuer found the body. The victim himself called for help but died before help could arrive.",
            followUp: [],
          },
        ],
      },
      {
        id: "was-there-no-weapon",
        text: "Was there no weapon?",
        response: "Told you, there was no murder.",
        followUp: [
          {
            id: "find-anything-crime-scene",
            text: "Did you find anything on the crime scene?",
            response:
              "Ah yes, we got lucky. He left this box of donuts untouched. Managed to rescue it before it goes to waste.",
            followUp: [
              {
                id: "eating-donuts",
                text: "You're eating donuts from the crime scene?!",
                response: "Of course. Don't tell my boss. I don't want to share.",
                followUp: [],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "who-is-victim",
    text: "Who is the victim?",
    response:
      "Some tourist who was here on vacation by himself. Short man, kinda cute. Slightly too dead for my taste, I like 'em still warm.",
    followUp: [
      {
        id: "does-he-have-name",
        text: "Does he have a name?",
        response: "I would assume so.",
        followUp: [],
      },
      {
        id: "what-else-about-victim",
        text: "What else can you tell me about the victim?",
        response: "I have got nothing to tell.",
        followUp: [],
      },
      {
        id: "how-identify-victim",
        text: "How did you identify the victim?",
        response: "Oh, that was easy. He had his passport on him.",
        followUp: [
          {
            id: "can-i-see-it",
            text: "Can I see it?",
            response: "Fine, but only if you promise to leave me alone.",
            onSelect: () => {
              // This will make the passport option appear
            },
            followUp: [
              {
                id: "check-passport",
                text: "Check victim's passport",
                response: "Here it is. Don't get your fingerprints all over it.",
                special: "passport",
                followUp: [],
              },
            ],
          },
        ],
      },
    ],
  },
]

// Define the dialogue tree for the mortician (to be implemented later)
const morticianDialogue: DialogueOption[] = []

interface MurderMysteryDialogueProps {
  character: "policewoman" | "mortician"
  onClose: () => void
}

export const MurderMysteryDialogue: React.FC<MurderMysteryDialogueProps> = ({ character, onClose }) => {
  const characterData = {
    policewoman: {
      name: "Officer Jenny",
      image: "/images/murder-mystery/policewoman.webp",
      dialogueOptions: policewomanDialogue,
    },
    mortician: {
      name: "Dr. Mortis",
      image: "/images/murder-mystery/mortician.webp",
      dialogueOptions: morticianDialogue,
    },
  }

  return <DialogueSystem character={characterData[character]} onClose={onClose} />
}
