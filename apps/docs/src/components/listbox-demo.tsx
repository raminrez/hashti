"use client"

import { Listbox, ListboxItem, ListboxItemIndicator } from "@hashti/react"

function Check() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path
        d="m3.5 8.5 3 3 6-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ListboxDemo() {
  return (
    <Listbox aria-label="Toppings" defaultValue="basil" style={{ maxWidth: 280 }}>
      <ListboxItem value="basil">
        Basil
        <ListboxItemIndicator>
          <Check />
        </ListboxItemIndicator>
      </ListboxItem>
      <ListboxItem value="olive">
        Olive
        <ListboxItemIndicator>
          <Check />
        </ListboxItemIndicator>
      </ListboxItem>
      <ListboxItem value="mushroom">
        Mushroom
        <ListboxItemIndicator>
          <Check />
        </ListboxItemIndicator>
      </ListboxItem>
    </Listbox>
  )
}
