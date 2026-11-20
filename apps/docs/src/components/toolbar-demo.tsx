"use client"

import {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarInput,
  ToolbarLink,
  ToolbarSeparator,
} from "@hashti/react"

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ToolbarDemo() {
  return (
    <Toolbar aria-label="Document tools">
      <ToolbarButton aria-label="Bold">
        <Icon d="M4 3h5a2.5 2.5 0 0 1 0 5H4Zm0 5h6a2.5 2.5 0 0 1 0 5H4Z" />
      </ToolbarButton>
      <ToolbarButton aria-label="Italic">
        <Icon d="M10 3H7m2 0-3 10m1 0H4" />
      </ToolbarButton>
      <ToolbarGroup aria-label="Align">
        <ToolbarButton aria-label="Align left">
          <Icon d="M3 4h10M3 8h6M3 12h8" />
        </ToolbarButton>
        <ToolbarButton aria-label="Align center">
          <Icon d="M3 4h10M5 8h6M4 12h8" />
        </ToolbarButton>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarInput placeholder="Find…" aria-label="Find" style={{ inlineSize: "8rem" }} />
      <ToolbarSeparator />
      <ToolbarLink href="#help">Help</ToolbarLink>
    </Toolbar>
  )
}
