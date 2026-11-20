# Plan 018: Slider — track, indicator, thumb

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do not update `plans/README.md`; the reviewer
> maintains it.
>
> **Drift check (run first)**: `git diff --stat 7cb5262..HEAD -- packages apps/docs/content design`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: plans/017-accordion (DONE)
- **Category**: migration (component build-out, cycle 18)
- **Planned at**: commit `7cb5262`, 2026-11-20

## Why this matters

Slider is the continuous-input control and the first component whose hit
area is deliberately larger than its painted mark (design-system rule).

## Current state

- `packages/react/src/accordion/accordion.tsx` — the wrapper exemplar.
- `packages/styles/src/accordion.css` — the newest stylesheet exemplar.
- `apps/docs/content/docs/meta.json` — `pages`:
  `["index", "accordion", "avatar", "button", "checkbox", "dialog", "field", "input", "label", "popover", "radio", "select", "separator", "switch", "tabs", "textarea", "toast", "tooltip"]`.

### ui-sdk Slider facts (from `packages/react/node_modules/@ui-sdk/react/docs/components/slider.md`)

- Import: `import { Slider, SliderControl, SliderIndicator, SliderThumb, SliderTrack, SliderValue } from "@ui-sdk/react/slider"`.
- Composition: `Slider` → (`SliderValue`, `SliderControl` → `SliderTrack`
  → (`SliderIndicator`, `SliderThumb`)).
- The control handles presses; the track is the positioned box (thumbs and
  indicator are placed in percentages by inline styles — give the track a
  size); the indicator fills to the thumb (or between thumbs in a range).
- Each thumb contains a visually hidden `<input type="range">` that takes
  focus — **style focus on the thumb with `:has(:focus-visible)`**.
- States: `data-orientation`, `data-disabled`, `data-dragging` on every
  part.
- A single thumb is named by a FieldLabel or `aria-label` on the thumb.

### Design rules that bite (from `design/DESIGN.md`, old implementation, `design-system.md`)

- **Control (hit area)**: `block-size: 2rem; display: flex; align-items:
center; position: relative; inline-size: 100%;` — the hit area is
  deliberately taller than the rail (hit target ≠ painted mark).
- **Track (rail)**: `block-size: 0.25rem` (4px), full width, full-round,
  background `var(--hashti-border-subtle-00)`, `overflow: hidden` not
  needed.
- **Indicator (fill)**: `block-size: 0.25rem`, full-round, background
  `var(--hashti-focus)` (selection blue).
- **Thumb**: `inline-size: 1.125rem; block-size: 1.125rem;` full-round,
  `background: var(--hashti-layer-01)`, `border: 1px solid
var(--hashti-border-strong-01)`, `cursor: grab`;
  `[data-dragging]` → `cursor: grabbing`; grows to `1.25rem` on
  `:hover`/`[data-dragging]`/`:has(:focus-visible)` (the old measured
  grow-on-touch behavior).
- **Focus ring**: `:has(:focus-visible)` on the thumb → 2px
  `var(--hashti-focus)`, 2px offset (form control).
- **SliderValue**: helper typography (0.8125rem), ink
  `var(--hashti-text-secondary)`.
- **Disabled**: rail/indicator keep colors, thumb border
  `var(--hashti-border-disabled)`, cursor not-allowed on the control.
- Colours only via `var(--hashti-*)`; a hex in component CSS is a bug.

## Commands you will need

| Purpose   | Command             | Expected on success |
| --------- | ------------------- | ------------------- |
| Install   | `bun install`       | exit 0              |
| Typecheck | `bun run typecheck` | exit 0, no errors   |

## Scope

**In scope** (the only files you should modify or create):

- `packages/react/src/slider/slider.tsx` — create
- `packages/react/src/slider/index.ts` — create
- `packages/react/src/index.tsx` — add the re-export line
- `packages/styles/src/slider.css` — create
- `packages/styles/index.css` — add one import line
- `apps/docs/src/components/slider-demo.tsx` — create
- `apps/docs/content/docs/slider.mdx` — create
- `apps/docs/content/docs/meta.json` — add `"slider"` to `pages`

**Out of scope** (do NOT touch, even though they look related):

- Vertical orientation styling, multiple-thumb range styling, Field
  integration — deferred
