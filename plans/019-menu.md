# Plan 019: Menu — actions popup (trigger, content, items, groups)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do not update `plans/README.md`; the reviewer
> maintains it.
>
> **Drift check (run first)**: `git diff --stat 132fb89..HEAD -- packages apps/docs/content design`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW (reuses the Popover surface and Select item recipes)
- **Depends on**: plans/018-slider (DONE)
- **Category**: migration (component build-out, cycle 19)
- **Planned at**: commit `132fb89`, 2026-11-20

## Why this matters

Menu is the actions popup — the command surface. It reuses the Popover
surface recipe (18px, popover shadow) at ZERO padding with full-bleed
items, and the Select item recipes (highlight, disabled). Context menus,
submenus and checkbox/radio menus hang off it later.

## Current state

- `packages/react/src/popover/popover.tsx` — the wrapper exemplar (Popover
  root shipped as a direct re-export — no DOM node; apply the same check to
  the Menu root).
- `packages/styles/src/popover.css` — the surface/motion exemplar; the menu
  copies it with padding 0 and full-bleed items.
- `packages/styles/src/select.css` — the item recipes exemplar (highlighted,
  disabled, group label, separator).
- `apps/docs/src/components/select-demo.tsx` — the compound docs pattern.
- `apps/docs/content/docs/meta.json` — `pages`:
  `["index", "accordion", "avatar", "button", "checkbox", "dialog", "field", "input", "label", "popover", "radio", "select", "separator", "slider", "switch", "tabs", "textarea", "toast", "tooltip"]`.

### ui-sdk Menu facts (from `packages/react/node_modules/@ui-sdk/react/docs/components/menu.md`)

- Import: `import { Menu, MenuContent, MenuGroup, MenuGroupLabel, MenuItem, MenuSeparator, MenuTrigger } from "@ui-sdk/react/menu"` (these seven are the in-scope set; `MenuSub*`, `MenuCheckboxItem`, `MenuRadioGroup`/`MenuRadioItem`, `MenuItemIcon`, `MenuShortcut`, `MenuContextTrigger` exist but are DEFERRED).
- Composition: `Menu` → (`MenuTrigger`, `MenuContent` → `MenuItem`+,
  `MenuGroup` → `MenuGroupLabel`, `MenuSeparator`).
- Items take `value`; `onAction` on the menu runs the chosen command.
- Trigger states: `data-open`/`data-closed`.
- Content states: `data-open`/`data-closed`,
  `data-starting-style`/`data-ending-style`, `data-side`, `data-align`,
  `data-presentation`, `data-nested`, `data-has-icons`.
- Item states: `data-highlighted` (keyboard focus OR pointer — style this,
  never `:hover`), `data-disabled`, `data-has-icon`.
- The menu renders in the top layer; `[data-theme]` ancestry works.

### Design rules that bite (from `design/DESIGN.md`, `design/extraction/`)

