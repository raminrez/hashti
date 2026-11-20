# Plan 056: ColorPicker — area, sliders, swatches

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
- **Risk**: MED (many optional parts; ui-sdk drives geometry via CSS vars —
  do not fight `--color-area-background`, `--color-slider-background`,
  `--color-picker-color`)
- **Depends on**: plans/054-calendar (DONE)
- **Category**: migration (component build-out, cycle 56)
- **Parallel lane**: Particle-6

## Why this matters

ColorPicker is the last heavy form control. ui-sdk does the color math and
exposes the paint through CSS variables — our styles frame them.

## Current state

- `packages/styles/src/slider.css` — the track/thumb exemplar.
- `packages/react/src/slider/slider.tsx` — the wrapper exemplar.
- `apps/docs/content/docs/meta.json` — insert `"color-picker"` after `"carousel"`.

### ui-sdk ColorPicker facts (READ the full docs page first)

- Import: `import { ColorPicker, ColorPickerArea, ColorPickerAreaCanvas, ColorPickerAreaThumb, ColorPickerSlider, ColorPickerSliderThumb, ColorPickerSwatch, ColorPickerInput, ColorPickerChannelInput, ColorPickerEyeDropper, ColorPickerSwatches, ColorPickerSwatchItem } from "@ui-sdk/react/color-picker"` (verify).
- `ColorPickerArea` edits two channels; its background comes from
  `--color-area-background` (give the area a size). `ColorPickerSlider`
  edits one `channel`, drawn by `--color-slider-background`.
- Every part writes `--color-picker-color`; thumbs/swatches fill with
  `background: var(--color-picker-color)`.
- `ColorPickerEyeDropper` shows `data-unsupported` where the browser can't.
- Parts carry `data-out-of-gamut` while a drag holds a color past the edge.
- Check the docs' Data Attributes section for per-part states.

### Design rules that bite (derived)

- **Root `hashti-color-picker`**: `display: flex; flex-direction: column;
  gap: 0.75rem; inline-size: 16rem;`
- **Area `hashti-color-picker-area`**: `position: relative; block-size:
  10rem; border-radius: var(--hashti-border-radius-08); overflow: hidden;`
  (canvas paints via `--color-area-background`).
- **Area thumb / slider thumb**: `position: absolute; inline-size: 1rem;
  block-size: 1rem; border-radius: 50%; border: 2px solid
  var(--hashti-layer-01); box-shadow: 0 0 0 1px
  var(--hashti-border-strong-01); background: var(--color-picker-color);
  transform: translate(-50%, -50%);` (thumb centered on the point).
- **Slider `hashti-color-picker-slider`**: the slider track recipe —
  `position: relative; block-size: 0.75rem; border-radius: 999px;`
  background from `--color-slider-background`; thumb rides it.
- **Swatch `hashti-color-picker-swatch`**: `inline-size: 1.75rem;
  block-size: 1.75rem; border-radius: var(--hashti-border-radius-08);
  background: var(--color-picker-color); border: 1px solid
  var(--hashti-border-subtle-00); cursor: pointer;` selected state per docs.
- **Swatches row**: `display: flex; gap: 0.375rem; flex-wrap: wrap;`
- **Inputs** (`hashti-color-picker-input`,
  `hashti-color-picker-channel-input`): the `hashti-input` control recipe at
  compact size.
- **EyeDropper**: quiet icon button; `[data-unsupported]` → `display: none`.
- Colours only via `var(--hashti-*)`; a hex in component CSS is a bug.

## Commands

| Purpose   | Command             | Expected |
| --------- | ------------------- | -------- |
| Install   | `bun install`       | exit 0   |
| Typecheck | `bun run typecheck` | exit 0   |

## Scope

**In scope** (only these):

- `packages/react/src/color-picker/color-picker.tsx` — create
- `packages/react/src/color-picker/index.ts` — create
- `packages/react/src/index.tsx` — add the re-export line
- `packages/styles/src/color-picker.css` — create
- `packages/styles/index.css` — add one import line
- `apps/docs/src/components/color-picker-demo.tsx` — create
- `apps/docs/content/docs/color-picker.mdx` — create
- `apps/docs/content/docs/meta.json` — add `"color-picker"`

**Out of scope**: p3 gamut recipes; alpha-only pickers; lint/test infra.

## Git workflow

- Branch `particle/056-color-picker` in your worktree.
- Commit per logical step; never push/merge/touch main.

## Steps

1. **Wrappers** — `join` helper pattern per part; export all + barrel.
   Verify: typecheck exit 0.
2. **Stylesheet** — rules above. Verify: no hex; `grep -c "data-"
   packages/styles/src/color-picker.css` → ≥ 4.
3. **Demo + page** — demo with area, hue slider, hex input, a swatches row
   (follow the docs' Usage structure; note deviations). meta.json entry.
   Verify: typecheck exit 0.

## Done criteria

- [ ] `bun run typecheck` exits 0
- [ ] `grep -rn "hashti-color-picker" packages/react/src packages/styles/src` hits
- [ ] no hex in `packages/styles/src/color-picker.css`
- [ ] import + meta entries present
- [ ] `git status --porcelain` clean of out-of-scope files
- [ ] one commit per step

## STOP conditions

- Any part not exported from `@ui-sdk/react/color-picker` — quote the error.
- `--color-picker-color` / area / slider background vars don't resolve —
  report what you found.
- A verification fails twice after a reasonable fix attempt.
- Fix needs an out-of-scope file.
