# Plan 035: NumberInput — numeric field with step buttons

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do not update `plans/README.md`; the reviewer
> maintains it.
>
> **Drift check (run first)**: `git diff --stat a9e586b..HEAD -- packages apps/docs/content design`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW (reuses the PasswordInput group recipe)
- **Depends on**: plans/034-password-input (DONE)
- **Category**: migration (component build-out, cycle 35 — M batch)
- **Planned at**: commit `a9e586b`, 2026-11-20

## Why this matters

NumberInput is the precise-numeric entry (the Slider's complement) and the
second consumer of the group/affix recipe.

## Current state

- `packages/styles/src/password-input.css` — the group recipe exemplar
  (bordered root, borderless inner control, affix lanes, focus on the
  group via `:has(:focus-visible)`). Copy its structure.
- `packages/react/src/password-input/password-input.tsx` — the wrapper
  exemplar.
- `apps/docs/content/docs/meta.json` — `pages`:
  `["index", "accordion", "avatar", "badge", "button", "checkbox", "collapsible", "dialog", "field", "hover-card", "input", "kbd", "label", "link", "listbox", "menu", "meter", "password-input", "popover", "progress", "radio", "rating", "scroll-area", "segmented-control", "select", "separator", "slider", "switch", "tabs", "textarea", "timeline", "toast", "toggle", "tooltip"]`.

### ui-sdk NumberInput facts (from `packages/react/node_modules/@ui-sdk/react/docs/components/number-input.md`)

- Import: `import { NumberInput, NumberInputControl, NumberInputDecrement, NumberInputIncrement, NumberInputGroup } from "@ui-sdk/react/number-input"` (verify; `NumberInputScrubArea`/`NumberInputScrubAreaCursor` exist but are deferred).
- Composition: `NumberInput` (holds value; min/max/step) →
  `NumberInputGroup` → (`NumberInputDecrement`, `NumberInputControl`,
  `NumberInputIncrement`). Buttons repeat while held.
- Group states: `data-disabled`, `data-readonly`, `data-required`,
  `data-scrubbing`.
- Decrement/increment have no special state attributes listed — they are
  plain buttons.
- Enter/blur commits: parse, clamp, snap to step, format. Empty = null.

### Design rules that bite (mirror password-input.css)

- **Root `hashti-number-input`**: minimal (it is the form-group owner —
  same check as other roots; likely a wrapper div).
- **Group `hashti-number-input-group`**: the joined control — copy
  password-input's root recipe verbatim: flex, 44px, 1px
  `--hashti-border-strong-01`, control radius, layer-01, overflow hidden,
  border-color transition.
- **Control**: borderless inner input like password-input's (flex 1,
  transparent, 0 0.75rem padding, placeholder secondary, outline none).
  `text-align: start` (do not center).
- **Step buttons**: at the INLINE END, stacked vertically (a classic
  stepper) OR inline? Old Hashti had no number-input buttons; simplest
  consistent look: BOTH buttons stacked in a column lane at the inline
  end, divider `border-inline-start: 1px solid
  var(--hashti-border-subtle-00)`, each button `inline-size: 2.25rem;
  flex: 1; display: inline-flex; align-items: center; justify-content:
  center; border: none; background: transparent; color:
  var(--hashti-text-secondary); cursor: pointer;` hover (hover:hover) →
  `background: var(--hashti-background-hover); color:
  var(--hashti-text-primary);` `:focus-visible` → 2px ring at -2px offset
  (inside the clipped group — the password-input review established this).
  The lane itself: `display: flex; flex-direction: column; align-self:
  stretch; border-inline-start: 1px solid var(--hashti-border-subtle-00);`
  with a 1px divider between the two buttons
  (`border-block-end` on the first).
