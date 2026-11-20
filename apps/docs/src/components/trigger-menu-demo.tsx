"use client"

import { TriggerMenu, TriggerMenuInput, TriggerMenuStatus } from "@hashti/react"

const people = ["Hollis Vance", "Priya Nair", "Tom Okafor", "Lena Fischer"]

export function TriggerMenuDemo() {
  return (
    <div style={{ maxWidth: 320 }}>
      <TriggerMenu triggers={[{ char: "@", items: people }]}>
        <TriggerMenuInput
          aria-label="Message"
          placeholder="Mention someone with @…"
        />
        <TriggerMenuStatus className="sr-only" />
      </TriggerMenu>
    </div>
  )
}
