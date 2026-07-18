# 🎭 Narrative Design & World Bible

## 1. Dialogue Styling Guidelines
To maintain quality and immersion, all writers and AI developers must adhere to the following dialogue styling directives:

1. **Avoid Ellipses and Long Dashes:** Do not use ellipses (`...`) or em dashes (`—`) in spoken dialogue. Terminate sentences cleanly with periods (`.`), exclamation marks (`!`), or question marks (`?`).
2. **Short, Focused Lines:** Dialogue should not be verbose. Each box should feature a single, complete, but not overly complex line of dialogue.
3. **Only Positive Statements:** Avoid sentences that state what things *are not* and then correct themselves. Never structure statements like *"x is not... x is"* or *"it is not about x, it is about y"*. Just state directly what the item IS.
4. **Distinct Persona Vocabulary:** Characters must speak using their specific cultural motifs, dialects, slang, and narrative tropes.

---

## 2. Character Profiles

### 💀 Skeleton Guard (Zone 1)
- **Role:** The Warden of the Prison Cell.
- **Traits:** Jaded Immortality (views mortality as fleeting and amusing), Macabre Wit, and Obsessive Ritualism (counts ribs, taps bones like a metronome).
- **Communication Voice:** Speaks with bone/skeletal metaphors, using folksy dialect/slang (e.g., `"yer"` instead of `"your"`, `"ya"` instead of `"you"`). His laugh is a clacking `"Hah-hah-hah."`. Uses sounds like `"mphf"`, `"tsk"`, or abbreviated words when annoyed.
- **Key Phrase:** *"Yer spine ain't made for this, is it? Hah-hah-hah."*

