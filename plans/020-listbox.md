# Plan 020: Listbox — selectable option list

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do not update `plans/README.md`; the reviewer
> maintains it.
>
> **Drift check (run first)**: `git diff --stat e576a16..HEAD -- packages apps/docs/content design`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW (reuses the Menu/Select item recipes)
- **Depends on**: plans/019-menu (DONE)
- **Category**: migration (component build-out, cycle 20)
- **Planned at**: commit `e576a16`, 2026-11-20

## Why this matters

Listbox is the inline selection list — the last of the core ui-sdk-backed
surfaces. It completes the shared item recipe (highlight/selected/disabled,
indicator lane) that Select popups and Menus already use, this time as a
visible inline surface.

## Current state

- `packages/react/src/menu/menu.tsx` — the wrapper exemplar (Menu root
  shipped as a direct re-export — no DOM node; apply the same check to the
  Listbox root).
- `packages/styles/src/menu.css` — the zero-padding surface + full-bleed
  item exemplar. Listbox is an INLINE surface (not a popup): it sits in the
  page flow, carries the same surface recipe, and items keep full-bleed.
- `packages/styles/src/select.css` — the item recipes exemplar (selected
  indicator in focus blue, highlighted background, disabled ink).
- `apps/docs/src/components/menu-demo.tsx` — the compound docs pattern.
- `apps/docs/content/docs/meta.json` — `pages`:
  `["index", "accordion", "avatar", "button", "checkbox", "dialog", "field", "input", "label", "menu", "popover", "radio", "select", "separator", "slider", "switch", "tabs", "textarea", "toast", "tooltip"]`.

### ui-sdk Listbox facts (from `packages/react/node_modules/@ui-sdk/react/docs/components/listbox.md`)

- Import: `import { Listbox, ListboxGroup, ListboxGroupLabel, ListboxItem, ListboxItemIndicator, ListboxSeparator } from "@ui-sdk/react/listbox"`.
- Composition: `Listbox` (aria-label or Field label) → `ListboxItem`
  (unique `value`) → `ListboxItemIndicator` (shows its content when the
  option is selected). Groups and separators allowed INSIDE the list;
  buttons/search/empty messages stay outside.
