"use client"

import {
  Menu,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuSeparator,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
} from "@hashti/react"

function ChevronGlyph() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true" fill="none">
      <path d="m4.5 3 3 3-3 3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export function MenuDemo() {
  return (
    <Menu onAction={(value) => console.log(value)}>
      <MenuTrigger>Actions</MenuTrigger>
      <MenuContent>
        <MenuItem value="rename">Rename</MenuItem>
        <MenuItem value="duplicate">Duplicate</MenuItem>
        <MenuSeparator />
        <MenuSub>
          <MenuSubTrigger>
            Share
            <ChevronGlyph />
          </MenuSubTrigger>
          <MenuSubContent>
            <MenuItem value="copy-link">Copy link</MenuItem>
            <MenuItem value="email">Email</MenuItem>
          </MenuSubContent>
        </MenuSub>
        <MenuSeparator />
        <MenuGroup>
          <MenuGroupLabel>Danger zone</MenuGroupLabel>
          <MenuItem value="archive">Archive</MenuItem>
          <MenuItem value="delete">Delete</MenuItem>
        </MenuGroup>
      </MenuContent>
    </Menu>
  )
}
