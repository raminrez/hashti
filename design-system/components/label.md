---
sourcesHash: 91400c19441913b88b9070c7211d8349febe2d3693432d1b9a4e59e992a9c3ce
id: label
description: >-
  Name any control with a native label — by htmlFor or by wrapping it — and
  let a press on the label reach controls a plain label cannot, handled by
  ui-sdk.
status: discoverable
sources:
  - packages/react/src/label/label.tsx
  - packages/react/src/label/index.ts
  - packages/styles/src/label.css
examples:
  - apps/docs/content/docs/label.mdx
---

# Label

## Purpose

Names any control with a label, and lets a press on the label reach it.
Hashti wraps ui-sdk's `Label` unchanged, adding the `hashti-label` class;
appearance lives in `packages/styles/src/label.css`.

## When to use

- Naming a control by `htmlFor`, or by wrapping it so no `id` is needed.
  ui-sdk docs: "A plain `<label>` only reaches inputs, buttons and selects.
  Label names any control by its `htmlFor`, including a radio group or a
  slider, and a press on the label moves focus into it."
- A label for a slider (it names the thumb) or a switch beside it (a press
  toggles it).

## When not to use

- A label plus description plus errors for a form field — use Field's
  `FieldLabel`, which also ties the description and errors to the control.
- Text that only looks like a label but names no control — a plain styled
  span is honest.

## Public settings

Hashti wraps and re-exports `Label` only; all props forward to ui-sdk, along
with a native label's `htmlFor` and `render` to use a different element.

- Composition: point `htmlFor` at the control's `id`, or put the control
  inside the label. Inside a Field, use `FieldLabel` instead.

## States

ui-sdk emits only `data-slot="label"`; the label is unstyled upstream.
`packages/styles/src/label.css` sets the Hashti label typography: 0.875rem,
1.25rem line height, semibold, primary text color.

## Observable promises

Per ui-sdk docs:

- Label renders a native `<label>`. When the browser can reach the control on
  its own, like an input, it does; for anything else, the control takes the
  label as its name, and a press on the label focuses it, checks it or clicks
  it, as a native label would.
- A label names a radio group, and a press focuses its checked radio; a label
  for a slider names its thumb, and a press focuses it.
- A label around a checkbox names it, and a press toggles it; a double click
  on the label doesn't select its text, so no `user-select: none` is needed.
- A control its author named with its own `aria-label` or `aria-labelledby`
  keeps that name; a label names a control that renders after it.
- A press on the label of a disabled group moves no focus.
