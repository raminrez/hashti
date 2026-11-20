---
sourcesHash: d3c83a5e7c287f6d09efc3555108754c0264405df4cc90b96f57156bbf58a6d5
id: color-picker
description: >-
  Choose a color by dragging across an area and along sliders, typing any CSS
  color, or picking a preset, with the value a CSS color string handled by
  ui-sdk.
status: discoverable
sources:
  - packages/react/src/color-picker/color-picker.tsx
  - packages/react/src/color-picker/index.ts
  - packages/styles/src/color-picker.css
examples:
  - apps/docs/content/docs/color-picker.mdx
---

# Color Picker

## Purpose

Chooses a color by dragging, typing or presets. Hashti wraps ui-sdk's twelve
`ColorPicker*` parts unchanged, adding `hashti-color-picker*` classes;
appearance lives in `packages/styles/src/color-picker.css`.

## When to use

- A brand or theme color. ui-sdk docs: "The value is a CSS color string, and
  every part edits it: an area for two channels at once, a slider per channel,
  a text input that reads any CSS color, and presets."
- Perceptually even choosing: `space="oklch"` with a `ColorPickerAreaCanvas`
  for the gamut edge no gradient can draw.
- Picking from the screen where the browser can: `ColorPickerEyeDropper`.

## When not to use

- A fixed palette of a few choices — preset swatches alone, or
  [Select](select.md), need less.
- A read-only color display — a `ColorPickerSwatch` alone, or a plain styled
  span, is simpler.

## Public settings

Hashti wraps and re-exports the twelve parts only; all props forward to
ui-sdk. The primitive is `@experimental` upstream.

- Root: `value`/`defaultValue`/`onValueChange` (every drag step) and
  `onValueCommit` (once, when the drag, key press or typed color ends — use
  it to save), `space` (`hsv` default | `hsl` | `srgb` | `oklch`), `format`,
  `gamut` (`"p3"` for wide-gamut screens, `false` to allow any color),
  `disabled`, `readOnly`, `required`, `name`, `form`, `controller`.
- Parts: `ColorPickerArea` takes `x`/`y` channels; `ColorPickerSlider` and
  `ColorPickerChannelInput` take `channel`; `ColorPickerSwatchItem` takes its
  preset `value`.
- Composition: every part is optional; give the area and sliders a size and
  their background variable (`--color-area-background`,
  `--color-slider-background`), which Hashti's stylesheet already does. Name
  the picker with `aria-label` or a Field label.

## States

ui-sdk sets `data-disabled`, `data-readonly`, `data-required`,
`data-out-of-gamut`, `data-orientation` and `data-channel` on the relevant
parts, `data-selected` on swatch items, and `data-unsupported` on the eye
dropper where the browser can't pick. Each part writes the color as
`--color-picker-color`. `packages/styles/src/color-picker.css` paints the area
and sliders from those variables, fills thumbs and swatches with
`--color-picker-color`, rings the selected preset, and hides the eye dropper
entirely under `[data-unsupported]`.

## Observable promises

Per ui-sdk docs:

- Without `defaultValue`, the picker starts at black.
- The parts keep a hue while the color turns gray or black, so dragging back
  out of a corner returns to the same hue.
- `ColorPickerInput` reads any CSS color on Enter or blur; text that isn't one
  goes back to the value. `ColorPickerChannelInput` sets its channel on Enter,
  blur or its arrows, in the units people read it in.
- A swatch item is selected while the value is its color, however either is
  written; the swatches are one tab stop and the arrow keys move between
  presets.
- While a drag holds a color past the gamut edge, the value is already the
  closest color inside it and every part has `data-out-of-gamut`; once the
  drag ends, the thumb moves to that color.
- The hidden input submits the value under `name`; a disabled picker submits
  nothing, and a form reset returns it to `defaultValue`. A color picker
  always has a value, so `required` only adds `data-required`.
- `ColorPickerEyeDropper` is disabled, with `data-unsupported`, in browsers
  that can't pick from the screen.
