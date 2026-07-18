# 📝 Text, Narrative & Character Dialogue Audit

A full pass over every piece of player-facing text in the game — level dialogue, transitions, level-intro scenes, puzzle questions/hints, book lore, and the murder mystery NPC trees — checked against `docs/NARRATIVE_DESIGN.md` §1 (dialogue styling rules) and the character voices defined in `docs/NARRATIVE_DESIGN.md` §2 / `.continue/rules/04_dialogues-and-characters.md`.

Files covered: `utils/dialogue-utils.ts`, `components/devil-dialogue.tsx`, `components/murder-mystery/dialogue-data.ts`, `data/transitions.ts`, `data/level-intro-scenes.ts`, `data/puzzles-1.ts` – `puzzles-5.ts`, `data/family-tree.ts`, `components/character-dialogue-popup.tsx`, `components/mansion-map-puzzle.tsx`, `components/painting-inspector.tsx`.

**Status key:** ✅ Fixed already · 📋 Documented, deferred (voice-only, no code change yet) · ⚠️ Open, worth a future pass · ✔️ Reviewed, not a real issue.

---

## 1. Resolved from a prior audit pass

**Level 20 book prose (generic/moralizing AI-slop).** A previous pass flagged the `puzzles-2.ts` Level 20 library books for generic ChatGPT-style filler (cliché openers, tacked-on moralizing endings). Re-read in full for this audit: **the prose has since been rewritten and is now specific, atmospheric, and clue-dense** (e.g. *"They called her the Uncrowned, and the name outlived her by centuries..."*). No recurrence of that pattern anywhere else in the project — grepped project-wide for "serves as a reminder," "teaches us," "throughout the ages," "stands as a testament," etc.; zero hits.

**Level 20 "Lady Niamh the Accursed" solution.** Re-verified against `data/family-tree.ts`: internally consistent (the answer is the unnamed "scribbled" great-granddaughter of the tree's earlier Niamh — same first name, never crowned, hence "Lady" not "Queen"). Not a bug.

---

## 2. Reviewed and accepted (not violations)

Two lines were initially flagged for banned punctuation but are **intentional and staying as-is**:

- `data/puzzles-5.ts:99` — *"...dozens of switches connected to what appears to be a human brain... still attached to its head."* The ellipsis reads as a deliberate beat of dread/suspense in the reveal, not filler. Kept.
- `data/level-intro-scenes.ts:27` — *"The guard says nothing — he just watches you read it."* Third-person narration (not a character quote), and the em dash reads fine here. Kept as-is; open to a rewrite later if a better phrasing comes up, but not a priority.

The stylistic rule against ellipses/em dashes in `docs/NARRATIVE_DESIGN.md` §1 is aimed at *spoken character dialogue* — both lines above sit outside that scope (narration, or a single sanctioned suspense beat), so this doc treats them as exceptions rather than debt.

---

## 3. Documented now, code addressed later

These are real voice inconsistencies but are **out of scope for this pass** — logged here so future dialogue work for these three characters starts from a clear brief instead of re-discovering the same gaps.

### 📋 The Devil — `components/devil-dialogue.tsx` (hell-tour descriptions)
This file's 17 lines are written in a different register than the Devil's other appearances: no `MINE`/`ETERNITY`/`FUN`-style capitalized emphasis, multi-sentence paragraphs instead of the short single-line convention used everywhere else, and the heaviest ellipsis density in the game (nearly every line: *"...priceless,"* *"a certain... harmony,"* *"...thorough,"* the default case alone has two). Bring this file's voice in line with `dialogue-utils.ts`'s Devil lines and `data/transitions.ts`'s Devil intro when it's next touched.

### 📋 Gypsy Teller — Level 29 stub (`utils/dialogue-utils.ts:319`)
The entire level-29 dialogue array is `["..."]` — identical to the code's own fallback default for a missing character/level entry, so there's no way to tell from the output whether this was a deliberate silent beat or simply never written. `data/level-intro-scenes.ts:154` does frame level 29 as an intentional silence (*"The gypsy woman goes quiet"* — it's the sign-language puzzle), so the *idea* is sound. When this gets addressed, replace the literal `"..."` with something that still carries her voice non-verbally (a gesture description, a wordless *"Heh"*, a Romani exclamation) rather than the bare ellipsis placeholder.

### 📋 The Sphinx — per-level dialogue lacks her signature diction
Her defined voice (`docs/NARRATIVE_DESIGN.md`) is archaic/classical: `"thou art," "thy ka."` This is used correctly in her one transition scene (`data/transitions.ts:85-101`: *"Thou art being judged," "thy journey"*), but **none** of her 40 per-level barks (`dialogue-utils.ts:332-393`, levels 31-40 — the lines the player actually hears most) use archaic pronouns at all. This is likely the concrete cause behind `docs/PROJECT_AUDIT.md`'s note that "the Sphinx feels slightly generic." Worth threading `thou/thy/thee` into at least some of the 40 lines next time this zone gets a pass.

---

## 4. Murder Mystery NPCs — now documented

Level 49's three one-off NPCs (`components/murder-mystery/dialogue-data.ts`) had dialogue but no persona entry anywhere, unlike the five zone mentors. **Added to both `docs/NARRATIVE_DESIGN.md` §2 and `.continue/rules/04_dialogues-and-characters.md`** as part of this audit, reconstructed from their existing lines:

- **Policewoman** — bored, dismissive, casually unprofessional, insists "there was no murder."
- **Mortician ("Psychopompus"/Psycho)** — antisocial, terse to the point of one-word answers, prefers corpses to people.
- **Librarian** — protective of silence, backhanded book "recommendations."

These voices are now canonical — treat them the same as the five mentors for consistency in any future Level 49 dialogue work. (Minor note for whoever touches this file next: it also has ellipsis usage — *"How... unusual,"* *"a rather... pale affair"* — worth a look alongside the Devil's file above, but not addressed in this pass.)

---

## 5. General compliance check (no action needed)

- **"Only positive statements" rule** (no *"X is not... X is"* constructions): zero violations found project-wide via targeted search.
- **Skeleton Guard** (levels 1-9): dialect (`yer`/`ya`), gallows humor, zero ellipsis violations — fully on-voice.
- **Butler** (levels 11-20): formal British diction, fact-drops, condescension — fully on-voice.
- **Mansion map puzzle flavor text** (`mansion-map-puzzle.tsx`, in-progress Level 15 redesign): clean, no rule violations, good sensory specificity.
