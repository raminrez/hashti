# Plan 045: Menubar — the menu bar over Menu parts

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do not update `plans/README.md`; the reviewer
> maintains it.
>
> **Drift check (run first)**: `git diff --stat bfa366f..HEAD -- packages apps/docs/content design`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW (styles reuse Menu's)
- **Depends on**: plans/044-drawer (DONE)
- **Category**: migration (component build-out, cycle 45 — M batch)
- **Planned at**: commit `bfa366f`, 2026-11-20

## Why this matters

Menubar is the app menu bar (File Edit View). It reuses Menu's item
recipes; only the BAR itself is new styling.

## Current state

- `packages/styles/src/menu.css` — the menu recipes (trigger, content,
  items) the menubar reuses. The bar's trigger is a `MenuTrigger` styled
  by menu.css; the bar adds only the row container.
- `packages/react/src/menu/menu.tsx` — the Menu wrappers (already
  exported).
- `apps/docs/content/docs/meta.json` — `pages`:
  `["index", "accordion", "alert-dialog", "avatar", "badge", "button", "carousel", "checkbox", "collapsible", "date-input", "dialog", "drawer", "field", "file-input", "hover-card", "input", "kbd", "label", "link", "listbox", "menu", "meter", "number-input", "pagination", "password-input", "popover", "progress", "radio", "rating", "resizable", "scroll-area", "segmented-control", "select", "separator", "slider", "switch", "tabs", "textarea", "time-input", "timeline", "toast", "toolbar", "toggle", "tooltip"]`.

### ui-sdk Menubar facts (from `packages/react/node_modules/@ui-sdk/react/docs/components/menubar.md`)

- Import: `import { Menubar } from "@ui-sdk/react/menubar"` + the Menu
  parts from `@ui-sdk/react/menu` (verify the exact import shape in the
  docs' Installation/Usage — Menubar has NO trigger/item parts of its
  own; `Menu`s join automatically).
- Composition: `Menubar` → (`Menu` → `MenuTrigger` + `MenuContent` →
  `MenuItem`+)×N.
- Root states: `data-orientation`, `data-disabled`, `data-open`.

### Design rules that bite

- **Bar `hashti-menubar`**: a quiet row — `display: inline-flex;
  align-items: center; gap: 0.125rem; padding: 0.1875rem; border: 1px
  solid var(--hashti-border-subtle-00); border-radius:
  var(--hashti-control-radius); background: var(--hashti-layer-02);`
- The MenuTriggers INSIDE the bar need bar-scoped compactness — menu.css's
  trigger is 44px tall (a page-level quiet action); a menubar trigger is
  a compact row entry: `.hashti-menubar .hashti-menu-trigger {
  min-block-size: 2rem; padding: 0 0.625rem; border-radius: calc(var(--hashti-control-radius) - 0.1875rem); }`
  — an override scoped by the bar's class (same pattern the segmented
  control uses for items).
- `data-open` on a trigger (menu.css already has trigger states? check —
  if menu.css styles `[data-open]` on the trigger, the bar inherits it;
  if not, add `.hashti-menubar .hashti-menu-trigger[data-open] {
  background: var(--hashti-background-hover); }`).
- Everything else (content, items, highlight) comes from menu.css
  untouched.
- Colours only via `var(--hashti-*)`; a hex in component CSS is a bug.

## Commands you will need

| Purpose   | Command               | Expected on success |
| --------- | --------------------- | ------------------- |
| Install   | `bun install`         | exit 0              |
| Typecheck | `bun run typecheck`   | exit 0, no errors   |

## Scope

**In scope** (the only files you should modify or create):

- `packages/react/src/menubar/menubar.tsx` — create
- `packages/react/src/menubar/index.ts` — create
- `packages/react/src/index.tsx` — add the re-export line
- `packages/styles/src/menubar.css` — create
- `packages/styles/index.css` — add one import line
- `apps/docs/src/components/menubar-demo.tsx` — create
- `apps/docs/content/docs/menubar.mdx` — create
- `apps/docs/content/docs/meta.json` — add `"menubar"` to `pages`

**Out of scope** (do NOT touch, even though they look related):

- Submenus in menubar, vertical orientation — deferred
- `packages/styles/src/menu.css` — read-only (overrides live in
  menubar.css scoped by `.hashti-menubar`)
- Any lint/test infrastructure

## Git workflow

- Work on the branch checked out in your worktree
  (`particle/045-menubar`).
- Commit per logical step; plain imperative messages.
- Do NOT push, merge, or rebase.

## Steps

### Step 1: Create the Menubar wrapper in `@hashti/react`

`packages/react/src/menubar/menubar.tsx` — ONE wrapper (the bar), plus
re-export the Menu parts consumers need from `@hashti/react` (they are
already in the barrel — just wrap the bar):

| Part | Class |
| --- | --- |
| `Menubar` | `hashti-menubar` (or direct re-export if the root takes no className — check) |

Export `Menubar` from `./menubar` and the barrel.

**Verify**: `bun run typecheck` → exit 0.

### Step 2: Create the stylesheet and import it

`packages/styles/src/menubar.css` — the design-rules section above (bar +
scoped trigger overrides only).

**Verify**: `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/menubar.css`
→ no matches; `grep -c "hashti-menubar" packages/styles/src/menubar.css`
→ ≥ 3.

### Step 3: Docs demo component and page

`apps/docs/src/components/menubar-demo.tsx`:

```tsx
"use client"

import { Menubar } from "@hashti/react"
import { Menu, MenuContent, MenuItem, MenuSeparator, MenuTrigger } from "@hashti/react"

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
  )
}
```

`apps/docs/content/docs/menubar.mdx`:

```mdx
---
title: Menubar
description: A bar of app menus.
---

import { MenubarDemo } from '../../src/components/menubar-demo'

## Usage

<MenubarDemo client:load />

## Notes

Compose with the Menu parts — the bar scopes compact trigger sizing and the open highlight; contents and items style exactly like the Menu page's.
```

`apps/docs/content/docs/meta.json` — insert `"menubar"` after `"menu"`.

**Verify**: `bun run typecheck` → exit 0.

## Test plan

No test runner exists in this repo; none is added by this plan. Verification
is: typecheck gates, the greps in Step 2, and the reviewer's rendered check
(compact triggers, open highlight, menus open with Menu's recipes, arrow
between menus, Escape closes).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `bun run typecheck` exits 0 from the repo root
- [ ] `grep -rn "hashti-menubar" packages/react/src packages/styles/src`
  shows the bar class and the scoped selectors
- [ ] `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/menubar.css`
  returns nothing
- [ ] `grep -n "menubar" packages/styles/index.css apps/docs/content/docs/meta.json`
  shows the import and the page entry
- [ ] `git status --porcelain` lists no files outside the in-scope list
- [ ] Work committed on the worktree branch, one commit per step

## STOP conditions

Stop and report back (do not improvise) if:

- `Menubar` is not exported from `@ui-sdk/react/menubar`, or the Menu
  parts cannot join it — quote the error.
- A step's verification fails twice after a reasonable fix attempt.
- The fix appears to require touching an out-of-scope file.

## Maintenance notes

- Submenus land with the menu-features cycle.
- The scoped-override pattern (`.hashti-menubar .hashti-menu-trigger`)
  is the recipe for context-scoped sizing.
