import { $ } from "voby"
import Workspace from "./components/Workspace"
import { TopAppBar } from "./components/TopAppBar"

function App(): JSX.Element {
  return (
    <div class="h-[100dvh] flex flex-col">
      <TopAppBar />
      <main class="header flex-center text-center flex-1">
        <Workspace />
      </main>
    </div>
  )
}

export default App
