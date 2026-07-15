# Level 15 Redesign — "The Gallery of Sins"

Replaces the current static "Patricia's portrait" puzzle with a 9-room,
compass-navigable wing of the mansion. Patricia is being cut entirely —
there is no first-love backstory anymore.

This doc is a handoff. Puzzle content (what's hidden in each painting, the
exact final answer, hint text) is still being finalized separately — **do
not block implementation on that**. Everything below is buildable now with
`solution: "life and death"` kept as a placeholder (see "What's still open").

---

## 1. Current state (what's being replaced)

- `data/puzzles-2.ts:69-81` — level 15 entry. Plain puzzle, no component
  flag, `imageUrl: "/images/level15.webp"`, `solution: "life and death"`.
- Renders through the generic static-image branch in
  `components/puzzle-content.tsx:513-524` (`hasImage` ? ... : ...) — just an
  `<img>`, no interactivity.
- `data/level-intro-scenes.ts:77-85` — butler's intro dialogue for level 15,
  currently four lines about Patricia. **Needs to be rewritten** to
  introduce the mansion wing instead (see "Content still needed").
- Level 15 is **not** currently in `GATED_LEVELS`
  (`components/game-screen.tsx:57-60`), so today the answer box is unlocked
  immediately. That should change — see §4.

## 2. Target structure

9 rooms in a 3×3 grid, navigated with N/S/E/W. Foyer is the entry point and
has no art. The other 8 rooms each hold one painting/statue.

```
   NW: Invidia (fresco)         N: Pope Gregory I (statue)      NE: Ivan the Terrible (painting)
   W:  The Sin (painting)       FOYER (entry, no art)           E:  Narcissus (statue)
   SW: Desidia (engraving)      S:  Saturn Devouring His Son     SE: Mammon (painting)
```

- Foyer → N unlocks Pope Gregory's room directly (no gate).
- The 7 sin rooms are reachable from Foyer via one or two compass moves
  (e.g. NW = North then West, or West then North — both should work,
  standard grid pathing).
- One room is locked behind a small interim puzzle (see §5) — **not yet
  assigned to a specific room**; SE (Mammon) was suggested as thematically
  apt ("greed hoards behind locked doors") but is not locked in.

Real artwork assets already exist at `public/images/paintings/`:
`narcissus.webp`, `invidia.webp`, `ivan-the-terrible-and-his-son.webp`,
`desidia.webp`, `mammon.webp`, `saturn-devouring-his-son.webp`,
`the-sin.webp`. No image exists yet for the Pope Gregory I statue or for
any of the 9 room backgrounds — see §3.

## 3. Room background images — generation prompts needed

None of the 9 room-background images exist yet. Style direction from the
project owner: **a Transylvanian manor, gothic but restrained — no fangs,
coffins, or overt vampire iconography. The "master" is only ever implied**
(the butler refers to him throughout the game; whether he's a vampire or
something closer to Satan is deliberately left ambiguous). Think heavy oak
paneling, wolf-motif wrought iron, oil lamps, worn Persian rugs, a chill in
every room — dread through atmosphere, not props.

Existing mansion-adjacent assets to match tone/palette against:
`public/images/mansion-bg.webp`, `mansion-exterior.webp`, `mansion.webp`,
`mansion-clock.webp` — check these first for the established color
grade/lighting style before generating new rooms, so the new wing doesn't
look visually disconnected from the rest of the game.

Needed, one background per room (9 total), each with a blank wall/pedestal
area reserved where the art asset will be composited in later (i.e.
generate the *room*, not the room+art — art gets layered on top
separately, same pattern as `wall-*.webp` in the pyramid level):

1. **Foyer** — entry hall, no art. Should read as the "hub" — a grand
   staircase or central rug motif, doorways leading N/S/E/W implied.
2. **North (Gregory room)** — a stone alcove/niche sized for a
   statue-on-pedestal, parchment or plaque space nearby for a Latin
   inscription.
3. **NW (Invidia)** — wall space sized for a framed fresco-style panel.
4. **NE (Ivan the Terrible)** — wall space for a large oil painting in an
   ornate frame.
5. **W (The Sin)** — wall space for a mid-size framed painting.
6. **E (Narcissus)** — alcove/pedestal for a marble statue (matches the
   existing `narcissus.webp` sculpture asset).
