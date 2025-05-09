// Define guard dialog lines for level 10
export const guardDialogLines = [
  "An inmate has been murdered, and one of these four inmates did it. Who is the killer?",
  "I've been guarding this prison for centuries. Nobody escapes on my watch.",
  "These inmates are all liars. Only one of them tells the truth.",
  "The murderer is in this room. Find them, or you'll never leave.",
  "Time is running out. Make your choice.",
  "I grow tired of your hesitation. Choose wisely.",
  "The answer is right in front of you. Can't you see it?",
  "Look beyond what they say. Look at what they don't say.",
  "The truth is often hidden in plain sight.",
  "What has a bed, a mouth, banks, and a crystal clear body?", // This is the sphinx riddle for level 38
]

// Define random elevator messages
export const getRandomElevatorMessage = (): string => {
  const messages = [
    "The elevator descends with a sickening lurch...",
    "You feel the temperature rising as you descend deeper...",
    "Screams echo from somewhere far below...",
    "The walls of the elevator seem to pulse like a living thing...",
    "Blood begins to seep from the corners of the elevator...",
    "Whispers surround you as the elevator continues its descent...",
    "The lights flicker, plunging you into momentary darkness...",
    "The elevator shudders violently as it passes through another threshold...",
    "A distant wailing grows louder as you descend...",
    "The air becomes thick with the smell of sulfur and decay...",
    "Shadows move across the walls of the elevator, though you stand perfectly still...",
    "The floor beneath your feet becomes uncomfortably warm...",
    "You feel countless eyes watching you through the walls...",
    "The elevator creaks and groans like a dying animal...",
    "Your ears pop painfully as you descend to impossible depths...",
  ]
  return messages[Math.floor(Math.random() * messages.length)]
}

// Define character-specific dialogue
export const useCharacterDialogue = () => {
  // Return a function that gets random dialogue for a character
  return (character: string, level: number): string => {
    // Define dialogue options for each character
    const dialogueOptions: Record<string, string[]> = {
      skeleton: [
        "Mphf. You won't escape.",
        "I've been here longer than you can imagine.",
        "Your bones will join mine eventually.",
        "Tsk. Another soul thinking they're special.",
        "The Master finds your struggles amusing.",
        "I've seen thousands like you. None escaped.",
        "Your determination is pointless.",
        "Time has no meaning here. Only suffering.",
        "The puzzles only get harder from here.",
        "I could help you... but I won't.",
      ],
      butler: [
        "The Master will be most displeased with your progress.",
        "I've served in this mansion for generations.",
        "Perhaps sir would prefer to give up?",
        "The library holds many secrets, if one knows where to look.",
        "The previous guests never made it this far.",
        "The Master has quite the collection of... unusual artifacts.",
        "I'm afraid I cannot offer any assistance beyond my duties.",
        "The mansion has many rooms you haven't seen yet.",
        "Time for tea? No? As you wish, sir.",
        "The Master rarely receives visitors these days.",
      ],
      gypsy: [
        "The cards have foretold your arrival.",
        "Your future is shrouded in mist, but I see danger.",
        "The spirits speak of your journey through many realms.",
        "I see darkness in your past... and in your future.",
        "The crystal shows many paths, but only one leads to freedom.",
        "Your aura is... unusual. You don't belong here.",
        "I've read the fortunes of kings and beggars alike.",
        "The stars align against you, traveler.",
        "Some secrets are best left undiscovered.",
        "Your destiny is not yet written in stone.",
      ],
      sphinx: [
        "Riddles within riddles, seeker.",
        "The desert holds many secrets beneath its sands.",
        "Those who seek wisdom must first prove their worth.",
        "I have guarded these sands since before your kind walked upright.",
        "Time erodes all things, except for knowledge.",
        "The ancient ones knew truths your civilization has forgotten.",
        "Speak clearly, or speak not at all.",
        "The answer you seek may not be the one you need.",
        "I have devoured those who failed to answer correctly.",
        "The desert is patient. I am not.",
      ],
      devil: [
        "Welcome to my domain. You won't be leaving.",
        "Your soul is already mine. This is just... formality.",
        "I've been watching your progress with great interest.",
        "Hell has many circles. You've only seen a few.",
        "Your suffering amuses me greatly.",
        "Shall we make a deal? Your soul for the answer?",
        "Eternity is a long time to spend in my company.",
        "Your determination is admirable, but futile.",
        "I know your darkest thoughts. They're... delicious.",
        "The exit? Oh, there isn't one. Not for you.",
      ],
      brain: [
        "Please... make it stop...",
        "The pain... unbearable...",
        "Help... me...",
        "Can't... think... clearly...",
        "Too many... connections...",
        "Memories... fading...",
        "Who... am I?",
        "Was once... human...",
        "They... took my body...",
        "Just want... to die...",
      ],
    }

    // Get the dialogue options for the character
    const options = dialogueOptions[character] || ["..."]

    // Return a random dialogue option
    return options[Math.floor(Math.random() * options.length)]
  }
}
