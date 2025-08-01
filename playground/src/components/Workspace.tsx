import { $, useMemo } from "voby"
import { Split } from "./Split"
import { codeEditorContents, viewportWidth } from "../appState"
import { Interpreter } from "@mmk21/c"
import ProgramOutput, { ProgramOutputData } from "./ProgramOutput"

export default function Workspace() {
  const programOutput = $<ProgramOutputData | null>(null)

  function runCode() {
    const codeInput = document.getElementById(
      "code-input"
    ) as HTMLTextAreaElement | null
    if (!codeInput) throw new Error("Code input element not found")
    const code = codeInput.value
    const interpreter = new Interpreter()
    const exceptions = interpreter.run(code)
    programOutput({
      output: interpreter.boardToFormattedString(),
      exceptions: exceptions || [],
    })
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
            class="textarea w-full h-full font-mono"
            id="code-input"
            placeholder="Start writing some code..."
            onKeyUp={(e) => {
              if (e.key === "Enter" && e.ctrlKey) {
                runCode()
              }
            }}
            onInput={(e) => {
              const element = e.target as HTMLTextAreaElement
              codeEditorContents(element.value)
            }}
            value={codeEditorContents}
          ></textarea>
          <div class="flex justify-end">
            <button class="btn mt-2" onClick={runCode}>
              Run code
            </button>
          </div>
        </div>
        <div class="py-2 px-2">
          <h2 class="font-semibold text-xl mb-2">Output</h2>
          {() => {
            const outputData = programOutput()
            if (!outputData) return <div class="">Nothing yet :(</div>
            return <ProgramOutput data={outputData} />
          }}
        </div>
      </div>
    </Split.Provider>
  )
}
