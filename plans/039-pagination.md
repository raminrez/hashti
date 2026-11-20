# Plan 039: Pagination — page links, steps, ellipsis

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do not update `plans/README.md`; the reviewer
> maintains it.
>
> **Drift check (run first)**: `git diff --stat 2149d20..HEAD -- packages apps/docs/content design`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: plans/038-time-input (DONE)
- **Category**: migration (component build-out, cycle 39 — M batch)
- **Planned at**: commit `2149d20`, 2026-11-20

## Why this matters

Pagination is the page navigation row — links, prev/next steps, ellipsis
gaps. Pure button/link styling on a quiet scale.

## Current state

- `packages/styles/src/file-input.css` — the newest stylesheet exemplar.
- `apps/docs/content/docs/meta.json` — `pages`:
  `["index", "accordion", "avatar", "badge", "button", "checkbox", "collapsible", "date-input", "dialog", "field", "file-input", "hover-card", "input", "kbd", "label", "link", "listbox", "menu", "meter", "number-input", "password-input", "popover", "progress", "radio", "rating", "scroll-area", "segmented-control", "select", "separator", "slider", "switch", "tabs", "textarea", "time-input", "timeline", "toast", "toggle", "tooltip"]`.

### ui-sdk Pagination facts (from `packages/react/node_modules/@ui-sdk/react/docs/components/pagination.md`)

- Import: `import { Pagination, PaginationEllipsis, PaginationFirst, PaginationItem, PaginationLast, PaginationLink, PaginationList, PaginationNext, PaginationPrevious } from "@ui-sdk/react/pagination"` (verify).
- Composition: `Pagination` (aria-label) → `PaginationList` →
  `PaginationItem` → (`PaginationPrevious`/`PaginationLink`/
  `PaginationEllipsis`/`PaginationNext`/`PaginationFirst`/
  `PaginationLast`).
- `items` on the root contains page numbers and `"ellipsis-start"`/
  `"ellipsis-end"` strings — render links for numbers, ellipsis for gaps.
- Link state: `data-current` (+ `aria-current="page"`).
- Steps (First/Previous/Next/Last): `data-disabled` at their end
  (focusable, aria-disabled, does nothing).

### Design rules that bite (button recipes at quiet scale)

- **Root `hashti-pagination`**: `display: flex; justify-content: center;`
  (or the consumer lays it out).
- **List**: `display: flex; gap: 0.25rem; margin: 0; padding: 0;
  list-style: none; align-items: center;` (reset the ul).
