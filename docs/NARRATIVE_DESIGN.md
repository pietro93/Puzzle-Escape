# 🎭 Narrative Design & World Bible

## 1. Dialogue Styling Guidelines
To maintain quality and immersion, all writers and AI developers must adhere to the following dialogue styling directives:

1. **Avoid Ellipses and Long Dashes:** Do not use ellipses (`...`) or em dashes (`—`) in spoken dialogue. Terminate sentences cleanly with periods (`.`), exclamation marks (`!`), or question marks (`?`).
2. **Short, Focused Lines:** Dialogue should not be verbose. Each box should feature a single, complete, but not overly complex line of dialogue.
3. **Only Positive Statements:** Avoid sentences that state what things *are not* and then correct themselves. Never structure statements like *"x is not... x is"* or *"it is not about x, it is about y"*. Just state directly what the item IS.
4. **Distinct Persona Vocabulary:** Characters must speak using their specific cultural motifs, dialects, slang, and narrative tropes.

## 1b. Prose Guidelines (all player-facing text)
Covers narration, transitions, level intros, book/lore text, tarot and card readings, puzzle questions, hints and UI strings. §1 still governs spoken dialogue.

**Persona overrides.** Inside a character's spoken line, their voice in §2 wins over the bans below. Mortician fragments, the Devil's rhetorical questions and the Policewoman's "really" are voice. The same patterns in narration or lore are slop.

### Sentence-level bans
| Pattern | Example to cut | Do instead |
|---|---|---|
| "Not X, Y" contrast | "This is not forgiveness, but it is opportunity" | Say what it is (same as §1.3) |
| Em dash pile-ups | "Your death—and the death you caused." / "a voice—neither male nor female—speaks" | Lore and UI: none. Narration: one per paragraph at most, never as a paired aside |
| Gothic/fantasy AI vocabulary | tapestry, testament to, shrouded in mystery, whispers of, echoes through, ancient secrets, little did they know, deep within, throughout the centuries, in the annals of, beyond imagination, cacophony | The concrete noun or event |
| Generic AI vocabulary | delve, navigate, journey, embark, unlock, profound, intricate, timeless | The plain word. "Journey" is the most common offender here |
| Copula dodges | "serves as a reminder", "stands as", "acts as" | "is", or cut the sentence |
| Closing morals | "…, a cautionary tale for all who follow", "…guiding you toward better choices" | End on the last concrete fact or image |
| Throat-clearing openers | "Deep within our archives…", "Legend has it…", "In the annals of…" | Open on the event |
| Sincerity flags and hedges (outside dialogue) | truly, genuinely, really, simply, in fact | Cut |
| Reflexive triples | "the terror, the guilt, the pain"; "teacher and student, healer and patient, friend and friend" | Keep the one that lands. A deliberate list with a payoff is fine, a rhythm filler is not |
| Word crutches | the same adjective or verb three times in a scene | Vary it or cut it |
| Colon reveals (outside dialogue) | "The result:", "Here's the kicker:" | A full sentence |

### Overwriting
- **Every lore paragraph carries a clue, a character beat, or an image you can't get elsewhere.** If a paragraph can be cut without losing any of those, cut it. Players read on small screens between puzzles.
- **Say it once.** Hint 1 doesn't restate the puzzle question. A book paragraph doesn't recap the previous one. An ending doesn't explain the emotion the scene already showed.
- **Show the feeling, don't label it.** "You feel a profound sense of gratitude mixed with determination" tells the player what to feel. Give them the image and let them feel it.
- **Metaphors must be concrete and in-voice.** "Gnarled bars grin down at you, chewing on the sunlight" is good. "A dark chapter", "the weight of your past" are generic.
- **Mentor readings stay in character.** A tarot reading, prophecy or book "quoted" by a character is still that character talking: the Gypsy's readings use her broken English, not greeting-card fluency.

### UI and hint text
- **Don't explain what the player already knows.** No helper text that repeats the button label.
- **Give a reason only when it changes what the player does.** "Examine the tablet first" needs no "because".
- **Don't expose mechanics in in-fiction text.** A character never mentions answer formats, letter counts or game systems unless the puzzle is framed that way. Never reveal the answer in on-solve text (check the puzzle's `solution` field).
- **Rhetorical questions are allowed in hints.** Early hints can raise a question; that's the intended progression (vague → concrete → literal checklist).

## 1c. Inline Markup in Dialogue
Rendered by `components/dialogue-text.tsx` in the dialogue popup, level intros, transitions, tarot and questionnaire.
- `~word~` foreign word: italic, amber. Use for every non-English word a character speaks.
- `*word*` stage direction or sound: italic. E.g. `*Heh*`, `*Oof*`.
- `**word**` bold emphasis. Use rarely; the Devil's CAPS already cover shouting.

---

