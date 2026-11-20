# Plan 054: Calendar — month grid, heading, day cells

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do not update `plans/README.md`; the reviewer
> maintains it.
>
> **Drift check (run first)**: `git diff --stat <base>..HEAD -- packages apps/docs/content design`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED (the calendar grid is table-structured and renders through
  consumer content — the wrapper surface is wider than most cycles)
- **Depends on**: plans/051-token-input (DONE)
- **Category**: migration (component build-out, cycle 54)
- **Parallel lane**: Particle-4

## Why this matters

Calendar is the month grid — the visible half of DatePicker. Once its
day cells, heading, and selects are styled, DatePicker composes
Calendar + popover.

## Current state

- `packages/styles/src/segmented-control.css` — the trigger/select
  styling precedents.
- `apps/docs/content/docs/meta.json` — check the live list; insert
  `"calendar"` alphabetically.

### ui-sdk Calendar facts (from `packages/react/node_modules/@ui-sdk/react/docs/components/calendar.md` — READ the Composition, Usage and Data Attributes sections fully)

- Import: `import { Calendar, CalendarGrid, CalendarDay, CalendarHeading, CalendarMonthSelect, CalendarNext, CalendarPrevious, CalendarWeekday, CalendarWeekdays, CalendarWeeks, CalendarYearSelect } from "@ui-sdk/react/calendar"` (verify exact exports).
- Composition: `Calendar` → (`CalendarPrevious`, `CalendarHeading`,
  `CalendarNext`, `CalendarGrid` → (`CalendarWeekdays` →
  `CalendarWeekday`, `CalendarWeeks` → day cells)). An EMPTY Calendar
  renders the default structure; an empty `CalendarGrid` renders headers
  and weeks. Write parts out to add classes and content.
- Root states: `data-mode` (single/multiple/range), `data-readonly`,
  `data-disabled` (also on grids/selects and unpickable days).
- Day cells carry selection state (check `CalendarDay`'s attributes —
  selected/today/outside-month etc.).
- The grid is a real table structure via the helpers.

### Design rules that bite (derived)

- **Root `hashti-calendar`**: `display: flex; flex-direction: column;
gap: 0.75rem; padding: 0.75rem; background: var(--hashti-layer-01);
border: 1px solid var(--hashti-border-subtle-00); border-radius:
var(--hashti-popover-radius);` (an 18px panel — it hosts the picker
  popup later).
- **Heading/controls row**: heading centered; Previous/Next as the quiet
  icon squares (2.5rem, control radius, transparent, hover
  background-hover, `[data-disabled]` disabled ink; ring 2px@2px on
  `:focus-visible`).
- **Grid**: `border-collapse: collapse; inline-size: 100%;` the day
  cells laid out 7 columns — style via the week/day helpers' rendered
  structure (check the DOM: rows/cells or div grid).
- **Weekday header**: helper typography (0.75rem), ink
  `var(--hashti-text-secondary)`, weight 500, centered.
- **Day cell (button)**: `display: inline-flex; align-items: center;
justify-content: center; inline-size: 2.25rem; block-size: 2.25rem;
border: none; border-radius: var(--hashti-border-radius-08);
background: transparent; color: var(--hashti-text-primary);
font-size: 0.8125rem; font-variant-numeric: tabular-nums; cursor:
pointer;`
  - hover (hover:hover, not selected/disabled) → background-hover.
  - selected/today/outside states — READ `CalendarDay`'s attribute list
    in the docs and style: today = outline ring or bold; outside-month =
    secondary ink; selected = `background:
var(--hashti-background-selected); color: var(--hashti-focus);` (the
    selection pair).
  - `[data-disabled]` → disabled ink, not-allowed.
- **Month/Year selects**: the `hashti-select-trigger` recipe at compact
  size (min-block-size 2rem) — compose with the Select styles if the
  calendar renders actual Select parts; otherwise style the rendered
  element generically.
- Colours only via `var(--hashti-*)`; a hex in component CSS is a bug.

## Commands you will need

| Purpose   | Command             | Expected on success |
| --------- | ------------------- | ------------------- |
| Install   | `bun install`       | exit 0              |
| Typecheck | `bun run typecheck` | exit 0, no errors   |

## Scope

