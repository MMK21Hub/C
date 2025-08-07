import { $ } from "voby"
import Workspace from "./components/Workspace"
import { TopAppBar } from "./components/TopAppBar"
import { Route, Router, RouterRoute } from "voby-simple-router"
import Playground from "./pages/Playground"

const routes: RouterRoute[] = [
  {
    path: "/playground",
    to: Playground,
  },
]

function App(): JSX.Element {
  return (
    <Router routes={routes}>
      <div class="h-[100dvh] flex flex-col">
        <TopAppBar />
        <Route />
      </div>
    </Router>
  )
}

export default App
