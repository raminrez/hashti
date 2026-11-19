# Plan 008: Add the Radio component (ui-sdk radio + Hashti styles)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do not update `plans/README.md`; the reviewer
> maintains it.
>
> **Drift check (run first)**: `git diff --stat ecf8e6f..HEAD -- packages apps/docs/content design`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: plans/007-checkbox (DONE)
- **Category**: migration (component build-out, cycle 8)
- **Planned at**: commit `ecf8e6f`, 2026-11-20

## Why this matters

Radio completes single-choice selection. It reuses the `hashti-choice` row
recipe and the checkbox mark recipes with the round-mark geometry, and adds
the group wrapper.

## Current state

- `packages/react/src/checkbox/checkbox.tsx` — the compound wrapper exemplar
  (Checkbox + CheckboxIndicator). Radio adds a third wrapper: RadioGroup.
- `packages/styles/src/checkbox.css` — the `hashti-choice` row recipe
  (44px label target) and the mark recipes. Radio reuses `hashti-choice`
  verbatim and adds round-mark rules.
- `apps/docs/src/components/checkbox-demo.tsx` — the compound docs pattern.
- `apps/docs/content/docs/meta.json` — `pages`:
  `["index", "avatar", "button", "checkbox", "input", "label", "separator", "switch", "textarea"]`.

### ui-sdk Radio facts (from `packages/react/node_modules/@ui-sdk/react/docs/components/radio.md`)

- Import: `import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/react/radio"`.
- Composition: `RadioGroup` → `label` → `Radio` → `RadioIndicator`.
- `RadioGroup` takes `defaultValue`/`value`/`onValueChange`; each `Radio`
  takes `value`.
- Data attributes: RadioGroup carries `data-disabled`/`data-readonly`/
  `data-required`; Radio carries `data-checked`/`data-unchecked` plus the
  group states; RadioIndicator mirrors Radio's.
- The indicator's dot is the consumer's content — or styled via the
  indicator element itself (this cycle styles the dot on the indicator
  element via `::after`-free approach: the indicator gets the dot as a
  background/child rule — see Step 2; no icon dependency).

### Design rules that bite (from `design/DESIGN.md` §Selection)

