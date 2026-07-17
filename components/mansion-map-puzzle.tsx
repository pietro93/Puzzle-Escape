"use client"

import { useRef, useState } from "react"
import { createPortal } from "react-dom"
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, X } from "lucide-react"
import PaintingInspector from "./painting-inspector"
import CharcoalRubbing, { type CharcoalRubbingHandle } from "./charcoal-rubbing"
import LampReveal, { type LampRevealHandle } from "./lamp-reveal"
import ItemDragTray from "./item-drag-tray"

interface MansionMapPuzzleProps {
  onSolve: () => void
}

// foyer/gregory are each split across two screens (foyer + foyerAnnex,
// gregory + gregoryAnnex) — same physical space, two adjacent portrait-shot
// frames, so neither needs to be cropped down from a wide single image.
type Room =
  | "foyer"
  | "foyerAnnex"
  | "gregory"
  | "gregoryAnnex"
  | "invidia"
  | "ivan"
  | "narcissus"
  | "thesin"
  | "desidia"
  | "saturn"
  | "mammon"
type Direction = "north" | "south" | "east" | "west"

// Most rooms are dead-end branches off the main loop — their only way out is
// back the way the player came in, not a fixed room. "back" is resolved at
// navigation time to whichever room the player was last in (see
// `previousRoom` below), so the same room can be re-entered from more than
// one direction without needing a second hardcoded connection.
const BACK = "back" as const
type ConnectionTarget = Room | typeof BACK

const ROOM_CONNECTIONS: Record<Room, Partial<Record<Direction, ConnectionTarget>>> = {
  foyer: { north: "saturn", east: "foyerAnnex", west: "thesin" },
  foyerAnnex: { west: "foyer", east: "narcissus", north: "gregory" },
  gregory: { south: "foyer", east: "gregoryAnnex", north: "ivan" },
  gregoryAnnex: { west: "gregory", north: "ivan", south: BACK },
  invidia: { south: BACK },
  ivan: { south: BACK },
  narcissus: { west: BACK },
  mammon: { south: BACK },
  thesin: { east: "foyer", north: "invidia", west: "desidia" },
  desidia: { east: BACK },
  saturn: { south: BACK },
}

const ROOM_LABELS: Record<Room, string> = {
  foyer: "Foyer",
  foyerAnnex: "Foyer",
  gregory: "Alcove of Pope Gregory I",
  gregoryAnnex: "Alcove of Pope Gregory I",
  invidia: "Invidia",
  ivan: "Ivan the Terrible and His Son",
  narcissus: "Narcissus",
  thesin: "The Sin",
  desidia: "Desidia",
  saturn: "Saturn Devouring His Son",
  mammon: "Mammon",
}

// Title/artist/date are placeholders — final wall-plaque copy is still being
// written (see redesign doc §7). Kept plain rather than inventing fake
// specifics so nobody mistakes these for real content.
const ROOM_ART: Partial<Record<Room, { src: string; alt: string; title: string; artist: string; date: string }>> = {
  gregory: {
    src: "/images/paintings/pope-gregory-i.webp",
    alt: "A statue of Pope Gregory I",
    title: "Pope Gregory I",
    artist: "Artist unknown",
    date: "Date unknown",
  },
  invidia: {
    src: "/images/paintings/invidia.webp",
    alt: "A fresco depicting Invidia",
    title: "Invidia",
    artist: "Artist unknown",
    date: "Date unknown",
  },
  ivan: {
    src: "/images/paintings/ivan-the-terrible-and-his-son.webp",
    alt: "Ivan the Terrible and his son",
    title: "Ivan the Terrible and His Son",
    artist: "Artist unknown",
    date: "Date unknown",
  },
  narcissus: {
    src: "/images/paintings/narcissus.webp",
    alt: "A marble statue of Narcissus",
    title: "Narcissus",
    artist: "Artist unknown",
    date: "Date unknown",
  },
  thesin: {
    src: "/images/paintings/the-sin.webp",
    alt: "A painting titled The Sin",
    title: "The Sin",
    artist: "Artist unknown",
    date: "Date unknown",
  },
  desidia: {
    src: "/images/paintings/desidia.webp",
    alt: "An engraving depicting Desidia",
    title: "Desidia",
    artist: "Artist unknown",
    date: "Date unknown",
  },
  saturn: {
    src: "/images/paintings/saturn-devouring-his-son.webp",
    alt: "Saturn Devouring His Son",
    title: "Saturn Devouring His Son",
    artist: "Artist unknown",
    date: "Date unknown",
  },
  mammon: {
    src: "/images/paintings/mammon.webp",
    alt: "A painting depicting Mammon",
    title: "Mammon",
    artist: "Artist unknown",
    date: "Date unknown",
  },
}

