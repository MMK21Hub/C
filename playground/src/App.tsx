import { TopAppBar } from "./components/TopAppBar"
import { Route, Router, RouterRoute } from "voby-simple-router"
import Playground from "./pages/Playground"
import Error404 from "./pages/404"

const routes: RouterRoute[] = [
  {
    path: "/playground",
    to: Playground,
  },
  {
    path: "/404",
    to: Error404,
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
