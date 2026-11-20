# Plan 007: Add the Checkbox component (ui-sdk checkbox + Hashti styles)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do not update `plans/README.md`; the reviewer
> maintains it.
>
> **Drift check (run first)**: `git diff --stat 4df75e3..HEAD -- packages apps/docs/content design`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: plans/006-textarea (DONE)
- **Category**: migration (component build-out, cycle 7)
- **Planned at**: commit `4df75e3`, 2026-11-20 (mark-radius token added at `82d7822`)

## Why this matters

Checkbox is the first choice control and the first component whose hit target
is a label row, not the control itself. It introduces the `hashti-choice` row
recipe that Radio and Switch reuse.

## Current state

- `packages/react/src/textarea/textarea.tsx` — the wrapper exemplar.
  Checkbox is a **compound** wrapper (root + indicator), like Avatar.
- `packages/styles/src/avatar.css` — the compound stylesheet exemplar
  (`.hashti-avatar` root + `.hashti-avatar__fallback` part).
- `apps/docs/src/components/avatar-demo.tsx` — the compound-parts docs
  pattern: composition lives in ONE React component because Astro renders
  React children as separate roots (root-only components never hit this).
- `apps/docs/content/docs/meta.json` — `pages`:
  `["index", "avatar", "button", "input", "label", "separator", "switch", "textarea"]`.