// Room background art, one per room. Each already has its painting/statue
// (and, for most, its plaque) composited into the scene at a small,
// unzoomed scale. `aspect` is the source image's own width/height, used to
// work out how much of it BOX_ASPECT crops away (see mapToBox below).
// thesin's src is overridden dynamically below (see EMBER_ROOM_*) — the
// value here is just the closed-door default.
const ROOM_BACKGROUNDS: Record<Room, { src: string; aspect: number }> = {
  foyer: { src: "/images/paintings/foyer_left.webp", aspect: 494 / 600 },
  foyerAnnex: { src: "/images/paintings/foyer_right.webp", aspect: 494 / 600 },
  gregory: { src: "/images/paintings/saint_alcove_left.webp", aspect: 560 / 596 },
  gregoryAnnex: { src: "/images/paintings/saint_alcove_right.webp", aspect: 469 / 600 },
  invidia: { src: "/images/paintings/green_parlor.webp", aspect: 704 / 893 },
  ivan: { src: "/images/paintings/crimson_study.webp", aspect: 774 / 797 },
  narcissus: { src: "/images/paintings/stillwater_room.webp", aspect: 760 / 893 },
  thesin: { src: "/images/paintings/ember_room_shut.webp", aspect: 495 / 644 },
  desidia: { src: "/images/paintings/drowsing_parlor.webp", aspect: 597 / 740 },
  saturn: { src: "/images/paintings/banquet_hall.webp", aspect: 558 / 771 },
  mammon: { src: "/images/paintings/golden_hall.webp", aspect: 592 / 913 },
}

// thesin's room ("ember room") has two states — its painting is hidden
// (ember_room_shut) until whatever future minor puzzle reveals it
// (ember_room_open). Not wired to a trigger yet; defaults closed.
const EMBER_ROOM_SHUT = "/images/paintings/ember_room_shut.webp"
const EMBER_ROOM_OPEN = "/images/paintings/ember_room_open.webp"

// The room viewport is a single fixed aspect ratio across every room (so the
// puzzle never resizes as the player moves), close to the images' own
// portrait aspect. Rooms wider than this get cropped to fill it — see
// mapToBox — with the crop centered on ROOM_FOCUS so the art stays in view.
const BOX_ASPECT = 3 / 4

// Center of interest (percent of the *source* image) that object-position
// keeps visible when a room's image is cropped to fit BOX_ASPECT. For art
// rooms this is the art hotspot's own center; annex/foyer rooms have no art
// so they're pointed at whatever the image's own focal point is.
const ROOM_FOCUS: Record<Room, { x: number; y: number }> = {
  foyer: { x: 50, y: 55 },
  foyerAnnex: { x: 45, y: 50 },
  gregory: { x: 55, y: 50 },
  gregoryAnnex: { x: 50, y: 50 },
  invidia: { x: 65.5, y: 30.5 },
  ivan: { x: 50.5, y: 31.5 },
  narcissus: { x: 46.5, y: 65 },
  thesin: { x: 49, y: 30 },
  desidia: { x: 70, y: 36 },
  saturn: { x: 52, y: 29 },
  mammon: { x: 48.5, y: 50 },
}

type Rect = { left: number; top: number; width: number; height: number }

// Item overlays: a full-canvas image (same pixel dimensions as the room
// background, transparent except for the item itself) composited on top of
// the background at the same object-position, so it stays pixel-aligned as
// the room crops to BOX_ASPECT. `hotspot` (percent of source image) is the
// clickable area; collecting the item hides the overlay for good. `item` is
// the display name stored directly in inventory — same convention as
// prison-cell-puzzle.tsx's "Rag"/"Rubbing Alcohol"/"Lit Cigarette" entries.
// `message` is the flavor line shown in the dialogue modal the instant the
// item is collected — same convention as prison-cell-puzzle.tsx (level 1):
// one click both adds the item to inventory AND shows the line, no separate
// confirm/take step.
const ROOM_ITEM_PICKUPS: Partial<Record<Room, { item: string; overlaySrc: string; hotspot: Rect; message: string }>> = {
  desidia: {
    item: "Drape",
    overlaySrc: "/images/paintings/drowsing_parlor_drape.webp",
    hotspot: { left: (91 / 597) * 100, top: (316 / 740) * 100, width: (196 / 597) * 100, height: (257 / 740) * 100 },
    message: "You pull the drape free of the sofa, dust catching the light.",
  },
  saturn: {
    item: "Charcoal",
    overlaySrc: "/images/paintings/banquet_hall_charcoal.webp",
    hotspot: { left: (470 / 558) * 100, top: (518 / 771) * 100, width: (47 / 558) * 100, height: (62 / 771) * 100 },
    message: "A stick of charcoal, cold and brittle, plucked from the dead hearth.",
  },
  foyerAnnex: {
    item: "Loupe",
    overlaySrc: "/images/paintings/foyer_right_jewelry_loupe.webp",
    hotspot: { left: (276 / 494) * 100, top: (335 / 600) * 100, width: (19 / 494) * 100, height: (31 / 600) * 100 },
    message: "You ease the loupe free of the mannequin's staring eye.",
  },
  ivan: {
    item: "Oil Lamp",
    overlaySrc: "/images/paintings/crimson_study_oil_lamp.webp",
    hotspot: { left: (131 / 774) * 100, top: (485 / 797) * 100, width: (70 / 774) * 100, height: (108 / 797) * 100 },
    message: "A brass oil lamp, tucked in the corner. The wick still holds enough fuel to light.",
  },
  narcissus: {
    item: "Coin",
    overlaySrc: "/images/paintings/stillwater_room_coin.webp",
    hotspot: { left: (484 / 760) * 100, top: (851 / 893) * 100, width: (7 / 760) * 100, height: (7 / 893) * 100 },
    message: "A small coin, half-sunk at the pool's edge.",
  },
  mammon: {
    item: "Caliche",
    overlaySrc: "/images/paintings/golden_hall_caliche.webp",
    hotspot: { left: (520 / 592) * 100, top: (637 / 913) * 100, width: (35 / 592) * 100, height: (58 / 913) * 100 },
    message: "A small clay caliche, empty and dusty.",
  },
}

