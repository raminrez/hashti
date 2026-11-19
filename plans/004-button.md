# Plan 004: Button — all design variants, sizes and states (ui-sdk button + Hashti styles)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do not update `plans/README.md`; the reviewer
> maintains it.
>
> **Drift check (run first)**: `git diff --stat 41080f4..HEAD -- packages apps/docs/content`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED (touches the token baseline and replaces existing button styles)
- **Depends on**: plans/003-avatar (DONE)
- **Category**: migration (component build-out, cycle 4)
- **Planned at**: commit `41080f4`, 2026-11-19

## Why this matters

Button is the first component with a full variant matrix, the first action
control (focus ring at 3px offset, press scale), and the cycle that replaces
the hand-rolled token subset with the design token source. Everything
interactive after Button copies its state recipes.

## Current state

- `packages/react/src/avatar/avatar.tsx` — the wrapper exemplar: Hashti-owned
  props (`size`) mapped to `data-size`, class join, everything else
  pass-through. Button follows this pattern with `variant` + `size`.
- `packages/react/src/index.tsx` — barrel. First two lines create Button and
  Switch via `createParts` from `@hashti/core` primitives:

  ```tsx
  import { createParts } from "@ui-sdk/react/primitive"
  import { button, hashtiSwitch } from "@hashti/core"

  export const { Root: Button } = createParts(button, { root: "button" })
  export const { Root: Switch } = createParts(hashtiSwitch, { root: "button" })
  ```

  This cycle replaces the Button line with a real wrapper (Step 2) and
  deletes the now-unused `@hashti/core` button primitive (Step 3). The
  Switch line stays untouched.
- `packages/core/src/button.ts` — skeleton primitive with
  `variant?: "solid" | "outline" | "ghost"`. Superseded: ui-sdk's button
  ships the behavior, variants are Hashti-owned presentation. Delete it.
- `packages/styles/index.css`:

  ```css
  @layer hashti.tokens, hashti.components;
  @import "./src/tokens.css" layer(hashti.tokens);
  @import "./src/button.css" layer(hashti.components);
  @import "./src/switch.css" layer(hashti.components);
  @import "./src/separator.css" layer(hashti.components);
  @import "./src/label.css" layer(hashti.components);
  @import "./src/avatar.css" layer(hashti.components);
  ```

- `packages/styles/src/tokens.css` — hand-rolled token subset (~35 lines).
  Step 1 replaces it with the design token source.
- `packages/styles/src/button.css` — old solid/outline/ghost styles keyed on
  `[data-slot="button"]`. Step 4 replaces the whole file.
- `apps/docs/content/docs/button.mdx` — documents solid/outline/ghost.
  Step 5 rewrites it.
- `design/tokens.css` — the token source (READ-ONLY, never copied into a
  package). Structure: `@layer hashti.tokens { :root, [data-theme="light"] {
  light } [data-theme="dark"] { dark } @media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]):not([data-theme="dark"]), [data-theme="system"] { dark } } }`.

### ui-sdk Button facts (from `packages/react/node_modules/@ui-sdk/react/docs/components/button.md`)

- Ready-made: `import { Button } from "@ui-sdk/react/button"`. Renders a
  native `<button>` with `type="button"` default; `data-slot="button"`.
- Pending: return a Promise from `onClick` → `data-pending`, `aria-busy`,
  focus retained, presses ignored. `pendingAnnouncement?` customizes the
  announcement.
- Disabled: `disabled` (native) or `disabled` + `focusableWhenDisabled`
  (aria-disabled, stays in tab order). `data-disabled` present.
- `render={<a href/>}` for links; `type="submit"` / `"reset"` for forms.
- ui-sdk emits only `data-pending` / `data-disabled` — variants and sizes are
  Hashti's.

### Design rules that bite (from `design/DESIGN.md`, `design/extraction/components.md`, `design/css-conventions.md`)

- **Variants** (`data-variant`): `primary`, `secondary`, `tertiary`,
  `ghost`, `danger`, `danger-tertiary`, `danger-ghost`. Default `primary`.
