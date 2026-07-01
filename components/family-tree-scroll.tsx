"use client"

import { useEffect, useState } from "react"
import { Eraser, X } from "lucide-react"
import { familyTree, type FamilyTreeNode } from "@/data/family-tree"

const TREE_HIGHLIGHTS_STORAGE_KEY = "puzzle-escape-tree-highlights"

// Deckled-edge silhouette: straight top/bottom (covered by the rollers), torn waver on left/right
const TORN_EDGE_CLIP =
  "polygon(0% 0%, 100% 0%, 100% 6%, 98.3% 12%, 100% 18%, 99% 24%, 100% 30%, 98.4% 36%, 100% 42%, 99% 48%, 100% 54%, 98.3% 60%, 100% 66%, 99% 72%, 100% 78%, 98.4% 84%, 100% 90%, 99% 96%, 100% 100%, 0% 100%, 0% 96%, 1.6% 90%, 0% 84%, 1% 78%, 0% 72%, 1.7% 66%, 0% 60%, 1% 54%, 0% 48%, 1.6% 42%, 0% 36%, 1% 30%, 0% 24%, 1.7% 18%, 0% 12%, 1% 6%, 0% 0%)"

function InkConnector({ vertical = true }: { vertical?: boolean }) {
  if (vertical) {
    return (
      <svg width="6" height="22" viewBox="0 0 6 22" className="overflow-visible" aria-hidden="true">
        <path d="M3 0 C 1.5 5, 4.5 9, 3 14 C 1.8 17, 3.6 19, 3 22" stroke="#3b2a1a" strokeWidth="1.6" fill="none" opacity="0.55" strokeLinecap="round" />
      </svg>
    )
  }
  return (
    <svg width="100%" height="10" viewBox="0 0 200 10" preserveAspectRatio="none" className="overflow-visible" aria-hidden="true">
      <path
        d="M0 5 Q 20 2, 40 6 T 80 4 T 120 7 T 160 3 T 200 5"
        stroke="#3b2a1a"
        strokeWidth="1.4"
        fill="none"
        opacity="0.45"
        strokeLinecap="round"
      />
    </svg>
  )
}

function ScrollRoller({ position }: { position: "top" | "bottom" }) {
  return (
    <div
      className="relative z-10 mx-1 h-5 rounded-full"
      style={{
        background: "linear-gradient(180deg, #8a6336 0%, #5c3f1f 45%, #2e1d0d 100%)",
        boxShadow:
          position === "top"
            ? "0 3px 6px rgba(0,0,0,0.55), inset 0 1px 1px rgba(255,224,170,0.25), inset 0 -2px 3px rgba(0,0,0,0.4)"
            : "0 -1px 4px rgba(0,0,0,0.3), 0 3px 6px rgba(0,0,0,0.55), inset 0 1px 1px rgba(255,224,170,0.25), inset 0 -2px 3px rgba(0,0,0,0.4)",
      }}
    />
  )
}

function Scribble() {
  return (
    <svg width="76" height="20" viewBox="0 0 76 20" className="inline-block" aria-hidden="true">
      <path
        d="M2 10 C 10 3, 18 17, 27 7 C 35 1, 41 16, 50 6 C 57 2, 63 15, 73 9"
        stroke="#1a1108"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M3 6 C 13 15, 21 3, 31 13 C 40 4, 48 14, 57 4 C 63 11, 68 5, 73 12"
        stroke="#1a1108"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  )
}

