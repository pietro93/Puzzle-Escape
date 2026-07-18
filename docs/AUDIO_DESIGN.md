# 🔊 Audio Design & Sourcing Guide

Detailed companion to `docs/ART_AUDIO.md` (which stays the short style-guide summary). This
document is written for actually building the soundscape: what to source, why it exists, how
it triggers in-game, and where to look for it. It assumes open-source/CC-licensed sourcing
from sites like OpenGameArt.org and Freesound.org, not commissioned original work.

Ground truth on what code already exists: `hooks/use-audio.tsx` hardcodes 5 file paths
(`/audio/ambient-mystery.mp3`, `correct.mp3`, `wrong.mp3`, `button-click.mp3`,
`transition.mp3`) that don't exist yet — dropping real files there requires zero code changes.
Everything else below is new scope.

---

## Design Pillars

1. **Minimalism over spectacle.** The visual language is glassmorphism — translucent, quiet,
   dark. Audio should match: low-frequency ambient beds, short/dry SFX, no bombastic
   orchestral stings. A puzzle game played in short sessions (phone, Steam Deck) shouldn't
   fatigue the ear.
2. **Zone identity through timbre, not volume.** Each of the 5 zones (Prison, Mansion, Forest,
   Desert, Hell) should be recognizable blind, from instrumentation alone — cello vs.
   harpsichord vs. woodwind vs. sitar vs. industrial drone. Keep BGM low in the mix (roughly
   -24 to -18 LUFS) so it never competes with SFX or the player's own reading pace.
3. **Diegetic first.** Where a puzzle has an in-fiction sound (a torch igniting, a lock
   clunking, a parrot singing), that sound should exist and do narrative work, not just be
   generic "success ding #4." This is what separates a designed soundscape from a stock SFX
   pack slapped on top.
4. **Every SFX is a confirmation, never a surprise.** Because puzzles are deduction aids with
   the answer typed separately (see `docs/ARCHITECTURE.md`), sound should reinforce "you did
   something," not gate progress. Nothing should be so jarring it startles a player who is
   trying to think.
5. **Silence is allowed.** Not every micro-interaction needs a sound. Over-scoring a puzzle
   game turns "click" into aural wallpaper the player tunes out — reserve distinct sounds for
   distinct meanings (correct vs. wrong vs. neutral click) rather than one sound for everything.

---

## Licensing Note (read before downloading anything)

This is a commercial release (Steam + mobile IAP per `docs/MONETIZATION_STRATEGY.md`), so:

- **Prefer CC0 ("public domain")** assets — no attribution required, no legal ambiguity.
- **CC-BY is fine** but requires a credits entry — keep a running `CREDITS_AUDIO.md` (author,
  asset name, source URL, license) as you download things, since OpenGameArt listings can go
  stale/be removed later and you'll want the record.
- **Avoid CC-BY-NC and CC-BY-ND** — non-commercial and no-derivatives licenses are legally
  incompatible with a paid/IAP release and with pitch-shifting or looping a clip.
- On OpenGameArt, filter by license in the sidebar before browsing — it saves re-checking each
  file individually.
- Target format: 44.1kHz. Ship as compressed `.mp3` or `.ogg` for BGM (loops, 30s-2min) and
  short `.mp3`/`.wav` for one-shot SFX (<2s mostly). Convert on download if the source is
  `.flac`/`.aiff` — `ffmpeg -i in.wav -q:a 4 out.mp3` is enough, no need for anything fancier.

---

## Layer 1 — Global UI / Feedback SFX (already wired, highest priority)

These map 1:1 to the dead paths in `hooks/use-audio.tsx`. This is the "free win" — the code
already calls them on every answer check, button press, and level transition.

### `correct.mp3` — Success chime
- **Rationale:** The single most-heard sound in the game (fires on every correct answer across
  50 levels). Needs to feel rewarding without being cartoonish — this is a moody escape-room,
  not a mobile match-3 game.