- **Mark**: 18px round (`1.125rem`, `border-radius: 9999px` — full-round is
  the radio's established shape; do NOT use the 5px mark radius), 1px
  control border (`var(--hashti-border-strong-01)`), `--hashti-layer-01`
  surface.
- **Dot**: 10px (`0.625rem`) selected dot in focus blue
  (`var(--hashti-focus)`); dot ink `var(--hashti-icon-on-color)` is not
  needed — the dot is the fill itself.
- **Selected fill**: the mark stays surface; the dot carries the selection
  (radio ≠ checkbox fill).
- **Press scale**: marks scale to 0.9 while pressed.
- **Focus ring**: `:focus-visible` → 2px `var(--hashti-focus)`, 2px offset,
  on the mark.
- **Row**: `hashti-choice` (44px label target) — reuse verbatim.
- **Disabled**: mark border `var(--hashti-border-disabled)`, surface
  `var(--hashti-button-disabled)`; row cursor `not-allowed` via `:has()`.
- Colours only via `var(--hashti-*)`; a hex in component CSS is a bug.

## Commands you will need

| Purpose   | Command               | Expected on success |
| --------- | --------------------- | ------------------- |
| Install   | `bun install`         | exit 0              |
| Typecheck | `bun run typecheck`   | exit 0, no errors   |

## Scope

**In scope** (the only files you should modify or create):

- `packages/react/src/radio/radio.tsx` — create
- `packages/react/src/radio/index.ts` — create
- `packages/react/src/index.tsx` — add the re-export line
- `packages/styles/src/radio.css` — create
- `packages/styles/index.css` — add one import line
- `apps/docs/src/components/radio-demo.tsx` — create
- `apps/docs/content/docs/radio.mdx` — create
- `apps/docs/content/docs/meta.json` — add `"radio"` to `pages`

**Out of scope** (do NOT touch, even though they look related):

- `packages/styles/src/checkbox.css` — `hashti-choice` is imported by
  `radio.css`? NO — `hashti-choice` is already global (checkbox.css is
  imported by index.css); radio.css only adds radio rules and does NOT
  redefine the row.
- Switch — its own cycle
- Field anatomy / invalid precedence — Field cycle

## Git workflow

- Work on the branch checked out in your worktree (`particle/008-radio`).
- Commit per logical step; plain imperative messages.
- Do NOT push, merge, or rebase.

## Steps

### Step 1: Create the Radio wrappers in `@hashti/react`

`packages/react/src/radio/radio.tsx`:

```tsx
"use client"

import type { ComponentProps } from "react"
import {
  Radio as UiRadio,
  RadioGroup as UiRadioGroup,
  RadioIndicator as UiRadioIndicator,
} from "@ui-sdk/react/radio"

function RadioGroup({ className, ...props }: ComponentProps<typeof UiRadioGroup>) {
  return <UiRadioGroup className={`hashti-radio-group${className ? ` ${className}` : ""}`} {...props} />
}

function Radio({ className, ...props }: ComponentProps<typeof UiRadio>) {
  return <UiRadio className={`hashti-radio${className ? ` ${className}` : ""}`} {...props} />
}

function RadioIndicator({ className, ...props }: ComponentProps<typeof UiRadioIndicator>) {
  return <UiRadioIndicator className={`hashti-radio__indicator${className ? ` ${className}` : ""}`} {...props} />
}

export { RadioGroup, Radio, RadioIndicator }
```

`packages/react/src/radio/index.ts`:

```ts
export { RadioGroup, Radio, RadioIndicator } from "./radio"
```

`packages/react/src/index.tsx` — add at the end:

```tsx
export { RadioGroup, Radio, RadioIndicator } from "./radio"
```

**Verify**: `bun run typecheck` → exit 0.

### Step 2: Create the stylesheet and import it

`packages/styles/src/radio.css`:

```css
.hashti-radio-group {
  display: grid;
  gap: 0;
}

.hashti-radio {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  inline-size: 1.125rem;
  block-size: 1.125rem;
  border: 1px solid var(--hashti-border-strong-01);
  border-radius: 9999px;
  background: var(--hashti-layer-01);
  cursor: pointer;
  transition:
    border-color var(--hashti-duration-fast-01) cubic-bezier(0.16, 1, 0.3, 1),
    transform var(--hashti-duration-fast-01) cubic-bezier(0.32, 0.72, 0, 1);
}

.hashti-radio__indicator {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 100%;
  block-size: 100%;
  border-radius: inherit;
}

.hashti-radio__indicator::before {
  content: "";
  inline-size: 0.625rem;
  block-size: 0.625rem;
  border-radius: 9999px;
  background: var(--hashti-focus);
  opacity: 0;
  transition: opacity var(--hashti-duration-fast-01) cubic-bezier(0.16, 1, 0.3, 1);
}

.hashti-radio[data-checked] .hashti-radio__indicator::before {
  opacity: 1;
}

.hashti-radio:active:not([data-disabled]) {
  transform: scale(0.9);
}

.hashti-radio:focus-visible {
  outline: 2px solid var(--hashti-focus);
  outline-offset: 2px;
}

.hashti-radio[data-disabled] {
  border-color: var(--hashti-border-disabled);
  background: var(--hashti-button-disabled);
  cursor: not-allowed;
}

.hashti-radio[data-disabled] .hashti-radio__indicator::before {
  background: var(--hashti-text-disabled);
}

.hashti-choice:has(.hashti-radio[data-disabled]) {
  cursor: not-allowed;
}
```

(The dot lives on the indicator's `::before` — no icon dependency, and the
indicator's `data-checked`/`data-starting-style`/`data-ending-style`
attributes stay available for later motion refinements.)

`packages/styles/index.css` — add after the checkbox import:

```css
@import "./src/radio.css" layer(hashti.components);
```

**Verify**: `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/radio.css` → no matches.

### Step 3: Docs demo component and page

`apps/docs/src/components/radio-demo.tsx`:

```tsx
"use client"

import { Radio, RadioGroup, RadioIndicator } from "@hashti/react"

export function RadioDemo() {
  return (
    <RadioGroup defaultValue="standard">
      <label className="hashti-choice">
        <Radio value="standard">
          <RadioIndicator />
        </Radio>
        Standard
      </label>
      <label className="hashti-choice">
        <Radio value="express">
          <RadioIndicator />
        </Radio>
        Express
      </label>
      <label className="hashti-choice">
        <Radio value="overnight" disabled>
          <RadioIndicator />
        </Radio>
        Overnight (unavailable)
      </label>
    </RadioGroup>
  )
}
```

`apps/docs/content/docs/radio.mdx`:

```mdx
---
title: Radio
description: Selects one option from a group.
---

import { RadioDemo } from '../../src/components/radio-demo'

## Usage

<RadioDemo client:load />

## Props

| Prop | Type | Description |
| --- | --- | --- |
| `value` | `string` | On `Radio`: the option's value. On `RadioGroup`: the selected value. |
| `defaultValue` | `string` | The initially selected option. |

Wrap each radio and its text in a `<label className="hashti-choice">`. Styling lives in `@hashti/styles` under `.hashti-radio` — an 18px round mark with a 10px dot in focus blue.
```

`apps/docs/content/docs/meta.json` — `pages` becomes
`["index", "avatar", "button", "checkbox", "input", "label", "radio", "separator", "switch", "textarea"]`.

**Verify**: `bun run typecheck` → exit 0.

## Test plan

No test runner exists in this repo; none is added by this plan. Verification
is: typecheck gates, the greps in Step 2, and the reviewer's rendered check
(18px round mark, 10px dot in focus blue on selection, 44px rows, group
selection changes on press, disabled option, focus ring).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `bun run typecheck` exits 0 from the repo root
- [ ] `grep -rn "hashti-radio" packages/react/src packages/styles/src` shows the wrapper classes and the stylesheet selectors
- [ ] `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/radio.css` returns nothing
- [ ] `grep -n "radio" packages/styles/index.css apps/docs/content/docs/meta.json` shows the import and the page entry
- [ ] `git status --porcelain` lists no files outside the in-scope list
- [ ] Work committed on the worktree branch, one commit per step

## STOP conditions

Stop and report back (do not improvise) if:

- `Radio`/`RadioGroup`/`RadioIndicator` is not exported from
  `@ui-sdk/react/radio` — quote the error.
- A step's verification fails twice after a reasonable fix attempt.
- The fix appears to require touching an out-of-scope file.

## Maintenance notes

- RadioGroup's `data-readonly`/`data-required` styling lands with the Field
  anatomy cycle.
- The indicator's `data-starting-style`/`data-ending-style` support a dot
  scale-in animation later (motion ladder); not this cycle.
