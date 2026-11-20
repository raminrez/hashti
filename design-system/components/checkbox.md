---
id: checkbox
description: >-
  Check or uncheck one choice, or several through a group, with a native form
  participation and an indeterminate state for partly checked groups handled
  by ui-sdk.
status: discoverable
sources:
  - packages/react/src/checkbox/checkbox.tsx
  - packages/react/src/checkbox/index.ts
  - packages/styles/src/checkbox.css
examples:
  - apps/docs/content/docs/checkbox.mdx
---

# Checkbox

## Purpose

Records a choice someone can check or uncheck, individually or as one value
in a group. Hashti wraps ui-sdk's `Checkbox` and `CheckboxIndicator`
unchanged, adding `hashti-checkbox*` classes; appearance lives in
`packages/styles/src/checkbox.css`.

## When to use

- One independent choice that submits with a form (terms accepted, opt-ins) or several choices that belong to one value.
- A partly-checked group state: ui-sdk's `CheckboxGroup` with a `parent` checkbox shows checked, unchecked or indeterminate from its members.

## When not to use

- A setting that takes effect immediately: use `Switch`.
- Exactly one choice out of several: use a radio set (ui-sdk ships one; Hashti does not wrap it yet).

## Public settings

Hashti wraps and re-exports `Checkbox` and `CheckboxIndicator` only. ui-sdk
also ships `CheckboxGroup`; Hashti does not wrap it yet.

- All props forward to ui-sdk's `Checkbox`: `checked`/`defaultChecked`/`onCheckedChange` (`CheckedState` is `boolean | "indeterminate"`; `details.cancel()` stops the change), `disabled`, `readOnly` (focusable and submitted, but unchanged by presses), `required`, `name` (without one it submits nothing), `value` (what it submits while checked), `form`, `controller`, `parent`.
- Composition: wrap the checkbox and its text in a `<label>`; the indicator shows while the checkbox is checked or indeterminate — put the check icon inside `CheckboxIndicator`. Use `FieldLabel`/`FieldDescription` in a `Field` when the choice needs explanation.
- `packages/styles/src/checkbox.css` also ships a `.hashti-choice` helper class for the label row (inline-flex, 2.75rem minimum height); the wrapper does not apply it — a consumer adds it to the label.

## States

ui-sdk sets `data-checked`, `data-unchecked`, `data-indeterminate`,
`data-disabled`, `data-readonly`, `data-required` on the checkbox and the
indicator, plus `data-starting-style`/`data-ending-style` on the indicator
(`data-slot` names preserved). `packages/styles/src/checkbox.css` keys:

- `[data-checked]`, `[data-indeterminate]` — filled background and border in focus color (the check glyph itself comes from the consumer's icon inside the indicator).
- `:active` scale on press, `[data-disabled]` colors and cursor, `:focus-visible` outline.

## Observable promises

Per ui-sdk docs:

- `Checkbox` renders a button with the `checkbox` role plus a hidden native checkbox that takes part in forms, following the WAI-ARIA checkbox pattern.
- Space toggles it; Enter submits its form and never toggles it; clicking its label toggles it once.
- The indicator shows only while checked (or always with `keepMounted`); a press on an indeterminate checkbox makes it checked.
- A form reset returns it to `defaultChecked`; a disabled `<fieldset>` disables it; a read-only checkbox still submits.
- A required checkbox blocks form submission with the browser's own message.
