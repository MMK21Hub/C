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
    let instance: SplitJS.Instance | null = null
    useEffect(() => {
      if (instance) instance.destroy(true, true)
      const resolvedOptions: SplitJS.Options = Object.fromEntries(
        Object.entries(reactiveOptions).map(([key, value]) => [
          key,
          $$(value, false), // Gets the value out of the observable
        ])
      )
      instance = SplitJS(childElements, resolvedOptions)
    })
  }
)
