---
id: input
description: >-
  Enter a short single-line text value — a name, email, search term — through a
  native input wired to its Field, with change reasons and clear-button
  support in ui-sdk.
status: discoverable
sources:
  - packages/react/src/input/input.tsx
  - packages/react/src/input/index.ts
  - packages/styles/src/input.css
examples:
  - apps/docs/content/docs/input.mdx
---

# Input

## Purpose

Enters a short single-line text value into a form or state. Hashti wraps
ui-sdk's `Input` unchanged and adds the `hashti-input` class; appearance lives
in `packages/styles/src/input.css`.

## When to use

- The value is one line of text: name, email, URL, search term, number with an input type.
- The input sits in a `Field` for label, description and errors, or carries its own `aria-label`.

## When not to use

- Multi-line text: use `Textarea`.
- A choice from a known set: use `Select` (or `Checkbox` for on/off choices).
- Text with icons or buttons around it: ui-sdk ships `InputGroup` and `InputClear`, but Hashti does not wrap them yet — composing ui-sdk parts directly is outside this contract.

## Public settings

All props forward to ui-sdk's `Input`; the wrapper adds no options.

- Native input attributes pass through directly (`type`, `placeholder`, `autoComplete`, `required`, `pattern`, …).
- `value` / `defaultValue` / `onValueChange(value, details)` — controlled value, initial value, and change callback. `details.reason` is one of `input-change` (typing/paste/drop), `clear-press`, `reset`, `imperative`; `details.cancel()` keeps the previous value (per ui-sdk docs).
- `controller` — a `createInputController()` handle (`getValue`, `setValue`, `clear`, `focus`) to read and write the field from anywhere.
- `disabled`, `readOnly`, `required` behave like the native attributes; per ui-sdk docs a `disabled` Field disables the input too.

## States

ui-sdk sets `data-filled`, `data-disabled`, `data-readonly`, `data-required`
on the input (`data-slot="input"`). `packages/styles/src/input.css` keys:

- `[aria-invalid="true"]` — error border. (On-disk note: this file keys the invalid state via `aria-invalid`, not `data-invalid`; see gap G2 in `design-system/gaps.md`. ui-sdk sets `aria-invalid` when the surrounding Field shows as invalid.)
- `[data-readonly]` — dashed border and accent background; `[data-disabled]` — disabled border, background, text and cursor.
- `:focus-visible` — 2px `--hashti-focus` outline; `::placeholder` in secondary text color.

## Observable promises

Per ui-sdk docs:

- The input stays a native `<input>`: standard text editing, selection, autocomplete and form behavior are preserved.
- Inside a Field, the label names the control, the description describes it, and clicking the label focuses the input; an invalid input is marked once the form tries to submit.
- A canceled change (`details.cancel()`) keeps the text as it was, including for a controlled input and while an IME is composing.
- A form reset returns the value to `defaultValue` and reports reason `reset`.
- Give the input a visible Field label or an `aria-label`; there is no Hashti wrapper for `InputGroup`/`InputClear`, so their promises (clear button, group focus) are out of scope here.
