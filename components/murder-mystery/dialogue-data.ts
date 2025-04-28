import type { DialogueOption } from "./types"

// Policewoman dialogue tree
export const policewomanDialogue: DialogueOption[] = [
  {
    id: "initial-greeting",
    text: "Start",
    response: "Hey you! This is a restricted area. What are you doing here?",
    followUp: [
      {
        id: "who-are-you",
        text: "Who are you?",
        response: "Who am I? Who are YOU? Some make-believe detective?",
        followUp: [
          {
            id: "devil-sent-me",
            text: "The Devil sent me here.",
            response:
              "Oh, did he now? Well, tell him I said 'hi'. And that he still owes me five bucks from that poker game last Tuesday.",
            followUp: [],
          },
        ],
      },
      {
        id: "tell-about-murder",
        text: "Tell me about the murder.",
        response:
          "Murder? What murder? There was no murder. The victim died of natural causes. Just an accident, really. Happens all the time, ya know?",
        followUp: [
          {
            id: "what-natural-causes",
            text: "What natural causes?",
            response:
              "How would I know? Ask forensics. I just know there was no murder. And I'm not supposed to talk about it, so shhh!",
            followUp: [],
          },
          {
            id: "was-there-no-weapon",
            text: "Was there no weapon?",
            response: "Told you, there was no murder. Are you even listening? Maybe you need a hearing aid, gramps.",
            followUp: [],
          },
          {
            id: "crime-scene-items",
            text: "Did you find anything on the crime scene?",
            response:
              "Ah yes, we got lucky. He left this box of donuts untouched. Managed to rescue it before it goes to waste",
            followUp: [
              {
                id: "eating-donuts",
                text: "You're eating donuts from the crime scene?!",
                response:
                  "Of course. Don't tell my boss. I don't want to share. Besides, they're evidence... of deliciousness!",
                followUp: [],
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
            id: "victim-name",
            text: "Does he have a name?",
            response: "I would assume so. I didn't bother to ask him, though.",
            followUp: [],
          },
          {
            id: "more-about-victim",
            text: "What else can you tell me about the victim?",
            response: "I have got nothing to tell. I'm not his biographer, you know.",
            followUp: [],
          },
          {
            id: "how-identify-victim",
            text: "How did you identify the victim?",
            response: "Oh, that was easy. He had his ID on him. Lucky for us, or we'd be calling John Doe.",
            followUp: [
              {
                id: "can-see-passport",
                text: "Can I see it?",
                response: "Fine, but only if you promise to leave me alone. I'm on my break, you know.",
                followUp: [],
                specialAction: () => {}, // This will be handled in the component
              },
            ],
          },
        ],
      },
      {
        id: "were-there-any-witnesses",
        text: "Were there any witnesses?",
        response: "Nope. Rescue team arrived on site and found the body.",
        followUp: [
          {
            id: "who-called-rescue",
            text: "Who called the rescue team?",
            response:
              "Well, the victim himself. He called an ambulance but died before they arrived on site. Talk about bad luck, eh?",
            followUp: [],
          },
          {
            id: "victim-alive",
            text: "Wait, so the victim was alive?",
            response:
              "D'huh. I told you there was no murder. I think he just felt ill and died. Totally natural. Happens all the time, ya know?",
            followUp: [],
          },
        ],
      },
      {
        id: "police-report",
        text: "Is there a police report?",
        response: "Yeah, I wrote it up. Not much to say though. Open and shut case of natural causes. Yawn.",
        followUp: [
          {
            id: "can-see-report",
            text: "Can I see the report?",
            response: "Sure, knock yourself out. It's about as thrilling as watching paint dry.",
            followUp: [],
            specialAction: () => {}, // This will be handled in the component
          },
        ],
      },
      {
        id: "can-see-report-again",
        text: "Can I see that police report again?",
        response: "Here you go, but don't say I didn't warn you. It's about as thrilling as watching paint dry.",
        followUp: [],
        specialAction: () => {}, // This will be handled in the component
      },
      {
        id: "can-see-passport-again",
        text: "Can I see that ID again?",
        response: "Here you go, but don't say I didn't warn you. It's not like it's gonna change anything.",
        followUp: [],
        specialAction: () => {}, // This will be handled in the component
      },
    ],
  },
]

// Mortician dialogue tree
export const morticianDialogue: DialogueOption[] = [
  // Mortician dialogue content...
]

// Librarian dialogue tree
export const librarianDialogue: DialogueOption[] = [
  // Librarian dialogue content...
]
