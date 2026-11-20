# Plan 040: Toolbar — action row with groups and separators

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do not update `plans/README.md`; the reviewer
> maintains it.
>
> **Drift check (run first)**: `git diff --stat 9f4a4b6..HEAD -- packages apps/docs/content design`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: plans/039-pagination (DONE)
- **Category**: migration (component build-out, cycle 40 — M batch)
- **Planned at**: commit `9f4a4b6`, 2026-11-20

## Why this matters

Toolbar is the action row (document editors, table bulk actions) — a
container that sizes its children consistently and hosts toggles, menus
and inputs.

## Current state

- `packages/styles/src/pagination.css` — the newest quiet-action exemplar.
- `apps/docs/content/docs/meta.json` — `pages`:
  `["index", "accordion", "avatar", "badge", "button", "checkbox", "collapsible", "date-input", "dialog", "field", "file-input", "hover-card", "input", "kbd", "label", "link", "listbox", "menu", "meter", "number-input", "pagination", "password-input", "popover", "progress", "radio", "rating", "scroll-area", "segmented-control", "select", "separator", "slider", "switch", "tabs", "textarea", "time-input", "timeline", "toast", "toggle", "tooltip"]`.

### ui-sdk Toolbar facts (from `packages/react/node_modules/@ui-sdk/react/docs/components/toolbar.md`)

- Import: `import { Toolbar, ToolbarButton, ToolbarGroup, ToolbarInput, ToolbarLink, ToolbarSeparator } from "@ui-sdk/react/toolbar"` (verify).
- Composition: `Toolbar` → (`ToolbarButton`+ straight inside,
  `ToolbarGroup` naming related sets, `ToolbarSeparator` between sets,
  `ToolbarLink`, `ToolbarInput`). Toggles join on their own; menu and
  select triggers join THROUGH `ToolbarButton`.
- All parts carry `data-orientation` + `data-disabled`.

### Design rules that bite (quiet-action vocabulary)

