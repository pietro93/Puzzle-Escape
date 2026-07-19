"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, X } from "lucide-react"
import PaintingInspector from "./painting-inspector"
import CharcoalRubbing, { type CharcoalRubbingHandle } from "./charcoal-rubbing"
import LampReveal, { type LampRevealHandle } from "./lamp-reveal"
import ItemDragTray from "./item-drag-tray"

interface MansionMapPuzzleProps {
  onSolve: () => void
  // Fires whenever the current room or examining state changes, so the
  // butler's dialogue (driven from game-screen.tsx) can react to where the
  // player actually is instead of showing generic level-wide lines.
  onRoomStateChange?: (room: string, examining: boolean) => void
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
  | "floral"
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
  gregory: { south: "foyer", east: "gregoryAnnex" },
  gregoryAnnex: { west: "gregory", north: "ivan" },
  invidia: { south: BACK },
  ivan: { south: BACK },
  narcissus: { west: BACK },
  mammon: { south: BACK },
  thesin: { east: "foyer", north: "invidia", west: "desidia", south: "floral" },
  desidia: { east: BACK },
  saturn: { south: BACK },
  floral: { north: BACK },
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
  floral: "Flower Room",
}

// Title/artist/date are placeholders — final wall-plaque copy is still being
// written (see redesign doc §7). Kept plain rather than inventing fake
// specifics so nobody mistakes these for real content.
const ROOM_ART: Partial<
  Record<Room, { src: string; alt: string; title: string; artist: string; date: string; medium: string }>
> = {
  gregory: {
    src: "/images/paintings/pope-gregory-i.webp",
    alt: "A statue of Pope Gregory I",
    title: "Pope Gregory I",
    artist: "Artist unknown",
    date: "Date unknown",
    medium: "Marble Sculpture",
  },
  invidia: {
    src: "/images/paintings/invidia.webp",
    alt: "A fresco depicting Invidia",
    title: "Invidia (Envy)",
    artist: "Giotto di Bondone",
    date: "c. 1305",
    medium: "Fresco",
  },
  ivan: {
    src: "/images/paintings/ivan-the-terrible-and-his-son.webp",
    alt: "Ivan the Terrible and his son",
    title: "Ivan the Terrible and His Son",
    artist: "Ilya Repin",
    date: "1885",
    medium: "Oil on Canvas",
  },
  narcissus: {
    src: "/images/paintings/narcissus.webp",
    alt: "A marble statue of Narcissus",
    title: "Narcissus",
    artist: "John Gibson",
    date: "1838",
    medium: "Marble Sculpture",
  },
  thesin: {
    src: "/images/paintings/the-sin.webp",
    alt: "A painting titled The Sin",
    title: "The Sin",
    artist: "Franz von Stuck",
    date: "1893",
    medium: "Oil on Canvas",
  },
  desidia: {
    src: "/images/paintings/desidia.webp",
    alt: "An engraving depicting Desidia",
    title: "Desidia (Sloth)",
    artist: "Pieter Bruegel the Elder",
    date: "1557",
    medium: "Engraving",
  },
  saturn: {
    src: "/images/paintings/saturn-devouring-his-son.webp",
    alt: "Saturn Devouring His Son",
    title: "Saturn Devouring His Son",
    artist: "Francisco Goya",
    date: "c. 1819–1823",
    medium: "Oil on Plaster",
  },
  mammon: {
    src: "/images/paintings/mammon.webp",
    alt: "A painting depicting Mammon",
    title: "Mammon",
    artist: "George Frederic Watts",
    date: "1885",
    medium: "Oil on Canvas",
  },
}

// Room background art, one per room. Each already has its painting/statue
// (and, for most, its plaque) composited into the scene at a small,
// unzoomed scale. `aspect` is the source image's own width/height, used to
// work out how much of it BOX_ASPECT crops away (see mapToBox below).
// thesin's and narcissus's src are overridden dynamically below (see
// EMBER_ROOM_* and STILLWATER_STATUE_*) — the value here is just the default
// (closed-door / undraped) state.
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
  floral: { src: "/images/paintings/flower_room.webp", aspect: 572 / 833 },
}

// The three snake-head fountains in the flower room, plus the fourth
// (southwest) trunk that has no head of its own — it fills automatically
// once the other three are flowing (see floralAllWet below), rather than
// being a drop target. Each overlay is a full-canvas image, pixel-aligned to
// flower_room.webp (572x833), transparent except for that one water channel.
const FLORAL_WATER_NORTHWEST = "/images/paintings/flower_room_water_northwest.webp"
const FLORAL_WATER_NORTHEAST = "/images/paintings/flower_room_water_northeast.webp"
const FLORAL_WATER_SOUTHEAST = "/images/paintings/flower_room_water_southeast.webp"
const FLORAL_WATER_SOUTHWEST = "/images/paintings/flower_room_water_southwest.webp"

const FLORAL_HEAD_HOTSPOTS = {
  northwest: { left: (193 / 572) * 100, top: (259 / 833) * 100, width: (76 / 572) * 100, height: (73 / 833) * 100 },
  northeast: { left: (317 / 572) * 100, top: (315 / 833) * 100, width: (68 / 572) * 100, height: (70 / 833) * 100 },
  southeast: { left: (348 / 572) * 100, top: (504 / 833) * 100, width: (111 / 572) * 100, height: (111 / 833) * 100 },
} as const satisfies Record<string, Rect>

// Before/after observation text for each snake head, and the line shown the
// instant the Ewer sets one flowing — standalone per head, never naming or
// comparing to the others, since the player has no reason to have seen them
// in any particular order.
const FLORAL_HEAD_MESSAGES: Record<keyof typeof FLORAL_HEAD_HOTSPOTS, { before: string; after: string }> = {
  northwest: {
    before: "A stone snake's head, jaws stretched wide. The stone beneath its mouth is bone-dry, stained faintly green where water once ran.",
    after: "Water threads steadily from the stone jaws, down into the flowerbed below.",
  },
  northeast: {
    before: "A stone snake's head, coiled toward the window, mouth cracked open. Dust has settled in the hollow of its throat.",
    after: "A thin stream runs from the stone jaws now, tracing the worn channel beneath it.",
  },
  southeast: {
    before: "A stone snake's head, wide-mouthed, half-sunk in dead flowers. The stone around its jaws is cracked and dry.",
    after: "Water pours from the stone jaws in a steady rush, loud in the quiet of the room.",
  },
}

// Description-only — the arched windows and the full moon beyond them.
// TODO: position is a best guess (left/top read as one pair, "173x46", and
// size as the other, "241x165") — nudge if it doesn't sit on the windows.
const FLORAL_WINDOW_HOTSPOT: Rect = { left: (173 / 572) * 100, top: (46 / 833) * 100, width: (241 / 572) * 100, height: (165 / 833) * 100 }

// The Garden Chisel, sitting in the flower room — used to scrape the
// softened gold resin off Mammon's painting once the Caustic Agent has
// loosened it (see MAMMON_GOLD_HOTSPOT below). Pixel-aligned to
// flower_room.webp (572x833), same full-canvas-overlay convention as the
// Ewer above.
const FLORAL_CHISEL_OVERLAY = "/images/paintings/flower_room_garden_chisel.webp"
const FLORAL_CHISEL_HOTSPOT: Rect = { left: (45 / 572) * 100, top: (718 / 833) * 100, width: (71 / 572) * 100, height: (32 / 833) * 100 }

// The Ewer, sitting in the banquet hall alongside the Charcoal. Rendered by
// hand rather than through ROOM_ITEM_PICKUPS since that map only holds one
// entry per room and saturn's is already spoken for by Charcoal — same
// full-canvas-overlay convention otherwise. Pixel-aligned to
// banquet_hall.webp (558x771).
const BANQUET_EWER_OVERLAY = "/images/paintings/banquet_hall_ewer.webp"
const BANQUET_EWER_HOTSPOT: Rect = { left: (247 / 558) * 100, top: (575 / 771) * 100, width: (62 / 558) * 100, height: (79 / 771) * 100 }

// thesin's room ("ember room") has two states — its painting is hidden
// (ember_room_shut) until the Ladder is dropped into the room, letting the
// player reach it (ember_room_open). See emberOpen below.
const EMBER_ROOM_SHUT = "/images/paintings/ember_room_shut.webp"
const EMBER_ROOM_OPEN = "/images/paintings/ember_room_open.webp"

