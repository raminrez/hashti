"use client"

import { Kbd } from "@hashti/react"

export function KbdDemo() {
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
      <span>Press <Kbd keys={["command", "K"]} /> to search</span>
      <span>or <Kbd keys={["ctrl", "shift", "P"]} /></span>
      <Kbd>Esc</Kbd>
    </div>
  )
}