// Item pickups that sit on the art's own detail image (as opened in
// PaintingInspector) rather than on the small unzoomed room background —
// for items found "on" a statue/painting itself, not elsewhere in the room.
// overlaySrc is pixel-aligned to ROOM_ART's src, not ROOM_BACKGROUNDS'.
const ART_ITEM_PICKUPS: Partial<Record<Room, { item: string; overlaySrc: string; hotspot: Rect; message: string }>> = {
  gregory: {
    item: "Holy Water",
    overlaySrc: "/images/paintings/pope-gregory-i_holy_water.webp",
    hotspot: { left: (277 / 493) * 100, top: (362 / 1024) * 100, width: (82 / 493) * 100, height: (117 / 1024) * 100 },
    message: "A small flask, engraved with AQVA BENEDICTA. Holy water, still faintly cool.",
  },
}

// Non-pickable flavor hotspots — click shows a dialogue line and nothing
// else (no inventory change), repeatable indefinitely. Same generic
// dialogue modal as the item pickups below, just without the collectItem
// side effect. hotspot is percent of ROOM_BACKGROUNDS' source image.
const ROOM_OBSERVATIONS: Partial<Record<Room, { hotspot: Rect; message: string }[]>> = {
  foyerAnnex: [
    {
      hotspot: { left: (182 / 494) * 100, top: (354 / 600) * 100, width: (79 / 494) * 100, height: (56 / 600) * 100 },
      message: "A cushion, tasseled and worn, showing off jewelry inlaid with rubies.",
    },
    {
      hotspot: { left: (256 / 494) * 100, top: (318 / 600) * 100, width: (33 / 494) * 100, height: (60 / 600) * 100 },
      message: "A featureless mannequin head, its expression locked in a permanent wince.",
    },
  ],
}

// Permanent, non-pickable scene overlay for foyerAnnex — the jewelry cushion
// and mannequin, pixel-aligned to foyer_right.webp. Rendered underneath the
// Loupe pickup overlay above; unlike item pickups this one never goes away.
const FOYER_ANNEX_JEWELRY_OVERLAY = "/images/paintings/foyer_right_jewelry.webp"

// Mammon's door — a locked entrance composited into gregoryAnnex's scene,
// pixel-aligned to saint_alcove_right.webp (469x600). Two states: shut until
// the frog's mouth takes a coin, then swings open for good. The frog itself
// never hints that a coin is what it wants — the player has to notice the
// mouth first.
const MAMMON_DOOR_CLOSED = "/images/paintings/golden_door_closed.webp"
const MAMMON_DOOR_OPEN = "/images/paintings/golden_door_open.webp"
const MAMMON_DOOR_HOTSPOT: Rect = {
  left: (329 / 469) * 100,
  top: (122 / 600) * 100,
  width: (88 / 469) * 100,
  height: (259 / 600) * 100,
}
const MAMMON_FROG_HOTSPOT: Rect = {
  left: (330 / 469) * 100,
  top: (305 / 600) * 100,
  width: (41 / 469) * 100,
  height: (45 / 600) * 100,
}

// Mammon's salt chest — pixel-aligned to golden_hall.webp (592x913). The
// closed state is already baked into golden_hall.webp itself; clicking it
// swaps in golden_hall_chest_open.webp, a full-canvas overlay showing the
// lid open with salt inside. The click hotspot stays mounted after opening
// (same div, same ref used for the Caliche drop-target below) — only the
// dialogue changes from "open" to "examine".
const GOLDEN_HALL_CHEST_OPEN = "/images/paintings/golden_hall_chest_open.webp"
const MAMMON_CHEST_HOTSPOT: Rect = {
  left: (453 / 592) * 100,
  top: (601 / 913) * 100,
  width: (82 / 592) * 100,
  height: (79 / 913) * 100,
}
// Inventory icons — same convention as prison-cell-puzzle.tsx's getItemImage:
// items without an entry here fall back to a plain text pill in the
// Inventory Display panel. Caliche swaps between these two depending on
// whether it currently holds salt (see caliceFilled state) — computed per
// render, not a static entry here.
const ITEM_ICONS: Record<string, string> = {
  Charcoal: "/images/paintings/charcoal.webp",
  Loupe: "/images/paintings/loupe.webp",
  "Oil Lamp": "/images/paintings/oil_lamp.webp",
}
const CALICHE_EMPTY_ICON = "/images/paintings/caliche.webp"
const CALICHE_FILLED_ICON = "/images/paintings/caliche_salt.webp"

