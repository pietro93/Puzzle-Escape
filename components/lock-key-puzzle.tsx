"use client"

import { useState, useEffect } from "react"

interface LockKeyPuzzleProps {
  onSolve: () => void
  onSolutionGenerated: (solution: string) => void
}

type LockType = "gold" | "silver" | "bronze"
type LockState = "locked" | "unlocked"

interface ValuePair {
  locked: number
  unlocked: number
}

// Each occurrence is an independent lock icon: toggling it only affects the
// equation it appears in, even if another occurrence of the same type/value
// exists elsewhere.
// Toggleable occurrences (eq1-3). Each is its own independent lock icon.
type OccurrenceId = "gold1" | "silver1" | "bronze2" | "gold2" | "silver2" | "silver3" | "bronze3" | "gold3"

interface Occurrence {
  id: OccurrenceId
  type: LockType
}

interface PuzzleData {
  pairs: Record<LockType, ValuePair>
  correctStates: Record<OccurrenceId, LockState>
  // Eq4's lock states are fixed at generation time and never change — they are
  // not tied to whatever the player toggles in eq1-3.
  fixedStates: { bronze4: LockState; silver4: LockState; gold4: LockState }
  X: number
  Y: number
  Z: number
  solutionSum: number
}

const LOCK_META: Record<LockType, { label: string; ring: string; glow: string; text: string }> = {
  gold: { label: "Gold", ring: "border-amber-400", glow: "shadow-[0_0_10px_rgba(251,191,36,0.7)]", text: "text-amber-300" },
  silver: { label: "Silver", ring: "border-slate-300", glow: "shadow-[0_0_10px_rgba(203,213,225,0.7)]", text: "text-slate-200" },
  bronze: { label: "Bronze", ring: "border-orange-700", glow: "shadow-[0_0_10px_rgba(194,101,46,0.7)]", text: "text-orange-400" },
}

const EQ1: Occurrence[] = [
  { id: "gold1", type: "gold" },
  { id: "silver1", type: "silver" },
]
const EQ2: Occurrence[] = [
  { id: "bronze2", type: "bronze" },
  { id: "gold2", type: "gold" },
  { id: "silver2", type: "silver" },
]
const EQ3: Occurrence[] = [
  { id: "silver3", type: "silver" },
  { id: "bronze3", type: "bronze" },
  { id: "gold3", type: "gold" },
]
const ALL_OCCURRENCES: Occurrence[] = [...EQ1, ...EQ2, ...EQ3]

// Lock design: one color gets a state of 5 or 6, another color gets a state
// of 0, and the third gets a state of 2-5. Each color's other state is a free
// random 1-5. Which color plays which role is randomized every puzzle.
function generatePairs(): Record<LockType, ValuePair> {
  const types: LockType[] = ["gold", "silver", "bronze"]

  for (let attempt = 0; attempt < 50; attempt++) {
    const [bigType, zeroType, midType] = [...types].sort(() => Math.random() - 0.5)

    const forcedValue: Record<LockType, number> = {
      [bigType]: Math.random() < 0.5 ? 5 : 6,
      [zeroType]: 0,
      [midType]: 2 + Math.floor(Math.random() * 4), // 2-5
    } as Record<LockType, number>

    const pairs: Partial<Record<LockType, ValuePair>> = {}
    let valid = true
    for (const t of types) {
      const forcedState: LockState = randomState()
      const otherValue = 1 + Math.floor(Math.random() * 5) // 1-5
      if (otherValue === forcedValue[t]) {
        valid = false
        break
      }
      pairs[t] = forcedState === "locked" ? { locked: forcedValue[t], unlocked: otherValue } : { locked: otherValue, unlocked: forcedValue[t] }
    }
    if (!valid) continue

    return pairs as Record<LockType, ValuePair>
  }
  return { gold: { locked: 6, unlocked: 1 }, silver: { locked: 0, unlocked: 3 }, bronze: { locked: 2, unlocked: 4 } }
}

function randomState(): LockState {
  return Math.random() < 0.5 ? "locked" : "unlocked"
}

function valueOf(pairs: Record<LockType, ValuePair>, occ: Occurrence, states: Record<OccurrenceId, LockState>): number {
  return pairs[occ.type][states[occ.id]]
}

function countUniqueSolutions(
  occurrences: Occurrence[],
  pairs: Record<LockType, ValuePair>,
  target: number,
  evaluate: (values: Record<OccurrenceId, number>) => number
): number {
  let count = 0
  const n = occurrences.length
  for (let mask = 0; mask < 1 << n; mask++) {
    const values: Partial<Record<OccurrenceId, number>> = {}
    occurrences.forEach((occ, i) => {
      const state: LockState = (mask >> i) & 1 ? "locked" : "unlocked"
      values[occ.id] = pairs[occ.type][state]
    })
    if (evaluate(values as Record<OccurrenceId, number>) === target) count++
  }
  return count
}

