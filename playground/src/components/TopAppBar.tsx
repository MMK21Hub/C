import IconBrandGithub from "../icons/github"

export function TopAppBar() {
  return (
    <div class="navbar bg-base-100 shadow-sm">
      <div class="flex-1">
        <span class="font-semibold text-xl mx-2">C Playground</span>
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
