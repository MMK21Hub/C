import { TopAppBar } from "./components/TopAppBar"
import { Route, Router, RouterRoute } from "voby-simple-router"
import Home from "./pages/Home"
import Playground from "./pages/Playground"
import Error404 from "./pages/404"

const routes: RouterRoute[] = [
  {
    path: "/",
    to: Home,
  },
  {
    path: "/playground",
    to: Playground,
  },
  {
    path: "/404",
    to: Error404,
  },
]

/**
 * Root component that sets up client-side routing and renders the main application layout.
 *
 * Wraps the application in a router, displays the top app bar, and renders the component matching the current route.
 *
 * @returns The root JSX element for the application
 */
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