- **Item**: `display: flex;` (wrapper only).
- **Link (page)**: `display: inline-flex; align-items: center;
  justify-content: center; min-inline-size: 2.5rem; block-size: 2.5rem;
  padding: 0 0.5rem; border: none; border-radius:
  var(--hashti-control-radius); background: transparent; color:
  var(--hashti-text-secondary); font-size: 0.875rem; font-weight: 500;
  text-decoration: none; cursor: pointer; font-variant-numeric:
  tabular-nums;`
  - hover (hover:hover, not current) → `background:
    var(--hashti-background-hover); color: var(--hashti-text-primary);`
  - `[data-current]` → `background: var(--hashti-background-selected);
    color: var(--hashti-focus); font-weight: 600;` (the selected recipe —
    same pair as Toggle's pressed state).
  - `:focus-visible` → 2px ring @2px.
- **Steps (First/Previous/Next/Last)**: same box as links (2.5rem
  square, or auto width with padding when they carry text) — same
  classes' rules via a shared selector list; `[data-disabled]` → ink
  `var(--hashti-text-disabled)`, background transparent, cursor
  not-allowed.
- **Ellipsis**: `inline-size: 2.5rem; display: inline-flex; align-items:
  center; justify-content: center; color: var(--hashti-text-secondary);`
  no cursor.
- Colours only via `var(--hashti-*)`; a hex in component CSS is a bug.

## Commands you will need

| Purpose   | Command               | Expected on success |
| --------- | --------------------- | ------------------- |
| Install   | `bun install`         | exit 0              |
| Typecheck | `bun run typecheck`   | exit 0, no errors   |

## Scope

**In scope** (the only files you should modify or create):

- `packages/react/src/pagination/pagination.tsx` — create
- `packages/react/src/pagination/index.ts` — create
- `packages/react/src/index.tsx` — add the re-export line
- `packages/styles/src/pagination.css` — create
- `packages/styles/index.css` — add one import line
- `apps/docs/src/components/pagination-demo.tsx` — create
- `apps/docs/content/docs/pagination.mdx` — create
- `apps/docs/content/docs/meta.json` — add `"pagination"` to `pages`

**Out of scope** (do NOT touch, even though they look related):

- Router-link integration, controlled recipes — behavior exists
- Any lint/test infrastructure

## Git workflow

- Work on the branch checked out in your worktree
  (`particle/039-pagination`).
- Commit per logical step; plain imperative messages.
- Do NOT push, merge, or rebase.

## Steps

### Step 1: Create the Pagination wrappers in `@hashti/react`

`packages/react/src/pagination/pagination.tsx` — the `join` helper pattern
(direct-re-export check on roots; watch for the date-input lesson — check
which parts render themselves):

| Part | Class |
| --- | --- |
| `Pagination` | `hashti-pagination` (or direct re-export) |
| `PaginationList` | `hashti-pagination-list` |
| `PaginationItem` | `hashti-pagination__item` |
| `PaginationLink` | `hashti-pagination-link` |
| `PaginationEllipsis` | `hashti-pagination-ellipsis` |
| `PaginationPrevious` / `PaginationNext` / `PaginationFirst` / `PaginationLast` | `hashti-pagination-step` (shared step class) |

Export all from `./pagination` and the barrel.

**Verify**: `bun run typecheck` → exit 0.

### Step 2: Create the stylesheet and import it

`packages/styles/src/pagination.css` — the design-rules section above.

**Verify**: `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/pagination.css`
→ no matches; `grep -c "data-" packages/styles/src/pagination.css` →
≥ 3.

### Step 3: Docs demo component and page

`apps/docs/src/components/pagination-demo.tsx`:

```tsx
"use client"

import {
  Pagination,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
} from "@hashti/react"

export function PaginationDemo() {
  return (
    <Pagination items={[1, 2, "ellipsis-start", 5, 6, 7, "ellipsis-end", 10]} defaultValue={6} aria-label="Results pages">
      <PaginationList>
        <PaginationItem><PaginationPrevious aria-label="Previous page" /></PaginationItem>
        {[1, 2].map((p) => (
          <PaginationItem key={p}><PaginationLink page={p} /></PaginationItem>
        ))}
        <PaginationItem><PaginationEllipsis /></PaginationItem>
        {[5, 6, 7].map((p) => (
          <PaginationItem key={p}><PaginationLink page={p} /></PaginationItem>
        ))}
        <PaginationItem><PaginationEllipsis /></PaginationItem>
        <PaginationItem><PaginationLink page={10} /></PaginationItem>
        <PaginationItem><PaginationNext aria-label="Next page" /></PaginationItem>
      </PaginationList>
    </Pagination>
  )
}
```

(If `items`/`defaultValue`/`page` prop names differ from the docs' Usage
section, use the documented names and note it. A simpler valid
composition is also fine.)

`apps/docs/content/docs/pagination.mdx`:

```mdx
---
title: Pagination
description: Moves between pages of results.
---

import { PaginationDemo } from '../../src/components/pagination-demo'

## Usage

<PaginationDemo client:load />

## Parts

| Part | Purpose |
| --- | --- |
| `Pagination` | Owns the page; `items` lists pages and gaps. |
| `PaginationList` / `PaginationItem` | The nav list and its rows. |
| `PaginationLink` | One page; `data-current` on the active one. |
| `PaginationEllipsis` | A gap. |
| `PaginationPrevious` / `PaginationNext` / `PaginationFirst` / `PaginationLast` | Steps; `data-disabled` at their end. |

Styling lives in `@hashti/styles` under `.hashti-pagination*` — quiet squares, the current page in the selected tint with focus-blue ink.
```

`apps/docs/content/docs/meta.json` — insert `"pagination"` after
`"password-input"` (alphabetical check against the live list).

**Verify**: `bun run typecheck` → exit 0.

## Test plan

No test runner exists in this repo; none is added by this plan. Verification
is: typecheck gates, the greps in Step 2, and the reviewer's rendered check
(current page tinted, click changes page, steps disable at ends, ellipsis
muted, focus ring, tabular numerals).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `bun run typecheck` exits 0 from the repo root
- [ ] `grep -rn "hashti-pagination" packages/react/src packages/styles/src`
  shows the wrapper classes and the stylesheet selectors
- [ ] `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/pagination.css`
  returns nothing
- [ ] `grep -n "pagination" packages/styles/index.css apps/docs/content/docs/meta.json`
  shows the import and the page entry
- [ ] `git status --porcelain` lists no files outside the in-scope list
- [ ] Work committed on the worktree branch, one commit per step

## STOP conditions

Stop and report back (do not improvise) if:

- Any part is not exported from `@ui-sdk/react/pagination` — quote the
  error.
- A step's verification fails twice after a reasonable fix attempt.
- The fix appears to require touching an out-of-scope file.

## Maintenance notes

- Compact size variants land with a size-pass cycle later.