- **Sizes** (`data-size`): `sm` 2rem/32px, `md` 2.75rem/44px (default),
  `lg` 3rem/48px — as `min-block-size` so content can grow the control
  (DESIGN.md: 44px minimum for ordinary controls).
- **Geometry** (extraction, frame base): `justify-content: center;
  gap: 0.5rem; min-inline-size: 0; max-inline-size: 100%;
  overflow-wrap: anywhere; padding: 0.25rem 1rem;
  border-radius: var(--hashti-control-radius) (0.625rem/10px);
  font-size: 0.875rem; font-weight: 500; line-height: 1.25rem`.
  Ghost: `padding-inline: 0.75rem`.
- **Variant matrix** (rest / hover / press / disabled; ink always
  `--hashti-text-*`, surfaces `--hashti-button-*`):

  | variant | rest | hover | press | disabled |
  | --- | --- | --- | --- | --- |
  | primary | bg `button-primary`, ink `text-on-color` | bg `button-primary-hover` | bg `button-primary-active` | bg `button-disabled`, ink `text-disabled` |
  | secondary | bg `button-secondary`, ink `text-primary` | bg `button-secondary-hover` | bg `button-secondary-active` | as primary |
  | tertiary | transparent, border 1px `border-strong-01`, ink `text-primary` | bg `button-tertiary-hover`, border kept | bg `button-tertiary-active` | transparent, border `border-disabled`, ink `text-disabled` |
  | ghost | transparent, no border, ink `text-primary` | bg `background-hover` | bg `background-active` | transparent, ink `text-disabled` |
  | danger | bg `button-danger-primary`, ink `text-on-color` | bg `button-danger-hover` | bg `button-danger-active` | as primary |
  | danger-tertiary | transparent, ink `button-danger-secondary` | bg `button-danger-hover`, ink `text-on-color` | bg `button-danger-active` | transparent, ink `text-disabled` |
  | danger-ghost | transparent, ink `button-danger-secondary` | bg `button-danger-hover`, ink `text-on-color` | bg `button-danger-active` | transparent, ink `text-disabled` |

- **Press scale**: `:active` → `transform: scale(0.97)` (sm 0.98, lg 0.96);
  press transition `var(--hashti-duration-fast-01)`
  `cubic-bezier(0.32, 0.72, 0, 1)`, release
  `var(--hashti-duration-moderate-02)` same curve. Implement with the
  transition-override trick: base transition moderate-02, `:active` sets
  `transition-duration: var(--hashti-duration-fast-01)`.
- **Focus ring** (action controls): `:focus-visible` →
  `outline: 2px solid var(--hashti-focus); outline-offset: 3px;`
  never box-shadow. Present on `:focus-visible` only.
- **Hover guard**: hover styles inside `@media (hover: hover)`.
- **Pending**: `[data-pending]` → `cursor: progress`. (The spinner-swap
  markup is deferred until a Spinner exists; do not hide the ink.)
- **Exclude instead of override**: `[data-hovered]:not(...)` style ordering —
  e.g. disabled styles must not need to undo hover; use
  `:hover`/`:active` rules scoped with `:not([data-disabled])` where the two
  would collide.
- Colours only via `var(--hashti-*)`; a hex in component CSS is a bug.

## Commands you will need

| Purpose   | Command               | Expected on success |
| --------- | --------------------- | ------------------- |
| Install   | `bun install`         | exit 0              |
| Typecheck | `bun run typecheck`   | exit 0, no errors   |

## Scope

**In scope** (the only files you should modify or create):

