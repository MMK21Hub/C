import { $ } from "voby"

export const viewportWidth = $(window.innerWidth)
export const viewportHeight = $(window.innerHeight)
window.addEventListener("resize", () => {
  viewportWidth(window.innerWidth)
  viewportHeight(window.innerHeight)
})
