"use client"

import { useState, useEffect, useLayoutEffect, useRef } from "react"

interface BookshelfChronologyPuzzleProps {
  onSolve: () => void
}

interface BookDef {
  id: string
  title: string
  width: number
  height: number
  textColor: string
}

// book_e is the Third Eye — it sits in the shelf's center slot (1956), between
// Barren Ground (1925) and And Then There Were None (1939) by row position,
// even though 1956 is chronologically later than 1939. It's the fixed anchor,
// not part of the ascending sequence.
// textColor is varied per book so titles stay legible against similarly-toned
// spines and are easier to tell apart at a glance while dragging.
const BOOKS: BookDef[] = [
  { id: "book_a", title: "Wuthering Heights", width: 92, height: 378, textColor: "#f2e2c4" },
  { id: "book_b", title: "Great Expectations", width: 102, height: 378, textColor: "#e8f0d8" },
  { id: "book_c", title: "Dracula", width: 100, height: 378, textColor: "#ffe1c2" },
  { id: "book_d", title: "Barren Ground", width: 101, height: 378, textColor: "#fbf3d0" },
  { id: "book_e", title: "The Third Eye", width: 99, height: 378, textColor: "#ffd9a8" },
  { id: "book_f", title: "And Then There Were None", width: 102, height: 378, textColor: "#dbe9ff" },
  { id: "book_g", title: "Carrie", width: 95, height: 378, textColor: "#d8fff0" },
  { id: "book_h", title: "Ghost Story", width: 99, height: 378, textColor: "#fdfdfd" },
  { id: "book_i", title: "Empire of the Sun", width: 99, height: 378, textColor: "#ffe9c7" },
]

// Correct left-to-right slot order, matching the plaques baked into bookshelf.webp:
// 1847, 1861, 1897, 1925, 1956, 1939, 1974, 1979, 1984
const CORRECT_ORDER = ["book_a", "book_b", "book_c", "book_d", "book_e", "book_f", "book_g", "book_h", "book_i"]

const SLOT_CENTERS_X = [91.5, 183.5, 277, 367, 459.5, 554, 646, 735.5, 827.5]
const SLOT_TOP = 487
const SLOT_BOTTOM = 865
const CANVAS_WIDTH = 919
const CANVAS_HEIGHT = 1004

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function randomStartOrder(): string[] {
  let order = shuffle(CORRECT_ORDER)
  while (order.every((id, i) => id === CORRECT_ORDER[i])) {
    order = shuffle(CORRECT_ORDER)
  }
  return order
}

