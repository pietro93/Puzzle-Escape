import type { DialogueOption } from "./types"

// Update the policewoman dialogue tree to fix conditional logic issues

// Police Woman dialogue tree
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
        id: "police-report",
        text: "Is there a police report?",
        response: "Yeah, I wrote it up. Not much to say though. Open and shut case of natural causes. Yawn.",
        condition: "exhausted-murder-questions",
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
        id: "were-there-any-witnesses",
        text: "Were there any witnesses?",
        response: "Nope. Rescue team arrived on site and found the body.",
        condition: "asked-about-murder",
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
        id: "can-see-report-again",
        text: "Can I see that police report again?",
        response: "Here you go, but don't say I didn't warn you. It's about as thrilling as watching paint dry.",
        condition: "seen-police-report",
        followUp: [],
        specialAction: () => {}, // This will be handled in the component
      },
      {
        id: "can-see-passport-again",
        text: "Can I see that ID again?",
        response: "Here you go, but don't say I didn't warn you. It's not like it's gonna change anything.",
        condition: "seen-passport",
        followUp: [],
        specialAction: () => {}, // This will be handled in the component
      },
    ],
  },
]

// Mortician dialogue tree
export const morticianDialogue: DialogueOption[] = [
  {
    id: "initial-greeting",
    text: "Start",
    response: "Hmm? A visitor? How... unusual. What do you want?",
    followUp: [
      {
        id: "who-are-you",
        text: "Who are you?",
        response: "Name's Psychopompus. Psycho for short.",
        followUp: [
          {
            id: "hello-psycho",
            text: "Huh... hello, Psycho.",
            response: "...",
            followUp: [],
          },
        ],
      },
      {
        id: "tell-about-body",
        text: "What can you tell me about the body that was found by the lake?",
        response: "It's dead. Obviously.",
        followUp: [
          {
            id: "cause-of-death",
            text: "What was the cause of death?",
            response: "Anemia.",
            followUp: [
              {
                id: "anemia-question",
                text: "Anemia?",
                response: "Low blood levels. Caused organ failure. A rather... pale affair.",
                followUp: [],
              },
              {
                id: "natural-question",
                text: "Was it natural?",
                response: "As natural as having almost no blood gets. A slow fade, like a dying ember.",
                followUp: [
                  {
                    id: "what-no-blood",
                    text: "What do you mean almost no blood?",
                    response: "The body was almost completely void of blood when it was found.",
                    followUp: [],
                  },
                  {
                    id: "murder-question",
                    text: "Are you sure this wasn't murder?",
                    response: "Oh, I guess it could be. Not my concern.",
                    followUp: [],
                  },
                ],
              },
            ],
          },
          {
            id: "can-see-body-initial",
            text: "Can I see the victim's body?",
            response: "No.",
            condition: "body-not-accessible",
            followUp: [],
          },
        ],
      },
      {
        id: "be-your-friend",
        text: "I'll be your friend!",
        response: "Hell no. Please leave me alone. I prefer my relationships... one-sided.",
        condition: "asked-about-friends",
        followUp: [
          {
            id: "hobbies",
            text: "Do you have any hobbies?",
            response: "Fondling dead people. Arranging them in pleasing poses. You know, the usual.",
            specialAction: () => {}, // This will be handled in the component
            followUp: [],
          },
          {
            id: "puzzle-games",
            text: "Do you like puzzle games?",
            response: "What am I, some kind of loser? I have a life, you know.",
            specialAction: () => {}, // This will be handled in the component
            followUp: [],
          },
        ],
      },
      {
        id: "unconditional-friendship",
        text: "I am not leaving until you accept my unconditional love and friendship.",
        response: "Enough of this nonsense! I'll let you check the body, just leave me the HELL alone.",
        condition: "asked-both-hobby-questions",
        specialAction: () => {}, // This will be handled in the component
        followUp: [],
      },
      {
        id: "like-job",
        text: "Do you like your job?",
        response: "I enjoy the company. They're not demanding conversationalists.",
        condition: "body-not-accessible",
        followUp: [
          {
            id: "alone-with-corpses",
            text: "Aren't you alone with corpses all the time?",
            response: "As I said. I enjoy the company. They don't complain.",
            followUp: [
              {
                id: "any-friends",
                text: "Don't you have any friends?",
                response: "In this line of work, the living are more trouble than they're worth.",
                specialAction: () => {}, // This will be handled in the component
                followUp: [],
              },
            ],
          },
          {
            id: "macabre-stuff",
            text: "You must have seen some pretty macabre stuff in here.",
            response: "Your face is a contender. But I've seen worse.",
            followUp: [],
          },
        ],
      },
      {
        id: "check-victim-body",
        text: "Let's check the victim's body.",
        response:
          "Fine. But don't touch anything. And don't tell anyone I showed you this. I'd rather not have to explain myself to the living.",
        condition: "can-see-body",
        followUp: [
          {
            id: "weird-signs",
            text: "What are those weird signs on the body?",
            response:
              "What weird signs? Probably tattoos or something. Kids these days have no respect for their own body.",
            followUp: [],
          },
          {
            id: "check-autopsy-report",
            text: "Can I check the autopsy report?",
            response: "Oh for fu--I mean sure, whatever.",
            followUp: [],
            specialAction: () => {}, // This will be handled in the component
          },
        ],
        specialAction: () => {}, // This will be handled in the component
      },
      {
        id: "after-viewing-evidence",
        text: "...",
        response: "Are you done staring? I don't have all day for this nonsense.",
        condition: "after-viewing-evidence",
        followUp: [],
      },
    ],
  },
]