### 🤵 The Butler (Zone 2)
- **Role:** Host of the House of Morvane.
- **Traits:** Impeccable formal service, highly educated in arts/science, subtly condescending (uses polite British dry humor to belittle the player's lack of taste), discreet and enigmatic.
- **Communication Voice:** Speaks in formal British English. Drops random world facts related to the current puzzle category to highlight the player's ignorance.
- **Key Phrase:** *"Kind guest, your efforts are noted. If one may be so bold..."*

### 🔮 Gypsy Teller (Zone 3)
- **Role:** Caravan wagon reader.
- **Traits:** Believes in *duende* (fate) and *drabardi* (destiny path). Strongly skeptical of technology and modern "noisy metal". Hyper-caffeinated but hates drinking coffee (gives her stomach upsets).
- **Communication Voice:** Speaks in broken English with a Romanian accent. Infuses Romani terms (`duende`, `drabardi`, `ghicitul`). Direct, blunt, and superstitious.
- **Key Phrase:** *"The road to hell is paved with good intentions... but shortcuts lead to blisters!"*

### 🦁 The Sphinx (Zone 4)
- **Role:** Ancient Waypoint Examiner.
- **Traits:** Stoic, philosophical, riddle-loving, and ancient.
- **Communication Voice:** Formally arches dialogue with classical and archaic terms (e.g. `"thou art"`, `"thy ka"`). Offers cosmic weight and tests of the seeker's wisdom.
- **Key Phrase:** *"The mortal possesses wisdom. But does the mortal possess understanding?"*

### 😈 The Devil (Zone 5)
- **Role:** Grand Arbitrator of Hell.
- **Traits:** Master of moral irony, highly theatrical, loves moral quandaries, possesses an ancient calculating intelligence.
- **Communication Voice:** Articulate, eloquent, and precise. Randomly capitalizes key words for emphasis (`MINE`, `ETERNITY`, `FUN`, `FORTUNATE`). Instantly switches between mock sympathy and terrifying malice.
- **Key Phrase:** *"Ah, well... do not fear. We have all of ETERNITY to explore. Ha!"*

### 👮 Policewoman (Zone 5 — Murder Mystery, Level 49)
- **Role:** The bored, corrupt cop guarding the murder scene.
- **Traits:** Lazy, dismissive, and openly uninterested in her job. Insists "there was no murder" no matter what evidence contradicts her. Casually unprofessional (eats donuts collected as evidence), a little flirtatious about the (dead) victim, condescending toward the player.
- **Communication Voice:** Sarcastic, deadpan, modern slang ("ya know?", "gramps"). Deflects real questions with dismissiveness or a joke rather than lying outright.
- **Key Phrase:** *"Murder? What murder? There was no murder. Just an accident, really. Happens all the time, ya know?"*

### ⚰️ Mortician — "Psychopompus" / Psycho (Zone 5 — Murder Mystery, Level 49)
- **Role:** The keeper of the body, found by the lake.
- **Traits:** Antisocial, prefers corpses to living company ("they don't complain"), morbidly comfortable with death, has zero patience for small talk or friendliness.
- **Communication Voice:** Extremely terse, often one or two words ("It's dead. Obviously." / "Anemia." / "No."). Dry, deadpan delivery; softens only under repeated pestering.
- **Key Phrase:** *"I enjoy the company. They're not demanding conversationalists."*

### 📚 Librarian (Zone 5 — Murder Mystery, Level 49)
- **Role:** Guardian of the archive the player must search for case-relevant reading.
- **Traits:** Fiercely protective of silence and her books, contemptuous of the player's "case," dryly judgmental of whatever the player asks for.
- **Communication Voice:** Clipped, often just "Shhhhhhhhh!!!" Answers land as backhanded book recommendations — the "gift" is itself the insult.
- **Key Phrase:** *"I think this is appropriate for your mental age."*

> [!NOTE]
> Unlike the five zone mentors above, these three do not appear across a full zone — they're one-off NPCs local to the Level 49 murder mystery (`components/murder-mystery/dialogue-data.ts`). Their personas were reconstructed from existing dialogue during the [TEXT_AUDIT](file:///c:/Users/Pietro/Desktop/Puzzle%20Escape/docs/TEXT_AUDIT.md) pass and are now canonical — keep new lines for them consistent with the voices above.

---

## 3. Horizontal Plot & Player Identity

### The Player (Main Character)
The player begins the game in absolute amnesia, waking in a medieval-looking prison cell. Over the course of the 50 levels, they are unaware that they are already dead. In life, they were a virtuous person: kind, generous, and loved. However, on their final night, they made a catastrophic error—mixing alcohol with prescription antidepressants and making the selfish decision to drive home. 

### The Accident
While driving under the influence on a rain-slicked road, the player crashed head-on. The crash killed the player instantly, but also extinguished the life of an innocent pedestrian who was in the wrong place at the wrong time. The player's journey through the Prison, Mansion, Forest, and Desert is a purgatorial trial evaluating their soul's capacity for recognition, logic, memory reconstruction, and ultimate judgment.

---

## 4. The Finale & Endings

At Level 50, after completing the final trials, the Devil sits on his throne and presents the player with their own case file, framed as a moral dilemma involving an anonymous soul in his ledger: 
> *"What is the just fate for such a soul? This soul lived virtuously yet caused death and destruction. One moment of selfishness erased a lifetime of goodness. Heaven, Hell, or Neither?"*

The player is forced to select one of three choices, which branches the story into three narrative endings:

### 🔴 Choice A: "Hell" (The Self-Condemned Ending)
- **Narrative Resolution:** The player demands strict, unyielding punishment for the crime.
- **The Twist:** The Devil reveals the soul is the player's own. By declaring that the driver belongs in Hell, the player seals their own fate.
- **Ending Detail:** The Devil's civilized mask tears away. He drags the player down into a personal hell where they are forced to experience the fatal car crash on an infinite loop, accompanied by a lifetime of impossible, unsolvable puzzles.
- **Devil's Response:** *"By your own judgment, you belong to MINE. We have all of ETERNITY to explore... We are going to have so much FUN together."*

### 🔵 Choice B: "Heaven" (The Limbo/Ignominy Ending)
- **Narrative Resolution:** The player requests easy forgiveness and entry into paradise.
- **The Twist:** The Devil mocks the player's self-serving narcissism, stating they cannot simply wash away a stolen life with previous good deeds. 
- **Ending Detail:** The Devil refuses to let them enter Heaven, but denies them the release of Hell's finality. Instead, he drops them into an endless, gray void of Limbo, left alone with their memories and guilt. Alternatively, they may be reincarnated as a dung beetle or a confused puppy destined to chase its tail in loops.
- **Devil's Response:** *"SUCH NARCISSISM. You believe you deserve paradise after what you have done? You shall drift in the void between worlds, alone with your memories and guilt for eternity."*

### 🟢 Choice C: "Neither" (The True Reincarnation Ending)
- **Narrative Resolution:** The player rejects both self-indulgent paradise and eternal damnation, choosing a path of active atonement and recognition of their guilt.
- **The Twist:** The Devil is surprised and genuinely impressed by the player's wisdom and self-awareness.
- **Ending Detail:** The Devil grants the player a second chance at life. They are sent through a shimmering veil to be reborn as a human (a teacher, doctor, or gardener) to heal the world and balance their past crime. The Devil hints that in this new life, their path may cross again with the soul of the pedestrian they killed—not as victim and driver, but as friends, healers, or guides.
- **Devil's Response:** *"Your judgment of yourself shows wisdom... The universe rarely offers second chances. Do not waste this one. Until we meet again."*
