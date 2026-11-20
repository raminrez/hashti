# Plan 052: OTPInput — one-time-code slots

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do not update `plans/README.md`; the reviewer
> maintains it.
>
> **Drift check (run first)**: `git diff --stat <base>..HEAD -- packages apps/docs/content design`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED (one native input rendered as several boxes — caret/focus
  styling needs the data-fake-caret path)
- **Depends on**: plans/051-token-input (DONE)
- **Category**: migration (component build-out, cycle 52)
- **Parallel lane**: Particle-2

## Why this matters

OTPInput is the verification-code field. Its twist: ONE native input
displayed as N boxes — selection/caret/autofill are native, the boxes are
a presentation layer.

## Current state

- `packages/styles/src/number-input.css` — the grouped-control exemplar.
- `packages/react/src/number-input/number-input.tsx` — the wrapper
  exemplar.
- `apps/docs/content/docs/meta.json` — check the live list; insert
  `"otp-input"` alphabetically.

### ui-sdk OTPInput facts (from `packages/react/node_modules/@ui-sdk/react/docs/components/otp-input.md`)

- Import: `import { OTPInput, OTPInputGroup, OTPInputSlot, OTPInputSeparator } from "@ui-sdk/react/otp-input"` (verify).
- Composition: `OTPInput` (creates the ONE native input; `length`,
  `onChange`) → `OTPInputGroup` → `OTPInputSlot`×N (each shows the
  character at its zero-based `index`). `OTPInputSeparator` between
  groups. Groups/separators are presentation only — no extra fields or
  tab stops. `autocomplete="one-time-code"` on the native input.
- Root/group states: `data-complete`, `data-filled`, `data-disabled`,
  `data-focused`.
- Slot states: `data-filled`, `data-active` (the slot typing goes to —
  only while focused), `data-fake-caret` (active + empty — draw the
  blinking caret).
- READ the docs' Four Digits / Alphanumeric / Custom Pattern sections for
  props (`pattern`, `separator`, length).

### Design rules that bite (derived)

- **Root `hashti-otp-input`**: `display: flex; flex-direction: column;
gap: 0.5rem;` — hosts the visually-hidden native input (ui-sdk
  renders it; keep it functional: DO NOT `display: none` it — visually
  hidden via the ui-sdk's own class; check what it renders and don't
  fight it).
- **Group `hashti-otp-input-group`**: `display: flex; gap: 0.375rem;
align-items: center;`
- **Slot `hashti-otp-input-slot`**: a control box — `display: flex;
align-items: center; justify-content: center; inline-size: 2.5rem;
block-size: 2.75rem; border: 1px solid var(--hashti-border-strong-01);
border-radius: var(--hashti-control-radius); background:
var(--hashti-layer-01); color: var(--hashti-text-primary);
font-size: 1.125rem; font-weight: 500; font-variant-numeric:
tabular-nums; transition: border-color var(--hashti-duration-fast-01)
cubic-bezier(0.16, 1, 0.3, 1);`
  - `[data-active]` → `border-color: var(--hashti-focus);`
  - `[data-filled]` → `border-color: var(--hashti-border-subtle-01);`
  - `[data-fake-caret]` → the blinking caret: an `::after` — `content:
''; inline-size: 1px; block-size: 1.25rem; background:
var(--hashti-text-primary);` with a blink animation
    (`@keyframes` opacity 1↔0, 1s steps — the classic caret blink),
    `@media (prefers-reduced-motion: reduce)` → static.
- **Separator `hashti-otp-input-separator`**: `inline-size: 0.5rem;`
  text-align center, ink secondary.
- **States on root/group**: `[data-disabled]` → slots disabled recipe;
  `[data-complete]` → slots' border-color
  `var(--hashti-support-success);`
- Colours only via `var(--hashti-*)`; a hex in component CSS is a bug.

## Commands you will need

| Purpose   | Command             | Expected on success |
| --------- | ------------------- | ------------------- |
| Install   | `bun install`       | exit 0              |
| Typecheck | `bun run typecheck` | exit 0, no errors   |

## Scope

**In scope** (the only files you should modify or create):

- `packages/react/src/otp-input/otp-input.tsx` — create
- `packages/react/src/otp-input/index.ts` — create
- `packages/react/src/index.tsx` — add the re-export line
- `packages/styles/src/otp-input.css` — create
- `packages/styles/index.css` — add one import line
- `apps/docs/src/components/otp-input-demo.tsx` — create
- `apps/docs/content/docs/otp-input.mdx` — create
- `apps/docs/content/docs/meta.json` — add `"otp-input"` to `pages`

