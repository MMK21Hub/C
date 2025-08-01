import { $, useEffect } from "voby"

export const viewportWidth = $(window.innerWidth)
export const viewportHeight = $(window.innerHeight)
window.addEventListener("resize", () => {
  viewportWidth(window.innerWidth)
  viewportHeight(window.innerHeight)
})

export const codeEditorContents = $(localStorage.getItem("saved_code") || "")
useEffect(() => {
  localStorage.setItem("saved_code", codeEditorContents())
})