- Item states: `data-selected`, `data-highlighted` (the item that has
  focus), `data-disabled` (can't be chosen but CAN be focused),
  `data-has-icon`.
- Root states: `data-orientation`, `data-disabled`, `data-readonly`,
  `data-required`, `data-has-icons`.
- `activation`: `"automatic"` (default — selection follows focus) vs
  `"manual"`; `deselectable`; `multiple` — behavior props, no styling.
- Indicator has `data-selected`/`data-unchecked`-like states
  (`data-selected` on the check inside).

### Design rules that bite (from `design/DESIGN.md`, `design/extraction/`)

- **Surface (inline)**: same recipe as the menu popup but in flow —
  background `var(--hashti-layer-01)`, border `1px solid
var(--hashti-border-subtle-00)`, `border-radius: var(--hashti-popover-radius)`
  (18px), `padding: 0` (zero-padding rule applies to listbox surfaces),
  NO shadow (inline surfaces don't float), `max-block-size` +
  `overflow-y: auto` for long lists (use `max-block-size: 20rem` — no
  `--available-height` here, that variable only exists on popups).
- **Items**: full-bleed like menu items — `min-block-size: 2.5rem;
padding: 0 0.75rem; display: flex; align-items: center; gap: 0.5rem;`
  text 0.875rem/400 ink `var(--hashti-text-primary)`, `cursor: default`,
  `outline: none` (review finding from cycle 19 — the highlight is the
  focus indicator; do NOT ship the browser default outline).
  - `[data-highlighted]` → background `var(--hashti-background-hover)`.
  - `[data-selected]` → the INDICATOR shows in `var(--hashti-focus)`; item
    ink stays.
  - `[data-disabled]` → ink `var(--hashti-text-disabled)`, highlight still
    allowed (it can be focused).
- **Indicator**: inline-flex, `margin-inline-start: auto` (pushes to the
  row end), sized 1rem, ink `var(--hashti-focus)` when
  `[data-selected]`; hidden otherwise (ui-sdk unmounts/hides — check which;
  if the indicator element stays mounted while unselected, add
  `visibility: hidden` on `:not([data-selected])`).
- **Separator**: `block-size: 1px`, background
  `var(--hashti-border-subtle-00)`, margin `0.25rem 0`.
- **Group label**: helper typography (0.8125rem), ink
  `var(--hashti-text-secondary)`, `padding: 0.375rem 0.75rem 0.25rem`.
- **Focus ring**: none on items (highlight). The list itself paints no ring.
- Colours only via `var(--hashti-*)`; a hex in component CSS is a bug.

## Commands you will need

| Purpose   | Command             | Expected on success |
| --------- | ------------------- | ------------------- |
| Install   | `bun install`       | exit 0              |
| Typecheck | `bun run typecheck` | exit 0, no errors   |

## Scope

**In scope** (the only files you should modify or create):

- `packages/react/src/listbox/listbox.tsx` — create
- `packages/react/src/listbox/index.ts` — create
- `packages/react/src/index.tsx` — add the re-export line
- `packages/styles/src/listbox.css` — create
- `packages/styles/index.css` — add one import line
- `apps/docs/src/components/listbox-demo.tsx` — create
- `apps/docs/content/docs/listbox.mdx` — create
- `apps/docs/content/docs/meta.json` — add `"listbox"` to `pages`

**Out of scope** (do NOT touch, even though they look related):

- `multiple`, `deselectable`, `manual` activation — behavior props that
  work through ui-sdk; no dedicated styling this cycle
- `ListboxItemIcon`, horizontal orientation — deferred
- Any lint/test infrastructure

## Git workflow

- Work on the branch checked out in your worktree (`particle/020-listbox`).
- Commit per logical step; plain imperative messages.
- Do NOT push, merge, or rebase.

## Steps

### Step 1: Create the Listbox wrappers in `@hashti/react`

`packages/react/src/listbox/listbox.tsx` — the `join` helper pattern;
parts and classes (direct-re-export check on the Listbox root):

| Part                   | Class                                                                 |
| ---------------------- | --------------------------------------------------------------------- |
| `Listbox`              | `hashti-listbox` (or direct re-export if the root takes no className) |
| `ListboxItem`          | `hashti-listbox-item`                                                 |
| `ListboxItemIndicator` | `hashti-listbox-item__indicator`                                      |
| `ListboxGroup`         | `hashti-listbox-group`                                                |
| `ListboxGroupLabel`    | `hashti-listbox__group-label`                                         |
| `ListboxSeparator`     | `hashti-listbox-separator`                                            |

Export all six from `./listbox` and the barrel.

**Verify**: `bun run typecheck` → exit 0.

### Step 2: Create the stylesheet and import it

`packages/styles/src/listbox.css` — write the rules from the design-rules
section above: surface (inline, zero padding, no shadow), items
(full-bleed, highlight/selected/disabled, outline: none), indicator,
separator, group label.

**Verify**: `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/listbox.css`
→ no matches; `grep -c "data-" packages/styles/src/listbox.css` → ≥ 5.

### Step 3: Docs demo component and page

`apps/docs/src/components/listbox-demo.tsx`:

```tsx
"use client";

import { Listbox, ListboxItem, ListboxItemIndicator } from "@hashti/react";

function Check() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path
        d="m3.5 8.5 3 3 6-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ListboxDemo() {
  return (
    <Listbox
      aria-label="Toppings"
      defaultValue="basil"
      style={{ maxWidth: 280 }}
    >
      <ListboxItem value="basil">
        Basil
        <ListboxItemIndicator>
          <Check />
        </ListboxItemIndicator>
      </ListboxItem>
      <ListboxItem value="olive">
        Olive
        <ListboxItemIndicator>
          <Check />
        </ListboxItemIndicator>
      </ListboxItem>
      <ListboxItem value="mushroom">
        Mushroom
        <ListboxItemIndicator>
          <Check />
        </ListboxItemIndicator>
      </ListboxItem>
    </Listbox>
  );
}
```

`apps/docs/content/docs/listbox.mdx`:

```mdx
---
title: Listbox
description: Selects one option from a visible list.
---

import { ListboxDemo } from "../../src/components/listbox-demo";

## Usage

<ListboxDemo client:load />

## Parts

| Part                                 | Purpose                                                              |
| ------------------------------------ | -------------------------------------------------------------------- |
| `Listbox`                            | Owns the selected value; name it with `aria-label` or a Field label. |
| `ListboxItem`                        | One option; a unique `value`.                                        |
| `ListboxItemIndicator`               | Shows its content on the selected option.                            |
| `ListboxGroup` / `ListboxGroupLabel` | Groups related options.                                              |
| `ListboxSeparator`                   | Divides options.                                                     |

Styling lives in `@hashti/styles` under `.hashti-listbox-*` — an 18px inline surface with full-bleed items, highlight on focus and a focus-blue check on the selection.
```

`apps/docs/content/docs/meta.json` — insert `"listbox"` after `"label"`.

**Verify**: `bun run typecheck` → exit 0.

## Test plan

No test runner exists in this repo; none is added by this plan. Verification
is: typecheck gates, the greps in Step 2, and the reviewer's rendered check
(inline surface with no shadow, arrow-key highlight, selection check in
focus blue, click selects, disabled ink, no default outline on items).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `bun run typecheck` exits 0 from the repo root
- [ ] `grep -rn "hashti-listbox" packages/react/src packages/styles/src`
      shows the wrapper classes and the stylesheet selectors
- [ ] `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/listbox.css` returns
      nothing
- [ ] `grep -n "listbox" packages/styles/index.css apps/docs/content/docs/meta.json`
      shows the import and the page entry
- [ ] `git status --porcelain` lists no files outside the in-scope list
- [ ] Work committed on the worktree branch, one commit per step

## STOP conditions

Stop and report back (do not improvise) if:

- Any of the six parts is not exported from `@ui-sdk/react/listbox` — quote
  the error.
- The indicator element stays mounted while unselected AND hiding it via
  CSS breaks selection — report what you found instead of improvising.
- A step's verification fails twice after a reasonable fix attempt.
- The fix appears to require touching an out-of-scope file.

## Maintenance notes

- After this cycle the core ui-sdk-backed component list is exhausted —
  the program reassesses (deferred Hashti-owned set: Kbd, Badge, Link,
  AvatarGroup/presence/getInitials, InputGroup/InputClear; plus deferred
  sub-features from earlier plans' Maintenance notes).
- The inline zero-padding surface recipe is shared with any future
  command palette or combobox listbox surface.
