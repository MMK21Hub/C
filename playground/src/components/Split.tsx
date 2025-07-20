import {createDirective, useEffect} from 'voby';
import Split from "split.js"

export const Split = createDirective("split", (ref, [options: Split.Options]) => {
  useEffect(()=>{
    const container = ref()
    if (!container) return
    Split(container.children, options)
  })
})

