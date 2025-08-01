import { codeEditorContents } from "./appState"

export const codeExamples: {
  [title: string]: string[]
} = {
  Addition: ["total.Ba1", "total.Ba2", "A.a1+A.a2", "a4", "a4"],
  "Error handling": ["E.b1+a1", "Fe4+", "Ba1", "Bb1", "Aj3"],
}

export function loadCodeExample(title: string) {
  if (codeEditorContents().trim()) {
    const confirmation = window.confirm(
      "This will replace the contents of the editor. Continue?"
    )
    if (!confirmation) return false
  }
  if (!Object.hasOwn(codeExamples, title))
    throw new Error(`Code example does not exist: ${title}`)
  const code = codeExamples[title].join("\n")
  codeEditorContents(code)
  return true
}
