# Plan 034: PasswordInput — masked field with visibility toggle

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do not update `plans/README.md`; the reviewer
> maintains it.
>
> **Drift check (run first)**: `git diff --stat ec847d1..HEAD -- packages apps/docs/content design`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW (the group recipe is a Field-adjacent affix pattern)
- **Depends on**: plans/033-segmented-control (DONE)
- **Category**: migration (component build-out, cycle 34 — M batch)
- **Planned at**: commit `ec847d1`, 2026-11-20

## Why this matters

PasswordInput is the first grouped control (control + inline toggle in one
bordered field) — the affix recipe InputGroup and the date inputs reuse.

## Current state

- `packages/styles/src/input.css` — the control recipe the group borrows
  (border, radius, invalid/disabled states).
- `packages/react/src/input/input.tsx` — the wrapper exemplar.
- `apps/docs/content/docs/meta.json` — `pages`:
  `["index", "accordion", "avatar", "badge", "button", "checkbox", "collapsible", "dialog", "field", "hover-card", "input", "kbd", "label", "link", "listbox", "menu", "meter", "popover", "progress", "radio", "rating", "scroll-area", "segmented-control", "select", "separator", "slider", "switch", "tabs", "textarea", "timeline", "toast", "toggle", "tooltip"]`.

### ui-sdk PasswordInput facts (from `packages/react/node_modules/@ui-sdk/react/docs/components/password-input.md`)

- Import: `import { PasswordInput, PasswordInputControl, PasswordInputToggle } from "@ui-sdk/react/password-input"` (verify exact exports).
- Composition: `PasswordInput` (holds value + visibility; takes form
  options like `name`/`required`/`disabled`) → (`PasswordInputControl`
  — the native input; `PasswordInputToggle` — the show/hide button,
  `type="button"` so Enter still submits).
- Root/control states: `data-visible` (shown as text), `data-filled`,
  `data-disabled`, `data-readonly`, `data-required`, `data-capslock`
  (while Caps Lock is on and focused).
- The toggle switches `password` ↔ `text`.

### Design rules that bite (from input.css, the group affix pattern)

- **Root (the joined control)**: `display: flex; align-items: stretch;
inline-size: 100%; min-block-size: 2.75rem; border: 1px solid
var(--hashti-border-strong-01); border-radius: var(--hashti-control-radius);
background: var(--hashti-layer-01); overflow: hidden;
transition: border-color var(--hashti-duration-fast-01)
cubic-bezier(0.16, 1, 0.3, 1);`
- **Control (inner input)**: `flex: 1 1 auto; min-inline-size: 0; border:
none; background: transparent; padding: 0 0.75rem; color: var(--hashti-text-primary);
font-size: 1rem; line-height: 1.5rem;` `::placeholder` ink secondary;
  outline none (the ROOT carries focus).
- **Focus on the root**: `.hashti-password-input:has(:focus-visible)` →
  border-color stays (per DESIGN.md the ring is the affordance) + the
  standard ring `outline: 2px solid var(--hashti-focus); outline-offset:
2px;` on the root (the group is the control here). Also honor
  `[data-focus-visible]` if ui-sdk emits it on the root — include both
  selectors.
- **Toggle**: a quiet icon button at the inline end — `display: inline-flex;
align-items: center; justify-content: center; inline-size: 2.75rem;
border: none; border-inline-start: 1px solid
var(--hashti-border-subtle-00); background: transparent; color:
var(--hashti-text-secondary); cursor: pointer;` hover (hover:hover, not
  disabled) → `background: var(--hashti-background-hover); color:
var(--hashti-text-primary);` `:focus-visible` → the standard ring
  (2px/2px) — it is a real button.
- **States (root-level, keyed on ui-sdk attributes)**:
  - `[data-disabled]` → border `var(--hashti-border-disabled)`, background
    `var(--hashti-button-disabled)`, control+toggle ink
    `var(--hashti-text-disabled)`, cursor not-allowed.
  - `[data-readonly]` → control reads-only: `border-style: dashed` on the
    root, background `var(--hashti-layer-02)`.
  - `[data-invalid]` on an ancestor Field — no extra rule here; input.css's
    invalid pattern is control-level. Add
    `.hashti-field:has(.hashti-password-input[data-capslock])
.hashti-password-input { border-color: var(--hashti-support-warning); }`?
    NO — keep it minimal: `[data-capslock]` → root border-color
    `var(--hashti-support-warning)` (a warning hint, no icon this cycle).
- Colours only via `var(--hashti-*)`; a hex in component CSS is a bug.

## Commands you will need

| Purpose   | Command             | Expected on success |
| --------- | ------------------- | ------------------- |
| Install   | `bun install`       | exit 0              |
| Typecheck | `bun run typecheck` | exit 0, no errors   |

## Scope

**In scope** (the only files you should modify or create):

