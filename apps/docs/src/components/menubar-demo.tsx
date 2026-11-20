"use client";

import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
  Menubar,
} from "@hashti/react";

export function MenubarDemo() {
  return (
    <Menubar aria-label="App menus">
      <Menu>
        <MenuTrigger>File</MenuTrigger>
        <MenuContent>
          <MenuItem value="new">New</MenuItem>
          <MenuItem value="open">Open</MenuItem>
          <MenuSeparator />
          <MenuItem value="close">Close</MenuItem>
        </MenuContent>
      </Menu>
      <Menu>
        <MenuTrigger>Edit</MenuTrigger>
        <MenuContent>
          <MenuItem value="undo">Undo</MenuItem>
          <MenuItem value="redo">Redo</MenuItem>
        </MenuContent>
      </Menu>
      <Menu>
        <MenuTrigger>View</MenuTrigger>
        <MenuContent>
          <MenuItem value="zoom-in">Zoom in</MenuItem>
          <MenuItem value="zoom-out">Zoom out</MenuItem>
        </MenuContent>
      </Menu>
    </Menubar>
  );
}