- **Focus on the group**: `.hashti-number-input-group:has(:focus-visible)`
  → 2px ring @2px (same as password-input's root).
- **States**: `[data-disabled]` → border/background/ink disabled (copy
  password-input's); `[data-readonly]` → dashed border + layer-02; no
  scrub styling this cycle.
- Colours only via `var(--hashti-*)`; a hex in component CSS is a bug.

## Commands you will need

| Purpose   | Command               | Expected on success |
| --------- | --------------------- | ------------------- |
| Install   | `bun install`         | exit 0              |
| Typecheck | `bun run typecheck`   | exit 0, no errors   |

## Scope

**In scope** (the only files you should modify or create):

- `packages/react/src/number-input/number-input.tsx` — create
- `packages/react/src/number-input/index.ts` — create
- `packages/react/src/index.tsx` — add the re-export line
- `packages/styles/src/number-input.css` — create
- `packages/styles/index.css` — add one import line
- `apps/docs/src/components/number-input-demo.tsx` — create
- `apps/docs/content/docs/number-input.mdx` — create
- `apps/docs/content/docs/meta.json` — add `"number-input"` to `pages`

**Out of scope** (do NOT touch, even though they look related):

- Scrub area styling — deferred
- Format/locale recipes — consumer recipes
- Mouse-wheel — behavior exists in ui-sdk
- Any lint/test infrastructure

## Git workflow

- Work on the branch checked out in your worktree
  (`particle/035-number-input`).
- Commit per logical step; plain imperative messages.
- Do NOT push, merge, or rebase.

## Steps

### Step 1: Create the NumberInput wrappers in `@hashti/react`

`packages/react/src/number-input/number-input.tsx` — the `join` helper
pattern (direct-re-export check on the root):

| Part | Class |
| --- | --- |
| `NumberInput` | `hashti-number-input` (or direct re-export) |
| `NumberInputGroup` | `hashti-number-input-group` |
| `NumberInputControl` | `hashti-number-input__control` |
| `NumberInputDecrement` | `hashti-number-input__step` |
| `NumberInputIncrement` | `hashti-number-input__step` (same class; both get `data-slot` from ui-sdk for any differentiation) |

Export all five from `./number-input` and the barrel.

**Verify**: `bun run typecheck` → exit 0.

### Step 2: Create the stylesheet and import it

`packages/styles/src/number-input.css` — the design-rules section above.

**Verify**: `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/number-input.css`
→ no matches; `grep -c "data-" packages/styles/src/number-input.css` →
≥ 3.

### Step 3: Docs demo component and page

`apps/docs/src/components/number-input-demo.tsx` — inline SVG
chevron/minus glyphs:

```tsx
"use client"

import { Field, FieldLabel } from "@hashti/react"
import { NumberInput, NumberInputControl, NumberInputDecrement, NumberInputGroup, NumberInputIncrement } from "@hashti/react"

function Minus() {
  return <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
}
function Plus() {
  return <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M8 3v10M3 8h10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
}

export function NumberInputDemo() {
  return (
    <Field name="quantity" style={{ maxWidth: 220 }}>
      <FieldLabel>Quantity</FieldLabel>
      <NumberInput defaultValue={1} min={1} max={99}>
        <NumberInputGroup>
          <NumberInputControl />
          <NumberInputDecrement aria-label="Decrease"><Minus /></NumberInputDecrement>
          <NumberInputIncrement aria-label="Increase"><Plus /></NumberInputIncrement>
        </NumberInputGroup>
      </NumberInput>
    </Field>
  )
}
```

(If the step buttons must wrap the control differently per the docs'
composition, follow the docs' DOM order and note it.)

`apps/docs/content/docs/number-input.mdx`:

```mdx
---
title: NumberInput
description: Enters a precise numeric value.
---

import { NumberInputDemo } from '../../src/components/number-input-demo'

## Usage

<NumberInputDemo client:load />

## Parts

| Part | Purpose |
| --- | --- |
| `NumberInput` | Holds the value; min/max/step. |
| `NumberInputGroup` | The joined control. |
| `NumberInputControl` | The native input; Enter/blur commits. |
| `NumberInputDecrement` / `NumberInputIncrement` | Step buttons; repeat while held. |

Styling lives in `@hashti/styles` under `.hashti-number-input*` — one bordered field with a stacked stepper lane.
```

`apps/docs/content/docs/meta.json` — insert `"number-input"` after
`"meter"` (alphabetical check against the live list).

**Verify**: `bun run typecheck` → exit 0.

## Test plan

No test runner exists in this repo; none is added by this plan. Verification
is: typecheck gates, the greps in Step 2, and the reviewer's rendered check
(step buttons work and repeat, commit-on-blur clamps/snap, group focus
ring, disabled/readonly, divider lane, minus/plus glyphs).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `bun run typecheck` exits 0 from the repo root
- [ ] `grep -rn "hashti-number-input" packages/react/src packages/styles/src`
  shows the wrapper classes and the stylesheet selectors
- [ ] `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/number-input.css`
  returns nothing
- [ ] `grep -n "number-input" packages/styles/index.css apps/docs/content/docs/meta.json`
  shows the import and the page entry
- [ ] `git status --porcelain` lists no files outside the in-scope list
- [ ] Work committed on the worktree branch, one commit per step

## STOP conditions

Stop and report back (do not improvise) if:

- Any of the five parts is not exported from `@ui-sdk/react/number-input`
  — quote the error.
- A step's verification fails twice after a reasonable fix attempt.
- The fix appears to require touching an out-of-scope file.

## Maintenance notes

- Scrub area and wheel styling land later.
- The stacked stepper lane is the template for time-input spinners.