- **In-game use:** Fires in `checkAnswer` (`game-screen.tsx`) the instant a typed answer
  matches. One-shot, ~0.5-1.5s, no loop.
- **Source options (search terms):**
  1. "magic chime" / "success bell" — a single bell/glass tone with soft reverb tail.
  2. "puzzle solved" / "correct answer ding" — purpose-made UI-pack success sounds (common in
     OpenGameArt's "UI SFX" collections).
  3. "harp glissando short" — a quick upward harp run reads as "reveal/unlock" rather than
     "gamey," which fits the Victorian/gothic tone better than an electronic ding.

### `wrong.mp3` — Error tone
- **Rationale:** Must read as "try again," not "game over" or punishing — per the design
  pillars, no jarring surprise. `docs/ART_AUDIO.md` specifies "dampened wood knock or low
  click" — intentionally soft, not a buzzer.
- **In-game use:** Fires on incorrect answer submission in the same `checkAnswer` path.
- **Source options:**
  1. "wood knock muted" / "soft thud" — a single dull knock, no metallic ring.
  2. "negative buzz short" from a UI SFX pack, pitched down/low-passed to soften it if the
     stock version is too harsh.
  3. "book close" / "door latch" — a mundane household/mansion-appropriate negative cue that
     doubles as thematically consistent across all 5 zones.

### `button-click.mp3` — UI interaction click
- **Rationale:** Generic confirm click for menu buttons, toggles, drag-pickup/drop. Needs to be
  the least noticeable sound in the game since it fires most often — should disappear into the
  background of play.
- **In-game use:** Any generic button/toggle press outside the correct/wrong/transition cases.
- **Source options:**
  1. "UI click soft" / "menu select minimal" — most UI SFX packs on OpenGameArt have a
     dedicated minimal click.
  2. "mechanical switch click" — slightly more tactile, fits Level 17's physical light
     switches and Level 3's lock mechanism if you want a shared texture.
  3. Record/derive from the `wood knock` (wrong.mp3) candidate above but pitched up and
     shortened — cheap way to keep the palette of "physical, wooden, tactile" sounds coherent
     across correct/wrong/click without sourcing three unrelated packs.

### `transition.mp3` — Level/zone transition whoosh
- **Rationale:** Marks the interstitial "Transition System" (`docs/KANBAN.md` confirms this
  screen exists) between levels/zones — gives a sense of movement/pacing between puzzles.
- **In-game use:** Plays when the interstitial transition screen mounts.
- **Source options:**
  1. "page turn" / "book flip" — thematically ties to the "book/scroll" framing already used
     in Level 20's archive and Level 16's bookshelf; reads as "moving to the next chapter."
  2. "whoosh soft riser" — a generic ambient swell, safe generic choice if page-turn doesn't
     fit a given zone.
  3. "door creak open" — heavier, more atmospheric option if you want transitions to feel like
     physically walking between rooms of the mansion/prison rather than a UI wipe.

### `ambient-mystery.mp3` — placeholder BGM (superseded by Layer 2 zone tracks)
- **Rationale:** Currently the single fallback background loop. Once zone-specific tracks
  exist (Layer 2), this becomes the main-menu/title loop instead of in-level BGM.
- **Source options:** see Layer 2, "Prison Cell" entry — reuse that track here at launch, split
  later once you have all 5 zone tracks sourced.

---

## Layer 2 — Zone Ambient Music (BGM)

Five looping beds, one per zone, crossfading at zone boundaries. This is the most
labor-intensive layer to source well because it needs to loop cleanly (no audible seam) and
sit under gameplay without being distracting over a 30-60 minute zone playthrough.

| Zone | Levels | Search terms (2-3 each) | Rationale |
|---|---|---|---|
| **Prison Cell** | 1-10 | "dungeon ambience loop", "dark cave drone", "prison atmosphere cello" | Claustrophobic, wet stone, isolation. Water-drop foley layered under a sustained low cello/drone reads as "trapped" without needing melody. |
| **Mansion** | 11-20 | "harpsichord melancholy loop", "victorian ambience", "music box minor key" | The only zone that should have an actual *melody* — everywhere else is texture/drone. A detuned/slightly-off harpsichord signals "something is wrong in this beautiful house" better than a clean piano would. |
| **Forest** | 21-30 | "mystic forest ambience", "wind chimes loop", "ethereal pad forest night" | Gypsy/fortune-telling zone — should feel open and airy vs. the claustrophobic prison, night-forest ambience (crickets, soft wind) with chimes as the "magic" signifier. |
| **Desert** | 31-40 | "desert wind drone", "sitar ambient loop", "arabian ambience minor" | Wide, dry, echoing. Avoid anything with a strong rhythmic pulse — this zone is about scale/emptiness, not urgency. |
| **Hell** | 41-50 | "industrial drone dark", "hellish ambience fire", "distorted metal drone" | The only zone allowed to be genuinely unpleasant/tense, since it's the climax. Gear-grinding + fire crackle + sub-bass drone; still loopable, still under the SFX in the mix. |

**Implementation note:** Since `hooks/use-audio.tsx` uses plain `HTMLAudioElement` (no
crossfade support today), a zone swap needs either (a) a manual two-`<audio>`-element crossfade
(fade one out/one in over ~1-2s), or (b) upgrading to Howler.js, which has crossfade/sprite
support built in — worth it once you're managing 5+ loops plus SFX rather than 5 flat sounds.

---

## Layer 3 — Puzzle-Specific Diegetic SFX

Sounds tied to a specific mechanic, not generic UI. These are what make individual levels feel
designed rather than skinned. Prioritized by how load-bearing the sound is to the puzzle's
"aha" moment (parrot and torch are narrative payoffs; lock/slots are just tactile feedback).

### Level 19 — Count Papagalul (parrot) — **highest narrative value**
- **Rationale:** Per `docs/LEVEL_DESIGN.md`, this puzzle's reveal is a lyric fragment that
  points to the band. The *text* carries the actual clue — audio's job is only to sell "the
  parrot is vocalizing something," so the sound must not perform a recognizable melody. Even a
  self-recorded, MIDI, or AI-generated recreation of an actual song's melody is still an
  infringement of the composition copyright regardless of who/what performed it — re-creating
  a tune by other means doesn't clear it. The safe design target is a **non-melodic, filtered/
  robotic vocalization** — texture, not a tune.
- **Source options:** (1) "vocoder garble" / "robot parrot squawk" — a scratchy, semi-musical,
  non-melodic filtered vocal, (2) "talking bird processed vocal" foley pitched/filtered to feel
  robotic rather than naturalistic, (3) a generic "parrot squawk talking" foley with no
  filtering at all as a fallback if the vocoder-style options don't fit — plain and safe, just
  less thematically pointed.
- **Ducking:** this is a **Tier B focal moment** (see "BGM Ducking Map" below) — the zone
  ambient bed should duck deep and hold for the vocalization's duration, not just get the light
  systemic dialogue duck.

### Level 33 — Arabic Fire Torch — **reinforces time pressure**
- **Rationale:** Torches "only stay burning for a few seconds" — a fading crackle sound gives
  the player an *audio* countdown to complement the visual fade, which matters because they're
  reading Arabic text under time pressure and may not be watching the flame itself.
- **Source options:** (1) "torch ignite whoosh" for the light-up moment, (2) "fire crackle loop
  short" that you fade out in step with the visual dim, (3) "match strike" as an alternative
  ignition sound if the whoosh reads too large for a hand torch.

### Level 3 — Lock & Key Math
- **Rationale:** Already spec'd in `docs/LEVEL_DESIGN.md` itself ("plays a satisfying
  mechanical clunk") — the design doc is asking for this, not me inferring it.
- **Source options:** (1) "lock click mechanism", (2) "heavy latch clunk", (3) "vault door
  bolt" for a heavier/more satisfying version if the first two feel too thin.

### Level 6 — Shackles the Dog
- **Rationale:** `docs/ART_AUDIO.md` already calls out "bone clattering" as a directive. Needs
  two states: accept (chomp/happy) and reject (whimper/spit).
- **Source options:** (1) "dog growl bone chew" + "dog whine" pair, (2) "bone rattle" foley for
  a more skeletal/less literal-dog take (fits the prison's skeleton aesthetic better than a
  realistic dog bark would), (3) "wolf snarl short" if you want Shackles to read as more
  spectral/threatening than a friendly pet.

### Level 46 — Casino Slots
- **Rationale:** Slot machines are one of the few universally-recognized sound signatures in
  games — leaning into the real-world reference (whir + mechanical stop-clunk) does a lot of
  work with almost no risk of misreading.
- **Source options:** (1) "slot machine spin" / "slot reel stop", (2) "mechanical ratchet loop"
  + "clunk stop" as separable layers if you can't find a combined slot-specific asset, (3) dice
  roll: "dice roll table" / "dice clatter" for the accompanying dice mechanic.

### Level 47 — Binary Switch Brain
- **Rationale:** LEVEL_DESIGN.md already specifies a *visual* intensity ramp (bulb glows
  brighter as correctness increases) — pairing it with an audio buzz that also intensifies
  reinforces the same feedback through two channels, useful since this is one of the more
  abstract/technical puzzles in the game.
- **Source options:** (1) "electric buzz loop" (pitch/volume-scale it programmatically as
  correctness increases rather than sourcing multiple stages), (2) "spark zap short" for
  individual switch toggles, (3) "tesla coil hum" for a more sinister Hell-zone-appropriate
  variant.

### Level 48 — Mouth of Truth Marbles
- **Source options:** (1) "stone grinding heavy" for the mouth opening, (2) "marble drop
  clatter" / "glass marbles rolling" for placement, (3) "stone door open" as an alternative if
  the grinding sound reads too subtle.

### Level 36 — Pyramid Hanoi Workshop
- **Source options:** (1) "stone block drag", (2) "wood block place thud", (3) "sandstone
  scrape" — pick whichever best matches whatever texture the 3D/2D asset for the blocks
  actually uses, so the sound matches the visual material.

### Level 42 — Apocalypse Knight Tour
- **Source options:** (1) "chess piece move click" (there are several dedicated "chess click"
  assets on OpenGameArt from board-game asset packs), (2) "bell toll single" for each seal
  triggered in correct order, (3) "ominous horn" as a heavier alternative to the bell for the
  Hell-zone chess variant.

### Level 9 — Morse Code (accessibility bonus)
- **Rationale:** Currently purely visual (dots/dashes on a wooden plate). An optional
  beep-tone playback isn't just polish — it's an accessibility win for players who parse rhythm
  better than visual pattern-matching, and it's mechanically trivial (a single repeating
  beep-tone sample, no zone-specific sourcing needed).
