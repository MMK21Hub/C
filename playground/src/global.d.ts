import Split from "split.js"

declare namespace JSX {
  interface Directives {
    split: [options: Split.Options]
  }
}