- **Surface**: popover recipe with ONE difference — `padding: 0` (DESIGN.md:
  "Popovers and menus take the popover shadow, 18px corners, and zero
  padding when they host a menu or listbox"). Background
  `var(--hashti-layer-01)`, border `1px solid var(--hashti-border-subtle-00)`,
  `border-radius: var(--hashti-popover-radius)`, shadow
  `0 8px 24px var(--hashti-shadow)`,
  `min-inline-size: var(--anchor-width)`,
  `max-block-size: var(--available-height); overflow-y: auto`.
- **Trigger**: the quiet-action recipe from popover.css (transparent, 44px
  row, control radius, hover inside `(hover: hover)`).
- **Items**: FULL-BLEED (zero surface padding) — `min-block-size: 2.5rem;
  padding: 0 0.75rem; display: flex; align-items: center;` text
  0.875rem/400 ink `var(--hashti-text-primary)`, `cursor: default`.
  - `[data-highlighted]` → background `var(--hashti-background-hover)`.
  - `[data-disabled]` → ink `var(--hashti-text-disabled)`, no highlight.
- **Item radius note**: unlike Select items (8px inner radius floating in
  4px padding), menu items are full-bleed — NO radius on items. The 18px
  surface clips its own corners (`overflow: hidden` on the content is NOT
  needed; the surface's own radius + full-bleed items visually meet — if a
  highlighted first/last item paints past the rounded corner, add
  `overflow: clip` on the content and note it).
- **Separator**: `block-size: 1px`, background
  `var(--hashti-border-subtle-00)`, margin `0.25rem 0` (full-bleed).
- **Group label**: helper typography (0.8125rem), ink
  `var(--hashti-text-secondary)`, `padding: 0.375rem 0.75rem 0.25rem`.
- **Motion**: same as popover — starting/ending `opacity: 0; scale(0.98)`,
  `transform-origin: var(--transform-origin)`, transition
  `var(--hashti-duration-fast-01) cubic-bezier(0.16, 1, 0.3, 1)`,
  reduced-motion → opacity only.
- **Focus**: items are highlighted, not focus-ringed; the trigger takes the
  standard `:focus-visible` ring (2px/3px offset).
- Colours only via `var(--hashti-*)`; a hex in component CSS is a bug.

## Commands you will need

| Purpose   | Command               | Expected on success |
| --------- | --------------------- | ------------------- |
| Install   | `bun install`         | exit 0              |
| Typecheck | `bun run typecheck`   | exit 0, no errors   |

## Scope

**In scope** (the only files you should modify or create):

- `packages/react/src/menu/menu.tsx` — create
- `packages/react/src/menu/index.ts` — create
- `packages/react/src/index.tsx` — add the re-export line
- `packages/styles/src/menu.css` — create
- `packages/styles/index.css` — add one import line
- `apps/docs/src/components/menu-demo.tsx` — create
- `apps/docs/content/docs/menu.mdx` — create
- `apps/docs/content/docs/meta.json` — add `"menu"` to `pages`

**Out of scope** (do NOT touch, even though they look related):

- Submenus (`MenuSub*`), checkbox/radio items, item icons, shortcuts,
  context menus, pending-item styling — deferred cycles
- `data-presentation: sheet` — deferred with Drawer
- Any lint/test infrastructure

## Git workflow

- Work on the branch checked out in your worktree (`particle/019-menu`).
- Commit per logical step; plain imperative messages.
- Do NOT push, merge, or rebase.

## Steps

### Step 1: Create the Menu wrappers in `@hashti/react`

`packages/react/src/menu/menu.tsx` — the `join` helper pattern from
`packages/react/src/field/field.tsx`; parts and classes (direct-re-export
check on the Menu root):

| Part | Class |
| --- | --- |
| `Menu` | `hashti-menu` (or direct re-export if the root takes no className — same check as Select/Dialog/Popover) |
| `MenuTrigger` | `hashti-menu-trigger` |
| `MenuContent` | `hashti-menu-content` |
| `MenuItem` | `hashti-menu-item` |
| `MenuGroup` | `hashti-menu-group` |
| `MenuGroupLabel` | `hashti-menu__group-label` |
| `MenuSeparator` | `hashti-menu-separator` |

Export all seven from `./menu` and the barrel.

**Verify**: `bun run typecheck` → exit 0.

### Step 2: Create the stylesheet and import it

`packages/styles/src/menu.css` — write the rules from the design-rules
section above: trigger (quiet action), content (zero-padding popover
surface + motion), items (full-bleed, highlight/disabled), separator, group
label.

**Verify**: `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/menu.css` → no
matches; `grep -c "data-" packages/styles/src/menu.css` → ≥ 6.

### Step 3: Docs demo component and page

`apps/docs/src/components/menu-demo.tsx`:

```tsx
"use client"

import {
  Menu,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "@hashti/react"

export function MenuDemo() {
  return (
    <Menu onAction={(value) => console.log(value)}>
      <MenuTrigger>Actions</MenuTrigger>
      <MenuContent>
        <MenuItem value="rename">Rename</MenuItem>
        <MenuItem value="duplicate">Duplicate</MenuItem>
        <MenuSeparator />
        <MenuGroup>
          <MenuGroupLabel>Danger zone</MenuGroupLabel>
          <MenuItem value="archive">Archive</MenuItem>
          <MenuItem value="delete">Delete</MenuItem>
        </MenuGroup>
      </MenuContent>
    </Menu>
  )
}
```

`apps/docs/content/docs/menu.mdx`:

```mdx
---
title: Menu
description: Opens a list of actions beside its trigger.
---

import { MenuDemo } from '../../src/components/menu-demo'

## Usage

<MenuDemo client:load />

## Parts

| Part | Purpose |
| --- | --- |
| `Menu` | Owns the open state and `onAction`. |
| `MenuTrigger` | Opens the menu. |
| `MenuContent` | The actions surface; flips away from edges. |
| `MenuItem` | One action; a `value` for `onAction`. |
| `MenuGroup` / `MenuGroupLabel` | Groups related actions. |
| `MenuSeparator` | Divides items without a focus stop. |

Styling lives in `@hashti/styles` under `.hashti-menu-*` — an 18px zero-padding surface with full-bleed items, highlighted in background-hover.
```

`apps/docs/content/docs/meta.json` — insert `"menu"` after `"label"`.

**Verify**: `bun run typecheck` → exit 0.

## Test plan

No test runner exists in this repo; none is added by this plan. Verification
is: typecheck gates, the greps in Step 2, and the reviewer's rendered check
(open → zero-padding surface, full-bleed highlighted item flush to the
rounded corners, keyboard arrows + typeahead, onAction fires, disabled ink,
group label, separator, Escape/outside dismissal).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `bun run typecheck` exits 0 from the repo root
- [ ] `grep -rn "hashti-menu" packages/react/src packages/styles/src` shows
  the wrapper classes and the stylesheet selectors
- [ ] `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/menu.css` returns
  nothing
- [ ] `grep -n "menu" packages/styles/index.css apps/docs/content/docs/meta.json`
  shows the import and the page entry
- [ ] `git status --porcelain` lists no files outside the in-scope list
- [ ] Work committed on the worktree branch, one commit per step

## STOP conditions

Stop and report back (do not improvise) if:

- Any of the seven parts is not exported from `@ui-sdk/react/menu` — quote
  the error.
- The full-bleed highlighted item visibly paints past the surface's rounded
  corners AND `overflow: clip` does not fix it — report the rendered
  geometry instead of inventing a different recipe.
- A step's verification fails twice after a reasonable fix attempt.
- The fix appears to require touching an out-of-scope file.

## Maintenance notes

- Submenus, checkbox/radio menus, icons, shortcuts and context menus are
  the follow-up cycles; `data-has-icons` and `data-nested` lanes are
  reserved in the CSS contract.
- The zero-padding surface recipe is shared with Listbox (cycle 20).
