import { $, For } from "voby"
import IconBrandGithub from "../icons/github"
import IconHexagonLetterC from "../icons/hexagon-letter-c"
import { codeExamples, loadCodeExample } from "../codeExamples"
import { Link } from "voby-simple-router"

export function TopAppBar() {
  const examplesMenuOpen = $(false)
  console.log(examplesMenuOpen)
  return (
    <div class="navbar bg-base-100 shadow-sm">
      <div class="flex-none">
        <Link to="/" class="btn btn-ghost text-xl">
          {IconHexagonLetterC} C Playground
        </Link>
      </div>
      <div class="flex-1">
        <ul class="menu menu-horizontal px-1">
          <li>
            <Link to="/playground" class="">
              Playground
            </Link>
          </li>
          <li>
            <details
              open={examplesMenuOpen}
              onToggle={(e) => {
                if (!(e.target instanceof HTMLDetailsElement))
                  throw new Error(
                    "Handling open event on an unexpected element"
                  )
                examplesMenuOpen(e.target.open)
              }}
            >
              <summary>Examples</summary>
              <ul
                class="bg-base-200 rounded-t-none p-2 w-xs z-10"
                onClick={({ target }) => {
                  if (target instanceof HTMLButtonElement) {
                    if (!target.dataset.example)
                      throw new Error("Button is not linked to an example")
                    const loaded = loadCodeExample(target.dataset.example)
                    if (loaded) examplesMenuOpen(false)
                  }
                }}
              >
                <For values={Object.keys(codeExamples)}>
                  {(title) => (
                    <li>
                      <button data-example={title}>{title}</button>
                    </li>
                  )}
                </For>
              </ul>
            </details>
          </li>
        </ul>
      </div>
      <div class="flex-none">
        <ul class="menu menu-horizontal px-1">
          <li>
            <a class="btn btn-ghost" href="https://github.com/MMK21Hub/C">
              {IconBrandGithub}View on GitHub
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}
