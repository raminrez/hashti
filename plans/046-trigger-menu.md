# Plan 046: TriggerMenu — the suggest popup (mentions, commands)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do not update `plans/README.md`; the reviewer
> maintains it.
>
> **Drift check (run first)**: `git diff --stat 0986dd8..HEAD -- packages apps/docs/content design`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED (the input and the popup both need the group treatment;
  cycle-36's data-slot lesson likely applies)
- **Depends on**: plans/045-menubar (DONE)
- **Category**: migration (component build-out, cycle 46 — M batch)
- **Planned at**: commit `0986dd8`, 2026-11-20

## Why this matters

TriggerMenu is the suggest popup — `@` mentions and `/` commands in a
text field. It's the interaction Combobox/Command build on.

## Current state

- `packages/styles/src/menu.css` — the item recipes (highlighted,
  disabled, group label).
- `packages/styles/src/date-input.css` — the data-slot-keying lesson:
  check which parts carry their own class vs ui-sdk-rendered.
- `apps/docs/content/docs/meta.json` — `pages`:
  `["index", "accordion", "alert-dialog", "avatar", "badge", "button", "carousel", "checkbox", "collapsible", "date-input", "dialog", "drawer", "field", "file-input", "hover-card", "input", "kbd", "label", "link", "listbox", "menu", "menubar", "meter", "number-input", "pagination", "password-input", "popover", "progress", "radio", "rating", "resizable", "scroll-area", "segmented-control", "select", "separator", "slider", "switch", "tabs", "textarea", "time-input", "timeline", "toast", "toolbar", "toggle", "tooltip"]`.

### ui-sdk TriggerMenu facts (from `packages/react/node_modules/@ui-sdk/react/docs/components/trigger-menu.md`)

- Import: `import { TriggerMenu, TriggerMenuContent, TriggerMenuEmpty, TriggerMenuInput, TriggerMenuItem, TriggerMenuList, TriggerMenuStatus } from "@ui-sdk/react/trigger-menu"` (verify).
- Composition: `TriggerMenu` (holds triggers + what each lists; `items`
  as data) → (`TriggerMenuInput` — the field, `TriggerMenuStatus`,
  `TriggerMenuContent` → `TriggerMenuList` → `TriggerMenuItem`+,
  `TriggerMenuEmpty`). Without a Content child, the menu renders the
  items for you (then styling keys on data-slot — the cycle-36 lesson).
- Input states: `data-open`/`data-closed`, `data-trigger` (the current
  match's trigger like `@`).
- Content states: `data-open`, starting/ending, `data-side`, `data-align`,
  `data-trigger`, `data-has-icons`.
- Item states: `data-highlighted` (focus STAYS in the field — items are
  highlighted, never focused), `data-disabled`, `data-has-icon`.
- Empty: `data-empty` (no match), `data-loading`.

### Design rules that bite (menu items in a group field)

- **Input `hashti-trigger-menu-input`**: the `.hashti-input` recipe
  (44px, 1px strong border, control radius, layer-01, ring @2px) — copy
  input.css's rules under the new class (or extend the same declarations).
  `[data-open]` → keep the ring as the affordance (no extra border
  change).
- **Content `hashti-trigger-menu-content`**: the menu surface recipe —
  copy menu.css's content rule (18px, zero padding, popover shadow,
  anchor width NOT needed — the popup floats at the caret; use a sensible
  `min-inline-size: 12rem; max-block-size: var(--available-height);
  overflow-y: auto` — `--available-height` exists here like Select).
- **Items**: menu.css's item recipe via data-slot keying
  (`[data-slot='trigger-menu-item']`) if the class cannot land — CHECK
  the rendered DOM first and prefer the wrapper class when it does land.
  Full-bleed, 40px, highlight = background-hover, outline none.
- **Empty**: helper typography, secondary ink, `0.5rem 0.75rem` padding;
  `[data-loading]` → same box (a spinner is deferred).
- **Status**: helper typography inline in the field (deferred styling —
  class only).
- Colours only via `var(--hashti-*)`; a hex in component CSS is a bug.

## Commands you will need

| Purpose   | Command               | Expected on success |
| --------- | --------------------- | ------------------- |
| Install   | `bun install`         | exit 0              |
| Typecheck | `bun run typecheck`   | exit 0, no errors   |

## Scope

**In scope** (the only files you should modify or create):

- `packages/react/src/trigger-menu/trigger-menu.tsx` — create
- `packages/react/src/trigger-menu/index.ts` — create
- `packages/react/src/index.tsx` — add the re-export line
- `packages/styles/src/trigger-menu.css` — create
- `packages/styles/index.css` — add one import line
- `apps/docs/src/components/trigger-menu-demo.tsx` — create
- `apps/docs/content/docs/trigger-menu.mdx` — create
- `apps/docs/content/docs/meta.json` — add `"trigger-menu"` to `pages`

**Out of scope** (do NOT touch, even though they look related):

- Icons in items, loading spinner, commands-with-arguments demo —
  deferred
- Token Input integration — its own cycle
- Any lint/test infrastructure

## Git workflow

- Work on the branch checked out in your worktree
  (`particle/046-trigger-menu`).
- Commit per logical step; plain imperative messages.
- Do NOT push, merge, or rebase.

## Steps

### Step 1: Create the TriggerMenu wrappers in `@hashti/react`

`packages/react/src/trigger-menu/trigger-menu.tsx` — the `join` helper
pattern (direct-re-export check on the root; verify per-part class
landing):

| Part | Class |
| --- | --- |
| `TriggerMenu` | `hashti-trigger-menu` (or direct re-export) |
| `TriggerMenuInput` | `hashti-trigger-menu-input` |
| `TriggerMenuStatus` | `hashti-trigger-menu__status` |
| `TriggerMenuContent` | `hashti-trigger-menu-content` |
| `TriggerMenuList` | `hashti-trigger-menu-list` |
| `TriggerMenuItem` | `hashti-trigger-menu-item` (or data-slot keyed) |
| `TriggerMenuEmpty` | `hashti-trigger-menu-empty` (or data-slot keyed) |

Export all from `./trigger-menu` and the barrel.

**Verify**: `bun run typecheck` → exit 0.

### Step 2: Create the stylesheet and import it

`packages/styles/src/trigger-menu.css` — the design-rules section above;
key items/empty on data-slot if their classes don't land (say so either
way).