- **Source options:** (1) "morse beep tone" (several exist pre-made), (2) synthesize it
  yourself — a single sine-wave beep is one of the easiest sounds to generate rather than
  source, if nothing pre-made fits the pitch you want.

### Lower priority (nice-to-have, low narrative weight)
- **L17 Pitch Dark Switches:** "switch flip click" + "electrical hum low" for compass
  alignment.
- **L22 Tasseography Coffee:** "ceramic cup clink" / "cup rotate scrape."
- **L38 Vigenère Sands Cipher:** "sand shift" / "writing scratch" as the cipher resolves.
- **L29 Sign Language GIF:** skip — silent is fine, this is a looping GIF with no interaction
  to hook a sound to.

---

## Layer 4 — Character Dialogue Blips

Per `docs/ART_AUDIO.md` §3 and the character voice rules in
`.continue/rules/04_dialogues-and-characters.md`, this is groundwork for eventual VO without
actually recording lines — a short "text is being spoken" blip per character, similar to
Animal Crossing/Undertale-style text-blip audio.

- **Rationale:** Cheap (one ~0.1s sample per character, pitched/played per character or per
  letter-reveal) but disproportionately raises perceived production value on every dialogue
  interaction across all 50 levels — this is the single best value-for-effort addition after
  Layer 1.
