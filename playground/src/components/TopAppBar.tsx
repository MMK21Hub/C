import { $, For } from "voby"
import IconBrandGithub from "../icons/github"
import IconHexagonLetterC from "../icons/hexagon-letter-c"
import { codeExamples, loadCodeExample } from "../codeExamples"
import { Link } from "voby-simple-router"
import NavbarSubMenu from "./NavbarSubMenu"

/**
 * Renders the top navigation bar for the application, including links to the home page, playground, code examples submenu, and GitHub repository.
 *
 * The navigation bar features a dynamic submenu for selecting and loading code examples. Selecting an example loads it and closes the submenu.
 */
export function TopAppBar() {
  const examplesMenuOpen = $(false)
  return (
    <div class="navbar bg-base-100 shadow-sm">
      <div class="flex-none">
        <Link to="/" class="btn btn-ghost text-xl">
          {IconHexagonLetterC} C Esolang
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
            <NavbarSubMenu open={examplesMenuOpen}>
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
            </NavbarSubMenu>
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
