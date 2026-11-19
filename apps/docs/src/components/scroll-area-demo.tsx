"use client"

import {
  ScrollArea,
  ScrollAreaContent,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "@hashti/react"

export function ScrollAreaDemo() {
  return (
    <ScrollArea
      style={{
        height: "12rem",
        maxWidth: 320,
        border: "1px solid var(--hashti-border-subtle-00)",
        borderRadius: "var(--hashti-popover-radius)",
      }}
    >
      <ScrollAreaViewport role="region" aria-label="Items">
        <ScrollAreaContent style={{ padding: "0.75rem" }}>
          {Array.from({ length: 30 }, (_, i) => (
            <div key={i} style={{ padding: "0.375rem 0", fontSize: "0.875rem" }}>
              Item {i + 1}
            </div>
          ))}
        </ScrollAreaContent>
      </ScrollAreaViewport>
      <ScrollAreaScrollbar orientation="vertical">
        <ScrollAreaThumb />
      </ScrollAreaScrollbar>
    </ScrollArea>
  )
}
