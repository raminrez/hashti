# Plan 038: TimeInput — segmented time typing

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do not update `plans/README.md`; the reviewer
> maintains it.
>
> **Drift check (run first)**: `git diff --stat 6ef9850..HEAD -- packages apps/docs/content design`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW (DateInput's twin — copy its stylesheet and rename)
- **Depends on**: plans/037-file-input (DONE)
- **Category**: migration (component build-out, cycle 38 — M batch)
- **Planned at**: commit `6ef9850`, 2026-11-20

## Why this matters

TimeInput is DateInput's twin for clock times. Same group recipe, same
segment contract with `hour/minute/second/dayPeriod` types.

## Current state

- `packages/styles/src/date-input.css` — the segment recipe exemplar,
  INCLUDING the cycle-36 lesson: segments are keyed on the ROOT +
  `data-slot='date-input-segment'` because ui-sdk renders them itself.
  Copy and rename to `data-slot='time-input-segment'`.
- `packages/react/src/date-input/date-input.tsx` — the wrapper exemplar.
- `apps/docs/content/docs/meta.json` — `pages`:
  `["index", "accordion", "avatar", "badge", "button", "checkbox", "collapsible", "date-input", "dialog", "field", "file-input", "hover-card", "input", "kbd", "label", "link", "listbox", "menu", "meter", "number-input", "password-input", "popover", "progress", "radio", "rating", "scroll-area", "segmented-control", "select", "separator", "slider", "switch", "tabs", "textarea", "timeline", "toast", "toggle", "tooltip"]`.

### ui-sdk TimeInput facts (from `packages/react/node_modules/@ui-sdk/react/docs/components/time-input.md`)

- Import: `import { TimeInput, TimeInputSegment } from "@ui-sdk/react/time-input"` (verify).
- Composition: `TimeInput` renders the segments itself (hour/minute, plus
  second and dayPeriod per props); literals between.
- Root states: `data-disabled`, `data-readonly`, `data-required`,
  `data-invalid`, `data-empty`.
- Segment states: `data-type` (`hour`|`minute`|`second`|`dayPeriod`|
  `literal`), `data-empty` + the shared four.

### Design rules that bite

- Copy `packages/styles/src/date-input.css` wholesale, rename
  `date-input` → `time-input` and `data-slot='date-input-segment'` →
  `data-slot='time-input-segment'`. Every rule carries over unchanged.
- One addition: `[data-type="dayPeriod"]` (AM/PM) segments type letters —
  `text-transform: uppercase` on the value is cosmetic only; skip unless
  trivial. Keep it minimal: no special rule.

## Commands you will need

| Purpose   | Command             | Expected on success |
| --------- | ------------------- | ------------------- |
| Install   | `bun install`       | exit 0              |
| Typecheck | `bun run typecheck` | exit 0, no errors   |

## Scope

**In scope** (the only files you should modify or create):

- `packages/react/src/time-input/time-input.tsx` — create
- `packages/react/src/time-input/index.ts` — create
- `packages/react/src/index.tsx` — add the re-export line
- `packages/styles/src/time-input.css` — create
- `packages/styles/index.css` — add one import line
- `apps/docs/src/components/time-input-demo.tsx` — create
- `apps/docs/content/docs/time-input.mdx` — create
- `apps/docs/content/docs/meta.json` — add `"time-input"` to `pages`

**Out of scope** (do NOT touch, even though they look related):

- TimeField spinners (the stepper-lane variant) — deferred
- Any lint/test infrastructure

## Git workflow

- Work on the branch checked out in your worktree
  (`particle/038-time-input`).
- Commit per logical step; plain imperative messages.
- Do NOT push, merge, or rebase.

## Steps

### Step 1: Create the TimeInput wrappers in `@hashti/react`

`packages/react/src/time-input/time-input.tsx` — mirror the date-input
wrappers (root + segment; verify the export list).

**Verify**: `bun run typecheck` → exit 0.

### Step 2: Create the stylesheet and import it

`packages/styles/src/time-input.css` — the renamed copy.

**Verify**: `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/time-input.css`
→ no matches; `grep -c "time-input-segment" packages/styles/src/time-input.css`
→ ≥ 4.

### Step 3: Docs demo component and page

`apps/docs/src/components/time-input-demo.tsx`:

```tsx
"use client";

import { Field, FieldLabel } from "@hashti/react";
import { TimeInput } from "@hashti/react";

export function TimeInputDemo() {
  return (
    <Field name="reminder-time" style={{ maxWidth: 200 }}>
      <FieldLabel>Reminder time</FieldLabel>
      <TimeInput required />
    </Field>
  );
}
```

`apps/docs/content/docs/time-input.mdx`:

```mdx
---
title: TimeInput
description: Types a time in place, segment by segment.
---

import { TimeInputDemo } from "../../src/components/time-input-demo";

## Usage

<TimeInputDemo client:load />

## Notes

The root renders its segments (hour/minute, plus seconds and AM/PM per props). Styling mirrors DateInput — one bordered field, empty segments in secondary ink.
```

`apps/docs/content/docs/meta.json` — insert `"time-input"` after
`"textarea"` (alphabetical check against the live list).

**Verify**: `bun run typecheck` → exit 0.

## Test plan

No test runner exists in this repo; none is added by this plan. Verification
is: typecheck gates, the greps in Step 2, and the reviewer's rendered check
(type hour/minute, group ring, empty ink, invalid border, disabled).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `bun run typecheck` exits 0 from the repo root
- [ ] `grep -rn "hashti-time-input" packages/react/src packages/styles/src`
      shows the wrapper classes and the stylesheet selectors
- [ ] `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/time-input.css`
      returns nothing
- [ ] `grep -n "time-input" packages/styles/index.css apps/docs/content/docs/meta.json`
      shows the import and the page entry
- [ ] `git status --porcelain` lists no files outside the in-scope list
- [ ] Work committed on the worktree branch, one commit per step

## STOP conditions

Stop and report back (do not improvise) if:

- Any part is not exported from `@ui-sdk/react/time-input` — quote the
  error.
- A step's verification fails twice after a reasonable fix attempt.
- The fix appears to require touching an out-of-scope file.

## Maintenance notes

- The date+time pair now covers DateTimePicker's field halves.