function NodeBox({
  node,
  highlighted,
  onToggle,
}: {
  node: FamilyTreeNode
  highlighted: boolean
  onToggle: () => void
}) {
  if (node.scribbled) {
    return (
      <div className="flex flex-col items-center py-1">
        <Scribble />
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex flex-col items-center text-center px-2 py-1 rounded-sm transition-colors duration-150 cursor-pointer ${
        highlighted ? "bg-amber-400/50" : "hover:bg-amber-400/20"
      }`}
    >
      <span className="font-medieval text-[#3b2a1a] text-sm leading-tight">
        {node.title} {node.name}
      </span>
      <span className="font-parchment italic text-[#5c4326] text-xs leading-tight">{node.nickname}</span>
    </button>
  )
}

function TreeBranch({
  node,
  highlights,
  onToggle,
}: {
  node: FamilyTreeNode
  highlights: Set<string>
  onToggle: (id: string) => void
}) {
  const hasMultipleChildren = (node.children?.length ?? 0) > 1

  return (
    <div className="flex flex-col items-center w-full">
      <NodeBox node={node} highlighted={highlights.has(node.id)} onToggle={() => onToggle(node.id)} />
      {node.children && node.children.length > 0 && (
        <div className="flex flex-col items-center w-full">
          {node.children.map((child, index) => (
            <div key={child.id} className="flex flex-col items-center w-full">
              <InkConnector vertical />
              <TreeBranch node={child} highlights={highlights} onToggle={onToggle} />
              {hasMultipleChildren && index < node.children!.length - 1 && (
                <div className="w-2/3 my-3">
                  <InkConnector vertical={false} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function FamilyTreeScroll({ onClose }: { onClose: () => void }) {
  const [highlights, setHighlights] = useState<Set<string>>(new Set())

  useEffect(() => {
    try {
      const stored = localStorage.getItem(TREE_HIGHLIGHTS_STORAGE_KEY)
      if (stored) setHighlights(new Set(JSON.parse(stored)))
    } catch {
      // ignore corrupt/missing storage
    }
  }, [])

  const toggleHighlight = (id: string) => {
    setHighlights((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      localStorage.setItem(TREE_HIGHLIGHTS_STORAGE_KEY, JSON.stringify(Array.from(next)))
      return next
    })
  }

  const clearHighlights = () => {
    setHighlights(() => {
      localStorage.setItem(TREE_HIGHLIGHTS_STORAGE_KEY, JSON.stringify([]))
      return new Set()
    })
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <ScrollRoller position="top" />
      <div className="relative">
        <div
          className="px-7 py-5 overflow-auto max-h-[65vh]"
          style={{
            clipPath: TORN_EDGE_CLIP,
            backgroundColor: "#d9c49a",
            backgroundImage:
              "radial-gradient(circle at 12% 15%, rgba(110,80,40,0.3) 0%, transparent 30%), radial-gradient(circle at 88% 10%, rgba(110,80,40,0.28) 0%, transparent 28%), radial-gradient(circle at 78% 88%, rgba(110,80,40,0.32) 0%, transparent 38%), radial-gradient(circle at 15% 92%, rgba(110,80,40,0.26) 0%, transparent 32%), radial-gradient(circle at 50% 50%, rgba(110,80,40,0.12) 0%, transparent 60%)",
            boxShadow: "inset 0 0 55px rgba(70,45,15,0.5), inset 0 0 16px rgba(40,25,10,0.4)",
          }}
        >
          <div className="text-center font-medieval text-[#3b2a1a] text-xl mb-1 pt-1">House of Morvane</div>
          <div className="text-center font-parchment italic text-[#5c4326] text-xs mb-4">~ a family tree, much creased ~</div>

          <div className="flex justify-center w-full">
            <TreeBranch node={familyTree} highlights={highlights} onToggle={toggleHighlight} />
          </div>
        </div>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/10 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity"
          aria-label="Close family tree"
        >
          <X className="w-4 h-4 text-[#3b2a1a]" />
        </button>
        <button
          onClick={clearHighlights}
          className="absolute top-3 left-3 w-7 h-7 rounded-full bg-black/10 flex items-center justify-center opacity-30 hover:opacity-90 transition-opacity"
          aria-label="Clear highlights"
        >
          <Eraser className="w-3.5 h-3.5 text-[#3b2a1a]" />
        </button>
      </div>
      <ScrollRoller position="bottom" />
    </div>
  )
}
