# 🏗️ Architecture

Read this before browsing the codebase for any non-trivial task — it should answer
"where does X live" without a full Explore pass. If something here goes stale,
fix it in the same PR that breaks it.

> Also see `.continue/rules/*.md` (not duplicated here): `00_project-architecture.md`
> (stack/folders, terser version of this doc), `01_coding-standards.md`,
> `02_key-files-and-data.md`, `04_dialogues-and-characters.md` (full character
> voice/persona rules — Skeleton Guard, Butler, Gypsy Teller, The Devil),
> `dialogue-carousel.md`.

---

## Stack

- Web: Next.js 14 (App Router) + React 18 + TypeScript.
- Desktop: Electron wrapper around the built Next.js app (`electron/main.ts`).
- UI: Radix UI + Tailwind CSS + Framer Motion.
- State: in-memory React state in `game-screen.tsx`, persisted to `localStorage` (web)
  or filesystem (desktop) for save/continue.

## Top-level folders

| Folder | Contents |
|---|---|
| `app/` | Next.js App Router pages/layout (`app/page.tsx`, `app/layout.tsx`) |
| `components/` | All React components — one file per puzzle widget, plus shared screens |
| `data/` | Canonical content: puzzles, transitions, level intros, book/family-tree flavor data |
| `types/` | `puzzle.ts`, `transition.ts`, `book-types.ts` — canonical shapes |
| `utils/dialogue-utils.ts` | All mentor dialogue (portrait-click lines), not in `data/` |
| `electron/` | Desktop boot (`main.ts`) — treat as platform-critical, don't break |
| `docs/` | Design docs (this folder) — see `@INDEX.md` |
| `.continue/rules/` | Agent-facing house rules: architecture, coding standards, dialogue persona rules |

---

## The puzzle system

### Data flow

`data/puzzles.ts` concatenates five zone files into one flat array, indexed by level:

```
puzzlesSet1 → Levels 1–10  (Prison Cell — Skeleton Guard)   data/puzzles-1.ts
puzzlesSet2 → Levels 11–20 (Mansion — Butler)                data/puzzles-2.ts
puzzlesSet3 → Levels 21–30 (Forest — Gypsy Teller)            data/puzzles-3.ts
puzzlesSet4 → Levels 31–40 (Desert — Sphinx)                  data/puzzles-4.ts
puzzlesSet5 → Levels 41–50 (Hell — The Devil)                 data/puzzles-5.ts
```

Each entry is typed by `types/puzzle.ts`'s `Puzzle` interface: `level`, `question`,
`description`, `solution`, `category`, `hints?`, plus **one `isXxxPuzzle?: boolean`
flag per puzzle type** (e.g. `isAnagramSpicePuzzle`, `isLockKeyPuzzle`,
`isColorPalettePuzzle`...). There is no enum — it's one boolean per puzzle kind,
checked in sequence.

### Rendering: `components/puzzle-content.tsx`

This is the dispatcher. It imports every puzzle component, reads which `isXxxPuzzle`
flag is set on the current level's data, and renders that one interactive component.
**Almost every puzzle component receives `onSolve={() => {}}` — a deliberate no-op.**

### Solving: the answer is typed, not auto-detected

The interactive puzzle widgets (drag-and-drop, carousels, sliders, etc.) are
**deduction aids, not the win-condition**. The player works out the answer by playing
with the widget, then types it into the global answer box
(`components/answer-input.tsx`), and `game-screen.tsx#checkAnswer` (around line 186)
normalizes the input (`trim().toLowerCase()`) and compares it against
`puzzle.solution.toLowerCase().split("|")` (pipe-delimited to accept multiple correct
phrasings). A few puzzles use the puzzle component's own state via a ref (e.g.
`questionnaireRef.current.initializePuzzle()`) for level-specific reset behavior, but
the win check itself always lives in `game-screen.tsx`, never inside the puzzle
component.

**Implication for anyone building/debugging a puzzle widget**: if `onSolve` is never
called, that is almost certainly correct, not a bug — verify by checking whether
`puzzle-content.tsx` passes it as `() => {}` for that puzzle type before "fixing" it.