- `design/tokens.css` has `--hashti-border-radius-mark: 0.3125rem` (5px,
  added at `82d7822` per DESIGN.md's choice-mark rule).

### ui-sdk Checkbox facts (from `packages/react/node_modules/@ui-sdk/react/docs/components/checkbox.md`)

- Import: `import { Checkbox, CheckboxIndicator } from "@ui-sdk/react/checkbox"`.
- Composition: `Checkbox` → `CheckboxIndicator` (context-bound parts).
  Wrap the checkbox and its text in a `<label>`.
- The indicator shows while checked or mixed; its children are the consumer's
  glyph (e.g. an inline SVG check).
- `defaultChecked` / `checked` take `true`, `false`, `"indeterminate"`.
- Data attributes on the root: `data-checked`, `data-unchecked`,
  `data-indeterminate`, `data-disabled`, `data-readonly`, `data-required`.
- `agent: { actions: ["setChecked"] }` — bridge-ready.

### Design rules that bite (from `design/DESIGN.md` §Selection, `design/css-conventions.md`)

- **Mark**: 18px square (`1.125rem`), 5px corners
  (`var(--hashti-border-radius-mark)`), 1px control border
  (`var(--hashti-border-strong-01)`), `--hashti-layer-01` surface.
- **Selected fill**: focus blue — `var(--hashti-focus)` on both background
  and border when `data-checked` or `data-indeterminate`.
- **Glyph ink**: `var(--hashti-icon-on-color)`.
- **Press scale**: marks scale to **0.9** while pressed (DESIGN.md motion).
- **Focus ring**: `:focus-visible` → 2px `var(--hashti-focus)`, 2px offset,
  on the mark.
- **Hit target**: the label row keeps the 44px ordinary minimum — this cycle
  adds a `hashti-choice` row recipe (inline-flex, gap 0.5rem,
  min-block-size 2.75rem) in the checkbox stylesheet; Radio and Switch reuse
  it.
- **Disabled**: mark border `var(--hashti-border-disabled)`, surface
  `var(--hashti-button-disabled)`, glyph `var(--hashti-text-disabled)`;
  the row's cursor becomes `not-allowed` (via `:has()` on the label).
- **Invalid**: deferred to the Field anatomy cycle (error precedence over
  selected fill will be implemented there, per DESIGN.md).
- Colours only via `var(--hashti-*)`; a hex in component CSS is a bug.

## Commands you will need

| Purpose   | Command             | Expected on success |
| --------- | ------------------- | ------------------- |
| Install   | `bun install`       | exit 0              |
| Typecheck | `bun run typecheck` | exit 0, no errors   |

## Scope

**In scope** (the only files you should modify or create):

- `packages/react/src/checkbox/checkbox.tsx` — create
- `packages/react/src/checkbox/index.ts` — create
- `packages/react/src/index.tsx` — add the re-export line
- `packages/styles/src/checkbox.css` — create
- `packages/styles/index.css` — add one import line
- `apps/docs/src/components/checkbox-demo.tsx` — create
- `apps/docs/content/docs/checkbox.mdx` — create
- `apps/docs/content/docs/meta.json` — add `"checkbox"` to `pages`

**Out of scope** (do NOT touch, even though they look related):

- `packages/core/src/switch.ts` and the Switch component — its own cycle
- Field anatomy / invalid-checkbox precedence — Field cycle
- Radio, Switch — their own cycles (they reuse `hashti-choice`)
- `design/tokens.css` — the mark-radius token already exists

## Git workflow

- Work on the branch checked out in your worktree (`particle/007-checkbox`).
- Commit per logical step; plain imperative messages.
- Do NOT push, merge, or rebase.

## Steps

### Step 1: Create the Checkbox wrappers in `@hashti/react`

`packages/react/src/checkbox/checkbox.tsx`:

```tsx
"use client";

import type { ComponentProps } from "react";
import {
  Checkbox as UiCheckbox,
  CheckboxIndicator as UiCheckboxIndicator,
} from "@ui-sdk/react/checkbox";

function Checkbox({ className, ...props }: ComponentProps<typeof UiCheckbox>) {
  return (
    <UiCheckbox
      className={`hashti-checkbox${className ? ` ${className}` : ""}`}
      {...props}
    />
  );
}

function CheckboxIndicator({
  className,
  ...props
}: ComponentProps<typeof UiCheckboxIndicator>) {
  return (
    <UiCheckboxIndicator
      className={`hashti-checkbox__indicator${className ? ` ${className}` : ""}`}
      {...props}
    />
  );
}

export { Checkbox, CheckboxIndicator };
```

`packages/react/src/checkbox/index.ts`:

```ts
export { Checkbox, CheckboxIndicator } from "./checkbox";
```

`packages/react/src/index.tsx` — add at the end:

```tsx
export { Checkbox, CheckboxIndicator } from "./checkbox";
```

**Verify**: `bun run typecheck` → exit 0.

### Step 2: Create the stylesheet and import it

`packages/styles/src/checkbox.css`:

```css
.hashti-choice {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-block-size: 2.75rem;
  cursor: pointer;
  user-select: none;
}

.hashti-checkbox {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  inline-size: 1.125rem;
  block-size: 1.125rem;
  border: 1px solid var(--hashti-border-strong-01);
  border-radius: var(--hashti-border-radius-mark);
  background: var(--hashti-layer-01);
  color: var(--hashti-icon-on-color);
  cursor: pointer;
  transition:
    background-color var(--hashti-duration-fast-01)
      cubic-bezier(0.16, 1, 0.3, 1),
    border-color var(--hashti-duration-fast-01) cubic-bezier(0.16, 1, 0.3, 1),
    transform var(--hashti-duration-fast-01) cubic-bezier(0.32, 0.72, 0, 1);
}

.hashti-checkbox[data-checked],
.hashti-checkbox[data-indeterminate] {
  background: var(--hashti-focus);
  border-color: var(--hashti-focus);
}

.hashti-checkbox:active:not([data-disabled]) {
  transform: scale(0.9);
}

.hashti-checkbox:focus-visible {
  outline: 2px solid var(--hashti-focus);
  outline-offset: 2px;
}

.hashti-checkbox[data-disabled] {
  border-color: var(--hashti-border-disabled);
  background: var(--hashti-button-disabled);
  color: var(--hashti-text-disabled);
  cursor: not-allowed;
}

.hashti-choice:has(.hashti-checkbox[data-disabled]) {
  cursor: not-allowed;
}

.hashti-checkbox__indicator {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.hashti-checkbox__indicator > svg {
  inline-size: 0.75rem;
  block-size: 0.75rem;
}
```

`packages/styles/index.css` — add after the textarea import:

```css
@import "./src/checkbox.css" layer(hashti.components);
```

**Verify**: `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/checkbox.css` → no matches.

### Step 3: Docs demo component and page

`apps/docs/src/components/checkbox-demo.tsx` — compound parts compose in ONE
React tree (the Astro rule). Rows use the `hashti-choice` label class. The
check glyph is an inline SVG (no icon dependency):

```tsx
"use client";

import { Checkbox, CheckboxIndicator } from "@hashti/react";

function CheckGlyph() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true">
      <path
        d="M2 6.5 4.5 9 10 3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CheckboxDemo() {
  return (
    <div style={{ display: "grid", gap: 4 }}>
      <label className="hashti-choice">
        <Checkbox defaultChecked>
          <CheckboxIndicator>
            <CheckGlyph />
          </CheckboxIndicator>
        </Checkbox>
        Email me product updates
      </label>
      <label className="hashti-choice">
        <Checkbox>
          <CheckboxIndicator>
            <CheckGlyph />
          </CheckboxIndicator>
        </Checkbox>
        Subscribe to the newsletter
      </label>
      <label className="hashti-choice">
        <Checkbox defaultChecked="indeterminate">
          <CheckboxIndicator>
            <CheckGlyph />
          </CheckboxIndicator>
        </Checkbox>
        Select all notifications
      </label>
      <label className="hashti-choice">
        <Checkbox disabled defaultChecked>
          <CheckboxIndicator>
            <CheckGlyph />
          </CheckboxIndicator>
        </Checkbox>
        Managed by your organization
      </label>
    </div>
  );
}
```

(For the indeterminate row the glyph still renders the check — ui-sdk shows
the indicator for both checked and mixed; a distinct dash glyph is a
consumer refinement, not this cycle's scope.)

`apps/docs/content/docs/checkbox.mdx`:

```mdx
---
title: Checkbox
description: Ticks independent choices, including the mixed state.
---

import { CheckboxDemo } from "../../src/components/checkbox-demo";

## Usage

<CheckboxDemo client:load />

## Props

| Prop                         | Type                         | Description                                              |
| ---------------------------- | ---------------------------- | -------------------------------------------------------- |
| `checked` / `defaultChecked` | `boolean \| "indeterminate"` | The state; `"indeterminate"` marks a partly checked set. |
| `disabled`                   | `boolean`                    | Stops presses and dims the mark.                         |

Wrap the checkbox and its text in a `<label className="hashti-choice">` — the row is the 44px hit target, the mark is 18px. Styling lives in `@hashti/styles` under `.hashti-checkbox`, selected fill in focus blue.
```

`apps/docs/content/docs/meta.json` — `pages` becomes
`["index", "avatar", "button", "checkbox", "input", "label", "separator", "switch", "textarea"]`.

**Verify**: `bun run typecheck` → exit 0.

## Test plan

No test runner exists in this repo; none is added by this plan. Verification
is: typecheck gates, the greps in Step 2, and the reviewer's rendered check
(18px mark, 5px corners, checked fill in focus blue, glyph ink, 44px rows,
press scale, disabled row, indicator visibility toggling on press).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `bun run typecheck` exits 0 from the repo root
- [ ] `grep -rn "hashti-checkbox\|hashti-choice" packages/react/src packages/styles/src` shows the wrapper classes and the stylesheet selectors
- [ ] `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/checkbox.css` returns nothing
- [ ] `grep -n "checkbox" packages/styles/index.css apps/docs/content/docs/meta.json` shows the import and the page entry
- [ ] `git status --porcelain` lists no files outside the in-scope list
- [ ] Work committed on the worktree branch, one commit per step

## STOP conditions

Stop and report back (do not improvise) if:

- `Checkbox`/`CheckboxIndicator` is not exported from `@ui-sdk/react/checkbox`
  — quote the error.
- `--hashti-border-radius-mark` is missing from `design/tokens.css` — quote
  the grep output.
- A step's verification fails twice after a reasonable fix attempt.
- The fix appears to require touching an out-of-scope file.

## Maintenance notes

- `hashti-choice` is the shared choice-row recipe: Radio and Switch reuse it
  verbatim; changes here must be re-verified on all three pages.
- The invalid-checkbox recipe (error paint over selected fill) lands with the
  Field anatomy cycle.
- The indeterminate dash glyph is a consumer refinement, deferred.