- `packages/styles/index.css` — swap the tokens import (Step 1)
- `packages/styles/src/tokens.css` — delete (Step 1)
- `packages/styles/src/label.css` — token renames only (Step 1)
- `packages/styles/src/avatar.css` — token renames only (Step 1)
- `packages/styles/src/switch.css` — token renames only (Step 1)
- `packages/core/src/button.ts` — delete (Step 3)
- `packages/core/src/index.ts` — remove the button export (Step 3)
- `packages/react/src/button/button.tsx` — create (Step 4)
- `packages/react/src/button/index.ts` — create (Step 4)
- `packages/react/src/index.tsx` — replace the Button export (Step 4)
- `packages/styles/src/button.css` — replace whole file (Step 5)
- `apps/docs/content/docs/button.mdx` — rewrite (Step 6)

**Out of scope** (do NOT touch, even though they look related):

- `packages/core/src/switch.ts` and the Switch component — its cycle comes later
- Spinner / pending content swap markup — deferred until a Spinner exists
- Icon-only buttons (`data-icon-only`) — deferred refinement
- `design/tokens.css` — read-only reference; import it, never edit or copy it
- Any lint/test infrastructure

## Git workflow

- Work on the branch checked out in your worktree (`particle/004-button`).
- Commit per logical step; plain imperative messages.
- Do NOT push, merge, or rebase.

## Steps

### Step 1: Token baseline — import the design token source

1. In `packages/styles/index.css` replace the first import:

```css
@import "../../design/tokens.css" layer(hashti.tokens);
```

2. Delete `packages/styles/src/tokens.css`.
3. Migrate the component stylesheets to design token names (grep each file
   for the old names; every occurrence maps as below):

| old name | design name | used in |
| --- | --- | --- |
| `--hashti-fg` | `--hashti-text-primary` | label.css |
| `--hashti-muted` | `--hashti-layer-accent-01` | avatar.css, switch.css |
| `--hashti-border` | `--hashti-border-subtle-00` | switch.css |
| `--hashti-primary` | `--hashti-support-success` | switch.css (checked track) |
| `--hashti-ring` | `--hashti-focus` | switch.css |

4. In `switch.css` also replace the two hard-coded values (hex in component
   CSS is a bug): the thumb `background: #fff` →
   `var(--hashti-icon-on-color)`; the thumb `box-shadow: 0 1px 2px rgb(0 0 0 / 0.2)` →
   `none` (drop it — no shadow token is justified for a thumb this size).

**Verify**:

- `grep -rn "hashti-fg\|hashti-muted\|hashti-ring\|hashti-primary\b\|hashti-border\b" packages/styles/src` → no matches
- `grep -c "#fff\|#[0-9a-fA-F]{3}" packages/styles/src/switch.css` → 0
- `bun run typecheck` → exit 0

### Step 2: Create the Button wrapper in `@hashti/react`

`packages/react/src/button/button.tsx`:

```tsx
"use client"

import type { ComponentProps } from "react"
import { Button as UiButton } from "@ui-sdk/react/button"

type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "ghost"
  | "danger"
  | "danger-tertiary"
  | "danger-ghost"

type ButtonSize = "sm" | "md" | "lg"

interface ButtonProps extends ComponentProps<typeof UiButton> {
  variant?: ButtonVariant
  size?: ButtonSize
}

function Button({ variant = "primary", size = "md", className, ...props }: ButtonProps) {
  return (
    <UiButton
      className={`hashti-button${className ? ` ${className}` : ""}`}
      data-variant={variant}
      data-size={size}
      {...props}
    />
  )
}

export { Button }
```

`packages/react/src/button/index.ts`:

```ts
export { Button } from "./button"
```

**Verify**: `bun run typecheck` → exit 0 (the barrel still references the
old export until Step 3 — if typecheck runs before the barrel edit, expect
the old Button to still work; do the barrel edit in the same step if
needed).

### Step 3: Point the barrel at the wrapper; delete the core primitive

`packages/react/src/index.tsx` — remove `button` from the `@hashti/core`
import (keep `hashtiSwitch`), remove the `createParts` Button line, add:

```tsx
export { Button } from "./button"
```

Delete `packages/core/src/button.ts` and remove its export from
`packages/core/src/index.ts` (which then exports only `hashtiSwitch`).

