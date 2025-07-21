type ReactiveSplitJSOptions =
  import("./components/Split").ReactiveSplitJSOptions
type StaticSplitJSOptions = import("./components/Split").StaticSplitJSOptions

declare namespace JSX {
  interface Directives {
    split: [
      reactiveOptions: ReactiveSplitJSOptions,
      staticOptions?: StaticSplitJSOptions
    ]
  }
}
