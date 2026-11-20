# Plan 044: Drawer — edge sheet with slide travel

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do not update `plans/README.md`; the reviewer
> maintains it.
>
> **Drift check (run first)**: `git diff --stat 1db142e..HEAD -- packages apps/docs/content design`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED (the drawer drives its own translate — our CSS must not
  fight it)
- **Depends on**: plans/043-alert-dialog (DONE)
- **Category**: migration (component build-out, cycle 44 — M batch)
- **Planned at**: commit `1db142e`, 2026-11-20

## Why this matters

Drawer is the edge sheet — full-travel sliding surface from any side.
DESIGN.md's drawer rule: 16px corners that flatten against their edge,
full travel, and the drawer drives the translate (we style size, surface,
corners ONLY).

## Current state

- `packages/styles/src/alert-dialog.css` — the newest dialog-family
  exemplar (scrim, surface, motion).
- `apps/docs/content/docs/meta.json` — `pages`:
  `["index", "accordion", "alert-dialog", "avatar", "badge", "button", "carousel", "checkbox", "collapsible", "date-input", "dialog", "field", "file-input", "hover-card", "input", "kbd", "label", "link", "listbox", "menu", "meter", "number-input", "pagination", "password-input", "popover", "progress", "radio", "rating", "resizable", "scroll-area", "segmented-control", "select", "separator", "slider", "switch", "tabs", "textarea", "time-input", "timeline", "toast", "toolbar", "toggle", "tooltip"]`.

### ui-sdk Drawer facts (from `packages/react/node_modules/@ui-sdk/react/docs/components/drawer.md`)

- Import: `import { Drawer, DrawerBackdrop, DrawerClose, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger } from "@ui-sdk/react/drawer"` (verify; a Viewport part may render itself — check).
- Composition: Dialog-shaped — Trigger, Backdrop, Content → Title,
  Description, Close(s). The drawer positions the content inside a
  full-screen viewport and moves it with translate.
- Content states: `data-side` (top/right/bottom/left, with start/end
  resolved), `data-open`/`data-closed`, `data-snap-point`,
  `data-interactive`, `data-driver`, `data-expanded`, `data-dragging`,
  `data-starting-style`/`data-ending-style`. Backdrop: opacity +
  `data-dragging`. The drawer manages translate + backdrop opacity —
  **leave both alone** (the docs say so explicitly).

### Design rules that bite (from `design/DESIGN.md`, dialog.css)

- **Content (the sheet)**: size it; the demo sets
  `inline-size: 20rem; block-size: 100dvh` for a `side="end"` right
  sheet. Surface: `background: var(--hashti-layer-01); border: 1px solid
  var(--hashti-border-subtle-00); box-shadow: 0 16px 48px
  var(--hashti-shadow);` (the modal shadow), `padding: 1.5rem; display:
  flex; flex-direction: column; gap: 0.75rem;`
- **Corners — side-aware, the DESIGN.md rule**: 16px corners that
  FLATTEN against their edge:
  - `[data-side="end"]` / `right`: `border-start-start-radius:
    var(--hashti-border-radius-16); border-end-start-radius:
    var(--hashti-border-radius-16);` (left corners 16px, right corners 0
    — flush with the edge).
  - `[data-side="start"]` / `left`: mirrored.
  - `[data-side="top"]`: bottom corners 16px; `[data-side="bottom"]`:
    top corners 16px.
  (16px = `var(--hashti-border-radius-16)`. Use the side-aware logical
  property pairs above; keep it to the four side selectors.)
- **Backdrop**: `background: var(--hashti-overlay);` — NO blur (DESIGN.md
  gives dialogs the blur; drawers slide fast — keep parity with Dialog's
  blur only if trivial; choose: include `backdrop-filter: blur(6px)` for
  consistency with dialog.css). Opacity animation the drawer drives —
  style only the color.
- **Title/description/close**: copy dialog.css's rules (18px/600 title,
  secondary description; close is the quiet icon-style row with the INSET
  ring).
- **Drag affordance**: none this cycle (snap points + drag handle styling
  deferred); `[data-dragging]` needs no special CSS.
- Colours only via `var(--hashti-*)`; a hex in component CSS is a bug.

## Commands you will need

| Purpose   | Command               | Expected on success |
| --------- | --------------------- | ------------------- |
| Install   | `bun install`         | exit 0              |
| Typecheck | `bun run typecheck`   | exit 0, no errors   |

## Scope

**In scope** (the only files you should modify or create):

- `packages/react/src/drawer/drawer.tsx` — create
- `packages/react/src/drawer/index.ts` — create
- `packages/react/src/index.tsx` — add the re-export line
- `packages/styles/src/drawer.css` — create
- `packages/styles/index.css` — add one import line
- `apps/docs/src/components/drawer-demo.tsx` — create
- `apps/docs/content/docs/drawer.mdx` — create
- `apps/docs/content/docs/meta.json` — add `"drawer"` to `pages`

