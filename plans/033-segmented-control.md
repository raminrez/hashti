# Plan 033: SegmentedControl — sliding indicator, joined segments

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do not update `plans/README.md`; the reviewer
> maintains it.
>
> **Drift check (run first)**: `git diff --stat be4c3ce..HEAD -- packages apps/docs/content design`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW (indicator recipe proven in Tabs)
- **Depends on**: plans/032-rating (DONE)
- **Category**: migration (component build-out, cycle 33 — M batch)
- **Planned at**: commit `be4c3ce`, 2026-11-20

## Why this matters

SegmentedControl is the joined-choice row (the old system's content
switcher). The indicator recipe is Tabs' proven one, now behind the
segments instead of under them.

## Current state

- `packages/styles/src/tabs.css` — the indicator exemplar (variables +
  ladder transition + `none` skip).
- `packages/react/src/tabs/tabs.tsx` — the wrapper exemplar.
- `apps/docs/content/docs/meta.json` — `pages`:
  `["index", "accordion", "avatar", "badge", "button", "checkbox", "collapsible", "dialog", "field", "hover-card", "input", "kbd", "label", "link", "listbox", "menu", "meter", "popover", "progress", "radio", "rating", "scroll-area", "select", "separator", "slider", "switch", "tabs", "textarea", "timeline", "toast", "toggle", "tooltip"]`.

### ui-sdk SegmentedControl facts (from `packages/react/node_modules/@ui-sdk/react/docs/components/segmented-control.md`)

- Import: `import { SegmentedControl, SegmentedControlIndicator, SegmentedControlItem } from "@ui-sdk/react/segmented-control"`.
- Composition: `SegmentedControl` (radiogroup; `value`) →
  (`SegmentedControlIndicator` FIRST — it sits behind the items,
  `SegmentedControlItem`+ each with `value`).
- Indicator variables: `--segmented-control-indicator-top/left/width/height`;
  skip transitions while its `data-activation-direction="none"`.
- Item states: `data-checked`/`data-unchecked`, `data-disabled`,
  `data-readonly`; root: `data-orientation`, `data-readonly`,
  `data-required`, `data-disabled`.

### Design rules that bite (from the old content-switcher, tokenized)

- **Control (the joined well)**: `display: inline-flex; padding: 0.1875rem;
  gap: 0.125rem; min-block-size: 2.5rem; background:
  var(--hashti-layer-03); border: 1px solid var(--hashti-border-subtle-00);
  border-radius: var(--hashti-control-radius); position: relative;
  isolation: isolate;`
- **Indicator (the sliding chip)**: absolute, `z-index: -1` (behind
  items), positioned from the four ui-sdk variables,
  `background: var(--hashti-layer-01); border-radius: calc(var(--hashti-control-radius) - 0.1875rem);`
  (the chip's radius is the well's minus its padding), shadow
  `0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08)` — quote
  the old chip shadow verbatim with a comment (small elevation stack, no
  single token), transition on the four properties
  `var(--hashti-duration-moderate-01) cubic-bezier(0.16, 1, 0.3, 1)`,
  `[data-activation-direction="none"] { transition: none; }`.
- **Items**: `flex: 1 1 0; min-inline-size: 0; display: inline-flex;
  align-items: center; justify-content: center; padding: 0 0.75rem;
  border: none; background: transparent; color: var(--hashti-text-secondary);
  font-size: 0.875rem; font-weight: 500; cursor: pointer;
  white-space: nowrap;` (items stretch equally; text truncates with
  ellipsis if narrow).
  - `[data-checked]` → color `var(--hashti-text-primary); font-weight: 600;`
  - hover (unchecked, `(hover: hover)`) → color darkens only — no
    background (the well is behind).
  - `[data-disabled]` → ink `var(--hashti-text-disabled)`, cursor
    not-allowed.
