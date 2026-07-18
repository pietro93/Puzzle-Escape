# 🎲 Minigame Mode — Design Doc

Status: **4 of 5 candidates approved for build; scoping still needed on L42.**
Word Ladder and Whodunit were cut from scope entirely (see "Cut from scope").
This document redesigns a handful of campaign levels into a standalone,
infinitely-replayable "Minigames" mode unlocked after finishing (or
progressing through) the main 50-level campaign.

## Selection philosophy

A campaign level survives the jump to "minigame" only if it has a genuine
**interaction loop with feedback**, not just "read a static puzzle, compute
an answer, type it in." Flat arithmetic/sequence-spotting (counting, magic
number sequences) reads fine once inside a story but is tedious on repeat —
those are excluded even though they're trivial to randomize.

Two campaign levels already meet the bar as-is (dynamically generated
today, per `LEVEL_DESIGN.md`): **L17 Pitch Dark Switches** and **L21 Essence
Questionnaire**. L17 was ruled out for minigame mode (one-shot atmosphere
reveal, no depth).

---

## 1. Pyramid Hanoi — ✅ approved (from L36)

**Existing implementation:** `components/pyramid-of-hanoi-puzzle.tsx`
(`PyramidOfHanoiPuzzle`), data flag `isPyramidOfHanoiPuzzle` in
`data/puzzles-4.ts:84`.

