# 🔍 UX Research & Visual Audit — Puzzle Escape

*Audit conducted via programmatic browser rendering (Puppeteer @ 430×900px, mobile-first viewport) across 15 game milestones. All screenshots are unique captures of the actual running game.*

---

## Part I: Visual UX Walkthrough

---

### Screen 1 — Splash / Main Menu
![Splash Screen](file:///C:/Users/Pietro/.gemini/antigravity/brain/bdbd1da1-dc85-424f-ba46-61948d9ffebd/screen_splash.png)

> [!NOTE]
> **Insights:** The pixel art logo and starfield animation immediately communicate the dark, mystical tone. The button hierarchy (New Game → Continue → Restart) is clean.
>
> **Friction:**
> - The sound toggle top-right is easy to miss before starting. Should pulse once on load.
> - "Continue" is greyed out on first run but has no tooltip explaining why — new players may try clicking it repeatedly.

---

### Screen 2 — Level 1: Bone Counting
![Level 1: Bone Counting](file:///C:/Users/Pietro/.gemini/antigravity/brain/bdbd1da1-dc85-424f-ba46-61948d9ffebd/screen_level_1_bone_counting.png)

> [!NOTE]
> **Insights:** The dungeon backdrop and Skeleton Guard's pixel art establish tone immediately. The hint icon is visible and unobtrusive.
>
> **Friction:**
> - Zero onboarding. No tutorial overlay, no pointer. A one-time pulsing glow on interactive areas in Level 1 would reduce early abandonment.
> - The answer input sits below the puzzle image with little visual connective tissue between them. A small label ("Enter your answer:") would help.

---

### Screen 3 — Level 3: Lock & Key Math (Pre-Redesign)
![Level 3: Lock & Key Math](file:///C:/Users/Pietro/.gemini/antigravity/brain/bdbd1da1-dc85-424f-ba46-61948d9ffebd/screen_level_3_lock_math.png)

> [!WARNING]
> **Insights:** The clearest example of the static-image math problem. A JPEG of equations + plain text input. Compared to everything else in Zone 1, this breaks immersion.
>
> **Redesign (Approved):** A heavy iron chest with 3 distinct locks (Bronze/Silver/Gold). Players drag numbered keys from inventory to unlock each individually — algebra becomes a physical escape-room puzzle with tactile feedback.

---

### Screen 4 — Level 10: Whodunit — The Four Inmates
![Level 10: Whodunit](file:///C:/Users/Pietro/.gemini/antigravity/brain/bdbd1da1-dc85-424f-ba46-61948d9ffebd/screen_level_10_whodunit.png)

> [!IMPORTANT]
> **Characters:** Caine, Ronan, Lyra, Silas. *(Entirely distinct from Level 49's murder mystery NPCs.)*
>
> The click-through rotating dialogue per inmate is satisfying and natural.
>
> **Critique:**
> - The answer is `guard` — a great twist — but the UI gives no affordance that the Guard is a valid accusation target. Players who don't think laterally may never discover it.
> - Silas's dialogue (*"Caine is so young... if I could tear his skin apart and wear it as my own, I would... hehe..."*) is darkly brilliant. Tonally perfect for Zone 1.

---

### Screen 5 — Zone Transition: Prison → Mansion
![Zone Transition: Prison to Mansion](file:///C:/Users/Pietro/.gemini/antigravity/brain/bdbd1da1-dc85-424f-ba46-61948d9ffebd/screen_transition_mansion.png)

> [!TIP]
> **Insights:** Character portrait + background + paragraphs structure works. The Butler's introduction is elegant.
>
> **Critique:**
> - Text delivered as a static wall. No typing animation, no click-to-advance. For a game that prides itself on interactive storytelling, this is a missed opportunity for all four transitions.
> - The Butler's best line (*"One mustn't linger on the threshold — it's most dreadfully improper"*) is buried in paragraph 6. Restructure so his voice is the first thing heard.

---

### Screen 6 — Level 13: Color Palette
![Level 13: Color Palette](file:///C:/Users/Pietro/.gemini/antigravity/brain/bdbd1da1-dc85-424f-ba46-61948d9ffebd/screen_level_13_color_palette.png)

> [!WARNING]
> **Insights:** Visually striking. The color mixing mechanic is immediately intuitive.
>
> **Accessibility Blocker:** Uncompletable for Deuteranomaly/Protanomaly colorblind players. Every clue is pure-hue encoded. Adding subtle geometric pattern overlays per color (dots/stripes/hatching) as a fallback would fix this without altering the aesthetic for non-colorblind players.

---

### Screen 7 — Level 14: Jigsaw (Zone 2 Variant)
![Level 14: Jigsaw](file:///C:/Users/Pietro/.gemini/antigravity/brain/bdbd1da1-dc85-424f-ba46-61948d9ffebd/screen_level_14_jigsaw.png)

> [!TIP]
> **Insights:** Drag-and-drop is satisfying. Art quality is high.
>
> **Critique:** Pieces are perfect rectangles. Real jigsaw tabs provide orientation cues for uniform-color areas (sky, background). Adding shaped edges to the harder jigsaw variants (Levels 24, 34, 44) would serve as a natural difficulty modifier beyond grid size alone.

---

### Screen 8 — Level 18: Silverware Math (Pre-Redesign)
![Level 18: Silverware Math](file:///C:/Users/Pietro/.gemini/antigravity/brain/bdbd1da1-dc85-424f-ba46-61948d9ffebd/screen_level_18_silverware.png)

> [!WARNING]
> **Insights:** Same static-image + text-input issue as Level 3.
>
> **Redesign (Approved):** Interactive "Table Setting" component where the player arranges Silas's silverware on a dining table to visually balance equations. Ties the mechanic directly to the Butler's obsessive domestic perfectionism.

---

### Screen 9 — Level 19: Count Papagalul
![Level 19: Count Papagalul](file:///C:/Users/Pietro/.gemini/antigravity/brain/bdbd1da1-dc85-424f-ba46-61948d9ffebd/screen_level_19_parrot.png)

> [!TIP]
> **Insights:** The most unique puzzle UX in the game. A freeform text-chat interface — players can spend ten minutes just talking to a parrot who calls them a "FLESH BAG." The regex NPC system rewards experimentation over instruction-following.
>
> **Critique:** No responses exist for genuinely unexpected inputs (geography, historical names, Romanian words). Adding 5–10 responses for niche categories like "Transylvanian history" or "ornithology" would deepen the Count's character and reward curious players.

---

### Screen 10 — Zone Transition: Mansion → Forest
![Zone Transition: Mansion to Forest](file:///C:/Users/Pietro/.gemini/antigravity/brain/bdbd1da1-dc85-424f-ba46-61948d9ffebd/screen_transition_forest.png)

> [!IMPORTANT]
> **Insights:** The most important narrative transition. The Fortune Teller's dialogue drops the first explicit DUI hint: *"Metal screaming against metal. Glass shattering... Blood on your hands that wasn't yours alone."*
>
> **Critique:** This revelation is delivered in a skippable paragraph. Players who tap through quickly will miss it entirely. **Proposed redesign:** Multi-step tarot card flip mechanic — each card turned reveals one memory fragment, making the player an active participant in recovering what they did.

---

### Screen 11 — Level 25: Mystics Geometry (Pre-Redesign)
![Level 25: Mystics Geometry](file:///C:/Users/Pietro/.gemini/antigravity/brain/bdbd1da1-dc85-424f-ba46-61948d9ffebd/screen_level_25_geometry.png)

> [!WARNING]
> **Insights:** Static image of colored shapes, text input. Same issue as Levels 3 and 18.
>
> **Redesign (Approved):** Each shape becomes an interactive glowing Romani rune. Locking in a deduced value illuminates those runes and auto-updates them across all remaining equations — reducing working memory load and giving satisfying visual progress feedback.

---

### Screen 12 — Zone Transition: Forest → Desert
![Zone Transition: Forest to Desert](file:///C:/Users/Pietro/.gemini/antigravity/brain/bdbd1da1-dc85-424f-ba46-61948d9ffebd/screen_transition_desert.png)

> [!NOTE]
> **Insights:** The palette shift to warm golds and the Sphinx reveal is visually striking.
>
> **Critique:** The Sphinx immediately deploys full archaic thee/thou speech with no preamble. A brief moment in normal register before switching would make the archaic speech feel like a deliberate performative choice rather than a quirk.

---

### Screen 13 — Level 39: Egyptian Math (The Gold Standard)
![Level 39: Egyptian Math](file:///C:/Users/Pietro/.gemini/antigravity/brain/bdbd1da1-dc85-424f-ba46-61948d9ffebd/screen_level_39_egyptian_math.png)

> [!TIP]
> **Insights:** This is what Levels 3, 18, and 25 should aspire to. Hieroglyph symbols are interactive UI elements, not baked image. The math feels physically part of the world.
>
> **Minor Critique:** Touch hitboxes on hieroglyph symbols are small. On mobile, this causes accidental mis-taps. Increasing tap targets by ~8px per symbol would fix this.

---

### Screen 14 — Zone Transition: Desert → Hell
![Zone Transition: Desert to Hell](file:///C:/Users/Pietro/.gemini/antigravity/brain/bdbd1da1-dc85-424f-ba46-61948d9ffebd/screen_transition_hell.png)

> [!IMPORTANT]
> **Insights:** The violent palette shift to deep red is the best visual moment in the game. The Devil's introduction is immediately magnetic.
>
> **Critique:** The Devil doesn't appear until paragraph 7 of 8. Six paragraphs of "the ground shifts, you fall" precede him. Cut the environmental logistics to 2–3 paragraphs so his charm lands sooner and harder.

---

### Screen 15 — Level 45: Familiar Faces
![Level 45: Familiar Faces](file:///C:/Users/Pietro/.gemini/antigravity/brain/bdbd1da1-dc85-424f-ba46-61948d9ffebd/screen_level_45_familiar_faces.png)

> [!TIP]
> **Insights:** Reuniting all four zone mentors is an excellent design callback. The Guard deliberately misleads (claims the lost soul is a Russian painter; is corrected by the Butler), creating a multi-layered information puzzle.
>
> **Critique:** Players who trust the Guard first — natural, after 10 levels with him — will hit a dead end. A subtle non-verbal cue (the Butler's eyebrow raise when the Guard speaks) would reward perceptive players without explicitly flagging the misdirection.

---

### Screen 16 — Level 49: Murder Mystery
![Level 49: Murder Mystery](file:///C:/Users/Pietro/.gemini/antigravity/brain/bdbd1da1-dc85-424f-ba46-61948d9ffebd/screen_level_49_murder_mystery.png)

> [!IMPORTANT]
> **Characters:** The **Policewoman** (crime scene), **Psycho the Mortician** (morgue), the **Librarian** (library). Entirely distinct from Level 10's prison inmates.
>
> **Insights:** Three completely distinct comic registers — Policewoman (corrupt/nonchalant), Psycho (deadpan nihilist), Librarian (withering contempt) — all feel consistent with the Devil's domain.
>
> **Critique:**
> - The solution `yara-ma-yha-who` requires crossing anemia findings with a botany book and a demonology book. The final leap is large. One more breadcrumb (e.g., a faded sketch of a small red creature in the autopsy report) would bridge it.
> - An in-game **Scratchpad** toggle is strongly needed here. Players must cross-reference 4+ evidence sources simultaneously, which currently forces them off-screen to take notes.
> - The Policewoman has no name. Even a visible badge ("Officer Palencia") would add a dimension of character.

---

---

# Part II: UX Copy & Narrative Characterization Audit

---

## Main Cast — Zone Mentors

### The Skeleton Guard (Zone 1)
- **Register:** Colloquial, cockney-adjacent, mocking. *"Heh, think yer clever, do ya? That noggin o' yours know what ya did."*
- **UX Role:** Tonal calibration. His levity makes the dungeon feel escapable, not oppressive.
- **Critique:** Absent during Levels 1–9 gameplay. **Proposed fix:** Hint delivery routed through his voice in Zone 1. When a hint is clicked: *"Fine, ya stubborn mule — here's yer bone..."* rather than generic system text.

### Silas the Butler (Zone 2)
- **Register:** Clipped, aristocratic, passive-aggressive. *"One mustn't linger on the threshold — it's most dreadfully improper."*
- **UX Role:** Represents institutional/societal judgment.
- **Critique:** Absent during Levels 11–19 gameplay. **Proposed fix:** Passive-aggressive hint delivery. Wrong answer prompt: *"Incorrect. Again. Shall I arrange for a remedial tutor, sir?"*

### The Fortune Teller (Zone 3)
- **Register:** Theatrical, sensory, prophetic. *"Metal screaming against metal. Glass shattering... Blood on your hands that wasn't yours alone."*
- **UX Role:** The narrative pivot — first explicit DUI exposition.
- **Critique:** The revelation is delivered in skimmable paragraph form. **Proposed fix:** Tarot card flip mechanic for the transition — each card surfacing one memory fragment, making the player actively recall what they did.

### The Sphinx (Zone 4)
- **Register:** Archaic, grand, impersonal. *"Thou art being judged. For actions taken in the realm of the living."*
- **UX Role:** Escalates from personal guilt to cosmic judgment.
- **Critique:** Weakest characterization of the main cast — a vehicle for exposition rather than a personality. **Proposed fix:** Add a weary contempt (*"Another one. How... predictable."*) that contrasts the theatrical characters around her.

### The Devil (Hell Zone)
- **Register:** Melodious, charming, sadistic. *"Like wine and cheese." / "The crunch of bones is quite musical after a few millennia."*
- **UX Role:** The charismatic final arbiter.
- **Critique:** The Buddhist Hell dialogues in `devil-dialogue.tsx` are the finest copy in the game. No changes needed. This is the quality bar.

---

## Minor Characters & Interactive NPCs

### Caine, Ronan, Lyra & Silas — The Inmates (Level 10)
- **Best line:** Silas's *"Caine is so young... if I could tear his skin apart and wear it as my own, I would... hehe..."*
- **Critique:** Lyra's clue line *"The culprit is in this room"* reads too neutral — feels like a puzzle clue rather than a slip. Edit: *"The culprit is in this room... not that it matters."* would feel more like an accidental disclosure.

### Count Papagalul (Level 19)
- **Best line:** *"YOUR ANCESTORS WEEP AT YOUR PATHETIC ATTEMPTS!"*
- **Critique:** No responses for unexpected input categories (geography, ornithology, Romanian language). Adding 5–10 such responses would reward curious players and deepen the eccentric Transylvanian Count characterization.

### The Policewoman (Level 49)
- **Best line:** *"I managed to rescue [the donuts] before they go to waste."*
- **Critique:** Has no name. Give her a badge with a name on it. The donut scene is otherwise perfect — no other changes needed.

### Psycho the Mortician (Level 49)
- **Best line:** *"I enjoy the company. They're not demanding conversationalists."*
- **Critique:** The mechanic of pestering him with "unconditional love and friendship" until he relents is the best character-as-mechanic moment in the game. No changes needed. Use this as a template for how NPC personalities should gate puzzle content.

### The Librarian (Level 49)
- **Best line:** *"Looking for creative ways to get high huh? Just leave the frogs alone."*
- **Critique:** No arc. She is identical at the start and end of the interaction. One post-discovery line (after the player has read the critical books) that acknowledges they might be onto something would provide a tiny moment of earned connection.