// Clickable hotspot rects (percent of the *source* image) over the art
// itself and over its in-scene plaque, hand-placed to match each background.
// thesin's is placed over ember_room_open — irrelevant while shut, since
// no art hotspot renders until the room is opened (see render below).
const ART_HOTSPOTS: Partial<Record<Room, Rect>> = {
  gregory: { left: 33, top: 8, width: 45, height: 85 },
  invidia: { left: 43, top: 20, width: 45, height: 21 },
  ivan: { left: (122 / 774) * 100, top: (71 / 797) * 100, width: (531 / 774) * 100, height: (390 / 797) * 100 },
  narcissus: { left: 30, top: 43, width: 33, height: 44 },
  thesin: { left: 27, top: 5, width: 44, height: 31 },
  desidia: { left: 53, top: 27, width: 35, height: 19 },
  saturn: { left: 33, top: 15, width: 38, height: 28 },
  mammon: { left: 19, top: 32, width: 59, height: 36 },
}

const PLAQUE_HOTSPOTS: Partial<Record<Room, Rect>> = {
  gregory: { left: 38, top: 80, width: 20, height: 8 },
  invidia: { left: 47, top: 42, width: 33, height: 3 },
  ivan: { left: (324 / 774) * 100, top: (470 / 797) * 100, width: (131 / 774) * 100, height: (37 / 797) * 100 },
  narcissus: { left: 33, top: 87, width: 25, height: 4 },
  thesin: { left: 40, top: 38, width: 20, height: 4 },
  desidia: { left: 55, top: 47, width: 30, height: 6 },
  saturn: { left: 39, top: 50, width: 24, height: 4 },
  mammon: { left: 32, top: 68, width: 35, height: 3 },
}

// Reprojects a hotspot rect defined in source-image percent onto the
// cropped, fixed-aspect box the room actually renders in (object-cover with
// object-position `focus`), so clicks still land on the art.
//
// cropLeft/cropTop must match the CSS object-position formula exactly:
// offset = (containerSize - renderedSize) * (focus/100), which as a fraction
// of the source image works out to `(focus/100) * (1 - visibleFrac)` — a
// straight lerp from 0 (focus 0%, all overflow cropped from the far edge) to
// `1 - visibleFrac` (focus 100%, all overflow cropped from the near edge).
// A previous version used `focus/100 - visibleFrac/2` clamped to that same
// range — a "center the viewport on focus" model that only happens to agree
// with the real formula at focus = 0, 50, or 100, and drifts everywhere else
// (e.g. focus.x=45 on foyerAnnex was off by ~4% of the image width), which
// is why hotspots could look slightly detached from the art they sit on.
function mapToBox(rect: Rect, imageAspect: number, focus: { x: number; y: number }): Rect {
  if (imageAspect > BOX_ASPECT) {
    // Image is relatively wider than the box: object-cover matches box
    // height and crops the sides.
    const visibleFrac = BOX_ASPECT / imageAspect
    const cropLeft = (focus.x / 100) * (1 - visibleFrac)
    return {
      left: (rect.left / 100 - cropLeft) * (100 / visibleFrac),
      top: rect.top,
      width: (rect.width / 100) * (100 / visibleFrac),
      height: rect.height,
    }
  }
  if (imageAspect < BOX_ASPECT) {
    // Image is relatively taller than the box: object-cover matches box
    // width and crops top/bottom.
    const visibleFrac = imageAspect / BOX_ASPECT
    const cropTop = (focus.y / 100) * (1 - visibleFrac)
    return {
      left: rect.left,
      top: (rect.top / 100 - cropTop) * (100 / visibleFrac),
      width: rect.width,
      height: (rect.height / 100) * (100 / visibleFrac),
    }
  }
  return rect
}

