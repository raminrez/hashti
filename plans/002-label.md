# Plan 002: Add the Label component (ui-sdk label + Hashti styles)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do not update `plans/README.md`; the reviewer
> maintains it.
>
> **Drift check (run first)**: `git diff --stat 563e0f7..HEAD -- packages apps/docs/content`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/001-separator (DONE — established the file shape)
- **Category**: migration (component build-out, cycle 2)
- **Planned at**: commit `563e0f7`, 2026-11-19

## Why this matters

Label names any control and lets a press on the label reach it — the second
simplest component in the build-out and the first that wires a control to
another element. It reuses the file shape Separator established.

## Current state

- `packages/react/src/separator/separator.tsx` — the wrapper exemplar to
  match exactly (class-only wrapper, ui-sdk component underneath):

  ```tsx
  "use client"

  import type { ComponentProps } from "react"
  import { Separator as UiSeparator } from "@ui-sdk/react/separator"

  function Separator({ className, ...props }: ComponentProps<typeof UiSeparator>) {
    return <UiSeparator className={`hashti-separator${className ? ` ${className}` : ""}`} {...props} />
  }

  export { Separator }
  ```

- `packages/react/src/index.tsx` — barrel; each component adds one
  `export { X } from "./x"` line. Currently exports Button, Switch,
  Separator.
- `packages/styles/index.css` — layer statement
  (`@layer hashti.tokens, hashti.components;`) then one `@import` per
  component stylesheet, all `layer(hashti.components)`.
- `packages/styles/src/tokens.css` — tokens include `--hashti-fg`
  (primary ink), `--hashti-border-subtle-00`, plus bg/muted/border/primary/
  ring. Light `:root` block + `@media (prefers-color-scheme: dark)` block.
- `apps/docs/content/docs/meta.json` — `pages`:
  `["index", "button", "separator", "switch"]`.
- Kbd is **deferred** (ui-sdk ships no equivalent) — do not build it in this
  plan even though the program brief grouped it with Label.

### ui-sdk Label facts (from `packages/react/node_modules/@ui-sdk/react/docs/components/label.md`)

- Ready-made component: `import { Label } from "@ui-sdk/react/label"`.
  Renders a native `<label>`. `data-slot="label"`.
- `htmlFor` points at the control's `id`; for non-labelable controls
  (radio group, slider) ui-sdk names the control via `aria-labelledby` and a
  press focuses/checks it. Wrapping a control inside the label also works
  and needs no `id`.
- Props: `htmlFor` (native label) plus `debug?`. ui-sdk handles the press
  behavior — the wrapper adds nothing behavioral.
- A double click on the label doesn't select its text (ui-sdk handles it),
  so no `user-select: none` is needed in CSS.
- `className` passed to the part is merged by ui-sdk.

### Design rules that bite (from `design/DESIGN.md`, `design/css-conventions.md`, `design/extraction/tokens.md`)

- Label typography (DESIGN.md `label` role, extraction `label-01`):
  **14px / 20px line-height / weight 600** → `font-size: 0.875rem;
  line-height: 1.25rem; font-weight: 600`.
- Ink: label is primary ink → `var(--hashti-fg)`.
- Sentence case, stable labels — copy guidance, not CSS.
- Labels wrap: allow wrapping (default `white-space` behavior; do not set
  `white-space: nowrap`).
- Style the component's own class (`.hashti-label`); `data-slot="label"`
  stays on the DOM as ui-sdk emits it.
- Colours/spacings only via `var(--hashti-*)`; a hex value in a component
  stylesheet is a bug.
- No focus ring, no hover state: the label itself is not the focus target
  (the control it names is).

## Commands you will need

| Purpose   | Command               | Expected on success |
| --------- | --------------------- | ------------------- |
| Install   | `bun install`         | exit 0              |
| Typecheck | `bun run typecheck`   | exit 0, no errors   |

No lint setup and no test runner in this repo yet — out of scope; the
reviewer runs the rendered check.

## Scope

**In scope** (the only files you should modify or create):

- `packages/react/src/label/label.tsx` — create
- `packages/react/src/label/index.ts` — create
- `packages/react/src/index.tsx` — add the re-export line
- `packages/styles/src/label.css` — create
- `packages/styles/index.css` — add one import line
- `apps/docs/content/docs/label.mdx` — create
- `apps/docs/content/docs/meta.json` — add `"label"` to `pages`