**Out of scope** (do NOT touch, even though they look related):

- Custom pattern recipes beyond the default digits — deferred
- Any lint/test infrastructure

## Git workflow

- Work on the branch checked out in your worktree
  (`particle/052-otp-input`).
- Commit per logical step; plain imperative messages.
- Do NOT push, merge, or rebase.

## Steps

### Step 1: Create the OTPInput wrappers in `@hashti/react`

`packages/react/src/otp-input/otp-input.tsx` — the `join` helper pattern
(direct-re-export checks; check class landing against the rendered DOM —
the date-input lesson; key on data-slot where needed):

| Part                | Class                                    |
| ------------------- | ---------------------------------------- |
| `OTPInput`          | `hashti-otp-input` (or direct re-export) |
| `OTPInputGroup`     | `hashti-otp-input-group`                 |
| `OTPInputSlot`      | `hashti-otp-input-slot`                  |
| `OTPInputSeparator` | `hashti-otp-input-separator`             |

Export all from `./otp-input` and the barrel.

**Verify**: `bun run typecheck` → exit 0.

### Step 2: Create the stylesheet and import it

`packages/styles/src/otp-input.css` — the design-rules section above.

**Verify**: `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/otp-input.css`
→ no matches; `grep -c "data-" packages/styles/src/otp-input.css` →
≥ 6.

### Step 3: Docs demo component and page

`apps/docs/src/components/otp-input-demo.tsx` — 6 slots, one separator
after 3:

```tsx
"use client";

import {
  OTPInput,
  OTPInputGroup,
  OTPInputSeparator,
  OTPInputSlot,
} from "@hashti/react";

export function OTPInputDemo() {
  return (
    <OTPInput
      length={6}
      aria-label="Verification code"
      onChange={(v) => console.log(v)}
    >
      <OTPInputGroup>
        {[0, 1, 2].map((i) => (
          <OTPInputSlot key={i} index={i} />
        ))}
      </OTPInputGroup>
      <OTPInputSeparator>–</OTPInputSeparator>
      <OTPInputGroup>
        {[3, 4, 5].map((i) => (
          <OTPInputSlot key={i} index={i} />
        ))}
      </OTPInputGroup>
    </OTPInput>
  );
}
```

(Adapt prop names to the docs and note it.)

`apps/docs/content/docs/otp-input.mdx`:

```mdx
---
title: OTPInput
description: Enters a one-time code across slots.
---

import { OTPInputDemo } from "../../src/components/otp-input-demo";

## Usage

<OTPInputDemo client:load />

## Parts

| Part                | Purpose                                              |
| ------------------- | ---------------------------------------------------- |
| `OTPInput`          | One native input behind the slots.                   |
| `OTPInputGroup`     | A run of slots.                                      |
| `OTPInputSlot`      | One character box; `data-active`, `data-fake-caret`. |
| `OTPInputSeparator` | A visual break between groups.                       |

Styling lives in `@hashti/styles` under `.hashti-otp-input*` — control boxes with a focus-blue active slot and a blinking fake caret.
```

`apps/docs/content/docs/meta.json` — insert `"otp-input"` alphabetically.

**Verify**: `bun run typecheck` → exit 0.

## Test plan

No test runner exists in this repo; none is added by this plan. Verification
is: typecheck gates, the greps in Step 2, and the reviewer's rendered check
(typing distributes across slots, active slot border, fake caret blinks,
complete state, paste, disabled).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `bun run typecheck` exits 0 from the repo root
- [ ] `grep -rn "hashti-otp-input" packages/react/src packages/styles/src`
      shows the wrapper classes and the stylesheet selectors
- [ ] `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/otp-input.css`
      returns nothing
- [ ] `grep -n "otp-input" packages/styles/index.css apps/docs/content/docs/meta.json`
      shows the import and the page entry
- [ ] `git status --porcelain` lists no files outside the in-scope list
- [ ] Work committed on the worktree branch, one commit per step

## STOP conditions

Stop and report back (do not improvise) if:

- Any part is not exported from `@ui-sdk/react/otp-input` — quote the
  error.
- The native input's hiding mechanism conflicts with the slots'
  presentation (report what ui-sdk renders).
- A step's verification fails twice after a reasonable fix attempt.
- The fix appears to require touching an out-of-scope file.

## Maintenance notes

- The fake-caret recipe is the blink pattern for future caret-like
  affordances.
