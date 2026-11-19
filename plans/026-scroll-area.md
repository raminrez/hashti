# Plan 026: ScrollArea — viewport + styled scrollbars

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do not update `plans/README.md`; the reviewer
> maintains it.
>
> **Drift check (run first)**: `git diff --stat fea46bd..HEAD -- packages apps/docs/content design`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED (the thumb positioning comes from ui-sdk CSS variables —
  the CSS must read them exactly right)
- **Depends on**: plans/025-meter (DONE)
- **Category**: migration (component build-out, cycle 26 — S batch)
- **Planned at**: commit `fea46bd`, 2026-11-20

## Why this matters

ScrollArea is the styled-scroll surface every list-heavy component (trees,
command palettes, preference panes) sits inside later.

## Current state

- `packages/react/src/meter/meter.tsx` — the wrapper exemplar.
- `packages/styles/src/meter.css` — the newest stylesheet exemplar.
- `apps/docs/content/docs/meta.json` — `pages`:
  `["index", "accordion", "avatar", "button", "checkbox", "collapsible", "dialog", "field", "input", "kbd", "label", "listbox", "menu", "meter", "popover", "progress", "radio", "select", "separator", "slider", "switch", "tabs", "textarea", "toast", "toggle", "tooltip"]`.

### ui-sdk ScrollArea facts (from `packages/react/node_modules/@ui-sdk/react/docs/components/scroll-area.md`)

