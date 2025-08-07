import { $, Observable, useDisposed, useEffect } from "voby"

export default function NavbarSubMenu(props: {
  open?: Observable<boolean>
  children: JSX.Children
  class?: JSX.Class
}) {
  const isOpen = props.open || $(false)
  let abortController = new AbortController()
  useEffect(() => {
    document.addEventListener(
      "click",
      (event) => {
        if (!(event.target instanceof Element)) return
        // Ignore clicks within the submenu container
        const withinSubmenu = event.target.closest(".navbar-submenu")
        if (withinSubmenu) return
        // Close if the user clicks outside the submenu
        isOpen(false)
      },
      {
        signal: abortController.signal,
      }
    )
  })
  // Remove the event listener when the component is disposed
  useEffect(() => {
    const disposed = useDisposed()
    if (disposed()) abortController.abort()
  })

  // useEffect(() => {
  //   console.debug("isOpen", isOpen())
  // })

  const otherProps = Object.fromEntries(
    Object.entries(props).filter(
      ([key]) => key !== "open" && key !== "children"
    )
  )
  return (
    <details
      open={isOpen}
      onToggle={(e) => {
        if (!(e.target instanceof HTMLDetailsElement))
          throw new Error("Handling open event on an unexpected element")
        isOpen(e.target.open)
      }}
      {...otherProps}
      class={["navbar-submenu", props.class]}
    >
      {props.children}
    </details>
  )
}
