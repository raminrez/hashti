# Plan 049: Autocomplete — suggest list over a free-text field

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do not update `plans/README.md`; the reviewer
> maintains it.
>
> **Drift check (run first)**: `git diff --stat 80bfbde..HEAD -- packages apps/docs/content design`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW (Combobox's twin — same recipes, free-text semantics)
- **Depends on**: plans/048-combobox-chips (DONE)
- **Category**: migration (component build-out, cycle 49 — L batch)
- **Planned at**: commit `80bfbde`, 2026-11-20

## Why this matters

Autocomplete is the suggest list over a free-text field. Same popup and
item recipes as Combobox; the value is text, not an option reference.

## Current state

- `packages/styles/src/combobox.css` — the input + popup + item recipes;
  copy and rename.
- `packages/react/src/combobox/combobox.tsx` — the wrapper exemplar
  (including the chips parts' direct-re-export pattern).
- `apps/docs/content/docs/meta.json` — `pages`:
  `["index", "accordion", "alert-dialog", "avatar", "badge", "button", "carousel", "checkbox", "collapsible", "combobox", "date-input", "dialog", "drawer", "field", "file-input", "hover-card", "input", "kbd", "label", "link", "listbox", "menu", "menubar", "meter", "number-input", "pagination", "password-input", "popover", "progress", "radio", "rating", "resizable", "scroll-area", "segmented-control", "select", "separator", "slider", "switch", "tabs", "textarea", "time-input", "timeline", "toast", "toolbar", "toggle", "tooltip", "trigger-menu"]`.

### ui-sdk Autocomplete facts (from `packages/react/node_modules/@ui-sdk/react/docs/components/autocomplete.md`)

- Import: `import { Autocomplete, AutocompleteContent, AutocompleteEmpty, AutocompleteInput, AutocompleteItem, AutocompleteLabel, AutocompleteList } from "@ui-sdk/react/autocomplete"` (verify).
- Composition: `Autocomplete` → (`AutocompleteLabel`,
  `AutocompleteInput`, `AutocompleteContent` → (`AutocompleteEmpty`,
  `AutocompleteList` → `AutocompleteItem`+)).
- States mirror Combobox: input `data-open`/`data-closed` + shared four;
  items presumably `data-highlighted`/`data-selected` — verify in Data
  Attributes.
- `Empty` shows while no item matches (`data-empty` on it).

### Design rules that bite

- Copy `combobox.css` wholesale, rename `combobox` → `autocomplete`,
  EXCEPT: no chips block (autocomplete is single free-text).
- The Empty state: helper typography, secondary ink, `0.5rem 0.75rem`
  padding — same as menu.css's empty recipe.
- Colours only via `var(--hashti-*)`; a hex in component CSS is a bug.

## Commands you will need

| Purpose   | Command               | Expected on success |
| --------- | --------------------- | ------------------- |
| Install   | `bun install`         | exit 0              |
| Typecheck | `bun run typecheck`   | exit 0, no errors   |

## Scope

**In scope** (the only files you should modify or create):

- `packages/react/src/autocomplete/autocomplete.tsx` — create
- `packages/react/src/autocomplete/index.ts` — create
- `packages/react/src/index.tsx` — add the re-export line
- `packages/styles/src/autocomplete.css` — create
- `packages/styles/index.css` — add one import line
- `apps/docs/src/components/autocomplete-demo.tsx` — create
- `apps/docs/content/docs/autocomplete.mdx` — create
- `apps/docs/content/docs/meta.json` — add `"autocomplete"` to `pages`

**Out of scope** (do NOT touch, even though they look related):

- Inline completion (ghost text), auto-highlight — deferred
- Clear/Trigger buttons — deferred
- Any lint/test infrastructure

## Git workflow

- Work on the branch checked out in your worktree
  (`particle/049-autocomplete`).
- Commit per logical step; plain imperative messages.
- Do NOT push, merge, or rebase.

## Steps

### Step 1: Create the Autocomplete wrappers in `@hashti/react`

`packages/react/src/autocomplete/autocomplete.tsx` — the `join` helper
pattern (direct-re-export checks per part; the combobox precedent
applies):

| Part | Class |
| --- | --- |
| `Autocomplete` | `hashti-autocomplete` (or direct re-export) |
| `AutocompleteLabel` | `hashti-autocomplete__label` |
| `AutocompleteInput` | `hashti-autocomplete-input` |
| `AutocompleteContent` | `hashti-autocomplete-content` |
| `AutocompleteList` | `hashti-autocomplete-list` |
| `AutocompleteItem` | `hashti-autocomplete-item` |
| `AutocompleteEmpty` | `hashti-autocomplete-empty` |

Export all from `./autocomplete` and the barrel.

**Verify**: `bun run typecheck` → exit 0.

### Step 2: Create the stylesheet and import it

`packages/styles/src/autocomplete.css` — the renamed copy + Empty rule.

**Verify**: `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/autocomplete.css`
→ no matches; `grep -c "data-" packages/styles/src/autocomplete.css` →
≥ 4.

### Step 3: Docs demo component and page

`apps/docs/src/components/autocomplete-demo.tsx`:

```tsx
"use client"

import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteLabel,
  AutocompleteList,
} from "@hashti/react"

const cities = ["Amsterdam", "Berlin", "Copenhagen", "Lisbon", "Paris"]

export function AutocompleteDemo() {
  return (
    <Autocomplete style={{ maxWidth: 320 }}>
      <AutocompleteLabel>City</AutocompleteLabel>
      <AutocompleteInput placeholder="Start typing a city…" />
      <AutocompleteContent>
        <AutocompleteList>
          {cities.map((c) => (
            <AutocompleteItem key={c} value={c}>{c}</AutocompleteItem>
          ))}
        </AutocompleteList>
        <AutocompleteEmpty>No city matches.</AutocompleteEmpty>
      </AutocompleteContent>
    </Autocomplete>
  )
}
```

`apps/docs/content/docs/autocomplete.mdx`:

```mdx
---
title: Autocomplete
description: Suggests completions while you type.
---

import { AutocompleteDemo } from '../../src/components/autocomplete-demo'

## Usage

<AutocompleteDemo client:load />

## Parts

| Part | Purpose |
| --- | --- |
| `Autocomplete` | Owns the query. |
| `AutocompleteInput` | The free-text field. |
| `AutocompleteContent` / `AutocompleteList` | The anchored popup. |
| `AutocompleteItem` | One suggestion. |
| `AutocompleteEmpty` | Shows when nothing matches. |

Styling lives in `@hashti/styles` under `.hashti-autocomplete*` — a field input with the combobox popup surface.
```

`apps/docs/content/docs/meta.json` — insert `"autocomplete"` after
`"alert-dialog"` (alphabetical check against the live list).

**Verify**: `bun run typecheck` → exit 0.

## Test plan

No test runner exists in this repo; none is added by this plan. Verification
is: typecheck gates, the greps in Step 2, and the reviewer's rendered check
(type filters, popup geometry, highlight, Enter commits the value as text,
empty state, Escape).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `bun run typecheck` exits 0 from the repo root
- [ ] `grep -rn "hashti-autocomplete" packages/react/src packages/styles/src`
  shows the wrapper classes and the stylesheet selectors
- [ ] `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/autocomplete.css`
  returns nothing
- [ ] `grep -n "autocomplete" packages/styles/index.css apps/docs/content/docs/meta.json`
  shows the import and the page entry
- [ ] `git status --porcelain` lists no files outside the in-scope list
- [ ] Work committed on the worktree branch, one commit per step

## STOP conditions

Stop and report back (do not improvise) if:

- Any part is not exported from `@ui-sdk/react/autocomplete` — quote the
  error.
- A step's verification fails twice after a reasonable fix attempt.
- The fix appears to require touching an out-of-scope file.

## Maintenance notes

- Inline completion (ghost text) lands later — it styles text in the
  input, not the popup.
