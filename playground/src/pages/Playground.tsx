import Workspace from "../components/Workspace"

/**
 * Renders the Playground page with a centered Workspace component inside a styled main section.
 */
export default function Playground() {
  return (
    <main class="header flex-center text-center flex-1">
      <Workspace />
    </main>
  )
}
