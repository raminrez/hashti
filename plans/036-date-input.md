# Plan 036: DateInput — segmented date typing

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do not update `plans/README.md`; the reviewer
> maintains it.
>
> **Drift check (run first)**: `git diff --stat 1b75b41..HEAD -- packages apps/docs/content design`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW (group recipe again; segments are styled inputs)
- **Depends on**: plans/035-number-input (DONE)
- **Category**: migration (component build-out, cycle 36 — M batch)
- **Planned at**: commit `1b75b41`, 2026-11-20

## Why this matters

DateInput is the segmented date entry (type month/day/year in place) — the
input that DatePicker's field half reuses. Third consumer of the group
recipe.

## Current state

- `packages/styles/src/number-input.css` — the group recipe exemplar
  (grid/flex joined control, focus via `:has(:focus-visible)`,
  disabled/readonly on the group's data attributes).
- `apps/docs/content/docs/meta.json` — `pages`:
  `["index", "accordion", "avatar", "badge", "button", "checkbox", "collapsible", "dialog", "field", "hover-card", "input", "kbd", "label", "link", "listbox", "menu", "meter", "number-input", "password-input", "popover", "progress", "radio", "rating", "scroll-area", "segmented-control", "select", "separator", "slider", "switch", "tabs", "textarea", "timeline", "toast", "toggle", "tooltip"]`.

### ui-sdk DateInput facts (from `packages/react/node_modules/@ui-sdk/react/docs/components/date-input.md`)

- Import: `import { DateInput, DateInputSegment } from "@ui-sdk/react/date-input"` (verify exact exports).
- Composition: `DateInput` renders the segments ITSELF (one
  `DateInputSegment` per part + literal text between); render segments
  manually only for custom looks. The root takes `name`/`required`/
  `disabled` etc.
- Root states: `data-disabled`, `data-readonly`, `data-required`,
  `data-invalid` (before min/after max/unavailable), `data-empty`.
- Segment states: `data-type` (`year`|`month`|`day`|`hour`|`minute`|
  `second`|`dayPeriod`|`literal`), `data-empty` (shows placeholder),
  plus the shared four.
- Each typeable segment is a small input; literals are plain text.

### Design rules that bite (the group recipe, applied)

- **Root `hashti-date-input`**: the joined control — copy
  number-input's/password-input's group recipe: flex (or grid), 44px, 1px
  `--hashti-border-strong-01`, control radius, layer-01, overflow hidden,
  border-color transition.
- **Segments**: inline, no individual borders — `display: inline;
border: none; background: transparent; color: var(--hashti-text-primary);
font-size: 1rem; line-height: 1.5rem; text-align: center;
inline-size: auto;` width driven by content; `caret-color:
var(--hashti-focus)` optional (skip — keep minimal). padding `0 0.125rem`
  per segment.
  - `[data-empty]` → `color: var(--hashti-text-secondary);` (placeholder
    text comes from ui-sdk).
  - `:focus-visible` → subtle underline hint? NO — the group carries the
    ring via `:has(:focus-visible)` (2px @2px); segments get
    `outline: none` and a quiet `background: var(--hashti-background-hover)`
    while focused — actually keep it simplest: outline none, nothing else
    (the group ring is the affordance).
- **Literals** (`[data-type="literal"]`): plain text — ink
  `var(--hashti-text-secondary)`, no pointer events needed.
- **States on the root**: `[data-disabled]` → disabled recipe (copy);
  `[data-readonly]` → dashed + layer-02; `[data-invalid]` → border-color
  `var(--hashti-support-error)`.
- Colours only via `var(--hashti-*)`; a hex in component CSS is a bug.

## Commands you will need

| Purpose   | Command             | Expected on success |
| --------- | ------------------- | ------------------- |
| Install   | `bun install`       | exit 0              |
| Typecheck | `bun run typecheck` | exit 0, no errors   |

## Scope

**In scope** (the only files you should modify or create):

- `packages/react/src/date-input/date-input.tsx` — create
- `packages/react/src/date-input/index.ts` — create
- `packages/react/src/index.tsx` — add the re-export line
- `packages/styles/src/date-input.css` — create
- `packages/styles/index.css` — add one import line
- `apps/docs/src/components/date-input-demo.tsx` — create
- `apps/docs/content/docs/date-input.mdx` — create
- `apps/docs/content/docs/meta.json` — add `"date-input"` to `pages`

**Out of scope** (do NOT touch, even though they look related):

- Time segments styling beyond the generic segment rule — the `data-type`
  contract covers hour/minute/dayPeriod with the same rule; no dedicated
  time-input cycle needed unless asked
- DatePicker (calendar popup) — its own cycle
- Any lint/test infrastructure

## Git workflow

- Work on the branch checked out in your worktree
  (`particle/036-date-input`).
- Commit per logical step; plain imperative messages.
- Do NOT push, merge, or rebase.

## Steps

### Step 1: Create the DateInput wrappers in `@hashti/react`

`packages/react/src/date-input/date-input.tsx` — the `join` helper pattern
(direct-re-export check on the root; ui-sdk renders the segments itself,
so the wrapper set is likely just the root + segment):

| Part               | Class                        |
| ------------------ | ---------------------------- |
| `DateInput`        | `hashti-date-input`          |
| `DateInputSegment` | `hashti-date-input__segment` |

Export what exists from `./date-input` and the barrel (quote the actual
export list if it differs).

**Verify**: `bun run typecheck` → exit 0.

### Step 2: Create the stylesheet and import it

`packages/styles/src/date-input.css` — the design-rules section above.

**Verify**: `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/date-input.css`
→ no matches; `grep -c "data-" packages/styles/src/date-input.css` → ≥ 5.

### Step 3: Docs demo component and page

`apps/docs/src/components/date-input-demo.tsx`:

```tsx
"use client";

import { Field, FieldLabel } from "@hashti/react";
import { DateInput } from "@hashti/react";

export function DateInputDemo() {
  return (
    <Field name="delivery-date" style={{ maxWidth: 220 }}>
      <FieldLabel>Delivery date</FieldLabel>
      <DateInput required />
    </Field>
  );
}
```

(The root renders its own segments; nothing else goes inside.)

`apps/docs/content/docs/date-input.mdx`:

```mdx
---
title: DateInput
description: Types a date in place, segment by segment.
---

import { DateInputDemo } from "../../src/components/date-input-demo";

## Usage

<DateInputDemo client:load />

## Notes

The root renders its segments (month/day/year in the page's locale). Styling lives in `@hashti/styles` under `.hashti-date-input*` — one bordered field, empty segments in secondary ink, invalid border in error red.
```

`apps/docs/content/docs/meta.json` — insert `"date-input"` after
`"collapsible"` (alphabetical check against the live list).

**Verify**: `bun run typecheck` → exit 0.

## Test plan

No test runner exists in this repo; none is added by this plan. Verification
is: typecheck gates, the greps in Step 2, and the reviewer's rendered check
(type into segments, arrow between them, empty placeholder ink, group
ring, invalid border, disabled/readonly).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `bun run typecheck` exits 0 from the repo root
- [ ] `grep -rn "hashti-date-input" packages/react/src packages/styles/src`
      shows the wrapper classes and the stylesheet selectors
- [ ] `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/date-input.css`
      returns nothing
- [ ] `grep -n "date-input" packages/styles/index.css apps/docs/content/docs/meta.json`
      shows the import and the page entry
- [ ] `git status --porcelain` lists no files outside the in-scope list
- [ ] Work committed on the worktree branch, one commit per step

## STOP conditions

Stop and report back (do not improvise) if:

- Any part is not exported from `@ui-sdk/react/date-input` — quote the
  error.
- The root does NOT render its own segments (contradicting the docs) —
  report the actual composition.
- A step's verification fails twice after a reasonable fix attempt.
- The fix appears to require touching an out-of-scope file.

## Maintenance notes

- DatePicker reuses this field half + a calendar popup.
- The group recipe now has three consumers (Password, Number, Date) —
  after the batch, consider whether a shared `.hashti-fieldbox` class is
  worth it (deferred decision, do NOT refactor this cycle).