7. **SW (Desidia)** — wall space for a smaller framed engraving/print.
8. **S (Saturn)** — wall space for a dark, large painting.
9. **SE (Mammon)** — wall space for a large painting; if this ends up
   being the locked room, should visually read as sealed (heavier door,
   maybe a distinct lock mechanism prop) — confirm with §5 before
   finalizing composition.

Each prompt should specify: camera framing (roughly matching the
straight-on, chest-height framing used in `wall-*.webp` pyramid assets so
rooms crop/scale consistently), aspect ratio matching existing room
backgrounds, and enough negative space for the art + UI overlays (nav
arrows, description text box) without visual clutter.

**A statue of Pope Gregory I is also needed as a standalone asset** (same
treatment as `narcissus.webp` — isolated statue, transparent or matching
background so it composites onto the North room), with space for a carved
Latin inscription on the base/pedestal. Exact inscription text is TBD (see
§6) but the asset should leave room for it to be legible.

## 4. Navigation system

No existing puzzle in this codebase does true 4-directional compass
navigation — closest precedent is `components/pyramid-puzzle.tsx`, which
only supports linear `left`/`right` room chains. This needs a new pattern.

**Recommended shape**, modeled on `pyramid-puzzle.tsx`'s `roomConnections`
but extended to 4 directions:

```ts
type Room = "foyer" | "gregory" | "invidia" | "ivan" | "narcissus" | "thesin" | "desidia" | "saturn" | "mammon"

const roomConnections: Record<Room, Partial<Record<"north" | "south" | "east" | "west", Room>>> = {
  foyer:     { north: "gregory", south: "saturn", east: "narcissus", west: "thesin" },
  gregory:   { south: "foyer", west: "invidia", east: "ivan" },
  invidia:   { east: "gregory", south: "thesin" },
  ivan:      { west: "gregory", south: "narcissus" },
  narcissus: { west: "foyer", north: "ivan", south: "mammon" },
  thesin:    { east: "foyer", north: "invidia", south: "desidia" },
  desidia:   { north: "thesin", east: "saturn" },
  saturn:    { north: "foyer", west: "desidia", east: "mammon" },
  mammon:    { north: "narcissus", west: "saturn" },
}
```

(Diagonal rooms are reached via two moves through an edge room, standard
grid adjacency — the table above is one consistent way to wire it; treat it
as a starting point, not gospel, if a cleaner adjacency emerges during
build.)

**State placement:** pyramid puzzle lifts room state to `game-screen.tsx`
(`currentPyramidRoom`, `hasPyramidTorch`) because other UI outside the
puzzle component (character dialogue, sphinx messages) reacts to it. This
mansion puzzle is self-contained — no other part of the game needs to know
the current room — so **local `useState` inside the new puzzle component
is sufficient and simpler**. Only lift state to `game-screen.tsx` if a
requirement emerges for outside UI to react to room changes.

**UI:** pyramid puzzle hand-rolls prev/next buttons with
`lucide-react`'s `ChevronLeft`/`ChevronRight` — there's no reusable compass
component anywhere in the codebase. Build 4 directional buttons (N/S/E/W)
that show/hide based on whether `roomConnections[currentRoom]` has that
key, same gating logic as pyramid's `.left`/`.right` checks
(`pyramid-puzzle.tsx:211-244`).

## 5. Locked room — interim mini-puzzle

Project owner explicitly wants something more inventive than a
find-a-key-use-a-key interaction — "classical point-and-click, something
smart." Two directions discussed and approved to choose between (or
combine):

- **Hidden mechanism via room object** — an interactable object in one
  room (e.g. pulling a book on a shelf, turning a candlestick, pressing a
  detail on a different painting) silently unlocks the locked room's door.
  Classic secret-passage-lever gag.
- **Combination clue hidden in plain sight** — an object in another room
  (a clock face, a chessboard-patterned rug) encodes a number or symbol
  that must be cross-referenced to unlock the door. Requires the player to
  connect two rooms' contents.

Neither the exact room to lock, the exact object/mechanism, nor the clue
content has been finalized. Whoever implements this should design the
specific interaction, but it must not be a literal inventory key+lock — that
was explicitly ruled out.

## 6. "Investigating" the art — pan/zoom mechanic

**No zoom/pan/magnify/inspect mechanic exists anywhere in this codebase
today** (confirmed via full repo search — the current level 15 is a static
`<img>`, and no other puzzle has anything comparable). This is a
from-scratch build.