- **Focus**: items are radios — ring the focused item INSET (the well
  frame would clip an outside ring): 2px `var(--hashti-focus)`, offset
  -2px, `:focus-visible` (the old system's inset ring on switcher items).
- Colours only via `var(--hashti-*)` except the quoted chip shadow.

## Commands you will need

| Purpose   | Command               | Expected on success |
| --------- | --------------------- | ------------------- |
| Install   | `bun install`         | exit 0              |
| Typecheck | `bun run typecheck`   | exit 0, no errors   |

## Scope

**In scope** (the only files you should modify or create):

- `packages/react/src/segmented-control/segmented-control.tsx` — create
- `packages/react/src/segmented-control/index.ts` — create
- `packages/react/src/index.tsx` — add the re-export line
- `packages/styles/src/segmented-control.css` — create
- `packages/styles/index.css` — add one import line
- `apps/docs/src/components/segmented-control-demo.tsx` — create
- `apps/docs/content/docs/segmented-control.mdx` — create
- `apps/docs/content/docs/meta.json` — add `"segmented-control"` to `pages`

**Out of scope** (do NOT touch, even though they look related):

- Vertical orientation styling — deferred
- Any lint/test infrastructure

## Git workflow

- Work on the branch checked out in your worktree
  (`particle/033-segmented-control`).
- Commit per logical step; plain imperative messages.
- Do NOT push, merge, or rebase.

## Steps

### Step 1: Create the SegmentedControl wrappers in `@hashti/react`

`packages/react/src/segmented-control/segmented-control.tsx` — the `join`
helper pattern (direct-re-export check on the root):

| Part | Class |
| --- | --- |
| `SegmentedControl` | `hashti-segmented-control` |
| `SegmentedControlIndicator` | `hashti-segmented-control-indicator` |
| `SegmentedControlItem` | `hashti-segmented-control-item` |

Export all three from `./segmented-control` and the barrel.

**Verify**: `bun run typecheck` → exit 0.

### Step 2: Create the stylesheet and import it

`packages/styles/src/segmented-control.css` — the design-rules section
above.

**Verify**: `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/segmented-control.css`
→ no matches; `grep -c "segmented-control-indicator"
packages/styles/src/segmented-control.css` → ≥ 5 (the four variables +
the element).

### Step 3: Docs demo component and page

`apps/docs/src/components/segmented-control-demo.tsx`:

```tsx
"use client"

import { useState } from "react"
import { SegmentedControl, SegmentedControlIndicator, SegmentedControlItem } from "@hashti/react"

export function SegmentedControlDemo() {
  const [view, setView] = useState("day")
  return (
    <SegmentedControl value={view} onChange={setView} aria-label="Calendar view" style={{ width: 320 }}>
      <SegmentedControlIndicator />
      <SegmentedControlItem value="day">Day</SegmentedControlItem>
      <SegmentedControlItem value="week">Week</SegmentedControlItem>
      <SegmentedControlItem value="month">Month</SegmentedControlItem>
    </SegmentedControl>
  )
}
```

(If the controlled props differ (`defaultValue`, `onValueChange`), use the
docs' Controlled section's names and note it.)

`apps/docs/content/docs/segmented-control.mdx`:

```mdx
---
title: SegmentedControl
description: Switches between exclusive views.
---

import { SegmentedControlDemo } from '../../src/components/segmented-control-demo'

## Usage

<SegmentedControlDemo client:load />

## Parts

| Part | Purpose |
| --- | --- |
| `SegmentedControl` | The radiogroup well. |
| `SegmentedControlIndicator` | The chip that slides behind the checked item. |
| `SegmentedControlItem` | One exclusive choice. |

Styling lives in `@hashti/styles` under `.hashti-segmented-control*` — a layered well with a sliding white chip and inset focus rings.
```

`apps/docs/content/docs/meta.json` — insert `"segmented-control"` after
`"scroll-area"`.

**Verify**: `bun run typecheck` → exit 0.

## Test plan

No test runner exists in this repo; none is added by this plan. Verification
is: typecheck gates, the greps in Step 2, and the reviewer's rendered check
(chip slides with motion on click and arrow keys, sits behind the item
text, chip radius matches the well, inset focus ring, checked ink/weight,
no slide on first paint).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `bun run typecheck` exits 0 from the repo root
- [ ] `grep -rn "hashti-segmented-control" packages/react/src packages/styles/src`
  shows the wrapper classes and the stylesheet selectors
- [ ] `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/segmented-control.css`
  returns nothing
- [ ] `grep -n "segmented" packages/styles/index.css apps/docs/content/docs/meta.json`
  shows the import and the page entry
- [ ] `git status --porcelain` lists no files outside the in-scope list
- [ ] Work committed on the worktree branch, one commit per step

## STOP conditions

Stop and report back (do not improvise) if:

- Any of the three parts is not exported from
  `@ui-sdk/react/segmented-control` — quote the error.
- The indicator variables do not resolve — quote what you found.
- A step's verification fails twice after a reasonable fix attempt.
- The fix appears to require touching an out-of-scope file.

## Maintenance notes

- Vertical orientation and the `data-orientation` variants land later.
- The well+chip recipe may feed a joined toggle group variant later.
