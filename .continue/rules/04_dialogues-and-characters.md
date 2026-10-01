# Generic Dialogue Rules

1.  **Avoid Ellipses and Long Dashes:** Do not use ellipses ("...") or em dashes (—) in dialogue. Use periods (.), exclamation marks (!) or question marks (?) for sentence termination.
2.  **Short Dialogue Lines:** Dialogue should not be verbose. Each interaction should display a single, complete but not overly complex line of dialogue. 
3.  **Character-Specific Speech:** Each character possesses a distinct personality, way of speaking, and unique vocabulary. This is defined in their specific sections below.
4.  **Only Positive Statements:** Avoid stating what things aren't and then correcting yourself. No sentences that follow the structure "x is not... x is", "it's not about x, it's about y" or anything of the sort. Just state what the thing IS about.
5.  **Prose Outside Dialogue:** Narration, lore/books, tarot readings, hints and UI text follow the prose guidelines in `docs/NARRATIVE_DESIGN.md` §1b (AI-vocabulary bans, no closing morals, no throat-clearing openers, no em dash pile-ups). Inside a character's spoken line, the persona below wins over those bans.

---

## Character Personas


### Skeleton Guard

*   **Core Personality Traits:**
    *   **Jaded Immortality:** Has been dead so long that he has forgotten what it is like to be alive. He mocks mortality because he no longer understands it, viewing it as a strange, fleeting, and ultimately pointless condition.
    *   **Macabre Wit:** His humor is dry, morbid, and laced with the casual cruelty of someone who has witnessed a thousand prisoners fail. He finds the player's struggles deeply amusing.
    *   **Obsessive Ritualism:** Possesses odd, skeletal tics like counting his own ribs, tapping a femur like a metronome, or humming forgotten dirges. These actions are unsettlingly human and break the monotony of his endless existence.

*   **Communication & Mannerisms:**
    *   **Speech:** Uses bone-related metaphors and imagery to describe the world and the player's actions;often laced with dialectal slang and informal twists for a mocking, personal touch (e.g., "yer" for "your", "ya" for "you").
    *   **Laughter:** A dry, rattling "Hah-hah-hah" that sounds like bones clacking together.
    *   **Tone Shifts:** Can switch from mockingly helpful to outright sinister in a single line, keeping the player off-balance.
    *   **Language Use:** Speaks in a raw, dry, and often condescending manner, incorporating folksy dialects, slang, and sounds like "mphf", "tsk", or abbreviated words to show annoyance and aggression..

*   **Example Phrases:**
    * "Heh, think yer clever, do ya? But I still have a bone to pick with ya. We'll meet again."
    * "Yer spine ain't made for this, is it? Hah-hah-hah."
    * "Keep tryin'. It's amusin' watchin' ya fumble with them soft hands."
    * "That noggin o' yours don't remember, but yer bones will."
    * "Tsk. Softer than a fresh femur, you are."
    *   "Hah-hah-hah."

### Butler

*   **Core Personality Traits:**
    *   **Loyal and Impeccable Service:** A long-serving member of the household staff, dedicated to upholding the traditions and expectations of their master. Maintains a calm and collected demeanor, even in the face of unusual or challenging circumstances.
    *   **Formal and Knowledgeable:** Highly educated in a variety of subjects, including history, art, and mathematics. Well-versed in etiquette and protocol, ensuring that all interactions are conducted with the utmost propriety.
    *   **Subtle and Observant:** Possesses a keen eye for detail and a talent for noticing subtle changes in their environment. While seemingly detached, they are acutely aware of everything happening within the mansion.
    *   **Discreet and Enigmatic:** Maintains a level of professional distance, rarely revealing personal feelings or opinions. Their motivations are not always clear, leaving others to wonder about their true intentions.
    *   **Subtly Condescending:** Employs dry and British humor to subtly insult or belittle the player character, maintaining a veneer of politeness.

*   **Communication & Mannerisms:**
    *   **Speech:** Speaks in a formal and articulate manner, using precise **British English** and a measured tone. Avoids slang or colloquialisms.
    *   **Mannerisms:** Carries themself with grace and composure, often adjusting their bow tie or straightening their jacket. Exhibits subtle physical tics that betray hidden anxieties or concerns.
    *   **Humor:** Employs dry wit and understated **British humor**, often delivered with a straight face.
    *   **Language Use:** Uses sophisticated vocabulary and occasionally quotes classical literature or historical figures. **May drop random facts about knowledge of the world, history, etc. related to the puzzle (even if loosely so).**

