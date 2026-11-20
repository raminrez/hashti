"use client"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@hashti/react"

export function CommandDemo() {
  return (
    <Command onAction={(v) => console.log(v)} style={{ maxWidth: 448 }}>
      <CommandInput placeholder="Type a command or search…" aria-label="Command palette" />
      <CommandList>
        <CommandGroup>
          <CommandGroupLabel>File</CommandGroupLabel>
          <CommandItem value="new-file">New file</CommandItem>
          <CommandItem value="open">Open recent</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup>
          <CommandGroupLabel>Edit</CommandGroupLabel>
          <CommandItem value="undo">Undo</CommandItem>
          <CommandItem value="disabled-one" disabled>
            Redo
          </CommandItem>
        </CommandGroup>
      </CommandList>
      <CommandEmpty>No commands found.</CommandEmpty>
    </Command>
  )
}
