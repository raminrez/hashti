---
id: switch
description: >-
  Turn a setting on or off where the change takes effect immediately, with a
  sliding thumb and native form participation handled by ui-sdk.
status: discoverable
sources:
  - packages/react/src/switch/switch.tsx
  - packages/react/src/switch/index.ts
  - packages/styles/src/switch.css
examples:
  - apps/docs/content/docs/switch.mdx
---

# Switch

## Purpose

Turns a setting on or off — a preference that applies as soon as it changes.
Hashti wraps ui-sdk's `Switch` and `SwitchThumb` unchanged, adding
`hashti-switch*` classes and a `size` option; appearance lives in
`packages/styles/src/switch.css`.

## When to use

- A setting that takes effect as soon as it changes, like a notification preference (per ui-sdk docs: keep the label the same in both states — the label says what the setting is, the switch shows whether it's on).

## When not to use

- A choice that belongs to a form submission rather than applying immediately: use `Checkbox`.
- Exactly one choice among several: use a radio set (not wrapped by Hashti yet).

## Public settings

- `size` — Hashti's only addition: `sm` | `md` (default), rendered as `data-size` on the switch.
- All other props forward to ui-sdk's `Switch`: `checked`/`defaultChecked`/`onCheckedChange` (boolean; `details.cancel()` stops the change), `disabled`, `readOnly`, `required`, `name` (without one it submits nothing), `value`, `form`, `controller` (`toggle`/`getChecked`/`setChecked`/`focus`).
- Composition: wrap the switch and its text in a `<label>`; `SwitchThumb` stays mounted and carries the state so CSS can slide it. Use `FieldLabel`/`FieldDescription` in a `Field` when the setting needs explanation.

## States

ui-sdk sets `data-checked`, `data-unchecked`, `data-disabled`,
`data-readonly`, `data-required` on the switch and thumb, and
`data-invalid` on the switch while a Field around it shows as invalid
(`data-slot` names preserved). `packages/styles/src/switch.css` keys:

- Track: `[data-checked]` turns the background to the success token, `[data-disabled]` to the disabled token; `[data-invalid]` adds an error outline; `:focus-visible` outline.
- Thumb: absolutely positioned, slides via `translate` keyed on the switch's `[data-checked]` and `[data-size="sm"]`; disabled thumbs dim.

## Observable promises

Per ui-sdk docs:

- `Switch` renders a button with the `switch` role plus a hidden native checkbox that takes part in forms, following the WAI-ARIA switch pattern.
- Space turns it on or off; Enter submits its form and never toggles it; clicking its label toggles it.
- A form reset returns it to `defaultChecked`; a disabled `<fieldset>` disables it; a read-only switch still submits.
- `data-invalid` reaches the switch but not the thumb, so invalid styling stays on the track.