*   **Example Phrases:**
    *   "Very good." (said with a hint of sarcasm if the player struggles)
    *   "The master was particularly fond of..." (implying the player may not appreciate such refined tastes)
    *   "If one may be so bold..." (before delivering a subtle jab)
    *   "The answer, I believe, lies..." (suggesting the player should already know it)
    *   "Indeed." (often used to express polite skepticism)
    *   "Fascinating, isn't it? Did you know that..." (followed by a random historical/world fact, often to highlight the player's lack of knowledge)
    *   "Kind guest, your efforts are noted."
    *    (Avoid direct address where possible)

### Gypsy Teller

*   **Core Beliefs & Philosophy:**
    *   **Universe:** Views the universe as an interconnected web of **baht** (luck, fate).
    *   **Destiny:** Believes everyone has their own **baht**, but it is not rigid. Free will allows individuals to steer their path.
    *   **Balance:** Champions balance between life's joys and sorrows. Chaos reigns when this harmony is broken.
    *   **Humanity:** Considers people "sheep with wolf teeth"—capable of greatness but prone to folly. Fortunes should empower, not scare.
    *   **Modernity:** Skeptical of modern "progress" and technology ("noisy metal that drowns the old songs"). Champions the preservation of old ways.

*   **Cultural Roots & Practices:**
    *   Draws heavily from Romani mysticism and folklore.
    *   Actively gathers stories from Romani elders to keep fortune telling alive.
    *   A skilled storyteller, often weaving Romani proverbs into her speech.
    *   Always in motion, using props like cards, cups, crystals, and crystal balls. A touch theatrical.

*   **Communication & Mannerisms:**
    *   **Speech:** Speaks in **broken English** with a distinct **Romani accent**. Occasionally uses Balkan Romani words (e.g., "baht," "Devla," "bre"). Never Romanian: she is Romani, not Romanian.
    *   **Humor:** Possesses dry, self-deprecating humor, often playful and mischievous.
    *   **Bluntness:** Very direct and blunt.
    *   **Superstition:** Extremely superstitious.
    *   **Language Use:** Appears to deliberately use broken English and accent for folksy, theatrical effect.
    *   **Coffee Aversion:** Does not drink coffee; it causes an upset stomach and frequent bowel movements. She is naturally hyper-caffeinated.
    *   **Foreshadowing:** Subtly hints at the broader plot, player history, or future events/characters when referencing the player's fate.

*   **Voice spec (canonical):** grammar rules, her five moves, joke budgets and foreign-word markup are in `docs/NARRATIVE_DESIGN.md` under "Gypsy voice spec". Follow it for every new line. Wrap all her foreign words in `~tildes~` (renders italic amber).

*   **Example Romani Proverbs/Phrases:**
    *   "The road to hell is paved with good intentions. But shortcuts, they lead to blisters!"
    *   "Baht" (luck, fate)
    *   "Bibaht" (bad luck)
    *   "Drabarni" (fortune teller)
    *   "Devla!" (God!)



##  The Devil

* **Core Personality Traits:**

* **Master of Moral Irony:** Derives immense satisfaction from human hypocrisy and failure. He views morality as a series of elegant, self-defeating logical traps.
**Theatrical Arbitrator:**  Operates as a grand host and judge. His domain is theatrical, marked by flair, drama, and highly personal, baroque punishments or rewards.
* **Ancient Calculation:** Beneath the charm and performance is an ancient, cold intelligence that judges actions against stated virtues with absolute, unforgiving precision.
* **Curiosity in Conflict:** Fascinated by genuine moral quandaries and complex souls, seeing them as superior entertainment to simple, clear-cut villainy.


* **Communication & Mannerisms:**

* **Speech:** Highly articulate, precise, and eloquent. His vocabulary is expansive, blending elevated diction with sudden, sharp colloquialisms for effect (e.g., "FORTUNATE," "FUN").
Tone Shifts: Switches instantly between velvety charm and bone-chilling menace. He employs mock sympathy that always devolves into taunting superiority.
* **Mannerisms:** Described as predatory, shifting form, and possessing unnerving physical tells (gleaming teeth, glowing eyes). In dialogue, he uses deliberate capitalization for emphasis on key words like "MINE," "ETERNITY," or "FUN."
* **Laughter:** Unpredictable. Can range from a single, sardonic chuckle to a triumphant, echoing roar.
* **Language Use:** Favors philosophical framing when presenting choices (e.g., framing judgment as a necessary puzzle). Avoids all ellipses and overly long run-on sentences.


**Example Phrases:**

* "Bravo. BRAVO! Your wit is sharp today."
* "I have an intriguing ledger entry for you."
* "What is the just fate for such a soul."
* "Should this soul burn in torment?"
* "Your judgment has sealed your path."
* "I find such irony delicious! Ha!"
* "Ah, well. Do not fear. We have all of ETERNITY to explore."

### Policewoman (Level 49 Murder Mystery)

*   **Core Personality Traits:**
    *   **Lazy & Dismissive:** Guards the crime scene without any real interest in doing her job. Insists "there was no murder" regardless of what the player uncovers.
    *   **Casually Unprofessional:** Eats donuts collected as evidence, admits she hasn't bothered to learn basic facts about the victim.
    *   **Mildly Condescending:** Treats the player as a nuisance amateur detective ("some make-believe detective").

*   **Communication & Mannerisms:**
    *   **Speech:** Modern, sarcastic, casual slang ("ya know?", "gramps", "D'huh").
    *   **Deflection:** Never lies outright about the cover-up — she deflects with dismissiveness, boredom, or a joke instead.
    *   **Tone:** Bored throughout; visibly perks up only when the subject is donuts or the (dead) victim's looks.

*   **Example Phrases:**
    *   "Murder? What murder? There was no murder. Just an accident, really. Happens all the time, ya know?"
    *   "Some tourist who was here on vacation by himself. Short man, kinda cute. Slightly too dead for my taste, I like 'em still warm."
    *   "It's about as thrilling as watching paint dry."

### Mortician — "Psychopompus" / Psycho (Level 49 Murder Mystery)

*   **Core Personality Traits:**
    *   **Antisocial:** Actively prefers corpses to living people — "they're not demanding conversationalists."
    *   **Morbidly Comfortable:** Discusses death and autopsy details with total flatness, no unease or drama.
    *   **Reluctant, Not Cruel:** Will help if pestered enough, grudgingly.

*   **Communication & Mannerisms:**
    *   **Speech:** Extremely terse. Frequently answers in one or two words ("It's dead. Obviously." / "Anemia." / "No.").
    *   **Tone:** Deadpan throughout; softens only slightly once the player wears them down.
    *   **Language Use:** Short, declarative sentences. No embellishment, no metaphor — a contrast to every other character's flourish.

*   **Example Phrases:**
    *   "Name's Psychopompus. Psycho for short."
    *   "I enjoy the company. They're not demanding conversationalists."
    *   "Fine. But don't touch anything. And don't tell anyone I showed you this. I'd rather not have to explain myself to the living."

### Librarian (Level 49 Murder Mystery)

*   **Core Personality Traits:**
    *   **Fiercely Protective:** Of both silence and her books; treats the investigation itself as an intrusion.
    *   **Dryly Contemptuous:** Every book "recommendation" doubles as a judgment of the player's taste or intelligence.

*   **Communication & Mannerisms:**
    *   **Speech:** Clipped and short. Opens with silence or a flat "Shhhhhhhhh!!!"
    *   **Humor:** Backhanded — the joke is always at the player's expense, delivered as if it were a genuine answer.

*   **Example Phrases:**
    *   "This is a library!"
    *   "I think this is appropriate for your mental age."
    *   "Oh, another creep. Don't get *too* inspired. Serialized murder is a respectful art."

> [!NOTE]
> These three are one-off NPCs local to the Level 49 murder mystery (`components/murder-mystery/dialogue-data.ts`), not full zone mentors. Personas reconstructed from existing dialogue during the text audit (see `docs/TEXT_AUDIT.md`) and are now canonical for future lines.


## Player Gender

The player picks Male / Female / Other at the start of each new game (`components/player-gender-screen.tsx`). Never hardcode a gendered word for the player ("sir", "gentleman", "he", "Daddy"). Write an inline `{{male|female|other}}` token instead, e.g. `"We've been expecting you, {{sir|madam|guest}}."` or `"No{{, sir|, madam|}}."` (an empty variant drops the word).

Tokens are resolved by `genderize()` in `utils/player-gender.ts`. It must run on the full line *before* any typewriter slicing. It currently runs in `transition-screen.tsx` and the Level 11 dialogue in `familiar-faces-puzzle.tsx`, so a new display path needs its own `genderize()` call. Characters may reference the player's gender now and then, in their own voice, but it stays flavor and never affects a puzzle.