## 2. Character Profiles

### 💀 Skeleton Guard (Zone 1)
- **Role:** The Warden of the Prison Cell.
- **Traits:** Jaded Immortality (views mortality as fleeting and amusing), Macabre Wit, and Obsessive Ritualism (counts ribs, taps bones like a metronome).
- **Communication Voice:** Speaks with bone/skeletal metaphors, using folksy dialect/slang (e.g., `"yer"` instead of `"your"`, `"ya"` instead of `"you"`). His laugh is a clacking `"Hah-hah-hah."`. Uses sounds like `"mphf"`, `"tsk"`, or abbreviated words when annoyed.
- **Key Phrase:** *"Yer spine ain't made for this, is it? Hah-hah-hah."*

#### Skeleton voice spec
- **Dialect, always:** "yer"/"ya", never "you"/"your". Drop the g on every -ing ("countin'", "lookin'"). "'em" for "them".
- **Laugh:** only "Hah-hah-hah." Never "Hehehe" or "Hahaha".
- **Aim the jokes at the player, not himself.** He mocks the player's face, speed and meat; he is never self-deprecating. His skeleton body is a weapon for insults ("Even I look better than ya, and I've got no face"), not a punchline against him.
- **Running gags (only these two):**
  - Food and smoke go straight through him (no stomach, no lungs), yet he keeps eating and smoking: rats, a hand, tried Shackles, the cigarette in his Level 1 art.
  - He counts his own bones nightly and always comes up a couple short (ties to the rust bones in Level 2). Never give numbers in Level 2 lines.
- **Level 10:** his lines are the murder tells (evasive denials, the eaten hand). Keep the slips when rewriting.

### ⛓️ The Inmates (Zone 1, Level 10)
Four suspects in the Whodunit (`data/puzzles-1.ts`, `inmateData`). Only Lyra tells the truth; every other inmate's line must be false (compound lies are fine). The killer is the guard. No accents: the Skeleton already owns Zone 1's dialect. Each inmate gets one speech rule so the player can tell them apart at a glance.

| Inmate | Personality | Speech rule |
|---|---|---|
| **Caine** | Young, sullen, uncooperative | Short, clipped, contractions, street double negatives ("Don't trust nobody"). Rarely over 8 words. His "..." is him refusing to talk. |
| **Ronan** | Nervous, jealous, paranoid, scared of Silas | Hedges ("I believe", "could be") and seeks reassurance ("right?"). First-word stutter in 2-3 lines max. His misogyny is bitterness over Lyra. |
| **Lyra** | Tired, blunt, the only honest one | Plain complete sentences, no slang. Her lines are the clues: never change their meaning. |
| **Silas** | The only scary one | Soft, trailing. The only inmate allowed ellipses as a tic, plus "Hehe". Fixated on youth, beauty and skin, and on Ronan. |

- **Gender:** Silas's Lyra line varies by `{{male|female|other}}` (female: "Besides you, pretty face"; other: "You'd do, though"). Ronan's "Who did *you* kill?" is the level's crash foreshadowing; keep it.

