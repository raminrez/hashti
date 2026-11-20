"use client"

import { Resizable, ResizableHandle, ResizablePanel } from "@hashti/react"

export function ResizableDemo() {
  return (
    <Resizable
      aria-label="Workspace"
      style={{ inlineSize: "100%", maxInlineSize: 640, blockSize: "12rem" }}
    >
      <ResizablePanel
        style={{ background: "var(--hashti-layer-02)", padding: "0.75rem", fontSize: "0.875rem" }}
      >
        Files
      </ResizablePanel>
      <ResizableHandle aria-label="Resize files" />
      <ResizablePanel
        style={{ background: "var(--hashti-layer-01)", padding: "0.75rem", fontSize: "0.875rem" }}
      >
        Editor
      </ResizablePanel>
    </Resizable>
  )
}
