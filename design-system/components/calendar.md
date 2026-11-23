---
sourcesHash: 94d340d9589530558067fe8ae850d25b2307cecde4206b3822505a3140d6e9a9
id: calendar
description: >-
  Choose one date, several dates, or a range from a visible month grid, with
  ISO string values, locale-aware labels and unavailable-date handling handled
  by ui-sdk.
status: discoverable
sources:
  - packages/react/src/calendar/calendar.tsx
  - packages/react/src/calendar/index.ts
  - packages/styles/src/calendar.css
examples:
  - apps/docs/content/docs/calendar.mdx
---

# Calendar

## Purpose

Chooses one date, several dates, or a range from a month grid that stays on
the page. Hashti wraps ui-sdk's eleven `Calendar*` parts unchanged, adding
`hashti-calendar*` classes; appearance lives in
`packages/styles/src/calendar.css`.

## When to use

- A booking flow, a schedule, or any place the dates should stay visible.
  ui-sdk docs: "Calendar shows dates directly on the page."
- Ranges with limits: `mode="range"` plus `minDays`/`maxDays`, and
  `allowUnavailable` for stays that span a booked night.
- Jumping straight to a known date: the month and year selects.

## When not to use

- A date inside a form field that opens a picker — use a Date Picker (ui-sdk
  ships one; Hashti does not wrap it yet).
- Typing a date people know by heart — use [DateInput](date-input.md).

## Public settings

Hashti wraps and re-exports the eleven parts only; all props forward to
ui-sdk.

- `mode`: `"single"` (default, an ISO date string or `null`) | `"multiple"`
  (sorted array) | `"range"` (`[start, end]` or `null`).
- `value`/`defaultValue`/`onValueChange`, `month`/`defaultMonth`/
  `onMonthChange` (the first shown month, like `"2026-10"`),
  `onFocusedChange`, `onAnchorChange` — each `details.cancel()` rejects the
  change.
- Bounds and rules: `min`, `max`, `unavailable` (DateMatchers: ISO dates,
  `{ from, to }`, `{ weekday: [0, 6] }`, `{ before }`, `{ after }`, a
  predicate, or an array), `deselectable`, `minDays`, `maxDays`,
  `allowUnavailable`, `disabled`, `readOnly`.
- Layout and language: `months`, `pageBy` (`"month"` | `"page"`),
  `fixedWeeks`, `showOutsideDays`, `locale`, `weekStartsOn`,
  `weekdayFormat`/`monthFormat` (`"narrow"` | `"short"` | `"long"`), `today`,
  `timeZone`, `controller`.
- Composition: the weekday and week helpers render the table structure while
  you render each header and date; `CalendarGrid` takes `offset` for the
  second of several months.

## States

ui-sdk sets `data-mode` on the root, `data-selected`, `data-today`,
`data-outside`, `data-unavailable`, `data-disabled` and `data-value` on days,
`data-range-start`/`data-range-middle`/`data-range-end` and `data-preview` for
ranges, and `data-disabled` on Previous/Next at the bounds.
`packages/styles/src/calendar.css` keys all of the above: selected days get
the selected recipe, range middles a subtle tint with square inner corners,
preview days mirror the hover, and unavailable/disabled days keep focusable
cursor treatment.

## Observable promises

Per ui-sdk docs:

- Values are ISO strings such as `"2026-10-16"`, with no time or time zone
  attached; no date library is needed.
- In range mode, moving the pointer or focus previews the range; the value
  changes once both ends are chosen. A date before the start ends it too, and
  becomes the start. Escape cancels an unfinished range.
- Unavailable dates cannot be selected but stay focusable, with
  `aria-disabled` and `data-unavailable`, so keyboard and screen reader users
  can discover them.
- Dates outside `min`/`max` cannot receive focus; arrow keys stop at the
  bounds and Previous/Next stop at their months.
- Today gets `aria-current="date"` and `data-today`; the calendar reads today
  on the client, in `timeZone`.
- The heading is an `h2` the grid is labelled by, and screen readers hear it
  change; each grid is named by its month and has the `grid` role.
- `locale` controls names and the first weekday; if omitted it reads the
  page's `lang` after mount, with the browser's language as fallback. The
  initial server and client render use English, so they always match.
- `CalendarMonthSelect`/`CalendarYearSelect` are native selects; year options
  run from `min` to `max`, or ten years either side of the shown year.
