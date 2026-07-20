"use client"

import { useState, useEffect } from "react"

interface BookshelfChronologyPuzzleProps {
  onSolve: () => void
}

interface BookDef {
  id: string
  title: string
  width: number
  height: number
}

// thethirdeye sits in the shelf's center slot (1956), between Barren Ground
// (1925) and And Then There Were None (1939) by row position, even though
// 1956 is chronologically later than 1939. It's the fixed anchor, not part
// of the ascending sequence. Titles are now baked directly into the art
// (no CSS text overlay), so width/height come straight from each cropped
// image's real pixel dimensions.
const BOOKS: BookDef[] = [
  { id: "wutheringheights", title: "Wuthering Heights", width: 75, height: 394 },
  { id: "greatexpectations", title: "Great Expectations", width: 71, height: 400 },
  { id: "dracula", title: "Dracula", width: 79, height: 346 },
  { id: "barrenground", title: "Barren Ground", width: 76, height: 319 },
  { id: "thethirdeye", title: "The Third Eye", width: 77, height: 337 },
  { id: "andthentherewerenone", title: "And Then There Were None", width: 77, height: 476 },
  { id: "carrie", title: "Carrie", width: 78, height: 321 },
  { id: "ghoststory", title: "Ghost Story", width: 77, height: 305 },
  { id: "empireofthesun", title: "Empire of the Sun", width: 76, height: 399 },
]

// Correct left-to-right slot order, matching the plaques baked into bookshelf.webp:
// 1847, 1861, 1897, 1925, 1956, 1939, 1974, 1979, 1984
const CORRECT_ORDER = [
  "wutheringheights",
  "greatexpectations",
  "dracula",
  "barrenground",
  "thethirdeye",
  "andthentherewerenone",
  "carrie",
  "ghoststory",
  "empireofthesun",
]

const SLOT_CENTERS_X = [90.2, 180.9, 273.1, 361.8, 453.0, 546.2, 636.9, 725.1, 815.8]
const SLOT_TOP = 558
const SLOT_BOTTOM = 1028
const BEAM_TOP = 545
const CANVAS_WIDTH = 906
const CANVAS_HEIGHT = 1174

// Starting arrangement: shortest to tallest spine, left to right.
const START_ORDER = [
  "ghoststory",
  "barrenground",
  "carrie",
  "thethirdeye",
  "dracula",
  "empireofthesun",
  "greatexpectations",
  "wutheringheights",
  "andthentherewerenone",
]

export default function BookshelfChronologyPuzzle({ onSolve }: BookshelfChronologyPuzzleProps) {
  const [slotOrder, setSlotOrder] = useState<string[]>(START_ORDER)
  const [draggedSlot, setDraggedSlot] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)

  const bookById = Object.fromEntries(BOOKS.map((b) => [b.id, b]))
  const isSolved = slotOrder.every((id, i) => id === CORRECT_ORDER[i])

  useEffect(() => {
    if (isSolved) setRevealed(true)
  }, [isSolved])

  useEffect(() => {
    if (!isSolved) return
    const timer = setTimeout(() => onSolve(), 2200)
    return () => clearTimeout(timer)
  }, [isSolved, onSolve])

  function handleDrop(targetIndex: number) {
    if (revealed || draggedSlot === null || draggedSlot === targetIndex) return
    setSlotOrder((prev) => {
      const next = [...prev]
      ;[next[draggedSlot], next[targetIndex]] = [next[targetIndex], next[draggedSlot]]
      return next
    })
    setDraggedSlot(null)
  }

  return (
    <div className="my-4 flex flex-col items-center gap-2">
      <div
        className="relative w-full"
        style={{
          maxWidth: 480,
          aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}`,
        }}
      >
        <img
          src={revealed ? "/images/bookshelf/bookshelf_dark.webp" : "/images/bookshelf/bookshelf.webp"}
          alt="Bookshelf"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
          style={{ zIndex: 0 }}
          draggable={false}
        />

        {/* Ambient light falling from the window onto the shelf's physical center
            slot — present from the start, independent of which book sits there. */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: `${(SLOT_CENTERS_X[4] / CANVAS_WIDTH) * 100}%`,
            top: `${(BEAM_TOP / CANVAS_HEIGHT) * 100}%`,
            width: "26%",
            height: `${((SLOT_BOTTOM - BEAM_TOP) / CANVAS_HEIGHT) * 100}%`,
            transform: "translateX(-50%)",
            clipPath: "polygon(44% 0%, 56% 0%, 100% 100%, 0% 100%)",
            background: "linear-gradient(to bottom, rgba(190,150,220,0) 0%, rgba(190,140,215,0.07) 100%)",
            mixBlendMode: "screen",
            zIndex: 20,
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            left: `${(SLOT_CENTERS_X[4] / CANVAS_WIDTH) * 100}%`,
            top: `${(SLOT_TOP / CANVAS_HEIGHT) * 100}%`,
            width: "16%",
            height: `${((SLOT_BOTTOM - SLOT_TOP) / CANVAS_HEIGHT) * 100}%`,
            transform: "translate(-50%, -8%)",
            background: "radial-gradient(ellipse at 50% 15%, rgba(190,130,210,0.10) 0%, transparent 65%)",
            mixBlendMode: "screen",
            zIndex: 21,
          }}
        />

        {slotOrder.map((bookId, slotIndex) => {
          const book = bookById[bookId]
          const centerXPct = (SLOT_CENTERS_X[slotIndex] / CANVAS_WIDTH) * 100
          const topPct = (SLOT_TOP / CANVAS_HEIGHT) * 100
          const heightPct = ((SLOT_BOTTOM - SLOT_TOP) / CANVAS_HEIGHT) * 100
          const widthPct = (book.width / CANVAS_WIDTH) * 100

          return (
            <div
              key={slotIndex}
              draggable={!revealed}
              onDragStart={() => setDraggedSlot(slotIndex)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(slotIndex)}
              className={revealed ? "absolute" : "absolute cursor-grab active:cursor-grabbing"}
              style={{
                left: `${centerXPct}%`,
                top: `${topPct}%`,
                width: `${widthPct}%`,
                height: `${heightPct}%`,
                transform: "translateX(-50%)",
                opacity: draggedSlot === slotIndex ? 0.4 : 1,
                zIndex: 10,
              }}
            >
              <img
                src={`/images/bookshelf/cropped/${bookId}.webp`}
                alt={book.title}
                className="w-full h-full object-contain pointer-events-none select-none"
                style={{ objectPosition: "center bottom" }}
                draggable={false}
              />
            </div>
          )
        })}

        {revealed && (
          <div
            className="absolute pointer-events-none animate-in fade-in duration-[1500ms]"
            style={{
              left: `${(SLOT_CENTERS_X[4] / CANVAS_WIDTH) * 100}%`,
              top: `${(BEAM_TOP / CANVAS_HEIGHT) * 100}%`,
              width: "16%",
              height: `${((SLOT_BOTTOM - BEAM_TOP) / CANVAS_HEIGHT) * 100}%`,
              transform: "translateX(-50%)",
              zIndex: 50,
            }}
          >
            <img
              src="/images/bookshelf/light-cropped.webp"
              alt=""
              className="w-full h-full object-contain pointer-events-none select-none"
              style={{ objectPosition: "center top", mixBlendMode: "screen" }}
              draggable={false}
            />
          </div>
        )}
      </div>
      {revealed && (
        <p className="text-amber-200 font-medieval text-sm animate-in fade-in duration-1000">
          The light through the glass settles across the shelf.
        </p>
      )}
    </div>
  )
}