**Confirmed interaction model:** free pan/drag across a zoomed-in image —
not click-to-zoom hotspots. The painting displays zoomed in by default
(too large to see all at once in the viewport) and the player drags to pan
around, uncovering hidden details anywhere in the frame.

**Implementation notes:**
- No existing component to extend — build fresh. Natural home is a new
  wrapper component (e.g. `PaintingInspector`) used per-room in place of a
  plain `<img>`/`<Image>`, replacing the pattern at
  `components/puzzle-content.tsx:513-524` for this puzzle specifically (the
  new mansion puzzle component should own its own image rendering, not
  reuse the generic `hasImage` branch).
- Needs: a fixed-size viewport `div` with `overflow: hidden`, an inner
  image sized larger than the viewport (`transform: scale(...)` or an
  intrinsically larger image + `object-fit: none`), and drag handlers
  (`onMouseDown`/`onMouseMove`/`onMouseUp`, plus touch equivalents for
  mobile — check how other puzzles handle touch, e.g.
  `prison-cell-puzzle.tsx`'s item interactions, for the project's existing
  mobile-touch conventions) that translate the inner image via CSS
  `transform: translate(x, y)`, clamped so the player can't pan past the
  image edges.
- **Assume the source images already contain the hidden clues** — i.e. the
  `paintings/*.webp` assets (or higher-resolution versions of them) will be
  supplied with hidden details already baked in by the time this is wired
  up. The pan/zoom component itself doesn't need to know what's hidden
  where; it's a generic "explore a large image in a small viewport"
  component reusable across all 8 art rooms (7 paintings + Gregory's
  statue/inscription).
- Each room needs its own painting rendered through this component at
  large-enough native resolution that panning reveals real detail rather
  than upscaled blur — flag to whoever sources final image assets that
  the current `paintings/*.webp` files' resolutions should be checked
  against the zoom level actually used before shipping.

## 7. What's still open (do not block on these)

- **Final answer / solution string.** Keep `solution: "life and death"` as
  a placeholder in `data/puzzles-2.ts` for now — content design for the
  actual answer (what's hidden in each painting, how it resolves to a
  final phrase) is still in progress in a separate discussion. Do not
  invent or finalize this as part of implementing the nav/zoom
  scaffolding.
- **Pope Gregory's Latin inscription text** — not yet written.
- **Hints array** (`data/puzzles-2.ts` `hints:` field) — currently has 3
  hints written for the old Patricia puzzle; needs full rewrite once the
  actual puzzle content is locked. Leave as-is or stub for now.
- **Butler intro dialogue** (`data/level-intro-scenes.ts:77-85`) — needs a
  full rewrite introducing the mansion wing/gallery instead of Patricia.
  Not written yet; flag as a follow-up rather than guessing content.
- **Which room is locked**, and the exact locked-room mechanism (§5).

## 8. Wiring checklist (once content above is finalized)

1. Add `isMansionMapPuzzle?: boolean` to `types/puzzle.ts` (alongside
   `isPyramidPuzzle` etc., `types/puzzle.ts:33`).
2. Set `isMansionMapPuzzle: true` on the level 15 entry in
   `data/puzzles-2.ts:69-81`, replace `imageUrl` (no longer needed — the
   new component handles all room/art rendering itself) — but **keep
   `solution: "life and death"`** until final content is ready.
3. Build `components/mansion-map-puzzle.tsx` — room graph + local
   navigation state (§4) + per-room `PaintingInspector` pan/zoom (§6) +
   locked-room interaction (§5). Call `onSolve()` (or
   `onInteractionComplete`, matching the pattern at
   `puzzle-content.tsx:479-491` for `isPyramidPuzzle`) once the puzzle's
   actual completion condition is defined — that condition depends on the
   still-open content design in §7, so this call site may need a follow-up
   pass once that's finalized.
4. Wire into `components/puzzle-content.tsx`: import the new component,
   add an `isMansionMapPuzzle` branch (same shape as the
   `isPyramidPuzzle` branch at `puzzle-content.tsx:479-491`).
5. Add `15` to `GATED_LEVELS` in `components/game-screen.tsx:57-60` so the
   answer input stays locked until the puzzle signals completion — level
   15 is not currently gated, since the old puzzle needed no interaction.
6. Update `data/level-intro-scenes.ts:77-85` once new butler dialogue is
   written (§7).