// Librarian dialogue tree - updated to include Genghis Khan book as favorite
export const librarianDialogue: DialogueOption[] = [
  {
    id: "initial-greeting",
    text: "Start",
    response: "...",
    followUp: [
      {
        id: "who-are-you",
        text: "Who are you?",
        response: "Shhhhhhhhh!!!",
        followUp: [],
      },
      {
        id: "investigating-murder",
        text: "I'm investigating a murder.",
        response: "This is a library!",
        followUp: [
          {
            id: "reading-for-case",
            text: "Do you have any reading that could help me with my case?",
            response: 'I\'m afraid your "case" is a lost cause.',
            followUp: [],
          },
        ],
      },
      {
        id: "looking-for-book",
        text: "I'm looking for a book.",
        response: "Color me impressed.",
        followUp: [
          {
            id: "whats-your-favorite",
            text: "What's your favorite?",
            response: "This one never fails to put a smile on my face.",
            followUp: [
              {
                id: "read-favorite-book",
                text: 'Read book: "Absolutely True* Facts About Genghis Khan (*Not Actually True)"',
                response: "",
                followUp: [],
                specialAction: () => {}, // This will be handled in the component
              },
            ],
          },
          {
            id: "book-about-puppies",
            text: "I need a book about puppies.",
            response: "I think this is appropriate for your mental age.",
            followUp: [
              {
                id: "read-puppies-book",
                text: 'Read book: "Adorable Photos of Cutesy-cute Puppies for Kids and the Mentally Impaired"',
                response: "",
                followUp: [],
                specialAction: () => {}, // This will be handled in the component
              },
            ],
          },
          {
            id: "book-about-serial-killers",
            text: "I need a book about serial killers.",
            response: "Oh, another creep. Don't get *too* inspired. Serialized murder is a respectful art.",
            followUp: [
              {
                id: "read-serial-killers-book",
                text: 'Read book: "Penchant For Murder: Everyone and Their Mother Wants To Kill These Days"',
                response: "",
                followUp: [],
                specialAction: () => {}, // This will be handled in the component
              },
            ],
          },
          {
            id: "book-about-botany",
            text: "I need a book about botany.",
            response: "Looking for creative ways to get high huh? Just leave the frogs alone.",
            followUp: [
              {
                id: "read-botany-book",
                text: 'Read book: "Plant Identification Manual"',
                response: "",
                followUp: [],
                specialAction: () => {}, // This will be handled in the component
              },
            ],
          },
          {
            id: "book-about-blood-diseases",
            text: "I need a book about blood diseases.",
            response: "You do look awful. But I would recommend going to see a doctor.",
            condition: "knows-about-anemia",
            followUp: [
              {
                id: "read-blood-diseases-book",
                text: 'Read Book: "Blood diseases: Causes, Signs and Symptoms"',
                response: "",
                followUp: [],
                specialAction: () => {}, // This will be handled in the component
              },
            ],
          },
          {
            id: "book-about-demons",
            text: "I need a book about demons and evil creatures.",
            response: "Another worshipper huh? If you summon the Devil, tell him he owes me 5,000 rupees and a kitten.",
            condition: "knows-about-body-marks",
            followUp: [
              {
                id: "read-demons-book",
                text: 'Read Book: "Monsters, Demons and Other Evil Creatures from Around the World"',
                response: "",
                followUp: [],
                specialAction: () => {}, // This will be handled in the component
              },
            ],
          },
        ],
      },
    ],
  },
]
