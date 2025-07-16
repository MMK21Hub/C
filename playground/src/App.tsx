import { $ } from "voby";
import banner from "/banner.svg";

function App(): JSX.Element {
  const count = $(0);
  const increment = () => count((value) => value + 1);

  return (
    <main class="header flex-center text-center">
      <img src={banner} class="logo" alt="logo" />
      <div class="mt-4 space-y-4">
        <section>
          <button class="counter" onClick={increment}>
            count is: {count}
          </button>
        </section>
        <p class="text-2xl">
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <section>
          <a
            class="text-[#2f2f2f] text-2xl font-normal underline underline-offset-2"
            href="https://github.com/vobyjs/voby"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn Voby
          </a>
        </section>
      </div>
    </main>
  );
}

export default App;