- **Root `hashti-toolbar`**: `display: flex; align-items: center;
  gap: 0.25rem; padding: 0.25rem; border: 1px solid
  var(--hashti-border-subtle-00); border-radius:
  var(--hashti-control-radius); background: var(--hashti-layer-02);`
  (a quiet well like the segmented-control's, no inner chip).
- **Button `hashti-toolbar-button`**: the quiet-action recipe —
  `display: inline-flex; align-items: center; justify-content: center;
  gap: 0.375rem; min-block-size: 2.25rem; padding: 0 0.625rem;
  border: none; border-radius: calc(var(--hashti-control-radius) - 0.25rem);
  background: transparent; color: var(--hashti-text-primary);
  font-size: 0.875rem; font-weight: 500; cursor: pointer;`
  hover (hover:hover, not disabled) → `background:
  var(--hashti-background-hover);` `:focus-visible` → 2px ring @-2px
  (inset — the well clips, per the password-input review precedent);
  `[data-disabled]` → ink disabled, cursor not-allowed.
- **Group `hashti-toolbar-group`**: `display: flex; gap: 0.125rem;`
  (tighter than the root gap — a named set).
- **Separator `hashti-toolbar-separator`**: `align-self: stretch;
  inline-size: 1px; background: var(--hashti-border-subtle-00); margin:
  0.25rem 0.125rem;` (horizontal orientation; vertical deferred).
- **Link `hashti-toolbar-link`**: the button box + `color:
  var(--hashti-link-primary); text-decoration: none;` hover → underline.
- **Input `hashti-toolbar-input`**: reuse the date-input group recipe's
  inner-input look in miniature: `block-size: 2.25rem; padding: 0
  0.5rem; border: none; background: transparent; color: var(--hashti-text-primary);
  font-size: 0.875rem;` `::placeholder` secondary; outline none (ring on
  the toolbar? no — give the input its own inset ring on `:focus-visible`:
  2px @-2px with `border-radius: inherit`).
- Colours only via `var(--hashti-*)`; a hex in component CSS is a bug.

## Commands you will need

| Purpose   | Command               | Expected on success |
| --------- | --------------------- | ------------------- |
| Install   | `bun install`         | exit 0              |
| Typecheck | `bun run typecheck`   | exit 0, no errors   |

## Scope

**In scope** (the only files you should modify or create):

- `packages/react/src/toolbar/toolbar.tsx` — create
- `packages/react/src/toolbar/index.ts` — create
- `packages/react/src/index.tsx` — add the re-export line
- `packages/styles/src/toolbar.css` — create
- `packages/styles/index.css` — add one import line
- `apps/docs/src/components/toolbar-demo.tsx` — create
- `apps/docs/content/docs/toolbar.mdx` — create
- `apps/docs/content/docs/meta.json` — add `"toolbar"` to `pages`

**Out of scope** (do NOT touch, even though they look related):

- Vertical orientation styling — deferred
- Menu/select-in-toolbar integration demos — their own cycles exist
- Any lint/test infrastructure

## Git workflow

- Work on the branch checked out in your worktree
  (`particle/040-toolbar`).
- Commit per logical step; plain imperative messages.
- Do NOT push, merge, or rebase.

## Steps

### Step 1: Create the Toolbar wrappers in `@hashti/react`

`packages/react/src/toolbar/toolbar.tsx` — the `join` helper pattern
(direct-re-export check on roots):

| Part | Class |
| --- | --- |
| `Toolbar` | `hashti-toolbar` |
| `ToolbarButton` | `hashti-toolbar-button` |
| `ToolbarGroup` | `hashti-toolbar-group` |
| `ToolbarSeparator` | `hashti-toolbar-separator` |
| `ToolbarLink` | `hashti-toolbar-link` |
| `ToolbarInput` | `hashti-toolbar-input` |

Export all six from `./toolbar` and the barrel.

**Verify**: `bun run typecheck` → exit 0.

### Step 2: Create the stylesheet and import it

`packages/styles/src/toolbar.css` — the design-rules section above.

**Verify**: `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/toolbar.css`
→ no matches; `grep -c "data-" packages/styles/src/toolbar.css` → ≥ 2.

### Step 3: Docs demo component and page

`apps/docs/src/components/toolbar-demo.tsx` — inline SVG glyphs:

```tsx
"use client"

import { Toolbar, ToolbarButton, ToolbarGroup, ToolbarInput, ToolbarLink, ToolbarSeparator } from "@hashti/react"

function Icon({ d }: { d: string }) {
  return <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d={d} fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

export function ToolbarDemo() {
  return (
    <Toolbar aria-label="Document tools">
      <ToolbarButton aria-label="Bold"><Icon d="M4 3h5a2.5 2.5 0 0 1 0 5H4Zm0 5h6a2.5 2.5 0 0 1 0 5H4Z" /></ToolbarButton>
      <ToolbarButton aria-label="Italic"><Icon d="M10 3H7m2 0-3 10m1 0H4" /></ToolbarButton>
      <ToolbarGroup aria-label="Align">
        <ToolbarButton aria-label="Align left"><Icon d="M3 4h10M3 8h6M3 12h8" /></ToolbarButton>
        <ToolbarButton aria-label="Align center"><Icon d="M3 4h10M5 8h6M4 12h8" /></ToolbarButton>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarInput placeholder="Find…" aria-label="Find" style={{ inlineSize: "8rem" }} />
      <ToolbarSeparator />
      <ToolbarLink href="#help">Help</ToolbarLink>
    </Toolbar>
  )
}
```

`apps/docs/content/docs/toolbar.mdx`:

```mdx
---
title: Toolbar
description: Groups document actions in a row.
---

import { ToolbarDemo } from '../../src/components/toolbar-demo'

## Usage

<ToolbarDemo client:load />

## Parts

| Part | Purpose |
| --- | --- |
| `Toolbar` | The action well. |
| `ToolbarButton` | One action; menu/select triggers join through it. |
| `ToolbarGroup` | A named related set. |
| `ToolbarSeparator` | Divides sets. |
| `ToolbarLink` | A navigation action. |
| `ToolbarInput` | An inline field. |

Styling lives in `@hashti/styles` under `.hashti-toolbar*` — a quiet well, inset focus rings, dividers between sets.
```

`apps/docs/content/docs/meta.json` — insert `"toolbar"` after `"timeline"`.

**Verify**: `bun run typecheck` → exit 0.

## Test plan

No test runner exists in this repo; none is added by this plan. Verification
is: typecheck gates, the greps in Step 2, and the reviewer's rendered check
(well + dividers, hover on buttons, inset focus ring, input usable, link
underlines on hover, disabled).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `bun run typecheck` exits 0 from the repo root
- [ ] `grep -rn "hashti-toolbar" packages/react/src packages/styles/src`
  shows the wrapper classes and the stylesheet selectors
- [ ] `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/toolbar.css`
  returns nothing
- [ ] `grep -n "toolbar" packages/styles/index.css apps/docs/content/docs/meta.json`
  shows the import and the page entry
- [ ] `git status --porcelain` lists no files outside the in-scope list
- [ ] Work committed on the worktree branch, one commit per step

## STOP conditions

Stop and report back (do not improvise) if:

- Any of the six parts is not exported from `@ui-sdk/react/toolbar` —
  quote the error.
- A step's verification fails twice after a reasonable fix attempt.
- The fix appears to require touching an out-of-scope file.

## Maintenance notes

- Toggle groups inside toolbars work through ui-sdk; the joined look can
  reuse segmented-control's chip recipe later.
- Vertical toolbars land with the vertical pass.
