# Plan 042: Resizable — panels and drag handles

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do not update `plans/README.md`; the reviewer
> maintains it.
>
> **Drift check (run first)**: `git diff --stat 3c015ac..HEAD -- packages apps/docs/content design`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/041-carousel (DONE)
- **Category**: migration (component build-out, cycle 42 — M batch)
- **Planned at**: commit `3c015ac`, 2026-11-20

## Why this matters

Resizable is the split-pane group — panels with a drag handle. Small
surface: the group lays out, the handle is the only styled interaction.

## Current state

- `packages/styles/src/carousel.css` — the newest exemplar.
- `apps/docs/content/docs/meta.json` — `pages`:
  `["index", "accordion", "avatar", "badge", "button", "carousel", "checkbox", "collapsible", "date-input", "dialog", "field", "file-input", "hover-card", "input", "kbd", "label", "link", "listbox", "menu", "meter", "number-input", "pagination", "password-input", "popover", "progress", "radio", "rating", "scroll-area", "segmented-control", "select", "separator", "slider", "switch", "tabs", "textarea", "time-input", "timeline", "toast", "toolbar", "toggle", "tooltip"]`.

### ui-sdk Resizable facts (from `packages/react/node_modules/@ui-sdk/react/docs/components/resizable.md`)

- Import: `import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/react/resizable"`.
- Composition: `Resizable` (give it a size; panels lay out in a row) →
  (`ResizablePanel`, `ResizableHandle` (aria-label), `ResizablePanel`).
- Group/handle states: `data-disabled`, `data-dragging`; handle adds
  `data-hovering` (pointer over the handle OR its hit area).
- Panels: `data-collapsed` (collapsible — deferred styling).

### Design rules that bite (derived)

- **Group `hashti-resizable`**: `display: flex; overflow: hidden;
border-radius: var(--hashti-border-radius-08);` (the size comes from
  the consumer; the demo sets block-size + inline-size). Vertical
  orientation deferred — the row layout only this cycle.