**Verify**: `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/trigger-menu.css`
→ no matches; `grep -c "data-" packages/styles/src/trigger-menu.css` →
≥ 6.

### Step 3: Docs demo component and page

`apps/docs/src/components/trigger-menu-demo.tsx`:

```tsx
"use client"

import { TriggerMenu, TriggerMenuContent, TriggerMenuInput } from "@hashti/react"

const people = ["Hollis Vance", "Priya Nair", "Tom Okafor", "Lena Fischer"]

export function TriggerMenuDemo() {
  return (
    <TriggerMenu items={people} style={{ maxWidth: 320 }}>
      <TriggerMenuInput placeholder="Mention someone with @…" aria-label="Message" />
      <TriggerMenuContent />
    </TriggerMenu>
  )
}
```

(Read the docs' Usage + Triggers as Data sections for the exact props —
the template above is indicative; fix prop names and note what you
shipped. No content children means ui-sdk renders the items.)

`apps/docs/content/docs/trigger-menu.mdx`:

```mdx
---
title: TriggerMenu
description: Suggests items as you type a trigger.
---

import { TriggerMenuDemo } from '../../src/components/trigger-menu-demo'

## Usage

<TriggerMenuDemo client:load />

## Notes

Type `@` to open the suggest popup; arrow keys highlight, Enter picks, focus stays in the field. Styling lives in `@hashti/styles` under `.hashti-trigger-menu*` — a field input with the menu popup at the caret.
```

`apps/docs/content/docs/meta.json` — insert `"trigger-menu"` after
`"toolbar"`.

**Verify**: `bun run typecheck` → exit 0.

## Test plan

No test runner exists in this repo; none is added by this plan. Verification
is: typecheck gates, the greps in Step 2, and the reviewer's rendered check
(type `@` → popup opens with items, arrows highlight with focus in the
field, Enter inserts, empty state, Escape closes).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `bun run typecheck` exits 0 from the repo root
- [ ] `grep -rn "hashti-trigger-menu" packages/react/src packages/styles/src`
  shows the wrapper classes and the stylesheet selectors
- [ ] `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/trigger-menu.css`
  returns nothing
- [ ] `grep -n "trigger-menu" packages/styles/index.css apps/docs/content/docs/meta.json`
  shows the import and the page entry
- [ ] `git status --porcelain` lists no files outside the in-scope list
- [ ] Work committed on the worktree branch, one commit per step

## STOP conditions

Stop and report back (do not improvise) if:

- Any part is not exported from `@ui-sdk/react/trigger-menu` — quote the
  error.
- The items-as-data composition cannot render items without a Content
  child (contradicting the docs) — report what you found.
- A step's verification fails twice after a reasonable fix attempt.
- The fix appears to require touching an out-of-scope file.

## Maintenance notes

- Combobox/Command/TokenInput build on this shape — keep the CSS honest.
- Icons and loading spinners land later.
