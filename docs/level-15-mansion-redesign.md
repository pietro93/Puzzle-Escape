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

## 9. Session 2 (2026-07-16) — where the build actually is, and the item system

Everything in §1-8 above was the original handoff and is now **built**:
`components/mansion-map-puzzle.tsx` (room graph, nav, locked-room stub) and
`components/painting-inspector.tsx` (pan/zoom viewport) both exist and work.
The room-navigation and pan/zoom scaffolding described in §4/§6 should be
treated as done, not aspirational — read the actual components rather than
re-deriving them from the prose above.

Since then the design has moved substantially past what's coded. This
section is the source of truth for what's decided vs. still open; §5 and §6
above are superseded by what's below wherever they conflict.

### 9.1 Current implementation (as of this session)

- `mansion-map-puzzle.tsx`: room shows a small clickable painting/statue
  thumbnail plus a brass "plaque" button below it (title only — artist/date
  are placeholder text, not final content). Clicking the thumbnail opens a
  full-screen modal with the full uncropped image and +/- zoom buttons.
  Clicking the plaque opens a small info card. A room is marked "inspected"
  (counts toward the solve condition) only once its modal has actually been
  opened, not just on room entry.
- `painting-inspector.tsx`: generic contain-fit viewport, drag-to-pan when
  zoomed past 100%, zoom buttons, pointer-events based (mouse + touch in
  one handler, matching `clockwork-puzzle.tsx`'s convention).
- Locked room: still just the placeholder "examine the wolf-head knocker in
  the Foyer" stub from §5's original brainstorm — **this is now stale, see
  9.4**.
- **Not yet built at all**: any item/inventory system, the reveal-mask
  engine (base image vs. hidden-detail image), or any of the per-painting
  item mechanics below. The zoom buttons currently work unconditionally
  with no item gate.

### 9.2 Key discovery: `_x` asset pairs already exist

`public/images/paintings/` has `_x` siblings for 5 of the 8 pieces:
`invidia_x.webp`, `desidia_x.webp`, `ivan-the-terrible-and-his-son_x.webp`,
`mammon_x.webp`, `narcissus_x.webp`. Each is pixel-identical to its base
image except for one added detail (confirmed by visual diff this session):
`narcissus_x.webp` has carved lettering worked into the drapery folds;
`invidia_x.webp` has faint lettering in the left marble column. **These are
the "hidden clue revealed" state of the asset**, not raw material to build
a mechanic from scratch — the reveal mechanic just needs to be *whatever UI
action swaps base → `_x`*.

**Missing `_x` variants**: `saturn-devouring-his-son.webp`, `the-sin.webp`,
`pope-gregory-i.webp` (no `pope-gregory-i_x.webp`). These need to be
generated before their item mechanics (below) can do anything — flag this
to whoever sources assets next.

### 9.3 Item system — decided roster

The reveal mechanic is now item-gated: each art piece needs a specific
*collected* item used on it, point-and-click adventure style, in place of
the bare zoom-button reveal originally spec'd in §6. All of this shares one
underlying "reveal mask" concept (something swaps/uncovers the `_x` layer
over the base layer, scoped to a cursor/drag position for gestural items or
all-at-once for simple ones) — build one reusable engine, skin it per item,
not eight bespoke implementations.

**Confirmed items:**

- **Hand loupe (magnifying glass)** — universal zoom-gate. Zoom buttons in
  `PaintingInspector` must not work at all until the player has this item
  (currently they work unconditionally — this needs to change). Specific
  reveal-use on: **Mammon**, **Invidia**, **Desidia** (their hidden text
  needs magnification specifically, beyond just being able to zoom).
- **Holy water vial** — collected *from Gregory's statue itself*: render a
  vial as a small image overlay on the Gregory statue art, clickable; on
  click, remove the overlay (collected) and add the vial to inventory. Used
  to clean blood on **Ivan the Terrible** *and* **Saturn Devouring His
  Son** — correction from earlier in this session, blood-cleaning is NOT on
  The Sin (see below).
- **Charcoal + paper rubbing** — for **Narcissus** (a statue; a magnifying
  glass doesn't make sense for reading carved relief the way it does for a
  flat canvas). Mechanic still has an open sub-decision, see 9.5.
- **Oil lamp / candle** — for **The Sin**. Heat-reveal: holding it near the
  canvas reveals text via a scorch effect. Confirmed, no blood involved
  here (that was a mid-session mistake, corrected — blood-cleaning is
  Ivan's and Saturn's, not The Sin's).
- **Coin** — for **Mammon**. Brass-rubbing gesture (rub along the frame,
  embossed text appears under the rubbed path). Also intended to double as
  the Mammon-door unlock item (see 9.4) — find it once, it serves both the
  door and the painting.
- **Gregory** — no item needed to read the statue itself; it's the *source*
  of the holy water, not something requiring its own reveal mechanic.

**Still open:**

- **Invidia's exact item** — undecided between: hand mirror (reflects
  mirrored text — envy/reflection pun), green-tinted eyeglass (color-filter
  reveal, "green with envy"), or hand fan (wafts soot off the fresco,
  matches the painting's flames). Note Invidia's *reveal* is loupe-gated
  per above regardless — this decision is about whether there's an
  additional item/gesture on top of the loupe, or the loupe alone suffices.
- **Saturn's exact reveal sequence** — likely two-step: holy water first to
  clear blood, then a second item/gesture for the actual text reveal
  (hourglass time-lapse decay was the earlier pick for Saturn specifically,
  before holy water got assigned to it too — confirm whether both apply in
  sequence, or holy water alone is sufficient for Saturn).

### 9.4 Locked rooms — TWO, not one (contradicts §5)

The project owner's recollection this session is that **two** rooms should
be gated behind small puzzles, not the single Mammon lock §5 originally
scoped. The current code (`LOCKED_ROOM = "mammon"` in
`mansion-map-puzzle.tsx`, unlocked via a placeholder "examine the
knocker" button) only implements one, and that mechanism is a stub that
should probably be replaced by the coin item once the item system exists
(see 9.3). **Open, needs deciding next session:**

- Which second room gets locked.
- What ungates it — likely reusing an item from the "brainstormed but not
  assigned to a painting" list from earlier this session as the unlock
  trigger rather than a reveal tool: candidates raised were salt, a
  blade/scraper, a balance scale, a sundial fragment, a pocket watch. None
  of these are currently assigned anywhere, so any could be repurposed as
  a second-lock key without conflicting with the roster in 9.3.
- Whether Mammon's lock should switch from the placeholder knocker to
  "found the coin" once the coin item exists.

### 9.5 Narcissus rubbing — open sub-decision

Two ways to make the rubbing require the player to *find* the carved text
rather than just handing it to them (project owner explicitly wants a
search element here, not an automatic reveal):

- **(a) Several discrete paper pieces**, each applied to a different named
  zone on the statue (drapery, pedestal front, pedestal side, base band).
  Only the zone(s) that actually have carved relief (per the `_x` diff —
  currently the drapery, bottom-left) reveal anything; the rest come away
  blank. Needs the statue divided into clickable hotspot zones.
- **(b) One full-statue drape/wrap**, but the player has to manually
  "scrub" (drag) charcoal across it and find the right spot by feel/trial —
  a single continuous rub-and-search gesture rather than discrete
  zone-picking.

Not decided — (a) is more explicit/discoverable but needs more UI
(zone hotspots); (b) is fewer assets/simpler state but relies entirely on
the rub gesture itself to communicate "you found it," which needs a clear
feedback moment (e.g. the charcoal catching and darkening measurably once
the drag path crosses the hidden relief). Whoever picks this up should
just make a call — both build on the same reveal-mask engine from 9.3, so
it's not architecture-blocking either way.

### 9.6 Not yet touched from §7

Final answer/solution string, Gregory's Latin inscription, hints array,
and butler intro dialogue are all still exactly as open as §7 described —
nothing this session changed their status.

## 10. Session 3 (2026-07-16) — room-graph restructuring, fixed-box rendering, solve condition change

This session replaced the room graph and rendering model in
`mansion-map-puzzle.tsx` with real (non-placeholder) art assets for several
rooms, but did **not** touch the item system (§9.3), the two-lock decision
(§9.4), or the Narcissus rubbing decision (§9.5) — those remain exactly as
open as §9 left them.

**11-room graph, not 9.** Two rooms were split into a second "annex" screen
because their new source images were too wide to crop into the fixed
portrait box without losing too much detail:

- `foyer` → `foyer_left` / `foyer_right` (added as `foyerAnnex`)
- Gregory's alcove → `saint_alcove_left` / `saint_alcove_right` (added as
  `gregoryAnnex`)

These are the same physical room as their parent, just a second screen, not
new puzzle content.

**Fixed-box rendering.** All rooms now render inside one constant `BOX_ASPECT`
(3:4 portrait) container so the puzzle never resizes as the player
navigates between rooms. Each image crops via `object-cover` with a
per-room `ROOM_FOCUS` centering point (hand-picked, not derived). A
`mapToBox` helper reprojects hand-placed art/plaque hotspot coordinates
from source-image percent space onto the cropped box, so click targets
still line up after the crop.

**New assets wired in this session:** `foyer_left.webp`, `foyer_right.webp`,
`saint_alcove_left.webp`, `saint_alcove_right.webp`, `ember_room_shut.webp` /
`ember_room_open.webp` (Invidia), `drowsing_parlor.webp` (Desidia, replacing
`drowsing_parlor_old.webp`). `green_parlor.webp` (The Sin) is still the old
wider image with a minor crop — no redesigned asset provided yet for that
room.

**Invidia two-state image — mechanism not wired.** Invidia's room now
toggles between `ember_room_shut.webp` (no painting visible) and
`ember_room_open.webp` (painting visible) via a local `emberOpen` boolean,
defaulting to shut. **`setEmberOpen` is currently unused** — nothing in the
puzzle sets it to true yet. A new unlock mechanism is planned to flip this,
but it is not designed (no mechanism, no trigger decided) — whoever picks
this up needs to design it from scratch, it doesn't connect to anything in
§9.3's item roster yet.

**New second lock location, still undesigned.** `gregoryAnnex`
(`saint_alcove_right`) is flagged as where the second lock from §9.4 should
go, but currently has no lock at all — it's fully open/unlocked. No
mechanism or trigger has been decided, same open status as §9.4.

**Solve condition simplified.** The puzzle now solves immediately when the
player examines Pope Gregory's statue — not "inspect all 8 pieces" as
implied by earlier "inspected room" tracking in §9.1. The redundant
inspected-room counter and "click to examine" instruction text were removed
as part of this change, along with the "seven deadly sins" spoiler line
from the level description.

**Coordinates are eyeballed, not measured.** Hotspot/focus values for the
new gregory/invidia/desidia assets were estimated from visual inspection,
not pixel-measured against the source images — worth nudging in-browser if
a click area feels slightly off.

## 11. Session 4 (2026-07-16) — final room graph, room/asset naming fix, lock relocated

This session replaced the room graph entirely (working room-by-room through
what's visible in each new background image) and fixed a room/asset naming
mix-up from session 3. **The graph and asset mapping below are current —
§10's graph and the "invidia has an ember toggle" description above are
both superseded.**

### 11.1 Naming fix: thesin = ember room, invidia = green parlor

Session 3 had this backwards. Corrected in `mansion-map-puzzle.tsx`:
`thesin` (The Sin) now uses `ember_room_shut.webp`/`ember_room_open.webp`
and owns the closed/open toggle (`emberOpen` state, still unwired to any
trigger — see 11.4). `invidia` now uses `green_parlor.webp`, a normal
single-image room with no toggle. `ROOM_FOCUS`, `ART_HOTSPOTS`, and
`PLAQUE_HOTSPOTS` entries for these two rooms were swapped along with the
backgrounds, since those values were calibrated to the image, not the room
identity.

### 11.2 Final room graph

Built by walking through each new background image and identifying its
actual visible exits, not by preserving the old 3×3 grid layout. `BACK` is
a dynamic sentinel resolved at navigation time to whichever room the player
last came from (implemented via a `previousRoom` state var) — used for every
room that's a dead-end branch reachable from more than one place, so it
doesn't need a second hardcoded connection.

```
foyer:       { west: thesin, north: saturn, east: foyerAnnex }
foyerAnnex:  { west: foyer, east: narcissus, north: gregory }
gregory:     { south: foyer, east: gregoryAnnex, north: ivan }
gregoryAnnex:{ west: mammon (LOCKED), north: ivan, south: BACK }
ivan:        { south: BACK }
invidia:     { south: BACK }  — reached only via thesin, north
mammon:      { south: BACK }
saturn:      { south: BACK }
thesin:      { east: foyer, north: invidia, west: desidia }
desidia:     { east: BACK }
narcissus:   { west: BACK }
```

Notable results of this pass: `foyer` and `foyerAnnex` no longer both lead
to `gregory` (only `foyerAnnex` does now — north). `gregoryAnnex` no longer
connects back to `gregory` directly; its west exit is entirely the locked
door to `mammon`, and its return path to `gregory` is the dynamic `BACK`
exit (south). `invidia` is reached exclusively through `thesin` (north) —
nothing else connects to it. The old idea of `invidia` connecting onward to
`mammon` (from session 2/3) was explicitly dropped — confirmed there is no
such connection.

### 11.3 Lock relocated: one lock, at gregoryAnnex → mammon

§9.4's "two locks" idea is retired — confirmed back down to **one** locked
room (`mammon`), same as the original §5 scope, but relocated. The
placeholder "examine the wolf-head knocker in the Foyer" mechanism is gone;
the code's `examineDoor`/`doorExamined`/`doorUnlocked` stub (still a
one-click placeholder — click a button in `gregoryAnnex`, door instantly
unlocks, no real mechanism yet) now lives in `gregoryAnnex` and gates the
west exit into `mammon`. **This stub still needs replacing with the real
mechanism** — see 11.5 below (the coin).

### 11.4 Still open — going into next session

- **Item/inventory system**: still entirely unbuilt. Nothing has changed
  here since §9.1 flagged it — no pickable items exist in code yet.
- **gregoryAnnex's locked door**: currently the placeholder one-click stub
  described in 11.3. Real mechanism not designed — needs one before this
  ships. Likely candidate: the coin (see 11.5), but not wired.
- **thesin's ember shut→open switching mechanism**: not decided. Two
  directions discussed, neither chosen:
  - **Simple**: player carries a light source (the oil lamp/candle already
    assigned to The Sin's painting-reveal in §9.3) and clicks the room's
    dead hearth; embers catch, room brightens, painting becomes visible.
    One item, one click, reuses an item already in the roster.
  - **Elaborate**: iron flame-shaped levers on the fireplace grate must be
    set to a combination clued elsewhere in the mansion before the flue
    opens; closer to "classical point-and-click, something smart" per the
    original §5 brief, but a heavier build (multi-state lever UI, a
    cross-referenced clue).
- **Invidia's exact reveal item**: still undecided, same open question as
  §9.3, narrowed this session. The "soot-fan" option is dropped — soot/fire
  now belongs to thesin's room, not invidia's green parlor, so it no longer
  makes thematic sense here. Two live options:
  - **Hand mirror**: a mirrored/reversed inscription on the fresco only
    reads correctly through the reflection — classic backwards-writing
    trick, ties envy to "seeing yourself in others."
  - **Tinted lens/shard**: hidden text is printed in a slightly different
    shade of green than the background, invisible to the naked eye, legible
    only through a complementary-colored lens — a better "aha" moment but
    needs a real two-tone art asset (more production work than the mirror,
    which needs no new asset).

### 11.5 Reminder: how the coin puzzle works (§9.3)

The coin is Mammon's item. Mechanic: a brass-rubbing gesture — player rubs
the coin along the painting's frame, and embossed text appears under the
rubbed path (same reveal-mask engine as every other painting, just skinned
as a rub gesture instead of a wipe or zoom). It's explicitly meant to do
double duty: the same coin, once found, both reveals Mammon's hidden text
*and* serves as the unlock item for the door in `gregoryAnnex` (11.3/11.4)
— find it once, it works for both. Where the coin itself is physically
found/picked-up in the mansion is not yet decided (depends on the item
system in 11.4 existing first).

### 11.6 Session 5 (2026-07-17) — inventory system built, first two items wired

Item/inventory system now exists in `mansion-map-puzzle.tsx`, matching
`prison-cell-puzzle.tsx`'s conventions exactly (flat `string[]` of display
names, dedupe-on-add via `inventory.includes`, bottom "Inventory Display"
panel — icon tile if `ITEM_ICONS` has an entry, else a text pill). Only two
items are wired so far:

- **Drape** — pickup overlay in `desidia` (drowsing parlor) at pixel
  (91,316) size 196x257 on `drowsing_parlor.webp`'s 597x740 canvas, via
  `drowsing_parlor_drape.webp` (same-canvas, pixel-aligned overlay asset).
  No icon yet — renders as a text pill.
- **Charcoal** — pickup overlay in `saturn` (banquet hall) at pixel
  (470,518) size 47x62 on `banquet_hall.webp`'s 558x771 canvas, via
  `banquet_hall_charcoal.webp`. Has an icon (`charcoal.webp`) so it renders
  as an image tile in inventory.

New reusable pattern: `ROOM_ITEM_PICKUPS` (room -> {item, overlaySrc,
hotspot}) + `collectItem()` handles any future pickup the same way — just
add an entry, no new render logic needed.

**Narcissus rubbing is now gated and functional**, not just built. A new
`components/charcoal-rubbing.tsx` implements the scratch-reveal (canvas
painted with the clean/draped image, `destination-out` compositing punches
transparent holes on drag, revealing `narcissus_statue_draped_charcoal.webp`
underneath — both assets confirmed pixel-aligned at 760x1024). The
inspector modal for `narcissus` only renders this mechanic if the player
has both "Drape" and "Charcoal" in inventory; otherwise it shows an
in-fiction line ("The relief is worn smooth...") instead of a dead end.

Scraping shows `charcoal.webp` as a tracked-position floating cursor
image, not a native CSS `cursor: url()` — that asset is 519x394, well past
the ~128px browsers actually render for custom cursors, so it's rendered
as a small `<img>` that follows pointer position instead (see `cursorPos`
state in `charcoal-rubbing.tsx`).

This session did **not** touch: the Mammon door mechanism (still the
one-click `examineDoor` stub from §11.3), any other item in the roster
(coin, holy water, oil lamp, loupe, ladder, shield — none have pickup
locations wired in code yet, only decided in conversation), the golden
box's contents, Invidia's mirror mechanic, or thesin's ember trigger.

**Bug fixed same session, after initial build**: the scratch-reveal's two
layers were drifting apart — `revealedSrc` rendered as an `<img
object-contain>` (aspect-ratio preserved, letterboxed to fit the
container) while the `<canvas>` was stretched with plain `w-full h-full`
to the *container's* box, which has a different aspect ratio than the
760x1024 art. Result: scraping appeared to erase the wrong areas, as if
the clean layer were a different size than the revealed layer underneath.
Fixed in `charcoal-rubbing.tsx` by wrapping both layers in a shared inner
box explicitly sized to the image's own aspect ratio (`aspectRatio` state,
set from `naturalWidth/naturalHeight` on image load) and centering that
box in the outer container, so the `<img>` and `<canvas>` now always
share identical dimensions instead of scaling independently.

## 12. Session 6 (2026-07-17) — status check + fixed-position drag bug

This session did not add new mansion content. It started from a bug report
("dragging the Oil Lamp onto the painting shows the lamp/glow far from the
cursor") and, while investigating, took stock of how much had been built
since §11.6 without a written recap — the summary below is that recap.
**All of the mansion work described here and in §9-11 is still uncommitted**
(`components/mansion-map-puzzle.tsx`, `painting-inspector.tsx`,
`charcoal-rubbing.tsx`, `item-drag-tray.tsx` are all untracked new files per
`git status`).

### 12.1 Bug fixed: drag ghost / lamp glow positioned relative to the wrong box

Root cause: `MansionMapPuzzle` renders inside a `backdrop-blur-sm` container
in `puzzle-content.tsx`. Per the CSS spec, `backdrop-filter` (like
`transform`/`filter`) creates a new **containing block for `position: fixed`
descendants** — so the drag ghost (`item-drag-tray.tsx`) and the Oil Lamp's
light overlay (`mansion-map-puzzle.tsx`'s `lampGlowPoint` div), both styled
`fixed` with `left/top` set from `clientX/clientY`, were being positioned
relative to that blurred box instead of the viewport. Fixed by portaling
both to `document.body` via `createPortal`. Not yet re-verified in an actual
browser (static-analysis fix only, per instruction this session) — worth a
visual pass next time the mansion level is open.

### 12.2 Where the item system actually stands (more built than §11.6 implies)

Since §11.6, without being written up, the following got wired:

- **Mammon door has a real mechanism now** — §11.3/11.4's `examineDoor`
  placeholder stub is **gone**. `gregoryAnnex` has a frog hotspot
  (`frogRef`); dropping the Coin on it sets `doorUnlocked` and swaps
  `MAMMON_DOOR_CLOSED` → `MAMMON_DOOR_OPEN`. The Coin is not consumed, so
  it's still available afterward for Mammon's own reveal (see below).
- **Coin pickup** is wired: a near-invisible hotspot in `narcissus`
  (`stillwater_room_coin.webp` overlay, with an `animate-glint` cue since
  it's a 7x7px target).
- **Loupe pickup** is wired (from the foyer/right-side jewelry hotspot per
  `foyer_right_jewelry.webp`/`foyer_right_jewelry_loupe.webp` assets) and
  gates `PaintingInspector`'s zoom buttons globally (`loupeUnlocked`) as
  designed in §9.3 — zoom no longer works for free.
- **Holy Water pickup** is wired as an `ART_ITEM_PICKUPS` entry on the
  Gregory statue (collected the same way as narcissus's charcoal/drape:
  click an overlay in the inspector modal, not drag-and-drop).
- **Drape + Charcoal → Narcissus rubbing** works end-to-end, per §11.6.

### 12.3 What's still genuinely missing — the actual gap

This is the part worth re-reading closely before the next content pass,
because it's easy to assume more is done than actually is:

- **No generic reveal-mask engine exists.** §9.3 called for one reusable
  engine (something that swaps/uncovers a hidden-detail layer, skinned per
  item) driving all 8 pieces. What actually exists is: (a) Narcissus's
  bespoke canvas scratch-reveal in `charcoal-rubbing.tsx`, and (b) nothing
  else. `painting-inspector.tsx` has zero references to `_x` assets or any
  reveal logic — grepped and confirmed empty this session.
- **Loupe-gated pieces (Mammon, Invidia, Desidia) have no reveal at all.**
  The Loupe only toggles whether `PaintingInspector`'s zoom buttons work.
  Zooming in on Mammon/Invidia/Desidia today just shows the plain base
  image at higher magnification — the `_x` variants
  (`invidia_x.webp`/`desidia_x.webp`/`mammon_x.webp`, confirmed to exist as
  real assets per §9.2) are never loaded or swapped in anywhere in the code.
- **Oil Lamp reveal is purely cosmetic.** `handleItemDragMove` sets
  `lampGlowPoint` for the visual glow (now fixed by 12.1) but nothing reads
  that point to reveal The Sin's hidden text. There's also no `the-sin_x`
  asset yet per §9.2's "missing `_x` variants" list — this can't be wired
  until that asset exists.
- **Holy Water does nothing after pickup.** It's collectible but has no
  drop/use handler anywhere — no blood-clearing effect on Ivan or Saturn.
  Same missing-asset blocker: no `_x` variants exist yet for
  `saturn-devouring-his-son.webp` (Ivan's isn't confirmed either).
- **Coin's Mammon reveal (the "double duty" from §11.5) isn't built.** The
  brass-rubbing-along-the-frame gesture was only ever a design description;
  no code implements it.
- **thesin's ember shut→open trigger is still unwired.** `setEmberOpen`
  exists but nothing calls it (same as §11.4 left it — no session since has
  touched this).
- **Invidia's item is still undecided** (mirror vs. tinted lens, §11.4) —
  moot until the reveal engine itself exists, but worth deciding alongside
  it since the mirror option needs no new asset and the lens option does.
- **Missing `_x` assets, confirmed still missing this session**:
  `saturn-devouring-his-son_x.webp`, `the-sin_x.webp`,
  `pope-gregory-i_x.webp` (if Gregory ends up needing one — currently he
  doesn't gate on a reveal, he's just the Holy Water source).
- **§7's original open items are all still open**: final solution string
  (`"life and death"` placeholder, unchanged), Gregory's Latin inscription,
  the hints array (still the old Patricia-era hints — never rewritten), and
  the butler's level-15 intro dialogue (`data/level-intro-scenes.ts:77-85`,
  still about Patricia, never rewritten to introduce the gallery wing).

### 12.4 Suggested next-session priority

The nav/room graph, inventory plumbing, and Narcissus's rubbing are solid —
no need to revisit those. The real bottleneck is that **the reveal-mask
engine described in §9.3 has never actually been built as a reusable
thing**, and three of eight pieces (Mammon, Invidia, Desidia) are fully
blocked on it while a fourth (The Sin) and part of a fifth/sixth (Ivan,
Saturn via Holy Water) are blocked on missing `_x` art assets on top of
that. Building the generic engine once (even starting with just the
loupe-magnify case, since assets already exist for those three) would
unblock the largest chunk of remaining work in one pass, rather than
building it bespoke per painting again the way Narcissus was.
