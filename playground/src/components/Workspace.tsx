import { useMemo } from "voby"
import { Split } from "./Split"
import { viewportWidth } from "../appState"

export default function Workspace() {
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
        <div class="py-2 px-2">
          <textarea
            class="textarea w-full"
            placeholder="Start writing some code..."
          ></textarea>
        </div>
        <div class="py-2 px-2">
          <h2>Output</h2>
        </div>
      </div>
    </Split.Provider>
  )
}