**In scope** (the only files you should modify or create):

- `packages/react/src/calendar/calendar.tsx` — create
- `packages/react/src/calendar/index.ts` — create
- `packages/react/src/index.tsx` — add the re-export line
- `packages/styles/src/calendar.css` — create
- `packages/styles/index.css` — add one import line
- `apps/docs/src/components/calendar-demo.tsx` — create
- `apps/docs/content/docs/calendar.mdx` — create
- `apps/docs/content/docs/meta.json` — add `"calendar"` to `pages`

**Out of scope** (do NOT touch, even though they look related):

- Range/multiple modes styling beyond defaults — deferred
- DatePicker (calendar + field + popup) — its own cycle
- Any lint/test infrastructure

## Git workflow

- Work on the branch checked out in your worktree
  (`particle/054-calendar`).
- Commit per logical step; plain imperative messages.
- Do NOT push, merge, or rebase.

## Steps

### Step 1: Create the Calendar wrappers in `@hashti/react`

`packages/react/src/calendar/calendar.tsx` — the `join` helper pattern
(direct-re-export checks per part; verify class landing in the rendered
DOM — the date-input lesson — and key on data-slot where a class cannot
land):

Wrap every exported part (heading, grids, weekdays, days, selects,
arrows). The barrel exports all.

**Verify**: `bun run typecheck` → exit 0.

### Step 2: Create the stylesheet and import it

`packages/styles/src/calendar.css` — the design-rules section above.

**Verify**: `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/calendar.css`
→ no matches; `grep -c "data-" packages/styles/src/calendar.css` →
≥ 5.

### Step 3: Docs demo component and page

`apps/docs/src/components/calendar-demo.tsx` — an empty Calendar (default
structure), or the expanded form if the docs' Usage shows one; adapt prop
names to the docs and note deviations:

```tsx
"use client";

import { Calendar } from "@hashti/react";

export function CalendarDemo() {
  return <Calendar aria-label="Pick a date" style={{ maxWidth: 320 }} />;
}
```

`apps/docs/content/docs/calendar.mdx`:

```mdx
---
title: Calendar
description: Picks dates from a month grid.
---

import { CalendarDemo } from "../../src/components/calendar-demo";

## Usage

<CalendarDemo client:load />

## Parts

| Part                                                    | Purpose                           |
| ------------------------------------------------------- | --------------------------------- |
| `Calendar`                                              | Owns the month and the selection. |
| `CalendarHeading` / `CalendarPrevious` / `CalendarNext` | The month header.                 |
| `CalendarGrid`                                          | The weekday grid (a real table).  |
| `CalendarDay`                                           | One pickable date.                |
| `CalendarMonthSelect` / `CalendarYearSelect`            | Jump to a month/year.             |

Styling lives in `@hashti/styles` under `.hashti-calendar*` — an 18px panel with quiet day squares, the selected day in the selected tint.
```

`apps/docs/content/docs/meta.json` — insert `"calendar"` alphabetically.

**Verify**: `bun run typecheck` → exit 0.

## Test plan

No test runner exists in this repo; none is added by this plan. Verification
is: typecheck gates, the greps in Step 2, and the reviewer's rendered check
(grid renders a real month, Previous/Next change months, day selection
tint, today ring, outside-month ink, disabled rules).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `bun run typecheck` exits 0 from the repo root
- [ ] `grep -rn "hashti-calendar" packages/react/src packages/styles/src`
      shows the wrapper classes and the stylesheet selectors
- [ ] `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/calendar.css`
      returns nothing
- [ ] `grep -n "calendar" packages/styles/index.css apps/docs/content/docs/meta.json`
      shows the import and the page entry
- [ ] `git status --porcelain` lists no files outside the in-scope list
- [ ] Work committed on the worktree branch, one commit per step

## STOP conditions

Stop and report back (do not improvise) if:

- Any part is not exported from `@ui-sdk/react/calendar` — quote the
  error.
- The default-structure rendering contradicts the composition — report
  the actual DOM.
- A step's verification fails twice after a reasonable fix attempt.
- The fix appears to require touching an out-of-scope file.

## Maintenance notes

- DatePicker composes Calendar + the popover popup + the DateInput field.
- Range selection styling lands with the range pass.
