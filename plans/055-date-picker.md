# Plan 055: DatePicker — input + trigger + calendar popup

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving on. If a
> STOP condition triggers, stop and report — do not improvise. Do not update
> `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat <base>..HEAD -- packages apps/docs/content design`
> Compare "Current state" excerpts against live code; on mismatch, STOP.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED (composes Calendar inside the popup — content parts render
  through the consumer)
- **Depends on**: plans/054-calendar (DONE, merged)
- **Category**: migration (component build-out, cycle 55)
- **Parallel lane**: Particle-5

## Why this matters

DatePicker is Calendar + field + popup — the payoff of cycle 54.

## Current state

- `packages/styles/src/calendar.css` — the popup content styling base.
- `packages/styles/src/popover.css` — popup surface/motion exemplar.
- `packages/styles/src/date-input.css` — the field-side exemplar.
- `apps/docs/content/docs/meta.json` — insert `"date-picker"` after `"date-input"`.

### ui-sdk DatePicker facts (READ the full docs page first)

- Import: `import { DatePicker, DatePickerInput, DatePickerTrigger, DatePickerHint, DatePickerContent } from "@ui-sdk/react/date-picker"` (verify).
- Composition: `DatePicker` → (`DatePickerInput`, `DatePickerTrigger`,
  `DatePickerHint`, `DatePickerContent`). An empty `DatePickerContent`
  renders a Calendar for you. Every Calendar part also works inside
  `DatePickerContent` and is re-exported from the Date Picker entry.
- Root states: `data-mode` (single/range), `data-open`/`data-closed`,
  `data-readonly`, `data-disabled`, `data-invalid`.
- Content: `data-open`, `data-presentation` (popover/sheet).

### Design rules that bite (derived)

- **Root `hashti-date-picker`**: `position: relative; display: flex;
  flex-direction: column; gap: 0.375rem;` — field anatomy wrapper.
- **Input `hashti-date-picker-input`**: reuse the `hashti-date-input`
  control recipe (border, radius, layer, focus ring via `:focus-visible`,
  `[data-invalid]` → the danger recipe, `[data-disabled]` → disabled ink).
- **Trigger `hashti-date-picker-trigger`**: quiet icon square at the field's
  end — `display: inline-flex; align-items: center; justify-content:
  center; inline-size: 2.25rem; border: none; background: transparent;
  cursor: pointer;` hover → background-hover; `[data-open]` → pressed tint.
- **Hint `hashti-date-picker-hint`**: the field-hint typography (0.75rem,
  secondary ink).
- **Content `hashti-date-picker-content`**: the popover surface recipe
  (layer-01, border-subtle-00, popover radius, 0 8px 24px shadow, 0.5rem
  padding) + open/close motion via `data-open`/`data-closed` (opacity +
  scale 0.98, fast-01; reduced-motion → opacity only).
- Colours only via `var(--hashti-*)`; a hex in component CSS is a bug.

## Commands

| Purpose   | Command             | Expected |
| --------- | ------------------- | -------- |
| Install   | `bun install`       | exit 0   |
| Typecheck | `bun run typecheck` | exit 0   |

## Scope

**In scope** (only these):

- `packages/react/src/date-picker/date-picker.tsx` — create
- `packages/react/src/date-picker/index.ts` — create
- `packages/react/src/index.tsx` — add the re-export line
- `packages/styles/src/date-picker.css` — create
- `packages/styles/index.css` — add one import line
- `apps/docs/src/components/date-picker-demo.tsx` — create
- `apps/docs/content/docs/date-picker.mdx` — create
- `apps/docs/content/docs/meta.json` — add `"date-picker"`

**Out of scope**: range mode styling beyond defaults; sheet presentation;
lint/test infra.

## Git workflow

- Branch `particle/055-date-picker` in your worktree.
- Commit per logical step; never push/merge/touch main.

## Steps

1. **Wrappers** — `join` helper pattern per part (verify class landing in
   rendered DOM; key on data-slot where ui-sdk renders the part itself).
   Export all from `./date-picker` + barrel. Verify: typecheck exit 0.
2. **Stylesheet** — rules above. Verify: `grep -nE "#[0-9a-fA-F]{3,8}"
   packages/styles/src/date-picker.css` → nothing; `grep -c "data-"
   packages/styles/src/date-picker.css` → ≥ 6.
3. **Demo + page** — demo composes `DatePickerInput`, `DatePickerTrigger`,
   `DatePickerContent` (empty content = default Calendar). Note prop
   deviations from the plan. meta.json entry. Verify: typecheck exit 0.

## Done criteria

- [ ] `bun run typecheck` exits 0
- [ ] `grep -rn "hashti-date-picker" packages/react/src packages/styles/src` hits
- [ ] no hex in `packages/styles/src/date-picker.css`
- [ ] import + meta entries present
- [ ] `git status --porcelain` clean of out-of-scope files
- [ ] one commit per step

## STOP conditions

- Any part not exported from `@ui-sdk/react/date-picker` — quote the error.
- Empty `DatePickerContent` does not render a Calendar — report the DOM.
- A verification fails twice after a reasonable fix attempt.
- Fix needs an out-of-scope file.
