Filename: .continue/rules/01_coding-standards.md

Coding standards & style
- Use TypeScript for all new files and prefer strict typing over any.
- Follow existing naming conventions: PascalCase for components, camelCase for variables/functions, types in /types prefixed or suffixed clearly (e.g., Puzzle or PuzzleType).
- Use Tailwind classes for styling; avoid mixing in global CSS unless a style must be global.
- Accessibility: prefer Radix components and ensure semantic HTML and ARIA where necessary.
- Tests: add unit tests (Jest/React Testing Library) for logic and critical components for every feature. Add integration tests for save/load where feasible.
- Commit messages: short imperative prefix (e.g., "feat:", "fix:", "refactor:"), then a brief description.
- Avoid changing unrelated files in a PR. Keep PRs focused and small.

Linters & formatting
- Respect the project's formatter (prettier, eslint). If there are configs (preferred), run lint/format scripts before committing.