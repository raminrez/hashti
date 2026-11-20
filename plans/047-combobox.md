# Plan 047: Combobox — editable input + filtered options

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do not update `plans/README.md`; the reviewer
> maintains it.
>
> **Drift check (run first)**: `git diff --stat 18dbb90..HEAD -- packages apps/docs/content design`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW (recipes all exist: Select's popup, TriggerMenu's item
  list, Input's field)
- **Depends on**: plans/046-trigger-menu (DONE)
- **Category**: migration (component build-out, cycle 47 — L batch)
- **Planned at**: commit `18dbb90`, 2026-11-20

## Why this matters

Combobox is the editable filter-and-pick input. Core single-select this
cycle; multiple-with-chips is the flagship follow-up the program brief
names.

## Current state

- `packages/styles/src/trigger-menu.css` — the newest exemplar (input +
  popup recipes, data-slot keying where needed).
- `packages/styles/src/select.css` — the popup surface + item recipes
  (anchor width, height clamp).
- `apps/docs/content/docs/meta.json` — `pages`:
  `["index", "accordion", "alert-dialog", "avatar", "badge", "button", "carousel", "checkbox", "collapsible", "date-input", "dialog", "drawer", "field", "file-input", "hover-card", "input", "kbd", "label", "link", "listbox", "menu", "menubar", "meter", "number-input", "pagination", "password-input", "popover", "progress", "radio", "rating", "resizable", "scroll-area", "segmented-control", "select", "separator", "slider", "switch", "tabs", "textarea", "time-input", "timeline", "toast", "toolbar", "toggle", "tooltip", "trigger-menu"]`.

### ui-sdk Combobox facts (from `packages/react/node_modules/@ui-sdk/react/docs/components/combobox.md`)

- Import: `import { Combobox, ComboboxContent, ComboboxInput, ComboboxItem, ComboboxLabel, ComboboxList } from "@ui-sdk/react/combobox"` (verify; `ComboboxTrigger`, `ComboboxClear`, `ComboboxChips` exist — chips deferred).
- Composition: `Combobox` → (`ComboboxLabel`, `ComboboxInput`,
  `ComboboxContent` → `ComboboxList` → `ComboboxItem`+).
- Input states: `data-open`/`data-closed` + shared four. Item states:
  check the docs' Data Attributes for ComboboxItem (`data-selected`,
  `data-highlighted` presumably).
- The popup is anchored to the input like Select's.

### Design rules that bite (Select + TriggerMenu composition)

- **Input `hashti-combobox-input`**: the `.hashti-input` recipe (44px,
  1px strong border, control radius, layer-01, placeholder secondary,
  ring 2px@2px on `:focus-visible`).