**Out of scope** (do NOT touch, even though they look related):

- Snap points, drag handle styling, not-dismissible variants — deferred
- Scrollable content recipe — consumer's
- Any lint/test infrastructure

## Git workflow

- Work on the branch checked out in your worktree
  (`particle/044-drawer`).
- Commit per logical step; plain imperative messages.
- Do NOT push, merge, or rebase.

## Steps

### Step 1: Create the Drawer wrappers in `@hashti/react`

`packages/react/src/drawer/drawer.tsx` — the `join` helper pattern
(direct-re-export check on the root and any self-rendering part — the
date-input lesson; quote the DOM if a class cannot land):

| Part | Class |
| --- | --- |
| `Drawer` | `hashti-drawer` (or direct re-export) |
| `DrawerTrigger` | `hashti-drawer-trigger` |
| `DrawerBackdrop` | `hashti-drawer-backdrop` |
| `DrawerContent` | `hashti-drawer-content` |
| `DrawerTitle` | `hashti-drawer__title` |
| `DrawerDescription` | `hashti-drawer__description` |
| `DrawerClose` | `hashti-drawer-close` |

Export all seven from `./drawer` and the barrel.

**Verify**: `bun run typecheck` → exit 0.

### Step 2: Create the stylesheet and import it

`packages/styles/src/drawer.css` — the design-rules section above. DO NOT
set translate, transition on transform, or backdrop opacity animations —
the drawer drives them.

**Verify**: `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/drawer.css`
→ no matches; `grep -c "data-side" packages/styles/src/drawer.css` →
≥ 4 (the four side selectors).

### Step 3: Docs demo component and page

`apps/docs/src/components/drawer-demo.tsx`:

```tsx
"use client"

import {
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@hashti/react"

export function DrawerDemo() {
  return (
    <Drawer side="end">
      <DrawerTrigger>Open details</DrawerTrigger>
      <DrawerBackdrop />
      <DrawerContent style={{ inlineSize: "20rem" }}>
        <DrawerTitle>Project details</DrawerTitle>
        <DrawerDescription>
          Everything about this project, from the side.
        </DrawerDescription>
        <DrawerClose>Close</DrawerClose>
      </DrawerContent>
    </Drawer>
  )
}
```

(If `side` is not the prop name, use the docs' Sides section's API and
note it.)

`apps/docs/content/docs/drawer.mdx`:

```mdx
---
title: Drawer
description: Slides a sheet in from an edge.
---

import { DrawerDemo } from '../../src/components/drawer-demo'

## Usage

<DrawerDemo client:load />

## Parts

| Part | Purpose |
| --- | --- |
| `Drawer` | Owns the open state. |
| `DrawerTrigger` | Opens the drawer. |
| `DrawerBackdrop` | The scrim. |
| `DrawerContent` | The sheet; size it, the drawer places and moves it. |
| `DrawerTitle` / `DrawerDescription` / `DrawerClose` | Content and dismissal. |

Styling lives in `@hashti/styles` under `.hashti-drawer*` — a full-travel sheet with 16px corners that flatten against their edge and the modal shadow. Snap points and drag handles are later recipes.
```

`apps/docs/content/docs/meta.json` — insert `"drawer"` after `"dialog"`.

**Verify**: `bun run typecheck` → exit 0.

## Test plan

No test runner exists in this repo; none is added by this plan. Verification
is: typecheck gates, the greps in Step 2, and the reviewer's rendered check
(sheet slides from the end edge, 16px corners on the opening side only,
scrim, Escape/outside dismissal, modal shadow, full travel).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `bun run typecheck` exits 0 from the repo root
- [ ] `grep -rn "hashti-drawer" packages/react/src packages/styles/src`
  shows the wrapper classes and the stylesheet selectors
- [ ] `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/drawer.css`
  returns nothing
- [ ] `grep -n "drawer" packages/styles/index.css apps/docs/content/docs/meta.json`
  shows the import and the page entry
- [ ] `git status --porcelain` lists no files outside the in-scope list
- [ ] Work committed on the worktree branch, one commit per step

## STOP conditions

Stop and report back (do not improvise) if:

- Any of the seven parts is not exported from `@ui-sdk/react/drawer` —
  quote the error.
- The content's position/translate cannot be left to the drawer (our CSS
  would have to set them) — report what you found.
- A step's verification fails twice after a reasonable fix attempt.
- The fix appears to require touching an out-of-scope file.

## Maintenance notes

- Snap points and the drag handle land with the mobile pass.
- The Select/Popover `sheet` presentation reuses this recipe later.