// Measures its own container's real rendered height and sizes the vertical
// spine text to actually fit — a fixed length->px table breaks once the
// canvas is scaled down (text wraps into a second column and bleeds into
// the neighboring spine), so this reacts to the true pixel height instead.
function SpineLabel({
  title,
  textColor,
  cipherLetterIndex,
  highlightCipherLetter,
}: {
  title: string
  textColor: string
  cipherLetterIndex: number
  highlightCipherLetter: boolean
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const spanRef = useRef<HTMLSpanElement>(null)
  const [fontSize, setFontSize] = useState(14)

  useLayoutEffect(() => {
    const container = containerRef.current
    const span = spanRef.current
    if (!container || !span) return

    const measure = () => {
      const containerHeight = container.clientHeight
      if (!containerHeight) return

      // Font metrics/letter-spacing overhead are hard to predict reliably, so
      // measure the actual rendered extent at a fixed baseline size and scale
      // from that — this can never overflow regardless of font quirks.
      const BASELINE = 100
      span.style.fontSize = `${BASELINE}px`
      const naturalHeight = span.getBoundingClientRect().height
      if (!naturalHeight) return

      const fitted = (containerHeight * 0.92 * BASELINE) / naturalHeight
      const finalSize = Math.max(5, Math.min(16, fitted))
      span.style.fontSize = `${finalSize}px`
      setFontSize(finalSize)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(container)
    return () => observer.disconnect()
  }, [title])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
      style={{ writingMode: "vertical-rl", textOrientation: "upright" }}
    >
      <span
        ref={spanRef}
        className="font-parchment text-center leading-none"
        style={{
          fontSize,
          color: textColor,
          letterSpacing: "0.015em",
          whiteSpace: "nowrap",
          textShadow: "0 0 2px black, 0 0 3px black",
        }}
      >
        {title.split("").map((ch, i) =>
          highlightCipherLetter && i === cipherLetterIndex ? (
            <span key={i} className="text-yellow-200" style={{ textShadow: "0 0 6px #fff59d, 0 0 12px #ffee58" }}>
              {ch}
            </span>
          ) : (
            ch
          ),
        )}
      </span>
    </div>
  )
}

export default function BookshelfChronologyPuzzle({ onSolve }: BookshelfChronologyPuzzleProps) {
  const [slotOrder, setSlotOrder] = useState<string[]>(randomStartOrder)
  const [draggedSlot, setDraggedSlot] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)

  const bookById = Object.fromEntries(BOOKS.map((b) => [b.id, b]))
  const isSolved = slotOrder.every((id, i) => id === CORRECT_ORDER[i])

  useEffect(() => {
    if (isSolved && !revealed) {
      setRevealed(true)
      const timer = setTimeout(() => onSolve(), 2200)
      return () => clearTimeout(timer)
    }
  }, [isSolved, revealed, onSolve])

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
        className="relative w-full transition-[filter] duration-1000"
        style={{
          maxWidth: 480,
          aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}`,
          filter: revealed ? "brightness(0.55)" : "none",
        }}
      >
        <img
          src="/images/bookshelf/bookshelf.webp"
          alt="Bookshelf"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
          draggable={false}
        />

        {revealed && (
          <div
            className="absolute pointer-events-none animate-in fade-in duration-[1500ms]"
            style={{
              left: `${(SLOT_CENTERS_X[4] / CANVAS_WIDTH) * 100}%`,
              top: 0,
              width: "60%",
              height: "58%",
              transform: "translateX(-50%)",
              background:
                "radial-gradient(ellipse at 50% 100%, rgba(255,80,60,0.55) 0%, rgba(255,80,60,0.25) 35%, transparent 70%)",
              mixBlendMode: "screen",
            }}
          />
        )}

        {slotOrder.map((bookId, slotIndex) => {
          const book = bookById[bookId]
          const centerXPct = (SLOT_CENTERS_X[slotIndex] / CANVAS_WIDTH) * 100
          const topPct = (SLOT_TOP / CANVAS_HEIGHT) * 100
          const heightPct = ((SLOT_BOTTOM - SLOT_TOP) / CANVAS_HEIGHT) * 100
          const widthPct = (book.width / CANVAS_WIDTH) * 100
          const isThirdEye = bookId === "book_e"
          const cipherLetterIndex = 2

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
              }}
            >
              <img
                src={`/images/bookshelf/cropped/${bookId}.webp`}
                alt={book.title}
                className="w-full h-full object-contain pointer-events-none select-none"
                draggable={false}
                style={{
                  filter: revealed && isThirdEye ? "drop-shadow(0 0 8px rgba(255,90,60,0.9))" : undefined,
                }}
              />
              <SpineLabel
                title={book.title}
                textColor={book.textColor}
                cipherLetterIndex={cipherLetterIndex}
                highlightCipherLetter={revealed && !isThirdEye}
              />
            </div>
          )
        })}

        {revealed && (
          <img
            src="/images/bookshelf/light.webp"
            alt=""
            className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none animate-in fade-in duration-[1500ms]"
            style={{ zIndex: 50, mixBlendMode: "screen" }}
            draggable={false}
          />
        )}
      </div>
      {revealed && (
        <p className="text-amber-200 font-medieval text-sm animate-in fade-in duration-1000">
          The light through the glass picks out a word.
        </p>
      )}
    </div>
  )
}
