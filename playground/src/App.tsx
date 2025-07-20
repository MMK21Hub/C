import { $ } from "voby"

function App(): JSX.Element {
  const count = $(0)
  const increment = () => count((value) => value + 1)

  return (
    <main class="header flex-center text-center h-[100dvh]">
      <div class="flex h-full">
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
    </main>
  )
}

export default App