function generatePuzzle(): PuzzleData {
  for (let attempt = 0; attempt < 3000; attempt++) {
    const pairs = generatePairs()

    // Eq2 is bronze2 + gold2 - silver2: ensure it can never go negative no
    // matter how the player toggles those three locks, not just at the target.
    const minBronzeGold = Math.min(pairs.bronze.locked, pairs.bronze.unlocked) + Math.min(pairs.gold.locked, pairs.gold.unlocked)
    const maxSilver = Math.max(pairs.silver.locked, pairs.silver.unlocked)
    if (minBronzeGold < maxSilver) continue

    const correctStates: Record<OccurrenceId, LockState> = {} as Record<OccurrenceId, LockState>
    for (const occ of ALL_OCCURRENCES) correctStates[occ.id] = randomState()

    const gold1 = valueOf(pairs, EQ1[0], correctStates)
    const silver1 = valueOf(pairs, EQ1[1], correctStates)
    const bronze2 = valueOf(pairs, EQ2[0], correctStates)
    const gold2 = valueOf(pairs, EQ2[1], correctStates)
    const silver2 = valueOf(pairs, EQ2[2], correctStates)
    const silver3 = valueOf(pairs, EQ3[0], correctStates)
    const bronze3 = valueOf(pairs, EQ3[1], correctStates)
    const gold3 = valueOf(pairs, EQ3[2], correctStates)

    const X = gold1 + silver1
    const Y = bronze2 + gold2 - silver2
    const Z = silver3 * bronze3 + gold3

    const eq1Unique = countUniqueSolutions(EQ1, pairs, X, (v) => v.gold1 + v.silver1)
    if (eq1Unique !== 1) continue
    const eq2Unique = countUniqueSolutions(EQ2, pairs, Y, (v) => v.bronze2 + v.gold2 - v.silver2)
    if (eq2Unique !== 1) continue
    const eq3Unique = countUniqueSolutions(EQ3, pairs, Z, (v) => v.silver3 * v.bronze3 + v.gold3)
    if (eq3Unique !== 1) continue

    // Eq4's states are fixed at generation time and not player-controlled.
    // The multiplication must pair a 5-or-6 value with a value of 2 or more —
    // never a 0 or 1 — so the final code is never trivially small.
    const lockStates: LockState[] = ["locked", "unlocked"]
    const validMultPairs: { bronze4: LockState; silver4: LockState }[] = []
    for (const bs of lockStates) {
      for (const ss of lockStates) {
        const b = pairs.bronze[bs]
        const s = pairs.silver[ss]
        const isBig = (v: number) => v === 5 || v === 6
        if ((isBig(b) && s >= 2) || (isBig(s) && b >= 2)) {
          validMultPairs.push({ bronze4: bs, silver4: ss })
        }
      }
    }
    if (validMultPairs.length === 0) continue
    const { bronze4, silver4 } = validMultPairs[Math.floor(Math.random() * validMultPairs.length)]
    const fixedStates = { bronze4, silver4, gold4: randomState() }
    const solutionSum = pairs.bronze[fixedStates.bronze4] * pairs.silver[fixedStates.silver4] + pairs.gold[fixedStates.gold4]

    return { pairs, correctStates, fixedStates, X, Y, Z, solutionSum }
  }
  // Extremely unlikely fallback: trivial guaranteed-unique puzzle
  return {
    pairs: {
      gold: { locked: 1, unlocked: 4 },
      silver: { locked: 0, unlocked: 2 },
      bronze: { locked: 5, unlocked: 1 },
    },
    correctStates: {
      gold1: "unlocked",
      silver1: "locked",
      bronze2: "unlocked",
      gold2: "locked",
      silver2: "unlocked",
      silver3: "locked",
      bronze3: "locked",
      gold3: "unlocked",
    },
    fixedStates: { bronze4: "locked", silver4: "unlocked", gold4: "unlocked" },
    X: 4 + 0,
    Y: 5 + 1 - 2,
    Z: 0 * 5 + 4,
    solutionSum: 5 * 2 + 4,
  }
}

function LockIcon({
  type,
  state,
  onClick,
  readOnly,
}: {
  type: LockType
  state: LockState
  onClick?: () => void
  readOnly?: boolean
}) {
  const meta = LOCK_META[type]
  const content = (
    <img
      src={`/images/locks/${type}_${state}.webp`}
      alt={`${meta.label} lock, ${state}`}
      className={`w-20 h-20 object-contain -mr-4 ${readOnly ? "opacity-80" : ""}`}
    />
  )

  if (readOnly) {
    return content
  }

  return (
    <button onClick={onClick} className="cursor-pointer transition-transform hover:scale-105" title={`Tap to use your key on the ${meta.label} lock`}>
      {content}
    </button>
  )
}

