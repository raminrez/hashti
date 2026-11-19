# Plan 005: Add the Input component (ui-sdk input + Hashti styles)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do not update `plans/README.md`; the reviewer
> maintains it.
>
> **Drift check (run first)**: `git diff --stat 01a47e2..HEAD -- packages apps/docs/content`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: plans/004-button (DONE)
- **Category**: migration (component build-out, cycle 5)
- **Planned at**: commit `01a47e2`, 2026-11-20

## Why this matters

Input is the first form control and the first component styled by the
**field** rules of the design system: control border, entered-text
typography, the field focus ring (2px offset, not the action 3px), and the
read-only/invalid/disabled treatments. It unblocks Textarea and the
Checkbox/Radio/Switch family.

## Current state

- `packages/react/src/button/button.tsx` — the wrapper exemplar with
  Hashti-owned props mapped to data attributes. Input has NO Hashti-owned
  props (no variant/size): a field is a field. The wrapper is class-only.
- `packages/styles/index.css` — imports `../../design/tokens.css` under
  `hashti.tokens` (since cycle 4), then one component stylesheet per
  `hashti.components` import. Component CSS never adds tokens.
- `apps/docs/content/docs/meta.json` — `pages`:
  `["index", "avatar", "button", "label", "separator", "switch"]`.

### ui-sdk Input facts (from `packages/react/node_modules/@ui-sdk/react/docs/components/input.md`)

- Ready-made: `import { Input } from "@ui-sdk/react/input"`. Renders a
  native `<input>`; `data-slot="input"`.
- Data attributes on the input: `data-filled`, `data-disabled`,
  `data-readonly`, `data-required`. Validation sets `aria-invalid` on the
  input (the Field owns `data-invalid` on its own parts).
- `value`/`defaultValue`/`onValueChange` with change reasons; `controller`;
  native attributes pass through.
- `InputGroup` and `InputClear` are separate composition parts — **deferred**
  in this cycle (they are a composition family, and Clear needs an icon).
- Works inside a Field for label/description/errors — the Field anatomy is a
  separate future cycle; this cycle styles the control itself.

### Design rules that bite (from `design/DESIGN.md`, `design/css-conventions.md`, `design/extraction/`)