**Confirmed: this is not classic 3-peg Hanoi.** It's already 4 pegs —
Quarry / Carving Workshop / Painting Workshop / Construction Site — and
blocks carry `hasVisitedP2`/`hasVisitedP3` flags, i.e. each block must pass
through the carving and painting stations before reaching the site, not
just move peg-to-peg. That's a stricter constraint than textbook Hanoi
(more moves required, can't shortcut a block straight from quarry to site).
Reskinning to a minigame should keep this 4-stage-pipeline rule — it's a
more interesting mechanic than plain Hanoi, not a bug to simplify away.

**Replay parameters:**
- Block count 3–7 selects difficulty; move counter vs. optimal for this
  4-stage variant (needs its own optimal-move formula, not `2^n − 1` —
  that constant is for 3-peg Hanoi and doesn't hold once blocks are forced
  through 2 intermediate stations).
- Best time / best move count tracked per difficulty tier.

**Currently static:** the "solution" (`menkaure`) is a fixed reveal text,
not derived from the moves — minigame mode needs this decoupled so a
completed run just reports success/score, no narrative payoff to fake.

**Build cost:** low — peg/move logic already generalized, this is mostly
UI reskin + decoupling the win-state from the fixed solution string.

---

## 2. Magic Square (L8, rebus stripped) — ✅ approved, assets available on request

**Redesign:**
- 3×3 (later 4×4) magic square: some cells pre-filled, player fills the
  rest so every row/column/diagonal sums to a target.
- Generate via transform-of-base-square (the classic Lo Shu 3×3 admits
  scaling/offset transforms that stay magic); blank `k` cells for difficulty.
- Icons are pure skin now — no wordplay requirement, so the generator works
  in any zone with a reskin. You've offered to supply additional icon sets
  if the existing blood/rum/ice icons don't fit a given zone reskin —
  flagging that as needed once a specific zone skin is picked, not before.
- Live per-line sum feedback (glow green when a row/col/diagonal is
  satisfied), rather than a single pass/fail check at the end.

**Build cost:** low — pure math generator, no dictionary/external data.

---

## 3. Fortune's Riddle — hangman, decoupled from L21 — ✅ approved

**Existing implementation:** `components/questionnaire-puzzle.tsx`
(`QuestionnairePuzzle`), data flag `isQuestionnairePuzzle` in
`data/puzzles-3.ts:10`. This is further along than the other three —
already fully dynamic (`solution: "RANDOM" // overridden by component`),
already exposes `onSolutionGenerated`.

**Existing word banks (inline, lines 14–16 of the component):**
- Descriptor (`prefixes`): 7 — UNFATHOMABLE, ENIGMATIC, ETHEREAL,
  MALEDICTIVE, EUPHORIC, OBSCURE, DELIGHTFUL
- Color: 6 — AMARANTH, ARGENTINE, ALABASTER, VIRIDIAN, CERULEAN, CELADON
- Noun: 6 — CARIBOU, CARAVAN, CATAMARAN, CHERUB, CAROB, CAROUSEL

7×6×6 = 252 combinations today — enough to not repeat for a while, but
thin for a mode meant to be replayed indefinitely. **I can generate an
expanded word bank directly** (this is just curated vocabulary, same
register as the existing entries — ornate/gothic adjectives, jewel-tone
colors, evocative nouns) rather than needing external content. Proposed
next step: I draft ~20–25 entries per category in the existing voice,
you review/cut before it goes in the file — copy quality is worth a pass
given the "flag generic/AI-slop prose" standard this project holds writing
to.

**Build cost:** very low — extraction from campaign flow + word bank
expansion, no new mechanic.

---

## 4. Mouth of Truth → Mastermind / Codebreaker (L48) — ✅ approved

**Correction:** the "7 sins" framing in the previous version of this doc
was wrong — it came from `LEVEL_DESIGN.md`'s description of L48, which
turns out not to match the actual implementation (that description has
been fixed there too). There is no sin theming in the built puzzle at all.

**Existing implementation:** `components/mouth-of-truth-puzzle.tsx`
(`MouthOfTruthPuzzle`), data flag `isMouthOfTruthPuzzle` in
`data/puzzles-5.ts:119`. **This is already a complete, working Mastermind
clone:**
- 4 slots (tl/tr/bl/br), 6 possible marble colors (black/white/gold/red/
  green/blue), secret combination drawn from 4 of those colors and
  randomized fresh via `generateCorrectCombination()`.
- Guess feedback is exact-match / color-match / no-match per slot, shown
  as cherub icons — and the feedback order is shuffled before display so
  players can't infer which slot a given piece of feedback refers to. That's
  a correct, standard Mastermind implementation detail, already done.
- On solve, a separate letter-pairing/cherub reveal spells out the level's
  answer (`CHAPLAIN`) — this part is L48-specific narrative payload, not
  part of the reusable Mastermind loop.

**What minigame mode actually needs:** far less than previously thought.
- Strip the letter-pairing/cherub reveal (that's the campaign-specific
  "spell the answer" bit) and replace the win state with a plain success/
  score screen.
- Optional difficulty knobs: slot count (4→5/6), color pool size, allow/
  disallow repeat colors in the secret, guess budget — all straightforward
  parameter changes to the existing generator, no new mechanic.
- No new marble colors or slots are required to ship a working version;
  they're only worth adding later as extra difficulty tiers, not a
  blocker.

**Build cost:** low — this is close to a direct reuse of what's built.

---

## 5. L42 Apocalypse Knight Tour — decision needed, not what the design doc assumed

**Correction to my earlier proposal:** I described this as "knight's-tour
under a move cap" and proposed replacing it with a Solitaire-Chess-style
capture puzzle. Having now checked `components/infernal-chess-puzzle.tsx`
(`InfernalChessPuzzle`), that description was wrong — **it isn't knight-move
logic at all.** It's a 5×5 board (`BOARD_SIZE = 5`) with 4 hardcoded
Horsemen (Death/Pestilence/War/Famine, each with its own color/glow map)
that the player keeps in a circular motion around the center, tracked via
touched-tile/trail-particle state, not chess move legality. So "vibe code
with existing assets" splits into two very different answers depending on
which puzzle you actually want:

**Option A — reskin the existing circular-motion puzzle (easy, genuinely
vibe-codeable):** keep the exact mechanic, randomize board size, the
required circular pattern/sequence, and swap Horsemen colors/names per
session. The animation scaffolding (framer-motion trail particles,
touched-tile tracking, coordinate parser) is already generalized enough
for this — mostly parameter changes, not new logic. This is the
low-effort path.

**Option B — build actual chess-legality mechanics (Solitaire Chess
capture-chain, or true knight's tour):** would need new move-legality
logic per piece type from scratch, since none exists today, plus
character sprites — the survey found tile art (`chess-tile*.webp`) but
**no Horsemen/knight character sprites**, meaning the pieces are likely
rendered through some other shared character-art system not confirmed
reusable for a chess-piece context. This is a real build, not a vibe-code.

**My recommendation:** go with Option A. It reuses what's actually there,
ships fast, and the "keep pieces circulating without collision/overlap"
core loop is still a legitimate replayable puzzle type (closer to a
rhythm/spatial-timing game than a logic puzzle, but that's fine — it adds
genre variety against the deduction/math-heavy rest of the set). Option B
is the "true chess puzzle" fantasy from the original proposal but isn't
close to what's built; only worth it if chess-specific gameplay is a
priority worth the extra asset/logic investment.

**Needs your call:** Option A or B before this goes further.

---

## Cut from scope

**L7 Word Ladder** and **L10 Whodunit** — cut per decision, not pursued.
(Original proposals for both are preserved in git history if reconsidered
later: Word Ladder needed a dictionary/adjacency-graph precompute for
guaranteed-solvable generation; Whodunit needed a Knights & Knaves-style
statement generator with a brute-force consistency solver.)

---

## Summary

| # | Source level | Status | Build cost | Notes |
|---|---|---|---|---|
| 1 | L36 Pyramid Hanoi | ✅ approved | low | 4-stage pipeline variant, not classic 3-peg Hanoi — keep that twist |
| 2 | L8 Magic Square | ✅ approved | low | rebus stripped; extra icon assets available if needed for a zone reskin |
| 3 | L21 Fortune's Riddle | ✅ approved | very low | word bank already exists (7/6/6), I can draft an expanded bank for review |
| 4 | L48 Mouth of Truth (Mastermind) | ✅ approved | low | already a complete, working Mastermind clone — no sin theming ever existed; just strip the campaign-specific letter reveal |
| 5 | L42 Knight Tour | ⏳ needs a call | Option A: low / Option B: medium-high | not actually knight-move logic today — reskin the real circular-motion mechanic (A) vs. build true chess-piece logic from scratch (B) |
| — | L7 Word Ladder | ❌ cut | — | — |
| — | L10 Whodunit | ❌ cut | — | — |

## Open questions before any of this is built

1. Does "Minigames" live as a separate top-level mode, or as a replayable
   sub-screen unlocked per zone? Affects nav/unlock design, not covered here.
2. Scoring/reward loop — cosmetic bragging rights vs. tied into any
   in-game currency/monetization system? See `MONETIZATION_STRATEGY.md`.
3. L42: Option A or B (see above).
