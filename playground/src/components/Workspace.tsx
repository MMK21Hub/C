import { $, useMemo } from "voby"
import { Split } from "./Split"
import { viewportWidth } from "../appState"
import { Interpreter } from "@mmk21/c"

export default function Workspace() {
  const outputString = $<string | null>(null)

  function runCode() {
    const codeInput = document.getElementById(
      "code-input"
    ) as HTMLTextAreaElement | null
    if (!codeInput) throw new Error("Code input element not found")
    const code = codeInput.value
    const interpreter = new Interpreter()
    const exceptions = interpreter.run(code)
    outputString(interpreter.boardToFormattedString())
  }

  return (
    <Split.Provider>
      <div
        class="flex h-full"
        use:split={{
          direction: useMemo(() =>
            viewportWidth() > 500 ? "horizontal" : "vertical"
          ),
        }}
      >
        <div class="py-2 px-2 flex flex-col">
          <textarea
            class="textarea w-full h-full"
            id="code-input"
            placeholder="Start writing some code..."
          ></textarea>
          <div class="flex justify-end">
            <button class="btn mt-2" onClick={runCode}>
              Run code
            </button>
          </div>
        </div>
        <div class="py-2 px-2">
          <h2 class="font-semibold text-xl mb-2">Output</h2>
          <pre class="overflow-auto leading-none py-2">{outputString}</pre>
        </div>
      </div>
    </Split.Provider>
  )
}