- **In-game use:** Hooks into `useCharacterDialogue()` (`utils/dialogue-utils.ts`) and
  `level-intro-scene.tsx`'s click-through text — plays once per line-reveal or loops rapidly
  during a typewriter-effect reveal if one exists.
- **Source options per character** (search generic "blip"/"talk sfx" packs and pitch-shift one
  base sample per character rather than sourcing 5 unrelated assets — keeps the palette
  coherent):
  1. **Skeleton Guard** — low-pitched "bone clack" or growl-blip (ties back to the existing
     "bone clattering" directive in `ART_AUDIO.md`).
  2. **Butler** — a crisp, higher, "proper" blip — a plucked string or short xylophone tick
     reads as prim/formal.
  3. **Gypsy Teller / Sphinx / Devil** — chime-blip (forest, mystical), sand/stone tick
     (desert), and a deeper distorted rasp-blip (hell), respectively — same base "blip" sound
     pitched and filtered differently per zone rather than 5 separate sourcing efforts.

---

## Layer 4a — BGM Ducking Map

Rule of thumb: any time a diegetic performance or dialogue moment is the focal point, the zone
ambient bed should duck under it rather than either playing at full volume (masks the moment,
makes it feel unimportant) or hard-cutting to silence (reads as broken/jarring, like the game
glitched). Duck in → hold low for the moment → fade the bed back up once the line finishes.
This needs a documented map rather than a single call-site, because it isn't one hook — it's
two systemic dialogue sources (per `docs/ARCHITECTURE.md`) plus a handful of one-off puzzle
moments, and each tier gets a different depth/duration.