export default function LockKeyPuzzle({ onSolve, onSolutionGenerated }: LockKeyPuzzleProps) {
  const [data, setData] = useState<PuzzleData | null>(null)
  const [states, setStates] = useState<Record<OccurrenceId, LockState>>({} as Record<OccurrenceId, LockState>)
  const [solvedNotified, setSolvedNotified] = useState(false)

  useEffect(() => {
    const puzzle = generatePuzzle()
    setData(puzzle)
    const initialStates: Record<OccurrenceId, LockState> = {} as Record<OccurrenceId, LockState>
    for (const occ of ALL_OCCURRENCES) initialStates[occ.id] = randomState()
    setStates(initialStates)
    onSolutionGenerated(String(puzzle.solutionSum))
  }, [])

  // All three equations hit their unique target combination — the player can
  // now read off the values needed for the (still player-computed) eq4 answer.
  useEffect(() => {
    if (!data || solvedNotified) return
    const valueOf = (occ: Occurrence) => data.pairs[occ.type][states[occ.id]]
    const sum1 = valueOf(EQ1[0]) + valueOf(EQ1[1])
    const sum2 = valueOf(EQ2[0]) + valueOf(EQ2[1]) - valueOf(EQ2[2])
    const sum3 = valueOf(EQ3[0]) * valueOf(EQ3[1]) + valueOf(EQ3[2])
    if (sum1 === data.X && sum2 === data.Y && sum3 === data.Z) {
      setSolvedNotified(true)
      onSolve()
    }
  }, [data, states, solvedNotified])

  if (!data || Object.keys(states).length === 0) return null

  const toggle = (id: OccurrenceId) => {
    setStates((prev) => ({ ...prev, [id]: prev[id] === "locked" ? "unlocked" : "locked" }))
  }

  const valueOfLive = (occ: Occurrence) => data.pairs[occ.type][states[occ.id]]

  const gold1 = valueOfLive(EQ1[0])
  const silver1 = valueOfLive(EQ1[1])
  const bronze2 = valueOfLive(EQ2[0])
  const gold2 = valueOfLive(EQ2[1])
  const silver2 = valueOfLive(EQ2[2])
  const silver3 = valueOfLive(EQ3[0])
  const bronze3 = valueOfLive(EQ3[1])
  const gold3 = valueOfLive(EQ3[2])

  const sum1 = gold1 + silver1
  const sum2 = bronze2 + gold2 - silver2
  const sum3 = silver3 * bronze3 + gold3

  const EqRow = ({ children, current }: { children: React.ReactNode; current: number }) => (
    <div className="flex items-center justify-between gap-2 bg-gray-900/40 rounded-md p-2">
      <div className="flex items-center gap-2">{children}</div>
      <div className="font-pixel text-sm text-gray-200">= {current}</div>
    </div>
  )

  return (
    <div className="w-full max-w-md mx-auto">
      <p className="text-gray-300 font-mono text-sm mb-3">
        The guard hands you a set of rusty old keys.
      </p>

      <div className="bg-amber-950/30 border-2 border-amber-800/50 rounded-lg p-3 mb-4 space-y-2">
        <EqRow current={sum1}>
          <LockIcon type="gold" state={states.gold1} onClick={() => toggle("gold1")} />
          <span className="text-gray-400 font-pixel">+</span>
          <LockIcon type="silver" state={states.silver1} onClick={() => toggle("silver1")} />
        </EqRow>

        <EqRow current={sum2}>
          <LockIcon type="bronze" state={states.bronze2} onClick={() => toggle("bronze2")} />
          <span className="text-gray-400 font-pixel">+</span>
          <LockIcon type="gold" state={states.gold2} onClick={() => toggle("gold2")} />
          <span className="text-gray-400 font-pixel">−</span>
          <LockIcon type="silver" state={states.silver2} onClick={() => toggle("silver2")} />
        </EqRow>

        <EqRow current={sum3}>
          <LockIcon type="silver" state={states.silver3} onClick={() => toggle("silver3")} />
          <span className="text-gray-400 font-pixel">×</span>
          <LockIcon type="bronze" state={states.bronze3} onClick={() => toggle("bronze3")} />
          <span className="text-gray-400 font-pixel">+</span>
          <LockIcon type="gold" state={states.gold3} onClick={() => toggle("gold3")} />
        </EqRow>

        <div className="flex items-center justify-between gap-2 bg-black/40 rounded-md p-2 border border-amber-700/40">
          <div className="flex items-center gap-2">
            <LockIcon type="bronze" state={data.fixedStates.bronze4} readOnly />
            <span className="text-gray-400 font-pixel">×</span>
            <LockIcon type="silver" state={data.fixedStates.silver4} readOnly />
            <span className="text-gray-400 font-pixel">+</span>
            <LockIcon type="gold" state={data.fixedStates.gold4} readOnly />
          </div>
          <div className="font-pixel text-sm text-amber-300">= ?</div>
        </div>
      </div>
    </div>
  )
}
