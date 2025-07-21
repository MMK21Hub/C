import { Split } from "./Split"

export default function Workspace() {
  return (
    <Split.Provider>
      <div class="flex h-full" use:split={{}}>
        <div>
          <textarea
            class="textarea w-full"
            placeholder="Start writing some code..."
          ></textarea>
        </div>
        <div class="">
          <h2>Output</h2>
        </div>
      </div>
    </Split.Provider>
  )
}
