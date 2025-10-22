---
globs: src/utils/dialogue-utils.ts
description: This rule helps to prevent the user from hearing the same dialogue
  line repeatedly, which can break immersion and become frustrating. It applies
  specifically to the dialogue selection functions.
alwaysApply: false
---

When modifying dialogue selection logic, ensure a mechanism exists to prevent immediate repetition of the same dialogue line. Track previously shown lines and prioritize different options, resetting the tracking if all lines have been exhausted.