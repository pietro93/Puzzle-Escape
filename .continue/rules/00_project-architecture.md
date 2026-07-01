Filename: .continue/rules/00_project-architecture.md

For the full picture (puzzle data/rendering/answer-checking pipeline, dialogue
system, key-files table, known traps), see docs/ARCHITECTURE.md. This file is
the terse version.

Project name: "Puzzle Escape" (interactive narrative puzzle game)

High-level overview
- Web: Next.js 14 (App Router) + React 18 + TypeScript.
- Desktop: Electron wrapper around the Next.js app (electron/main.ts).
- UI: Radix UI + Tailwind CSS + Framer Motion for animations.
- State: local app-level state, with saved games in localStorage on web and file system on desktop.
- Data model: puzzles and transitions stored under /data and typed in /types.
- Build: Next app for web; Electron main boots the built/served Next app for desktop.

Source layout (important folders)
- app/ — Next.js app router pages and layout
- components/ — React components used by the UI
- data/ — canonical puzzle and transition data (e.g., data/puzzles.ts)
- types/ — TypeScript interfaces/types (e.g., types/puzzle.ts, types/transition.ts)
- electron/ — Electron-specific code (electron/main.ts)
- styles/ or app/globals.css — global styles, tailwind config (tailwind.config.ts)
- package.json, tsconfig.json, next.config.mjs — root config and scripts

Agent expectations about architecture
- Prefer changing TypeScript files only.
- When adding new UI, use existing components and Tailwind utility classes.
- When adding new puzzles or transitions, update data/ and types/ consistently and write or update tests.
- Do not break Electron-specific bootstrapping; assume electron/main.ts is platform-critical.