- **Panel `hashti-resizable-panel`**: `min-inline-size: 0; overflow:
hidden;` (content clips; the panel's own surface styling is the
  consumer's).
- **Handle `hashti-resizable-handle`**: a 2px grip lane with a wider hit
  area — `position: relative; flex: 0 0 0.25rem; display: flex;
align-items: center; justify-content: center; background: transparent;
cursor: col-resize; touch-action: none;` the visible grip is a
  `::after` — `inline-size: 0.25rem; block-size: 2rem; border-radius:
var(--hashti-border-radius-max); background:
var(--hashti-border-strong-01); transition: background
var(--hashti-duration-fast-01) cubic-bezier(0.16, 1, 0.3, 1);`
  - `[data-hovering]` → `::after` background
    `var(--hashti-border-subtle-inverse, var(--hashti-text-secondary))`.
  - `[data-dragging]` → `::after` background `var(--hashti-focus);` and
    `cursor: col-resize;`
  - `:focus-visible` → 2px ring @2px on the handle itself.
  - `[data-disabled]` → grip `var(--hashti-border-disabled)`, cursor
    not-allowed.
- Colours only via `var(--hashti-*)`; a hex in component CSS is a bug.

## Commands you will need

| Purpose   | Command             | Expected on success |
| --------- | ------------------- | ------------------- |
| Install   | `bun install`       | exit 0              |
| Typecheck | `bun run typecheck` | exit 0, no errors   |

## Scope

**In scope** (the only files you should modify or create):

- `packages/react/src/resizable/resizable.tsx` — create
- `packages/react/src/resizable/index.ts` — create
- `packages/react/src/index.tsx` — add the re-export line
- `packages/styles/src/resizable.css` — create
- `packages/styles/index.css` — add one import line
- `apps/docs/src/components/resizable-demo.tsx` — create
- `apps/docs/content/docs/resizable.mdx` — create
- `apps/docs/content/docs/meta.json` — add `"resizable"` to `pages`

**Out of scope** (do NOT touch, even though they look related):

- Vertical groups, collapsible panel styling — deferred
- Nested groups — behavior exists; no extra styling
- Any lint/test infrastructure

## Git workflow

- Work on the branch checked out in your worktree
  (`particle/042-resizable`).
- Commit per logical step; plain imperative messages.
- Do NOT push, merge, or rebase.

## Steps

### Step 1: Create the Resizable wrappers in `@hashti/react`

`packages/react/src/resizable/resizable.tsx` — the `join` helper pattern
(direct-re-export check on the root):

| Part              | Class                     |
| ----------------- | ------------------------- |
| `Resizable`       | `hashti-resizable`        |
| `ResizablePanel`  | `hashti-resizable-panel`  |
| `ResizableHandle` | `hashti-resizable-handle` |

Export all three from `./resizable` and the barrel.

**Verify**: `bun run typecheck` → exit 0.

### Step 2: Create the stylesheet and import it

`packages/styles/src/resizable.css` — the design-rules section above.

**Verify**: `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/resizable.css`
→ no matches; `grep -c "data-" packages/styles/src/resizable.css` →
≥ 4.

### Step 3: Docs demo component and page

`apps/docs/src/components/resizable-demo.tsx`:

```tsx
"use client";

import { Resizable, ResizableHandle, ResizablePanel } from "@hashti/react";

export function ResizableDemo() {
  return (
    <Resizable
      aria-label="Workspace"
      style={{ inlineSize: "100%", maxInlineSize: 640, blockSize: "12rem" }}
    >
      <ResizablePanel
        style={{
          background: "var(--hashti-layer-02)",
          padding: "0.75rem",
          fontSize: "0.875rem",
        }}
      >
        Files
      </ResizablePanel>
      <ResizableHandle aria-label="Resize files" />
      <ResizablePanel
        style={{
          background: "var(--hashti-layer-01)",
          padding: "0.75rem",
          fontSize: "0.875rem",
        }}
      >
        Editor
      </ResizablePanel>
    </Resizable>
  );
}
```

`apps/docs/content/docs/resizable.mdx`:

```mdx
---
title: Resizable
description: Splits space with draggable panels.
---

import { ResizableDemo } from "../../src/components/resizable-demo";

## Usage

<ResizableDemo client:load />

## Parts

| Part              | Purpose                       |
| ----------------- | ----------------------------- |
| `Resizable`       | The group; give it a size.    |
| `ResizablePanel`  | One share of the space.       |
| `ResizableHandle` | The drag grip between panels. |

Styling lives in `@hashti/styles` under `.hashti-resizable*` — a subtle grip that darkens on hover and turns focus-blue while dragging.
```

`apps/docs/content/docs/meta.json` — insert `"resizable"` after
`"rating"` (alphabetical check against the live list).

**Verify**: `bun run typecheck` → exit 0.

## Test plan

No test runner exists in this repo; none is added by this plan. Verification
is: typecheck gates, the greps in Step 2, and the reviewer's rendered check
(handle grip visible, hover darkens, drag moves the divider, focus ring,
disabled grip).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `bun run typecheck` exits 0 from the repo root
- [ ] `grep -rn "hashti-resizable" packages/react/src packages/styles/src`
      shows the wrapper classes and the stylesheet selectors
- [ ] `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/resizable.css`
      returns nothing
- [ ] `grep -n "resizable" packages/styles/index.css apps/docs/content/docs/meta.json`
      shows the import and the page entry
- [ ] `git status --porcelain` lists no files outside the in-scope list
- [ ] Work committed on the worktree branch, one commit per step

## STOP conditions

Stop and report back (do not improvise) if:

- Any of the three parts is not exported from `@ui-sdk/react/resizable` —
  quote the error.
- A step's verification fails twice after a reasonable fix attempt.
- The fix appears to require touching an out-of-scope file.

## Maintenance notes

- Vertical groups and collapsible panels land later.
- The grip recipe (2px lane + round dot) is shared with any future
  splitter variants.