- `packages/react/src/password-input/password-input.tsx` — create
- `packages/react/src/password-input/index.ts` — create
- `packages/react/src/index.tsx` — add the re-export line
- `packages/styles/src/password-input.css` — create
- `packages/styles/index.css` — add one import line
- `apps/docs/src/components/password-input-demo.tsx` — create
- `apps/docs/content/docs/password-input.mdx` — create
- `apps/docs/content/docs/meta.json` — add `"password-input"` to `pages`

**Out of scope** (do NOT touch, even though they look related):

- New-password strength meter, caps-lock icon, shown-at-first recipes —
  deferred (behavior exists in ui-sdk)
- InputGroup, InputClear — their own cycle
- Any lint/test infrastructure

## Git workflow

- Work on the branch checked out in your worktree
  (`particle/034-password-input`).
- Commit per logical step; plain imperative messages.
- Do NOT push, merge, or rebase.

## Steps

### Step 1: Create the PasswordInput wrappers in `@hashti/react`

`packages/react/src/password-input/password-input.tsx` — the `join`
helper pattern (direct-re-export check on the root):

| Part                   | Class                                         |
| ---------------------- | --------------------------------------------- |
| `PasswordInput`        | `hashti-password-input` (or direct re-export) |
| `PasswordInputControl` | `hashti-password-input__control`              |
| `PasswordInputToggle`  | `hashti-password-input__toggle`               |

Export all three from `./password-input` and the barrel.

**Verify**: `bun run typecheck` → exit 0.

### Step 2: Create the stylesheet and import it

`packages/styles/src/password-input.css` — the design-rules section
above.

**Verify**: `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/password-input.css`
→ no matches; `grep -c "data-" packages/styles/src/password-input.css` →
≥ 4.

### Step 3: Docs demo component and page

`apps/docs/src/components/password-input-demo.tsx` — inline SVG eye (no
icon dependency):

```tsx
"use client";

import { Field, FieldLabel } from "@hashti/react";
import {
  PasswordInput,
  PasswordInputControl,
  PasswordInputToggle,
} from "@hashti/react";

function Eye() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path
        d="M1.5 8s2.5-4 6.5-4 6.5 4 6.5 4-2.5 4-6.5 4S1.5 8 1.5 8Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <circle
        cx="8"
        cy="8"
        r="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
      />
    </svg>
  );
}

export function PasswordInputDemo() {
  return (
    <Field name="password" style={{ maxWidth: 320 }}>
      <FieldLabel>Password</FieldLabel>
      <PasswordInput required>
        <PasswordInputControl placeholder="Enter your password" />
        <PasswordInputToggle aria-label="Show password">
          <Eye />
        </PasswordInputToggle>
      </PasswordInput>
    </Field>
  );
}
```

`apps/docs/content/docs/password-input.mdx`:

```mdx
---
title: PasswordInput
description: Masks text with a visibility toggle.
---

import { PasswordInputDemo } from "../../src/components/password-input-demo";

## Usage

<PasswordInputDemo client:load />

## Parts

| Part                   | Purpose                                            |
| ---------------------- | -------------------------------------------------- |
| `PasswordInput`        | The joined control; takes form options.            |
| `PasswordInputControl` | The native input.                                  |
| `PasswordInputToggle`  | Show/hide; `type="button"` so Enter still submits. |

Styling lives in `@hashti/styles` under `.hashti-password-input*` — one bordered field, the ring on the group, a quiet divider toggle. Caps Lock tints the border warning.
```

`apps/docs/content/docs/meta.json` — insert `"password-input"` after
`"password-input"`'s alphabetical neighbor `"pagination"` — check the live
list; alphabetical spot is after `"pagination"` if it exists, else after
`"menu"`/before `"popover"` per the actual list (look and insert
correctly).

**Verify**: `bun run typecheck` → exit 0.

## Test plan

No test runner exists in this repo; none is added by this plan. Verification
is: typecheck gates, the greps in Step 2, and the reviewer's rendered check
(toggle switches masking, ring on the group, divider between control and
toggle, disabled/readonly states, caps-lock border tint, Field wiring).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `bun run typecheck` exits 0 from the repo root
- [ ] `grep -rn "hashti-password-input" packages/react/src packages/styles/src`
      shows the wrapper classes and the stylesheet selectors
- [ ] `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/password-input.css`
      returns nothing
- [ ] `grep -n "password-input" packages/styles/index.css apps/docs/content/docs/meta.json`
      shows the import and the page entry
- [ ] `git status --porcelain` lists no files outside the in-scope list
- [ ] Work committed on the worktree branch, one commit per step

## STOP conditions

Stop and report back (do not improvise) if:

- Any of the three parts is not exported from
  `@ui-sdk/react/password-input` — quote the error.
- A step's verification fails twice after a reasonable fix attempt.
- The fix appears to require touching an out-of-scope file.

## Maintenance notes

- The group recipe (bordered field, inner borderless control, affix lane)
  is the template for InputGroup, date/time inputs and the search field.
- Strength meter and caps-lock icon land with the new-password cycle.