### Tier A — Systemic duck (applies to every occurrence, all 50 levels)
Light, quick, cheap — because these fire constantly and must never fatigue the ear:
- **Level intro scenes** (`data/level-intro-scenes.ts` → rendered by
  `components/level-intro-scene.tsx`) — the once-per-level click-through scene shown before
  the puzzle UI mounts. Duck the bed for the scene's full on-screen duration.
- **Portrait-click mentor dialogue** (`utils/dialogue-utils.ts`'s `levelDialogue` via
  `useCharacterDialogue()`, triggered through `character-location-display.tsx`'s
  `onGuardClick`) — fires every time the player clicks a mentor portrait, across every level.
- **Depth/timing:** -4 to -6dB, ~200ms fade in/out. Shallow enough that back-to-back portrait
  clicks (a player spamming the mentor for flavor lines) don't cause audible pumping.

### Tier B — Focal-moment deep duck (specific, high-stakes beats only)
Deeper and held — reserved for moments where the dialogue/performance *is* the puzzle's
mechanic or payoff, not incidental flavor text. Depth/timing: -8 to -12dB, ~300-500ms fade,
held through the full line rather than per-sentence:

| Level | Moment | Why it's Tier B, not Tier A |
|---|---|---|
| **L10 — Whodunit?** | Each of the four inmates' (Caine, Ronan, Lyra, Silas) statements | Solvability hinges on the player parsing and comparing four competing testimonies precisely — this is the one dialogue-heavy level where mishearing/half-attending to a line has a mechanical cost, not just a narrative one. |
| **L19 — Count Papagalul** | The parrot's vocalization (see Layer 3 above) | The audio *is* the puzzle's reveal moment, not narration around it. |
| **L38 — Vigenère Sands Cipher** | The Sphinx's riddle ("what has a bed, a mouth, and banks?") that hands over the cipher key `RIVER` | Structurally a single load-bearing riddle-utterance the player needs, closer to an oracle pronouncement than routine mentor flavor text — treat it like a story beat, not a portrait blip. |
| **L45 — Familiar Faces** | Each ghostly projection's (Skeleton Guard/Butler/Gypsy/Sphinx echoes) testimony | This level's core mechanic *is* an extended multi-character dialogue-gathering scene — the whole level is built out of what would elsewhere be Tier A moments, so it should read as one sustained Tier B scene rather than four quick Tier A dips. |
| **L50 — Final Confrontation** | The climactic riddle reveal and the Hell/Heaven/Neither branch choice | The game's single ending moment — duck should hold through the reveal and stay down into whichever ending stinger plays (see Layer 5), rather than fading back up and then re-ducking for the stinger. |