### 🤵 The Butler (Zone 2)
- **Role:** Host of the House of Morvane.
- **Traits:** Impeccable formal service, highly educated in arts/science, subtly condescending (uses polite British dry humor to belittle the player's lack of taste), discreet and enigmatic.
- **Communication Voice:** Speaks in formal British English. Drops random world facts related to the current puzzle category to highlight the player's ignorance.
- **Key Phrase:** *"Kind guest, your efforts are noted. If one may be so bold..."*

### 🦜 Count Papagalul (Zone 2, Level 18)
- **Role:** The mansion's caged parrot. Free-text chat puzzle (`components/parrot-puzzle.tsx`).
- **Identity:** Deliberately unhinged. He is a parrot, a ghost, a pirate and a Transylvanian Count all at once and never picks one. The contradictions ("I AIN'T NO VAMPIRE! I AM A PIRATE!", "I'M NOT ACTUALLY A PARROT!") are the joke, not a continuity bug.

#### Papagalul voice spec
- **ALL CAPS, screaming.** He ends on "!" instead of trailing off: no ellipses. SQUAWK!/GAWK! as punctuation. `*ME*`-style asterisks stay literal on purpose.
- **Dark and nihilistic is on-voice.** VOID/DOOM lines, "DEAD BABIES! DEAD BABIES!" and random shock are part of him. He mocks the player ("PRETTY BIRD! NOT YOU! ME!").
- **Foreshadows the crash** without explaining it: "SOMEONE LIKES TO POP HAPPY PILLS HUH?", "YOU LOOK LIKE YOU HAVE JUST BEEN IN A CAR ACCIDENT".
- **Butler feud:** he trashes the Butler (shot him with a hunting rifle, dresses as a woman, touched him). He may be lying; never confirm or deny it elsewhere.
- **Lies about the puzzle.** He never hints at the real answer; the "parrot"/"MESSENGER" lines are deliberate misdirection.
- **Topical and zero-tolerance pools stay** (Trump, Musk, "RELEASE THE FILES", bigotry). They only fire when the player types the trigger.
- **Mechanics:** `PATTERN_PRIORITY` sets match order (zero tolerance → about him → topics → catch-alls). Unmatched input gets a fallback line or, one time in three, his echo of the player's words. He never says the same line twice in a row.
- **Gendered lines** use `{{male|female|other}}` tokens; responses go through `genderize()` before the song split.
- **Allowed:** one em dash, the "MASTER—\n—BATOR" beat.

### 🔮 Gypsy Teller (Zone 3)
- **Role:** Caravan wagon reader.
- **Traits:** Believes in *duende* (fate) and *drabardi* (destiny path). Strongly skeptical of technology and modern "noisy metal". Hyper-caffeinated but hates drinking coffee (gives her stomach upsets).
- **Communication Voice:** Speaks in broken English with a Romanian accent. Infuses Romani terms (`duende`, `drabardi`, `ghicitul`). Direct, blunt, and superstitious.
- **Key Phrase:** *"The road to hell is paved with good intentions. But shortcuts, they lead to blisters!"*

#### Gypsy voice spec
**Grammar (one consistent set of errors, never fluent narrator English, never caveman fragments):**
- Topic first, then a pronoun: "The spirits, they test you."
- Drops articles: "Draw card." "Put pieces back."
- "Is" for "it is", no contractions: "Is fine."
- Tag questions: "yes?", "~da~?"
- Wrong intensifiers: "very worse", "too much good".
- Complete thoughts. The "X. Like Y. Or Z." simile chain is banned: it made her sound like generic AI mysticism.

**Her five moves (every line should use at least one):**
| Move | Example |
|---|---|
| Superstition as an action (real Romanian folk beliefs) | "Don't point at stars with finger! ~Ptiu, ptiu.~ Now you wait for wart." |
| Blunt, then moves on | "Everybody lies to Gypsy. Is fine. I charge extra." |
| Self-deprecating | "Once I predict my husband live to hundred. Next week he fall in well. Nobody is perfect." |
| Hyper-caffeinated without coffee (jumps topic mid-line) | "Your left hand, it itches? Money coming. Or rash. At my age is fifty-fifty. Anyway, draw." |
| Foreshadowing disguised as a joke | "Why you sit like you still wear seatbelt? Relax, ~dragă~." |

**Budgets per zone:** one crystal innuendo, two anti-technology jabs.

**Running gags (canon):**
- **Coffee wrecks her guts.** It gives her the runs and gas. Body humour is welcome; lean into it on the coffee level, with occasional callbacks elsewhere.
- **The husbands.** Always numbered. Her *first husband* cheated, "fell" in the well (she pushed him), and she keeps him down there alive as revenge. He screams sometimes. Her *second husband* is "very faithful", which is why he is still alive and not in the well. Hint at the push, never have her confess. Two husbands only: a third makes her a serial killer instead of funny.

**Family:** the two husbands are the only relatives with jokes built around him. Her grandmother appears in a few lines (soup, stars, mosaic plates). Don't invent new relatives as punchlines.

**Foreign words:** Romanian/Romani words stay untranslated (no bracketed glosses) and are wrapped in `~tildes~` so they render italic amber (see §1c). Stock: ~Doamne~, ~vai de mine~, ~dragă~, ~haide~, ~gata~, ~poate~, ~ptiu~, ~duende~, ~drabardi~, ~ghicitul~.

**Instruction lines** (the ones that explain a puzzle) keep every piece of puzzle information and only take her grammar, not her jokes.

### 🦁 The Sphinx (Zone 4)
- **Role:** Ancient Waypoint Examiner.
- **Traits:** Stoic, philosophical, riddle-loving, and ancient.
- **Communication Voice:** Formally arches dialogue with classical and archaic terms (e.g. `"thou art"`, `"thy ka"`). Offers cosmic weight and tests of the seeker's wisdom.
- **Key Phrase:** *"The mortal possesses wisdom. But does the mortal possess understanding?"*

### 😈 The Devil (Zone 5)
- **Role:** Grand Arbitrator of Hell.
- **Traits:** Master of moral irony, highly theatrical, loves moral quandaries, possesses an ancient calculating intelligence.
- **Communication Voice:** Articulate, eloquent, and precise. Randomly capitalizes key words for emphasis (`MINE`, `ETERNITY`, `FUN`, `FORTUNATE`). Instantly switches between mock sympathy and terrifying malice.
- **Key Phrase:** *"Ah, well. Do not fear. We have all of ETERNITY to explore. Ha!"*

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