// The Ladder itself, once placed — a full-canvas overlay like the ones
// above (the ladder art sits at pixel (134,215)-(251,572), transparent
// elsewhere), same inset-0 + object-cover pattern.
const EMBER_ROOM_LADDER = "/images/paintings/ember_room_ladder.webp"

// The Caustic Agent, sitting in a cabinet revealed once the ember room
// opens up — same full-canvas-overlay item-pickup convention as Charcoal/
// Ladder above, pixel-aligned to ember_room_open.webp (495x644). Used to
// soften the gold resin sealing the bottom half of Mammon's painting (see
// MAMMON_GOLD_HOTSPOT below) before the Garden Chisel can scrape it away.

// Ivan's bloodstain, three states over the same painting: fresh, salted
// (mid-clean), then cleaned for good once Holy Water washes the salt away.
const IVAN_ART_DEFAULT = "/images/paintings/ivan-the-terrible-and-his-son.webp"
const IVAN_ART_SALTED = "/images/paintings/ivan-the-terrible-and-his-son_salted.webp"
const IVAN_ART_CLEANED = "/images/paintings/ivan-the-terrible-and-his-son_cleaned.webp"

// Narcissus's statue, three states — unlike Ivan's bloodstain these are NOT
// baked into the room background. stillwater_room_layer.webp (the room minus
// the statue) is rendered as an overlay ON TOP of a statue-only image, so the
// arch's stonework/floor stays in front and masks the statue to the true
// alcove opening rather than relying on a hand-tuned cutout matching it
// exactly. undraped by default, Drape once applied, then Drape + the
// charcoal rubbing once that's been started. All four images (the three
// statue-only ones plus the layer) share the same 760x893 canvas/aspect and
// are pixel-aligned to each other.
const STILLWATER_STATUE_DEFAULT = "/images/paintings/stillwater_room_statue_default.webp"
const STILLWATER_STATUE_DRAPED = "/images/paintings/stillwater_room_statue_draped.webp"
const STILLWATER_STATUE_CHARCOAL = "/images/paintings/stillwater_room_statue_charcoal.webp"
const STILLWATER_ROOM_LAYER = "/images/paintings/stillwater_room_layer.webp"

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
  floral: { x: 50, y: 52 },
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
  gregoryAnnex: {
    item: "Ladder",
    overlaySrc: "/images/paintings/saint_alcove_right_ladder.webp",
    hotspot: { left: (33 / 469) * 100, top: (72 / 600) * 100, width: (52 / 469) * 100, height: (150 / 600) * 100 },
    message: "A short wooden ladder, propped against the wall. Might reach somewhere useful.",
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
  thesin: {
    item: "Caustic Agent",
    overlaySrc: "/images/paintings/ember_room_caustic_agent.webp",
    hotspot: { left: (58 / 495) * 100, top: (449 / 644) * 100, width: (32 / 495) * 100, height: (111 / 644) * 100 },
    message: "The cabinet door swings open on a single bottle, tucked away like it wasn't meant to be found. A golden skull is etched on the label, slowly melting away in a puddle of acid.",
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
// unlocksSolution: reading this is the interaction that ungates the
// answer-input panel (see onSolve wiring in the observations render below) —
// only the gregory stone tablet has this, since it's the clue that lets the
// player start piecing the rest of the puzzle together.
const ROOM_OBSERVATIONS: Partial<Record<Room, { hotspot: Rect; message: string; unlocksSolution?: boolean }[]>> = {
  gregory: [
    {
      hotspot: { left: (427 / 560) * 100, top: (323 / 596) * 100, width: (63 / 560) * 100, height: (43 / 596) * 100 },
      message:
        "Set into the stone, in tight Roman capitals. SEPTEM VITIA CAPITALIA: VANAGLORIA, INVIDIA, IRA, TRISTITIA, AVARITIA, GVLA, LVXVRIA.",
      unlocksSolution: true,
    },
  ],
  foyer: [
    {
      hotspot: { left: (182 / 494) * 100, top: (185 / 600) * 100, width: (54 / 494) * 100, height: (119 / 600) * 100 },
      message:
        "A hunting tapestry, threadbare and moth-eaten. Every stitched hound has been unpicked from the same corner of the weave, as if someone tried to pull just them out of the scene.",
    },
    {
      hotspot: { left: (428 / 494) * 100, top: (247 / 600) * 100, width: (48 / 494) * 100, height: (143 / 600) * 100 },
      message:
        "A suit of plate armor, stood at permanent attention beside the stairs. The visor is shut. Nothing about it suggests it's always been that way.",
    },
  ],
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
  floral: [
    {
      hotspot: FLORAL_WINDOW_HOTSPOT,
      message: "Three tall arched windows, hung with dead vines. Beyond the glass, a full moon sits low over the treeline.",
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

// Room-to-room navigation hotspots — phantom clickable regions laid over
// architectural features (doors, stairways) in the source art, replacing the
// generic compass-arrow buttons for rooms that have been mapped. Rooms/
// directions with no entry here still fall back to NavArrow (see render).
// thesin's three are pixel-aligned to ember_room_open.webp (495x644), which
// shares its door/stairway positions with ember_room_shut.webp, so the same
// rects work in both the shut and open states.
const NAV_HOTSPOTS: Partial<Record<Room, Partial<Record<Direction, Rect>>>> = {
  // gregory/gregoryAnnex and foyer/foyerAnnex are the same physical space
  // split across two portrait frames (see the Room type comment above) —
  // those east/west switches keep the plain compass arrows. Only gregory's
  // south exit (back to the foyer proper) gets a phantom hotspot here, laid
  // over the open floor at the bottom of the frame since there's no painted
  // doorway to align it to.
  gregory: {
    south: { left: (-22 / 560) * 100, top: (522 / 596) * 100, width: (604 / 560) * 100, height: (148 / 596) * 100 },
  },
  // The spiral stairway up to the crimson study, right wall. Pixel-aligned
  // to saint_alcove_right.webp (469x600).
  gregoryAnnex: {
    north: { left: (-21 / 469) * 100, top: (225 / 600) * 100, width: (130 / 469) * 100, height: (202 / 600) * 100 },
  },
  // foyer's own east/west arrows stay put here too (see the comment above) —
  // only the two real doors, to thesin and to saturn, get phantom hotspots.
  // Pixel-aligned to foyer_left.webp (494x600).
  foyer: {
    west: { left: (58 / 494) * 100, top: (171 / 600) * 100, width: (63 / 494) * 100, height: (307 / 600) * 100 },
    north: { left: (284 / 494) * 100, top: (198 / 600) * 100, width: (106 / 494) * 100, height: (187 / 600) * 100 },
  },
  // The stairway up to the saint's alcove, right wall. Pixel-aligned to
  // foyer_right.webp (494x600).
  foyerAnnex: {
    north: { left: (-5 / 494) * 100, top: (60 / 600) * 100, width: (188 / 494) * 100, height: (218 / 600) * 100 },
  },
  thesin: {
    // Plain wood door, left wall.
    west: { left: (127 / 495) * 100, top: (432 / 644) * 100, width: (33 / 495) * 100, height: (138 / 644) * 100 },
    // Grand spiral staircase, right side, leading up.
    north: { left: (290 / 495) * 100, top: (393 / 644) * 100, width: (180 / 495) * 100, height: (237 / 644) * 100 },
    // No painted doorway back to the foyer — the entire bottom edge of the
    // frame stands in for "walk back the way you came," click anywhere along it.
    east: { left: 0, top: (580 / 644) * 100, width: 100, height: (64 / 644) * 100 },
    // The door into the flower room.
    south: { left: (260 / 495) * 100, top: (454 / 644) * 100, width: (52 / 495) * 100, height: (86 / 644) * 100 },
  },
  // Pixel-aligned to flower_room.webp (572x833) — the door back to the
  // ember room, at the south end of the room (the ROOM_CONNECTIONS entry
  // is keyed "north" since that's the compass direction that resolves via
  // BACK, not a claim about where the hotspot sits on screen).
  floral: {
    north: { left: (-27 / 572) * 100, top: (819 / 833) * 100, width: (845 / 572) * 100, height: (108 / 833) * 100 },
  },
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

// Mammon's painting, three states over the same canvas: sealed under a
// hardened sheet of gold resin, softened once the Caustic Agent is applied,
// then scraped bare once the Garden Chisel works the softened gold away —
// same three-stage tool convention as Ivan's bloodstain (salt/holy water).
// Pixel-aligned to mammon_golden_cover.webp/mammon_clear.webp (640x1106).
const MAMMON_ART_GOLD = "/images/paintings/mammon_golden_cover.webp"
const MAMMON_ART_SOFTENED = "/images/paintings/mammon_golden_cover_softened.webp"
const MAMMON_ART_CLEAR = "/images/paintings/mammon_clear.webp"

// The gold-sealed lower half of the canvas — both the click target for
// observing it and the drop target for the Caustic Agent/Garden Chisel,
// rendered inside PaintingInspector's own pan/zoom transform (see
// secondaryHotspot) same as Ivan's bloodstain.
const MAMMON_GOLD_HOTSPOT: Rect = {
  left: (-24 / 640) * 100,
  top: (550 / 1106) * 100,
  width: (698 / 640) * 100,
  height: (574 / 1106) * 100,
}

// Narcissus's pool — pixel-aligned to stillwater_room_layer.webp/
// stillwater_room_statue_*.webp (760x893). Doubles as the click-to-examine
// hotspot and the drop target for filling the Caliche or the Ewer.
// TODO: eyeballed from the room art, nudge if it drifts off the basin.
const NARCISSUS_POOL_HOTSPOT: Rect = {
  left: (210 / 760) * 100,
  top: (775 / 893) * 100,
  width: (340 / 760) * 100,
  height: (85 / 893) * 100,
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
  Ladder: "/images/paintings/ladder.webp",
  Ewer: "/images/paintings/ewer.webp",
  "Caustic Agent": "/images/paintings/caustic_agent.webp",
  "Garden Chisel": "/images/paintings/garden_chisel.webp",
  Drape: "/images/paintings/drape.webp",
  Coin: "/images/paintings/coin.webp",
  "Holy Water": "/images/paintings/holy_water.webp",
}
const CALICHE_EMPTY_ICON = "/images/paintings/caliche.webp"
const CALICHE_FILLED_ICON = "/images/paintings/caliche_salt.webp"

// Clickable hotspot rects (percent of the *source* image) over the art
// itself and over its in-scene plaque, hand-placed to match each background.
// thesin's is pixel-aligned to ember_room_open.webp (495x644) — irrelevant
// while shut, since no art hotspot renders until the room is opened (see
// render below).
const ART_HOTSPOTS: Partial<Record<Room, Rect>> = {
  gregory: { left: (321 / 560) * 100, top: (156 / 596) * 100, width: (75 / 560) * 100, height: (220 / 596) * 100 },
  invidia: { left: (226 / 704) * 100, top: (309 / 893) * 100, width: (255 / 704) * 100, height: (382 / 893) * 100 },
  ivan: { left: (122 / 774) * 100, top: (71 / 797) * 100, width: (531 / 774) * 100, height: (390 / 797) * 100 },
  narcissus: { left: 30, top: 43, width: 33, height: 44 },
  thesin: { left: (215 / 495) * 100, top: (58 / 644) * 100, width: (98 / 495) * 100, height: (123 / 644) * 100 },
  desidia: { left: 53, top: 27, width: 35, height: 19 },
  saturn: { left: (205 / 558) * 100, top: (142 / 771) * 100, width: (144 / 558) * 100, height: (226 / 771) * 100 },
  mammon: { left: (162 / 592) * 100, top: (270 / 913) * 100, width: (194 / 592) * 100, height: (302 / 913) * 100 },
}

// thesin's plaque sits at the same spot in both ember_room_shut.webp and
// ember_room_open.webp (495x644 either way) — visible in both states, but
// only readable once the Ladder lets the player get close enough (see
// emberOpen gating in render below).
const PLAQUE_HOTSPOTS: Partial<Record<Room, Rect>> = {
  // Placeholder rect, pending calibration against saint_alcove_left.webp —
  // see the ghost-div-placement cleanup pass tracked for all rooms.
  gregory: { left: 45, top: 68, width: 25, height: 5 },
  invidia: { left: (292 / 704) * 100, top: (760 / 893) * 100, width: (123 / 704) * 100, height: (26 / 893) * 100 },
  ivan: { left: (324 / 774) * 100, top: (470 / 797) * 100, width: (131 / 774) * 100, height: (37 / 797) * 100 },
  narcissus: { left: 33, top: 87, width: 25, height: 4 },
  thesin: { left: (248 / 495) * 100, top: (257 / 644) * 100, width: (54 / 495) * 100, height: (21 / 644) * 100 },
  desidia: { left: 55, top: 47, width: 30, height: 6 },
  saturn: { left: (246 / 558) * 100, top: (400 / 771) * 100, width: (70 / 558) * 100, height: (24 / 771) * 100 },
  mammon: { left: (212 / 592) * 100, top: (614 / 913) * 100, width: (96 / 592) * 100, height: (40 / 913) * 100 },
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

// Pixel-aligned to ivan-the-terrible-and-his-son.webp (2023x1589) — the
// bloodstain sitting on top of the painting, not part of the brushwork
// itself. This is both the click target for observing it and the drop
// target for the Caliche/Holy Water, rendered inside PaintingInspector's
// own pan/zoom transform (see secondaryHotspot) so it tracks the image
// through zoom the same way itemPickup's hotspot does.
const IVAN_BLOOD_HOTSPOT: Rect = {
  left: (1051 / 2023) * 100,
  top: (561 / 1589) * 100,
  width: (87 / 2023) * 100,
  height: (166 / 1589) * 100,
}

// Pixel-aligned to narcissus_statue.webp (760x1024) — the plate mounted on
// the statue's pedestal, only legible up close in the inspector (unlike
// every other room's plaque, which is readable from the small room-view
// scene). Reuses the same title/artist/date popup as PLAQUE_HOTSPOTS via
// showPlaqueInfo rather than a bespoke message.
const NARCISSUS_PLAQUE_HOTSPOT: Rect = {
  left: (281 / 760) * 100,
  top: (959 / 1024) * 100,
  width: (183 / 760) * 100,
  height: (43 / 1024) * 100,
}

// Whether a client-space point falls inside an element's current bounding
// box — shared by every drop target that needs to test a drop against a
// specific on-screen hotspot rather than a whole container (the frog's
// mouth, the salt chest, Ivan's bloodstain).
function isPointInElement(el: HTMLElement | null, point: { x: number; y: number }) {
  if (!el) return false
  const rect = el.getBoundingClientRect()
  return point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom
}

export default function MansionMapPuzzle({ onSolve, onRoomStateChange }: MansionMapPuzzleProps) {
  const [currentRoom, setCurrentRoom] = useState<Room>("foyer")
  // Tracks the room navigated from, so BACK connections (dead-end rooms
  // reachable from more than one direction) return to wherever the player
  // actually came from rather than a hardcoded room.
  const [previousRoom, setPreviousRoom] = useState<Room | null>(null)
  const [doorUnlocked, setDoorUnlocked] = useState(false)
  // Mammon's salt chest: opened by a click (stays open permanently), then
  // the Caliche can be filled from it by dragging, any number of times.
  const [chestOpen, setChestOpen] = useState(false)
  // What the Caliche currently holds — salt (scooped from Mammon's chest) or
  // water (dipped from Narcissus's pool), refillable indefinitely from
  // either source, unlike the Drape's one-shot consumption. Dragging it onto
  // a source it doesn't currently hold empties whatever it had and refills
  // from that source instead — there's no separate "empty it out" step.
  const [caliceContent, setCaliceContent] = useState<"empty" | "salt" | "water">("empty")
  // Whether the Ewer currently holds water — filled at Narcissus's pool,
  // emptied by pouring it onto a flower-room snake head. Unlike the
  // Caliche, the Ewer only ever holds water, so this is a plain boolean.
  const [ewerFilled, setEwerFilled] = useState(false)
  // The three snake-head fountains in the flower room — each set once the
  // Ewer (not the Caliche — see caliche-on-a-head handling below) is poured
  // on it. The fourth, headless southwest trunk fills automatically once
  // all three are true (see floralAllWet below), rather than being its own
  // piece of state.
  const [floralNorthwestWet, setFloralNorthwestWet] = useState(false)
  const [floralNortheastWet, setFloralNortheastWet] = useState(false)
  const [floralSoutheastWet, setFloralSoutheastWet] = useState(false)
  // Guards the one-time "you hear a noise" dialogue that fires the instant
  // all three heads are flowing, so it doesn't refire on every re-render.
  const [floralNoiseHeard, setFloralNoiseHeard] = useState(false)
  // Ivan's bloodstain: salt first (dries/lifts the blood), then Holy Water
  // while salted washes it away for good. Two separate flags rather than a
  // single enum so ivanSalted alone can gate the Holy Water drop without
  // also implying ivanCleaned.
  const [ivanSalted, setIvanSalted] = useState(false)
  const [ivanCleaned, setIvanCleaned] = useState(false)
  // Mammon's gold resin: the Caustic Agent softens it first, then the
  // Garden Chisel scrapes it away — a continuous drag-scratch reveal, same
  // mechanism (and same snapshot-persistence reasoning) as
  // narcissusScratchSnapshot below. "Cleared" is derived from whether any
  // scratching has happened yet, not tracked as its own flag.
  const [mammonSoftened, setMammonSoftened] = useState(false)
  const [mammonScratchSnapshot, setMammonScratchSnapshot] = useState<string | null>(null)
  const mammonCleared = !!mammonScratchSnapshot
  const [inspecting, setInspecting] = useState(false)
  const [showPlaqueInfo, setShowPlaqueInfo] = useState(false)

  // Notify the parent whenever the room or examining state changes, so the
  // butler's dialogue can react to where the player actually is.
  useEffect(() => {
    onRoomStateChange?.(currentRoom, inspecting)
    // onRoomStateChange intentionally excluded: game-screen.tsx passes an
    // inline callback, and including it here would refire this effect (and
    // the parent state update inside it) on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRoom, inspecting])
  // The ember room's painting stays hidden until all three flower-room
  // snake heads are flowing (see the floralAllWet effect below) — permanent
  // once set, same as every other one-shot reveal in this puzzle. Reaching
  // the painting itself for a close look is a separate step — see
  // emberLadderPlaced.
  const [emberOpen, setEmberOpen] = useState(false)
  // Whether the Ladder has been dropped into the now-open ember room —
  // lets the player actually climb up to examine the painting, as opposed
  // to just seeing it's there. See openInspector's "too far to reach" gate.
  const [emberLadderPlaced, setEmberLadderPlaced] = useState(false)
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
  // Gold flecks kicked up by the Garden Chisel, purely cosmetic — spawned in
  // handleGoldScratch (only for scratches landing in the bottom half of
  // Mammon's canvas) and self-removed after their animation finishes. Same
  // client-space/portal reasoning as lampGlowPoint above.
  const [goldParticles, setGoldParticles] = useState<
    { id: number; x: number; y: number; tx: number; ty: number }[]
  >([])
  const goldParticleId = useRef(0)
  const lastGoldScratchAt = useRef(0)
  // A single dialogue line shown in a dismissible modal — same generic
  // pattern as prison-cell-puzzle.tsx (level 1): fires on every item pickup
  // (collect + show, one click, no separate confirm step) and on
  // non-pickable "observe" hotspots (shows repeatably, no side effect).
  const [dialogue, setDialogue] = useState<string | null>(null)
  // The southwest trunk has no head of its own — it fills the instant the
  // other three are all flowing. That same moment fires a one-time noise
  // from elsewhere in the mansion, and opens up the ember room (see
  // emberOpen) — an effect so it fires exactly once regardless of which
  // head completed the set, rather than needing to be checked from inside
  // three separate drop handlers.
  const floralAllWet = floralNorthwestWet && floralNortheastWet && floralSoutheastWet
  useEffect(() => {
    if (floralAllWet && !floralNoiseHeard) {
      setFloralNoiseHeard(true)
      setEmberOpen(true)
      setDialogue("Water rushes through the last trunk. Somewhere else in the house, you hear a noise, something heavy shifting.")
    }
  }, [floralAllWet, floralNoiseHeard])
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
  const mammonDoorRef = useRef<HTMLButtonElement>(null)
  // Drop target for the salt chest (mammon only) — doubles as the click
  // hotspot for opening/examining it, so both live on the same element.
  const chestRef = useRef<HTMLDivElement>(null)
  // Drop target for Ivan's bloodstain — doubles as the click hotspot for
  // observing it, so both live on the same element. Rendered by
  // PaintingInspector (see secondaryHotspot), inside its own pan/zoom
  // transform, so its bounding rect always matches where the stain is
  // actually drawn on screen regardless of zoom level.
  const ivanBloodRef = useRef<HTMLButtonElement>(null)
  // Drop target for Mammon's gold-sealed canvas — same convention as
  // ivanBloodRef above.
  const mammonGoldRef = useRef<HTMLButtonElement>(null)
  // The room-view scene box itself — drop target for the Ladder onto the
  // ember room (thesin), as opposed to a specific hotspot within it.
  const roomViewRef = useRef<HTMLDivElement>(null)
  // Drop target for Narcissus's pool (fills the Caliche or the Ewer) —
  // doubles as the click hotspot for observing it.
  const poolRef = useRef<HTMLDivElement>(null)
  // Drop targets for the three flower-room snake heads (Ewer waters them,
  // Caliche is the red-herring "not enough" attempt) — doubles as the click
  // hotspot for observing each one, before/after it's flowing.
  const floralHeadRefs = {
    northwest: useRef<HTMLDivElement>(null),
    northeast: useRef<HTMLDivElement>(null),
    southeast: useRef<HTMLDivElement>(null),
  }

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

  // Spawns a small burst of gold flecks at a scratch point, but only when
  // that point falls in the bottom half of the canvas — the chisel is only
  // supposed to be turning up gold resin down there, not everywhere the
  // player happens to drag it. Throttled since scratchAt (and therefore
  // this) fires on every pointermove while dragging.
  const handleGoldScratch = (client: { x: number; y: number }, normalized: { x: number; y: number }) => {
    if (normalized.y < 0.5) return
    const now = Date.now()
    if (now - lastGoldScratchAt.current < 40) return
    lastGoldScratchAt.current = now
    const burst = Array.from({ length: 3 }, () => {
      goldParticleId.current += 1
      const angle = Math.random() * Math.PI * 2
      const distance = 14 + Math.random() * 18
      return {
        id: goldParticleId.current,
        x: client.x,
        y: client.y,
        tx: Math.cos(angle) * distance,
        ty: Math.sin(angle) * distance - 10,
      }
    })
    setGoldParticles((prev) => [...prev, ...burst])
    const ids = burst.map((p) => p.id)
    setTimeout(() => {
      setGoldParticles((prev) => prev.filter((p) => !ids.includes(p.id)))
    }, 550)
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
    if (item === "Garden Chisel" && currentRoom === "mammon" && mammonSoftened) {
      if (point) {
        charcoalRubbingRef.current?.scratchAt(point)
      } else {
        charcoalRubbingRef.current?.endStroke()
      }
    }
    if (item === "Oil Lamp") {
      setLampGlowPoint(point && isOverArtViewport(point) ? point : null)
      if (currentRoom === "thesin" || currentRoom === "saturn") {
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
      setDialogue("You settle the drape over the statue's hips. Whatever Narcissus was so vain about, it's decently covered now.")
    }
    if (item === "Drape" && currentRoom === "gregory") {
      setDialogue("You hold the drape up against the statue, but there's no reason to cover Gregory. Whatever this is for, it isn't here.")
    }
    if (item === "Charcoal" && currentRoom === "narcissus" && !narcissusDraped) {
      setDialogue("There's nothing but bare, smooth marble to catch the charcoal. It needs something to press the paper against first.")
    }
    if (item === "Loupe" && !loupeUnlocked) {
      setLoupeUnlocked(true)
      setDialogue("You hold the loupe up to the canvas. Details leap out that were invisible to the naked eye.")
    }
    if (item === "Caliche" && currentRoom === "ivan" && caliceContent === "salt" && !ivanSalted) {
      if (isPointInElement(ivanBloodRef.current, point)) {
        setIvanSalted(true)
        // The Caliche itself stays in inventory — only its salt is spent —
        // so it has to be refilled from Mammon's chest before it can be
        // used again (on Saturn's bloodstain, or a second pass here).
        setCaliceContent("empty")
        setDialogue("You scatter the salt across the stain. It draws the red out of the canvas, drying to a crust.")
      }
    }
    if (item === "Holy Water" && currentRoom === "ivan" && ivanSalted && !ivanCleaned) {
      if (isPointInElement(ivanBloodRef.current, point)) {
        setIvanCleaned(true)
        setDialogue("The holy water dissolves the crusted salt, carrying the last of the stain away with it.")
      }
    }
    // Plain water (Caliche or Ewer) reacts but doesn't finish the job — the
    // salt visibly softens, then hardens right back, nudging the player
    // toward something more than water without naming Holy Water outright.
    if (
      ((item === "Caliche" && caliceContent === "water") || (item === "Ewer" && ewerFilled)) &&
      currentRoom === "ivan" &&
      ivanSalted &&
      !ivanCleaned
    ) {
      if (isPointInElement(ivanBloodRef.current, point)) {
        setDialogue(
          "The salt darkens and softens under the water, then dries again within moments, the stain untouched. Cleaning this properly may take something with more than water in it.",
        )
      }
    }
    // Holy Water or plain water tried before the salt crust exists — the
    // stain is still fresh, not the "dried and lifted" state either tool
    // actually works on.
    if (
      (item === "Holy Water" || (item === "Caliche" && caliceContent === "water") || (item === "Ewer" && ewerFilled)) &&
      currentRoom === "ivan" &&
      !ivanSalted
    ) {
      if (isPointInElement(ivanBloodRef.current, point)) {
        setDialogue("The stain is still fresh and wet. Whatever this is just beads on the surface without lifting any of it.")
      }
    }
    // Caustic Agent and the Garden Chisel could plausibly be tried on the
    // bloodstain, but the player stops short before risking the painting.
    if (item === "Caustic Agent" && currentRoom === "ivan" && !ivanCleaned) {
      if (isPointInElement(ivanBloodRef.current, point)) {
        setDialogue(
          "You catch yourself before pouring it out. Whatever this agent would do to old, dried blood, it would do just as readily to the paint underneath it.",
        )
      }
    }
    if (item === "Garden Chisel" && currentRoom === "ivan" && !ivanCleaned) {
      if (isPointInElement(ivanBloodRef.current, point)) {
        setDialogue("You catch yourself before scraping. Enough force to lift dried blood off canvas would just as easily gouge through it.")
      }
    }
    if (item === "Caustic Agent" && currentRoom === "mammon" && !mammonSoftened) {
      if (isPointInElement(mammonGoldRef.current, point)) {
        setMammonSoftened(true)
        // Consumed on use, unlike the Caliche's salt — there's only the one
        // vial, and one application is all the resin needs to loosen.
        setInventory((prev) => prev.filter((i) => i !== "Caustic Agent"))
        setDialogue("You brush the caustic agent across the resin. It hisses faintly, softening to something like wax.")
      }
    }
    // Water (Caliche or Ewer) or Holy Water tried on the sealed resin — a
    // few drops rather than the whole container, so nothing is spent.
    if (
      (item === "Caliche" || item === "Holy Water" || item === "Ewer") &&
      currentRoom === "mammon" &&
      !mammonSoftened
    ) {
      if (isPointInElement(mammonGoldRef.current, point)) {
        setDialogue("You flick a few drops onto the resin. They bead and roll straight off, sealed too tight to reach anything underneath.")
      }
    }
    if (item === "Garden Chisel" && currentRoom === "mammon" && !mammonSoftened) {
      if (isPointInElement(mammonGoldRef.current, point)) {
        setDialogue("The chisel does its best, but it's old and rusty, and the resin is hard and unyielding. It might need some help first.")
      }
    }
    // Same water items, tried again once the resin's already soft — still
    // the wrong approach, just for a different reason.
    if (
      (item === "Caliche" || item === "Holy Water" || item === "Ewer") &&
      currentRoom === "mammon" &&
      mammonSoftened
    ) {
      if (isPointInElement(mammonGoldRef.current, point)) {
        setDialogue("A few drops land on the tacky resin and do nothing. It needs to be worked loose, not rinsed.")
      }
    }
  }

  // Drop handler for the room-view tray (as opposed to handleItemDrop above,
  // which is scoped to the art inspector modal) — the frog's mouth in
  // gregoryAnnex, the salt chest in mammon, and the Ladder in thesin all
  // react to a drop.
  const handleRoomItemDrop = (item: string, point: { x: number; y: number }) => {
    if (item === "Loupe" && !loupeUnlocked && isPointInElement(roomViewRef.current, point)) {
      setDialogue("Too small and far away to make anything out from here. You'd need to be looking at it up close.")
    }
    if (item === "Coin" && currentRoom === "gregoryAnnex" && !doorUnlocked) {
      if (isPointInElement(frogRef.current, point)) {
        setDoorUnlocked(true)
        setDialogue("The frog's jaw snaps shut around the coin. Somewhere inside the door, gears turn, and the golden door creaks open.")
      }
    }
    // The agent's known to eat through Mammon's gold resin, so it's a
    // reasonable thing to try on a gold door — just not strong enough
    // (or applied for long enough) to actually force it.
    if (item === "Caustic Agent" && currentRoom === "gregoryAnnex" && !doorUnlocked) {
      if (isPointInElement(frogRef.current, point) || isPointInElement(mammonDoorRef.current, point)) {
        setDialogue("The agent could probably eat into the door's gilding, given enough time. Not enough to force it open today.")
      }
    }
    if (item === "Caliche" && currentRoom === "mammon" && chestOpen && caliceContent !== "salt") {
      if (isPointInElement(chestRef.current, point)) {
        const hadWater = caliceContent === "water"
        setCaliceContent("salt")
        setDialogue(
          hadWater
            ? "You tip the water out and scoop a handful of coarse salt into the caliche instead."
            : "You scoop a handful of coarse salt into the caliche.",
        )
      }
    }
    if (item === "Ladder" && currentRoom === "thesin" && emberOpen && !emberLadderPlaced) {
      if (isPointInElement(roomViewRef.current, point)) {
        setEmberLadderPlaced(true)
        // One-shot: the Ladder is now a fixture of the scene, not something
        // to carry around and place again.
        setInventory((prev) => prev.filter((i) => i !== "Ladder"))
        setDialogue("You lean the ladder against the wall. The painting is finally within reach.")
      }
    }
    if (item === "Coin" && currentRoom === "narcissus") {
      if (isPointInElement(poolRef.current, point)) {
        setDialogue("You turn the coin over, thinking about tossing it in and making a wish. Then think better of it, and put it back in your pocket.")
      }
    }
    if ((item === "Caliche" || item === "Ewer") && currentRoom === "narcissus") {
      if (isPointInElement(poolRef.current, point)) {
        if (item === "Caliche" && caliceContent !== "water") {
          const hadSalt = caliceContent === "salt"
          setCaliceContent("water")
          setDialogue(
            hadSalt
              ? "You tip out the salt and dip the caliche into the pool. It comes back barely full, the mouth is narrow, and most of it sloshes out before you can straighten up."
              : "You dip the caliche into the pool. It comes back barely full, the mouth is narrow, and most of it sloshes out before you can straighten up.",
          )
        } else if (item === "Ewer" && !ewerFilled) {
          setEwerFilled(true)
          setDialogue("You lower the ewer into the pool. It comes up brimming.")
        }
      }
    }
    if (item === "Caliche" && caliceContent === "water" && currentRoom === "floral") {
      const hit = (Object.keys(FLORAL_HEAD_HOTSPOTS) as (keyof typeof FLORAL_HEAD_HOTSPOTS)[]).find((head) =>
        isPointInElement(floralHeadRefs[head].current, point),
      )
      if (hit) {
        setCaliceContent("empty")
        setDialogue(
          "You empty the caliche into the snake's mouth. It's gone in an instant, swallowed by the stone, nowhere near enough to set anything flowing.",
        )
      }
    }
    if (item === "Ewer" && !ewerFilled && currentRoom === "floral") {
      const hit = (Object.keys(FLORAL_HEAD_HOTSPOTS) as (keyof typeof FLORAL_HEAD_HOTSPOTS)[]).find((head) =>
        isPointInElement(floralHeadRefs[head].current, point),
      )
      if (hit) {
        setDialogue("The ewer is empty. There's nothing left in it to pour.")
      }
    }
    if (item === "Holy Water" && currentRoom === "floral") {
      const hit = (Object.keys(FLORAL_HEAD_HOTSPOTS) as (keyof typeof FLORAL_HEAD_HOTSPOTS)[]).find((head) =>
        isPointInElement(floralHeadRefs[head].current, point),
      )
      if (hit) {
        setDialogue("You pour the holy water into the stone jaws. It vanishes into the dry channel without a trace. Nothing here answers to it.")
      }
    }
    if (item === "Ewer" && ewerFilled && currentRoom === "floral") {
      const heads: Record<keyof typeof FLORAL_HEAD_HOTSPOTS, [boolean, (v: boolean) => void]> = {
        northwest: [floralNorthwestWet, setFloralNorthwestWet],
        northeast: [floralNortheastWet, setFloralNortheastWet],
        southeast: [floralSoutheastWet, setFloralSoutheastWet],
      }
      const hit = (Object.keys(FLORAL_HEAD_HOTSPOTS) as (keyof typeof FLORAL_HEAD_HOTSPOTS)[]).find((head) =>
        isPointInElement(floralHeadRefs[head].current, point),
      )
      if (hit) {
        const [alreadyWet, setWet] = heads[hit]
        setEwerFilled(false)
        if (alreadyWet) {
          setDialogue("Water spills over your hand. This one's already running.")
        } else {
          setWet(true)
          setDialogue(FLORAL_HEAD_MESSAGES[hit].after)
        }
      }
    }
  }

  const connections = ROOM_CONNECTIONS[currentRoom]
  const art =
    currentRoom === "thesin" && !emberOpen
      ? undefined
      : currentRoom === "ivan"
        ? {
            ...ROOM_ART.ivan!,
            src: ivanCleaned ? IVAN_ART_CLEANED : ivanSalted ? IVAN_ART_SALTED : IVAN_ART_DEFAULT,
          }
        : currentRoom === "mammon"
          ? {
              ...ROOM_ART.mammon!,
              src: mammonCleared ? MAMMON_ART_CLEAR : mammonSoftened ? MAMMON_ART_SOFTENED : MAMMON_ART_GOLD,
            }
          : ROOM_ART[currentRoom]
  const background = ROOM_BACKGROUNDS[currentRoom]
  const backgroundSrc =
    currentRoom === "thesin"
      ? emberOpen
        ? EMBER_ROOM_OPEN
        : EMBER_ROOM_SHUT
      : currentRoom === "narcissus"
        ? narcissusScratchSnapshot
          ? STILLWATER_STATUE_CHARCOAL
          : narcissusDraped
            ? STILLWATER_STATUE_DRAPED
            : STILLWATER_STATUE_DEFAULT
        : background.src
  const focus = ROOM_FOCUS[currentRoom]
  const artHotspotSrc = ART_HOTSPOTS[currentRoom]
  const plaqueHotspotSrc = PLAQUE_HOTSPOTS[currentRoom]
  const artHotspot = art && artHotspotSrc && mapToBox(artHotspotSrc, background.aspect, focus)
  // thesin's plaque is visible (though not readable — see render below) in
  // both the shut and open states, so unlike every other room it doesn't
  // wait on `art` to exist before showing its hotspot.
  const plaqueHotspot =
    (art || currentRoom === "thesin") && plaqueHotspotSrc && mapToBox(plaqueHotspotSrc, background.aspect, focus)
  const showEmberRoomLadder = currentRoom === "thesin" && emberLadderPlaced
  const showStillwaterLayer = currentRoom === "narcissus"
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
  const mammonChestHotspot = currentRoom === "mammon" ? mapToBox(MAMMON_CHEST_HOTSPOT, background.aspect, focus) : null
  const narcissusPoolHotspot =
    currentRoom === "narcissus" ? mapToBox(NARCISSUS_POOL_HOTSPOT, background.aspect, focus) : null
  const floralHeadHotspots =
    currentRoom === "floral"
      ? {
          northwest: mapToBox(FLORAL_HEAD_HOTSPOTS.northwest, background.aspect, focus),
          northeast: mapToBox(FLORAL_HEAD_HOTSPOTS.northeast, background.aspect, focus),
          southeast: mapToBox(FLORAL_HEAD_HOTSPOTS.southeast, background.aspect, focus),
        }
      : null
  const showBanquetEwer = currentRoom === "saturn" && !inventory.includes("Ewer")
  const banquetEwerHotspot = showBanquetEwer ? mapToBox(BANQUET_EWER_HOTSPOT, background.aspect, focus) : null
  const showFloralChisel = currentRoom === "floral" && !inventory.includes("Garden Chisel")
  const floralChiselHotspot = showFloralChisel ? mapToBox(FLORAL_CHISEL_HOTSPOT, background.aspect, focus) : null
  const navHotspotSrcs = NAV_HOTSPOTS[currentRoom]
  const navHotspots: Partial<Record<Direction, Rect>> = {}
  for (const direction of ["north", "south", "east", "west"] as const) {
    const rect = navHotspotSrcs?.[direction]
    if (rect) navHotspots[direction] = mapToBox(rect, background.aspect, focus)
  }
  // Caliche's icon swaps with its fill state — same tray/ghost image slot,
  // no separate item name needed. TODO: water-filled reuses the salt icon
  // for now — there's no dedicated water-caliche asset yet.
  const itemIcons = { ...ITEM_ICONS, Caliche: caliceContent === "empty" ? CALICHE_EMPTY_ICON : CALICHE_FILLED_ICON }
  // Observation text for clicking Ivan's bloodstain — the wording is the
  // player's only signal that the "blood" is sitting on top of the
  // painting rather than being part of the original artwork.
  const ivanBloodMessage = ivanCleaned
    ? "The canvas is bare there now, cleaned back to the weave. Whatever stained it is gone for good."
    : ivanSalted
      ? "A crust of dried salt clings to the canvas, drawn white against the dark oils."
      : "A dark stain sits on top of the brushwork here, not blended into it, like something spilled after the painting was finished. It still smells faintly of copper."
  // Observation text for clicking the gold-sealed lower half of Mammon's
  // canvas — same "the covering isn't part of the art" signal as
  // ivanBloodMessage above. Only reachable before the Caustic Agent is
  // applied: once softened, the view switches to the chisel's scratch
  // reveal (see the mammon branch in the art-inspector render below), which
  // doesn't have a click-to-observe hotspot.
  const mammonGoldMessage =
    "The lower half of the canvas lies beneath a hardened sheet of gold resin, sealed flat and opaque. Whatever's painted underneath is impossible to make out."

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
    if (currentRoom === "thesin" && !emberLadderPlaced) {
      setDialogue("The painting hangs too high on the wall to make out from here. You'd need something to climb.")
      return
    }
    setInspecting(true)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gray-900/80 p-4 rounded-lg border border-gray-800 mb-4">
        <p className="text-gray-300 font-mono text-sm">{ROOM_LABELS[currentRoom]}</p>
      </div>

      <div className="relative bg-gradient-to-b from-gray-950 to-black p-2 rounded-lg border border-gray-800 mb-4">
        <div
          ref={roomViewRef}
          className="relative w-full rounded-lg border border-gray-800 bg-black overflow-hidden"
          style={{ aspectRatio: BOX_ASPECT }}
        >
          <img
            src={backgroundSrc}
            alt={ROOM_LABELS[currentRoom]}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: `${focus.x}% ${focus.y}%` }}
          />

          {/* The room's walls/arch/floor, minus the statue — rendered on top
              of the statue-only backgroundSrc above so the stonework masks
              the statue to the true alcove opening instead of relying on a
              cutout that matches it exactly. */}
          {showStillwaterLayer && (
            <img
              src={STILLWATER_ROOM_LAYER}
              alt=""
              aria-hidden
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              style={{ objectPosition: `${focus.x}% ${focus.y}%` }}
            />
          )}

          {/* Each snake head's water channel, plus the headless southwest
              trunk once all three are flowing — full-canvas overlays,
              pixel-aligned to flower_room.webp. */}
          {currentRoom === "floral" && floralNorthwestWet && (
            <img
              src={FLORAL_WATER_NORTHWEST}
              alt=""
              aria-hidden
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              style={{ objectPosition: `${focus.x}% ${focus.y}%` }}
            />
          )}
          {currentRoom === "floral" && floralNortheastWet && (
            <img
              src={FLORAL_WATER_NORTHEAST}
              alt=""
              aria-hidden
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              style={{ objectPosition: `${focus.x}% ${focus.y}%` }}
            />
          )}
          {currentRoom === "floral" && floralSoutheastWet && (
            <img
              src={FLORAL_WATER_SOUTHEAST}
              alt=""
              aria-hidden
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              style={{ objectPosition: `${focus.x}% ${focus.y}%` }}
            />
          )}
          {currentRoom === "floral" && floralAllWet && (
            <img
              src={FLORAL_WATER_SOUTHWEST}
              alt=""
              aria-hidden
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              style={{ objectPosition: `${focus.x}% ${focus.y}%` }}
            />
          )}

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

          {currentRoom === "mammon" && chestOpen && (
            <img
              src={GOLDEN_HALL_CHEST_OPEN}
              alt=""
              aria-hidden
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              style={{ objectPosition: `${focus.x}% ${focus.y}%` }}
            />
          )}

          {showEmberRoomLadder && (
            <img
              src={EMBER_ROOM_LADDER}
              alt=""
              aria-hidden
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              style={{ objectPosition: `${focus.x}% ${focus.y}%` }}
            />
          )}

          {/* z-10 keeps the Caliche pickup above the chest overlay/hotspot
              below, since their hotspots overlap — the more specific, more
              valuable target should win the click and stay visible. */}
          {showItemPickup && itemPickup && itemPickupHotspot && (
            <img
              src={itemPickup.overlaySrc}
              alt=""
              aria-hidden
              className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10"
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
                onClick={() => {
                  setDialogue(obs.message)
                  if (obs.unlocksSolution) onSolve()
                }}
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
              className="absolute rounded hover:bg-white/10 hover:ring-1 hover:ring-white/30 transition-colors z-10"
              style={{
                left: `${itemPickupHotspot.left}%`,
                top: `${itemPickupHotspot.top}%`,
                width: `${itemPickupHotspot.width}%`,
                height: `${itemPickupHotspot.height}%`,
              }}
            />
          )}

          {(art || currentRoom === "thesin") && plaqueHotspot && (
            <button
              onClick={() => {
                if (currentRoom === "thesin" && !emberOpen) {
                  setDialogue("There's a plate mounted below the frame, but it's too far away to make out from here.")
                } else {
                  setShowPlaqueInfo(true)
                }
              }}
              aria-label={art ? `Read plaque for ${art.title}` : "Examine the plate"}
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
              ref={mammonDoorRef}
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

          {currentRoom === "mammon" && mammonChestHotspot && (
            <div
              ref={chestRef}
              className="absolute"
              style={{
                left: `${mammonChestHotspot.left}%`,
                top: `${mammonChestHotspot.top}%`,
                width: `${mammonChestHotspot.width}%`,
                height: `${mammonChestHotspot.height}%`,
              }}
            >
              <button
                onClick={() => {
                  if (!chestOpen) {
                    setChestOpen(true)
                    setDialogue("The lid creaks open, revealing a heap of coarse rock salt.")
                  } else {
                    setDialogue("A chest brimming with rock salt.")
                  }
                }}
                aria-label={chestOpen ? "Examine the chest of salt" : "Open the chest"}
                className="absolute inset-0 rounded hover:bg-white/10 hover:ring-1 hover:ring-white/30 transition-colors"
              />
            </div>
          )}

          {currentRoom === "narcissus" && narcissusPoolHotspot && (
            <div
              ref={poolRef}
              className="absolute"
              style={{
                left: `${narcissusPoolHotspot.left}%`,
                top: `${narcissusPoolHotspot.top}%`,
                width: `${narcissusPoolHotspot.width}%`,
                height: `${narcissusPoolHotspot.height}%`,
              }}
            >
              <button
                onClick={() => setDialogue("The pool is still and cold, the surface unbroken. Something pale drifts just beneath it.")}
                aria-label="Examine the pool"
                className="absolute inset-0 rounded hover:bg-white/10 hover:ring-1 hover:ring-white/30 transition-colors"
              />
            </div>
          )}

          {currentRoom === "floral" &&
            floralHeadHotspots &&
            (["northwest", "northeast", "southeast"] as const).map((head) => {
              const hotspot = floralHeadHotspots[head]
              const wet = head === "northwest" ? floralNorthwestWet : head === "northeast" ? floralNortheastWet : floralSoutheastWet
              const messages = FLORAL_HEAD_MESSAGES[head]
              return (
                <div
                  key={head}
                  ref={floralHeadRefs[head]}
                  className="absolute"
                  style={{
                    left: `${hotspot.left}%`,
                    top: `${hotspot.top}%`,
                    width: `${hotspot.width}%`,
                    height: `${hotspot.height}%`,
                  }}
                >
                  <button
                    onClick={() => setDialogue(wet ? messages.after : messages.before)}
                    aria-label="Examine the snake head"
                    className="absolute inset-0 rounded hover:bg-white/10 hover:ring-1 hover:ring-white/30 transition-colors"
                  />
                </div>
              )
            })}

          {/* The Ewer — rendered by hand rather than through the generic
              ROOM_ITEM_PICKUPS overlay/button pair since saturn's one slot
              in that map is already Charcoal's, see BANQUET_EWER_OVERLAY's
              own comment. Same z-10 layering as that pattern. */}
          {showBanquetEwer && banquetEwerHotspot && (
            <img
              src={BANQUET_EWER_OVERLAY}
              alt=""
              aria-hidden
              className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10"
              style={{ objectPosition: `${focus.x}% ${focus.y}%` }}
            />
          )}
          {showBanquetEwer && banquetEwerHotspot && (
            <button
              onClick={() => pickupItem("Ewer", "A wide-mouthed ewer, sitting empty among the banquet ware. This one might hold enough to make a difference.")}
              aria-label="Pick up Ewer"
              className="absolute rounded hover:bg-white/10 hover:ring-1 hover:ring-white/30 transition-colors z-10"
              style={{
                left: `${banquetEwerHotspot.left}%`,
                top: `${banquetEwerHotspot.top}%`,
                width: `${banquetEwerHotspot.width}%`,
                height: `${banquetEwerHotspot.height}%`,
              }}
            />
          )}

          {/* The Garden Chisel — rendered by hand like the Ewer, same
              full-canvas-overlay + hotspot-button pair. */}
          {showFloralChisel && floralChiselHotspot && (
            <img
              src={FLORAL_CHISEL_OVERLAY}
              alt=""
              aria-hidden
              className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10"
              style={{ objectPosition: `${focus.x}% ${focus.y}%` }}
            />
          )}
          {showFloralChisel && floralChiselHotspot && (
            <button
              onClick={() => pickupItem("Garden Chisel", "A small garden chisel, its edge still sharp despite the rust creeping up the handle.")}
              aria-label="Pick up Garden Chisel"
              className="absolute rounded hover:bg-white/10 hover:ring-1 hover:ring-white/30 transition-colors z-10"
              style={{
                left: `${floralChiselHotspot.left}%`,
                top: `${floralChiselHotspot.top}%`,
                width: `${floralChiselHotspot.width}%`,
                height: `${floralChiselHotspot.height}%`,
              }}
            />
          )}

          {(["north", "south", "east", "west"] as const).map((direction) => {
            const hotspot = navHotspots[direction]
            if (hotspot) {
              return (
                <button
                  key={direction}
                  onClick={() => navigate(direction)}
                  aria-label={`Go ${direction}`}
                  className="absolute rounded hover:bg-white/10 hover:ring-1 hover:ring-white/30 transition-colors"
                  style={{
                    left: `${hotspot.left}%`,
                    top: `${hotspot.top}%`,
                    width: `${hotspot.width}%`,
                    height: `${hotspot.height}%`,
                  }}
                />
              )
            }
            return (
              <NavArrow
                key={direction}
                direction={direction}
                available={!!connections[direction]}
                onClick={() => navigate(direction)}
              />
            )
          })}

          {/* Art inspector: scoped to this room-view box (not a
              viewport-wide overlay) so it dims and clips to just the
              mansion image, same convention as showPlaqueInfo above. */}
          {inspecting && art && (
            <div className="absolute inset-0 bg-black/95 z-50 flex flex-col p-2">
              <button
                onClick={() => setInspecting(false)}
                aria-label="Close"
                className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center border border-gray-700"
              >
                <X className="w-4 h-4 text-gray-300" />
              </button>
              {currentRoom === "narcissus" ? (
                narcissusDraped ? (
                  <div ref={artViewportRef} className="w-full flex-1 min-h-0">
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
                  <div ref={artViewportRef} className="w-full flex-1 min-h-0">
                    <PaintingInspector
                      src="/images/paintings/narcissus_statue.webp"
                      alt={art.alt}
                      className="w-full h-full"
                      zoomEnabled={loupeUnlocked}
                      secondaryHotspot={{
                        rect: NARCISSUS_PLAQUE_HOTSPOT,
                        ariaLabel: `Read plaque for ${art.title}`,
                        onClick: () => setShowPlaqueInfo(true),
                      }}
                    />
                  </div>
                )
              ) : currentRoom === "thesin" ? (
                <div ref={artViewportRef} className="w-full flex-1 min-h-0">
                  <LampReveal
                    ref={lampRevealRef}
                    cleanSrc="/images/paintings/the-sin.webp"
                    revealedSrc="/images/paintings/the-sin_exposed.webp"
                    alt={art.alt}
                    className="w-full h-full"
                    zoomEnabled={loupeUnlocked}
                  />
                </div>
              ) : currentRoom === "saturn" ? (
                <div ref={artViewportRef} className="w-full flex-1 min-h-0">
                  <LampReveal
                    ref={lampRevealRef}
                    cleanSrc="/images/paintings/saturn-devouring-his-son.webp"
                    revealedSrc="/images/paintings/saturn-devouring-his-son_reveal.webp"
                    alt={art.alt}
                    className="w-full h-full"
                    zoomEnabled={loupeUnlocked}
                  />
                </div>
              ) : currentRoom === "mammon" && mammonSoftened ? (
                <div ref={artViewportRef} className="w-full flex-1 min-h-0">
                  <CharcoalRubbing
                    ref={charcoalRubbingRef}
                    cleanSrc={MAMMON_ART_SOFTENED}
                    revealedSrc={MAMMON_ART_CLEAR}
                    alt={art.alt}
                    className="w-full h-full"
                    zoomEnabled={loupeUnlocked}
                    initialSnapshot={mammonScratchSnapshot ?? undefined}
                    onStrokeEnd={(snapshot) => {
                      if (!mammonScratchSnapshot) {
                        setDialogue(
                          "You work the chisel under the softened gold, scraping it away in long curls.",
                        )
                      }
                      setMammonScratchSnapshot(snapshot)
                    }}
                    onScratch={handleGoldScratch}
                  />
                </div>
              ) : (
                <div ref={artViewportRef} className="w-full flex-1 min-h-0">
                  <PaintingInspector
                    src={
                      // Invidia and Desidia's hidden lettering is loupe-gated
                      // (no separate item) — swap to the pre-existing `_x`
                      // asset once the Loupe is unlocked, per docs/level-15-mansion-redesign.md §9.3.
                      currentRoom === "invidia" && loupeUnlocked
                        ? "/images/paintings/invidia_x.webp"
                        : currentRoom === "desidia" && loupeUnlocked
                          ? "/images/paintings/desidia_x.webp"
                          : art.src
                    }
                    alt={art.alt}
                    className="w-full h-full"
                    zoomEnabled={loupeUnlocked}
                    extraScale={currentRoom === "ivan" ? 2 : 1}
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
                    secondaryHotspot={
                      currentRoom === "ivan"
                        ? {
                            rect: IVAN_BLOOD_HOTSPOT,
                            ariaLabel: "Examine the stain",
                            onClick: () => setDialogue(ivanBloodMessage),
                            hotspotRef: ivanBloodRef,
                          }
                        : currentRoom === "mammon"
                          ? {
                              rect: MAMMON_GOLD_HOTSPOT,
                              ariaLabel: "Examine the sealed canvas",
                              onClick: () => setDialogue(mammonGoldMessage),
                              hotspotRef: mammonGoldRef,
                            }
                          : undefined
                    }
                  />
                </div>
              )}

              {/* Oil Lamp glow: a warm light that follows the lamp while
                  it's dragged over the art viewport, as if the player were
                  holding it up to the painting. Purely cosmetic — z-40 keeps
                  it above the art but below the dragged lamp icon itself
                  (z-60). */}
              {lampGlowPoint &&
                createPortal(
                  // Portaled to <body> for the same reason as
                  // item-drag-tray's ghost: this screen sits inside a
                  // backdrop-blur-sm ancestor, which becomes the containing
                  // block for `position: fixed` descendants and would
                  // otherwise offset the glow far from the actual cursor.
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

              {/* Gold flecks kicked up by the Garden Chisel — same portal
                  reasoning as the lamp glow above. z-40 keeps them above the
                  art but below the dragged chisel icon (z-60). */}
              {goldParticles.length > 0 &&
                createPortal(
                  <>
                    {goldParticles.map((p) => (
                      <div
                        key={p.id}
                        aria-hidden
                        className="fixed z-40 pointer-events-none rounded-full animate-goldFleck"
                        style={
                          {
                            left: p.x,
                            top: p.y,
                            width: 4,
                            height: 4,
                            background:
                              "radial-gradient(circle, rgba(255,231,163,0.95) 0%, rgba(217,180,100,0.9) 55%, rgba(180,140,60,0) 100%)",
                            boxShadow: "0 0 4px 1px rgba(255,215,130,0.6)",
                            "--tx": `${p.tx}px`,
                            "--ty": `${p.ty}px`,
                          } as React.CSSProperties
                        }
                      />
                    ))}
                  </>,
                  document.body,
                )}

            </div>
          )}

        </div>

      </div>

      {/* Portaled to <body>, same reason as the Oil Lamp glow below: hotspots
          that fire setDialogue can be clicked from inside the art inspector
          (a fixed, z-50 fullscreen overlay), and this screen also sits
          inside a backdrop-blur-sm ancestor that becomes the containing
          block for `position: fixed` descendants — so a non-portaled,
          non-fixed popup scoped to the room-view box renders invisibly
          underneath the inspector instead of on top of it. z-[60] clears
          the inspector's z-50. */}
      {dialogue &&
        createPortal(
          <div
            className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4"
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
          </div>,
          document.body,
        )}

      {/* Portaled for the same reason as dialogue above — narcissus's plate
          is only reachable from inside the fullscreen inspector, so this
          can't be scoped to the room-view box or it'd render underneath it. */}
      {showPlaqueInfo &&
        art &&
        createPortal(
          <div
            className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4"
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
              <p className="text-gray-500 font-mono text-xs">{art.medium}</p>
            </div>
          </div>,
          document.body,
        )}

      {/* Inventory tray — a single instance, always visible (including while
          the art inspector is open on top of the room view), same as level
          1's prison-cell-puzzle.tsx: drag from here onto whatever's
          currently on screen. onDrop tries the art-viewport handler first
          (a no-op unless the inspector is open and the drop lands on it,
          via isOverArtViewport) then the room-view handler (a no-op unless
          its own refs are mounted, which only happens while the inspector
          is closed) — the two target sets never overlap. Icon tile if
          ITEM_ICONS has one, otherwise a plain text pill. */}
      {inventory.length > 0 && (
        <div className="bg-gray-800/50 p-2 rounded-md shadow-md mb-4">
          <ItemDragTray
            items={inventory}
            icons={itemIcons}
            activeItems={loupeUnlocked ? ["Loupe"] : []}
            onDragMove={handleItemDragMove}
            onDrop={(item, point) => {
              handleItemDrop(item, point)
              handleRoomItemDrop(item, point)
            }}
          />
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
