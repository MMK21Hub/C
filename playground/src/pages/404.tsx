import { Link } from "voby-simple-router"

export default function Error404() {
  return (
    <div class="m-auto pb-16">
      <h1 class="text-3xl">404 not found :/</h1>
      <p class="mt-4">
        Maybe you'd like to{" "}
        <Link class="link" to="/">
          go home
        </Link>
        ?
      </p>
    </div>
  )
}