- Import: `import { ScrollArea, ScrollAreaContent, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport } from "@ui-sdk/react/scroll-area"` (verify the exact export list; `ScrollAreaCorner` and `ScrollAreaScrollToEnd` exist — corner deferred).
- Composition: `ScrollArea` (give it a size) → `ScrollAreaViewport`
  (the real scroller — root's full width and height) →
  `ScrollAreaContent`; `ScrollAreaScrollbar` (per axis; sits over the
  viewport's edges) → `ScrollAreaThumb` (sizes and moves itself).
- Root variables: `--scroll-area-overflow-*-start/end` (px, not
  inherited), `--scroll-area-progress-y/x`, `--scroll-area-corner-*`.
- Scrollbar variables: `--scroll-area-thumb-height` (vertical length),
  `--scroll-area-thumb-width` (horizontal length),
  `--scroll-area-thumb-offset` (position, negative right-to-left).
- Scrollbar states: `data-visible` (show under it), `data-orientation`;
  thumb: `data-orientation`, `data-dragging`.
- With no scrollbar rendered, the browser's own scrollbars stay.
- `type` prop controls when the scrollbar shows (docs: When Scrollbars
  Show).

### Design rules that bite (from `design/DESIGN.md`, `design/extraction/`)

- **Root**: `position: relative; overflow: hidden;` (the size comes from
  the consumer — inline style or their layout; the demo sets
  `block-size: 12rem`).
- **Viewport**: `inline-size: 100%; block-size: 100%; overflow-y: auto;
  overflow-x: hidden; overscroll-behavior: contain;` (+ `scrollbar-width:
  none` and `::-webkit-scrollbar { display: none; }` so the native bar
  never doubles with the styled one — ui-sdk may already hide it; verify
  in the rendered page and only add if needed).
- **Scrollbar (vertical)**: `position: absolute; inset-block: 0.25rem;
  inset-inline-end: 0.25rem; inline-size: 0.375rem;` — a slim floating
  rail, invisible until `data-visible`:
  `opacity: 0; transition: opacity var(--hashti-duration-fast-02)
  cubic-bezier(0.16, 1, 0.3, 1); [data-visible] { opacity: 1; }`.
- **Thumb (vertical)**: `inline-size: 100%;` the LENGTH reads
  `var(--scroll-area-thumb-height)` and the POSITION reads
  `var(--scroll-area-thumb-offset)` via `translate` — copy the docs'
  pattern exactly:
  `block-size: var(--scroll-area-thumb-height); translate: 0
  var(--scroll-area-thumb-offset);` background
  `var(--hashti-border-strong-01)`, border-radius
  `var(--hashti-border-radius-max)`, `min-block-size: 1.5rem;`
  `[data-dragging]` → background `var(--hashti-border-subtle-inverse,
  var(--hashti-text-secondary))` — pick
  `var(--hashti-border-subtle-01)`-or-darker; simplest: darker on drag via
  `var(--hashti-text-secondary)`.
- **Horizontal scrollbar**: mirror the vertical with
  `--scroll-area-thumb-width` for the length and the x-offset for
  position.
- Colours only via `var(--hashti-*)`; a hex in component CSS is a bug.

## Commands you will need

| Purpose   | Command               | Expected on success |
| --------- | --------------------- | ------------------- |
| Install   | `bun install`         | exit 0              |
| Typecheck | `bun run typecheck`   | exit 0, no errors   |

## Scope

**In scope** (the only files you should modify or create):

- `packages/react/src/scroll-area/scroll-area.tsx` — create
- `packages/react/src/scroll-area/index.ts` — create
- `packages/react/src/index.tsx` — add the re-export line
- `packages/styles/src/scroll-area.css` — create
- `packages/styles/index.css` — add one import line
- `apps/docs/src/components/scroll-area-demo.tsx` — create
- `apps/docs/content/docs/scroll-area.mdx` — create
- `apps/docs/content/docs/meta.json` — add `"scroll-area"` to `pages`

**Out of scope** (do NOT touch, even though they look related):

- Edge fades, corner, scroll-to-end, both-axes demos — deferred
- Hide-delay configuration styling — deferred
- Any lint/test infrastructure

## Git workflow

- Work on the branch checked out in your worktree (`particle/026-scroll-area`).
- Commit per logical step; plain imperative messages.
- Do NOT push, merge, or rebase.

## Steps

### Step 1: Create the ScrollArea wrappers in `@hashti/react`

`packages/react/src/scroll-area/scroll-area.tsx` — the `join` helper
pattern (direct-re-export check on roots):

| Part | Class |
| --- | --- |
| `ScrollArea` | `hashti-scroll-area` |
| `ScrollAreaViewport` | `hashti-scroll-area-viewport` |
| `ScrollAreaContent` | `hashti-scroll-area-content` |
| `ScrollAreaScrollbar` | `hashti-scroll-area-scrollbar` |
| `ScrollAreaThumb` | `hashti-scroll-area-thumb` |

Export all five from `./scroll-area` and the barrel.

**Verify**: `bun run typecheck` → exit 0.

### Step 2: Create the stylesheet and import it

`packages/styles/src/scroll-area.css` — the design-rules section above.

**Verify**: `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/scroll-area.css`
→ no matches; `grep -c "scroll-area-thumb" packages/styles/src/scroll-area.css`
→ ≥ 2 (both variable reads present).

### Step 3: Docs demo component and page

`apps/docs/src/components/scroll-area-demo.tsx` — a 12rem-tall area with a
long list:

```tsx
"use client"

import { ScrollArea, ScrollAreaContent, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport } from "@hashti/react"

export function ScrollAreaDemo() {
  return (
    <ScrollArea style={{ blockHeight: "12rem", maxWidth: 320, border: "1px solid var(--hashti-border-subtle-00)", borderRadius: "var(--hashti-popover-radius)" }}>
      <ScrollAreaViewport>
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
```

(Use the block-size style property name that works — `height` in the
style object if `blockHeight` is not a valid React style key.)

`apps/docs/content/docs/scroll-area.mdx`:

```mdx
---
title: ScrollArea
description: Scrolls content with a styled scrollbar.
---

import { ScrollAreaDemo } from '../../src/components/scroll-area-demo'

## Usage

<ScrollAreaDemo client:load />

## Parts

| Part | Purpose |
| --- | --- |
| `ScrollArea` | The sized, clipping box. |
| `ScrollAreaViewport` | The real scroller. |
| `ScrollAreaContent` | The content wrapper. |
| `ScrollAreaScrollbar` | One per axis; shows under `data-visible`. |
| `ScrollAreaThumb` | Sizes and moves itself. |

Styling lives in `@hashti/styles` under `.hashti-scroll-area*` — a slim floating rail with a strong-border thumb.
```

`apps/docs/content/docs/meta.json` — insert `"scroll-area"` after
`"radio"`.

**Verify**: `bun run typecheck` → exit 0.

## Test plan

No test runner exists in this repo; none is added by this plan. Verification
is: typecheck gates, the greps in Step 2, and the reviewer's rendered check
(thumb length ∝ content ratio, thumb moves on scroll, rail appears on
scroll and fades when idle, native scrollbar hidden, drag works).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `bun run typecheck` exits 0 from the repo root
- [ ] `grep -rn "hashti-scroll-area" packages/react/src packages/styles/src`
  shows the wrapper classes and the stylesheet selectors
- [ ] `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/scroll-area.css`
  returns nothing
- [ ] `grep -n "scroll-area" packages/styles/index.css apps/docs/content/docs/meta.json`
  shows the import and the page entry
- [ ] `git status --porcelain` lists no files outside the in-scope list
- [ ] Work committed on the worktree branch, one commit per step

## STOP conditions

Stop and report back (do not improvise) if:

- Any of the five parts is not exported from `@ui-sdk/react/scroll-area` —
  quote the error.
- The thumb does not size/position from the documented variables — report
  what actually positions it.
- A step's verification fails twice after a reasonable fix attempt.
- The fix appears to require touching an out-of-scope file.

## Maintenance notes

- Edge fades read the root's overflow variables — a follow-up recipe.
- Trees, command palettes and preference panes will host scroll areas.
