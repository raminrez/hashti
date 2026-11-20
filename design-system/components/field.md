---
sourcesHash: 3cf417757f1370cfe0b71e205114b31a8e5123b67febb4eccd0aeca842c355a4
id: field
description: >-
  Connect a form control to its label, description and validation errors,
  wiring id, for and aria-describedby automatically, with field sets and
  groups for related fields.
status: discoverable
sources:
  - packages/react/src/field/field.tsx
  - packages/react/src/field/index.ts
  - packages/styles/src/field.css
examples:
  - apps/docs/content/docs/field.mdx
---

# Field

## Purpose

Ties a form control to its label, its description and the errors it shows.
Hashti wraps ui-sdk's Field parts unchanged, adding `hashti-field*` classes;
appearance lives in `packages/styles/src/field.css`.

## When to use

- Any control that needs a visible label, helper text or validation errors — `Input`, `Textarea`, `Select`, `Checkbox`, `Switch` all wire themselves to the Field they sit in.
- Related fields that belong together: `FieldSet` names and disables the group; `FieldGroup` only lays it out.

## When not to use

- A control with only an `aria-label` and no visible text: a Field adds structure without a label to show.
- Layout without semantics: `FieldGroup` has no role — use `FieldSet` when a group needs a name or shared `disabled`.

## Public settings

Hashti wraps and re-exports: `Field`, `FieldLabel`, `FieldControl`,
`FieldDescription`, `FieldError`, `FieldSet`, `FieldLegend`, `FieldGroup`.

- `Field` options forward from ui-sdk: `name` (the name the control submits under, when the control doesn't set its own), `disabled` (disables the control and marks every part), `invalid` (`true` shows errors now, `false` shows none whatever the browser thinks; leave it out to show the browser's own validation once a submit finds the field invalid).
- `FieldError` takes `match` — `true` shows it always, `false` never, a validity key like `"valueMissing"` shows it only for that problem; without children it shows the browser's message for the current problem.
- `FieldSet` takes `disabled` (disables every control inside, except those in its legend); `FieldLegend` stays the set's first child so the `<legend>` names it natively.
- Composition: `FieldControl` renders an `<input>` by default, or anything through `render`; a `FieldDescription` right inside a `FieldSet`, outside any Field, describes the group.

## States

ui-sdk sets `data-disabled` and `data-invalid` on every Field part (field,
label, control, description, error), `data-disabled` on `FieldSet` and
`FieldLegend` (`data-slot` names preserved). `packages/styles/src/field.css`
keys:

- `[data-invalid]` turns label and description to the error text color.
- `FieldError` renders as an error box attached below the control: negative top margin, error surface and border, recovery radius on the bottom corners; the control above it gets matching bottom radii via `:has(.hashti-field__error)`.
- After a choice control (`.hashti-choice` present), the error renders as plain error text with no box.
- `FieldSet`/`FieldLegend`/`FieldGroup` provide the column and grid layout.

## Observable promises

Per ui-sdk docs:

- The label names the control with `aria-labelledby`, beside a native `<label for>` where the control can take one; the description and any error that shows describe it with `aria-describedby`; an invalid control has `aria-invalid`.
- Errors stay hidden until the form tries to submit, then show the browser's message when they have no text of their own, update as the value changes once shown, and hide again on a form reset.
- Clicking the label of a text field focuses it; the first invalid control takes focus on submit.
- A disabled Field or FieldSet leaves its controls out of the submitted form values; enabling the set again restores them.
