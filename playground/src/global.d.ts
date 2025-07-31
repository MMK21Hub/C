type ReactiveSplitJSOptions =
  import("./components/Split").ReactiveSplitJSOptions

declare namespace JSX {
  interface Directives {
    split: [reactiveOptions: ReactiveSplitJSOptions]
  }
}
