import { $$, createDirective, ObservableMaybe, useEffect } from "voby"
import SplitJS from "split.js"

export type ReactiveSplitJSOptions = {
  [key in keyof SplitJS.Options]: ObservableMaybe<SplitJS.Options[key]>
}

export const Split = createDirective(
  "split",
  (ref: Element, reactiveOptions: ReactiveSplitJSOptions) => {
    const container = ref
    if (!container) return
    const childElements = Array.from(container.children).filter(
      (child) => child instanceof HTMLElement
    )
    const createGutter = (
      <div
        class={[
          "bg-base-300",
          () =>
            $$(reactiveOptions.direction) === "vertical"
              ? ["bg-gutter-vertical", "cursor-row-resize"]
              : ["bg-gutter-horizontal", "cursor-col-resize"],
        ]}
      />
    ) as () => HTMLDivElement
    const gutter = createGutter()

    let instance: SplitJS.Instance | null = null
    useEffect(() => {
      if (instance) instance.destroy(true, true)
      // Update flex direction
      const newDirection = $$(reactiveOptions.direction)
      container.classList.remove("flex-col", "flex-row")
      container.classList.add(
        newDirection === "vertical" ? "flex-col" : "flex-row"
      )
      // Clear the inline-styled width/height of the gutter, so that SplitJS can properly apply the new styles
      gutter.style = ""
      // Instantiate a new SplitJS instance
      const resolvedOptions: SplitJS.Options = Object.fromEntries(
        Object.entries(reactiveOptions).map(([key, value]) => [
          key,
          $$(value, false), // Gets the value out of the observable
        ])
      )
      console.log(gutter)
      instance = SplitJS(childElements, {
        gutter: () => gutter,
        ...resolvedOptions,
      })
    })
  }
)