- Number Input (the precise-entry alternative) — its own cycle if asked
- Any lint/test infrastructure

## Git workflow

- Work on the branch checked out in your worktree (`particle/018-slider`).
- Commit per logical step; plain imperative messages.
- Do NOT push, merge, or rebase.

## Steps

### Step 1: Create the Slider wrappers in `@hashti/react`

`packages/react/src/slider/slider.tsx` — the `join` helper pattern; parts
and classes (direct-re-export check on the Slider root):

| Part              | Class                                 |
| ----------------- | ------------------------------------- |
| `Slider`          | `hashti-slider` (or direct re-export) |
| `SliderValue`     | `hashti-slider__value`                |
| `SliderControl`   | `hashti-slider-control`               |
| `SliderTrack`     | `hashti-slider-track`                 |
| `SliderIndicator` | `hashti-slider-indicator`             |
| `SliderThumb`     | `hashti-slider-thumb`                 |

Export all six from `./slider` and the barrel.

**Verify**: `bun run typecheck` → exit 0.

### Step 2: Create the stylesheet and import it

`packages/styles/src/slider.css` — write the rules from the design-rules
section above: control (hit area), track, indicator, thumb (+ grow and
grab cursors), focus via `:has(:focus-visible)`, value typography,
disabled.

**Verify**: `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/slider.css` → no matches; `grep -c "data-" packages/styles/src/slider.css` → ≥ 4.

### Step 3: Docs demo component and page

`apps/docs/src/components/slider-demo.tsx`:

```tsx
"use client";

import {
  Slider,
  SliderControl,
  SliderIndicator,
  SliderThumb,
  SliderTrack,
  SliderValue,
} from "@hashti/react";

export function SliderDemo() {
  return (
    <Slider defaultValue={60} aria-label="Volume">
      <SliderValue />
      <SliderControl>
        <SliderTrack>
          <SliderIndicator />
          <SliderThumb />
        </SliderTrack>
      </SliderControl>
    </Slider>
  );
}
```

`apps/docs/content/docs/slider.mdx`:

```mdx
---
title: Slider
description: Picks a value along a track.
---

import { SliderDemo } from "../../src/components/slider-demo";

## Usage

<SliderDemo client:load />

## Parts

| Part              | Purpose                                       |
| ----------------- | --------------------------------------------- |
| `Slider`          | Holds the value; a group around the thumbs.   |
| `SliderValue`     | The formatted value.                          |
| `SliderControl`   | Where presses land; moves the nearest thumb.  |
| `SliderTrack`     | The rail; the positioned box.                 |
| `SliderIndicator` | Fills the track to the thumb.                 |
| `SliderThumb`     | What you drag; contains the accessible input. |

Styling lives in `@hashti/styles` under `.hashti-slider-*` — a 4px rail with a focus-blue fill and an 18px thumb that grows on touch.
```

`apps/docs/content/docs/meta.json` — insert `"slider"` after `"separator"`.

**Verify**: `bun run typecheck` → exit 0.

## Test plan

No test runner exists in this repo; none is added by this plan. Verification
is: typecheck gates, the greps in Step 2, and the reviewer's rendered check
(4px rail, focus-blue fill, 18px thumb growing on hover/drag, drag moves the
value, keyboard arrows on the thumb, focus ring via :has, value text).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `bun run typecheck` exits 0 from the repo root
- [ ] `grep -rn "hashti-slider" packages/react/src packages/styles/src` shows the wrapper classes and the stylesheet selectors
- [ ] `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/slider.css` returns nothing
- [ ] `grep -n "slider" packages/styles/index.css apps/docs/content/docs/meta.json` shows the import and the page entry
- [ ] `git status --porcelain` lists no files outside the in-scope list
- [ ] Work committed on the worktree branch, one commit per step

## STOP conditions

Stop and report back (do not improvise) if:

- Any of the six parts is not exported from `@ui-sdk/react/slider` — quote
  the error.
- A step's verification fails twice after a reasonable fix attempt.
- The fix appears to require touching an out-of-scope file.

## Maintenance notes

- Multiple-thumb ranges work through ui-sdk; the range styling (thumb
  spacing) lands when a range use-case asks.
- Vertical sliders are deferred.