Everything else in the 50-level roster uses Tier A by default — no level-by-level enumeration
needed beyond this table, since Tier A is a property of the two dialogue *systems*, not of
individual levels.

---

## Layer 5 — Menu / Meta Screens

- **Main menu ambient loop:** distinct from in-level BGM — a neutral/title-card version, or
  reuse the Prison Cell track pre-echoed/filtered since that's the game's opening zone.
  Search: "title screen ambience", "mysterious intro loop."
- **Level-select / map screen ambience:** soft, non-looping-fatigue background under longer
  browsing sessions. Search: "soft pad ambience minimal."
- **Save/load confirmation blip:** reuse `button-click.mp3` unless you want a distinct
  "save chime" — search "save game sound", "chime confirm."
- **Level 50 ending stingers — 3 distinct musical stings**, since the finale branches into
  "Hell" / "Heaven" / "Neither" per `docs/LEVEL_DESIGN.md`. This is the game's single climactic
  moment and deserves the most deliberate sourcing in the whole project. Per the Tier B ducking
  rule (Layer 4a), the zone bed should already be held low from the riddle reveal going into
  whichever stinger plays below — don't fade the bed back up between the reveal and the sting,
  or the two moments will feel disconnected:
  1. **Hell ending:** "dark ending sting", "doom fanfare" — heavy, low, unresolved.
  2. **Heaven ending:** "triumphant choir sting", "bright resolve chord" — the emotional
     opposite of the Hell sting, ideally sharing no instrumentation with it at all.
  3. **Neither ending:** "ambiguous ending tone", "bittersweet resolve" — deliberately
     unresolved chord (e.g., a suspended or minor-add9) so it reads as neither victory nor
     defeat.

---

## Layer 6 — Accessibility / Settings

Not sourced audio, but scope worth flagging alongside it since it changes how everything above
gets implemented:

- Master / Music / SFX volume — 3 independent sliders (standard for Steam readiness per
  `docs/PROJECT_AUDIT.md`).
- Mute toggle persisted through the same save mechanism as game state (`localStorage` /
  filesystem).
- A "reduce audio pulsing" toggle for L17 (switches) and L47 (buzz intensity ramp) specifically,
  since those two use audio that scales/repeats rapidly.

---

## Suggested Sourcing Order

If working through OpenGameArt/Freesound session by session, this order front-loads the
highest-impact, lowest-effort wins:

1. Layer 1 (5 files) — unlocks sound game-wide with zero code changes.
2. Level 19 parrot clip + Level 3 lock clunk + Level 6 bone/growl pair — the three
   most narrative-load-bearing diegetic sounds.
3. Layer 2 zone BGM (5 tracks) — biggest atmosphere lift, but time-consuming to find clean
   loops; budget the most search time here.
4. Layer 4 dialogue blips (5 short samples, one base sound pitch-varied) — disproportionate
   polish-per-minute-spent.
5. Remaining Layer 3 diegetic SFX, roughly in the priority order listed above.
6. Layer 5 menu/meta sounds + Level 50 ending stingers — save the endings for last since
   they're worth getting exactly right rather than sourcing under time pressure.
