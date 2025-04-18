import type { Puzzle } from "@/types/puzzle"
import { puzzlesSet1 } from "./puzzles-1"
import { puzzlesSet2 } from "./puzzles-2"
import { puzzlesSet3 } from "./puzzles-3"
import { puzzlesSet4 } from "./puzzles-4"
import { puzzlesSet5 } from "./puzzles-5"

// Combine all puzzle sets
export const puzzleData: Puzzle[] = [
  ...puzzlesSet1, // Levels 1-10 (Prison - Skeleton Guard)
  ...puzzlesSet2, // Levels 11-20 (Mansion - Butler)
  ...puzzlesSet3, // Levels 21-30 (Forest - Gypsy)
  ...puzzlesSet4, // Levels 31-40 (Desert - Sphinx)
  ...puzzlesSet5, // Levels 41-50 (Hell - Devil)
]

// Update the location image for level 13
puzzleData[12].locationImage = "/public/images/color-palette/color_palette.webp"

// Update the butler's dialogue for level 13
puzzleData[12].description =
  "The butler presents you with a color palette. 'This palette is an artifact gifted to the Master by a renowned French painter. The painter also left a message with it mentioning that the canvas is some treasure map of sorts.'"