### Adding or modifying a puzzle

1. Add/edit the entry in the right `data/puzzles-N.ts` file (by level range above).
2. If it's a new puzzle type, add an `isXxxPuzzle?: boolean` flag to `types/puzzle.ts`,
   build `components/xxx-puzzle.tsx`, and wire it into `puzzle-content.tsx`'s
   if/else chain (it renders with `onSolve={() => {}}` unless the puzzle genuinely
   needs to report completion state outward, e.g. `MagicBoxPuzzle`'s `onSolved`).
3. Keep `puzzle.solution` as the single source of truth for correctness — don't build
   parallel validation logic inside the widget unless it's purely a visual/UX aid
   (e.g. hand-rotation feedback in `anagram-spice-puzzle.tsx`).

---

## Dialogue system

Two independent dialogue sources exist per level — don't confuse them:

1. **Intro scene** — `data/level-intro-scenes.ts`. `LevelIntroScene` keyed by level
   number: `{ character, lines: string[] }`. Shown once as a click-through scene
   before the puzzle UI mounts (rendered by `components/level-intro-scene.tsx`).
2. **Portrait-click dialogue** — `utils/dialogue-utils.ts`. `levelDialogue` is
   `Record<character, Record<level, string[]>>`; `useCharacterDialogue()` (the hook
   consumers actually call) picks a line with anti-repeat tracking
   (`lastShownDialogue`, `shuffledDialogue`) so the same line doesn't fire twice in a
   row. Triggered by clicking the mentor's portrait via
   `components/character-location-display.tsx`'s `onGuardClick` prop (wired up
   in `game-screen.tsx`).

Character voice rules (how the Butler/Skeleton Guard/Gypsy/Devil should sound) live
in `.continue/rules/04_dialogues-and-characters.md` — check it before writing or
auditing any dialogue line.

---

## Key files quick-reference

| Need to... | Look at |
|---|---|
| Find/edit a level's puzzle data, hints, solution | `data/puzzles-N.ts` (N by level range above) |
| Find/edit a level's intro scene | `data/level-intro-scenes.ts` |
| Find/edit a level's portrait-click flavor lines | `utils/dialogue-utils.ts` → `levelDialogue` |
| Find which component renders a puzzle type | `components/puzzle-content.tsx` (search the `isXxxPuzzle` flag) |
| Understand win/answer-checking logic | `components/game-screen.tsx` → `checkAnswer` |
| Add a new puzzle type | `types/puzzle.ts` (flag) + `components/xxx-puzzle.tsx` + `puzzle-content.tsx` wiring |
| Change global answer input UI | `components/answer-input.tsx` |
| Change a character's voice/persona | `.continue/rules/04_dialogues-and-characters.md` |
| Zone/level overview, solutions, intended player journey | `docs/LEVEL_DESIGN.md` |
| Implementation status per level | `docs/KANBAN.md` |

---

## Known traps

- `data/puzzles.ts` (singular) is just the aggregator — the real content is in
  `data/puzzles-1.ts` … `puzzles-5.ts`. Don't edit the singular file expecting it to
  hold content.
- `onSolve={() => {}}` on a puzzle component is the norm, not dead code — see above.
- Puzzle components often allow "wrong" intermediate states with zero visual
  feedback by design (the deduction aid doesn't validate, the typed answer does).
  Don't assume missing feedback = bug without checking whether the win condition is
  even meant to live in that component.
- `docs/LEVEL_DESIGN.md` entries can drift behind the actual shipped mechanic when a
  puzzle gets reworked (this happened with the mansion spice anagram puzzle, now
  Level 13) — treat it as a design intent doc that needs occasional reconciliation
  against `data/puzzles-N.ts` and the real component, not as ground truth on its own.
  Mansion levels (11-20) were reordered 2026-07 for difficulty pacing — check the
  `level:` field in `data/puzzles-2.ts` before trusting any level number cited
  elsewhere, including in older docs.
