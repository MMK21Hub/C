import { $$, createDirective, ObservableMaybe, useEffect } from "voby"
import SplitJS from "split.js"

export type ReactiveSplitJSOptions = {
  [key in keyof SplitJS.Options]: key extends Function
    ? ObservableMaybe<SplitJS.Options[key]>
    : never
}

export type StaticSplitJSOptions = Omit<
  SplitJS.Options,
  keyof ReactiveSplitJSOptions
>

export const Split = createDirective(
  "split",
  (
    ref: Element,
    reactiveOptions: ReactiveSplitJSOptions,
    staticOptions: StaticSplitJSOptions = {}
  ) => {
    const container = ref
    if (!container) return
    const childElements = Array.from(container.children).filter(
      (child) => child instanceof HTMLElement
    )
    let instance: SplitJS.Instance | null = null
    useEffect(() => {
      if (instance) instance.destroy(true, true)
      const resolvedOptions = Object.fromEntries(
        Object.entries(reactiveOptions).map(([key, value]) => [key, $$(value)])
      )
      instance = SplitJS(childElements, {
        ...resolvedOptions,
        ...staticOptions,
      })
    })
  }
)