**Out of scope** (do NOT touch, even though they look related):

- `packages/core/src/*` — ui-sdk ships the label primitive; no Hashti primitive
- `packages/styles/src/tokens.css` — no new tokens needed (label uses `--hashti-fg`)
- Kbd, FieldLabel / Field anatomy (separate later cycles)
- Any lint/test infrastructure

## Git workflow

- Work on the branch checked out in your worktree (`particle/002-label`).
- Commit per logical step; plain imperative messages, e.g.
  `label: add Label component`.
- Do NOT push, merge, or rebase.

## Steps

### Step 1: Create the Label wrapper in `@hashti/react`

`packages/react/src/label/label.tsx`:

```tsx
"use client"

import type { ComponentProps } from "react"
import { Label as UILabel } from "@ui-sdk/react/label"

function Label({ className, ...props }: ComponentProps<typeof UILabel>) {
  return <UILabel className={`hashti-label${className ? ` ${className}` : ""}`} {...props} />
}

export { Label }
```

The wrapper's only job is the `hashti-label` class; `htmlFor`, children and
every other prop pass through untouched.

`packages/react/src/label/index.ts`:

```ts
export { Label } from "./label"
```

`packages/react/src/index.tsx` — add at the end:

```tsx
export { Label } from "./label"
```

**Verify**: `bun run typecheck` → exit 0.

### Step 2: Create the stylesheet and import it

`packages/styles/src/label.css`:

```css
.hashti-label {
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 600;
  color: var(--hashti-fg);
}
```

No margins — spacing between a label and its control belongs to the layout
around them, not to the label.

`packages/styles/index.css` — add after the separator import:

```css
@import "./src/label.css" layer(hashti.components);
```

**Verify**: `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/label.css` → no matches.

### Step 3: Docs page

`apps/docs/content/docs/label.mdx`:

```mdx
---
title: Label
description: Names a control, and a press on the label reaches it.
---

import { Label } from '@hashti/react'

## Usage

<div style={{ display: 'grid', gap: 8 }}>
  <Label htmlFor="email">Email</Label>
  <input id="email" type="email" placeholder="you@example.com" />
</div>

## Props

| Prop | Type | Description |
| --- | --- | --- |
| `htmlFor` | `string` | The `id` of the control the label names. |
| `children` | `ReactNode` | The label text, or a wrapped control. |

A press on the label focuses the control it names. Styling lives in `@hashti/styles` under `.hashti-label`, with typography from the design label role (14px/20px, weight 600).
```

Match the MDX conventions of `apps/docs/content/docs/separator.mdx`. If the
inline `style` object is rejected by Astro's MDX, use the markup shape the
other pages use instead — do not add dependencies.

`apps/docs/content/docs/meta.json` — `pages` becomes
`["index", "button", "label", "separator", "switch"]`.

**Verify**: `bun run typecheck` → exit 0 (includes `apps/docs`' `astro sync && tsc --noEmit`).

## Test plan

No test runner exists in this repo; none is added by this plan. Verification
is: typecheck gates, the grep in Step 2, and the reviewer's rendered check
against the docs page (label present, `data-slot="label"`, press focuses the
input, typography matches 14px/600).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `bun run typecheck` exits 0 from the repo root
- [ ] `grep -rn "hashti-label" packages/react/src packages/styles/src` shows the wrapper class and the stylesheet selector
- [ ] `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/label.css` returns nothing
- [ ] `grep -n "label" packages/styles/index.css apps/docs/content/docs/meta.json` shows the import and the page entry
- [ ] `git status --porcelain` lists no files outside the in-scope list
- [ ] Work committed on the worktree branch, one commit per step

## STOP conditions

Stop and report back (do not improvise) if:

- `Label` is not exported from `@ui-sdk/react/label`, or the import fails to
  resolve — quote the exact error.
- The docs page cannot resolve `@hashti/react` imports — pre-existing
  breakage, not yours to fix.
- A step's verification fails twice after a reasonable fix attempt.
- The fix appears to require touching an out-of-scope file.

## Maintenance notes

- When the Field anatomy cycle lands, `FieldLabel` will be the field-scoped
  label; this standalone Label stays for controls outside fields. Reviewer
  should check the two don't get merged accidentally.
- Cycles 3+ copy this exact file shape.