**Verify**: `bun run typecheck` → exit 0; `grep -rn "solid" packages/core/src` → no matches.

### Step 4: Replace `packages/styles/src/button.css`

Whole file. The variant matrix and geometry come from the table above:

```css
.hashti-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-block-size: 2.75rem;
  min-inline-size: 0;
  max-inline-size: 100%;
  overflow-wrap: anywhere;
  padding: 0.25rem 1rem;
  border: 1px solid transparent;
  border-radius: var(--hashti-control-radius);
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.25rem;
  cursor: pointer;
  transition:
    transform var(--hashti-duration-moderate-02) cubic-bezier(0.32, 0.72, 0, 1);
}

.hashti-button[data-size="sm"] { min-block-size: 2rem; }
.hashti-button[data-size="lg"] { min-block-size: 3rem; }

.hashti-button:focus-visible {
  outline: 2px solid var(--hashti-focus);
  outline-offset: 3px;
}

.hashti-button[data-pending] {
  cursor: progress;
}

.hashti-button[data-disabled] {
  cursor: not-allowed;
}

@media (hover: hover) {
  .hashti-button[data-variant="primary"]:hover:not([data-disabled]) { background: var(--hashti-button-primary-hover); }
  .hashti-button[data-variant="secondary"]:hover:not([data-disabled]) { background: var(--hashti-button-secondary-hover); }
  .hashti-button[data-variant="tertiary"]:hover:not([data-disabled]) { background: var(--hashti-button-tertiary-hover); }
  .hashti-button[data-variant="ghost"]:hover:not([data-disabled]) { background: var(--hashti-background-hover); }
  .hashti-button[data-variant="danger"]:hover:not([data-disabled]) { background: var(--hashti-button-danger-hover); }
  .hashti-button[data-variant="danger-tertiary"]:hover:not([data-disabled]),
  .hashti-button[data-variant="danger-ghost"]:hover:not([data-disabled]) {
    background: var(--hashti-button-danger-hover);
    color: var(--hashti-text-on-color);
  }
}

.hashti-button:active:not([data-disabled]) {
  transition-duration: var(--hashti-duration-fast-01);
  transform: scale(0.97);
}
.hashti-button[data-size="sm"]:active:not([data-disabled]) { transform: scale(0.98); }
.hashti-button[data-size="lg"]:active:not([data-disabled]) { transform: scale(0.96); }

.hashti-button[data-variant="primary"],
.hashti-button[data-variant="danger"] {
  background: var(--hashti-button-primary);
  color: var(--hashti-text-on-color);
}
.hashti-button[data-variant="danger"] { background: var(--hashti-button-danger-primary); }

.hashti-button[data-variant="secondary"] {
  background: var(--hashti-button-secondary);
  color: var(--hashti-text-primary);
}

.hashti-button[data-variant="tertiary"] {
  border-color: var(--hashti-border-strong-01);
  color: var(--hashti-text-primary);
}

.hashti-button[data-variant="ghost"],
.hashti-button[data-variant="danger-tertiary"],
.hashti-button[data-variant="danger-ghost"] {
  background: transparent;
  color: var(--hashti-text-primary);
}

.hashti-button[data-variant="danger-tertiary"],
.hashti-button[data-variant="danger-ghost"] {
  color: var(--hashti-button-danger-secondary);
}

.hashti-button[data-variant="ghost"] { padding-inline: 0.75rem; }

.hashti-button[data-variant="primary"][data-disabled],
.hashti-button[data-variant="secondary"][data-disabled],
.hashti-button[data-variant="danger"][data-disabled] {
  background: var(--hashti-button-disabled);
  color: var(--hashti-text-disabled);
  border-color: transparent;
}

.hashti-button[data-variant="tertiary"][data-disabled] {
  background: transparent;
  border-color: var(--hashti-border-disabled);
  color: var(--hashti-text-disabled);
}

.hashti-button[data-variant="ghost"][data-disabled],
.hashti-button[data-variant="danger-tertiary"][data-disabled],
.hashti-button[data-variant="danger-ghost"][data-disabled] {
  background: transparent;
  color: var(--hashti-text-disabled);
}
```

