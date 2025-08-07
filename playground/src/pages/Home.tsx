import IconHexagonLetterC from "../icons/hexagon-letter-c"
import IconBrandGithub from "../icons/github"

export default function Home() {
  return (
    <main class="flex-1 flex items-center justify-center p-8">
      <div class="max-w-4xl mx-auto text-center space-y-8">
        <div class="space-y-4">
          <div class="flex justify-center items-center gap-4 mb-6">
            <div class="text-6xl text-primary">{IconHexagonLetterC}</div>
            <h1 class="text-6xl font-bold text-primary">C</h1>
          </div>

          <p class="text-xl text-base-content/80 max-w-2xl mx-auto leading-relaxed">
            An esoteric programming language that looks like Chess notation
          </p>

          <p class="text-lg text-base-content/70 max-w-3xl mx-auto leading-relaxed">
            Write programs that look almost indistinguishable from a chess game,
            but instead of playing chess, you're placing and manipulating data
            on an 8×8 grid using 5-bit values called <em>pieces</em>.
          </p>
        </div>

        {/* Features */}
        <div class="grid md:grid-cols-3 gap-6 my-12">
          <div class="card bg-base-200 p-6">
            <h3 class="text-lg font-semibold mb-2 text-secondary">
              Chess-like Syntax
            </h3>
            <p class="text-base-content/70 text-sm">
              Uses algebraic chess notation for memory locations (a1-h8) and
              operations that feel familiar to chess players
            </p>
          </div>

          <div class="card bg-base-200 p-6">
            <h3 class="text-lg font-semibold mb-2 text-secondary">
              5-bit Data Type
            </h3>
            <p class="text-base-content/70 text-sm">
              Everything is a "piece" - a 5-bit value represented in base-32
              notation (A-Z, 2-7)
            </p>
          </div>

          <div class="card bg-base-200 p-6">
            <h3 class="text-lg font-semibold mb-2 text-secondary">
              Full Programming Language
            </h3>
            <p class="text-base-content/70 text-sm">
              Supports variables, functions, error handling, and mathematical
              operations
            </p>
          </div>
        </div>

        {/* Code Example */}
        <div class="card bg-base-300 p-6 text-left max-w-2xl mx-auto">
          <h3 class="text-lg font-semibold mb-4 text-center text-accent">
            Example Program
          </h3>
          <pre class="text-sm font-mono text-base-content/90 overflow-x-auto">
            {`# Place values on the board
Dd4 Ee4 Hf4

# Add values and store result
a1:=+d4e4
b1:=*a1f4

# Output the result
!!b1`}
          </pre>
          <p class="text-xs text-base-content/60 mt-3 text-center">
            This program performs some basic arithmetic and outputs the result
          </p>
        </div>

        {/* Call to Action */}
        <div class="space-y-6 mt-12">
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/playground"
              class="btn btn-primary btn-lg text-lg px-8 py-3"
            >
              🚀 Try C in Your Browser
            </a>

            <a
              href="https://github.com/MMK21Hub/C"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-outline btn-lg text-lg px-8 py-3 gap-2"
            >
              {IconBrandGithub}
              View on GitHub
            </a>
          </div>

          <p class="text-sm text-base-content/60">
            No installation required • Runs entirely in your browser • Open
            source
          </p>
        </div>

        {/* Additional Info */}
        <div class="mt-16 pt-8 border-t border-base-300">
          <p class="text-base-content/60 text-sm max-w-2xl mx-auto">
            C is designed as an esoteric programming language for fun and
            education. Check out the{" "}
            <a
              href="https://github.com/MMK21Hub/C/blob/master/README.md"
              target="_blank"
              rel="noopener noreferrer"
              class="link link-secondary"
            >
              full specification
            </a>{" "}
            to learn about all the features and operations available.
          </p>
        </div>
      </div>
    </main>
  )
}
