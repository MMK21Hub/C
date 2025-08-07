import { Link } from "voby-simple-router"
import IconBook from "../icons/book"
import IconCode from "../icons/code"

export default function Home() {
  return (
    <main class="flex-1">
      <div class="hero min-h-full">
        <div class="hero-content text-center max-w-4xl">
          <div class="space-y-8">
            <div class="space-y-4">
              <div class="flex justify-center items-center gap-4 mb-6">
                <h1 class="text-6xl font-bold text-primary">C</h1>
              </div>

              <p class="text-xl text-base-content/80 max-w-2xl mx-auto leading-relaxed">
                Try the esoteric programming language that looks like Chess
                notation
              </p>

              <p class="text-lg text-base-content/70 max-w-3xl mx-auto leading-relaxed">
                Write programs that look almost indistinguishable from a chess
                game, but instead of playing chess, you're placing and
                manipulating data on an 8×8 grid using 5-bit values called{" "}
                <em>pieces</em>.
              </p>

              <p class="text-lg text-base-content/70 max-w-3xl mx-auto leading-relaxed">
                Not to be confused with any similarly-named serious programming
                languages.
              </p>
            </div>

            <div class="space-y-6 mt-12">
              <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="https://github.com/MMK21Hub/C#specification"
                  class="btn btn-lg"
                >
                  {IconBook}
                  Read the specification
                </a>
                <Link to="/playground" class="btn btn-primary btn-lg">
                  {IconCode}
                  Try C in your browser
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
