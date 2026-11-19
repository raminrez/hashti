"use client"

import {
  Menu,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "@hashti/react"

export function MenuDemo() {
  return (
    <Menu onAction={(value) => console.log(value)}>
      <MenuTrigger>Actions</MenuTrigger>
      <MenuContent>
        <MenuItem value="rename">Rename</MenuItem>
        <MenuItem value="duplicate">Duplicate</MenuItem>
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
