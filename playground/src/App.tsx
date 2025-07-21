import { $ } from "voby"
import Workspace from "./components/Workspace"

function App(): JSX.Element {
  return (
    <main class="header flex-center text-center h-[100dvh]">
      <Workspace />
    </main>
  )
}

export default App
