import { $, Observable, useEffect } from "voby"

/**
 * Renders a submenu as a `<details>` element that can be toggled open or closed, closing automatically when clicking outside the submenu.
 *
 * The open state can be controlled via an observable or managed internally. Additional props are forwarded to the `<details>` element, and submenu content is rendered as children.
 *
 * @param open - Optional observable controlling the open state of the submenu
 * @param children - The submenu content to display
 * @param class - Optional additional CSS classes for styling
 * @returns A submenu container element with toggle and auto-close behavior
 */
export default function NavbarSubMenu(props: {
  open?: Observable<boolean>
  children: JSX.Children
  class?: JSX.Class
}) {
  const isOpen = props.open || $(false)
  useEffect(() => {
    document.addEventListener("click", (event) => {
      if (!(event.target instanceof Element)) return
      // Ignore clicks within the submenu container
      const withinSubmenu = event.target.closest(".navbar-submenu")
      if (withinSubmenu) return
      // Close if the user clicks outside the submenu
      isOpen(false)
    })
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
