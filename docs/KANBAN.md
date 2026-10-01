# 📋 Launch Kanban

What's left before **Puzzle Escape** ships on Steam. Last updated **2026-09-30**.

- **Live test build:** https://puzzle-escape.pages.dev (Cloudflare Pages). The old Vercel URLs are stale: `riddle-escape-pietro93s-projects-e29beb16.vercel.app` serves a 2025 build and `riddleescape.vercel.app` (still the GitHub repo homepage) returns 404.
- **Visual version of this board:** published as a claude.ai artifact ("Launch Board"); this file is the source of truth.

Legend: 🔴 blocks launch · 🟠 should fix before launch · 🟢 nice to have / post-launch

---

## 🚧 To do

### Tech & platform
| | Item | Notes |
|---|---|---|
| 🔴 | **Download the 81 externally hosted images** | Zodiac (L27), casino (L46), fire map (L41), tarot (L30), scarab (L32), pillars (L37), `puzzle-content.tsx`, `transition-screen.tsx` load from `hebbkx1anhila5yf.public.blob.vercel-storage.com`. Breaks offline/Steam play, and that storage is tied to the Vercel account we moved away from. List: `EXTERNAL_DEPENDENCIES_DOWNLOAD_LIST.md`. |
| 🔴 | **Missing pixel font** | `globals.css` loads `/fonts/pixel.woff2`, which doesn't exist. Every `font-pixel` text falls back to plain monospace. |
| 🔴 | **Steam integration is a stub** | `steam/steam_api.ts` only logs to the console; no Steamworks library installed, achievements never reach Steam. Also needs App ID and depot setup. |
| 🔴 | **Windows build never tested** | `npm run electron:make` exists but has never been run to a finished installer. Install on a clean machine and play start to finish. |
| 🔴 | **Audio: none in the game** | Zero audio files in `public/`, though code already calls `/audio/correct.mp3` etc. Plan in `docs/AUDIO_DESIGN.md`. |
| 🔴 | **L49 runtime error** | `murder-mystery-puzzle.tsx:214` calls `dialogue.setCurrentDialogueOptions`, which doesn't exist. Fires 100ms after the mortician's "let me see the body" option; the "check body" option may not refresh. |
| 🟠 | **Save data on desktop** | Electron writes save files via IPC, but `localStorage` is still used in `use-storage`, `use-achievements`, `library-puzzle`, `family-tree-scroll`. Verify nothing is lost on a cache wipe. |
| 🟠 | **122 hidden TypeScript errors** | `next.config.mjs` has `ignoreBuildErrors: true`. Most are harmless; some are real prop mismatches (`game-container*.tsx`). Triage for bugs. |
| 🟠 | **Solvability tests** | No tests at all. Minimum: check every level's solution string is accepted, so no level can block progress. |
| 🟠 | **L43 font loads from Google** | `damned-souls-puzzle.tsx` pulls UnifrakturCook from Google Fonts via `next/head` (doesn't work in the app router). A local copy is already in `public/fonts`. |
| 🟠 | **L47 lamp art is 37MB** | `xbrainlampa1-6.webp` are animated WebPs; the first alone is 12.2MB. Compress. |
| 🟠 | **Missing transition images** | `MISSING_IMAGES_REPORT.md` lists `desert-transition.png`, `hell-transition.png`, `forest.webp`. Verify. |
| 🟠 | **Revert temp trailer config** | `next.config.mjs` still has the "TEMP (trailer capture)" webpack watch override. |
| 🟢 | **Repo cleanup** | Root has `step*.png`, `level*-check.png`, `splash*.png`, `.playwright-mcp/`, `.tmp-trailer-shots/`. `.github/workflows/deploy.yml` is a dead GitHub Pages workflow (publishes `./www`, build outputs `./out`). Update the GitHub repo homepage to the Pages URL. |

### Content & level design
| | Item | Notes |
|---|---|---|
| 🔴 | **Full playthrough, all 50 levels** | 0/50 levels reviewed. A level that can't be finished is the biggest refund risk inside Steam's 2-hour window. |
| 🔴 | **L20 Mansion Gallery** | 6/8 items wired. See `docs/level-15-mansion-redesign.md`. |
| 🔴 | **L12 Bookshelf** | Geometry update to the new 906×1286 shelf art still pending. |
| 🟠 | **Redesign the "Who are you?" opening screen** | `player-gender-screen.tsx`, the first thing a new player sees. It only asks gender (Male / Female / Other), which reads like Pokémon's "Are you a boy or a girl?". Needs a redesign so the question feels like part of the game, not a form. |
| 🟠 | **L35 Sands Mirage** | Just a desert background and a one-word riddle ("mirage"). Weakest level; needs a real puzzle. |
| 🟠 | **L16 Silverware Math** | Still a static image. Approved redesign: interactive table setting, math tuned slightly harder. |
| 🟠 | **Family plotline** | Wife/daughter plot not written yet (player-gender tokens are ready). |
| 🟠 | **"Unfun" review** | Candidates: L31 (needs a hieroglyph dictionary), L23 (outside zodiac lookup), L38 (Vigenère by hand), L29 (GIF + text box). |
| 🟢 | **Tarot-flip transition** | Mansion → Forest reveal is a skippable paragraph; proposed card-flip mechanic. |
| 🟢 | **Mentor voice in hints** | Proposed: hints/wrong-answer text in the Skeleton's and Butler's voice. |
| 🟢 | **Sphinx personality pass** | Weakest-characterized mentor. |
| 🟢 | **Colorblind support** | L15 Color Palette. |
| 🟢 | **Jigsaw fatigue** | Four jigsaw levels (L11, L24, L34, L44). |
| 🟢 | **Localization** | Dialogue blocks not set up for translation. |

### Store & release
| | Item | Notes |
|---|---|---|
| 🔴 | **Steam store page** | Capsule art, screenshots, description, trailer (capture in progress). |
| 🟠 | **Business model for Steam** | `MONETIZATION_STRATEGY.md` assumes IAP/ads; confirm what applies on Steam. |
| 🟠 | **Host privacy policy & ToS** | Files exist in the repo root (`privacy-policy.md`, `terms-of-service.md`). |
| 🟢 | **Minigames mode** | 4 approved, 1 open question, nothing built. Post-launch. |

---

## ✅ Done this week (2026-09-29 → 30)
- **L2 Bone Counting redesign:** sort bones onto matching skulls with tally marks; answer box unlocks once sorted; per-skull glow/shake on a wrong answer; hidden optional "give rust bones to the Guard" interaction with lines per colour; touch dragging works.
- **Talking + breathing portraits** for every talking human character: the 5 mentors, the L10 inmates, the L45 lineup, the L49 policewoman/mortician/librarian.
- **Small animations:** L3 lock clack, L5 dial settle, L9 rat hop-wiggle, L13 jar clack/pop, L15 paint pop on a correct value, L22 cup spin inertia, L32 scarab hop, L41 route wipe + glow, L43 chest rattle/pop/thud, L47 switch squash, L48 face shake on a wrong guess.
- **L43 progression bug fixed:** opening the big chest now counts toward unlocking the answer.
- **Docs:** the Butler is unnamed (removed "Silas the Butler"; Silas is an L10 inmate).

---

## 🎮 Level tracker (1–50)
Status: ✅ built · 🆕 reworked this week · 🛠️ needs work · ⚠️ tech issue · 🤔 review whether it's fun. **None reviewed in a full playthrough yet.**

### 💀 Zone 1: Prison Cell
| # | Level | Status | Notes |
|---|---|---|---|
| 1 | The Secret Message | ✅ | |
| 2 | Bone Counting | 🆕 | Sort-to-skull redesign |
| 3 | Lock & Key Math | ✅ | Lock clack added |
| 4 | Ominous Scratchings | ✅ | |
| 5 | Like Clockwork | ✅ | Dial settle added |
| 6 | Shackles the Dog | ✅ | |
| 7 | Word Ladder | ✅ | |
| 8 | Magic Box Rebus | ✅ | |
| 9 | Morse Code | ✅ | Rat hop-wiggle added |
| 10 | Whodunit? | ✅ | Inmates talk + breathe |

### 🤵 Zone 2: The Mansion
| # | Level | Status | Notes |
|---|---|---|---|
| 11 | Curious Jigsaw | ✅ | |
| 12 | Third Eye Readings (bookshelf) | 🛠️ | New shelf geometry pending |
| 13 | Anagram Spice | ✅ | Jar clack/pop added |
| 14 | Clock Roman Numerals | ✅ | |
| 15 | Color Palette GPS | ✅ | Paint pop added; colorblind support wanted |
| 16 | Silverware Math | 🛠️ | Static image; redesign approved |
| 17 | Pitch Dark Switches | ✅ | |
| 18 | Count Papagalul | ✅ | |
| 19 | Mansion Genealogy | ✅ | |
| 20 | The Mansion Gallery | 🛠️ | 6/8 items wired |

### 🔮 Zone 3: The Forest
| # | Level | Status | Notes |
|---|---|---|---|
| 21 | Essence Questionnaire | ✅ | |
| 22 | Tasseography Coffee | ✅ | Cup spin inertia added |
| 23 | Crystal Ball Zodiac | 🤔 | Needs outside lookup |
| 24 | Gem Mosaic | ✅ | |
| 25 | Mystics Geometry | ✅ | |
| 26 | Star Constellation | ✅ | |
| 27 | Zodiac Seasons | ⚠️ | External images |
| 28 | Crystal Sequence | ✅ | |
| 29 | Sign Language GIF | 🤔 | GIF + text box |
| 30 | Major Arcana Tarot | ⚠️ | External images |

### 🏜️ Zone 4: The Desert
| # | Level | Status | Notes |
|---|---|---|---|
| 31 | Hieroglyphic Tablet | 🤔 | Needs a hieroglyph dictionary |
| 32 | Golden Scarab Path | ⚠️ | External images; scarab hop added |
| 33 | Arabic Fire Torch | ✅ | |
| 34 | Crocodile Sobek | ✅ | |
| 35 | Sands Mirage | 🛠️ | Placeholder-quality riddle |
| 36 | Pyramid Hanoi Workshop | ✅ | |
| 37 | Pillars Deities Chronology | ⚠️ | External images |
| 38 | Vigenère Sands Cipher | 🤔 | Manual cipher work |
| 39 | Mathematical Papyri | ✅ | |
| 40 | Pyramid Chambers | ✅ | |

### 😈 Zone 5: Hell
| # | Level | Status | Notes |
|---|---|---|---|
| 41 | Asia Fire Map | ⚠️ | External images; route wipe added |
| 42 | Apocalypse Knight Tour | ✅ | |
| 43 | Damned Cages Math | ⚠️ | Font from Google; chest bug fixed, animations added |
| 44 | Bosch Hell Jigsaw | ✅ | |
| 45 | Familiar Faces | ✅ | Mentors talk + breathe |
| 46 | Casino Slots | ⚠️ | External images |
| 47 | Binary Switch Brain | ⚠️ | 37MB lamp art; switch squash added |
| 48 | Mouth of Truth | ✅ | Face shake added |
| 49 | Murder Mystery Botany | ⚠️ | Runtime error (see above); characters talk |
| 50 | Final Confrontation | ✅ | |