export default function MansionMapPuzzle({ onSolve }: MansionMapPuzzleProps) {
  const [currentRoom, setCurrentRoom] = useState<Room>("foyer")
  // Tracks the room navigated from, so BACK connections (dead-end rooms
  // reachable from more than one direction) return to wherever the player
  // actually came from rather than a hardcoded room.
  const [previousRoom, setPreviousRoom] = useState<Room | null>(null)
  const [doorUnlocked, setDoorUnlocked] = useState(false)
  // Mammon's salt chest: opened by a click (stays open permanently), then
  // the Caliche can be filled from it by dragging, any number of times.
  const [chestOpen, setChestOpen] = useState(false)
  // Whether the Caliche currently holds a scoop of salt. Filled by dragging
  // it onto the open chest, emptied by using it (see next session's Ivan/
  // Saturn salt-then-holy-water wiring) — refillable indefinitely, unlike
  // the Drape's one-shot consumption.
  const [caliceFilled, setCaliceFilled] = useState(false)
  const [inspecting, setInspecting] = useState(false)
  const [showPlaqueInfo, setShowPlaqueInfo] = useState(false)
  // Not wired to a trigger yet — Invidia's painting stays hidden until a
  // future unlock mechanism sets this true.
  const [emberOpen, setEmberOpen] = useState(false)
  // Flat array of display-name strings, same convention as
  // prison-cell-puzzle.tsx's inventory ("Rag", "Rubbing Alcohol", ...).
  const [inventory, setInventory] = useState<string[]>([])
  // Whether the Drape has been dragged onto the bare Narcissus statue.
  // Permanent once set — the statue doesn't undrape.
  const [narcissusDraped, setNarcissusDraped] = useState(false)
  // Snapshot of the charcoal-rubbing canvas (a data URL), persisted here so
  // scratch progress survives closing the inspector or leaving the room —
  // CharcoalRubbing itself unmounts and remounts fresh each time.
  const [narcissusScratchSnapshot, setNarcissusScratchSnapshot] = useState<string | null>(null)
  // Whether the Loupe has been dragged onto any painting yet. Permanent
  // once unlocked (a capability, not a held tool) — see PaintingInspector's
  // zoomEnabled prop, which every inspector view is gated behind.
  const [loupeUnlocked, setLoupeUnlocked] = useState(false)
  // Client-space point of the Oil Lamp's glow, while it's being dragged over
  // the art viewport — null the rest of the time (not dragging it, or
  // dragging it somewhere else). Purely cosmetic, unlike loupeUnlocked.
  const [lampGlowPoint, setLampGlowPoint] = useState<{ x: number; y: number } | null>(null)
  // A single dialogue line shown in a dismissible modal — same generic
  // pattern as prison-cell-puzzle.tsx (level 1): fires on every item pickup
  // (collect + show, one click, no separate confirm step) and on
  // non-pickable "observe" hotspots (shows repeatably, no side effect).
  const [dialogue, setDialogue] = useState<string | null>(null)
  // Drop target for item-drag-tray: whichever art viewport is currently on
  // screen inside the inspector (bare statue / charcoal rubbing / painting
  // inspector all share this one ref so drop hit-testing works uniformly).
  const artViewportRef = useRef<HTMLDivElement>(null)
  const charcoalRubbingRef = useRef<CharcoalRubbingHandle>(null)
  const lampRevealRef = useRef<LampRevealHandle>(null)
  // Drop target for the frog's mouth (gregoryAnnex only) — separate from
  // artViewportRef since this drop happens in the room view, not inside the
  // art inspector modal.
  const frogRef = useRef<HTMLDivElement>(null)

  const collectItem = (item: string) => {
    setInventory((prev) => (prev.includes(item) ? prev : [...prev, item]))
  }

  // Single click both collects the item and shows its flavor line — same
  // convention as prison-cell-puzzle.tsx (level 1), no separate confirm step.
  const pickupItem = (item: string, message: string) => {
    collectItem(item)
    setDialogue(message)
  }

  const isOverArtViewport = (point: { x: number; y: number }) => {
    const el = artViewportRef.current
    if (!el) return false
    const rect = el.getBoundingClientRect()
    return point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom
  }

  // Charcoal is a continuous tool: every point along the drag scratches a
  // stroke, as long as the drag stays over the Narcissus rubbing and the
  // drape has already been applied. The Oil Lamp is a continuous tool too,
  // but a purely visual one — it casts a warm glow at the drag point for as
  // long as it's held over the art viewport, rather than changing state.
  const handleItemDragMove = (item: string, point: { x: number; y: number } | null) => {
    if (item === "Charcoal" && currentRoom === "narcissus" && narcissusDraped) {
      if (point) {
        charcoalRubbingRef.current?.scratchAt(point)
      } else {
        charcoalRubbingRef.current?.endStroke()
      }
    }
    if (item === "Oil Lamp") {
      setLampGlowPoint(point && isOverArtViewport(point) ? point : null)
      if (currentRoom === "thesin") {
        lampRevealRef.current?.revealAt(point)
      }
    }
  }

  // Drape and the Loupe are one-shot: dropping them onto the art viewport
  // applies a permanent effect and (for the Drape) consumes the item.
  const handleItemDrop = (item: string, point: { x: number; y: number }) => {
    if (!isOverArtViewport(point)) return
    if (item === "Drape" && currentRoom === "narcissus" && !narcissusDraped) {
      setNarcissusDraped(true)
      setInventory((prev) => prev.filter((i) => i !== "Drape"))
    }
    if (item === "Loupe" && !loupeUnlocked) {
      setLoupeUnlocked(true)
    }
  }

  // Drop handler for the room-view tray (as opposed to handleItemDrop above,
  // which is scoped to the art inspector modal) — currently only the frog's
  // mouth in gregoryAnnex reacts to a drop.
  const handleRoomItemDrop = (item: string, point: { x: number; y: number }) => {
    if (item !== "Coin" || currentRoom !== "gregoryAnnex" || doorUnlocked) return
    const el = frogRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    if (point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom) {
      setDoorUnlocked(true)
      setDialogue("The frog's jaw snaps shut around the coin. Somewhere inside the door, gears turn, and the golden door creaks open.")
    }
  }

  const connections = ROOM_CONNECTIONS[currentRoom]
  const art = currentRoom === "thesin" && !emberOpen ? undefined : ROOM_ART[currentRoom]
  const background = ROOM_BACKGROUNDS[currentRoom]
  const backgroundSrc = currentRoom === "thesin" ? (emberOpen ? EMBER_ROOM_OPEN : EMBER_ROOM_SHUT) : background.src
  const focus = ROOM_FOCUS[currentRoom]
  const artHotspotSrc = ART_HOTSPOTS[currentRoom]
  const plaqueHotspotSrc = PLAQUE_HOTSPOTS[currentRoom]
  const artHotspot = art && artHotspotSrc && mapToBox(artHotspotSrc, background.aspect, focus)
  const plaqueHotspot = art && plaqueHotspotSrc && mapToBox(plaqueHotspotSrc, background.aspect, focus)
  const itemPickup = ROOM_ITEM_PICKUPS[currentRoom]
  const showItemPickup = itemPickup && !inventory.includes(itemPickup.item)
  const hasDrape = inventory.includes("Drape")
  const itemPickupHotspot = itemPickup && mapToBox(itemPickup.hotspot, background.aspect, focus)
  const artItemPickup = ART_ITEM_PICKUPS[currentRoom]
  const showArtItemPickup = artItemPickup && !inventory.includes(artItemPickup.item)
  const observations = ROOM_OBSERVATIONS[currentRoom] ?? []
  const mammonDoorHotspot =
    currentRoom === "gregoryAnnex" ? mapToBox(MAMMON_DOOR_HOTSPOT, background.aspect, focus) : null
  const mammonFrogHotspot =
    currentRoom === "gregoryAnnex" ? mapToBox(MAMMON_FROG_HOTSPOT, background.aspect, focus) : null

  const navigate = (direction: Direction) => {
    const target = connections[direction]
    if (!target) return
    const destination = target === BACK ? previousRoom : target
    if (!destination) return
    setPreviousRoom(currentRoom)
    setCurrentRoom(destination)
  }

  const openInspector = () => {
    if (!art) return
    setInspecting(true)
    if (currentRoom === "gregory") onSolve()
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gray-900/80 p-4 rounded-lg border border-gray-800 mb-4">
        <p className="text-gray-300 font-mono text-sm">{ROOM_LABELS[currentRoom]}</p>
      </div>

      <div className="relative bg-gradient-to-b from-gray-950 to-black p-2 rounded-lg border border-gray-800 mb-4">
        <div
          className="relative w-full rounded-lg border border-gray-800 bg-black overflow-hidden"
          style={{ aspectRatio: BOX_ASPECT }}
        >
          <img
            src={backgroundSrc}
            alt={ROOM_LABELS[currentRoom]}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: `${focus.x}% ${focus.y}%` }}
          />

          {art && artHotspot && (
            <button
              onClick={openInspector}
              aria-label={`Examine ${art.title}`}
              className="absolute rounded hover:bg-white/10 hover:ring-1 hover:ring-white/30 transition-colors"
              style={{
                left: `${artHotspot.left}%`,
                top: `${artHotspot.top}%`,
                width: `${artHotspot.width}%`,
                height: `${artHotspot.height}%`,
              }}
            />
          )}

          {currentRoom === "foyerAnnex" && (
            <img
              src={FOYER_ANNEX_JEWELRY_OVERLAY}
              alt=""
              aria-hidden
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              style={{ objectPosition: `${focus.x}% ${focus.y}%` }}
            />
          )}

          {currentRoom === "gregoryAnnex" && (
            <img
              src={doorUnlocked ? MAMMON_DOOR_OPEN : MAMMON_DOOR_CLOSED}
              alt=""
              aria-hidden
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              style={{ objectPosition: `${focus.x}% ${focus.y}%` }}
            />
          )}

          {showItemPickup && itemPickup && itemPickupHotspot && (
            <img
              src={itemPickup.overlaySrc}
              alt=""
              aria-hidden
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              style={{ objectPosition: `${focus.x}% ${focus.y}%` }}
            />
          )}

          {/* Barely-visible glint over the Coin — it's a 7x7px pickup, easy
              to miss entirely, so a faint pulsing highlight nudges the eye
              there without reading as an obvious "item here" marker. */}
          {showItemPickup && itemPickup?.item === "Coin" && itemPickupHotspot && (
            <div
              aria-hidden
              className="absolute rounded-full pointer-events-none animate-glint"
              style={{
                left: `${itemPickupHotspot.left + itemPickupHotspot.width / 2}%`,
                top: `${itemPickupHotspot.top + itemPickupHotspot.height / 2}%`,
                width: `${itemPickupHotspot.width * 2}%`,
                height: `${itemPickupHotspot.height * 2}%`,
                background:
                  "radial-gradient(circle, rgba(255,245,200,0.9) 0%, rgba(255,230,150,0.35) 45%, transparent 85%)",
              }}
            />
          )}

          {/* Observation hotspots render before the item pickup's hotspot
              button below so that, where the two overlap (e.g. the Loupe
              sitting on the mannequin's face), the pickup — the more
              specific, more valuable target — wins the click instead of
              being shadowed by the broader observation hotspot underneath. */}
          {observations.map((obs, i) => {
            const hotspot = mapToBox(obs.hotspot, background.aspect, focus)
            return (
              <button
                key={i}
                onClick={() => setDialogue(obs.message)}
                aria-label="Examine"
                className="absolute rounded hover:bg-white/10 hover:ring-1 hover:ring-white/30 transition-colors"
                style={{
                  left: `${hotspot.left}%`,
                  top: `${hotspot.top}%`,
                  width: `${hotspot.width}%`,
                  height: `${hotspot.height}%`,
                }}
              />
            )
          })}

          {showItemPickup && itemPickup && itemPickupHotspot && (
            <button
              onClick={() => pickupItem(itemPickup.item, itemPickup.message)}
              aria-label={`Pick up ${itemPickup.item}`}
              className="absolute rounded hover:bg-white/10 hover:ring-1 hover:ring-white/30 transition-colors"
              style={{
                left: `${itemPickupHotspot.left}%`,
                top: `${itemPickupHotspot.top}%`,
                width: `${itemPickupHotspot.width}%`,
                height: `${itemPickupHotspot.height}%`,
              }}
            />
          )}

          {art && plaqueHotspot && (
            <button
              onClick={() => setShowPlaqueInfo(true)}
              aria-label={`Read plaque for ${art.title}`}
              className="absolute rounded-sm hover:bg-white/10 hover:ring-1 hover:ring-white/30 transition-colors"
              style={{
                left: `${plaqueHotspot.left}%`,
                top: `${plaqueHotspot.top}%`,
                width: `${plaqueHotspot.width}%`,
                height: `${plaqueHotspot.height}%`,
              }}
            />
          )}

          {currentRoom === "gregoryAnnex" && !doorUnlocked && mammonDoorHotspot && (
            <button
              onClick={() => setDialogue("A heavy golden door, sealed shut. The handles won't budge, no keyhole in sight.")}
              aria-label="Examine the door"
              className="absolute"
              style={{
                left: `${mammonDoorHotspot.left}%`,
                top: `${mammonDoorHotspot.top}%`,
                width: `${mammonDoorHotspot.width}%`,
                height: `${mammonDoorHotspot.height}%`,
              }}
            />
          )}
          {currentRoom === "gregoryAnnex" && !doorUnlocked && mammonFrogHotspot && (
            <div
              ref={frogRef}
              className="absolute"
              style={{
                left: `${mammonFrogHotspot.left}%`,
                top: `${mammonFrogHotspot.top}%`,
                width: `${mammonFrogHotspot.width}%`,
                height: `${mammonFrogHotspot.height}%`,
              }}
            >
              <button
                onClick={() => setDialogue("A brass frog's head juts from the doorframe, mouth open in a wide, hungry grin.")}
                aria-label="Examine the frog"
                className="absolute inset-0 rounded-full hover:bg-white/10 hover:ring-1 hover:ring-white/30 transition-colors"
              />
            </div>
          )}
          {currentRoom === "gregoryAnnex" && doorUnlocked && mammonDoorHotspot && (
            <button
              onClick={() => {
                setPreviousRoom(currentRoom)
                setCurrentRoom("mammon")
              }}
              aria-label="Enter Mammon's room"
              className="absolute hover:bg-white/10 hover:ring-1 hover:ring-white/30 transition-colors"
              style={{
                left: `${mammonDoorHotspot.left}%`,
                top: `${mammonDoorHotspot.top}%`,
                width: `${mammonDoorHotspot.width}%`,
                height: `${mammonDoorHotspot.height}%`,
              }}
            />
          )}

          <NavArrow direction="north" available={!!connections.north} onClick={() => navigate("north")} />
          <NavArrow direction="south" available={!!connections.south} onClick={() => navigate("south")} />
          <NavArrow direction="east" available={!!connections.east} onClick={() => navigate("east")} />
          <NavArrow direction="west" available={!!connections.west} onClick={() => navigate("west")} />

          {/* Examine/plaque popups are scoped to this room-view box (not a
              viewport-wide overlay) so they dim and center over just the
              navigation area, leaving the room label above untouched — same
              convention as prison-cell-puzzle.tsx's dialogue modal. */}
          {showPlaqueInfo && art && (
            <div
              className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
              onClick={() => setShowPlaqueInfo(false)}
            >
              <div
                className="bg-[#1a1410] border-2 border-[#4a3a20] rounded-lg p-5 max-w-xs w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-amber-100/90 font-mono text-sm font-bold">{art.title}</h3>
                  <button onClick={() => setShowPlaqueInfo(false)} aria-label="Close">
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
                <p className="text-gray-400 font-mono text-xs">{art.artist}</p>
                <p className="text-gray-500 font-mono text-xs">{art.date}</p>
              </div>
            </div>
          )}

          {dialogue && (
            <div
              className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
              onClick={() => setDialogue(null)}
            >
              <div
                className="bg-[#1a1410] border-2 border-[#4a3a20] rounded-lg p-5 max-w-xs w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <p className="text-gray-300 font-mono text-sm">{dialogue}</p>
                <button
                  onClick={() => setDialogue(null)}
                  className="mt-4 w-full px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-xs text-gray-200 font-mono border border-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Inventory tray — draggable so items can be dropped onto room-view
          hotspots (e.g. the Coin onto gregoryAnnex's frog), not just onto
          the art inspector. Icon tile if ITEM_ICONS has one, otherwise a
          plain text pill, same convention as prison-cell-puzzle.tsx. */}
      {inventory.length > 0 && (
        <div className="bg-gray-800/50 p-2 rounded-md shadow-md mb-4">
          <ItemDragTray items={inventory} icons={ITEM_ICONS} onDrop={handleRoomItemDrop} />
        </div>
      )}

      {inspecting && art && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4">
          <button
            onClick={() => setInspecting(false)}
            aria-label="Close"
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center border border-gray-700"
          >
            <X className="w-5 h-5 text-gray-300" />
          </button>
          <p className="text-gray-300 font-mono text-sm mb-3">{art.title}</p>
          {currentRoom === "narcissus" ? (
            narcissusDraped ? (
              <div ref={artViewportRef} className="w-full max-w-lg h-[60vh]">
                <CharcoalRubbing
                  ref={charcoalRubbingRef}
                  cleanSrc="/images/paintings/narcissus_statue_draped.webp"
                  revealedSrc="/images/paintings/narcissus_statue_draped_charcoal.webp"
                  alt={art.alt}
                  className="w-full h-full"
                  zoomEnabled={loupeUnlocked}
                  initialSnapshot={narcissusScratchSnapshot ?? undefined}
                  onStrokeEnd={setNarcissusScratchSnapshot}
                />
              </div>
            ) : (
              <div ref={artViewportRef} className="w-full max-w-lg h-[60vh]">
                <PaintingInspector
                  src="/images/paintings/narcissus_statue.webp"
                  alt={art.alt}
                  className="w-full h-full"
                  zoomEnabled={loupeUnlocked}
                />
              </div>
            )
          ) : currentRoom === "thesin" ? (
            <div ref={artViewportRef} className="w-full max-w-lg h-[60vh]">
              <LampReveal
                ref={lampRevealRef}
                cleanSrc="/images/paintings/the-sin.webp"
                revealedSrc="/images/paintings/the-sin_exposed.webp"
                alt={art.alt}
                className="w-full h-full"
                zoomEnabled={loupeUnlocked}
              />
            </div>
          ) : (
            <div ref={artViewportRef} className="w-full max-w-lg h-[60vh]">
              <PaintingInspector
                src={art.src}
                alt={art.alt}
                className="w-full h-full"
                zoomEnabled={loupeUnlocked}
                itemPickup={
                  showArtItemPickup && artItemPickup
                    ? {
                        overlaySrc: artItemPickup.overlaySrc,
                        hotspot: artItemPickup.hotspot,
                        label: artItemPickup.item,
                        onCollect: () => pickupItem(artItemPickup.item, artItemPickup.message),
                      }
                    : undefined
                }
              />
            </div>
          )}

          {/* Oil Lamp glow: a warm light that follows the lamp while it's
              dragged over the art viewport, as if the player were holding it
              up to the painting. Purely cosmetic — z-40 keeps it above the
              art but below the dragged lamp icon itself (z-60). */}
          {lampGlowPoint &&
            createPortal(
              // Portaled to <body> for the same reason as item-drag-tray's
              // ghost: this screen sits inside a backdrop-blur-sm ancestor,
              // which becomes the containing block for `position: fixed`
              // descendants and would otherwise offset the glow far from
              // the actual cursor.
              <div
                aria-hidden
                className="fixed z-40 pointer-events-none rounded-full"
                style={{
                  left: lampGlowPoint.x,
                  top: lampGlowPoint.y,
                  width: 280,
                  height: 280,
                  transform: "translate(-50%, -50%)",
                  background:
                    "radial-gradient(circle, rgba(255,200,120,0.4) 0%, rgba(255,170,80,0.18) 45%, transparent 72%)",
                  mixBlendMode: "screen",
                }}
              />,
              document.body,
            )}

          {inventory.length > 0 && (
            <ItemDragTray
              items={inventory}
              icons={ITEM_ICONS}
              onDragMove={handleItemDragMove}
              onDrop={handleItemDrop}
              className="absolute bottom-4 left-0 right-0 px-4"
            />
          )}
        </div>
      )}

    </div>
  )
}

const NAV_ARROW_ICON: Record<Direction, typeof ChevronUp> = {
  north: ChevronUp,
  south: ChevronDown,
  east: ChevronRight,
  west: ChevronLeft,
}

const NAV_ARROW_POSITION: Record<Direction, string> = {
  north: "top-2 left-1/2 -translate-x-1/2",
  south: "bottom-2 left-1/2 -translate-x-1/2",
  east: "right-2 top-1/2 -translate-y-1/2",
  west: "left-2 top-1/2 -translate-y-1/2",
}

function NavArrow({
  direction,
  available,
  onClick,
}: {
  direction: Direction
  available: boolean
  onClick: () => void
}) {
  if (!available) return null
  const Icon = NAV_ARROW_ICON[direction]
  return (
    <button
      onClick={onClick}
      aria-label={`Go ${direction}`}
      className={`absolute ${NAV_ARROW_POSITION[direction]} w-6 h-6 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/60 text-gray-300 hover:text-white transition-colors`}
    >
      <Icon className="w-4 h-4" />
    </button>
  )
}
