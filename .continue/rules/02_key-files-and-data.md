Filename: .continue/rules/02_key-files-and-data.md

Authoritative files (read-first)
- package.json — scripts and dependencies; check before modifying build scripts.
- app/page.tsx, app/layout.tsx — web entry points and layout.
- types/puzzle.ts, types/transition.ts — canonical shapes for puzzles and transitions.
- data/puzzles-1.ts … puzzles-5.ts — canonical puzzle content, one file per zone (Levels 1-10/11-20/21-30/31-40/41-50). data/puzzles.ts is just the aggregator that concatenates these five — edit the per-zone files, not puzzles.ts.
- data/transitions.ts — canonical transition data.
- See docs/ARCHITECTURE.md for the full puzzle data → rendering → answer-checking pipeline.
- electron/main.ts — desktop boot file; changes here affect Electron behavior.
- tailwind.config.ts, postcss.config.mjs, app/globals.css — styling pipeline.

Data rules
- When adding or modifying puzzles:
  - Update the corresponding type in /types if structure changes.
  - Ensure data/puzzles.ts remains serializable (no functions in data objects).
  - Maintain consistent id keys and any indexing used by game logic.
- Transitions and triggers:
  - Keep transition IDs stable. If you need to rename an ID, also write a migration or update save/load logic.