If `bun run typecheck` cannot see CSS (it cannot) — the verification for this
step is the greps and the reviewer's rendered check.

**Verify**:

- `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/button.css` → no matches
- `grep -c "data-variant" packages/styles/src/button.css` → ≥ 12
- `grep -n "outline-offset: 3px" packages/styles/src/button.css` → 1 match

### Step 5: Docs page

Rewrite `apps/docs/content/docs/button.mdx`:

```mdx
---
title: Button
description: Runs an action, shows that it's working, and stays reachable when disabled.
---

import { Button } from '@hashti/react'

## Variants

<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
  <Button>Primary</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="tertiary">Tertiary</Button>
  <Button variant="ghost">Ghost</Button>
  <Button variant="danger">Danger</Button>
  <Button variant="danger-tertiary">Danger tertiary</Button>
  <Button variant="danger-ghost">Danger ghost</Button>
</div>

## Sizes

<div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
  <Button size="sm">Small</Button>
  <Button>Medium</Button>
  <Button size="lg">Large</Button>
</div>

## States

<Button disabled>Disabled</Button>

## Props

| Prop | Type | Description |
| --- | --- | --- |
| `variant` | `"primary" \| "secondary" \| "tertiary" \| "ghost" \| "danger" \| "danger-tertiary" \| "danger-ghost"` | Visual style. Default `primary`. |
| `size` | `"sm" \| "md" \| "lg"` | Minimum height: 32/44/48px. Default `md`. |
| `disabled` | `boolean` | Stops presses. |
| `pendingAnnouncement` | `string` | What screen readers hear after a second of pending. |

Button owns its pending state: return a Promise from `onClick` and the button shows `data-pending`, keeps focus, and ignores further presses until it settles.
```

Button is root-only — no demo component needed (the compound-parts rule does
not apply).

**Verify**: `bun run typecheck` → exit 0.

## Test plan

No test runner exists in this repo; none is added by this plan. Verification
is: typecheck gates, the greps in Steps 1/3/4, and the reviewer's rendered
check (all 7 variants against the matrix, sizes 32/44/48, focus ring 3px
offset, press scale, disabled matrix, pending cursor, and that the
label/avatar/switch/separator pages still render after the token migration).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `bun run typecheck` exits 0 from the repo root
- [ ] `grep -rn "hashti-fg\|hashti-muted\|hashti-ring" packages/styles/src` returns nothing
- [ ] `test ! -f packages/styles/src/tokens.css && test ! -f packages/core/src/button.ts` → both gone
- [ ] `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/button.css packages/styles/src/switch.css` returns nothing
- [ ] `grep -c "data-variant" packages/styles/src/button.css` → ≥ 12
- [ ] `git status --porcelain` lists no files outside the in-scope list
- [ ] Work committed on the worktree branch, one commit per step

## STOP conditions

Stop and report back (do not improvise) if:

- `../../design/tokens.css` does not resolve from `packages/styles/index.css`,
  or a token name listed in Step 1/Step 4 is missing from
  `design/tokens.css` — quote the grep output.
- The Switch page renders broken after the token rename (the mapping table
  changes switch colors to design values — report what you see, do not
  pick different tokens).
- A step's verification fails twice after a reasonable fix attempt.
- The fix appears to require touching an out-of-scope file.

## Maintenance notes

- The token baseline (Step 1) is the last component cycle that touches token
  plumbing: from cycle 5 on, every `--hashti-*` value comes from
  `design/tokens.css` and component CSS never adds tokens.
- Icon-only buttons and the pending spinner-swap are deferred; when they
  land they extend `button.css`, not the wrapper.
- Reviewer should scrutinize: the variant matrix against
  `design/extraction/components.md` (rest/hover/press/disabled per variant),
  the 3px focus offset, and that hover styles stay inside the
  `(hover: hover)` guard.