- **Content `hashti-combobox-content`**: Select's popup surface — 18px
  radius, layer-01, subtle border, popover shadow, 4px padding,
  `min-inline-size: var(--anchor-width)`, `max-block-size:
var(--available-height); overflow-y: auto`.
- **List**: `display: grid; gap: 0.125rem; padding: 0;` reset.
- **Items**: Select's item recipe — 40px, `0 0.75rem`, 8px inner radius
  (Select items float in padding, unlike Menu's full-bleed), highlighted
  = background-hover (outline none!), selected = focus-blue indicator,
  disabled = disabled ink.
- **Clear/Trigger**: deferred (no styling this cycle).
- Colours only via `var(--hashti-*)`; a hex in component CSS is a bug.

## Commands you will need

| Purpose   | Command             | Expected on success |
| --------- | ------------------- | ------------------- |
| Install   | `bun install`       | exit 0              |
| Typecheck | `bun run typecheck` | exit 0, no errors   |

## Scope

**In scope** (the only files you should modify or create):

- `packages/react/src/combobox/combobox.tsx` — create
- `packages/react/src/combobox/index.ts` — create
- `packages/react/src/index.tsx` — add the re-export line
- `packages/styles/src/combobox.css` — create
- `packages/styles/index.css` — add one import line
- `apps/docs/src/components/combobox-demo.tsx` — create
- `apps/docs/content/docs/combobox.mdx` — create
- `apps/docs/content/docs/meta.json` — add `"combobox"` to `pages`

**Out of scope** (do NOT touch, even though they look related):

- `multiple`/chips — the NEXT cycle (the program brief's flagship
  feature)
- `ComboboxClear`, `ComboboxTrigger` styling, auto-highlight,
  highlight-matches — deferred
- Any lint/test infrastructure

## Git workflow

- Work on the branch checked out in your worktree
  (`particle/047-combobox`).
- Commit per logical step; plain imperative messages.
- Do NOT push, merge, or rebase.

## Steps

### Step 1: Create the Combobox wrappers in `@hashti/react`

`packages/react/src/combobox/combobox.tsx` — the `join` helper pattern
(direct-re-export check on the root; check class landing per part —
cycle-36 lesson):

| Part              | Class                                   |
| ----------------- | --------------------------------------- |
| `Combobox`        | `hashti-combobox` (or direct re-export) |
| `ComboboxLabel`   | `hashti-combobox__label`                |
| `ComboboxInput`   | `hashti-combobox-input`                 |
| `ComboboxContent` | `hashti-combobox-content`               |
| `ComboboxList`    | `hashti-combobox-list`                  |
| `ComboboxItem`    | `hashti-combobox-item`                  |

Export all from `./combobox` and the barrel.

**Verify**: `bun run typecheck` → exit 0.

### Step 2: Create the stylesheet and import it

`packages/styles/src/combobox.css` — the design-rules section above.

**Verify**: `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/combobox.css`
→ no matches; `grep -c "data-" packages/styles/src/combobox.css` →
≥ 4.

### Step 3: Docs demo component and page

`apps/docs/src/components/combobox-demo.tsx`:

```tsx
"use client";

import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
} from "@hashti/react";

const roles = ["Viewer", "Editor", "Admin"];

export function ComboboxDemo() {
  return (
    <Combobox style={{ maxWidth: 320 }}>
      <ComboboxLabel>Role</ComboboxLabel>
      <ComboboxInput placeholder="Pick or type a role…" />
      <ComboboxContent>
        <ComboboxList>
          {roles.map((r) => (
            <ComboboxItem key={r} value={r}>
              {r}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
```

(If the items need `items`-as-data on the root to render before open,
follow the docs and note it.)

`apps/docs/content/docs/combobox.mdx`:

```mdx
---
title: Combobox
description: Picks an option from a filterable list.
---

import { ComboboxDemo } from "../../src/components/combobox-demo";

## Usage

<ComboboxDemo client:load />

## Parts

| Part                               | Purpose                       |
| ---------------------------------- | ----------------------------- |
| `Combobox`                         | Owns the value and filtering. |
| `ComboboxInput`                    | The editable field.           |
| `ComboboxContent` / `ComboboxList` | The anchored popup.           |
| `ComboboxItem`                     | One option.                   |

Styling lives in `@hashti/styles` under `.hashti-combobox*` — a field input with Select's popup surface and items.
```

`apps/docs/content/docs/meta.json` — insert `"combobox"` after
`"collapsible"` (alphabetical check against the live list).

**Verify**: `bun run typecheck` → exit 0.

## Test plan

No test runner exists in this repo; none is added by this plan. Verification
is: typecheck gates, the greps in Step 2, and the reviewer's rendered check
(type filters the list, popup geometry, item highlight/selection, Escape,
focus ring).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `bun run typecheck` exits 0 from the repo root
- [ ] `grep -rn "hashti-combobox" packages/react/src packages/styles/src`
      shows the wrapper classes and the stylesheet selectors
- [ ] `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/combobox.css`
      returns nothing
- [ ] `grep -n "combobox" packages/styles/index.css apps/docs/content/docs/meta.json`
      shows the import and the page entry
- [ ] `git status --porcelain` lists no files outside the in-scope list
- [ ] Work committed on the worktree branch, one commit per step

## STOP conditions

Stop and report back (do not improvise) if:

- Any part is not exported from `@ui-sdk/react/combobox` — quote the
  error.
- A step's verification fails twice after a reasonable fix attempt.
- The fix appears to require touching an out-of-scope file.

## Maintenance notes

- Multiple-with-chips is the next cycle — the `ComboboxChips` part is
  reserved in the class contract (`hashti-combobox-chips`).
- Clear button and auto-highlight land later.
