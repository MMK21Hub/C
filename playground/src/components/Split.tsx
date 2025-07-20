import { createDirective, useEffect } from "voby"
import SplitJS from "split.js"

export const Split = createDirective(
  "split",
  (ref: Element, options: SplitJS.Options) => {
    useEffect(() => {
      const container = ref
      if (!container) return
      const childElements = Array.from(container.children).filter(
        (child) => child instanceof HTMLElement
      )
      SplitJS(childElements, options)
    })
  }
)
