import { Fragment, type ReactNode } from "react"

// Inline markup for character dialogue:
//   ~word~   foreign word (italic, amber), e.g. the Gypsy's Romani
//   *word*   stage direction / sound (italic), e.g. *Heh*
//   **word** emphasis (bold)
// An unclosed marker styles the rest of the string, so typewriter effects can
// pass a partially typed slice without the raw markers ever showing.
type Style = { foreign: boolean; em: boolean; strong: boolean }

export function parseDialogue(text: string): { text: string; style: Style }[] {
  const segments: { text: string; style: Style }[] = []
  const style: Style = { foreign: false, em: false, strong: false }
  let buffer = ""
  const flush = () => {
    if (buffer) segments.push({ text: buffer, style: { ...style } })
    buffer = ""
  }

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (ch === "~") {
      flush()
      style.foreign = !style.foreign
    } else if (ch === "*" && text[i + 1] === "*") {
      flush()
      style.strong = !style.strong
      i++
    } else if (ch === "*") {
      flush()
      style.em = !style.em
    } else {
      buffer += ch
    }
  }
  flush()
  return segments
}

export function DialogueText({ text }: { text: string }): ReactNode {
  return parseDialogue(text).map((seg, i) => {
    if (!seg.style.foreign && !seg.style.em && !seg.style.strong) return <Fragment key={i}>{seg.text}</Fragment>
    const classes = [
      seg.style.foreign || seg.style.em ? "italic" : "",
      seg.style.foreign ? "text-amber-300" : "",
      seg.style.strong ? "font-bold" : "",
    ]
      .filter(Boolean)
      .join(" ")
    return (
      <span key={i} className={classes}>
        {seg.text}
      </span>
    )
  })
}
