---
sourcesHash: f16af04d1d36d6497513dd6c2b4ceb6e83aa0810e0c18ec3478d0b762aa4ee16
id: date-input
description: >-
  Type a date one segment at a time in the locale's order, with an ISO string
  value, form participation and range/unavailable validation handled by
  ui-sdk.
status: discoverable
sources:
  - packages/react/src/date-input/date-input.tsx
  - packages/react/src/date-input/index.ts
  - packages/styles/src/date-input.css
examples:
  - apps/docs/content/docs/date-input.mdx
---

# Date Input

## Purpose

Types a date one part at a time, in the order the user's language writes it.
Hashti wraps ui-sdk's `DateInput` and `DateInputSegment` unchanged, adding
`hashti-date-input*` classes; appearance lives in
`packages/styles/src/date-input.css`.

## When to use

- Dates people know by heart, like a birthday or a booking date. ui-sdk docs:
  "Each part of the date is its own small input, ordered the way the locale
  writes it."
- A date plus time: `granularity="hour"|"minute"|"second"` (for a time alone,
  ui-sdk ships a Time Input; Hashti does not wrap it yet).
- A date with a known range: `min`/`max`/`unavailable` turn invalid values
  into `data-invalid` and stop the form.

## When not to use

- Choosing from a visible grid — use [Calendar](calendar.md).
- A date nobody knows by heart, like a birthdate far in the past, where a
  picker beats typing — pair with a Date Picker (ui-sdk ships one; Hashti does
  not wrap it yet).

## Public settings

Hashti wraps and re-exports the two parts only; all props forward to ui-sdk.

- `value`/`defaultValue`/`onValueChange` (an ISO date like `"2026-11-02"`, or
  `null` while empty or partly typed; `details.cancel()` keeps the value),
  `granularity`, `hourCycle`, `min`, `max`, `unavailable` (the same
  DateMatchers as Calendar), `locale`, `disabled`, `readOnly`, `required`,
  `name`, `form`, `controller` from `createDateInputController()`
  (`focus("year")` targets a segment).
- Composition: put it in a [Field](field.md) — the field's label names the
  group and clicking it focuses the first segment. Without children it renders
  every segment; children can be a function of state rendering
  `state.segments`.

## States

ui-sdk sets `data-disabled`, `data-readonly`, `data-required`, `data-invalid`
and `data-empty` on root and segments, and `data-type` (`year`, `month`,
`day`, `hour`, `minute`, `second`, `dayPeriod`, `literal`) on each segment.
`packages/styles/src/date-input.css` keys:

- The root as the field box; the focus ring sits on it via
  `:has([data-slot="date-input-segment"]:focus-visible)`, not the segments.
- `[data-empty]` segments muted, `[data-type="literal"]` separators muted and
  inert, `[data-readonly]` dashed with a layer background, `[data-invalid]`
  error border, `[data-disabled]` disabled colors and cursor.

## Observable promises

Per ui-sdk docs:

- The value stays `null` until every segment holds something, so the app only
  sees whole dates; `onValueChange` runs with `null` once any part is erased,
  and a half-typed date already reads `null`.
- Typing digits fills each segment and moves on; a month that can't take
  another digit moves on at once, and typing a separator moves on too. The
  day is kept within its month: moving from January 31 to February shows the
  28th. Pasting a whole date into any segment works, as ISO or written the
  way the locale writes it.
- The input reads its order, separators and clock from `locale`, or the
  page's language; digits are always 0 to 9 and the calendar always
  Gregorian. On the server it renders in English until it reads the page's
  language.
- A hidden input submits the ISO date under `name`; an empty or partly typed
  date submits an empty string, and a partly typed date stops the form with
  "Enter a valid date." `required` needs a date before submission; Enter in a
  segment submits the form with what was typed.
- A date outside `min`/`max` is invalid (`data-invalid`) and the form won't
  submit; an unavailable date is invalid with the message "This date isn't
  available."
- `readOnly` keeps the date focusable, readable and submitted as it is;
  `disabled` removes it from focus and its form. A form reset restores
  `defaultValue` and reports the `reset` reason.
- ArrowUp/ArrowDown on a segment steps it; typing P or A in the last segment
  switches AM/PM.
