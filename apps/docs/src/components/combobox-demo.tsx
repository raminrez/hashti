"use client"

import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
} from "@hashti/react"

const roles = ["Viewer", "Editor", "Admin"]

export function ComboboxDemo() {
  // The root renders no element, so the width lives on a wrapping div.
  return (
    <div style={{ maxWidth: 320 }}>
      <Combobox>
        <ComboboxLabel>Role</ComboboxLabel>
        <ComboboxInput placeholder="Pick or type a role…" />
        <ComboboxContent>
          <ComboboxList>
            {roles.map((r) => (
              <ComboboxItem key={r} value={r}>
                {r}
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}