- **Control border**: 1px solid `--hashti-border-strong-01`
  (#7f8795 / #7d8493) — "an input border in the control-border color, not
  the subtler surface divider" (DESIGN.md Shapes).
- **Surface**: `--hashti-layer-01` (#ffffff / #22242a).
- **Radius**: control 10px → `var(--hashti-control-radius)`.
- **Size**: ordinary control minimum → `min-block-size: 2.75rem` (44px).
  No size prop.
- **Typography** (DESIGN.md `input` role — entered text): 16px / weight 400 /
  24px line-height → `font-size: 1rem; line-height: 1.5rem`. The Readable
  Value Rule: never shrink entered text to fit.
- **Padding**: `padding: 0 0.75rem` (spacing-04 inline).
- **Focus ring** (fields and text): `:focus-visible` →
  `outline: 2px solid var(--hashti-focus); outline-offset: 2px;`
  (2px offset for fields — the action 3px does NOT apply here).
- **Invalid**: `aria-invalid="true"` → border
  `var(--hashti-support-error)`. (The recovery band around it is Field
  anatomy — later cycle.)
- **Read-only**: `data-readonly` → dashed border +
  `var(--hashti-layer-accent-01)` surface (ui-sdk-patterns: "read-only
  appearance (dashed border, accent surface)"); stays focusable and
  copyable — do not add `cursor: not-allowed`.
- **Disabled**: `data-disabled` → `var(--hashti-button-disabled)` surface,
  `var(--hashti-border-disabled)` border, `var(--hashti-text-disabled)` ink,
  `cursor: not-allowed`.
- **Placeholder**: `::placeholder` → `var(--hashti-text-secondary)`,
  `opacity: 1`.
- Colours only via `var(--hashti-*)`; a hex in component CSS is a bug.

## Commands you will need

| Purpose   | Command               | Expected on success |
| --------- | --------------------- | ------------------- |
| Install   | `bun install`         | exit 0              |
| Typecheck | `bun run typecheck`   | exit 0, no errors   |

## Scope

**In scope** (the only files you should modify or create):

- `packages/react/src/input/input.tsx` — create
- `packages/react/src/input/index.ts` — create
- `packages/react/src/index.tsx` — add the re-export line
- `packages/styles/src/input.css` — create
- `packages/styles/index.css` — add one import line
- `apps/docs/content/docs/input.mdx` — create
- `apps/docs/content/docs/meta.json` — add `"input"` to `pages`

**Out of scope** (do NOT touch, even though they look related):

- `InputGroup`, `InputClear` — deferred composition family
- Field anatomy (FieldLabel/FieldDescription/FieldError, recovery band) — later cycle
- Password/number/search/file variants — later cycles
- `packages/core/src/*` — ui-sdk ships the input primitive

## Git workflow

- Work on the branch checked out in your worktree (`particle/005-input`).
- Commit per logical step; plain imperative messages.
- Do NOT push, merge, or rebase.

## Steps

### Step 1: Create the Input wrapper in `@hashti/react`

`packages/react/src/input/input.tsx`:

```tsx
"use client"

import type { ComponentProps } from "react"
import { Input as UiInput } from "@ui-sdk/react/input"

function Input({ className, ...props }: ComponentProps<typeof UiInput>) {
  return <UiInput className={`hashti-input${className ? ` ${className}` : ""}`} {...props} />
}

export { Input }
```

`packages/react/src/input/index.ts`:

```ts
export { Input } from "./input"
```

`packages/react/src/index.tsx` — add at the end:

```tsx
export { Input } from "./input"
```

**Verify**: `bun run typecheck` → exit 0.

### Step 2: Create the stylesheet and import it

`packages/styles/src/input.css`:

```css
.hashti-input {
  inline-size: 100%;
  min-block-size: 2.75rem;
  padding: 0 0.75rem;
  border: 1px solid var(--hashti-border-strong-01);
  border-radius: var(--hashti-control-radius);
  background: var(--hashti-layer-01);
  color: var(--hashti-text-primary);
  font-size: 1rem;
  line-height: 1.5rem;
  transition: border-color var(--hashti-duration-fast-01) cubic-bezier(0.16, 1, 0.3, 1);
}

.hashti-input::placeholder {
  color: var(--hashti-text-secondary);
  opacity: 1;
}

.hashti-input:focus-visible {
  outline: 2px solid var(--hashti-focus);
  outline-offset: 2px;
}

.hashti-input[aria-invalid="true"] {
  border-color: var(--hashti-support-error);
}

.hashti-input[data-readonly] {
  border-style: dashed;
  background: var(--hashti-layer-accent-01);
}

.hashti-input[data-disabled] {
  border-color: var(--hashti-border-disabled);
  background: var(--hashti-button-disabled);
  color: var(--hashti-text-disabled);
  cursor: not-allowed;
}
```

`packages/styles/index.css` — add after the avatar import:

```css
@import "./src/input.css" layer(hashti.components);
```

**Verify**: `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/input.css` → no matches.

### Step 3: Docs page

`apps/docs/content/docs/input.mdx`:

```mdx
---
title: Input
description: Enters short text, connected to your form or state.
---

import { Input } from '@hashti/react'

## Usage

<div style={{ display: 'grid', gap: 16, maxWidth: 320 }}>
  <Input aria-label="Username" placeholder="Username" />
  <Input aria-label="Website" defaultValue="hollisgrant.com" />
  <Input aria-label="Read-only" readOnly value="example.com/hollis" />
  <Input aria-label="Disabled" disabled defaultValue="Locked value" />
</div>

## Props

Input passes every native input prop through — `type`, `placeholder`,
`autoComplete`, `required` — plus ui-sdk's controlled state and change
reasons.

Styling lives in `@hashti/styles` under `.hashti-input`: control border, 44px minimum height, 16px entered text, field focus ring at a 2px offset.
```

`apps/docs/content/docs/meta.json` — `pages` becomes
`["index", "avatar", "button", "input", "label", "separator", "switch"]`.

**Verify**: `bun run typecheck` → exit 0.

## Test plan

No test runner exists in this repo; none is added by this plan. Verification
is: typecheck gates, the greps in Step 2, and the reviewer's rendered check
(control border color, 44px height, 16px entered text, focus ring 2px/2px,
placeholder ink, read-only dashed + accent surface, disabled treatment).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `bun run typecheck` exits 0 from the repo root
- [ ] `grep -rn "hashti-input" packages/react/src packages/styles/src` shows the wrapper class and the stylesheet selectors
- [ ] `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/input.css` returns nothing
- [ ] `grep -n "input" packages/styles/index.css apps/docs/content/docs/meta.json` shows the import and the page entry
- [ ] `git status --porcelain` lists no files outside the in-scope list
- [ ] Work committed on the worktree branch, one commit per step

## STOP conditions

Stop and report back (do not improvise) if:

- `Input` is not exported from `@ui-sdk/react/input`, or the import fails to
  resolve — quote the error.
- A token name used in Step 2 is missing from `design/tokens.css` — quote the
  grep output.
- A step's verification fails twice after a reasonable fix attempt.
- The fix appears to require touching an out-of-scope file.

## Maintenance notes

- When the Field anatomy cycle lands, the recovery band wraps this control;
  the invalid border recipe here (border-color only) stays.
- InputGroup/InputClear come back as a composition family with the search
  slice; the group's focus ring rule (`:has(input:focus-visible)`) belongs
  there.
