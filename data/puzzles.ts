import type { Puzzle } from "@/types/puzzle"
import { puzzlesSet5 } from "./puzzles-5"

// Combine all puzzle sets
export const puzzleData: Puzzle[] = [
  ...puzzlesSet5.filter((puzzle) => puzzle.level === 49), // Only Level 49
]
